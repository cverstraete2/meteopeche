import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT ?? process.argv[2] ?? 8080);
const host = "127.0.0.1";
const pythonPath = existsSync(join(root, ".venv", "bin", "python3")) ? join(root, ".venv", "bin", "python3") : "python3";
const maxDepthWindowHours = 24 * 8;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

  if (url.pathname === "/api/depth-current") {
    await handleDepthCurrent(url, response);
    return;
  }

  await serveStatic(url.pathname, response);
});

server.listen(port, host, () => {
  console.log(`MeteoCatch: http://${host}:${port}`);
});

async function handleDepthCurrent(url, response) {
  const payload = {
    latitude: readNumber(url, "latitude"),
    longitude: readNumber(url, "longitude"),
    depth: readNumber(url, "depth"),
    start: url.searchParams.get("start"),
    end: url.searchParams.get("end"),
  };

  if (!isFiniteNumber(payload.latitude) || !isFiniteNumber(payload.longitude) || !isFiniteNumber(payload.depth) || !payload.start || !payload.end) {
    sendJson(response, 400, { ok: false, error: "Paramètres Copernicus incomplets." });
    return;
  }

  const dateError = validateDepthWindow(payload.start, payload.end);
  if (dateError) {
    sendJson(response, 400, { ok: false, error: dateError });
    return;
  }

  try {
    const script = join(root, "scripts", "copernicus_depth.py");
    const { stdout } = await execFileAsync(pythonPath, [script, JSON.stringify(payload)], {
      cwd: root,
      timeout: 90000,
      maxBuffer: 1024 * 1024 * 5,
    });
    const result = JSON.parse(stdout);
    sendJson(response, result.ok ? 200 : 503, result);
  } catch (error) {
    console.error("Copernicus depth request failed", error);
    sendJson(response, 503, {
      ok: false,
      error: "Impossible de récupérer Copernicus Marine.",
    });
  }
}

async function serveStatic(pathname, response) {
  const cleanPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = normalize(join(root, cleanPath));

  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    sendText(response, 404, "Not found");
    return;
  }

  const body = await readFile(filePath);
  response.writeHead(200, {
    "Content-Type": mimeTypes[extname(filePath)] ?? "application/octet-stream",
    "Cache-Control": "no-store",
  });
  response.end(body);
}

function readNumber(url, key) {
  const value = Number(url.searchParams.get(key));
  return Number.isFinite(value) ? value : null;
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, status, text) {
  response.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(text);
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function validateDepthWindow(start, end) {
  const startDate = parseApiDate(start);
  const endDate = parseApiDate(end);
  if (!startDate || !endDate) return "Dates Copernicus invalides.";
  if (endDate <= startDate) return "La fin Copernicus doit suivre le début.";
  if ((endDate - startDate) / 36e5 > maxDepthWindowHours) return "Fenêtre Copernicus trop large.";
  return "";
}

function parseApiDate(value) {
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time) : null;
}
