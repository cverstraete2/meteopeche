import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const checks = [];

const files = {
  source: join(root, "app.js"),
  readme: join(root, "README.md"),
  buildScript: join(root, "scripts", "build.mjs"),
  styles: join(root, "styles.css"),
  index: join(root, "index.html"),
  sw: join(root, "sw.js"),
  dist: join(root, "dist", "app.js"),
  distIndex: join(root, "dist", "index.html"),
  distSw: join(root, "dist", "sw.js"),
  distConfig: join(root, "dist", "config.js"),
  ios: join(root, "ios", "App", "App", "public", "app.js"),
  android: join(root, "android", "app", "src", "main", "assets", "public", "app.js"),
  androidGradle: join(root, "android", "app", "build.gradle"),
  androidVariables: join(root, "android", "variables.gradle"),
  androidManifest: join(root, "android", "app", "src", "main", "AndroidManifest.xml"),
  androidMainActivity: join(root, "android", "app", "src", "main", "java", "com", "meteocatch", "app", "MainActivity.java"),
  androidNativeMapPlugin: join(root, "android", "app", "src", "main", "java", "com", "meteocatch", "app", "MeteoPecheMapPlugin.java"),
  iosProject: join(root, "ios", "App", "App.xcodeproj", "project.pbxproj"),
  iosStoryboard: join(root, "ios", "App", "App", "Base.lproj", "Main.storyboard"),
  iosBridgeViewController: join(root, "ios", "App", "App", "AppBridgeViewController.swift"),
  iosNativeMapPlugin: join(root, "ios", "App", "App", "MeteoPecheMapPlugin.swift"),
  docs: join(root, "docs", "platform-map-provider-strategy.md"),
  nativeBridgeDocs: join(root, "docs", "native-map-bridge-contract.md"),
};

const contents = Object.fromEntries(
  await Promise.all(Object.entries(files).map(async ([key, file]) => [key, await readFile(file, "utf8")])),
);

const providerAssetVersion = "20260603-native-layer-visibility-apply";
[
  "styles.css",
  "spots-db.js",
  "app.js",
].forEach((asset) => {
  expectIncludes(contents.index, `${asset}?v=${providerAssetVersion}`, `index uses provider asset version for ${asset}`);
  expectIncludes(contents.distIndex, `${asset}?v=${providerAssetVersion}`, `dist index uses provider asset version for ${asset}`);
});
expectIncludes(contents.sw, `meteocatch-shell-${providerAssetVersion}`, "service worker cache uses provider asset version");
expectIncludes(contents.distSw, `meteocatch-shell-${providerAssetVersion}`, "dist service worker cache uses provider asset version");

expectIncludes(contents.source, "LEAFLET_OPENMAP: \"leaflet-openmap\"", "source defines Leaflet provider id");
expectIncludes(contents.source, "APPLE_WEB: \"apple-web\"", "source defines Apple web provider id");
expectIncludes(contents.source, "APPLE_NATIVE: \"apple-native\"", "source defines Apple native provider id");
expectIncludes(contents.source, "GOOGLE_WEB: \"google-web\"", "source defines Google web provider id");
expectIncludes(contents.source, "GOOGLE_NATIVE: \"google-native\"", "source defines Google native provider id");
expectIncludes(contents.source, "[MAP_PROVIDER_IDS.LEAFLET_OPENMAP]: true", "Leaflet remains default-supported");
expectIncludes(contents.source, "[MAP_PROVIDER_IDS.APPLE_WEB]: false", "Apple web remains default-off");
expectIncludes(contents.source, "[MAP_PROVIDER_IDS.GOOGLE_WEB]: false", "Google web remains default-off");
expectIncludes(contents.source, "[MAP_PROVIDER_IDS.APPLE_NATIVE]: false", "Apple native remains default-off");
expectIncludes(contents.source, "[MAP_PROVIDER_IDS.GOOGLE_NATIVE]: false", "Google native remains default-off");

expectIncludes(contents.distConfig, "\"experimentalMapProviders\":[]", "dist config keeps experimental providers disabled");
expectIncludes(contents.distConfig, "\"enableGoogleMapsWeb\":false", "dist config keeps Google web disabled");
expectIncludes(contents.distConfig, "\"enableAppleMapsWeb\":false", "dist config keeps Apple web disabled");

[
  "class LeafletMapProvider",
  "class GoogleMapsWebProvider",
  "class AppleMapsWebProvider",
  "class NativeBridgeMapProvider",
  "nativeBridgeContract",
  "mapProviderSmokeRoutes",
  "nativePayloadSamples",
  "providerMatrix",
  "providerState",
  "bridgeAvailable",
  "mountReady",
  "has-map-provider",
  "clearFallbackMapDom",
  "waitForLeafletLibrary",
  "isLeafletLibraryReady",
  "mapProviderMountError",
  "mapProviderMountStep",
  "ensureDefaultPanes",
  "setProviderLayerVisible",
  "mapProviderLayerError",
  "markMapProviderMountStep",
  "leafletDefinedOptions",
  "assertNativeMapBridgeReady",
  "nativeMapBridgeStatus",
  "nativeMapBridgeDebugState",
  "nativeMapBridgeStatusReady",
  "installLocalNativeMapBridgeDebug",
  "localExperimentalMapProviders",
  "installLocalWebMapSdkDebug",
  "localWebMapSdkDebugEnabled",
  "localWebMapSdkDebugFailureEnabled",
  "createLocalGoogleMapsDebugSdk",
  "createLocalAppleMapKitDebugSdk",
].forEach((needle) => {
  expectIncludes(contents.source, needle, `source includes ${needle}`);
  expectIncludes(contents.dist, needle, `dist includes ${needle}`);
  expectIncludes(contents.ios, needle, `iOS bundle includes ${needle}`);
  expectIncludes(contents.android, needle, `Android bundle includes ${needle}`);
});
expectIncludes(contents.source, "els.mapTiles.replaceChildren()", "source clears fallback tile DOM when provider mounts");
expectIncludes(contents.source, "els.mapMarkers.replaceChildren()", "source clears fallback marker DOM when provider mounts");
expectIncludes(contents.source, "\"has-map-provider\",", "source removes provider ownership class on failed mount cleanup");
expectIncludes(contents.source, "delete els.spotMap._leaflet_id", "source clears partial Leaflet container id on failed mount cleanup");
expectIncludes(contents.sw, "styles.css", "service worker tracks styles asset");
expectIncludes(contents.source, "experimentalMapProviders().includes(providerId)", "runtime filters experimental provider ids");
expectIncludes(contents.buildScript, "validMapProviderIds", "build script filters experimental provider ids");
expectIncludes(contents.buildScript, "\"leaflet-openmap\", \"apple-web\", \"apple-native\", \"google-web\", \"google-native\"", "build script lists valid provider ids");
expectIncludes(contents.readme, "npm run map-provider:validate", "README mentions provider validation command");
expectIncludes(contents.readme, "METEOPECHE_EXPERIMENTAL_MAP_PROVIDERS", "README documents experimental provider env");
expectIncludes(contents.readme, "bridge-unavailable", "README documents native bridge fallback reason");
expectIncludes(contents.readme, "getStatus({ providerId })", "README documents native bridge readiness check");
expectIncludes(contents.readme, "docs/native-map-bridge-contract.md", "README links native bridge contract");
expectIncludes(contents.readme, "`MeteoPecheMap` Capacitor bridge code", "README documents native Capacitor bridge code");
expectIncludes(contents.readme, "getDebugState", "README documents native scaffold debug state");
expectIncludes(contents.readme, "nativeBridgeDebugState(providerId)", "README documents debug-state inspector");
expectIncludes(contents.readme, "mapProviderDebugBridge=1", "README documents local native debug bridge");
expectIncludes(contents.readme, "layer membership, layer visibility, pin-tier visibility", "README documents local native debug bridge layer and pin-tier telemetry");
expectIncludes(contents.readme, "`createItems`, `addItemsToLayer`, and `setItemsVisible`", "README documents native progressive-pin batch commands");
expectIncludes(contents.readme, "`containerMetrics`", "README documents native container metrics");
expectIncludes(contents.readme, "command-type counts", "README documents native scaffold command-type counts");
expectIncludes(contents.readme, "last received `containerMetrics`", "README documents native scaffold last container metrics");
expectIncludes(contents.readme, "default-off `apple-native` MapKit renderer", "README documents default-off iOS MapKit renderer");
expectIncludes(contents.readme, "`MKTileOverlay` registry", "README documents iOS MapKit tile overlay registry");
expectIncludes(contents.readme, "MapKit marker annotations and shape overlays", "README documents iOS MapKit marker and shape registries");
expectIncludes(contents.readme, "layer membership, layer visibility, and pin-tier visibility", "README documents native layer membership and pin-tier visibility");
expectIncludes(contents.readme, "default-off `google-native` Google `MapView` renderer groundwork", "README documents default-off Android Google renderer state");
expectIncludes(contents.readme, "Shared XYZ and WMS marine overlay payloads now create native Google `TileOverlay` handles", "README documents Android native tile overlay rendering");
expectIncludes(contents.readme, "marker, circle, polyline, and polygon payloads create native Google Maps handles", "README documents Android native marker and shape rendering");
expectIncludes(contents.readme, "`METEOPECHE_GOOGLE_MAPS_ANDROID_API_KEY`", "README documents Android Google Maps API-key placeholder");
expectIncludes(contents.readme, "google-maps-api-key-missing", "README documents Android missing-key fallback");
expectIncludes(contents.readme, "`emitMapEvent`", "README documents local native event simulation");
expectIncludes(contents.readme, "`simulateMove`", "README documents local native move simulation");
expectIncludes(contents.readme, "`simulateItemClick`", "README documents local native item-click simulation");
expectIncludes(contents.readme, "mapProviderDebugSimulateEvents=1", "README documents automatic local native event simulation");
expectIncludes(contents.readme, "`camera.target`", "README documents native camera target event normalization");
expectIncludes(contents.readme, "`zoomLevel`", "README documents native zoomLevel event normalization");
expectIncludes(contents.readme, "`bridgeProtocolVersion`", "README documents native bridge protocol version");
expectIncludes(contents.readme, "`supportedCommands`", "README documents native bridge supported commands");
expectIncludes(contents.readme, "`supportedEvents`", "README documents native bridge supported events");
expectIncludes(contents.readme, "validates those capabilities before accepting `ready: true`", "README documents native bridge capability validation");
expectIncludes(contents.readme, "mapProviderDebugBridgeUnsupported=apple", "README documents local native bridge unsupported-provider route");
expectIncludes(contents.readme, "mapProviderDebugBridgeCapabilityFail=protocol", "README documents local native bridge capability failure route");
expectIncludes(contents.readme, "mapProviderDebugSdk=google", "README documents local Google web debug SDK");
expectIncludes(contents.readme, "mapProviderDebugSdk=apple", "README documents local Apple web debug SDK");
expectIncludes(contents.readme, "mapProviderExperimental=google-web&mapProviderDebugSdk=google", "README documents Google web debug experimental enable route");
expectIncludes(contents.readme, "mapProviderExperimental=apple-web&mapProviderDebugSdk=apple", "README documents Apple web debug experimental enable route");
expectIncludes(contents.readme, "mapProviderDebugSdkFail=google", "README documents local Google web debug failure route");
expectIncludes(contents.readme, "data-map-provider-fallback-reason=\"mount-failed\"", "README documents web debug failure fallback reason");
expectIncludes(contents.readme, "mapProviderSmokeRoutes()", "README documents provider smoke route inspector");
expectIncludes(contents.docs, "npm run map-provider:validate", "strategy doc mentions provider validation command");
expectIncludes(contents.docs, "20260603-native-layer-visibility-apply", "strategy doc mentions provider cache version");
expectIncludes(contents.docs, "bridge-unavailable", "strategy doc mentions native bridge unavailable fallback");
expectIncludes(contents.docs, "strict native bridge readiness handshake", "strategy doc records native bridge readiness handshake");
expectIncludes(contents.docs, "mapProviderDebugBridgeUnsupported", "strategy doc records native bridge unsupported-provider smoke switch");
expectIncludes(contents.docs, "Capacitor `MeteoPecheMap` plugin scaffolds", "strategy doc records native Capacitor bridge scaffolds");
expectIncludes(contents.docs, "rolling native command journal", "strategy doc records native scaffold command journal");
expectIncludes(contents.docs, "nativeBridgeDebugState(providerId)", "strategy doc records native bridge debug-state inspector");
expectIncludes(contents.docs, "getDebugState().renderer", "strategy doc records debug bridge renderer state");
expectIncludes(contents.docs, "createItems", "strategy doc records native progressive-pin batch commands");
expectIncludes(contents.docs, "containerMetrics", "strategy doc records native container metrics");
expectIncludes(contents.docs, "command-type counts", "strategy doc records native scaffold command-type counts");
expectIncludes(contents.docs, "last received `containerMetrics`", "strategy doc records native scaffold last container metrics");
expectIncludes(contents.docs, "default-off iOS MapKit renderer", "strategy doc records default-off iOS MapKit renderer lifecycle");
expectIncludes(contents.docs, "iOS `MKTileOverlay` registry", "strategy doc records iOS MapKit tile overlay registry");
expectIncludes(contents.docs, "iOS MapKit marker and shape registries", "strategy doc records iOS MapKit marker and shape registries");
expectIncludes(contents.docs, "native layer-membership and pin-tier registries", "strategy doc records dormant native layer and pin-tier registries");
expectIncludes(contents.docs, "default-off Android `google-native` renderer groundwork", "strategy doc records default-off Android Google renderer state");
expectIncludes(contents.docs, "creates native Google `TileOverlay` handles for shared XYZ/WMS marine overlay payloads", "strategy doc records Android native tile overlay rendering");
expectIncludes(contents.docs, "creates native Google marker/circle/polyline/polygon handles", "strategy doc records Android native marker and shape rendering");
expectNotIncludes(contents.docs, "There is no native map plugin installed yet", "strategy doc avoids stale native plugin absence wording");
expectIncludes(contents.docs, "`play-services-maps` dependency", "strategy doc records Android Google Maps SDK wiring");
expectIncludes(contents.docs, "google-maps-api-key-missing", "strategy doc records Android missing-key fallback");
expectIncludes(contents.docs, "event simulation", "strategy doc records local native event simulation");
expectIncludes(contents.docs, "camera.target", "strategy doc records native camera event normalization");
expectIncludes(contents.docs, "zoomLevel", "strategy doc records native zoomLevel event normalization");
expectIncludes(contents.docs, "bridgeProtocolVersion", "strategy doc records native bridge protocol version");
expectIncludes(contents.docs, "supportedCommands", "strategy doc records native bridge supported commands");
expectIncludes(contents.docs, "supportedEvents", "strategy doc records native bridge supported events");
expectIncludes(contents.docs, "validates protocol version, required commands, and provider-scoped events", "strategy doc records native bridge capability validation");
expectIncludes(contents.docs, "mapProviderDebugSdkFail", "strategy doc records local web SDK failure switch");
expectIncludes(contents.docs, "mapProviderSmokeRoutes()", "strategy doc records provider smoke route inspector");
expectIncludes(contents.docs, "mapProviderExperimental", "strategy doc records experimental provider smoke gating");

[
  "bridge-unavailable",
  "document.documentElement.dataset.mapProviderMountReady",
  "isMapProviderMountReady",
  "isNativeMapBridgeAvailable",
  "isNativeMapProvider",
  "commandWarnings",
  "clearLayerError",
  "recordLayerError",
  "result && typeof result.then === \"function\"",
  "commandFailureMode",
  "nativeMapBridgeReady",
  "strict fallback",
  "warn once and continue",
].forEach((needle) => {
  expectIncludes(contents.source, needle, `source includes ${needle}`);
  expectIncludes(contents.dist, needle, `dist includes ${needle}`);
});
expectIncludes(
  contents.source,
  "return promise;\n    }\n    if (nativeItems.length > 0) this.setItemsVisible(nativeItems, this.visible);",
  "source preserves native layer visibility promise for all-item layers",
);

[
  "getStatus",
  "getDebugState",
  "init",
  "setView",
  "invalidateSize",
  "createTileOverlay",
  "setLayerVisible",
  "clearLayer",
  "configurePinTier",
  "createItem",
  "createItems",
  "addToLayer",
  "addItemsToLayer",
  "updateItem",
  "setItemVisible",
  "setItemsVisible",
  "createShapeItem",
  "setPinTierVisible",
  "removeItem",
  "removeFromLayer",
  "destroy",
].forEach((command) => {
  expectIncludes(contents.source, `${command}:`, `native bridge contract documents ${command}`);
});

[
  "mapOverlayTileUrl",
  "tileBbox4326",
  "nativeTileOverlayPayload",
  "nativeMarkerPayload",
  "nativeShapePayload",
  "nativeDivIconPayload",
  "nativeTooltipPayload",
  "nativeEventCenter",
  "nativeEventZoom",
  "nativeMapContainerMetrics",
].forEach((helper) => {
  expectIncludes(contents.source, `function ${helper}`, `source defines ${helper}`);
});

expectIncludes(contents.docs, "nativeBridgeContract(providerId)", "strategy doc mentions native bridge contract inspector");
expectIncludes(contents.docs, "Default builds still support only Leaflet/OpenMap", "strategy doc records default Leaflet safety");
expectIncludes(contents.docs, "Smoke-tested the local override matrix", "strategy doc records provider override smoke coverage");
expectIncludes(contents.docs, "mapProviderDebugBridge=1", "strategy doc records native debug bridge path");
expectIncludes(contents.docs, "mapProviderDebugSdk", "strategy doc records web debug SDK path");
expectIncludes(contents.nativeBridgeDocs, "Native Map Bridge Contract", "native bridge contract doc has title");
expectIncludes(contents.nativeBridgeDocs, "window.MeteoPecheNativeMap", "native bridge contract doc lists window bridge");
expectIncludes(contents.nativeBridgeDocs, "Capacitor.Plugins.MeteoPecheMap", "native bridge contract doc lists Capacitor app bridge");
expectIncludes(contents.nativeBridgeDocs, "Capacitor.Plugins.NativeMap", "native bridge contract doc lists generic Capacitor bridge");
expectIncludes(contents.nativeBridgeDocs, "MeteoPecheMapPlugin.java", "native bridge contract doc documents Android native scaffold");
expectIncludes(contents.nativeBridgeDocs, "MeteoPecheMapPlugin.swift", "native bridge contract doc documents iOS native scaffold");
expectIncludes(contents.nativeBridgeDocs, "iOS bridge can now report `ready: true` for `apple-native`", "native bridge contract doc states iOS native readiness");
expectIncludes(contents.nativeBridgeDocs, "Android bridge can now report `ready: true` for `google-native`", "native bridge contract doc states Android native readiness");
expectIncludes(contents.nativeBridgeDocs, "getDebugState", "native bridge contract doc documents native scaffold debug state");
expectIncludes(contents.nativeBridgeDocs, "nativeBridgeDebugState(providerId)", "native bridge contract doc documents debug-state inspector");
expectIncludes(contents.nativeBridgeDocs, "data-map-provider-debug-inspector=\"ready\"", "native bridge contract doc documents debug inspector readiness");
expectIncludes(contents.nativeBridgeDocs, "rolling command journal", "native bridge contract doc documents native scaffold command journal");
expectIncludes(contents.nativeBridgeDocs, "command-type counts", "native bridge contract doc documents native scaffold command-type counts");
expectIncludes(contents.nativeBridgeDocs, "last `containerMetrics`", "native bridge contract doc documents native scaffold last container metrics");
expectIncludes(contents.nativeBridgeDocs, "bridge-unavailable", "native bridge contract doc documents bridge fallback");
expectIncludes(contents.nativeBridgeDocs, "getStatus({ providerId })", "native bridge contract doc documents status readiness payload");
expectIncludes(contents.nativeBridgeDocs, "bridgeProtocolVersion: 1", "native bridge contract doc documents protocol version");
expectIncludes(contents.nativeBridgeDocs, "supportedCommands", "native bridge contract doc documents supported commands");
expectIncludes(contents.nativeBridgeDocs, "supportedEvents", "native bridge contract doc documents supported events");
expectIncludes(contents.nativeBridgeDocs, "data-native-map-bridge-capability-error", "native bridge contract doc documents capability error telemetry");
expectIncludes(contents.nativeBridgeDocs, "mapProviderDebugBridgeCapabilityFail=protocol", "native bridge contract doc documents protocol capability failure route");
expectIncludes(contents.nativeBridgeDocs, "mapProviderDebugBridgeCapabilityFail=commands", "native bridge contract doc documents command capability failure route");
expectIncludes(contents.nativeBridgeDocs, "mapProviderDebugBridgeCapabilityFail=events", "native bridge contract doc documents event capability failure route");
expectIncludes(contents.nativeBridgeDocs, "supportedProviders: [\"apple-native\"], bridgeProtocolVersion: 1", "native bridge contract doc documents capability-ready status shape");
expectIncludes(contents.nativeBridgeDocs, "map:apple-native:click", "native bridge contract doc documents Apple click event");
expectIncludes(contents.nativeBridgeDocs, "map:google-native:moveend", "native bridge contract doc documents Google move event");
expectIncludes(contents.nativeBridgeDocs, "emitMapEvent", "native bridge contract doc documents debug bridge event emission");
expectIncludes(contents.nativeBridgeDocs, "simulateMove", "native bridge contract doc documents debug bridge move simulation");
expectIncludes(contents.nativeBridgeDocs, "simulateItemClick", "native bridge contract doc documents debug bridge item-click simulation");
expectIncludes(contents.nativeBridgeDocs, "mapProviderDebugSimulateEvents=1", "native bridge contract doc documents automatic event simulation");
expectIncludes(contents.nativeBridgeDocs, "camera: { target: { latitude, longitude }, zoom }", "native bridge contract doc documents camera target payloads");
expectIncludes(contents.nativeBridgeDocs, "zoomLevel", "native bridge contract doc documents zoomLevel payloads");
expectIncludes(contents.nativeBridgeDocs, "item-click event only includes `itemId`", "native bridge contract doc documents item-click coordinate fallback");
expectIncludes(contents.nativeBridgeDocs, "simulateItemClick` also infers coordinates", "native bridge contract doc documents debug item-click coordinate inference");
expectIncludes(contents.nativeBridgeDocs, "click intentionally using only `itemId`", "native bridge contract doc documents automatic item-only click simulation");
expectIncludes(contents.nativeBridgeDocs, "data-native-map-bridge-debug-command-count", "native bridge contract doc documents debug command counter");
expectIncludes(contents.nativeBridgeDocs, "data-native-map-bridge-debug-protocol-version", "native bridge contract doc documents debug protocol version");
expectIncludes(contents.nativeBridgeDocs, "data-native-map-bridge-debug-supported-command-count", "native bridge contract doc documents debug supported command counter");
expectIncludes(contents.nativeBridgeDocs, "data-native-map-bridge-debug-supported-event-count", "native bridge contract doc documents debug supported event counter");
expectIncludes(contents.nativeBridgeDocs, "data-native-map-bridge-debug-command-types", "native bridge contract doc documents debug command types");
expectIncludes(contents.nativeBridgeDocs, "data-native-map-bridge-debug-command-type-counts", "native bridge contract doc documents debug command type counts");
expectIncludes(contents.nativeBridgeDocs, "data-native-map-bridge-debug-batch-sizes", "native bridge contract doc documents debug batch sizes");
expectIncludes(contents.nativeBridgeDocs, "data-native-map-bridge-debug-layer-count", "native bridge contract doc documents debug layer count");
expectIncludes(contents.nativeBridgeDocs, "renderer.layerMembership", "native bridge contract doc documents debug renderer layer membership");
expectIncludes(contents.nativeBridgeDocs, "data-native-map-bridge-debug-layer-visibility", "native bridge contract doc documents debug renderer layer visibility data attribute");
expectIncludes(contents.nativeBridgeDocs, "renderer.layerVisibility", "native bridge contract doc documents debug renderer layer visibility");
expectIncludes(contents.nativeBridgeDocs, "`setLayerVisible` should apply to every native item currently owned by that layer", "native bridge contract doc requires layer visibility to apply to member items");
expectIncludes(contents.nativeBridgeDocs, "renderer.itemVisibility", "native bridge contract doc documents debug renderer item visibility");
expectIncludes(contents.nativeBridgeDocs, "renderer.pinTierVisibility", "native bridge contract doc documents debug renderer pin-tier visibility");
expectIncludes(contents.nativeBridgeDocs, "shape popup and tooltip counts", "native bridge contract doc documents shape popup and tooltip debug telemetry");
expectIncludes(contents.nativeBridgeDocs, "data-native-map-bridge-debug-container-metrics", "native bridge contract doc documents debug container metrics");
expectIncludes(contents.nativeBridgeDocs, "visible `MKMapView` lifecycle", "native bridge contract doc documents active iOS MapKit renderer lifecycle");
expectIncludes(contents.nativeBridgeDocs, "`MKTileOverlay` registry", "native bridge contract doc documents iOS MapKit tile overlay registry");
expectIncludes(contents.nativeBridgeDocs, "`MKAnnotation` marker registries", "native bridge contract doc documents dormant iOS MapKit marker registry");
expectIncludes(contents.nativeBridgeDocs, "`MKCircle`/`MKPolyline`/`MKPolygon` shape overlay registries", "native bridge contract doc documents dormant iOS MapKit shape registry");
expectIncludes(contents.nativeBridgeDocs, "visible Google `MapView` lifecycle", "native bridge contract doc documents active Android Google renderer state");
expectIncludes(contents.nativeBridgeDocs, "google-maps-api-key-missing", "native bridge contract doc documents Android missing-key fallback");
expectIncludes(contents.nativeBridgeDocs, "creates native Google `TileOverlay` handles for shared XYZ/WMS marine overlays", "native bridge contract doc documents Android native tile overlay rendering");
expectIncludes(contents.nativeBridgeDocs, "creates native Google marker/circle/polyline/polygon handles", "native bridge contract doc documents Android native marker and shape rendering");
expectIncludes(contents.nativeBridgeDocs, "layer membership, layer visibility, pin-tier visibility", "native bridge contract doc documents native layer and pin-tier debug state");
expectIncludes(contents.nativeBridgeDocs, "com.google.android.gms:play-services-maps", "native bridge contract doc documents pending Android Google Maps SDK dependency");
expectIncludes(contents.nativeBridgeDocs, "data-native-map-bridge-debug-event-count", "native bridge contract doc documents debug event counter");
expectIncludes(contents.nativeBridgeDocs, "data-native-map-bridge-debug-event-delivered-count", "native bridge contract doc documents debug event delivery counter");
expectIncludes(contents.nativeBridgeDocs, "eventTypeCounts", "native bridge contract doc documents debug event type counts");
expectIncludes(contents.nativeBridgeDocs, "`containerMetrics`", "native bridge contract doc documents native container metrics payload");
expectIncludes(contents.nativeBridgeDocs, "`devicePixelRatio`", "native bridge contract doc documents native pixel ratio");
expectIncludes(contents.nativeBridgeDocs, "mapProviderDebugBridgeUnsupported=apple", "native bridge contract doc documents Apple unsupported bridge route");
expectIncludes(contents.nativeBridgeDocs, "mapProviderDebugBridgeUnsupported=google", "native bridge contract doc documents Google unsupported bridge route");
expectIncludes(contents.nativeBridgeDocs, "mapProviderDebugSdk=google", "native bridge contract doc documents Google web debug SDK");
expectIncludes(contents.nativeBridgeDocs, "mapProviderDebugSdk=apple", "native bridge contract doc documents Apple web debug SDK");
expectIncludes(contents.nativeBridgeDocs, "mapProviderDebugSdkFail=google", "native bridge contract doc documents Google web debug failure route");
expectIncludes(contents.nativeBridgeDocs, "mapProviderDebugSdkFail=apple", "native bridge contract doc documents Apple web debug failure route");
expectIncludes(contents.nativeBridgeDocs, "data-map-provider-fallback-reason=\"mount-failed\"", "native bridge contract doc documents web debug failure fallback reason");
expectIncludes(contents.nativeBridgeDocs, "mapProviderSmokeRoutes()", "native bridge contract doc documents provider smoke route inspector");
expectIncludes(contents.nativeBridgeDocs, "data-web-map-sdk-debug-google-overlay-count", "native bridge contract doc documents Google web debug overlay count");
expectIncludes(contents.nativeBridgeDocs, "data-web-map-sdk-debug-apple-annotation-count", "native bridge contract doc documents Apple web debug annotation count");
expectIncludes(contents.source, "document.documentElement.dataset.nativeMapBridgeDebugCommandCount", "source records debug native command count");
expectIncludes(contents.source, "document.documentElement.dataset.nativeMapBridgeDebugCommandTypes", "source records debug native command types");
expectIncludes(contents.source, "document.documentElement.dataset.nativeMapBridgeDebugCommandTypeCounts", "source records debug native command type counts");
expectIncludes(contents.source, "document.documentElement.dataset.nativeMapBridgeDebugBatchSizes", "source records debug native batch sizes");
expectIncludes(contents.source, "document.documentElement.dataset.nativeMapBridgeDebugContainerMetrics", "source records debug native container metrics");
expectIncludes(contents.source, "document.documentElement.dataset.nativeMapBridgeDebugEventCount", "source records debug native event count");
expectIncludes(contents.source, "document.documentElement.dataset.nativeMapBridgeDebugEventTypes", "source records debug native event types");
expectIncludes(contents.source, "document.documentElement.dataset.nativeMapBridgeDebugEventDeliveredCount", "source records debug native event delivery count");
expectIncludes(contents.source, "document.documentElement.dataset.nativeMapBridgeDebugStatus", "source records debug native readiness status");
expectIncludes(contents.source, "containerMetrics: nativeMapContainerMetrics(this.container)", "source sends native container metrics");
expectIncludes(contents.source, "visualViewportScale", "source includes visual viewport scale in native container metrics");
expectIncludes(contents.source, "devicePixelRatio", "source includes device pixel ratio in native container metrics");
expectIncludes(contents.source, "NATIVE_MAP_BRIDGE_PROTOCOL_VERSION", "source defines native bridge protocol version");
expectIncludes(contents.source, "NATIVE_MAP_BRIDGE_COMMANDS", "source defines native bridge command capability list");
expectIncludes(contents.source, "NATIVE_MAP_BRIDGE_EVENTS", "source defines native bridge event capability list");
expectIncludes(contents.source, "function nativeMapBridgeCapabilityReport", "source validates native bridge capability report");
expectIncludes(contents.source, "nativeMapBridgeCapabilityError", "source records native bridge capability errors");
expectIncludes(contents.source, "missingCommands", "source checks native bridge missing commands");
expectIncludes(contents.source, "missingEvents", "source checks native bridge missing events");
expectIncludes(contents.source, "mapProviderDebugBridgeCapabilityFail", "source exposes local native bridge capability failure route");
expectIncludes(contents.source, "supportedCommands,", "source returns native supported commands");
expectIncludes(contents.source, "supportedEvents,", "source returns native supported events");
expectIncludes(contents.source, "const { supportedCommands, supportedEvents } = recordCapabilities(providerId)", "source reports native supported events");
expectIncludes(contents.source, "nativeMapBridgeDebugProtocolVersion", "source records native bridge debug protocol version");
expectIncludes(contents.source, "nativeMapBridgeDebugSupportedCommandCount", "source records native bridge debug supported command count");
expectIncludes(contents.source, "nativeMapBridgeDebugSupportedEventCount", "source records native bridge debug supported event count");
expectIncludes(contents.source, "getDebugState({ providerId } = {})", "source local native debug bridge exposes debug state");
expectIncludes(contents.source, "function installMapProviderDebugInspector", "source installs map provider debug inspector idempotently");
expectIncludes(contents.source, "document.documentElement.dataset.mapProviderDebugInspector = \"ready\"", "source records debug inspector readiness");
expectIncludes(contents.source, "commands: commands.slice(-80)", "source local native debug bridge returns recent command journal");
expectIncludes(contents.source, "commandTypeCounts: commandTypeCounts()", "source local native debug bridge exposes command type counts");
expectIncludes(contents.source, "renderer: debugRendererState(providerId)", "source local native debug bridge exposes renderer state");
expectIncludes(contents.source, "layerMembershipState", "source local native debug bridge tracks layer membership");
expectIncludes(contents.source, "layerChildrenState", "source local native debug bridge tracks child layer membership");
expectIncludes(contents.source, "layerVisibilityState", "source local native debug bridge tracks layer visibility");
expectIncludes(contents.source, "setLayerItemVisibility", "source local native debug bridge applies layer visibility to member items");
expectIncludes(contents.source, "payload.isLayer === true", "source local native debug bridge records child layer membership");
expectIncludes(contents.source, "setLayerItemVisibility(childLayerId, visible, visitedLayerIds)", "source local native debug bridge cascades layer visibility to child layers");
expectIncludes(contents.source, "nativeMapBridgeDebugLayerChildren", "source records native bridge debug child layer membership");
expectIncludes(contents.source, "nativeMapBridgeDebugLayerVisibility", "source records native bridge debug layer visibility");
expectIncludes(contents.source, "itemVisibilityState", "source local native debug bridge tracks item visibility");
expectIncludes(contents.source, "itemTypeCountsState", "source local native debug bridge tracks item type counts");
expectIncludes(contents.source, "itemPayloads = new Map()", "source local native debug bridge tracks item payloads");
expectIncludes(contents.source, "markerPayloadCount", "source local native debug bridge counts marker payload fields");
expectIncludes(contents.source, "shapePayloadCount", "source local native debug bridge counts shape payload fields");
expectIncludes(contents.source, "markerClassNamesState", "source local native debug bridge tracks marker class names");
expectIncludes(contents.source, "nativeMapBridgeDebugItemTypeCounts", "source records native bridge debug item type counts");
expectIncludes(contents.source, "nativeMapBridgeDebugMarkerClassNames", "source records native bridge debug marker class names");
expectIncludes(contents.source, "nativeMapBridgeDebugMarkerAnchorCount", "source records native bridge debug marker anchor count");
expectIncludes(contents.source, "nativeMapBridgeDebugMarkerOpacityCount", "source records native bridge debug marker opacity count");
expectIncludes(contents.source, "nativeMapBridgeDebugMarkerZIndexCount", "source records native bridge debug marker z-index count");
expectIncludes(contents.source, "nativeMapBridgeDebugShapePopupCount", "source records native bridge debug shape popup count");
expectIncludes(contents.source, "nativeMapBridgeDebugShapeTooltipCount", "source records native bridge debug shape tooltip count");
expectIncludes(contents.source, "pinTierVisibilityState", "source local native debug bridge tracks pin-tier visibility");
expectIncludes(contents.source, "item.setMap(this.visible)", "source native layers explicitly sync item visibility on add");
expectIncludes(contents.source, "this.setItemsVisible(nativeItems, this.visible)", "source native batch layers explicitly sync item visibility on add");
expectIncludes(contents.source, "map: layer?.map ?? null", "source Google web markers defer unlayered map attachment");
expectIncludes(contents.source, "batchGroup.setMap(layer.map)", "source web marker batches inherit parent layer visibility");
["source", "dist", "ios", "android"].forEach((bundle) => {
  expectProviderPinTierLayerVisibility(contents[bundle], bundle);
  expectGoogleWebShapeLayerDeferral(contents[bundle], bundle);
  expectGoogleShapePopupParity(contents[bundle], bundle);
  expectWebShapeCenterFallback(contents[bundle], bundle);
  expectWebProviderCoordinateNormalization(contents[bundle], bundle);
  expectAppleShapePopupParity(contents[bundle], bundle);
});
expectIncludes(contents.source, "class GoogleMapsWebHtmlMarker", "source keeps Google HTML marker adapter");
expectNotIncludes(classRegion(contents.source, "GoogleMapsWebHtmlMarker", "AppleMapsWebProvider"), "cleanupGoogleMapItem(this)", "Google HTML marker hide/show preserves listeners");
expectIncludes(contents.source, "document.documentElement.dataset.nativeMapBridgeDebugLayerCount", "source local native debug bridge records DOM layer count");
expectIncludes(contents.source, "document.documentElement.dataset.nativeMapBridgeDebugItemVisibility", "source local native debug bridge records DOM item visibility");
expectIncludes(contents.source, "document.documentElement.dataset.nativeMapBridgeDebugPinTierCount", "source local native debug bridge records DOM pin-tier count");
expectIncludes(contents.source, "lastContainerMetrics: lastContainerMetrics()", "source local native debug bridge exposes last container metrics");
expectIncludes(contents.source, "eventTypeCounts: eventTypeCounts()", "source local native debug bridge exposes event type counts");
expectIncludes(contents.source, "emitMapEvent({ providerId, eventName, payload = {} } = {})", "source local native debug bridge emits provider events");
expectIncludes(contents.source, "simulateMove({ providerId, center, zoom } = {})", "source local native debug bridge simulates move events");
expectIncludes(contents.source, "simulateItemClick({ providerId, itemId, lat, lon } = {})", "source local native debug bridge simulates item click events");
expectIncludes(contents.source, "mapProviderDebugSimulateEvents", "source local native debug bridge supports automatic event simulation");
expectIncludes(contents.source, "nativeEventCenter(payload)", "source normalizes native event centers");
expectIncludes(contents.source, "nativeEventZoom(payload)", "source normalizes native event zoom");
expectIncludes(contents.source, "nativePayloadLatLng", "source derives fallback native item-click coordinates from item payloads");
expectIncludes(contents.source, "payload.latlng ?? this.itemEventLatLng(payload.itemId)", "source falls back native item events to stored item coordinates");
expectIncludes(contents.source, "nativePayloadLatLng(itemPayloads.get(itemId))", "local native debug bridge simulates item clicks from stored item payloads");
expectIncludes(contents.source, "bridge.simulateItemClick({\n          providerId,\n          itemId,\n        })", "local native debug bridge auto-simulates item-only clicks");
expectIncludes(contents.source, "payload.camera?.target", "source supports native camera target event payloads");
expectIncludes(contents.source, "payload.zoomLevel", "source supports native zoomLevel event payloads");
expectIncludes(contents.source, "supportedProviders = [MAP_PROVIDER_IDS.APPLE_NATIVE, MAP_PROVIDER_IDS.GOOGLE_NATIVE]", "source debug bridge advertises native provider support");
expectIncludes(contents.source, "mapProviderDebugBridgeUnsupported", "source supports local native unsupported-provider smoke switch");
expectIncludes(contents.source, "window.MeteoPecheNativeMap = bridge", "source installs local native debug bridge");
expectIncludes(contents.source, "document.documentElement.dataset.webMapSdkDebugGoogle", "source records local Google web debug SDK");
expectIncludes(contents.source, "document.documentElement.dataset.webMapSdkDebugApple", "source records local Apple web debug SDK");
expectIncludes(contents.source, "document.documentElement.dataset.webMapSdkDebugGoogleOverlayCount", "source records local Google web overlay count");
expectIncludes(contents.source, "document.documentElement.dataset.webMapSdkDebugGoogleItemCount", "source records local Google web item count");
expectIncludes(contents.source, "document.documentElement.dataset.webMapSdkDebugGoogleEventTypes", "source records local Google web event types");
expectIncludes(contents.source, "document.documentElement.dataset.webMapSdkDebugAppleTileOverlayCount", "source records local Apple web tile overlay count");
expectIncludes(contents.source, "document.documentElement.dataset.webMapSdkDebugAppleAnnotationCount", "source records local Apple web annotation count");
expectIncludes(contents.source, "document.documentElement.dataset.webMapSdkDebugAppleOverlayCount", "source records local Apple web overlay count");
expectIncludes(contents.source, "document.documentElement.dataset.webMapSdkDebugAppleEventTypes", "source records local Apple web event types");
expectIncludes(contents.androidMainActivity, "registerPlugin(MeteoPecheMapPlugin.class)", "Android registers local MeteoPecheMap plugin");
expectIncludes(contents.androidVariables, "googlePlayServicesMapsVersion = '19.2.0'", "Android pins Google Maps SDK version");
expectIncludes(contents.androidGradle, "com.google.android.gms:play-services-maps:$googlePlayServicesMapsVersion", "Android app depends on Maps SDK");
expectIncludes(contents.androidGradle, "METEOPECHE_GOOGLE_MAPS_ANDROID_API_KEY", "Android app reads Maps API key from env");
expectIncludes(contents.androidManifest, "com.google.android.geo.API_KEY", "Android manifest declares Google Maps API-key metadata");
expectIncludes(contents.androidManifest, "${GOOGLE_MAPS_ANDROID_API_KEY}", "Android manifest uses Maps API-key placeholder");
expectIncludes(contents.androidNativeMapPlugin, "@CapacitorPlugin(name = \"MeteoPecheMap\")", "Android native map plugin exposes MeteoPecheMap name");
expectIncludes(contents.androidNativeMapPlugin, "implements OnMapReadyCallback", "Android native map plugin owns Google Map readiness callback");
expectIncludes(contents.androidNativeMapPlugin, "private static final String PROVIDER_ID = \"google-native\"", "Android native map plugin defines Google native provider id");
expectIncludes(contents.androidNativeMapPlugin, "status.put(\"ready\", ready)", "Android native map plugin reports Google native readiness");
expectIncludes(contents.androidNativeMapPlugin, "google-maps-api-key-missing", "Android native map plugin reports missing API-key reason");
expectIncludes(contents.androidNativeMapPlugin, "hasGoogleMapsApiKey()", "Android native map plugin validates Maps API-key readiness");
expectIncludes(contents.androidNativeMapPlugin, "public void getDebugState", "Android native map plugin exposes debug state");
expectIncludes(contents.androidNativeMapPlugin, "state.put(\"providerId\", call.getString(\"providerId\", \"\"))", "Android native map plugin debug state includes provider id");
expectIncludes(contents.androidNativeMapPlugin, "state.put(\"supportedProviders\", supportedProvidersJson())", "Android native map plugin debug state includes supported-provider list");
expectIncludes(contents.androidNativeMapPlugin, "BRIDGE_PROTOCOL_VERSION", "Android native map plugin defines bridge protocol version");
expectIncludes(contents.androidNativeMapPlugin, "SUPPORTED_COMMANDS", "Android native map plugin defines supported commands");
expectIncludes(contents.androidNativeMapPlugin, "SUPPORTED_EVENTS", "Android native map plugin defines supported events");
expectIncludes(contents.androidNativeMapPlugin, "state.put(\"supportedCommands\", supportedCommandsJson())", "Android native map plugin exposes supported commands");
expectIncludes(contents.androidNativeMapPlugin, "state.put(\"supportedEvents\", supportedEventsJson())", "Android native map plugin exposes supported events");
expectIncludes(contents.androidNativeMapPlugin, "private final JSArray commandLog", "Android native map plugin keeps command journal");
expectIncludes(contents.androidNativeMapPlugin, "private final Map<String, Integer> commandTypeCounts", "Android native map plugin keeps command type counts");
expectIncludes(contents.androidNativeMapPlugin, "private final JSArray eventLog", "Android native map plugin keeps event journal");
expectIncludes(contents.androidNativeMapPlugin, "private final Map<String, Integer> eventTypeCounts", "Android native map plugin keeps event type counts");
expectIncludes(contents.androidNativeMapPlugin, "notifyListeners(bridgeEventName", "Android native map plugin can notify provider-scoped native events");
expectIncludes(contents.androidNativeMapPlugin, "\"map:google-native:moveend\"", "Android native map plugin exposes Google native move event");
expectIncludes(contents.androidNativeMapPlugin, "state.put(\"lastContainerMetrics\"", "Android native map plugin exposes last container metrics");
expectIncludes(contents.androidNativeMapPlugin, "entry.put(\"hasContainerMetrics\"", "Android native map plugin records metrics receipt");
expectIncludes(contents.androidNativeMapPlugin, "rendererDebugState()", "Android native map plugin exposes renderer debug state");
expectIncludes(contents.androidNativeMapPlugin, "renderer.put(\"kind\", \"google-native\")", "Android native map plugin reports Google native renderer kind");
expectIncludes(contents.androidNativeMapPlugin, "renderer.put(\"implemented\", true)", "Android native map plugin reports implemented Google renderer groundwork");
expectIncludes(contents.androidNativeMapPlugin, "private MapView mapView", "Android native map plugin owns Google MapView");
expectIncludes(contents.androidNativeMapPlugin, "new MapView(getActivity())", "Android native map plugin creates Google MapView");
expectIncludes(contents.androidNativeMapPlugin, "mapView.getMapAsync(this)", "Android native map plugin waits for Google Map readiness");
expectIncludes(contents.androidNativeMapPlugin, "CameraUpdateFactory.newLatLngZoom", "Android native map plugin applies camera updates");
expectIncludes(contents.androidNativeMapPlugin, "private final Map<String, Marker> nativeMarkers", "Android native map plugin tracks native Google markers");
expectIncludes(contents.androidNativeMapPlugin, "private final Map<String, Circle> nativeCircles", "Android native map plugin tracks native Google circles");
expectIncludes(contents.androidNativeMapPlugin, "private final Map<String, Polyline> nativePolylines", "Android native map plugin tracks native Google polylines");
expectIncludes(contents.androidNativeMapPlugin, "private final Map<String, Polygon> nativePolygons", "Android native map plugin tracks native Google polygons");
expectIncludes(contents.androidNativeMapPlugin, "private JSObject rendererFrame", "Android native map plugin tracks renderer frame");
expectIncludes(contents.androidNativeMapPlugin, "renderer.put(\"itemTypeCounts\", itemTypeCountsJson())", "Android native map plugin exposes item type counts");
expectIncludes(contents.androidNativeMapPlugin, "renderer.put(\"markerClassNames\", markerClassNamesJson())", "Android native map plugin exposes marker class names");
expectIncludes(contents.androidNativeMapPlugin, "renderer.put(\"markerAnchorCount\", markerPayloadCount(\"iconAnchor\"))", "Android native map plugin exposes marker anchor debug count");
expectIncludes(contents.androidNativeMapPlugin, "renderer.put(\"markerOpacityCount\", markerPayloadCount(\"opacity\"))", "Android native map plugin exposes marker opacity debug count");
expectIncludes(contents.androidNativeMapPlugin, "renderer.put(\"markerZIndexCount\", markerPayloadCount(\"zIndexOffset\"))", "Android native map plugin exposes marker z-index debug count");
expectIncludes(contents.androidNativeMapPlugin, "private JSObject itemTypeCountsJson", "Android native map plugin computes item type counts");
expectIncludes(contents.androidNativeMapPlugin, "private JSArray markerClassNamesJson", "Android native map plugin computes marker class names");
expectIncludes(contents.androidNativeMapPlugin, "private int markerPayloadCount", "Android native map plugin computes marker payload counts");
expectIncludes(contents.androidNativeMapPlugin, "private JSObject lastCameraCenter", "Android native map plugin tracks camera center");
expectIncludes(contents.androidNativeMapPlugin, "private final Map<String, JSObject> tileOverlayDefinitions", "Android native map plugin tracks tile overlay definitions");
expectIncludes(contents.androidNativeMapPlugin, "createGoogleTileOverlay", "Android native map plugin records Google tile overlay definitions");
expectIncludes(contents.androidNativeMapPlugin, "setGoogleLayerVisible", "Android native map plugin records Google layer visibility");
expectIncludes(contents.androidNativeMapPlugin, "private final Map<String, TileOverlay> nativeTileOverlays", "Android native map plugin tracks native Google tile overlays");
expectIncludes(contents.androidNativeMapPlugin, "googleMap.addTileOverlay", "Android native map plugin renders Google tile overlays");
expectIncludes(contents.androidNativeMapPlugin, "extends UrlTileProvider", "Android native map plugin defines URL tile provider");
expectIncludes(contents.androidNativeMapPlugin, "wmsTileUrl", "Android native map plugin builds WMS tile URLs");
expectIncludes(contents.androidNativeMapPlugin, "tileBbox4326", "Android native map plugin computes WMS tile bbox");
expectIncludes(contents.androidNativeMapPlugin, "private final Map<String, JSObject> markerDefinitions", "Android native map plugin tracks marker definitions");
expectIncludes(contents.androidNativeMapPlugin, "private final Map<String, JSObject> shapeDefinitions", "Android native map plugin tracks shape definitions");
expectIncludes(contents.androidNativeMapPlugin, "googleMap.addMarker", "Android native map plugin renders Google markers");
expectIncludes(contents.androidNativeMapPlugin, "applyMarkerOptionsStyle(options, payload)", "Android native map plugin applies marker option styles");
expectIncludes(contents.androidNativeMapPlugin, "options.anchor(clampedFloat(anchor[0] / size[0]), clampedFloat(anchor[1] / size[1]))", "Android native map plugin applies marker icon anchors");
expectIncludes(contents.androidNativeMapPlugin, "googleMap.addCircle", "Android native map plugin renders Google circles");
expectIncludes(contents.androidNativeMapPlugin, "googleMap.addPolyline", "Android native map plugin renders Google polylines");
expectIncludes(contents.androidNativeMapPlugin, "googleMap.addPolygon", "Android native map plugin renders Google polygons");
expectIncludes(contents.androidNativeMapPlugin, "import com.google.android.gms.maps.model.Dash", "Android native map plugin imports Google dash pattern items");
expectIncludes(contents.androidNativeMapPlugin, "import com.google.android.gms.maps.model.Gap", "Android native map plugin imports Google gap pattern items");
expectIncludes(contents.androidNativeMapPlugin, "private List<PatternItem> dashPattern", "Android native map plugin parses provider-neutral dash arrays");
expectIncludes(contents.androidNativeMapPlugin, "options.pattern(pattern)", "Android native map plugin applies polyline dash patterns");
expectIncludes(contents.androidNativeMapPlugin, "options.strokePattern(pattern)", "Android native map plugin applies polygon stroke dash patterns");
expectIncludes(contents.androidNativeMapPlugin, "private int colorWithOpacity", "Android native map plugin applies shape color opacity");
expectIncludes(contents.androidNativeMapPlugin, "doubleValue(payload, \"fillOpacity\", 0.18)", "Android native map plugin applies shape fill opacity");
expectIncludes(contents.androidNativeMapPlugin, "doubleValue(payload, \"opacity\", 1.0)", "Android native map plugin applies shape stroke opacity");
expectIncludes(contents.androidNativeMapPlugin, "emitGoogleItemClick", "Android native map plugin emits Google item clicks");
expectIncludes(contents.androidNativeMapPlugin, "private List<LatLng> latLngListFromArray", "Android native map plugin decodes nested shape coordinate arrays");
expectIncludes(contents.androidNativeMapPlugin, "if (!points.isEmpty()) return points;", "Android native map plugin prefers flat shape coordinate arrays");
expectIncludes(contents.androidNativeMapPlugin, "if (!nestedPoints.isEmpty()) return nestedPoints;", "Android native map plugin supports one-level nested shape coordinate arrays");
expectIncludes(contents.androidNativeMapPlugin, "private final Map<String, Boolean> itemVisibility", "Android native map plugin tracks item visibility");
expectIncludes(contents.androidNativeMapPlugin, "private final Map<String, Set<String>> layerMembership", "Android native map plugin tracks layer membership");
expectIncludes(contents.androidNativeMapPlugin, "private final Map<String, Set<String>> layerChildren", "Android native map plugin tracks child layer membership");
expectIncludes(contents.androidNativeMapPlugin, "private final Map<String, Boolean> layerVisibility", "Android native map plugin tracks layer visibility");
expectIncludes(contents.androidNativeMapPlugin, "renderer.put(\"layerChildren\", layerChildrenJson())", "Android native map plugin exposes child layer debug state");
expectIncludes(contents.androidNativeMapPlugin, "renderer.put(\"layerVisibility\", layerVisibilityJson())", "Android native map plugin exposes layer visibility debug state");
expectIncludes(contents.androidNativeMapPlugin, "layerVisibility.put(layerId, visible)", "Android native map plugin records generic layer visibility");
expectIncludes(contents.androidNativeMapPlugin, "setGoogleLayerVisibleById(childLayerId, visible, visitedLayerIds)", "Android native map plugin cascades layer visibility to child layers");
expectIncludes(contents.androidNativeMapPlugin, "call.getBoolean(\"isLayer\", false)", "Android native map plugin records single child-layer membership");
expectIncludes(contents.androidNativeMapPlugin, "item.optBoolean(\"isLayer\", false)", "Android native map plugin records batched child-layer membership");
expectIncludes(contents.androidNativeMapPlugin, "Set<String> itemIds = layerMembership.get(layerId)", "Android native map plugin finds layer-owned items during layer visibility updates");
expectIncludes(contents.androidNativeMapPlugin, "itemVisibility.put(itemId, visible)", "Android native map plugin applies layer visibility to owned items");
expectIncludes(contents.androidNativeMapPlugin, "applyGoogleItemVisibility(itemId)", "Android native map plugin applies native item visibility from layer updates");
expectIncludes(contents.androidNativeMapPlugin, "private JSObject layerChildrenJson()", "Android native map plugin serializes child layer debug state");
expectIncludes(contents.androidNativeMapPlugin, "private JSObject layerVisibilityJson()", "Android native map plugin serializes layer visibility debug state");
expectIncludes(contents.androidNativeMapPlugin, "private final Map<String, JSObject> pinTiers", "Android native map plugin tracks pin tiers");
expectIncludes(contents.androidNativeMapPlugin, "configureGooglePinTier(call)", "Android native map plugin handles pin-tier configuration");
expectIncludes(contents.androidNativeMapPlugin, "addGoogleItemToLayer(call)", "Android native map plugin handles layer membership");
expectIncludes(contents.androidNativeMapPlugin, "addGoogleItemsToLayer(call)", "Android native map plugin handles batch layer membership");
expectIncludes(contents.androidNativeMapPlugin, "setGooglePinTierVisible(call)", "Android native map plugin handles pin-tier visibility");
expectIncludes(contents.androidNativeMapPlugin, "createGoogleItem(call)", "Android native map plugin handles marker creation");
expectIncludes(contents.androidNativeMapPlugin, "createGoogleItems(call)", "Android native map plugin handles marker batch creation");
expectIncludes(contents.androidNativeMapPlugin, "updateGoogleItem(call)", "Android native map plugin handles item updates");
expectIncludes(contents.androidNativeMapPlugin, "setGoogleItemsVisible(call)", "Android native map plugin handles batch item visibility");
expectIncludes(contents.androidNativeMapPlugin, "createGoogleShapeItem(call)", "Android native map plugin handles shape creation");
expectIncludes(contents.androidNativeMapPlugin, "removeGoogleItem(call)", "Android native map plugin handles item removal");
expectIncludes(contents.androidNativeMapPlugin, "itemVisibility.putIfAbsent(itemId, true)", "Android native map plugin preserves hidden item visibility on create/update");
expectIncludes(contents.androidNativeMapPlugin, "removeNativeGoogleItem(itemId)", "Android native map plugin removes native handles when clearing layers");
expectIncludes(contents.androidNativeMapPlugin, "markerDefinitions.remove(itemId)", "Android native map plugin removes marker definitions when clearing layers");
expectIncludes(contents.androidNativeMapPlugin, "shapeDefinitions.remove(itemId)", "Android native map plugin removes shape definitions when clearing layers");
expectIncludes(contents.androidNativeMapPlugin, "itemVisibility.remove(itemId);", "Android native map plugin clears item visibility during layer/item removal");
expectIncludes(contents.androidNativeMapPlugin, "renderer.put(\"markerCount\"", "Android native map plugin exposes marker debug count");
expectIncludes(contents.androidNativeMapPlugin, "renderer.put(\"markerCalloutCount\"", "Android native map plugin exposes marker callout debug count");
expectIncludes(contents.androidNativeMapPlugin, "renderer.put(\"shapeCount\"", "Android native map plugin exposes shape debug count");
expectIncludes(contents.androidNativeMapPlugin, "renderer.put(\"shapePopupCount\"", "Android native map plugin exposes shape popup debug count");
expectIncludes(contents.androidNativeMapPlugin, "renderer.put(\"shapeTooltipCount\"", "Android native map plugin exposes shape tooltip debug count");
expectIncludes(contents.androidNativeMapPlugin, "private int markerCalloutCount", "Android native map plugin counts marker callout-ready payloads");
expectIncludes(contents.androidNativeMapPlugin, "private String markerTitle", "Android native map plugin derives marker titles from tooltip fallback");
expectIncludes(contents.androidNativeMapPlugin, "private String markerSnippet", "Android native map plugin derives marker snippets from tooltip content");
expectIncludes(contents.androidNativeMapPlugin, "marker.showInfoWindow()", "Android native map plugin shows marker info windows while preserving bridge clicks");
expectIncludes(contents.androidNativeMapPlugin, "private Marker shapeInfoWindowMarker", "Android native map plugin tracks shared shape callout marker");
expectIncludes(contents.androidNativeMapPlugin, "showGoogleShapeInfoWindow((String) tag", "Android native map plugin opens shape info windows from click handlers");
expectIncludes(contents.androidNativeMapPlugin, "private void showGoogleShapeInfoWindow", "Android native map plugin defines shape info-window helper");
expectIncludes(contents.androidNativeMapPlugin, "private String shapeCalloutTitle", "Android native map plugin derives shape callout title from popup or tooltip");
expectIncludes(contents.androidNativeMapPlugin, "private String shapeCalloutSnippet", "Android native map plugin derives shape callout snippet from tooltip");
expectIncludes(contents.androidNativeMapPlugin, "private int payloadCount", "Android native map plugin counts payload fields for debug state");
expectIncludes(contents.androidNativeMapPlugin, "renderer.put(\"itemVisibility\"", "Android native map plugin exposes item visibility debug state");
expectIncludes(contents.androidNativeMapPlugin, "renderer.put(\"layerCount\"", "Android native map plugin exposes layer debug count");
expectIncludes(contents.androidNativeMapPlugin, "renderer.put(\"layerVisibility\"", "Android native map plugin exposes generic layer visibility debug state");
expectIncludes(contents.androidNativeMapPlugin, "renderer.put(\"pinTierCount\"", "Android native map plugin exposes pin-tier debug count");
expectIncludes(contents.androidNativeMapPlugin, "call.getObject(\"overlay\")", "Android native map plugin reads nested tile overlay payload");
expectIncludes(contents.androidNativeMapPlugin, "com.google.android.gms:play-services-maps", "Android native map plugin records Google Maps SDK dependency");
expectIncludes(contents.androidNativeMapPlugin, "recordCommand(\"init\", call)", "Android native map plugin records strict init command");
expectIncludes(contents.androidNativeMapPlugin, "resolveCommand(call, \"setView\")", "Android native map plugin records non-strict commands");
expectIncludes(contents.iosStoryboard, "customClass=\"AppBridgeViewController\"", "iOS storyboard uses app bridge view controller");
expectIncludes(contents.iosProject, "AppBridgeViewController.swift in Sources", "iOS project compiles app bridge view controller");
expectIncludes(contents.iosProject, "MeteoPecheMapPlugin.swift in Sources", "iOS project compiles native map plugin");
expectIncludes(contents.iosBridgeViewController, "registerPluginInstance(MeteoPecheMapPlugin())", "iOS bridge view controller registers local native map plugin");
expectIncludes(contents.iosBridgeViewController, "webView?.isOpaque = false", "iOS bridge view controller lets native MapKit show through the webview");
expectIncludes(contents.styles, ".spot-map.is-native-map", "styles make native map provider surface transparent");
expectIncludes(contents.iosNativeMapPlugin, "let jsName = \"MeteoPecheMap\"", "iOS native map plugin exposes MeteoPecheMap name");
expectIncludes(contents.iosNativeMapPlugin, "\"ready\": ready", "iOS native map plugin reports Apple native readiness");
expectIncludes(contents.iosNativeMapPlugin, "\"supportedProviders\": supportedProviders", "iOS native map plugin exposes supported-provider list");
expectIncludes(contents.iosNativeMapPlugin, "rendererReady\": true", "iOS native map plugin resolves native init when Apple provider is requested");
expectIncludes(contents.iosNativeMapPlugin, "func getDebugState", "iOS native map plugin exposes debug state");
expectIncludes(contents.iosNativeMapPlugin, "\"providerId\": call.getString(\"providerId\") ?? \"\"", "iOS native map plugin debug state includes provider id");
expectIncludes(contents.iosNativeMapPlugin, "private let supportedProviders = [\"apple-native\"]", "iOS native map plugin advertises apple-native support");
expectIncludes(contents.iosNativeMapPlugin, "private let bridgeProtocolVersion = 1", "iOS native map plugin defines bridge protocol version");
expectIncludes(contents.iosNativeMapPlugin, "private let supportedCommands", "iOS native map plugin defines supported commands");
expectIncludes(contents.iosNativeMapPlugin, "\"map:apple-native:moveend\"", "iOS native map plugin defines Apple native move event");
expectIncludes(contents.iosNativeMapPlugin, "\"supportedCommands\": supportedCommands", "iOS native map plugin exposes supported commands");
expectIncludes(contents.iosNativeMapPlugin, "\"supportedEvents\": supportedEvents", "iOS native map plugin exposes supported events");
expectIncludes(contents.iosNativeMapPlugin, "private var commandLog", "iOS native map plugin keeps command journal");
expectIncludes(contents.iosNativeMapPlugin, "private var commandTypeCounts", "iOS native map plugin keeps command type counts");
expectIncludes(contents.iosNativeMapPlugin, "private var eventLog", "iOS native map plugin keeps event journal");
expectIncludes(contents.iosNativeMapPlugin, "private var eventTypeCounts", "iOS native map plugin keeps event type counts");
expectIncludes(contents.iosNativeMapPlugin, "notifyListeners(bridgeEventName", "iOS native map plugin notifies provider-scoped native events");
expectIncludes(contents.iosNativeMapPlugin, "regionDidChangeAnimated", "iOS native map plugin emits MapKit move and zoom events");
expectIncludes(contents.iosNativeMapPlugin, "didSelect view", "iOS native map plugin emits MapKit annotation click events");
expectIncludes(contents.iosNativeMapPlugin, "\"lastContainerMetrics\"", "iOS native map plugin exposes last container metrics");
expectIncludes(contents.iosNativeMapPlugin, "\"hasContainerMetrics\"", "iOS native map plugin records metrics receipt");
expectIncludes(contents.iosNativeMapPlugin, "import MapKit", "iOS native map plugin imports MapKit");
expectIncludes(contents.iosNativeMapPlugin, "private var mapView: MKMapView?", "iOS native map plugin owns MapKit view");
expectIncludes(contents.iosNativeMapPlugin, "rendererDebugState()", "iOS native map plugin exposes renderer debug state");
expectIncludes(contents.iosNativeMapPlugin, "\"implemented\": true", "iOS native map plugin reports implemented MapKit renderer");
expectIncludes(contents.iosNativeMapPlugin, "mapView.isHidden = false", "iOS native map plugin creates visible MapKit view");
expectIncludes(contents.iosNativeMapPlugin, "ensureMapKitView", "iOS native map plugin can create MapKit view");
expectIncludes(contents.iosNativeMapPlugin, "applyContainerMetrics", "iOS native map plugin applies container metrics");
expectIncludes(contents.iosNativeMapPlugin, "applyCamera", "iOS native map plugin applies camera updates");
expectIncludes(contents.iosNativeMapPlugin, "private var tileOverlays: [String: MKTileOverlay]", "iOS native map plugin tracks MapKit tile overlays");
expectIncludes(contents.iosNativeMapPlugin, "private var tileOverlayDefinitions: [String: [String: Any]]", "iOS native map plugin tracks MapKit tile overlay definitions");
expectIncludes(contents.iosNativeMapPlugin, "self.tileOverlayDefinitions.removeAll()", "iOS native map plugin clears tile overlay definitions on destroy");
expectIncludes(contents.iosNativeMapPlugin, "private class MeteoPecheMapTileOverlay", "iOS native map plugin defines provider-neutral MapKit tile overlay");
expectIncludes(contents.iosNativeMapPlugin, "createMapKitTileOverlay", "iOS native map plugin creates MapKit tile overlays");
expectIncludes(contents.iosNativeMapPlugin, "setMapKitLayerVisible", "iOS native map plugin toggles MapKit layer visibility");
expectIncludes(contents.iosNativeMapPlugin, "MKTileOverlayRenderer", "iOS native map plugin renders MapKit tile overlays");
expectIncludes(contents.iosNativeMapPlugin, "wmsTileUrl", "iOS native map plugin builds WMS tile URLs");
expectIncludes(contents.iosNativeMapPlugin, "tileBbox4326", "iOS native map plugin computes WMS tile bbox");
expectIncludes(contents.iosNativeMapPlugin, "renderer.alpha = CGFloat", "iOS native map plugin applies tile overlay opacity");
expectIncludes(contents.iosNativeMapPlugin, "\"tileOverlayCount\"", "iOS native map plugin exposes tile overlay debug count");
expectIncludes(contents.iosNativeMapPlugin, "\"tileOverlayTypes\"", "iOS native map plugin exposes tile overlay type debug state");
expectIncludes(contents.iosNativeMapPlugin, "private class MeteoPecheMapAnnotation", "iOS native map plugin defines dormant MapKit annotation");
expectIncludes(contents.iosNativeMapPlugin, "private var annotations: [String: MeteoPecheMapAnnotation]", "iOS native map plugin tracks MapKit annotations");
expectIncludes(contents.iosNativeMapPlugin, "private var shapeOverlays: [String: MKOverlay]", "iOS native map plugin tracks MapKit shape overlays");
expectIncludes(contents.iosNativeMapPlugin, "\"markerCalloutCount\": markerCalloutCount()", "iOS native map plugin exposes marker callout debug count");
expectIncludes(contents.iosNativeMapPlugin, "private func markerCalloutCount", "iOS native map plugin counts marker callout-ready payloads");
expectIncludes(contents.iosNativeMapPlugin, "\"itemTypeCounts\": itemTypeCountsDebugState()", "iOS native map plugin exposes item type counts");
expectIncludes(contents.iosNativeMapPlugin, "\"markerClassNames\": markerClassNamesDebugState()", "iOS native map plugin exposes marker class names");
expectIncludes(contents.iosNativeMapPlugin, "\"markerAnchorCount\": markerPayloadCount(for: \"iconAnchor\")", "iOS native map plugin exposes marker anchor debug count");
expectIncludes(contents.iosNativeMapPlugin, "\"markerOpacityCount\": markerPayloadCount(for: \"opacity\")", "iOS native map plugin exposes marker opacity debug count");
expectIncludes(contents.iosNativeMapPlugin, "\"markerZIndexCount\": markerPayloadCount(for: \"zIndexOffset\")", "iOS native map plugin exposes marker z-index debug count");
expectIncludes(contents.iosNativeMapPlugin, "private func itemTypeCountsDebugState", "iOS native map plugin computes item type counts");
expectIncludes(contents.iosNativeMapPlugin, "private func markerClassNamesDebugState", "iOS native map plugin computes marker class names");
expectIncludes(contents.iosNativeMapPlugin, "private func markerPayloadCount", "iOS native map plugin computes marker payload counts");
expectIncludes(contents.iosNativeMapPlugin, "applyMarkerViewStyle(view, annotation: meteoAnnotation)", "iOS native map plugin applies marker view style payloads");
expectIncludes(contents.iosNativeMapPlugin, "self.mapView?.view(for: annotation)", "iOS native map plugin refreshes visible marker views on update");
expectIncludes(contents.iosNativeMapPlugin, "self.applyMarkerViewStyle(view, annotation: annotation)", "iOS native map plugin reapplies marker view style on update");
expectIncludes(contents.iosNativeMapPlugin, "view.centerOffset = markerCenterOffset(payload)", "iOS native map plugin applies marker icon anchors");
expectIncludes(contents.iosNativeMapPlugin, "view.layer.zPosition = CGFloat(doubleValue(payload[\"zIndexOffset\"])", "iOS native map plugin applies marker z-index payloads");
expectIncludes(contents.iosNativeMapPlugin, "view.alpha = CGFloat(max(0, min(1, doubleValue(payload[\"opacity\"])", "iOS native map plugin applies marker opacity payloads");
expectIncludes(contents.iosNativeMapPlugin, "private var shapeItemTypes", "iOS native map plugin tracks shape item types");
expectIncludes(contents.iosNativeMapPlugin, "private func plainText", "iOS native map plugin normalizes marker callout text");
expectIncludes(contents.iosNativeMapPlugin, ".replacingOccurrences(of: \"<[^>]+>\"", "iOS native map plugin strips HTML from callout text");
expectIncludes(contents.iosNativeMapPlugin, "!rawTitle.isEmpty ? rawTitle : (tooltipContent.isEmpty ? nil : tooltipContent)", "iOS native map plugin derives marker title from tooltip fallback");
expectIncludes(contents.iosNativeMapPlugin, "meteoAnnotation.title != nil || meteoAnnotation.subtitle != nil", "iOS native map plugin enables marker callouts from title or tooltip subtitle");
expectIncludes(contents.iosNativeMapPlugin, "\"shapePopupCount\": shapePayloadCount(for: \"popup\")", "iOS native map plugin exposes shape popup debug count");
expectIncludes(contents.iosNativeMapPlugin, "\"shapeTooltipCount\": shapePayloadCount(for: \"tooltip\")", "iOS native map plugin exposes shape tooltip debug count");
expectIncludes(contents.iosNativeMapPlugin, "private func shapePayloadCount", "iOS native map plugin counts shape payload fields for debug state");
expectIncludes(contents.iosNativeMapPlugin, "private var layerMembership: [String: Set<String>]", "iOS native map plugin tracks layer membership");
expectIncludes(contents.iosNativeMapPlugin, "private var layerChildren: [String: Set<String>]", "iOS native map plugin tracks child layer membership");
expectIncludes(contents.iosNativeMapPlugin, "private var layerVisibility: [String: Bool]", "iOS native map plugin tracks layer visibility");
expectIncludes(contents.iosNativeMapPlugin, "\"layerChildren\": layerChildrenDebugState()", "iOS native map plugin exposes child layer debug state");
expectIncludes(contents.iosNativeMapPlugin, "\"layerVisibility\": layerVisibility", "iOS native map plugin exposes layer visibility debug state");
expectIncludes(contents.iosNativeMapPlugin, "layerVisibility[layerId] = visible", "iOS native map plugin records generic layer visibility");
expectIncludes(contents.iosNativeMapPlugin, "setMapKitLayerVisibleById(childLayerId, visible: visible, visitedLayerIds: visitedLayerIds)", "iOS native map plugin cascades layer visibility to child layers");
expectIncludes(contents.iosNativeMapPlugin, "call.getBool(\"isLayer\") ?? false", "iOS native map plugin records single child-layer membership");
expectIncludes(contents.iosNativeMapPlugin, "item[\"isLayer\"] as? Bool ?? false", "iOS native map plugin records batched child-layer membership");
expectIncludes(contents.iosNativeMapPlugin, "let itemIds = Array(layerMembership[layerId] ?? [])", "iOS native map plugin finds layer-owned items during layer visibility updates");
expectIncludes(contents.iosNativeMapPlugin, "setMapKitItemVisiblePayload([\"itemId\": itemId, \"visible\": visible])", "iOS native map plugin applies layer visibility to owned items");
expectIncludes(contents.iosNativeMapPlugin, "private func layerChildrenDebugState()", "iOS native map plugin serializes child layer debug state");
expectIncludes(contents.iosNativeMapPlugin, "private var pinTiers: [String: [String: Any]]", "iOS native map plugin tracks pin tiers");
expectIncludes(contents.iosNativeMapPlugin, "configureMapKitPinTier(call)", "iOS native map plugin handles pin-tier configuration");
expectIncludes(contents.iosNativeMapPlugin, "addMapKitItemToLayer(call)", "iOS native map plugin handles layer membership");
expectIncludes(contents.iosNativeMapPlugin, "addMapKitItemsToLayer(call)", "iOS native map plugin handles batch layer membership");
expectIncludes(contents.iosNativeMapPlugin, "setMapKitPinTierVisible(call)", "iOS native map plugin handles pin-tier visibility");
expectIncludes(contents.iosNativeMapPlugin, "createMapKitItem", "iOS native map plugin creates MapKit marker items");
expectIncludes(contents.iosNativeMapPlugin, "createMapKitItems", "iOS native map plugin creates MapKit marker batches");
expectIncludes(contents.iosNativeMapPlugin, "updateMapKitItem", "iOS native map plugin updates MapKit marker items");
expectIncludes(contents.iosNativeMapPlugin, "setMapKitItemsVisible", "iOS native map plugin toggles MapKit marker batches");
expectIncludes(contents.iosNativeMapPlugin, "createMapKitShapeItem", "iOS native map plugin creates MapKit shape overlays");
expectIncludes(contents.iosNativeMapPlugin, "annotationsToRemove.forEach", "iOS native map plugin removes annotations when clearing layers");
expectIncludes(contents.iosNativeMapPlugin, "overlaysToRemove.forEach", "iOS native map plugin removes shape overlays when clearing layers");
expectIncludes(contents.iosNativeMapPlugin, "annotationPayloads.removeValue(forKey: itemId)", "iOS native map plugin removes annotation payloads when clearing layers");
expectIncludes(contents.iosNativeMapPlugin, "shapePayloads.removeValue(forKey: itemId)", "iOS native map plugin removes shape payloads when clearing layers");
expectIncludes(contents.iosNativeMapPlugin, "self.itemVisibility[itemId] == nil", "iOS native map plugin preserves hidden item visibility on create/update");
expectIncludes(contents.iosNativeMapPlugin, "annotations.contains(where: { ($0 as? MeteoPecheMapAnnotation)?.itemId == itemId })", "iOS native map plugin keeps batch annotation visibility idempotent");
expectIncludes(contents.iosNativeMapPlugin, "overlays.contains(where: { self.shapeItemId(for: $0) == itemId })", "iOS native map plugin keeps batch shape visibility idempotent");
expectIncludes(contents.iosNativeMapPlugin, "private func coordinatePair", "iOS native map plugin decodes provider-neutral coordinate pairs");
expectIncludes(contents.iosNativeMapPlugin, "let directCoordinates = entries.compactMap { coordinatePair($0) }", "iOS native map plugin supports flat shape coordinate arrays");
expectIncludes(contents.iosNativeMapPlugin, "let nestedCoordinates = nestedEntries.compactMap { coordinatePair($0) }", "iOS native map plugin supports nested shape coordinate arrays");
expectIncludes(contents.iosNativeMapPlugin, "renderer.lineDashPattern = lineDashPattern(payload[\"dashArray\"])", "iOS native map plugin applies provider-neutral dash arrays");
expectIncludes(contents.iosNativeMapPlugin, "private func lineDashPattern", "iOS native map plugin parses shape dash arrays");
expectIncludes(contents.iosNativeMapPlugin, "private func colorWithOpacity", "iOS native map plugin applies shape color opacity");
expectIncludes(contents.iosNativeMapPlugin, "opacity: doubleValue(payload[\"fillOpacity\"]) ?? 0.18", "iOS native map plugin applies shape fill opacity");
expectIncludes(contents.iosNativeMapPlugin, "opacity: doubleValue(payload[\"opacity\"]) ?? 1", "iOS native map plugin applies shape stroke opacity");
expectIncludes(contents.iosNativeMapPlugin, "MKCircleRenderer", "iOS native map plugin renders MapKit circles");
expectIncludes(contents.iosNativeMapPlugin, "MKPolylineRenderer", "iOS native map plugin renders MapKit polylines");
expectIncludes(contents.iosNativeMapPlugin, "MKPolygonRenderer", "iOS native map plugin renders MapKit polygons");
expectIncludes(contents.iosNativeMapPlugin, "\"annotationCount\"", "iOS native map plugin exposes annotation debug count");
expectIncludes(contents.iosNativeMapPlugin, "\"shapeOverlayCount\"", "iOS native map plugin exposes shape overlay debug count");
expectIncludes(contents.iosNativeMapPlugin, "\"layerCount\"", "iOS native map plugin exposes layer debug count");
expectIncludes(contents.iosNativeMapPlugin, "\"pinTierCount\"", "iOS native map plugin exposes pin-tier debug count");
expectIncludes(contents.iosNativeMapPlugin, "call.getObject(\"overlay\")", "iOS native map plugin reads nested tile overlay payload");
expectIncludes(contents.iosNativeMapPlugin, "recordCommand(\"init\", call)", "iOS native map plugin records strict init command");
expectIncludes(contents.iosNativeMapPlugin, "resolveCommand(call, \"setView\")", "iOS native map plugin records non-strict commands");
[
  "getDebugState",
  "getStatus",
  "init",
  "setView",
  "invalidateSize",
  "createTileOverlay",
  "setLayerVisible",
  "clearLayer",
  "configurePinTier",
  "createItem",
  "createItems",
  "addToLayer",
  "addItemsToLayer",
  "updateItem",
  "setItemVisible",
  "setItemsVisible",
  "createShapeItem",
  "setPinTierVisible",
  "removeItem",
  "removeFromLayer",
  "destroy",
].forEach((command) => {
  expectIncludes(contents.nativeBridgeDocs, `\`${command}\``, `native bridge contract doc documents ${command}`);
});

expectLeafletUsageIsProviderScoped(contents.source, "source");
expectLeafletUsageIsProviderScoped(contents.dist, "dist");
expectLeafletUsageIsProviderScoped(contents.ios, "iOS bundle");
expectLeafletUsageIsProviderScoped(contents.android, "Android bundle");
expectNativeBridgeCommandsAreDocumented(contents.source, "source");
expectNativePlatformCommandsMatchWebProvider(contents.source, contents.androidNativeMapPlugin, contents.iosNativeMapPlugin);
expectProviderInterfaceMethods(contents.source, "source");
expectNotIncludes(contents.readme, "renderLeafletPins", "README avoids stale renderLeafletPins helper name");
expectNotIncludes(contents.readme, "updateLeafletPinVisibility", "README avoids stale updateLeafletPinVisibility helper name");
expectIncludes(contents.readme, "normalized map-provider", "README documents provider-normalized map events");

const failures = checks.filter((check) => !check.ok);
checks.forEach((check) => {
  console.log(`${check.ok ? "ok" : "not ok"} - ${check.label}`);
});

if (failures.length) {
  console.error(`\n${failures.length} map provider validation check(s) failed.`);
  process.exit(1);
}

console.log(`\n${checks.length} map provider validation checks passed.`);

function expectIncludes(content, needle, label) {
  expect(content.includes(needle), label);
}

function expectNotIncludes(content, needle, label) {
  expect(!content.includes(needle), label);
}

function classRegion(content, className, nextClassName) {
  const start = content.indexOf(`class ${className}`);
  const end = content.indexOf(`class ${nextClassName}`);
  expect(start >= 0 && end > start, `source has ${className} region`);
  return start >= 0 && end > start ? content.slice(start, end) : "";
}

function expectLeafletUsageIsProviderScoped(content, labelPrefix) {
  const start = content.indexOf("class LeafletMapProvider");
  const end = content.indexOf("class GoogleMapsWebProvider");
  expect(start >= 0 && end > start, `${labelPrefix} has Leaflet provider region before Google provider`);

  const matches = [...content.matchAll(/\bL\./g)];
  matches.forEach((match) => {
    expect(match.index > start && match.index < end, `${labelPrefix} keeps L.* usage inside LeafletMapProvider at offset ${match.index}`);
  });
}

function expectNativeBridgeCommandsAreDocumented(content, labelPrefix) {
  const providerStart = content.indexOf("class NativeBridgeMapProvider");
  const providerEnd = content.indexOf("function googleDivIconOptions");
  const contractStart = content.indexOf("function nativeBridgeContract");
  const contractEnd = content.indexOf("function mapKitCoordinateSpanForZoom");
  expect(providerStart >= 0 && providerEnd > providerStart, `${labelPrefix} has native provider and handle region`);
  expect(contractStart >= 0 && contractEnd > contractStart, `${labelPrefix} has native bridge contract region`);

  const providerRegion = content.slice(providerStart, providerEnd);
  const contractRegion = content.slice(contractStart, contractEnd);
  const emittedCommands = [
    ...new Set([...providerRegion.matchAll(/(?:this|this\.provider)\.call\("([^"]+)"/g)].map((match) => match[1])),
  ];
  emittedCommands.forEach((command) => {
    expect(contractRegion.includes(`${command}:`), `${labelPrefix} native bridge contract documents emitted ${command} command`);
  });
}

function expectNativePlatformCommandsMatchWebProvider(source, androidPlugin, iosPlugin) {
  const providerStart = source.indexOf("class NativeBridgeMapProvider");
  const providerEnd = source.indexOf("function googleDivIconOptions");
  expect(providerStart >= 0 && providerEnd > providerStart, "source has native provider region for native platform command parity");

  const providerRegion = source.slice(providerStart, providerEnd);
  const emittedCommands = [
    ...new Set([...providerRegion.matchAll(/(?:this|this\.provider)\.call\("([^"]+)"/g)].map((match) => match[1])),
  ].sort();
  const bridgeLifecycleCommands = ["getStatus", "isReady", "getDebugState"];
  const requiredCommands = [...new Set([...bridgeLifecycleCommands, ...emittedCommands])].sort();

  requiredCommands.forEach((command) => {
    expect(
      androidPlugin.includes(`public void ${command}`),
      `Android native map plugin exposes web/native bridge command ${command}`,
    );
    expect(
      iosPlugin.includes(`CAPPluginMethod(name: "${command}"`) || iosPlugin.includes(`func ${command}`) || iosPlugin.includes(`func \`${command}\``),
      `iOS native map plugin exposes web/native bridge command ${command}`,
    );
  });
}

function expectProviderInterfaceMethods(content, labelPrefix) {
  const calledMethods = [
    ...new Set([...content.matchAll(/state\.mapProvider\??\.(\w+)/g)].map((match) => match[1])),
  ].sort();
  expect(calledMethods.length > 0, `${labelPrefix} derives provider interface methods from app calls`);

  const providerRegions = [
    ["LeafletMapProvider", "class LeafletMapProvider", "class GoogleMapsWebProvider"],
    ["GoogleMapsWebProvider", "class GoogleMapsWebProvider", "class AppleMapsWebProvider"],
    ["AppleMapsWebProvider", "class AppleMapsWebProvider", "class NativeBridgeMapProvider"],
    ["NativeBridgeMapProvider", "class NativeBridgeMapProvider", "class NativeMapLayer"],
  ];

  providerRegions.forEach(([providerName, startNeedle, endNeedle]) => {
    const start = content.indexOf(startNeedle);
    const end = content.indexOf(endNeedle);
    expect(start >= 0 && end > start, `${labelPrefix} has ${providerName} region`);
    const region = content.slice(start, end);
    calledMethods.forEach((method) => {
      const signature = new RegExp(`(?:^|\\n)\\s+(?:async\\s+)?${escapeRegExp(method)}\\(`);
      expect(signature.test(region), `${labelPrefix} ${providerName} implements provider method ${method}()`);
    });
  });
}

function expectProviderPinTierLayerVisibility(content, labelPrefix) {
  [
    ["GoogleMapsWebProvider", "class GoogleMapsWebProvider", "class AppleMapsWebProvider", "visible ? this.map : null"],
    ["AppleMapsWebProvider", "class AppleMapsWebProvider", "class NativeBridgeMapProvider", "visible ? this.map : null"],
    ["NativeBridgeMapProvider", "class NativeBridgeMapProvider", "class NativeMapLayer", "pane.layer?.setMap?.(visible)"],
  ].forEach(([providerName, startNeedle, endNeedle, visibilityNeedle]) => {
    const start = content.indexOf(startNeedle);
    const end = content.indexOf(endNeedle);
    expect(start >= 0 && end > start, `${labelPrefix} has ${providerName} pin-tier region`);
    const region = start >= 0 && end > start ? content.slice(start, end) : "";
    expect(region.includes("panes[tier.id].layer = layers[tier.id]"), `${labelPrefix} ${providerName} stores pin-tier layer handles on panes`);
    expect(region.includes(visibilityNeedle), `${labelPrefix} ${providerName} toggles provider pin-tier layers by zoom`);
  });
}

function expectAppleShapePopupParity(content, labelPrefix) {
  const start = content.indexOf("class AppleMapsWebProvider");
  const end = content.indexOf("class NativeBridgeMapProvider");
  expect(start >= 0 && end > start, `${labelPrefix} has Apple web provider popup region`);
  const region = start >= 0 && end > start ? content.slice(start, end) : "";
  ["addCircle", "addPolyline", "addPolygon"].forEach((method) => {
    const methodStart = region.indexOf(`${method}(layer, definition)`);
    const methodEnd = region.indexOf("\n  }\n", methodStart);
    const methodRegion = methodStart >= 0 && methodEnd > methodStart ? region.slice(methodStart, methodEnd) : "";
    expect(methodRegion.includes("definition.popup"), `${labelPrefix} Apple web ${method} wires popup content`);
    expect(methodRegion.includes("showPopup(definition.popup)"), `${labelPrefix} Apple web ${method} opens shape popup callout`);
  });
  expect(region.includes("this.popupAnnotation = null"), `${labelPrefix} Apple web shape overlay tracks popup annotation`);
  expect(region.includes("showPopup(content)"), `${labelPrefix} Apple web shape overlay exposes popup show helper`);
  expect(region.includes("this.map.selectedAnnotation = this.popupAnnotation.annotation"), `${labelPrefix} Apple web shape popup selects annotation callout`);
  expect(region.includes("hidePopup()"), `${labelPrefix} Apple web shape overlay exposes popup cleanup helper`);
}

function expectGoogleWebShapeLayerDeferral(content, labelPrefix) {
  const start = content.indexOf("class GoogleMapsWebProvider");
  const end = content.indexOf("class AppleMapsWebProvider");
  expect(start >= 0 && end > start, `${labelPrefix} has Google web provider shape layer region`);
  const region = start >= 0 && end > start ? content.slice(start, end) : "";
  ["addCircleMarker", "addCircle", "addPolyline", "addPolygon"].forEach((method) => {
    const methodStart = region.indexOf(`${method}(layer, definition)`);
    const methodEnd = region.indexOf("\n  }\n", methodStart);
    const methodRegion = methodStart >= 0 && methodEnd > methodStart ? region.slice(methodStart, methodEnd) : "";
    expect(methodRegion.includes("map: layer?.map ?? null"), `${labelPrefix} Google web ${method} defers shape map attachment to layer visibility`);
  });
}

function expectGoogleShapePopupParity(content, labelPrefix) {
  const start = content.indexOf("class GoogleMapsWebProvider");
  const end = content.indexOf("class AppleMapsWebProvider");
  expect(start >= 0 && end > start, `${labelPrefix} has Google web provider popup region`);
  const region = start >= 0 && end > start ? content.slice(start, end) : "";
  ["addCircleMarker", "addCircle", "addPolyline", "addPolygon"].forEach((method) => {
    const methodStart = region.indexOf(`${method}(layer, definition)`);
    const methodEnd = region.indexOf("\n  }\n", methodStart);
    const methodRegion = methodStart >= 0 && methodEnd > methodStart ? region.slice(methodStart, methodEnd) : "";
    expect(methodRegion.includes("this.bindPopup"), `${labelPrefix} Google web ${method} wires popup content`);
  });
  expect(region.includes("bindPopup(item, popup"), `${labelPrefix} Google web exposes shape popup helper`);
  expect(region.includes("item.__meteoPechePopup"), `${labelPrefix} Google web tracks popup InfoWindow on shape items`);
  expect(region.includes("infoWindow.open(this.map)"), `${labelPrefix} Google web opens shape popup InfoWindow`);
  expect(content.includes("item?.__meteoPechePopup?.close?.()"), `${labelPrefix} Google web closes shape popup InfoWindow during cleanup`);
}

function expectWebShapeCenterFallback(content, labelPrefix) {
  [
    "function mapProviderShapeCenter",
    "function mapProviderGoogleLatLngLiteral",
    "function mapProviderLatLngFromGoogle",
    "shapeCenter: mapProviderShapeCenter",
  ].forEach((needle) => {
    expect(content.includes(needle), `${labelPrefix} includes ${needle}`);
  });

  const googleStart = content.indexOf("class GoogleMapsWebProvider");
  const googleEnd = content.indexOf("class AppleMapsWebProvider");
  expect(googleStart >= 0 && googleEnd > googleStart, `${labelPrefix} has Google web shape-center region`);
  const googleRegion = googleStart >= 0 && googleEnd > googleStart ? content.slice(googleStart, googleEnd) : "";
  expect(googleRegion.includes("__meteoPecheShapeCenter"), `${labelPrefix} Google web stores fallback shape center`);
  expect(googleRegion.includes("normalizeShapeEvent(payload, shape)"), `${labelPrefix} Google web normalizes shape click events with fallback center`);
  expect(googleRegion.includes("mapProviderLatLngFromGoogle(position)"), `${labelPrefix} Google web converts fallback shape center to latlng`);

  const appleStart = content.indexOf("class AppleMapsWebShapeOverlay");
  const appleEnd = content.indexOf("class NativeBridgeMapProvider");
  expect(appleStart >= 0 && appleEnd > appleStart, `${labelPrefix} has Apple web shape-center region`);
  const appleRegion = appleStart >= 0 && appleEnd > appleStart ? content.slice(appleStart, appleEnd) : "";
  expect(appleRegion.includes("this.center = mapProviderShapeCenter(definition)"), `${labelPrefix} Apple web stores fallback shape center`);
  expect(appleRegion.includes("return this.center"), `${labelPrefix} Apple web falls back to stored shape center`);
}

function expectWebProviderCoordinateNormalization(content, labelPrefix) {
  [
    "function mapProviderCoordinatePair",
    "function mapProviderCoordinatePath",
    "function mapProviderCoordinateRings",
    "function mapProviderGoogleCoordinatePath",
    "function mapProviderGooglePolygonPaths",
    "function mapProviderAppleCoordinatePath",
    "function mapProviderCoordinateNormalizationSamples",
  ].forEach((needle) => {
    expect(content.includes(needle), `${labelPrefix} includes ${needle}`);
  });
  expect(content.includes("coordinateNormalizationSamples: mapProviderCoordinateNormalizationSamples"), `${labelPrefix} exposes coordinate normalization debug samples`);

  const googleStart = content.indexOf("class GoogleMapsWebProvider");
  const googleEnd = content.indexOf("class AppleMapsWebProvider");
  expect(googleStart >= 0 && googleEnd > googleStart, `${labelPrefix} has Google web provider coordinate region`);
  const googleRegion = googleStart >= 0 && googleEnd > googleStart ? content.slice(googleStart, googleEnd) : "";
  expect(googleRegion.includes("path: mapProviderGoogleCoordinatePath(definition.coordinates)"), `${labelPrefix} Google web normalizes polyline coordinates`);
  expect(googleRegion.includes("paths: mapProviderGooglePolygonPaths(definition.coordinates)"), `${labelPrefix} Google web normalizes polygon coordinates and rings`);

  const appleStart = content.indexOf("class AppleMapsWebShapeOverlay");
  const appleEnd = content.indexOf("class NativeBridgeMapProvider");
  expect(appleStart >= 0 && appleEnd > appleStart, `${labelPrefix} has Apple web shape coordinate region`);
  const appleRegion = appleStart >= 0 && appleEnd > appleStart ? content.slice(appleStart, appleEnd) : "";
  expect(appleRegion.includes("mapProviderAppleCoordinatePath(this.mapkit, definition.coordinates)"), `${labelPrefix} Apple web normalizes shape coordinates`);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function expect(ok, label) {
  checks.push({
    label,
    ok,
  });
}
