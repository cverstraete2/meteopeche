import { copyFile, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = join(root, "dist");
const files = ["index.html", "styles.css", "app.js", "_headers"];

await rm(dist, { force: true, recursive: true });
await mkdir(dist, { recursive: true });

await Promise.all(files.map((file) => copyFile(join(root, file), join(dist, file))));
