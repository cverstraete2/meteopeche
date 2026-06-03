import Capacitor
import Foundation
import MapKit
import UIKit

private class MeteoPecheMapAnnotation: NSObject, MKAnnotation {
    let itemId: String
    let itemType: String
    dynamic var coordinate: CLLocationCoordinate2D
    var title: String?
    var subtitle: String?

    init(itemId: String, itemType: String, coordinate: CLLocationCoordinate2D, title: String?, subtitle: String?) {
        self.itemId = itemId
        self.itemType = itemType
        self.coordinate = coordinate
        self.title = title
        self.subtitle = subtitle
    }
}

private class MeteoPecheMapTileOverlay: MKTileOverlay {
    private let mapTileSize = 256
    let overlayId: String
    let definition: [String: Any]

    init(overlayId: String, definition: [String: Any]) {
        self.overlayId = overlayId
        self.definition = definition
        super.init(urlTemplate: definition["url"] as? String)
        canReplaceMapContent = false
        if let minZoom = MeteoPecheMapTileOverlay.intValue(definition["minZoom"]) {
            minimumZ = minZoom
        }
        if let maxZoom = MeteoPecheMapTileOverlay.intValue(definition["maxZoom"]) {
            maximumZ = maxZoom
        }
    }

    override func url(forTilePath path: MKTileOverlayPath) -> URL {
        let type = definition["type"] as? String ?? ""
        let urlString: String
        if type == "wms" {
            urlString = wmsTileUrl(path)
        } else {
            urlString = xyzTileUrl(path)
        }
        return URL(string: urlString) ?? URL(string: "about:blank")!
    }

    private func xyzTileUrl(_ path: MKTileOverlayPath) -> String {
        let template = definition["url"] as? String ?? ""
        let worldTileCount = 1 << max(path.z, 0)
        return template
            .replacingOccurrences(of: "{z}", with: String(path.z))
            .replacingOccurrences(of: "{x}", with: String(wrapTileX(path.x, worldTileCount: worldTileCount)))
            .replacingOccurrences(of: "{y}", with: String(path.y))
    }

    private func wmsTileUrl(_ path: MKTileOverlayPath) -> String {
        let bbox = tileBbox4326(path)
        var components = URLComponents(string: definition["url"] as? String ?? "")
        components?.queryItems = [
            URLQueryItem(name: "service", value: "WMS"),
            URLQueryItem(name: "request", value: "GetMap"),
            URLQueryItem(name: "version", value: definition["version"] as? String ?? "1.3.0"),
            URLQueryItem(name: "layers", value: definition["layers"] as? String ?? ""),
            URLQueryItem(name: "styles", value: definition["styles"] as? String ?? ""),
            URLQueryItem(name: "format", value: definition["format"] as? String ?? "image/png"),
            URLQueryItem(name: "transparent", value: String(definition["transparent"] as? Bool ?? true)),
            URLQueryItem(name: "width", value: String(mapTileSize)),
            URLQueryItem(name: "height", value: String(mapTileSize)),
            URLQueryItem(name: "crs", value: "EPSG:4326"),
            URLQueryItem(name: "bbox", value: String(format: "%.6f,%.6f,%.6f,%.6f", bbox[0], bbox[1], bbox[2], bbox[3]))
        ]
        return components?.url?.absoluteString ?? ""
    }

    private func tileBbox4326(_ path: MKTileOverlayPath) -> [Double] {
        let worldTileCount = 1 << max(path.z, 0)
        let wrappedX = wrapTileX(path.x, worldTileCount: worldTileCount)
        let westNorth = unprojectLatLon(pixelX: Double(wrappedX * mapTileSize), pixelY: Double(path.y * mapTileSize), zoom: path.z)
        let eastSouth = unprojectLatLon(pixelX: Double((wrappedX + 1) * mapTileSize), pixelY: Double((path.y + 1) * mapTileSize), zoom: path.z)
        return [eastSouth.lat, westNorth.lon, westNorth.lat, eastSouth.lon]
    }

    private func unprojectLatLon(pixelX: Double, pixelY: Double, zoom: Int) -> (lat: Double, lon: Double) {
        let scale = Double(mapTileSize) * pow(2.0, Double(max(zoom, 0)))
        let lon = (pixelX / scale) * 360.0 - 180.0
        let n = Double.pi - (2.0 * Double.pi * pixelY) / scale
        let lat = atan(sinh(n)) * 180.0 / Double.pi
        return (lat, lon)
    }

    private func wrapTileX(_ x: Int, worldTileCount: Int) -> Int {
        guard worldTileCount > 0 else { return x }
        return ((x % worldTileCount) + worldTileCount) % worldTileCount
    }

    private static func intValue(_ value: Any?) -> Int? {
        if let value = value as? Int { return value }
        if let value = value as? NSNumber { return value.intValue }
        if let value = value as? String { return Int(value) }
        return nil
    }
}

@objc(MeteoPecheMapPlugin)
class MeteoPecheMapPlugin: CAPPlugin, CAPBridgedPlugin, MKMapViewDelegate, UIGestureRecognizerDelegate {
    private typealias MapKitAnnotationUpdate = (
        itemId: String,
        itemType: String,
        payload: [String: Any],
        coordinate: CLLocationCoordinate2D,
        title: String?,
        subtitle: String?
    )

    private let notReadyReason = "native-map-renderer-not-implemented"
    private let providerId = "apple-native"
    private let bridgeProtocolVersion = 1
    private let maxCommands = 80
    private let supportedCommands = [
        "getStatus",
        "isReady",
        "getDebugState",
        "init",
        "setView",
        "invalidateSize",
        "setInteractionRegions",
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
        "destroy"
    ]
    private let supportedEvents = [
        "map:apple-native:click",
        "map:apple-native:moveend",
        "map:apple-native:zoomend"
    ]
    private let supportedProviders = ["apple-native"]
    private var commandLog: [[String: Any]] = []
    private var commandTypeCounts: [String: Int] = [:]
    private var eventLog: [[String: Any]] = []
    private var eventTypeCounts: [String: Int] = [:]
    private var lastContainerMetrics: [String: Any]?
    private var mapView: MKMapView?
    private var mapViewFrame: [String: Any]?
    private var lastCameraCenter: [String: Any]?
    private var lastCameraZoom: Double?
    private var tileOverlays: [String: MKTileOverlay] = [:]
    private var tileOverlayDefinitions: [String: [String: Any]] = [:]
    private var tileOverlayVisibility: [String: Bool] = [:]
    private var annotations: [String: MeteoPecheMapAnnotation] = [:]
    private var annotationPayloads: [String: [String: Any]] = [:]
    private var itemVisibility: [String: Bool] = [:]
    private var shapeOverlays: [String: MKOverlay] = [:]
    private var shapeOverlayItemIds: [ObjectIdentifier: String] = [:]
    private var shapeItemTypes: [String: String] = [:]
    private var shapePayloads: [String: [String: Any]] = [:]
    private var layerMembership: [String: Set<String>] = [:]
    private var layerChildren: [String: Set<String>] = [:]
    private var layerVisibility: [String: Bool] = [:]
    private var itemLayers: [String: String] = [:]
    private var pinTiers: [String: [String: Any]] = [:]
    private var pinTierVisibility: [String: Bool] = [:]
    private var mapTapRecognizer: UITapGestureRecognizer?

    let identifier = "MeteoPecheMapPlugin"
    let jsName = "MeteoPecheMap"
    let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getStatus", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isReady", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getDebugState", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "init", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setView", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "invalidateSize", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setInteractionRegions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "createTileOverlay", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setLayerVisible", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "clearLayer", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "configurePinTier", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "createItem", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "createItems", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "addToLayer", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "addItemsToLayer", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "updateItem", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setItemVisible", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setItemsVisible", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "createShapeItem", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setPinTierVisible", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "removeItem", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "removeFromLayer", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "destroy", returnType: CAPPluginReturnPromise)
    ]

    @objc func getStatus(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            call.resolve(self.statusPayload(call))
        }
    }

    @objc func isReady(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            call.resolve(self.statusPayload(call))
        }
    }

    @objc func getDebugState(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let ready = self.isAppleNativeRequest(call)
            call.resolve([
                "ready": ready,
                "reason": ready ? "" : self.notReadyReason,
                "providerId": call.getString("providerId") ?? "",
                "supportedProviders": self.supportedProviders,
                "bridgeProtocolVersion": self.bridgeProtocolVersion,
                "supportedCommands": self.supportedCommands,
                "supportedEvents": self.supportedEvents,
                "commandCount": self.commandLog.count,
                "commandTypeCounts": self.commandTypeCounts,
                "lastContainerMetrics": self.lastContainerMetrics ?? NSNull(),
                "renderer": self.rendererDebugState(),
                "eventCount": self.eventLog.count,
                "eventTypeCounts": self.eventTypeCounts,
                "events": self.eventLog,
                "commands": self.commandLog
            ])
        }
    }

    @objc func `init`(_ call: CAPPluginCall) {
        recordCommand("init", call)
        guard isAppleNativeRequest(call) else {
            call.reject("MeteoPeche native map renderer is only available for apple-native on iOS", "NATIVE_MAP_PROVIDER_UNSUPPORTED")
            return
        }
        ensureMapKitView(call)
        call.resolve([
            "ok": true,
            "providerId": providerId,
            "rendererReady": true
        ])
    }

    @objc func setView(_ call: CAPPluginCall) {
        applyCamera(call)
        resolveCommand(call, "setView")
    }

    @objc func invalidateSize(_ call: CAPPluginCall) {
        applyContainerMetrics(call.getObject("containerMetrics"))
        resolveCommand(call, "invalidateSize")
    }

    @objc func setInteractionRegions(_ call: CAPPluginCall) {
        applyInteractionRegions(call)
        resolveCommand(call, "setInteractionRegions")
    }

    @objc func createTileOverlay(_ call: CAPPluginCall) {
        createMapKitTileOverlay(call)
        resolveCommand(call, "createTileOverlay")
    }

    @objc func setLayerVisible(_ call: CAPPluginCall) {
        setMapKitLayerVisible(call)
        resolveCommand(call, "setLayerVisible")
    }

    @objc func clearLayer(_ call: CAPPluginCall) {
        clearMapKitLayer(call)
        resolveCommand(call, "clearLayer")
    }

    @objc func configurePinTier(_ call: CAPPluginCall) {
        configureMapKitPinTier(call)
        resolveCommand(call, "configurePinTier")
    }

    @objc func createItem(_ call: CAPPluginCall) {
        createMapKitItem(call)
        resolveCommand(call, "createItem")
    }

    @objc func createItems(_ call: CAPPluginCall) {
        createMapKitItems(call)
        resolveCommand(call, "createItems")
    }

    @objc func addToLayer(_ call: CAPPluginCall) {
        addMapKitItemToLayer(call)
        resolveCommand(call, "addToLayer")
    }

    @objc func addItemsToLayer(_ call: CAPPluginCall) {
        addMapKitItemsToLayer(call)
        resolveCommand(call, "addItemsToLayer")
    }

    @objc func updateItem(_ call: CAPPluginCall) {
        updateMapKitItem(call)
        resolveCommand(call, "updateItem")
    }

    @objc func setItemVisible(_ call: CAPPluginCall) {
        setMapKitItemVisible(call)
        resolveCommand(call, "setItemVisible")
    }

    @objc func setItemsVisible(_ call: CAPPluginCall) {
        setMapKitItemsVisible(call)
        resolveCommand(call, "setItemsVisible")
    }

    @objc func createShapeItem(_ call: CAPPluginCall) {
        createMapKitShapeItem(call)
        resolveCommand(call, "createShapeItem")
    }

    @objc func setPinTierVisible(_ call: CAPPluginCall) {
        setMapKitPinTierVisible(call)
        resolveCommand(call, "setPinTierVisible")
    }

    @objc func removeItem(_ call: CAPPluginCall) {
        removeMapKitItem(call)
        resolveCommand(call, "removeItem")
    }

    @objc func removeFromLayer(_ call: CAPPluginCall) {
        removeMapKitItemFromLayer(call)
        resolveCommand(call, "removeFromLayer")
    }

    @objc func destroy(_ call: CAPPluginCall) {
        recordCommand("destroy", call)
        DispatchQueue.main.async {
            self.mapView?.removeFromSuperview()
            self.mapView = nil
            self.mapViewFrame = nil
            self.tileOverlays.removeAll()
            self.tileOverlayDefinitions.removeAll()
            self.tileOverlayVisibility.removeAll()
            self.annotations.removeAll()
            self.annotationPayloads.removeAll()
            self.itemVisibility.removeAll()
            self.shapeOverlays.removeAll()
            self.shapeOverlayItemIds.removeAll()
            self.shapeItemTypes.removeAll()
            self.shapePayloads.removeAll()
            self.layerMembership.removeAll()
            self.layerChildren.removeAll()
            self.layerVisibility.removeAll()
            self.itemLayers.removeAll()
            self.pinTiers.removeAll()
            self.pinTierVisibility.removeAll()
            self.mapTapRecognizer = nil
            if let passthroughWebView = self.webView as? MeteoPechePassthroughWebView {
                passthroughWebView.nativeMapPassthroughEnabled = false
                passthroughWebView.nativeMapFrame = .null
                passthroughWebView.nativeMapInteractiveRects = []
            }
        }
        call.resolve()
    }

    private func statusPayload(_ call: CAPPluginCall) -> [String: Any] {
        let ready = isAppleNativeRequest(call)
        let payload: [String: Any] = [
            "ready": ready,
            "providerId": call.getString("providerId") ?? "",
            "supportedProviders": supportedProviders,
            "bridgeProtocolVersion": bridgeProtocolVersion,
            "supportedCommands": supportedCommands,
            "supportedEvents": supportedEvents,
            "reason": ready ? "" : notReadyReason,
            "commandCount": commandLog.count,
            "commandTypeCounts": commandTypeCounts,
            "lastContainerMetrics": lastContainerMetrics ?? NSNull(),
            "renderer": rendererDebugState(),
            "eventCount": eventLog.count,
            "eventTypeCounts": eventTypeCounts
        ]
        return payload
    }

    private func isAppleNativeRequest(_ call: CAPPluginCall) -> Bool {
        let requestedProvider = call.getString("providerId") ?? providerId
        return requestedProvider == providerId
    }

    private func resolveCommand(_ call: CAPPluginCall, _ command: String) {
        recordCommand(command, call)
        call.resolve([
            "ok": true,
            "command": command,
            "rendererReady": false
        ])
    }

    private func recordCommand(_ command: String, _ call: CAPPluginCall) {
        let containerMetrics = call.getObject("containerMetrics")
        let providerId = call.getString("providerId") ?? ""
        let timestamp = Date().timeIntervalSince1970 * 1000
        DispatchQueue.main.async {
            if let metrics = containerMetrics {
                self.lastContainerMetrics = metrics
            }
            self.commandTypeCounts[command] = (self.commandTypeCounts[command] ?? 0) + 1

            self.commandLog.append([
                "command": command,
                "providerId": providerId,
                "hasContainerMetrics": containerMetrics != nil,
                "timestamp": timestamp
            ])
            if self.commandLog.count > self.maxCommands {
                self.commandLog.removeFirst(self.commandLog.count - self.maxCommands)
            }
        }
    }

    private func emitMapKitEvent(_ eventName: String, payload: [String: Any]) {
        guard Thread.isMainThread else {
            DispatchQueue.main.async {
                self.emitMapKitEvent(eventName, payload: payload)
            }
            return
        }
        let bridgeEventName = "map:apple-native:\(eventName)"
        eventTypeCounts[bridgeEventName] = (eventTypeCounts[bridgeEventName] ?? 0) + 1
        eventLog.append([
            "eventName": bridgeEventName,
            "payload": payload,
            "timestamp": Date().timeIntervalSince1970 * 1000
        ])
        if eventLog.count > maxCommands {
            eventLog.removeFirst(eventLog.count - maxCommands)
        }
        notifyListeners(bridgeEventName, data: payload)
    }

    private func rendererDebugState() -> [String: Any] {
        [
            "kind": "mapkit",
            "providerId": providerId,
            "implemented": true,
            "ready": true,
            "mapViewCreated": mapView != nil,
            "mapViewAttached": mapView?.superview != nil,
            "mapViewHidden": mapView?.isHidden ?? true,
            "frame": mapViewFrame ?? NSNull(),
            "interactionRegionCount": (webView as? MeteoPechePassthroughWebView)?.nativeMapInteractiveRects.count ?? 0,
            "lastCameraCenter": lastCameraCenter ?? NSNull(),
            "lastCameraZoom": lastCameraZoom ?? NSNull(),
            "tileOverlayCount": tileOverlays.count,
            "tileOverlayIds": Array(tileOverlays.keys).sorted(),
            "tileOverlayTypes": tileOverlayTypesDebugState(),
            "tileOverlayVisibility": tileOverlayVisibility,
            "nativeTileOverlayCount": tileOverlays.count,
            "annotationCount": annotations.count,
            "annotationIds": Array(annotations.keys).sorted(),
            "markerCount": annotations.count,
            "markerIds": Array(annotations.keys).sorted(),
            "nativeMarkerCount": annotations.count,
            "markerCalloutCount": markerCalloutCount(),
            "markerClassNames": markerClassNamesDebugState(),
            "markerAnchorCount": markerPayloadCount(for: "iconAnchor"),
            "markerTooltipAnchorCount": markerPayloadCount(for: "tooltipAnchor"),
            "markerPopupAnchorCount": markerPayloadCount(for: "popupAnchor"),
            "markerOpacityCount": markerPayloadCount(for: "opacity"),
            "markerZIndexCount": markerPayloadCount(for: "zIndexOffset"),
            "shapeOverlayCount": shapeOverlays.count,
            "shapeOverlayIds": Array(shapeOverlays.keys).sorted(),
            "nativeCircleCount": shapeTypeCount(["circle", "circle-marker"]),
            "nativePolylineCount": shapeTypeCount(["polyline"]),
            "nativePolygonCount": shapeTypeCount(["polygon"]),
            "shapeCount": shapeOverlays.count,
            "shapeIds": Array(shapeOverlays.keys).sorted(),
            "shapePopupCount": shapePayloadCount(for: "popup"),
            "shapeTooltipCount": shapePayloadCount(for: "tooltip"),
            "itemVisibility": itemVisibility,
            "itemTypeCounts": itemTypeCountsDebugState(),
            "layerCount": layerMembership.count,
            "layerMembership": layerMembershipDebugState(),
            "layerChildren": layerChildrenDebugState(),
            "layerVisibility": layerVisibility,
            "pinTierCount": pinTiers.count,
            "pinTierIds": Array(pinTiers.keys).sorted(),
            "pinTierVisibility": pinTierVisibility
        ]
    }

    private func markerCalloutCount() -> Int {
        annotationPayloads.values.filter { payload in
            let title = (payload["title"] as? String ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
            let tooltip = payload["tooltip"] as? [String: Any]
            let tooltipContent = plainText(tooltip?["content"] as? String ?? "")
            return !title.isEmpty || !tooltipContent.isEmpty
        }.count
    }

    private func markerClassNamesDebugState() -> [String] {
        Array(Set(annotationPayloads.values.compactMap { payload in
            let icon = payload["icon"] as? [String: Any]
            let className = (icon?["className"] as? String ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
            return className.isEmpty ? nil : className
        })).sorted()
    }

    private func markerPayloadCount(for key: String) -> Int {
        annotationPayloads.values.filter { payload in
            if key == "iconAnchor" || key == "tooltipAnchor" || key == "popupAnchor" {
                let icon = payload["icon"] as? [String: Any]
                return numericPair(icon?[key]) != nil && numericPair(icon?["iconSize"]) != nil
            }
            return payload[key] != nil
        }.count
    }

    private func itemTypeCountsDebugState() -> [String: Int] {
        var counts: [String: Int] = [:]
        annotations.values.forEach { annotation in
            counts[annotation.itemType] = (counts[annotation.itemType] ?? 0) + 1
        }
        shapeItemTypes.values.forEach { itemType in
            counts[itemType] = (counts[itemType] ?? 0) + 1
        }
        return counts
    }

    private func shapeTypeCount(_ types: Set<String>) -> Int {
        shapeItemTypes.values.filter { types.contains($0) }.count
    }

    private func shapePayloadCount(for key: String) -> Int {
        shapePayloads.values.filter { payload in
            if let value = payload[key] as? String {
                return !value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            }
            if let value = payload[key] as? [String: Any] {
                return !(value["content"] as? String ?? "").trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            }
            return false
        }.count
    }

    private func ensureMapKitView(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            if self.mapView == nil {
                let mapView = MKMapView(frame: .zero)
                self.configureMapKitView(mapView)
                self.bridge?.viewController?.view.insertSubview(mapView, at: 0)
                self.mapView = mapView
            }
            self.applyContainerMetrics(call.getObject("containerMetrics"))
            self.applyCamera(call)
            self.applyInteractionRegions(call)
        }
    }

    private func createMapKitTileOverlay(_ call: CAPPluginCall) {
        let overlayPayload = call.getObject("overlay") ?? [:]
        let overlayId = call.getString("overlayId")
            ?? call.getString("layerId")
            ?? call.getString("id")
            ?? overlayPayload["id"] as? String
            ?? ""
        let url = call.getString("url") ?? overlayPayload["url"] as? String
        guard !overlayId.isEmpty, let url = url else { return }
        let minZoomValue = (call.getInt("minZoom") ?? intValue(overlayPayload["minZoom"])).map { $0 as Any } ?? NSNull()
        let maxZoomValue = (call.getInt("maxZoom") ?? intValue(overlayPayload["maxZoom"])).map { $0 as Any } ?? NSNull()
        let definition: [String: Any] = [
            "overlayId": overlayId,
            "type": call.getString("type") ?? overlayPayload["type"] as? String ?? "",
            "url": url,
            "minZoom": minZoomValue,
            "maxZoom": maxZoomValue,
            "opacity": call.getDouble("opacity") ?? doubleValue(overlayPayload["opacity"]) ?? 1,
            "layers": overlayPayload["layers"] as? String ?? "",
            "styles": overlayPayload["styles"] as? String ?? "",
            "format": overlayPayload["format"] as? String ?? "image/png",
            "transparent": overlayPayload["transparent"] as? Bool ?? true,
            "version": overlayPayload["version"] as? String ?? "1.3.0",
            "renderer": "mapkit-tile-overlay-native"
        ]
        DispatchQueue.main.async {
            self.tileOverlayDefinitions[overlayId] = definition
            self.ensureMapKitViewForOverlay()
            if let existingOverlay = self.tileOverlays[overlayId] {
                self.mapView?.removeOverlay(existingOverlay)
            }
            let overlay = MeteoPecheMapTileOverlay(overlayId: overlayId, definition: definition)
            self.tileOverlays[overlayId] = overlay
            self.tileOverlayVisibility[overlayId] = true
            self.mapView?.addOverlay(overlay, level: .aboveLabels)
        }
    }

    private func setMapKitLayerVisible(_ call: CAPPluginCall) {
        let layerId = call.getString("layerId") ?? call.getString("overlayId") ?? call.getString("id") ?? ""
        guard !layerId.isEmpty else { return }
        let visible = call.getBool("visible") ?? true
        DispatchQueue.main.async {
            self.setMapKitLayerVisibleById(layerId, visible: visible, visitedLayerIds: Set<String>())
        }
    }

    private func setMapKitLayerVisibleById(_ layerId: String, visible: Bool, visitedLayerIds: Set<String>) {
        guard Thread.isMainThread, !layerId.isEmpty, !visitedLayerIds.contains(layerId) else { return }
        var visitedLayerIds = visitedLayerIds
        visitedLayerIds.insert(layerId)
        layerVisibility[layerId] = visible
        let childLayerIds = Array(layerChildren[layerId] ?? [])
        for childLayerId in childLayerIds {
            setMapKitLayerVisibleById(childLayerId, visible: visible, visitedLayerIds: visitedLayerIds)
        }
        let itemIds = Array(layerMembership[layerId] ?? [])
        for itemId in itemIds {
            if layerChildren[layerId]?.contains(itemId) == true { continue }
            setMapKitItemVisibleOnMain(itemId: itemId, visible: visible)
        }
        guard let overlay = tileOverlays[layerId] else { return }
        tileOverlayVisibility[layerId] = visible
        if visible {
            if !(mapView?.overlays.contains(where: { ($0 as? MKTileOverlay) === overlay }) ?? false) {
                mapView?.addOverlay(overlay, level: .aboveLabels)
            }
        } else {
            mapView?.removeOverlay(overlay)
        }
    }

    private func clearMapKitLayer(_ call: CAPPluginCall) {
        let layerId = call.getString("layerId") ?? call.getString("overlayId") ?? call.getString("id") ?? ""
        guard !layerId.isEmpty else { return }
        DispatchQueue.main.async {
            let overlay = self.tileOverlays.removeValue(forKey: layerId)
            self.tileOverlayDefinitions.removeValue(forKey: layerId)
            self.layerVisibility.removeValue(forKey: layerId)
            self.layerChildren.removeValue(forKey: layerId)
            let itemIds = self.layerMembership.removeValue(forKey: layerId) ?? []
            let annotationsToRemove = itemIds.compactMap { self.annotations.removeValue(forKey: $0) }
            let overlaysToRemove = itemIds.compactMap { itemId -> MKOverlay? in
                guard let overlay = self.shapeOverlays.removeValue(forKey: itemId) else { return nil }
                self.shapeOverlayItemIds.removeValue(forKey: self.shapeOverlayIdentifier(overlay))
                return overlay
            }
            itemIds.forEach { itemId in
                self.annotationPayloads.removeValue(forKey: itemId)
                self.shapeItemTypes.removeValue(forKey: itemId)
                self.shapePayloads.removeValue(forKey: itemId)
                self.itemLayers.removeValue(forKey: itemId)
                self.itemVisibility.removeValue(forKey: itemId)
            }
            self.tileOverlayVisibility.removeValue(forKey: layerId)
            if let overlay = overlay {
                self.mapView?.removeOverlay(overlay)
            }
            annotationsToRemove.forEach { self.mapView?.removeAnnotation($0) }
            overlaysToRemove.forEach { self.mapView?.removeOverlay($0) }
        }
    }

    private func configureMapKitPinTier(_ call: CAPPluginCall) {
        guard let tier = call.getObject("tier") else { return }
        let tierId = tier["id"] as? String ?? call.getString("tierId") ?? call.getString("id") ?? ""
        guard !tierId.isEmpty else { return }
        DispatchQueue.main.async {
            self.pinTiers[tierId] = tier
        }
    }

    private func setMapKitPinTierVisible(_ call: CAPPluginCall) {
        let tierId = call.getString("tierId") ?? call.getString("id") ?? ""
        guard !tierId.isEmpty else { return }
        let visible = call.getBool("visible") ?? true
        DispatchQueue.main.async {
            self.pinTierVisibility[tierId] = visible
        }
    }

    private func addMapKitItemToLayer(_ call: CAPPluginCall) {
        let layerId = call.getString("layerId") ?? ""
        let itemId = call.getString("itemId") ?? ""
        addMapKitLayerMembership(layerId: layerId, itemId: itemId, isLayer: call.getBool("isLayer") ?? false)
    }

    private func addMapKitItemsToLayer(_ call: CAPPluginCall) {
        let layerId = call.getString("layerId") ?? ""
        guard !layerId.isEmpty else { return }
        let memberships = rawArray(call, "items").compactMap { item -> (itemId: String, isLayer: Bool)? in
            guard let item = item as? [String: Any], let itemId = item["itemId"] as? String else { return nil }
            return (itemId: itemId, isLayer: item["isLayer"] as? Bool ?? false)
        }
        guard !memberships.isEmpty else { return }
        DispatchQueue.main.async {
            memberships.forEach { membership in
                self.addMapKitLayerMembershipOnMain(layerId: layerId, itemId: membership.itemId, isLayer: membership.isLayer)
            }
        }
    }

    private func removeMapKitItemFromLayer(_ call: CAPPluginCall) {
        let layerId = call.getString("layerId") ?? ""
        let itemId = call.getString("itemId") ?? ""
        removeMapKitLayerMembership(layerId: layerId, itemId: itemId)
    }

    private func addMapKitLayerMembership(layerId: String, itemId: String, isLayer: Bool) {
        guard !layerId.isEmpty, !itemId.isEmpty else { return }
        DispatchQueue.main.async {
            self.addMapKitLayerMembershipOnMain(layerId: layerId, itemId: itemId, isLayer: isLayer)
        }
    }

    private func addMapKitLayerMembershipOnMain(layerId: String, itemId: String, isLayer: Bool) {
        guard Thread.isMainThread, !layerId.isEmpty, !itemId.isEmpty else { return }
        layerMembership[layerId, default: Set<String>()].insert(itemId)
        itemLayers[itemId] = layerId
        if isLayer {
            layerChildren[layerId, default: Set<String>()].insert(itemId)
        }
    }

    private func removeMapKitLayerMembership(layerId: String, itemId: String) {
        guard !layerId.isEmpty, !itemId.isEmpty else { return }
        DispatchQueue.main.async {
            self.removeMapKitLayerMembershipOnMain(layerId: layerId, itemId: itemId)
        }
    }

    private func removeMapKitItemFromMemberships(_ itemId: String) {
        guard !itemId.isEmpty else { return }
        guard Thread.isMainThread else {
            DispatchQueue.main.async {
                self.removeMapKitItemFromMemberships(itemId)
            }
            return
        }

        var layerIds = Set(layerMembership.keys)
        layerIds.formUnion(layerChildren.keys)
        if let layerId = itemLayers.removeValue(forKey: itemId) {
            layerIds.insert(layerId)
        }

        for layerId in layerIds {
            removeMapKitLayerMembershipOnMain(layerId: layerId, itemId: itemId)
        }
    }

    private func removeMapKitLayerMembershipOnMain(layerId: String, itemId: String) {
        guard Thread.isMainThread, !layerId.isEmpty, !itemId.isEmpty else { return }

        if var itemIds = layerMembership[layerId] {
            itemIds.remove(itemId)
            layerMembership[layerId] = itemIds.isEmpty ? nil : itemIds
        }

        if itemLayers[itemId] == layerId {
            itemLayers.removeValue(forKey: itemId)
        }

        if var childLayerIds = layerChildren[layerId] {
            childLayerIds.remove(itemId)
            layerChildren[layerId] = childLayerIds.isEmpty ? nil : childLayerIds
        }
    }

    private func layerMembershipDebugState() -> [String: [String]] {
        var layers: [String: [String]] = [:]
        for (layerId, itemIds) in layerMembership {
            layers[layerId] = Array(itemIds).sorted()
        }
        return layers
    }

    private func layerChildrenDebugState() -> [String: [String]] {
        var layers: [String: [String]] = [:]
        for (layerId, childLayerIds) in layerChildren {
            layers[layerId] = Array(childLayerIds).sorted()
        }
        return layers
    }

    private func tileOverlayTypesDebugState() -> [String: String] {
        var types: [String: String] = [:]
        for (overlayId, definition) in tileOverlayDefinitions {
            types[overlayId] = definition["type"] as? String ?? ""
        }
        return types
    }

    private func ensureMapKitViewForOverlay() {
        if self.mapView == nil {
            let mapView = MKMapView(frame: .zero)
            self.configureMapKitView(mapView)
            self.bridge?.viewController?.view.insertSubview(mapView, at: 0)
            self.mapView = mapView
        }
    }

    private func configureMapKitView(_ mapView: MKMapView) {
        mapView.isHidden = false
        mapView.isUserInteractionEnabled = true
        mapView.mapType = .standard
        mapView.delegate = self
        let tapRecognizer = UITapGestureRecognizer(target: self, action: #selector(handleMapKitTap(_:)))
        tapRecognizer.cancelsTouchesInView = false
        tapRecognizer.delegate = self
        mapView.addGestureRecognizer(tapRecognizer)
        mapTapRecognizer = tapRecognizer
    }

    @objc private func handleMapKitTap(_ recognizer: UITapGestureRecognizer) {
        guard
            recognizer.state == .ended,
            let mapView = recognizer.view as? MKMapView
        else { return }
        let point = recognizer.location(in: mapView)
        if mapKitHitView(mapView, at: point, contains: MKAnnotationView.self) { return }
        let coordinate = mapView.convert(point, toCoordinateFrom: mapView)
        guard CLLocationCoordinate2DIsValid(coordinate) else { return }
        emitMapKitEvent("click", payload: [
            "lat": coordinate.latitude,
            "lon": coordinate.longitude
        ])
    }

    private func mapKitHitView<T: UIView>(_ rootView: UIView, at point: CGPoint, contains viewType: T.Type) -> Bool {
        var hitView = rootView.hitTest(point, with: nil)
        while let view = hitView {
            if view is T { return true }
            hitView = view.superview
        }
        return false
    }

    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
        true
    }

    func mapView(_ mapView: MKMapView, rendererFor overlay: MKOverlay) -> MKOverlayRenderer {
        if let tileOverlay = overlay as? MKTileOverlay {
            let renderer = MKTileOverlayRenderer(tileOverlay: tileOverlay)
            if let meteoOverlay = tileOverlay as? MeteoPecheMapTileOverlay {
                renderer.alpha = CGFloat(max(0, min(1, doubleValue(meteoOverlay.definition["opacity"]) ?? 1)))
            }
            return renderer
        }
        if let circle = overlay as? MKCircle {
            let renderer = MKCircleRenderer(circle: circle)
            applyShapeStyle(renderer, itemId: shapeItemId(for: overlay))
            return renderer
        }
        if let polyline = overlay as? MKPolyline {
            let renderer = MKPolylineRenderer(polyline: polyline)
            applyShapeStyle(renderer, itemId: shapeItemId(for: overlay))
            return renderer
        }
        if let polygon = overlay as? MKPolygon {
            let renderer = MKPolygonRenderer(polygon: polygon)
            applyShapeStyle(renderer, itemId: shapeItemId(for: overlay))
            return renderer
        }
        return MKOverlayRenderer(overlay: overlay)
    }

    func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
        guard let meteoAnnotation = annotation as? MeteoPecheMapAnnotation else { return nil }
        let reuseId = "MeteoPecheMapAnnotation"
        let view = mapView.dequeueReusableAnnotationView(withIdentifier: reuseId) ?? MKMarkerAnnotationView(annotation: annotation, reuseIdentifier: reuseId)
        view.annotation = annotation
        view.canShowCallout = meteoAnnotation.title != nil || meteoAnnotation.subtitle != nil
        view.isHidden = itemVisibility[meteoAnnotation.itemId] == false
        applyMarkerViewStyle(view, annotation: meteoAnnotation)
        return view
    }

    private func applyMarkerViewStyle(_ view: MKAnnotationView, annotation: MeteoPecheMapAnnotation) {
        let payload = annotationPayloads[annotation.itemId] ?? [:]
        view.centerOffset = markerCenterOffset(payload)
        view.alpha = CGFloat(max(0, min(1, doubleValue(payload["opacity"]) ?? 1)))
        view.isEnabled = payload["interactive"] as? Bool ?? true
        view.layer.zPosition = CGFloat(doubleValue(payload["zIndexOffset"]) ?? 0)
    }

    private func markerCenterOffset(_ payload: [String: Any]) -> CGPoint {
        guard
            let icon = payload["icon"] as? [String: Any],
            let size = numericPair(icon["iconSize"]),
            let anchor = numericPair(icon["iconAnchor"])
        else { return .zero }
        return CGPoint(x: size.0 / 2 - anchor.0, y: size.1 / 2 - anchor.1)
    }

    func mapView(_ mapView: MKMapView, regionDidChangeAnimated animated: Bool) {
        let zoom = mapKitZoomLevel(mapView)
        let payload: [String: Any] = [
            "center": [
                "lat": mapView.centerCoordinate.latitude,
                "lon": mapView.centerCoordinate.longitude
            ],
            "zoom": zoom,
            "animated": animated
        ]
        lastCameraCenter = payload["center"] as? [String: Any]
        lastCameraZoom = zoom
        emitMapKitEvent("moveend", payload: payload)
        emitMapKitEvent("zoomend", payload: payload)
    }

    func mapView(_ mapView: MKMapView, didSelect view: MKAnnotationView) {
        guard let annotation = view.annotation as? MeteoPecheMapAnnotation else { return }
        emitMapKitEvent("click", payload: [
            "itemId": annotation.itemId,
            "lat": annotation.coordinate.latitude,
            "lon": annotation.coordinate.longitude
        ])
    }

    private func createMapKitItem(_ call: CAPPluginCall) {
        let itemId = call.getString("itemId") ?? ""
        let itemType = call.getString("type") ?? "marker"
        guard !itemId.isEmpty, let payload = call.getObject("payload") else { return }
        upsertMapKitAnnotation(itemId: itemId, itemType: itemType, payload: payload)
    }

    private func createMapKitItems(_ call: CAPPluginCall) {
        let updates = rawArray(call, "items").compactMap { item -> MapKitAnnotationUpdate? in
            guard
                let item = item as? [String: Any],
                let itemId = item["itemId"] as? String,
                let payload = item["payload"] as? [String: Any]
            else { return nil }
            return makeMapKitAnnotationUpdate(itemId: itemId, itemType: item["type"] as? String ?? "marker", payload: payload)
        }
        guard !updates.isEmpty else { return }
        DispatchQueue.main.async {
            self.ensureMapKitViewForOverlay()
            updates.forEach { update in
                self.upsertMapKitAnnotationOnMain(update, ensureView: false)
            }
        }
    }

    private func upsertMapKitAnnotation(itemId: String, itemType: String, payload: [String: Any]) {
        guard let update = makeMapKitAnnotationUpdate(itemId: itemId, itemType: itemType, payload: payload) else { return }
        DispatchQueue.main.async {
            self.upsertMapKitAnnotationOnMain(update)
        }
    }

    private func makeMapKitAnnotationUpdate(itemId: String, itemType: String, payload: [String: Any]) -> MapKitAnnotationUpdate? {
        guard let coordinate = coordinate(payload) else { return nil }
        let tooltip = payload["tooltip"] as? [String: Any]
        let tooltipContent = plainText(tooltip?["content"] as? String ?? "")
        let rawTitle = plainText(payload["title"] as? String ?? "")
        let title = !rawTitle.isEmpty ? rawTitle : (tooltipContent.isEmpty ? nil : tooltipContent)
        let subtitle = title == tooltipContent ? nil : (tooltipContent.isEmpty ? nil : tooltipContent)
        return (itemId: itemId, itemType: itemType, payload: payload, coordinate: coordinate, title: title, subtitle: subtitle)
    }

    private func upsertMapKitAnnotationOnMain(_ update: MapKitAnnotationUpdate, ensureView: Bool = true) {
        guard Thread.isMainThread else { return }
        if ensureView {
            ensureMapKitViewForOverlay()
        }
        let isVisible = itemVisibility[update.itemId] ?? true
        if itemVisibility[update.itemId] == nil {
            itemVisibility[update.itemId] = true
        }
        if let annotation = annotations[update.itemId] {
            annotationPayloads[update.itemId] = update.payload
            annotation.coordinate = update.coordinate
            annotation.title = update.title
            annotation.subtitle = update.subtitle
            if let view = mapView?.view(for: annotation) {
                view.canShowCallout = update.title != nil || update.subtitle != nil
                view.isHidden = itemVisibility[update.itemId] == false
                applyMarkerViewStyle(view, annotation: annotation)
            }
        } else {
            let annotation = MeteoPecheMapAnnotation(itemId: update.itemId, itemType: update.itemType, coordinate: update.coordinate, title: update.title, subtitle: update.subtitle)
            annotations[update.itemId] = annotation
            annotationPayloads[update.itemId] = update.payload
            if isVisible {
                mapView?.addAnnotation(annotation)
            }
        }
    }

    private func updateMapKitItem(_ call: CAPPluginCall) {
        guard let itemId = call.getString("itemId"), let payload = call.getObject("payload") else { return }
        let itemType = call.getString("type") ?? "marker"
        DispatchQueue.main.async {
            let mergedPayload = self.annotationPayloads[itemId]?.merging(payload) { _, new in new } ?? payload
            guard let update = self.makeMapKitAnnotationUpdate(itemId: itemId, itemType: itemType, payload: mergedPayload) else { return }
            self.upsertMapKitAnnotationOnMain(update)
        }
    }

    private func setMapKitItemVisible(_ call: CAPPluginCall) {
        guard let itemId = call.getString("itemId") else { return }
        let visible = call.getBool("visible") ?? true
        DispatchQueue.main.async {
            self.itemVisibility[itemId] = visible
            if let annotation = self.annotations[itemId] {
                if visible {
                    if !(self.mapView?.annotations.contains(where: { ($0 as? MeteoPecheMapAnnotation)?.itemId == itemId }) ?? false) {
                        self.mapView?.addAnnotation(annotation)
                    }
                } else {
                    self.mapView?.removeAnnotation(annotation)
                }
            }
            if let overlay = self.shapeOverlays[itemId] {
                if visible {
                    if !(self.mapView?.overlays.contains(where: { self.shapeItemId(for: $0) == itemId }) ?? false) {
                        self.mapView?.addOverlay(overlay, level: .aboveLabels)
                    }
                } else {
                    self.mapView?.removeOverlay(overlay)
                }
            }
        }
    }

    private func setMapKitItemsVisible(_ call: CAPPluginCall) {
        let visible = call.getBool("visible") ?? true
        let itemIds = rawArray(call, "itemIds").compactMap { $0 as? String }
        DispatchQueue.main.async {
            itemIds.forEach { itemId in
                self.setMapKitItemVisibleOnMain(itemId: itemId, visible: visible)
            }
        }
    }

    private func setMapKitItemVisiblePayload(_ payload: [String: Any]) {
        guard let itemId = payload["itemId"] as? String else { return }
        let visible = payload["visible"] as? Bool ?? true
        DispatchQueue.main.async {
            self.setMapKitItemVisibleOnMain(itemId: itemId, visible: visible)
        }
    }

    private func setMapKitItemVisibleOnMain(itemId: String, visible: Bool) {
        guard Thread.isMainThread, !itemId.isEmpty else { return }
        itemVisibility[itemId] = visible
        if let annotation = annotations[itemId] {
            if visible {
                if !(mapView?.annotations.contains(where: { ($0 as? MeteoPecheMapAnnotation)?.itemId == itemId }) ?? false) {
                    mapView?.addAnnotation(annotation)
                }
            } else {
                mapView?.removeAnnotation(annotation)
            }
        }
        if let overlay = shapeOverlays[itemId] {
            if visible {
                if !(mapView?.overlays.contains(where: { shapeItemId(for: $0) == itemId }) ?? false) {
                    mapView?.addOverlay(overlay, level: .aboveLabels)
                }
            } else {
                mapView?.removeOverlay(overlay)
            }
        }
    }

    private func createMapKitShapeItem(_ call: CAPPluginCall) {
        let itemId = call.getString("itemId") ?? ""
        let type = call.getString("type") ?? ""
        guard !itemId.isEmpty, let payload = call.getObject("payload") else { return }
        guard let overlay = makeShapeOverlay(type: type, payload: payload) else { return }
        DispatchQueue.main.async {
            self.ensureMapKitViewForOverlay()
            let isVisible = self.itemVisibility[itemId] ?? true
            if self.itemVisibility[itemId] == nil {
                self.itemVisibility[itemId] = true
            }
            if let existing = self.shapeOverlays[itemId] {
                self.shapeOverlayItemIds.removeValue(forKey: self.shapeOverlayIdentifier(existing))
                self.mapView?.removeOverlay(existing)
            }
            self.shapeOverlays[itemId] = overlay
            self.shapeOverlayItemIds[self.shapeOverlayIdentifier(overlay)] = itemId
            self.shapeItemTypes[itemId] = type
            self.shapePayloads[itemId] = payload
            if isVisible {
                self.mapView?.addOverlay(overlay, level: .aboveLabels)
            }
        }
    }

    private func removeMapKitItem(_ call: CAPPluginCall) {
        guard let itemId = call.getString("itemId") else { return }
        DispatchQueue.main.async {
            if let annotation = self.annotations.removeValue(forKey: itemId) {
                self.mapView?.removeAnnotation(annotation)
            }
            if let overlay = self.shapeOverlays.removeValue(forKey: itemId) {
                self.shapeOverlayItemIds.removeValue(forKey: self.shapeOverlayIdentifier(overlay))
                self.mapView?.removeOverlay(overlay)
            }
            self.annotationPayloads.removeValue(forKey: itemId)
            self.shapeItemTypes.removeValue(forKey: itemId)
            self.shapePayloads.removeValue(forKey: itemId)
            self.itemVisibility.removeValue(forKey: itemId)
            self.removeMapKitItemFromMemberships(itemId)
        }
    }

    private func makeShapeOverlay(type: String, payload: [String: Any]) -> MKOverlay? {
        if type == "circle" || type == "circle-marker" {
            guard let center = coordinate(payload) else { return nil }
            let radius = doubleValue(payload["radius"]) ?? (type == "circle-marker" ? 12 : 1)
            return MKCircle(center: center, radius: max(radius, 1))
        }
        let coordinates = coordinateList(payload["coordinates"])
        if type == "polyline", !coordinates.isEmpty {
            return MKPolyline(coordinates: coordinates, count: coordinates.count)
        }
        if type == "polygon", !coordinates.isEmpty {
            return MKPolygon(coordinates: coordinates, count: coordinates.count)
        }
        return nil
    }

    private func applyShapeStyle(_ renderer: MKOverlayPathRenderer, itemId: String?) {
        let payload = itemId.flatMap { shapePayloads[$0] } ?? [:]
        let baseStrokeColor = uiColor(payload["color"], fallback: UIColor.systemBlue)
        let baseFillColor = uiColor(payload["fillColor"], fallback: baseStrokeColor)
        renderer.strokeColor = colorWithOpacity(baseStrokeColor, opacity: doubleValue(payload["opacity"]) ?? 1)
        renderer.lineWidth = CGFloat(doubleValue(payload["weight"]) ?? 2)
        renderer.alpha = 1
        renderer.fillColor = colorWithOpacity(baseFillColor, opacity: doubleValue(payload["fillOpacity"]) ?? 0.18)
        renderer.lineDashPattern = lineDashPattern(payload["dashArray"])
    }

    private func shapeItemId(for overlay: MKOverlay) -> String? {
        shapeOverlayItemIds[shapeOverlayIdentifier(overlay)]
    }

    private func shapeOverlayIdentifier(_ overlay: MKOverlay) -> ObjectIdentifier {
        ObjectIdentifier(overlay as AnyObject)
    }

    private func lineDashPattern(_ value: Any?) -> [NSNumber]? {
        guard let dashArray = value as? String else { return nil }
        let values = dashArray
            .split { $0 == " " || $0 == "," }
            .compactMap { Double($0) }
            .filter { $0.isFinite && $0 > 0 }
            .map { NSNumber(value: $0) }
        return values.isEmpty ? nil : values
    }

    private func applyContainerMetrics(_ metrics: [String: Any]?) {
        guard let metrics = metrics else { return }
        let left = cgFloat(metrics["left"]) ?? 0
        let top = cgFloat(metrics["top"]) ?? 0
        let width = cgFloat(metrics["width"]) ?? 0
        let height = cgFloat(metrics["height"]) ?? 0
        let frame = CGRect(x: left, y: top, width: max(width, 0), height: max(height, 0))
        DispatchQueue.main.async {
            self.mapView?.frame = frame
            self.mapView?.autoresizingMask = []
            if let passthroughWebView = self.webView as? MeteoPechePassthroughWebView {
                passthroughWebView.nativeMapFrame = frame
            }
            self.mapViewFrame = [
                "left": Double(left),
                "top": Double(top),
                "width": Double(width),
                "height": Double(height),
                "nativeFrame": [
                    "left": Double(self.mapView?.frame.origin.x ?? 0),
                    "top": Double(self.mapView?.frame.origin.y ?? 0),
                    "width": Double(self.mapView?.frame.width ?? 0),
                    "height": Double(self.mapView?.frame.height ?? 0)
                ]
            ]
        }
    }

    private func applyInteractionRegions(_ call: CAPPluginCall) {
        let enabled = call.getBool("passthroughEnabled") ?? true
        let mapFramePayload = call.getObject("mapFrame") ?? call.getObject("containerMetrics")
        let interactiveRects = rawArray(call, "interactiveRects")
            .compactMap { $0 as? [String: Any] }
            .compactMap { rectValue($0) }

        DispatchQueue.main.async {
            guard let passthroughWebView = self.webView as? MeteoPechePassthroughWebView else { return }
            passthroughWebView.nativeMapPassthroughEnabled = enabled
            passthroughWebView.nativeMapFrame = self.rectValue(mapFramePayload) ?? self.mapView?.frame ?? .null
            passthroughWebView.nativeMapInteractiveRects = interactiveRects
        }
    }

    private func applyCamera(_ call: CAPPluginCall) {
        let center = call.getObject("center")
        let requestedZoom = call.getDouble("zoom")
        DispatchQueue.main.async {
            guard
                let lat = self.doubleValue(center?["lat"]),
                let lon = self.doubleValue(center?["lon"])
            else { return }
            let rawZoom = requestedZoom ?? self.lastCameraZoom ?? 10
            guard rawZoom.isFinite else { return }
            let zoom = min(22, max(1, rawZoom))
            let coordinate = CLLocationCoordinate2D(latitude: lat, longitude: lon)
            guard CLLocationCoordinate2DIsValid(coordinate) else { return }
            let spanDelta = min(180.0, max(0.002, 360.0 / pow(2.0, zoom)))
            let region = MKCoordinateRegion(
                center: coordinate,
                span: MKCoordinateSpan(latitudeDelta: spanDelta, longitudeDelta: spanDelta)
            )
            self.mapView?.setRegion(region, animated: false)
            self.lastCameraCenter = ["lat": lat, "lon": lon]
            self.lastCameraZoom = zoom
        }
    }

    private func mapKitZoomLevel(_ mapView: MKMapView) -> Double {
        let longitudeDelta = max(mapView.region.span.longitudeDelta, 0.000001)
        let zoom = log2(360.0 / longitudeDelta)
        return zoom.isFinite ? min(22, max(1, zoom)) : 1
    }

    private func doubleValue(_ value: Any?) -> Double? {
        if let value = value as? Double { return value.isFinite ? value : nil }
        if let value = value as? Int { return Double(value) }
        if let value = value as? NSNumber {
            let double = value.doubleValue
            return double.isFinite ? double : nil
        }
        if let value = value as? String, let double = Double(value) {
            return double.isFinite ? double : nil
        }
        return nil
    }

    private func rectValue(_ payload: [String: Any]?) -> CGRect? {
        guard
            let payload = payload,
            let left = cgFloat(payload["left"] ?? payload["x"]),
            let top = cgFloat(payload["top"] ?? payload["y"])
        else { return nil }

        let width = cgFloat(payload["width"])
            ?? cgFloat(payload["right"]).map { max(0, $0 - left) }
            ?? 0
        let height = cgFloat(payload["height"])
            ?? cgFloat(payload["bottom"]).map { max(0, $0 - top) }
            ?? 0
        guard width.isFinite, height.isFinite, width >= 0, height >= 0 else { return nil }
        return CGRect(x: left, y: top, width: width, height: height)
    }

    private func rawArray(_ call: CAPPluginCall, _ key: String) -> [Any] {
        if let array = call.options[key] as? [Any] {
            return array
        }
        if let array = call.options[key] as? NSArray {
            return array.compactMap { $0 }
        }
        return []
    }

    private func intValue(_ value: Any?) -> Int? {
        if let value = value as? Int { return value }
        if let value = value as? NSNumber { return value.intValue }
        if let value = value as? String { return Int(value) }
        return nil
    }

    private func coordinate(_ payload: [String: Any]) -> CLLocationCoordinate2D? {
        guard
            let lat = doubleValue(payload["lat"]),
            let lon = doubleValue(payload["lon"])
        else { return nil }
        let coordinate = CLLocationCoordinate2D(latitude: lat, longitude: lon)
        return CLLocationCoordinate2DIsValid(coordinate) ? coordinate : nil
    }

    private func coordinateList(_ value: Any?) -> [CLLocationCoordinate2D] {
        guard let entries = value as? [Any] else { return [] }
        let directCoordinates = entries.compactMap { coordinatePair($0) }
        if !directCoordinates.isEmpty {
            return directCoordinates
        }

        for entry in entries {
            guard let nestedEntries = entry as? [Any] else { continue }
            let nestedCoordinates = nestedEntries.compactMap { coordinatePair($0) }
            if !nestedCoordinates.isEmpty {
                return nestedCoordinates
            }
        }

        return []
    }

    private func coordinatePair(_ value: Any?) -> CLLocationCoordinate2D? {
        if let payload = value as? [String: Any] {
            return coordinate(payload)
        }
        guard let pair = value as? [Any], pair.count >= 2 else { return nil }
        guard let lat = doubleValue(pair[0]), let lon = doubleValue(pair[1]) else { return nil }
        let coordinate = CLLocationCoordinate2D(latitude: lat, longitude: lon)
        return CLLocationCoordinate2DIsValid(coordinate) ? coordinate : nil
    }

    private func numericPair(_ value: Any?) -> (Double, Double)? {
        guard let pair = value as? [Any], pair.count >= 2 else { return nil }
        guard let first = doubleValue(pair[0]), let second = doubleValue(pair[1]) else { return nil }
        return (first, second)
    }

    private func uiColor(_ value: Any?, fallback: UIColor) -> UIColor {
        guard let hex = value as? String else { return fallback }
        let cleaned = hex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
        guard cleaned.count == 6, let number = Int(cleaned, radix: 16) else { return fallback }
        return UIColor(
            red: CGFloat((number >> 16) & 0xff) / 255,
            green: CGFloat((number >> 8) & 0xff) / 255,
            blue: CGFloat(number & 0xff) / 255,
            alpha: 1
        )
    }

    private func plainText(_ value: String) -> String {
        value
            .replacingOccurrences(of: "<[^>]+>", with: " ", options: .regularExpression)
            .replacingOccurrences(of: "\\s+", with: " ", options: .regularExpression)
            .trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private func colorWithOpacity(_ color: UIColor, opacity: Double) -> UIColor {
        color.withAlphaComponent(CGFloat(max(0, min(1, opacity))))
    }

    private func cgFloat(_ value: Any?) -> CGFloat? {
        guard let double = doubleValue(value) else { return nil }
        return CGFloat(double)
    }
}
