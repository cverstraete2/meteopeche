import { copyFile, cp, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = join(root, "dist");
const localVendor = join(root, "vendor");
const files = ["index.html", "styles.css", "app.js", "mobile-runtime.js", "config.js", "_headers"];

await rm(dist, { force: true, recursive: true });
await rm(localVendor, { force: true, recursive: true });
await mkdir(dist, { recursive: true });

await Promise.all(files.map((file) => copyFile(join(root, file), join(dist, file))));
await writeGeneratedConfig(join(dist, "config.js"));

await Promise.all([copyVendor(join(dist, "vendor")), copyVendor(localVendor)]);

async function writeGeneratedConfig(target) {
  const apiBaseUrl = process.env.METEOPECHE_API_BASE_URL ?? "";
  const payload = JSON.stringify({ apiBaseUrl });
  await writeFile(target, `window.METEOPECHE_CONFIG = ${payload};\n`);
}

async function copyVendor(target) {
  await Promise.all([
    mkdir(join(target, "leaflet"), { recursive: true }),
    mkdir(join(target, "tabler"), { recursive: true }),
    mkdir(join(target, "tabler", "fonts"), { recursive: true }),
    mkdir(join(target, "capacitor"), { recursive: true }),
  ]);

  await Promise.all([
    copyFile(join(root, "node_modules", "leaflet", "dist", "leaflet.css"), join(target, "leaflet", "leaflet.css")),
    copyFile(join(root, "node_modules", "leaflet", "dist", "leaflet.js"), join(target, "leaflet", "leaflet.js")),
    copyFile(
      join(root, "node_modules", "@tabler", "icons-webfont", "dist", "tabler-icons.min.css"),
      join(target, "tabler", "tabler-icons.min.css"),
    ),
    copyFile(join(root, "node_modules", "@capacitor", "core", "dist", "capacitor.js"), join(target, "capacitor", "capacitor.js")),
    copyFile(join(root, "node_modules", "@capacitor", "status-bar", "dist", "plugin.js"), join(target, "capacitor", "status-bar.js")),
    copyFile(join(root, "node_modules", "@capacitor", "splash-screen", "dist", "plugin.js"), join(target, "capacitor", "splash-screen.js")),
    copyFile(join(root, "node_modules", "@tabler", "icons-webfont", "dist", "fonts", "tabler-icons.woff2"), join(target, "tabler", "fonts", "tabler-icons.woff2")),
    copyFile(join(root, "node_modules", "@tabler", "icons-webfont", "dist", "fonts", "tabler-icons.woff"), join(target, "tabler", "fonts", "tabler-icons.woff")),
    copyFile(join(root, "node_modules", "@tabler", "icons-webfont", "dist", "fonts", "tabler-icons.ttf"), join(target, "tabler", "fonts", "tabler-icons.ttf")),
  ]);

  await cp(join(root, "node_modules", "leaflet", "dist", "images"), join(target, "leaflet", "images"), { recursive: true });
}
