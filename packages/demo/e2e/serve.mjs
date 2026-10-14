// Minimal static server for the prerendered `www` output: serves a
// prerendered `index.html` for a path when one exists, otherwise the root
// `index.html` so client-side routes still load. Missing assets (any path
// with an extension) are a 404. Lookups are case-sensitive on every OS, like
// a Linux host, so case mismatches fail locally as well as in CI.
import { createServer } from "node:http";
import { realpathSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = realpathSync.native(new URL("../www/", import.meta.url).pathname) + "/";
const port = Number(process.env.PORT ?? 4173);
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
};

const resolve = async (pathname) => {
  const file = normalize(join(root, decodeURIComponent(pathname)));
  if (!file.startsWith(root)) return null;
  for (const candidate of [file, join(file, "index.html")]) {
    try {
      // realpath.native returns the on-disk casing on case-insensitive filesystems
      if ((await stat(candidate)).isFile() && realpathSync.native(candidate) === candidate) {
        return candidate;
      }
    } catch {}
  }
  return null;
};

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");
  let file = await resolve(pathname);
  if (!file) {
    if (extname(pathname)) {
      res.writeHead(404).end();
      return;
    }
    file = join(root, "index.html");
  }
  res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
  res.end(await readFile(file));
}).listen(port, () => console.log(`serving ${root} on http://localhost:${port}`));
