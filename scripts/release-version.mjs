// Computes the next release version for @stencil-community/router, writes it
// to the package's package.json and generates release notes from the
// conventional commits since the previous tag.
//
// Usage: node scripts/release-version.mjs --bump <type> [--preid beta] [--notes FILE]
//
//   <type>  auto | current | patch | minor | major |
//           prerelease | prepatch | preminor | premajor
//
//   auto     derives patch/minor/major from conventional commits
//   current  releases the version already in package.json, unchanged
//
// When run in GitHub Actions the result is also written to $GITHUB_OUTPUT.

import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import semver from "semver";

const BUMPS = [
  "auto",
  "current",
  "patch",
  "minor",
  "major",
  "prerelease",
  "prepatch",
  "preminor",
  "premajor",
];
const pkgPath = new URL("../packages/router/package.json", import.meta.url);

const { values: args } = parseArgs({
  options: {
    bump: { type: "string" },
    preid: { type: "string", default: "beta" },
    notes: { type: "string" },
  },
});

if (!BUMPS.includes(args.bump)) {
  fail(`--bump must be one of: ${BUMPS.join(", ")}`);
}

const git = (...a) => execFileSync("git", a, { encoding: "utf8" }).trim();

const previousTag = (() => {
  try {
    return git("describe", "--tags", "--abbrev=0", "--match", "v[0-9]*");
  } catch {
    return undefined;
  }
})();

const commits = git(
  "log",
  "--no-merges",
  "--format=%H%x1f%s%x1f%b%x1e",
  previousTag ? `${previousTag}..HEAD` : "HEAD",
)
  .split("\x1e")
  .map((c) => c.trim())
  .filter(Boolean)
  .map((c) => {
    const [hash, subject, body] = c.split("\x1f");
    const m = /^(?<type>\w+)(?:\((?<scope>[^)]*)\))?(?<bang>!)?: (?<desc>.+)$/.exec(subject);
    return {
      hash,
      subject,
      type: m?.groups.type,
      scope: m?.groups.scope,
      desc: m?.groups.desc ?? subject,
      breaking: !!m?.groups.bang || /^BREAKING[ -]CHANGE:/m.test(body ?? ""),
    };
  })
  .filter((c) => !(c.type === "chore" && c.scope === "release"));

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const currentVersion = pkg.version;

let bump = args.bump;
if (bump === "auto") {
  if (commits.some((c) => c.breaking)) bump = "major";
  else if (commits.some((c) => c.type === "feat")) bump = "minor";
  else if (commits.some((c) => c.type === "fix" || c.type === "perf")) bump = "patch";
  else
    fail(
      `No feat, fix, perf or breaking commits since ${previousTag ?? "the first commit"}; nothing to release.`,
    );
}

const version = bump === "current" ? currentVersion : semver.inc(currentVersion, bump, args.preid);
if (!version) fail(`Could not apply "${bump}" to ${currentVersion}`);

if (version !== currentVersion) {
  pkg.version = version;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

const prerelease = semver.prerelease(version) !== null;
const result = {
  version,
  tag: `v${version}`,
  prerelease,
  "dist-tag": prerelease ? "next" : "latest",
};

if (args.notes) writeFileSync(args.notes, releaseNotes());
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    Object.entries(result)
      .map(([k, v]) => `${k}=${v}\n`)
      .join(""),
  );
}
console.log(`${currentVersion} -> ${version} (${bump}, since ${previousTag ?? "first commit"})`);

function releaseNotes() {
  const { GITHUB_SERVER_URL: server, GITHUB_REPOSITORY: repo } = process.env;
  const line = (c) => {
    const ref =
      server && repo
        ? `[${c.hash.slice(0, 7)}](${server}/${repo}/commit/${c.hash})`
        : c.hash.slice(0, 7);
    return `- ${c.scope ? `**${c.scope}:** ` : ""}${c.desc} (${ref})`;
  };
  const sections = [
    ["Breaking changes", commits.filter((c) => c.breaking)],
    ["Features", commits.filter((c) => !c.breaking && c.type === "feat")],
    ["Fixes", commits.filter((c) => !c.breaking && (c.type === "fix" || c.type === "perf"))],
    [
      "Other changes",
      commits.filter((c) => !c.breaking && !["feat", "fix", "perf"].includes(c.type)),
    ],
  ];
  return sections
    .filter(([, list]) => list.length)
    .map(([title, list]) => `## ${title}\n\n${list.map(line).join("\n")}\n`)
    .join("\n");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
