# Platform Map Provider Strategy

This branch is a technical spike for choosing the correct base map per runtime while preserving the app's existing fishing and marine overlays.

## Product Target

- iOS app: Apple Maps through native MapKit.
- Safari web: Apple Maps through MapKit JS.
- Android app: Google Maps through the native Google Maps SDK, ideally via a Capacitor bridge.
- Chrome web: Google Maps through Maps JavaScript API.
- Other web browsers and fallback states: keep the current OpenStreetMap/Leaflet implementation.

The important product constraint is that the base map should change by platform, but the current fishing experience should not be simplified. Seamarks, marine overlays, bathymetry, coastal labels, known fishing spots, regulation layers, spot markers, anchor watch overlays, and map gestures still need to work.

## Current Map Stack

The app now resolves a map provider in `initMapEngine()`. Default builds still mount the current Leaflet/OpenMap implementation, while Apple, Google, and native providers remain default-off experiments behind runtime config.

Provider-managed map surfaces include:

- OpenStreetMap base tiles.
- OpenSeaMap seamarks tile overlay.
- EMODnet WMS coastlines and sea-name overlays.
- EMODnet contour WMS overlay.
- Custom bathymetry labels and depth focus markers.
- Known fishing overlays.
- Regulation overlays.
- Marine condition overlay markers.
- Anchor watch overlays.
- User pins, discovered spots, selected spot markers, map click and map move events.

Direct `L.*` usage is now concentrated inside `LeafletMapProvider`, and `npm run map-provider:validate` guards that boundary across source, web, iOS, and Android bundles.

## Provider Resolution

Recommended runtime routing:

```js
function resolveMapProvider() {
  if (isNativeIOS()) return "apple-native";
  if (isNativeAndroid()) return "google-native";
  if (isSafariWeb()) return "apple-web";
  if (isChromeWeb()) return "google-web";
  return "leaflet-openmap";
}
```

Definitions should be conservative:

- `isNativeIOS()`: Capacitor platform is `ios`.
- `isNativeAndroid()`: Capacitor platform is `android`.
- `isSafariWeb()`: real Safari, including iOS Safari, excluding Chrome/Edge/Firefox user agents on iOS if we need strict browser routing.
- `isChromeWeb()`: Chrome/Chromium desktop or Android Chrome, excluding the Capacitor native Android shell.
- `leaflet-openmap`: current OpenStreetMap/Leaflet path.

## Provider Interface

Create a provider-neutral map API before replacing engines:

```ts
type MapProviderId =
  | "leaflet-openmap"
  | "apple-web"
  | "apple-native"
  | "google-web"
  | "google-native";

interface MapProvider {
  init(container: HTMLElement, options: MapInitOptions): Promise<void>;
  destroy(): void;
  setView(center: LatLon, zoom: number): void;
  getView(): { center: LatLon; zoom: number; bounds: MapBounds };
  on(event: "click" | "moveend" | "zoomend" | "loading" | "load", handler: Function): Unsubscribe;

  addTileOverlay(definition: TileOverlayDefinition): MapHandle;
  addMarker(definition: MarkerDefinition): MapHandle;
  addCircle(definition: CircleDefinition): MapHandle;
  addPolyline(definition: PolylineDefinition): MapHandle;
  addPolygon(definition: PolygonDefinition): MapHandle;
  remove(handle: MapHandle): void;
  clearLayer(layerId: string): void;
}
```

Leaflet is the first concrete provider. Apple, Google, and native providers can evolve without rewriting the app's fishing logic every time.

## Native Bridge Boundary

The Capacitor app now has branch-local native map bridge scaffolds for iOS MapKit and Android Google Maps. They remain default-off behind the experimental provider gate, so production config still resolves to Leaflet/OpenMap unless a platform provider is explicitly enabled.

That means:

- iOS native Apple Maps is treated as a Capacitor bridge around MapKit, not as MapKit JS running in the webview.
- Android native Google Maps is treated as a Capacitor bridge around the Google Maps SDK, not as the Maps JavaScript API running in the webview.
- The web provider interface remains the source of truth for overlay operations so native bridges receive normalized commands for markers, tile overlays, polygons, circles, polylines, bounds, and events.
- Native parity is validated incrementally: mount/readiness, camera events, tile overlays, marker batches, marker updates, layer visibility, shape overlays, callouts, and debug telemetry each get their own guarded slice before any provider is enabled by default.

## Overlay Portability

| Existing feature | Leaflet today | Apple web/native feasibility | Google web/native feasibility | Notes |
| --- | --- | --- | --- | --- |
| OpenStreetMap base | Native Leaflet tile layer | Fallback only | Fallback only | Apple/Google base maps replace this, not overlay it. |
| OpenSeaMap seamarks | XYZ tile overlay | Tile overlay | Tile overlay | Good candidate for shared `TileOverlayDefinition`. |
| EMODnet coastlines | WMS tile overlay | Tile overlay or WMS URL adapter | Tile overlay or WMS URL adapter | Needs a WMS-to-tile URL adapter per provider. |
| EMODnet contours | WMS tile overlay | Tile overlay or WMS URL adapter | Tile overlay or WMS URL adapter | Same as coastlines. |
| Bathymetry labels | Leaflet markers/div icons | Annotation or DOM overlay | Marker/AdvancedMarker/native marker | Marker payload and class telemetry exists; final visual parity still needs real-provider QA. |
| Known fishing spots | Layer group and markers | Annotation layer | Marker layer | Straightforward after marker adapter. |
| Regulation overlays | Leaflet polygons/layers | Polygon/polyline overlays | Polygon/polyline overlays | Confirm data source shape and z-order. |
| Marine condition overlay | Layer group and markers | Annotation or custom overlay | Marker/custom overlay | Needs clustering/performance check. |
| Anchor watch | Circle/polyline/markers | Circle/polyline overlays | Circle/polyline overlays | Portable through provider interface. |
| Map click/select point | Leaflet click event | MapKit/MapKit JS event | Google Maps event | Must normalize event payload. |
| Overpass fetch on bounds change | Leaflet bounds events | Camera/region event | Bounds/idle event | Keep debounce and payload stable. |

Apple and Google both support tile overlays, so marine and bathymetry tile layers are technically preservable. The harder work is not tile support; it is abstracting the app's Leaflet-specific markers, panes, layer groups, and event assumptions.

## Implementation Phases

1. Extract current Leaflet map into `LeafletMapProvider`.
2. Replace app-level direct `state.leafletMap` access with provider methods for view, click, move, zoom, marker, tile overlay, circle, polyline, and polygon behavior.
3. Define shared overlay descriptors for seamarks, EMODnet coastlines, EMODnet contours, and any future marine layers.
4. Add provider resolver and keep Leaflet as the default fallback.
5. Add MapKit JS for Safari web behind config-gated initialization.
6. Add Google Maps JavaScript API for Chrome web behind config-gated initialization.
7. Add native iOS MapKit bridge or plugin layer for the iOS app.
8. Add native Android Google Maps bridge or official Capacitor Google Maps implementation for the Android app.
9. Validate overlay parity by platform: base map, seamarks, bathymetry, marine markers, regulations, anchor watch, discoverable spots, location selection, and favorites.

## API Keys And Accounts

Apple MapKit JS requires authorization with a Maps token. Native iOS MapKit is part of Apple's platform SDK, but distribution still depends on Apple developer setup and app entitlements.

Google Maps JavaScript API and the native Android Maps SDK require Google Maps Platform setup, API keys, restrictions, and billing enabled. Google documents Maps JavaScript usage as pay-as-you-go, with map loads billed under the Dynamic Maps SKU and API key or OAuth required.

Keep keys out of source. Use environment-provided runtime config, restricted by bundle id, package name/SHA-1, or allowed domains where possible.

## Main Risks

- Native maps in Capacitor are not just DOM elements. They often render as native views coordinated with the web layer, so overlays and sheet controls need careful z-index and hit-test testing.
- Apple MapKit JS and native MapKit are related but not the same implementation. Treat them as two providers, not one.
- Google web and Google native also need separate implementations.
- WMS overlays may need URL conversion helpers and CORS validation outside Leaflet.
- Billing and API key restrictions need to be solved before enabling Google maps broadly on production web.
- Browser detection must not trap users in a broken provider. Failed Apple/Google initialization should fall back to Leaflet.

## Recommended First Build

Do not install Google or Apple map SDKs as the first step. First, introduce the provider interface and make the current Leaflet implementation pass through it. That gives us a safe build with no provider change, then we can add Apple/Google engines one at a time and compare against the current app.

## Branch Progress

- Added runtime provider identifiers for Leaflet/OpenMap, Apple web, Apple native, Google web, and Google native.
- Added conservative provider detection for Capacitor iOS, Capacitor Android, Safari web, Chrome web, and fallback web.
- Kept `leaflet-openmap` as the only supported active provider for now, so Apple/Google preferences fall back safely until their adapters are implemented.
- Added shared tile overlay definitions for OpenSeaMap seamarks and EMODnet WMS layers.
- Updated the current Leaflet initialization to consume those shared overlay definitions without changing visible behavior.
- Verified the Chrome local preview prefers `google-web`, falls back to `leaflet-openmap`, and still boots the Leaflet map.
- Extracted the Leaflet bootstrap into `LeafletMapProvider`, covering base tiles, seamarks, EMODnet WMS layers, layer groups, tile loading state, UI event propagation, and map event binding.
- Verified after extraction that the local Chrome preview still falls back to Leaflet/OpenMap, renders Leaflet tiles and panes, and keeps the floating tabbar styling.
- Added provider-level layer visibility methods and routed nautical, coastal, bathymetry, known fishing, and regulation overlay add/remove checks through the provider.
- Added Google Maps web runtime config gates: `enableGoogleMapsWeb` and `googleMapsApiKey`, generated from `METEOPECHE_ENABLE_GOOGLE_MAPS_WEB` and `METEOPECHE_GOOGLE_MAPS_API_KEY`.
- Added a dormant Google Maps JS loader and placeholder provider. Chrome still falls back to Leaflet/OpenMap until the Google overlay adapter reaches parity.
- Expanded the dormant Google Maps web provider with base map initialization, Google `ImageMapType` tile overlays, layer groups, visibility handling, event binding, click normalization, and provider view methods.
- Normalized Google web map events so app-level `moveend` binds to Google `idle` and app-level `zoomend` binds to Google `zoom_changed`, preserving progressive pin-tier updates under the Google Maps JS provider.
- Added shared tile URL helpers for Google overlay support, including XYZ tile URL generation and EPSG:4326 WMS BBOX generation for EMODnet overlays.
- Moved low-risk app state sync and map centering calls from direct Leaflet access to provider methods.
- Added provider geometry methods for markers, circle markers, circles, polylines, polygons, tooltips, popups, and layer clearing.
- Moved selected custom spot markers, pending spot markers, regulation polygons, and anchor-watch shapes through the provider geometry methods.
- Moved bathymetry focus markers and marine condition overlay markers through provider geometry methods.
- Renamed the map focus helper to `getMapFocusPoint()` and made it prefer the active provider center.
- Moved the dedicated discovery/search/nearby marker renderer through provider marker methods.
- Added provider bounds methods and moved regional marine overlay sampling to provider center/bounds/zoom.
- Added provider marker update primitives for position, icon, z-index, opacity, marker element access, tooltip content, one-time events, and fly-to.
- Aligned provider event subscriptions so Leaflet, Google web, Apple web, and native bridge `on()` calls all return an unsubscribe handle with `remove()`, matching the shared provider interface.
- Aligned provider one-time event subscriptions so Leaflet, Google web, Apple web, and native bridge `once()` calls also return a removable handle; Google and Apple web now normalize one-time payloads through the same paths as persistent events.
- Centralized provider click coordinate extraction so map selection accepts Leaflet `latlng`, Google `latLng`, MapKit `coordinate`, native camera/region coordinates, and provider-neutral `lat`/`lon` payloads without assuming one SDK event shape.
- Routed Google shape clicks, Apple marker/shape clicks, and native item clicks through the shared coordinate extractor before falling back to stored marker or shape centers.
- Moved progressive pin creation, position updates, icon creation/sync, opacity changes, click fly-to, and pulse cleanup through provider methods while preserving Leaflet pane batching.
- Added provider methods for progressive pin tier layer creation, batch insertion/removal, and pane visibility.
- Moved progressive pin pane and batch-group management through provider methods; direct Leaflet geometry calls are now concentrated in the Leaflet provider implementation.
- Added Apple MapKit JS runtime config gates: `enableAppleMapsWeb`, `appleMapKitToken`, and `appleMapKitTokenUrl`, generated from `METEOPECHE_ENABLE_APPLE_MAPS_WEB`, `METEOPECHE_APPLE_MAPKIT_TOKEN`, and `METEOPECHE_APPLE_MAPKIT_TOKEN_URL`.
- Added a dormant Apple MapKit JS loader with static-token and token-endpoint authorization paths. Safari still falls back to Leaflet/OpenMap unless the Apple web provider is explicitly enabled and configured.
- Moved progressive pin visibility guards and marker/discovery click event stopping to provider methods, leaving direct `L.*` usage concentrated inside `LeafletMapProvider`.
- Made map provider startup async-safe and added an initialization-failure fallback path back to Leaflet/OpenMap, so future SDK loading errors should not leave the app with a blank map.
- Added an explicit dormant Apple web provider path wired to the MapKit JS loader and controlled fallback handling.
- Added a local validation override query parameter, `mapProviderOverride`, accepting `leaflet-openmap`, `apple-web`, `apple-native`, `google-web`, or `google-native`. Existing `map-provider` cache-busting preview parameters are ignored by provider selection.
- Split Google marker batch insertion from tile overlay grouping so progressive pins do not get pushed into `overlayMapTypes`.
- Marked native Apple/Google provider preferences as config-ready but unsupported, so their fallback reason correctly reads as adapter readiness rather than missing web credentials.
- Added lightweight Google Maps web tooltip parity for provider-created markers and circles through hover `InfoWindow`s.
- Moved progressive pin tooltip creation and marker element access through provider methods, removing direct marker API calls from the app-level pin renderer.
- Added Google Maps web parity for dashed polylines plus polyline/polygon tooltip handling, covering anchor-watch paths and regulation-zone hover labels.
- Carried shared marker, circle, and polygon opacity options into the Google Maps web provider so overlay styling is less dependent on Google defaults.
- Removed the legacy `state.leafletMap` compatibility field; app state now relies on `state.mapProvider` for map ownership.
- Updated Google Maps web layer groups to distinguish child marker groups from tile overlays, preventing nested progressive pin tier groups from being added to `overlayMapTypes`.
- Renamed app-level marker and pin helpers from Leaflet-specific names to provider-neutral map naming, while leaving `LeafletMapProvider` as the only Leaflet-specific implementation surface.
- Added `window.METEOPECHE_MAP_PROVIDER_DEBUG.providerMatrix()` so validation can inspect active, preferred, supported, configured, and fallback status for every provider.
- Added explicit native bridge provider entries for `apple-native` and `google-native`, and restricted Leaflet instantiation to `leaflet-openmap` so future support-flag experiments cannot accidentally report a native provider while mounting Leaflet.
- Added a default-off `experimentalMapProviders` runtime config, generated from `METEOPECHE_EXPERIMENTAL_MAP_PROVIDERS`, so branch builds can opt into provider adapters without changing source. Default builds still support only Leaflet/OpenMap.
- Added non-DOM marker visibility fallback for progressive pins, using provider marker opacity when a provider such as Google Maps web cannot expose a Leaflet-style marker element.
- Fixed Google Maps web progressive pin batch ownership/removal so batch groups are attached to their tier layer and cleaned up when emptied, matching the Leaflet batch lifecycle more closely.
- Added a Google Maps web HTML marker wrapper for provider-created div icons, preserving marker DOM, CSS classes, active/hidden states, labels, and pointer events instead of flattening progressive pins into image icons.
- Added cleanup for Google Maps web HTML marker DOM listeners and attached tooltip windows when marker groups are cleared or removed.
- Expanded provider fallback handling to cover the full mount sequence, not only SDK initialization, and added provider `destroy()` hooks so failed experimental Apple/Google mounts can clean up before Leaflet fallback.
- Replaced the Apple web placeholder with a guarded MapKit JS scaffold that can create a MapKit map, normalize center/zoom/bounds, wire provider events, and mount shared seamark, coastal, and bathymetry tile overlays through `mapkit.TileOverlay`.
- Added first-pass Apple web annotation support for simple markers and circle markers using MapKit JS annotations, including provider-level position, opacity, z-index, tooltip text, and selection event handling. Progressive pin tiers and shape overlays remain gated until visual parity is ready.
- Added Apple web shape overlay support for circles, polylines, and polygons using MapKit JS overlays and `mapkit.Style`, carrying provider-level stroke, fill, weight, opacity, and dash options for anchor-watch and regulation overlays.
- Added Apple web progressive pin lifecycle scaffolding: tier layer groups, marker batch insertion/removal, pane visibility, synthetic move completion, and DOM-backed MapKit annotations for provider div-icon HTML so custom pin styling can be preserved in experimental Apple builds.
- Hardened experimental Google and Apple web provider cleanup by tracking provider map listeners, UI propagation listeners, layer groups, marker listeners, annotations, overlays, tile overlays, and tooltip windows so failed mounts or future remounts can tear down cleanly before Leaflet fallback.
- Replaced the native provider placeholder with a dormant command-bridge scaffold for future Capacitor MapKit/Google Maps integrations. It now resolves a native bridge, sends normalized init/view/layer/tile/marker/shape/pin-tier commands, serializes provider-neutral payloads, and still fails back to Leaflet when no native bridge is installed.
- Added native bridge event routing for future marker and shape callbacks. Native map items now register requested events, normalize item click payloads back into provider events, support local move completion for fly-to flows, and unregister callbacks during layer/item teardown.
- Expanded `window.METEOPECHE_MAP_PROVIDER_DEBUG` with `nativeBridgeContract(providerId)` and `nativePayloadSamples()` so native iOS/Android implementation work can inspect required bridge names, command payloads, event names, and callback shapes directly from the running app.
- Added `npm run map-provider:validate`, a local source/build validator that checks provider ids, default-off experimental config, debug exports, native bridge contract commands, payload serializers, docs coverage, and propagation into generated web/iOS/Android bundles.
- Added explicit native bridge availability and mount-readiness signals to provider resolution and `providerMatrix()`. Experimental native providers now fall back before mount when the Capacitor bridge is absent, with fallback reason `bridge-unavailable`.
- Bumped the branch asset/cache version to `20260602-map-provider-bridge` and extended the provider validator to check index asset query strings and service-worker cache naming, preventing stale provider bundles during web/PWA validation.
- Bumped the branch asset/cache version again to `20260603-map-provider-batch` for the native progressive-pin batching runtime changes, preventing local previews and PWA installs from reusing the older bridge bundle.
- Bumped the branch asset/cache version to `20260603-native-layer-visibility-apply` for default-off iOS MapKit readiness, webview/native-map transparency, native item-visibility telemetry, hidden-layer telemetry, Google/Apple web marker-batch visibility parity, Google HTML marker listener preservation across layer hide/show, native marker style debug telemetry, native shape callout debug telemetry, Google web shape layer-visibility parity, Google/Apple web coordinate normalization, Google web shape-popup parity, web shape center fallback parity, Google web popup cleanup parity, native item-click coordinate fallback parity, native layer-promise diagnostics, native generic layer-visibility telemetry, and native layer-owned item visibility application, preventing local previews and PWA installs from reusing older provider bundles.
- Hardened native bridge command error handling: `init` remains strict so missing native support falls back to Leaflet, while incremental native overlay/marker commands warn once and continue to avoid unhandled promise rejections during partial bridge development.
- Kept the native debug contract aligned with the scaffold by documenting pin-tier configuration and layer-removal commands emitted during progressive pin lifecycle cleanup.
- Extended the provider validator so direct `L.*` usage must stay inside `LeafletMapProvider`, native bridge commands emitted by the scaffold must be documented in `nativeBridgeContract()`, and every concrete provider must implement the map-provider methods actually called by the app.
- Added provider-owned fallback DOM cleanup so `#mapTiles` and fallback DOM markers are cleared/hidden once a real provider mounts.
- Hardened default Leaflet mounting with a short library readiness wait, partial Leaflet cleanup on failed mount, default pane checks, and document-level mount/layer debug signals.
- Made the bathymetry focus marker layer non-fatal during provider mount, then fixed the Leaflet marker insertion issue by filtering undefined provider-neutral options before calling Leaflet constructors. The local smoke test now mounts Leaflet/OpenMap with provider ownership, zero fallback DOM tiles, visible bathymetry focus labeling, and no `mapProviderLayerError`.
- Smoke-tested the local override matrix for `leaflet-openmap`, `apple-web`, `google-web`, `apple-native`, and `google-native`. Default-off Apple/Google routes fall back to Leaflet/OpenMap with the expected `missing-config` or `bridge-unavailable` reason while preserving provider tiles and bathymetry labeling.
- Added a localhost/file-only native debug bridge path using `mapProviderExperimental` plus `mapProviderDebugBridge=1`, so `apple-native` and `google-native` can be mounted against a fake bridge and inspected through document-level native command counters before real Capacitor bridge code exists.
- Smoke-tested the native debug bridge for both `apple-native` and `google-native`; each mounted without fallback, applied the `is-native-map` provider class, kept fallback DOM tiles empty, and emitted required command types including `init`, `createTileOverlay`, `setLayerVisible`, `configurePinTier`, `createItem`, and `addToLayer`.
- Added localhost/file-only Google Maps JS and Apple MapKit JS debug SDK stubs behind `mapProviderDebugSdk`, letting `google-web` and `apple-web` mount without external credentials for provider lifecycle smoke tests. Real API-key/token validation is still required before enabling those web providers outside local debug.
- Smoke-tested the local `google-web` and `apple-web` debug SDK routes; each mounted the expected provider class without fallback, kept Leaflet and fallback DOM tiles absent, and rendered the bathymetry focus label through provider marker/annotation paths.
- Added debug SDK lifecycle counters for local web-provider smoke coverage, including Google overlay/item/event counts and Apple tile-overlay/annotation/shape-overlay/event counts.
- Smoke-tested the web debug lifecycle counters: Google web recorded overlay, item, and event activity; Apple web recorded tile-overlay, annotation, shape-overlay, and event activity; default Chrome still fell back to Leaflet/OpenMap with provider tiles and bathymetry labeling intact.
- Added a local-only `mapProviderDebugSdkFail` switch for Google/Apple web adapters so failed experimental SDK startup can be smoke-tested without external services. The expected recovery is Leaflet/OpenMap with `data-map-provider-fallback-reason="mount-failed"`.
- Smoke-tested the web debug failure routes for `google-web` and `apple-web`; both recovered to `leaflet-openmap`, reported `mount-failed`, kept fallback DOM tiles empty, rendered provider Leaflet tiles, and preserved the bathymetry focus label.
- Added `mapProviderSmokeRoutes()` to the debug inspector so local QA has one canonical route matrix for default, web debug, forced web failure, and native debug bridge cases.
- Added a strict native bridge readiness handshake before `init`: native providers now require `getStatus({ providerId })` or `isReady({ providerId })` to confirm the requested provider is ready, while the local debug bridge advertises both native providers for smoke testing.
- Added a local-only `mapProviderDebugBridgeUnsupported` switch so a debug native bridge can exist while reporting one provider as unavailable, proving present-but-not-ready native bridges still recover to Leaflet/OpenMap with `mount-failed`.
- Smoke-tested ready native debug bridge routes for `apple-native` and `google-native`; both mounted through the debug bridge with `data-native-map-bridge-ready` set to the provider and emitted native map commands. Smoke-tested unsupported native debug bridge routes for both providers; both recovered to `leaflet-openmap` with `mount-failed`, zero fallback DOM tiles, provider Leaflet tiles, and bathymetry labeling intact.
- Added app-local Capacitor `MeteoPecheMap` plugin scaffolds for Android and iOS. They expose the native bridge method surface, initially reserving the bridge name for MapKit/Google Maps renderer work while preserving the Leaflet fallback.
- Added a rolling native command journal and `getDebugState` to both app-local native scaffolds, giving renderer work a platform-side way to confirm command receipt.
- Aligned the local web native debug bridge with the app-local scaffolds by adding `getDebugState` and exposing `nativeBridgeDebugState(providerId)` from the browser debug inspector.
- Added provider id and supported-provider metadata to the iOS and Android scaffold `getDebugState` responses so platform diagnostics match the local web debug bridge shape.
- Strengthened `npm run map-provider:validate` so it derives native bridge commands from `NativeBridgeMapProvider` and verifies the Android and iOS `MeteoPecheMap` scaffolds expose the same command surface.
- Added native batch commands for progressive pins (`createItems`, `addItemsToLayer`, `setItemsVisible`) so native renderers can receive tiered marker batches instead of thousands of one-marker bridge calls during startup.
- Extended the local native debug bridge telemetry with per-command counts and recent native batch sizes, making progressive-pin batching measurable from DOM smoke tests.
- Mirrored native scaffold layer membership and pin-tier visibility in the local native debug bridge, including DOM telemetry and `getDebugState().renderer`, so provider smoke routes can verify progressive pin ownership before native readiness is enabled.
- Added local native debug bridge item type counts and marker class-name telemetry, so DOM smoke tests can verify native-only markers such as the bathymetry focus label even when no web marker element is rendered.
- Added `containerMetrics` to native `init` and `invalidateSize` bridge payloads, plus debug DOM telemetry, so future MapKit/Google native views can align their platform surface with the web map container and visual viewport.
- Extended the app-local iOS and Android native scaffolds with command-type counts and the last received `containerMetrics` payload in `getDebugState`, giving native renderer work platform-side diagnostics for command flow and layout alignment.
- Added local native debug bridge event simulation for provider-scoped move and item-click callbacks, including DOM/debug-state event telemetry, so native event routing can be smoke-tested before real MapKit/Google renderers are wired.
- Hardened native event normalization so MapKit/Google-style camera payloads such as `camera.target`, `region.center`, `coordinate`, and `zoomLevel` normalize back to the provider `{ center, zoom }` shape expected by the existing map UX.
- Added bridge capability negotiation fields (`bridgeProtocolVersion`, `supportedCommands`, and `supportedEvents`) to the local debug bridge, runtime contract inspector, and app-local iOS/Android scaffolds so real native renderers can prove command/event parity before returning `ready: true`.
- Tightened the native readiness handshake so the web layer validates protocol version, required commands, and provider-scoped events before accepting `ready: true`; local capability-failure smoke routes now prove incomplete bridges recover to Leaflet/OpenMap.
- Added the first default-off iOS MapKit renderer groundwork: the app-local plugin can create a visible `MKMapView`, apply container metrics and camera updates, and expose renderer debug state while still requiring `apple-native` to be enabled through experimental provider config.
- Added an iOS `MKTileOverlay` registry with layer visibility/removal handling so shared marine tile overlay commands have native MapKit state when `apple-native` is enabled.
- Added iOS MapKit marker and shape registries: native annotations for marker batches and native circle/polyline/polygon overlays for provider-neutral shape payloads.
- Added dormant native layer-membership and pin-tier registries to the iOS MapKit and Android Google scaffolds, and aligned native tile-overlay parsing with the web bridge's nested `overlay` payload.
- Added default-off Android `google-native` renderer groundwork with a pinned `play-services-maps` dependency, manifest API-key placeholder, native Google `MapView` lifecycle, webview transparency, container-frame alignment, camera updates, and Google camera event emission. Android reports `google-maps-api-key-missing` and falls back to Leaflet when no key is configured, creates native Google `TileOverlay` handles for shared XYZ/WMS marine overlay payloads, and creates native Google marker/circle/polyline/polygon handles for provider-neutral item payloads.
- Preserved native item visibility across dormant iOS/Android create/update paths and made iOS batch visibility idempotent, so hidden progressive-pin tiers and layer-owned overlays do not accidentally reappear during native renderer iteration.
- Added app-local native event contract parity: iOS now declares provider-scoped MapKit events and notifies `moveend`, `zoomend`, and annotation `click` through Capacitor listeners; Android now exposes matching `google-native` supported-event metadata and emits Google Maps camera and native item-click events through the same bridge event contract.
- Promoted the iOS native bridge from dormant scaffold to default-off `apple-native` readiness: the bridge now reports `ready: true` for Apple native, resolves strict `init`, keeps the WKWebView transparent over the map region, and leaves Leaflet as the default production provider unless experimental native providers are explicitly enabled.
- Promoted the Android native bridge from dormant scaffold to default-off `google-native` readiness: the bridge now reports `ready: true` for Google native, resolves strict `init`, creates a native Google `MapView`, applies camera/container metrics, and leaves Leaflet as the default production provider unless experimental native providers are explicitly enabled.
- Added provider-level progressive pin tier visibility for Google web, Apple web, and the native bridge adapter by storing tier layer handles on pseudo-panes and toggling the backing provider layer when zoom changes. This brings non-Leaflet pin-tier behavior closer to Leaflet panes while preserving per-marker opacity fallback.
- Added Apple MapKit JS shape-popup parity for circle, polyline, and polygon overlays. Provider shapes now open lightweight annotation callouts for popup content, giving regulation overlays an Apple web equivalent to Leaflet popups and Google InfoWindows.
- Added native renderer debug telemetry for shape popup and tooltip payloads on both iOS MapKit and Android Google scaffolds, so regulation-overlay callout readiness can be inspected through `getDebugState().renderer` while native providers remain default-off.
- Added Android Google native marker callout parity: marker titles and tooltip content now feed native info-window title/snippet metadata, marker clicks still emit provider-scoped bridge events, and renderer debug state exposes marker callout readiness.
- Added matching iOS MapKit marker callout telemetry so native renderer debug state exposes marker callout-ready counts on both platform scaffolds.
- Tightened iOS MapKit marker callout parity so blank marker titles fall back to tooltip text and callouts enable when either title or subtitle content is available.
- Matched iOS MapKit marker callout text handling with Android by stripping simple HTML from native title/subtitle strings before handing them to MapKit callouts.
- Mirrored local native debug bridge item type counts and marker class-name telemetry in both app-local iOS MapKit and Android Google scaffolds, making native-only labels such as the bathymetry focus marker inspectable through real bridge debug state.
- Mirrored native marker anchor/opacity/z-index payload counters in the local native debug bridge so browser smoke routes can inspect marker style parity before real-device testing.
- Mirrored native shape popup/tooltip counters in the local native debug bridge so regulation and shape callout readiness can be inspected in browser smoke routes before real-device testing.
- Browser-smoked the canonical `google-web` and `apple-web` local debug SDK routes with `mapProviderExperimental` enabled. Both mounted their web providers, rendered the bathymetry focus label, kept Leaflet/fallback DOM tiles absent, and reported no `mapProviderLayerError`; omitting `mapProviderExperimental` correctly remains an `adapter-not-ready` fallback because production config is default-off.
- Added native item-click coordinate fallback parity. Native renderers should still send `{ itemId, lat, lon }` when possible, but the web provider now recovers `{ lat, lng }` from the stored marker or shape payload when a click event only includes `itemId`; the local native debug bridge mirrors this by inferring coordinates for `simulateItemClick` when `lat` and `lon` are omitted, and the automatic `mapProviderDebugSimulateEvents=1` route now uses the item-only click shape to exercise that fallback.
- Added iOS MapKit native marker view styling for provider-neutral icon anchors, opacity, interactivity, and z-index payloads, bringing native annotation placement and stacking closer to Leaflet/Google marker behavior.
- Tightened iOS MapKit native marker updates so merged `updateItem` payloads immediately reapply callout, visibility, anchor, opacity, interactivity, and z-index styling to already-visible annotation views.
- Added Android Google native marker anchor telemetry and provider-neutral icon anchor handling by translating shared `iconSize`/`iconAnchor` payloads into Google marker anchors while keeping existing opacity and z-index behavior.
- Preserved provider-neutral `tooltipAnchor` values in native div-icon payloads and mirrored tooltip-anchor debug counts in the local native bridge plus iOS MapKit and Android Google scaffolds.
- Mirrored provider-neutral `popupAnchor` debug counts beside icon and tooltip anchors across the local native bridge plus iOS MapKit and Android Google scaffolds.
- Added first-pass Android Google native shape callouts: circle, polyline, and polygon clicks now reuse a shared info-window anchor to display popup or tooltip text while still emitting provider-scoped item-click events.
- Fixed iOS MapKit native shape coordinate decoding so provider-neutral `[lat, lon]` arrays and one-level nested polygon arrays render as native polylines/polygons instead of requiring dictionary-shaped coordinates.
- Added iOS MapKit native dashed-shape styling by mapping provider-neutral `dashArray` values to `MKOverlayPathRenderer.lineDashPattern`, preserving regulation/anchor overlay stroke semantics.
- Matched Android Google native shape coordinate decoding with the iOS path so flat provider-neutral coordinate pairs and one-level nested polygon rings both render as native polylines/polygons.
- Added Android Google native dashed-shape styling by mapping provider-neutral `dashArray` values to Google Maps `Dash`/`Gap` stroke patterns for polylines and polygon outlines.
- Added Android Google native shape opacity parity by applying shared `opacity` to strokes and `fillOpacity` to circle/polygon fills.
- Added iOS MapKit native shape opacity parity by applying shared `opacity` to strokes and `fillOpacity` to fills at the color level, avoiding renderer-wide alpha from dimming both channels together.
- Tightened Google Maps web shape layer visibility by deferring circle-marker, circle, polyline, and polygon map attachment when their provider layer is hidden, matching the marker and batch-layer behavior.
- Added shared Google/Apple web coordinate normalization for shape overlays so flat `[lat, lon]` pairs, `{ lat, lon }`/`{ lat, lng }` objects, `{ latitude, longitude }` objects, and one-level polygon rings can flow through the experimental web providers with the same payload flexibility as the native bridge scaffolds. The debug inspector exposes `coordinateNormalizationSamples()` so local QA can inspect the normalized path/ring payloads from a running build.
- Added Google Maps web popup parity for circle markers, circles, polylines, and polygons. Shape popup payloads now open tracked `InfoWindow`s from a shared helper, matching Apple web and native scaffold callout readiness more closely while keeping the provider default-off.
- Added shared web shape-center fallback handling so Google web polyline/polygon popups and click events plus Apple web shape popups can resolve a stable center from provider-neutral path/ring payloads even when the SDK/debug overlay object does not expose points.
- Tightened Google Maps web popup lifecycle cleanup so tracked shape `InfoWindow`s are closed when provider-owned marker/shape items are cleared or removed, matching the existing tooltip cleanup path.
- Added first-pass Android native item rendering: provider-neutral marker, circle, polyline, and polygon payloads now become Google Maps native handles with visibility, update, removal, and click-event routing.
- Added Android native marine tile rendering: shared XYZ and WMS overlay payloads now become Google Maps `TileOverlay` handles with provider-level URL expansion, WMS EPSG:4326 bbox math, opacity, visibility, and removal support.
- Added iOS native marine tile rendering parity: shared XYZ and WMS overlay payloads now become MapKit `MKTileOverlay` handles with provider-level URL expansion, WMS EPSG:4326 bbox math, opacity, visibility, removal support, and debug type telemetry.
- Tightened native layer cleanup parity: Android Google and iOS MapKit `clearLayer` now remove rendered native marker/shape handles and payload definitions for layer members, preventing stale progressive pins or overlays after provider-owned refreshes.
- Returned native bridge promises from provider layer visibility and clearing paths, then taught `setProviderLayerVisible` to clear or record async layer diagnostics. This keeps optional bathymetry layer telemetry accurate under native/debug providers without changing Leaflet's synchronous behavior.
- Added generic `renderer.layerVisibility` telemetry to the local native debug bridge plus the iOS MapKit and Android Google scaffolds, so provider QA can inspect optional bathymetry marker groups and other non-tile layer toggles, not only tile overlays or pin tiers.
- Tightened iOS MapKit tile-overlay debug payload construction so optional min/max zoom values are emitted as explicit `Any` values or `NSNull`, avoiding Swift warnings while preserving the native bridge contract.
- Mirrored native tile-overlay debug telemetry in the local native bridge, including overlay ids and visibility, so seamarks, coastal, and bathymetry overlay ownership can be inspected in browser smoke routes before device testing.
- Added tile-overlay type telemetry to Android Google and the local native debug bridge, matching iOS MapKit's `tileOverlayTypes` debug state so WMS/XYZ overlay parity is visible across native-style providers.
- Mirrored marker and shape id telemetry in the local native debug bridge so native-style smoke routes can inspect bathymetry labels, marine markers, anchor overlays, and regulation shapes by concrete bridge item id.
- Applied native `setLayerVisible` to all marker and shape items currently owned by the target layer in both the MapKit and Google scaffolds, bringing non-tile layer toggles closer to Leaflet layer-group semantics.
- Matched the local native debug bridge to that same layer-owned item visibility behavior, so browser smoke tests can inspect native-style layer toggles before running device builds.
- Added explicit child-layer tracking for local debug, iOS MapKit, and Android Google native scaffolds so parent layer visibility cascades through nested provider layers such as coastal overlay groups and progressive pin tiers.
- Tightened iOS MapKit teardown cleanup so `destroy` also clears provider-owned tile overlay definitions, keeping post-destroy debug state and future remounts free of stale overlay metadata.
