import os

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .copernicus_depth import get_depth_current
from .river_forecast import get_river_forecast
from .spot_resolver import discover_nearby_spots, resolve_spot, search_spots


DEFAULT_ALLOWED_ORIGINS = [
    "https://meteopeche.pages.dev",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:8081",
    "http://127.0.0.1:8090",
]
DEFAULT_ALLOWED_ORIGIN_REGEX = r"https://([a-z0-9-]+\.)?meteopeche\.pages\.dev"


def allowed_origins():
    raw = os.getenv("ALLOWED_ORIGINS", ",".join(DEFAULT_ALLOWED_ORIGINS))
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


API_VERSION = "1.4.0"

app = FastAPI(title="MeteoCatch Copernicus API", version=API_VERSION)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins(),
    allow_origin_regex=os.getenv("ALLOWED_ORIGIN_REGEX", DEFAULT_ALLOWED_ORIGIN_REGEX),
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"ok": True, "service": "meteo-peche-copernicus", "version": API_VERSION}


@app.get("/api/depth-current")
def depth_current(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    depth: float = Query(..., ge=0, le=6000),
    start: str = Query(..., min_length=10),
    end: str = Query(..., min_length=10),
):
    try:
        result = get_depth_current(
            {
                "latitude": latitude,
                "longitude": longitude,
                "depth": depth,
                "start": start,
                "end": end,
            }
        )
    except Exception as error:
        result = {
            "ok": False,
            "error": "Erreur inattendue dans l'API Copernicus.",
            "detail": str(error),
            "errorType": error.__class__.__name__,
        }

    status_code = 200 if result.get("ok") else 503
    return JSONResponse(result, status_code=status_code)


@app.get("/api/spot-resolve")
def spot_resolve(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
):
    try:
        result = resolve_spot({
            "latitude": latitude,
            "longitude": longitude,
        })
    except Exception as error:
        result = {
            "ok": False,
            "error": "Erreur inattendue pendant l'analyse mondiale du spot.",
            "detail": str(error),
            "errorType": error.__class__.__name__,
        }

    status_code = 200 if result.get("ok") else 503
    return JSONResponse(result, status_code=status_code)


@app.get("/api/spot-search")
def spot_search(
    q: str = Query(..., min_length=2, max_length=120),
    limit: int = Query(8, ge=1, le=10),
):
    try:
        result = search_spots({
            "query": q,
            "limit": limit,
        })
    except Exception as error:
        result = {
            "ok": False,
            "error": "Erreur inattendue pendant la recherche mondiale.",
            "detail": str(error),
            "errorType": error.__class__.__name__,
            "results": [],
        }

    status_code = 200 if result.get("ok") else 503
    return JSONResponse(result, status_code=status_code)


@app.get("/api/nearby-spots")
def nearby_spots(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    radius: int = Query(25000, ge=1000, le=50000),
    limit: int = Query(12, ge=1, le=20),
    waterMode: str | None = Query(None, pattern="^(sea|freshwater)$"),
):
    try:
        result = discover_nearby_spots({
            "latitude": latitude,
            "longitude": longitude,
            "radius": radius,
            "limit": limit,
            "waterMode": waterMode,
        })
    except Exception as error:
        result = {
            "ok": False,
            "error": "Erreur inattendue pendant la découverte des eaux proches.",
            "detail": str(error),
            "errorType": error.__class__.__name__,
            "results": [],
        }

    status_code = 200 if result.get("ok") else 503
    return JSONResponse(result, status_code=status_code)


@app.get("/api/river-forecast")
def river_forecast(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    forecast_days: int = Query(7, ge=1, le=16),
):
    try:
        result = get_river_forecast({
            "latitude": latitude,
            "longitude": longitude,
            "forecast_days": forecast_days,
        })
    except Exception as error:
        result = {
            "ok": False,
            "error": "Erreur inattendue pendant le chargement GloFAS.",
            "detail": str(error),
            "errorType": error.__class__.__name__,
        }

    status_code = 200 if result.get("ok") else 503
    return JSONResponse(result, status_code=status_code)
