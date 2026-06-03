import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const configPath = join(root, "ios", "App", "App", "public", "config.js");
const source = await readFile(configPath, "utf8");
const match = source.match(/window\.METEOPECHE_CONFIG\s*=\s*(\{.*\});?\s*$/s);

if (!match) {
  throw new Error(`Unable to parse ${configPath}`);
}

const config = JSON.parse(match[1]);
const providers = new Set(config.experimentalMapProviders ?? []);
providers.add("apple-native");

const nextConfig = {
  ...config,
  experimentalMapProviders: [...providers],
};

await writeFile(configPath, `window.METEOPECHE_CONFIG = ${JSON.stringify(nextConfig)};\n`);
