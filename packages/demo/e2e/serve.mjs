// Minimal static server for the prerendered `www` output: serves a
// prerendered `index.html` for a path when one exists, otherwise the root
// `index.html` so client-side routes still load.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = new URL("../www/", import.meta.url).pathname;
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
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {}
  }
  return null;
};

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");
  const file = (await resolve(pathname)) ?? join(root, "index.html");
  res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
  res.end(await readFile(file));
}).listen(port, () => console.log(`serving ${root} on http://localhost:${port}`));
