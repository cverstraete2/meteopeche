const CACHE_NAME = "meteocatch-shell-20260605-today-depth-mode-persistent";
const APP_SHELL = [
  "./",
  "./index.html",
  "./privacy.html",
  "./styles.css",
  "./app.js",
  "./spots-db.js",
  "./overpass-spots.js",
  "./mobile-runtime.js",
  "./config.js",
  "./manifest.webmanifest",
  "./assets/meteocatch-logo-v2.png",
  "./assets/icons/icon-192-v2.png",
  "./assets/icons/icon-512-v2.png",
  "./assets/icons/apple-touch-icon-v2.png",
  "./vendor/leaflet/leaflet.css",
  "./vendor/leaflet/leaflet.js",
  "./vendor/tabler/tabler-icons.min.css",
  "./vendor/tabler/fonts/tabler-icons.woff2",
  "./vendor/tabler/fonts/tabler-icons.woff",
  "./vendor/tabler/fonts/tabler-icons.ttf",
  "./vendor/leaflet/images/marker-icon.png",
  "./vendor/leaflet/images/marker-icon-2x.png",
  "./vendor/leaflet/images/marker-shadow.png",
  "./vendor/capacitor/capacitor.js",
  "./vendor/capacitor/status-bar.js",
  "./vendor/capacitor/splash-screen.js",
  "./vendor/capacitor/geolocation.js",
  "./vendor/capacitor/camera.js",
  "./vendor/capacitor/network.js",
  "./vendor/capacitor/local-notifications.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, "./index.html"));
    return;
  }

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, fallbackUrl) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return caches.match(request)
      .then((cached) => cached ?? (fallbackUrl ? caches.match(fallbackUrl) : null))
      .then((fallback) => fallback ?? new Response("", { status: 503, statusText: "Offline" }));
  }
}
