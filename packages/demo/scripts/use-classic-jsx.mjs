// Switches the demo from the automatic JSX runtime (`jsxImportSource`) to the
// classic `jsxFactory: "h"` setup, so CI can verify the router in both modes.
import { readFile, writeFile } from "node:fs/promises";
import { globSync } from "node:fs";

const tsconfigPath = new URL("../tsconfig.json", import.meta.url);
const tsconfig = JSON.parse(await readFile(tsconfigPath, "utf8"));
const { jsxImportSource: _, ...compilerOptions } = tsconfig.compilerOptions;
tsconfig.compilerOptions = {
  ...compilerOptions,
  jsx: "react",
  jsxFactory: "h",
  jsxFragmentFactory: "Fragment",
};
await writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2) + "\n");

const cwd = new URL("..", import.meta.url).pathname;
for (const file of globSync("src/**/*.tsx", { cwd })) {
  const path = new URL(`../${file}`, import.meta.url);
  const source = await readFile(path, "utf8");
  const updated = source.replace(
    /import \{ ([^}]*) \} from ['"]@stencil\/core['"];/,
    (_, names) => `import { ${names}, h } from "@stencil/core";`,
  );
  if (updated === source) throw new Error(`No @stencil/core import found in ${file}`);
  await writeFile(path, updated);
}
