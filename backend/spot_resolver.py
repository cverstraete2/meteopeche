import json
import math
from functools import lru_cache
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


USER_AGENT = "MeteoCatch/1.0 https://meteopeche.pages.dev"
OPEN_METEO_MARINE = "https://marine-api.open-meteo.com/v1/marine"
NOMINATIM_REVERSE = "https://nominatim.openstreetmap.org/reverse"
OVERPASS_API = "https://overpass-api.de/api/interpreter"
MAX_MARINE_GRID_DISTANCE_METERS = 50000
NEARBY_WATER_RADIUS_METERS = 5000

FRESHWATER_KINDS = {"river", "stream", "canal", "lake", "reservoir", "pond", "freshwater"}
MARINE_KINDS = {"sea", "ocean", "coast", "bay", "strait", "harbour", "marina"}


def resolve_spot(params):
    lat = round(float(params["latitude"]), 5)
    lon = round(float(params["longitude"]), 5)
    return _resolve_spot_cached(lat, lon)


@lru_cache(maxsize=2048)
def _resolve_spot_cached(lat, lon):
    osm = safe_call(lambda: reverse_osm(lat, lon))
    nearby = safe_call(lambda: nearby_water_feature(lat, lon))
    marine = safe_call(lambda: marine_available(lat, lon))

    osm_kind = classify_osm_payload(osm)
    nearby_kind = classify_osm_tags(nearby.get("tags", {}) if nearby else {})
    water_kind = pick_water_kind(osm_kind, nearby_kind, marine)
    water_mode = water_mode_for_kind(water_kind)
    confidence_score = confidence_for(water_kind, osm_kind, nearby_kind, marine)
    name = spot_name(osm, nearby, water_kind, lat, lon)

    return {
        "ok": True,
        "latitude": lat,
        "longitude": lon,
        "name": name,
        "waterKind": water_kind,
        "waterMode": water_mode,
        "confidence": confidence_label(confidence_score),
        "confidenceScore": confidence_score,
        "countryCode": country_code(osm),
        "distanceMeters": nearby.get("distanceMeters") if nearby else None,
        "sources": {
            "osmReverse": source_status(osm),
            "osmNearbyWater": source_status(nearby),
            "openMeteoMarine": "available" if marine.get("available") else "unavailable",
        },
        "providers": provider_routing(water_kind, water_mode, marine),
        "badges": badges_for(water_kind, water_mode, confidence_score, marine),
    }


def safe_call(callback):
    try:
        return callback()
    except Exception as error:
        return {"ok": False, "error": str(error)}


def fetch_json(url, *, timeout=5, headers=None):
    request = Request(url, headers={"User-Agent": USER_AGENT, **(headers or {})})
    try:
        with urlopen(request, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        detail = error.read().decode("utf-8", errors="ignore")[:280]
        raise RuntimeError(f"HTTP {error.code}: {detail or error.reason}") from error
    except URLError as error:
        raise RuntimeError(str(error.reason)) from error


def reverse_osm(lat, lon):
    query = urlencode({
        "format": "jsonv2",
        "lat": f"{lat:.5f}",
        "lon": f"{lon:.5f}",
        "zoom": 14,
        "addressdetails": 1,
        "extratags": 1,
    })
    payload = fetch_json(f"{NOMINATIM_REVERSE}?{query}", timeout=4)
    payload["ok"] = True
    return payload


def nearby_water_feature(lat, lon):
    errors = []
    for query in nearby_water_queries(lat, lon):
        try:
            payload = fetch_json(f"{OVERPASS_API}?{urlencode({'data': query})}", timeout=8)
        except Exception as error:
            errors.append(str(error))
            continue

        elements = payload.get("elements") or []
        candidates = [feature_from_overpass(element, lat, lon) for element in elements]
        candidates = [candidate for candidate in candidates if candidate]
        if candidates:
            candidates.sort(key=lambda item: (kind_priority(classify_osm_tags(item["tags"])), item["distanceMeters"]))
            best = candidates[0]
            best["ok"] = True
            return best

    return {"ok": False, "error": "; ".join(errors) or "No nearby water feature found"}


def nearby_water_queries(lat, lon):
    radius = NEARBY_WATER_RADIUS_METERS
    compact_radius = min(radius, 3000)
    return [
        f"""
        [out:json][timeout:6];
        (
          way(around:{radius},{lat:.5f},{lon:.5f})["waterway"~"^(river|stream|canal|riverbank)$"];
          relation(around:{radius},{lat:.5f},{lon:.5f})["waterway"~"^(river|stream|canal|riverbank)$"];
        );
        out tags center 20;
        """,
        f"""
        [out:json][timeout:6];
        (
          way(around:{compact_radius},{lat:.5f},{lon:.5f})["natural"="water"];
          relation(around:{compact_radius},{lat:.5f},{lon:.5f})["natural"="water"];
          way(around:{compact_radius},{lat:.5f},{lon:.5f})["water"~"^(lake|reservoir|river|pond|lagoon|canal|stream)$"];
          relation(around:{compact_radius},{lat:.5f},{lon:.5f})["water"~"^(lake|reservoir|river|pond|lagoon|canal|stream)$"];
          way(around:{compact_radius},{lat:.5f},{lon:.5f})["landuse"="reservoir"];
          relation(around:{compact_radius},{lat:.5f},{lon:.5f})["landuse"="reservoir"];
        );
        out tags center 20;
        """,
        f"""
        [out:json][timeout:6];
        (
          way(around:{compact_radius},{lat:.5f},{lon:.5f})["natural"~"^(bay|strait|coastline)$"];
          relation(around:{compact_radius},{lat:.5f},{lon:.5f})["natural"~"^(bay|strait|coastline)$"];
        );
        out tags center 20;
        """,
    ]


def marine_available(lat, lon):
    query = urlencode({
        "latitude": f"{lat:.5f}",
        "longitude": f"{lon:.5f}",
        "hourly": "sea_surface_temperature",
        "forecast_days": 1,
        "timezone": "GMT",
        "cell_selection": "sea",
    })
    payload = fetch_json(f"{OPEN_METEO_MARINE}?{query}", timeout=4)
    hourly = payload.get("hourly", {})
    times = hourly.get("time") or []
    values = hourly.get("sea_surface_temperature") or []
    has_data = bool(times) and any(value is not None for value in values)
    try:
        marine_lat = float(payload.get("latitude", lat))
        marine_lon = float(payload.get("longitude", lon))
    except (TypeError, ValueError):
        marine_lat = lat
        marine_lon = lon
    distance = round(haversine_meters(lat, lon, marine_lat, marine_lon))
    return {
        "ok": True,
        "available": has_data and distance <= MAX_MARINE_GRID_DISTANCE_METERS,
        "rawAvailable": has_data,
        "distanceMeters": distance,
    }


def feature_from_overpass(element, lat, lon):
    tags = element.get("tags") or {}
    center = element.get("center") or {}
    feature_lat = element.get("lat", center.get("lat"))
    feature_lon = element.get("lon", center.get("lon"))
    if feature_lat is None or feature_lon is None:
        return None

    return {
        "id": element.get("id"),
        "type": element.get("type"),
        "tags": tags,
        "lat": feature_lat,
        "lon": feature_lon,
        "distanceMeters": round(haversine_meters(lat, lon, feature_lat, feature_lon)),
    }


def classify_osm_payload(payload):
    if not payload or not payload.get("ok", True):
        return None

    tags = {
        "class": payload.get("category") or payload.get("class"),
        "type": payload.get("type"),
        **(payload.get("extratags") or {}),
    }
    address = payload.get("address") or {}
    for key in ("water", "river", "stream", "canal", "bay", "sea", "ocean"):
        if address.get(key):
            tags[key] = address[key]
    return classify_osm_tags(tags)


def classify_osm_tags(tags):
    if not tags:
        return None

    osm_class = str(tags.get("class") or "").lower()
    osm_type = str(tags.get("type") or "").lower()
    natural = str(tags.get("natural") or "").lower()
    water = str(tags.get("water") or "").lower()
    waterway = str(tags.get("waterway") or "").lower()
    seamark = str(tags.get("seamark:type") or "").lower()

    if osm_class == "waterway" or waterway in {"river", "stream", "canal", "riverbank"} or osm_type in {"river", "stream", "canal"}:
        return "river" if (waterway or osm_type) != "canal" else "canal"
    if water in {"river", "stream", "canal"}:
        return "river"
    if water in {"lake", "reservoir", "pond"} or osm_type in {"lake", "reservoir", "pond"}:
        return "lake" if water != "reservoir" else "reservoir"
    if natural == "bay" or osm_type == "bay":
        return "bay"
    if natural == "strait" or osm_type == "strait":
        return "strait"
    if natural == "coastline" or osm_type in {"beach", "coastline"}:
        return "coast"
    if osm_type in {"sea", "ocean"} or tags.get("sea") or tags.get("ocean"):
        return osm_type if osm_type in {"sea", "ocean"} else "sea"
    if seamark or osm_type in {"harbour", "marina", "dock"}:
        return "harbour"
    if natural == "water":
        return "freshwater"
    return None


def pick_water_kind(osm_kind, nearby_kind, marine):
    for kind in (osm_kind, nearby_kind):
        if kind in FRESHWATER_KINDS:
            return kind
    for kind in (osm_kind, nearby_kind):
        if kind in MARINE_KINDS:
            return kind
    if marine.get("available"):
        return "sea"
    return "unknown"


def water_mode_for_kind(kind):
    if kind in FRESHWATER_KINDS:
        return "freshwater"
    if kind in MARINE_KINDS:
        return "sea"
    return None


def confidence_for(kind, osm_kind, nearby_kind, marine):
    if kind == "unknown":
        return 0.2
    score = 0.45
    if osm_kind == kind:
        score += 0.25
    if nearby_kind == kind:
        score += 0.2
    if kind in MARINE_KINDS and marine.get("available"):
        score += 0.15
    return min(0.95, score)


def confidence_label(score):
    if score >= 0.75:
        return "high"
    if score >= 0.5:
        return "medium"
    return "low"


def provider_routing(kind, mode, marine):
    providers = [
        {
            "id": "open-meteo-weather",
            "label": "Open-Meteo Weather",
            "status": "available",
            "quality": "forecast",
            "variables": ["air", "wind", "clouds", "pressure", "rain"],
        },
        {
            "id": "openstreetmap",
            "label": "OpenStreetMap",
            "status": "available" if kind != "unknown" else "partial",
            "quality": "context",
            "variables": ["waterbody", "nearby-place"],
        },
    ]

    if mode == "sea":
        providers.extend([
            {
                "id": "open-meteo-marine",
                "label": "Open-Meteo Marine",
                "status": "available" if marine.get("available") else "unavailable",
                "quality": "forecast",
                "variables": ["waves", "surface-current", "sst", "sea-level"],
            },
            {
                "id": "copernicus-marine",
                "label": "Copernicus Marine",
                "status": "candidate",
                "quality": "real-model",
                "variables": ["depth-current", "global-ocean-grid"],
            },
        ])
    elif mode == "freshwater":
        providers.append({
            "id": "glofas",
            "label": "Copernicus GloFAS",
            "status": "candidate",
            "quality": "model",
            "variables": ["river-flow", "hydrology"],
        })

    return providers


def badges_for(kind, mode, confidence, marine):
    badges = ["weather-global"]
    if mode == "sea":
        badges.append("marine-global" if marine.get("available") else "marine-partial")
        badges.append("copernicus-marine-route")
    elif mode == "freshwater":
        badges.append("freshwater")
        badges.append("glofas-route")
    else:
        badges.append("manual-check")

    if confidence >= 0.75:
        badges.append("high-confidence")
    return badges


def spot_name(osm, nearby, kind, lat, lon):
    for source in (nearby, osm):
        name = preferred_name(source)
        if name:
            return name

    labels = {
        "river": "Rivière",
        "canal": "Canal",
        "lake": "Lac",
        "reservoir": "Réservoir",
        "sea": "Mer",
        "ocean": "Océan",
        "coast": "Côte",
        "bay": "Baie",
        "strait": "Détroit",
    }
    prefix = labels.get(kind, "Spot")
    return f"{prefix} {lat:.4f}, {lon:.4f}"


def preferred_name(source):
    if not source or not source.get("ok", True):
        return ""

    tags = source.get("tags") or {}
    address = source.get("address") or {}
    for key in ("name", "name:fr", "water", "river", "stream", "canal", "lake", "bay", "sea", "ocean", "town", "city", "village"):
        value = tags.get(key) or address.get(key)
        if value:
            return str(value)

    display = source.get("display_name")
    if display:
        return str(display).split(",")[0].strip()
    return ""


def country_code(osm):
    address = osm.get("address") if osm else None
    code = (address or {}).get("country_code")
    return code.upper() if code else None


def source_status(value):
    if value and value.get("ok"):
        return "available"
    if value and value.get("error"):
        return "unavailable"
    return "unavailable"


def kind_priority(kind):
    if kind in {"river", "canal", "stream"}:
        return 0
    if kind in {"lake", "reservoir", "pond"}:
        return 1
    if kind in MARINE_KINDS:
        return 2
    return 5


def haversine_meters(lat1, lon1, lat2, lon2):
    radius = 6371008.8
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)
    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    return 2 * radius * math.atan2(math.sqrt(a), math.sqrt(1 - a))
