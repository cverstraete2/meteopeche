import math


KNOTS_PER_METER_SECOND = 1.9438444924406

DATASETS = [
    {
        "id": "cmems_mod_ibi_phy_anfc_0.027deg-3D_PT1H-m",
        "label": "Copernicus IBI 3D horaire",
        "temporalResolution": "hourly",
        "minLon": -19.08,
        "maxLon": 5.08,
        "minLat": 26.17,
        "maxLat": 56.08,
    },
    {
        "id": "cmems_mod_med_phy-cur_anfc_4.2km-3D_PT1H-m",
        "label": "Copernicus MED 3D horaire",
        "temporalResolution": "hourly",
        "minLon": -17.29,
        "maxLon": 36.29,
        "minLat": 30.19,
        "maxLat": 45.98,
    },
    {
        "id": "cmems_mod_glo_phy-cur_anfc_0.083deg_P1D-m",
        "label": "Copernicus Global 3D quotidien",
        "temporalResolution": "daily",
        "minLon": -180,
        "maxLon": 179.92,
        "minLat": -80,
        "maxLat": 90,
    },
]


def get_depth_current(params):
    try:
        import copernicusmarine
    except ImportError:
        return {
            "ok": False,
            "error": "Le paquet Python copernicusmarine n'est pas installé.",
            "setup": [
                "python3 -m pip install copernicusmarine pandas",
                "copernicusmarine login",
                "node server.mjs",
            ],
        }

    dataset = select_dataset(params["longitude"], params["latitude"])
    if dataset is None:
        return {"ok": False, "error": "Ce point est hors couverture Copernicus Marine."}

    try:
        radius = search_radius(dataset)
        df = copernicusmarine.read_dataframe(
            dataset_id=dataset["id"],
            variables=["uo", "vo"],
            minimum_longitude=max(dataset["minLon"], params["longitude"] - radius),
            maximum_longitude=min(dataset["maxLon"], params["longitude"] + radius),
            minimum_latitude=max(dataset["minLat"], params["latitude"] - radius),
            maximum_latitude=min(dataset["maxLat"], params["latitude"] + radius),
            minimum_depth=max(0, params["depth"]),
            maximum_depth=max(0, params["depth"]),
            start_datetime=params["start"],
            end_datetime=params["end"],
            coordinates_selection_method="inside",
            disable_progress_bar=True,
        )
    except Exception as error:
        return {
            "ok": False,
            "error": "Copernicus Marine n'a pas renvoyé de courant profondeur.",
            "detail": str(error),
            "datasetId": dataset["id"],
        }

    if df is None:
        return {
            "ok": False,
            "error": "Copernicus Marine a renvoyé une réponse vide.",
            "detail": "Vérifier les variables Cloud Run COPERNICUSMARINE_SERVICE_USERNAME et COPERNICUSMARINE_SERVICE_PASSWORD, puis relancer la requête.",
            "datasetId": dataset["id"],
        }

    points = dataframe_to_points(df, params)
    if not points:
        return {
            "ok": False,
            "error": "Aucune valeur uo/vo exploitable dans la réponse Copernicus.",
            "datasetId": dataset["id"],
        }

    return {
        "ok": True,
        "source": "copernicus",
        "datasetId": dataset["id"],
        "datasetLabel": dataset["label"],
        "temporalResolution": dataset["temporalResolution"],
        "requestedDepth": params["depth"],
        "actualDepth": average([point["depth"] for point in points if point.get("depth") is not None]),
        "hours": points,
    }


def select_dataset(lon, lat):
    med = DATASETS[1]
    if lon >= 2.5 and med["minLon"] <= lon <= med["maxLon"] and med["minLat"] <= lat <= med["maxLat"]:
        return med

    for dataset in DATASETS:
        if dataset["minLon"] <= lon <= dataset["maxLon"] and dataset["minLat"] <= lat <= dataset["maxLat"]:
            return dataset
    return None


def search_radius(dataset):
    if dataset["temporalResolution"] == "daily":
        return 0.35
    return 0.18


def dataframe_to_points(df, params):
    frame = normalize_frame(df)
    rows = frame.to_dict("records")
    best_by_time = {}

    for row in rows:
        uo = read_float(row, "uo")
        vo = read_float(row, "vo")
        if uo is None or vo is None:
            continue

        time = read_time(row)
        if time is None:
            continue

        depth = read_float(row, "depth", "elevation")
        lat = read_float(row, "latitude", "y")
        lon = read_float(row, "longitude", "x")
        speed_ms = math.hypot(uo, vo)
        point = {
            "time": time,
            "depth": depth,
            "latitude": lat,
            "longitude": lon,
            "uo": uo,
            "vo": vo,
            "speedKt": speed_ms * KNOTS_PER_METER_SECOND,
            "direction": normalize_direction(math.degrees(math.atan2(uo, vo))),
        }
        distance = point_distance(point, params)

        current = best_by_time.get(time)
        if current is None or distance < current[0]:
            best_by_time[time] = (distance, point)

    return [entry[1] for entry in sorted(best_by_time.values(), key=lambda item: item[1]["time"])]


def normalize_frame(df):
    frame = df.reset_index()
    frame.columns = [str(column) for column in frame.columns]

    if {"variable", "value"}.issubset(set(frame.columns)):
        index_columns = [column for column in frame.columns if column not in {"variable", "value"}]
        frame = frame.pivot_table(index=index_columns, columns="variable", values="value", aggfunc="first").reset_index()
        frame.columns = [str(column) for column in frame.columns]

    return frame


def read_float(row, *keys):
    for key in keys:
        value = row.get(key)
        try:
            number = float(value)
        except (TypeError, ValueError):
            continue
        if math.isfinite(number):
            return number
    return None


def read_time(row):
    value = row.get("time") or row.get("datetime")
    if value is None:
        return None

    if hasattr(value, "isoformat"):
        return value.isoformat()

    return str(value)


def point_distance(point, params):
    total = 0.0
    if point["longitude"] is not None:
        total += (point["longitude"] - params["longitude"]) ** 2
    if point["latitude"] is not None:
        total += (point["latitude"] - params["latitude"]) ** 2
    if point["depth"] is not None:
        total += ((point["depth"] - params["depth"]) / max(params["depth"], 1)) ** 2
    return total


def normalize_direction(direction):
    return (direction % 360 + 360) % 360


def average(values):
    clean = [value for value in values if value is not None and math.isfinite(value)]
    if not clean:
        return None
    return sum(clean) / len(clean)
