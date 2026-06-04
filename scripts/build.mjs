import { copyFile, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = join(root, "dist");
const localVendor = join(root, "vendor");
const files = ["index.html", "privacy.html", "styles.css", "app.js", "spots-db.js", "overpass-spots.js", "mobile-runtime.js", "config.js", "manifest.webmanifest", "sw.js", "_headers"];
const defaultApiBaseUrl = "https://meteopeche-copernicus-977572434171.europe-west1.run.app";
const validMapProviderIds = new Set(["leaflet-openmap", "apple-web", "apple-native", "google-web", "google-native"]);

await rm(dist, { force: true, recursive: true });
await rm(localVendor, { force: true, recursive: true });
await mkdir(dist, { recursive: true });

await Promise.all(files.map((file) => copyFile(join(root, file), join(dist, file))));
await cp(join(root, "assets"), join(dist, "assets"), { recursive: true });
await writeGeneratedConfig(join(dist, "config.js"));

await Promise.all([copyVendor(join(dist, "vendor")), copyVendor(localVendor)]);

async function writeGeneratedConfig(target) {
  const apiBaseUrl = process.env.METEOPECHE_API_BASE_URL ?? defaultApiBaseUrl;
  const googleMapsApiKey = process.env.METEOPECHE_GOOGLE_MAPS_API_KEY ?? "";
  const enableGoogleMapsWeb = parseBooleanEnv(process.env.METEOPECHE_ENABLE_GOOGLE_MAPS_WEB);
  const appleMapKitToken = process.env.METEOPECHE_APPLE_MAPKIT_TOKEN ?? "";
  const appleMapKitTokenUrl = process.env.METEOPECHE_APPLE_MAPKIT_TOKEN_URL ?? "";
  const enableAppleMapsWeb = parseBooleanEnv(process.env.METEOPECHE_ENABLE_APPLE_MAPS_WEB);
  const experimentalMapProviders = parseListEnv(process.env.METEOPECHE_EXPERIMENTAL_MAP_PROVIDERS)
    .filter((provider) => validMapProviderIds.has(provider));
  const payload = JSON.stringify({
    apiBaseUrl,
    enableGoogleMapsWeb,
    googleMapsApiKey,
    enableAppleMapsWeb,
    appleMapKitToken,
    appleMapKitTokenUrl,
    experimentalMapProviders,
  });
  await writeFile(target, `window.METEOPECHE_CONFIG = ${payload};\n`);
}

function parseBooleanEnv(value) {
  return ["1", "true", "yes", "on"].includes(String(value ?? "").trim().toLowerCase());
}

function parseListEnv(value) {
  return String(value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
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
    copyFile(join(root, "node_modules", "@capacitor", "geolocation", "dist", "plugin.js"), join(target, "capacitor", "geolocation.js")),
    copyFile(join(root, "node_modules", "@capacitor", "camera", "dist", "plugin.js"), join(target, "capacitor", "camera.js")),
    copyFile(join(root, "node_modules", "@capacitor", "network", "dist", "plugin.js"), join(target, "capacitor", "network.js")),
    copyFile(join(root, "node_modules", "@capacitor", "local-notifications", "dist", "plugin.js"), join(target, "capacitor", "local-notifications.js")),
    copyFile(join(root, "node_modules", "@tabler", "icons-webfont", "dist", "fonts", "tabler-icons.woff2"), join(target, "tabler", "fonts", "tabler-icons.woff2")),
    copyFile(join(root, "node_modules", "@tabler", "icons-webfont", "dist", "fonts", "tabler-icons.woff"), join(target, "tabler", "fonts", "tabler-icons.woff")),
    copyFile(join(root, "node_modules", "@tabler", "icons-webfont", "dist", "fonts", "tabler-icons.ttf"), join(target, "tabler", "fonts", "tabler-icons.ttf")),
  ]);

  await patchGeolocationPlugin(join(target, "capacitor", "geolocation.js"));
  await cp(join(root, "node_modules", "leaflet", "dist", "images"), join(target, "leaflet", "images"), { recursive: true });
}

async function patchGeolocationPlugin(target) {
  const source = await readFile(target, "utf8");
  const patched = source
    .replace("    synapse.exposeSynapse();", "    if (synapse?.exposeSynapse) {\n        synapse.exposeSynapse();\n    }")
    .replace("})({}, capacitorExports, synapse);", "})({}, capacitorExports, typeof synapse !== 'undefined' ? synapse : null);");
  await writeFile(target, patched);
}
