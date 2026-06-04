# MeteoCatch 🎣

> Mobile-first fishing forecast app for choosing spots, reading marine and river conditions, tracking fish activity, and logging catches.

[![Live demo](https://img.shields.io/badge/live-demo-00a896)](https://meteopeche.pages.dev/)
![License](https://img.shields.io/badge/license-not%20specified-lightgrey)
![Built with](https://img.shields.io/badge/built%20with-Vanilla%20JS%20%2B%20Capacitor-0058cc)

## Overview

MeteoCatch is a mobile-first fishing conditions dashboard for sea and freshwater anglers. It combines spot selection, map discovery, weather, marine forecasts, river discharge, fish activity scoring, tides, solar and lunar timing, rigging guidance, and a local catch journal in one browser-based app that can also be packaged with Capacitor for iOS and Android.

The app is intentionally lightweight: the frontend is plain HTML, CSS, and JavaScript, while optional backend services provide Copernicus depth-current data, global spot search, nearby water discovery, and river forecasts.

## Features

### Map

- [x] Full-screen Leaflet map with OpenStreetMap base tiles.
- [x] Active spot overlay with coordinates, detected water context, GPS location, edit controls, and favorite toggle.
- [x] Manual coordinate entry and named custom spot creation.
- [x] Global spot search through the backend search endpoint.
- [x] Nearby water discovery through the backend nearby-spots endpoint.
- [x] Static spot presets and a static global spots database loaded from `spots-db.js`.
- [x] Dynamic OpenStreetMap fishing spot discovery through Overpass for the current viewport.
- [x] Progressive map pins by zoom level, including database spots, favorites, discovery results, and OSM spots.
- [x] Source-specific pin styling for favorites, OSM named spots, OSM unnamed spots, known spots, and the active spot.
- [x] Map layers for nautical marks, coastline and sea names, known fishing spots, EMODnet bathymetry, sensitive areas, and marine condition overlays.
- [x] Marine overlay modes for surface current, depth current, and wave conditions.
- [x] Fish filter controls for known fishing spots.
- [x] Favorites overlay and sensitive-area overlay.
- [x] Anchor watch with drift tracking, alert tone, and optional local notification.
- [x] Map zoom, recenter/fullscreen, scale, attribution, drag, wheel zoom, and touch pinch handling.

### Activity

- [x] Species selector for sea and freshwater catalogs.
- [x] Fish activity score based on weather, light, solunar windows, species preferences, current, wave, and temperature inputs.
- [x] Activity reasons for the selected fish and hour.
- [x] Hourly activity chart with highlighted selected time.
- [x] Major and minor solunar window summaries.

### Weather

- [x] Sticky six-day forecast strip with selected-day state and go/maybe/no-go tone.
- [x] Day timeline selector with 15-minute precision.
- [x] Weather subviews for quick decision, compass/forces, sun, and tides.
- [x] Quick decision block with air temperature, sea surface temperature, thermal-front signal, pressure, clouds, precipitation, wind, wave, current, depth, and river signals where available.
- [x] Compass visualization for wind, surface current, depth current, wave, and swell at the selected time and target depth.
- [x] Hour-by-hour force table for wind, gusts, surface current, depth current, wave, and swell.
- [x] Atmosphere chart that switches between cloud cover and barometer views.
- [x] Daily condition scoring with green, yellow, orange, and red visual tones.
- [x] Weather fallback from Open-Meteo Forecast to MET Norway when needed.
- [x] Sea-mode marine forecast from Open-Meteo Marine.
- [x] Freshwater-mode river forecast from the backend GloFAS/Open-Meteo Flood integration.
- [x] Optional Copernicus depth-current enrichment through the backend.

### Tides

- [x] Tide-height chart based on sea-level forecast data.
- [x] Tide event detection for high and low extrema.
- [x] Tide summary cards and focused selected-time tide trend.

### Sun

- [x] Solar and lunar chart.
- [x] Moon phase, distance, illumination, age, rise, and set display.
- [x] Sunrise, sunset, dawn, dusk, day length, night length, noon, and midnight display.
- [x] Solunar window grid used by the activity score.

### Rigging

- [x] Rigging calculator with sea and freshwater technique profiles.
- [x] Autofill from current forecast conditions.
- [x] Recommended starting weight, range, and advice.

### Journal

- [x] Local catch log stored in browser storage.
- [x] Species, length, weight, notes, spot, and weather snapshot per catch.
- [x] Photo capture or upload through Capacitor Camera when native, with file-input fallback on web.
- [x] Client-side image resizing before storage.
- [x] Delete action for saved catch entries.

### Preferences

- [x] Sea/freshwater mode.
- [x] Light and dark theme.
- [x] Language support for French, English, Spanish, German, and Portuguese.
- [x] User profile controls for level, fishing approach, and priority.
- [x] Preferred species and target depth.
- [x] Native app status for GPS, notifications, offline cache, data source health, global spot analysis, and privacy acceptance.
- [x] Onboarding review entry point.

### Native / PWA

- [x] App splash overlay with logo and app name.
- [x] Onboarding dialog for GPS, notifications, photo log, offline mode, and privacy.
- [x] Service worker app-shell cache for offline access.
- [x] Web manifest with standalone display and app icons.
- [x] Capacitor configuration for iOS and Android packaging.
- [x] Native status bar and splash-screen integration.
- [x] Native geolocation, camera, network, and local notifications where available.

## Screenshots

<!-- Screenshots go here — leave placeholder -->
> _Screenshots coming soon_

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, and JavaScript in `index.html`, `styles.css`, and `app.js`.
- **Runtime/build:** Node.js scripts with ES modules; no bundler is used.
- **Known-good Node.js:** GitHub Actions builds with Node.js 22.
- **Maps:** Leaflet `^1.9.4` remains the default OpenStreetMap provider. The provider branch also includes default-off Apple MapKit JS, Google Maps JavaScript, and native bridge scaffolds for platform-specific map experiments while preserving OpenSeaMap seamarks and EMODnet WMS overlays.
- **Icons:** Tabler Icons webfont `^3.44.0` plus app PNG assets.
- **Fonts:** Google Fonts: Barlow Condensed, DM Sans, Fira Code, and Montserrat.
- **PWA:** Web manifest and service worker app-shell cache.
- **Mobile:** Capacitor `^8.x` with iOS and Android projects.
- **Backend:** FastAPI, Uvicorn, Copernicus Marine Python client, pandas, and cftime.
- **Hosting:** Cloudflare Pages for the static frontend; Google Cloud Run-compatible Dockerfile for the backend.
- **CI:** GitHub Actions workflow that runs the static build on Node.js 22.

## Data Sources

| Source | Data | Endpoint | Free tier |
| --- | --- | --- | --- |
| Open-Meteo Forecast | Air temperature, wind, gusts, pressure, cloud cover, precipitation, sunrise, sunset | `https://api.open-meteo.com/v1/forecast` | Public API with usage limits |
| Open-Meteo Forecast fallback | Same weather payload as the primary Open-Meteo forecast endpoint | `https://forecast-api.open-meteo.com/v1/forecast` | Public API with usage limits |
| MET Norway Locationforecast | Weather fallback: temperature, wind, gusts, pressure, cloud cover, precipitation | `https://api.met.no/weatherapi/locationforecast/2.0/compact` | Public API with usage policy |
| Open-Meteo Marine | Wave height, wave direction, wave period, swell, surface current, sea surface temperature, sea level | `https://marine-api.open-meteo.com/v1/marine` | Public API with usage limits |
| Open-Meteo Flood / GloFAS | River discharge, mean, minimum, and maximum discharge | `https://flood-api.open-meteo.com/v1/flood` through the backend | Public API with usage limits |
| Copernicus Marine | Depth-specific current vectors from IBI, MED, and global datasets | `copernicusmarine.read_dataframe()` in `backend/copernicus_depth.py` | Requires Copernicus Marine credentials |
| EMODnet Bathymetry WMS | Coastlines, sea names, and bathymetry contours | `https://ows.emodnet-bathymetry.eu/wms` | Public service with usage policy |
| EMODnet Bathymetry REST | Point depth near the map focus | `https://rest.emodnet-bathymetry.eu/depth/point` | Public service with usage policy |
| OpenStreetMap tiles | Base map tiles | `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` | Public tile usage policy |
| OpenSeaMap | Seamark overlay tiles | `https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png` | Public tile usage policy |
| OpenStreetMap Nominatim | Global search and reverse geocoding through the backend | `https://nominatim.openstreetmap.org/search`, `https://nominatim.openstreetmap.org/reverse` | Public service with usage policy |
| Overpass API | Viewport fishing spots and nearby water features | `https://overpass-api.de/api/interpreter` | Public service with rate limits |
| MeteoCatch backend | Spot resolution, spot search, nearby spots, river forecast, depth current | `https://meteopeche-copernicus-977572434171.europe-west1.run.app/api/*` | Project-owned service |

## Getting Started

### Prerequisites

- Node.js 22 is the known-good version used by the GitHub Actions build.
- No exact Node.js engine is declared in `package.json`, and no `.nvmrc` is present.
- npm is required for dependency installation and scripts.
- Docker is optional for running the backend container.
- Python 3.12 is used by the root Dockerfile for the backend image.

### Installation

```bash
git clone https://github.com/cverstraete2/meteopeche.git
cd meteopeche
npm install
npm run build
```

### Running locally

```bash
npm run build
node server.mjs
```

`npm run build` recreates `dist/`, copies the static app files, copies `assets/`, generates `dist/config.js`, and copies vendored Leaflet, Tabler Icons, and Capacitor browser plugin files into both `dist/vendor/` and the root `vendor/` folder.

`node server.mjs` starts a static local server at `http://127.0.0.1:8080`. It also exposes `/api/depth-current` locally by running `scripts/copernicus_depth.py` when Copernicus dependencies and credentials are configured.

To use another port:

```bash
node server.mjs 8090
```

### Available scripts

| Script | What it does |
| --- | --- |
| `npm run build` | Builds the static app into `dist/` and refreshes vendored assets. |
| `npm run map-provider:validate` | Validates provider ids, default-off config, bridge/debug contracts, asset cache versioning, and generated web/iOS/Android bundle propagation. |
| `npm run deploy` | Builds and deploys `dist/` to Cloudflare Pages project `meteopeche` on branch `main`. |
| `npm run mobile:sync` | Builds the web app and runs `npx cap sync`. |
| `npm run mobile:sync:native` | Builds and syncs both mobile apps, then enables `apple-native` for iOS and `google-native` for Android in the generated native bundles. |
| `npm run mobile:sync:ios-native` | Builds and syncs iOS, then enables the generated Xcode bundle to use `apple-native`. |
| `npm run mobile:sync:android-native` | Builds and syncs Android, then enables the generated Android bundle to use `google-native`. |
| `npm run mobile:add:ios` | Builds the web app and adds an iOS Capacitor project. |
| `npm run mobile:add:android` | Builds the web app and adds an Android Capacitor project. |
| `npm run mobile:open:ios` | Opens the iOS project with Capacitor. |
| `npm run mobile:open:android` | Opens the Android project with Capacitor. |

### Copernicus Marine (optional)

Copernicus Marine is used only for real depth-specific current data. Without it, the app still loads weather, marine surface data, river data, tides, activity scores, and map features; the data status panel marks Copernicus depth current as unavailable.

The backend expects Copernicus Marine credentials through the Copernicus Marine Python client environment:

```bash
COPERNICUSMARINE_SERVICE_USERNAME=your-username
COPERNICUSMARINE_SERVICE_PASSWORD=your-password
```

For local backend support:

```bash
python3 -m venv .venv
. .venv/bin/activate
python3 -m pip install -r requirements.txt
node server.mjs
```

For the FastAPI backend, install `backend/requirements.txt` and run:

```bash
uvicorn backend.main:app --host 127.0.0.1 --port 8787
```

Then rebuild the frontend with the backend URL:

```bash
METEOPECHE_API_BASE_URL=http://127.0.0.1:8787 npm run build
```

## Mobile (Capacitor)

Capacitor is configured in `capacitor.config.json`.

- **App ID:** `com.meteocatch.app`
- **App name:** `MeteoCatch`
- **Web directory:** `dist`
- **Android scheme:** `https`

Build and sync native platforms:

```bash
npm run mobile:sync
```

Create native projects if needed:

```bash
npm run mobile:add:ios
npm run mobile:add:android
```

Open native projects:

```bash
npm run mobile:open:ios
npm run mobile:open:android
```

## Project Structure

```text
meteopeche/
├── .github/                  → GitHub Actions workflow and issue templates.
├── android/                  → Capacitor Android project.
├── assets/                   → App logo and icon PNG assets.
├── backend/                  → FastAPI backend for Copernicus, spot resolution, search, nearby water, and river forecast.
├── ios/                      → Capacitor iOS project.
├── scripts/                  → Build script and local Copernicus bridge script.
├── Dockerfile                → Root Cloud Run-compatible backend image.
├── _headers                  → Cloudflare Pages cache-control headers.
├── app.js                    → Core app logic, state, API calls, maps, charts, native hooks, and rendering.
├── capacitor.config.json     → Capacitor app ID, app name, web directory, and Android scheme.
├── config.js                 → Frontend API base URL configuration.
├── index.html                → Main app shell, tabs, panels, forms, canvases, onboarding, and templates.
├── manifest.webmanifest      → PWA manifest and app icons.
├── mobile-runtime.js         → Native shell helpers for Capacitor status bar and splash screen.
├── overpass-spots.js         → Browser-side Overpass viewport fishing spot loader.
├── package.json              → npm scripts and frontend/mobile dependencies.
├── privacy.html              → Privacy policy page.
├── requirements.txt          → Minimal local Copernicus Python dependencies.
├── server.mjs                → Local static server plus local `/api/depth-current` bridge.
├── spots-db.js               → Static global fishing spot database used by progressive map pins.
├── styles.css                → Design tokens, light/dark themes, responsive layout, and components.
├── sw.js                     → Service worker app-shell cache.
└── wrangler.toml             → Cloudflare Pages project configuration.
```

## Architecture

### Data Flow

The user selects a spot from presets, global search, nearby discovery, map click, OSM pin, or favorite. The selected coordinates are written into the active state and saved to local storage. `loadForecast()` resolves the spot context, requests weather, marine, and river payloads, merges hourly data, builds daily summaries, optionally enriches sea-mode data with Copernicus depth currents, then calls `renderAll()` to update the visible tabs, charts, map layers, and data status.

For map discovery, normalized map-provider `moveend` and `zoomend` events update map state, refresh progressive pin visibility, and trigger Overpass viewport loading when zoom is high enough and the map has moved far enough from the last fetched bounds.

### Store / State

State is held in the in-memory `state` object in `app.js`. Persistent data is stored in `localStorage` under `meteo-peche-store-v1` with this normalized shape:

```text
{ version, settings, favorites, catchLog }
```

The app can migrate older `meteo-peche-favorites` and `meteo-peche-settings` keys into the current store. Settings include water mode, active mobile view, weather subview, selected spot, target depth, map layer toggles, fish filters, activity species, theme, language, profile, onboarding completion, privacy acceptance, and notification preference.

### Theme System

`styles.css` defines shared design tokens in `:root` and theme-specific variables under `[data-theme="light"]` and `[data-theme="dark"]`. `applyTheme()` writes `document.documentElement.dataset.theme` and `color-scheme`, allowing the entire UI and canvases to read colors from CSS variables such as `--bg`, `--bg-card`, `--text-1`, `--accent`, `--chart-wind`, `--chart-current`, `--brand-meteo`, and `--brand-catch`.

## API Reference (internal)

| Function | Purpose | Key parameters |
| --- | --- | --- |
| `init()` | Bootstraps state, UI controls, map engine, native shell, translations, onboarding, and first forecast load. | None |
| `initMapEngine()` | Resolves the active map provider, creates the map, base tiles, overlays, layers, and normalized map event listeners. | None |
| `restoreState()` | Restores saved settings from local storage into the runtime state and form controls. | None |
| `applyTheme()` | Applies the selected light or dark theme to the document. | `options.render` |
| `setupI18nObserver()` | Watches DOM changes and reapplies translations. | None |
| `applyTranslations()` | Translates text and selected attributes using the in-app translation table. | `root` |
| `setLanguagePreference()` | Updates the selected language, document language, persisted settings, and rendered UI. | `language` |
| `initNativeAppShell()` | Initializes native platform status, offline support, and permissions. | None |
| `initOfflineSupport()` | Registers the service worker and monitors online/offline state. | None |
| `requestGpsPermission()` | Requests GPS permission through Capacitor or browser geolocation. | None |
| `getCurrentPosition()` | Reads current device/browser position. | None |
| `requestNotificationPermission()` | Requests notification permission and sends a test notification when enabled. | None |
| `showOnboarding()` | Displays the onboarding dialog. | `options.force` |
| `completeOnboarding()` | Persists onboarding completion and optional privacy acceptance. | `options.privacyAccepted` |
| `setWaterMode()` | Switches between sea and freshwater mode and refreshes dependent UI. | `mode`, `options.load` |
| `setMobileView()` | Changes the active mobile tab. | `view` |
| `setWeatherSubtab()` | Changes the active weather subview. | `tab` |
| `setMarineOverlayMode()` | Changes the active marine condition overlay. | `mode` |
| `setMapLayerOpen()` | Opens or closes the map layer sheet. | `open` |
| `setFavoritesOverlayOpen()` | Opens or closes the map favorites overlay. | `open` |
| `showToast()` | Displays a temporary non-blocking toast. | `message`, `options` |
| `selectSpot()` | Selects a preset spot. | `index`, `options.load` |
| `selectProviderMapPoint()` | Handles normalized map-provider point selection. | `event` |
| `setCustomSpot()` | Applies custom coordinates to the active custom spot. | `lat`, `lon`, `options` |
| `openSpotNameSheet()` | Opens the spot naming sheet for a pending custom point. | `lat`, `lon` |
| `confirmPendingSpot()` | Confirms a pending custom point and optionally saves it as a favorite. | `options.favorite` |
| `resolveSpotContext()` | Calls the backend spot resolver and applies detected water mode. | `lat`, `lon` |
| `searchSpotLocations()` | Runs global spot search through the backend. | None |
| `loadNearbySpots()` | Loads nearby water/spot suggestions through the backend. | None |
| `loadForecast()` | Main forecast pipeline for selected coordinates. | None |
| `loadWeatherPayload()` | Loads weather forecast with Open-Meteo and MET Norway fallback. | `lat`, `lon` |
| `loadMarinePayload()` | Loads Open-Meteo Marine data in sea mode. | `lat`, `lon` |
| `loadRiverForecast()` | Loads river discharge data in freshwater mode. | `lat`, `lon` |
| `loadRealDepthCurrents()` | Requests Copernicus depth-current data through the backend. | `lat`, `lon` |
| `buildAppApiUrl()` | Builds backend URLs from generated or default API base configuration. | `path` |
| `mergeHourlyData()` | Merges weather and marine hourly payloads into normalized rows. | `weather`, `marine` |
| `buildDailySummaries()` | Groups hourly rows into daily forecast summaries. | `hours` |
| `renderAll()` | Updates all major UI sections after state changes. | None |
| `renderDayTabs()` | Renders the six-day forecast strip. | None |
| `renderDayTimeline()` | Renders the selected-day time slider and label. | `day` |
| `renderActivity()` | Renders activity score, reasons, chart, and solunar windows. | `day` |
| `renderConditionBrief()` | Renders the quick-decision block. | `day` |
| `renderMetrics()` | Renders metric cards for the selected day. | `day` |
| `renderWaterInsights()` | Renders sea or river data insights. | `day` |
| `renderTides()` | Renders tide chart, summary, and event list. | `day` |
| `renderAstro()` | Renders sun, moon, and solunar information. | `day` |
| `drawCompass()` | Draws the wind/current/wave/swell compass canvas. | None |
| `renderChart()` | Renders the hourly forces chart. | None |
| `renderAtmosphereChart()` | Renders cloud or pressure chart. | None |
| `renderRiggingCalculator()` | Renders rigging calculator inputs and recommendation. | `day` |
| `updateRiggingRecommendation()` | Calculates and displays rigging weight advice. | None |
| `filterPinsByZoom()` | Returns map pins visible at a given zoom level. | `zoomLevel` |
| `scheduleOverpassSpotFetch()` | Debounces and rate-limits Overpass viewport loading. | `options.force` |
| `fetchOverpassSpotsForCurrentBounds()` | Fetches dynamic OSM fishing spots for the current provider map bounds. | None |
| `cacheOsmSpots()` | Adds normalized OSM spots to the LRU-style cache. | `spotsList` |
| `getMapPinCatalog()` | Builds the unified pin list from database, OSM, presets, known spots, discovery results, and favorites. | None |
| `renderMapPins()` | Creates or updates provider map pin markers without recreating all markers. | None |
| `updateMapPinVisibility()` | Shows or hides map pins by zoom using provider marker visibility or opacity. | None |
| `selectMapPin()` | Selects a database, OSM, favorite, preset, known, or discovery pin as the active spot. | `pin` |
| `toggleFavorite()` | Adds or removes the active spot from favorites. | None |
| `renderFavorites()` | Renders the favorites list and rename/remove controls. | None |
| `selectFavorite()` | Selects a saved favorite as the active spot. | `favorite` |
| `toggleAnchorWatch()` | Starts or stops anchor drift monitoring. | None |
| `handleAnchorPosition()` | Updates anchor watch drift from GPS positions. | `position` |
| `sendAnchorNotification()` | Sends a local notification for anchor drift where available. | None |
| `pickCatchPhoto()` | Opens native camera or web file picker for catch photos. | None |
| `addCatchPhotoFromDataUrl()` | Adds and resizes a catch photo for local storage. | `dataUrl`, `name` |
| `createCatchLogEntry()` | Builds a normalized catch entry with spot and weather snapshot. | `input` |
| `saveCatchLogEntry()` | Persists a catch log entry in local storage. | `entry` |
| `deleteCatchLogEntry()` | Removes a catch log entry. | `id` |
| `readAppStore()` | Reads and normalizes the local storage app store. | None |
| `updateAppStore()` | Mutates, normalizes, and persists the app store. | `mutator` |
| `normalizeStore()` | Normalizes stored settings, favorites, and catch log entries. | `store` |

## Deployment

### Cloudflare Pages (current)

```bash
npm run deploy
```

The deploy script runs the build pipeline, then uploads `dist/` to Cloudflare Pages using Wrangler:

```text
npm run build && npx wrangler pages deploy dist --project-name meteopeche --branch main
```

`wrangler.toml` sets the Pages project name to `meteopeche`, the output directory to `dist`, and the compatibility date to `2026-05-25`.

### Backend deployment

The root `Dockerfile` builds a Python 3.12 FastAPI image that serves `backend.main:app` with Uvicorn on the `$PORT` provided by the host. The same backend exposes:

- `/health`
- `/api/depth-current`
- `/api/spot-resolve`
- `/api/spot-search`
- `/api/nearby-spots`
- `/api/river-forecast`

### Environment variables

| Variable | Used by | Required | Purpose |
| --- | --- | --- | --- |
| `METEOPECHE_API_BASE_URL` | `scripts/build.mjs` | Optional | Overrides the frontend backend base URL written to `dist/config.js`. |
| `METEOPECHE_ENABLE_GOOGLE_MAPS_WEB` | `scripts/build.mjs` | Optional | Enables the Google Maps web provider config flag when set to `1`, `true`, `yes`, or `on`. |
| `METEOPECHE_GOOGLE_MAPS_API_KEY` | `scripts/build.mjs` | Optional | Writes the Google Maps JavaScript API key to `dist/config.js` for config-gated web map experiments. |
| `METEOPECHE_ENABLE_APPLE_MAPS_WEB` | `scripts/build.mjs` | Optional | Enables the Apple MapKit JS provider config flag when set to `1`, `true`, `yes`, or `on`. |
| `METEOPECHE_APPLE_MAPKIT_TOKEN` | `scripts/build.mjs` | Optional | Writes a static Apple MapKit JS token to `dist/config.js` for local provider experiments. Prefer a token URL for production. |
| `METEOPECHE_APPLE_MAPKIT_TOKEN_URL` | `scripts/build.mjs` | Optional | Writes an endpoint URL that returns an Apple MapKit JS token as plain text or JSON `{ "token": "..." }`. |
| `METEOPECHE_EXPERIMENTAL_MAP_PROVIDERS` | `scripts/build.mjs` | Optional | Comma-separated provider ids to opt into branch-only adapter experiments: `apple-web`, `google-web`, `apple-native`, or `google-native`. Unknown ids are filtered out at build/runtime. Defaults to none so Leaflet remains the only supported provider. |
| `PORT` | `server.mjs`, Docker runtime | Optional | Selects the local/static server port or backend container port. Defaults to `8080`. |
| `COPERNICUSMARINE_SERVICE_USERNAME` | Backend Copernicus client | Optional | Copernicus Marine service username for real depth-current data. |
| `COPERNICUSMARINE_SERVICE_PASSWORD` | Backend Copernicus client | Optional | Copernicus Marine service password for real depth-current data. |
| `ALLOWED_ORIGINS` | FastAPI backend | Optional | Comma-separated CORS allowlist. |
| `ALLOWED_ORIGIN_REGEX` | FastAPI backend | Optional | CORS regex for hosted frontend origins. |

### Map provider experiments

The production/default build keeps `experimentalMapProviders: []`, so `leaflet-openmap` remains the active provider and Apple/Google providers cannot replace the current map experience by accident.

The recommended production split is:

- Web/PWA: keep the default Cloudflare build on Leaflet/OpenStreetMap to avoid Google Maps JavaScript billing and Apple MapKit JS token infrastructure.
- iOS app: run `npm run mobile:sync:ios-native` or `npm run mobile:sync:native` before opening Xcode so the generated bundle uses the free native `apple-native` MapKit renderer.
- Android app: run `npm run mobile:sync:android-native` or `npm run mobile:sync:native` before opening Android Studio so the generated bundle prefers the native `google-native` Maps SDK renderer. Provide `METEOPECHE_GOOGLE_MAPS_ANDROID_API_KEY` or the `GOOGLE_MAPS_ANDROID_API_KEY` Gradle property for the Android Maps SDK key; no key is committed. Without the key, Android falls back to Leaflet.

For local web experiments:

```bash
METEOPECHE_EXPERIMENTAL_MAP_PROVIDERS=google-web \
METEOPECHE_ENABLE_GOOGLE_MAPS_WEB=1 \
METEOPECHE_GOOGLE_MAPS_API_KEY=your-key \
npm run build
```

```bash
METEOPECHE_EXPERIMENTAL_MAP_PROVIDERS=apple-web \
METEOPECHE_ENABLE_APPLE_MAPS_WEB=1 \
METEOPECHE_APPLE_MAPKIT_TOKEN_URL=/api/mapkit-token \
npm run build
```

For native experiments, `apple-native` and `google-native` require a Capacitor/native map bridge. If the bridge is absent, provider resolution reports `bridge-unavailable` and falls back to Leaflet before mounting. If the bridge exists but does not report readiness through `getStatus({ providerId })` or `isReady({ providerId })`, native mount fails safely and recovers to Leaflet. The native bridge command and event contract is documented in [docs/native-map-bridge-contract.md](docs/native-map-bridge-contract.md).

The iOS and Android projects include app-local `MeteoPecheMap` Capacitor bridge code. The iOS bridge can now report readiness for the default-off `apple-native` MapKit renderer when that provider is explicitly enabled, and the Android bridge can report readiness for the default-off `google-native` Google `MapView` renderer groundwork when a Maps API key is configured. Both expose `getDebugState` with a rolling native command journal for renderer validation.

For an iOS MapKit smoke build in Xcode, keep the committed/default config unchanged and create a local test bundle:

```bash
METEOPECHE_EXPERIMENTAL_MAP_PROVIDERS=apple-native npm run build
npx cap sync ios
open ios/App/App.xcodeproj
```

Run the `App` scheme on a simulator or device, then inspect the app with Safari Develop tools. `document.documentElement.dataset.mapProvider` should be `apple-native`, `data-native-map-bridge-ready` should be `apple-native`, and both `data-map-provider-fallback-reason` and `data-map-provider-layer-error` should stay empty. Re-run `npm run build` without the environment variable before web/PWA validation to restore the ignored local `dist` config to the production-safe default.

On localhost or `file://` only, the branch can mount a native provider against a debug bridge without native code:

```text
?mapProviderOverride=apple-native&mapProviderExperimental=apple-native&mapProviderDebugBridge=1
```

The debug bridge records native command names, layer membership, layer visibility, pin-tier visibility, and other diagnostics in `data-native-map-bridge-debug-*` attributes on the document element and exposes the same `getDebugState` shape as the app-local native scaffolds, which makes native-provider smoke tests possible before the iOS/Android renderers exist.

Native progressive pins use batch bridge commands (`createItems`, `addItemsToLayer`, and `setItemsVisible`) when possible, reducing startup command volume for future MapKit/Google Maps renderers while preserving the current Leaflet pin lifecycle.

Native `init` and `invalidateSize` payloads also include `containerMetrics`, giving future platform renderers the CSS-pixel bounds, visual viewport offsets, and device pixel ratio needed to align the native map surface beneath the web UI.
The app-local iOS and Android native scaffolds expose command-type counts, event-type counts, a recent event journal, and the last received `containerMetrics` payload through `getDebugState`, so native renderer work can verify command flow, event emission, and platform map alignment before enabling readiness.
The iOS bridge includes a default-off `apple-native` MapKit renderer with a visible native `MKMapView`, webview transparency, and an `MKTileOverlay` registry for native marine overlay commands; its debug state reports `renderer.kind = "mapkit"` and `implemented: true`.
The same iOS debug state now tracks MapKit marker annotations and shape overlays (`MKCircle`, `MKPolyline`, and `MKPolygon`) so native pin, bathymetry label, anchor-watch, and regulation-overlay work has native-side state while Leaflet remains the default production provider.
Both native scaffolds now also record layer membership, layer visibility, and pin-tier visibility from `addToLayer`, `addItemsToLayer`, `setLayerVisible`, `configurePinTier`, and `setPinTierVisible`, keeping progressive pin ownership and optional overlay toggles inspectable before native renderers are enabled.
The Android bridge now includes default-off `google-native` Google `MapView` renderer groundwork with a pinned `com.google.android.gms:play-services-maps` dependency, native map view lifecycle, webview transparency, container-frame alignment, camera updates, and provider-scoped `moveend`/`zoomend` emission. Android API-key injection uses the `METEOPECHE_GOOGLE_MAPS_ANDROID_API_KEY` environment variable or `GOOGLE_MAPS_ANDROID_API_KEY` Gradle property through a manifest placeholder; no key is committed. Without a key, the bridge reports `google-maps-api-key-missing` and the app falls back to Leaflet.
The Android debug state still tracks native marine tile-overlay definitions, layer membership, layer visibility, pin-tier visibility, and item visibility. Shared XYZ and WMS marine overlay payloads now create native Google `TileOverlay` handles, and marker, circle, polyline, and polygon payloads create native Google Maps handles with provider-scoped `click` events. The iOS scaffold now declares provider-scoped MapKit events and sends `moveend`, `zoomend`, and annotation `click` notifications through Capacitor listeners.
The local native debug bridge can also simulate provider-scoped native events with `emitMapEvent`, `simulateMove`, `simulateItemClick`, or `mapProviderDebugSimulateEvents=1`, allowing event routing to be smoke-tested before real MapKit or Google Maps native views are wired.
The canonical `mapProviderSmokeRoutes()` list includes native event-simulation routes for both `apple-native` and `google-native`, so QA can verify camera and item-click callback parity from the same local route matrix used for provider mount/fallback checks.
Native move and zoom callbacks accept platform-style camera payloads such as `camera.target`, `region.center`, `coordinate`, and `zoomLevel`, then normalize them back to the provider `{ center, zoom }` shape used by the web UX.
Native bridge status/debug responses must include `bridgeProtocolVersion`, `supportedCommands`, and `supportedEvents`; the web layer validates those capabilities before accepting `ready: true`, so an incomplete MapKit/Google renderer falls back to Leaflet instead of mounting halfway.

To verify that a present-but-not-ready native bridge still recovers safely, add `mapProviderDebugBridgeUnsupported=apple` or `mapProviderDebugBridgeUnsupported=google`; to verify capability negotiation failures, add `mapProviderDebugBridgeCapabilityFail=protocol`, `mapProviderDebugBridgeCapabilityFail=commands`, or `mapProviderDebugBridgeCapabilityFail=events`. Those routes should fall back to Leaflet with `data-map-provider-fallback-reason="mount-failed"`.

The same local-only pattern can smoke the web adapters without real Google or Apple credentials:

```text
?mapProviderOverride=google-web&mapProviderExperimental=google-web&mapProviderDebugSdk=google
?mapProviderOverride=apple-web&mapProviderExperimental=apple-web&mapProviderDebugSdk=apple
```

Those debug SDKs are inert local stubs. They prove provider mounting, layer creation, overlay visibility, and marker lifecycle wiring, but they are not a replacement for final API-key/token testing against the real Google Maps JavaScript API or Apple MapKit JS.

To verify failed experimental SDK startup still recovers to the current map, add the local-only failure switch:

```text
?mapProviderOverride=google-web&mapProviderExperimental=google-web&mapProviderDebugSdk=google&mapProviderDebugSdkFail=google
?mapProviderOverride=apple-web&mapProviderExperimental=apple-web&mapProviderDebugSdk=apple&mapProviderDebugSdkFail=apple
```

Those routes should report `data-map-provider="leaflet-openmap"` with `data-map-provider-fallback-reason="mount-failed"`.

For a canonical local QA route list, inspect `window.METEOPECHE_MAP_PROVIDER_DEBUG.mapProviderSmokeRoutes()` in the browser console. Browser-only harnesses can also read the mirrored DOM metadata from `data-map-provider-smoke-route-labels`, `data-map-provider-smoke-route-params`, `data-map-provider-smoke-route-urls`, `data-map-provider-smoke-expected-outcomes`, `data-map-provider-smoke-native-capability-errors`, and `data-map-provider-smoke-native-debug-datasets`.

Useful local checks:

```bash
npm run map-provider:validate
```

In the browser console, `window.METEOPECHE_MAP_PROVIDER_DEBUG.providerMatrix()` shows preference, active provider, config readiness, bridge availability, mount readiness, and fallback reason. `nativeBridgeContract(providerId)` documents the commands and callback payloads expected from a future native bridge, and `nativeBridgeDebugState(providerId)` reads the local or Capacitor bridge debug journal when available.

## Contributing

Keep changes small and aligned with the current vanilla JavaScript, CSS variables, and static build architecture. Run `npm run build` before opening a pull request, and include device/browser details when changing mobile layout, maps, or native behavior.

## License

License not specified - contact the author.
