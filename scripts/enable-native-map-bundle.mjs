import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const bundleConfigs = {
  ios: {
    provider: "apple-native",
    path: join(root, "ios", "App", "App", "public", "config.js"),
  },
  android: {
    provider: "google-native",
    path: join(root, "android", "app", "src", "main", "assets", "public", "config.js"),
  },
};

const requestedTargets = normalizeTargets(process.argv.slice(2));

for (const target of requestedTargets) {
  await enableBundleProvider(target);
}

function normalizeTargets(args) {
  const values = args.flatMap((arg) => String(arg ?? "").split(",")).map((arg) => arg.trim()).filter(Boolean);
  const targets = values.length ? values : ["ios"];
  if (targets.includes("all")) return Object.keys(bundleConfigs);

  const unknownTargets = targets.filter((target) => !bundleConfigs[target]);
  if (unknownTargets.length) {
    throw new Error(`Unknown native map bundle target: ${unknownTargets.join(", ")}`);
  }

  return [...new Set(targets)];
}

async function enableBundleProvider(target) {
  const bundleConfig = bundleConfigs[target];
  const source = await readFile(bundleConfig.path, "utf8");
  const match = source.match(/window\.METEOPECHE_CONFIG\s*=\s*(\{.*\});?\s*$/s);

  if (!match) {
    throw new Error(`Unable to parse ${bundleConfig.path}`);
  }

  const config = JSON.parse(match[1]);
  const providers = new Set(config.experimentalMapProviders ?? []);
  providers.add(bundleConfig.provider);

  const nextConfig = {
    ...config,
    experimentalMapProviders: [...providers],
  };

  await writeFile(bundleConfig.path, `window.METEOPECHE_CONFIG = ${JSON.stringify(nextConfig)};\n`);
  console.log(`Enabled ${bundleConfig.provider} in ${relative(root, bundleConfig.path)}`);

  if (target === "android" && !androidMapsApiKeyConfigured()) {
    console.warn("METEOPECHE_GOOGLE_MAPS_ANDROID_API_KEY is not set; Android will fall back to Leaflet until the native Maps SDK key is provided.");
  }
}

function androidMapsApiKeyConfigured() {
  return Boolean(
    String(process.env.METEOPECHE_GOOGLE_MAPS_ANDROID_API_KEY ?? "").trim()
    || String(process.env.GOOGLE_MAPS_ANDROID_API_KEY ?? "").trim()
  );
}
