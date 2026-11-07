// Downloads the public Excalidraw libraries and merges them into
// public/default-library.json so they ship inside the app.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const out = join("public", "default-library.json");
if (existsSync(out) && !process.argv.includes("--force")) {
  console.log("default-library.json exists, skipping (use --force to refresh)");
  process.exit(0);
}

const dir = join(tmpdir(), "excalidraw-libraries-" + process.pid);
execFileSync(
  "git",
  ["clone", "--depth", "1", "https://github.com/excalidraw/excalidraw-libraries", dir],
  { stdio: "inherit" },
);

function* walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (p.endsWith(".excalidrawlib")) yield p;
  }
}

const items = [];
const seen = new Set();
for (const file of walk(join(dir, "libraries"))) {
  let data;
  try {
    data = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    continue;
  }
  const name = file.split("/").pop().replace(".excalidrawlib", "");
  const list = data.libraryItems
    ? data.libraryItems
    : (data.library || []).map((elements, i) => ({
        id: `${name}-${i}`,
        status: "published",
        elements,
        created: 0,
      }));
  for (const item of list) {
    const id = item.id || `${name}-${items.length}`;
    if (seen.has(id)) continue;
    seen.add(id);
    items.push({ ...item, id });
  }
}

mkdirSync("public", { recursive: true });
writeFileSync(out, JSON.stringify(items));
rmSync(dir, { recursive: true, force: true });
console.log(`Wrote ${items.length} library items to ${out}`);
