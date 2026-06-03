# Native Map Bridge Contract

This branch keeps Leaflet/OpenMap as the default map provider while preparing native `apple-native` and `google-native` providers for Capacitor builds. Native providers stay default-off until a bridge is installed and listed in `METEOPECHE_EXPERIMENTAL_MAP_PROVIDERS`.

## Bridge Discovery

The web app resolves the first available bridge in this order:

1. `window.MeteoPecheNativeMap`
2. `window.Capacitor.Plugins.MeteoPecheMap`
3. `window.Capacitor.Plugins.NativeMap`

Each command can be exposed either as a method named after the command, through `invoke({ command, payload })`, or through `postMessage({ command, payload })`.

The native app projects now include app-local Capacitor bridge code named `MeteoPecheMap`:

- Android: `android/app/src/main/java/com/meteocatch/app/MeteoPecheMapPlugin.java`, registered by `MainActivity`.
- iOS: `ios/App/App/MeteoPecheMapPlugin.swift`, registered by `AppBridgeViewController`.

Both native bridges keep a small rolling command journal, command-type counts, event journal, event-type counts, and the last `containerMetrics` payload exposed through `getDebugState`, so renderer work can confirm native command receipt, event emission, and layout alignment. The iOS bridge can now report `ready: true` for `apple-native` when that provider is explicitly enabled through the branch's default-off experimental provider gate. It owns a visible `MKMapView` lifecycle, `MKTileOverlay` registry for native marine overlay commands, `MKAnnotation` marker registries, and `MKCircle`/`MKPolyline`/`MKPolygon` shape overlay registries, all reported under `renderer` in debug state. It declares `map:apple-native:*` events and emits MapKit delegate `moveend`, `zoomend`, and annotation `click` notifications through Capacitor listeners. The Android bridge can now report `ready: true` for `google-native` when that provider is explicitly enabled and a Maps API key is configured. It owns a visible Google `MapView` lifecycle, uses a pinned `com.google.android.gms:play-services-maps` dependency, reads the API key from the `METEOPECHE_GOOGLE_MAPS_ANDROID_API_KEY` environment variable or `GOOGLE_MAPS_ANDROID_API_KEY` Gradle property, applies container metrics and camera updates, creates native Google `TileOverlay` handles for shared XYZ/WMS marine overlays, creates native Google marker/circle/polyline/polygon handles, and emits Google camera plus item `click` notifications through Capacitor listeners. Without the key, Android reports `google-maps-api-key-missing` so the web layer can fall back to Leaflet. Both scaffolds mirror the debug contract for layer membership and pin-tier visibility, plus item visibility, item type counts, native handle counts such as `nativeTileOverlayCount`, `nativeMarkerCount`, `nativeCircleCount`, `nativePolylineCount`, and `nativePolygonCount`, provider-neutral `markerCount`/`shapeCount`, provider-neutral `markerIds`/`shapeIds`, and marker class names.

## Fallback Behavior

- Native bridge readiness is strict. Before `init`, the web layer calls `getStatus({ providerId })`; the bridge must return an object like `{ ready: true, supportedProviders: ["apple-native"], bridgeProtocolVersion: 1, supportedCommands, supportedEvents }`.
- The web layer validates `bridgeProtocolVersion: 1`, all required `supportedCommands`, and all provider-scoped `supportedEvents` before accepting `ready: true`. If the bridge reports readiness without capability parity, the app falls back to Leaflet/OpenMap.
- `init` is strict. If the bridge is absent or cannot initialize, the app falls back to `leaflet-openmap`.
- Incremental commands warn once and continue. Missing marker, layer, or shape commands should not crash the app during partial native development.
- When no bridge exists, provider resolution reports `bridge-unavailable` and mounts Leaflet/OpenMap before native initialization starts.

## Commands

| Command | Purpose |
| --- | --- |
| `getStatus` | Report whether the requested native provider is ready before the web layer attempts `init`. |
| `getDebugState` | Return native scaffold debug state, including command count and the recent command journal. |
| `init` | Create the native map under the web map container and apply initial center, zoom, min zoom, max zoom, and container layout metrics. |
| `setView` | Move the map camera to a normalized `{ lat, lon }` center and zoom. |
| `invalidateSize` | Recalculate native map layout after web layout changes, using the latest container layout metrics. |
| `createTileOverlay` | Register a shared marine tile overlay, including seamarks and EMODnet WMS metadata. |
| `setLayerVisible` | Show or hide a provider layer or overlay. |
| `clearLayer` | Remove all items from a layer and clear their rendered native handles. |
| `configurePinTier` | Register progressive-pin tier metadata, including tier id, zoom range, pane, and z-index. |
| `createItem` | Create a marker-like item with normalized position, title, icon, tooltip, opacity, and event names. |
| `createItems` | Create a batch of marker-like items for progressive pins without flooding the bridge with one command per marker. |
| `addToLayer` | Attach an item or child layer to a native layer. |
| `addItemsToLayer` | Attach a batch of native items to a layer in one command. |
| `updateItem` | Patch marker position, icon, opacity, z-index, or other provider-neutral item properties. |
| `setItemVisible` | Show or hide a native item. |
| `setItemsVisible` | Show or hide a batch of native items in one command. |
| `createShapeItem` | Create a circle, polyline, or polygon with normalized stroke, fill, tooltip, and event metadata. |
| `setPinTierVisible` | Show or hide one progressive-pin tier for the current zoom. |
| `removeItem` | Destroy an item and detach it from its layer. |
| `removeFromLayer` | Detach an item from a layer without destroying the layer. |
| `destroy` | Tear down the native map instance and all bridge-owned resources. |

`supportedCommands` should include the command names above plus `isReady`. `supportedEvents` should include provider-scoped event names such as `map:apple-native:moveend` or `map:google-native:click` once a renderer can emit them.

## Payload Conventions

- Coordinates use `{ lat, lon }`, not `{ latitude, longitude }`.
- Tile overlays preserve the source overlay metadata: `id`, `name`, `type`, `url`, `minZoom`, `maxZoom`, `maxNativeZoom`, `opacity`, `layers`, `styles`, `format`, `transparent`, and `version`. Native renderers expand shared `xyz` URL templates and WMS payloads into platform tile requests, including EPSG:4326 bbox math and provider-level opacity.
- HTML-backed icons are passed as `{ className, html, iconSize, iconAnchor, tooltipAnchor, popupAnchor }`. Native implementations can render a simplified equivalent, but should keep the anchor, tooltip anchor, popup anchor, opacity, interactivity, and z-index behavior where the platform exposes those controls. Debug state reports marker anchor, tooltip-anchor, popup-anchor, opacity, and z-index payload counts for native parity checks.
- Tooltips are passed as `{ content, options }`. Native implementations can map this to callouts or lightweight labels. iOS MapKit and Android Google debug state report marker callout-ready counts; Android Google markers derive an info-window title/snippet from the marker title and tooltip content while still emitting provider-scoped click events.
- Shapes use `coordinates` for paths/polygons, `radius` for circles, and shared style keys: `color`, `weight`, `fillColor`, `fillOpacity`, `opacity`, and `dashArray`. Coordinates may be provider-neutral `[lat, lon]` pairs or `{ lat, lon }` objects; iOS MapKit and Android Google accept both direct lists and one-level nested polygon lists, map `dashArray` to platform stroke patterns, and apply stroke/fill opacity from the shared payload. Shape payloads may also include `popup` HTML/text for regulation details; native debug state reports shape popup and tooltip counts so renderer parity can be inspected. Android Google shapes use a shared info-window anchor on click to display popup or tooltip text while still emitting provider-scoped click events.
- Progressive pins may be sent through `createItems`, `addItemsToLayer`, and `setItemsVisible` so native renderers can batch marker work per tier instead of handling thousands of single-marker bridge calls during startup or viewport refresh.
- Native debug state should preserve layer membership, layer visibility, pin-tier visibility, item visibility, item type counts, and marker class names so MapKit/Google renderers can verify progressive pin ownership, optional overlay toggles, and native-only marker payloads before they report readiness.
- Layer refreshes must not leave stale map artifacts behind: `clearLayer` removes provider bookkeeping plus any rendered native marker, shape, and tile-overlay handles owned by that layer.
- Layer visibility and clearing commands should resolve or reject their bridge promises consistently. The web provider listens for those async results in debug-sensitive layer paths, clearing stale `data-map-provider-layer-error` values after successful native updates and recording a bounded diagnostic only when the bridge rejects.
- `setLayerVisible` should apply to every native item currently owned by that layer, including marker, circle, polyline, and polygon handles, so non-tile layers such as bathymetry labels, regulation shapes, anchor-watch overlays, and progressive pin tier groups keep the same visibility semantics across Leaflet, MapKit, Google Maps, and the local native debug bridge.
- `init` and `invalidateSize` include `containerMetrics` with CSS-pixel bounds (`width`, `height`, `left`, `top`, `right`, `bottom`), page scroll, visual viewport offsets/scale, and `devicePixelRatio`. Native renderers should use this to align a platform map view beneath the web UI.

## Events

The native side should send provider-scoped map events using the names returned by `nativeBridgeContract(providerId)`:

- `map:apple-native:click`
- `map:apple-native:moveend`
- `map:apple-native:zoomend`
- `map:google-native:click`
- `map:google-native:moveend`
- `map:google-native:zoomend`

Callback payloads should include `{ itemId, lat, lon }` for item clicks and `{ center: { lat, lon }, zoom }` for map movement and zoom events. The web provider also accepts common native camera variants such as `{ camera: { target: { latitude, longitude }, zoom } }`, `{ region: { center, zoom } }`, `{ target: { lat, lon }, zoomLevel }`, and `{ coordinate: { latitude, longitude } }`, normalizing them to `{ center: { lat, lon }, zoom }` before app-level handlers run. If an item-click event only includes `itemId`, the web provider falls back to the stored marker or shape payload to recover `{ lat, lng }` for app handlers.

The local native debug bridge can simulate those callbacks without a native renderer. Use `window.MeteoPecheNativeMap.emitMapEvent({ providerId, eventName, payload })`, `simulateMove({ providerId, center, zoom })`, or `simulateItemClick({ providerId, itemId, lat, lon })` to verify that web-side provider listeners, camera state, and item callbacks react to native-style events. `moveend` and `zoomend` simulation also updates `renderer.lastCameraCenter` and `renderer.lastCameraZoom` through the same payload variants accepted by the web provider. `simulateItemClick` also infers coordinates from the stored payload when `lat` and `lon` are omitted. For browser smoke tests that cannot access app-owned window objects directly, add `mapProviderDebugSimulateEvents=1`; the local bridge will auto-emit a move event and one item-click event after mount, with the click intentionally using only `itemId` to exercise coordinate fallback.

## Runtime Inspector

In a normal browser console, `window.METEOPECHE_MAP_PROVIDER_DEBUG.nativeBridgeContract("apple-native")` or `nativeBridgeContract("google-native")` returns the live bridge protocol version, required command list, event names, sample commands, and callback payloads. `nativePayloadSamples()` returns representative tile, marker, and circle payloads. `nativeBridgeDebugState(providerId)` calls `getDebugState({ providerId })` on the local or Capacitor bridge when available. The app installs this debug inspector idempotently and marks `data-map-provider-debug-inspector="ready"` so smoke tests can verify the inspector is present before reading provider diagnostics.

## Validation

Run these checks after bridge or provider changes:

1. `npm run build`
2. `npm run mobile:sync`
3. `npm run map-provider:validate`

For local native smoke testing, use `mapProviderOverride=apple-native` and `mapProviderOverride=google-native`. Without a native bridge, both should fall back to Leaflet/OpenMap with `data-map-provider-fallback-reason="bridge-unavailable"`.

For localhost or `file://` debug smoke testing, the branch can install a fake bridge and opt a native provider into the experiment through query parameters:

```text
?mapProviderOverride=apple-native&mapProviderExperimental=apple-native&mapProviderDebugBridge=1
```

Use `google-native` for both `mapProviderOverride` and `mapProviderExperimental` to exercise the Android path. The debug bridge records capability fields in `data-native-map-bridge-debug-protocol-version`, `data-native-map-bridge-debug-supported-command-count`, and `data-native-map-bridge-debug-supported-event-count` on the document element. It records command names in `data-native-map-bridge-debug-command-count`, `data-native-map-bridge-debug-last-command`, `data-native-map-bridge-debug-commands`, `data-native-map-bridge-debug-command-types`, `data-native-map-bridge-debug-command-type-counts`, `data-native-map-bridge-debug-batch-sizes`, `data-native-map-bridge-debug-container-metrics`, `data-native-map-bridge-debug-renderer-frame`, `data-native-map-bridge-debug-last-camera-center`, `data-native-map-bridge-debug-last-camera-zoom`, `data-native-map-bridge-debug-layer-count`, `data-native-map-bridge-debug-layer-membership`, `data-native-map-bridge-debug-layer-children`, `data-native-map-bridge-debug-layer-visibility`, `data-native-map-bridge-debug-tile-overlay-count`, `data-native-map-bridge-debug-tile-overlay-ids`, `data-native-map-bridge-debug-tile-overlay-types`, `data-native-map-bridge-debug-tile-overlay-visibility`, `data-native-map-bridge-debug-item-visibility`, `data-native-map-bridge-debug-item-type-counts`, `data-native-map-bridge-debug-marker-ids`, `data-native-map-bridge-debug-shape-ids`, `data-native-map-bridge-debug-marker-class-names`, `data-native-map-bridge-debug-marker-anchor-count`, `data-native-map-bridge-debug-marker-tooltip-anchor-count`, `data-native-map-bridge-debug-marker-popup-anchor-count`, `data-native-map-bridge-debug-marker-opacity-count`, `data-native-map-bridge-debug-marker-z-index-count`, `data-native-map-bridge-debug-shape-popup-count`, `data-native-map-bridge-debug-shape-tooltip-count`, `data-native-map-bridge-debug-pin-tier-count`, and `data-native-map-bridge-debug-pin-tier-visibility`. Simulated native events are recorded in `data-native-map-bridge-debug-event-count`, `data-native-map-bridge-debug-last-event`, `data-native-map-bridge-debug-event-types`, and `data-native-map-bridge-debug-event-delivered-count`. It also exposes `getDebugState({ providerId })` with `ready`, `reason`, `supportedProviders`, `bridgeProtocolVersion`, `supportedCommands`, `supportedEvents`, `commandCount`, `commandTypeCounts`, `lastContainerMetrics`, `renderer.frame`, `renderer.lastCameraCenter`, `renderer.lastCameraZoom`, `renderer.tileOverlayCount`, `renderer.tileOverlayIds`, `renderer.tileOverlayTypes`, `renderer.tileOverlayVisibility`, `renderer.layerMembership`, `renderer.layerChildren`, `renderer.layerVisibility`, `renderer.itemVisibility`, `renderer.itemTypeCounts`, `renderer.markerCount`, `renderer.markerIds`, `renderer.shapeCount`, `renderer.shapeIds`, `renderer.markerClassNames`, `renderer.markerAnchorCount`, `renderer.markerTooltipAnchorCount`, `renderer.markerPopupAnchorCount`, `renderer.markerOpacityCount`, `renderer.markerZIndexCount`, `renderer.shapePopupCount`, `renderer.shapeTooltipCount`, `renderer.pinTierVisibility`, `eventCount`, `eventTypeCounts`, recent `events`, and recent `commands`, matching the native scaffold debug-state shape plus local event-simulation telemetry.

To prove a present-but-not-ready bridge still recovers safely, add the local-only unsupported-provider switch:

```text
?mapProviderOverride=apple-native&mapProviderExperimental=apple-native&mapProviderDebugBridge=1&mapProviderDebugBridgeUnsupported=apple
?mapProviderOverride=google-native&mapProviderExperimental=google-native&mapProviderDebugBridge=1&mapProviderDebugBridgeUnsupported=google
```

Those routes should fall back to Leaflet/OpenMap with `data-map-provider-fallback-reason="mount-failed"`.

To prove a ready-looking bridge with incomplete capabilities still recovers safely, use one of the local-only capability-failure switches:

```text
?mapProviderOverride=apple-native&mapProviderExperimental=apple-native&mapProviderDebugBridge=1&mapProviderDebugBridgeCapabilityFail=protocol
?mapProviderOverride=apple-native&mapProviderExperimental=apple-native&mapProviderDebugBridge=1&mapProviderDebugBridgeCapabilityFail=commands
?mapProviderOverride=apple-native&mapProviderExperimental=apple-native&mapProviderDebugBridge=1&mapProviderDebugBridgeCapabilityFail=events
```

Those routes should fall back to Leaflet/OpenMap with `data-map-provider-fallback-reason="mount-failed"` and `data-native-map-bridge-capability-error` describing the missing capability.

The web adapters have a similar localhost/file-only SDK harness for lifecycle smoke tests without external credentials:

```text
?mapProviderOverride=google-web&mapProviderExperimental=google-web&mapProviderDebugSdk=google
?mapProviderOverride=apple-web&mapProviderExperimental=apple-web&mapProviderDebugSdk=apple
```

Those stubs only prove the app's provider interface, overlay creation, marker creation, event registration, and fallback-DOM cleanup paths. They expose lifecycle counters through `data-web-map-sdk-debug-google-overlay-count`, `data-web-map-sdk-debug-google-item-count`, `data-web-map-sdk-debug-google-event-types`, `data-web-map-sdk-debug-apple-tile-overlay-count`, `data-web-map-sdk-debug-apple-annotation-count`, `data-web-map-sdk-debug-apple-overlay-count`, and `data-web-map-sdk-debug-apple-event-types`. They do not validate real Google Maps JavaScript billing/key restrictions or Apple MapKit JS token behavior.

The same local harness can intentionally fail SDK startup to prove the provider fallback path:

```text
?mapProviderOverride=google-web&mapProviderExperimental=google-web&mapProviderDebugSdk=google&mapProviderDebugSdkFail=google
?mapProviderOverride=apple-web&mapProviderExperimental=apple-web&mapProviderDebugSdk=apple&mapProviderDebugSdkFail=apple
```

Those failure routes should recover to Leaflet/OpenMap with `data-map-provider-fallback-reason="mount-failed"`.

The app also exposes `window.METEOPECHE_MAP_PROVIDER_DEBUG.mapProviderSmokeRoutes()` for the canonical local QA route matrix and expected provider/fallback outcomes.
That matrix includes `apple-native-debug-bridge-events` and `google-native-debug-bridge-events`, which add `mapProviderDebugSimulateEvents=1` to verify native move and item-click callback normalization from the same local smoke list. Their expected metadata includes `nativeEventCountMin`, provider-scoped `nativeEventTypes`, optional click event types, and `nativeDebugDatasets` for event count and camera telemetry.
Because some browser smoke harnesses cannot read app-owned window objects directly, the debug inspector also mirrors route metadata into `data-map-provider-smoke-route-count`, `data-map-provider-smoke-route-labels`, and `data-map-provider-smoke-event-route-labels` on the document element.
The same route matrix includes native capability-failure entries for both providers, covering `protocol`, `commands`, and `events` failure modes with expected `nativeCapabilityError` or `nativeCapabilityErrorPrefix` metadata.
