const WEATHER_API = "https://api.open-meteo.com/v1/forecast";
const MARINE_API = "https://marine-api.open-meteo.com/v1/marine";
const STORE_KEY = "meteo-peche-store-v1";
const LEGACY_FAVORITES_KEY = "meteo-peche-favorites";
const LEGACY_SETTINGS_KEY = "meteo-peche-settings";
const STORE_VERSION = 1;
const WATER_MODES = {
  SEA: "sea",
  FRESHWATER: "freshwater",
};
const MOBILE_VIEWS = ["map", "activity", "weather", "rigging", "journal"];
const MARINE_OVERLAY_MODES = ["none", "surface", "depth", "wave"];
const waterModeConfig = {
  [WATER_MODES.SEA]: {
    label: "Mer",
    mapTitle: "Spots mer",
    metaPrefix: "Prévisions marines",
    defaultActivityFish: "loup",
    showMarine: true,
  },
  [WATER_MODES.FRESHWATER]: {
    label: "Eau douce",
    mapTitle: "Spots eau douce",
    metaPrefix: "Prévisions eau douce",
    defaultActivityFish: "brochet",
    showMarine: false,
  },
};
const MAP_BASE_ZOOM = 7;
const MAP_MIN_ZOOM = 6;
const MAP_MAX_ZOOM = 19;
const MAP_TILE_SIZE = 256;
const MAP_TILE_BUFFER = 1;
const MAP_TILE_STALE_MS = 900;
const MAP_BOUNDS = {
  west: 2.35,
  east: 9.95,
  north: 44.25,
  south: 41.15,
};
const REGULATION_WARNING_METERS = 600;
const ANCHOR_DRIFT_LIMIT_METERS = 30;

const regulationZones = [
  {
    id: "cerbere-banyuls",
    name: "Réserve marine Cerbère-Banyuls",
    area: "Côte Vermeille",
    level: "danger",
    rule: "Zone protégée: pêche et mouillage peuvent être interdits ou très encadrés. Vérifier Nav&Co et l'arrêté local.",
    coordinates: [
      [42.505, 3.112],
      [42.502, 3.188],
      [42.416, 3.206],
      [42.408, 3.13],
    ],
  },
  {
    id: "cote-bleue-carry",
    name: "Parc marin Côte Bleue - Carry / Cap Rousset",
    area: "Côte Bleue",
    level: "danger",
    rule: "Secteur de réserve et d'herbiers: pêche à vérifier précisément avant action.",
    coordinates: [
      [43.337, 5.136],
      [43.337, 5.168],
      [43.318, 5.17],
      [43.316, 5.14],
    ],
  },
  {
    id: "calanques-marseille",
    name: "Parc national des Calanques - zones à vérifier",
    area: "Marseille / Cassis",
    level: "danger",
    rule: "Le parc contient des zones de non-prélèvement et des règles spécifiques. Vérifier l'autorisation pêche avant sortie.",
    coordinates: [
      [43.218, 5.335],
      [43.214, 5.545],
      [43.112, 5.54],
      [43.12, 5.34],
    ],
  },
  {
    id: "port-cros",
    name: "Parc national de Port-Cros",
    area: "Îles d'Hyères",
    level: "danger",
    rule: "Coeur de parc très réglementé: pêche, mouillage et débarquement à vérifier avant navigation.",
    coordinates: [
      [43.072, 6.34],
      [43.072, 6.462],
      [42.958, 6.468],
      [42.952, 6.336],
    ],
  },
  {
    id: "scandola",
    name: "Réserve naturelle de Scandola",
    area: "Corse ouest",
    level: "danger",
    rule: "Réserve naturelle: pêche, mouillage et accès sont strictement encadrés selon les secteurs.",
    coordinates: [
      [42.444, 8.525],
      [42.438, 8.708],
      [42.29, 8.724],
      [42.284, 8.544],
    ],
  },
  {
    id: "bonifacio",
    name: "Bouches de Bonifacio - zones protégées",
    area: "Corse sud",
    level: "warn",
    rule: "Grande aire protégée avec secteurs réglementés. Vérifier les interdictions locales avant pêche.",
    coordinates: [
      [41.59, 8.8],
      [41.59, 9.39],
      [41.25, 9.42],
      [41.24, 8.82],
    ],
  },
  {
    id: "banc-arguin",
    name: "Réserve naturelle du Banc d'Arguin",
    area: "Bassin d'Arcachon",
    level: "danger",
    rule: "Réserve naturelle avec zonages saisonniers. Vérifier accès, pêche et mouillage avant sortie.",
    coordinates: [
      [44.65, -1.285],
      [44.65, -1.13],
      [44.48, -1.075],
      [44.475, -1.27],
    ],
  },
  {
    id: "sept-iles",
    name: "Réserve naturelle des Sept-Îles",
    area: "Côte de Granit Rose",
    level: "warn",
    rule: "Réserve naturelle et protection oiseaux: vérifier les zones d'accès et d'activités autorisées.",
    coordinates: [
      [48.93, -3.58],
      [48.93, -3.39],
      [48.848, -3.37],
      [48.846, -3.585],
    ],
  },
  {
    id: "iroise-molene",
    name: "Iroise / archipel de Molène - vigilance",
    area: "Finistère",
    level: "warn",
    rule: "Aire marine protégée avec secteurs sensibles et forts courants. Vérifier réglementation et météo.",
    coordinates: [
      [48.505, -5.13],
      [48.505, -4.74],
      [48.31, -4.71],
      [48.295, -5.105],
    ],
  },
  {
    id: "chausey",
    name: "Archipel de Chausey - vigilance réserve",
    area: "Manche",
    level: "warn",
    rule: "Archipel à marnage extrême avec secteurs sensibles. Vérifier pêche, mouillage et navigation.",
    coordinates: [
      [48.935, -1.995],
      [48.935, -1.695],
      [48.775, -1.66],
      [48.765, -1.99],
    ],
  },
];

const spots = [
  { name: "Cerbère", lat: 42.44, lon: 3.17, group: "Méditerranée - Côte Vermeille" },
  { name: "Banyuls-sur-Mer", lat: 42.48, lon: 3.13, group: "Méditerranée - Côte Vermeille" },
  { name: "Port-Vendres", lat: 42.52, lon: 3.11, group: "Méditerranée - Côte Vermeille" },
  { name: "Collioure", lat: 42.53, lon: 3.08, group: "Méditerranée - Côte Vermeille" },
  { name: "Argelès-sur-Mer", lat: 42.55, lon: 3.04, group: "Méditerranée - Côte Vermeille" },
  { name: "Saint-Cyprien", lat: 42.62, lon: 3.04, group: "Méditerranée - Roussillon" },
  { name: "Canet-en-Roussillon", lat: 42.71, lon: 3.04, group: "Méditerranée - Roussillon" },
  { name: "Le Barcarès", lat: 42.79, lon: 3.04, group: "Méditerranée - Roussillon" },
  { name: "Leucate", lat: 42.91, lon: 3.04, group: "Méditerranée - Roussillon" },
  { name: "Port-la-Nouvelle", lat: 43.02, lon: 3.06, group: "Méditerranée - Aude" },
  { name: "Gruissan", lat: 43.11, lon: 3.09, group: "Méditerranée - Aude" },
  { name: "Narbonne-Plage", lat: 43.16, lon: 3.17, group: "Méditerranée - Aude" },
  { name: "Valras-Plage", lat: 43.25, lon: 3.29, group: "Méditerranée - Hérault" },
  { name: "Grau d'Agde", lat: 43.28, lon: 3.45, group: "Méditerranée - Hérault" },
  { name: "Cap d'Agde", lat: 43.28, lon: 3.51, group: "Méditerranée - Hérault" },
  { name: "Marseillan", lat: 43.32, lon: 3.54, group: "Méditerranée - Hérault" },
  { name: "Sète", lat: 43.40, lon: 3.70, group: "Méditerranée - Hérault" },
  { name: "Frontignan", lat: 43.43, lon: 3.76, group: "Méditerranée - Hérault" },
  { name: "Palavas-les-Flots", lat: 43.53, lon: 3.93, group: "Méditerranée - Hérault" },
  { name: "Carnon", lat: 43.55, lon: 3.98, group: "Méditerranée - Hérault" },
  { name: "La Grande-Motte", lat: 43.56, lon: 4.08, group: "Méditerranée - Gard" },
  { name: "Le Grau-du-Roi", lat: 43.54, lon: 4.14, group: "Méditerranée - Gard" },
  { name: "Port-Camargue", lat: 43.52, lon: 4.13, group: "Méditerranée - Gard" },
  { name: "Saintes-Maries-de-la-Mer", lat: 43.45, lon: 4.43, group: "Méditerranée - Camargue" },
  { name: "Port-Saint-Louis-du-Rhône", lat: 43.39, lon: 4.81, group: "Méditerranée - Camargue" },
  { name: "Fos-sur-Mer", lat: 43.44, lon: 4.94, group: "Méditerranée - Provence" },
  { name: "Martigues - Côte Bleue", lat: 43.35, lon: 5.05, group: "Méditerranée - Provence" },
  { name: "Sausset-les-Pins", lat: 43.33, lon: 5.11, group: "Méditerranée - Provence" },
  { name: "Carry-le-Rouet", lat: 43.33, lon: 5.15, group: "Méditerranée - Provence" },
  { name: "Marseille - L'Estaque", lat: 43.36, lon: 5.31, group: "Méditerranée - Marseille" },
  { name: "Marseille - Vieux-Port", lat: 43.29, lon: 5.37, group: "Méditerranée - Marseille" },
  { name: "Marseille - Îles du Frioul", lat: 43.28, lon: 5.30, group: "Méditerranée - Marseille" },
  { name: "Marseille - Pointe Rouge", lat: 43.24, lon: 5.37, group: "Méditerranée - Marseille" },
  { name: "Cassis", lat: 43.22, lon: 5.54, group: "Méditerranée - Calanques" },
  { name: "La Ciotat", lat: 43.17, lon: 5.61, group: "Méditerranée - Calanques" },
  { name: "Bandol", lat: 43.14, lon: 5.75, group: "Méditerranée - Var" },
  { name: "Sanary-sur-Mer", lat: 43.12, lon: 5.80, group: "Méditerranée - Var" },
  { name: "Six-Fours - Le Brusc", lat: 43.08, lon: 5.80, group: "Méditerranée - Var" },
  { name: "Saint-Mandrier", lat: 43.08, lon: 5.93, group: "Méditerranée - Var" },
  { name: "Toulon", lat: 43.12, lon: 5.93, group: "Méditerranée - Var" },
  { name: "Hyères", lat: 43.12, lon: 6.13, group: "Méditerranée - Îles d'Hyères" },
  { name: "Presqu'île de Giens", lat: 43.04, lon: 6.13, group: "Méditerranée - Îles d'Hyères" },
  { name: "Porquerolles", lat: 42.99, lon: 6.20, group: "Méditerranée - Îles d'Hyères" },
  { name: "Port-Cros", lat: 43.01, lon: 6.39, group: "Méditerranée - Îles d'Hyères" },
  { name: "Le Lavandou", lat: 43.14, lon: 6.37, group: "Méditerranée - Var Est" },
  { name: "Cavalaire-sur-Mer", lat: 43.17, lon: 6.53, group: "Méditerranée - Var Est" },
  { name: "Saint-Tropez", lat: 43.27, lon: 6.64, group: "Méditerranée - Golfe de Saint-Tropez" },
  { name: "Sainte-Maxime", lat: 43.31, lon: 6.64, group: "Méditerranée - Golfe de Saint-Tropez" },
  { name: "Saint-Raphaël", lat: 43.42, lon: 6.77, group: "Méditerranée - Côte d'Azur" },
  { name: "Fréjus", lat: 43.43, lon: 6.74, group: "Méditerranée - Côte d'Azur" },
  { name: "Cannes", lat: 43.55, lon: 7.02, group: "Méditerranée - Côte d'Azur" },
  { name: "Antibes", lat: 43.58, lon: 7.13, group: "Méditerranée - Côte d'Azur" },
  { name: "Cagnes-sur-Mer", lat: 43.66, lon: 7.15, group: "Méditerranée - Côte d'Azur" },
  { name: "Nice", lat: 43.70, lon: 7.27, group: "Méditerranée - Côte d'Azur" },
  { name: "Villefranche-sur-Mer", lat: 43.70, lon: 7.31, group: "Méditerranée - Côte d'Azur" },
  { name: "Beaulieu-sur-Mer", lat: 43.71, lon: 7.33, group: "Méditerranée - Côte d'Azur" },
  { name: "Monaco", lat: 43.73, lon: 7.43, group: "Méditerranée - Côte d'Azur" },
  { name: "Menton", lat: 43.78, lon: 7.51, group: "Méditerranée - Côte d'Azur" },
  { name: "Calvi", lat: 42.57, lon: 8.76, group: "Méditerranée - Corse" },
  { name: "L'Île-Rousse", lat: 42.63, lon: 8.94, group: "Méditerranée - Corse" },
  { name: "Saint-Florent", lat: 42.68, lon: 9.30, group: "Méditerranée - Corse" },
  { name: "Macinaggio", lat: 42.96, lon: 9.45, group: "Méditerranée - Corse" },
  { name: "Bastia", lat: 42.70, lon: 9.45, group: "Méditerranée - Corse" },
  { name: "Solenzara", lat: 41.86, lon: 9.41, group: "Méditerranée - Corse" },
  { name: "Porto-Vecchio", lat: 41.59, lon: 9.28, group: "Méditerranée - Corse" },
  { name: "Bonifacio", lat: 41.39, lon: 9.16, group: "Méditerranée - Corse" },
  { name: "Tizzano", lat: 41.53, lon: 8.87, group: "Méditerranée - Corse" },
  { name: "Propriano", lat: 41.68, lon: 8.90, group: "Méditerranée - Corse" },
  { name: "Ajaccio", lat: 41.92, lon: 8.74, group: "Méditerranée - Corse" },
  { name: "Cargèse", lat: 42.14, lon: 8.60, group: "Méditerranée - Corse" },
  { name: "Porto", lat: 42.27, lon: 8.69, group: "Méditerranée - Corse" },
  { name: "Galéria", lat: 42.42, lon: 8.65, group: "Méditerranée - Corse" },
  { name: "Brest - Iroise", lat: 48.36, lon: -4.68, group: "Atlantique - raccourcis" },
  { name: "Quiberon", lat: 47.48, lon: -3.16, group: "Atlantique - raccourcis" },
  { name: "La Rochelle", lat: 46.05, lon: -1.35, group: "Atlantique - raccourcis" },
  { name: "Bassin d'Arcachon", lat: 44.64, lon: -1.31, group: "Atlantique - raccourcis" },
  { name: "Saint-Jean-de-Luz", lat: 43.41, lon: -1.70, group: "Atlantique - raccourcis" },
  { name: "Personnalisé", lat: 46.05, lon: -1.35, custom: true },
];

const knownFishingSpots = [
  {
    name: "Carro - digues et roches",
    lat: 43.3256,
    lon: 5.0392,
    area: "Côte Bleue",
    fish: ["dorade", "loup", "sar", "roche", "cephalopodes"],
    note: "Secteur de port et roches connu, intéressant par mer formée modérée.",
    caution: "Vérifier arrêtés portuaires et zones de baignade.",
  },
  {
    name: "La Couronne - Sainte-Croix",
    lat: 43.3282,
    lon: 5.0635,
    area: "Côte Bleue",
    fish: ["dorade", "loup", "sar", "roche"],
    note: "Anses, roches et plages de la Couronne, spot public très fréquenté.",
    caution: "Respecter baignade, posidonies et restrictions locales.",
  },
  {
    name: "Sausset - sortie de port",
    lat: 43.3258,
    lon: 5.1032,
    area: "Côte Bleue",
    fish: ["dorade", "loup", "sar", "roche", "cephalopodes"],
    note: "Port, digues et bord rocheux; secteur cité dans les parcours locaux.",
    caution: "Ne pas pêcher dans les zones interdites du port.",
  },
  {
    name: "Carry - port et digues",
    lat: 43.3268,
    lon: 5.1518,
    area: "Côte Bleue",
    fish: ["dorade", "sar", "roche"],
    note: "Port de Carry et abords accessibles, à distinguer de la réserve.",
    caution: "Cap Rousset / réserve de Carry: pêche interdite.",
  },
  {
    name: "Eaux Salées",
    lat: 43.3297,
    lon: 5.1747,
    area: "Côte Bleue",
    fish: ["dorade", "sar", "roche"],
    note: "Calanque et tombants proches du bord, très connus des locaux.",
    caution: "Vérifier Parc Marin et mouillage avant toute sortie bateau.",
  },
  {
    name: "La Redonne",
    lat: 43.3297,
    lon: 5.1986,
    area: "Côte Bleue",
    fish: ["dorade", "sar", "roche", "cephalopodes"],
    note: "Petit port de pêche et calanque rocheuse de la Côte Bleue.",
    caution: "Accès parfois contraint; respecter propriétés et zones portuaires.",
  },
  {
    name: "Méjean",
    lat: 43.3256,
    lon: 5.2269,
    area: "Côte Bleue",
    fish: ["dorade", "sar", "roche"],
    note: "Calanque et port abrité, roches proches du bord.",
    caution: "Vérifier interdictions locales et conditions de houle.",
  },
  {
    name: "Niolon",
    lat: 43.3372,
    lon: 5.2584,
    area: "Côte Bleue",
    fish: ["loup", "sar", "roche", "cephalopodes"],
    note: "Petit port et calanque emblématique face à Marseille.",
    caution: "Secteur rocheux exposé; accès par sentier/parking limité.",
  },
  {
    name: "La Vesse",
    lat: 43.3452,
    lon: 5.2708,
    area: "Côte Bleue",
    fish: ["loup", "sar", "roche"],
    note: "Calanque de la Côte Bleue, roches et cassures proches.",
    caution: "Vérifier réglementation Parc Marin de la Côte Bleue.",
  },
  {
    name: "L'Estaque - Corbières",
    lat: 43.3595,
    lon: 5.3125,
    area: "Marseille Nord",
    fish: ["dorade", "loup", "sar", "cephalopodes"],
    note: "Bord accessible entre port, plages et digues.",
    caution: "Attention trafic portuaire et zones interdites.",
  },
  {
    name: "Frioul - Saint-Estève",
    lat: 43.2788,
    lon: 5.3015,
    area: "Marseille / Frioul",
    fish: ["dorade", "sar", "roche", "cephalopodes"],
    note: "Archipel public, roches, herbiers et tombants.",
    caution: "Parc national des Calanques: vérifier ZNP, débarquement et mouillage.",
  },
  {
    name: "Pointe Rouge - Prado",
    lat: 43.2394,
    lon: 5.3685,
    area: "Marseille Sud",
    fish: ["dorade", "loup", "sar", "cephalopodes"],
    note: "Digues, plages urbaines et sorties de ports.",
    caution: "Éviter chenaux, baignade et zones portuaires.",
  },
  {
    name: "Les Goudes - Callelongue",
    lat: 43.2097,
    lon: 5.3492,
    area: "Calanques",
    fish: ["loup", "sar", "roche", "cephalopodes"],
    note: "Roches et caps très connus au sud de Marseille.",
    caution: "Parc national: zones de non-prélèvement et règles spécifiques.",
  },
  {
    name: "Cassis - Port-Miou",
    lat: 43.2018,
    lon: 5.5132,
    area: "Calanques",
    fish: ["dorade", "sar", "roche", "cephalopodes"],
    note: "Entrée de calanque et caps rocheux très fréquentés.",
    caution: "Réglementation forte dans le Parc national; vérifier les ZNP.",
  },
  {
    name: "La Ciotat - Bec de l'Aigle",
    lat: 43.1588,
    lon: 5.6063,
    area: "La Ciotat",
    fish: ["dorade", "sar", "roche", "cephalopodes"],
    note: "Roches, digues et secteurs profonds proches du bord.",
    caution: "Vérifier réserve, baignade et accès avant pêche.",
  },
  {
    name: "Port-Saint-Louis - embouchure",
    lat: 43.3595,
    lon: 4.824,
    area: "Rhône / Camargue",
    fish: ["thon", "dorade", "loup"],
    note: "Secteur d'embouchure réputé pour loups, sparidés et migrateurs.",
    caution: "Courants, chenaux et réglementation locale à vérifier.",
  },
  {
    name: "Beauduc",
    lat: 43.335,
    lon: 4.58,
    area: "Camargue",
    fish: ["thon", "dorade", "loup"],
    note: "Large plage sauvage et secteur connu des pêcheurs du littoral.",
    caution: "Accès, vent, sable et arrêtés locaux à vérifier.",
  },
  {
    name: "Dunkerque - digue du Braek",
    lat: 51.061,
    lon: 2.297,
    area: "Mer du Nord",
    fish: ["maquereau", "loup", "dorade"],
    note: "Grande digue et chenaux portuaires, secteur connu pour les pêches de bord.",
    caution: "Trafic portuaire, accès industriels et arrêtés locaux à vérifier.",
  },
  {
    name: "Cap Gris-Nez",
    lat: 50.874,
    lon: 1.578,
    area: "Côte d'Opale",
    fish: ["maquereau", "loup", "roche"],
    note: "Cap exposé avec forts courants, cassures et passages de poissons.",
    caution: "Courants très puissants et falaises; vérifier météo et marées.",
  },
  {
    name: "Boulogne - digues",
    lat: 50.73,
    lon: 1.58,
    area: "Côte d'Opale",
    fish: ["maquereau", "loup", "dorade"],
    note: "Digues et sortie de port souvent citées pour maquereaux, bars et sparidés.",
    caution: "Respecter chenaux, zones portuaires et pêche autorisée.",
  },
  {
    name: "Dieppe - jetées",
    lat: 49.936,
    lon: 1.086,
    area: "Normandie",
    fish: ["maquereau", "loup", "dorade"],
    note: "Jetées, plage et sortie de port avec courants de Manche.",
    caution: "Attention marées, houle de travers et zones portuaires.",
  },
  {
    name: "Étretat - falaises",
    lat: 49.713,
    lon: 0.19,
    area: "Normandie",
    fish: ["maquereau", "loup", "roche"],
    note: "Roches, galets et veines de courant au pied des falaises.",
    caution: "Falaises instables, accès marée basse et réglementation locale.",
  },
  {
    name: "Fécamp - digues",
    lat: 49.77,
    lon: 0.361,
    area: "Normandie",
    fish: ["maquereau", "loup", "dorade"],
    note: "Digue, plage de galets et entrée de port fréquentées par les pêcheurs.",
    caution: "Vérifier accès digue, marée et zones de sécurité.",
  },
  {
    name: "Le Havre - digue nord",
    lat: 49.5,
    lon: 0.074,
    area: "Baie de Seine",
    fish: ["maquereau", "loup", "dorade"],
    note: "Grand secteur de digues et d'estuaire, intéressant sur changement de marée.",
    caution: "Navigation commerciale dense et restrictions portuaires.",
  },
  {
    name: "Ouistreham - Sword",
    lat: 49.296,
    lon: -0.255,
    area: "Calvados",
    fish: ["maquereau", "loup", "dorade"],
    note: "Plages et digues de l'estuaire de l'Orne, bons passages selon marée.",
    caution: "Chenal, baignade et parcs conchylicoles à éviter.",
  },
  {
    name: "Arromanches",
    lat: 49.35,
    lon: -0.648,
    area: "Calvados",
    fish: ["maquereau", "loup", "roche"],
    note: "Zone de hauts-fonds et vestiges au large, tenue de poissons fourrage.",
    caution: "Épaves, mouillages, houle et restrictions locales à vérifier.",
  },
  {
    name: "Cherbourg - grande rade",
    lat: 49.671,
    lon: -1.632,
    area: "Cotentin",
    fish: ["maquereau", "loup", "dorade"],
    note: "Grande rade et digues avec alternance d'abris et de courant.",
    caution: "Zones militaires, portuaires et navigation à respecter.",
  },
  {
    name: "Barfleur - pointe",
    lat: 49.681,
    lon: -1.262,
    area: "Cotentin",
    fish: ["maquereau", "loup", "roche"],
    note: "Pointe rocheuse et courant marqué, spot classique du nord Cotentin.",
    caution: "Courants forts du Raz de Barfleur; fenêtre météo indispensable.",
  },
  {
    name: "Granville - Chausey",
    lat: 48.84,
    lon: -1.615,
    area: "Baie du Mont-Saint-Michel",
    fish: ["maquereau", "loup", "dorade", "cephalopodes"],
    note: "Archipel, plateaux rocheux et grands marnages très productifs.",
    caution: "Marnage extrême, parcs, réserves et navigation à préparer.",
  },
  {
    name: "Cancale - pointe du Grouin",
    lat: 48.712,
    lon: -1.86,
    area: "Ille-et-Vilaine",
    fish: ["maquereau", "loup", "dorade", "roche"],
    note: "Pointe exposée, roches et bordures de courants à l'entrée de baie.",
    caution: "Courants, parcs ostréicoles et accès réglementés.",
  },
  {
    name: "Saint-Malo - Cézembre",
    lat: 48.675,
    lon: -2.075,
    area: "Côte d'Émeraude",
    fish: ["maquereau", "loup", "dorade", "roche"],
    note: "Îlots, roches et veines de courant autour de Saint-Malo.",
    caution: "Fort marnage, zones interdites et navigation dense.",
  },
  {
    name: "Cap Fréhel - Erquy",
    lat: 48.65,
    lon: -2.35,
    area: "Côtes-d'Armor",
    fish: ["maquereau", "loup", "roche"],
    note: "Caps rocheux et tombants réputés pour bars et poissons de roche.",
    caution: "Falaises, houle et courants; rester hors zones protégées.",
  },
  {
    name: "Bréhat - Paimpol",
    lat: 48.855,
    lon: -3.0,
    area: "Côtes-d'Armor",
    fish: ["maquereau", "loup", "roche", "cephalopodes"],
    note: "Roches, passes et bordures de l'archipel de Bréhat.",
    caution: "Cailloux nombreux, courant et marée à anticiper.",
  },
  {
    name: "Perros-Guirec - Sept-Îles",
    lat: 48.905,
    lon: -3.49,
    area: "Côte de Granit Rose",
    fish: ["maquereau", "loup", "roche"],
    note: "Archipel, têtes de roches et plateaux riches en nourriture.",
    caution: "Réserve naturelle, oiseaux et zones interdites à respecter.",
  },
  {
    name: "Roscoff - Île de Batz",
    lat: 48.755,
    lon: -4.02,
    area: "Nord Finistère",
    fish: ["maquereau", "loup", "roche"],
    note: "Passes, algues et courants entre Roscoff et Batz.",
    caution: "Marnage, chenaux et parcs à vérifier avant sortie.",
  },
  {
    name: "Aber Wrac'h",
    lat: 48.625,
    lon: -4.6,
    area: "Nord Finistère",
    fish: ["loup", "dorade", "maquereau", "cephalopodes"],
    note: "Entrée d'aber, roches et courants avec alternance sable/herbiers.",
    caution: "Courant de jusant et navigation locale.",
  },
  {
    name: "Brest - goulet",
    lat: 48.338,
    lon: -4.608,
    area: "Rade de Brest",
    fish: ["maquereau", "loup", "dorade", "cephalopodes"],
    note: "Goulet, forts courants et cassures à l'entrée de la rade.",
    caution: "Zones militaires, chenaux et courant très forts.",
  },
  {
    name: "Pointe Saint-Mathieu",
    lat: 48.325,
    lon: -4.79,
    area: "Iroise",
    fish: ["maquereau", "loup", "roche"],
    note: "Pointe exposée de l'Iroise, poissons de courant et de roche.",
    caution: "Mer vite dure; vérifier houle, vent contre courant et zones protégées.",
  },
  {
    name: "Camaret - Pen-Hir",
    lat: 48.268,
    lon: -4.635,
    area: "Presqu'île de Crozon",
    fish: ["maquereau", "loup", "roche"],
    note: "Falaises, pointes et roches de la presqu'île de Crozon.",
    caution: "Accès escarpés, houle d'ouest et Parc naturel marin d'Iroise.",
  },
  {
    name: "Douarnenez - Cap de la Chèvre",
    lat: 48.19,
    lon: -4.525,
    area: "Baie de Douarnenez",
    fish: ["maquereau", "loup", "roche"],
    note: "Pointe rocheuse à l'entrée de baie, intéressante par courant établi.",
    caution: "Houle longue et accès falaises; prudence du bord.",
  },
  {
    name: "Pointe du Raz",
    lat: 48.035,
    lon: -4.75,
    area: "Cap Sizun",
    fish: ["maquereau", "loup", "roche"],
    note: "Secteur emblématique de forts courants et de chasses.",
    caution: "Raz dangereux, mer hachée et réglementation à vérifier.",
  },
  {
    name: "Penmarc'h - Eckmühl",
    lat: 47.79,
    lon: -4.41,
    area: "Pays Bigouden",
    fish: ["maquereau", "loup", "dorade", "roche"],
    note: "Plateaux rocheux, phares et bordures sable/roche du sud Finistère.",
    caution: "Roches découvrantes, houle et marnage.",
  },
  {
    name: "Concarneau - Glénan",
    lat: 47.69,
    lon: -4.0,
    area: "Sud Finistère",
    fish: ["maquereau", "loup", "dorade", "roche"],
    note: "Archipel, eaux claires et plateaux connus pour bars, dorades et maquereaux.",
    caution: "Réserves, mouillages et navigation estivale.",
  },
  {
    name: "Doëlan - Le Pouldu",
    lat: 47.76,
    lon: -3.56,
    area: "Finistère sud",
    fish: ["loup", "dorade", "roche", "cephalopodes"],
    note: "Côte rocheuse, petites embouchures et anses sableuses.",
    caution: "Respecter accès privés, baignade et zones conchylicoles.",
  },
  {
    name: "Groix - les Coureaux",
    lat: 47.64,
    lon: -3.48,
    area: "Lorient",
    fish: ["maquereau", "loup", "dorade", "roche"],
    note: "Courants entre Groix et Lorient, bordures de roches et sable.",
    caution: "Trafic, courant et zones de réserve autour de l'île.",
  },
  {
    name: "Quiberon - Côte Sauvage",
    lat: 47.478,
    lon: -3.165,
    area: "Morbihan",
    fish: ["maquereau", "loup", "dorade", "roche"],
    note: "Côte exposée, roches et baïnes, spot très connu pour bars.",
    caution: "Houle et ressac dangereux du bord.",
  },
  {
    name: "Belle-Île - Sauzon",
    lat: 47.39,
    lon: -3.26,
    area: "Morbihan",
    fish: ["maquereau", "loup", "dorade", "roche"],
    note: "Côte sauvage, tombants et pointes autour de Belle-Île.",
    caution: "Falaises, houle d'ouest et réglementation insulaire.",
  },
  {
    name: "Golfe du Morbihan - entrée",
    lat: 47.535,
    lon: -2.915,
    area: "Morbihan",
    fish: ["loup", "dorade", "cephalopodes"],
    note: "Entrée du golfe, forts courants et bordures d'herbiers.",
    caution: "Courants violents, chenaux et zones conchylicoles.",
  },
  {
    name: "La Turballe - Piriac",
    lat: 47.345,
    lon: -2.565,
    area: "Loire-Atlantique",
    fish: ["maquereau", "loup", "dorade"],
    note: "Roches, plages et sortie de port sur le nord Loire-Atlantique.",
    caution: "Navigation de pêche professionnelle et zones de baignade.",
  },
  {
    name: "Saint-Nazaire - estuaire Loire",
    lat: 47.235,
    lon: -2.245,
    area: "Estuaire de la Loire",
    fish: ["loup", "dorade", "maigre"],
    note: "Estuaire, chenal et eaux teintées propices aux bars, dorades et maigres.",
    caution: "Trafic maritime, courant et secteurs interdits.",
  },
  {
    name: "Noirmoutier - Herbaudière",
    lat: 47.03,
    lon: -2.36,
    area: "Vendée",
    fish: ["maquereau", "loup", "dorade", "cephalopodes"],
    note: "Port, roches et plateaux autour du nord de l'île.",
    caution: "Marnage, passages et zones ostréicoles.",
  },
  {
    name: "Île d'Yeu - pointe des Corbeaux",
    lat: 46.7,
    lon: -2.32,
    area: "Vendée",
    fish: ["maquereau", "loup", "dorade", "roche"],
    note: "Pointes rocheuses, tombants et courants autour de l'île.",
    caution: "Houle de large et accès météo dépendant.",
  },
  {
    name: "Les Sables-d'Olonne",
    lat: 46.485,
    lon: -1.805,
    area: "Vendée",
    fish: ["maquereau", "loup", "dorade", "maigre"],
    note: "Plages, digues et sorties de port sur un secteur très pêché.",
    caution: "Baignade, chenaux et houle de plage.",
  },
  {
    name: "La Tranche - Pertuis Breton",
    lat: 46.33,
    lon: -1.515,
    area: "Vendée / Pertuis",
    fish: ["loup", "dorade", "maigre", "cephalopodes"],
    note: "Pertuis, parcs et bordures sableuses favorables aux sparidés et maigres.",
    caution: "Parcs conchylicoles, réserves et navigation à respecter.",
  },
  {
    name: "La Rochelle - Chef de Baie",
    lat: 46.14,
    lon: -1.245,
    area: "Charente-Maritime",
    fish: ["loup", "dorade", "maigre", "cephalopodes"],
    note: "Digue, pertuis et abords de port connus des pêcheurs locaux.",
    caution: "Chenal, port et zones protégées.",
  },
  {
    name: "Île de Ré - Baleines",
    lat: 46.255,
    lon: -1.585,
    area: "Charente-Maritime",
    fish: ["loup", "dorade", "maquereau"],
    note: "Pointe, phares et bordures de plateaux au nord-ouest de Ré.",
    caution: "Courants, roches découvrantes et zones ostréicoles.",
  },
  {
    name: "Île d'Oléron - Chassiron",
    lat: 46.05,
    lon: -1.415,
    area: "Charente-Maritime",
    fish: ["loup", "dorade", "maigre", "cephalopodes"],
    note: "Pointe nord d'Oléron, passes et eaux riches des pertuis.",
    caution: "Courants, parcs et zones interdites.",
  },
  {
    name: "Royan - Cordouan",
    lat: 45.59,
    lon: -1.15,
    area: "Estuaire de la Gironde",
    fish: ["maigre", "loup", "dorade"],
    note: "Estuaire et hauts-fonds près de Cordouan, secteur connu pour le maigre.",
    caution: "Courants de Gironde, bancs de sable et navigation.",
  },
  {
    name: "Arcachon - passes",
    lat: 44.62,
    lon: -1.27,
    area: "Bassin d'Arcachon",
    fish: ["loup", "dorade", "maigre", "cephalopodes"],
    note: "Passes du bassin, courant et bordures de bancs de sable.",
    caution: "Passes dangereuses, bancs mouvants et réglementation du bassin.",
  },
  {
    name: "Cap Ferret - Hortense",
    lat: 44.655,
    lon: -1.26,
    area: "Bassin d'Arcachon",
    fish: ["loup", "dorade", "maigre"],
    note: "Entrée du bassin, plages océanes et bordures de courant.",
    caution: "Baïnes, passes et zones de baignade.",
  },
  {
    name: "Biscarrosse plage",
    lat: 44.435,
    lon: -1.275,
    area: "Landes",
    fish: ["loup", "maigre", "dorade"],
    note: "Plage océanique, baïnes et sorties de courants.",
    caution: "Ressac, baïnes et conditions de surf.",
  },
  {
    name: "Mimizan plage",
    lat: 44.205,
    lon: -1.315,
    area: "Landes",
    fish: ["loup", "maigre", "dorade"],
    note: "Longue plage landaise avec trous, baïnes et passages de prédateurs.",
    caution: "Mer formée, baïnes et accès plage.",
  },
  {
    name: "Capbreton - gouf",
    lat: 43.635,
    lon: -1.46,
    area: "Landes",
    fish: ["thon", "loup", "maigre", "dorade"],
    note: "Gouf de Capbreton, profondeur proche et passages de poissons pélagiques.",
    caution: "Houle, chenal et météo de large à surveiller.",
  },
  {
    name: "Biarritz - Rocher de la Vierge",
    lat: 43.478,
    lon: -1.575,
    area: "Pays basque",
    fish: ["loup", "dorade", "roche", "cephalopodes"],
    note: "Roches, digues et bordures profondes proches du rivage.",
    caution: "Houle, baigneurs et accès réglementés.",
  },
  {
    name: "Saint-Jean-de-Luz - Socoa",
    lat: 43.4,
    lon: -1.69,
    area: "Pays basque",
    fish: ["thon", "loup", "dorade", "roche"],
    note: "Baie, digues et sortie vers les tombants basques.",
    caution: "Chenal, houle et zones portuaires.",
  },
  {
    name: "Hendaye - Txingudi",
    lat: 43.375,
    lon: -1.79,
    area: "Pays basque",
    fish: ["loup", "dorade", "maigre"],
    note: "Baie frontalière, plage et estuaire avec eaux mélangées.",
    caution: "Frontière, chenal, courant et réglementation locale.",
  },
  {
    name: "Cerbère - Cap Rédéris",
    lat: 42.43,
    lon: 3.185,
    area: "Côte Vermeille",
    fish: ["roche", "sar", "dorade", "cephalopodes"],
    note: "Roches et tombants de la Côte Vermeille, très méditerranéen.",
    caution: "Réserves marines et zones réglementées à vérifier.",
  },
  {
    name: "Banyuls - Cap Béar",
    lat: 42.515,
    lon: 3.13,
    area: "Côte Vermeille",
    fish: ["roche", "sar", "dorade"],
    note: "Caps rocheux, eaux claires et tombants proches.",
    caution: "Réserve naturelle marine de Cerbère-Banyuls à respecter.",
  },
  {
    name: "Leucate - falaise",
    lat: 42.905,
    lon: 3.065,
    area: "Aude",
    fish: ["loup", "dorade", "sar"],
    note: "Falaise, plages et entrée de lagune avec coups de mer intéressants.",
    caution: "Tramontane, falaises et zones de baignade.",
  },
  {
    name: "Gruissan - Vieille Nouvelle",
    lat: 43.1,
    lon: 3.12,
    area: "Aude",
    fish: ["loup", "dorade", "thon"],
    note: "Plages, graus et bordures de courant entre étang et mer.",
    caution: "Vent fort, sable, accès et zones naturelles protégées.",
  },
  {
    name: "Sète - digue du large",
    lat: 43.385,
    lon: 3.7,
    area: "Hérault",
    fish: ["dorade", "loup", "sar", "cephalopodes"],
    note: "Digue, port et sortie d'étangs, secteur classique pour dorades et loups.",
    caution: "Accès digue, port et chenal à vérifier.",
  },
  {
    name: "Palavas - Carnon",
    lat: 43.515,
    lon: 3.955,
    area: "Hérault",
    fish: ["loup", "dorade", "cephalopodes"],
    note: "Plages, épis et sorties d'étangs autour de Montpellier.",
    caution: "Baignade, grau et réglementation locale.",
  },
  {
    name: "Grau-du-Roi - Espiguette",
    lat: 43.5,
    lon: 4.155,
    area: "Camargue gardoise",
    fish: ["loup", "dorade", "thon"],
    note: "Grande plage, pointe sableuse et courants de Camargue.",
    caution: "Vent, courant, baignade et zones naturelles.",
  },
  {
    name: "Hyères - presqu'île de Giens",
    lat: 43.03,
    lon: 6.135,
    area: "Var",
    fish: ["dorade", "sar", "roche", "cephalopodes"],
    note: "Caps, herbiers et bordures rocheuses face aux îles d'Hyères.",
    caution: "Parc national de Port-Cros, posidonies et mouillages réglementés.",
  },
  {
    name: "Porquerolles - tombants",
    lat: 42.99,
    lon: 6.21,
    area: "Îles d'Hyères",
    fish: ["thon", "dorade", "sar", "roche"],
    note: "Tombants et plateaux autour de Porquerolles.",
    caution: "Parc national, zones interdites et mouillage écologique.",
  },
  {
    name: "Saint-Raphaël - Dramont",
    lat: 43.415,
    lon: 6.86,
    area: "Esterel",
    fish: ["dorade", "sar", "roche", "cephalopodes"],
    note: "Roches rouges, caps et fonds mixtes de l'Esterel.",
    caution: "Baignade, réserve locale et accès rocheux.",
  },
  {
    name: "Cannes - Îles de Lérins",
    lat: 43.52,
    lon: 7.045,
    area: "Alpes-Maritimes",
    fish: ["dorade", "sar", "roche", "cephalopodes"],
    note: "Îles, herbiers et bordures de chenaux face à Cannes.",
    caution: "Navigation dense, mouillages et zones protégées.",
  },
  {
    name: "Nice - Cap de Nice",
    lat: 43.682,
    lon: 7.3,
    area: "Alpes-Maritimes",
    fish: ["thon", "dorade", "sar", "roche"],
    note: "Cap, tombants et profondeur rapide près de Nice.",
    caution: "Trafic côtier, baignade et accès rocheux.",
  },
  {
    name: "Menton - Cap Martin",
    lat: 43.76,
    lon: 7.5,
    area: "Riviera",
    fish: ["dorade", "sar", "roche", "cephalopodes"],
    note: "Caps rocheux et fonds mixtes près de la frontière italienne.",
    caution: "Zones de baignade, frontières et arrêtés locaux.",
  },
  {
    name: "Calvi - Revellata",
    lat: 42.572,
    lon: 8.705,
    area: "Corse",
    fish: ["thon", "dorade", "sar", "roche"],
    note: "Pointe, tombants et eaux claires du nord-ouest corse.",
    caution: "Réserves, vents thermiques et accès rocheux.",
  },
  {
    name: "Saint-Florent - Agriates",
    lat: 42.71,
    lon: 9.215,
    area: "Corse",
    fish: ["dorade", "sar", "roche"],
    note: "Golfe, pointes rocheuses et herbiers des Agriates.",
    caution: "Zones naturelles, mouillages et accès météo.",
  },
  {
    name: "Cap Corse - Macinaggio",
    lat: 42.975,
    lon: 9.455,
    area: "Corse",
    fish: ["thon", "dorade", "sar", "roche"],
    note: "Cap exposé, courant et profondeur rapide.",
    caution: "Vent, mer croisée et zones protégées du Cap Corse.",
  },
  {
    name: "Bastia - Arinella",
    lat: 42.69,
    lon: 9.47,
    area: "Corse",
    fish: ["dorade", "loup", "cephalopodes"],
    note: "Plages, port et fonds sable/herbiers sur la côte est.",
    caution: "Baignade, port et réglementation locale.",
  },
  {
    name: "Solenzara",
    lat: 41.85,
    lon: 9.425,
    area: "Corse",
    fish: ["dorade", "loup", "sar"],
    note: "Embouchure, plages et roches du littoral oriental.",
    caution: "Crues, baignade et zones portuaires.",
  },
  {
    name: "Porto-Vecchio - Palombaggia",
    lat: 41.555,
    lon: 9.33,
    area: "Corse",
    fish: ["dorade", "sar", "roche"],
    note: "Baies, herbiers et roches autour de Porto-Vecchio.",
    caution: "Réserves, mouillages, baignade et forte fréquentation.",
  },
  {
    name: "Bonifacio - Lavezzi",
    lat: 41.34,
    lon: 9.23,
    area: "Corse",
    fish: ["thon", "dorade", "sar", "roche"],
    note: "Bouches de Bonifacio, îlots et tombants très riches.",
    caution: "Réserve naturelle, vents forts et réglementation stricte.",
  },
  {
    name: "Propriano - Campomoro",
    lat: 41.625,
    lon: 8.81,
    area: "Corse",
    fish: ["dorade", "sar", "roche"],
    note: "Golfe, caps rocheux et fonds mixtes du sud-ouest.",
    caution: "Zones de mouillage, baignade et houle d'ouest.",
  },
  {
    name: "Ajaccio - Sanguinaires",
    lat: 41.89,
    lon: 8.615,
    area: "Corse",
    fish: ["thon", "dorade", "sar", "roche"],
    note: "Îles Sanguinaires, tombants et courant à l'entrée du golfe.",
    caution: "Réserves, navigation touristique et vents d'ouest.",
  },
  {
    name: "Porto - Scandola",
    lat: 42.3,
    lon: 8.61,
    area: "Corse",
    fish: ["thon", "dorade", "sar", "roche"],
    note: "Falaises, tombants et secteurs profonds du golfe de Porto.",
    caution: "Réserve de Scandola et zones de non-prélèvement à respecter.",
  },
];

const freshwaterFishingSpots = [
  {
    name: "Lac du Bourget - tombants nord",
    lat: 45.785,
    lon: 5.864,
    area: "Savoie",
    fish: ["brochet", "perche", "sandre"],
    note: "Cassures, herbiers et zones profondes, intéressant aux changements de lumière.",
    caution: "Vérifier réglementation lacustre, réserves et navigation.",
  },
  {
    name: "Lac d'Annecy - herbiers ouest",
    lat: 45.859,
    lon: 6.139,
    area: "Haute-Savoie",
    fish: ["brochet", "perche", "truite"],
    note: "Herbiers, bordures et tombants clairs; approche discrète recommandée.",
    caution: "Eau très claire et secteurs réglementés selon saison.",
  },
  {
    name: "Lac Léman - cassures de Thonon",
    lat: 46.398,
    lon: 6.503,
    area: "Léman",
    fish: ["brochet", "perche", "truite"],
    note: "Grand lac, cassures et bordures profondes autour des ports et plages.",
    caution: "Surveiller vent thermique, zones de baignade et règles franco-suisses.",
  },
  {
    name: "Serre-Ponçon - baies et pointes",
    lat: 44.493,
    lon: 6.368,
    area: "Alpes du Sud",
    fish: ["brochet", "perche", "sandre", "truite"],
    note: "Pointes, arrivées d'eau et baies productives selon niveau du lac.",
    caution: "Niveau variable et berges glissantes.",
  },
  {
    name: "Sainte-Croix - cassures du Verdon",
    lat: 43.791,
    lon: 6.192,
    area: "Verdon",
    fish: ["brochet", "perche", "blackBass", "carpe"],
    note: "Eau claire, bordures rocheuses et plateaux propices aux carnassiers.",
    caution: "Forte fréquentation estivale et zones de navigation.",
  },
  {
    name: "Lac de Biscarrosse - herbiers",
    lat: 44.46,
    lon: -1.19,
    area: "Landes",
    fish: ["brochet", "perche", "sandre", "blackBass"],
    note: "Herbiers, hauts-fonds et anses abritées pour pêche lente ou leurres.",
    caution: "Respecter réserves, mises à l'eau et météo locale.",
  },
  {
    name: "Lac du Der - queues de lac",
    lat: 48.578,
    lon: 4.747,
    area: "Grand Est",
    fish: ["brochet", "sandre", "perche", "carpe"],
    note: "Grand lac de plaine, bordures peu profondes et cassures selon niveau.",
    caution: "Réserves ornithologiques et réglementation spécifique.",
  },
  {
    name: "Seine - amortis de confluence",
    lat: 48.842,
    lon: 2.238,
    area: "Île-de-France",
    fish: ["sandre", "perche", "silure"],
    note: "Amortis, piles et bordures urbaines à travailler selon débit.",
    caution: "Sécurité des berges, navigation et arrêtés locaux.",
  },
  {
    name: "Loire - veines et bras morts",
    lat: 47.902,
    lon: 1.904,
    area: "Val de Loire",
    fish: ["sandre", "silure", "brochet"],
    note: "Veines de courant, fosses et bras morts intéressants après stabilisation.",
    caution: "Débit changeant, bancs de sable et accès à vérifier.",
  },
  {
    name: "Canal du Midi - bordures lentes",
    lat: 43.604,
    lon: 1.43,
    area: "Occitanie",
    fish: ["blackBass", "perche", "carpe", "brochet"],
    note: "Bordures, arbres noyés et zones lentes à pêcher finement.",
    caution: "Respecter navigation, écluses et propriétés riveraines.",
  },
];

const fishCatalogs = {
  [WATER_MODES.SEA]: [
    { id: "all", label: "Tous" },
    { id: "thon", label: "Thon" },
    { id: "dorade", label: "Dorade" },
    { id: "loup", label: "Bar/Loup" },
    { id: "sar", label: "Sars" },
    { id: "roche", label: "Roche" },
    { id: "maquereau", label: "Maquereau" },
    { id: "maigre", label: "Maigre" },
    { id: "cephalopodes", label: "Seiche" },
  ],
  [WATER_MODES.FRESHWATER]: [
    { id: "all", label: "Tous" },
    { id: "brochet", label: "Brochet" },
    { id: "sandre", label: "Sandre" },
    { id: "perche", label: "Perche" },
    { id: "blackBass", label: "Black-bass" },
    { id: "carpe", label: "Carpe" },
    { id: "silure", label: "Silure" },
    { id: "truite", label: "Truite" },
  ],
};

const fishActivityProfiles = {
  thon: {
    label: "Thon",
    current: [0.35, 1.15, 1.9],
    wave: [0.25, 0.9, 1.8],
    temp: [18, 22, 26],
    light: "day",
    currentWeight: 0.28,
  },
  dorade: {
    label: "Dorade",
    current: [0.12, 0.45, 0.9],
    wave: [0.05, 0.35, 0.9],
    temp: [16, 20, 25],
    light: "dayEdge",
    currentWeight: 0.24,
  },
  loup: {
    label: "Bar/Loup",
    current: [0.25, 0.85, 1.45],
    wave: [0.25, 0.8, 1.6],
    temp: [11, 16, 21],
    light: "lowLight",
    currentWeight: 0.28,
  },
  sar: {
    label: "Sars",
    current: [0.12, 0.55, 1.1],
    wave: [0.2, 0.7, 1.4],
    temp: [15, 20, 25],
    light: "dayEdge",
    currentWeight: 0.22,
  },
  roche: {
    label: "Poissons de roche",
    current: [0.08, 0.45, 1.0],
    wave: [0.15, 0.65, 1.35],
    temp: [13, 18, 24],
    light: "dayEdge",
    currentWeight: 0.2,
  },
  maquereau: {
    label: "Maquereau",
    current: [0.22, 0.75, 1.45],
    wave: [0.15, 0.7, 1.5],
    temp: [11, 15, 19],
    light: "day",
    currentWeight: 0.25,
  },
  maigre: {
    label: "Maigre",
    current: [0.35, 0.95, 1.55],
    wave: [0.1, 0.55, 1.15],
    temp: [17, 21, 25],
    light: "nightEdge",
    currentWeight: 0.29,
  },
  cephalopodes: {
    label: "Seiche",
    current: [0, 0.25, 0.65],
    wave: [0, 0.25, 0.7],
    temp: [11, 16, 21],
    light: "night",
    currentWeight: 0.18,
  },
  brochet: {
    label: "Brochet",
    current: [0, 0.2, 0.7],
    wave: [0, 0.2, 0.8],
    temp: [8, 14, 20],
    light: "lowLight",
    currentWeight: 0.12,
  },
  sandre: {
    label: "Sandre",
    current: [0, 0.15, 0.55],
    wave: [0, 0.18, 0.65],
    temp: [10, 16, 22],
    light: "nightEdge",
    currentWeight: 0.14,
  },
  perche: {
    label: "Perche",
    current: [0, 0.2, 0.6],
    wave: [0, 0.18, 0.7],
    temp: [10, 18, 24],
    light: "dayEdge",
    currentWeight: 0.1,
  },
  blackBass: {
    label: "Black-bass",
    current: [0, 0.15, 0.5],
    wave: [0, 0.12, 0.55],
    temp: [16, 22, 28],
    light: "day",
    currentWeight: 0.1,
  },
  carpe: {
    label: "Carpe",
    current: [0, 0.1, 0.45],
    wave: [0, 0.12, 0.55],
    temp: [14, 22, 29],
    light: "dayEdge",
    currentWeight: 0.08,
  },
  silure: {
    label: "Silure",
    current: [0, 0.2, 0.7],
    wave: [0, 0.16, 0.65],
    temp: [18, 24, 30],
    light: "night",
    currentWeight: 0.13,
  },
  truite: {
    label: "Truite",
    current: [0.05, 0.35, 0.9],
    wave: [0, 0.18, 0.65],
    temp: [6, 12, 18],
    light: "dayEdge",
    currentWeight: 0.18,
  },
};

const riggingProfiles = {
  [WATER_MODES.SEA]: [
    { id: "shore", label: "Bord / pêche calée", base: 30, depth: 0.7, current: 58, wind: 1.25 },
    { id: "drift", label: "Bateau / dérive", base: 20, depth: 1.15, current: 76, wind: 0.85 },
    { id: "vertical", label: "Verticale profonde", base: 30, depth: 1.55, current: 92, wind: 0.55 },
  ],
  [WATER_MODES.FRESHWATER]: [
    { id: "river", label: "Rivière / plombée", base: 10, depth: 0.8, current: 44, wind: 0.25 },
    { id: "lake", label: "Lac / posé", base: 14, depth: 0.9, current: 22, wind: 0.55 },
    { id: "carp", label: "Carpe / tenue", base: 42, depth: 0.35, current: 30, wind: 0.5 },
  ],
};

const bathymetryContours = [
  {
    region: "Méditerranée - Côte Bleue",
    depth: 20,
    label: [43.276, 5.06],
    coordinates: [[43.30, 4.98], [43.28, 5.05], [43.24, 5.16], [43.20, 5.28], [43.16, 5.42]],
  },
  {
    region: "Méditerranée - Côte Bleue",
    depth: 50,
    label: [43.19, 5.1],
    coordinates: [[43.20, 4.88], [43.16, 5.02], [43.10, 5.18], [43.04, 5.36], [42.98, 5.55]],
  },
  {
    region: "Méditerranée - Provence",
    depth: 100,
    label: [42.98, 5.28],
    coordinates: [[43.02, 4.75], [42.95, 4.95], [42.86, 5.20], [42.78, 5.48], [42.70, 5.78]],
  },
  {
    region: "Méditerranée - Provence",
    depth: 200,
    label: [42.62, 5.5],
    coordinates: [[42.70, 4.55], [42.58, 4.9], [42.45, 5.28], [42.33, 5.72], [42.20, 6.08]],
  },
  {
    region: "Golfe du Lion",
    depth: 20,
    label: [43.17, 3.55],
    coordinates: [[43.33, 2.95], [43.26, 3.35], [43.16, 3.78], [43.05, 4.18], [42.92, 4.55]],
  },
  {
    region: "Golfe du Lion",
    depth: 50,
    label: [42.85, 3.55],
    coordinates: [[42.95, 2.72], [42.82, 3.20], [42.70, 3.75], [42.58, 4.25], [42.45, 4.75]],
  },
  {
    region: "Golfe du Lion",
    depth: 100,
    label: [42.36, 3.65],
    coordinates: [[42.55, 2.45], [42.35, 3.05], [42.20, 3.70], [42.05, 4.35], [41.88, 4.92]],
  },
  {
    region: "Golfe du Lion",
    depth: 1000,
    label: [41.65, 4.5],
    coordinates: [[41.95, 2.35], [41.70, 3.05], [41.48, 3.85], [41.32, 4.60], [41.18, 5.35]],
  },
  {
    region: "Corse Ouest",
    depth: 100,
    label: [42.18, 8.48],
    coordinates: [[43.05, 8.30], [42.65, 8.22], [42.20, 8.18], [41.75, 8.35], [41.38, 8.62]],
  },
  {
    region: "Corse Ouest",
    depth: 500,
    label: [41.95, 8.05],
    coordinates: [[43.10, 7.95], [42.55, 7.82], [41.95, 7.78], [41.35, 8.00], [40.92, 8.35]],
  },
  {
    region: "Atlantique - Bretagne",
    depth: 20,
    label: [47.55, -3.25],
    coordinates: [[48.25, -4.55], [47.92, -4.22], [47.55, -3.78], [47.20, -3.25], [46.92, -2.55]],
  },
  {
    region: "Atlantique - Bretagne",
    depth: 50,
    label: [47.22, -4.18],
    coordinates: [[48.10, -5.20], [47.72, -4.85], [47.25, -4.35], [46.88, -3.70], [46.55, -2.85]],
  },
  {
    region: "Atlantique - Gascogne",
    depth: 100,
    label: [45.65, -3.0],
    coordinates: [[46.70, -4.50], [46.05, -4.05], [45.35, -3.60], [44.65, -3.25], [43.88, -2.75]],
  },
  {
    region: "Atlantique - Talus continental",
    depth: 200,
    label: [45.25, -4.55],
    coordinates: [[47.25, -6.05], [46.35, -5.55], [45.35, -4.85], [44.20, -4.05], [43.30, -3.30]],
  },
  {
    region: "Atlantique - Talus continental",
    depth: 1000,
    label: [44.65, -6.2],
    coordinates: [[47.00, -7.50], [45.90, -6.95], [44.70, -6.20], [43.55, -5.25], [42.80, -4.30]],
  },
  {
    region: "Manche",
    depth: 20,
    label: [49.42, -1.25],
    coordinates: [[48.82, -4.10], [49.08, -3.20], [49.32, -2.20], [49.52, -1.05], [49.72, 0.20]],
  },
  {
    region: "Manche",
    depth: 50,
    label: [49.92, -2.25],
    coordinates: [[49.35, -4.80], [49.58, -3.62], [49.82, -2.35], [50.08, -1.10], [50.22, 0.20]],
  },
];

const state = {
  waterMode: WATER_MODES.SEA,
  activeChart: "wind",
  activeMobileView: "map",
  days: [],
  hours: [],
  selectedDate: "",
  selectedSpotName: spots[0].name,
  depth: 15,
  realDepthAvailable: false,
  favorites: [],
  mapZoom: MAP_BASE_ZOOM,
  mapCenter: null,
  mapTileKey: "",
  mapDrag: null,
  mapPinch: null,
  mapPointers: new Map(),
  mapLayerOpen: false,
  mapFullscreen: false,
  spotPanelOpen: false,
  mapClickStart: null,
  suppressNextMapClick: false,
  mapTilePruneTimer: null,
  leafletMap: null,
  leafletMarkers: null,
  nauticalLayer: null,
  nauticalEnabled: true,
  bathymetryLayer: null,
  bathymetryEnabled: true,
  knownFishingLayer: null,
  knownFishingEnabled: true,
  regulationLayer: null,
  regulationEnabled: true,
  marineOverlayLayer: null,
  marineOverlayMode: "none",
  marineOverlayCache: new Map(),
  marineOverlayData: [],
  marineOverlayKey: "",
  marineOverlayRequestId: 0,
  marineOverlayTimer: null,
  marineOverlayLoading: false,
  anchorLayer: null,
  anchorWatch: {
    active: false,
    watchId: null,
    anchor: null,
    position: null,
    drift: null,
    status: "idle",
    message: "",
    alerted: false,
  },
  activeFishFilters: new Set(["all"]),
  fishFilterOpen: false,
  activityFish: "loup",
  forecastExpanded: false,
  riggingDirty: false,
  renamingFavoriteId: null,
  pendingSpot: null,
};

const els = {
  modeButtons: [...document.querySelectorAll("[data-water-mode]")],
  mobileTabButtons: [...document.querySelectorAll("[data-mobile-tab]")],
  mobileViewSections: [...document.querySelectorAll("[data-mobile-view]")],
  spotControls: document.querySelector("#spotControls"),
  spotPanelButton: document.querySelector("#spotPanelButton"),
  spotPanelClose: document.querySelector("#spotPanelClose"),
  spotSummaryName: document.querySelector("#spotSummaryName"),
  spotSummaryCoords: document.querySelector("#spotSummaryCoords"),
  spotPreset: document.querySelector("#spotPreset"),
  latitude: document.querySelector("#latitude"),
  longitude: document.querySelector("#longitude"),
  spotForm: document.querySelector("#spotForm"),
  locateBtn: document.querySelector("#locateBtn"),
  depth: document.querySelector("#depth"),
  depthOutput: document.querySelector("#depthOutput"),
  dayTabs: document.querySelector("#dayTabs"),
  activityFish: document.querySelector("#activityFish"),
  activityRing: document.querySelector("#activityRing"),
  activityScore: document.querySelector("#activityScore"),
  activityLabel: document.querySelector("#activityLabel"),
  activityContext: document.querySelector("#activityContext"),
  activityReasons: document.querySelector("#activityReasons"),
  activityCanvas: document.querySelector("#activityCanvas"),
  activityMajor: document.querySelector("#activityMajor"),
  activityMinor: document.querySelector("#activityMinor"),
  catchForm: document.querySelector("#catchForm"),
  catchSpecies: document.querySelector("#catchSpecies"),
  catchLength: document.querySelector("#catchLength"),
  catchWeight: document.querySelector("#catchWeight"),
  catchNotes: document.querySelector("#catchNotes"),
  catchLogList: document.querySelector("#catchLogList"),
  conditionBrief: document.querySelector("#conditionBrief"),
  conditionDecision: document.querySelector("#conditionDecision"),
  conditionReason: document.querySelector("#conditionReason"),
  conditionScore: document.querySelector("#conditionScore"),
  conditionFacts: document.querySelector("#conditionFacts"),
  metricGrid: document.querySelector("#metricGrid"),
  metricTemplate: document.querySelector("#metricTemplate"),
  waterInsights: document.querySelector("#waterInsights"),
  compassCanvas: document.querySelector("#compassCanvas"),
  chartCanvas: document.querySelector("#chartCanvas"),
  chartLegend: document.querySelector("#chartLegend"),
  chartTitle: document.querySelector("#chartTitle"),
  bestWindow: document.querySelector("#bestWindow"),
  statusPill: document.querySelector("#statusPill"),
  spotMeta: document.querySelector("#spotMeta"),
  mapTitle: document.querySelector("#mapTitle"),
  mapPanel: document.querySelector("#mapPanel"),
  spotMap: document.querySelector("#spotMap"),
  mapTiles: document.querySelector("#mapTiles"),
  mapMarkers: document.querySelector("#mapMarkers"),
  favoriteBtn: document.querySelector("#favoriteBtn"),
  favoritesList: document.querySelector("#favoritesList"),
  spotDock: document.querySelector("#spotDock"),
  activeSpotName: document.querySelector("#activeSpotName"),
  activeSpotCoords: document.querySelector("#activeSpotCoords"),
  mapZoomIn: document.querySelector("#mapZoomIn"),
  mapZoomOut: document.querySelector("#mapZoomOut"),
  mapFullscreenButton: document.querySelector("#mapFullscreenButton"),
  mapLayersButton: document.querySelector("#mapLayersButton"),
  mapLayerSheet: document.querySelector("#mapLayerSheet"),
  mapLayerClose: document.querySelector("#mapLayerClose"),
  mapLayerBackdrop: document.querySelector("#mapLayerBackdrop"),
  mapNauticalToggle: document.querySelector("#mapNauticalToggle"),
  mapBathymetryToggle: document.querySelector("#mapBathymetryToggle"),
  mapFishingToggle: document.querySelector("#mapFishingToggle"),
  mapRegulationToggle: document.querySelector("#mapRegulationToggle"),
  anchorWatchBtn: document.querySelector("#anchorWatchBtn"),
  mapScale: document.querySelector("#mapScale"),
  mapAttribution: document.querySelector("#mapAttribution"),
  safetyBanner: document.querySelector("#safetyBanner"),
  safetyTitle: document.querySelector("#safetyTitle"),
  safetyDetail: document.querySelector("#safetyDetail"),
  fishFilterControl: document.querySelector("#fishFilterControl"),
  fishFilterButton: document.querySelector("#fishFilterButton"),
  fishFilterLabel: document.querySelector("#fishFilterLabel"),
  fishFilterPanel: document.querySelector("#fishFilterPanel"),
  marineOverlayControl: document.querySelector("#marineOverlayControl"),
  marineOverlayButtons: [...document.querySelectorAll("[data-marine-overlay]")],
  spotNameSheet: document.querySelector("#spotNameSheet"),
  spotNameCoords: document.querySelector("#spotNameCoords"),
  spotNameInput: document.querySelector("#spotNameInput"),
  spotNameClose: document.querySelector("#spotNameClose"),
  spotNameCancel: document.querySelector("#spotNameCancel"),
  spotNameFavorite: document.querySelector("#spotNameFavorite"),
  riggingForm: document.querySelector("#riggingForm"),
  riggingTechnique: document.querySelector("#riggingTechnique"),
  riggingDepth: document.querySelector("#riggingDepth"),
  riggingCurrent: document.querySelector("#riggingCurrent"),
  riggingWind: document.querySelector("#riggingWind"),
  riggingAutoFill: document.querySelector("#riggingAutoFill"),
  riggingWeight: document.querySelector("#riggingWeight"),
  riggingRange: document.querySelector("#riggingRange"),
  riggingAdvice: document.querySelector("#riggingAdvice"),
};

const colors = {
  wind: "#b97322",
  gust: "#c85c45",
  wave: "#2f74c0",
  swell: "#7357b8",
  current: "#087d72",
  depth: "#17201d",
  pressure: "#59656f",
  rain: "#2f74c0",
  cloud: "#7357b8",
  temperature: "#c85c45",
};

function init() {
  populateSpots();
  restoreState();
  state.favorites = readFavorites();
  populateActivityFish();
  populateCatchSpecies();
  populateRiggingTechniques();
  initMapEngine();
  bindEvents();
  updateDepth();
  applyWaterModeUI();
  applyMobileNavigationUI();
  renderSpotTools();
  loadForecast();
}

function initMapEngine() {
  if (!window.L) return;

  const active = getActiveSpot();
  state.mapCenter = { lat: active.lat, lon: active.lon };
  state.leafletMap = L.map(els.spotMap, {
    zoomControl: false,
    attributionControl: false,
    minZoom: MAP_MIN_ZOOM,
    maxZoom: MAP_MAX_ZOOM,
    preferCanvas: true,
    wheelDebounceTime: 50,
  }).setView([active.lat, active.lon], state.mapZoom);

  els.spotMap.classList.add("is-leaflet");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    minZoom: MAP_MIN_ZOOM,
    maxZoom: MAP_MAX_ZOOM,
    keepBuffer: 5,
    updateWhenIdle: false,
    updateWhenZooming: false,
    crossOrigin: true,
  }).addTo(state.leafletMap);

  state.nauticalLayer = L.tileLayer("https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png", {
    minZoom: MAP_MIN_ZOOM,
    maxZoom: MAP_MAX_ZOOM,
    maxNativeZoom: 17,
    keepBuffer: 5,
    updateWhenIdle: false,
    updateWhenZooming: false,
    opacity: 0.92,
    crossOrigin: true,
  });
  updateNauticalOverlay();

  L.DomEvent.disableClickPropagation(els.spotNameSheet);
  L.DomEvent.disableScrollPropagation(els.spotNameSheet);

  state.knownFishingLayer = L.layerGroup();
  updateKnownFishingOverlay();

  state.bathymetryLayer = L.layerGroup();
  renderBathymetryLayer();
  updateBathymetryOverlay();

  state.regulationLayer = L.layerGroup();
  updateRegulationOverlay();

  state.marineOverlayLayer = L.layerGroup().addTo(state.leafletMap);
  state.anchorLayer = L.layerGroup().addTo(state.leafletMap);
  state.leafletMarkers = L.layerGroup().addTo(state.leafletMap);
  state.leafletMap.on("click", selectLeafletMapPoint);
  state.leafletMap.on("moveend zoomend", syncLeafletState);
}

function populateSpots() {
  let currentGroup = null;
  let groupElement = els.spotPreset;

  spots.forEach((spot, index) => {
    if (spot.group && spot.group !== currentGroup) {
      currentGroup = spot.group;
      groupElement = document.createElement("optgroup");
      groupElement.label = spot.group;
      els.spotPreset.append(groupElement);
    }

    if (!spot.group) {
      currentGroup = null;
      groupElement = els.spotPreset;
    }

    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = spot.name;
    groupElement.append(option);
  });
}

function normalizeWaterMode(mode) {
  return Object.prototype.hasOwnProperty.call(waterModeConfig, mode) ? mode : WATER_MODES.SEA;
}

function isSeaMode() {
  return waterModeConfig[state.waterMode]?.showMarine === true;
}

function getFishFilters(mode = state.waterMode) {
  return fishCatalogs[normalizeWaterMode(mode)] ?? fishCatalogs[WATER_MODES.SEA];
}

function getAllFishFilters() {
  return Object.values(fishCatalogs).flat();
}

function getFishLabel(id) {
  return getAllFishFilters().find((filter) => filter.id === id)?.label ?? id;
}

function populateActivityFish() {
  if (!els.activityFish) return;

  els.activityFish.innerHTML = "";
  getFishFilters()
    .filter((filter) => filter.id !== "all")
    .forEach((filter) => {
      const option = document.createElement("option");
      option.value = filter.id;
      option.textContent = filter.label;
      els.activityFish.append(option);
    });

  state.activityFish = normalizeActivityFish(state.activityFish);
  els.activityFish.value = state.activityFish;
}

function populateCatchSpecies() {
  if (!els.catchSpecies) return;

  const previous = els.catchSpecies.value || state.activityFish;
  els.catchSpecies.innerHTML = "";
  getFishFilters()
    .filter((filter) => filter.id !== "all")
    .forEach((filter) => {
      const option = document.createElement("option");
      option.value = filter.id;
      option.textContent = filter.label;
      els.catchSpecies.append(option);
    });

  els.catchSpecies.value = normalizeActivityFish(previous);
}

function populateRiggingTechniques() {
  if (!els.riggingTechnique) return;

  const profiles = riggingProfiles[state.waterMode] ?? riggingProfiles[WATER_MODES.SEA];
  const previous = els.riggingTechnique.value;
  els.riggingTechnique.innerHTML = "";
  profiles.forEach((profile) => {
    const option = document.createElement("option");
    option.value = profile.id;
    option.textContent = profile.label;
    els.riggingTechnique.append(option);
  });
  els.riggingTechnique.value = profiles.some((profile) => profile.id === previous)
    ? previous
    : profiles[0]?.id ?? "";
}

function restoreState() {
  const saved = readSavedSettings();
  state.waterMode = normalizeWaterMode(saved.waterMode);
  state.activeMobileView = normalizeMobileView(saved.mobileView);
  const selectedIndex = resolveSavedSpotIndex(saved);
  const spot = spots[selectedIndex] ?? spots[0];
  const useSavedCoordinates = spot.custom && isValidNumber(saved.lat) && isValidNumber(saved.lon);
  els.spotPreset.value = String(selectedIndex);
  els.latitude.value = useSavedCoordinates ? saved.lat : spot.lat;
  els.longitude.value = useSavedCoordinates ? saved.lon : spot.lon;
  els.depth.value = saved.depth ?? state.depth;
  state.depth = Number(els.depth.value);
  state.selectedSpotName = spot.custom ? saved.customName ?? getCustomSpotName() : spot.name;
  state.nauticalEnabled = saved.nauticalEnabled !== false;
  state.bathymetryEnabled = saved.bathymetryEnabled !== false;
  state.knownFishingEnabled = saved.knownFishingEnabled !== false;
  state.regulationEnabled = saved.regulationEnabled !== false;
  state.marineOverlayMode = normalizeMarineOverlayMode(saved.marineOverlayMode);
  state.activeFishFilters = normalizeFishFilters(saved.fishFilters);
  state.activityFish = normalizeActivityFish(saved.activityFish);
}

function applyWaterModeUI() {
  const config = waterModeConfig[state.waterMode];
  document.documentElement.dataset.currentWaterMode = state.waterMode;

  els.modeButtons.forEach((button) => {
    const active = button.dataset.waterMode === state.waterMode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  if (els.mapTitle) {
    els.mapTitle.textContent = config.mapTitle;
  }

  if (els.marineOverlayControl) {
    els.marineOverlayControl.hidden = !isSeaMode();
  }

  if (els.mapRegulationToggle) {
    els.mapRegulationToggle.hidden = !isSeaMode();
  }

  if (els.mapBathymetryToggle) {
    els.mapBathymetryToggle.hidden = !isSeaMode();
  }

  const marineOnlyControls = [
    els.depth?.closest(".depth-control"),
    els.mapNauticalToggle,
    els.mapBathymetryToggle,
  ].filter(Boolean);
  marineOnlyControls.forEach((element) => {
    element.hidden = !isSeaMode();
  });

  document.querySelectorAll("[data-chart]").forEach((button) => {
    const marineOnly = button.dataset.chart === "wave" || button.dataset.chart === "current";
    button.hidden = marineOnly && !isSeaMode();
    button.disabled = marineOnly && !isSeaMode();
  });

  if (!isSeaMode()) {
    state.marineOverlayMode = "none";
    if (state.activeChart === "wave" || state.activeChart === "current") {
      state.activeChart = "pressure";
    }
  }

  document.querySelectorAll("[data-chart]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.chart === state.activeChart);
  });
  updateNauticalOverlay();
  updateBathymetryOverlay();
  updateRegulationOverlay();
  updateMarineOverlayControls();
  updateMapLayerPanel();
  renderMarineOverlay();
  renderSafetyStatus();
}

function setWaterMode(mode, options = {}) {
  const nextMode = normalizeWaterMode(mode);
  if (nextMode === state.waterMode) return;

  state.waterMode = nextMode;
  state.activeFishFilters = normalizeFishFilters(["all"]);
  state.activityFish = normalizeActivityFish(state.activityFish);
  if (!isSeaMode()) state.activeChart = "pressure";
  state.fishFilterOpen = false;
  populateActivityFish();
  populateCatchSpecies();
  populateRiggingTechniques();
  state.riggingDirty = false;
  applyWaterModeUI();
  renderSpotTools();
  saveSettings();

  if (options.load !== false) {
    loadForecast();
  } else if (state.days.length) {
    renderAll();
  }
}

function normalizeMobileView(view) {
  if (view === "forecast") return "weather";
  return MOBILE_VIEWS.includes(view) ? view : "map";
}

function normalizeMarineOverlayMode(mode) {
  return MARINE_OVERLAY_MODES.includes(mode) ? mode : "none";
}

function isMobileLayout() {
  return window.matchMedia?.("(max-width: 720px)").matches ?? false;
}

function sectionSupportsMobileView(section, view) {
  return String(section.dataset.mobileView ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .includes(view);
}

function applyMobileNavigationUI() {
  const mobile = isMobileLayout();
  document.documentElement.dataset.currentMobileView = state.activeMobileView;

  els.mobileTabButtons.forEach((button) => {
    const active = button.dataset.mobileTab === state.activeMobileView;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });

  els.mobileViewSections.forEach((section) => {
    section.hidden = mobile && !sectionSupportsMobileView(section, state.activeMobileView);
  });

  if (!mobile) {
    els.mobileViewSections.forEach((section) => {
      section.hidden = false;
    });
  }
}

function refreshVisibleView() {
  window.requestAnimationFrame(() => {
    state.leafletMap?.invalidateSize(false);
    updateMapScale();
    drawCompass();
    renderActivity(getSelectedDay());
    renderChart();
  });
}

function setMobileView(view) {
  state.activeMobileView = normalizeMobileView(view);
  applyMobileNavigationUI();
  if (isMobileLayout()) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  refreshVisibleView();
  saveSettings();
}

function setForecastExpanded(open) {
  state.forecastExpanded = Boolean(open);
  renderDayTabs();
}

function setMarineOverlayMode(mode) {
  state.marineOverlayMode = normalizeMarineOverlayMode(mode);
  if (!isSeaMode()) state.marineOverlayMode = "none";
  updateMarineOverlayControls();
  updateMapLayerPanel();
  renderMarineOverlay();
  saveSettings();
}

function updateMarineOverlayControls() {
  els.marineOverlayButtons.forEach((button) => {
    const active = button.dataset.marineOverlay === state.marineOverlayMode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  if (els.marineOverlayControl) {
    els.marineOverlayControl.classList.toggle("is-loading", state.marineOverlayLoading);
  }
}

function setMapLayerOpen(open) {
  state.mapLayerOpen = Boolean(open);
  updateMapLayerPanel();
}

function setMapFullscreen(open) {
  state.mapFullscreen = Boolean(open);
  els.mapPanel?.classList.toggle("is-map-fullscreen", state.mapFullscreen);
  document.body.classList.toggle("is-map-fullscreen-active", state.mapFullscreen);

  if (els.mapFullscreenButton) {
    const label = state.mapFullscreen ? "Quitter le plein écran" : "Carte plein écran";
    els.mapFullscreenButton.classList.toggle("is-active", state.mapFullscreen);
    els.mapFullscreenButton.setAttribute("aria-pressed", String(state.mapFullscreen));
    els.mapFullscreenButton.setAttribute("aria-label", label);
    els.mapFullscreenButton.title = label;
  }

  window.requestAnimationFrame(() => {
    state.leafletMap?.invalidateSize(false);
    updateMapScale();
  });
}

function updateMapLayerPanel() {
  if (els.mapLayersButton) {
    els.mapLayersButton.classList.toggle("is-active", state.mapLayerOpen);
    els.mapLayersButton.setAttribute("aria-expanded", String(state.mapLayerOpen));
  }

  if (els.mapLayerSheet) {
    els.mapLayerSheet.classList.toggle("is-open", state.mapLayerOpen);
    els.mapLayerSheet.setAttribute("aria-hidden", String(!state.mapLayerOpen));
    els.mapLayerSheet.inert = !state.mapLayerOpen;
  }

  if (els.mapLayerBackdrop) {
    els.mapLayerBackdrop.hidden = !state.mapLayerOpen;
  }
}

function setSpotPanelOpen(open) {
  state.spotPanelOpen = Boolean(open);
  updateSpotPanel();
}

function updateSpotPanel() {
  if (els.spotControls) {
    els.spotControls.classList.toggle("is-open", state.spotPanelOpen);
  }

  if (els.spotPanelButton) {
    els.spotPanelButton.setAttribute("aria-expanded", String(state.spotPanelOpen));
    els.spotPanelButton.textContent = state.spotPanelOpen ? "Masquer" : "Modifier";
  }

  if (els.spotForm) {
    els.spotForm.setAttribute("aria-hidden", String(!state.spotPanelOpen));
    els.spotForm.inert = !state.spotPanelOpen;
    els.spotForm.toggleAttribute("inert", !state.spotPanelOpen);
  }
}

function getSelectedPreset() {
  return spots[Number(els.spotPreset.value)] ?? spots[0];
}

function selectSpot(index, options = {}) {
  state.pendingSpot = null;
  const spot = spots[index] ?? spots[0];
  els.spotPreset.value = String(index);
  els.latitude.value = spot.lat;
  els.longitude.value = spot.lon;
  state.selectedSpotName = spot.custom ? getCustomSpotName() : spot.name;
  centerMapOn(spot.lat, spot.lon);
  updateSpotMeta();
  renderSpotTools();
  saveSettings();

  if (options.load) {
    loadForecast();
  }
}

function selectMapPoint(event) {
  const clickStart = state.mapClickStart;
  state.mapClickStart = null;

  if (state.suppressNextMapClick) {
    state.suppressNextMapClick = false;
    return;
  }

  if (event.target.closest(".map-marker, .map-control")) return;

  if (clickStart && Math.hypot(event.clientX - clickStart.x, event.clientY - clickStart.y) > 6) {
    return;
  }

  const point = mapEventPoint(event);
  const coords = mapPointToLatLon(point);
  openSpotNameSheet(coords.lat, coords.lon);
}

function setCustomSpot(lat, lon, options = {}) {
  state.pendingSpot = null;
  const customIndex = spots.findIndex((spot) => spot.custom);
  els.spotPreset.value = String(customIndex);
  els.latitude.value = lat.toFixed(4);
  els.longitude.value = lon.toFixed(4);
  state.selectedSpotName = options.name ?? getCustomSpotName(lat, lon);
  centerMapOn(lat, lon);
  updateSpotMeta();
  renderSpotTools();
  saveSettings();

  if (options.load) {
    loadForecast();
  }
}

function openSpotNameSheet(lat, lon) {
  if (!isValidNumber(lat) || !isValidNumber(lon)) return;

  state.pendingSpot = {
    lat,
    lon,
    name: getCustomSpotName(lat, lon),
  };
  state.renamingFavoriteId = null;
  renderSpotTools();

  window.requestAnimationFrame(() => {
    els.spotNameInput.focus();
    els.spotNameInput.select();
  });
}

function renderSpotNameSheet() {
  const pending = state.pendingSpot;
  els.spotMap.classList.toggle("has-name-sheet", Boolean(pending));
  els.spotNameSheet.classList.toggle("is-open", Boolean(pending));
  els.spotNameSheet.setAttribute("aria-hidden", pending ? "false" : "true");
  els.spotNameSheet.inert = !pending;

  if (!pending) return;

  els.spotNameCoords.textContent = formatCoordinates(pending.lat, pending.lon);
  if (document.activeElement !== els.spotNameInput) {
    els.spotNameInput.value = pending.name;
  }
}

function closeSpotNameSheet() {
  state.pendingSpot = null;
  renderSpotTools();
}

function confirmPendingSpot(options = {}) {
  const pending = state.pendingSpot;
  if (!pending) return;

  const name = sanitizeSpotName(els.spotNameInput.value) || getCustomSpotName(pending.lat, pending.lon);
  state.pendingSpot = null;
  setCustomSpot(pending.lat, pending.lon, { load: true, name });

  if (options.favorite) {
    upsertFavorite({
      id: coordinateFavoriteId(pending.lat, pending.lon),
      name,
      group: "Spot personnalisé",
      lat: pending.lat,
      lon: pending.lon,
      custom: true,
      waterMode: state.waterMode,
    });
    saveFavorites();
    renderSpotTools();
  }
}

function renderSpotTools() {
  renderFishFilterControls();
  renderMapTiles();
  renderMapMarkers();
  renderFavorites();
  updateFavoriteButton();
  updateMapZoomControls();
  updateMapScale();
  updateNauticalOverlay();
  renderBathymetryLayer();
  updateBathymetryOverlay();
  renderKnownFishingMarkers();
  updateKnownFishingOverlay();
  renderRegulationZones();
  updateRegulationOverlay();
  renderAnchorWatch();
  renderSafetyStatus();
  updateMapLayerPanel();
  updateSpotPanel();
  renderSpotNameSheet();

  const active = getActiveSpot();
  els.activeSpotName.textContent = active.name;
  els.activeSpotCoords.textContent = formatCoordinates(active.lat, active.lon);
}

function updateNauticalOverlay() {
  const nauticalEnabled = state.nauticalEnabled && isSeaMode();

  if (els.mapNauticalToggle) {
    els.mapNauticalToggle.classList.toggle("is-active", nauticalEnabled);
    els.mapNauticalToggle.setAttribute("aria-pressed", String(nauticalEnabled));
  }

  if (els.mapAttribution) {
    const credits = ["© OpenStreetMap"];
    if (nauticalEnabled) credits.push("OpenSeaMap");
    if (state.bathymetryEnabled && isSeaMode()) credits.push("fond estimé");
    els.mapAttribution.textContent = credits.join(" · ");
  }

  if (!state.leafletMap || !state.nauticalLayer) return;

  const hasLayer = state.leafletMap.hasLayer(state.nauticalLayer);
  if (nauticalEnabled && !hasLayer) {
    state.nauticalLayer.addTo(state.leafletMap);
  } else if (!nauticalEnabled && hasLayer) {
    state.leafletMap.removeLayer(state.nauticalLayer);
  }
}

function updateBathymetryOverlay() {
  const enabled = state.bathymetryEnabled && isSeaMode();

  if (els.mapBathymetryToggle) {
    els.mapBathymetryToggle.classList.toggle("is-active", enabled);
    els.mapBathymetryToggle.setAttribute("aria-pressed", String(enabled));
  }

  if (!state.leafletMap || !state.bathymetryLayer) return;

  const hasLayer = state.leafletMap.hasLayer(state.bathymetryLayer);
  if (enabled && !hasLayer) {
    state.bathymetryLayer.addTo(state.leafletMap);
  } else if (!enabled && hasLayer) {
    state.leafletMap.removeLayer(state.bathymetryLayer);
  }
}

function updateKnownFishingOverlay() {
  if (els.mapFishingToggle) {
    els.mapFishingToggle.classList.toggle("is-active", state.knownFishingEnabled);
    els.mapFishingToggle.setAttribute("aria-pressed", String(state.knownFishingEnabled));
  }

  if (els.fishFilterControl) {
    els.fishFilterControl.classList.toggle("is-hidden", !state.knownFishingEnabled);
  }

  if (!state.leafletMap || !state.knownFishingLayer) return;

  const hasLayer = state.leafletMap.hasLayer(state.knownFishingLayer);
  if (state.knownFishingEnabled && !hasLayer) {
    state.knownFishingLayer.addTo(state.leafletMap);
  } else if (!state.knownFishingEnabled && hasLayer) {
    state.leafletMap.removeLayer(state.knownFishingLayer);
  }
}

function updateRegulationOverlay() {
  const enabled = state.regulationEnabled && isSeaMode();

  if (els.mapRegulationToggle) {
    els.mapRegulationToggle.classList.toggle("is-active", enabled);
    els.mapRegulationToggle.setAttribute("aria-pressed", String(enabled));
  }

  if (!state.leafletMap || !state.regulationLayer) return;

  const hasLayer = state.leafletMap.hasLayer(state.regulationLayer);
  if (enabled && !hasLayer) {
    state.regulationLayer.addTo(state.leafletMap);
  } else if (!enabled && hasLayer) {
    state.leafletMap.removeLayer(state.regulationLayer);
  }
}

function renderBathymetryLayer() {
  if (!state.bathymetryLayer) return;

  state.bathymetryLayer.clearLayers();
  if (!state.bathymetryEnabled || !isSeaMode()) return;

  bathymetryContours.forEach((contour) => {
    const style = bathymetryStyle(contour.depth);
    const line = L.polyline(contour.coordinates, {
      color: style.color,
      opacity: style.opacity,
      weight: style.weight,
      dashArray: style.dashArray,
      interactive: false,
    });
    line.addTo(state.bathymetryLayer);

    const labelPosition = contour.label ?? contour.coordinates[Math.floor(contour.coordinates.length / 2)];
    L.marker(labelPosition, {
      icon: L.divIcon({
        className: "bathymetry-label",
        html: `${contour.depth} m`,
        iconSize: [56, 22],
        iconAnchor: [28, 11],
      }),
      interactive: false,
      zIndexOffset: 120,
    }).addTo(state.bathymetryLayer);
  });
}

function bathymetryStyle(depth) {
  if (depth >= 1000) {
    return { color: "#17324f", opacity: 0.58, weight: 2.1, dashArray: "1 0" };
  }
  if (depth >= 200) {
    return { color: "#245a8f", opacity: 0.56, weight: 1.9, dashArray: "8 7" };
  }
  if (depth >= 100) {
    return { color: "#2f74c0", opacity: 0.54, weight: 1.7, dashArray: "6 6" };
  }
  if (depth >= 50) {
    return { color: "#4d91cf", opacity: 0.5, weight: 1.5, dashArray: "5 6" };
  }
  return { color: "#6caad2", opacity: 0.48, weight: 1.4, dashArray: "4 6" };
}

function renderRegulationZones() {
  if (!state.regulationLayer) return;

  state.regulationLayer.clearLayers();
  if (!state.regulationEnabled || !isSeaMode()) return;

  regulationZones.forEach((zone) => {
    const polygon = L.polygon(zone.coordinates, {
      color: zone.level === "danger" ? colors.gust : colors.wind,
      fillColor: zone.level === "danger" ? colors.gust : colors.wind,
      fillOpacity: zone.level === "danger" ? 0.18 : 0.12,
      weight: 2,
      dashArray: zone.level === "danger" ? "" : "7 6",
      interactive: true,
    });

    polygon.bindTooltip(zone.name, {
      direction: "top",
      opacity: 0.96,
      sticky: true,
    });
    polygon.bindPopup(`
      <strong>${escapeHtml(zone.name)}</strong>
      <span>${escapeHtml(zone.area)}</span>
      <small>${zone.level === "danger" ? "Alerte réglementation" : "Vigilance réglementation"}</small>
      <em>${escapeHtml(zone.rule)}</em>
    `);
    polygon.addTo(state.regulationLayer);
  });
}

function toggleRegulationOverlay() {
  if (!isSeaMode()) return;
  state.regulationEnabled = !state.regulationEnabled;
  updateRegulationOverlay();
  renderRegulationZones();
  renderSafetyStatus();
  saveSettings();
}

function renderSafetyStatus() {
  if (!els.safetyBanner || !els.safetyTitle || !els.safetyDetail) return;

  const active = getActiveSpot();
  const regulationStatus = isSeaMode() ? evaluateRegulationStatus(active.lat, active.lon) : null;
  const anchorText = anchorWatchSummary();
  let title = "Sécurité";
  let detail = isSeaMode()
    ? "Hors zone sensible connue autour de ce spot."
    : "Zones marines masquées en eau douce.";
  let mode = "ready";

  if (regulationStatus?.inside) {
    title = "Zone sensible";
    detail = `${regulationStatus.zone.name}. ${regulationStatus.zone.rule}`;
    mode = regulationStatus.zone.level === "danger" ? "alert" : "warn";
  } else if (regulationStatus?.near) {
    title = "Zone proche";
    detail = `${formatScaleDistance(regulationStatus.distance)} de ${regulationStatus.zone.name}. Vérifier avant pêche.`;
    mode = "warn";
  }

  if (anchorText) {
    detail = `${detail} ${anchorText}`;
    if (state.anchorWatch.status === "alert") mode = "alert";
    if (state.anchorWatch.status === "starting" && mode === "ready") mode = "watch";
  }

  els.safetyTitle.textContent = title;
  els.safetyDetail.textContent = detail;
  els.spotDock?.classList.toggle("is-alert", mode === "alert");
  els.spotDock?.classList.toggle("is-warn", mode === "warn");
  els.spotDock?.classList.toggle("is-watch", mode === "watch");
  els.safetyBanner.classList.toggle("is-alert", mode === "alert");
  els.safetyBanner.classList.toggle("is-warn", mode === "warn");
  els.safetyBanner.classList.toggle("is-watch", mode === "watch");
}

function evaluateRegulationStatus(lat, lon) {
  if (!isValidNumber(lat) || !isValidNumber(lon)) return null;

  const matches = regulationZones
    .map((zone) => ({
      zone,
      inside: pointInPolygon(lat, lon, zone.coordinates),
      distance: distanceToPolygonMeters(lat, lon, zone.coordinates),
    }))
    .sort((a, b) => a.distance - b.distance);
  const closest = matches[0];
  if (!closest) return null;

  return {
    ...closest,
    near: !closest.inside && closest.distance <= REGULATION_WARNING_METERS,
  };
}

function pointInPolygon(lat, lon, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const [latI, lonI] = polygon[i];
    const [latJ, lonJ] = polygon[j];
    const intersects = latI > lat !== latJ > lat && lon < ((lonJ - lonI) * (lat - latI)) / (latJ - latI) + lonI;
    if (intersects) inside = !inside;
  }
  return inside;
}

function distanceToPolygonMeters(lat, lon, polygon) {
  if (pointInPolygon(lat, lon, polygon)) return 0;

  return polygon.reduce((best, point, index) => {
    const next = polygon[(index + 1) % polygon.length];
    return Math.min(best, distanceToSegmentMeters({ lat, lon }, pointToCoord(point), pointToCoord(next)));
  }, Infinity);
}

function pointToCoord(point) {
  return { lat: point[0], lon: point[1] };
}

function distanceToSegmentMeters(point, start, end) {
  const metersPerLat = 111320;
  const metersPerLon = Math.cos(toRad(point.lat)) * 111320;
  const startPoint = {
    x: (start.lon - point.lon) * metersPerLon,
    y: (start.lat - point.lat) * metersPerLat,
  };
  const endPoint = {
    x: (end.lon - point.lon) * metersPerLon,
    y: (end.lat - point.lat) * metersPerLat,
  };
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const lengthSq = dx * dx + dy * dy;
  const t = lengthSq ? clamp((-startPoint.x * dx - startPoint.y * dy) / lengthSq, 0, 1) : 0;
  const closest = {
    x: startPoint.x + dx * t,
    y: startPoint.y + dy * t,
  };
  return Math.hypot(closest.x, closest.y);
}

function toggleAnchorWatch() {
  if (state.anchorWatch.active) {
    stopAnchorWatch("Surveillance arrêtée.");
    return;
  }

  startAnchorWatch();
}

function startAnchorWatch() {
  if (!navigator.geolocation) {
    state.anchorWatch = {
      ...state.anchorWatch,
      active: false,
      status: "error",
      message: "GPS indisponible sur ce navigateur.",
    };
    renderAnchorWatch();
    renderSafetyStatus();
    return;
  }

  state.anchorWatch = {
    active: true,
    watchId: null,
    anchor: null,
    position: null,
    drift: null,
    status: "starting",
    message: "Recherche GPS pour poser l'ancre.",
    alerted: false,
  };
  renderAnchorWatch();
  renderSafetyStatus();

  state.anchorWatch.watchId = navigator.geolocation.watchPosition(handleAnchorPosition, handleAnchorError, {
    enableHighAccuracy: true,
    maximumAge: 4000,
    timeout: 12000,
  });
}

function stopAnchorWatch(message = "") {
  if (state.anchorWatch.watchId != null) {
    navigator.geolocation?.clearWatch?.(state.anchorWatch.watchId);
  }

  state.anchorWatch = {
    active: false,
    watchId: null,
    anchor: null,
    position: null,
    drift: null,
    status: "idle",
    message,
    alerted: false,
  };
  renderAnchorWatch();
  renderSafetyStatus();
}

function handleAnchorPosition(position) {
  const current = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    accuracy: position.coords.accuracy,
    updatedAt: new Date().toISOString(),
  };
  const anchor = state.anchorWatch.anchor ?? current;
  const drift = distanceMeters(anchor, current);
  const status = drift > ANCHOR_DRIFT_LIMIT_METERS ? "alert" : "watching";
  const wasAlerted = state.anchorWatch.alerted;

  state.anchorWatch = {
    ...state.anchorWatch,
    active: true,
    anchor,
    position: current,
    drift,
    status,
    message: status === "alert" ? "Dérive supérieure à 30 m." : "Surveillance active.",
    alerted: status === "alert",
  };

  if (status === "alert" && !wasAlerted) {
    notifyAnchorDrift();
  }

  renderAnchorWatch();
  renderSafetyStatus();
}

function handleAnchorError(error) {
  const watchId = state.anchorWatch.watchId;
  state.anchorWatch = {
    ...state.anchorWatch,
    active: false,
    watchId: null,
    status: "error",
    message: error?.message ? `GPS: ${error.message}` : "Position GPS impossible.",
  };
  if (watchId != null) {
    navigator.geolocation?.clearWatch?.(watchId);
  }
  renderAnchorWatch();
  renderSafetyStatus();
}

function renderAnchorWatch() {
  if (els.anchorWatchBtn) {
    const active = state.anchorWatch.active || state.anchorWatch.status === "starting";
    els.anchorWatchBtn.classList.toggle("is-active", active);
    els.anchorWatchBtn.classList.toggle("is-alert", state.anchorWatch.status === "alert");
    els.anchorWatchBtn.setAttribute("aria-pressed", String(active));
    els.anchorWatchBtn.title = active ? "Arrêter la surveillance ancre" : "Surveillance ancre";
    els.anchorWatchBtn.setAttribute("aria-label", els.anchorWatchBtn.title);
  }

  if (!state.anchorLayer) return;

  state.anchorLayer.clearLayers();
  if (!state.anchorWatch.anchor) return;

  L.circle([state.anchorWatch.anchor.lat, state.anchorWatch.anchor.lon], {
    radius: ANCHOR_DRIFT_LIMIT_METERS,
    color: state.anchorWatch.status === "alert" ? colors.gust : colors.current,
    fillColor: state.anchorWatch.status === "alert" ? colors.gust : colors.current,
    fillOpacity: 0.12,
    weight: 2,
  }).addTo(state.anchorLayer);

  L.marker([state.anchorWatch.anchor.lat, state.anchorWatch.anchor.lon], {
    icon: L.divIcon({
      className: "anchor-watch-marker",
      html: anchorIcon(),
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    }),
    keyboard: false,
    title: "Ancre",
  })
    .bindTooltip("Ancre", { direction: "top", offset: [0, -12], opacity: 0.96 })
    .addTo(state.anchorLayer);

  if (state.anchorWatch.position && state.anchorWatch.drift > 2) {
    L.polyline(
      [
        [state.anchorWatch.anchor.lat, state.anchorWatch.anchor.lon],
        [state.anchorWatch.position.lat, state.anchorWatch.position.lon],
      ],
      {
        color: state.anchorWatch.status === "alert" ? colors.gust : colors.current,
        dashArray: "5 5",
        weight: 2,
      },
    ).addTo(state.anchorLayer);
  }
}

function anchorWatchSummary() {
  if (state.anchorWatch.status === "idle") return "";
  if (state.anchorWatch.status === "error") return state.anchorWatch.message ? `Ancre: ${state.anchorWatch.message}` : "";
  if (state.anchorWatch.status === "starting") return "Ancre: recherche GPS.";
  if (!isValidNumber(state.anchorWatch.drift)) return "Ancre: surveillance active.";

  return `Ancre: ${formatNumber(state.anchorWatch.drift, 0)} m / ${ANCHOR_DRIFT_LIMIT_METERS} m.`;
}

function notifyAnchorDrift() {
  navigator.vibrate?.([250, 120, 250, 120, 350]);
  playAlertTone();
}

function playAlertTone() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.42);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.45);
    window.setTimeout(() => context.close(), 650);
  } catch {
    // Audio is best effort; vibration and visual alert remain active.
  }
}

function scheduleMarineOverlayRefresh() {
  window.clearTimeout(state.marineOverlayTimer);
  if (!canShowMarineOverlay()) {
    renderMarineOverlay();
    return;
  }

  state.marineOverlayTimer = window.setTimeout(renderMarineOverlay, 420);
}

function canShowMarineOverlay() {
  return isSeaMode() && state.marineOverlayMode !== "none" && Boolean(state.leafletMap && state.marineOverlayLayer);
}

function renderMarineOverlay() {
  updateMarineOverlayControls();
  if (!state.marineOverlayLayer) return;

  state.marineOverlayLayer.clearLayers();
  if (!canShowMarineOverlay()) return;

  const samples = regionalMarineSamplePoints();
  const key = regionalMarineCacheKey(samples);
  const cached = state.marineOverlayCache.get(key);

  if (cached) {
    state.marineOverlayData = cached;
    drawMarineOverlayMarkers(cached);
    return;
  }

  state.marineOverlayLoading = true;
  updateMarineOverlayControls();
  const requestId = state.marineOverlayRequestId + 1;
  state.marineOverlayRequestId = requestId;

  loadRegionalMarineOverlay(samples)
    .then((data) => {
      if (requestId !== state.marineOverlayRequestId) return;
      state.marineOverlayCache.set(key, data);
      state.marineOverlayData = data;
      state.marineOverlayLoading = false;
      updateMarineOverlayControls();
      drawMarineOverlayMarkers(data);
    })
    .catch((error) => {
      if (requestId !== state.marineOverlayRequestId) return;
      console.info("Overlay régional marin indisponible.", error);
      state.marineOverlayLoading = false;
      updateMarineOverlayControls();
    });
}

async function loadRegionalMarineOverlay(samples) {
  const payload = await fetchJson(buildRegionalMarineUrl(samples));
  const entries = Array.isArray(payload) ? payload : [payload];
  const seen = new Set();

  return entries
    .map((entry, index) => parseRegionalMarinePoint(entry, samples[index]))
    .filter(Boolean)
    .filter((entry) => {
      const key = `${entry.lat.toFixed(3)},${entry.lon.toFixed(3)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function buildRegionalMarineUrl(samples) {
  const url = new URL(MARINE_API);
  url.searchParams.set("latitude", samples.map((sample) => sample.lat.toFixed(4)).join(","));
  url.searchParams.set("longitude", samples.map((sample) => sample.lon.toFixed(4)).join(","));
  url.searchParams.set("hourly", [
    "wave_height",
    "wave_direction",
    "ocean_current_velocity",
    "ocean_current_direction",
  ].join(","));
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("cell_selection", "sea");
  return url;
}

function regionalMarineSamplePoints() {
  const center = state.leafletMap?.getCenter() ?? { lat: getActiveSpot().lat, lng: getActiveSpot().lon };
  const bounds = state.leafletMap?.getBounds();
  const rawLatSpan = bounds ? Math.abs(bounds.getNorth() - bounds.getSouth()) : 0.55;
  const rawLonSpan = bounds ? Math.abs(bounds.getEast() - bounds.getWest()) : 0.75;
  const latSpan = clamp(rawLatSpan, 0.18, 2.4);
  const lonSpan = clamp(rawLonSpan, 0.18, 3.2);
  const rows = isMobileLayout() ? 3 : 4;
  const cols = isMobileLayout() ? 3 : 4;
  const samples = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const lat = center.lat + latSpan * (0.5 - (row + 0.5) / rows);
      const lon = center.lng + lonSpan * ((col + 0.5) / cols - 0.5);
      samples.push({ lat, lon });
    }
  }

  return samples;
}

function regionalMarineCacheKey(samples) {
  return samples.map((sample) => `${sample.lat.toFixed(3)},${sample.lon.toFixed(3)}`).join("|");
}

function parseRegionalMarinePoint(payload, sample) {
  const hourly = payload?.hourly;
  if (!hourly?.time?.length) return null;

  const dayGroups = groupBy(
    hourly.time.map((time, index) => ({
      time,
      date: time.slice(0, 10),
      hour: time.slice(11, 16),
      surfaceCurrent: kmhToKnots(valueAt(hourly.ocean_current_velocity, index)),
      currentDirection: valueAt(hourly.ocean_current_direction, index),
      waveHeight: valueAt(hourly.wave_height, index),
      waveDirection: valueAt(hourly.wave_direction, index),
    })),
    "date",
  );
  const days = {};

  Object.entries(dayGroups).forEach(([date, rows]) => {
    const surfaceCurrent = average(pluck(rows, "surfaceCurrent"));
    const currentDirection = circularMean(pluck(rows, "currentDirection"), pluck(rows, "surfaceCurrent"));
    const waveHeight = average(pluck(rows, "waveHeight"));
    const waveDirection = circularMean(pluck(rows, "waveDirection"), pluck(rows, "waveHeight"));
    days[date] = {
      date,
      surfaceCurrent,
      currentDirection,
      depthCurrent: surfaceCurrent == null ? null : surfaceCurrent * depthFactor(state.depth),
      depthDirection: estimatedDepthDirection(currentDirection, state.depth),
      waveHeight,
      waveDirection,
    };
  });

  return {
    lat: payload.latitude ?? sample.lat,
    lon: payload.longitude ?? sample.lon,
    days,
  };
}

function drawMarineOverlayMarkers(data) {
  if (!state.marineOverlayLayer || !canShowMarineOverlay()) return;

  state.marineOverlayLayer.clearLayers();
  const day = getSelectedDay();
  const selectedDate = day?.date ?? state.selectedDate;

  data.forEach((point) => {
    const dayData = point.days[selectedDate] ?? Object.values(point.days)[0];
    const metric = marineOverlayMetric(dayData);
    if (!metric || !isValidNumber(metric.value) || !isValidNumber(metric.direction)) return;

    const marker = L.marker([point.lat, point.lon], {
      icon: L.divIcon({
        className: `marine-overlay-icon marine-overlay-${state.marineOverlayMode}`,
        html: marineOverlayMarkerHtml(metric),
        iconSize: [68, 52],
        iconAnchor: [34, 26],
        tooltipAnchor: [0, -24],
      }),
      keyboard: false,
      zIndexOffset: 180,
    });

    marker.bindTooltip(metric.tooltip, {
      direction: "top",
      offset: [0, -18],
      opacity: 0.96,
      sticky: true,
    });
    marker.addTo(state.marineOverlayLayer);
  });
}

function marineOverlayMetric(dayData) {
  if (!dayData) return null;

  if (state.marineOverlayMode === "depth") {
    return {
      value: dayData.surfaceCurrent == null ? null : dayData.surfaceCurrent * depthFactor(state.depth),
      direction: estimatedDepthDirection(dayData.currentDirection, state.depth),
      label: `${formatNumber(dayData.surfaceCurrent == null ? null : dayData.surfaceCurrent * depthFactor(state.depth), 1)} kt`,
      tooltip: `Courant ${state.depth} m · ${formatNumber(dayData.surfaceCurrent == null ? null : dayData.surfaceCurrent * depthFactor(state.depth), 1)} kt vers ${compassLabel(estimatedDepthDirection(dayData.currentDirection, state.depth))}`,
    };
  }

  if (state.marineOverlayMode === "wave") {
    return {
      value: dayData.waveHeight,
      direction: reverseDirection(dayData.waveDirection),
      label: `${formatNumber(dayData.waveHeight, 1)} m`,
      tooltip: `Houle ${formatNumber(dayData.waveHeight, 1)} m · de ${compassLabel(dayData.waveDirection)}`,
    };
  }

  if (state.marineOverlayMode === "surface") {
    return {
      value: dayData.surfaceCurrent,
      direction: dayData.currentDirection,
      label: `${formatNumber(dayData.surfaceCurrent, 1)} kt`,
      tooltip: `Courant surface · ${formatNumber(dayData.surfaceCurrent, 1)} kt vers ${compassLabel(dayData.currentDirection)}`,
    };
  }

  return null;
}

function marineOverlayMarkerHtml(metric) {
  const strength = clamp(metric.value / (state.marineOverlayMode === "wave" ? 1.8 : 1.1), 0.35, 1.35);
  return `
    <div class="marine-flow-marker" style="--flow-rotation:${metric.direction}deg; --flow-strength:${strength}">
      <span class="marine-flow-arrow">↑</span>
      <strong>${escapeHtml(metric.label)}</strong>
    </div>
  `;
}

function renderFishFilterControls() {
  if (!els.fishFilterPanel || !els.fishFilterButton || !els.fishFilterLabel) return;

  const filters = getFishFilters();
  const active = getActiveFishFilter();
  const activeLabel = filters.find((filter) => filter.id === active)?.label ?? "Tous";
  els.fishFilterLabel.textContent = activeLabel;
  els.fishFilterButton.classList.toggle("is-open", state.fishFilterOpen);
  els.fishFilterButton.setAttribute("aria-expanded", String(state.fishFilterOpen));
  els.fishFilterPanel.classList.toggle("is-open", state.fishFilterOpen);
  els.fishFilterPanel.setAttribute("aria-hidden", String(!state.fishFilterOpen));
  els.fishFilterPanel.innerHTML = "";

  filters.forEach((filter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `fish-filter-option fish-${filter.id}`;
    button.classList.toggle("is-active", active === filter.id);
    button.setAttribute("aria-pressed", String(active === filter.id));
    button.innerHTML = `
      <span class="fish-filter-icon">${fishSpotIcon(filter.id)}</span>
      <strong>${escapeHtml(filter.label)}</strong>
      <span>${filter.id === "all" ? "Tous les coins" : `${countKnownFishingSpotsForFilter(filter.id)} coins`}</span>
    `;
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      selectFishFilter(filter.id);
    });
    els.fishFilterPanel.append(button);
  });
}

function selectFishFilter(id) {
  state.activeFishFilters = normalizeFishFilters([id]);
  if (id !== "all") {
    state.activityFish = normalizeActivityFish(id);
    els.activityFish.value = state.activityFish;
  }
  state.fishFilterOpen = false;
  renderFishFilterControls();
  renderKnownFishingMarkers();
  renderAll();
  saveSettings();
}

function getKnownFishingSpots() {
  return isSeaMode() ? knownFishingSpots : freshwaterFishingSpots;
}

function getVisibleKnownFishingSpots() {
  const active = getActiveFishFilter();
  const catalog = getKnownFishingSpots();
  if (active === "all") return catalog;
  return catalog.filter((spot) => spot.fish?.includes(active));
}

function normalizeFishFilters(filters) {
  const validFilters = new Set(getFishFilters().map((filter) => filter.id));
  const next = Array.isArray(filters) ? filters.find((filter) => validFilters.has(filter)) : null;

  return new Set([next ?? "all"]);
}

function normalizeActivityFish(fish) {
  const filters = getFishFilters();
  return filters.some((filter) => filter.id === fish && filter.id !== "all")
    ? fish
    : waterModeConfig[state.waterMode].defaultActivityFish;
}

function getActiveFishFilter() {
  const active = [...state.activeFishFilters][0];
  return getFishFilters().some((filter) => filter.id === active) ? active : "all";
}

function countKnownFishingSpotsForFilter(id) {
  const catalog = getKnownFishingSpots();
  if (id === "all") return catalog.length;
  return catalog.filter((spot) => spot.fish?.includes(id)).length;
}

function markerFishForSpot(spot) {
  const active = getActiveFishFilter();
  return active === "all" ? spot.fish?.[0] ?? "dorade" : active;
}

function formatFishTargets(fish = []) {
  const labels = fish
    .map((id) => getFishLabel(id))
    .filter(Boolean);

  return labels.length ? `Cibles: ${labels.join(", ")}` : "Cibles: à préciser";
}

function renderKnownFishingMarkers() {
  if (!state.knownFishingLayer) return;

  state.knownFishingLayer.clearLayers();
  if (!state.knownFishingEnabled) return;

  getVisibleKnownFishingSpots().forEach((spot) => {
    const markerFish = markerFishForSpot(spot);
    const marker = L.marker([spot.lat, spot.lon], {
      icon: L.divIcon({
        className: `known-fishing-marker fish-${markerFish}`,
        html: fishSpotIcon(markerFish),
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        tooltipAnchor: [0, -16],
      }),
      keyboard: true,
      title: spot.name,
      zIndexOffset: 240,
    });

    marker.bindTooltip(escapeHtml(spot.name), {
      direction: "top",
      offset: [0, -14],
      opacity: 0.96,
      sticky: true,
    });
    marker.bindPopup(`
      <strong>${escapeHtml(spot.name)}</strong>
      <span>${escapeHtml(spot.area)}</span>
      <small>${escapeHtml(formatFishTargets(spot.fish))}</small>
      <small>${escapeHtml(spot.note)}</small>
      <em>${escapeHtml(spot.caution)}</em>
    `);
    marker.on("click", () => selectKnownFishingSpot(spot));
    marker.addTo(state.knownFishingLayer);
  });
}

function selectKnownFishingSpot(spot) {
  state.pendingSpot = null;
  setCustomSpot(spot.lat, spot.lon, { load: true, name: spot.name });
}

function renderMapTiles() {
  if (state.leafletMap) {
    syncLeafletMapView();
    return;
  }

  const bounds = getMapPixelBounds();
  const tileKey = `${state.mapZoom}:${Math.round(bounds.left)}:${Math.round(bounds.top)}:${Math.round(bounds.right)}:${Math.round(bounds.bottom)}`;
  if (state.mapTileKey === tileKey) return;

  const worldTileCount = 2 ** state.mapZoom;
  const minX = Math.floor(bounds.left / MAP_TILE_SIZE) - MAP_TILE_BUFFER;
  const maxX = Math.floor(bounds.right / MAP_TILE_SIZE) + MAP_TILE_BUFFER;
  const minY = Math.max(0, Math.floor(bounds.top / MAP_TILE_SIZE) - MAP_TILE_BUFFER);
  const maxY = Math.min(worldTileCount - 1, Math.floor(bounds.bottom / MAP_TILE_SIZE) + MAP_TILE_BUFFER);
  const neededTiles = new Set();
  const existingTiles = new Map(
    [...els.mapTiles.querySelectorAll(".map-tile")].map((tile) => [tile.dataset.tilePosition, tile]),
  );

  for (let x = minX; x <= maxX; x += 1) {
    for (let y = minY; y <= maxY; y += 1) {
      const wrappedX = wrapTileX(x, worldTileCount);
      const positionKey = `${state.mapZoom}:${x}:${y}`;
      const tileUrl = `https://tile.openstreetmap.org/${state.mapZoom}/${wrappedX}/${y}.png`;
      const tile = existingTiles.get(positionKey) ?? createMapTile(positionKey, tileUrl);

      neededTiles.add(positionKey);
      tile.classList.remove("is-stale");
      positionMapTile(tile, x, y, bounds);
      els.mapTiles.append(tile);
    }
  }

  pruneStaleMapTiles(neededTiles);
  state.mapTileKey = tileKey;
}

function createMapTile(positionKey, src) {
  const tile = document.createElement("img");
  tile.className = "map-tile";
  tile.alt = "";
  tile.decoding = "async";
  tile.loading = "eager";
  tile.fetchPriority = "high";
  tile.dataset.tilePosition = positionKey;
  tile.dataset.retryCount = "0";
  tile.addEventListener("load", () => {
    tile.classList.add("is-loaded");
    tile.dataset.retryCount = "0";
  });
  tile.addEventListener("error", () => retryMapTile(tile));
  tile.src = src;

  if (tile.complete && tile.naturalWidth > 0) {
    tile.classList.add("is-loaded");
  }

  return tile;
}

function positionMapTile(tile, x, y, bounds) {
  tile.style.left = `${((x * MAP_TILE_SIZE - bounds.left) / bounds.width) * 100}%`;
  tile.style.top = `${((y * MAP_TILE_SIZE - bounds.top) / bounds.height) * 100}%`;
  tile.style.width = `${(MAP_TILE_SIZE / bounds.width) * 100}%`;
  tile.style.height = `${(MAP_TILE_SIZE / bounds.height) * 100}%`;
}

function retryMapTile(tile) {
  const retryCount = Number.parseInt(tile.dataset.retryCount ?? "0", 10);
  if (retryCount >= 2) return;

  tile.dataset.retryCount = String(retryCount + 1);
  window.setTimeout(() => {
    if (!tile.isConnected) return;
    const retryUrl = new URL(tile.src);
    retryUrl.searchParams.set("retry", String(Date.now()));
    tile.src = retryUrl.toString();
  }, 450 + retryCount * 700);
}

function pruneStaleMapTiles(neededTiles) {
  [...els.mapTiles.querySelectorAll(".map-tile")].forEach((tile) => {
    if (neededTiles.has(tile.dataset.tilePosition)) return;
    tile.classList.add("is-stale");
  });

  window.clearTimeout(state.mapTilePruneTimer);
  state.mapTilePruneTimer = window.setTimeout(() => {
    [...els.mapTiles.querySelectorAll(".map-tile.is-stale")].forEach((tile) => {
      if (!neededTiles.has(tile.dataset.tilePosition)) tile.remove();
    });
  }, MAP_TILE_STALE_MS);
}

function syncLeafletMapView() {
  const map = state.leafletMap;
  if (!map) return;

  map.invalidateSize(false);
  const center = getMapCenter();
  const currentCenter = map.getCenter();
  const shouldMove =
    map.getZoom() !== state.mapZoom ||
    Math.abs(currentCenter.lat - center.lat) > 0.00001 ||
    Math.abs(currentCenter.lng - center.lon) > 0.00001;

  if (shouldMove) {
    map.setView([center.lat, center.lon], state.mapZoom, { animate: false });
  }
}

function renderLeafletMarkers() {
  if (!state.leafletMarkers) return;

  state.leafletMarkers.clearLayers();
  const active = getActiveSpot();
  const activeId = active.id;

  if (isSeaMode()) {
    spots.forEach((spot, index) => {
      if (spot.custom || !spot.group?.startsWith("Méditerranée")) return;

      const id = spotFavoriteId(spot);
      const marker = L.circleMarker([spot.lat, spot.lon], {
        radius: id === activeId ? 7 : 5,
        color: "#fff",
        weight: id === activeId ? 3 : 2,
        fillColor: id === activeId ? colors.gust : hasFavorite(id) ? colors.wind : colors.current,
        fillOpacity: 0.95,
        bubblingMouseEvents: false,
      });

      marker.bindTooltip(spot.name, {
        direction: "top",
        offset: [0, -8],
        opacity: 0.96,
        sticky: true,
      });
      marker.on("click", (event) => {
        if (event.originalEvent) L.DomEvent.stop(event.originalEvent);
        selectSpot(index, { load: true });
      });
      marker.addTo(state.leafletMarkers);
    });
  }

  state.favorites.forEach((favorite) => {
    if (!isValidNumber(favorite.lat) || !isValidNumber(favorite.lon)) return;

    const marker = L.marker([favorite.lat, favorite.lon], {
      icon: L.divIcon({
        className: "favorite-star-marker",
        html: starIcon(),
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        tooltipAnchor: [0, -14],
      }),
      keyboard: true,
      title: favorite.name,
    });

    marker.bindTooltip(escapeHtml(favorite.name), {
      direction: "top",
      offset: [0, -12],
      opacity: 0.96,
      sticky: true,
    });
    marker.on("click", (event) => {
      if (event.originalEvent) L.DomEvent.stop(event.originalEvent);
      selectFavorite(favorite);
    });
    marker.addTo(state.leafletMarkers);
  });

  if (active.custom && isValidNumber(active.lat) && isValidNumber(active.lon)) {
    L.circleMarker([active.lat, active.lon], {
      radius: 8,
      color: "#fff",
      weight: 3,
      fillColor: colors.depth,
      fillOpacity: 1,
      bubblingMouseEvents: false,
    })
      .bindTooltip(active.name, {
        direction: "top",
        offset: [0, -10],
        opacity: 0.96,
        permanent: true,
      })
      .addTo(state.leafletMarkers);
  }

  if (state.pendingSpot) {
    L.marker([state.pendingSpot.lat, state.pendingSpot.lon], {
      icon: L.divIcon({
        className: "pending-spot-marker",
        html: pinIcon(),
        iconSize: [34, 42],
        iconAnchor: [17, 38],
      }),
      keyboard: false,
      interactive: false,
    }).addTo(state.leafletMarkers);
  }
}

function selectLeafletMapPoint(event) {
  const lat = event.latlng.lat;
  const lon = event.latlng.lng;
  openSpotNameSheet(lat, lon);
}

function syncLeafletState() {
  if (!state.leafletMap) return;

  const center = state.leafletMap.getCenter();
  state.mapZoom = state.leafletMap.getZoom();
  state.mapCenter = { lat: center.lat, lon: center.lng };
  updateMapZoomControls();
  updateMapScale();
  scheduleMarineOverlayRefresh();
}

function renderMapMarkers() {
  if (state.leafletMap) {
    renderLeafletMarkers();
    return;
  }

  els.mapMarkers.innerHTML = "";
  const active = getActiveSpot();
  const markerEntries = getMapMarkerEntries();

  markerEntries.forEach(({ spot, index, point }) => {
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "map-marker";
    marker.classList.toggle("is-active", active.id === spotFavoriteId(spot));
    marker.classList.toggle("is-favorite", hasFavorite(spotFavoriteId(spot)));
    marker.style.left = `${point.x * 100}%`;
    marker.style.top = `${point.y * 100}%`;
    marker.title = spot.name;
    marker.setAttribute("aria-label", `Sélectionner ${spot.name}`);
    marker.innerHTML = `<span class="map-marker-label">${spot.name}</span>`;
    marker.addEventListener("click", (event) => {
      event.stopPropagation();
      selectSpot(index, { load: true });
    });
    els.mapMarkers.append(marker);
  });

  if (active.custom && isInsideMapBounds(active.lat, active.lon)) {
    const point = latLonToMapPoint(active.lat, active.lon);
    const marker = document.createElement("span");
    marker.className = "custom-marker";
    marker.style.left = `${point.x * 100}%`;
    marker.style.top = `${point.y * 100}%`;
    marker.title = active.name;
    els.mapMarkers.append(marker);
  }

  if (state.pendingSpot && isInsideMapBounds(state.pendingSpot.lat, state.pendingSpot.lon)) {
    const point = latLonToMapPoint(state.pendingSpot.lat, state.pendingSpot.lon);
    const marker = document.createElement("span");
    marker.className = "pending-spot-marker";
    marker.style.left = `${point.x * 100}%`;
    marker.style.top = `${point.y * 100}%`;
    marker.innerHTML = pinIcon();
    els.mapMarkers.append(marker);
  }
}

function getMapMarkerEntries() {
  if (!isSeaMode()) return [];

  const entries = spots
    .map((spot, index) => ({ spot, index, point: latLonToMapPoint(spot.lat, spot.lon) }))
    .filter(({ spot, point }) => {
      return !spot.custom && spot.group?.startsWith("Méditerranée") && isInsideMapBounds(spot.lat, spot.lon) && isInsideMapViewport(point);
    });

  return entries.map((entry) => {
    const neighbors = entries.filter((other) => {
      const dx = other.point.x - entry.point.x;
      const dy = other.point.y - entry.point.y;
      return Math.hypot(dx, dy) < 0.04;
    });

    if (neighbors.length <= 1) return entry;

    const rank = neighbors.findIndex((neighbor) => neighbor.index === entry.index);
    const angle = (Math.PI * 2 * rank) / neighbors.length;
    const radius = Math.min(0.052, 0.014 + neighbors.length * 0.004);
    return {
      ...entry,
      point: {
        x: clamp(entry.point.x + Math.cos(angle) * radius, 0.01, 0.99),
        y: clamp(entry.point.y + Math.sin(angle) * radius, 0.01, 0.99),
      },
    };
  });
}

function changeMapZoom(delta, options = {}) {
  const currentZoom = state.leafletMap ? state.leafletMap.getZoom() : state.mapZoom;
  const nextZoom = clamp(currentZoom + delta, MAP_MIN_ZOOM, MAP_MAX_ZOOM);
  if (nextZoom === state.mapZoom) return;

  if (state.leafletMap) {
    state.mapZoom = nextZoom;

    if (options.anchorPoint) {
      const rect = els.spotMap.getBoundingClientRect();
      state.leafletMap.setZoomAround(
        L.point(options.anchorPoint.x * rect.width, options.anchorPoint.y * rect.height),
        nextZoom,
        { animate: false },
      );
    } else {
      state.leafletMap.setZoom(nextZoom, { animate: false });
    }

    syncLeafletState();
    return;
  }

  const active = getActiveSpot();
  const anchor = options.anchorPoint ? mapPointToLatLon(options.anchorPoint) : null;
  state.mapZoom = nextZoom;
  state.mapCenter = getZoomCenter(nextZoom, anchor, options.anchorPoint, active);
  state.mapTileKey = "";
  renderSpotTools();
}

function updateMapZoomControls() {
  const zoom = state.leafletMap ? state.leafletMap.getZoom() : state.mapZoom;
  els.spotMap.dataset.zoom = String(zoom);
  els.mapZoomOut.disabled = zoom <= MAP_MIN_ZOOM;
  els.mapZoomIn.disabled = zoom >= MAP_MAX_ZOOM;
}

function updateMapScale() {
  const rect = els.spotMap.getBoundingClientRect();
  const label = els.mapScale.querySelector("strong");
  const bar = els.mapScale.querySelector("span");
  const metersPerPixel = mapMetersPerCssPixel();
  const scale = chooseScaleDistance(metersPerPixel, Math.min(150, rect.width * 0.36));

  bar.style.width = `${Math.max(32, scale.width)}px`;
  label.textContent = formatScaleDistance(scale.meters);
}

function centerMapOn(lat, lon) {
  if (!isValidNumber(lat) || !isValidNumber(lon)) return;

  if (state.leafletMap) {
    state.mapCenter = { lat, lon };
    state.leafletMap.setView([lat, lon], state.mapZoom, { animate: false });
    return;
  }

  if (state.mapZoom <= MAP_BASE_ZOOM) return;
  state.mapCenter = { lat, lon };
  state.mapTileKey = "";
}

function getZoomCenter(zoom, anchor, anchorPoint, active) {
  if (zoom <= MAP_BASE_ZOOM) return null;

  if (anchor && anchorPoint) {
    return constrainMapCenter(centerFromAnchor(anchor, anchorPoint, zoom));
  }

  return constrainMapCenter({ lat: active.lat, lon: active.lon });
}

function startMapDrag(event) {
  if (event.target.closest(".map-marker, .map-control")) return;
  if (event.pointerType !== "touch" && event.button !== 0) return;

  if (event.cancelable) event.preventDefault();
  state.mapPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  rememberMapClickStart(event);
  els.spotMap.setPointerCapture?.(event.pointerId);

  if (state.mapPointers.size >= 2) {
    startMapPinch();
    return;
  }

  const center = getMapCenter();
  state.mapDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    startCenterPoint: projectLatLon(center.lat, center.lon, state.mapZoom),
    moved: false,
  };
}

function moveMapDrag(event) {
  if (!state.mapPointers.has(event.pointerId)) return;

  if (event.cancelable) event.preventDefault();
  state.mapPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (state.mapPointers.size >= 2) {
    moveMapPinch();
    return;
  }

  if (!state.mapDrag || state.mapDrag.pointerId !== event.pointerId) return;

  const dx = event.clientX - state.mapDrag.startX;
  const dy = event.clientY - state.mapDrag.startY;
  if (!state.mapDrag.moved && Math.hypot(dx, dy) < 4) return;

  state.mapDrag.moved = true;
  els.spotMap.classList.add("is-dragging");

  const rect = els.spotMap.getBoundingClientRect();
  const size = getHomeMapPixelSize();
  const centerX = state.mapDrag.startCenterPoint.x - (dx / rect.width) * size.width;
  const centerY = state.mapDrag.startCenterPoint.y - (dy / rect.height) * size.height;
  state.mapCenter = constrainMapCenter(unprojectLatLon(centerX, centerY, state.mapZoom));
  renderMapTiles();
  renderMapMarkers();
  updateMapZoomControls();
  updateMapScale();
}

function endMapDrag(event) {
  const wasPinching = Boolean(state.mapPinch);
  const wasDragging = Boolean(state.mapDrag?.moved);
  state.mapPointers.delete(event.pointerId);

  if (state.mapPointers.size < 2) {
    state.mapPinch = null;
  }

  if (!state.mapDrag || state.mapDrag.pointerId === event.pointerId) {
    state.mapDrag = null;
  }

  state.suppressNextMapClick = wasDragging || wasPinching;
  state.mapDrag = null;
  els.spotMap.classList.remove("is-dragging");
  els.spotMap.releasePointerCapture?.(event.pointerId);

  if (state.suppressNextMapClick) {
    window.setTimeout(() => {
      state.suppressNextMapClick = false;
    }, 200);
  }
}

function zoomMapFromWheel(event) {
  if (event.target.closest(".map-control")) return;

  event.preventDefault();
  changeMapZoom(event.deltaY < 0 ? 1 : -1, { anchorPoint: mapEventPoint(event) });
}

function startMapPinch() {
  const pair = getMapPointerPair();
  if (!pair) return;

  const midpoint = pointerMidpoint(pair);
  const anchorPoint = mapClientPoint(midpoint.x, midpoint.y);
  state.mapPinch = {
    anchor: mapPointToLatLon(anchorPoint),
    startDistance: Math.max(1, pointerDistance(pair)),
    startZoom: state.mapZoom,
  };
  state.mapDrag = null;
  state.suppressNextMapClick = true;
  els.spotMap.classList.add("is-dragging");
}

function moveMapPinch() {
  const pair = getMapPointerPair();
  if (!pair || !state.mapPinch) {
    startMapPinch();
    return;
  }

  const midpoint = pointerMidpoint(pair);
  const anchorPoint = mapClientPoint(midpoint.x, midpoint.y);
  const zoomDelta = Math.log2(pointerDistance(pair) / state.mapPinch.startDistance);
  const nextZoom = clamp(Math.round(state.mapPinch.startZoom + zoomDelta), MAP_MIN_ZOOM, MAP_MAX_ZOOM);

  state.mapZoom = nextZoom;
  state.mapCenter = getZoomCenter(nextZoom, state.mapPinch.anchor, anchorPoint, getActiveSpot());
  state.mapTileKey = "";
  state.suppressNextMapClick = true;
  renderMapTiles();
  renderMapMarkers();
  updateMapZoomControls();
  updateMapScale();
}

function getMapPointerPair() {
  const pointers = [...state.mapPointers.values()];
  if (pointers.length < 2) return null;
  return [pointers[0], pointers[1]];
}

function pointerDistance([a, b]) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function pointerMidpoint([a, b]) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

function rememberMapClickStart(event) {
  if (event.target.closest(".map-marker, .map-control")) return;
  state.mapClickStart = { x: event.clientX, y: event.clientY };
}

function preventMapTouchScroll(event) {
  if (event.target.closest(".map-control")) return;
  if (event.cancelable) event.preventDefault();
}

function toggleFavorite() {
  const active = getActiveSpot();

  if (hasFavorite(active.id)) {
    state.favorites = state.favorites.filter((favorite) => favorite.id !== active.id);
  } else {
    upsertFavorite({
      id: active.id,
      name: active.name,
      group: active.group,
      lat: active.lat,
      lon: active.lon,
      custom: active.custom,
      waterMode: state.waterMode,
    });
  }

  saveFavorites();
  renderSpotTools();
}

function upsertFavorite(favorite) {
  const normalizedFavorite = {
    ...favorite,
    waterMode: normalizeWaterMode(favorite.waterMode ?? state.waterMode),
  };
  const existingIndex = state.favorites.findIndex((item) => item.id === favorite.id);
  if (existingIndex >= 0) {
    state.favorites = state.favorites.map((item, index) => (index === existingIndex ? { ...item, ...normalizedFavorite } : item));
    return;
  }

  state.favorites = [normalizedFavorite, ...state.favorites];
}

function renderFavorites() {
  els.favoritesList.innerHTML = "";

  if (!state.favorites.length) {
    const empty = document.createElement("div");
    empty.className = "favorites-empty";
    empty.textContent = "Aucun favori";
    els.favoritesList.append(empty);
    return;
  }

  const active = getActiveSpot();
  state.favorites.forEach((favorite) => {
    const row = document.createElement("div");
    row.className = "favorite-item";

    if (state.renamingFavoriteId === favorite.id) {
      row.classList.add("is-editing");

      const form = document.createElement("form");
      form.className = "favorite-edit-form";

      const input = document.createElement("input");
      input.className = "favorite-name-input";
      input.type = "text";
      input.value = favorite.name;
      input.maxLength = 48;
      input.setAttribute("aria-label", `Nouveau nom pour ${favorite.name}`);

      const save = document.createElement("button");
      save.type = "submit";
      save.className = "favorite-action favorite-save";
      save.title = "Enregistrer";
      save.setAttribute("aria-label", `Enregistrer le nom de ${favorite.name}`);
      save.innerHTML = checkIcon();

      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.className = "favorite-action favorite-cancel";
      cancel.title = "Annuler";
      cancel.setAttribute("aria-label", "Annuler le renommage");
      cancel.innerHTML = closeIcon();
      cancel.addEventListener("click", () => {
        state.renamingFavoriteId = null;
        renderFavorites();
      });

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        renameFavorite(favorite.id, input.value);
      });

      row.append(form);
      form.append(input, save, cancel);
      els.favoritesList.append(row);
      window.requestAnimationFrame(() => {
        input.focus();
        input.select();
      });
      return;
    }

    const select = document.createElement("button");
    select.type = "button";
    select.className = "favorite-select";
    select.classList.toggle("is-active", favorite.id === active.id);
    select.innerHTML = `
      <strong>${escapeHtml(favorite.name)}</strong>
      <span>${escapeHtml(formatCoordinates(favorite.lat, favorite.lon))}</span>
    `;
    select.addEventListener("click", () => selectFavorite(favorite));

    const rename = document.createElement("button");
    rename.type = "button";
    rename.className = "favorite-action favorite-rename";
    rename.title = "Renommer";
    rename.setAttribute("aria-label", `Renommer ${favorite.name}`);
    rename.innerHTML = pencilIcon();
    rename.addEventListener("click", (event) => {
      event.stopPropagation();
      state.renamingFavoriteId = favorite.id;
      renderFavorites();
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "favorite-action favorite-remove";
    remove.title = "Retirer des favoris";
    remove.setAttribute("aria-label", `Retirer ${favorite.name} des favoris`);
    remove.innerHTML = trashIcon();
    remove.addEventListener("click", (event) => {
      event.stopPropagation();
      state.favorites = state.favorites.filter((item) => item.id !== favorite.id);
      if (state.renamingFavoriteId === favorite.id) state.renamingFavoriteId = null;
      saveFavorites();
      renderSpotTools();
    });

    row.append(select, rename, remove);
    els.favoritesList.append(row);
  });
}

function renameFavorite(id, name) {
  const nextName = sanitizeSpotName(name);
  if (!nextName) return;

  state.favorites = state.favorites.map((favorite) => (favorite.id === id ? { ...favorite, name: nextName } : favorite));
  state.renamingFavoriteId = null;
  saveFavorites();
  renderSpotTools();
}

function selectFavorite(favorite) {
  const favoriteMode = normalizeWaterMode(favorite.waterMode ?? state.waterMode);
  if (favoriteMode !== state.waterMode) {
    state.waterMode = favoriteMode;
    state.activeFishFilters = normalizeFishFilters(["all"]);
    state.activityFish = normalizeActivityFish(state.activityFish);
    populateActivityFish();
    applyWaterModeUI();
  }

  const knownIndex = spots.findIndex((spot) => spotFavoriteId(spot) === favorite.id);

  if (isSeaMode() && knownIndex >= 0) {
    selectSpot(knownIndex, { load: true });
    return;
  }

  setCustomSpot(favorite.lat, favorite.lon, { load: true, name: favorite.name });
}

function updateFavoriteButton() {
  const active = getActiveSpot();
  const favorite = hasFavorite(active.id);
  els.favoriteBtn.classList.toggle("is-active", favorite);
  els.favoriteBtn.setAttribute("aria-pressed", String(favorite));
  els.favoriteBtn.title = favorite ? "Retirer des favoris" : "Ajouter aux favoris";
  els.favoriteBtn.setAttribute("aria-label", els.favoriteBtn.title);
}

function getActiveSpot() {
  const preset = getSelectedPreset();
  const lat = Number(els.latitude.value);
  const lon = Number(els.longitude.value);
  const custom = Boolean(preset.custom);
  const id = custom ? coordinateFavoriteId(lat, lon) : spotFavoriteId(preset);
  const favorite = state.favorites.find((item) => item.id === id);
  const name = favorite?.name ?? (custom ? state.selectedSpotName || getCustomSpotName(lat, lon) : preset.name);

  return {
    id,
    name,
    group: custom ? "Spot personnalisé" : preset.group,
    lat,
    lon,
    custom,
  };
}

function spotFavoriteId(spot) {
  return `spot:${spot.name}`;
}

function coordinateFavoriteId(lat, lon) {
  return `coord:${Number(lat).toFixed(4)},${Number(lon).toFixed(4)}`;
}

function hasFavorite(id) {
  return state.favorites.some((favorite) => favorite.id === id);
}

function bindEvents() {
  els.modeButtons.forEach((button) => {
    button.addEventListener("click", () => setWaterMode(button.dataset.waterMode));
  });

  els.mobileTabButtons.forEach((button) => {
    button.addEventListener("click", () => setMobileView(button.dataset.mobileTab));
  });

  els.spotPanelButton.addEventListener("click", () => setSpotPanelOpen(!state.spotPanelOpen));
  els.spotPanelClose.addEventListener("click", () => setSpotPanelOpen(false));

  els.marineOverlayButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      setMarineOverlayMode(button.dataset.marineOverlay);
    });
  });

  els.spotPreset.addEventListener("change", () => {
    selectSpot(Number(els.spotPreset.value), { load: true });
  });

  els.spotForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.selectedSpotName = getSelectedPreset().custom ? getCustomSpotName() : getSelectedPreset().name;
    centerMapOn(Number(els.latitude.value), Number(els.longitude.value));
    setSpotPanelOpen(false);
    renderSpotTools();
    loadForecast();
  });

  els.depth.addEventListener("input", () => {
    if (!isSeaMode()) return;
    updateDepth();
    recomputeDepthSensitiveViews();
  });

  els.depth.addEventListener("change", () => {
    if (!isSeaMode()) return;
    loadForecast();
  });

  els.locateBtn.addEventListener("click", locateUser);
  els.favoriteBtn.addEventListener("click", toggleFavorite);
  ["click", "pointerdown", "touchstart", "wheel"].forEach((eventName) => {
    els.spotNameSheet.addEventListener(eventName, (event) => event.stopPropagation(), { passive: eventName === "touchstart" });
  });
  els.spotNameSheet.addEventListener("submit", (event) => {
    event.preventDefault();
    confirmPendingSpot();
  });
  els.spotNameInput.addEventListener("input", () => {
    if (state.pendingSpot) state.pendingSpot.name = els.spotNameInput.value;
  });
  els.spotNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSpotNameSheet();
  });
  els.spotNameClose.addEventListener("click", closeSpotNameSheet);
  els.spotNameCancel.addEventListener("click", closeSpotNameSheet);
  els.spotNameFavorite.addEventListener("click", () => confirmPendingSpot({ favorite: true }));

  if (!state.leafletMap) {
    els.spotMap.addEventListener("click", selectMapPoint);
    els.spotMap.addEventListener("pointerdown", startMapDrag);
    els.spotMap.addEventListener("mousedown", rememberMapClickStart);
    els.spotMap.addEventListener("pointermove", moveMapDrag);
    els.spotMap.addEventListener("pointerup", endMapDrag);
    els.spotMap.addEventListener("pointercancel", endMapDrag);
    els.spotMap.addEventListener("wheel", zoomMapFromWheel, { passive: false });
    els.spotMap.addEventListener("touchmove", preventMapTouchScroll, { passive: false });
    els.spotMap.addEventListener("gesturestart", preventMapTouchScroll, { passive: false });
    els.spotMap.addEventListener("gesturechange", preventMapTouchScroll, { passive: false });
  }
  els.mapZoomIn.addEventListener("click", (event) => {
    event.stopPropagation();
    changeMapZoom(1);
  });
  els.mapZoomOut.addEventListener("click", (event) => {
    event.stopPropagation();
    changeMapZoom(-1);
  });
  els.mapFullscreenButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    setMapFullscreen(!state.mapFullscreen);
  });
  els.mapLayersButton.addEventListener("click", (event) => {
    event.stopPropagation();
    setMapLayerOpen(!state.mapLayerOpen);
  });
  els.mapLayerClose.addEventListener("click", (event) => {
    event.stopPropagation();
    setMapLayerOpen(false);
  });
  els.mapLayerBackdrop.addEventListener("click", (event) => {
    event.stopPropagation();
    setMapLayerOpen(false);
  });
  ["pointerdown", "touchstart", "wheel"].forEach((eventName) => {
    els.mapLayerBackdrop.addEventListener(eventName, (event) => event.stopPropagation(), { passive: eventName === "touchstart" });
  });
  ["click", "pointerdown", "touchstart", "wheel"].forEach((eventName) => {
    els.mapLayerSheet.addEventListener(eventName, (event) => event.stopPropagation(), { passive: eventName === "touchstart" });
  });
  els.mapNauticalToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!isSeaMode()) return;
    state.nauticalEnabled = !state.nauticalEnabled;
    updateNauticalOverlay();
    saveSettings();
  });
  els.mapBathymetryToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!isSeaMode()) return;
    state.bathymetryEnabled = !state.bathymetryEnabled;
    renderBathymetryLayer();
    updateBathymetryOverlay();
    updateNauticalOverlay();
    saveSettings();
  });
  els.mapFishingToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    state.knownFishingEnabled = !state.knownFishingEnabled;
    if (!state.knownFishingEnabled) state.fishFilterOpen = false;
    renderFishFilterControls();
    renderKnownFishingMarkers();
    updateKnownFishingOverlay();
    saveSettings();
  });
  els.mapRegulationToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleRegulationOverlay();
  });
  els.anchorWatchBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleAnchorWatch();
  });
  els.fishFilterButton.addEventListener("click", (event) => {
    event.stopPropagation();
    state.fishFilterOpen = !state.fishFilterOpen;
    renderFishFilterControls();
  });
  els.fishFilterControl.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  els.activityFish.addEventListener("change", () => {
    state.activityFish = normalizeActivityFish(els.activityFish.value);
    if (els.catchSpecies) els.catchSpecies.value = state.activityFish;
    renderAll();
    saveSettings();
  });
  els.catchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const entry = saveCatchLogEntry(createCatchLogEntry({
      species: els.catchSpecies.value || state.activityFish,
      measurements: {
        lengthCm: readOptionalNumber(els.catchLength.value),
        weightKg: readOptionalNumber(els.catchWeight.value),
      },
      notes: els.catchNotes.value.trim(),
    }));

    if (!entry) return;
    els.catchLength.value = "";
    els.catchWeight.value = "";
    els.catchNotes.value = "";
    renderCatchJournal();
  });
  els.catchLogList?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const deleteButton = target.closest("[data-catch-delete]");
    if (!deleteButton) return;
    deleteCatchLogEntry(deleteButton.dataset.catchDelete);
    renderCatchJournal();
  });
  ["input", "change"].forEach((eventName) => {
    els.riggingForm?.addEventListener(eventName, () => {
      state.riggingDirty = true;
      updateRiggingRecommendation();
    });
  });
  els.riggingAutoFill?.addEventListener("click", () => {
    state.riggingDirty = false;
    fillRiggingFromConditions(getSelectedDay());
    updateRiggingRecommendation();
  });
  document.addEventListener("click", () => {
    if (!state.fishFilterOpen) return;
    state.fishFilterOpen = false;
    renderFishFilterControls();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.mapFullscreen) {
      setMapFullscreen(false);
      return;
    }
    if (event.key === "Escape" && state.mapLayerOpen) {
      setMapLayerOpen(false);
    }
  });

  [els.latitude, els.longitude].forEach((input) => {
    input.addEventListener("change", () => {
      if (getSelectedPreset().custom) {
        state.selectedSpotName = getCustomSpotName();
      }
      centerMapOn(Number(els.latitude.value), Number(els.longitude.value));
      renderSpotTools();
    });
  });

  document.querySelectorAll("[data-chart]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled || button.hidden) return;
      state.activeChart = button.dataset.chart;
      document.querySelectorAll("[data-chart]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      renderChart();
    });
  });

  window.addEventListener("resize", () => {
    applyMobileNavigationUI();
    if (!isMobileLayout() && state.mapFullscreen) {
      setMapFullscreen(false);
    }
    drawCompass();
    renderActivity(getSelectedDay());
    renderChart();
    updateMapScale();
  });
}

function updateDepth() {
  state.depth = Number(els.depth.value);
  els.depthOutput.value = `${state.depth} m`;
}

function recomputeDepthSensitiveViews() {
  state.realDepthAvailable = false;
  state.hours = state.hours.map((row) => applyEstimatedDepth(row));
  state.days = buildDailySummaries(state.hours);
  renderAll();
  saveSettings();
}

async function loadForecast() {
  const lat = Number(els.latitude.value);
  const lon = Number(els.longitude.value);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    setStatus("Coordonnées invalides", "error");
    return;
  }

  setStatus("Chargement", "loading");
  saveSettings();

  try {
    const weather = await fetchJson(buildWeatherUrl(lat, lon));
    const marine = isSeaMode() ? await fetchJson(buildMarineUrl(lat, lon)) : null;

    state.hours = mergeHourlyData(weather, marine);
    state.days = buildDailySummaries(state.hours);
    state.selectedDate = state.days[0]?.date ?? "";

    if (!state.days.length) {
      throw new Error("Aucune donnée horaire exploitable pour ce spot.");
    }

    renderAll();
    const realDepthApplied = isSeaMode() ? await loadRealDepthCurrents(lat, lon) : false;
    setStatus(realDepthApplied ? "Copernicus" : "À jour", "ready");
  } catch (error) {
    console.error(error);
    setStatus("Erreur", "error");
    els.metricGrid.innerHTML = `<article class="metric-card metric-card-wide"><strong class="metric-value">Données indisponibles</strong><span class="metric-detail">${escapeHtml(error.message)}</span></article>`;
  }
}

function buildWeatherUrl(lat, lon) {
  const url = new URL(WEATHER_API);
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set(
    "hourly",
    "temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,pressure_msl,cloud_cover,precipitation",
  );
  url.searchParams.set("daily", "wind_speed_10m_max,wind_direction_10m_dominant,sunrise,sunset");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("wind_speed_unit", "kn");
  return url;
}

function buildMarineUrl(lat, lon) {
  const url = new URL(MARINE_API);
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set("hourly", [
    "wave_height",
    "wave_direction",
    "wave_period",
    "swell_wave_height",
    "swell_wave_direction",
    "ocean_current_velocity",
    "ocean_current_direction",
    "sea_surface_temperature",
    "sea_level_height_msl",
  ].join(","));
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("cell_selection", "sea");
  return url;
}

async function fetchJson(url) {
  const response = await fetch(url);
  const payload = await response.json();

  if (!response.ok || payload.error) {
    throw new Error(payload.reason || `Erreur API ${response.status}`);
  }

  return payload;
}

async function loadRealDepthCurrents(lat, lon) {
  if (!isSeaMode() || !state.hours.length) return false;

  try {
    const url = buildDepthCurrentUrl(lat, lon);
    const response = await fetch(url);
    if (!response.ok) {
      state.realDepthAvailable = false;
      return false;
    }

    const payload = await response.json();
    if (!payload.ok || !Array.isArray(payload.hours) || !payload.hours.length) {
      state.realDepthAvailable = false;
      return false;
    }

    state.hours = applyRealDepthData(state.hours, payload);
    state.days = buildDailySummaries(state.hours);
    state.realDepthAvailable = true;
    renderAll();
    return true;
  } catch (error) {
    console.info("Courant profondeur réel indisponible, estimation conservée.", error);
    state.realDepthAvailable = false;
    return false;
  }
}

function buildDepthCurrentUrl(lat, lon) {
  const start = state.hours[0]?.time;
  const end = state.hours.at(-1)?.time;
  const url = new URL("/api/depth-current", window.location.origin);
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set("depth", state.depth.toFixed(1));
  url.searchParams.set("start", start);
  url.searchParams.set("end", end);
  return url;
}

function applyRealDepthData(hours, payload) {
  const points = payload.hours
    .map((point) => ({
      ...point,
      timeMs: point.time ? Date.parse(point.time) : Number.NaN,
      date: point.time?.slice(0, 10),
    }))
    .filter((point) => isValidNumber(point.speedKt) && isValidNumber(point.direction));
  const dailyMode = payload.temporalResolution === "daily" || points.length <= state.days.length + 1;
  const byDate = groupPointsByDate(points);

  return hours.map((row) => {
    const match = dailyMode ? byDate.get(row.date)?.[0] : nearestPoint(row, points);
    if (!match) return row;

    return {
      ...row,
      depthCurrent: match.speedKt,
      depthDirection: match.direction,
      depthSource: "copernicus",
      actualDepth: match.depth ?? payload.actualDepth ?? state.depth,
      depthDataset: payload.datasetId ?? null,
    };
  });
}

function applyEstimatedDepth(row) {
  const depthFactorValue = depthFactor(state.depth);
  return {
    ...row,
    depthCurrent: row.surfaceCurrent == null ? null : row.surfaceCurrent * depthFactorValue,
    depthDirection: estimatedDepthDirection(row.currentDirection, state.depth),
    depthSource: "estimate",
    actualDepth: state.depth,
    depthDataset: null,
  };
}

function mergeHourlyData(weather, marine) {
  const weatherByTime = new Map();
  const weatherHourly = weather.hourly ?? {};
  const weatherDaily = weather.daily ?? {};
  const marineHourly = marine?.hourly ?? {};
  const timeline = marineHourly.time?.length ? marineHourly.time : weatherHourly.time ?? [];
  const dailyByDate = new Map();

  (weatherDaily.time ?? []).forEach((date, index) => {
    dailyByDate.set(date, {
      sunrise: weatherDaily.sunrise?.[index] ?? null,
      sunset: weatherDaily.sunset?.[index] ?? null,
    });
  });

  (weatherHourly.time ?? []).forEach((time, index) => {
    weatherByTime.set(time, {
      airTemperature: valueAt(weatherHourly.temperature_2m, index),
      windSpeed: valueAt(weatherHourly.wind_speed_10m, index),
      windDirection: valueAt(weatherHourly.wind_direction_10m, index),
      windGust: valueAt(weatherHourly.wind_gusts_10m, index),
      pressure: valueAt(weatherHourly.pressure_msl, index),
      cloudCover: valueAt(weatherHourly.cloud_cover, index),
      precipitation: valueAt(weatherHourly.precipitation, index),
    });
  });

  return timeline.map((time, index) => {
    const weatherRow = weatherByTime.get(time) ?? {};
    const date = time.slice(0, 10);
    const daylight = dailyByDate.get(date) ?? {};
    const currentKmh = valueAt(marineHourly.ocean_current_velocity, index);
    const surfaceCurrent = currentKmh == null ? null : currentKmh * 0.539957;
    const depthFactorValue = depthFactor(state.depth);

    return {
      time,
      date,
      hour: time.slice(11, 16),
      airTemperature: weatherRow.airTemperature ?? null,
      windSpeed: weatherRow.windSpeed ?? null,
      windDirection: weatherRow.windDirection ?? null,
      windGust: weatherRow.windGust ?? null,
      pressure: weatherRow.pressure ?? null,
      cloudCover: weatherRow.cloudCover ?? null,
      precipitation: weatherRow.precipitation ?? null,
      waveHeight: valueAt(marineHourly.wave_height, index),
      waveDirection: valueAt(marineHourly.wave_direction, index),
      wavePeriod: valueAt(marineHourly.wave_period, index),
      swellHeight: valueAt(marineHourly.swell_wave_height, index),
      swellDirection: valueAt(marineHourly.swell_wave_direction, index),
      surfaceCurrent,
      currentDirection: valueAt(marineHourly.ocean_current_direction, index),
      depthCurrent: surfaceCurrent == null ? null : surfaceCurrent * depthFactorValue,
      depthDirection: estimatedDepthDirection(valueAt(marineHourly.ocean_current_direction, index), state.depth),
      depthSource: "estimate",
      actualDepth: state.depth,
      depthDataset: null,
      seaTemperature: valueAt(marineHourly.sea_surface_temperature, index),
      seaLevel: valueAt(marineHourly.sea_level_height_msl, index),
      sunrise: daylight.sunrise,
      sunset: daylight.sunset,
    };
  });
}

function buildDailySummaries(hours) {
  const days = groupBy(hours, "date");

  return Object.entries(days).map(([date, rows]) => {
    const windAvg = average(pluck(rows, "windSpeed"));
    const waveAvg = average(pluck(rows, "waveHeight"));
    const currentAvg = average(pluck(rows, "surfaceCurrent"));
    const surfaceCurrentDirection = circularMean(pluck(rows, "currentDirection"), pluck(rows, "surfaceCurrent"));
    const realDepthRows = rows.filter((row) => row.depthSource === "copernicus" && isValidNumber(row.depthCurrent));
    const depthRows = realDepthRows.length ? realDepthRows : rows;
    const depthCurrent = average(pluck(depthRows, "depthCurrent"));
    const depthDir = circularMean(pluck(depthRows, "depthDirection"), pluck(depthRows, "depthCurrent"));
    const hourlyScores = rows.map((row) => scoreHour(row));
    const depthSource = realDepthRows.length ? "copernicus" : "estimate";

    return {
      date,
      label: formatDayLabel(date),
      shortLabel: formatShortDay(date),
      rows,
      windAvg,
      windMax: max(pluck(rows, "windSpeed")),
      windGustMax: max(pluck(rows, "windGust")),
      windDirection: circularMean(pluck(rows, "windDirection"), pluck(rows, "windSpeed")),
      airTemperature: average(pluck(rows, "airTemperature")),
      pressureAvg: average(pluck(rows, "pressure")),
      pressureTrend: pressureTrend(rows),
      precipitationTotal: sum(pluck(rows, "precipitation")),
      cloudCoverAvg: average(pluck(rows, "cloudCover")),
      waveAvg,
      waveMax: max(pluck(rows, "waveHeight")),
      waveDirection: circularMean(pluck(rows, "waveDirection"), pluck(rows, "waveHeight")),
      wavePeriod: average(pluck(rows, "wavePeriod")),
      swellAvg: average(pluck(rows, "swellHeight")),
      swellDirection: circularMean(pluck(rows, "swellDirection"), pluck(rows, "swellHeight")),
      surfaceCurrent: currentAvg,
      surfaceCurrentDirection,
      depthCurrent,
      depthDirection: depthDir,
      depthSource,
      actualDepth: average(pluck(realDepthRows, "actualDepth")) ?? state.depth,
      depthDataset: realDepthRows[0]?.depthDataset ?? null,
      seaTemperature: average(pluck(rows, "seaTemperature")),
      seaTemperatureTrend: valueDelta(pluck(rows, "seaTemperature")),
      seaTemperatureRange: valueRange(pluck(rows, "seaTemperature")),
      seaLevelMin: min(pluck(rows, "seaLevel")),
      seaLevelMax: max(pluck(rows, "seaLevel")),
      seaLevelRange: valueRange(pluck(rows, "seaLevel")),
      tideEvents: tideEvents(rows),
      turbidity: turbidityEstimate(rows),
      score: Math.round(average(hourlyScores) ?? 0),
      bestWindow: bestWindow(rows),
    };
  });
}

function renderAll() {
  const selected = getSelectedDay();
  updateSpotMeta();
  renderSpotTools();
  renderDayTabs();
  renderActivity(selected);
  renderConditionBrief(selected);
  renderMetrics(selected);
  renderWaterInsights(selected);
  renderRiggingCalculator(selected);
  drawCompass();
  renderChart();
  renderCatchJournal();
  renderMarineOverlay();
}

function updateSpotMeta() {
  const lat = Number(els.latitude.value);
  const lon = Number(els.longitude.value);
  const name = getActiveSpot().name;
  const coords = formatCoordinates(lat, lon);
  els.spotMeta.textContent = `${waterModeConfig[state.waterMode].metaPrefix} · ${name} · ${coords}`;
  if (els.spotSummaryName) els.spotSummaryName.textContent = name;
  if (els.spotSummaryCoords) els.spotSummaryCoords.textContent = coords;
}

function renderDayTabs() {
  els.dayTabs.innerHTML = "";
  els.dayTabs.classList.toggle("is-forecast-expanded", state.forecastExpanded);
  const days = state.days.slice(0, 6);

  if (!days.length) {
    els.dayTabs.innerHTML = `
      <div class="forecast-strip-head">
        <div>
          <span class="eyebrow">Prévision</span>
          <h2>Prévisions 6 jours</h2>
        </div>
      </div>
      <div class="forecast-strip-empty">Prévisions indisponibles</div>
    `;
    return;
  }

  const header = document.createElement("div");
  header.className = "forecast-strip-head";
  header.innerHTML = `
    <div>
      <span class="eyebrow">Prévision</span>
      <h2>Prévisions 6 jours</h2>
    </div>
    <button class="ghost-button forecast-expand-toggle" type="button" data-forecast-toggle aria-expanded="${state.forecastExpanded}">
      ${state.forecastExpanded ? "Réduire" : "Agrandir"}
    </button>
  `;
  header.querySelector("[data-forecast-toggle]")?.addEventListener("click", () => {
    setForecastExpanded(!state.forecastExpanded);
  });

  const grid = document.createElement("div");
  grid.className = "forecast-strip-grid";

  days.forEach((day) => {
    const activityScore = dayActivityScore(day);
    const weather = dailyWeatherIcon(day);
    const waterTemperature = dailyWaterTemperature(day);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "day-tab";
    button.classList.toggle("is-active", day.date === state.selectedDate);
    button.setAttribute("aria-pressed", String(day.date === state.selectedDate));
    button.innerHTML = `
      <span class="day-tab-date">
        <strong>${escapeHtml(formatWeekday3(day.date))}</strong>
        <em>${escapeHtml(formatShortDateNoWeekday(day.date))}</em>
      </span>
      <i class="ti ${weather.icon} day-tab-weather" aria-hidden="true"></i>
      <span class="day-tab-temperatures">
        <span>Air ${escapeHtml(formatTemperatureBrief(day.airTemperature))}</span>
        <span>Eau ${escapeHtml(formatTemperatureBrief(waterTemperature))}</span>
      </span>
      <span class="day-tab-stats">
        ${forecastConditionRows(day).map((row) => `
          <span>
            <b>${escapeHtml(state.forecastExpanded ? row.label : row.short)}</b>
            <em>${escapeHtml(row.value)}</em>
          </span>
        `).join("")}
      </span>
      <span class="day-tab-score ${scoreClass(activityScore)}">${activityScore}</span>
    `;
    button.addEventListener("click", () => {
      state.selectedDate = day.date;
      if (isMobileLayout()) state.forecastExpanded = true;
      renderAll();
    });
    grid.append(button);
  });

  els.dayTabs.append(header, grid);
}

function forecastConditionRows(day) {
  return isSeaMode()
    ? [
        { short: "V", label: "Vent", value: `${formatNumber(day.windAvg, 0)} kt` },
        { short: "C", label: "Courant", value: `${formatNumber(day.surfaceCurrent, 1)} kt` },
        { short: "H", label: "Houle", value: `${formatNumber(day.waveAvg, 1)} m` },
      ]
    : [
        { short: "V", label: "Vent", value: `${formatNumber(day.windAvg, 0)} kt` },
        { short: "P", label: "Pression", value: `${formatNumber(day.pressureAvg, 0)} hPa` },
        { short: "Pl", label: "Pluie", value: `${formatNumber(day.precipitationTotal, 1)} mm` },
      ];
}

function renderActivity(day) {
  if (!day) {
    els.activityScore.textContent = "--";
    els.activityLabel.textContent = "--";
    els.activityContext.textContent = "--";
    els.activityReasons.innerHTML = "";
    els.activityMajor.textContent = "--";
    els.activityMinor.textContent = "--";
    drawEmptyActivityChart();
    return;
  }

  const fish = normalizeActivityFish(state.activityFish);
  const rows = activityRows(day, fish);
  const highlighted = highlightedActivityIndex(day, rows);
  const highlightedRow = rows[highlighted] ?? rows[0];
  const averageScore = Math.round(average(rows.map((row) => row.score)) ?? 0);
  const windows = solunarWindows(day);

  els.activityScore.textContent = String(averageScore);
  els.activityRing.style.setProperty("--activity-score", averageScore);
  els.activityLabel.textContent = activityLabel(averageScore);
  els.activityContext.textContent = `${fishActivityProfiles[fish].label} · ${highlightedRow?.hour ?? "--"} · ${activityLabel(highlightedRow?.score ?? averageScore).toLowerCase()}`;
  els.activityMajor.textContent = `${windows.major.map((window) => window.label).join(" · ")} · estimation`;
  els.activityMinor.textContent = `${windows.minor.map((window) => window.label).join(" · ")} · estimation`;
  renderActivityReasons(highlightedRow ?? rows[0], fish);
  drawActivityChart(day, rows, highlighted);
}

function renderActivityReasons(row, fish) {
  els.activityReasons.innerHTML = "";
  activityReasons(row, fish).forEach((reason) => {
    const item = document.createElement("span");
    item.className = `activity-reason ${reason.type ?? ""}`.trim();
    item.textContent = reason.label;
    els.activityReasons.append(item);
  });
}

function dayActivityScore(day) {
  return Math.round(average(activityRows(day, state.activityFish).map((row) => row.score)) ?? 0);
}

function activityRows(day, fish) {
  const windows = solunarWindows(day);
  return day.rows.map((row) => {
    const activity = fishActivityForHour(row, fish, windows);
    return {
      ...row,
      activity,
      score: activity.score,
    };
  });
}

function fishActivityForHour(row, fish, windows = solunarWindows({ date: row.date, rows: [row] })) {
  const profile = fishActivityProfiles[normalizeActivityFish(fish)];
  const temperature = isSeaMode() ? row.seaTemperature : row.airTemperature;
  const currentScore = rangeScore(row.surfaceCurrent, profile.current);
  const waveScore = rangeScore(row.waveHeight, profile.wave);
  const temperatureScore = rangeScore(temperature, profile.temp);
  const light = lightActivityScore(row, profile.light);
  const solunar = solunarActivityScore(row, windows);
  const weather = weatherActivityScore(row);
  const pressureScore = isValidNumber(row.pressure) ? rangeScore(row.pressure, [1006, 1016, 1028]) : 60;
  const rainScore = clamp(100 - (row.precipitation ?? 0) * 55, 0, 100);
  const score = Math.round(
    isSeaMode()
      ? solunar * 0.25 +
          light * 0.17 +
          currentScore * profile.currentWeight +
          waveScore * 0.12 +
          weather * 0.1 +
          temperatureScore * 0.08
      : solunar * 0.24 + light * 0.2 + pressureScore * 0.22 + weather * 0.16 + temperatureScore * 0.12 + rainScore * 0.06,
  );

  return {
    score: clamp(score, 0, 100),
    parts: {
      solunar,
      light,
      current: currentScore,
      wave: waveScore,
      weather,
      temperature: temperatureScore,
      pressure: pressureScore,
      rain: rainScore,
    },
  };
}

function activityReasons(row, fish) {
  if (!row) return [];

  const profile = fishActivityProfiles[normalizeActivityFish(fish)];
  const parts = row.activity?.parts ?? fishActivityForHour(row, fish).parts;
  const reasons = [];

  if (isSeaMode()) {
    if (parts.current >= 72) reasons.push({ label: "Courant favorable" });
    else if (parts.current <= 38) reasons.push({ label: "Courant peu idéal", type: "warn" });
  } else {
    if (parts.pressure >= 72) reasons.push({ label: "Pression favorable" });
    else if (parts.pressure <= 38) reasons.push({ label: "Pression peu idéale", type: "warn" });
  }

  if (parts.light >= 72) reasons.push({ label: "Lumière favorable" });
  if (parts.solunar >= 72) reasons.push({ label: "Fenêtre solunar" });

  if (isSeaMode()) {
    if (parts.wave <= 38) reasons.push({ label: "Mer moins adaptée", type: "warn" });
    else if (parts.wave >= 72) reasons.push({ label: "Houle correcte" });
  } else if (parts.rain <= 38) {
    reasons.push({ label: "Pluie récente pénalisante", type: "warn" });
  }

  if (parts.weather <= 42) reasons.push({ label: "Vent/météo pénalisants", type: "bad" });
  if (parts.temperature >= 72) reasons.push({ label: isSeaMode() ? `Eau OK ${profile.label}` : `Température OK ${profile.label}` });

  return reasons.slice(0, 4);
}

function highlightedActivityIndex(day, rows) {
  const today = new Date().toISOString().slice(0, 10);
  if (day.date !== today) {
    return rows.reduce((best, row, index) => (row.score > (rows[best]?.score ?? -1) ? index : best), 0);
  }

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let bestIndex = 0;
  let bestDiff = Infinity;
  rows.forEach((row, index) => {
    const diff = Math.abs(minutesFromClock(row.hour) - nowMinutes);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = index;
    }
  });
  return bestIndex;
}

function drawEmptyActivityChart() {
  const ctx = setupCanvas(els.activityCanvas);
  const width = els.activityCanvas.clientWidth;
  const height = els.activityCanvas.clientHeight;
  ctx.clearRect(0, 0, width, height);
}

function drawActivityChart(day, rows, highlightedIndex) {
  const canvas = els.activityCanvas;
  const ctx = setupCanvas(canvas);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const padding = { top: 22, right: 18, bottom: 34, left: 58 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fbfdfb";
  roundRect(ctx, 0, 0, width, height, 8);
  ctx.fill();

  const zones = [
    { label: "Haute", value: 75 },
    { label: "Moyenne", value: 50 },
    { label: "Faible", value: 25 },
  ];

  ctx.strokeStyle = "#d9e2dc";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#62706a";
  ctx.font = "800 11px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  zones.forEach((zone) => {
    const y = padding.top + chartHeight - (zone.value / 100) * chartHeight;
    ctx.beginPath();
    ctx.setLineDash([5, 6]);
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillText(zone.label, 8, y);
  });

  if (!rows.length) return;

  const pointX = (index) => padding.left + (rows.length <= 1 ? 0 : (index / (rows.length - 1)) * chartWidth);
  const pointY = (score) => padding.top + chartHeight - (score / 100) * chartHeight;

  const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
  gradient.addColorStop(0, "rgba(8, 125, 114, 0.32)");
  gradient.addColorStop(1, "rgba(8, 125, 114, 0.04)");

  ctx.beginPath();
  rows.forEach((row, index) => {
    const x = pointX(index);
    const y = pointY(row.score);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(pointX(rows.length - 1), padding.top + chartHeight);
  ctx.lineTo(pointX(0), padding.top + chartHeight);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  rows.forEach((row, index) => {
    const x = pointX(index);
    const y = pointY(row.score);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#087d72";
  ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke();

  const highlighted = rows[highlightedIndex];
  if (highlighted) {
    const x = pointX(highlightedIndex);
    const y = pointY(highlighted.score);
    ctx.fillStyle = "#c85c45";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = "#62706a";
  ctx.font = "700 11px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  rows.forEach((row, index) => {
    if (index % 4 !== 0 && index !== rows.length - 1) return;
    ctx.fillText(row.hour, pointX(index), height - padding.bottom + 13);
  });

  ctx.fillStyle = "#17201d";
  ctx.font = "800 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`${fishActivityProfiles[normalizeActivityFish(state.activityFish)].label} · ${day.shortLabel}`, padding.left, padding.top - 10);
}

function activityLabel(score) {
  if (score >= 78) return "Très bonne activité";
  if (score >= 62) return "Bonne activité";
  if (score >= 42) return "Activité moyenne";
  if (score >= 24) return "Faible activité";
  return "Très faible activité";
}

function renderConditionBrief(day) {
  if (!els.conditionBrief) return;

  if (!day) {
    els.conditionDecision.textContent = "--";
    els.conditionReason.textContent = "Données indisponibles.";
    els.conditionScore.textContent = "--";
    els.conditionFacts.innerHTML = "";
    return;
  }

  const score = dayActivityScore(day);
  const decision = conditionDecision(day, score);
  const facts = conditionFacts(day, score);

  els.conditionDecision.textContent = decision.title;
  els.conditionReason.textContent = decision.detail;
  els.conditionScore.textContent = String(score);
  els.conditionFacts.innerHTML = "";
  els.conditionBrief.classList.toggle("is-good", decision.tone === "good");
  els.conditionBrief.classList.toggle("is-warn", decision.tone === "warn");
  els.conditionBrief.classList.toggle("is-bad", decision.tone === "bad");

  facts.forEach((fact) => {
    const item = document.createElement("span");
    item.className = `condition-fact ${fact.tone ?? ""}`.trim();
    item.innerHTML = `<strong>${escapeHtml(fact.label)}</strong>${escapeHtml(fact.value)}`;
    els.conditionFacts.append(item);
  });
}

function conditionDecision(day, score) {
  const best = day.bestWindow?.label ?? "--";

  if (isSeaMode()) {
    const roughSea = (day.waveMax ?? day.waveAvg ?? 0) >= 1.4 || (day.windGustMax ?? 0) >= 28;
    const cleanWindow = score >= 62 && (day.windAvg ?? 99) <= 12 && (day.waveAvg ?? 99) <= 0.8;

    if (roughSea) {
      return {
        tone: "bad",
        title: "Sortie prudente",
        detail: `Mer ou rafales à surveiller. Si tu sors, vise ${best} et garde une zone abritée.`,
      };
    }

    if (cleanWindow) {
      return {
        tone: "good",
        title: "Créneau intéressant",
        detail: `Activité correcte avec météo exploitable. Priorité au créneau ${best}.`,
      };
    }

    if (score < 42) {
      return {
        tone: "warn",
        title: "Activité limitée",
        detail: `Conditions praticables, mais le poisson risque d'être discret. Cherche les bordures actives autour de ${best}.`,
      };
    }

    return {
      tone: "warn",
      title: "Conditions correctes",
      detail: `Sortie possible, à affiner avec courant, houle et exposition du spot. Meilleur repère: ${best}.`,
    };
  }

  const heavyRain = (day.precipitationTotal ?? 0) >= 8 || day.turbidity?.score >= 62;
  const pressureDrop = (day.pressureTrend ?? 0) <= -3;

  if (heavyRain) {
    return {
      tone: "bad",
      title: "Eau à surveiller",
      detail: `Pluie ou turbidité élevée: privilégie les zones calmes, arrivées d'eau et bordures abritées.`,
    };
  }

  if (score >= 62 || pressureDrop) {
    return {
      tone: "good",
      title: "Fenêtre carnassier",
      detail: `Pression et lumière intéressantes. Priorité au créneau ${best}.`,
    };
  }

  if (score < 42) {
    return {
      tone: "warn",
      title: "Activité douce",
      detail: `Pêche plus lente probable. Réduis les animations et cible les postes marqués.`,
    };
  }

  return {
    tone: "warn",
    title: "Conditions stables",
    detail: `Sortie possible, sans signal fort. Cherche les changements de profondeur et les zones d'ombre.`,
  };
}

function conditionFacts(day, score) {
  const facts = [
    {
      label: "Score",
      value: `${score}/100`,
      tone: scoreClass(score),
    },
    {
      label: "Créneau",
      value: day.bestWindow?.label ?? "--",
    },
  ];

  if (isSeaMode()) {
    facts.push(
      {
        label: "Vent",
        value: `${formatNumber(day.windAvg, 0)} kt`,
        tone: (day.windAvg ?? 0) >= 16 ? "warn" : "",
      },
      {
        label: "Houle",
        value: `${formatNumber(day.waveAvg, 1)} m`,
        tone: (day.waveAvg ?? 0) >= 1 ? "warn" : "",
      },
      {
        label: "Courant",
        value: `${formatNumber(day.surfaceCurrent, 1)} kt`,
      },
    );
  } else {
    facts.push(
      {
        label: "Pression",
        value: formatPressureTrend(day.pressureTrend).replace("tendance ", ""),
        tone: (day.pressureTrend ?? 0) <= -3 ? "" : "warn",
      },
      {
        label: "Pluie",
        value: `${formatNumber(day.precipitationTotal, 1)} mm`,
        tone: (day.precipitationTotal ?? 0) >= 8 ? "bad" : "",
      },
      {
        label: "Eau",
        value: day.turbidity?.label ?? "--",
        tone: day.turbidity?.score >= 62 ? "bad" : "",
      },
    );
  }

  return facts;
}

function renderMetrics(day) {
  if (!day) {
    els.metricGrid.innerHTML = "";
    return;
  }

  const metrics = isSeaMode()
    ? [
        {
          label: "Courant surface",
          shortLabel: "Surface",
          value: `${formatNumber(day.surfaceCurrent, 1)} kt`,
          detail: `vers ${compassLabel(day.surfaceCurrentDirection)} · moy. journée`,
          color: "current",
          icon: currentIcon(),
        },
        {
          label: "Courant profondeur",
          shortLabel: "Profondeur",
          value: `${formatNumber(day.depthCurrent, 1)} kt`,
          detail: depthDetail(day),
          color: "depth",
          icon: depthIcon(),
        },
        {
          label: "Houle totale",
          shortLabel: "Houle",
          value: `${formatNumber(day.waveAvg, 1)} m`,
          detail: `de ${compassLabel(day.waveDirection)} · ${formatNumber(day.wavePeriod, 0)} s`,
          color: "wave",
          icon: waveIcon(),
        },
        {
          label: "Vent moyen",
          shortLabel: "Vent",
          value: `${formatNumber(day.windAvg, 0)} kt`,
          detail: `de ${compassLabel(day.windDirection)} · raf. ${formatNumber(day.windGustMax, 0)} kt`,
          color: "wind",
          icon: windIcon(),
        },
      ]
    : [
        {
          label: "Vent moyen",
          shortLabel: "Vent",
          value: `${formatNumber(day.windAvg, 0)} kt`,
          detail: `de ${compassLabel(day.windDirection)} · raf. ${formatNumber(day.windGustMax, 0)} kt`,
          color: "wind",
          icon: windIcon(),
        },
        {
          label: "Pression",
          shortLabel: "Pression",
          value: `${formatNumber(day.pressureAvg, 0)} hPa`,
          detail: `${formatPressureTrend(day.pressureTrend)} · moyenne journée`,
          color: "pressure",
          icon: pressureIcon(),
        },
        {
          label: "Pluie 24h",
          shortLabel: "Pluie",
          value: `${formatNumber(day.precipitationTotal, 1)} mm`,
          detail: "indice turbidité à affiner au Ticket 5",
          color: "rain",
          icon: rainIcon(),
        },
        {
          label: "Nuages",
          shortLabel: "Nuages",
          value: `${formatNumber(day.cloudCoverAvg, 0)} %`,
          detail: `air ${formatNumber(day.airTemperature, 1)} °C · moyenne`,
          color: "cloud",
          icon: cloudIcon(),
        },
      ];

  els.metricGrid.innerHTML = "";
  metrics.forEach((metric) => {
    const fragment = els.metricTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".metric-card");
    const icon = fragment.querySelector(".metric-icon");
    const label = fragment.querySelector(".metric-label");
    const value = fragment.querySelector(".metric-value");
    const detail = fragment.querySelector(".metric-detail");

    icon.style.background = colorWash(colors[metric.color]);
    icon.style.color = colors[metric.color];
    icon.innerHTML = metric.icon;
    label.textContent = metric.label;
    label.dataset.shortLabel = metric.shortLabel ?? metric.label;
    value.textContent = metric.value;
    detail.textContent = metric.detail;
    card.style.borderTopColor = colors[metric.color];
    els.metricGrid.append(fragment);
  });

  els.bestWindow.textContent = day.bestWindow.label;
}

function renderWaterInsights(day) {
  if (!els.waterInsights) return;

  if (!day) {
    els.waterInsights.innerHTML = "";
    return;
  }

  const insights = isSeaMode()
    ? [
        {
          label: "SST",
          value: `${formatNumber(day.seaTemperature, 1)} °C`,
          detail: seaTemperatureDetail(day),
        },
        {
          label: "Front thermique",
          value: thermalFrontLabel(day.seaTemperatureRange),
          detail: `écart jour ${formatNumber(day.seaTemperatureRange, 1)} °C`,
        },
        {
          label: "Marée",
          value: tideRangeLabel(day.seaLevelRange),
          detail: tideSummary(day),
        },
      ]
    : [
        {
          label: "Turbidité",
          value: day.turbidity.label,
          detail: day.turbidity.detail,
        },
        {
          label: "Pression",
          value: formatPressureTrend(day.pressureTrend).replace("tendance ", ""),
          detail: pressureFishingHint(day.pressureTrend),
        },
        {
          label: "Pluie",
          value: `${formatNumber(day.precipitationTotal, 1)} mm`,
          detail: "cumul 24 h estimé",
        },
      ];

  els.waterInsights.innerHTML = "";
  insights.forEach((insight) => {
    const card = document.createElement("article");
    card.className = "water-insight";
    card.innerHTML = `
      <span>${escapeHtml(insight.label)}</span>
      <strong>${escapeHtml(insight.value)}</strong>
      <small>${escapeHtml(insight.detail)}</small>
    `;
    els.waterInsights.append(card);
  });
}

function renderRiggingCalculator(day) {
  if (!els.riggingForm) return;

  if (!state.riggingDirty) {
    fillRiggingFromConditions(day);
  }
  updateRiggingRecommendation();
}

function fillRiggingFromConditions(day) {
  if (!els.riggingForm) return;

  const depth = isSeaMode() ? state.depth : 5;
  const current = isSeaMode()
    ? day?.depthCurrent ?? day?.surfaceCurrent ?? 0
    : 0.2;
  const wind = day?.windAvg ?? 0;

  setNumberInputValue(els.riggingDepth, depth, 0);
  setNumberInputValue(els.riggingCurrent, current, 1);
  setNumberInputValue(els.riggingWind, wind, 0);
}

function updateRiggingRecommendation() {
  if (!els.riggingWeight) return;

  const profile = selectedRiggingProfile();
  const depth = readOptionalNumber(els.riggingDepth?.value);
  const current = readOptionalNumber(els.riggingCurrent?.value);
  const wind = readOptionalNumber(els.riggingWind?.value);

  if (!profile || depth == null || current == null || wind == null) {
    els.riggingWeight.textContent = "-- g";
    els.riggingRange.textContent = "Fourchette --";
    els.riggingAdvice.textContent = "Renseigne les conditions pour estimer un lestage de départ.";
    return;
  }

  const recommendation = calculateRiggingWeight(profile, { depth, current, wind });
  els.riggingWeight.textContent = `${recommendation.weight} g`;
  els.riggingRange.textContent = `Fourchette ${recommendation.min}-${recommendation.max} g`;
  els.riggingAdvice.textContent = riggingAdvice(recommendation, { current, wind });
}

function selectedRiggingProfile() {
  const profiles = riggingProfiles[state.waterMode] ?? riggingProfiles[WATER_MODES.SEA];
  return profiles.find((profile) => profile.id === els.riggingTechnique?.value) ?? profiles[0];
}

function calculateRiggingWeight(profile, values) {
  const raw = profile.base +
    values.depth * profile.depth +
    values.current * profile.current +
    values.wind * profile.wind;
  const cap = isSeaMode() ? 350 : 180;
  const weight = clamp(roundToStep(raw, 5), 5, cap);
  return {
    weight,
    min: clamp(roundToStep(weight * 0.85, 5), 5, cap),
    max: clamp(roundToStep(weight * 1.18, 5), 5, cap),
  };
}

function riggingAdvice(recommendation, values) {
  if (values.current >= 1.2) {
    return "Courant soutenu: privilégie une forme grappin ou pyramidale si le montage décroche.";
  }
  if (values.wind >= 20) {
    return "Vent marqué: garde la fourchette haute pour mieux tenir la bannière et limiter la dérive.";
  }
  if (recommendation.weight >= 160) {
    return "Lestage lourd: démarre dans la fourchette basse, puis monte seulement si le fond ne tient pas.";
  }
  return "Estimation de départ: ajuste par pas de 10 g selon la tenue au fond et la sensibilité recherchée.";
}

function setNumberInputValue(input, value, digits) {
  if (!input) return;
  input.value = isValidNumber(value) ? Number(value).toFixed(digits).replace(/\.0$/, "") : "";
}

function depthDetail(day) {
  const depth = formatNumber(day.actualDepth ?? state.depth, 0);
  const direction = compassLabel(day.depthDirection);

  if (day.depthSource === "copernicus") {
    return `Copernicus ${depth} m · vers ${direction}`;
  }

  return `${state.depth} m · est. vers ${direction}`;
}

function formatPressureTrend(value) {
  if (!isValidNumber(value)) return "tendance --";
  const sign = value > 0 ? "+" : "";
  return `tendance ${sign}${formatNumber(value, 1)} hPa`;
}

function pressureFishingHint(value) {
  if (!isValidNumber(value)) return "tendance indisponible";
  if (value <= -2) return "baisse favorable aux carnassiers";
  if (value >= 2) return "hausse souvent plus dure";
  return "pression stable";
}

function seaTemperatureDetail(day) {
  if (!isValidNumber(day.seaTemperatureTrend)) return "tendance SST indisponible";
  const sign = day.seaTemperatureTrend > 0 ? "+" : "";
  return `${sign}${formatNumber(day.seaTemperatureTrend, 1)} °C sur la journée`;
}

function thermalFrontLabel(range) {
  if (!isValidNumber(range)) return "--";
  if (range >= 1.2) return "Marqué";
  if (range >= 0.5) return "Présent";
  return "Faible";
}

function tideRangeLabel(range) {
  if (!isValidNumber(range)) return "--";
  if (range >= 4) return "Fort";
  if (range >= 1.2) return "Modéré";
  if (range >= 0.2) return "Faible";
  return "Très faible";
}

function tideSummary(day) {
  if (!isValidNumber(day.seaLevelRange)) return "hauteur d'eau indisponible";
  const events = day.tideEvents ?? {};
  const labels = [];
  if (events.high?.hour) labels.push(`pleine ${events.high.hour}`);
  if (events.low?.hour) labels.push(`basse ${events.low.hour}`);
  const range = `marnage ${formatNumber(day.seaLevelRange, 2)} m`;
  return labels.length ? `${labels.join(" · ")} · ${range}` : range;
}

function depthSeriesLabel(day) {
  if (day.depthSource === "copernicus") {
    return `${formatNumber(day.actualDepth ?? state.depth, 0)} m Copernicus`;
  }

  return `${state.depth} m estimé`;
}

function drawCompass() {
  const day = getSelectedDay();
  const canvas = els.compassCanvas;
  const ctx = setupCanvas(canvas);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.37;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fbfdfb";
  roundRect(ctx, 0, 0, width, height, 8);
  ctx.fill();

  ctx.strokeStyle = "#d9e2dc";
  ctx.lineWidth = 1;
  [0.45, 0.72, 1].forEach((scale) => {
    ctx.beginPath();
    ctx.arc(cx, cy, radius * scale, 0, Math.PI * 2);
    ctx.stroke();
  });

  for (let deg = 0; deg < 360; deg += 30) {
    const a = polar(deg, radius);
    const b = polar(deg, radius * (deg % 90 === 0 ? 0.88 : 0.94));
    ctx.beginPath();
    ctx.moveTo(cx + a.x, cy + a.y);
    ctx.lineTo(cx + b.x, cy + b.y);
    ctx.stroke();
  }

  ctx.fillStyle = "#62706a";
  ctx.font = "700 13px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  [
    ["N", 0],
    ["E", 90],
    ["S", 180],
    ["O", 270],
  ].forEach(([label, deg]) => {
    const p = polar(deg, radius + 18);
    ctx.fillText(label, cx + p.x, cy + p.y);
  });

  if (!day) {
    return;
  }

  if (isSeaMode()) {
    drawCompassArrow(ctx, cx, cy, radius * 0.82, day.surfaceCurrentDirection, colors.current, "Courant", false);
    drawCompassArrow(ctx, cx, cy, radius * 0.68, day.depthDirection, colors.depth, `${state.depth} m`, false);
    drawCompassArrow(ctx, cx, cy, radius * 0.55, reverseDirection(day.windDirection), colors.wind, "Vent", true);
    drawCompassArrow(ctx, cx, cy, radius * 0.42, reverseDirection(day.waveDirection), colors.wave, "Houle", true);
  } else {
    drawCompassArrow(ctx, cx, cy, radius * 0.76, reverseDirection(day.windDirection), colors.wind, "Vent", true);
  }

  ctx.fillStyle = "#17201d";
  ctx.font = "900 18px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(day.shortLabel, cx, cy - 7);
  ctx.fillStyle = "#62706a";
  ctx.font = "700 12px Inter, system-ui, sans-serif";
  ctx.fillText(`activité ${dayActivityScore(day)}/100`, cx, cy + 14);
}

function drawCompassArrow(ctx, cx, cy, length, direction, color, label, dashed) {
  if (direction == null) return;

  const tip = polar(direction, length);
  const start = polar(direction, 20);
  const angle = toRad(direction);
  const head = 10;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.setLineDash(dashed ? [6, 7] : []);

  ctx.beginPath();
  ctx.moveTo(cx + start.x, cy + start.y);
  ctx.lineTo(cx + tip.x, cy + tip.y);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(cx + tip.x, cy + tip.y);
  ctx.lineTo(cx + tip.x - head * Math.sin(angle - 0.52), cy + tip.y + head * Math.cos(angle - 0.52));
  ctx.lineTo(cx + tip.x - head * Math.sin(angle + 0.52), cy + tip.y + head * Math.cos(angle + 0.52));
  ctx.closePath();
  ctx.fill();

  const labelPoint = polar(direction, length + 22);
  ctx.font = "800 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, cx + labelPoint.x, cy + labelPoint.y);
  ctx.restore();
}

function renderChart() {
  const day = getSelectedDay();
  const canvas = els.chartCanvas;
  const ctx = setupCanvas(canvas);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const padding = { top: 24, right: 22, bottom: 38, left: 48 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  ctx.clearRect(0, 0, width, height);

  if (!day) return;

  const config = chartConfig(day);
  els.chartTitle.textContent = config.title;
  renderLegend(config.series);

  const values = config.series.flatMap((serie) => serie.values).filter(isValidNumber);
  const minValue = isValidNumber(config.minValue) ? config.minValue : 0;
  const maxValue = isValidNumber(config.maxValue) ? config.maxValue : niceMax(max(values) ?? 1);
  const valueRangeSize = Math.max(0.01, maxValue - minValue);

  ctx.strokeStyle = "#d9e2dc";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#62706a";
  ctx.font = "700 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  for (let step = 0; step <= 4; step += 1) {
    const displayValue = minValue + (valueRangeSize / 4) * step;
    const y = padding.top + chartHeight - ((displayValue - minValue) / valueRangeSize) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(formatNumber(displayValue, displayValue >= 10 ? 0 : 1), padding.left - 10, y);
  }

  const rows = day.rows;
  const pointX = (index) => padding.left + (rows.length <= 1 ? 0 : (index / (rows.length - 1)) * chartWidth);
  const pointY = (value) => padding.top + chartHeight - (((value ?? minValue) - minValue) / valueRangeSize) * chartHeight;

  config.series.forEach((serie) => {
    ctx.save();
    ctx.strokeStyle = serie.color;
    ctx.lineWidth = serie.width ?? 3;
    ctx.setLineDash(serie.dash ?? []);
    ctx.beginPath();
    let started = false;

    serie.values.forEach((value, index) => {
      if (!isValidNumber(value)) return;
      const x = pointX(index);
      const y = pointY(value);
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
    ctx.restore();
  });

  ctx.fillStyle = "#62706a";
  ctx.font = "700 11px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  rows.forEach((row, index) => {
    if (index % 3 !== 0 && index !== rows.length - 1) return;
    const x = pointX(index);
    ctx.fillText(row.hour, x, height - padding.bottom + 14);
  });

  ctx.fillStyle = "#17201d";
  ctx.font = "800 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(config.unit, padding.left, padding.top - 14);
}

function chartConfig(day) {
  const rows = day.rows;

  if (isSeaMode() && state.activeChart === "wave") {
    return {
      title: "Houle",
      unit: "m",
      series: [
        { label: "Houle totale", color: colors.wave, values: pluck(rows, "waveHeight") },
        { label: "Houle de fond", color: colors.swell, values: pluck(rows, "swellHeight"), dash: [7, 6] },
      ],
    };
  }

  if (isSeaMode() && state.activeChart === "current") {
    return {
      title: "Courant",
      unit: "kt",
      series: [
        { label: "Surface", color: colors.current, values: pluck(rows, "surfaceCurrent") },
        { label: depthSeriesLabel(day), color: colors.depth, values: pluck(rows, "depthCurrent"), dash: [7, 6] },
      ],
    };
  }

  if (state.activeChart === "pressure") {
    const pressureValues = pluck(rows, "pressure").filter(isValidNumber);
    const low = min(pressureValues);
    const high = max(pressureValues);
    const padding = Math.max(1.5, ((high ?? 1020) - (low ?? 1016)) * 0.25);

    return {
      title: "Pression",
      unit: "hPa",
      minValue: low == null ? 1008 : Math.floor(low - padding),
      maxValue: high == null ? 1028 : Math.ceil(high + padding),
      series: [
        { label: "Pression", color: colors.pressure, values: pluck(rows, "pressure") },
      ],
    };
  }

  return {
    title: "Vent",
    unit: "kt",
    series: [
      { label: "Vent moyen", color: colors.wind, values: pluck(rows, "windSpeed") },
      { label: "Rafales", color: colors.gust, values: pluck(rows, "windGust"), dash: [7, 6] },
    ],
  };
}

function renderLegend(series) {
  els.chartLegend.innerHTML = "";
  series.forEach((serie) => {
    const item = document.createElement("span");
    item.className = "legend-item";
    item.innerHTML = `<span class="legend-swatch"></span>${serie.label}`;
    item.querySelector(".legend-swatch").style.background = serie.color;
    els.chartLegend.append(item);
  });
}

function dailyWeatherIcon(day) {
  const precipitation = day.precipitationTotal ?? 0;
  const airTemperature = day.airTemperature;
  if (precipitation >= 0.8 && isValidNumber(airTemperature) && airTemperature <= 1.5) {
    return { icon: "ti-cloud-snow", label: "Neige" };
  }
  if (precipitation >= 0.8) return { icon: "ti-cloud-rain", label: "Pluie" };
  if ((day.cloudCoverAvg ?? 0) >= 55) return { icon: "ti-cloud", label: "Nuageux" };
  return { icon: "ti-sun", label: "Ensoleillé" };
}

function dailyWaterTemperature(day) {
  return isSeaMode() ? day.seaTemperature : null;
}

function formatTemperatureBrief(value) {
  return isValidNumber(value) ? `${formatNumber(value, 0)}°` : "--";
}

function formatWeekday3(date) {
  return new Intl.DateTimeFormat("fr-FR", { weekday: "short" })
    .format(new Date(`${date}T12:00:00`))
    .replace(".", "")
    .slice(0, 3);
}

function formatShortDateNoWeekday(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));
}

function renderCatchJournal() {
  if (!els.catchLogList) return;

  const entries = readCatchLog();
  if (!entries.length) {
    els.catchLogList.innerHTML = `
      <div class="journal-empty">
        <strong>Aucune prise enregistrée</strong>
        <span>Ajoute une prise pour conserver le spot, la météo, la pression et la lune du moment.</span>
      </div>
    `;
    return;
  }

  els.catchLogList.innerHTML = entries.map((entry) => {
    const measurements = formatCatchMeasurements(entry.measurements);
    const notes = entry.notes
      ? `<p class="journal-notes">${escapeHtml(entry.notes)}</p>`
      : "";
    const tags = catchWeatherTags(entry)
      .map((tag) => `<span class="journal-tag">${escapeHtml(tag)}</span>`)
      .join("");

    return `
      <article class="journal-entry">
        <div class="journal-entry-head">
          <div class="journal-title">
            <strong>${escapeHtml(getFishLabel(entry.species))}</strong>
            <span>${escapeHtml(formatCatchDate(entry.caughtAt))}</span>
          </div>
          <button class="icon-button journal-delete" type="button" data-catch-delete="${escapeHtml(entry.id)}" aria-label="Supprimer cette prise">
            ${trashIcon()}
          </button>
        </div>
        <div class="journal-meta">
          <span>${escapeHtml(entry.spot.name)}</span>
          <span>${escapeHtml(formatCoordinates(entry.spot.lat, entry.spot.lon))}</span>
          <span>${escapeHtml(waterModeConfig[entry.waterMode]?.label ?? "Mode")}</span>
          ${measurements ? `<span>${escapeHtml(measurements)}</span>` : ""}
        </div>
        ${tags ? `<div class="journal-tags">${tags}</div>` : ""}
        ${notes}
      </article>
    `;
  }).join("");
}

function formatCatchMeasurements(measurements = {}) {
  const parts = [];
  if (isValidNumber(measurements.lengthCm)) parts.push(`${formatNumber(measurements.lengthCm, 0)} cm`);
  if (isValidNumber(measurements.weightKg)) parts.push(`${formatNumber(measurements.weightKg, 1)} kg`);
  return parts.join(" · ");
}

function catchWeatherTags(entry) {
  const snapshot = entry.weatherSnapshot ?? {};
  const tags = [];

  if (isValidNumber(snapshot.windSpeed)) {
    tags.push(`Vent ${formatNumber(snapshot.windSpeed, 0)} kt ${compassLabel(snapshot.windDirection)}`);
  }
  if (isValidNumber(snapshot.pressure)) {
    tags.push(`Pression ${formatNumber(snapshot.pressure, 0)} hPa`);
  }

  if (entry.waterMode === WATER_MODES.SEA) {
    if (isValidNumber(snapshot.seaTemperature)) tags.push(`Eau ${formatNumber(snapshot.seaTemperature, 1)} °C`);
    if (isValidNumber(snapshot.waveHeight)) tags.push(`Houle ${formatNumber(snapshot.waveHeight, 1)} m`);
    if (isValidNumber(snapshot.surfaceCurrent)) tags.push(`Surface ${formatNumber(snapshot.surfaceCurrent, 1)} kt`);
    if (isValidNumber(snapshot.depthCurrent)) tags.push(`Prof. ${formatNumber(snapshot.depthCurrent, 1)} kt`);
  } else {
    if (isValidNumber(snapshot.airTemperature)) tags.push(`Air ${formatNumber(snapshot.airTemperature, 1)} °C`);
    if (isValidNumber(snapshot.precipitation)) tags.push(`Pluie ${formatNumber(snapshot.precipitation, 1)} mm`);
    if (isValidNumber(snapshot.cloudCover)) tags.push(`Nuages ${formatNumber(snapshot.cloudCover, 0)} %`);
  }

  if (isValidNumber(snapshot.moonPhase)) {
    tags.push(`Lune ${moonPhaseLabel(snapshot.moonPhase)}`);
  }

  return tags;
}

function formatCatchDate(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "--";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function moonPhaseLabel(phase) {
  const value = ((phase % 1) + 1) % 1;
  if (value < 0.04 || value >= 0.96) return "nouvelle";
  if (value < 0.22) return "croissante";
  if (value < 0.29) return "1er quartier";
  if (value < 0.46) return "gibbeuse +";
  if (value < 0.54) return "pleine";
  if (value < 0.72) return "gibbeuse -";
  if (value < 0.79) return "dernier quartier";
  return "décroissante";
}

function locateUser() {
  if (!navigator.geolocation) {
    setStatus("Localisation absente", "error");
    return;
  }

  setStatus("Localisation", "loading");
  navigator.geolocation.getCurrentPosition(
    (position) => {
      els.latitude.value = position.coords.latitude.toFixed(4);
      els.longitude.value = position.coords.longitude.toFixed(4);
      els.spotPreset.value = String(spots.length - 1);
      state.selectedSpotName = "Ma position";
      loadForecast();
    },
    () => setStatus("Localisation refusée", "error"),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 900000 },
  );
}

function getSelectedDay() {
  return state.days.find((day) => day.date === state.selectedDate) ?? state.days[0];
}

function bestWindow(rows) {
  const windowSize = 3;
  let best = { score: -Infinity, index: 0 };

  for (let index = 0; index <= rows.length - windowSize; index += 1) {
    const slice = rows.slice(index, index + windowSize);
    const score = average(slice.map(scoreHour));
    if (score != null && score > best.score) {
      best = { score, index };
    }
  }

  const start = rows[best.index]?.hour ?? "--";
  const end = rows[best.index + windowSize - 1]?.hour ?? "--";
  return {
    label: `${start} - ${end}`,
    score: Math.round(best.score),
  };
}

function scoreHour(row) {
  const wind = row.windSpeed ?? 0;
  const gust = row.windGust ?? wind;
  const gustGap = Math.max(0, gust - wind);
  if (!isSeaMode()) {
    const rain = row.precipitation ?? 0;
    const pressurePenalty = isValidNumber(row.pressure) ? Math.abs(row.pressure - 1016) * 0.9 : 8;
    return clamp(100 - wind * 2.4 - gustGap * 1.2 - rain * 55 - pressurePenalty, 0, 100);
  }

  const wave = row.waveHeight ?? 0;
  const current = row.surfaceCurrent ?? 0;
  return clamp(100 - wind * 2.2 - wave * 24 - current * 12 - gustGap * 1.1, 0, 100);
}

function rangeScore(value, [low, ideal, high]) {
  if (!isValidNumber(value)) return 58;
  if (value <= ideal) {
    const span = Math.max(0.01, ideal - low);
    return clamp(100 - ((ideal - value) / span) * 45, 8, 100);
  }

  const span = Math.max(0.01, high - ideal);
  return clamp(100 - ((value - ideal) / span) * 74, 0, 100);
}

function weatherActivityScore(row) {
  const wind = row.windSpeed ?? 8;
  const gust = row.windGust ?? wind;
  const pressure = row.pressure;
  const precipitation = row.precipitation ?? 0;
  const gustGap = Math.max(0, gust - wind);
  const windScore = clamp(100 - wind * 3.1 - gustGap * 1.7, 0, 100);
  const pressureScore = isValidNumber(pressure) ? rangeScore(pressure, [1007, 1018, 1029]) : 62;
  const rainScore = clamp(100 - precipitation * 70, 0, 100);
  return windScore * 0.58 + pressureScore * 0.25 + rainScore * 0.17;
}

function lightActivityScore(row, mode) {
  const minute = minutesFromClock(row.hour);
  const sunrise = minutesFromDateTime(row.sunrise) ?? 7 * 60;
  const sunset = minutesFromDateTime(row.sunset) ?? 20 * 60;
  const isDay = minute >= sunrise && minute <= sunset;
  const edgeDistance = Math.min(Math.abs(minute - sunrise), Math.abs(minute - sunset));
  const edgeScore = clamp(100 - (edgeDistance / 150) * 80, 18, 100);
  const nightScore = isDay ? 35 : 86;
  const dayScore = isDay ? 76 : 32;

  if (mode === "day") return Math.max(dayScore, edgeScore * 0.75);
  if (mode === "night") return Math.max(nightScore, edgeScore * 0.7);
  if (mode === "nightEdge") return Math.max(edgeScore, isDay ? 46 : 82);
  if (mode === "lowLight") return Math.max(edgeScore, isDay ? 42 : 76);
  return Math.max(edgeScore, isDay ? 58 : 34);
}

function solunarActivityScore(row, windows) {
  const minute = minutesFromClock(row.hour);
  const majorPeak = Math.max(...windows.major.map((window) => windowPeak(minute, window.center, window.duration / 2)));
  const minorPeak = Math.max(...windows.minor.map((window) => windowPeak(minute, window.center, window.duration / 2)));
  const moonStrength = 0.55 + Math.abs(Math.cos(windows.phase * Math.PI * 2)) * 0.45;
  return clamp(30 + majorPeak * 0.48 + minorPeak * 0.24 + moonStrength * 18, 0, 100);
}

function solunarWindows(day) {
  const firstRow = day.rows?.[0] ?? {};
  const sunrise = minutesFromDateTime(firstRow.sunrise) ?? 7 * 60;
  const sunset = minutesFromDateTime(firstRow.sunset) ?? 20 * 60;
  const solarNoon = (sunrise + sunset) / 2;
  const phase = lunarPhase(day.date);
  const transit = wrapMinute(solarNoon + phase * 1440);
  const underfoot = wrapMinute(transit + 720);
  const moonrise = wrapMinute(transit - 360);
  const moonset = wrapMinute(transit + 360);

  return {
    phase,
    major: [activityWindow(transit, 150), activityWindow(underfoot, 150)],
    minor: [activityWindow(moonrise, 90), activityWindow(moonset, 90)],
  };
}

function activityWindow(center, duration) {
  const start = wrapMinute(center - duration / 2);
  const end = wrapMinute(center + duration / 2);
  return {
    center,
    duration,
    label: `${formatMinute(start)} - ${formatMinute(end)}`,
  };
}

function windowPeak(minute, center, halfDuration) {
  return clamp(1 - minuteDistance(minute, center) / halfDuration, 0, 1) * 100;
}

function lunarPhase(date) {
  const ms = Date.parse(`${date}T12:00:00Z`);
  if (!Number.isFinite(ms)) return 0.25;
  const synodicMonth = 29.530588853 * 24 * 60 * 60 * 1000;
  const knownNewMoon = Date.parse("2000-01-06T18:14:00Z");
  return ((ms - knownNewMoon) / synodicMonth) % 1 < 0
    ? 1 + ((ms - knownNewMoon) / synodicMonth) % 1
    : ((ms - knownNewMoon) / synodicMonth) % 1;
}

function minutesFromDateTime(value) {
  if (typeof value !== "string" || value.length < 16) return null;
  return minutesFromClock(value.slice(11, 16));
}

function minutesFromClock(value) {
  if (typeof value !== "string") return 0;
  const [hour, minute] = value.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0;
  return hour * 60 + minute;
}

function wrapMinute(value) {
  return ((value % 1440) + 1440) % 1440;
}

function minuteDistance(a, b) {
  const diff = Math.abs(wrapMinute(a) - wrapMinute(b));
  return Math.min(diff, 1440 - diff);
}

function formatMinute(value) {
  const minutes = Math.round(wrapMinute(value));
  const hour = Math.floor(minutes / 60) % 24;
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

function groupPointsByDate(points) {
  return points.reduce((acc, point) => {
    if (!point.date) return acc;
    if (!acc.has(point.date)) acc.set(point.date, []);
    acc.get(point.date).push(point);
    return acc;
  }, new Map());
}

function latLonToMapPoint(lat, lon) {
  const bounds = getMapPixelBounds();
  const point = projectLatLon(lat, lon, state.mapZoom);
  return {
    x: (point.x - bounds.left) / bounds.width,
    y: (point.y - bounds.top) / bounds.height,
  };
}

function mapPointToLatLon(point) {
  const bounds = getMapPixelBounds();
  const x = bounds.left + point.x * bounds.width;
  const y = bounds.top + point.y * bounds.height;
  return unprojectLatLon(x, y, state.mapZoom);
}

function getMapPixelBounds() {
  const size = getHomeMapPixelSize();
  const center = getMapCenter();
  const centerPoint = projectLatLon(center.lat, center.lon, state.mapZoom);

  return {
    left: centerPoint.x - size.width / 2,
    top: centerPoint.y - size.height / 2,
    right: centerPoint.x + size.width / 2,
    bottom: centerPoint.y + size.height / 2,
    width: size.width,
    height: size.height,
  };
}

function getHomeMapPixelSize() {
  const homeTopLeft = projectLatLon(MAP_BOUNDS.north, MAP_BOUNDS.west, MAP_BASE_ZOOM);
  const homeBottomRight = projectLatLon(MAP_BOUNDS.south, MAP_BOUNDS.east, MAP_BASE_ZOOM);
  return {
    width: homeBottomRight.x - homeTopLeft.x,
    height: homeBottomRight.y - homeTopLeft.y,
  };
}

function getMapCenter() {
  if (state.mapCenter && isValidNumber(state.mapCenter.lat) && isValidNumber(state.mapCenter.lon)) {
    return state.mapCenter;
  }

  return {
    lat: (MAP_BOUNDS.north + MAP_BOUNDS.south) / 2,
    lon: (MAP_BOUNDS.west + MAP_BOUNDS.east) / 2,
  };
}

function mapMetersPerCssPixel() {
  const rect = els.spotMap.getBoundingClientRect();
  if (state.leafletMap) {
    const midpointY = rect.height / 2;
    const start = state.leafletMap.containerPointToLatLng([0, midpointY]);
    const end = state.leafletMap.containerPointToLatLng([100, midpointY]);
    return state.leafletMap.distance(start, end) / 100;
  }

  const bounds = getMapPixelBounds();
  const center = getMapCenter();
  const tilePixelsPerCssPixel = bounds.width / Math.max(1, rect.width);
  const metersPerTilePixel = (Math.cos(toRad(center.lat)) * 40075016.686) / (MAP_TILE_SIZE * 2 ** state.mapZoom);
  return metersPerTilePixel * tilePixelsPerCssPixel;
}

function chooseScaleDistance(metersPerPixel, maxPixels) {
  const maxMeters = metersPerPixel * maxPixels;
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(maxMeters, 1)));
  const candidates = [1, 2, 5].flatMap((base) => [base * magnitude, base * magnitude / 10]);
  const meters = candidates
    .filter((candidate) => candidate <= maxMeters)
    .sort((a, b) => b - a)[0] ?? 1;

  return {
    meters,
    width: meters / metersPerPixel,
  };
}

function formatScaleDistance(meters) {
  if (meters >= 1000) {
    return `${formatNumber(meters / 1000, meters >= 10000 ? 0 : 1)} km`;
  }

  return `${formatNumber(meters, 0)} m`;
}

function centerFromAnchor(anchor, anchorPoint, zoom) {
  const size = getHomeMapPixelSize();
  const anchorPixel = projectLatLon(anchor.lat, anchor.lon, zoom);
  const centerX = anchorPixel.x + (0.5 - anchorPoint.x) * size.width;
  const centerY = anchorPixel.y + (0.5 - anchorPoint.y) * size.height;
  return unprojectLatLon(centerX, centerY, zoom);
}

function projectLatLon(lat, lon, zoom) {
  const scale = MAP_TILE_SIZE * 2 ** zoom;
  const sinLat = Math.sin(toRad(clamp(lat, -85.0511, 85.0511)));
  return {
    x: ((lon + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
  };
}

function unprojectLatLon(x, y, zoom) {
  const scale = MAP_TILE_SIZE * 2 ** zoom;
  const lon = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(Math.sinh(n));
  return { lat, lon };
}

function wrapTileX(x, worldTileCount) {
  return ((x % worldTileCount) + worldTileCount) % worldTileCount;
}

function constrainMapCenter(center) {
  return {
    lat: clamp(center.lat, -80, 84),
    lon: clamp(center.lon, -180, 180),
  };
}

function isInsideMapBounds(lat, lon) {
  return lat <= MAP_BOUNDS.north && lat >= MAP_BOUNDS.south && lon >= MAP_BOUNDS.west && lon <= MAP_BOUNDS.east;
}

function isInsideMapViewport(point) {
  return point.x >= -0.04 && point.x <= 1.04 && point.y >= -0.04 && point.y <= 1.04;
}

function mapEventPoint(event) {
  return mapClientPoint(event.clientX, event.clientY);
}

function mapClientPoint(clientX, clientY) {
  const rect = els.spotMap.getBoundingClientRect();
  return {
    x: clamp((clientX - rect.left) / rect.width, 0, 1),
    y: clamp((clientY - rect.top) / rect.height, 0, 1),
  };
}

function nearestPoint(row, points) {
  const rowMs = Date.parse(row.time);
  if (!isValidNumber(rowMs)) return null;

  let best = null;
  let bestDiff = Infinity;
  points.forEach((point) => {
    if (!isValidNumber(point.timeMs)) return;
    const diff = Math.abs(point.timeMs - rowMs);
    if (diff < bestDiff) {
      best = point;
      bestDiff = diff;
    }
  });

  return bestDiff <= 90 * 60 * 1000 ? best : null;
}

function pluck(items, key) {
  return items.map((item) => item[key]);
}

function valueAt(values, index) {
  const value = values?.[index];
  return isValidNumber(value) ? value : null;
}

function kmhToKnots(value) {
  return isValidNumber(value) ? value * 0.539957 : null;
}

function distanceMeters(a, b) {
  if (!a || !b || !isValidNumber(a.lat) || !isValidNumber(a.lon) || !isValidNumber(b.lat) || !isValidNumber(b.lon)) {
    return null;
  }

  const earthRadius = 6371008.8;
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const deltaLat = toRad(b.lat - a.lat);
  const deltaLon = toRad(b.lon - a.lon);
  const sinLat = Math.sin(deltaLat / 2);
  const sinLon = Math.sin(deltaLon / 2);
  const value = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  return earthRadius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function average(values) {
  const clean = values.filter(isValidNumber);
  if (!clean.length) return null;
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}

function sum(values) {
  const clean = values.filter(isValidNumber);
  if (!clean.length) return null;
  return clean.reduce((total, value) => total + value, 0);
}

function valueDelta(values) {
  const clean = values.filter(isValidNumber);
  if (clean.length < 2) return null;
  return clean.at(-1) - clean[0];
}

function valueRange(values) {
  const clean = values.filter(isValidNumber);
  if (!clean.length) return null;
  return Math.max(...clean) - Math.min(...clean);
}

function pressureTrend(rows) {
  const clean = rows.filter((row) => isValidNumber(row.pressure));
  if (clean.length < 2) return null;
  return clean.at(-1).pressure - clean[0].pressure;
}

function tideEvents(rows) {
  const seaLevelRows = rows.filter((row) => isValidNumber(row.seaLevel));
  if (!seaLevelRows.length) return {};

  return {
    high: seaLevelRows.reduce((best, row) => (row.seaLevel > best.seaLevel ? row : best), seaLevelRows[0]),
    low: seaLevelRows.reduce((best, row) => (row.seaLevel < best.seaLevel ? row : best), seaLevelRows[0]),
  };
}

function turbidityEstimate(rows) {
  const precipitationTotal = sum(pluck(rows, "precipitation")) ?? 0;
  const maxHourlyRain = max(pluck(rows, "precipitation")) ?? 0;
  const pressureMove = Math.abs(pressureTrend(rows) ?? 0);
  const score = clamp(precipitationTotal * 18 + maxHourlyRain * 32 + pressureMove * 5, 0, 100);

  if (score >= 62) {
    return {
      score,
      label: "Élevée",
      detail: "eau probablement teintée",
    };
  }

  if (score >= 32) {
    return {
      score,
      label: "Moyenne",
      detail: "clarté à surveiller",
    };
  }

  return {
    score,
    label: "Faible",
    detail: "eau plutôt claire",
  };
}

function max(values) {
  const clean = values.filter(isValidNumber);
  if (!clean.length) return null;
  return Math.max(...clean);
}

function min(values) {
  const clean = values.filter(isValidNumber);
  if (!clean.length) return null;
  return Math.min(...clean);
}

function circularMean(degrees, weights = []) {
  let x = 0;
  let y = 0;
  let count = 0;

  degrees.forEach((degree, index) => {
    if (!isValidNumber(degree)) return;
    const weight = isValidNumber(weights[index]) ? Math.max(0.2, weights[index]) : 1;
    const rad = toRad(degree);
    x += Math.sin(rad) * weight;
    y += Math.cos(rad) * weight;
    count += 1;
  });

  if (!count || (Math.abs(x) < 0.0001 && Math.abs(y) < 0.0001)) return null;
  return normalizeDirection((Math.atan2(x, y) * 180) / Math.PI);
}

function depthFactor(depth) {
  return clamp(1 - Math.log1p(depth) * 0.13, 0.42, 1);
}

function estimatedDepthDirection(direction, depth) {
  if (!isValidNumber(direction)) return null;
  return normalizeDirection(direction + Math.min(16, depth * 0.22));
}

function reverseDirection(direction) {
  if (!isValidNumber(direction)) return null;
  return normalizeDirection(direction + 180);
}

function normalizeDirection(direction) {
  return ((direction % 360) + 360) % 360;
}

function compassLabel(direction) {
  if (!isValidNumber(direction)) return "--";
  const labels = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO"];
  return labels[Math.round(normalizeDirection(direction) / 22.5) % labels.length];
}

function polar(degrees, radius) {
  const rad = toRad(degrees);
  return {
    x: Math.sin(rad) * radius,
    y: -Math.cos(rad) * radius,
  };
}

function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));

  if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
  }

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function niceMax(value) {
  if (!isValidNumber(value) || value <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / power) * power;
}

function formatDayLabel(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${date}T12:00:00`));
}

function formatShortDay(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));
}

function formatNumber(value, digits = 0) {
  if (!isValidNumber(value)) return "--";
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

function readOptionalNumber(value) {
  const normalized = String(value ?? "").trim().replace(",", ".");
  if (!normalized) return null;
  const number = Number(normalized);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function colorWash(color) {
  return `${color}1f`;
}

function scoreClass(score) {
  if (score >= 70) return "";
  if (score >= 45) return "warn";
  return "bad";
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function roundToStep(value, step) {
  return Math.round(value / step) * step;
}

function isValidNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function setStatus(label, mode) {
  els.statusPill.textContent = label;
  els.statusPill.classList.toggle("is-loading", mode === "loading");
  els.statusPill.classList.toggle("is-error", mode === "error");
  els.statusPill.classList.toggle("is-ready", mode === "ready");
}

function saveSettings() {
  const spot = spots[Number(els.spotPreset.value)] ?? spots[0];
  const payload = {
    waterMode: state.waterMode,
    mobileView: state.activeMobileView,
    spotIndex: Number(els.spotPreset.value),
    spotName: spot.name,
    customName: state.selectedSpotName,
    lat: Number(els.latitude.value),
    lon: Number(els.longitude.value),
    depth: Number(els.depth.value),
    nauticalEnabled: state.nauticalEnabled,
    bathymetryEnabled: state.bathymetryEnabled,
    knownFishingEnabled: state.knownFishingEnabled,
    regulationEnabled: state.regulationEnabled,
    marineOverlayMode: state.marineOverlayMode,
    fishFilters: [...state.activeFishFilters],
    activityFish: state.activityFish,
  };
  updateAppStore((store) => {
    store.settings = {
      ...store.settings,
      ...payload,
    };
  });
}

function resolveSavedSpotIndex(saved) {
  if (saved.spotName) {
    const byName = spots.findIndex((spot) => spot.name === saved.spotName);
    if (byName >= 0) return byName;
  }

  if (Number.isInteger(saved.spotIndex) && saved.spotIndex >= 0 && saved.spotIndex < spots.length) {
    return saved.spotIndex;
  }

  return 0;
}

function saveFavorites() {
  updateAppStore((store) => {
    store.favorites = state.favorites.map(normalizeFavorite).filter(Boolean);
  });
}

function readFavorites() {
  return readAppStore().favorites;
}

function readSavedSettings() {
  return readAppStore().settings;
}

function readCatchLog() {
  return readAppStore().catchLog;
}

function saveCatchLogEntry(entry) {
  const normalizedEntry = normalizeCatchLogEntry(entry);
  if (!normalizedEntry) return null;

  updateAppStore((store) => {
    store.catchLog = [normalizedEntry, ...store.catchLog.filter((item) => item.id !== normalizedEntry.id)];
  });
  return normalizedEntry;
}

function deleteCatchLogEntry(id) {
  if (!id) return;
  updateAppStore((store) => {
    store.catchLog = store.catchLog.filter((entry) => entry.id !== id);
  });
}

function createCatchLogEntry(input = {}) {
  const now = new Date().toISOString();
  const active = getActiveSpot();
  const day = getSelectedDay();
  const hour = nearestHour(day?.rows ?? [], input.caughtAt ?? now);

  return normalizeCatchLogEntry({
    id: input.id ?? `catch:${Date.now()}`,
    createdAt: input.createdAt ?? now,
    caughtAt: input.caughtAt ?? now,
    waterMode: input.waterMode ?? state.waterMode,
    species: input.species ?? state.activityFish,
    spot: input.spot ?? {
      id: active.id,
      name: active.name,
      lat: active.lat,
      lon: active.lon,
      group: active.group,
    },
    measurements: {
      lengthCm: input.measurements?.lengthCm ?? null,
      weightKg: input.measurements?.weightKg ?? null,
    },
    notes: input.notes ?? "",
    weatherSnapshot: input.weatherSnapshot ?? buildWeatherSnapshot(hour, day),
    media: input.media ?? [],
  });
}

function buildWeatherSnapshot(row, day) {
  return {
    capturedAt: new Date().toISOString(),
    date: day?.date ?? null,
    hour: row?.hour ?? null,
    waterMode: state.waterMode,
    windSpeed: row?.windSpeed ?? null,
    windDirection: row?.windDirection ?? null,
    windGust: row?.windGust ?? null,
    pressure: row?.pressure ?? null,
    precipitation: row?.precipitation ?? null,
    cloudCover: row?.cloudCover ?? null,
    airTemperature: row?.airTemperature ?? null,
    seaTemperature: row?.seaTemperature ?? null,
    waveHeight: isSeaMode() ? row?.waveHeight ?? null : null,
    surfaceCurrent: isSeaMode() ? row?.surfaceCurrent ?? null : null,
    depthCurrent: isSeaMode() ? row?.depthCurrent ?? null : null,
    moonPhase: day?.date ? lunarPhase(day.date) : null,
  };
}

function nearestHour(rows, isoTime) {
  if (!rows.length) return null;
  const target = Date.parse(isoTime);
  if (!Number.isFinite(target)) return rows[0];

  return rows.reduce((best, row) => {
    const rowMs = Date.parse(row.time);
    if (!Number.isFinite(rowMs)) return best;
    const diff = Math.abs(rowMs - target);
    const bestDiff = best ? Math.abs(Date.parse(best.time) - target) : Infinity;
    return diff < bestDiff ? row : best;
  }, rows[0]);
}

function readAppStore() {
  const stored = parseStoredJson(STORE_KEY);
  if (stored && typeof stored === "object") {
    return normalizeStore(stored);
  }

  const migrated = normalizeStore({
    version: STORE_VERSION,
    settings: parseStoredJson(LEGACY_SETTINGS_KEY) ?? {},
    favorites: parseStoredJson(LEGACY_FAVORITES_KEY) ?? [],
    catchLog: [],
  });
  writeAppStore(migrated);
  return migrated;
}

function updateAppStore(mutator) {
  const store = readAppStore();
  mutator(store);
  const normalized = normalizeStore(store);
  writeAppStore(normalized);
  return normalized;
}

function writeAppStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(normalizeStore(store)));
}

function normalizeStore(store) {
  return {
    version: STORE_VERSION,
    settings: normalizeSettings(store?.settings ?? {}),
    favorites: Array.isArray(store?.favorites) ? store.favorites.map(normalizeFavorite).filter(Boolean) : [],
    catchLog: Array.isArray(store?.catchLog) ? store.catchLog.map(normalizeCatchLogEntry).filter(Boolean) : [],
  };
}

function normalizeSettings(settings) {
  return {
    waterMode: normalizeWaterMode(settings.waterMode),
    mobileView: normalizeMobileView(settings.mobileView),
    spotIndex: Number.isInteger(settings.spotIndex) ? settings.spotIndex : 0,
    spotName: typeof settings.spotName === "string" ? settings.spotName : "",
    customName: typeof settings.customName === "string" ? settings.customName : "",
    lat: isValidNumber(settings.lat) ? settings.lat : null,
    lon: isValidNumber(settings.lon) ? settings.lon : null,
    depth: isValidNumber(settings.depth) ? settings.depth : state.depth,
    nauticalEnabled: settings.nauticalEnabled !== false,
    bathymetryEnabled: settings.bathymetryEnabled !== false,
    knownFishingEnabled: settings.knownFishingEnabled !== false,
    regulationEnabled: settings.regulationEnabled !== false,
    marineOverlayMode: normalizeMarineOverlayMode(settings.marineOverlayMode),
    fishFilters: Array.isArray(settings.fishFilters) ? settings.fishFilters : ["all"],
    activityFish: typeof settings.activityFish === "string" ? settings.activityFish : "",
  };
}

function normalizeFavorite(favorite) {
  if (!favorite || !isValidNumber(favorite.lat) || !isValidNumber(favorite.lon) || typeof favorite.name !== "string") {
    return null;
  }

  return {
    id: favorite.id ?? coordinateFavoriteId(favorite.lat, favorite.lon),
    name: favorite.name,
    group: favorite.group ?? "",
    lat: favorite.lat,
    lon: favorite.lon,
    custom: Boolean(favorite.custom),
    waterMode: normalizeWaterMode(favorite.waterMode),
    createdAt: favorite.createdAt ?? new Date().toISOString(),
    updatedAt: favorite.updatedAt ?? new Date().toISOString(),
  };
}

function normalizeCatchLogEntry(entry) {
  if (!entry || typeof entry !== "object") return null;
  const spot = entry.spot ?? {};
  if (!isValidNumber(spot.lat) || !isValidNumber(spot.lon)) return null;

  return {
    id: typeof entry.id === "string" ? entry.id : `catch:${Date.now()}`,
    createdAt: entry.createdAt ?? new Date().toISOString(),
    caughtAt: entry.caughtAt ?? entry.createdAt ?? new Date().toISOString(),
    waterMode: normalizeWaterMode(entry.waterMode),
    species: typeof entry.species === "string" ? entry.species : "",
    spot: {
      id: spot.id ?? coordinateFavoriteId(spot.lat, spot.lon),
      name: spot.name ?? "Spot",
      group: spot.group ?? "",
      lat: spot.lat,
      lon: spot.lon,
    },
    measurements: {
      lengthCm: isValidNumber(entry.measurements?.lengthCm) ? entry.measurements.lengthCm : null,
      weightKg: isValidNumber(entry.measurements?.weightKg) ? entry.measurements.weightKg : null,
    },
    notes: typeof entry.notes === "string" ? entry.notes : "",
    weatherSnapshot: entry.weatherSnapshot && typeof entry.weatherSnapshot === "object" ? entry.weatherSnapshot : {},
    media: Array.isArray(entry.media) ? entry.media : [],
  };
}

function parseStoredJson(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function getCustomSpotName(lat = Number(els.latitude.value), lon = Number(els.longitude.value)) {
  return `Spot ${formatCoordinates(lat, lon)}`;
}

function sanitizeSpotName(name) {
  return String(name ?? "").trim().replace(/\s+/g, " ").slice(0, 48);
}

function formatCoordinates(lat, lon) {
  if (!isValidNumber(lat) || !isValidNumber(lon)) return "--";
  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function currentIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h14"/><path d="m13 7 5 5-5 5"/><path d="M4 6h8"/><path d="M4 18h8"/></svg>`;
}

function depthIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18"/><path d="m7 16 5 5 5-5"/><path d="M5 7h14"/><path d="M7 11h10"/></svg>`;
}

function windIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h12a3 3 0 1 0-3-3"/><path d="M3 12h17"/><path d="M3 16h13a3 3 0 1 1-3 3"/></svg>`;
}

function waveIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 15c2.6 0 2.6-2 5.2-2s2.6 2 5.2 2 2.6-2 5.2-2H21"/><path d="M3 9c2.6 0 2.6-2 5.2-2s2.6 2 5.2 2 2.6-2 5.2-2H21"/></svg>`;
}

function pressureIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="m12 13 4-4"/><path d="M8 17h8"/></svg>`;
}

function rainIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 15a5 5 0 0 1 1.2-9.8A7 7 0 0 1 21 10.5 4.5 4.5 0 0 1 17 15H7Z"/><path d="m8 18-1 2"/><path d="m13 18-1 2"/><path d="m18 18-1 2"/></svg>`;
}

function cloudIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18a5 5 0 0 1 1.3-9.8A7 7 0 0 1 21 12.5 4.5 4.5 0 0 1 17 18H6Z"/><path d="M4 21h16"/></svg>`;
}

function trashIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5"/><path d="M14 11v5"/></svg>`;
}

function pencilIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4"/><path d="M14.5 4.5 19.5 9.5"/><path d="M16.5 2.5a2.1 2.1 0 0 1 3 3L8 17l-4 1 1-4Z"/></svg>`;
}

function checkIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>`;
}

function closeIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg>`;
}

function starIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4-4.7-4.6 6.5-.9L12 3Z"/></svg>`;
}

function anchorIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v14"/><path d="M8 7h8"/><path d="M5 14c0 4 3 7 7 7s7-3 7-7"/><path d="M5 14h4"/><path d="M15 14h4"/></svg>`;
}

function fishSpotIcon(type = "dorade") {
  const icons = {
    all: `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M4 15c3.9-5 11.1-6.3 17.2-2.5L25 9v10l-3.8-3.5C15.1 19.3 7.9 18 4 13Z"/><path d="m5 15-2.5 3.5"/><circle cx="17.6" cy="13.2" r="0.8"/></svg>`,
    thon: `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M2.5 14c5.1-5 13.1-5.4 20.1-1.1L26 9.2v9.6l-3.4-3.7C15.6 19.4 7.6 19 2.5 14Z"/><path d="M11 9.8 14.5 5"/><path d="M11 18.2 14.5 23"/><circle cx="18.8" cy="13.2" r="0.8"/></svg>`,
    dorade: `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M3 14c3.9-4.5 11-5.2 16.5-1.5L25 9v10l-5.5-3.5C14 19.2 6.9 18.5 3 14Z"/><path d="M16.4 9.5c-1.6 2.1-1.6 6.9 0 9"/><circle cx="18.6" cy="13.1" r="0.8"/></svg>`,
    loup: `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M3 13.5c5-3.6 12.8-4.1 18.6-1.1L25.5 9v9l-3.9-3.4C15.7 17.7 8 17.2 3 13.5Z"/><path d="M8.5 11.5h7.5"/><path d="M8.5 15.3h6.5"/><circle cx="18.8" cy="12.7" r="0.8"/></svg>`,
    sar: `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M4 14c3.8-4.5 10.5-5.1 15.8-1.5L25 9.5v9l-5.2-3C14.5 19.1 7.8 18.5 4 14Z"/><path d="M10 9.9v8.2"/><path d="M13.5 9.4v9.2"/><path d="M17 10.2v7.6"/><circle cx="19" cy="13" r="0.8"/></svg>`,
    roche: `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M4 15c3.3-4.4 9.9-6.1 15.8-2.4L24.5 10v8l-4.7-2.5C13.9 19 7.3 18.6 4 15Z"/><path d="m9 10-1-4 3.8 2.2"/><path d="m13 8.8 1.5-4.2 2.4 4.2"/><path d="M7.5 19.5h9.5"/><circle cx="18.5" cy="13.2" r="0.8"/></svg>`,
    maquereau: `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M2.5 14c5-4.4 12.5-4.7 19-.9L26 9.8v8.4l-4.5-3.3c-6.5 3.8-14 3.5-19-.9Z"/><path d="m9.2 10.3 1.8 2.1"/><path d="m12.1 9.6 1.8 2.4"/><path d="m15 9.8 1.7 2.3"/><path d="m17.8 10.7 1.4 1.8"/><path d="M7.5 15.8h10.8"/><circle cx="19.6" cy="13.1" r="0.8"/></svg>`,
    maigre: `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M3 14c4.2-5 12.8-5.8 18.6-1.5L25.8 9v10l-4.2-3.5C15.8 19.8 7.2 19 3 14Z"/><path d="M7 14.2c4.4-1.5 8.2-1.4 12.4.2"/><path d="M12.4 9.1c-.8 1.6-.8 8.3 0 9.8"/><circle cx="19" cy="13.1" r="0.8"/></svg>`,
    cephalopodes: `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M14 4.5c4.3 0 7 3.4 7 7.6 0 3.1-2 5.2-7 5.2s-7-2.1-7-5.2c0-4.2 2.7-7.6 7-7.6Z"/><path d="M8.5 17.2c-1 1.8-2.5 3.2-4.5 4"/><path d="M11.5 17.5c-.4 2-1.3 3.6-2.7 5"/><path d="M14 17.7v5.1"/><path d="M16.5 17.5c.4 2 1.3 3.6 2.7 5"/><path d="M19.5 17.2c1 1.8 2.5 3.2 4.5 4"/><circle cx="11.7" cy="11.5" r="0.8"/><circle cx="16.3" cy="11.5" r="0.8"/></svg>`,
    brochet: `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M2.5 13.5c5.9-3.2 13.3-3.8 20.1-1.1L26 9.8v8.4l-3.4-2.8c-6.8 2.7-14.2 2.1-20.1-1.9Z"/><path d="M6 12h7.8"/><path d="M6 15h8.8"/><path d="M12 9.4 15.6 6"/><circle cx="19.4" cy="12.8" r="0.8"/></svg>`,
    sandre: `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M3 14c5.2-3.8 12.4-4.2 18.5-1.1L25.5 10v8l-4-3.1C15.4 18.2 8.2 17.8 3 14Z"/><path d="m8.8 10.2 1.3-3 1.3 3"/><path d="m12.4 9.5 1.2-3.3 1.5 3.4"/><path d="m16.2 10.2 1-2.7 1.1 3"/><circle cx="19" cy="13.1" r="0.8"/></svg>`,
    perche: `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M4 14c4.3-4 10.8-4.5 16-1.1L25 10v8l-5-3.1C14.8 18.4 8.3 18 4 14Z"/><path d="M9.5 10.4v7.2"/><path d="M12.5 9.6v8.5"/><path d="M15.7 9.7v8.1"/><path d="M18.5 11v5.6"/><circle cx="19.2" cy="13.1" r="0.8"/></svg>`,
    blackBass: `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M3 14c3.7-5.3 12.3-6.1 18.4-1.8L25.5 9v10l-4.1-3.3C15.3 20 6.7 19.3 3 14Z"/><path d="M8 14.2h10.8"/><path d="M10.2 10.6c2.3 1.6 5.2 1.8 8.1 1.1"/><circle cx="19.2" cy="13" r="0.8"/></svg>`,
    carpe: `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M4 14c3.5-4.7 10.6-5.7 15.8-1.7L25 9.2v9.6l-5.2-3.1C14.6 19.7 7.5 18.7 4 14Z"/><path d="M7.5 15.2c2.4 2.2 6.2 2.8 10.2 1.5"/><path d="M18.9 13.3c2.1-1.2 3.4-1 4.8.3"/><circle cx="18.8" cy="12.7" r="0.8"/></svg>`,
    silure: `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M2.5 14.5c5.5-3.1 13.7-3.2 20 .1L26 12v6l-3.5-2.1c-6.3 3.4-14.5 2.8-20-1.4Z"/><path d="M18.5 13.5c2.9-1.9 5.4-2.3 7-1.2"/><path d="M18.5 14.9c2.9 1.9 5.4 2.3 7 1.2"/><path d="M7 16.2c2.8 1.5 6.4 1.6 10 .4"/><circle cx="17.6" cy="13.6" r="0.8"/></svg>`,
    truite: `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M3 14c4.7-4.1 12.3-4.8 18.4-1.1L25.5 10v8l-4.1-3.1C15.3 18.9 7.7 18.1 3 14Z"/><circle cx="11" cy="12.2" r="0.7"/><circle cx="13.8" cy="15.7" r="0.7"/><circle cx="16.2" cy="12" r="0.7"/><path d="M9 9.8c2.9-1.1 6.2-1.2 9.3-.2"/><circle cx="19.2" cy="13.1" r="0.8"/></svg>`,
  };

  return icons[type] ?? icons.dorade;
}

function pinIcon() {
  return `<svg viewBox="0 0 28 36" aria-hidden="true"><path d="M14 34S3 22.7 3 13.8C3 7.5 7.9 3 14 3s11 4.5 11 10.8C25 22.7 14 34 14 34Z"/><circle cx="14" cy="14" r="4.6"/></svg>`;
}

init();
