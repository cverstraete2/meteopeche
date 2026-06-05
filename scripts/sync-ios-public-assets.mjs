import { cp, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const copies = [
  ["dist/vendor/tabler/fonts", "ios/App/App/public/vendor/tabler/fonts"],
  ["dist/vendor/leaflet/images", "ios/App/App/public/vendor/leaflet/images"],
];

await Promise.all(copies.map(async ([source, target]) => {
  await mkdir(target, { recursive: true });
  await cp(join(root, source), join(root, target), { recursive: true });
}));
