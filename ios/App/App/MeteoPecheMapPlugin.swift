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
class MeteoPecheMapPlugin: CAPPlugin, CAPBridgedPlugin, MKMapViewDelegate {
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
    private var shapeItemTypes: [String: String] = [:]
    private var shapePayloads: [String: [String: Any]] = [:]
    private var layerMembership: [String: Set<String>] = [:]
    private var itemLayers: [String: String] = [:]
    private var pinTiers: [String: [String: Any]] = [:]
    private var pinTierVisibility: [String: Bool] = [:]

    let identifier = "MeteoPecheMapPlugin"
    let jsName = "MeteoPecheMap"
    let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getStatus", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isReady", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getDebugState", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "init", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setView", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "invalidateSize", returnType: CAPPluginReturnPromise),
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
        call.resolve(statusPayload(call))
    }

    @objc func isReady(_ call: CAPPluginCall) {
        call.resolve(statusPayload(call))
    }

    @objc func getDebugState(_ call: CAPPluginCall) {
        let ready = isAppleNativeRequest(call)
        call.resolve([
            "ready": ready,
            "reason": ready ? "" : notReadyReason,
            "providerId": call.getString("providerId") ?? "",
            "supportedProviders": supportedProviders,
            "bridgeProtocolVersion": bridgeProtocolVersion,
            "supportedCommands": supportedCommands,
            "supportedEvents": supportedEvents,
            "commandCount": commandLog.count,
            "commandTypeCounts": commandTypeCounts,
            "lastContainerMetrics": lastContainerMetrics ?? NSNull(),
            "renderer": rendererDebugState(),
            "eventCount": eventLog.count,
            "eventTypeCounts": eventTypeCounts,
            "events": eventLog,
            "commands": commandLog
        ])
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
            self.shapeItemTypes.removeAll()
            self.shapePayloads.removeAll()
            self.layerMembership.removeAll()
            self.itemLayers.removeAll()
            self.pinTiers.removeAll()
            self.pinTierVisibility.removeAll()
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
        if let metrics = containerMetrics {
            lastContainerMetrics = metrics
        }
        commandTypeCounts[command] = (commandTypeCounts[command] ?? 0) + 1

        commandLog.append([
            "command": command,
            "providerId": call.getString("providerId") ?? "",
            "hasContainerMetrics": containerMetrics != nil,
            "timestamp": Date().timeIntervalSince1970 * 1000
        ])
        if commandLog.count > maxCommands {
            commandLog.removeFirst(commandLog.count - maxCommands)
        }
    }

    private func emitMapKitEvent(_ eventName: String, payload: [String: Any]) {
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
            "lastCameraCenter": lastCameraCenter ?? NSNull(),
            "lastCameraZoom": lastCameraZoom ?? NSNull(),
            "tileOverlayCount": tileOverlays.count,
            "tileOverlayIds": Array(tileOverlays.keys).sorted(),
            "tileOverlayTypes": tileOverlayTypesDebugState(),
            "tileOverlayVisibility": tileOverlayVisibility,
            "annotationCount": annotations.count,
            "annotationIds": Array(annotations.keys).sorted(),
            "markerCalloutCount": markerCalloutCount(),
            "markerClassNames": markerClassNamesDebugState(),
            "markerAnchorCount": markerPayloadCount(for: "iconAnchor"),
            "markerOpacityCount": markerPayloadCount(for: "opacity"),
            "markerZIndexCount": markerPayloadCount(for: "zIndexOffset"),
            "shapeOverlayCount": shapeOverlays.count,
            "shapeOverlayIds": Array(shapeOverlays.keys).sorted(),
            "shapePopupCount": shapePayloadCount(for: "popup"),
            "shapeTooltipCount": shapePayloadCount(for: "tooltip"),
            "itemVisibility": itemVisibility,
            "itemTypeCounts": itemTypeCountsDebugState(),
            "layerCount": layerMembership.count,
            "layerMembership": layerMembershipDebugState(),
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
            if key == "iconAnchor" {
                let icon = payload["icon"] as? [String: Any]
                return numericPair(icon?["iconAnchor"]) != nil && numericPair(icon?["iconSize"]) != nil
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
                mapView.isHidden = false
                mapView.isUserInteractionEnabled = false
                mapView.mapType = .standard
                mapView.delegate = self
                self.bridge?.viewController?.view.insertSubview(mapView, at: 0)
                self.mapView = mapView
            }
            self.applyContainerMetrics(call.getObject("containerMetrics"))
            self.applyCamera(call)
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
        let definition: [String: Any] = [
            "overlayId": overlayId,
            "type": call.getString("type") ?? overlayPayload["type"] as? String ?? "",
            "url": url,
            "minZoom": call.getInt("minZoom") ?? intValue(overlayPayload["minZoom"]) ?? NSNull(),
            "maxZoom": call.getInt("maxZoom") ?? intValue(overlayPayload["maxZoom"]) ?? NSNull(),
            "opacity": call.getDouble("opacity") ?? doubleValue(overlayPayload["opacity"]) ?? 1,
            "layers": overlayPayload["layers"] as? String ?? "",
            "styles": overlayPayload["styles"] as? String ?? "",
            "format": overlayPayload["format"] as? String ?? "image/png",
            "transparent": overlayPayload["transparent"] as? Bool ?? true,
            "version": overlayPayload["version"] as? String ?? "1.3.0",
            "renderer": "mapkit-tile-overlay-native"
        ]
        tileOverlayDefinitions[overlayId] = definition
        DispatchQueue.main.async {
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
        guard !layerId.isEmpty, let overlay = tileOverlays[layerId] else { return }
        let visible = call.getBool("visible") ?? true
        DispatchQueue.main.async {
            self.tileOverlayVisibility[layerId] = visible
            if visible {
                if !(self.mapView?.overlays.contains(where: { ($0 as? MKTileOverlay) === overlay }) ?? false) {
                    self.mapView?.addOverlay(overlay, level: .aboveLabels)
                }
            } else {
                self.mapView?.removeOverlay(overlay)
            }
        }
    }

    private func clearMapKitLayer(_ call: CAPPluginCall) {
        let layerId = call.getString("layerId") ?? call.getString("overlayId") ?? call.getString("id") ?? ""
        guard !layerId.isEmpty else { return }
        let overlay = tileOverlays.removeValue(forKey: layerId)
        tileOverlayDefinitions.removeValue(forKey: layerId)
        let itemIds = layerMembership.removeValue(forKey: layerId) ?? []
        let annotationsToRemove = itemIds.compactMap { annotations.removeValue(forKey: $0) }
        let overlaysToRemove = itemIds.compactMap { shapeOverlays.removeValue(forKey: $0) }
        itemIds.forEach { itemId in
            annotationPayloads.removeValue(forKey: itemId)
            shapeItemTypes.removeValue(forKey: itemId)
            shapePayloads.removeValue(forKey: itemId)
            itemLayers.removeValue(forKey: itemId)
            itemVisibility.removeValue(forKey: itemId)
        }
        DispatchQueue.main.async {
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
        pinTiers[tierId] = tier
    }

    private func setMapKitPinTierVisible(_ call: CAPPluginCall) {
        let tierId = call.getString("tierId") ?? call.getString("id") ?? ""
        guard !tierId.isEmpty else { return }
        pinTierVisibility[tierId] = call.getBool("visible") ?? true
    }

    private func addMapKitItemToLayer(_ call: CAPPluginCall) {
        let layerId = call.getString("layerId") ?? ""
        let itemId = call.getString("itemId") ?? ""
        addMapKitLayerMembership(layerId: layerId, itemId: itemId)
    }

    private func addMapKitItemsToLayer(_ call: CAPPluginCall) {
        let layerId = call.getString("layerId") ?? ""
        guard !layerId.isEmpty, let items = call.getArray("items") else { return }
        for item in items {
            if let item = item as? [String: Any], let itemId = item["itemId"] as? String {
                addMapKitLayerMembership(layerId: layerId, itemId: itemId)
            }
        }
    }

    private func removeMapKitItemFromLayer(_ call: CAPPluginCall) {
        let layerId = call.getString("layerId") ?? ""
        let itemId = call.getString("itemId") ?? ""
        removeMapKitLayerMembership(layerId: layerId, itemId: itemId)
    }

    private func addMapKitLayerMembership(layerId: String, itemId: String) {
        guard !layerId.isEmpty, !itemId.isEmpty else { return }
        layerMembership[layerId, default: Set<String>()].insert(itemId)
        itemLayers[itemId] = layerId
    }

    private func removeMapKitLayerMembership(layerId: String, itemId: String) {
        guard !layerId.isEmpty, !itemId.isEmpty else { return }
        layerMembership[layerId]?.remove(itemId)
        if layerMembership[layerId]?.isEmpty == true {
            layerMembership.removeValue(forKey: layerId)
        }
        if itemLayers[itemId] == layerId {
            itemLayers.removeValue(forKey: itemId)
        }
    }

    private func removeMapKitItemFromMemberships(_ itemId: String) {
        guard !itemId.isEmpty else { return }
        if let layerId = itemLayers.removeValue(forKey: itemId) {
            layerMembership[layerId]?.remove(itemId)
            if layerMembership[layerId]?.isEmpty == true {
                layerMembership.removeValue(forKey: layerId)
            }
        }
        for layerId in Array(layerMembership.keys) {
            layerMembership[layerId]?.remove(itemId)
            if layerMembership[layerId]?.isEmpty == true {
                layerMembership.removeValue(forKey: layerId)
            }
        }
    }

    private func layerMembershipDebugState() -> [String: [String]] {
        var layers: [String: [String]] = [:]
        for (layerId, itemIds) in layerMembership {
            layers[layerId] = Array(itemIds).sorted()
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
            mapView.isHidden = false
            mapView.isUserInteractionEnabled = false
            mapView.mapType = .standard
            mapView.delegate = self
            self.bridge?.viewController?.view.insertSubview(mapView, at: 0)
            self.mapView = mapView
        }
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
        guard let items = call.getArray("items") else { return }
        for item in items {
            guard
                let item = item as? [String: Any],
                let itemId = item["itemId"] as? String,
                let payload = item["payload"] as? [String: Any]
            else { continue }
            upsertMapKitAnnotation(itemId: itemId, itemType: item["type"] as? String ?? "marker", payload: payload)
        }
    }

    private func upsertMapKitAnnotation(itemId: String, itemType: String, payload: [String: Any]) {
        guard let coordinate = coordinate(payload) else { return }
        let tooltip = payload["tooltip"] as? [String: Any]
        let tooltipContent = plainText(tooltip?["content"] as? String ?? "")
        let rawTitle = plainText(payload["title"] as? String ?? "")
        let title = !rawTitle.isEmpty ? rawTitle : (tooltipContent.isEmpty ? nil : tooltipContent)
        let subtitle = title == tooltipContent ? nil : (tooltipContent.isEmpty ? nil : tooltipContent)
        DispatchQueue.main.async {
            self.ensureMapKitViewForOverlay()
            let isVisible = self.itemVisibility[itemId] ?? true
            if self.itemVisibility[itemId] == nil {
                self.itemVisibility[itemId] = true
            }
            if let annotation = self.annotations[itemId] {
                self.annotationPayloads[itemId] = payload
                annotation.coordinate = coordinate
                annotation.title = title
                annotation.subtitle = subtitle
                if let view = self.mapView?.view(for: annotation) {
                    view.canShowCallout = title != nil || subtitle != nil
                    view.isHidden = self.itemVisibility[itemId] == false
                    self.applyMarkerViewStyle(view, annotation: annotation)
                }
            } else {
                let annotation = MeteoPecheMapAnnotation(itemId: itemId, itemType: itemType, coordinate: coordinate, title: title, subtitle: subtitle)
                self.annotations[itemId] = annotation
                self.annotationPayloads[itemId] = payload
                if isVisible {
                    self.mapView?.addAnnotation(annotation)
                }
            }
        }
    }

    private func updateMapKitItem(_ call: CAPPluginCall) {
        guard let itemId = call.getString("itemId"), let payload = call.getObject("payload") else { return }
        let mergedPayload = annotationPayloads[itemId]?.merging(payload) { _, new in new } ?? payload
        upsertMapKitAnnotation(itemId: itemId, itemType: call.getString("type") ?? "marker", payload: mergedPayload)
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
        guard let itemIds = call.getArray("itemIds", String.self) else { return }
        for itemId in itemIds {
            let syntheticCall = ["itemId": itemId, "visible": visible] as [String: Any]
            setMapKitItemVisiblePayload(syntheticCall)
        }
    }

    private func setMapKitItemVisiblePayload(_ payload: [String: Any]) {
        guard let itemId = payload["itemId"] as? String else { return }
        let visible = payload["visible"] as? Bool ?? true
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
                self.mapView?.removeOverlay(existing)
            }
            self.shapeOverlays[itemId] = overlay
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
        shapeOverlays.first { _, value in
            (value as AnyObject) === (overlay as AnyObject)
        }?.key
    }

    private func lineDashPattern(_ value: Any?) -> [NSNumber]? {
        guard let dashArray = value as? String else { return nil }
        let values = dashArray
            .split { $0 == " " || $0 == "," }
            .compactMap { Double($0) }
            .filter { $0 > 0 }
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
            self.mapViewFrame = [
                "left": Double(left),
                "top": Double(top),
                "width": Double(width),
                "height": Double(height)
            ]
        }
    }

    private func applyCamera(_ call: CAPPluginCall) {
        let center = call.getObject("center")
        guard
            let lat = doubleValue(center?["lat"]),
            let lon = doubleValue(center?["lon"])
        else { return }
        let zoom = call.getDouble("zoom") ?? lastCameraZoom ?? 10
        let coordinate = CLLocationCoordinate2D(latitude: lat, longitude: lon)
        let spanDelta = max(0.002, 360.0 / pow(2.0, max(zoom, 1)))
        let region = MKCoordinateRegion(
            center: coordinate,
            span: MKCoordinateSpan(latitudeDelta: spanDelta, longitudeDelta: spanDelta)
        )
        DispatchQueue.main.async {
            self.mapView?.setRegion(region, animated: false)
            self.lastCameraCenter = ["lat": lat, "lon": lon]
            self.lastCameraZoom = zoom
        }
    }

    private func mapKitZoomLevel(_ mapView: MKMapView) -> Double {
        let longitudeDelta = max(mapView.region.span.longitudeDelta, 0.000001)
        return max(1, log2(360.0 / longitudeDelta))
    }

    private func doubleValue(_ value: Any?) -> Double? {
        if let value = value as? Double { return value }
        if let value = value as? Int { return Double(value) }
        if let value = value as? NSNumber { return value.doubleValue }
        if let value = value as? String { return Double(value) }
        return nil
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
        return CLLocationCoordinate2D(latitude: lat, longitude: lon)
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
        return CLLocationCoordinate2D(latitude: lat, longitude: lon)
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
