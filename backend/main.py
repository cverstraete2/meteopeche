import os

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .copernicus_depth import get_depth_current


DEFAULT_ALLOWED_ORIGINS = [
    "https://meteopeche.pages.dev",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:8081",
]
DEFAULT_ALLOWED_ORIGIN_REGEX = r"https://([a-z0-9-]+\.)?meteopeche\.pages\.dev"


def allowed_origins():
    raw = os.getenv("ALLOWED_ORIGINS", ",".join(DEFAULT_ALLOWED_ORIGINS))
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


app = FastAPI(title="Meteo Peche Copernicus API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins(),
    allow_origin_regex=os.getenv("ALLOWED_ORIGIN_REGEX", DEFAULT_ALLOWED_ORIGIN_REGEX),
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"ok": True, "service": "meteo-peche-copernicus"}


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
