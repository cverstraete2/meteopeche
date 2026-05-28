(function () {
  const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";
  const REQUEST_TIMEOUT_MS = 12000;
  const DEFAULT_SPOT_NAME = "Spot sans nom";
  const WATER_MODES = {
    SEA: "sea",
    FRESHWATER: "freshwater",
  };

  const spotsCache = new Map();

  function normalizeBounds(bounds) {
    if (!bounds) return null;

    const north = Number(typeof bounds.getNorth === "function" ? bounds.getNorth() : bounds.north);
    const south = Number(typeof bounds.getSouth === "function" ? bounds.getSouth() : bounds.south);
    const east = Number(typeof bounds.getEast === "function" ? bounds.getEast() : bounds.east);
    const west = Number(typeof bounds.getWest === "function" ? bounds.getWest() : bounds.west);

    if (![north, south, east, west].every(Number.isFinite)) return null;
    return { north, south, east, west };
  }

  function normalizeWaterMode(mode) {
    return mode === WATER_MODES.FRESHWATER ? WATER_MODES.FRESHWATER : WATER_MODES.SEA;
  }

  function buildOverpassQuery(bounds) {
    return `
[out:json][timeout:10];
(
  node["leisure"="fishing"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
  node["sport"="fishing"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
  node["amenity"="fishing"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
  way["leisure"="fishing"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
);
out center 200;
`.trim();
  }

  async function fetchSpotsInBounds(bounds, waterMode) {
    const normalizedBounds = normalizeBounds(bounds);
    if (!normalizedBounds) return [];

    const mode = normalizeWaterMode(waterMode);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(OVERPASS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: `data=${encodeURIComponent(buildOverpassQuery(normalizedBounds))}`,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Overpass ${response.status}`);
      }

      const payload = await response.json();
      return (Array.isArray(payload.elements) ? payload.elements : [])
        .map((element) => normalizeOsmSpot(element, mode))
        .filter(Boolean)
        .filter((spot) => spotMatchesWaterMode(spot, mode));
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function normalizeOsmSpot(element, waterMode) {
    if (!element || !element.id) return null;

    const tags = element.tags && typeof element.tags === "object" ? { ...element.tags } : {};
    const lat = Number(element.lat ?? element.center?.lat);
    const lng = Number(element.lon ?? element.center?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return {
      id: `osm-${element.id}`,
      osmElementType: element.type || "",
      name: tags.name || tags["name:fr"] || DEFAULT_SPOT_NAME,
      named: Boolean(tags.name || tags["name:fr"]),
      lat,
      lng,
      type: inferWaterType(tags, waterMode),
      source: "osm",
      zoomLevel: 13,
      tags,
    };
  }

  function inferWaterType(tags, waterMode) {
    const values = [
      tags.water,
      tags.waterway,
      tags.natural,
      tags.place,
      tags["seamark:type"],
      tags.seamark?.type,
      tags.fishing,
      tags.tidal,
    ]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase());

    if (
      values.some((value) => [
        "tidal",
        "bay",
        "sea",
        "ocean",
        "coast",
        "coastline",
        "beach",
        "reef",
        "harbour",
        "marina",
        "saltwater",
      ].includes(value))
    ) {
      return WATER_MODES.SEA;
    }

    if (
      values.some((value) => [
        "river",
        "stream",
        "canal",
        "lake",
        "pond",
        "reservoir",
        "water",
        "freshwater",
      ].includes(value))
    ) {
      return WATER_MODES.FRESHWATER;
    }

    return normalizeWaterMode(waterMode);
  }

  function spotMatchesWaterMode(spot, waterMode) {
    return normalizeWaterMode(spot?.type) === normalizeWaterMode(waterMode);
  }

  window.overpassSpots = {
    fetchSpotsInBounds,
    normalizeBounds,
    spotsCache,
  };
})();
