# API Copernicus MeteoCatch

Ce service Python fournit `/api/depth-current` pour récupérer les courants `uo`/`vo` Copernicus Marine à la profondeur choisie par l'utilisateur.

## Local

```bash
python3 -m venv .venv-copernicus
. .venv-copernicus/bin/activate
pip install -r backend/requirements.txt
copernicusmarine login
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8787
```

Puis lancer le front avec:

```bash
METEOPECHE_API_BASE_URL=http://127.0.0.1:8787 npm run build
```

## Production

Cloudflare Pages sert uniquement le front statique. Cette API doit être hébergée sur un runtime Python séparé, par exemple Cloud Run, Fly.io, Render ou un VPS.

Construire l'image depuis la racine du dépôt:

```bash
docker build -t meteo-peche-copernicus .
docker run -p 8787:8080 meteo-peche-copernicus
```

Si Cloud Run est configuré avec `backend/` comme dossier source, utiliser `backend/Dockerfile`; il est autonome et embarque le module Copernicus du backend.

Après déploiement du backend, définir `METEOPECHE_API_BASE_URL` dans Cloudflare Pages avec l'URL publique du service, puis redéployer le front. Le service doit aussi recevoir les variables `COPERNICUSMARINE_SERVICE_USERNAME` et `COPERNICUSMARINE_SERVICE_PASSWORD`; sans elles, le front affichera Copernicus comme indisponible au lieu d'utiliser une estimation.
