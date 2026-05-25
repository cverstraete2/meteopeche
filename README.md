# Météo Pêche

Application web locale pour consulter les conditions utiles à une sortie pêche:

- sélection de spots tout autour de la France et de la Corse;
- page Préférences pour mémoriser milieu, thème clair/sombre, niveau, approche, priorité, espèce cible et profondeur;
- carte nautique, coins de pêche connus, filtres par poisson et favoris enregistrés dans le navigateur;
- score d'activité poisson par espèce, courbe horaire et fenêtres majeures/mineures;
- courant de surface en noeuds et direction;
- courant estimé à la profondeur cible;
- vent moyen, rafales et direction;
- houle totale, période et direction;
- moyennes journalières et courbes heure par heure.

Les données viennent des API Open-Meteo Weather et Marine, sans clé API pour un usage non commercial.

## Lancer

```bash
node server.mjs
```

Puis ouvrir `http://localhost:8080`.

Le serveur Node sert l'application et expose aussi `/api/depth-current`, utilisé pour récupérer le courant réel en profondeur quand Copernicus Marine est configuré.

## Déployer

Le build statique se génère dans `dist`:

```bash
npm run build
```

La production est publiée sur Cloudflare Pages:

- projet: `meteopeche`
- URL: `https://meteopeche.pages.dev/`
- build command: `npm run build`
- output directory: `dist`

Le projet Cloudflare Pages est connecté au dépôt GitHub et publie automatiquement `main`. Pour forcer un déploiement manuel depuis ce poste:

```bash
npm run deploy
```

Le workflow GitHub vérifie seulement que le build passe; il ne publie pas l'application.

## Note sur le courant en profondeur

Open-Meteo Marine expose le courant océanique de surface. Sans configuration Copernicus, le courant à profondeur reste une estimation simple calculée depuis le courant de surface et la profondeur choisie.

Pour activer le courant réel en profondeur:

```bash
python3 -m pip install copernicusmarine pandas cftime
copernicusmarine login
node server.mjs
```

L'application demandera alors au serveur local un extrait Copernicus Marine `uo`/`vo` au point et à la profondeur choisis. Les jeux utilisés sont:

- Atlantique, Manche, Bretagne, Biscaye: `cmems_mod_ibi_phy_anfc_0.027deg-3D_PT1H-m`;
- Méditerranée française: `cmems_mod_med_phy-cur_anfc_4.2km-3D_PT1H-m`;
- secours global: `cmems_mod_glo_phy-cur_anfc_0.083deg_P1D-m`.
