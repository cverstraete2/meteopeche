package com.meteocatch.app;

import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.FrameLayout;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.Circle;
import com.google.android.gms.maps.model.CircleOptions;
import com.google.android.gms.maps.model.Dash;
import com.google.android.gms.maps.model.Gap;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.PatternItem;
import com.google.android.gms.maps.model.Polygon;
import com.google.android.gms.maps.model.PolygonOptions;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.PolylineOptions;
import com.google.android.gms.maps.model.TileOverlay;
import com.google.android.gms.maps.model.TileOverlayOptions;
import com.google.android.gms.maps.model.UrlTileProvider;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.json.JSONException;
import org.json.JSONArray;
import org.json.JSONObject;

@CapacitorPlugin(name = "MeteoPecheMap")
public class MeteoPecheMapPlugin extends Plugin implements OnMapReadyCallback {
    private static final String PROVIDER_ID = "google-native";
    private static final String UNSUPPORTED_PROVIDER_REASON = "unsupported-native-map-provider";
    private static final String MISSING_API_KEY_REASON = "google-maps-api-key-missing";
    private static final int BRIDGE_PROTOCOL_VERSION = 1;
    private static final int MAX_COMMANDS = 80;
    private static final int MAP_TILE_SIZE = 256;
    private static final String[] SUPPORTED_COMMANDS = new String[] {
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
    };
    private static final String[] SUPPORTED_EVENTS = new String[] {
        "map:google-native:click",
        "map:google-native:moveend",
        "map:google-native:zoomend"
    };
    private final JSArray commandLog = new JSArray();
    private final Map<String, Integer> commandTypeCounts = new HashMap<>();
    private final JSArray eventLog = new JSArray();
    private final Map<String, Integer> eventTypeCounts = new HashMap<>();
    private JSObject lastContainerMetrics = null;
    private JSObject rendererFrame = null;
    private JSObject lastCameraCenter = null;
    private Double lastCameraZoom = null;
    private final Map<String, JSObject> tileOverlayDefinitions = new HashMap<>();
    private final Map<String, Boolean> tileOverlayVisibility = new HashMap<>();
    private final Map<String, TileOverlay> nativeTileOverlays = new HashMap<>();
    private final Map<String, JSObject> markerDefinitions = new HashMap<>();
    private final Map<String, JSObject> shapeDefinitions = new HashMap<>();
    private final Map<String, Marker> nativeMarkers = new HashMap<>();
    private final Map<String, Circle> nativeCircles = new HashMap<>();
    private final Map<String, Polyline> nativePolylines = new HashMap<>();
    private final Map<String, Polygon> nativePolygons = new HashMap<>();
    private Marker shapeInfoWindowMarker = null;
    private final Map<String, Boolean> itemVisibility = new HashMap<>();
    private final Map<String, Set<String>> layerMembership = new HashMap<>();
    private final Map<String, Set<String>> layerChildren = new HashMap<>();
    private final Map<String, Boolean> layerVisibility = new HashMap<>();
    private final Map<String, String> itemLayers = new HashMap<>();
    private final Map<String, JSObject> pinTiers = new HashMap<>();
    private final Map<String, Boolean> pinTierVisibility = new HashMap<>();
    private MapView mapView = null;
    private GoogleMap googleMap = null;
    private boolean mapViewAttached = false;

    @Override
    public void load() {
        makeWebViewTransparent();
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        boolean ready = isGoogleNativeReady(call);
        JSObject status = new JSObject();
        status.put("ready", ready);
        status.put("providerId", call.getString("providerId", ""));
        status.put("supportedProviders", supportedProvidersJson());
        status.put("bridgeProtocolVersion", BRIDGE_PROTOCOL_VERSION);
        status.put("supportedCommands", supportedCommandsJson());
        status.put("supportedEvents", supportedEventsJson());
        status.put("reason", ready ? "" : notReadyReason(call));
        status.put("commandCount", commandLog.length());
        status.put("commandTypeCounts", commandTypeCountsJson());
        status.put("eventCount", eventLog.length());
        status.put("eventTypeCounts", eventTypeCountsJson());
        status.put("lastContainerMetrics", lastContainerMetrics == null ? JSONObject.NULL : lastContainerMetrics);
        status.put("renderer", rendererDebugState());
        call.resolve(status);
    }

    @PluginMethod
    public void isReady(PluginCall call) {
        boolean ready = isGoogleNativeReady(call);
        JSObject status = new JSObject();
        status.put("ready", ready);
        status.put("providerId", call.getString("providerId", ""));
        status.put("supportedProviders", supportedProvidersJson());
        status.put("bridgeProtocolVersion", BRIDGE_PROTOCOL_VERSION);
        status.put("supportedCommands", supportedCommandsJson());
        status.put("supportedEvents", supportedEventsJson());
        status.put("reason", ready ? "" : notReadyReason(call));
        call.resolve(status);
    }

    @PluginMethod
    public void getDebugState(PluginCall call) {
        boolean ready = isGoogleNativeReady(call);
        JSObject state = new JSObject();
        state.put("ready", ready);
        state.put("reason", ready ? "" : notReadyReason(call));
        state.put("providerId", call.getString("providerId", ""));
        state.put("supportedProviders", supportedProvidersJson());
        state.put("bridgeProtocolVersion", BRIDGE_PROTOCOL_VERSION);
        state.put("supportedCommands", supportedCommandsJson());
        state.put("supportedEvents", supportedEventsJson());
        state.put("commandCount", commandLog.length());
        state.put("commandTypeCounts", commandTypeCountsJson());
        state.put("eventCount", eventLog.length());
        state.put("eventTypeCounts", eventTypeCountsJson());
        state.put("lastContainerMetrics", lastContainerMetrics == null ? JSONObject.NULL : lastContainerMetrics);
        state.put("renderer", rendererDebugState());
        state.put("events", eventLog);
        state.put("commands", commandLog);
        call.resolve(state);
    }

    @PluginMethod
    public void init(PluginCall call) {
        recordCommand("init", call);
        if (!isGoogleNativeRequest(call)) {
            call.reject("Unsupported native map provider", "NATIVE_MAP_UNSUPPORTED_PROVIDER");
            return;
        }
        if (!hasGoogleMapsApiKey()) {
            call.reject("Google Maps Android API key is not configured", "NATIVE_MAP_API_KEY_MISSING");
            return;
        }
        applyContainerMetrics(call.getObject("containerMetrics"));
        applyCamera(call);
        ensureGoogleMapView(call);
        JSObject result = new JSObject();
        result.put("ok", true);
        result.put("providerId", PROVIDER_ID);
        result.put("rendererReady", true);
        call.resolve(result);
    }

    @PluginMethod
    public void setView(PluginCall call) {
        applyCamera(call);
        resolveCommand(call, "setView");
    }

    @PluginMethod
    public void invalidateSize(PluginCall call) {
        applyContainerMetrics(call.getObject("containerMetrics"));
        updateGoogleMapFrame();
        resolveCommand(call, "invalidateSize");
    }

    @PluginMethod
    public void createTileOverlay(PluginCall call) {
        createGoogleTileOverlay(call);
        resolveCommand(call, "createTileOverlay");
    }

    @PluginMethod
    public void setLayerVisible(PluginCall call) {
        setGoogleLayerVisible(call);
        resolveCommand(call, "setLayerVisible");
    }

    @PluginMethod
    public void clearLayer(PluginCall call) {
        clearGoogleLayer(call);
        resolveCommand(call, "clearLayer");
    }

    @PluginMethod
    public void configurePinTier(PluginCall call) {
        configureGooglePinTier(call);
        resolveCommand(call, "configurePinTier");
    }

    @PluginMethod
    public void createItem(PluginCall call) {
        createGoogleItem(call);
        resolveCommand(call, "createItem");
    }

    @PluginMethod
    public void createItems(PluginCall call) {
        createGoogleItems(call);
        resolveCommand(call, "createItems");
    }

    @PluginMethod
    public void addToLayer(PluginCall call) {
        addGoogleItemToLayer(call);
        resolveCommand(call, "addToLayer");
    }

    @PluginMethod
    public void addItemsToLayer(PluginCall call) {
        addGoogleItemsToLayer(call);
        resolveCommand(call, "addItemsToLayer");
    }

    @PluginMethod
    public void updateItem(PluginCall call) {
        updateGoogleItem(call);
        resolveCommand(call, "updateItem");
    }

    @PluginMethod
    public void setItemVisible(PluginCall call) {
        setGoogleItemVisible(call);
        resolveCommand(call, "setItemVisible");
    }

    @PluginMethod
    public void setItemsVisible(PluginCall call) {
        setGoogleItemsVisible(call);
        resolveCommand(call, "setItemsVisible");
    }

    @PluginMethod
    public void createShapeItem(PluginCall call) {
        createGoogleShapeItem(call);
        resolveCommand(call, "createShapeItem");
    }

    @PluginMethod
    public void setPinTierVisible(PluginCall call) {
        setGooglePinTierVisible(call);
        resolveCommand(call, "setPinTierVisible");
    }

    @PluginMethod
    public void removeItem(PluginCall call) {
        removeGoogleItem(call);
        resolveCommand(call, "removeItem");
    }

    @PluginMethod
    public void removeFromLayer(PluginCall call) {
        removeGoogleItemFromLayer(call);
        resolveCommand(call, "removeFromLayer");
    }

    @PluginMethod
    public void destroy(PluginCall call) {
        recordCommand("destroy", call);
        detachGoogleMapView();
        rendererFrame = null;
        lastCameraCenter = null;
        lastCameraZoom = null;
        tileOverlayDefinitions.clear();
        tileOverlayVisibility.clear();
        nativeTileOverlays.clear();
        markerDefinitions.clear();
        shapeDefinitions.clear();
        nativeMarkers.clear();
        nativeCircles.clear();
        nativePolylines.clear();
        nativePolygons.clear();
        shapeInfoWindowMarker = null;
        itemVisibility.clear();
        layerMembership.clear();
        layerChildren.clear();
        layerVisibility.clear();
        itemLayers.clear();
        pinTiers.clear();
        pinTierVisibility.clear();
        call.resolve();
    }

    @Override
    protected void handleOnResume() {
        super.handleOnResume();
        if (mapView != null) mapView.onResume();
    }

    @Override
    protected void handleOnPause() {
        if (mapView != null) mapView.onPause();
        super.handleOnPause();
    }

    @Override
    protected void handleOnDestroy() {
        detachGoogleMapView();
        super.handleOnDestroy();
    }

    @Override
    public void onMapReady(GoogleMap map) {
        googleMap = map;
        googleMap.getUiSettings().setMapToolbarEnabled(false);
        googleMap.getUiSettings().setCompassEnabled(false);
        googleMap.getUiSettings().setZoomControlsEnabled(false);
        googleMap.setOnMarkerClickListener((marker) -> {
            Object tag = marker.getTag();
            if (tag instanceof String) {
                emitGoogleItemClick((String) tag, marker.getPosition());
                if (marker.getTitle() != null && marker.getTitle().trim().length() > 0) {
                    marker.showInfoWindow();
                }
                return true;
            }
            return false;
        });
        googleMap.setOnCircleClickListener((circle) -> {
            Object tag = circle.getTag();
            if (tag instanceof String) {
                emitGoogleItemClick((String) tag, circle.getCenter());
                showGoogleShapeInfoWindow((String) tag, circle.getCenter());
            }
        });
        googleMap.setOnPolylineClickListener((polyline) -> {
            Object tag = polyline.getTag();
            if (tag instanceof String) {
                LatLng point = firstPoint(polyline.getPoints());
                emitGoogleItemClick((String) tag, point);
                showGoogleShapeInfoWindow((String) tag, point);
            }
        });
        googleMap.setOnPolygonClickListener((polygon) -> {
            Object tag = polygon.getTag();
            if (tag instanceof String) {
                LatLng point = firstPoint(polygon.getPoints());
                emitGoogleItemClick((String) tag, point);
                showGoogleShapeInfoWindow((String) tag, point);
            }
        });
        googleMap.setOnCameraIdleListener(() -> {
            JSObject payload = cameraEventPayload();
            emitGoogleEvent("moveend", payload);
            emitGoogleEvent("zoomend", payload);
        });
        moveGoogleCamera(false);
        renderAllGoogleTileOverlays();
        renderAllGoogleItems();
    }

    private void resolveCommand(PluginCall call, String command) {
        recordCommand(command, call);
        JSObject result = new JSObject();
        result.put("ok", true);
        result.put("command", command);
        result.put("rendererReady", false);
        call.resolve(result);
    }

    private void recordCommand(String command, PluginCall call) {
        JSObject containerMetrics = call.getObject("containerMetrics");
        if (containerMetrics != null) {
            lastContainerMetrics = containerMetrics;
        }
        commandTypeCounts.put(command, commandTypeCounts.getOrDefault(command, 0) + 1);

        JSObject entry = new JSObject();
        entry.put("command", command);
        entry.put("providerId", call.getString("providerId", ""));
        entry.put("hasContainerMetrics", containerMetrics != null);
        entry.put("timestamp", System.currentTimeMillis());
        commandLog.put(entry);
        while (commandLog.length() > MAX_COMMANDS) {
            commandLog.remove(0);
        }
    }

    private JSObject commandTypeCountsJson() {
        JSObject counts = new JSObject();
        for (Map.Entry<String, Integer> entry : commandTypeCounts.entrySet()) {
            counts.put(entry.getKey(), entry.getValue());
        }
        return counts;
    }

    private JSObject eventTypeCountsJson() {
        JSObject counts = new JSObject();
        for (Map.Entry<String, Integer> entry : eventTypeCounts.entrySet()) {
            counts.put(entry.getKey(), entry.getValue());
        }
        return counts;
    }

    private JSArray supportedCommandsJson() {
        JSArray commands = new JSArray();
        for (String command : SUPPORTED_COMMANDS) {
            commands.put(command);
        }
        return commands;
    }

    private JSArray supportedEventsJson() {
        JSArray events = new JSArray();
        for (String eventName : SUPPORTED_EVENTS) {
            events.put(eventName);
        }
        return events;
    }

    private JSArray supportedProvidersJson() {
        JSArray providers = new JSArray();
        providers.put(PROVIDER_ID);
        return providers;
    }

    private boolean isGoogleNativeRequest(PluginCall call) {
        return PROVIDER_ID.equals(call.getString("providerId", PROVIDER_ID));
    }

    private boolean isGoogleNativeReady(PluginCall call) {
        return isGoogleNativeRequest(call) && hasGoogleMapsApiKey();
    }

    private String notReadyReason(PluginCall call) {
        if (!isGoogleNativeRequest(call)) return UNSUPPORTED_PROVIDER_REASON;
        return hasGoogleMapsApiKey() ? "" : MISSING_API_KEY_REASON;
    }

    private boolean hasGoogleMapsApiKey() {
        try {
            ApplicationInfo appInfo = getContext().getPackageManager().getApplicationInfo(getContext().getPackageName(), PackageManager.GET_META_DATA);
            if (appInfo == null || appInfo.metaData == null) return false;
            String apiKey = appInfo.metaData.getString("com.google.android.geo.API_KEY", "");
            return apiKey != null && apiKey.trim().length() > 0;
        } catch (PackageManager.NameNotFoundException error) {
            return false;
        }
    }

    private void emitGoogleEvent(String eventName, JSObject payload) {
        String bridgeEventName = "map:google-native:" + eventName;
        eventTypeCounts.put(bridgeEventName, eventTypeCounts.getOrDefault(bridgeEventName, 0) + 1);
        JSObject entry = new JSObject();
        entry.put("eventName", bridgeEventName);
        entry.put("payload", payload == null ? JSONObject.NULL : payload);
        entry.put("timestamp", System.currentTimeMillis());
        eventLog.put(entry);
        while (eventLog.length() > MAX_COMMANDS) {
            eventLog.remove(0);
        }
        notifyListeners(bridgeEventName, payload == null ? new JSObject() : payload);
    }

    private JSObject rendererDebugState() {
        JSObject renderer = new JSObject();
        renderer.put("kind", "google-native");
        renderer.put("providerId", PROVIDER_ID);
        renderer.put("implemented", true);
        renderer.put("ready", mapView != null);
        renderer.put("mapReady", googleMap != null);
        renderer.put("mapViewCreated", mapView != null);
        renderer.put("mapViewAttached", mapViewAttached);
        renderer.put("frame", rendererFrame == null ? JSONObject.NULL : rendererFrame);
        renderer.put("lastCameraCenter", lastCameraCenter == null ? JSONObject.NULL : lastCameraCenter);
        renderer.put("lastCameraZoom", lastCameraZoom == null ? JSONObject.NULL : lastCameraZoom);
        renderer.put("tileOverlayCount", tileOverlayDefinitions.size());
        renderer.put("tileOverlayIds", tileOverlayIdsJson());
        renderer.put("tileOverlayTypes", tileOverlayTypesJson());
        renderer.put("tileOverlayVisibility", tileOverlayVisibilityJson());
        renderer.put("nativeTileOverlayCount", nativeTileOverlays.size());
        renderer.put("markerCount", markerDefinitions.size());
        renderer.put("markerIds", itemIdsJson(markerDefinitions));
        renderer.put("nativeMarkerCount", nativeMarkers.size());
        renderer.put("markerCalloutCount", markerCalloutCount());
        renderer.put("markerClassNames", markerClassNamesJson());
        renderer.put("markerAnchorCount", markerPayloadCount("iconAnchor"));
        renderer.put("markerTooltipAnchorCount", markerPayloadCount("tooltipAnchor"));
        renderer.put("markerPopupAnchorCount", markerPayloadCount("popupAnchor"));
        renderer.put("markerOpacityCount", markerPayloadCount("opacity"));
        renderer.put("markerZIndexCount", markerPayloadCount("zIndexOffset"));
        renderer.put("nativeCircleCount", nativeCircles.size());
        renderer.put("nativePolylineCount", nativePolylines.size());
        renderer.put("nativePolygonCount", nativePolygons.size());
        renderer.put("shapeCount", shapeDefinitions.size());
        renderer.put("shapeIds", itemIdsJson(shapeDefinitions));
        renderer.put("shapePopupCount", payloadCount(shapeDefinitions, "popup"));
        renderer.put("shapeTooltipCount", payloadCount(shapeDefinitions, "tooltip"));
        renderer.put("itemVisibility", itemVisibilityJson());
        renderer.put("itemTypeCounts", itemTypeCountsJson());
        renderer.put("layerCount", layerMembership.size());
        renderer.put("layerMembership", layerMembershipJson());
        renderer.put("layerChildren", layerChildrenJson());
        renderer.put("layerVisibility", layerVisibilityJson());
        renderer.put("pinTierCount", pinTiers.size());
        renderer.put("pinTierIds", pinTierIdsJson());
        renderer.put("pinTierVisibility", pinTierVisibilityJson());
        renderer.put("dependency", "com.google.android.gms:play-services-maps");
        return renderer;
    }

    private int payloadCount(Map<String, JSObject> definitions, String key) {
        int count = 0;
        for (JSObject definition : definitions.values()) {
            JSObject payload = definition.getJSObject("payload");
            if (payload == null) continue;
            Object value = payload.opt(key);
            if (value instanceof String && ((String) value).trim().length() > 0) {
                count += 1;
            } else if (value instanceof JSObject) {
                String content = ((JSObject) value).optString("content", "");
                if (content.trim().length() > 0) count += 1;
            }
        }
        return count;
    }

    private int markerCalloutCount() {
        int count = 0;
        for (JSObject definition : markerDefinitions.values()) {
            JSObject payload = definition.getJSObject("payload");
            if (payload == null) continue;
            if (markerTitle(payload).length() > 0 || markerSnippet(payload).length() > 0) {
                count += 1;
            }
        }
        return count;
    }

    private JSObject itemTypeCountsJson() {
        JSObject counts = new JSObject();
        addItemTypeCounts(counts, markerDefinitions);
        addItemTypeCounts(counts, shapeDefinitions);
        return counts;
    }

    private void addItemTypeCounts(JSObject counts, Map<String, JSObject> definitions) {
        for (JSObject definition : definitions.values()) {
            String type = definition.optString("type", "");
            if (type.length() == 0) continue;
            counts.put(type, counts.optInt(type, 0) + 1);
        }
    }

    private JSArray markerClassNamesJson() {
        Set<String> classNames = new HashSet<>();
        for (JSObject definition : markerDefinitions.values()) {
            JSObject payload = definition.getJSObject("payload");
            if (payload == null) continue;
            JSObject icon = payload.getJSObject("icon");
            if (icon == null) continue;
            String className = icon.optString("className", "").trim();
            if (className.length() > 0) classNames.add(className);
        }
        ArrayList<String> sortedClassNames = new ArrayList<>(classNames);
        Collections.sort(sortedClassNames);
        JSArray result = new JSArray();
        for (String className : sortedClassNames) {
            result.put(className);
        }
        return result;
    }

    private int markerPayloadCount(String key) {
        int count = 0;
        for (JSObject definition : markerDefinitions.values()) {
            JSObject payload = definition.getJSObject("payload");
            if (payload == null) continue;
            if (key.equals("iconAnchor") || key.equals("tooltipAnchor") || key.equals("popupAnchor")) {
                JSObject icon = payload.getJSObject("icon");
                if (icon != null && numericPair(icon.opt(key)) != null && numericPair(icon.opt("iconSize")) != null) {
                    count += 1;
                }
            } else if (payload.opt(key) != null) {
                count += 1;
            }
        }
        return count;
    }

    private void ensureGoogleMapView(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            makeWebViewTransparent();
            if (mapView == null) {
                mapView = new MapView(getActivity());
                mapView.setClickable(false);
                mapView.onCreate(new Bundle());
                mapView.onResume();
                mapView.getMapAsync(this);
            }
            applyContainerMetrics(call.getObject("containerMetrics"));
            attachGoogleMapView();
            moveGoogleCamera(false);
        });
    }

    private void attachGoogleMapView() {
        if (mapView == null || getBridge() == null || getBridge().getWebView() == null) return;
        ViewGroup webParent = (ViewGroup) getBridge().getWebView().getParent();
        if (webParent == null) return;
        if (mapView.getParent() == null) {
            webParent.addView(mapView, 0, layoutParamsForFrame());
        } else {
            mapView.setLayoutParams(layoutParamsForFrame());
        }
        mapView.setVisibility(android.view.View.VISIBLE);
        mapViewAttached = true;
    }

    private FrameLayout.LayoutParams layoutParamsForFrame() {
        int width = Math.max(1, nativePixelValue(rendererFrame, "width", getBridge().getWebView().getWidth()));
        int height = Math.max(1, nativePixelValue(rendererFrame, "height", getBridge().getWebView().getHeight()));
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(width, height);
        params.leftMargin = nativePixelValue(rendererFrame, "left", 0);
        params.topMargin = nativePixelValue(rendererFrame, "top", 0);
        return params;
    }

    private int nativePixelValue(JSObject frame, String key, int fallback) {
        if (frame == null) return fallback;
        double pixelRatio = 1.0;
        if (lastContainerMetrics != null) {
            pixelRatio = doubleValue(lastContainerMetrics, "devicePixelRatio", 1.0);
        }
        return Math.round((float) (doubleValue(frame, key, fallback) * pixelRatio));
    }

    private void detachGoogleMapView() {
        if (getActivity() == null) return;
        getActivity().runOnUiThread(() -> {
            if (mapView == null) return;
            if (mapView.getParent() instanceof ViewGroup) {
                ((ViewGroup) mapView.getParent()).removeView(mapView);
            }
            mapView.onPause();
            mapView.onDestroy();
            mapView = null;
            googleMap = null;
            mapViewAttached = false;
        });
    }

    private void makeWebViewTransparent() {
        if (getBridge() == null || getBridge().getWebView() == null) return;
        WebView webView = getBridge().getWebView();
        webView.setBackgroundColor(Color.TRANSPARENT);
        if (webView.getParent() instanceof ViewGroup) {
            ((ViewGroup) webView.getParent()).setBackgroundColor(Color.TRANSPARENT);
        }
    }

    private void applyContainerMetrics(JSObject metrics) {
        if (metrics == null) return;
        rendererFrame = new JSObject();
        rendererFrame.put("left", doubleValue(metrics, "left", 0.0));
        rendererFrame.put("top", doubleValue(metrics, "top", 0.0));
        rendererFrame.put("width", doubleValue(metrics, "width", 0.0));
        rendererFrame.put("height", doubleValue(metrics, "height", 0.0));
    }

    private void applyCamera(PluginCall call) {
        JSObject center = call.getObject("center");
        if (center == null) return;
        Double lat = optionalDouble(center, "lat");
        Double lon = optionalDouble(center, "lon");
        if (lat == null || lon == null) return;
        lastCameraCenter = new JSObject();
        lastCameraCenter.put("lat", lat);
        lastCameraCenter.put("lon", lon);
        lastCameraZoom = call.getDouble("zoom", lastCameraZoom == null ? 10.0 : lastCameraZoom);
        moveGoogleCamera(true);
    }

    private void moveGoogleCamera(boolean animated) {
        if (getActivity() == null) return;
        getActivity().runOnUiThread(() -> {
            if (googleMap == null || lastCameraCenter == null || lastCameraZoom == null) return;
            double lat = doubleValue(lastCameraCenter, "lat", 0.0);
            double lon = doubleValue(lastCameraCenter, "lon", 0.0);
            LatLng target = new LatLng(lat, lon);
            if (animated) {
                googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(target, lastCameraZoom.floatValue()));
            } else {
                googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(target, lastCameraZoom.floatValue()));
            }
        });
    }

    private void updateGoogleMapFrame() {
        if (getActivity() == null) return;
        getActivity().runOnUiThread(() -> {
            if (mapView == null) return;
            mapView.setLayoutParams(layoutParamsForFrame());
        });
    }

    private JSObject cameraEventPayload() {
        JSObject payload = new JSObject();
        if (googleMap != null) {
            LatLng target = googleMap.getCameraPosition().target;
            JSObject center = new JSObject();
            center.put("lat", target.latitude);
            center.put("lon", target.longitude);
            payload.put("center", center);
            payload.put("zoomLevel", googleMap.getCameraPosition().zoom);
            payload.put("zoom", googleMap.getCameraPosition().zoom);
        } else if (lastCameraCenter != null) {
            payload.put("center", lastCameraCenter);
            if (lastCameraZoom != null) {
                payload.put("zoomLevel", lastCameraZoom);
                payload.put("zoom", lastCameraZoom);
            }
        }
        return payload;
    }

    private void createGoogleTileOverlay(PluginCall call) {
        JSObject overlayPayload = call.getObject("overlay");
        String overlayId = firstString(
            call.getString("overlayId"),
            call.getString("layerId"),
            call.getString("id"),
            overlayPayload == null ? null : overlayPayload.optString("id", "")
        );
        if (overlayId == null || overlayId.length() == 0) return;
        JSObject overlay = new JSObject();
        overlay.put("overlayId", overlayId);
        overlay.put("type", firstString(call.getString("type"), overlayPayload == null ? null : overlayPayload.optString("type", "")));
        overlay.put("url", firstString(call.getString("url"), overlayPayload == null ? null : overlayPayload.optString("url", "")));
        overlay.put("minZoom", firstInteger(call.getInt("minZoom"), overlayPayload == null ? null : optionalInteger(overlayPayload, "minZoom")));
        overlay.put("maxZoom", firstInteger(call.getInt("maxZoom"), overlayPayload == null ? null : optionalInteger(overlayPayload, "maxZoom")));
        overlay.put("opacity", firstDouble(call.getDouble("opacity"), overlayPayload == null ? null : optionalDouble(overlayPayload, "opacity")));
        overlay.put("layers", overlayPayload == null ? "" : overlayPayload.optString("layers", ""));
        overlay.put("styles", overlayPayload == null ? "" : overlayPayload.optString("styles", ""));
        overlay.put("format", overlayPayload == null ? "image/png" : overlayPayload.optString("format", "image/png"));
        overlay.put("transparent", overlayPayload == null || overlayPayload.optBoolean("transparent", true));
        overlay.put("version", overlayPayload == null ? "1.3.0" : overlayPayload.optString("version", "1.3.0"));
        overlay.put("renderer", "google-tile-overlay-native");
        tileOverlayDefinitions.put(overlayId, overlay);
        tileOverlayVisibility.put(overlayId, true);
        renderGoogleTileOverlay(overlayId);
    }

    private void setGoogleLayerVisible(PluginCall call) {
        String layerId = firstString(call.getString("layerId"), call.getString("overlayId"), call.getString("id"));
        if (layerId == null || layerId.length() == 0) return;
        boolean visible = call.getBoolean("visible", true);
        setGoogleLayerVisibleById(layerId, visible, new HashSet<>());
    }

    private void setGoogleLayerVisibleById(String layerId, boolean visible, Set<String> visitedLayerIds) {
        if (layerId == null || layerId.length() == 0 || visitedLayerIds.contains(layerId)) return;
        visitedLayerIds.add(layerId);
        layerVisibility.put(layerId, visible);
        Set<String> childLayerIds = layerChildren.get(layerId);
        if (childLayerIds != null) {
            for (String childLayerId : new HashSet<>(childLayerIds)) {
                setGoogleLayerVisibleById(childLayerId, visible, visitedLayerIds);
            }
        }
        Set<String> itemIds = layerMembership.get(layerId);
        if (itemIds != null) {
            for (String itemId : new HashSet<>(itemIds)) {
                if (childLayerIds != null && childLayerIds.contains(itemId)) continue;
                itemVisibility.put(itemId, visible);
                applyGoogleItemVisibility(itemId);
            }
        }
        if (!tileOverlayDefinitions.containsKey(layerId)) return;
        tileOverlayVisibility.put(layerId, visible);
        if (getActivity() != null) {
            getActivity().runOnUiThread(() -> {
                TileOverlay overlay = nativeTileOverlays.get(layerId);
                if (overlay != null) overlay.setVisible(visible);
            });
        }
    }

    private void clearGoogleLayer(PluginCall call) {
        String layerId = firstString(call.getString("layerId"), call.getString("overlayId"), call.getString("id"));
        if (layerId == null || layerId.length() == 0) return;
        tileOverlayDefinitions.remove(layerId);
        tileOverlayVisibility.remove(layerId);
        layerVisibility.remove(layerId);
        layerChildren.remove(layerId);
        removeNativeGoogleTileOverlay(layerId);
        Set<String> itemIds = layerMembership.remove(layerId);
        if (itemIds != null) {
            for (String itemId : itemIds) {
                removeNativeGoogleItem(itemId);
                markerDefinitions.remove(itemId);
                shapeDefinitions.remove(itemId);
                itemLayers.remove(itemId);
                itemVisibility.remove(itemId);
            }
        }
    }

    private void configureGooglePinTier(PluginCall call) {
        JSObject tier = call.getObject("tier");
        if (tier == null) return;
        String tierId = firstString(tier.optString("id", ""), call.getString("tierId"), call.getString("id"));
        if (tierId == null || tierId.length() == 0) return;
        pinTiers.put(tierId, tier);
    }

    private void setGooglePinTierVisible(PluginCall call) {
        String tierId = firstString(call.getString("tierId"), call.getString("id"));
        if (tierId == null || tierId.length() == 0) return;
        pinTierVisibility.put(tierId, call.getBoolean("visible", true));
    }

    private void addGoogleItemToLayer(PluginCall call) {
        addLayerMembership(call.getString("layerId", ""), call.getString("itemId", ""), call.getBoolean("isLayer", false));
    }

    private void addGoogleItemsToLayer(PluginCall call) {
        String layerId = call.getString("layerId", "");
        JSArray items = call.getArray("items");
        if (layerId.length() == 0 || items == null) return;
        for (int i = 0; i < items.length(); i++) {
            JSONObject item = items.optJSONObject(i);
            if (item == null) continue;
            addLayerMembership(layerId, item.optString("itemId", ""), item.optBoolean("isLayer", false));
        }
    }

    private void removeGoogleItemFromLayer(PluginCall call) {
        removeLayerMembership(call.getString("layerId", ""), call.getString("itemId", ""));
    }

    private void createGoogleItem(PluginCall call) {
        String itemId = call.getString("itemId", "");
        JSObject payload = call.getObject("payload");
        if (itemId.length() == 0 || payload == null) return;
        markerDefinitions.put(itemId, itemDefinition(itemId, call.getString("type", "marker"), payload));
        itemVisibility.putIfAbsent(itemId, true);
        renderGoogleItem(itemId);
    }

    private void createGoogleItems(PluginCall call) {
        JSArray items = call.getArray("items");
        if (items == null) return;
        for (int i = 0; i < items.length(); i++) {
            JSONObject rawItem = items.optJSONObject(i);
            if (rawItem == null) continue;
            String itemId = rawItem.optString("itemId", "");
            JSONObject rawPayload = rawItem.optJSONObject("payload");
            if (itemId.length() == 0 || rawPayload == null) continue;
            JSObject payload = jsObject(rawPayload);
            if (payload == null) continue;
            markerDefinitions.put(itemId, itemDefinition(itemId, rawItem.optString("type", "marker"), payload));
            itemVisibility.putIfAbsent(itemId, true);
            renderGoogleItem(itemId);
        }
    }

    private void updateGoogleItem(PluginCall call) {
        String itemId = call.getString("itemId", "");
        JSObject payload = call.getObject("payload");
        if (itemId.length() == 0 || payload == null) return;
        JSObject existing = markerDefinitions.containsKey(itemId) ? markerDefinitions.get(itemId) : shapeDefinitions.get(itemId);
        if (existing == null) return;
        JSObject mergedPayload = new JSObject();
        JSObject existingPayload = existing.getJSObject("payload");
        if (existingPayload != null) {
            copyInto(existingPayload, mergedPayload);
        }
        copyInto(payload, mergedPayload);
        existing.put("payload", mergedPayload);
        existing.put("renderer", existing.optString("renderer", "google-item-native"));
        renderGoogleItem(itemId);
    }

    private void setGoogleItemVisible(PluginCall call) {
        String itemId = call.getString("itemId", "");
        if (itemId.length() == 0) return;
        itemVisibility.put(itemId, call.getBoolean("visible", true));
        applyGoogleItemVisibility(itemId);
    }

    private void setGoogleItemsVisible(PluginCall call) {
        Boolean visible = call.getBoolean("visible", true);
        JSArray itemIds = call.getArray("itemIds");
        if (itemIds == null) return;
        for (int i = 0; i < itemIds.length(); i++) {
            String itemId = itemIds.optString(i, "");
            if (itemId.length() > 0) {
                itemVisibility.put(itemId, visible);
                applyGoogleItemVisibility(itemId);
            }
        }
    }

    private void createGoogleShapeItem(PluginCall call) {
        String itemId = call.getString("itemId", "");
        JSObject payload = call.getObject("payload");
        if (itemId.length() == 0 || payload == null) return;
        shapeDefinitions.put(itemId, itemDefinition(itemId, call.getString("type", "shape"), payload));
        itemVisibility.putIfAbsent(itemId, true);
        renderGoogleItem(itemId);
    }

    private void removeGoogleItem(PluginCall call) {
        String itemId = call.getString("itemId", "");
        if (itemId.length() == 0) return;
        removeNativeGoogleItem(itemId);
        markerDefinitions.remove(itemId);
        shapeDefinitions.remove(itemId);
        itemVisibility.remove(itemId);
        removeItemFromMemberships(itemId);
    }

    private void addLayerMembership(String layerId, String itemId, boolean isLayer) {
        if (layerId == null || layerId.length() == 0 || itemId == null || itemId.length() == 0) return;
        if (!layerMembership.containsKey(layerId)) {
            layerMembership.put(layerId, new HashSet<>());
        }
        layerMembership.get(layerId).add(itemId);
        itemLayers.put(itemId, layerId);
        if (isLayer) {
            if (!layerChildren.containsKey(layerId)) {
                layerChildren.put(layerId, new HashSet<>());
            }
            layerChildren.get(layerId).add(itemId);
        }
    }

    private void removeLayerMembership(String layerId, String itemId) {
        if (layerId == null || layerId.length() == 0 || itemId == null || itemId.length() == 0) return;
        Set<String> itemIds = layerMembership.get(layerId);
        if (itemIds != null) {
            itemIds.remove(itemId);
            if (itemIds.isEmpty()) {
                layerMembership.remove(layerId);
            }
        }
        if (layerId.equals(itemLayers.get(itemId))) {
            itemLayers.remove(itemId);
        }
        Set<String> childLayerIds = layerChildren.get(layerId);
        if (childLayerIds != null) {
            childLayerIds.remove(itemId);
            if (childLayerIds.isEmpty()) {
                layerChildren.remove(layerId);
            }
        }
    }

    private void removeItemFromMemberships(String itemId) {
        String layerId = itemLayers.remove(itemId);
        if (layerId != null) {
            removeLayerMembership(layerId, itemId);
        }
        for (String currentLayerId : new HashSet<>(layerMembership.keySet())) {
            removeLayerMembership(currentLayerId, itemId);
        }
    }

    private JSObject itemDefinition(String itemId, String type, JSObject payload) {
        JSObject item = new JSObject();
        item.put("itemId", itemId);
        item.put("type", type);
        item.put("payload", payload);
        item.put("lat", optionalDouble(payload, "lat"));
        item.put("lon", optionalDouble(payload, "lon"));
        item.put("renderer", type.startsWith("circle") || type.equals("polyline") || type.equals("polygon") ? "google-shape-native" : "google-marker-native");
        return item;
    }

    private void renderAllGoogleItems() {
        for (String itemId : markerDefinitions.keySet()) {
            renderGoogleItem(itemId);
        }
        for (String itemId : shapeDefinitions.keySet()) {
            renderGoogleItem(itemId);
        }
    }

    private void renderGoogleItem(String itemId) {
        if (getActivity() == null) return;
        getActivity().runOnUiThread(() -> {
            if (googleMap == null || itemId == null || itemId.length() == 0) return;
            JSObject item = markerDefinitions.containsKey(itemId) ? markerDefinitions.get(itemId) : shapeDefinitions.get(itemId);
            if (item == null) return;
            JSObject payload = item.getJSObject("payload");
            if (payload == null) return;
            removeNativeGoogleItem(itemId);

            String type = item.optString("type", "marker");
            if (type.equals("polyline")) {
                renderGooglePolyline(itemId, payload);
            } else if (type.equals("polygon")) {
                renderGooglePolygon(itemId, payload);
            } else if (type.startsWith("circle")) {
                renderGoogleCircle(itemId, payload, type);
            } else {
                renderGoogleMarker(itemId, payload);
            }
            applyGoogleItemVisibility(itemId);
        });
    }

    private void renderGoogleMarker(String itemId, JSObject payload) {
        LatLng point = latLngFromPayload(payload);
        if (point == null) return;
        String title = markerTitle(payload);
        String snippet = markerSnippet(payload);
        MarkerOptions options = new MarkerOptions()
            .position(point)
            .title(title);
        if (snippet.length() > 0 && !snippet.equals(title)) {
            options.snippet(snippet);
        }
        applyMarkerOptionsStyle(options, payload);
        Marker marker = googleMap.addMarker(options);
        if (marker == null) return;
        marker.setTag(itemId);
        Double opacity = optionalDouble(payload, "opacity");
        if (opacity != null) marker.setAlpha(Math.max(0f, Math.min(1f, opacity.floatValue())));
        Integer zIndex = optionalInteger(payload, "zIndexOffset");
        if (zIndex != null) marker.setZIndex(zIndex.floatValue());
        nativeMarkers.put(itemId, marker);
    }

    private void applyMarkerOptionsStyle(MarkerOptions options, JSObject payload) {
        JSObject icon = payload.getJSObject("icon");
        if (icon == null) return;
        double[] size = numericPair(icon.opt("iconSize"));
        double[] anchor = numericPair(icon.opt("iconAnchor"));
        if (size == null || anchor == null || size[0] <= 0.0 || size[1] <= 0.0) return;
        options.anchor(clampedFloat(anchor[0] / size[0]), clampedFloat(anchor[1] / size[1]));
    }

    private String markerTitle(JSObject payload) {
        String title = payload.optString("title", "").trim();
        if (title.length() > 0) return title;
        return markerSnippet(payload);
    }

    private String markerSnippet(JSObject payload) {
        JSObject tooltip = payload.getJSObject("tooltip");
        if (tooltip == null) return "";
        return plainText(tooltip.optString("content", ""));
    }

    private void showGoogleShapeInfoWindow(String itemId, LatLng point) {
        if (googleMap == null || itemId == null || point == null) return;
        JSObject definition = shapeDefinitions.get(itemId);
        if (definition == null) return;
        JSObject payload = definition.getJSObject("payload");
        if (payload == null) return;
        String title = shapeCalloutTitle(payload);
        String snippet = shapeCalloutSnippet(payload, title);
        if (title.length() == 0 && snippet.length() == 0) return;
        if (shapeInfoWindowMarker == null) {
            shapeInfoWindowMarker = googleMap.addMarker(new MarkerOptions()
                .position(point)
                .alpha(0f)
                .visible(true));
        }
        if (shapeInfoWindowMarker == null) return;
        shapeInfoWindowMarker.setPosition(point);
        shapeInfoWindowMarker.setTitle(title.length() > 0 ? title : snippet);
        shapeInfoWindowMarker.setSnippet(snippet.length() > 0 && !snippet.equals(title) ? snippet : null);
        shapeInfoWindowMarker.showInfoWindow();
    }

    private String shapeCalloutTitle(JSObject payload) {
        String popup = plainText(payload.optString("popup", ""));
        if (popup.length() > 0) return popup;
        JSObject tooltip = payload.getJSObject("tooltip");
        if (tooltip == null) return "";
        return plainText(tooltip.optString("content", ""));
    }

    private String shapeCalloutSnippet(JSObject payload, String title) {
        JSObject tooltip = payload.getJSObject("tooltip");
        if (tooltip == null) return "";
        String tooltipText = plainText(tooltip.optString("content", ""));
        return tooltipText.equals(title) ? "" : tooltipText;
    }

    private String plainText(String value) {
        return value == null ? "" : value.replaceAll("<[^>]+>", " ").replaceAll("\\s+", " ").trim();
    }

    private void renderGoogleCircle(String itemId, JSObject payload, String type) {
        LatLng point = latLngFromPayload(payload);
        if (point == null) return;
        double radius = doubleValue(payload, "radius", type.equals("circle-marker") ? 12.0 : 100.0);
        int baseStrokeColor = colorValue(payload, "color", Color.rgb(47, 127, 163));
        int strokeColor = colorWithOpacity(baseStrokeColor, doubleValue(payload, "opacity", 1.0));
        int fillColor = colorWithOpacity(colorValue(payload, "fillColor", baseStrokeColor), doubleValue(payload, "fillOpacity", 0.18));
        Circle circle = googleMap.addCircle(new CircleOptions()
            .center(point)
            .radius(radius)
            .strokeColor(strokeColor)
            .fillColor(fillColor)
            .strokeWidth((float) doubleValue(payload, "weight", 2.0))
            .clickable(true));
        circle.setTag(itemId);
        nativeCircles.put(itemId, circle);
    }

    private void renderGooglePolyline(String itemId, JSObject payload) {
        List<LatLng> points = latLngListFromPayload(payload);
        if (points.size() < 2) return;
        PolylineOptions options = new PolylineOptions()
            .addAll(points)
            .color(colorWithOpacity(colorValue(payload, "color", Color.rgb(47, 127, 163)), doubleValue(payload, "opacity", 1.0)))
            .width((float) doubleValue(payload, "weight", 2.0))
            .clickable(true);
        List<PatternItem> pattern = dashPattern(payload.optString("dashArray", ""));
        if (pattern != null) options.pattern(pattern);
        Polyline polyline = googleMap.addPolyline(options);
        polyline.setTag(itemId);
        nativePolylines.put(itemId, polyline);
    }

    private void renderGooglePolygon(String itemId, JSObject payload) {
        List<LatLng> points = latLngListFromPayload(payload);
        if (points.size() < 3) return;
        int baseStrokeColor = colorValue(payload, "color", Color.rgb(47, 127, 163));
        int strokeColor = colorWithOpacity(baseStrokeColor, doubleValue(payload, "opacity", 1.0));
        int fillColor = colorWithOpacity(colorValue(payload, "fillColor", baseStrokeColor), doubleValue(payload, "fillOpacity", 0.18));
        PolygonOptions options = new PolygonOptions()
            .addAll(points)
            .strokeColor(strokeColor)
            .fillColor(fillColor)
            .strokeWidth((float) doubleValue(payload, "weight", 2.0))
            .clickable(true);
        List<PatternItem> pattern = dashPattern(payload.optString("dashArray", ""));
        if (pattern != null) options.strokePattern(pattern);
        Polygon polygon = googleMap.addPolygon(options);
        polygon.setTag(itemId);
        nativePolygons.put(itemId, polygon);
    }

    private void applyGoogleItemVisibility(String itemId) {
        boolean visible = itemVisibility.getOrDefault(itemId, true);
        Marker marker = nativeMarkers.get(itemId);
        if (marker != null) marker.setVisible(visible);
        Circle circle = nativeCircles.get(itemId);
        if (circle != null) circle.setVisible(visible);
        Polyline polyline = nativePolylines.get(itemId);
        if (polyline != null) polyline.setVisible(visible);
        Polygon polygon = nativePolygons.get(itemId);
        if (polygon != null) polygon.setVisible(visible);
    }

    private void removeNativeGoogleItem(String itemId) {
        Marker marker = nativeMarkers.remove(itemId);
        if (marker != null) marker.remove();
        Circle circle = nativeCircles.remove(itemId);
        if (circle != null) circle.remove();
        Polyline polyline = nativePolylines.remove(itemId);
        if (polyline != null) polyline.remove();
        Polygon polygon = nativePolygons.remove(itemId);
        if (polygon != null) polygon.remove();
    }

    private void renderAllGoogleTileOverlays() {
        for (String overlayId : tileOverlayDefinitions.keySet()) {
            renderGoogleTileOverlay(overlayId);
        }
    }

    private void renderGoogleTileOverlay(String overlayId) {
        if (getActivity() == null) return;
        getActivity().runOnUiThread(() -> {
            if (googleMap == null || overlayId == null || overlayId.length() == 0) return;
            JSObject definition = tileOverlayDefinitions.get(overlayId);
            if (definition == null) return;
            removeNativeGoogleTileOverlayNow(overlayId);
            TileOverlay tileOverlay = googleMap.addTileOverlay(new TileOverlayOptions()
                .tileProvider(new MeteoPecheUrlTileProvider(definition))
                .visible(tileOverlayVisibility.getOrDefault(overlayId, true))
                .transparency(tileOverlayTransparency(definition))
                .zIndex(1f));
            if (tileOverlay != null) nativeTileOverlays.put(overlayId, tileOverlay);
        });
    }

    private void removeNativeGoogleTileOverlay(String overlayId) {
        if (getActivity() == null) return;
        getActivity().runOnUiThread(() -> removeNativeGoogleTileOverlayNow(overlayId));
    }

    private void removeNativeGoogleTileOverlayNow(String overlayId) {
        TileOverlay tileOverlay = nativeTileOverlays.remove(overlayId);
        if (tileOverlay != null) tileOverlay.remove();
    }

    private float tileOverlayTransparency(JSObject definition) {
        double opacity = doubleValue(definition, "opacity", 1.0);
        return (float) Math.max(0.0, Math.min(1.0, 1.0 - opacity));
    }

    private class MeteoPecheUrlTileProvider extends UrlTileProvider {
        private final JSObject definition;

        MeteoPecheUrlTileProvider(JSObject definition) {
            super(MAP_TILE_SIZE, MAP_TILE_SIZE);
            this.definition = definition;
        }

        @Override
        public URL getTileUrl(int x, int y, int zoom) {
            String url = googleTileUrl(definition, x, y, zoom);
            if (url.length() == 0) return null;
            try {
                return new URL(url);
            } catch (MalformedURLException ignored) {
                return null;
            }
        }
    }

    private String googleTileUrl(JSObject overlay, int x, int y, int zoom) {
        String type = overlay.optString("type", "");
        if ("xyz".equals(type)) return xyzTileUrl(overlay.optString("url", ""), x, y, zoom);
        if ("wms".equals(type)) return wmsTileUrl(overlay, x, y, zoom);
        return "";
    }

    private String xyzTileUrl(String template, int x, int y, int zoom) {
        int worldTileCount = 1 << zoom;
        return template
            .replace("{z}", String.valueOf(zoom))
            .replace("{x}", String.valueOf(wrapTileX(x, worldTileCount)))
            .replace("{y}", String.valueOf(y));
    }

    private String wmsTileUrl(JSObject overlay, int x, int y, int zoom) {
        double[] bbox = tileBbox4326(x, y, zoom);
        return Uri.parse(overlay.optString("url", ""))
            .buildUpon()
            .appendQueryParameter("service", "WMS")
            .appendQueryParameter("request", "GetMap")
            .appendQueryParameter("version", overlay.optString("version", "1.3.0"))
            .appendQueryParameter("layers", overlay.optString("layers", ""))
            .appendQueryParameter("styles", overlay.optString("styles", ""))
            .appendQueryParameter("format", overlay.optString("format", "image/png"))
            .appendQueryParameter("transparent", String.valueOf(overlay.optBoolean("transparent", true)))
            .appendQueryParameter("width", String.valueOf(MAP_TILE_SIZE))
            .appendQueryParameter("height", String.valueOf(MAP_TILE_SIZE))
            .appendQueryParameter("crs", "EPSG:4326")
            .appendQueryParameter("bbox", String.format(java.util.Locale.US, "%.6f,%.6f,%.6f,%.6f", bbox[0], bbox[1], bbox[2], bbox[3]))
            .build()
            .toString();
    }

    private double[] tileBbox4326(int x, int y, int zoom) {
        int worldTileCount = 1 << zoom;
        int wrappedX = wrapTileX(x, worldTileCount);
        LatLng westNorth = unprojectLatLon(wrappedX * MAP_TILE_SIZE, y * MAP_TILE_SIZE, zoom);
        LatLng eastSouth = unprojectLatLon((wrappedX + 1) * MAP_TILE_SIZE, (y + 1) * MAP_TILE_SIZE, zoom);
        return new double[] { eastSouth.latitude, westNorth.longitude, westNorth.latitude, eastSouth.longitude };
    }

    private LatLng unprojectLatLon(double pixelX, double pixelY, int zoom) {
        double scale = MAP_TILE_SIZE * Math.pow(2.0, zoom);
        double lon = (pixelX / scale) * 360.0 - 180.0;
        double n = Math.PI - (2.0 * Math.PI * pixelY) / scale;
        double lat = Math.toDegrees(Math.atan(Math.sinh(n)));
        return new LatLng(lat, lon);
    }

    private int wrapTileX(int x, int worldTileCount) {
        return ((x % worldTileCount) + worldTileCount) % worldTileCount;
    }

    private LatLng latLngFromPayload(JSObject payload) {
        Double lat = optionalDouble(payload, "lat");
        Double lon = optionalDouble(payload, "lon");
        if (lon == null) lon = optionalDouble(payload, "lng");
        return lat == null || lon == null ? null : new LatLng(lat, lon);
    }

    private List<LatLng> latLngListFromPayload(JSObject payload) {
        List<LatLng> points = new ArrayList<>();
        JSONArray coordinates = payload.optJSONArray("coordinates");
        if (coordinates == null) return points;

        for (int i = 0; i < coordinates.length(); i++) {
            Object raw = coordinates.opt(i);
            LatLng point = latLngFromCoordinate(raw);
            if (point != null) points.add(point);
        }
        if (!points.isEmpty()) return points;

        for (int i = 0; i < coordinates.length(); i++) {
            Object raw = coordinates.opt(i);
            if (!(raw instanceof JSONArray)) continue;
            List<LatLng> nestedPoints = latLngListFromArray((JSONArray) raw);
            if (!nestedPoints.isEmpty()) return nestedPoints;
        }

        return points;
    }

    private List<LatLng> latLngListFromArray(JSONArray coordinates) {
        List<LatLng> points = new ArrayList<>();
        for (int i = 0; i < coordinates.length(); i++) {
            LatLng point = latLngFromCoordinate(coordinates.opt(i));
            if (point != null) points.add(point);
        }
        return points;
    }

    private LatLng latLngFromCoordinate(Object raw) {
        if (raw instanceof JSONObject) {
            JSONObject object = (JSONObject) raw;
            double lat = object.optDouble("lat", Double.NaN);
            double lon = object.has("lon") ? object.optDouble("lon", Double.NaN) : object.optDouble("lng", Double.NaN);
            return Double.isNaN(lat) || Double.isNaN(lon) ? null : new LatLng(lat, lon);
        }
        if (raw instanceof JSONArray) {
            JSONArray array = (JSONArray) raw;
            if (array.length() < 2) return null;
            return new LatLng(array.optDouble(0, Double.NaN), array.optDouble(1, Double.NaN));
        }
        return null;
    }

    private List<PatternItem> dashPattern(String dashArray) {
        if (dashArray == null || dashArray.trim().length() == 0) return null;
        String[] rawValues = dashArray.trim().split("[,\\s]+");
        List<Float> values = new ArrayList<>();
        for (String rawValue : rawValues) {
            try {
                float value = Float.parseFloat(rawValue);
                if (value > 0f) values.add(value);
            } catch (NumberFormatException ignored) {
                // Ignore malformed dash fragments and keep any valid values.
            }
        }
        if (values.isEmpty()) return null;

        List<PatternItem> pattern = new ArrayList<>();
        for (int i = 0; i < values.size(); i++) {
            float value = values.get(i);
            pattern.add(i % 2 == 0 ? new Dash(value) : new Gap(value));
        }
        if (pattern.size() == 1) pattern.add(new Gap(values.get(0)));
        return pattern;
    }

    private LatLng firstPoint(List<LatLng> points) {
        return points == null || points.isEmpty() ? null : points.get(0);
    }

    private void emitGoogleItemClick(String itemId, LatLng point) {
        JSObject payload = new JSObject();
        payload.put("itemId", itemId);
        if (point != null) {
            payload.put("lat", point.latitude);
            payload.put("lon", point.longitude);
            JSObject coordinate = new JSObject();
            coordinate.put("latitude", point.latitude);
            coordinate.put("longitude", point.longitude);
            payload.put("coordinate", coordinate);
        }
        emitGoogleEvent("click", payload);
    }

    private int colorValue(JSObject payload, String key, int fallback) {
        String raw = payload.optString(key, "");
        if (raw == null || raw.length() == 0) return fallback;
        try {
            return Color.parseColor(raw);
        } catch (IllegalArgumentException ignored) {
            return fallback;
        }
    }

    private int withAlpha(int color, int alpha) {
        return Color.argb(alpha, Color.red(color), Color.green(color), Color.blue(color));
    }

    private int colorWithOpacity(int color, double opacity) {
        int alpha = (int) Math.round(Math.max(0.0, Math.min(1.0, opacity)) * 255.0);
        return withAlpha(color, alpha);
    }

    private JSArray tileOverlayIdsJson() {
        JSArray ids = new JSArray();
        for (String overlayId : tileOverlayDefinitions.keySet()) {
            ids.put(overlayId);
        }
        return ids;
    }

    private JSObject tileOverlayVisibilityJson() {
        JSObject visibility = new JSObject();
        for (Map.Entry<String, Boolean> entry : tileOverlayVisibility.entrySet()) {
            visibility.put(entry.getKey(), entry.getValue());
        }
        return visibility;
    }

    private JSObject tileOverlayTypesJson() {
        JSObject types = new JSObject();
        for (Map.Entry<String, JSObject> entry : tileOverlayDefinitions.entrySet()) {
            types.put(entry.getKey(), entry.getValue().optString("type", ""));
        }
        return types;
    }

    private JSArray itemIdsJson(Map<String, JSObject> items) {
        JSArray ids = new JSArray();
        for (String itemId : items.keySet()) {
            ids.put(itemId);
        }
        return ids;
    }

    private JSObject itemVisibilityJson() {
        JSObject visibility = new JSObject();
        for (Map.Entry<String, Boolean> entry : itemVisibility.entrySet()) {
            visibility.put(entry.getKey(), entry.getValue());
        }
        return visibility;
    }

    private JSObject layerMembershipJson() {
        JSObject layers = new JSObject();
        for (Map.Entry<String, Set<String>> entry : layerMembership.entrySet()) {
            JSArray itemIds = new JSArray();
            for (String itemId : entry.getValue()) {
                itemIds.put(itemId);
            }
            layers.put(entry.getKey(), itemIds);
        }
        return layers;
    }

    private JSObject layerChildrenJson() {
        JSObject layers = new JSObject();
        for (Map.Entry<String, Set<String>> entry : layerChildren.entrySet()) {
            JSArray childLayerIds = new JSArray();
            for (String childLayerId : entry.getValue()) {
                childLayerIds.put(childLayerId);
            }
            layers.put(entry.getKey(), childLayerIds);
        }
        return layers;
    }

    private JSObject layerVisibilityJson() {
        JSObject visibility = new JSObject();
        for (Map.Entry<String, Boolean> entry : layerVisibility.entrySet()) {
            visibility.put(entry.getKey(), entry.getValue());
        }
        return visibility;
    }

    private JSArray pinTierIdsJson() {
        JSArray ids = new JSArray();
        for (String tierId : pinTiers.keySet()) {
            ids.put(tierId);
        }
        return ids;
    }

    private JSObject pinTierVisibilityJson() {
        JSObject visibility = new JSObject();
        for (Map.Entry<String, Boolean> entry : pinTierVisibility.entrySet()) {
            visibility.put(entry.getKey(), entry.getValue());
        }
        return visibility;
    }

    private void copyInto(JSObject source, JSObject target) {
        Iterator<String> keys = source.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            target.put(key, source.opt(key));
        }
    }

    private JSObject jsObject(JSONObject object) {
        try {
            return JSObject.fromJSONObject(object);
        } catch (JSONException ignored) {
            return null;
        }
    }

    private String firstString(String... values) {
        for (String value : values) {
            if (value != null && value.length() > 0) return value;
        }
        return null;
    }

    private Double optionalDouble(JSObject object, String key) {
        Object value = object.opt(key);
        if (value instanceof Number) return ((Number) value).doubleValue();
        if (value instanceof String) {
            try {
                return Double.parseDouble((String) value);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    private double[] numericPair(Object value) {
        if (!(value instanceof JSONArray)) return null;
        JSONArray array = (JSONArray) value;
        if (array.length() < 2) return null;
        Double first = numericValue(array.opt(0));
        Double second = numericValue(array.opt(1));
        return first == null || second == null ? null : new double[] { first, second };
    }

    private Double numericValue(Object value) {
        if (value instanceof Number) return ((Number) value).doubleValue();
        if (value instanceof String) {
            try {
                return Double.parseDouble((String) value);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    private float clampedFloat(double value) {
        return (float) Math.max(0.0, Math.min(1.0, value));
    }

    private Integer optionalInteger(JSObject object, String key) {
        Object value = object.opt(key);
        if (value instanceof Number) return ((Number) value).intValue();
        if (value instanceof String) {
            try {
                return Integer.parseInt((String) value);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    private Integer firstInteger(Integer... values) {
        for (Integer value : values) {
            if (value != null) return value;
        }
        return null;
    }

    private Double firstDouble(Double... values) {
        for (Double value : values) {
            if (value != null) return value;
        }
        return null;
    }

    private double doubleValue(JSObject object, String key, double defaultValue) {
        Double value = optionalDouble(object, key);
        return value == null ? defaultValue : value;
    }
}
