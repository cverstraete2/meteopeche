from functools import lru_cache
from statistics import mean
from urllib.parse import urlencode

from .spot_resolver import fetch_json


OPEN_METEO_FLOOD = "https://flood-api.open-meteo.com/v1/flood"


def get_river_forecast(params):
    lat = round(float(params["latitude"]), 5)
    lon = round(float(params["longitude"]), 5)
    forecast_days = int(params.get("forecast_days", 7))
    forecast_days = max(1, min(forecast_days, 16))
    return _get_river_forecast_cached(lat, lon, forecast_days)


@lru_cache(maxsize=2048)
def _get_river_forecast_cached(lat, lon, forecast_days):
    query = urlencode({
        "latitude": f"{lat:.5f}",
        "longitude": f"{lon:.5f}",
        "daily": ",".join([
            "river_discharge",
            "river_discharge_mean",
            "river_discharge_max",
            "river_discharge_min",
        ]),
        "forecast_days": forecast_days,
        "timezone": "auto",
    })
    payload = fetch_json(f"{OPEN_METEO_FLOOD}?{query}", timeout=8)
    days = normalize_river_days(payload)

    if not days:
        return {
            "ok": False,
            "error": "Aucune donnée GloFAS exploitable pour ce spot.",
            "provider": "Open-Meteo Flood API",
            "source": "GloFAS",
            "latitude": lat,
            "longitude": lon,
            "days": [],
        }

    return {
        "ok": True,
        "provider": "Open-Meteo Flood API",
        "source": "GloFAS river discharge",
        "latitude": payload.get("latitude", lat),
        "longitude": payload.get("longitude", lon),
        "timezone": payload.get("timezone"),
        "unit": payload.get("daily_units", {}).get("river_discharge_mean", "m³/s"),
        "resolution": "daily",
        "days": days,
    }


def normalize_river_days(payload):
    daily = payload.get("daily") or {}
    dates = daily.get("time") or []
    discharge = daily.get("river_discharge") or []
    mean_values = daily.get("river_discharge_mean") or []
    max_values = daily.get("river_discharge_max") or []
    min_values = daily.get("river_discharge_min") or []

    rows = []
    for index, date in enumerate(dates):
        value = number_at(mean_values, index)
        if value is None:
            value = number_at(discharge, index)
        if value is None:
            continue

        rows.append({
            "date": date,
            "discharge": value,
            "min": number_at(min_values, index),
            "max": number_at(max_values, index),
        })

    values = [row["discharge"] for row in rows if row["discharge"] is not None]
    baseline = mean(values) if values else None

    for index, row in enumerate(rows):
        previous = rows[index - 1]["discharge"] if index > 0 else None
        row["delta"] = row["discharge"] - previous if previous else 0
        row["deltaPercent"] = percent_delta(row["discharge"], previous)
        row["anomalyPercent"] = percent_delta(row["discharge"], baseline)
        row["stress"] = river_stress(row, baseline)

    return rows


def number_at(values, index):
    try:
        value = values[index]
    except IndexError:
        return None

    if isinstance(value, (int, float)):
        return float(value)
    return None


def percent_delta(value, baseline):
    if not isinstance(value, (int, float)) or not isinstance(baseline, (int, float)) or baseline <= 0:
        return 0
    return ((value - baseline) / baseline) * 100


def river_stress(row, baseline):
    value = row["discharge"]
    if not isinstance(value, (int, float)) or value <= 0:
        return 0

    spread = 0
    if isinstance(row.get("max"), (int, float)) and isinstance(row.get("min"), (int, float)):
        spread = max(0, (row["max"] - row["min"]) / value * 100)

    anomaly = abs(percent_delta(value, baseline))
    delta = abs(row.get("deltaPercent") or 0)
    return round(min(100, anomaly * 1.3 + delta * 1.2 + spread * 0.9))
