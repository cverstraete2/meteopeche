const WEATHER_API = "https://api.open-meteo.com/v1/forecast";
const WEATHER_API_FALLBACKS = [
  WEATHER_API,
  "https://forecast-api.open-meteo.com/v1/forecast",
];
const METNO_API = "https://api.met.no/weatherapi/locationforecast/2.0/compact";
const MARINE_API = "https://marine-api.open-meteo.com/v1/marine";
const SPOT_RESOLVE_API_PATH = "api/spot-resolve";
const SPOT_SEARCH_API_PATH = "api/spot-search";
const NEARBY_SPOTS_API_PATH = "api/nearby-spots";
const RIVER_FORECAST_API_PATH = "api/river-forecast";
const BATHYMETRY_WMS = "https://ows.emodnet-bathymetry.eu/wms";
const BATHYMETRY_REST = "https://rest.emodnet-bathymetry.eu/depth/point";
const DEFAULT_API_BASE_URL = "https://meteopeche-copernicus-977572434171.europe-west1.run.app";
const DEFAULT_RUNTIME_CONFIG = Object.freeze({
  apiBaseUrl: DEFAULT_API_BASE_URL,
  enableGoogleMapsWeb: false,
  googleMapsApiKey: "",
  enableAppleMapsWeb: false,
  appleMapKitToken: "",
  appleMapKitTokenUrl: "",
  experimentalMapProviders: [],
});
const METERS_PER_SECOND_TO_KNOTS = 1.9438444924406;
const STORE_KEY = "meteo-peche-store-v1";
const LEGACY_FAVORITES_KEY = "meteo-peche-favorites";
const LEGACY_SETTINGS_KEY = "meteo-peche-settings";
const STORE_VERSION = 1;
const WATER_MODES = {
  SEA: "sea",
  FRESHWATER: "freshwater",
};
const MOBILE_VIEWS = ["map", "weather", "activity", "journal", "more"];
const WEATHER_SUBTABS = ["overview", "forces", "sun"];
const ATMOSPHERE_CHARTS = ["cloud", "pressure"];
const FREE_FORECAST_DAY_LIMIT = 2;
const MARINE_OVERLAY_MODES = ["none", "surface", "depth", "wave"];
const THEME_MODES = ["light", "dark"];
const LANGUAGE_MODES = ["fr", "en", "es", "de", "pt"];
const MAP_PROVIDER_IDS = {
  LEAFLET_OPENMAP: "leaflet-openmap",
  APPLE_WEB: "apple-web",
  APPLE_NATIVE: "apple-native",
  GOOGLE_WEB: "google-web",
  GOOGLE_NATIVE: "google-native",
};
const MAP_PROVIDER_DEFAULT_SUPPORT = {
  [MAP_PROVIDER_IDS.LEAFLET_OPENMAP]: true,
  [MAP_PROVIDER_IDS.APPLE_WEB]: false,
  [MAP_PROVIDER_IDS.APPLE_NATIVE]: false,
  [MAP_PROVIDER_IDS.GOOGLE_WEB]: false,
  [MAP_PROVIDER_IDS.GOOGLE_NATIVE]: false,
};
const GOOGLE_MAPS_SCRIPT_ID = "google-maps-js-api";
const APPLE_MAPKIT_SCRIPT_ID = "apple-mapkit-js-api";
const APPLE_MAPKIT_JS_URL = "https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js";
const SMART_ALERT_TYPES = ["rising-tide", "best-solunar", "wind-drop", "species-activity", "morning-report"];
const ENTITLEMENT_TIERS = ["free", "pro"];
const ENTITLEMENT_SOURCES = ["local", "storekit", "play-billing", "server", "test"];
const PRO_FEATURES = [
  "planning.10day",
  "planning.monthly",
  "alerts.windDrop",
  "alerts.speciesActivity",
  "alerts.multiSpot",
  "glance.widgets",
  "glance.liveActivity",
  "glance.watch",
  "journal.analytics",
  "trip.export",
];
const FEATURE_ENTITLEMENTS = {
  "planning.10day": "pro",
  "planning.monthly": "pro",
  "alerts.windDrop": "pro",
  "alerts.speciesActivity": "pro",
  "alerts.multiSpot": "pro",
  "glance.widgets": "pro",
  "glance.liveActivity": "pro",
  "glance.watch": "pro",
  "journal.analytics": "pro",
  "trip.export": "pro",
};
const PRO_FEATURE_DETAILS = {
  "planning.10day": {
    title: "Planification 10 jours",
    copy: "Compare les meilleurs créneaux de la semaine avec météo, marée, lune et risque de sortie.",
    benefits: ["Vue 10 jours complète", "Scores et go/no-go par jour", "Lecture marée, lune et météo au même endroit"],
  },
  "planning.monthly": {
    title: "Cycles mensuels",
    copy: "Repère les grandes fenêtres autour des marées, phases lunaires et tendances météo.",
    benefits: ["Marées longues", "Cycles lune et soleil", "Préparation des sorties à l'avance"],
  },
  "alerts.windDrop": {
    title: "Alerte baisse du vent",
    copy: "Reçois une alerte quand une fenêtre plus calme apparaît sur ton spot.",
    benefits: ["Seuils météo avancés", "Rappels locaux", "Moins de vérifications manuelles"],
  },
  "alerts.speciesActivity": {
    title: "Alerte activité espèce",
    copy: "Déclenche une alerte quand l'espèce ciblée entre dans une fenêtre forte.",
    benefits: ["Score par espèce", "Solunar + météo", "Alertes orientées action"],
  },
  "glance.widgets": {
    title: "Widgets écran d'accueil",
    copy: "Garde marée, météo et prochaine fenêtre sous les yeux sans ouvrir l'app.",
    benefits: ["Widgets configurables", "Vue rapide du spot", "Météo marine glanceable"],
  },
  "glance.liveActivity": {
    title: "Activités en direct",
    copy: "Suis la progression marée et solunar depuis l'écran verrouillé et Dynamic Island.",
    benefits: ["Suivi temps réel", "Écran verrouillé", "Progression du créneau"],
  },
  "glance.watch": {
    title: "Apple Watch",
    copy: "Consulte marée, météo et complications directement au poignet.",
    benefits: ["Complications Watch", "App native Watch", "Sortie plus légère"],
  },
  "journal.analytics": {
    title: "Analytics journal",
    copy: "Transforme tes prises en tendances utiles: spots, espèces, météo et cycles gagnants.",
    benefits: ["Stats par espèce", "Conditions qui reviennent", "Historique exploitable"],
  },
  "trip.export": {
    title: "Export de sortie",
    copy: "Génère un résumé propre à partager ou archiver avec spot, photos et conditions.",
    benefits: ["Export partageable", "Photos et météo", "Compte rendu de sortie"],
  },
};
const SMART_ALERT_DEFAULTS = {
  quietHours: { start: "21:00", end: "07:00" },
  maxPerDay: 2,
  leadMinutes: 45,
};
const SMART_ALERT_CATALOG = {
  "rising-tide": {
    label: "Marée montante",
    description: "Prévenir avant une marée montante exploitable sur le spot sélectionné.",
    defaultEnabled: false,
    proRequired: false,
    leadMinutes: 60,
    safetyNote: "Vérifier l'accès, les coefficients et la météo locale avant la mise à l'eau.",
    uncertaintyNote: "L'heure dépend de la source de marée et peut varier selon la station de référence.",
  },
  "best-solunar": {
    label: "Meilleur créneau solunar",
    description: "Prévenir avant le meilleur créneau combinant lune, lumière et conditions.",
    defaultEnabled: false,
    proRequired: false,
    leadMinutes: 45,
    safetyNote: "Le solunar est un signal d'aide à la décision, pas une garantie de prise.",
    uncertaintyNote: "Le score se met à jour lorsque les prévisions météo changent.",
  },
  "wind-drop": {
    label: "Baisse du vent",
    description: "Prévenir quand le vent repasse sous un seuil exploitable.",
    defaultEnabled: false,
    proRequired: true,
    leadMinutes: 30,
    safetyNote: "Surveiller les rafales, la houle et les avis de sécurité même si le vent moyen baisse.",
    uncertaintyNote: "Les seuils peuvent changer avec les mises à jour horaires du modèle.",
  },
  "species-activity": {
    label: "Activité espèce élevée",
    description: "Prévenir quand l'espèce ciblée dépasse un score d'activité fort.",
    defaultEnabled: false,
    proRequired: true,
    leadMinutes: 45,
    safetyNote: "Adapter le montage, la zone et la réglementation à l'espèce ciblée.",
    uncertaintyNote: "L'activité est une estimation issue des conditions et cycles disponibles.",
  },
  "morning-report": {
    label: "Rapport du matin",
    description: "Envoyer une synthèse quotidienne calme: meilleur créneau, météo et risques.",
    defaultEnabled: false,
    proRequired: false,
    leadMinutes: 0,
    deliveryTime: "07:00",
    safetyNote: "Le rapport ne remplace pas les bulletins météo et règles locales.",
    uncertaintyNote: "Les données peuvent évoluer dans la journée, surtout vent, pluie et houle.",
  },
};
const PIN_ZOOM_LEVELS = [5, 8, 11, 14];
const PIN_LAYER_TIERS = [
  { id: "tier1", minZoom: 5, maxZoom: 7, pane: "pinTier1Pane", zIndex: 410 },
  { id: "tier2", minZoom: 8, maxZoom: 10, pane: "pinTier2Pane", zIndex: 420 },
  { id: "tier3", minZoom: 11, maxZoom: 13, pane: "pinTier3Pane", zIndex: 430 },
  { id: "tier4", minZoom: 14, maxZoom: 99, pane: "pinTier4Pane", zIndex: 440 },
];
const OVERPASS_MIN_ZOOM = 10;
const OVERPASS_SPOT_ZOOM_LEVEL = 13;
const OVERPASS_MIN_FETCH_INTERVAL_MS = 2000;
const OVERPASS_RETRY_DELAY_MS = 30000;
const OVERPASS_BOUNDS_MOVE_RATIO = 0.3;
const OVERPASS_CACHE_LIMIT = 2000;
const OVERPASS_CACHE_TRIM = 200;
const PHOTO_MAX_EDGE = 1280;
const PHOTO_JPEG_QUALITY = 0.76;
const LANGUAGE_OPTIONS = {
  fr: { label: "Français", locale: "fr-FR" },
  en: { label: "English", locale: "en-US" },
  es: { label: "Español", locale: "es-ES" },
  de: { label: "Deutsch", locale: "de-DE" },
  pt: { label: "Português", locale: "pt-PT" },
};
const I18N_TRANSLATIONS = {
  "Chargement des conditions": { en: "Loading conditions", es: "Cargando condiciones", de: "Bedingungen werden geladen", pt: "A carregar condições" },
  "MeteoCatch mobile": { en: "MeteoCatch mobile", es: "MeteoCatch móvil", de: "MeteoCatch mobil", pt: "MeteoCatch móvel" },
  "Fermer l'onboarding": { en: "Close onboarding", es: "Cerrar onboarding", de: "Onboarding schließen", pt: "Fechar onboarding" },
  "Prépare tes sorties comme une vraie app de terrain": { en: "Plan your trips like a true field app", es: "Prepara tus salidas como una app de campo", de: "Plane deine Trips wie mit einer echten Outdoor-App", pt: "Prepara as tuas saídas como uma app de terreno" },
  "Choisis un spot, trouve le bon créneau": { en: "Choose a spot, find the right window", es: "Elige un spot, encuentra la mejor franja", de: "Wähle einen Spot, finde das richtige Zeitfenster", pt: "Escolhe um spot, encontra a melhor janela" },
  "Position précise pour choisir le spot, rappels locaux, journal photo et accès hors ligne aux écrans essentiels.": { en: "Precise location to choose a spot, local reminders, photo log and offline access to essential screens.", es: "Ubicación precisa para elegir el spot, recordatorios locales, diario con fotos y acceso sin conexión a las pantallas esenciales.", de: "Präziser Standort für Spotwahl, lokale Erinnerungen, Fototagebuch und Offline-Zugriff auf wichtige Ansichten.", pt: "Localização precisa para escolher o spot, lembretes locais, diário fotográfico e acesso offline aos ecrãs essenciais." },
  "Commence avec un spot de démonstration. Le GPS, les notifications et les photos sont proposés seulement quand ils deviennent utiles.": { en: "Start with a demo spot. GPS, notifications and photos are offered only when they become useful.", es: "Empieza con un spot de demo. GPS, notificaciones y fotos se proponen solo cuando son útiles.", de: "Starte mit einem Demo-Spot. GPS, Benachrichtigungen und Fotos werden erst angeboten, wenn sie nützlich sind.", pt: "Começa com um spot de demonstração. GPS, notificações e fotos aparecem apenas quando são úteis." },
  "GPS précis": { en: "Precise GPS", es: "GPS preciso", de: "Präzises GPS", pt: "GPS preciso" },
  "À configurer": { en: "To set up", es: "Por configurar", de: "Einzurichten", pt: "Por configurar" },
  "Autoriser": { en: "Allow", es: "Permitir", de: "Erlauben", pt: "Permitir" },
  "Autorisé": { en: "Allowed", es: "Permitido", de: "Erlaubt", pt: "Permitido" },
  "Refusé": { en: "Denied", es: "Denegado", de: "Abgelehnt", pt: "Recusado" },
  "Indisponible": { en: "Unavailable", es: "No disponible", de: "Nicht verfügbar", pt: "Indisponível" },
  "Spots OSM indisponibles — réessai dans 30s": { en: "OSM spots unavailable — retrying in 30s", es: "Spots OSM no disponibles — reintento en 30s", de: "OSM-Spots nicht verfügbar — neuer Versuch in 30s", pt: "Spots OSM indisponíveis — nova tentativa em 30s" },
  "Notifications": { en: "Notifications", es: "Notificaciones", de: "Benachrichtigungen", pt: "Notificações" },
  "Activer": { en: "Enable", es: "Activar", de: "Aktivieren", pt: "Ativar" },
  "Actives": { en: "Enabled", es: "Activas", de: "Aktiv", pt: "Ativas" },
  "Journal photo": { en: "Photo log", es: "Diario fotográfico", de: "Fototagebuch", pt: "Diário fotográfico" },
  "Photos stockées dans le journal local": { en: "Photos stored in the local log", es: "Fotos guardadas en el diario local", de: "Fotos werden im lokalen Tagebuch gespeichert", pt: "Fotos guardadas no diário local" },
  "Prêt": { en: "Ready", es: "Listo", de: "Bereit", pt: "Pronto" },
  "Mode offline": { en: "Offline mode", es: "Modo sin conexión", de: "Offline-Modus", pt: "Modo offline" },
  "Préparation du cache": { en: "Preparing cache", es: "Preparando caché", de: "Cache wird vorbereitet", pt: "A preparar cache" },
  "Écran principal disponible hors ligne": { en: "Main screen available offline", es: "Pantalla principal disponible sin conexión", de: "Hauptansicht offline verfügbar", pt: "Ecrã principal disponível offline" },
  "Cache en préparation": { en: "Preparing cache", es: "Preparando caché", de: "Cache wird vorbereitet", pt: "A preparar cache" },
  "Cache en attente": { en: "Cache pending", es: "Caché pendiente", de: "Cache ausstehend", pt: "Cache pendente" },
  "En ligne": { en: "Online", es: "En línea", de: "Online", pt: "Online" },
  "Offline": { en: "Offline", es: "Sin conexión", de: "Offline", pt: "Offline" },
  "Confidentialité": { en: "Privacy", es: "Privacidad", de: "Datenschutz", pt: "Privacidade" },
  "La position sert à charger les prévisions du spot. Le journal et les photos restent sur ton appareil, sauf si tu les exportes volontairement. Les services météo, cartographie, Copernicus et GloFAS reçoivent uniquement les coordonnées nécessaires aux données.": { en: "Location is used to load spot forecasts. The log and photos stay on your device unless you choose to export them. Weather, mapping, Copernicus and GloFAS services receive only the coordinates needed for the data.", es: "La ubicación se usa para cargar las previsiones del spot. El diario y las fotos permanecen en tu dispositivo salvo que los exportes voluntariamente. Los servicios meteorológicos, cartográficos, Copernicus y GloFAS reciben solo las coordenadas necesarias.", de: "Der Standort wird genutzt, um Spot-Vorhersagen zu laden. Tagebuch und Fotos bleiben auf deinem Gerät, außer du exportierst sie bewusst. Wetter-, Karten-, Copernicus- und GloFAS-Dienste erhalten nur die nötigen Koordinaten.", pt: "A localização serve para carregar previsões do spot. O diário e as fotos ficam no teu dispositivo, salvo exportação voluntária. Os serviços meteorológicos, cartográficos, Copernicus e GloFAS recebem apenas as coordenadas necessárias." },
  "Continuer": { en: "Continue", es: "Continuar", de: "Weiter", pt: "Continuar" },
  "Plus tard": { en: "Later", es: "Más tarde", de: "Später", pt: "Mais tarde" },
  "Prévisions marines par spot": { en: "Marine forecasts by spot", es: "Previsiones marinas por spot", de: "Meeresvorhersagen nach Spot", pt: "Previsões marinhas por spot" },
  "Préférences": { en: "Preferences", es: "Preferencias", de: "Einstellungen", pt: "Preferências" },
  "Plus": { en: "More", es: "Más", de: "Mehr", pt: "Mais" },
  "Profil": { en: "Profile", es: "Perfil", de: "Profil", pt: "Perfil" },
  "Profil & app": { en: "Profile & app", es: "Perfil y app", de: "Profil & App", pt: "Perfil e app" },
  "← Retour": { en: "← Back", es: "← Volver", de: "← Zurück", pt: "← Voltar" },
  "Milieu": { en: "Environment", es: "Medio", de: "Gewässer", pt: "Ambiente" },
  "Mer": { en: "Sea", es: "Mar", de: "Meer", pt: "Mar" },
  "Eau douce": { en: "Freshwater", es: "Agua dulce", de: "Süßwasser", pt: "Água doce" },
  "Thème": { en: "Theme", es: "Tema", de: "Design", pt: "Tema" },
  "Clair": { en: "Light", es: "Claro", de: "Hell", pt: "Claro" },
  "Sombre": { en: "Dark", es: "Oscuro", de: "Dunkel", pt: "Escuro" },
  "Abonnement": { en: "Subscription", es: "Suscripción", de: "Abo", pt: "Subscrição" },
  "MeteoCatch Pro": { en: "MeteoCatch Pro", es: "MeteoCatch Pro", de: "MeteoCatch Pro", pt: "MeteoCatch Pro" },
  "Gratuit": { en: "Free", es: "Gratis", de: "Kostenlos", pt: "Gratuito" },
  "Pro actif": { en: "Pro active", es: "Pro activo", de: "Pro aktiv", pt: "Pro ativo" },
  "Mode test Pro": { en: "Pro test mode", es: "Modo de prueba Pro", de: "Pro-Testmodus", pt: "Modo de teste Pro" },
  "Active l'état Pro localement pour tester les limites d'abonnement.": { en: "Enable the Pro state locally to test subscription limits.", es: "Activa el estado Pro localmente para probar los límites de suscripción.", de: "Aktiviere den Pro-Status lokal, um Abo-Grenzen zu testen.", pt: "Ativa o estado Pro localmente para testar limites de subscrição." },
  "Statut d'abonnement local pour valider l'expérience Pro avant mise en production.": { en: "Local subscription status for validating the Pro experience before production.", es: "Estado de suscripción local para validar la experiencia Pro antes de producción.", de: "Lokaler Abo-Status, um das Pro-Erlebnis vor der Produktion zu prüfen.", pt: "Estado de subscrição local para validar a experiência Pro antes de produção." },
  "Langue": { en: "Language", es: "Idioma", de: "Sprache", pt: "Idioma" },
  "Niveau": { en: "Level", es: "Nivel", de: "Level", pt: "Nível" },
  "Débutant": { en: "Beginner", es: "Principiante", de: "Anfänger", pt: "Iniciante" },
  "Intermédiaire": { en: "Intermediate", es: "Intermedio", de: "Fortgeschritten", pt: "Intermédio" },
  "Avancé": { en: "Advanced", es: "Avanzado", de: "Experte", pt: "Avançado" },
  "Approche": { en: "Approach", es: "Enfoque", de: "Ansatz", pt: "Abordagem" },
  "Bord": { en: "Shore", es: "Orilla", de: "Ufer", pt: "Margem" },
  "Bateau": { en: "Boat", es: "Barco", de: "Boot", pt: "Barco" },
  "Mixte": { en: "Mixed", es: "Mixto", de: "Gemischt", pt: "Misto" },
  "Priorité": { en: "Priority", es: "Prioridad", de: "Priorität", pt: "Prioridade" },
  "Créneau": { en: "Window", es: "Franja", de: "Zeitfenster", pt: "Janela" },
  "Météo": { en: "Weather", es: "Tiempo", de: "Wetter", pt: "Tempo" },
  "Spots": { en: "Spots", es: "Spots", de: "Spots", pt: "Spots" },
  "Espèce cible": { en: "Target species", es: "Especie objetivo", de: "Zielfisch", pt: "Espécie alvo" },
  "Profondeur cible": { en: "Target depth", es: "Profundidad objetivo", de: "Zieltiefe", pt: "Profundidade alvo" },
  "App native & confidentialité": { en: "Native app & privacy", es: "App nativa y privacidad", de: "Native App & Datenschutz", pt: "App nativa e privacidade" },
  "Données, app native & confidentialité": { en: "Data, native app & privacy", es: "Datos, app nativa y privacidad", de: "Daten, native App & Datenschutz", pt: "Dados, app nativa e privacidade" },
  "Données": { en: "Data", es: "Datos", de: "Daten", pt: "Dados" },
  "Sources météo et Copernicus en attente": { en: "Weather and Copernicus sources pending", es: "Fuentes meteorológicas y Copernicus pendientes", de: "Wetter- und Copernicus-Quellen ausstehend", pt: "Fontes meteorológicas e Copernicus pendentes" },
  "Privacy": { en: "Privacy", es: "Privacidad", de: "Datenschutz", pt: "Privacidade" },
  "À valider": { en: "To accept", es: "Por validar", de: "Zu bestätigen", pt: "Por validar" },
  "Validée": { en: "Accepted", es: "Validada", de: "Bestätigt", pt: "Validada" },
  "Valider": { en: "Accept", es: "Validar", de: "Bestätigen", pt: "Validar" },
  "Le GPS n'est utilisé que pour sélectionner un spot et charger les conditions. Les photos du journal restent dans le stockage local de l'appareil. Les services météo, cartographie et eau reçoivent seulement les coordonnées nécessaires.": { en: "GPS is only used to select a spot and load conditions. Log photos stay in local device storage. Weather, mapping and water services receive only the coordinates they need.", es: "El GPS solo se usa para seleccionar un spot y cargar las condiciones. Las fotos del diario permanecen en el almacenamiento local del dispositivo. Los servicios meteorológicos, cartográficos y de agua reciben solo las coordenadas necesarias.", de: "GPS wird nur verwendet, um einen Spot zu wählen und Bedingungen zu laden. Fotos bleiben lokal auf dem Gerät. Wetter-, Karten- und Gewässerdienste erhalten nur die nötigen Koordinaten.", pt: "O GPS é usado apenas para selecionar um spot e carregar condições. As fotos do diário ficam no armazenamento local do dispositivo. Os serviços meteorológicos, cartográficos e de água recebem apenas as coordenadas necessárias." },
  "Politique de confidentialité": { en: "Privacy policy", es: "Política de privacidad", de: "Datenschutzerklärung", pt: "Política de privacidade" },
  "Revoir l'onboarding": { en: "Review onboarding", es: "Revisar onboarding", de: "Onboarding erneut ansehen", pt: "Rever onboarding" },
  "Carte": { en: "Map", es: "Mapa", de: "Karte", pt: "Mapa" },
  "Carte et favoris": { en: "Map and favorites", es: "Mapa y favoritos", de: "Karte und Favoriten", pt: "Mapa e favoritos" },
  "Carte des spots": { en: "Spot map", es: "Mapa de spots", de: "Spotkarte", pt: "Mapa de spots" },
  "Spots mer": { en: "Sea spots", es: "Spots de mar", de: "Meer-Spots", pt: "Spots de mar" },
  "Spots eau douce": { en: "Freshwater spots", es: "Spots de agua dulce", de: "Süßwasser-Spots", pt: "Spots de água doce" },
  "Carte de sélection des spots": { en: "Spot selection map", es: "Mapa de selección de spots", de: "Karte zur Spot-Auswahl", pt: "Mapa de seleção de spots" },
  "Spot actif": { en: "Active spot", es: "Spot activo", de: "Aktiver Spot", pt: "Spot ativo" },
  "Ajouter aux favoris": { en: "Add to favorites", es: "Añadir a favoritos", de: "Zu Favoriten hinzufügen", pt: "Adicionar aos favoritos" },
  "Retirer des favoris": { en: "Remove from favorites", es: "Quitar de favoritos", de: "Aus Favoriten entfernen", pt: "Remover dos favoritos" },
  "Favoris": { en: "Favorites", es: "Favoritos", de: "Favoriten", pt: "Favoritos" },
  "Modifier": { en: "Edit", es: "Modificar", de: "Ändern", pt: "Editar" },
  "Changer spot": { en: "Change spot", es: "Cambiar spot", de: "Spot wechseln", pt: "Alterar spot" },
  "Masquer": { en: "Hide", es: "Ocultar", de: "Ausblenden", pt: "Ocultar" },
  "Ma position": { en: "My location", es: "Mi ubicación", de: "Mein Standort", pt: "A minha posição" },
  "Utiliser ma position": { en: "Use my location", es: "Usar mi ubicación", de: "Meinen Standort verwenden", pt: "Usar a minha posição" },
  "Spot": { en: "Spot", es: "Spot", de: "Spot", pt: "Spot" },
  "Recherche mondiale": { en: "Global search", es: "Búsqueda global", de: "Weltweite Suche", pt: "Pesquisa global" },
  "Ville, rivière, lac, port...": { en: "City, river, lake, harbor...", es: "Ciudad, río, lago, puerto...", de: "Stadt, Fluss, See, Hafen...", pt: "Cidade, rio, lago, porto..." },
  "Rechercher": { en: "Search", es: "Buscar", de: "Suchen", pt: "Pesquisar" },
  "Recherche en cours": { en: "Searching", es: "Buscando", de: "Suche läuft", pt: "A pesquisar" },
  "Aucun résultat": { en: "No results", es: "Sin resultados", de: "Keine Ergebnisse", pt: "Sem resultados" },
  "Recherche indisponible": { en: "Search unavailable", es: "Búsqueda no disponible", de: "Suche nicht verfügbar", pt: "Pesquisa indisponível" },
  "Saisis au moins 2 caractères": { en: "Enter at least 2 characters", es: "Introduce al menos 2 caracteres", de: "Mindestens 2 Zeichen eingeben", pt: "Introduz pelo menos 2 caracteres" },
  "Choisir ce spot": { en: "Choose this spot", es: "Elegir este spot", de: "Diesen Spot wählen", pt: "Escolher este spot" },
  "Explorer les eaux à proximité": { en: "Explore nearby waters", es: "Explorar aguas cercanas", de: "Gewässer in der Nähe erkunden", pt: "Explorar águas próximas" },
  "Recherche des eaux proches": { en: "Searching nearby waters", es: "Buscando aguas cercanas", de: "Suche Gewässer in der Nähe", pt: "A pesquisar águas próximas" },
  "Aucun spot proche trouvé": { en: "No nearby spot found", es: "No se encontró ningún spot cercano", de: "Kein Spot in der Nähe gefunden", pt: "Nenhum spot próximo encontrado" },
  "Exploration indisponible": { en: "Exploration unavailable", es: "Exploración no disponible", de: "Erkundung nicht verfügbar", pt: "Exploração indisponível" },
  "La recherche prend trop longtemps": { en: "Search is taking too long", es: "La búsqueda tarda demasiado", de: "Die Suche dauert zu lange", pt: "A pesquisa está a demorar demasiado" },
  "Rivière proche": { en: "Nearby river", es: "Río cercano", de: "Fluss in der Nähe", pt: "Rio próximo" },
  "Canal proche": { en: "Nearby canal", es: "Canal cercano", de: "Kanal in der Nähe", pt: "Canal próximo" },
  "Lac proche": { en: "Nearby lake", es: "Lago cercano", de: "See in der Nähe", pt: "Lago próximo" },
  "Réservoir proche": { en: "Nearby reservoir", es: "Embalse cercano", de: "Stausee in der Nähe", pt: "Reservatório próximo" },
  "Plan d'eau proche": { en: "Nearby water body", es: "Masa de agua cercana", de: "Gewässer in der Nähe", pt: "Massa de água próxima" },
  "Eau douce proche": { en: "Nearby freshwater", es: "Agua dulce cercana", de: "Süßwasser in der Nähe", pt: "Água doce próxima" },
  "Zone marine proche": { en: "Nearby marine area", es: "Zona marina cercana", de: "Meeresgebiet in der Nähe", pt: "Zona marinha próxima" },
  "Zone océanique proche": { en: "Nearby ocean area", es: "Zona oceánica cercana", de: "Ozeangebiet in der Nähe", pt: "Zona oceânica próxima" },
  "Côte proche": { en: "Nearby coast", es: "Costa cercana", de: "Küste in der Nähe", pt: "Costa próxima" },
  "Baie proche": { en: "Nearby bay", es: "Bahía cercana", de: "Bucht in der Nähe", pt: "Baía próxima" },
  "Détroit proche": { en: "Nearby strait", es: "Estrecho cercano", de: "Meerenge in der Nähe", pt: "Estreito próximo" },
  "Port proche": { en: "Nearby harbour", es: "Puerto cercano", de: "Hafen in der Nähe", pt: "Porto próximo" },
  "Marina proche": { en: "Nearby marina", es: "Marina cercana", de: "Marina in der Nähe", pt: "Marina próxima" },
  "Latitude": { en: "Latitude", es: "Latitud", de: "Breitengrad", pt: "Latitude" },
  "Longitude": { en: "Longitude", es: "Longitud", de: "Längengrad", pt: "Longitude" },
  "Actualiser": { en: "Refresh", es: "Actualizar", de: "Aktualisieren", pt: "Atualizar" },
  "Fermer": { en: "Close", es: "Cerrar", de: "Schließen", pt: "Fechar" },
  "Contrôles carte": { en: "Map controls", es: "Controles del mapa", de: "Kartensteuerung", pt: "Controlos do mapa" },
  "Zoomer": { en: "Zoom in", es: "Acercar", de: "Hineinzoomen", pt: "Aproximar" },
  "Dézoomer": { en: "Zoom out", es: "Alejar", de: "Herauszoomen", pt: "Afastar" },
  "Couches": { en: "Layers", es: "Capas", de: "Ebenen", pt: "Camadas" },
  "Carte nautique": { en: "Nautical chart", es: "Carta náutica", de: "Seekarte", pt: "Carta náutica" },
  "Balises, marques et infos mer": { en: "Beacons, marks and sea info", es: "Balizas, marcas e info marina", de: "Baken, Seezeichen und Meeresinfos", pt: "Balizas, marcas e info marítima" },
  "Littoral & baies": { en: "Coastline & bays", es: "Litoral y bahías", de: "Küste & Buchten", pt: "Litoral e baías" },
  "Rivages, baies et noms marins": { en: "Shores, bays and sea names", es: "Costas, bahías y nombres marinos", de: "Ufer, Buchten und Meeresnamen", pt: "Margens, baías e nomes marítimos" },
  "Coins pêche": { en: "Fishing spots", es: "Zonas de pesca", de: "Angelplätze", pt: "Locais de pesca" },
  "Spots connus par poisson": { en: "Known spots by species", es: "Spots conocidos por pez", de: "Bekannte Spots nach Fischart", pt: "Spots conhecidos por peixe" },
  "Profondeur fond": { en: "Bottom depth", es: "Profundidad del fondo", de: "Grundtiefe", pt: "Profundidade do fundo" },
  "EMODnet France entière": { en: "EMODnet all France", es: "EMODnet toda Francia", de: "EMODnet ganz Frankreich", pt: "EMODnet França inteira" },
  "Zones sensibles": { en: "Sensitive areas", es: "Zonas sensibles", de: "Sensible Zonen", pt: "Zonas sensíveis" },
  "Réserves et vigilance réglementaire": { en: "Reserves and regulatory caution", es: "Reservas y vigilancia normativa", de: "Schutzgebiete und Regel-Hinweise", pt: "Reservas e atenção regulamentar" },
  "Conditions marines": { en: "Marine conditions", es: "Condiciones marinas", de: "Meeresbedingungen", pt: "Condições marinhas" },
  "Off": { en: "Off", es: "Off", de: "Aus", pt: "Off" },
  "Surface": { en: "Surface", es: "Superficie", de: "Oberfläche", pt: "Superfície" },
  "Profondeur": { en: "Depth", es: "Profundidad", de: "Tiefe", pt: "Profundidade" },
  "Houle": { en: "Wave", es: "Oleaje", de: "Welle", pt: "Ondulação" },
  "Poisson": { en: "Fish", es: "Pez", de: "Fisch", pt: "Peixe" },
  "Tous": { en: "All", es: "Todos", de: "Alle", pt: "Todos" },
  "Zone sensible": { en: "Sensitive area", es: "Zona sensible", de: "Sensible Zone", pt: "Zona sensível" },
  "Sécurité": { en: "Safety", es: "Seguridad", de: "Sicherheit", pt: "Segurança" },
  "Zones et dérive prêtes.": { en: "Zones and drift ready.", es: "Zonas y deriva listas.", de: "Zonen und Drift bereit.", pt: "Zonas e deriva prontas." },
  "Point GPS": { en: "GPS point", es: "Punto GPS", de: "GPS-Punkt", pt: "Ponto GPS" },
  "Nommer ce spot": { en: "Name this spot", es: "Nombrar este spot", de: "Diesen Spot benennen", pt: "Dar nome a este spot" },
  "Nom": { en: "Name", es: "Nombre", de: "Name", pt: "Nome" },
  "Annuler": { en: "Cancel", es: "Cancelar", de: "Abbrechen", pt: "Cancelar" },
  "Ajouter favori": { en: "Add favorite", es: "Añadir favorito", de: "Favorit hinzufügen", pt: "Adicionar favorito" },
  "Consulter": { en: "View", es: "Consultar", de: "Ansehen", pt: "Consultar" },
  "Prévisions 6 jours": { en: "6-day forecast", es: "Previsión 6 días", de: "6-Tage-Vorhersage", pt: "Previsão 6 dias" },
  "Prévision": { en: "Forecast", es: "Previsión", de: "Vorhersage", pt: "Previsão" },
  "Prévisions indisponibles": { en: "Forecast unavailable", es: "Previsiones no disponibles", de: "Vorhersage nicht verfügbar", pt: "Previsões indisponíveis" },
  "Réduire": { en: "Collapse", es: "Reducir", de: "Einklappen", pt: "Reduzir" },
  "Agrandir": { en: "Expand", es: "Ampliar", de: "Erweitern", pt: "Aumentar" },
  "Sélecteur météo": { en: "Weather selector", es: "Selector meteorológico", de: "Wetterauswahl", pt: "Seletor meteorológico" },
  "Sous-vues météo": { en: "Weather subviews", es: "Subvistas meteorológicas", de: "Wetter-Unteransichten", pt: "Subvistas meteorológicas" },
  "Décision rapide": { en: "Quick decision", es: "Decisión rápida", de: "Schnellentscheidung", pt: "Decisão rápida" },
  "Résumé": { en: "Summary", es: "Resumen", de: "Übersicht", pt: "Resumo" },
  "Forces": { en: "Forces", es: "Fuerzas", de: "Kräfte", pt: "Forças" },
  "Soleil / marées": { en: "Sun / tide", es: "Sol / mareas", de: "Sonne / Gezeiten", pt: "Sol / marés" },
  "Rosace": { en: "Compass", es: "Rosa", de: "Kompassrose", pt: "Rosa dos ventos" },
  "Soleil": { en: "Sun", es: "Sol", de: "Sonne", pt: "Sol" },
  "Marées": { en: "Tides", es: "Mareas", de: "Gezeiten", pt: "Marés" },
  "Timeline journée": { en: "Day timeline", es: "Timeline del día", de: "Tages-Timeline", pt: "Timeline do dia" },
  "Sélectionner l'heure": { en: "Select time", es: "Seleccionar hora", de: "Uhrzeit wählen", pt: "Selecionar hora" },
  "Activité": { en: "Activity", es: "Actividad", de: "Aktivität", pt: "Atividade" },
  "Activité poisson": { en: "Fish activity", es: "Actividad del pez", de: "Fischaktivität", pt: "Atividade do peixe" },
  "Activité des poissons": { en: "Fish activity", es: "Actividad de los peces", de: "Fischaktivität", pt: "Atividade dos peixes" },
  "Espèce": { en: "Species", es: "Especie", de: "Art", pt: "Espécie" },
  "Majeurs": { en: "Major", es: "Mayores", de: "Hauptphasen", pt: "Maiores" },
  "Mineurs": { en: "Minor", es: "Menores", de: "Nebenphasen", pt: "Menores" },
  "Hauteur d'eau": { en: "Water level", es: "Altura del agua", de: "Wasserstand", pt: "Altura da água" },
  "Synthèse du jour": { en: "Daily summary", es: "Resumen del día", de: "Tagesübersicht", pt: "Síntese do dia" },
  "Rosace et forces horaires": { en: "Compass and hourly forces", es: "Rosa y fuerzas horarias", de: "Kompassrose und Stundenkräfte", pt: "Rosa e forças horárias" },
  "Directions moyennes": { en: "Average directions", es: "Direcciones medias", de: "Mittlere Richtungen", pt: "Direções médias" },
  "Créneau calme": { en: "Calm window", es: "Franja tranquila", de: "Ruhiges Fenster", pt: "Janela calma" },
  "Évolution horaire des forces": { en: "Hourly force evolution", es: "Evolución horaria de fuerzas", de: "Stündliche Kräfteentwicklung", pt: "Evolução horária das forças" },
  "Heure par heure": { en: "Hour by hour", es: "Hora a hora", de: "Stunde für Stunde", pt: "Hora a hora" },
  "Vent": { en: "Wind", es: "Viento", de: "Wind", pt: "Vento" },
  "Nuages": { en: "Clouds", es: "Nubes", de: "Wolken", pt: "Nuvens" },
  "Courant": { en: "Current", es: "Corriente", de: "Strömung", pt: "Corrente" },
  "Ciel et baromètre": { en: "Sky and barometer", es: "Cielo y barómetro", de: "Himmel und Barometer", pt: "Céu e barómetro" },
  "Atmosphère": { en: "Atmosphere", es: "Atmósfera", de: "Atmosphäre", pt: "Atmosfera" },
  "Couverture nuageuse": { en: "Cloud cover", es: "Cobertura nubosa", de: "Bewölkung", pt: "Cobertura de nuvens" },
  "Vue atmosphère": { en: "Atmosphere view", es: "Vista atmósfera", de: "Atmosphärenansicht", pt: "Vista da atmosfera" },
  "Baromètre": { en: "Barometer", es: "Barómetro", de: "Barometer", pt: "Barómetro" },
  "Outil terrain": { en: "Field tool", es: "Herramienta de campo", de: "Praxiswerkzeug", pt: "Ferramenta de terreno" },
  "Lestage": { en: "Rigging", es: "Lastre", de: "Blei/Last", pt: "Lastro" },
  "Conditions actuelles": { en: "Current conditions", es: "Condiciones actuales", de: "Aktuelle Bedingungen", pt: "Condições atuais" },
  "Technique": { en: "Technique", es: "Técnica", de: "Technik", pt: "Técnica" },
  "Profondeur m": { en: "Depth m", es: "Profundidad m", de: "Tiefe m", pt: "Profundidade m" },
  "Courant kt": { en: "Current kt", es: "Corriente kt", de: "Strömung kt", pt: "Corrente kt" },
  "Vent kt": { en: "Wind kt", es: "Viento kt", de: "Wind kt", pt: "Vento kt" },
  "Plomb conseillé": { en: "Suggested weight", es: "Plomo recomendado", de: "Empfohlenes Gewicht", pt: "Chumbo recomendado" },
  "Fourchette --": { en: "Range --", es: "Rango --", de: "Bereich --", pt: "Intervalo --" },
  "Renseigne les conditions pour estimer un lestage de départ.": { en: "Enter conditions to estimate a starting rig weight.", es: "Introduce las condiciones para estimar un lastre inicial.", de: "Gib Bedingungen ein, um ein Startgewicht zu schätzen.", pt: "Indica as condições para estimar um lastro inicial." },
  "Soleil & lune": { en: "Sun & moon", es: "Sol y luna", de: "Sonne & Mond", pt: "Sol e lua" },
  "Soleil et lune": { en: "Sun and moon", es: "Sol y luna", de: "Sonne und Mond", pt: "Sol e lua" },
  "Cycle lumineux": { en: "Light cycle", es: "Ciclo de luz", de: "Lichtzyklus", pt: "Ciclo de luz" },
  "Journal": { en: "Log", es: "Diario", de: "Tagebuch", pt: "Diário" },
  "Journal de prises": { en: "Catch log", es: "Diario de capturas", de: "Fangtagebuch", pt: "Diário de capturas" },
  "Taille cm": { en: "Size cm", es: "Talla cm", de: "Länge cm", pt: "Tamanho cm" },
  "Poids kg": { en: "Weight kg", es: "Peso kg", de: "Gewicht kg", pt: "Peso kg" },
  "Notes": { en: "Notes", es: "Notas", de: "Notizen", pt: "Notas" },
  "Leurre, poste, comportement...": { en: "Lure, spot, behavior...", es: "Señuelo, puesto, comportamiento...", de: "Köder, Stelle, Verhalten...", pt: "Amostra, posto, comportamento..." },
  "Ajouter photo": { en: "Add photo", es: "Añadir foto", de: "Foto hinzufügen", pt: "Adicionar foto" },
  "Ajouter prise": { en: "Add catch", es: "Añadir captura", de: "Fang hinzufügen", pt: "Adicionar captura" },
  "Navigation principale": { en: "Main navigation", es: "Navegación principal", de: "Hauptnavigation", pt: "Navegação principal" },
  "Prefs": { en: "Prefs", es: "Prefs", de: "Prefs", pt: "Prefs" },
  "Aucun favori": { en: "No favorites", es: "Sin favoritos", de: "Keine Favoriten", pt: "Sem favoritos" },
  "Coordonnées invalides": { en: "Invalid coordinates", es: "Coordenadas no válidas", de: "Ungültige Koordinaten", pt: "Coordenadas inválidas" },
  "Stockage plein": { en: "Storage full", es: "Almacenamiento lleno", de: "Speicher voll", pt: "Armazenamento cheio" },
  "Photo impossible": { en: "Photo unavailable", es: "Foto imposible", de: "Foto nicht möglich", pt: "Foto indisponível" },
  "Photo ajoutée": { en: "Photo added", es: "Foto añadida", de: "Foto hinzugefügt", pt: "Foto adicionada" },
  "Photo de prise": { en: "Catch photo", es: "Foto de captura", de: "Fangfoto", pt: "Foto da captura" },
  "Retirer la photo": { en: "Remove photo", es: "Quitar foto", de: "Foto entfernen", pt: "Remover foto" },
  "Supprimer cette prise": { en: "Delete this catch", es: "Eliminar esta captura", de: "Diesen Fang löschen", pt: "Eliminar esta captura" },
  "Aucune prise enregistrée": { en: "No catches saved", es: "No hay capturas guardadas", de: "Keine Fänge gespeichert", pt: "Nenhuma captura guardada" },
  "Ajoute une prise pour conserver le spot, la météo, la pression et la lune du moment.": { en: "Add a catch to save the spot, weather, pressure and moon for that moment.", es: "Añade una captura para guardar el spot, la meteorología, la presión y la luna del momento.", de: "Füge einen Fang hinzu, um Spot, Wetter, Druck und Mondphase zu speichern.", pt: "Adiciona uma captura para guardar o spot, meteorologia, pressão e lua do momento." },
  "Thon": { en: "Tuna", es: "Atún", de: "Thunfisch", pt: "Atum" },
  "Dorade": { en: "Sea bream", es: "Dorada", de: "Meerbrasse", pt: "Dourada" },
  "Bar/Loup": { en: "Sea bass", es: "Lubina", de: "Wolfsbarsch", pt: "Robalo" },
  "Sars": { en: "White seabream", es: "Sargo", de: "Geißbrassen", pt: "Sargos" },
  "Roche": { en: "Rockfish", es: "Roca", de: "Felsfisch", pt: "Rocha" },
  "Poissons de roche": { en: "Rockfish", es: "Peces de roca", de: "Felsfische", pt: "Peixes de rocha" },
  "Maquereau": { en: "Mackerel", es: "Caballa", de: "Makrele", pt: "Cavala" },
  "Maigre": { en: "Meagre", es: "Corvina", de: "Adlerfisch", pt: "Corvina" },
  "Seiche": { en: "Cuttlefish", es: "Sepia", de: "Tintenfisch", pt: "Choco" },
  "Brochet": { en: "Pike", es: "Lucio", de: "Hecht", pt: "Lúcio" },
  "Sandre": { en: "Zander", es: "Lucioperca", de: "Zander", pt: "Lucioperca" },
  "Perche": { en: "Perch", es: "Perca", de: "Barsch", pt: "Perca" },
  "Black-bass": { en: "Black bass", es: "Black bass", de: "Black Bass", pt: "Black bass" },
  "Carpe": { en: "Carp", es: "Carpa", de: "Karpfen", pt: "Carpa" },
  "Silure": { en: "Catfish", es: "Siluro", de: "Wels", pt: "Siluro" },
  "Truite": { en: "Trout", es: "Trucha", de: "Forelle", pt: "Truta" },
  "Bord / pêche calée": { en: "Shore / static rig", es: "Orilla / pesca fondeada", de: "Ufer / Grundmontage", pt: "Margem / pesca fundeada" },
  "Bateau / dérive": { en: "Boat / drift", es: "Barco / deriva", de: "Boot / Drift", pt: "Barco / deriva" },
  "Verticale profonde": { en: "Deep vertical", es: "Vertical profunda", de: "Tiefe Vertikale", pt: "Vertical profunda" },
  "Rivière / plombée": { en: "River / weighted rig", es: "Río / plomeado", de: "Fluss / Blei", pt: "Rio / chumbada" },
  "Lac / posé": { en: "Lake / static", es: "Lago / posado", de: "See / Ansitz", pt: "Lago / ao fundo" },
  "Carpe / tenue": { en: "Carp / hold", es: "Carpa / sujeción", de: "Karpfen / Halt", pt: "Carpa / fixação" },
  "Très bonne activité": { en: "Very good activity", es: "Actividad muy buena", de: "Sehr gute Aktivität", pt: "Atividade muito boa" },
  "Bonne activité": { en: "Good activity", es: "Buena actividad", de: "Gute Aktivität", pt: "Boa atividade" },
  "Activité moyenne": { en: "Average activity", es: "Actividad media", de: "Mittlere Aktivität", pt: "Atividade média" },
  "Faible activité": { en: "Low activity", es: "Actividad baja", de: "Geringe Aktivität", pt: "Atividade baixa" },
  "Très faible activité": { en: "Very low activity", es: "Actividad muy baja", de: "Sehr geringe Aktivität", pt: "Atividade muito baixa" },
  "Courant favorable": { en: "Favorable current", es: "Corriente favorable", de: "Günstige Strömung", pt: "Corrente favorável" },
  "Courant peu idéal": { en: "Current not ideal", es: "Corriente poco ideal", de: "Strömung wenig ideal", pt: "Corrente pouco ideal" },
  "Pression favorable": { en: "Favorable pressure", es: "Presión favorable", de: "Günstiger Druck", pt: "Pressão favorável" },
  "Pression peu idéale": { en: "Pressure not ideal", es: "Presión poco ideal", de: "Druck wenig ideal", pt: "Pressão pouco ideal" },
  "Lumière favorable": { en: "Favorable light", es: "Luz favorable", de: "Günstiges Licht", pt: "Luz favorável" },
  "Fenêtre solunar": { en: "Solunar window", es: "Ventana solunar", de: "Solunarfenster", pt: "Janela solunar" },
  "Mer moins adaptée": { en: "Sea less suitable", es: "Mar menos adecuado", de: "See weniger geeignet", pt: "Mar menos adequado" },
  "Houle correcte": { en: "Wave OK", es: "Oleaje correcto", de: "Welle passt", pt: "Ondulação correta" },
  "Pluie récente pénalisante": { en: "Recent rain is limiting", es: "Lluvia reciente penalizante", de: "Jüngster Regen bremst", pt: "Chuva recente penalizante" },
  "Vent/météo pénalisants": { en: "Wind/weather limiting", es: "Viento/tiempo penalizantes", de: "Wind/Wetter bremsend", pt: "Vento/meteorologia penalizantes" },
  "Données indisponibles.": { en: "Data unavailable.", es: "Datos no disponibles.", de: "Daten nicht verfügbar.", pt: "Dados indisponíveis." },
  "GO": { en: "GO", es: "GO", de: "GO", pt: "GO" },
  "NO GO": { en: "NO GO", es: "NO GO", de: "NO GO", pt: "NO GO" },
  "À surveiller": { en: "Watch", es: "Vigilar", de: "Beobachten", pt: "A vigiar" },
  "Maybe": { en: "Maybe", es: "Quizá", de: "Vielleicht", pt: "Talvez" },
  "Météo stable": { en: "Stable weather", es: "Tiempo estable", de: "Stabiles Wetter", pt: "Meteorologia estável" },
  "Sortie prudente": { en: "Cautious outing", es: "Salida con prudencia", de: "Vorsichtige Ausfahrt", pt: "Saída prudente" },
  "Créneau intéressant": { en: "Interesting window", es: "Franja interesante", de: "Interessantes Fenster", pt: "Janela interessante" },
  "Conditions à affiner": { en: "Conditions to refine", es: "Condiciones por afinar", de: "Bedingungen prüfen", pt: "Condições a afinar" },
  "Conditions correctes": { en: "Fair conditions", es: "Condiciones correctas", de: "Ordentliche Bedingungen", pt: "Condições corretas" },
  "Eau à surveiller": { en: "Watch the water", es: "Vigilar el agua", de: "Wasser beobachten", pt: "Vigiar a água" },
  "Fenêtre exploitable": { en: "Usable window", es: "Ventana aprovechable", de: "Nutzbares Fenster", pt: "Janela aproveitável" },
  "Conditions stables": { en: "Stable conditions", es: "Condiciones estables", de: "Stabile Bedingungen", pt: "Condições estáveis" },
  "Air": { en: "Air", es: "Aire", de: "Luft", pt: "Ar" },
  "Eau": { en: "Water", es: "Agua", de: "Wasser", pt: "Água" },
  "SST": { en: "SST", es: "SST", de: "SST", pt: "SST" },
  "Front thermique": { en: "Thermal front", es: "Frente térmico", de: "Thermische Front", pt: "Frente térmica" },
  "Marqué": { en: "Strong", es: "Marcado", de: "Ausgeprägt", pt: "Marcado" },
  "Présent": { en: "Present", es: "Presente", de: "Vorhanden", pt: "Presente" },
  "Faible": { en: "Weak", es: "Débil", de: "Schwach", pt: "Fraco" },
  "Fort": { en: "Strong", es: "Fuerte", de: "Stark", pt: "Forte" },
  "Modéré": { en: "Moderate", es: "Moderado", de: "Mäßig", pt: "Moderado" },
  "Très faible": { en: "Very weak", es: "Muy débil", de: "Sehr schwach", pt: "Muito fraco" },
  "Marnage": { en: "Tidal range", es: "Rango de marea", de: "Tidenhub", pt: "Amplitude de maré" },
  "Repère": { en: "Reference", es: "Referencia", de: "Referenz", pt: "Referência" },
  "Pleine mer": { en: "High tide", es: "Pleamar", de: "Hochwasser", pt: "Preia-mar" },
  "Basse mer": { en: "Low tide", es: "Bajamar", de: "Niedrigwasser", pt: "Baixa-mar" },
  "Prochaine": { en: "Next", es: "Próxima", de: "Nächste", pt: "Próxima" },
  "Haute": { en: "High", es: "Alta", de: "Hoch", pt: "Alta" },
  "Basse": { en: "Low", es: "Baja", de: "Niedrig", pt: "Baixa" },
  "Lune": { en: "Moon", es: "Luna", de: "Mond", pt: "Lua" },
  "Lever soleil": { en: "Sunrise", es: "Amanecer", de: "Sonnenaufgang", pt: "Nascer do sol" },
  "Coucher soleil": { en: "Sunset", es: "Atardecer", de: "Sonnenuntergang", pt: "Pôr do sol" },
  "Durée jour": { en: "Day length", es: "Duración del día", de: "Tageslänge", pt: "Duração do dia" },
  "Majeur 1": { en: "Major 1", es: "Mayor 1", de: "Hauptphase 1", pt: "Maior 1" },
  "Majeur 2": { en: "Major 2", es: "Mayor 2", de: "Hauptphase 2", pt: "Maior 2" },
  "Mineur 1": { en: "Minor 1", es: "Menor 1", de: "Nebenphase 1", pt: "Menor 1" },
  "Mineur 2": { en: "Minor 2", es: "Menor 2", de: "Nebenphase 2", pt: "Menor 2" },
  "Neige": { en: "Snow", es: "Nieve", de: "Schnee", pt: "Neve" },
  "Pluie": { en: "Rain", es: "Lluvia", de: "Regen", pt: "Chuva" },
  "Nuageux": { en: "Cloudy", es: "Nublado", de: "Bewölkt", pt: "Nublado" },
  "Ensoleillé": { en: "Sunny", es: "Soleado", de: "Sonnig", pt: "Solarengo" },
  "Courant surface": { en: "Surface current", es: "Corriente superficial", de: "Oberflächenströmung", pt: "Corrente de superfície" },
  "Courant profondeur": { en: "Depth current", es: "Corriente profunda", de: "Tiefenströmung", pt: "Corrente em profundidade" },
  "Houle totale": { en: "Total wave", es: "Oleaje total", de: "Gesamtwelle", pt: "Ondulação total" },
  "Houle de fond": { en: "Swell", es: "Mar de fondo", de: "Dünung", pt: "Ondulação de fundo" },
  "Houle fond": { en: "Swell", es: "Mar de fondo", de: "Dünung", pt: "Ondulação de fundo" },
  "Vent moyen": { en: "Average wind", es: "Viento medio", de: "Mittlerer Wind", pt: "Vento médio" },
  "Rafales": { en: "Gusts", es: "Rachas", de: "Böen", pt: "Rajadas" },
  "Pression": { en: "Pressure", es: "Presión", de: "Druck", pt: "Pressão" },
  "Marine seule": { en: "Marine only", es: "Solo marina", de: "Nur Marine", pt: "Só marinha" },
  "Météo seule": { en: "Weather only", es: "Solo meteorología", de: "Nur Wetter", pt: "Só meteorologia" },
  "Partiel": { en: "Partial", es: "Parcial", de: "Teilweise", pt: "Parcial" },
  "Copernicus": { en: "Copernicus", es: "Copernicus", de: "Copernicus", pt: "Copernicus" },
  "Copernicus indispo": { en: "Copernicus unavailable", es: "Copernicus no disponible", de: "Copernicus nicht verfügbar", pt: "Copernicus indisponível" },
  "Couverture mondiale": { en: "Global coverage", es: "Cobertura mundial", de: "Weltweite Abdeckung", pt: "Cobertura mundial" },
  "Analyse mondiale": { en: "Global analysis", es: "Análisis mundial", de: "Weltweite Analyse", pt: "Análise mundial" },
  "Analyse mondiale du spot": { en: "Global spot analysis", es: "Análisis global del spot", de: "Weltweite Spotanalyse", pt: "Análise global do spot" },
  "Analyse en cours": { en: "Analysis running", es: "Análisis en curso", de: "Analyse läuft", pt: "Análise em curso" },
  "Analyse indisponible": { en: "Analysis unavailable", es: "Análisis no disponible", de: "Analyse nicht verfügbar", pt: "Análise indisponível" },
  "Auto": { en: "Auto", es: "Auto", de: "Auto", pt: "Auto" },
  "Spot mondial": { en: "Global spot", es: "Spot global", de: "Globaler Spot", pt: "Spot global" },
  "Spot à qualifier": { en: "Spot to classify", es: "Spot por clasificar", de: "Spot zu klassifizieren", pt: "Spot a classificar" },
  "Mer détectée": { en: "Sea detected", es: "Mar detectado", de: "Meer erkannt", pt: "Mar detetado" },
  "Océan détecté": { en: "Ocean detected", es: "Océano detectado", de: "Ozean erkannt", pt: "Oceano detetado" },
  "Côte détectée": { en: "Coast detected", es: "Costa detectada", de: "Küste erkannt", pt: "Costa detetada" },
  "Baie détectée": { en: "Bay detected", es: "Bahía detectada", de: "Bucht erkannt", pt: "Baía detetada" },
  "Détroit détecté": { en: "Strait detected", es: "Estrecho detectado", de: "Meerenge erkannt", pt: "Estreito detetado" },
  "Port détecté": { en: "Harbour detected", es: "Puerto detectado", de: "Hafen erkannt", pt: "Porto detetado" },
  "Rivière détectée": { en: "River detected", es: "Río detectado", de: "Fluss erkannt", pt: "Rio detetado" },
  "Canal détecté": { en: "Canal detected", es: "Canal detectado", de: "Kanal erkannt", pt: "Canal detetado" },
  "Lac détecté": { en: "Lake detected", es: "Lago detectado", de: "See erkannt", pt: "Lago detetado" },
  "Réservoir détecté": { en: "Reservoir detected", es: "Embalse detectado", de: "Stausee erkannt", pt: "Reservatório detetado" },
  "Eau douce détectée": { en: "Freshwater detected", es: "Agua dulce detectada", de: "Süßwasser erkannt", pt: "Água doce detetada" },
  "Type d'eau à confirmer": { en: "Water type to confirm", es: "Tipo de agua por confirmar", de: "Gewässertyp bestätigen", pt: "Tipo de água a confirmar" },
  "Confiance élevée": { en: "High confidence", es: "Alta confianza", de: "Hohe Sicherheit", pt: "Confiança elevada" },
  "Confiance moyenne": { en: "Medium confidence", es: "Confianza media", de: "Mittlere Sicherheit", pt: "Confiança média" },
  "Confiance faible": { en: "Low confidence", es: "Baja confianza", de: "Geringe Sicherheit", pt: "Confiança baixa" },
  "Météo mondiale": { en: "Global weather", es: "Meteorología mundial", de: "Weltweites Wetter", pt: "Meteorologia mundial" },
  "Marine mondiale": { en: "Global marine", es: "Marina mundial", de: "Weltweite Meeresdaten", pt: "Marinha mundial" },
  "Données partielles": { en: "Partial data", es: "Datos parciales", de: "Teilweise Daten", pt: "Dados parciais" },
  "Copernicus Marine prêt": { en: "Copernicus Marine ready", es: "Copernicus Marine listo", de: "Copernicus Marine bereit", pt: "Copernicus Marine pronto" },
  "GloFAS prêt": { en: "GloFAS ready", es: "GloFAS listo", de: "GloFAS bereit", pt: "GloFAS pronto" },
  "GloFAS actif": { en: "GloFAS active", es: "GloFAS activo", de: "GloFAS aktiv", pt: "GloFAS ativo" },
  "GloFAS indispo": { en: "GloFAS unavailable", es: "GloFAS no disponible", de: "GloFAS nicht verfügbar", pt: "GloFAS indisponível" },
  "Débit rivière": { en: "River flow", es: "Caudal del río", de: "Flussabfluss", pt: "Caudal do rio" },
  "Débit": { en: "Flow", es: "Caudal", de: "Abfluss", pt: "Caudal" },
  "Tendance débit": { en: "Flow trend", es: "Tendencia del caudal", de: "Abflusstrend", pt: "Tendência do caudal" },
  "Débit stable": { en: "Stable flow", es: "Caudal estable", de: "Stabiler Abfluss", pt: "Caudal estável" },
  "Débit en hausse": { en: "Rising flow", es: "Caudal en subida", de: "Steigender Abfluss", pt: "Caudal a subir" },
  "Débit en baisse": { en: "Falling flow", es: "Caudal en bajada", de: "Sinkender Abfluss", pt: "Caudal a descer" },
  "Débit à surveiller": { en: "Flow to watch", es: "Caudal a vigilar", de: "Abfluss beobachten", pt: "Caudal a vigiar" },
  "Source GloFAS via Open-Meteo": { en: "GloFAS source via Open-Meteo", es: "Fuente GloFAS vía Open-Meteo", de: "GloFAS-Quelle über Open-Meteo", pt: "Fonte GloFAS via Open-Meteo" },
  "Vérification manuelle": { en: "Manual check", es: "Comprobación manual", de: "Manuelle Prüfung", pt: "Verificação manual" },
  "Source mondiale": { en: "Global source", es: "Fuente mundial", de: "Weltweite Quelle", pt: "Fonte mundial" },
  "À jour": { en: "Up to date", es: "Actualizado", de: "Aktuell", pt: "Atualizado" },
  "Données indisponibles": { en: "Data unavailable", es: "Datos no disponibles", de: "Daten nicht verfügbar", pt: "Dados indisponíveis" },
  "Prévisions marines": { en: "Marine forecasts", es: "Previsiones marinas", de: "Meeresvorhersagen", pt: "Previsões marinhas" },
  "Prévisions eau douce": { en: "Freshwater forecasts", es: "Previsiones de agua dulce", de: "Süßwasser-Vorhersagen", pt: "Previsões de água doce" },
  "Cible": { en: "Target", es: "Objetivo", de: "Ziel", pt: "Alvo" },
  "Mode sombre": { en: "Dark mode", es: "Modo oscuro", de: "Dunkelmodus", pt: "Modo escuro" },
  "Mode clair": { en: "Light mode", es: "Modo claro", de: "Hellmodus", pt: "Modo claro" },
  "Forces heure par heure": { en: "Hourly forces", es: "Fuerzas hora a hora", de: "Stündliche Kräfte", pt: "Forças hora a hora" },
  "Forces indisponibles": { en: "Forces unavailable", es: "Fuerzas no disponibles", de: "Kräfte nicht verfügbar", pt: "Forças indisponíveis" },
  "Atmosphère indisponible": { en: "Atmosphere unavailable", es: "Atmósfera no disponible", de: "Atmosphäre nicht verfügbar", pt: "Atmosfera indisponível" },
  "Fond": { en: "Bottom", es: "Fondo", de: "Grund", pt: "Fundo" },
  "Profondeur Copernicus indisponible": { en: "Copernicus depth unavailable", es: "Profundidad Copernicus no disponible", de: "Copernicus-Tiefe nicht verfügbar", pt: "Profundidade Copernicus indisponível" },
  "Connexion absente. Les écrans déjà consultés restent disponibles hors ligne.": { en: "No connection. Previously viewed screens remain available offline.", es: "Sin conexión. Las pantallas ya consultadas siguen disponibles sin conexión.", de: "Keine Verbindung. Bereits geladene Ansichten bleiben offline verfügbar.", pt: "Sem ligação. Os ecrãs já consultados continuam disponíveis offline." },
  "Chargement météo, mer et données Copernicus pour le spot actif.": { en: "Loading weather, sea and Copernicus data for the active spot.", es: "Cargando meteorología, mar y datos Copernicus para el spot activo.", de: "Wetter-, Meeres- und Copernicus-Daten für den aktiven Spot werden geladen.", pt: "A carregar meteorologia, mar e dados Copernicus para o spot ativo." },
  "Chargement météo, mer, Copernicus et GloFAS pour le spot actif.": { en: "Loading weather, sea, Copernicus and GloFAS for the active spot.", es: "Cargando meteorología, mar, Copernicus y GloFAS para el spot activo.", de: "Wetter, Meer, Copernicus und GloFAS für den aktiven Spot werden geladen.", pt: "A carregar meteorologia, mar, Copernicus e GloFAS para o spot ativo." },
  "Impossible de charger les conditions du spot. Vérifie la connexion ou les coordonnées.": { en: "Unable to load spot conditions. Check the connection or coordinates.", es: "No se pueden cargar las condiciones del spot. Comprueba la conexión o las coordenadas.", de: "Spotbedingungen konnten nicht geladen werden. Verbindung oder Koordinaten prüfen.", pt: "Não foi possível carregar as condições do spot. Verifica a ligação ou as coordenadas." },
  "Copernicus indisponible pour le courant en profondeur. Les prévisions météo et marine restent affichées.": { en: "Copernicus is unavailable for depth current. Weather and marine forecasts remain displayed.", es: "Copernicus no está disponible para la corriente en profundidad. Las previsiones meteorológicas y marinas siguen visibles.", de: "Copernicus ist für Tiefenströmung nicht verfügbar. Wetter- und Meeresvorhersagen bleiben sichtbar.", pt: "Copernicus está indisponível para a corrente em profundidade. As previsões meteorológicas e marinhas continuam visíveis." },
  "GloFAS indisponible pour le débit rivière. Les prévisions météo restent affichées.": { en: "GloFAS is unavailable for river flow. Weather forecasts remain displayed.", es: "GloFAS no está disponible para el caudal del río. Las previsiones meteorológicas siguen visibles.", de: "GloFAS ist für den Flussabfluss nicht verfügbar. Wettervorhersagen bleiben sichtbar.", pt: "GloFAS está indisponível para o caudal do rio. As previsões meteorológicas continuam visíveis." },
  "Données partielles: certaines sources sont indisponibles pour ce spot.": { en: "Partial data: some sources are unavailable for this spot.", es: "Datos parciales: algunas fuentes no están disponibles para este spot.", de: "Teilweise Daten: Einige Quellen sind für diesen Spot nicht verfügbar.", pt: "Dados parciais: algumas fontes estão indisponíveis para este spot." },
  "Données Copernicus actives pour les courants en profondeur.": { en: "Copernicus data active for depth currents.", es: "Datos Copernicus activos para corrientes en profundidad.", de: "Copernicus-Daten für Tiefenströmungen aktiv.", pt: "Dados Copernicus ativos para correntes em profundidade." },
  "Données GloFAS actives pour le débit rivière.": { en: "GloFAS data active for river flow.", es: "Datos GloFAS activos para el caudal del río.", de: "GloFAS-Daten für den Flussabfluss aktiv.", pt: "Dados GloFAS ativos para o caudal do rio." },
  "Données synchronisées pour le spot actif.": { en: "Data synced for the active spot.", es: "Datos sincronizados para el spot activo.", de: "Daten für den aktiven Spot synchronisiert.", pt: "Dados sincronizados para o spot ativo." },
  "État des données": { en: "Data status", es: "Estado de datos", de: "Datenstatus", pt: "Estado dos dados" },
  "hauteur relative au niveau moyen": { en: "relative height to mean level", es: "altura relativa al nivel medio", de: "relative Höhe zum Mittelstand", pt: "altura relativa ao nível médio" },
  "trajectoires estimées": { en: "estimated paths", es: "trayectorias estimadas", de: "geschätzte Verläufe", pt: "trajetórias estimadas" },
  "Moyenne": { en: "Medium", es: "Media", de: "Mittel", pt: "Média" },
  "estimation": { en: "estimate", es: "estimación", de: "Schätzung", pt: "estimativa" },
  "Eau OK": { en: "Water OK", es: "Agua OK", de: "Wasser OK", pt: "Água OK" },
  "Température OK": { en: "Temperature OK", es: "Temperatura OK", de: "Temperatur OK", pt: "Temperatura OK" },
  "Hors zone sensible connue autour de ce spot.": { en: "Outside known sensitive areas around this spot.", es: "Fuera de zonas sensibles conocidas alrededor de este spot.", de: "Außerhalb bekannter sensibler Zonen um diesen Spot.", pt: "Fora de zonas sensíveis conhecidas à volta deste spot." },
  "Zones marines masquées en eau douce.": { en: "Marine areas hidden in freshwater mode.", es: "Zonas marinas ocultas en agua dulce.", de: "Meereszonen im Süßwasser-Modus ausgeblendet.", pt: "Zonas marinhas ocultas em água doce." },
  "Zone proche": { en: "Nearby area", es: "Zona cercana", de: "Nahe Zone", pt: "Zona próxima" },
  "de": { en: "from", es: "de", de: "von", pt: "de" },
  "Vérifier avant pêche.": { en: "Check before fishing.", es: "Comprobar antes de pescar.", de: "Vor dem Angeln prüfen.", pt: "Verificar antes de pescar." },
  "Nouvelle lune": { en: "New moon", es: "Luna nueva", de: "Neumond", pt: "Lua nova" },
  "Premier croissant": { en: "Waxing crescent", es: "Luna creciente", de: "Zunehmende Sichel", pt: "Crescente inicial" },
  "Premier quartier": { en: "First quarter", es: "Cuarto creciente", de: "Erstes Viertel", pt: "Quarto crescente" },
  "Lune gibbeuse croissante": { en: "Waxing gibbous moon", es: "Luna gibosa creciente", de: "Zunehmender Mond", pt: "Lua gibosa crescente" },
  "Pleine lune": { en: "Full moon", es: "Luna llena", de: "Vollmond", pt: "Lua cheia" },
  "Lune gibbeuse décroissante": { en: "Waning gibbous moon", es: "Luna gibosa menguante", de: "Abnehmender Mond", pt: "Lua gibosa minguante" },
  "Dernier quartier": { en: "Last quarter", es: "Cuarto menguante", de: "Letztes Viertel", pt: "Quarto minguante" },
  "Dernier croissant": { en: "Waning crescent", es: "Luna menguante", de: "Abnehmende Sichel", pt: "Crescente final" },
  "nouvelle": { en: "new", es: "nueva", de: "neu", pt: "nova" },
  "croissante": { en: "waxing", es: "creciente", de: "zunehmend", pt: "crescente" },
  "1er quartier": { en: "first quarter", es: "cuarto creciente", de: "erstes Viertel", pt: "quarto crescente" },
  "gibbeuse +": { en: "waxing gibbous", es: "gibosa creciente", de: "zunehmend gewölbt", pt: "gibosa crescente" },
  "pleine": { en: "full", es: "llena", de: "voll", pt: "cheia" },
  "gibbeuse -": { en: "waning gibbous", es: "gibosa menguante", de: "abnehmend gewölbt", pt: "gibosa minguante" },
  "dernier quartier": { en: "last quarter", es: "cuarto menguante", de: "letztes Viertel", pt: "quarto minguante" },
  "décroissante": { en: "waning", es: "menguante", de: "abnehmend", pt: "minguante" },
};
const I18N_PREFIXES = [
  { fr: "Air", en: "Air", es: "Aire", de: "Luft", pt: "Ar" },
  { fr: "Eau", en: "Water", es: "Agua", de: "Wasser", pt: "Água" },
  { fr: "Vent", en: "Wind", es: "Viento", de: "Wind", pt: "Vento" },
  { fr: "Rafales", en: "Gusts", es: "Rachas", de: "Böen", pt: "Rajadas" },
  { fr: "Houle", en: "Wave", es: "Oleaje", de: "Welle", pt: "Ondulação" },
  { fr: "Courant", en: "Current", es: "Corriente", de: "Strömung", pt: "Corrente" },
  { fr: "Débit", en: "Flow", es: "Caudal", de: "Abfluss", pt: "Caudal" },
  { fr: "Pression", en: "Pressure", es: "Presión", de: "Druck", pt: "Pressão" },
  { fr: "Pluie", en: "Rain", es: "Lluvia", de: "Regen", pt: "Chuva" },
  { fr: "Nuages", en: "Clouds", es: "Nubes", de: "Wolken", pt: "Nuvens" },
  { fr: "Créneau", en: "Window", es: "Franja", de: "Zeitfenster", pt: "Janela" },
  { fr: "Cible", en: "Target", es: "Objetivo", de: "Ziel", pt: "Alvo" },
  { fr: "Mode sombre", en: "Dark mode", es: "Modo oscuro", de: "Dunkelmodus", pt: "Modo escuro" },
  { fr: "Mode clair", en: "Light mode", es: "Modo claro", de: "Hellmodus", pt: "Modo claro" },
  { fr: "Fourchette", en: "Range", es: "Rango", de: "Bereich", pt: "Intervalo" },
  { fr: "Copernicus indisponible", en: "Copernicus unavailable", es: "Copernicus no disponible", de: "Copernicus nicht verfügbar", pt: "Copernicus indisponível" },
  { fr: "Météo défavorable", en: "Bad weather", es: "Tiempo desfavorable", de: "Ungünstiges Wetter", pt: "Meteorologia desfavorável" },
  { fr: "Sortie possible avec prudence", en: "Possible outing with caution", es: "Salida posible con prudencia", de: "Ausfahrt mit Vorsicht möglich", pt: "Saída possível com prudência" },
];
const I18N_MESSAGES = {
  seaRough: {
    fr: "À {hour}, mer ou rafales à surveiller. Garde une zone abritée et vérifie l'exposition du spot.",
    en: "At {hour}, sea state or gusts need watching. Keep to a sheltered area and check the spot exposure.",
    es: "A las {hour}, vigila el mar o las rachas. Quédate en una zona protegida y comprueba la exposición del spot.",
    de: "Um {hour} Uhr sind Seegang oder Böen im Blick zu behalten. Bleib in einem geschützten Bereich und prüfe die Spot-Exposition.",
    pt: "Às {hour}, mar ou rajadas exigem atenção. Fica numa zona abrigada e verifica a exposição do spot.",
  },
  seaClean: {
    fr: "À {hour}, vent, houle et courant restent dans une fenêtre exploitable.",
    en: "At {hour}, wind, wave and current stay inside a usable window.",
    es: "A las {hour}, viento, oleaje y corriente se mantienen en una ventana aprovechable.",
    de: "Um {hour} Uhr bleiben Wind, Welle und Strömung in einem nutzbaren Fenster.",
    pt: "Às {hour}, vento, ondulação e corrente ficam numa janela aproveitável.",
  },
  seaWarn: {
    fr: "À {hour}, la sortie reste possible mais dépend de l'abri, de la dérive et de la tenue au fond.",
    en: "At {hour}, the outing is still possible but depends on shelter, drift and bottom hold.",
    es: "A las {hour}, la salida sigue siendo posible, pero depende del abrigo, la deriva y el agarre al fondo.",
    de: "Um {hour} Uhr ist die Ausfahrt möglich, hängt aber von Schutz, Drift und Grundhalt ab.",
    pt: "Às {hour}, a saída continua possível, mas depende do abrigo, da deriva e da fixação no fundo.",
  },
  seaFair: {
    fr: "À {hour}, les signaux sont exploitables sans marge énorme. Vérifie le courant et la houle sur place.",
    en: "At {hour}, signals are usable without much margin. Check current and wave on site.",
    es: "A las {hour}, las señales son aprovechables sin mucho margen. Comprueba corriente y oleaje en el lugar.",
    de: "Um {hour} Uhr sind die Signale nutzbar, aber ohne große Reserve. Prüfe Strömung und Welle vor Ort.",
    pt: "Às {hour}, os sinais são aproveitáveis sem grande margem. Confirma corrente e ondulação no local.",
  },
  freshRain: {
    fr: "À {hour}, pluie ou turbidité élevée: privilégie zones calmes, arrivées d'eau et bordures abritées.",
    en: "At {hour}, rain or high turbidity: favor quiet zones, inflows and sheltered edges.",
    es: "A las {hour}, lluvia o turbidez alta: prioriza zonas tranquilas, entradas de agua y orillas protegidas.",
    de: "Um {hour} Uhr bei Regen oder hoher Trübung: ruhige Zonen, Zuläufe und geschützte Kanten bevorzugen.",
    pt: "Às {hour}, chuva ou turbidez elevada: privilegia zonas calmas, entradas de água e margens abrigadas.",
  },
  freshRiver: {
    fr: "À {hour}, débit instable ou en hausse: garde les bordures, remous calmes et zones de repli.",
    en: "At {hour}, unstable or rising flow: keep to edges, quiet eddies and fallback zones.",
    es: "A las {hour}, caudal inestable o en subida: prioriza orillas, remansos tranquilos y zonas de refugio.",
    de: "Um {hour} Uhr bei instabilem oder steigendem Abfluss: Kanten, ruhige Kehrwasser und Ausweichzonen bevorzugen.",
    pt: "Às {hour}, caudal instável ou a subir: privilegia margens, remansos calmos e zonas de abrigo.",
  },
  freshGood: {
    fr: "À {hour}, météo et pression restent cohérentes pour tenter les postes marqués.",
    en: "At {hour}, weather and pressure stay consistent enough to try marked spots.",
    es: "A las {hour}, tiempo y presión siguen coherentes para probar puestos marcados.",
    de: "Um {hour} Uhr bleiben Wetter und Druck stimmig genug für markante Stellen.",
    pt: "Às {hour}, meteorologia e pressão continuam coerentes para tentar postos marcados.",
  },
  freshStable: {
    fr: "À {hour}, sortie possible sans signal fort. Cherche les changements de profondeur et les zones d'ombre.",
    en: "At {hour}, the outing is possible without a strong signal. Look for depth changes and shaded zones.",
    es: "A las {hour}, salida posible sin señal fuerte. Busca cambios de profundidad y zonas de sombra.",
    de: "Um {hour} Uhr ist Angeln möglich, aber ohne starkes Signal. Suche Tiefenwechsel und Schattenzonen.",
    pt: "Às {hour}, saída possível sem sinal forte. Procura mudanças de profundidade e zonas de sombra.",
  },
};
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
const spotWaterKindLabels = {
  sea: "Mer détectée",
  ocean: "Océan détecté",
  coast: "Côte détectée",
  bay: "Baie détectée",
  strait: "Détroit détecté",
  harbour: "Port détecté",
  marina: "Port détecté",
  river: "Rivière détectée",
  stream: "Rivière détectée",
  canal: "Canal détecté",
  lake: "Lac détecté",
  reservoir: "Réservoir détecté",
  pond: "Lac détecté",
  freshwater: "Eau douce détectée",
  unknown: "Type d'eau à confirmer",
};
const spotConfidenceLabels = {
  high: "Confiance élevée",
  medium: "Confiance moyenne",
  low: "Confiance faible",
};
const spotProviderBadgeLabels = {
  "weather-global": "Météo mondiale",
  "marine-global": "Marine mondiale",
  "marine-partial": "Données partielles",
  "copernicus-marine-route": "Copernicus Marine prêt",
  freshwater: "Eau douce",
  "glofas-route": "GloFAS prêt",
  "manual-check": "Vérification manuelle",
  "high-confidence": "Confiance élevée",
};
const DEFAULT_PROFILE = {
  experience: "intermediate",
  approach: "shore",
  priority: "timing",
};
const profileOptions = {
  experience: [
    { id: "beginner", label: "Débutant" },
    { id: "intermediate", label: "Intermédiaire" },
    { id: "advanced", label: "Avancé" },
  ],
  approach: [
    { id: "shore", label: "Bord" },
    { id: "boat", label: "Bateau" },
    { id: "both", label: "Mixte" },
  ],
  priority: [
    { id: "timing", label: "Créneau" },
    { id: "weather", label: "Météo" },
    { id: "spots", label: "Spots" },
  ],
};
const MAP_BASE_ZOOM = 6;
const MAP_MIN_ZOOM = 2;
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
const SHARED_MAP_TILE_OVERLAYS = {
  seamarks: {
    id: "seamarks",
    name: "OpenSeaMap seamarks",
    type: "xyz",
    url: "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png",
    minZoom: MAP_MIN_ZOOM,
    maxZoom: MAP_MAX_ZOOM,
    maxNativeZoom: 17,
    opacity: 0.92,
  },
  emodnetCoastlines: {
    id: "emodnet-coastlines",
    name: "EMODnet coastlines",
    type: "wms",
    url: BATHYMETRY_WMS,
    layers: "coastlines",
    styles: "coastline_osm",
    format: "image/png",
    transparent: true,
    version: "1.3.0",
    opacity: 0.86,
  },
  emodnetSeaNames: {
    id: "emodnet-sea-names",
    name: "EMODnet sea names",
    type: "wms",
    url: BATHYMETRY_WMS,
    layers: "world:sea_names",
    styles: "sea_names",
    format: "image/png",
    transparent: true,
    version: "1.3.0",
    opacity: 0.72,
  },
  emodnetContours: {
    id: "emodnet-contours",
    name: "EMODnet contours",
    type: "wms",
    url: BATHYMETRY_WMS,
    layers: "emodnet:contours",
    styles: "contours",
    format: "image/png",
    transparent: true,
    version: "1.3.0",
    opacity: 0.82,
  },
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

const state = {
  waterMode: WATER_MODES.SEA,
  activeChart: "wind",
  activeAtmosphereChart: "cloud",
  activeMobileView: "map",
  activeWeatherSubtab: "overview",
  days: [],
  hours: [],
  selectedDate: "",
  timelineMinute: 12 * 60,
  liveTimelineRenderKey: "",
  liveTimelinePayloadKey: "",
  liveTimelinePayload: null,
  liveTimelineAnimationFrame: 0,
  liveTimelineProgress: 1,
  liveTimelinePointerStart: null,
  liveTimelineResizeObserver: null,
  liveTimelineVisibilityFrame: 0,
  timelineRenderFrame: 0,
  timelineRenderOptions: null,
  timelineHeavyRenderTimer: 0,
  selectedSpotName: spots[0].name,
  forecastRequestId: 0,
  spotResolution: null,
  spotResolutionLoading: false,
  spotResolutionError: "",
  spotResolutionRequestId: 0,
  spotSearchResults: [],
  spotSearchLoading: false,
  spotSearchError: "",
  spotSearchRequestId: 0,
  nearbySpotResults: [],
  nearbySpotLoading: false,
  nearbySpotError: "",
  nearbySpotRequestId: 0,
  depth: 15,
  realDepthAvailable: false,
  realDepthError: "",
  riverForecast: null,
  riverForecastAvailable: false,
  riverForecastError: "",
  favorites: [],
  mapZoom: MAP_BASE_ZOOM,
  mapCenter: null,
  mapTileKey: "",
  mapDrag: null,
  mapPinch: null,
  mapLoadingTimer: null,
  mapPointers: new Map(),
  mapLayerOpen: false,
  mapFullscreen: false,
  favoritesOpen: false,
  spotPanelOpen: false,
  mapProviderPreference: MAP_PROVIDER_IDS.LEAFLET_OPENMAP,
  mapProviderId: MAP_PROVIDER_IDS.LEAFLET_OPENMAP,
  mapProviderFallbackActive: false,
  mapProviderConfigReady: false,
  mapProviderFallbackReason: "",
  mapProvider: null,
  mapTileOverlays: SHARED_MAP_TILE_OVERLAYS,
  mapClickStart: null,
  suppressNextMapClick: false,
  mapTilePruneTimer: null,
  mapPinLayer: null,
  mapPinLayers: null,
  mapPinPanes: null,
  mapPinMarkers: new Map(),
  mapPinFadeTimers: new Map(),
  osmSpotsLastFetchedBounds: null,
  osmSpotsLastFetchTime: 0,
  osmSpotsFetchTimer: null,
  osmSpotsDebouncedFetch: null,
  osmSpotsLoading: false,
  osmSpotsBlockedUntil: 0,
  osmSpotsRequestId: 0,
  mapMarkers: null,
  nauticalLayer: null,
  nauticalEnabled: true,
  coastalLayer: null,
  coastalEnabled: true,
  emodnetBathymetryLayer: null,
  bathymetryLayer: null,
  bathymetryEnabled: true,
  bathymetryFocusDepth: null,
  bathymetryPointCache: new Map(),
  bathymetryPointRequestId: 0,
  bathymetryPointTimer: null,
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
  theme: "light",
  language: defaultLanguage(),
  isPro: false,
  profile: { ...DEFAULT_PROFILE },
  forecastExpanded: false,
  riggingDirty: false,
  renamingFavoriteId: null,
  pendingSpot: null,
  onboardingCompleted: false,
  privacyAccepted: false,
  notificationsEnabled: false,
  smartAlerts: defaultSmartAlertSettings(),
  smartAlertSchedule: [],
  glancePayload: null,
  entitlements: defaultEntitlementState(),
  native: {
    isNative: Boolean(window.Capacitor?.isNativePlatform?.()),
    online: navigator.onLine !== false,
    offlineReady: false,
    gpsPermission: "prompt",
    notificationPermission: "prompt",
  },
  pendingCatchMedia: [],
};

const els = {
  modeButtons: [...document.querySelectorAll("[data-water-mode]")],
  mobileTabButtons: [...document.querySelectorAll("[data-mobile-tab]")],
  mobileViewSections: [...document.querySelectorAll("[data-mobile-view]")],
  weatherSubtabButtons: [...document.querySelectorAll("[data-weather-tab]")],
  weatherSubviewSections: [...document.querySelectorAll("[data-weather-subview]")],
  main: document.querySelector("main"),
  appSplash: document.querySelector("#appSplash"),
  onboardingScreen: document.querySelector("#onboardingScreen"),
  onboardingClose: document.querySelector("#onboardingClose"),
  onboardingGpsButton: document.querySelector("#onboardingGpsButton"),
  onboardingNotificationButton: document.querySelector("#onboardingNotificationButton"),
  onboardingDone: document.querySelector("#onboardingDone"),
  onboardingLater: document.querySelector("#onboardingLater"),
  onboardingGpsStatus: document.querySelector("#onboardingGpsStatus"),
  onboardingNotificationStatus: document.querySelector("#onboardingNotificationStatus"),
  onboardingOfflineStatus: document.querySelector("#onboardingOfflineStatus"),
  onboardingOnlineBadge: document.querySelector("#onboardingOnlineBadge"),
  spotControls: document.querySelector("#spotControls"),
  spotPanelButton: document.querySelector("#spotPanelButton"),
  spotPanelClose: document.querySelector("#spotPanelClose"),
  spotSummaryName: document.querySelector("#spotSummaryName"),
  spotSummaryCoords: document.querySelector("#spotSummaryCoords"),
  spotPreset: document.querySelector("#spotPreset"),
  spotSearchInput: document.querySelector("#spotSearchInput"),
  spotSearchButton: document.querySelector("#spotSearchButton"),
  spotSearchResults: document.querySelector("#spotSearchResults"),
  nearbySpotsButton: document.querySelector("#nearbySpotsButton"),
  nearbySpotResults: document.querySelector("#nearbySpotResults"),
  latitude: document.querySelector("#latitude"),
  longitude: document.querySelector("#longitude"),
  spotForm: document.querySelector("#spotForm"),
  locateBtn: document.querySelector("#locateBtn"),
  depth: document.querySelector("#depth"),
  depthOutput: document.querySelector("#depthOutput"),
  dayTabs: document.querySelector("#dayTabs"),
  preferencePanel: document.querySelector(".preferences-panel"),
  languageSelect: document.querySelector("#languageSelect"),
  proStatusLabel: document.querySelector("#proStatusLabel"),
  proToggle: document.querySelector("#proToggle"),
  proGate: document.querySelector("#proGate"),
  proGateBackdrop: document.querySelector("#proGateBackdrop"),
  proGateTitle: document.querySelector("#proGateTitle"),
  proGateCopy: document.querySelector("#proGateCopy"),
  proGateBenefits: document.querySelector("#proGateBenefits"),
  proGateCta: document.querySelector("#proGateCta"),
  proGateClose: document.querySelector("#proGateClose"),
  proGateLater: document.querySelector("#proGateLater"),
  proFeatureCards: [...document.querySelectorAll("[data-pro-feature]")],
  themeButtons: [...document.querySelectorAll("[data-theme-value]")],
  profileButtons: [...document.querySelectorAll("[data-profile-control] [data-profile-value]")],
  preferenceSpecies: document.querySelector("#preferenceSpecies"),
  preferenceDepth: document.querySelector("#preferenceDepth"),
  preferenceDepthOutput: document.querySelector("#preferenceDepthOutput"),
  preferenceSummary: document.querySelector("#preferenceSummary"),
  preferencesBack: document.querySelector("#preferencesBack"),
  nativeGpsStatus: document.querySelector("#nativeGpsStatus"),
  nativeNotificationStatus: document.querySelector("#nativeNotificationStatus"),
  nativeOfflineStatus: document.querySelector("#nativeOfflineStatus"),
  nativeOnlineBadge: document.querySelector("#nativeOnlineBadge"),
  forecastStatusDetail: document.querySelector("#forecastStatusDetail"),
  spotResolutionStatus: document.querySelector("#spotResolutionStatus"),
  spotResolutionBadge: document.querySelector("#spotResolutionBadge"),
  nativePrivacyStatus: document.querySelector("#nativePrivacyStatus"),
  nativeGpsButton: document.querySelector("#nativeGpsButton"),
  nativeNotificationButton: document.querySelector("#nativeNotificationButton"),
  nativePrivacyButton: document.querySelector("#nativePrivacyButton"),
  nativeOnboardingButton: document.querySelector("#nativeOnboardingButton"),
  smartAlertSpot: document.querySelector("#smartAlertSpot"),
  smartAlertSpecies: document.querySelector("#smartAlertSpecies"),
  smartAlertType: document.querySelector("#smartAlertType"),
  smartAlertEnabled: document.querySelector("#smartAlertEnabled"),
  smartAlertQuietStart: document.querySelector("#smartAlertQuietStart"),
  smartAlertQuietEnd: document.querySelector("#smartAlertQuietEnd"),
  smartAlertPreview: document.querySelector("#smartAlertPreview"),
  smartAlertScheduleButton: document.querySelector("#smartAlertScheduleButton"),
  smartAlertCancelButton: document.querySelector("#smartAlertCancelButton"),
  smartAlertStatus: document.querySelector("#smartAlertStatus"),
  activityFish: document.querySelector("#activityFish"),
  activityRing: document.querySelector("#activityRing"),
  activityScore: document.querySelector("#activityScore"),
  activityLabel: document.querySelector("#activityLabel"),
  activityContext: document.querySelector("#activityContext"),
  activityReasons: document.querySelector("#activityReasons"),
  activityCanvas: document.querySelector("#activityCanvas"),
  activityMajor: document.querySelector("#activityMajor"),
  activityMinor: document.querySelector("#activityMinor"),
  tideLocation: document.querySelector("#tideLocation"),
  tideCanvas: document.querySelector("#tideCanvas"),
  tideSummaryGrid: document.querySelector("#tideSummaryGrid"),
  tideEventsList: document.querySelector("#tideEventsList"),
  astroLocation: document.querySelector("#astroLocation"),
  astroCanvas: document.querySelector("#astroCanvas"),
  moonCard: document.querySelector("#moonCard"),
  astroSummaryGrid: document.querySelector("#astroSummaryGrid"),
  solunarWindowGrid: document.querySelector("#solunarWindowGrid"),
  catchForm: document.querySelector("#catchForm"),
  catchSpecies: document.querySelector("#catchSpecies"),
  catchLength: document.querySelector("#catchLength"),
  catchWeight: document.querySelector("#catchWeight"),
  catchNotes: document.querySelector("#catchNotes"),
  catchPhotoInput: document.querySelector("#catchPhotoInput"),
  catchPhotoButton: document.querySelector("#catchPhotoButton"),
  catchPhotoPreview: document.querySelector("#catchPhotoPreview"),
  catchLogList: document.querySelector("#catchLogList"),
  conditionBrief: document.querySelector("#conditionBrief"),
  conditionGoNoGo: document.querySelector("#conditionGoNoGo"),
  conditionDecision: document.querySelector("#conditionDecision"),
  conditionReason: document.querySelector("#conditionReason"),
  conditionScore: document.querySelector("#conditionScore"),
  conditionFacts: document.querySelector("#conditionFacts"),
  timingWindowCard: document.querySelector("#timingWindowCard"),
  timingWindowScore: document.querySelector("#timingWindowScore"),
  timingWindowTitle: document.querySelector("#timingWindowTitle"),
  timingWindowDetail: document.querySelector("#timingWindowDetail"),
  timingWindowFacts: document.querySelector("#timingWindowFacts"),
  timingWindowChips: document.querySelector("#timingWindowChips"),
  planningPanel: document.querySelector("#planningPanel"),
  planningContext: document.querySelector("#planningContext"),
  planningList: document.querySelector("#planningList"),
  metricGrid: document.querySelector("#metricGrid"),
  metricTemplate: document.querySelector("#metricTemplate"),
  waterInsights: document.querySelector("#waterInsights"),
  dayTimeline: document.querySelector("#dayTimeline"),
  liveTimelineCanvas: document.querySelector("#liveTimelineCanvas"),
  liveTimelineCards: document.querySelector("#liveTimelineCards"),
  timelinePrevDay: document.querySelector("#timelinePrevDay"),
  timelineNextDay: document.querySelector("#timelineNextDay"),
  dayTimeRange: document.querySelector("#dayTimeRange"),
  dayTimelineTime: document.querySelector("#dayTimelineTime"),
  dayTimelineReadout: document.querySelector("#dayTimelineReadout"),
  compassCanvas: document.querySelector("#compassCanvas"),
  chartCanvas: document.querySelector("#chartCanvas"),
  chartLegend: document.querySelector("#chartLegend"),
  chartTitle: document.querySelector("#chartTitle"),
  atmosphereChartButtons: [...document.querySelectorAll("[data-atmosphere-chart]")],
  atmosphereChartCanvas: document.querySelector("#atmosphereChartCanvas"),
  atmosphereChartLegend: document.querySelector("#atmosphereChartLegend"),
  atmosphereChartTitle: document.querySelector("#atmosphereChartTitle"),
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
  activeSpotContext: document.querySelector("#activeSpotContext"),
  mapZoomIn: document.querySelector("#mapZoomIn"),
  mapZoomOut: document.querySelector("#mapZoomOut"),
  mapFullscreenButton: document.querySelector("#mapFullscreenButton"),
  mapLayersButton: document.querySelector("#mapLayersButton"),
  mapLayerSheet: document.querySelector("#mapLayerSheet"),
  mapLayerClose: document.querySelector("#mapLayerClose"),
  mapLayerBackdrop: document.querySelector("#mapLayerBackdrop"),
  mapOverlayActions: document.querySelector(".map-overlay-actions"),
  mapSensitiveButton: document.querySelector("#mapSensitiveButton"),
  mapFavoritesButton: document.querySelector("#mapFavoritesButton"),
  mapFavoritesOverlay: document.querySelector("#mapFavoritesOverlay"),
  mapFavoritesClose: document.querySelector("#mapFavoritesClose"),
  mapNauticalToggle: document.querySelector("#mapNauticalToggle"),
  mapCoastalToggle: document.querySelector("#mapCoastalToggle"),
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
  good: "#16875f",
  amber: "#b97322",
  violet: "#7357b8",
  coral: "#c85c45",
};

function cssVariable(name, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function canvasTheme() {
  return {
    bg: cssVariable("--canvas-bg", "#fbfdfb"),
    line: cssVariable("--canvas-grid", "#d9e2dc"),
    subtleLine: cssVariable("--canvas-subtle-grid", "rgba(89, 101, 111, 0.2)"),
    muted: cssVariable("--canvas-muted", "#62706a"),
    ink: cssVariable("--canvas-ink", "#17201d"),
    badge: cssVariable("--canvas-badge", "rgba(255, 255, 255, 0.88)"),
    badgeBorder: cssVariable("--canvas-badge-border", "rgba(189, 203, 195, 0.88)"),
    marker: cssVariable("--canvas-marker", "rgba(200, 92, 69, 0.45)"),
    pointStroke: cssVariable("--canvas-point-stroke", "#fff"),
  };
}

function themeColor(name) {
  return cssVariable(`--chart-${name}`, colors[name] ?? name);
}

let i18nReverseMap = null;
let i18nObserver = null;
let i18nApplying = false;
let i18nScheduled = false;
let nativeMapInteractionRegionFrame = 0;

function defaultLanguage() {
  const browserLanguage = String(navigator.languages?.[0] || navigator.language || "fr").toLowerCase().split("-")[0];
  return LANGUAGE_MODES.includes(browserLanguage) ? browserLanguage : "fr";
}

function normalizeLanguage(language) {
  const value = String(language ?? "").toLowerCase().split("-")[0];
  return LANGUAGE_MODES.includes(value) ? value : defaultLanguage();
}

function currentLanguage() {
  return normalizeLanguage(state.language);
}

function currentLocale() {
  return LANGUAGE_OPTIONS[currentLanguage()]?.locale ?? "fr-FR";
}

function buildI18nReverseMap() {
  if (i18nReverseMap) return i18nReverseMap;
  i18nReverseMap = new Map();
  Object.entries(I18N_TRANSLATIONS).forEach(([source, translations]) => {
    i18nReverseMap.set(source, source);
    Object.values(translations).forEach((translation) => {
      if (translation) i18nReverseMap.set(translation, source);
    });
  });
  return i18nReverseMap;
}

function i18nSourceForText(text) {
  return buildI18nReverseMap().get(String(text ?? ""));
}

function t(source) {
  const text = String(source ?? "");
  const normalized = i18nSourceForText(text) ?? text;
  if (currentLanguage() === "fr") return normalized;
  return I18N_TRANSLATIONS[normalized]?.[currentLanguage()] ?? normalized;
}

function i18nMessage(key, values = {}) {
  const messages = I18N_MESSAGES[key] ?? {};
  const template = messages[currentLanguage()] ?? messages.fr ?? "";
  return template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
}

function prefixMatchForText(text) {
  for (const prefix of I18N_PREFIXES) {
    for (const language of LANGUAGE_MODES) {
      const translatedPrefix = prefix[language] ?? prefix.fr;
      if (text === translatedPrefix) {
        return { prefix, rest: "" };
      }
      if (text.startsWith(`${translatedPrefix} `)) {
        return { prefix, rest: text.slice(translatedPrefix.length) };
      }
      if (text.startsWith(`${translatedPrefix}:`)) {
        return { prefix, rest: text.slice(translatedPrefix.length) };
      }
    }
  }
  return null;
}

function translateCoreText(text) {
  const source = i18nSourceForText(text);
  if (source) return t(source);

  if (text.includes(" · ")) {
    return text.split(" · ").map(translateCoreText).join(" · ");
  }

  const prefixMatch = prefixMatchForText(text);
  if (prefixMatch) {
    return `${prefixMatch.prefix[currentLanguage()] ?? prefixMatch.prefix.fr}${prefixMatch.rest}`;
  }

  return text;
}

function translateText(text) {
  const value = String(text ?? "");
  const start = value.match(/^\s*/)?.[0] ?? "";
  const end = value.match(/\s*$/)?.[0] ?? "";
  const core = value.trim();
  if (!core) return value;
  return `${start}${translateCoreText(core)}${end}`;
}

function shouldTranslateElement(element) {
  if (!element) return false;
  return !["SCRIPT", "STYLE", "TEXTAREA", "CANVAS"].includes(element.nodeName);
}

function translateAttributes(element) {
  if (!shouldTranslateElement(element)) return;
  ["aria-label", "placeholder", "title", "alt"].forEach((attribute) => {
    if (!element.hasAttribute(attribute)) return;
    const value = element.getAttribute(attribute);
    const translated = translateText(value);
    if (translated !== value) element.setAttribute(attribute, translated);
  });
}

function applyTranslations(root = document.body) {
  if (!root) return;
  i18nApplying = true;
  try {
    document.documentElement.lang = currentLanguage();
    const rootElement = root.nodeType === Node.ELEMENT_NODE ? root : root.parentElement;
    translateAttributes(rootElement);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          return shouldTranslateElement(node.parentElement) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
        return shouldTranslateElement(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });

    let node = walker.currentNode;
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const translated = translateText(node.nodeValue);
        if (translated !== node.nodeValue) node.nodeValue = translated;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        translateAttributes(node);
      }
      node = walker.nextNode();
    }
  } finally {
    i18nApplying = false;
  }
}

function scheduleApplyTranslations() {
  if (i18nApplying || i18nScheduled) return;
  i18nScheduled = true;
  window.requestAnimationFrame(() => {
    i18nScheduled = false;
    applyTranslations(document.body);
  });
}

function setupI18nObserver() {
  if (i18nObserver || !document.body) return;
  i18nObserver = new MutationObserver(scheduleApplyTranslations);
  i18nObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["aria-label", "placeholder", "title", "alt"],
  });
}

async function init() {
  populateSpots();
  restoreState();
  setupI18nObserver();
  applyTheme();
  initNativeAppShell();
  state.favorites = readFavorites();
  populateActivityFish();
  populateCatchSpecies();
  populatePreferenceSpecies();
  populateRiggingTechniques();
  await initMapEngine();
  bindEvents();
  installLiveTimelineResizeObserver();
  updateDepth();
  applyWaterModeUI();
  applyDefaultWeatherChart();
  applyMobileNavigationUI();
  renderSpotTools();
  renderPreferenceControls();
  renderNativeStatus();
  renderCatchPhotoPreview();
  applyTranslations(document.body);
  maybeShowOnboarding();
  loadForecast();
  scheduleHideAppSplash(650);
}

async function initMapEngine() {
  document.documentElement.dataset.mapProviderStartupStep = "install-debug-bridges";
  installLocalNativeMapBridgeDebug();
  installLocalWebMapSdkDebug();
  document.documentElement.dataset.mapProviderStartupStep = "resolve-provider";
  resolveRuntimeMapProvider();

  const active = getActiveSpot();
  state.mapCenter = { lat: active.lat, lon: active.lon };
  document.documentElement.dataset.mapProviderStartupStep = "mount-provider";
  const mounted = await mountMapProvider(state.mapProviderId, active);
  if (mounted) return;

  if (state.mapProviderId !== MAP_PROVIDER_IDS.LEAFLET_OPENMAP) {
    state.mapProviderId = MAP_PROVIDER_IDS.LEAFLET_OPENMAP;
    state.mapProviderFallbackActive = true;
    state.mapProviderFallbackReason = "mount-failed";
    applyRuntimeMapProviderDataset();
    await mountMapProvider(MAP_PROVIDER_IDS.LEAFLET_OPENMAP, active);
  }
}

async function mountMapProvider(providerId, active) {
  if (providerId === MAP_PROVIDER_IDS.LEAFLET_OPENMAP) {
    document.documentElement.dataset.mapProviderMountStep = "wait-leaflet";
    await waitForLeafletLibrary();
  }

  document.documentElement.dataset.mapProviderMountStep = "create-provider";
  state.mapProvider = createMapProvider(providerId);
  if (!state.mapProvider) return false;

  try {
    document.documentElement.dataset.mapProviderMountStep = "init";
    await state.mapProvider.init({ center: active, zoom: state.mapZoom });
    els.spotMap.classList.add("has-map-provider");
    delete document.documentElement.dataset.mapProviderMountError;
    clearFallbackMapDom();

    document.documentElement.dataset.mapProviderMountStep = "base-layers";
    state.nauticalLayer = state.mapProvider.createSeamarksLayer();
    state.coastalLayer = state.mapProvider.createCoastalLayer();
    updateNauticalOverlay();
    updateCoastalOverlay();

    document.documentElement.dataset.mapProviderMountStep = "ui-propagation";
    state.mapProvider.disableUiEventPropagation([
      els.spotControls,
      els.spotNameSheet,
      els.mapLayerSheet,
      els.mapLayerBackdrop,
      els.fishFilterControl,
      els.mapOverlayActions,
      els.safetyBanner,
      els.mapFavoritesOverlay,
    ]);

    document.documentElement.dataset.mapProviderMountStep = "feature-layers";
    document.documentElement.dataset.mapProviderMountStep = "known-layer";
    state.knownFishingLayer = state.mapProvider.createLayerGroup();
    document.documentElement.dataset.mapProviderMountStep = "known-overlay";
    updateKnownFishingOverlay();

    document.documentElement.dataset.mapProviderMountStep = "bathymetry-tile-layer";
    state.emodnetBathymetryLayer = state.mapProvider.createBathymetryTileLayer();
    document.documentElement.dataset.mapProviderMountStep = "bathymetry-marker-layer";
    state.bathymetryLayer = state.mapProvider.createLayerGroup();
    document.documentElement.dataset.mapProviderMountStep = "bathymetry-render";
    renderBathymetryLayer();
    document.documentElement.dataset.mapProviderMountStep = "bathymetry-overlay";
    updateBathymetryOverlay();

    document.documentElement.dataset.mapProviderMountStep = "regulation-layer";
    state.regulationLayer = state.mapProvider.createLayerGroup();
    document.documentElement.dataset.mapProviderMountStep = "regulation-overlay";
    updateRegulationOverlay();

    document.documentElement.dataset.mapProviderMountStep = "marine-anchor-layers";
    state.marineOverlayLayer = state.mapProvider.createLayerGroup({ addToMap: true });
    state.anchorLayer = state.mapProvider.createLayerGroup({ addToMap: true });
    document.documentElement.dataset.mapProviderMountStep = "pin-layers";
    setupMapPinLayers();
    state.mapMarkers = state.mapProvider.createLayerGroup({ addToMap: true });
    document.documentElement.dataset.mapProviderMountStep = "events";
    state.osmSpotsDebouncedFetch = debounce(() => scheduleOverpassSpotFetch(), 600);
    state.mapProvider.on("click", selectProviderMapPoint);
    state.mapProvider.on("moveend zoomend", syncProviderMapState);
    state.mapProvider.on("moveend zoomend", state.osmSpotsDebouncedFetch);
    state.mapProvider.on("zoomend", updateMapPinVisibility);
    delete document.documentElement.dataset.mapProviderMountStep;
    return true;
  } catch (error) {
    console.warn(`Map provider ${providerId} failed to mount.`, error);
    state.mapProviderFallbackActive = true;
    state.mapProviderFallbackReason = "mount-failed";
    document.documentElement.dataset.mapProviderMountError = String(error?.message ?? error ?? "mount failed").slice(0, 160);
    applyRuntimeMapProviderDataset();
    state.mapProvider?.destroy?.();
    resetMapProviderMountState();
    return false;
  }
}

function resetMapProviderMountState() {
  els.spotMap.classList.remove(
    "has-map-provider",
    "is-leaflet",
    "is-google-map",
    "is-apple-map",
    "is-native-map",
    "leaflet-container",
    "leaflet-touch",
    "leaflet-retina",
    "leaflet-fade-anim",
  );
  delete els.spotMap._leaflet_id;
  state.mapProvider = null;
  state.nauticalLayer = null;
  state.coastalLayer = null;
  state.knownFishingLayer = null;
  state.emodnetBathymetryLayer = null;
  state.bathymetryLayer = null;
  state.regulationLayer = null;
  state.marineOverlayLayer = null;
  state.anchorLayer = null;
  state.mapPinLayer = null;
  state.mapPinLayers = null;
  state.mapPinPanes = null;
  state.mapMarkers = null;
}

function clearFallbackMapDom() {
  els.mapTiles.replaceChildren();
  els.mapMarkers.replaceChildren();
  state.mapTileKey = "";
}

function createMapProvider(providerId) {
  const options = {
    container: els.spotMap,
    tileOverlays: state.mapTileOverlays,
    onLoadingChange: setMapProviderLoading,
  };

  if (providerId === MAP_PROVIDER_IDS.GOOGLE_WEB) {
    return new GoogleMapsWebProvider(options);
  }

  if (providerId === MAP_PROVIDER_IDS.APPLE_WEB) {
    return new AppleMapsWebProvider(options);
  }

  if (providerId === MAP_PROVIDER_IDS.APPLE_NATIVE || providerId === MAP_PROVIDER_IDS.GOOGLE_NATIVE) {
    return new NativeBridgeMapProvider({ ...options, providerId });
  }

  if (providerId === MAP_PROVIDER_IDS.LEAFLET_OPENMAP && isLeafletLibraryReady()) {
    return new LeafletMapProvider(options);
  }

  return null;
}

function isLeafletLibraryReady() {
  return Boolean(window.L?.map && window.L?.tileLayer && window.L?.layerGroup);
}

function waitForLeafletLibrary(timeoutMs = 1600) {
  if (isLeafletLibraryReady()) return Promise.resolve(true);
  loadLeafletLibraryFallback();

  return new Promise((resolve) => {
    const startedAt = Date.now();
    const check = () => {
      if (isLeafletLibraryReady()) {
        resolve(true);
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        resolve(false);
        return;
      }

      window.setTimeout(check, 40);
    };
    check();
  });
}

function loadLeafletLibraryFallback() {
  if (isLeafletLibraryReady() || document.getElementById("leaflet-js-fallback")) return;

  const script = document.createElement("script");
  script.id = "leaflet-js-fallback";
  script.src = "vendor/leaflet/leaflet.js?v=20260603-native-cache-recovery";
  script.defer = true;
  document.head.appendChild(script);
}

function leafletDefinedOptions(source, keys) {
  return Object.fromEntries(
    keys
      .filter((key) => source[key] !== undefined)
      .map((key) => [key, source[key]]),
  );
}

class LeafletMapProvider {
  constructor({ container, tileOverlays, onLoadingChange }) {
    this.id = MAP_PROVIDER_IDS.LEAFLET_OPENMAP;
    this.container = container;
    this.tileOverlays = tileOverlays;
    this.onLoadingChange = onLoadingChange;
    this.map = null;
  }

  init({ center, zoom }) {
    this.map = L.map(this.container, {
      zoomControl: false,
      attributionControl: false,
      minZoom: MAP_MIN_ZOOM,
      maxZoom: MAP_MAX_ZOOM,
      preferCanvas: true,
      wheelDebounceTime: 50,
      tap: true,
      tapTolerance: 15,
      touchZoom: true,
      bounceAtZoomLimits: false,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
    }).setView([center.lat, center.lon], zoom);

    this.container.classList.add("is-leaflet");
    this.ensureDefaultPanes();
    this.addBaseLayer();
    this.on("loading", () => this.onLoadingChange(true));
    this.on("load", () => this.onLoadingChange(false));
    return this.map;
  }

  destroy() {
    this.container.classList.remove("is-leaflet");
    this.map?.remove?.();
    this.map = null;
  }

  addBaseLayer() {
    const baseTileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      minZoom: MAP_MIN_ZOOM,
      maxZoom: MAP_MAX_ZOOM,
      keepBuffer: 4,
      updateWhenIdle: true,
      updateWhenZooming: false,
      crossOrigin: true,
    });
    this.bindTileLoadingState(baseTileLayer);
    baseTileLayer.addTo(this.map);
    return baseTileLayer;
  }

  ensureDefaultPanes() {
    ["tilePane", "overlayPane", "shadowPane", "markerPane", "tooltipPane", "popupPane"].forEach((paneName) => {
      if (!this.map.getPane(paneName)) this.map.createPane(paneName);
    });
  }

  createSeamarksLayer() {
    const overlay = this.tileOverlays.seamarks;
    const layer = L.tileLayer(overlay.url, {
      minZoom: overlay.minZoom,
      maxZoom: overlay.maxZoom,
      maxNativeZoom: overlay.maxNativeZoom,
      keepBuffer: 4,
      updateWhenIdle: true,
      updateWhenZooming: false,
      opacity: overlay.opacity,
      crossOrigin: true,
    });
    this.bindTileLoadingState(layer);
    return layer;
  }

  createCoastalLayer() {
    const coastlineOverlay = this.tileOverlays.emodnetCoastlines;
    const seaNamesOverlay = this.tileOverlays.emodnetSeaNames;
    return this.createLayerGroup({
      layers: [
        this.createWmsTileLayer(coastlineOverlay, { attribution: "EMODnet Bathymetry" }),
        this.createWmsTileLayer(seaNamesOverlay, { attribution: "SeaDataNet" }),
      ],
    });
  }

  createBathymetryTileLayer() {
    return this.createWmsTileLayer(this.tileOverlays.emodnetContours, { attribution: "EMODnet Bathymetry" });
  }

  createWmsTileLayer(overlay, options = {}) {
    const layer = L.tileLayer.wms(overlay.url, {
      layers: overlay.layers,
      styles: overlay.styles,
      format: overlay.format,
      transparent: overlay.transparent,
      version: overlay.version,
      opacity: overlay.opacity,
      minZoom: MAP_MIN_ZOOM,
      maxZoom: MAP_MAX_ZOOM,
      attribution: options.attribution,
    });
    this.bindTileLoadingState(layer);
    return layer;
  }

  createLayerGroup(options = {}) {
    const layer = L.layerGroup(options.layers ?? []);
    if (options.addToMap) layer.addTo(this.map);
    return layer;
  }

  createPinTierLayers(tiers) {
    const panes = {};
    const layers = {};

    tiers.forEach((tier) => {
      const pane = this.map.createPane(tier.pane);
      pane.style.zIndex = String(tier.zIndex);
      pane.style.opacity = "0";
      pane.style.pointerEvents = "none";
      pane.style.transition = "opacity 300ms ease-out";
      panes[tier.id] = pane;
      layers[tier.id] = this.createLayerGroup({ addToMap: true });
    });

    return {
      panes,
      layers,
      layer: this.createLayerGroup({ layers: Object.values(layers) }),
    };
  }

  addMarkerBatch(layer, markers) {
    if (!layer || !markers.length) return null;
    const batchGroup = this.createLayerGroup({ layers: markers });
    batchGroup.addTo(layer);
    return batchGroup;
  }

  removeMarkerFromBatch(marker, tierLayers) {
    if (!marker) return;
    if (marker.__pinBatchGroup) {
      const batchGroup = marker.__pinBatchGroup;
      batchGroup.removeLayer(marker);
      if (!batchGroup.getLayers().length) {
        tierLayers?.[marker.__pinTier]?.removeLayer(batchGroup);
      }
      marker.__pinBatchGroup = null;
      return;
    }
    tierLayers?.[marker.__pinTier]?.removeLayer(marker);
  }

  setPinPaneVisibility(panes, tiers, zoom) {
    tiers.forEach((tier) => {
      const pane = panes?.[tier.id];
      if (!pane) return;
      const visible = zoom >= tier.minZoom;
      pane.style.opacity = visible ? "1" : "0";
      pane.style.pointerEvents = visible ? "auto" : "none";
    });
  }

  clearLayer(layer) {
    layer?.clearLayers?.();
  }

  createDivIcon(options) {
    return L.divIcon(options);
  }

  addMarker(layer, definition) {
    const marker = L.marker([definition.lat, definition.lon], leafletDefinedOptions(definition, [
      "icon",
      "keyboard",
      "interactive",
      "opacity",
      "pane",
      "riseOnHover",
      "title",
      "zIndexOffset",
    ]));
    this.bindTooltip(marker, definition.tooltip);
    this.bindClick(marker, definition.onClick);
    if (layer) marker.addTo(layer);
    return marker;
  }

  addCircleMarker(layer, definition) {
    const marker = L.circleMarker([definition.lat, definition.lon], leafletDefinedOptions(definition, [
      "radius",
      "color",
      "weight",
      "fillColor",
      "fillOpacity",
      "bubblingMouseEvents",
    ]));
    this.bindTooltip(marker, definition.tooltip);
    this.bindClick(marker, definition.onClick);
    marker.addTo(layer);
    return marker;
  }

  addCircle(layer, definition) {
    const circle = L.circle([definition.lat, definition.lon], leafletDefinedOptions(definition, [
      "radius",
      "color",
      "fillColor",
      "fillOpacity",
      "weight",
    ]));
    this.bindTooltip(circle, definition.tooltip);
    this.bindClick(circle, definition.onClick);
    circle.addTo(layer);
    return circle;
  }

  addPolyline(layer, definition) {
    const polyline = L.polyline(definition.coordinates, leafletDefinedOptions(definition, [
      "color",
      "dashArray",
      "weight",
    ]));
    this.bindTooltip(polyline, definition.tooltip);
    this.bindClick(polyline, definition.onClick);
    polyline.addTo(layer);
    return polyline;
  }

  addPolygon(layer, definition) {
    const polygon = L.polygon(definition.coordinates, leafletDefinedOptions(definition, [
      "color",
      "fillColor",
      "fillOpacity",
      "weight",
      "dashArray",
      "interactive",
    ]));
    this.bindTooltip(polygon, definition.tooltip);
    if (definition.popup) polygon.bindPopup(definition.popup);
    this.bindClick(polygon, definition.onClick);
    polygon.addTo(layer);
    return polygon;
  }

  bindTooltip(layer, tooltip) {
    if (!tooltip) return;
    layer.bindTooltip(tooltip.content, tooltip.options ?? {});
  }

  bindClick(layer, onClick) {
    if (!onClick) return;
    layer.on("click", (event) => onClick(event));
  }

  setMarkerPosition(marker, lat, lon) {
    marker?.setLatLng?.([lat, lon]);
  }

  setMarkerIcon(marker, icon) {
    marker?.setIcon?.(icon);
  }

  setMarkerZIndex(marker, zIndexOffset) {
    marker?.setZIndexOffset?.(zIndexOffset);
  }

  setMarkerOpacity(marker, opacity) {
    marker?.setOpacity?.(opacity);
  }

  getMarkerElement(marker) {
    return marker?.getElement?.() ?? null;
  }

  getMarkerTooltip(marker) {
    return marker?.getTooltip?.() ?? null;
  }

  setMarkerTooltipContent(marker, content) {
    marker?.setTooltipContent?.(content);
  }

  ensureMarkerTooltip(marker, tooltip) {
    if (!marker || !tooltip) return;
    if (this.getMarkerTooltip(marker)) {
      this.setMarkerTooltipContent(marker, tooltip.content);
      return;
    }
    this.bindTooltip(marker, tooltip);
  }

  flyTo(lat, lon, zoom, options = {}) {
    this.map?.flyTo?.([lat, lon], zoom, options);
  }

  once(eventName, handler) {
    this.map?.once?.(eventName, handler);
    return {
      remove: () => this.map?.off?.(eventName, handler),
    };
  }

  getCenter() {
    const center = this.map?.getCenter();
    return center ? { lat: center.lat, lon: center.lng } : null;
  }

  getZoom() {
    return this.map?.getZoom?.() ?? state.mapZoom;
  }

  getBounds() {
    const bounds = this.map?.getBounds?.();
    return bounds ? {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    } : null;
  }

  setView(lat, lon, zoom = state.mapZoom) {
    this.map?.setView([lat, lon], zoom, { animate: false });
  }

  setZoom(zoom, options = {}) {
    if (!this.map) return;
    if (options.anchorPoint) {
      const rect = this.container.getBoundingClientRect();
      this.map.setZoomAround(
        L.point(options.anchorPoint.x * rect.width, options.anchorPoint.y * rect.height),
        zoom,
        { animate: false },
      );
      return;
    }
    this.map.setZoom(zoom, { animate: false });
  }

  invalidateSize() {
    this.map?.invalidateSize?.(false);
  }

  metersPerCssPixel() {
    const rect = this.container.getBoundingClientRect();
    const midpointY = rect.height / 2;
    const start = this.map.containerPointToLatLng([0, midpointY]);
    const end = this.map.containerPointToLatLng([100, midpointY]);
    return this.map.distance(start, end) / 100;
  }

  hasLayer(layer) {
    return Boolean(layer && this.map?.hasLayer(layer));
  }

  addLayer(layer) {
    if (layer && !this.hasLayer(layer)) layer.addTo(this.map);
  }

  removeLayer(layer) {
    if (layer && this.hasLayer(layer)) this.map.removeLayer(layer);
  }

  setLayerVisible(layer, visible) {
    if (visible) {
      this.addLayer(layer);
    } else {
      this.removeLayer(layer);
    }
  }

  disableUiEventPropagation(elements) {
    elements.filter(Boolean).forEach((element) => {
      L.DomEvent.disableClickPropagation(element);
      L.DomEvent.disableScrollPropagation(element);
    });
  }

  stopEvent(event) {
    if (event?.originalEvent) L.DomEvent.stop(event.originalEvent);
  }

  on(eventName, handler) {
    this.map?.on?.(eventName, handler);
    return {
      remove: () => this.map?.off?.(eventName, handler),
    };
  }

  bindTileLoadingState(layer) {
    if (!layer?.on) return;
    layer.on("loading", () => this.onLoadingChange(true));
    layer.on("load", () => this.onLoadingChange(false));
    layer.on("tileerror", () => this.onLoadingChange(false));
  }
}

class GoogleMapsWebProvider {
  constructor({ container, tileOverlays, onLoadingChange }) {
    this.id = MAP_PROVIDER_IDS.GOOGLE_WEB;
    this.container = container;
    this.tileOverlays = tileOverlays;
    this.onLoadingChange = onLoadingChange;
    this.maps = null;
    this.map = null;
    this.listeners = [];
    this.uiEventCleanups = [];
    this.layerGroups = [];
  }

  async init({ center, zoom }) {
    this.maps = await loadGoogleMapsWebSdk();
    this.map = new this.maps.Map(this.container, {
      center: { lat: center.lat, lng: center.lon },
      zoom,
      disableDefaultUI: true,
      clickableIcons: false,
      gestureHandling: "greedy",
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      minZoom: MAP_MIN_ZOOM,
      maxZoom: MAP_MAX_ZOOM,
    });
    this.container.classList.add("is-google-map");
    return this.map;
  }

  destroy() {
    this.layerGroups.splice(0).forEach((layer) => {
      layer.setMap?.(null);
      layer.clear?.();
    });
    this.listeners.splice(0).forEach((listener) => listener?.remove?.());
    this.uiEventCleanups.splice(0).forEach((cleanup) => cleanup());
    this.maps?.event?.clearInstanceListeners?.(this.map);
    this.container.classList.remove("is-google-map");
    this.map = null;
  }

  createSeamarksLayer() {
    return this.createTileOverlay(this.tileOverlays.seamarks);
  }

  createCoastalLayer() {
    return this.createLayerGroup({
      layers: [
        this.createTileOverlay(this.tileOverlays.emodnetCoastlines),
        this.createTileOverlay(this.tileOverlays.emodnetSeaNames),
      ],
    });
  }

  createBathymetryTileLayer() {
    return this.createTileOverlay(this.tileOverlays.emodnetContours);
  }

  createTileOverlay(overlay) {
    const imageMapType = new this.maps.ImageMapType({
      getTileUrl: (coord, zoom) => mapOverlayTileUrl(overlay, coord.x, coord.y, zoom),
      tileSize: new this.maps.Size(MAP_TILE_SIZE, MAP_TILE_SIZE),
      minZoom: overlay.minZoom ?? MAP_MIN_ZOOM,
      maxZoom: overlay.maxZoom ?? MAP_MAX_ZOOM,
      opacity: overlay.opacity ?? 1,
      name: overlay.name,
    });
    imageMapType.__overlayId = overlay.id;
    return imageMapType;
  }

  createLayerGroup(options = {}) {
    const layer = new GoogleMapsWebLayerGroup(options.layers ?? []);
    this.layerGroups.push(layer);
    if (options.addToMap) layer.setMap(this.map);
    return layer;
  }

  createPinTierLayers(tiers) {
    const panes = {};
    const layers = {};

    tiers.forEach((tier) => {
      panes[tier.id] = { style: {} };
      layers[tier.id] = this.createLayerGroup({ addToMap: true });
      panes[tier.id].layer = layers[tier.id];
    });

    return {
      panes,
      layers,
      layer: this.createLayerGroup({ layers: Object.values(layers) }),
    };
  }

  addMarkerBatch(layer, markers) {
    if (!layer || !markers.length) return null;
    const batchGroup = this.createLayerGroup();
    markers.forEach((marker) => batchGroup.add(marker));
    layer.add(batchGroup);
    batchGroup.setMap(layer.map);
    return batchGroup;
  }

  removeMarkerFromBatch(marker, tierLayers) {
    if (!marker) return;
    if (marker.__pinBatchGroup) {
      const batchGroup = marker.__pinBatchGroup;
      batchGroup.remove(marker);
      if (batchGroup.isEmpty()) {
        tierLayers?.[marker.__pinTier]?.remove?.(batchGroup);
      }
      marker.__pinBatchGroup = null;
      return;
    }

    tierLayers?.[marker.__pinTier]?.remove?.(marker);
  }

  setPinPaneVisibility(panes, tiers, zoom) {
    tiers.forEach((tier) => {
      const pane = panes?.[tier.id];
      if (!pane) return;
      const visible = zoom >= tier.minZoom;
      pane.style.opacity = visible ? "1" : "0";
      pane.style.pointerEvents = visible ? "auto" : "none";
      pane.layer?.setMap?.(visible ? this.map : null);
    });
  }

  clearLayer(layer) {
    return layer?.clear?.();
  }

  createDivIcon(options) {
    return options;
  }

  addMarker(layer, definition) {
    const marker = googleDivIconHtml(definition.icon)
      ? new GoogleMapsWebHtmlMarker(this.maps, definition)
      : new this.maps.Marker({
        position: { lat: definition.lat, lng: definition.lon },
        map: layer?.map ?? null,
        title: definition.title,
        clickable: definition.interactive !== false,
        opacity: definition.opacity ?? 1,
        zIndex: definition.zIndexOffset,
        icon: googleMarkerIconFromDivIcon(definition.icon),
      });
    if (googleDivIconHtml(definition.icon) && layer?.map) marker.setMap(layer.map);
    layer?.add?.(marker);
    this.bindTooltip(marker, definition.tooltip, {
      anchor: marker,
      position: () => marker.getPosition?.(),
    });
    if (definition.onClick) googleTrackListener(marker, marker.addListener("click", (event) => definition.onClick(this.normalizeEvent("click", event))));
    return marker;
  }

  addCircleMarker(layer, definition) {
    const marker = new this.maps.Circle({
      center: { lat: definition.lat, lng: definition.lon },
      radius: Math.max(20, (definition.radius ?? 8) * mapMetersPerCssPixel()),
      map: layer?.map ?? null,
      strokeColor: definition.color,
      strokeWeight: definition.weight,
      strokeOpacity: definition.opacity ?? 1,
      fillColor: definition.fillColor,
      fillOpacity: definition.fillOpacity,
      clickable: definition.interactive !== false,
      zIndex: definition.zIndexOffset,
    });
    layer?.add?.(marker);
    this.bindTooltip(marker, definition.tooltip, {
      position: () => marker.getCenter?.(),
    });
    this.bindPopup(marker, definition.popup, {
      position: (event) => event?.latLng ?? marker.getCenter?.(),
    });
    if (definition.onClick) googleTrackListener(marker, marker.addListener("click", (event) => definition.onClick(this.normalizeEvent("click", event))));
    return marker;
  }

  addCircle(layer, definition) {
    const circle = new this.maps.Circle({
      center: { lat: definition.lat, lng: definition.lon },
      radius: definition.radius,
      strokeColor: definition.color,
      strokeWeight: definition.weight,
      strokeOpacity: definition.opacity ?? 1,
      fillColor: definition.fillColor,
      fillOpacity: definition.fillOpacity,
      clickable: definition.interactive !== false,
      map: layer?.map ?? null,
    });
    layer?.add?.(circle);
    this.bindTooltip(circle, definition.tooltip, {
      position: () => circle.getCenter?.(),
    });
    this.bindPopup(circle, definition.popup, {
      position: (event) => event?.latLng ?? circle.getCenter?.(),
    });
    if (definition.onClick) googleTrackListener(circle, circle.addListener("click", (event) => definition.onClick(this.normalizeEvent("click", event))));
    return circle;
  }

  addPolyline(layer, definition) {
    const center = mapProviderShapeCenter(definition);
    const polyline = new this.maps.Polyline({
      path: mapProviderGoogleCoordinatePath(definition.coordinates),
      strokeColor: definition.color,
      strokeWeight: definition.weight,
      strokeOpacity: definition.dashArray ? 0 : 1,
      icons: googlePolylineIcons(definition.dashArray, definition.color),
      clickable: definition.interactive !== false,
      map: layer?.map ?? null,
    });
    polyline.__meteoPecheShapeCenter = center;
    layer?.add?.(polyline);
    this.bindTooltip(polyline, definition.tooltip);
    this.bindPopup(polyline, definition.popup, {
      position: (event) => event?.latLng ?? mapProviderGoogleLatLngLiteral(center),
    });
    if (definition.onClick) googleTrackListener(polyline, polyline.addListener("click", (event) => definition.onClick(this.normalizeShapeEvent(event, polyline))));
    return polyline;
  }

  setMarkerPosition(marker, lat, lon) {
    marker?.setPosition?.({ lat, lng: lon });
  }

  setMarkerIcon(marker, icon) {
    marker?.setIcon?.(googleMarkerIconFromDivIcon(icon));
  }

  setMarkerZIndex(marker, zIndexOffset) {
    marker?.setZIndex?.(zIndexOffset);
  }

  setMarkerOpacity(marker, opacity) {
    marker?.setOpacity?.(opacity);
  }

  getMarkerElement(marker) {
    return marker?.getElement?.() ?? null;
  }

  getMarkerTooltip(marker) {
    return marker?.__meteoPecheTooltip ?? null;
  }

  setMarkerTooltipContent(marker, content) {
    if (!marker?.__meteoPecheTooltip) return;
    marker.__meteoPecheTooltip.setContent(tooltipContentForGoogle(content));
  }

  ensureMarkerTooltip(marker, tooltip) {
    this.bindTooltip(marker, tooltip, {
      anchor: marker,
      position: () => marker.getPosition?.(),
    });
  }

  bindTooltip(item, tooltip, options = {}) {
    if (!tooltip?.content || !this.maps?.InfoWindow) return;
    if (item.__meteoPecheTooltip) {
      item.__meteoPecheTooltip.setContent(tooltipContentForGoogle(tooltip.content));
      return;
    }

    const infoWindow = new this.maps.InfoWindow({
      content: tooltipContentForGoogle(tooltip.content),
      disableAutoPan: true,
    });
    item.__meteoPecheTooltip = infoWindow;

    googleTrackListener(item, item.addListener?.("mouseover", (event) => {
      const position = options.position?.() ?? event?.latLng;
      if (position) infoWindow.setPosition(position);
      const openOptions = { map: this.map };
      if (options.anchor && !options.anchor.getElement) openOptions.anchor = options.anchor;
      infoWindow.open(openOptions);
    }));
    googleTrackListener(item, item.addListener?.("mouseout", () => infoWindow.close()));
  }

  bindPopup(item, popup, options = {}) {
    if (!popup || !this.maps?.InfoWindow) return;
    if (item.__meteoPechePopup) {
      item.__meteoPechePopup.setContent(tooltipContentForGoogle(popup));
      return;
    }

    const infoWindow = new this.maps.InfoWindow({
      content: tooltipContentForGoogle(popup),
    });
    item.__meteoPechePopup = infoWindow;

    googleTrackListener(item, item.addListener?.("click", (event) => {
      const position = options.position?.(event) ?? event?.latLng;
      if (position) infoWindow.setPosition(position);
      infoWindow.open(this.map);
    }));
  }

  normalizeShapeEvent(payload, shape) {
    const position = mapProviderEventLatLng(payload)
      ?? mapProviderLatLngFromGoogle(shape?.getCenter?.())
      ?? mapProviderLatLngFromGoogle(shape?.__meteoPecheShapeCenter);
    return {
      latlng: position,
      originalEvent: payload?.domEvent ?? payload,
    };
  }

  flyTo(lat, lon, zoom) {
    if (!this.map) return;
    this.map.setCenter({ lat, lng: lon });
    this.map.setZoom(zoom);
  }

  once(eventName, handler) {
    const googleEvent = googleWebMapEventName(eventName);
    const listener = this.maps.event.addListener(this.map, googleEvent, (payload) => {
      listener.remove();
      this.listeners = this.listeners.filter((entry) => entry !== listener);
      handler(this.normalizeEvent(eventName, payload));
    });
    this.listeners.push(listener);
    return {
      remove: () => {
        listener?.remove?.();
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      },
    };
  }

  addPolygon(layer, definition) {
    const center = mapProviderShapeCenter(definition);
    const polygon = new this.maps.Polygon({
      paths: mapProviderGooglePolygonPaths(definition.coordinates),
      strokeColor: definition.color,
      strokeWeight: definition.weight,
      strokeOpacity: definition.opacity ?? 1,
      fillColor: definition.fillColor,
      fillOpacity: definition.fillOpacity,
      clickable: definition.interactive !== false,
      map: layer?.map ?? null,
    });
    polygon.__meteoPecheShapeCenter = center;
    layer?.add?.(polygon);
    this.bindTooltip(polygon, definition.tooltip);
    this.bindPopup(polygon, definition.popup, {
      position: (event) => event?.latLng ?? mapProviderGoogleLatLngLiteral(center),
    });
    if (definition.onClick) googleTrackListener(polygon, polygon.addListener("click", (event) => definition.onClick(this.normalizeShapeEvent(event, polygon))));
    return polygon;
  }

  getCenter() {
    const center = this.map?.getCenter?.();
    return center ? { lat: center.lat(), lon: center.lng() } : null;
  }

  getZoom() {
    return this.map?.getZoom?.() ?? state.mapZoom;
  }

  getBounds() {
    const bounds = this.map?.getBounds?.();
    if (!bounds) return null;
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    return {
      north: northEast.lat(),
      south: southWest.lat(),
      east: northEast.lng(),
      west: southWest.lng(),
    };
  }

  setView(lat, lon, zoom = state.mapZoom) {
    if (!this.map) return;
    this.map.setCenter({ lat, lng: lon });
    this.map.setZoom(zoom);
  }

  setZoom(zoom) {
    this.map?.setZoom?.(zoom);
  }

  invalidateSize() {
    this.maps?.event?.trigger?.(this.map, "resize");
  }

  metersPerCssPixel() {
    const center = this.getCenter() ?? getMapCenter();
    return (Math.cos(toRad(center.lat)) * 40075016.686) / (MAP_TILE_SIZE * 2 ** this.getZoom());
  }

  hasLayer(layer) {
    if (!layer || !this.map) return false;
    if (layer instanceof GoogleMapsWebLayerGroup) return layer.isVisibleOn(this.map);
    return this.map.overlayMapTypes.getArray().includes(layer);
  }

  addLayer(layer) {
    if (!layer || this.hasLayer(layer)) return;
    if (layer instanceof GoogleMapsWebLayerGroup) {
      layer.setMap(this.map);
      return;
    }
    this.map.overlayMapTypes.push(layer);
  }

  removeLayer(layer) {
    if (!layer || !this.hasLayer(layer)) return;
    if (layer instanceof GoogleMapsWebLayerGroup) {
      layer.setMap(null);
      return;
    }

    removeGoogleOverlay(this.map, layer);
  }

  setLayerVisible(layer, visible) {
    if (visible) {
      this.addLayer(layer);
    } else {
      this.removeLayer(layer);
    }
  }

  disableUiEventPropagation(elements) {
    elements.filter(Boolean).forEach((element) => {
      const stop = (event) => event.stopPropagation();
      element.addEventListener("click", stop);
      element.addEventListener("pointerdown", stop);
      element.addEventListener("wheel", stop, { passive: true });
      this.uiEventCleanups.push(() => {
        element.removeEventListener("click", stop);
        element.removeEventListener("pointerdown", stop);
        element.removeEventListener("wheel", stop);
      });
    });
  }

  stopEvent(event) {
    event?.originalEvent?.stopPropagation?.();
    event?.originalEvent?.preventDefault?.();
  }

  on(eventName, handler) {
    const events = String(eventName).split(/\s+/).filter(Boolean);
    const listeners = events.map((event) => {
      const googleEvent = googleWebMapEventName(event);
      const listener = this.maps.event.addListener(this.map, googleEvent, (payload) => {
        handler(this.normalizeEvent(event, payload));
      });
      this.listeners.push(listener);
      return listener;
    });
    return {
      remove: () => {
        listeners.forEach((listener) => {
          listener?.remove?.();
          this.listeners = this.listeners.filter((entry) => entry !== listener);
        });
      },
    };
  }

  normalizeEvent(eventName, payload) {
    const latlng = mapProviderEventLatLng(payload);
    if (eventName === "click" && latlng) {
      return {
        latlng,
        originalEvent: payload.domEvent,
      };
    }

    return payload;
  }
}

class GoogleMapsWebLayerGroup {
  constructor(layers = []) {
    this.layers = layers.filter((layer) => !(layer instanceof GoogleMapsWebLayerGroup));
    this.childGroups = layers.filter((layer) => layer instanceof GoogleMapsWebLayerGroup);
    this.items = [];
    this.map = null;
  }

  add(item) {
    this.items.push(item);
    if (this.map && item?.setMap) item.setMap(this.map);
  }

  remove(item) {
    cleanupGoogleMapItem(item);
    item?.setMap?.(null);
    this.items = this.items.filter((entry) => entry !== item);
  }

  isEmpty() {
    return !this.items.length && this.childGroups.every((group) => group.isEmpty());
  }

  clear() {
    this.childGroups.forEach((group) => group.clear());
    this.items.forEach(cleanupGoogleMapItem);
    this.items.forEach((item) => item?.setMap?.(null));
    this.items = [];
  }

  setMap(map) {
    const previousMap = this.map;
    this.map = map;
    this.childGroups.forEach((group) => group.setMap(map));
    this.layers.forEach((layer) => {
      if (!map) {
        removeGoogleOverlay(previousMap, layer);
        return;
      }
      if (!map.overlayMapTypes.getArray().includes(layer)) map.overlayMapTypes.push(layer);
    });
    this.items.forEach((item) => item?.setMap?.(map));
  }

  isVisibleOn(map) {
    if (this.map !== map) return false;
    const overlays = map?.overlayMapTypes?.getArray?.() ?? [];
    return this.layers.every((layer) => overlays.includes(layer))
      && this.childGroups.every((group) => group.isVisibleOn(map));
  }
}

class GoogleMapsWebHtmlMarker {
  constructor(maps, definition) {
    this.maps = maps;
    this.position = new maps.LatLng(definition.lat, definition.lon);
    this.icon = definition.icon;
    this.title = definition.title ?? "";
    this.zIndex = definition.zIndexOffset ?? 0;
    this.opacity = definition.opacity ?? 1;
    this.interactive = definition.interactive !== false;
    this.listeners = [];
    this.element = this.createElement();
    this.overlay = this.createOverlay();
  }

  createElement() {
    const element = document.createElement("div");
    element.className = googleDivIconClassName(this.icon);
    element.innerHTML = googleDivIconHtml(this.icon);
    element.title = this.title;
    element.style.position = "absolute";
    element.style.transformOrigin = "0 0";
    element.style.zIndex = String(this.zIndex);
    element.style.opacity = String(this.opacity);
    element.style.pointerEvents = this.interactive ? "auto" : "none";
    return element;
  }

  createOverlay() {
    const marker = this;
    return new class extends marker.maps.OverlayView {
      onAdd() {
        this.getPanes()?.overlayMouseTarget?.append(marker.element);
      }

      draw() {
        const projection = this.getProjection();
        if (!projection) return;
        const point = projection.fromLatLngToDivPixel(marker.position);
        if (!point) return;
        const [anchorX, anchorY] = googleDivIconAnchor(marker.icon);
        marker.element.style.transform = `translate(${point.x - anchorX}px, ${point.y - anchorY}px)`;
      }

      onRemove() {
        marker.element.remove();
      }
    }();
  }

	  setMap(map) {
	    this.map = map;
	    this.overlay.setMap(map);
	  }

  setPosition(position) {
    this.position = new this.maps.LatLng(position.lat, position.lng);
    this.overlay.draw?.();
  }

  getPosition() {
    return this.position;
  }

  setIcon(icon) {
    this.icon = icon;
    this.element.className = googleDivIconClassName(icon);
    this.element.innerHTML = googleDivIconHtml(icon);
    this.overlay.draw?.();
  }

  setZIndex(zIndex) {
    this.zIndex = zIndex ?? 0;
    this.element.style.zIndex = String(this.zIndex);
  }

  setOpacity(opacity) {
    this.opacity = opacity;
    this.element.style.opacity = String(opacity);
  }

  getElement() {
    return this.element;
  }

  addListener(eventName, handler) {
    const domEventName = googleHtmlMarkerDomEventName(eventName);
    const listener = (event) => handler({ domEvent: event, latLng: this.position });
    this.element.addEventListener(domEventName, listener);
    const handle = {
      remove: () => {
        this.element.removeEventListener(domEventName, listener);
        this.listeners = this.listeners.filter((entry) => entry !== handle);
      },
    };
    this.listeners.push(handle);
    return handle;
  }

  removeListeners() {
    [...this.listeners].forEach((listener) => listener.remove());
  }
}

class AppleMapsWebProvider {
  constructor({ container, tileOverlays, onLoadingChange }) {
    this.id = MAP_PROVIDER_IDS.APPLE_WEB;
    this.container = container;
    this.tileOverlays = tileOverlays;
    this.onLoadingChange = onLoadingChange;
    this.mapkit = null;
    this.map = null;
    this.zoom = state.mapZoom;
    this.listeners = [];
    this.uiEventCleanups = [];
    this.layerGroups = [];
  }

  async init({ center, zoom }) {
    this.mapkit = await loadAppleMapKitWebSdk();
    this.map = new this.mapkit.Map(this.container, {
      showsCompass: this.mapkit.FeatureVisibility?.Hidden,
      showsMapTypeControl: false,
      showsScale: this.mapkit.FeatureVisibility?.Hidden,
      showsZoomControl: false,
    });
    this.container.classList.add("is-apple-map");
    this.setView(center.lat, center.lon, zoom);
    return this.map;
  }

  destroy() {
    this.layerGroups.splice(0).forEach((layer) => {
      layer.setMap?.(null);
      layer.clear?.();
    });
    this.listeners.splice(0).forEach((listener) => listener?.remove?.());
    this.uiEventCleanups.splice(0).forEach((cleanup) => cleanup());
    this.container.classList.remove("is-apple-map");
    this.map?.destroy?.();
    this.map = null;
  }

  createSeamarksLayer() {
    return this.createTileOverlay(this.tileOverlays.seamarks);
  }

  createCoastalLayer() {
    return this.createLayerGroup({
      layers: [
        this.createTileOverlay(this.tileOverlays.emodnetCoastlines),
        this.createTileOverlay(this.tileOverlays.emodnetSeaNames),
      ],
    });
  }

  createBathymetryTileLayer() {
    return this.createTileOverlay(this.tileOverlays.emodnetContours);
  }

  createTileOverlay(overlay) {
    return new AppleMapsWebTileOverlay(this.mapkit, overlay);
  }

  createLayerGroup(options = {}) {
    const layer = new AppleMapsWebLayerGroup(options.layers ?? []);
    this.layerGroups.push(layer);
    if (options.addToMap) layer.setMap(this.map);
    return layer;
  }

  createPinTierLayers(tiers) {
    const panes = {};
    const layers = {};

    tiers.forEach((tier) => {
      panes[tier.id] = { style: {} };
      layers[tier.id] = this.createLayerGroup({ addToMap: true });
      panes[tier.id].layer = layers[tier.id];
    });

    return {
      panes,
      layers,
      layer: this.createLayerGroup({ layers: Object.values(layers) }),
    };
  }

  addMarkerBatch(layer, markers) {
    if (!layer || !markers.length) return null;
    const batchGroup = this.createLayerGroup();
    markers.forEach((marker) => batchGroup.add(marker));
    layer.add(batchGroup);
    batchGroup.setMap(layer.map);
    return batchGroup;
  }

  removeMarkerFromBatch(marker, tierLayers) {
    if (!marker) return;
    if (marker.__pinBatchGroup) {
      const batchGroup = marker.__pinBatchGroup;
      batchGroup.remove(marker);
      if (batchGroup.isEmpty()) {
        tierLayers?.[marker.__pinTier]?.remove?.(batchGroup);
      }
      marker.__pinBatchGroup = null;
      return;
    }

    tierLayers?.[marker.__pinTier]?.remove?.(marker);
  }

  setPinPaneVisibility(panes, tiers, zoom) {
    tiers.forEach((tier) => {
      const pane = panes?.[tier.id];
      if (!pane) return;
      const visible = zoom >= tier.minZoom;
      pane.style.opacity = visible ? "1" : "0";
      pane.style.pointerEvents = visible ? "auto" : "none";
      pane.layer?.setMap?.(visible ? this.map : null);
    });
  }

  clearLayer(layer) {
    layer?.clear?.();
  }

  createDivIcon(options) {
    return options;
  }

  addMarker(layer, definition) {
    const marker = new AppleMapsWebAnnotation(this.mapkit, definition);
    layer?.add?.(marker);
    if (definition.onClick) marker.addListener("select", (event) => definition.onClick(this.normalizeAnnotationEvent(event, marker)));
    return marker;
  }

  addCircleMarker(layer, definition) {
    const marker = new AppleMapsWebAnnotation(this.mapkit, {
      ...definition,
      icon: null,
      title: definition.tooltip?.content,
      markerColor: definition.fillColor ?? definition.color,
      glyphText: "",
    });
    layer?.add?.(marker);
    if (definition.onClick) marker.addListener("select", (event) => definition.onClick(this.normalizeAnnotationEvent(event, marker)));
    return marker;
  }

  addCircle(layer, definition) {
    const circle = new AppleMapsWebShapeOverlay(this.mapkit, "circle", definition);
    layer?.add?.(circle);
    if (definition.popup) circle.addListener("select", () => circle.showPopup(definition.popup));
    if (definition.onClick) circle.addListener("select", (event) => definition.onClick(this.normalizeShapeEvent(event, circle)));
    return circle;
  }

  addPolyline(layer, definition) {
    const polyline = new AppleMapsWebShapeOverlay(this.mapkit, "polyline", definition);
    layer?.add?.(polyline);
    if (definition.popup) polyline.addListener("select", () => polyline.showPopup(definition.popup));
    if (definition.onClick) polyline.addListener("select", (event) => definition.onClick(this.normalizeShapeEvent(event, polyline)));
    return polyline;
  }

  addPolygon(layer, definition) {
    const polygon = new AppleMapsWebShapeOverlay(this.mapkit, "polygon", definition);
    layer?.add?.(polygon);
    if (definition.popup) polygon.addListener("select", () => polygon.showPopup(definition.popup));
    if (definition.onClick) polygon.addListener("select", (event) => definition.onClick(this.normalizeShapeEvent(event, polygon)));
    return polygon;
  }

  getCenter() {
    const center = this.map?.center;
    return center ? { lat: center.latitude, lon: center.longitude } : null;
  }

  getZoom() {
    return this.zoom ?? state.mapZoom;
  }

  getBounds() {
    const region = this.map?.region;
    const center = region?.center ?? this.map?.center;
    const span = region?.span;
    if (!center || !span) return null;
    const latitudeDelta = span.latitudeDelta ?? span.latitude ?? 0;
    const longitudeDelta = span.longitudeDelta ?? span.longitude ?? 0;
    return {
      north: center.latitude + latitudeDelta / 2,
      south: center.latitude - latitudeDelta / 2,
      east: center.longitude + longitudeDelta / 2,
      west: center.longitude - longitudeDelta / 2,
    };
  }

  setView(lat, lon, zoom = state.mapZoom) {
    if (!this.mapkit || !this.map) return;
    this.zoom = zoom;
    const center = new this.mapkit.Coordinate(lat, lon);
    this.map.center = center;
    if (!this.mapkit.CoordinateRegion || !this.mapkit.CoordinateSpan) return;
    const span = mapKitCoordinateSpanForZoom(zoom, lat);
    this.map.region = new this.mapkit.CoordinateRegion(
      center,
      new this.mapkit.CoordinateSpan(span.latitudeDelta, span.longitudeDelta),
    );
  }

  setZoom(zoom) {
    const center = this.getCenter() ?? getMapCenter();
    this.setView(center.lat, center.lon, zoom);
  }

  setMarkerPosition(marker, lat, lon) {
    marker?.setPosition?.(lat, lon);
  }

  setMarkerIcon(marker, icon) {
    marker?.setIcon?.(icon);
  }

  setMarkerZIndex(marker, zIndexOffset) {
    marker?.setZIndex?.(zIndexOffset);
  }

  setMarkerOpacity(marker, opacity) {
    marker?.setOpacity?.(opacity);
  }

  getMarkerElement(marker) {
    return marker?.getElement?.() ?? null;
  }

  getMarkerTooltip(marker) {
    return marker?.tooltip ?? null;
  }

  setMarkerTooltipContent(marker, content) {
    marker?.setTooltipContent?.(content);
  }

  ensureMarkerTooltip(marker, tooltip) {
    marker?.setTooltipContent?.(tooltip?.content);
  }

  flyTo(lat, lon, zoom) {
    this.setView(lat, lon, zoom);
    window.requestAnimationFrame(() => this.dispatchSyntheticEvent("region-change-end"));
  }

  once(eventName, handler) {
    const eventMap = { moveend: "region-change-end", zoomend: "region-change-end" };
    const mapkitEvent = eventMap[eventName] ?? eventName;
    if (!this.map?.addEventListener) {
      window.requestAnimationFrame(handler);
      return { remove: () => {} };
    }
    let handled = false;
    let timeoutId = null;
    const handle = {
      remove: () => {
        if (handled) return;
        handled = true;
        if (timeoutId) window.clearTimeout(timeoutId);
        this.map?.removeEventListener?.(mapkitEvent, listener);
        this.listeners = this.listeners.filter((entry) => entry !== handle);
      },
    };
    const listener = (event) => {
      if (handled) return;
      handled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
      this.map.removeEventListener?.(mapkitEvent, listener);
      this.listeners = this.listeners.filter((entry) => entry !== handle);
      handler(this.normalizeEvent(eventName, event));
    };
    this.map.addEventListener(mapkitEvent, listener);
    this.listeners.push(handle);
    timeoutId = window.setTimeout(() => listener({ type: mapkitEvent }), 140);
    return handle;
  }

  invalidateSize() {}

  metersPerCssPixel() {
    const center = this.getCenter() ?? getMapCenter();
    return (Math.cos(toRad(center.lat)) * 40075016.686) / (MAP_TILE_SIZE * 2 ** this.getZoom());
  }

  hasLayer(layer) {
    if (!layer || !this.map) return false;
    if (layer instanceof AppleMapsWebLayerGroup) return layer.isVisibleOn(this.map);
    return layer.map === this.map;
  }

  addLayer(layer) {
    if (!layer || this.hasLayer(layer)) return;
    layer.setMap?.(this.map);
  }

  removeLayer(layer) {
    if (!layer || !this.hasLayer(layer)) return;
    layer.setMap?.(null);
  }

  setLayerVisible(layer, visible) {
    if (visible) {
      this.addLayer(layer);
    } else {
      this.removeLayer(layer);
    }
  }

  disableUiEventPropagation(elements) {
    elements.filter(Boolean).forEach((element) => {
      const stop = (event) => event.stopPropagation();
      element.addEventListener("click", stop);
      element.addEventListener("pointerdown", stop);
      element.addEventListener("wheel", stop, { passive: true });
      this.uiEventCleanups.push(() => {
        element.removeEventListener("click", stop);
        element.removeEventListener("pointerdown", stop);
        element.removeEventListener("wheel", stop);
      });
    });
  }

  stopEvent(event) {
    event?.originalEvent?.stopPropagation?.();
    event?.originalEvent?.preventDefault?.();
  }

  on(eventName, handler) {
    const eventMap = { click: "single-tap", moveend: "region-change-end", zoomend: "region-change-end" };
    const listeners = String(eventName).split(/\s+/).filter(Boolean).map((event) => {
      const mapkitEvent = eventMap[event] ?? event;
      const listener = (payload) => {
        handler(this.normalizeEvent(event, payload));
      };
      this.map?.addEventListener?.(mapkitEvent, listener);
      const handle = { remove: () => this.map?.removeEventListener?.(mapkitEvent, listener) };
      this.listeners.push(handle);
      return handle;
    });
    return {
      remove: () => {
        listeners.forEach((listener) => {
          listener?.remove?.();
          this.listeners = this.listeners.filter((entry) => entry !== listener);
        });
      },
    };
  }

  dispatchSyntheticEvent(eventName) {
    if (!this.map?.dispatchEvent) return;
    try {
      this.map.dispatchEvent(new Event(eventName));
    } catch {
      this.map.dispatchEvent(eventName);
    }
  }

  normalizeEvent(eventName, payload) {
    const latlng = mapProviderEventLatLng(payload);
    if (eventName === "click" && latlng) {
      return {
        latlng,
        originalEvent: payload?.domEvent ?? payload?.originalEvent,
      };
    }

    return payload;
  }

  normalizeAnnotationEvent(payload, marker) {
    const position = mapProviderEventLatLng(payload) ?? marker?.getPosition?.();
    return {
      latlng: position ? { lat: position.lat, lng: position.lng } : null,
      originalEvent: payload?.domEvent ?? payload,
    };
  }

  normalizeShapeEvent(payload, shape) {
    const position = mapProviderEventLatLng(payload) ?? shape?.getCenter?.();
    return {
      latlng: position ? { lat: position.lat, lng: position.lng } : null,
      originalEvent: payload?.domEvent ?? payload,
    };
  }
}

class AppleMapsWebLayerGroup {
  constructor(layers = []) {
    this.layers = layers;
    this.items = [];
    this.map = null;
  }

  add(item) {
    this.items.push(item);
    if (this.map) item?.setMap?.(this.map);
  }

  remove(item) {
    item?.destroy?.();
    item?.setMap?.(null);
    this.items = this.items.filter((entry) => entry !== item);
  }

  isEmpty() {
    return !this.items.length && this.layers.every((layer) => layer?.isEmpty?.() ?? true);
  }

  clear() {
    this.layers.forEach((layer) => layer?.clear?.());
    this.items.forEach((item) => item?.destroy?.());
    this.items.forEach((item) => item?.setMap?.(null));
    this.items = [];
  }

  setMap(map) {
    this.map = map;
    this.layers.forEach((layer) => layer?.setMap?.(map));
    this.items.forEach((item) => item?.setMap?.(map));
  }

  isVisibleOn(map) {
    return this.map === map && this.layers.every((layer) => layer?.map === map);
  }
}

class AppleMapsWebTileOverlay {
  constructor(mapkit, overlay) {
    this.mapkit = mapkit;
    this.overlay = overlay;
    this.tileOverlay = this.createTileOverlay();
    this.map = null;
  }

  createTileOverlay() {
    if (!this.mapkit?.TileOverlay) return null;
    return new this.mapkit.TileOverlay(
      (x, y, z) => mapOverlayTileUrl(this.overlay, x, y, z),
      {
        minimumZ: this.overlay.minZoom ?? MAP_MIN_ZOOM,
        maximumZ: this.overlay.maxZoom ?? MAP_MAX_ZOOM,
        opacity: this.overlay.opacity ?? 1,
        data: { id: this.overlay.id },
      },
    );
  }

  setMap(map) {
    if (this.map === map) return;
    if (this.map && this.tileOverlay) this.map.removeTileOverlay?.(this.tileOverlay);
    this.map = map;
    if (this.map && this.tileOverlay) this.map.addTileOverlay?.(this.tileOverlay);
  }
}

class AppleMapsWebAnnotation {
  constructor(mapkit, definition) {
    this.mapkit = mapkit;
    this.definition = definition;
    this.tooltip = definition.tooltip ?? null;
    this.map = null;
    this.listeners = [];
    this.annotation = this.createAnnotation(definition);
  }

  createAnnotation(definition) {
    const coordinate = new this.mapkit.Coordinate(definition.lat, definition.lon);
    const options = {
      title: appleAnnotationText(definition.title ?? definition.tooltip?.content),
      subtitle: appleAnnotationSubtitle(definition.tooltip?.content),
      color: definition.markerColor ?? "#2f7fa3",
      glyphColor: "#ffffff",
      glyphText: definition.glyphText ?? appleGlyphText(definition),
      animates: false,
      enabled: definition.interactive !== false,
      calloutEnabled: Boolean(definition.tooltip?.content || definition.title),
    };

    if (appleDivIconHtml(definition.icon) && this.mapkit.Annotation) {
      return new this.mapkit.Annotation(coordinate, () => this.createElement(definition), {
        ...options,
        anchorOffset: appleDivIconAnchorOffset(definition.icon),
        size: appleDivIconSize(definition.icon),
      });
    }

    if (this.mapkit.MarkerAnnotation) {
      return new this.mapkit.MarkerAnnotation(coordinate, options);
    }

    return new this.mapkit.Annotation(coordinate, () => {
      const element = document.createElement("span");
      element.className = "apple-map-annotation";
      element.textContent = options.glyphText || "•";
      return element;
    }, options);
  }

  createElement(definition) {
    const element = document.createElement("div");
    element.className = appleDivIconClassName(definition.icon);
    element.innerHTML = appleDivIconHtml(definition.icon);
    element.title = definition.title ?? "";
    element.style.opacity = String(definition.opacity ?? 1);
    element.style.pointerEvents = definition.interactive === false ? "none" : "auto";
    return element;
  }

  setMap(map) {
    if (this.map === map) return;
    if (this.map) this.map.removeAnnotation?.(this.annotation);
    this.map = map;
    if (this.map) this.map.addAnnotation?.(this.annotation);
  }

  setPosition(lat, lon) {
    this.annotation.coordinate = new this.mapkit.Coordinate(lat, lon);
  }

  getPosition() {
    const coordinate = this.annotation?.coordinate;
    return coordinate ? { lat: coordinate.latitude, lng: coordinate.longitude } : null;
  }

  setIcon(icon) {
    if (appleDivIconHtml(icon) && this.annotation.element) {
      this.annotation.element.className = appleDivIconClassName(icon);
      this.annotation.element.innerHTML = appleDivIconHtml(icon);
      this.annotation.size = appleDivIconSize(icon);
      this.annotation.anchorOffset = appleDivIconAnchorOffset(icon);
      return;
    }

    const glyphText = appleGlyphText({ ...this.definition, icon });
    if (typeof this.annotation.glyphText !== "undefined") this.annotation.glyphText = glyphText;
  }

  setZIndex(zIndexOffset) {
    this.annotation.displayPriority = zIndexOffset ?? 0;
  }

  setOpacity(opacity) {
    if (this.annotation.element) this.annotation.element.style.opacity = String(opacity);
    this.annotation.visible = opacity > 0;
  }

  getElement() {
    return this.annotation?.element ?? null;
  }

  setTooltipContent(content) {
    this.tooltip = { ...(this.tooltip ?? {}), content };
    this.annotation.title = appleAnnotationText(content);
    this.annotation.subtitle = appleAnnotationSubtitle(content);
    this.annotation.calloutEnabled = Boolean(content);
  }

  addListener(eventName, handler) {
    this.annotation.addEventListener?.(eventName, handler);
    const handle = {
      remove: () => {
        this.annotation.removeEventListener?.(eventName, handler);
        this.listeners = this.listeners.filter((entry) => entry !== handle);
      },
    };
    this.listeners.push(handle);
    return handle;
  }

  destroy() {
    this.listeners.splice(0).forEach((listener) => listener.remove());
  }
}

class AppleMapsWebShapeOverlay {
  constructor(mapkit, type, definition) {
    this.mapkit = mapkit;
    this.type = type;
    this.definition = definition;
    this.center = mapProviderShapeCenter(definition);
    this.map = null;
    this.listeners = [];
    this.popupAnnotation = null;
    this.overlay = this.createOverlay(definition);
  }

  createOverlay(definition) {
    const options = {
      style: appleShapeStyle(this.mapkit, definition),
      enabled: definition.interactive !== false,
      data: {
        tooltip: definition.tooltip?.content ?? definition.popup ?? "",
      },
    };

    if (this.type === "circle") {
      return new this.mapkit.CircleOverlay(
        new this.mapkit.Coordinate(definition.lat, definition.lon),
        definition.radius,
        options,
      );
    }

    const coordinates = mapProviderAppleCoordinatePath(this.mapkit, definition.coordinates);
    if (this.type === "polygon") return new this.mapkit.PolygonOverlay(coordinates, options);
    return new this.mapkit.PolylineOverlay(coordinates, options);
  }

  setMap(map) {
    if (this.map === map) return;
    if (this.map) {
      this.hidePopup();
      this.map.removeOverlay?.(this.overlay);
    }
    this.map = map;
    if (this.map) this.map.addOverlay?.(this.overlay);
  }

  getCenter() {
    if (this.type === "circle") {
      const coordinate = this.overlay?.coordinate;
      return coordinate ? { lat: coordinate.latitude, lng: coordinate.longitude } : this.center;
    }

    const points = this.overlay?.points ?? [];
    if (!points.length) return this.center;
    const center = points.reduce(
      (sum, point) => ({
        latitude: sum.latitude + point.latitude,
        longitude: sum.longitude + point.longitude,
      }),
      { latitude: 0, longitude: 0 },
    );
    return {
      lat: center.latitude / points.length,
      lng: center.longitude / points.length,
    };
  }

  showPopup(content) {
    const center = this.getCenter();
    if (!this.map || !center || !content) return;
    this.hidePopup();
    this.popupAnnotation = new AppleMapsWebAnnotation(this.mapkit, {
      lat: center.lat,
      lon: center.lng,
      title: appleAnnotationText(content),
      tooltip: { content },
      markerColor: "#245f73",
      glyphText: "",
      zIndexOffset: 1000,
    });
    this.popupAnnotation.setMap(this.map);
    this.map.selectedAnnotation = this.popupAnnotation.annotation;
  }

  hidePopup() {
    this.popupAnnotation?.setMap?.(null);
    this.popupAnnotation?.destroy?.();
    this.popupAnnotation = null;
  }

  addListener(eventName, handler) {
    this.overlay.addEventListener?.(eventName, handler);
    const handle = {
      remove: () => {
        this.overlay.removeEventListener?.(eventName, handler);
        this.listeners = this.listeners.filter((entry) => entry !== handle);
      },
    };
    this.listeners.push(handle);
    return handle;
  }

  destroy() {
    this.hidePopup();
    this.listeners.splice(0).forEach((listener) => listener.remove());
  }
}

class NativeBridgeMapProvider {
  constructor({ providerId, container, tileOverlays, onLoadingChange }) {
    this.id = providerId;
    this.container = container;
    this.tileOverlays = tileOverlays;
    this.onLoadingChange = onLoadingChange;
    this.bridge = null;
    this.center = null;
    this.zoom = state.mapZoom;
    this.layers = [];
    this.items = [];
    this.listeners = [];
    this.localListeners = new Map();
    this.itemCallbacks = new Map();
    this.uiEventCleanups = [];
    this.commandWarnings = new Set();
  }

  async init({ center, zoom }) {
    this.bridge = resolveNativeMapBridge();
    if (!this.bridge) throw new Error(`${this.id} native bridge unavailable`);
    await assertNativeMapBridgeReady(this.bridge, this.id);
    this.center = { lat: center.lat, lon: center.lon };
    this.zoom = zoom;
    await this.call("init", {
      providerId: this.id,
      containerId: this.container?.id ?? "spotMap",
      containerMetrics: nativeMapContainerMetrics(this.container),
      center: this.center,
      zoom,
      minZoom: MAP_MIN_ZOOM,
      maxZoom: MAP_MAX_ZOOM,
    }, { strict: true });
    this.container.classList.add("is-native-map");
    this.setInteractionRegions();
    return this.bridge;
  }

  destroy() {
    this.listeners.splice(0).forEach((listener) => listener?.remove?.());
    this.localListeners.clear();
    this.itemCallbacks.clear();
    this.uiEventCleanups.splice(0).forEach((cleanup) => cleanup());
    this.layers.splice(0).forEach((layer) => layer.clear?.());
    this.items.splice(0);
    this.call("destroy", { providerId: this.id });
    this.container.classList.remove("is-native-map");
    this.bridge = null;
  }

  createSeamarksLayer() {
    return this.createTileOverlay(this.tileOverlays.seamarks);
  }

  createCoastalLayer() {
    return this.createLayerGroup({
      layers: [
        this.createTileOverlay(this.tileOverlays.emodnetCoastlines),
        this.createTileOverlay(this.tileOverlays.emodnetSeaNames),
      ],
    });
  }

  createBathymetryTileLayer() {
    return this.createTileOverlay(this.tileOverlays.emodnetContours);
  }

  createTileOverlay(overlay) {
    return new NativeMapLayer(this, "tile-overlay", {
      overlay: nativeTileOverlayPayload(overlay),
    });
  }

  createLayerGroup(options = {}) {
    const layer = new NativeMapLayer(this, "group");
    this.layers.push(layer);
    (options.layers ?? []).forEach((child) => layer.add(child));
    if (options.addToMap) layer.setMap(true);
    return layer;
  }

  createPinTierLayers(tiers) {
    const panes = {};
    const layers = {};

    tiers.forEach((tier) => {
      panes[tier.id] = { style: {} };
      layers[tier.id] = this.createLayerGroup({ addToMap: true });
      panes[tier.id].layer = layers[tier.id];
      this.call("configurePinTier", {
        layerId: layers[tier.id].id,
        tier,
      });
    });

    return {
      panes,
      layers,
      layer: this.createLayerGroup({ layers: Object.values(layers) }),
    };
  }

  addMarkerBatch(layer, markers) {
    if (!layer || !markers.length) return null;
    const batchGroup = this.createLayerGroup();
    batchGroup.addMany(markers);
    layer.add(batchGroup);
    batchGroup.setMap(layer.visible);
    return batchGroup;
  }

  removeMarkerFromBatch(marker, tierLayers) {
    if (!marker) return;
    if (marker.__pinBatchGroup) {
      const batchGroup = marker.__pinBatchGroup;
      batchGroup.remove(marker);
      if (batchGroup.isEmpty()) {
        tierLayers?.[marker.__pinTier]?.remove?.(batchGroup);
      }
      marker.__pinBatchGroup = null;
      return;
    }

    tierLayers?.[marker.__pinTier]?.remove?.(marker);
  }

  setPinPaneVisibility(panes, tiers, zoom) {
    tiers.forEach((tier) => {
      const pane = panes?.[tier.id];
      if (!pane) return;
      const visible = zoom >= tier.minZoom;
      pane.style.opacity = visible ? "1" : "0";
      pane.style.pointerEvents = visible ? "auto" : "none";
      pane.layer?.setMap?.(visible);
      this.call("setPinTierVisible", { tierId: tier.id, visible, zoom });
    });
  }

  clearLayer(layer) {
    layer?.clear?.();
  }

  createDivIcon(options) {
    return options;
  }

  addMarker(layer, definition) {
    return this.addItem(layer, "marker", nativeMarkerPayload(definition), {
      click: definition.onClick,
    });
  }

  addCircleMarker(layer, definition) {
    return this.addItem(layer, "circle-marker", nativeShapePayload(definition), {
      click: definition.onClick,
    });
  }

  addCircle(layer, definition) {
    return this.addItem(layer, "circle", nativeShapePayload(definition), {
      click: definition.onClick,
    });
  }

  addPolyline(layer, definition) {
    return this.addItem(layer, "polyline", nativeShapePayload(definition), {
      click: definition.onClick,
    });
  }

  addPolygon(layer, definition) {
    return this.addItem(layer, "polygon", nativeShapePayload(definition), {
      click: definition.onClick,
    });
  }

  addItem(layer, type, payload, callbacks = {}) {
    const item = new NativeMapItem(this, type, payload, callbacks, { deferCreate: !layer });
    this.items.push(item);
    layer?.add?.(item);
    return item;
  }

  setMarkerPosition(marker, lat, lon) {
    marker?.update?.({ lat, lon });
  }

  setMarkerIcon(marker, icon) {
    marker?.update?.({ icon: nativeDivIconPayload(icon) });
  }

  setMarkerZIndex(marker, zIndexOffset) {
    marker?.update?.({ zIndexOffset });
  }

  setMarkerOpacity(marker, opacity) {
    marker?.update?.({ opacity });
  }

  getMarkerElement() {
    return null;
  }

  getMarkerTooltip(marker) {
    return marker?.payload?.tooltip ?? null;
  }

  setMarkerTooltipContent(marker, content) {
    marker?.update?.({ tooltip: nativeTooltipPayload({ content }) });
  }

  ensureMarkerTooltip(marker, tooltip) {
    marker?.update?.({ tooltip: nativeTooltipPayload(tooltip) });
  }

  flyTo(lat, lon, zoom) {
    this.setView(lat, lon, zoom);
    window.requestAnimationFrame(() => this.emitLocalEvent("moveend"));
  }

  once(eventName, handler) {
    let handled = false;
    let timeoutId = null;
    const listener = this.on(eventName, (event) => {
      if (handled) return;
      handled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
      listener?.remove?.();
      handler(event);
    });
    timeoutId = window.setTimeout(() => {
      if (handled) return;
      handled = true;
      listener?.remove?.();
      handler({ type: eventName });
    }, 160);
    return {
      remove: () => {
        if (handled) return;
        handled = true;
        if (timeoutId) window.clearTimeout(timeoutId);
        listener?.remove?.();
      },
    };
  }

  getCenter() {
    return this.center;
  }

  getZoom() {
    return this.zoom;
  }

  getBounds() {
    if (!this.center) return null;
    const span = mapKitCoordinateSpanForZoom(this.zoom, this.center.lat);
    return {
      north: this.center.lat + span.latitudeDelta / 2,
      south: this.center.lat - span.latitudeDelta / 2,
      east: this.center.lon + span.longitudeDelta / 2,
      west: this.center.lon - span.longitudeDelta / 2,
    };
  }

  setView(lat, lon, zoom = state.mapZoom) {
    this.center = { lat, lon };
    this.zoom = zoom;
    this.call("setView", { center: this.center, zoom });
  }

  setZoom(zoom) {
    const center = this.center ?? getMapCenter();
    this.setView(center.lat, center.lon, zoom);
  }

  invalidateSize() {
    this.call("invalidateSize", {
      width: this.container?.clientWidth ?? 0,
      height: this.container?.clientHeight ?? 0,
      containerMetrics: nativeMapContainerMetrics(this.container),
    });
    this.setInteractionRegions();
  }

  setInteractionRegions() {
    return this.call("setInteractionRegions", nativeMapInteractionRegions(this.container, this.id));
  }

  usesWebMapGestures() {
    return this.id !== MAP_PROVIDER_IDS.APPLE_NATIVE;
  }

  metersPerCssPixel() {
    const center = this.center ?? getMapCenter();
    return (Math.cos(toRad(center.lat)) * 40075016.686) / (MAP_TILE_SIZE * 2 ** this.zoom);
  }

  hasLayer(layer) {
    return Boolean(layer?.visible);
  }

  addLayer(layer) {
    layer?.setMap?.(true);
  }

  removeLayer(layer) {
    layer?.setMap?.(false);
  }

  setLayerVisible(layer, visible) {
    return layer?.setMap?.(visible);
  }

  disableUiEventPropagation(elements) {
    elements.filter(Boolean).forEach((element) => {
      const stop = (event) => event.stopPropagation();
      element.addEventListener("click", stop);
      element.addEventListener("pointerdown", stop);
      element.addEventListener("wheel", stop, { passive: true });
      this.uiEventCleanups.push(() => {
        element.removeEventListener("click", stop);
        element.removeEventListener("pointerdown", stop);
        element.removeEventListener("wheel", stop);
      });
    });
  }

  stopEvent(event) {
    event?.originalEvent?.stopPropagation?.();
    event?.originalEvent?.preventDefault?.();
  }

  on(eventName, handler) {
    const events = String(eventName).split(/\s+/).filter(Boolean);
    const handles = events.map((event) => this.addBridgeListener(event, handler));
    return {
      remove: () => handles.forEach((handle) => handle?.remove?.()),
    };
  }

  addBridgeListener(eventName, handler) {
    const normalizedHandler = (payload) => {
      const normalized = this.normalizeEvent(eventName, payload);
      if (normalized?.center) this.center = normalized.center;
      if (isValidNumber(normalized?.zoom)) this.zoom = normalized.zoom;
      if (normalized?.itemId) this.handleItemEvent(eventName, normalized);
      handler(normalized);
    };
    const bridgeEvent = nativeBridgeEventName(this.id, eventName);
    const handle = this.bridge?.addListener?.(bridgeEvent, normalizedHandler)
      ?? this.bridge?.on?.(bridgeEvent, normalizedHandler)
      ?? null;
    const listener = {
      eventName,
      localEvent: (localEventName, payload = {}) => {
        if (eventName === localEventName) normalizedHandler(payload);
      },
      remove: () => {
        handle?.remove?.();
        const localHandlers = this.localListeners.get(eventName);
        localHandlers?.delete(normalizedHandler);
        this.listeners = this.listeners.filter((entry) => entry !== listener);
      },
    };
    if (!this.localListeners.has(eventName)) this.localListeners.set(eventName, new Set());
    this.localListeners.get(eventName).add(normalizedHandler);
    this.listeners.push(listener);
    return listener;
  }

  emitLocalEvent(eventName, payload = {}) {
    this.localListeners.get(eventName)?.forEach((handler) => handler(payload));
  }

  registerItemCallbacks(item, callbacks = {}) {
    const activeCallbacks = Object.fromEntries(
      Object.entries(callbacks).filter(([, callback]) => typeof callback === "function"),
    );
    if (Object.keys(activeCallbacks).length) this.itemCallbacks.set(item.id, activeCallbacks);
  }

  unregisterItemCallbacks(item) {
    this.itemCallbacks.delete(item?.id);
  }

  handleItemEvent(eventName, payload) {
    const callback = this.itemCallbacks.get(payload.itemId)?.[eventName];
    if (!callback) return;
    callback({
      latlng: mapProviderEventLatLng(payload) ?? this.itemEventLatLng(payload.itemId),
      originalEvent: payload.originalEvent ?? payload,
    });
  }

  itemEventLatLng(itemId) {
    const item = this.items.find((entry) => entry?.id === itemId);
    return nativePayloadLatLng(item?.payload);
  }

  normalizeEvent(eventName, payload = {}) {
    const itemId = payload.itemId ?? payload.markerId ?? payload.shapeId ?? payload.id;
    if (eventName === "click") {
      return {
        itemId,
        latlng: mapProviderEventLatLng(payload),
        originalEvent: payload,
      };
    }

    const center = nativeEventCenter(payload);
    const zoom = nativeEventZoom(payload);
    return {
      itemId,
      ...payload,
      ...(center ? { center } : {}),
      ...(isValidNumber(zoom) ? { zoom } : {}),
    };
  }

  call(command, payload = {}, options = {}) {
    const promise = callNativeMapBridge(this.bridge, command, {
      providerId: this.id,
      ...payload,
    });
    if (options.strict) return promise;
    return promise.catch((error) => {
      const warningKey = `${this.id}:${command}:${error?.message ?? "error"}`;
      if (!this.commandWarnings.has(warningKey)) {
        this.commandWarnings.add(warningKey);
        console.warn(`Native map bridge command failed: ${command}`, error);
      }
      return null;
    });
  }
}

class NativeMapLayer {
  constructor(provider, type, payload = {}) {
    this.provider = provider;
    this.type = type;
    this.payload = payload;
    this.id = nativeMapHandleId(type);
    this.items = [];
    this.visible = false;
    if (type === "tile-overlay") {
      this.provider.call("createTileOverlay", {
        layerId: this.id,
        ...payload,
      });
    }
  }

  add(item) {
    if (!item || this.items.includes(item)) return;
    this.items.push(item);
    item.layerId = this.id;
    item.ensureCreated?.();
    this.provider.call("addToLayer", {
      layerId: this.id,
      itemId: item.id,
      type: item.type,
      payload: item.payload,
      isLayer: item instanceof NativeMapLayer,
    });
    item.setMap(this.visible);
  }

  addMany(items = []) {
    const nativeItems = items.filter((item) => item instanceof NativeMapItem);
    if (!nativeItems.length) {
      items.forEach((item) => this.add(item));
      return;
    }

    nativeItems.forEach((item) => {
      if (this.items.includes(item)) return;
      this.items.push(item);
      item.layerId = this.id;
    });
    this.provider.call("createItems", {
      layerId: this.id,
      items: nativeItems.map((item) => item.toBridgePayload()),
    });
    nativeItems.forEach((item) => {
      item.created = true;
    });
    this.provider.call("addItemsToLayer", {
      layerId: this.id,
      items: nativeItems.map((item) => ({
        itemId: item.id,
        type: item.type,
        isLayer: false,
      })),
    });
    this.setItemsVisible(nativeItems, this.visible);
  }

  remove(item) {
    item?.destroy?.();
    this.provider.call("removeFromLayer", {
      layerId: this.id,
      itemId: item?.id,
    });
    this.items = this.items.filter((entry) => entry !== item);
  }

  isEmpty() {
    return !this.items.length;
  }

  clear() {
    this.items.forEach((item) => item.destroy?.());
    const promise = this.provider.call("clearLayer", { layerId: this.id });
    this.items = [];
    return promise;
  }

  destroy() {
    this.setMap(false);
    this.clear();
  }

  setMap(visible) {
    this.visible = Boolean(visible);
    const promise = this.provider.call("setLayerVisible", {
      layerId: this.id,
      visible: this.visible,
      type: this.type,
      payload: this.payload,
    });
    const nativeItems = this.items.filter((item) => item instanceof NativeMapItem);
    const childLayers = this.items.filter((item) => item instanceof NativeMapLayer);
    if (nativeItems.length > 0 && nativeItems.length === this.items.length) {
      this.setItemsVisible(nativeItems, this.visible);
      return promise;
    }
    if (nativeItems.length > 0) this.setItemsVisible(nativeItems, this.visible);
    childLayers.forEach((layer) => layer.setMap(this.visible));
    return promise;
  }

  setItemsVisible(items, visible) {
    items.forEach((item) => {
      item.visible = Boolean(visible);
    });
    this.provider.call("setItemsVisible", {
      layerId: this.id,
      visible: Boolean(visible),
      itemIds: items.map((item) => item.id),
    });
  }
}

class NativeMapItem {
  constructor(provider, type, payload = {}, callbacks = {}, options = {}) {
    this.provider = provider;
    this.type = type;
    this.payload = payload;
    this.id = nativeMapHandleId(type);
    this.layerId = null;
    this.visible = false;
    this.callbacks = callbacks;
    this.created = false;
    this.provider.registerItemCallbacks(this, callbacks);
    if (options.deferCreate) return;
    this.ensureCreated();
  }

  toBridgePayload() {
    return {
      itemId: this.id,
      type: this.type,
      payload: this.payload,
      events: Object.keys(this.callbacks).filter((eventName) => typeof this.callbacks[eventName] === "function"),
    };
  }

  ensureCreated() {
    if (this.created) return;
    this.created = true;
    this.provider.call("createItem", {
      ...this.toBridgePayload(),
    });
  }

  setMap(visible) {
    this.visible = Boolean(visible);
    this.provider.call("setItemVisible", {
      itemId: this.id,
      visible: this.visible,
    });
  }

  update(payload = {}) {
    const changed = Object.entries(payload).some(([key, value]) => nativePayloadValueSignature(this.payload[key]) !== nativePayloadValueSignature(value));
    if (!changed) return;
    this.payload = { ...this.payload, ...payload };
    if (!this.created) return;
    this.provider.call("updateItem", {
      itemId: this.id,
      type: this.type,
      payload,
    });
  }

  destroy() {
    this.provider.unregisterItemCallbacks(this);
    this.provider.call("removeItem", {
      itemId: this.id,
      layerId: this.layerId,
    });
  }
}

function nativePayloadValueSignature(value) {
  if (value === undefined) return "__undefined__";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function googleDivIconOptions(icon) {
  return icon?.options ?? icon ?? {};
}

function googleDivIconHtml(icon) {
  return googleDivIconOptions(icon).html ?? "";
}

function googleDivIconClassName(icon) {
  return googleDivIconOptions(icon).className ?? "";
}

function googleDivIconAnchor(icon) {
  const options = googleDivIconOptions(icon);
  const size = options.iconSize ?? [30, 38];
  return options.iconAnchor ?? [size[0] / 2, size[1]];
}

function googleWebMapEventName(eventName) {
  if (eventName === "moveend") return "idle";
  if (eventName === "zoomend") return "zoom_changed";
  return eventName;
}

function googleHtmlMarkerDomEventName(eventName) {
  if (eventName === "mouseover") return "mouseenter";
  if (eventName === "mouseout") return "mouseleave";
  return eventName;
}

function tooltipContentForGoogle(content) {
  if (typeof content === "string") return content;
  if (content instanceof HTMLElement) return content.outerHTML;
  return String(content ?? "");
}

function mapProviderCoordinatePair(value) {
  if (Array.isArray(value) && value.length >= 2) {
    const lat = Number(value[0]);
    const lon = Number(value[1]);
    return Number.isFinite(lat) && Number.isFinite(lon) ? [lat, lon] : null;
  }

  if (value && typeof value === "object") {
    const lat = Number(value.lat ?? value.latitude);
    const lon = Number(value.lon ?? value.lng ?? value.longitude);
    return Number.isFinite(lat) && Number.isFinite(lon) ? [lat, lon] : null;
  }

  return null;
}

function mapProviderEventLatLng(event = {}) {
  event = event ?? {};
  const candidates = [
    event.latlng,
    event.latLng,
    event.coordinate,
    event.center,
    event.target,
    event.camera?.target,
    event.camera?.center,
    event.region?.center,
    event,
  ];
  for (const candidate of candidates) {
    const googleLiteral = mapProviderGoogleLatLngLiteral(candidate);
    if (googleLiteral) return { lat: googleLiteral.lat, lng: googleLiteral.lng };
    const pair = mapProviderCoordinatePair(candidate);
    if (pair) return { lat: pair[0], lng: pair[1] };
  }
  return null;
}

function mapProviderCoordinatePath(coordinates) {
  if (!Array.isArray(coordinates)) return [];
  return coordinates.map(mapProviderCoordinatePair).filter(Boolean);
}

function mapProviderCoordinateRings(coordinates) {
  if (!Array.isArray(coordinates)) return [];
  const directPath = mapProviderCoordinatePath(coordinates);
  if (directPath.length) return [directPath];
  return coordinates
    .map(mapProviderCoordinatePath)
    .filter((path) => path.length);
}

function mapProviderGoogleCoordinatePath(coordinates) {
  return mapProviderCoordinatePath(coordinates).map(([lat, lon]) => ({ lat, lng: lon }));
}

function mapProviderGooglePolygonPaths(coordinates) {
  const rings = mapProviderCoordinateRings(coordinates);
  const paths = rings.map((ring) => ring.map(([lat, lon]) => ({ lat, lng: lon })));
  return paths.length === 1 ? paths[0] : paths;
}

function mapProviderShapeCenter(definition = {}) {
  if (Number.isFinite(Number(definition.lat)) && Number.isFinite(Number(definition.lon))) {
    return { lat: Number(definition.lat), lng: Number(definition.lon) };
  }

  const path = mapProviderCoordinateRings(definition.coordinates).flat();
  if (!path.length) return null;
  const center = path.reduce(
    (sum, [lat, lon]) => ({ lat: sum.lat + lat, lng: sum.lng + lon }),
    { lat: 0, lng: 0 },
  );
  return {
    lat: center.lat / path.length,
    lng: center.lng / path.length,
  };
}

function mapProviderGoogleLatLngLiteral(position) {
  if (!position) return null;
  if (typeof position.lat === "function" && typeof position.lng === "function") {
    return { lat: position.lat(), lng: position.lng() };
  }
  if (Number.isFinite(Number(position.lat)) && Number.isFinite(Number(position.lng))) {
    return { lat: Number(position.lat), lng: Number(position.lng) };
  }
  if (Number.isFinite(Number(position.latitude)) && Number.isFinite(Number(position.longitude))) {
    return { lat: Number(position.latitude), lng: Number(position.longitude) };
  }
  return null;
}

function mapProviderLatLngFromGoogle(position) {
  const literal = mapProviderGoogleLatLngLiteral(position);
  return literal ? { lat: literal.lat, lng: literal.lng } : null;
}

function mapProviderAppleCoordinatePath(mapkit, coordinates) {
  const rings = mapProviderCoordinateRings(coordinates);
  const path = rings[0] ?? [];
  return path.map(([lat, lon]) => new mapkit.Coordinate(lat, lon));
}

function mapProviderCoordinateNormalizationSamples() {
  const mixedPath = [[43.1, 5.1], { lat: 43.2, lon: 5.2 }, { lat: 43.3, lng: 5.3 }, { latitude: 43.4, longitude: 5.4 }];
  const nestedRings = [
    [[43.1, 5.1], [43.2, 5.2]],
    [{ lat: 43.3, lng: 5.3 }, { latitude: 43.4, longitude: 5.4 }],
  ];
  return {
    path: mapProviderCoordinatePath(mixedPath),
    rings: mapProviderCoordinateRings(nestedRings),
    googlePath: mapProviderGoogleCoordinatePath(mixedPath),
    googlePolygonPaths: mapProviderGooglePolygonPaths(nestedRings),
    shapeCenter: mapProviderShapeCenter({ coordinates: nestedRings }),
  };
}

function googlePolylineIcons(dashArray, color) {
  if (!dashArray) return undefined;

  const [dashLength = 6, gapLength = 6] = String(dashArray)
    .split(/\s+/)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0);

  return [{
    icon: {
      path: "M 0,-1 0,1",
      strokeColor: color,
      strokeOpacity: 1,
      scale: dashLength,
    },
    offset: "0",
    repeat: `${dashLength + gapLength}px`,
  }];
}

function googleMarkerIconFromDivIcon(icon) {
  if (!googleDivIconHtml(icon)) return undefined;

  const options = googleDivIconOptions(icon);
  const size = options.iconSize ?? [30, 38];
  const anchor = googleDivIconAnchor(icon);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size[0]}" height="${size[1]}" viewBox="0 0 ${size[0]} ${size[1]}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" class="${escapeHtml(options.className ?? "")}">
          ${options.html}
        </div>
      </foreignObject>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size[0], size[1]),
    anchor: new google.maps.Point(anchor[0], anchor[1]),
  };
}

function googleTrackListener(item, listener) {
  if (!item || !listener) return;
  if (!item.__meteoPecheListeners) item.__meteoPecheListeners = [];
  item.__meteoPecheListeners.push(listener);
}

function cleanupGoogleMapItem(item) {
  item?.__meteoPecheTooltip?.close?.();
  item?.__meteoPechePopup?.close?.();
  item?.__meteoPecheListeners?.splice?.(0)?.forEach((listener) => listener?.remove?.());
  item?.removeListeners?.();
  window.google?.maps?.event?.clearInstanceListeners?.(item);
}

function resolveNativeMapBridge() {
  return window.MeteoPecheNativeMap
    ?? window.Capacitor?.Plugins?.MeteoPecheMap
    ?? window.Capacitor?.Plugins?.NativeMap
    ?? null;
}

function callNativeMapBridge(bridge, command, payload = {}) {
  if (!bridge) return Promise.reject(new Error("Native map bridge unavailable"));
  if (typeof bridge[command] === "function") return Promise.resolve(bridge[command](payload));
  if (typeof bridge.invoke === "function") return Promise.resolve(bridge.invoke({ command, payload }));
  if (typeof bridge.postMessage === "function") {
    bridge.postMessage({ command, payload });
    return Promise.resolve();
  }
  return Promise.reject(new Error(`Native map bridge command unavailable: ${command}`));
}

async function assertNativeMapBridgeReady(bridge, providerId) {
  const status = await nativeMapBridgeStatus(bridge, providerId);
  if (!nativeMapBridgeStatusReady(status, providerId)) {
    throw new Error(`${providerId} native bridge not ready`);
  }
  document.documentElement.dataset.nativeMapBridgeReady = providerId;
}

function nativeMapBridgeStatus(bridge, providerId) {
  if (!bridge) return Promise.resolve(null);
  if (typeof bridge.getStatus === "function") return Promise.resolve(bridge.getStatus({ providerId }));
  if (typeof bridge.isReady === "function") return Promise.resolve(bridge.isReady({ providerId }));
  if (typeof bridge.invoke === "function") {
    return Promise.resolve(bridge.invoke({
      command: "getStatus",
      payload: { providerId },
    }));
  }
  return Promise.resolve(null);
}

function nativeMapBridgeDebugState(bridge = resolveNativeMapBridge(), providerId = state.mapProviderId || state.mapProviderPreference) {
  if (!bridge) return Promise.resolve(null);
  const payload = { providerId };
  if (typeof bridge.getDebugState === "function") return Promise.resolve(bridge.getDebugState(payload));
  if (typeof bridge.invoke === "function") {
    return Promise.resolve(bridge.invoke({
      command: "getDebugState",
      payload,
    }));
  }
  return Promise.resolve(null);
}

function nativeMapBridgeStatusReady(status, providerId) {
  delete document.documentElement.dataset.nativeMapBridgeCapabilityError;
  if (status === true || status === "ready") {
    document.documentElement.dataset.nativeMapBridgeCapabilityError = "missing-status-object";
    return false;
  }
  if (!status || typeof status !== "object") return false;
  const supportedProviders = status.supportedProviders ?? status.providers;
  const providerSupported = Array.isArray(supportedProviders)
    ? supportedProviders.includes(providerId)
    : status.providerId === providerId || status.provider === providerId || status.providerId === "all";
  if (!Boolean((status.ready === true || status.isReady === true) && providerSupported)) return false;
  const capabilityReport = nativeMapBridgeCapabilityReport(status, providerId);
  if (!capabilityReport.ready) {
    document.documentElement.dataset.nativeMapBridgeCapabilityError = capabilityReport.reason;
    return false;
  }
  document.documentElement.dataset.nativeMapBridgeCapabilityReady = providerId;
  return true;
}

function nativeMapBridgeCapabilityReport(status, providerId) {
  if (!status || typeof status !== "object") return { ready: false, reason: "missing-status-object" };
  const protocolVersion = Number(status.bridgeProtocolVersion ?? status.protocolVersion);
  if (protocolVersion !== NATIVE_MAP_BRIDGE_PROTOCOL_VERSION) return { ready: false, reason: "protocol-version-mismatch" };
  const supportedCommands = Array.isArray(status.supportedCommands) ? status.supportedCommands : [];
  const missingCommands = NATIVE_MAP_BRIDGE_COMMANDS.filter((command) => !supportedCommands.includes(command));
  if (missingCommands.length) return { ready: false, reason: `missing-commands:${missingCommands.join(",")}` };
  const supportedEvents = Array.isArray(status.supportedEvents) ? status.supportedEvents : [];
  const missingEvents = nativeBridgeSupportedEvents(providerId).filter((eventName) => !supportedEvents.includes(eventName));
  if (missingEvents.length) return { ready: false, reason: `missing-events:${missingEvents.join(",")}` };
  return { ready: true, reason: "" };
}

function nativeMapHandleId(prefix) {
  nativeMapHandleId.counter = (nativeMapHandleId.counter ?? 0) + 1;
  return `native-${prefix}-${Date.now().toString(36)}-${nativeMapHandleId.counter}`;
}

function nativeBridgeEventName(providerId, eventName) {
  return `map:${providerId}:${eventName}`;
}

function nativeBridgeSupportedEvents(providerId) {
  return NATIVE_MAP_BRIDGE_EVENTS.map((eventName) => nativeBridgeEventName(providerId, eventName));
}

function nativeEventCenter(payload = {}) {
  const candidates = [
    payload.center,
    payload.target,
    payload.camera?.center,
    payload.camera?.target,
    payload.region?.center,
    payload.coordinate,
  ];
  for (const candidate of candidates) {
    const lat = candidate?.lat ?? candidate?.latitude;
    const lon = candidate?.lon ?? candidate?.lng ?? candidate?.longitude;
    if (isValidNumber(lat) && isValidNumber(lon)) return { lat, lon };
  }
  const lat = payload.lat ?? payload.latitude;
  const lon = payload.lon ?? payload.lng ?? payload.longitude;
  return isValidNumber(lat) && isValidNumber(lon) ? { lat, lon } : null;
}

function nativeEventZoom(payload = {}) {
  const zoom = payload.zoom ?? payload.zoomLevel ?? payload.camera?.zoom ?? payload.region?.zoom;
  return isValidNumber(zoom) ? zoom : null;
}

function nativePayloadLatLng(payload = {}) {
  const center = mapProviderShapeCenter(payload);
  return center ? { lat: center.lat, lng: center.lng } : null;
}

function nativeMapContainerMetrics(container) {
  const rect = container?.getBoundingClientRect?.();
  const visualViewport = window.visualViewport;
  const width = rect?.width ?? container?.clientWidth ?? 0;
  const height = rect?.height ?? container?.clientHeight ?? 0;
  return {
    width,
    height,
    left: rect?.left ?? 0,
    top: rect?.top ?? 0,
    right: rect?.right ?? width,
    bottom: rect?.bottom ?? height,
    scrollX: window.scrollX ?? 0,
    scrollY: window.scrollY ?? 0,
    visualViewportOffsetLeft: visualViewport?.offsetLeft ?? 0,
    visualViewportOffsetTop: visualViewport?.offsetTop ?? 0,
    visualViewportScale: visualViewport?.scale ?? 1,
    devicePixelRatio: window.devicePixelRatio ?? 1,
  };
}

function nativeMapInteractionRegions(container, providerId = state.mapProviderId) {
  return {
    providerId,
    passthroughEnabled: providerId === MAP_PROVIDER_IDS.APPLE_NATIVE
      && (!isMobileLayout() || state.activeMobileView === "map"),
    mapFrame: nativeMapContainerMetrics(container),
    interactiveRects: nativeMapInteractiveRects(),
  };
}

function nativeMapInteractiveRects() {
  const elements = new Set([
    els.spotControls,
    els.spotNameSheet,
    els.mapOverlayActions,
    els.mapZoomIn,
    els.mapZoomOut,
    els.mapFullscreenButton,
    els.mapLayersButton,
    els.mapLayerSheet,
    els.mapLayerBackdrop,
    els.fishFilterControl,
    els.fishFilterPanel,
    els.marineOverlayControl,
    els.safetyBanner,
    els.mapFavoritesButton,
    els.mapFavoritesOverlay,
    document.querySelector("#mobileTabbar"),
    ...document.querySelectorAll(".app-toast"),
  ]);

  return [...elements]
    .map(nativeMapInteractiveRect)
    .filter(Boolean);
}

function nativeMapInteractiveRect(element) {
  if (!isNativeMapInteractiveElementVisible(element)) return null;
  const rect = element.getBoundingClientRect();
  const padding = 6;
  const left = Math.max(0, rect.left - padding);
  const top = Math.max(0, rect.top - padding);
  const right = rect.right + padding;
  const bottom = rect.bottom + padding;
  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
  };
}

function isNativeMapInteractiveElementVisible(element) {
  if (!(element instanceof Element) || element.hidden || element.inert) return false;
  if (element.getAttribute("aria-hidden") === "true") return false;
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return false;
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) !== 0;
}

function scheduleNativeMapInteractionRegionSync() {
  if (nativeMapInteractionRegionFrame) return;
  nativeMapInteractionRegionFrame = window.requestAnimationFrame(() => {
    nativeMapInteractionRegionFrame = 0;
    const provider = state.mapProvider;
    if (!provider || typeof provider.setInteractionRegions !== "function") return;
    provider.setInteractionRegions();
  });
}

function shouldInstallMapSurfaceGestures() {
  const provider = state.mapProvider;
  return !provider || (typeof provider.usesWebMapGestures === "function" && provider.usesWebMapGestures());
}

function nativeTileOverlayPayload(overlay) {
  return {
    id: overlay.id,
    name: overlay.name,
    type: overlay.type,
    url: overlay.url,
    minZoom: overlay.minZoom ?? MAP_MIN_ZOOM,
    maxZoom: overlay.maxZoom ?? MAP_MAX_ZOOM,
    maxNativeZoom: overlay.maxNativeZoom,
    opacity: overlay.opacity ?? 1,
    layers: overlay.layers,
    styles: overlay.styles,
    format: overlay.format,
    transparent: overlay.transparent,
    version: overlay.version,
  };
}

function nativeMarkerPayload(definition) {
  return {
    lat: definition.lat,
    lon: definition.lon,
    title: definition.title,
    keyboard: definition.keyboard,
    interactive: definition.interactive !== false,
    opacity: definition.opacity ?? 1,
    pane: definition.pane,
    riseOnHover: definition.riseOnHover,
    zIndexOffset: definition.zIndexOffset,
    icon: nativeDivIconPayload(definition.icon),
    tooltip: nativeTooltipPayload(definition.tooltip),
  };
}

function nativeShapePayload(definition) {
  return {
    lat: definition.lat,
    lon: definition.lon,
    coordinates: definition.coordinates,
    radius: definition.radius,
    color: definition.color,
    weight: definition.weight,
    fillColor: definition.fillColor,
    fillOpacity: definition.fillOpacity,
    opacity: definition.opacity,
    dashArray: definition.dashArray,
    interactive: definition.interactive !== false,
    tooltip: nativeTooltipPayload(definition.tooltip),
    popup: typeof definition.popup === "string" ? definition.popup : "",
  };
}

function nativeDivIconPayload(icon) {
  const options = icon?.options ?? icon ?? {};
  return {
    className: options.className ?? "",
    html: options.html ?? "",
    iconSize: options.iconSize ?? null,
    iconAnchor: options.iconAnchor ?? null,
    tooltipAnchor: options.tooltipAnchor ?? null,
    popupAnchor: options.popupAnchor ?? null,
  };
}

function nativeTooltipPayload(tooltip) {
  if (!tooltip) return null;
  return {
    content: tooltipContentForNative(tooltip.content),
    options: tooltip.options ?? {},
  };
}

function tooltipContentForNative(content) {
  if (typeof content === "string") return content;
  if (content instanceof HTMLElement) return content.outerHTML;
  return String(content ?? "");
}

function nativeBridgeContract(providerId = MAP_PROVIDER_IDS.APPLE_NATIVE) {
  const sampleCenter = { lat: 43.2965, lon: 5.3698 };
  const sampleOverlay = SHARED_MAP_TILE_OVERLAYS.seamarks;
  const sampleMarker = {
    lat: sampleCenter.lat,
    lon: sampleCenter.lon,
    title: "Sample fishing spot",
    icon: nativeDivIconPayload({
      className: "map-pin-marker is-detail-pin",
      html: pinIcon(),
      iconSize: [34, 42],
      iconAnchor: [17, 42],
    }),
    tooltip: nativeTooltipPayload({ content: "Sample fishing spot" }),
    zIndexOffset: 1000,
  };
  const sampleShape = {
    lat: sampleCenter.lat,
    lon: sampleCenter.lon,
    radius: 150,
    color: "#2f7fa3",
    fillColor: "#2f7fa3",
    fillOpacity: 0.18,
    weight: 2,
  };

  return {
    providerId,
    bridgeProtocolVersion: NATIVE_MAP_BRIDGE_PROTOCOL_VERSION,
    bridgeNames: ["window.MeteoPecheNativeMap", "Capacitor.Plugins.MeteoPecheMap", "Capacitor.Plugins.NativeMap"],
    requiredCommands: NATIVE_MAP_BRIDGE_COMMANDS,
    eventNames: nativeBridgeSupportedEvents(providerId),
    commandFailureMode: {
      getStatus: "strict fallback",
      getDebugState: "debug inspection only",
      init: "strict fallback",
      incrementalCommands: "warn once and continue",
    },
    readiness: {
      command: "getStatus",
      payload: { providerId },
      expected: {
        ready: true,
        supportedProviders: [providerId],
      },
    },
    commands: {
      getStatus: { providerId },
      getDebugState: { providerId },
      init: {
        providerId,
        containerId: "spotMap",
        containerMetrics: {
          width: 390,
          height: 640,
          left: 0,
          top: 0,
          right: 390,
          bottom: 640,
          scrollX: 0,
          scrollY: 0,
          visualViewportOffsetLeft: 0,
          visualViewportOffsetTop: 0,
          visualViewportScale: 1,
          devicePixelRatio: 3,
        },
        center: sampleCenter,
        zoom: 11,
        minZoom: MAP_MIN_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
      setView: { providerId, center: sampleCenter, zoom: 12 },
      invalidateSize: {
        providerId,
        width: 390,
        height: 640,
        containerMetrics: {
          width: 390,
          height: 640,
          left: 0,
          top: 0,
          right: 390,
          bottom: 640,
          scrollX: 0,
          scrollY: 0,
          visualViewportOffsetLeft: 0,
          visualViewportOffsetTop: 0,
          visualViewportScale: 1,
          devicePixelRatio: 3,
        },
      },
      setInteractionRegions: {
        providerId,
        passthroughEnabled: providerId === MAP_PROVIDER_IDS.APPLE_NATIVE,
        mapFrame: {
          width: 390,
          height: 640,
          left: 0,
          top: 0,
          right: 390,
          bottom: 640,
        },
        interactiveRects: [{
          left: 16,
          top: 16,
          right: 120,
          bottom: 84,
          width: 104,
          height: 68,
        }],
      },
      createTileOverlay: {
        providerId,
        layerId: "native-tile-overlay-sample",
        overlay: nativeTileOverlayPayload(sampleOverlay),
      },
      setLayerVisible: {
        providerId,
        layerId: "native-layer-sample",
        visible: true,
        type: "group",
      },
      clearLayer: {
        providerId,
        layerId: "native-layer-sample",
      },
      configurePinTier: {
        providerId,
        layerId: "native-layer-tier-sample",
        tier: PIN_LAYER_TIERS[2],
      },
      createItem: {
        providerId,
        itemId: "native-marker-sample",
        type: "marker",
        payload: sampleMarker,
        events: ["click"],
      },
      createItems: {
        providerId,
        layerId: "native-layer-batch-sample",
        items: [{
          itemId: "native-marker-batch-sample",
          type: "marker",
          payload: sampleMarker,
          events: ["click"],
        }],
      },
      addToLayer: {
        providerId,
        layerId: "native-layer-sample",
        itemId: "native-marker-sample",
        type: "marker",
        payload: sampleMarker,
        isLayer: false,
      },
      addItemsToLayer: {
        providerId,
        layerId: "native-layer-batch-sample",
        items: [{
          itemId: "native-marker-batch-sample",
          type: "marker",
          isLayer: false,
        }],
      },
      updateItem: {
        providerId,
        itemId: "native-marker-sample",
        type: "marker",
        payload: { opacity: 1, zIndexOffset: 1100 },
      },
      setItemVisible: {
        providerId,
        itemId: "native-marker-sample",
        visible: true,
      },
      setItemsVisible: {
        providerId,
        layerId: "native-layer-batch-sample",
        itemIds: ["native-marker-batch-sample"],
        visible: true,
      },
      createShapeItem: {
        providerId,
        itemId: "native-circle-sample",
        type: "circle",
        payload: sampleShape,
        events: ["click"],
      },
      setPinTierVisible: {
        providerId,
        tierId: PIN_LAYER_TIERS[2].id,
        visible: true,
        zoom: 12,
      },
      removeItem: {
        providerId,
        itemId: "native-marker-sample",
        layerId: "native-layer-sample",
      },
      removeFromLayer: {
        providerId,
        layerId: "native-layer-sample",
        itemId: "native-marker-sample",
      },
      destroy: { providerId },
    },
    callbackPayloads: {
      click: {
        itemId: "native-marker-sample",
        lat: sampleCenter.lat,
        lon: sampleCenter.lon,
      },
      moveend: {
        center: sampleCenter,
        zoom: 12,
      },
      zoomend: {
        camera: {
          target: {
            latitude: sampleCenter.lat,
            longitude: sampleCenter.lon,
          },
          zoom: 13,
        },
      },
    },
  };
}

function mapKitCoordinateSpanForZoom(zoom, lat) {
  const safeZoom = clamp(zoom ?? state.mapZoom, MAP_MIN_ZOOM, MAP_MAX_ZOOM);
  const latitudeDelta = 360 / 2 ** safeZoom;
  const longitudeDelta = latitudeDelta / Math.max(0.2, Math.cos(toRad(lat)));
  return {
    latitudeDelta: Math.max(0.001, latitudeDelta),
    longitudeDelta: Math.max(0.001, longitudeDelta),
  };
}

function appleGlyphText(definition) {
  const explicit = definition.glyphText;
  if (explicit !== undefined) return String(explicit).slice(0, 3);
  const label = appleAnnotationText(definition.title ?? definition.tooltip?.content);
  return label ? label.slice(0, 2).toUpperCase() : "";
}

function appleAnnotationText(content) {
  if (!content) return "";
  if (typeof content === "string") {
    const div = document.createElement("div");
    div.innerHTML = content;
    return (div.textContent || "").trim();
  }
  if (content instanceof HTMLElement) return (content.textContent || "").trim();
  return String(content ?? "").trim();
}

function appleAnnotationSubtitle(content) {
  const text = appleAnnotationText(content);
  if (text.length <= 42) return "";
  return text.slice(42, 96);
}

function appleDivIconOptions(icon) {
  return icon?.options ?? icon ?? {};
}

function appleDivIconHtml(icon) {
  return appleDivIconOptions(icon).html ?? "";
}

function appleDivIconClassName(icon) {
  return appleDivIconOptions(icon).className ?? "";
}

function appleDivIconSize(icon) {
  const size = appleDivIconOptions(icon).iconSize ?? [30, 38];
  return { width: size[0], height: size[1] };
}

function appleDivIconAnchorOffset(icon) {
  const options = appleDivIconOptions(icon);
  const size = options.iconSize ?? [30, 38];
  const anchor = options.iconAnchor ?? [size[0] / 2, size[1]];
  return { x: anchor[0] - size[0] / 2, y: anchor[1] - size[1] / 2 };
}

function appleShapeStyle(mapkit, definition) {
  const dash = String(definition.dashArray ?? "")
    .split(/\s+/)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0);

  return new mapkit.Style({
    strokeColor: definition.color ?? "#2f7fa3",
    strokeOpacity: definition.opacity ?? 1,
    lineWidth: definition.weight ?? 2,
    lineDash: dash.length ? dash : undefined,
    lineJoin: "round",
    fillColor: definition.fillColor ?? definition.color ?? "#2f7fa3",
    fillOpacity: definition.fillOpacity ?? 0,
  });
}

function resolveRuntimeMapProvider() {
  state.mapProviderPreference = resolvePreferredMapProvider();
  state.mapProviderConfigReady = isMapProviderConfigured(state.mapProviderPreference);
  state.mapProviderFallbackReason = mapProviderFallbackReason(state.mapProviderPreference);
  state.mapProviderId = resolveSupportedMapProvider(state.mapProviderPreference);
  state.mapProviderFallbackActive = state.mapProviderId !== state.mapProviderPreference;

  applyRuntimeMapProviderDataset();
}

function applyRuntimeMapProviderDataset() {
  document.documentElement.dataset.mapProviderPreference = state.mapProviderPreference;
  document.documentElement.dataset.mapProvider = state.mapProviderId;
  document.documentElement.dataset.mapProviderConfigReady = String(state.mapProviderConfigReady);
  document.documentElement.dataset.mapProviderMountReady = String(isMapProviderMountReady(state.mapProviderId));
  document.documentElement.dataset.mapProviderFallbackReason = state.mapProviderFallbackReason;
  document.documentElement.classList.toggle("map-provider-fallback", state.mapProviderFallbackActive);
  document.documentElement.classList.toggle("is-native-map-provider", isNativeMapProvider(state.mapProviderId));
}

function resolveSupportedMapProvider(providerId) {
  return isMapProviderSupported(providerId) && isMapProviderConfigured(providerId) && isMapProviderMountReady(providerId)
    ? providerId
    : MAP_PROVIDER_IDS.LEAFLET_OPENMAP;
}

function mapProviderFallbackReason(providerId) {
  if (providerId === MAP_PROVIDER_IDS.LEAFLET_OPENMAP) return "";
  if (!isMapProviderConfigured(providerId)) return "missing-config";
  if (isNativeMapProvider(providerId) && !isNativeMapBridgeAvailable()) return "bridge-unavailable";
  if (!isMapProviderSupported(providerId)) return "adapter-not-ready";
  return "";
}

function isMapProviderSupported(providerId) {
  if (MAP_PROVIDER_DEFAULT_SUPPORT[providerId]) return true;
  return experimentalMapProviders().includes(providerId);
}

function isMapProviderConfigured(providerId) {
  if (providerId === MAP_PROVIDER_IDS.LEAFLET_OPENMAP) return true;
  if (providerId === MAP_PROVIDER_IDS.APPLE_NATIVE || providerId === MAP_PROVIDER_IDS.GOOGLE_NATIVE) return true;
  if (providerId === MAP_PROVIDER_IDS.APPLE_WEB) return isAppleMapsWebConfigured();
  if (providerId === MAP_PROVIDER_IDS.GOOGLE_WEB) return isGoogleMapsWebConfigured();
  return false;
}

function isMapProviderMountReady(providerId) {
  if (!isNativeMapProvider(providerId)) return true;
  return isNativeMapBridgeAvailable();
}

function mapProviderDescriptor(providerId) {
  return {
    id: providerId,
    supported: isMapProviderSupported(providerId),
    defaultSupported: Boolean(MAP_PROVIDER_DEFAULT_SUPPORT[providerId]),
    experimental: experimentalMapProviders().includes(providerId),
    configured: isMapProviderConfigured(providerId),
    mountReady: isMapProviderMountReady(providerId),
    bridgeAvailable: isNativeMapProvider(providerId) ? isNativeMapBridgeAvailable() : null,
    fallbackReason: mapProviderFallbackReason(providerId),
    active: state.mapProviderId === providerId,
    preferred: state.mapProviderPreference === providerId,
  };
}

function isNativeMapProvider(providerId) {
  return providerId === MAP_PROVIDER_IDS.APPLE_NATIVE || providerId === MAP_PROVIDER_IDS.GOOGLE_NATIVE;
}

function isNativeMapBridgeAvailable() {
  return Boolean(resolveNativeMapBridge());
}

function getRuntimeConfig() {
  return {
    ...DEFAULT_RUNTIME_CONFIG,
    ...(window.METEOPECHE_CONFIG ?? {}),
  };
}

function experimentalMapProviders() {
  const value = getRuntimeConfig().experimentalMapProviders;
  const providers = Array.isArray(value)
    ? value
    : String(value ?? "").split(",");
  return [
    ...providers,
    ...localExperimentalMapProviders(),
  ]
    .map((provider) => String(provider ?? "").trim())
    .filter((provider) => Object.values(MAP_PROVIDER_IDS).includes(provider));
}

function localExperimentalMapProviders() {
  if (!isLocalMapProviderDebugOrigin()) return [];
  const params = new URLSearchParams(window.location.search);
  const value = params.get("mapProviderExperimental") ?? params.get("map_provider_experimental") ?? "";
  return String(value)
    .split(",")
    .map((provider) => provider.trim())
    .filter(Boolean);
}

function isGoogleMapsWebConfigured() {
  const config = getRuntimeConfig();
  return Boolean((config.enableGoogleMapsWeb && googleMapsApiKey()) || localWebMapSdkDebugEnabled("google"));
}

function googleMapsApiKey() {
  return String(getRuntimeConfig().googleMapsApiKey ?? "").trim();
}

function isAppleMapsWebConfigured() {
  const config = getRuntimeConfig();
  return Boolean((config.enableAppleMapsWeb && (appleMapKitToken() || appleMapKitTokenUrl())) || localWebMapSdkDebugEnabled("apple"));
}

function appleMapKitToken() {
  return String(getRuntimeConfig().appleMapKitToken ?? "").trim();
}

function appleMapKitTokenUrl() {
  return String(getRuntimeConfig().appleMapKitTokenUrl ?? "").trim();
}

function loadGoogleMapsWebSdk() {
  installLocalWebMapSdkDebug();
  if (localWebMapSdkDebugFailureEnabled("google")) {
    return Promise.reject(new Error("Local Google Maps debug SDK failure requested"));
  }
  if (window.google?.maps) return Promise.resolve(window.google.maps);

  const apiKey = googleMapsApiKey();
  if (!apiKey) return Promise.reject(new Error("Google Maps API key missing"));

  if (window.__meteoPecheGoogleMapsPromise) return window.__meteoPecheGoogleMapsPromise;

  window.__meteoPecheGoogleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google.maps), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Google Maps SDK failed to load")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`;
    script.addEventListener("load", () => resolve(window.google.maps), { once: true });
    script.addEventListener("error", () => reject(new Error("Google Maps SDK failed to load")), { once: true });
    document.head.append(script);
  });

  return window.__meteoPecheGoogleMapsPromise;
}

function loadAppleMapKitWebSdk() {
  installLocalWebMapSdkDebug();
  if (localWebMapSdkDebugFailureEnabled("apple")) {
    return Promise.reject(new Error("Local Apple MapKit debug SDK failure requested"));
  }
  if (!isAppleMapsWebConfigured()) return Promise.reject(new Error("Apple MapKit JS config missing"));
  if (window.mapkit?.Map) return initializeAppleMapKitWeb();

  if (window.__meteoPecheAppleMapKitPromise) return window.__meteoPecheAppleMapKitPromise;

  window.__meteoPecheAppleMapKitPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(APPLE_MAPKIT_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", () => initializeAppleMapKitWeb().then(resolve).catch(reject), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Apple MapKit JS failed to load")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = APPLE_MAPKIT_SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = APPLE_MAPKIT_JS_URL;
    script.addEventListener("load", () => initializeAppleMapKitWeb().then(resolve).catch(reject), { once: true });
    script.addEventListener("error", () => reject(new Error("Apple MapKit JS failed to load")), { once: true });
    document.head.append(script);
  });

  return window.__meteoPecheAppleMapKitPromise;
}

function initializeAppleMapKitWeb() {
  if (!window.mapkit?.Map) return Promise.reject(new Error("Apple MapKit JS unavailable"));
  if (window.__meteoPecheAppleMapKitReady) return Promise.resolve(window.mapkit);

  const staticToken = appleMapKitToken();
  const tokenUrl = appleMapKitTokenUrl();
  window.mapkit.init({
    authorizationCallback(done) {
      if (staticToken) {
        done(staticToken);
        return;
      }
      fetch(tokenUrl)
        .then((response) => {
          if (!response.ok) throw new Error(`Apple MapKit token request failed: ${response.status}`);
          return response.text();
        })
        .then((body) => {
          const token = parseAppleMapKitTokenResponse(body);
          if (!token) throw new Error("Apple MapKit token response missing token");
          done(token);
        })
        .catch((error) => {
          console.warn("Apple MapKit token fetch failed", error);
          done("");
        });
    },
  });
  window.__meteoPecheAppleMapKitReady = true;
  return Promise.resolve(window.mapkit);
}

function parseAppleMapKitTokenResponse(body) {
  const text = String(body ?? "").trim();
  if (!text) return "";
  try {
    const parsed = JSON.parse(text);
    return String(parsed.token ?? parsed.mapkitToken ?? "").trim();
  } catch {
    return text;
  }
}

function resolvePreferredMapProvider() {
  const override = mapProviderOverride();
  if (override) return override;

  const platform = getCapacitorPlatform();
  if (isNativeRuntime() && platform === "ios") return MAP_PROVIDER_IDS.APPLE_NATIVE;
  if (isNativeRuntime() && platform === "android") return MAP_PROVIDER_IDS.GOOGLE_NATIVE;
  if (isSafariBrowser()) return MAP_PROVIDER_IDS.APPLE_WEB;
  if (isChromeBrowser()) return MAP_PROVIDER_IDS.GOOGLE_WEB;
  return MAP_PROVIDER_IDS.LEAFLET_OPENMAP;
}

function mapProviderOverride() {
  const params = new URLSearchParams(window.location.search);
  const value = params.get("mapProviderOverride") ?? params.get("map_provider_override");
  return Object.values(MAP_PROVIDER_IDS).includes(value) ? value : "";
}

function isLocalMapProviderDebugOrigin() {
  if (window.location.protocol === "file:") return true;
  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

function localWebMapSdkDebugEnabled(provider) {
  if (!isLocalMapProviderDebugOrigin()) return false;
  const params = new URLSearchParams(window.location.search);
  const value = params.get("mapProviderDebugSdk") ?? params.get("map_provider_debug_sdk") ?? "";
  const providers = String(value).split(",").map((entry) => entry.trim().toLowerCase()).filter(Boolean);
  if (providers.includes("all") || providers.includes(provider)) return true;
  if (provider === "google") return params.get("googleMapsDebugSdk") === "1";
  if (provider === "apple") return params.get("appleMapKitDebugSdk") === "1";
  return false;
}

function localWebMapSdkDebugFailureEnabled(provider) {
  if (!isLocalMapProviderDebugOrigin()) return false;
  const params = new URLSearchParams(window.location.search);
  const value = params.get("mapProviderDebugSdkFail") ?? params.get("map_provider_debug_sdk_fail") ?? "";
  const providers = String(value).split(",").map((entry) => entry.trim().toLowerCase()).filter(Boolean);
  return providers.includes("all") || providers.includes(provider);
}

function installLocalWebMapSdkDebug() {
  if (localWebMapSdkDebugEnabled("google") && !localWebMapSdkDebugFailureEnabled("google") && !window.google?.maps) {
    window.google = { ...(window.google ?? {}), maps: createLocalGoogleMapsDebugSdk() };
    document.documentElement.dataset.webMapSdkDebugGoogle = "active";
  }

  if (localWebMapSdkDebugEnabled("apple") && !localWebMapSdkDebugFailureEnabled("apple") && !window.mapkit?.Map) {
    window.mapkit = createLocalAppleMapKitDebugSdk();
    document.documentElement.dataset.webMapSdkDebugApple = "active";
  }
}

function createLocalGoogleMapsDebugSdk() {
  const debugItems = new Set();
  const debugEventTypes = new Set();

  const updateDebugItemCount = () => {
    document.documentElement.dataset.webMapSdkDebugGoogleItemCount = String(debugItems.size);
  };

  const updateDebugEventTypes = () => {
    document.documentElement.dataset.webMapSdkDebugGoogleEventTypes = [...debugEventTypes].join(",");
  };

  class DebugEventTarget {
    constructor() {
      this.__debugListeners = new Map();
    }

    addListener(eventName, handler) {
      if (!this.__debugListeners.has(eventName)) this.__debugListeners.set(eventName, new Set());
      this.__debugListeners.get(eventName).add(handler);
      debugEventTypes.add(eventName);
      updateDebugEventTypes();
      return {
        remove: () => this.__debugListeners.get(eventName)?.delete(handler),
      };
    }

    emit(eventName, payload) {
      this.__debugListeners.get(eventName)?.forEach((handler) => handler(payload));
    }

    clearListeners() {
      this.__debugListeners.clear();
    }
  }

  class DebugLatLng {
    constructor(lat, lng) {
      this._lat = lat;
      this._lng = lng;
    }

    lat() {
      return this._lat;
    }

    lng() {
      return this._lng;
    }
  }

  class DebugOverlayArray {
    constructor() {
      this.items = [];
    }

    updateDataset() {
      document.documentElement.dataset.webMapSdkDebugGoogleOverlayCount = String(this.items.length);
    }

    getArray() {
      return this.items;
    }

    push(item) {
      this.items.push(item);
      this.updateDataset();
      return this.items.length;
    }

    removeAt(index) {
      const item = this.items.splice(index, 1)[0];
      this.updateDataset();
      return item;
    }
  }

  class DebugMap extends DebugEventTarget {
    constructor(container, options = {}) {
      super();
      this.container = container;
      this.center = new DebugLatLng(options.center?.lat ?? 0, options.center?.lng ?? 0);
      this.zoom = options.zoom ?? state.mapZoom;
      this.overlayMapTypes = new DebugOverlayArray();
      this.__debugOverlayPane = document.createElement("div");
      this.__debugOverlayPane.className = "google-map-debug-pane";
      this.__debugOverlayPane.style.position = "absolute";
      this.__debugOverlayPane.style.inset = "0";
      this.__debugOverlayPane.style.pointerEvents = "none";
      container.append(this.__debugOverlayPane);
      document.documentElement.dataset.webMapSdkDebugGoogleMap = "mounted";
    }

    getCenter() {
      return this.center;
    }

    setCenter(center) {
      this.center = new DebugLatLng(center.lat, center.lng);
      this.emit("idle", { center: this.center });
    }

    getZoom() {
      return this.zoom;
    }

    setZoom(zoom) {
      this.zoom = zoom;
      this.emit("zoom_changed", { zoom });
      this.emit("idle", { zoom });
    }

    getBounds() {
      const span = mapKitCoordinateSpanForZoom(this.zoom, this.center.lat());
      return {
        getNorthEast: () => new DebugLatLng(this.center.lat() + span.latitudeDelta / 2, this.center.lng() + span.longitudeDelta / 2),
        getSouthWest: () => new DebugLatLng(this.center.lat() - span.latitudeDelta / 2, this.center.lng() - span.longitudeDelta / 2),
      };
    }
  }

  class DebugGoogleItem extends DebugEventTarget {
    constructor(options = {}) {
      super();
      this.options = options;
      this.map = options.map ?? null;
      this.position = options.position ? new DebugLatLng(options.position.lat, options.position.lng) : null;
      this.center = options.center ? new DebugLatLng(options.center.lat, options.center.lng) : null;
      this.opacity = options.opacity ?? 1;
      this.zIndex = options.zIndex ?? 0;
    }

    setMap(map) {
      if (map) {
        debugItems.add(this);
      } else {
        debugItems.delete(this);
      }
      updateDebugItemCount();
      this.map = map;
    }

    setPosition(position) {
      this.position = new DebugLatLng(position.lat, position.lng);
    }

    getPosition() {
      return this.position ?? this.center;
    }

    getCenter() {
      return this.center ?? this.position;
    }

    setIcon(icon) {
      this.icon = icon;
    }

    setZIndex(zIndex) {
      this.zIndex = zIndex;
    }

    setOpacity(opacity) {
      this.opacity = opacity;
    }
  }

  class DebugOverlayView {
    setMap(map) {
      if (this.map && !map) this.onRemove?.();
      this.map = map;
      if (map) {
        debugItems.add(this);
        updateDebugItemCount();
        this.onAdd?.();
        this.draw?.();
      } else {
        debugItems.delete(this);
        updateDebugItemCount();
      }
    }

    getPanes() {
      return { overlayMouseTarget: this.map?.__debugOverlayPane ?? document.body };
    }

    getProjection() {
      return {
        fromLatLngToDivPixel: (latLng) => ({
          x: ((latLng.lng() + 180) / 360) * (this.map?.container?.clientWidth ?? 390),
          y: ((90 - latLng.lat()) / 180) * (this.map?.container?.clientHeight ?? 640),
        }),
      };
    }
  }

  class DebugInfoWindow {
    constructor(options = {}) {
      this.content = options.content ?? "";
    }

    setContent(content) {
      this.content = content;
    }

    setPosition(position) {
      this.position = position;
    }

    open() {
      this.opened = true;
    }

    close() {
      this.opened = false;
    }
  }

  return {
    Map: DebugMap,
    ImageMapType: class {
      constructor(options = {}) {
        Object.assign(this, options);
      }
    },
    Size: class {
      constructor(width, height) {
        this.width = width;
        this.height = height;
      }
    },
    Point: class {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
    },
    LatLng: DebugLatLng,
    Marker: DebugGoogleItem,
    Circle: DebugGoogleItem,
    Polyline: DebugGoogleItem,
    Polygon: DebugGoogleItem,
    InfoWindow: DebugInfoWindow,
    OverlayView: DebugOverlayView,
    event: {
      addListener: (target, eventName, handler) => target?.addListener?.(eventName, handler) ?? { remove() {} },
      trigger: (target, eventName, payload) => target?.emit?.(eventName, payload),
      clearInstanceListeners: (target) => target?.clearListeners?.(),
    },
  };
}

function createLocalAppleMapKitDebugSdk() {
  const debugEventTypes = new Set();

  const updateDebugEventTypes = () => {
    document.documentElement.dataset.webMapSdkDebugAppleEventTypes = [...debugEventTypes].join(",");
  };

  class DebugAppleEventTarget {
    constructor() {
      this.listeners = new Map();
    }

    addEventListener(eventName, handler) {
      if (!this.listeners.has(eventName)) this.listeners.set(eventName, new Set());
      this.listeners.get(eventName).add(handler);
      debugEventTypes.add(eventName);
      updateDebugEventTypes();
    }

    removeEventListener(eventName, handler) {
      this.listeners.get(eventName)?.delete(handler);
    }

    dispatchEvent(event) {
      const eventName = typeof event === "string" ? event : event?.type;
      this.listeners.get(eventName)?.forEach((handler) => handler(event));
    }
  }

  class DebugCoordinate {
    constructor(latitude, longitude) {
      this.latitude = latitude;
      this.longitude = longitude;
    }
  }

  class DebugMap extends DebugAppleEventTarget {
    constructor(container) {
      super();
      this.container = container;
      this.annotations = [];
      this.overlays = [];
      this.tileOverlays = [];
      document.documentElement.dataset.webMapSdkDebugAppleMap = "mounted";
    }

    addTileOverlay(overlay) {
      this.tileOverlays.push(overlay);
      document.documentElement.dataset.webMapSdkDebugAppleTileOverlayCount = String(this.tileOverlays.length);
    }

    removeTileOverlay(overlay) {
      this.tileOverlays = this.tileOverlays.filter((item) => item !== overlay);
      document.documentElement.dataset.webMapSdkDebugAppleTileOverlayCount = String(this.tileOverlays.length);
    }

    addAnnotation(annotation) {
      this.annotations.push(annotation);
      document.documentElement.dataset.webMapSdkDebugAppleAnnotationCount = String(this.annotations.length);
      annotation.element ??= annotation.factory?.();
      if (annotation.element) {
        annotation.element.style.position = "absolute";
        annotation.element.style.left = "50%";
        annotation.element.style.top = "50%";
        annotation.element.style.transform = "translate(-50%, -50%)";
        this.container.append(annotation.element);
      }
    }

    removeAnnotation(annotation) {
      this.annotations = this.annotations.filter((item) => item !== annotation);
      document.documentElement.dataset.webMapSdkDebugAppleAnnotationCount = String(this.annotations.length);
      annotation.element?.remove?.();
    }

    addOverlay(overlay) {
      this.overlays.push(overlay);
      document.documentElement.dataset.webMapSdkDebugAppleOverlayCount = String(this.overlays.length);
    }

    removeOverlay(overlay) {
      this.overlays = this.overlays.filter((item) => item !== overlay);
      document.documentElement.dataset.webMapSdkDebugAppleOverlayCount = String(this.overlays.length);
    }

    destroy() {
      this.annotations = [];
      this.overlays = [];
      this.tileOverlays = [];
      document.documentElement.dataset.webMapSdkDebugAppleAnnotationCount = "0";
      document.documentElement.dataset.webMapSdkDebugAppleOverlayCount = "0";
      document.documentElement.dataset.webMapSdkDebugAppleTileOverlayCount = "0";
    }
  }

  class DebugAnnotation extends DebugAppleEventTarget {
    constructor(coordinate, factory, options = {}) {
      super();
      this.coordinate = coordinate;
      this.factory = factory;
      this.element = factory?.();
      Object.assign(this, options);
    }
  }

  class DebugShapeOverlay extends DebugAppleEventTarget {
    constructor(first, second, options = {}) {
      super();
      if (Array.isArray(first)) {
        this.points = first;
      } else {
        this.coordinate = first;
        this.radius = second;
      }
      Object.assign(this, options);
    }
  }

  return {
    FeatureVisibility: { Hidden: "hidden" },
    Map: DebugMap,
    Coordinate: DebugCoordinate,
    CoordinateSpan: class {
      constructor(latitudeDelta, longitudeDelta) {
        this.latitudeDelta = latitudeDelta;
        this.longitudeDelta = longitudeDelta;
      }
    },
    CoordinateRegion: class {
      constructor(center, span) {
        this.center = center;
        this.span = span;
      }
    },
    TileOverlay: class {
      constructor(urlTemplate, options = {}) {
        this.urlTemplate = urlTemplate;
        Object.assign(this, options);
      }
    },
    Style: class {
      constructor(options = {}) {
        Object.assign(this, options);
      }
    },
    Annotation: DebugAnnotation,
    MarkerAnnotation: class extends DebugAnnotation {
      constructor(coordinate, options = {}) {
        super(coordinate, () => {
          const element = document.createElement("span");
          element.className = "apple-map-debug-marker";
          element.textContent = options.glyphText || "";
          return element;
        }, options);
      }
    },
    CircleOverlay: DebugShapeOverlay,
    PolygonOverlay: DebugShapeOverlay,
    PolylineOverlay: DebugShapeOverlay,
    init() {},
  };
}

const NATIVE_MAP_BRIDGE_PROTOCOL_VERSION = 1;
const NATIVE_MAP_BRIDGE_COMMANDS = [
  "getStatus",
  "isReady",
  "getDebugState",
  "init",
  "setView",
  "invalidateSize",
  "setInteractionRegions",
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
  "destroy",
];
const NATIVE_MAP_BRIDGE_EVENTS = ["click", "moveend", "zoomend"];

function installLocalNativeMapBridgeDebug() {
  if (!isLocalMapProviderDebugOrigin()) return;
  const params = new URLSearchParams(window.location.search);
  const enabled = params.get("mapProviderDebugBridge") === "1" || params.get("nativeMapBridgeDebug") === "1";
  if (!enabled || resolveNativeMapBridge()) return;
  installMapProviderDebugInspector();

  const commands = [];
  const events = [];
  const listeners = new Map();
  const layerMembership = new Map();
  const layerChildren = new Map();
  const layerVisibility = new Map();
  const itemLayers = new Map();
  const itemVisibility = new Map();
  const itemTypes = new Map();
  const itemPayloads = new Map();
  const itemClassNames = new Map();
  const tileOverlayDefinitions = new Map();
  const tileOverlayVisibility = new Map();
  const pinTiers = new Map();
  const pinTierVisibility = new Map();
  let rendererFrame = null;
  let interactionRegions = null;
  let lastCameraCenter = null;
  let lastCameraZoom = null;
  const unsupportedValue = params.get("mapProviderDebugBridgeUnsupported") ?? params.get("native_map_bridge_debug_unsupported") ?? "";
  const capabilityFailure = (params.get("mapProviderDebugBridgeCapabilityFail") ?? "").trim().toLowerCase();
  const unsupportedProviders = String(unsupportedValue)
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  const providerUnsupported = (providerId) => (
    unsupportedProviders.includes("all")
    || unsupportedProviders.includes(providerId)
    || (providerId === MAP_PROVIDER_IDS.APPLE_NATIVE && unsupportedProviders.includes("apple"))
    || (providerId === MAP_PROVIDER_IDS.GOOGLE_NATIVE && unsupportedProviders.includes("google"))
  );
  const supportedProviders = [MAP_PROVIDER_IDS.APPLE_NATIVE, MAP_PROVIDER_IDS.GOOGLE_NATIVE]
    .filter((providerId) => !providerUnsupported(providerId));
  const bridgeProtocolVersion = () => capabilityFailure === "protocol" ? 0 : NATIVE_MAP_BRIDGE_PROTOCOL_VERSION;
  const bridgeSupportedCommands = () => capabilityFailure === "commands"
    ? NATIVE_MAP_BRIDGE_COMMANDS.filter((command) => command !== "createItems")
    : NATIVE_MAP_BRIDGE_COMMANDS;
  const bridgeSupportedEvents = (providerId) => capabilityFailure === "events"
    ? nativeBridgeSupportedEvents(providerId).filter((eventName) => !eventName.endsWith(":zoomend"))
    : nativeBridgeSupportedEvents(providerId);
  const recordCapabilities = (providerId) => {
    const supportedEvents = bridgeSupportedEvents(providerId);
    const supportedCommands = bridgeSupportedCommands();
    document.documentElement.dataset.nativeMapBridgeDebugProtocolVersion = String(bridgeProtocolVersion());
    document.documentElement.dataset.nativeMapBridgeDebugSupportedCommandCount = String(supportedCommands.length);
    document.documentElement.dataset.nativeMapBridgeDebugSupportedEventCount = String(supportedEvents.length);
    return { supportedCommands, supportedEvents };
  };
  const commandTypeCounts = () => commands.reduce((counts, entry) => {
    counts[entry.command] = (counts[entry.command] ?? 0) + 1;
    return counts;
  }, {});
  const lastContainerMetrics = () => [...commands]
    .reverse()
    .find((entry) => entry.payload?.containerMetrics)
    ?.payload
    ?.containerMetrics ?? null;
  const eventTypeCounts = () => events.reduce((counts, entry) => {
    counts[entry.eventName] = (counts[entry.eventName] ?? 0) + 1;
    return counts;
  }, {});
  const layerMembershipState = () => Object.fromEntries(
    [...layerMembership.entries()].map(([layerId, itemIds]) => [layerId, [...itemIds].sort()]),
  );
  const layerChildrenState = () => Object.fromEntries(
    [...layerChildren.entries()].map(([layerId, childLayerIds]) => [layerId, [...childLayerIds].sort()]),
  );
  const layerVisibilityState = () => Object.fromEntries(layerVisibility.entries());
  const itemVisibilityState = () => Object.fromEntries(itemVisibility.entries());
  const itemTypeCountsState = () => [...itemTypes.values()].reduce((counts, type) => {
    counts[type] = (counts[type] ?? 0) + 1;
    return counts;
  }, {});
  const tileOverlayIdsState = () => [...tileOverlayDefinitions.keys()].sort();
  const tileOverlayTypesState = () => Object.fromEntries(
    [...tileOverlayDefinitions.entries()].map(([overlayId, definition]) => [overlayId, definition?.type ?? ""]),
  );
  const tileOverlayVisibilityState = () => Object.fromEntries(tileOverlayVisibility.entries());
  const markerIdsState = () => [...itemTypes.entries()]
    .filter(([, type]) => type === "marker")
    .map(([itemId]) => itemId)
    .sort();
  const shapeIdsState = () => [...itemTypes.entries()]
    .filter(([, type]) => ["circle", "circle-marker", "polyline", "polygon", "shape"].includes(type))
    .map(([itemId]) => itemId)
    .sort();
  const markerPayloadCount = (key) => [...itemPayloads.values()].filter((payload) => {
    if (key === "iconAnchor" || key === "tooltipAnchor" || key === "popupAnchor") {
      return Array.isArray(payload?.icon?.[key]) && Array.isArray(payload?.icon?.iconSize);
    }
    return payload?.[key] !== undefined;
  }).length;
  const shapePayloadCount = (key) => [...itemPayloads.entries()].filter(([itemId, payload]) => {
    const type = itemTypes.get(itemId) ?? "";
    if (!["circle", "circle-marker", "polyline", "polygon", "shape"].includes(type)) return false;
    const value = payload?.[key];
    if (typeof value === "string") return value.trim().length > 0;
    if (value && typeof value === "object") return String(value.content ?? "").trim().length > 0;
    return false;
  }).length;
  const markerClassNamesState = () => [...new Set(itemClassNames.values())].sort();
  const pinTierVisibilityState = () => Object.fromEntries(pinTierVisibility.entries());
  const recordRendererDebugDatasets = () => {
    if (rendererFrame) {
      document.documentElement.dataset.nativeMapBridgeDebugRendererFrame = JSON.stringify(rendererFrame);
    } else {
      delete document.documentElement.dataset.nativeMapBridgeDebugRendererFrame;
    }
    if (lastCameraCenter) {
      document.documentElement.dataset.nativeMapBridgeDebugLastCameraCenter = JSON.stringify(lastCameraCenter);
    } else {
      delete document.documentElement.dataset.nativeMapBridgeDebugLastCameraCenter;
    }
    if (lastCameraZoom != null) {
      document.documentElement.dataset.nativeMapBridgeDebugLastCameraZoom = String(lastCameraZoom);
    } else {
      delete document.documentElement.dataset.nativeMapBridgeDebugLastCameraZoom;
    }
  };
  const rememberCameraEventPayload = (payload = {}) => {
    const center = nativeEventCenter(payload);
    const zoom = nativeEventZoom(payload);
    if (center) lastCameraCenter = center;
    if (zoom != null) lastCameraZoom = zoom;
    recordRendererDebugDatasets();
  };
  const debugRendererState = (providerId) => ({
    kind: providerId,
    providerId,
    implemented: false,
    ready: supportedProviders.includes(providerId),
    frame: rendererFrame,
    interactionRegionCount: interactionRegions?.interactiveRects?.length ?? 0,
    lastCameraCenter,
    lastCameraZoom,
    tileOverlayCount: tileOverlayDefinitions.size,
    tileOverlayIds: tileOverlayIdsState(),
    tileOverlayTypes: tileOverlayTypesState(),
    tileOverlayVisibility: tileOverlayVisibilityState(),
    layerCount: layerMembership.size,
    layerMembership: layerMembershipState(),
    layerChildren: layerChildrenState(),
    layerVisibility: layerVisibilityState(),
    itemVisibility: itemVisibilityState(),
    itemTypeCounts: itemTypeCountsState(),
    markerCount: markerIdsState().length,
    markerIds: markerIdsState(),
    shapeCount: shapeIdsState().length,
    shapeIds: shapeIdsState(),
    markerClassNames: markerClassNamesState(),
    markerAnchorCount: markerPayloadCount("iconAnchor"),
    markerTooltipAnchorCount: markerPayloadCount("tooltipAnchor"),
    markerPopupAnchorCount: markerPayloadCount("popupAnchor"),
    markerOpacityCount: markerPayloadCount("opacity"),
    markerZIndexCount: markerPayloadCount("zIndexOffset"),
    shapePopupCount: shapePayloadCount("popup"),
    shapeTooltipCount: shapePayloadCount("tooltip"),
    pinTierCount: pinTiers.size,
    pinTierIds: [...pinTiers.keys()].sort(),
    pinTierVisibility: pinTierVisibilityState(),
  });
  const rememberItemPayload = (itemId, type, payload = {}) => {
    if (!itemId) return;
    if (type) itemTypes.set(itemId, type);
    itemPayloads.set(itemId, {
      ...(itemPayloads.get(itemId) ?? {}),
      ...(payload ?? {}),
    });
    const className = payload?.icon?.className ?? payload?.className ?? "";
    if (className) itemClassNames.set(itemId, className);
  };
  const addLayerMembership = (layerId, itemId, isLayer = false) => {
    if (!layerId || !itemId) return;
    if (!layerMembership.has(layerId)) layerMembership.set(layerId, new Set());
    layerMembership.get(layerId).add(itemId);
    itemLayers.set(itemId, layerId);
    if (isLayer) {
      if (!layerChildren.has(layerId)) layerChildren.set(layerId, new Set());
      layerChildren.get(layerId).add(itemId);
    }
  };
  const removeLayerMembership = (layerId, itemId) => {
    if (!layerId || !itemId) return;
    layerMembership.get(layerId)?.delete(itemId);
    if (layerMembership.get(layerId)?.size === 0) layerMembership.delete(layerId);
    layerChildren.get(layerId)?.delete(itemId);
    if (layerChildren.get(layerId)?.size === 0) layerChildren.delete(layerId);
    if (itemLayers.get(itemId) === layerId) itemLayers.delete(itemId);
  };
  const removeItemFromMemberships = (itemId) => {
    if (!itemId) return;
    const layerId = itemLayers.get(itemId);
    if (layerId) removeLayerMembership(layerId, itemId);
    [...layerMembership.keys()].forEach((currentLayerId) => removeLayerMembership(currentLayerId, itemId));
  };
  const clearLayerMembership = (layerId) => {
    if (!layerId) return;
    layerMembership.get(layerId)?.forEach((itemId) => {
      itemLayers.delete(itemId);
      itemVisibility.delete(itemId);
      itemTypes.delete(itemId);
      itemPayloads.delete(itemId);
      itemClassNames.delete(itemId);
    });
    layerMembership.delete(layerId);
    layerChildren.delete(layerId);
  };
  const setLayerItemVisibility = (layerId, visible, visitedLayerIds = new Set()) => {
    if (!layerId || visitedLayerIds.has(layerId)) return;
    visitedLayerIds.add(layerId);
    layerChildren.get(layerId)?.forEach((childLayerId) => {
      setLayerItemVisibility(childLayerId, visible, visitedLayerIds);
    });
    layerMembership.get(layerId)?.forEach((itemId) => {
      if (layerChildren.get(layerId)?.has(itemId)) return;
      if (itemId) itemVisibility.set(itemId, visible);
    });
  };
  const recordLayerAndTierState = (command, payload = {}) => {
    if (command === "configurePinTier") {
      const tier = payload.tier ?? {};
      const tierId = tier.id ?? payload.tierId ?? payload.id;
      if (tierId) pinTiers.set(tierId, tier);
    }
    if (command === "setPinTierVisible") {
      const tierId = payload.tierId ?? payload.id;
      if (tierId) pinTierVisibility.set(tierId, payload.visible !== false);
    }
    if (command === "setLayerVisible") {
      const layerId = payload.layerId ?? payload.overlayId ?? payload.id;
      if (layerId) {
        const visible = payload.visible !== false;
        layerVisibility.set(layerId, visible);
        if (tileOverlayDefinitions.has(layerId)) tileOverlayVisibility.set(layerId, visible);
        setLayerItemVisibility(layerId, visible);
      }
    }
    if (command === "init" || command === "invalidateSize") {
      if (payload.containerMetrics) rendererFrame = payload.containerMetrics;
    }
    if (command === "setInteractionRegions") {
      interactionRegions = payload;
      if (payload.mapFrame) rendererFrame = payload.mapFrame;
    }
    if (command === "setView") {
      if (payload.center) {
        lastCameraCenter = {
          lat: Number(payload.center.lat),
          lon: Number(payload.center.lon),
        };
      }
      if (payload.zoom != null) lastCameraZoom = Number(payload.zoom);
    }
    if (command === "createTileOverlay") {
      const layerId = payload.layerId ?? payload.overlayId ?? payload.id;
      if (layerId) {
        tileOverlayDefinitions.set(layerId, payload.overlay ?? payload);
        tileOverlayVisibility.set(layerId, payload.visible !== false);
      }
    }
    if (command === "addToLayer") {
      addLayerMembership(payload.layerId, payload.itemId, payload.isLayer === true);
    }
    if (command === "addItemsToLayer") {
      (payload.items ?? []).forEach((item) => addLayerMembership(payload.layerId, item?.itemId, item?.isLayer === true));
    }
    if (command === "createItem") {
      const itemId = payload.itemId ?? payload.id;
      if (itemId && !itemVisibility.has(itemId)) itemVisibility.set(itemId, true);
      rememberItemPayload(itemId, payload.type, payload.payload);
    }
    if (command === "createItems") {
      (payload.items ?? []).forEach((item) => {
        const itemId = item?.itemId ?? item?.id;
        if (itemId && !itemVisibility.has(itemId)) itemVisibility.set(itemId, true);
        rememberItemPayload(itemId, item?.type, item?.payload);
      });
    }
    if (command === "updateItem") {
      const itemId = payload.itemId ?? payload.id;
      rememberItemPayload(itemId, payload.type ?? itemTypes.get(itemId), payload.payload);
    }
    if (command === "setItemVisible") {
      const itemId = payload.itemId ?? payload.id;
      if (itemId) itemVisibility.set(itemId, payload.visible !== false);
    }
    if (command === "setItemsVisible") {
      (payload.itemIds ?? []).forEach((itemId) => {
        if (itemId) itemVisibility.set(itemId, payload.visible !== false);
      });
    }
    if (command === "removeFromLayer") {
      removeLayerMembership(payload.layerId, payload.itemId);
    }
    if (command === "clearLayer") {
      const layerId = payload.layerId ?? payload.overlayId ?? payload.id;
      layerVisibility.delete(layerId);
      tileOverlayDefinitions.delete(layerId);
      tileOverlayVisibility.delete(layerId);
      clearLayerMembership(layerId);
    }
    if (command === "removeItem") {
      const itemId = payload.itemId ?? payload.id;
      itemVisibility.delete(itemId);
      itemTypes.delete(itemId);
      itemPayloads.delete(itemId);
      itemClassNames.delete(itemId);
      removeItemFromMemberships(itemId);
    }
    if (command === "destroy") {
      layerMembership.clear();
      layerChildren.clear();
      layerVisibility.clear();
      itemLayers.clear();
      itemVisibility.clear();
      itemTypes.clear();
      itemPayloads.clear();
      itemClassNames.clear();
      tileOverlayDefinitions.clear();
      tileOverlayVisibility.clear();
      pinTiers.clear();
      pinTierVisibility.clear();
      interactionRegions = null;
      rendererFrame = null;
      lastCameraCenter = null;
      lastCameraZoom = null;
    }
    recordRendererDebugDatasets();
  };
  const bridge = {
    __meteoPecheDebugBridge: true,
    commands,
    supportedProviders,
    getStatus({ providerId } = {}) {
      document.documentElement.dataset.nativeMapBridgeDebugStatus = "ready";
      const { supportedCommands, supportedEvents } = recordCapabilities(providerId);
      return Promise.resolve({
        ready: supportedProviders.includes(providerId),
        providerId,
        supportedProviders,
        bridgeProtocolVersion: bridgeProtocolVersion(),
        supportedCommands,
        supportedEvents,
      });
    },
    isReady({ providerId } = {}) {
      return Promise.resolve(supportedProviders.includes(providerId));
    },
    getDebugState({ providerId } = {}) {
      document.documentElement.dataset.nativeMapBridgeDebugStatus = "ready";
      const { supportedCommands, supportedEvents } = recordCapabilities(providerId);
      return Promise.resolve({
        ready: supportedProviders.includes(providerId),
        reason: "local-native-map-debug-bridge",
        providerId,
        supportedProviders,
        bridgeProtocolVersion: bridgeProtocolVersion(),
        supportedCommands,
        supportedEvents,
        commandCount: commands.length,
        commandTypeCounts: commandTypeCounts(),
        lastContainerMetrics: lastContainerMetrics(),
        renderer: debugRendererState(providerId),
        eventCount: events.length,
        eventTypeCounts: eventTypeCounts(),
        events: events.slice(-40),
        commands: commands.slice(-80),
      });
    },
    invoke({ command, payload } = {}) {
      return this.record(command, payload);
    },
    postMessage({ command, payload } = {}) {
      this.record(command, payload);
    },
    addListener(eventName, handler) {
      if (!listeners.has(eventName)) listeners.set(eventName, new Set());
      listeners.get(eventName).add(handler);
      return {
        remove: () => listeners.get(eventName)?.delete(handler),
      };
    },
    emit(eventName, payload = {}) {
      events.push({ eventName, payload, timestamp: Date.now() });
      const handlers = listeners.get(eventName) ?? new Set();
      document.documentElement.dataset.nativeMapBridgeDebugEventCount = String(events.length);
      document.documentElement.dataset.nativeMapBridgeDebugLastEvent = eventName;
      document.documentElement.dataset.nativeMapBridgeDebugEventTypes = Object.keys(eventTypeCounts()).join(",");
      document.documentElement.dataset.nativeMapBridgeDebugEventDeliveredCount = String(
        Number(document.documentElement.dataset.nativeMapBridgeDebugEventDeliveredCount || 0) + handlers.size,
      );
      handlers.forEach((handler) => handler(payload));
    },
    emitMapEvent({ providerId, eventName, payload = {} } = {}) {
      if (!providerId || !eventName) return Promise.resolve(null);
      if (eventName === "moveend" || eventName === "zoomend") rememberCameraEventPayload(payload);
      this.emit(nativeBridgeEventName(providerId, eventName), payload);
      return Promise.resolve({ ok: true, providerId, eventName, payload });
    },
    simulateMove({ providerId, center, zoom } = {}) {
      return this.emitMapEvent({
        providerId,
        eventName: "moveend",
        payload: { center, zoom },
      });
    },
    simulateItemClick({ providerId, itemId, lat, lon } = {}) {
      const fallback = nativePayloadLatLng(itemPayloads.get(itemId));
      return this.emitMapEvent({
        providerId,
        eventName: "click",
        payload: {
          itemId,
          lat: isValidNumber(lat) ? lat : fallback?.lat,
          lon: isValidNumber(lon) ? lon : fallback?.lng,
        },
      });
    },
    record(command, payload = {}) {
      if (!command) return Promise.resolve(null);
      recordLayerAndTierState(command, payload);
      commands.push({ command, payload });
      const commandNames = commands.map((entry) => entry.command);
      const commandTypes = [...new Set(commandNames)];
      document.documentElement.dataset.nativeMapBridgeDebug = "active";
      document.documentElement.dataset.nativeMapBridgeDebugCommandCount = String(commands.length);
      document.documentElement.dataset.nativeMapBridgeDebugLastCommand = command;
      document.documentElement.dataset.nativeMapBridgeDebugCommands = commandNames.slice(-24).join(",");
      document.documentElement.dataset.nativeMapBridgeDebugCommandTypes = commandTypes.join(",");
      document.documentElement.dataset.nativeMapBridgeDebugCommandTypeCounts = commandTypes
        .map((type) => `${type}:${commandNames.filter((name) => name === type).length}`)
        .join(",");
      if (payload?.containerMetrics) {
        document.documentElement.dataset.nativeMapBridgeDebugContainerMetrics = JSON.stringify(payload.containerMetrics);
      }
      if (payload?.interactiveRects) {
        document.documentElement.dataset.nativeMapBridgeDebugInteractionRegionCount = String(payload.interactiveRects.length);
      }
      document.documentElement.dataset.nativeMapBridgeDebugLayerCount = String(layerMembership.size);
      document.documentElement.dataset.nativeMapBridgeDebugLayerMembership = JSON.stringify(layerMembershipState());
      document.documentElement.dataset.nativeMapBridgeDebugLayerChildren = JSON.stringify(layerChildrenState());
      document.documentElement.dataset.nativeMapBridgeDebugLayerVisibility = JSON.stringify(layerVisibilityState());
      document.documentElement.dataset.nativeMapBridgeDebugTileOverlayCount = String(tileOverlayDefinitions.size);
      document.documentElement.dataset.nativeMapBridgeDebugTileOverlayIds = tileOverlayIdsState().join(",");
      document.documentElement.dataset.nativeMapBridgeDebugTileOverlayTypes = JSON.stringify(tileOverlayTypesState());
      document.documentElement.dataset.nativeMapBridgeDebugTileOverlayVisibility = JSON.stringify(tileOverlayVisibilityState());
      document.documentElement.dataset.nativeMapBridgeDebugItemVisibility = JSON.stringify(itemVisibilityState());
      document.documentElement.dataset.nativeMapBridgeDebugItemTypeCounts = JSON.stringify(itemTypeCountsState());
      document.documentElement.dataset.nativeMapBridgeDebugMarkerIds = markerIdsState().join(",");
      document.documentElement.dataset.nativeMapBridgeDebugShapeIds = shapeIdsState().join(",");
      document.documentElement.dataset.nativeMapBridgeDebugMarkerClassNames = markerClassNamesState().join("|");
      document.documentElement.dataset.nativeMapBridgeDebugMarkerAnchorCount = String(markerPayloadCount("iconAnchor"));
      document.documentElement.dataset.nativeMapBridgeDebugMarkerTooltipAnchorCount = String(markerPayloadCount("tooltipAnchor"));
      document.documentElement.dataset.nativeMapBridgeDebugMarkerPopupAnchorCount = String(markerPayloadCount("popupAnchor"));
      document.documentElement.dataset.nativeMapBridgeDebugMarkerOpacityCount = String(markerPayloadCount("opacity"));
      document.documentElement.dataset.nativeMapBridgeDebugMarkerZIndexCount = String(markerPayloadCount("zIndexOffset"));
      document.documentElement.dataset.nativeMapBridgeDebugShapePopupCount = String(shapePayloadCount("popup"));
      document.documentElement.dataset.nativeMapBridgeDebugShapeTooltipCount = String(shapePayloadCount("tooltip"));
      document.documentElement.dataset.nativeMapBridgeDebugPinTierCount = String(pinTiers.size);
      document.documentElement.dataset.nativeMapBridgeDebugPinTierVisibility = JSON.stringify(pinTierVisibilityState());
      document.documentElement.dataset.nativeMapBridgeDebugBatchSizes = commands
        .filter((entry) => ["createItems", "addItemsToLayer", "setItemsVisible"].includes(entry.command))
        .map((entry) => {
          const size = entry.payload?.items?.length ?? entry.payload?.itemIds?.length ?? 0;
          return `${entry.command}:${size}`;
        })
        .slice(-24)
        .join(",");
      return Promise.resolve({ ok: true, command, payload });
    },
  };

  NATIVE_MAP_BRIDGE_COMMANDS
    .filter((command) => !["getStatus", "isReady", "getDebugState"].includes(command))
    .forEach((command) => {
    bridge[command] = (payload = {}) => bridge.record(command, payload);
  });

  window.MeteoPecheNativeMap = bridge;
  installMapProviderDebugInspector();
  if (params.get("mapProviderDebugSimulateEvents") === "1") {
    window.setTimeout(() => {
      const providerId = mapProviderOverride() || supportedProviders[0] || MAP_PROVIDER_IDS.APPLE_NATIVE;
      const firstCreatedItem = commands.find((entry) => entry.command === "createItem" && entry.payload?.itemId);
      const firstBatchItem = commands.find((entry) => entry.command === "createItems" && entry.payload?.items?.[0]?.itemId);
      const itemId = firstCreatedItem?.payload?.itemId ?? firstBatchItem?.payload?.items?.[0]?.itemId;
      bridge.simulateMove({
        providerId,
        center: { lat: 43.2965, lon: 5.3698 },
        zoom: 12,
      });
      bridge.emitMapEvent({
        providerId,
        eventName: "zoomend",
        payload: {
          camera: {
            target: { latitude: 43.2965, longitude: 5.3698 },
            zoom: 13,
          },
        },
      });
      if (itemId) {
        bridge.simulateItemClick({
          providerId,
          itemId,
        });
      }
    }, 2200);
  }
}

function getCapacitorPlatform() {
  return window.Capacitor?.getPlatform?.() ?? "web";
}

function isNativeRuntime() {
  return Boolean(window.Capacitor?.isNativePlatform?.());
}

function isSafariBrowser() {
  const userAgent = navigator.userAgent ?? "";
  const vendor = navigator.vendor ?? "";
  const isAppleBrowser = vendor.includes("Apple");
  const hasSafari = /\bSafari\b/.test(userAgent);
  const hasOtherEngine = /\b(CriOS|FxiOS|EdgiOS|OPR|Chrome|Chromium|SamsungBrowser)\b/.test(userAgent);
  return isAppleBrowser && hasSafari && !hasOtherEngine;
}

function isChromeBrowser() {
  const userAgent = navigator.userAgent ?? "";
  const hasChrome = /\b(Chrome|Chromium|CriOS)\b/.test(userAgent);
  const hasOtherChromiumBrand = /\b(Edg|EdgiOS|OPR|SamsungBrowser)\b/.test(userAgent);
  return hasChrome && !hasOtherChromiumBrand;
}

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}

function setupMapPinLayers() {
  if (!state.mapProvider) return;

  const pinLayers = state.mapProvider.createPinTierLayers(PIN_LAYER_TIERS);
  state.mapPinPanes = pinLayers.panes;
  state.mapPinLayers = pinLayers.layers;
  state.mapPinLayer = pinLayers.layer;
  updateMapPinPaneVisibility();
}

function setMapProviderLoading(loading) {
  if (!els.spotMap) return;
  window.clearTimeout(state.mapLoadingTimer);
  if (loading) {
    els.spotMap.classList.add("map-loading");
    return;
  }
  state.mapLoadingTimer = window.setTimeout(() => els.spotMap.classList.remove("map-loading"), 120);
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
  return t(getAllFishFilters().find((filter) => filter.id === id)?.label ?? id);
}

function populateActivityFish() {
  if (!els.activityFish) return;

  els.activityFish.innerHTML = "";
  getFishFilters()
    .filter((filter) => filter.id !== "all")
    .forEach((filter) => {
      const option = document.createElement("option");
      option.value = filter.id;
      option.textContent = t(filter.label);
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
      option.textContent = t(filter.label);
      els.catchSpecies.append(option);
    });

  els.catchSpecies.value = normalizeActivityFish(previous);
}

function populatePreferenceSpecies() {
  if (!els.preferenceSpecies) return;

  const previous = els.preferenceSpecies.value || state.activityFish;
  els.preferenceSpecies.innerHTML = "";
  getFishFilters()
    .filter((filter) => filter.id !== "all")
    .forEach((filter) => {
      const option = document.createElement("option");
      option.value = filter.id;
      option.textContent = t(filter.label);
      els.preferenceSpecies.append(option);
    });

  els.preferenceSpecies.value = normalizeActivityFish(previous);
}

function populateRiggingTechniques() {
  if (!els.riggingTechnique) return;

  const profiles = riggingProfiles[state.waterMode] ?? riggingProfiles[WATER_MODES.SEA];
  const previous = els.riggingTechnique.value;
  els.riggingTechnique.innerHTML = "";
  profiles.forEach((profile) => {
    const option = document.createElement("option");
    option.value = profile.id;
    option.textContent = t(profile.label);
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
  state.activeWeatherSubtab = normalizeWeatherSubtab(saved.weatherSubtab ?? weatherSubtabFromMobileView(saved.mobileView));
  state.activeAtmosphereChart = normalizeAtmosphereChart(saved.atmosphereChart);
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
  state.coastalEnabled = saved.coastalEnabled !== false;
  state.bathymetryEnabled = saved.bathymetryEnabled !== false;
  state.knownFishingEnabled = saved.knownFishingEnabled !== false;
  state.regulationEnabled = saved.regulationEnabled !== false;
  state.marineOverlayMode = normalizeMarineOverlayMode(saved.marineOverlayMode);
  state.activeFishFilters = normalizeFishFilters(saved.fishFilters);
  state.activityFish = normalizeActivityFish(saved.activityFish);
  state.theme = normalizeTheme(saved.theme);
  state.language = normalizeLanguage(saved.language);
  document.documentElement.lang = state.language;
  state.isPro = Boolean(saved.isPro);
  applySubscriptionState();
  state.profile = normalizeProfile(saved.profile);
  state.onboardingCompleted = Boolean(saved.onboardingCompleted);
  state.privacyAccepted = Boolean(saved.privacyAccepted);
  state.notificationsEnabled = Boolean(saved.notificationsEnabled);
  state.smartAlerts = normalizeSmartAlertSettings(saved.smartAlerts);
  state.smartAlertSchedule = normalizeSmartAlertSchedule(saved.smartAlertSchedule);
  state.glancePayload = normalizeGlancePayload(readAppStore().glancePayload);
  state.entitlements = normalizeEntitlementState(saved.entitlements);
}

function applyTheme(options = {}) {
  state.theme = normalizeTheme(state.theme);
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.style.colorScheme = state.theme;

  if (options.render) {
    safeRenderAll();
  }
}

function safeRenderAll() {
  try {
    renderAll();
  } catch (error) {
    console.error("Render failed after forecast load", error);
    setStatus("Données chargées, affichage partiel", "warning");
    renderCoreForecastFallback();
  }
}

function renderCoreForecastFallback() {
  const selected = getSelectedDay();
  try { renderDayTabs(); } catch (error) { console.warn("Fallback day tabs failed", error); }
  try { renderDayTimeline(selected); } catch (error) { console.warn("Fallback timeline failed", error); }
  try { renderConditionBrief(selected); } catch (error) { console.warn("Fallback condition failed", error); }
  try { renderMetrics(selected); } catch (error) { console.warn("Fallback metrics failed", error); }
}

function isProUser() {
  return Boolean(state.isPro);
}

function applySubscriptionState() {
  document.documentElement.dataset.plan = isProUser() ? "pro" : "free";
  updateProLockedSurfaces();
}

function updateProLockedSurfaces() {
  document.querySelectorAll("[data-pro-feature]").forEach((element) => {
    const feature = element.dataset.proFeature;
    const locked = Boolean(feature && !canUseFeature(feature));
    element.classList.toggle("is-pro-locked", locked);
    element.dataset.locked = String(locked);
  });
}

function showProGate(feature = "planning.10day") {
  const details = PRO_FEATURE_DETAILS[feature] ?? PRO_FEATURE_DETAILS["planning.10day"];
  if (els.proGateTitle) els.proGateTitle.textContent = details.title;
  if (els.proGateCopy) els.proGateCopy.textContent = details.copy;
  if (els.proGateBenefits) {
    els.proGateBenefits.innerHTML = details.benefits
      .map((benefit) => `<span><i class="ti ti-lock-open" aria-hidden="true"></i>${escapeHtml(benefit)}</span>`)
      .join("");
  }
  if (els.proGateCta) els.proGateCta.textContent = "Passer à Pro";
  els.proGateBackdrop?.removeAttribute("hidden");
  els.proGate?.removeAttribute("hidden");
  els.proGate?.setAttribute("aria-hidden", "false");
  document.documentElement.classList.add("has-pro-gate");
}

function hideProGate() {
  els.proGateBackdrop?.setAttribute("hidden", "");
  els.proGate?.setAttribute("hidden", "");
  els.proGate?.setAttribute("aria-hidden", "true");
  document.documentElement.classList.remove("has-pro-gate");
}

function initNativeAppShell() {
  state.native.isNative = Boolean(window.Capacitor?.isNativePlatform?.());
  document.documentElement.classList.toggle("is-native-app", state.native.isNative);
  initOfflineSupport();
  syncNativePermissions();
}

function getCapacitorPlugin(globalName, pluginName) {
  return window.Capacitor?.Plugins?.[pluginName] ?? window[globalName]?.[pluginName] ?? null;
}

function getGeolocationPlugin() {
  return getCapacitorPlugin("capacitorGeolocationPluginCapacitor", "Geolocation");
}

function getCameraPlugin() {
  return getCapacitorPlugin("capacitorCamera", "Camera");
}

function getNetworkPlugin() {
  return getCapacitorPlugin("capacitorNetwork", "Network");
}

function getNotificationPlugin() {
  return getCapacitorPlugin("capacitorLocalNotifications", "LocalNotifications");
}

function getSplashPlugin() {
  return getCapacitorPlugin("capacitorSplashScreen", "SplashScreen");
}

function hideNativeSplash() {
  const splash = getSplashPlugin();
  if (!splash?.hide) return;

  try {
    Promise.resolve(splash.hide({ fadeOutDuration: 180 })).catch(() => {});
  } catch {
    // Native splash is optional in the browser preview.
  }
}

function hideAppSplash() {
  hideNativeSplash();
  if (!els.appSplash || els.appSplash.hidden || els.appSplash.classList.contains("is-hidden")) return;

  els.appSplash.classList.add("is-hidden");
  els.appSplash.setAttribute("aria-hidden", "true");
  window.setTimeout(() => {
    if (els.appSplash) {
      els.appSplash.hidden = true;
    }
  }, 320);
}

function scheduleHideAppSplash(delay = 0) {
  window.setTimeout(hideAppSplash, delay);
}

async function initOfflineSupport() {
  state.native.online = navigator.onLine !== false;
  renderNativeStatus();

  if (isLocalMapProviderDebugOrigin()) {
    await clearLocalServiceWorkerCache();
    state.native.offlineReady = false;
    renderNativeStatus();
  } else if ("serviceWorker" in navigator && location.protocol !== "file:") {
    try {
      const registration = await navigator.serviceWorker.register("sw.js");
      await navigator.serviceWorker.ready;
      state.native.offlineReady = Boolean(registration.active || registration.waiting || registration.installing);
    } catch (error) {
      console.warn("Service worker unavailable", error);
      state.native.offlineReady = false;
    }
    renderNativeStatus();
  }

  window.addEventListener("online", () => setOnlineState(true));
  window.addEventListener("offline", () => setOnlineState(false));

  const network = getNetworkPlugin();
  if (network?.getStatus) {
    try {
      const status = await network.getStatus();
      setOnlineState(Boolean(status.connected), { silent: true });
    } catch {
      // Web previews can expose a partial Network plugin.
    }
  }
  if (network?.addListener) {
    try {
      await network.addListener("networkStatusChange", (status) => {
        setOnlineState(Boolean(status.connected));
      });
    } catch {
      // Native listener is best-effort.
    }
  }
}

async function clearLocalServiceWorkerCache() {
  try {
    const registrations = await navigator.serviceWorker?.getRegistrations?.() ?? [];
    await Promise.all(registrations.map((registration) => registration.unregister()));
    const cacheKeys = await window.caches?.keys?.() ?? [];
    await Promise.all(cacheKeys.map((key) => window.caches.delete(key)));
  } catch (error) {
    console.warn("Local service worker cache cleanup unavailable", error);
  }
}

function setOnlineState(online, options = {}) {
  state.native.online = Boolean(online);
  if (!state.native.online && !options.silent) setStatus("Offline", "offline");
  if (state.native.online && els.statusPill?.classList.contains("is-offline")) setStatus("Prêt", "ready");
  renderNativeStatus();
}

async function syncNativePermissions() {
  await Promise.allSettled([syncGpsPermission(), syncNotificationPermission()]);
  renderNativeStatus();
}

async function syncGpsPermission() {
  const geolocation = getGeolocationPlugin();
  if (geolocation?.checkPermissions) {
    try {
      const result = await geolocation.checkPermissions();
      state.native.gpsPermission = normalizePermissionState(result.location ?? result.coarseLocation);
      return state.native.gpsPermission;
    } catch {
      // Fall through to browser permissions.
    }
  }

  if (navigator.permissions?.query) {
    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      state.native.gpsPermission = normalizePermissionState(result.state);
      result.onchange = () => {
        state.native.gpsPermission = normalizePermissionState(result.state);
        renderNativeStatus();
      };
      return state.native.gpsPermission;
    } catch {
      // Some browsers do not support geolocation in Permissions API.
    }
  }

  state.native.gpsPermission = navigator.geolocation ? "prompt" : "unavailable";
  return state.native.gpsPermission;
}

async function syncNotificationPermission() {
  const notifications = getNotificationPlugin();
  if (notifications?.checkPermissions) {
    try {
      const result = await notifications.checkPermissions();
      state.native.notificationPermission = normalizePermissionState(result.display);
      return state.native.notificationPermission;
    } catch {
      // Fall through to browser notifications.
    }
  }

  if ("Notification" in window) {
    state.native.notificationPermission = normalizePermissionState(Notification.permission);
  } else {
    state.native.notificationPermission = "unavailable";
  }
  return state.native.notificationPermission;
}

async function requestGpsPermission() {
  setStatus("GPS", "loading");
  const geolocation = getGeolocationPlugin();

  try {
    if (state.native.isNative && geolocation?.requestPermissions) {
      const result = await geolocation.requestPermissions({ permissions: ["location"] });
      state.native.gpsPermission = normalizePermissionState(result.location ?? result.coarseLocation);
    }

    const position = await getCurrentPosition();
    applyPositionToSpot(position.coords.latitude, position.coords.longitude, "Ma position");
    state.native.gpsPermission = "granted";
    renderNativeStatus();
    setStatus("GPS actif", "ready");
    loadForecast();
  } catch (error) {
    console.warn("Location permission failed", error);
    await syncGpsPermission();
    setStatus("GPS refusé", "error");
    renderNativeStatus();
  }
}

async function getCurrentPosition() {
  const geolocation = getGeolocationPlugin();
  if (state.native.isNative && geolocation?.getCurrentPosition) {
    return geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 900000,
    });
  }

  if (!navigator.geolocation) {
    throw new Error("Localisation indisponible.");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 900000,
    });
  });
}

function applyPositionToSpot(lat, lon, name = "Ma position") {
  els.latitude.value = Number(lat).toFixed(4);
  els.longitude.value = Number(lon).toFixed(4);
  els.spotPreset.value = String(spots.length - 1);
  state.selectedSpotName = name;
  centerMapOn(Number(els.latitude.value), Number(els.longitude.value));
  renderSpotTools();
  saveSettings();
}

async function requestNotificationPermission() {
  const notifications = getNotificationPlugin();
  setStatus("Notifications", "loading");

  try {
    if (notifications?.requestPermissions) {
      const result = await notifications.requestPermissions();
      state.native.notificationPermission = normalizePermissionState(result.display);
    } else if ("Notification" in window) {
      const result = await Notification.requestPermission();
      state.native.notificationPermission = normalizePermissionState(result);
    } else {
      state.native.notificationPermission = "unavailable";
    }

    state.notificationsEnabled = state.native.notificationPermission === "granted";
    saveSettings();
    renderNativeStatus();

    if (state.notificationsEnabled) {
      await sendTestNotification();
      setStatus("Notifications actives", "ready");
    } else {
      setStatus("Notifications refusées", "warning");
    }
  } catch (error) {
    console.warn("Notification permission failed", error);
    await syncNotificationPermission();
    setStatus("Notifications refusées", "error");
    renderNativeStatus();
  }
}

async function sendTestNotification() {
  const notifications = getNotificationPlugin();
  if (state.native.isNative && notifications?.schedule) {
    await ensureFishingAlertChannel(notifications);
    await notifications.schedule({
      notifications: [{
        id: Math.floor(Date.now() % 2147483647),
        title: "MeteoCatch",
        body: "Les alertes de sortie sont activées.",
        channelId: "fishing-alerts",
        schedule: { at: new Date(Date.now() + 1500) },
      }],
    });
    return;
  }

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("MeteoCatch", { body: "Les alertes de sortie sont activées." });
  }
}

async function ensureFishingAlertChannel(notifications = getNotificationPlugin()) {
  if (!notifications?.createChannel) return;
  try {
    await notifications.createChannel({
      id: "fishing-alerts",
      name: "Alertes pêche",
      description: "Rappels météo et sécurité MeteoCatch",
      importance: 4,
      visibility: 1,
    });
  } catch {
    // iOS and web do not use Android notification channels.
  }
}

async function scheduleSmartFishingAlerts(options = {}) {
  const notifications = getNotificationPlugin();
  const permission = await syncNotificationPermission();
  const nativeSchedulerAvailable = state.native.isNative && notifications?.schedule;

  if (permission !== "granted" || !state.notificationsEnabled) {
    return {
      status: "permission-required",
      scheduled: [],
      message: "Active les notifications pour programmer les alertes.",
    };
  }

  if (!nativeSchedulerAvailable) {
    return {
      status: "unavailable",
      scheduled: [],
      message: "La programmation locale est disponible dans l'app native.",
    };
  }

  const candidates = buildSmartAlertCandidates(options).slice(0, 24);
  await cancelSmartFishingAlerts({ persist: false });

  if (!candidates.length) {
    state.smartAlertSchedule = [];
    saveSettings();
    return {
      status: "empty",
      scheduled: [],
      message: "Aucune alerte exploitable avec les données actuelles.",
    };
  }

  await ensureFishingAlertChannel(notifications);
  await notifications.schedule({
    notifications: candidates.map((candidate) => ({
      id: candidate.id,
      title: candidate.title,
      body: candidate.body,
      channelId: "fishing-alerts",
      schedule: { at: new Date(candidate.scheduledAt) },
      extra: {
        type: candidate.type,
        spotId: candidate.spotId,
        date: candidate.date,
      },
    })),
  });

  state.smartAlertSchedule = candidates.map(({ id, type, title, body, spotId, spotName, date, scheduledAt }) => ({
    id,
    type,
    title,
    body,
    spotId,
    spotName,
    date,
    scheduledAt,
  }));
  saveSettings();

  return {
    status: "scheduled",
    scheduled: state.smartAlertSchedule,
    message: `${state.smartAlertSchedule.length} alertes programmées.`,
  };
}

async function cancelSmartFishingAlerts(options = {}) {
  const notifications = getNotificationPlugin();
  const ids = normalizeSmartAlertSchedule(state.smartAlertSchedule).map((alert) => ({ id: alert.id }));

  if (state.native.isNative && notifications?.cancel && ids.length) {
    try {
      await notifications.cancel({ notifications: ids });
    } catch (error) {
      console.warn("Smart alert cancellation failed", error);
    }
  }

  state.smartAlertSchedule = [];
  if (options.persist !== false) saveSettings();
  return { status: "canceled", canceled: ids.length };
}

async function updateSmartFishingAlerts(options = {}) {
  return scheduleSmartFishingAlerts(options);
}

function buildSmartAlertCandidates(options = {}) {
  const settings = normalizeSmartAlertSettings(options.settings ?? state.smartAlerts);
  const active = getActiveSpot();
  const days = (options.days ?? state.days).slice(0, 10);
  const now = options.now instanceof Date ? options.now : new Date();
  const candidates = [];

  SMART_ALERT_TYPES.forEach((type) => {
    const alertSettings = settings.alerts[type];
    if (!alertSettings?.enabled) return;
    if (SMART_ALERT_CATALOG[type]?.proRequired && !canUseFeature(smartAlertFeature(type))) return;
    const builder = {
      "rising-tide": risingTideAlertCandidates,
      "best-solunar": bestSolunarAlertCandidates,
      "wind-drop": windDropAlertCandidates,
      "species-activity": speciesActivityAlertCandidates,
      "morning-report": morningReportAlertCandidates,
    }[type];
    if (!builder) return;
    candidates.push(...builder(days, alertSettings, active, now));
  });

  return candidates
    .filter((candidate) => candidate && !isQuietTime(candidate.scheduledAt, settings.quietHours))
    .sort((a, b) => Date.parse(a.scheduledAt) - Date.parse(b.scheduledAt))
    .filter(limitSmartAlertsPerDay(settings.maxPerDay));
}

function risingTideAlertCandidates(days, alertSettings, spot, now) {
  if (!isSeaMode()) return [];
  return days.flatMap((day) => {
    const rows = tideRows(day).filter((row) => rowTideTrend(row, tideRows(day)) === "rising");
    const row = rows.find((candidate) => forecastDate(candidate.time) > now);
    if (!row) return [];
    return smartAlertCandidate({
      type: "rising-tide",
      spot,
      day,
      at: addMinutes(forecastDate(row.time), -alertSettings.leadMinutes),
      title: "Marée montante bientôt",
      body: `${spot.name}: marée montante vers ${row.hour}, hauteur ${formatTideHeight(row.seaLevel)}.`,
    });
  });
}

function bestSolunarAlertCandidates(days, alertSettings, spot, now) {
  return days.flatMap((day) => {
    const best = day.bestWindow;
    const peakRow = day.rows?.find((row) => row.hour === best?.peakHour);
    const peakDate = peakRow ? forecastDate(peakRow.time) : null;
    if (!peakDate || peakDate <= now) return [];
    return smartAlertCandidate({
      type: "best-solunar",
      spot,
      day,
      at: addMinutes(peakDate, -alertSettings.leadMinutes),
      title: "Meilleur créneau en approche",
      body: `${spot.name}: ${best.label}, score ${best.score}/100 pour ${getFishLabel(normalizeActivityFish(state.activityFish))}.`,
    });
  });
}

function windDropAlertCandidates(days, alertSettings, spot, now) {
  return days.flatMap((day) => {
    const rows = day.rows ?? [];
    const row = rows.find((candidate, index) => {
      const previous = rows[index - 1];
      return forecastDate(candidate.time) > now
        && isValidNumber(candidate.windSpeed)
        && candidate.windSpeed <= 10
        && (!previous || (previous.windSpeed ?? 0) >= 14);
    });
    if (!row) return [];
    return smartAlertCandidate({
      type: "wind-drop",
      spot,
      day,
      at: addMinutes(forecastDate(row.time), -alertSettings.leadMinutes),
      title: "Le vent baisse",
      body: `${spot.name}: vent prévu ${formatNumber(row.windSpeed, 0)} kt vers ${row.hour}.`,
    });
  });
}

function speciesActivityAlertCandidates(days, alertSettings, spot, now) {
  const fish = normalizeActivityFish(state.activityFish);
  return days.flatMap((day) => {
    const row = activityRows(day, fish)
      .find((candidate) => candidate.score >= 72 && forecastDate(candidate.time) > now);
    if (!row) return [];
    return smartAlertCandidate({
      type: "species-activity",
      spot,
      day,
      at: addMinutes(forecastDate(row.time), -alertSettings.leadMinutes),
      title: `${getFishLabel(fish)} actif`,
      body: `${spot.name}: activité ${row.score}/100 vers ${row.hour}.`,
    });
  });
}

function morningReportAlertCandidates(days, alertSettings, spot, now) {
  const today = now.toISOString().slice(0, 10);
  return days.flatMap((day) => {
    if (day.date < today) return [];
    const at = forecastDate(`${day.date}T${alertSettings.deliveryTime ?? "07:00"}`);
    if (at <= now) return [];
    const summary = day.planningSummary ?? dailyPlanningSummary(day);
    return smartAlertCandidate({
      type: "morning-report",
      spot,
      day,
      at,
      title: "Rapport pêche du matin",
      body: `${spot.name}: ${summary.bestWindow.label}, ${summary.weatherRisk.label.toLowerCase()}, score ${summary.score}/100.`,
    });
  });
}

function smartAlertCandidate({ type, spot, day, at, title, body }) {
  if (!(at instanceof Date) || Number.isNaN(at.getTime()) || at <= new Date()) return null;
  return {
    id: smartAlertId(type, spot.id ?? spot.name, day.date, at),
    type,
    title,
    body,
    spotId: spot.id ?? spot.name,
    spotName: spot.name,
    date: day.date,
    scheduledAt: at.toISOString(),
  };
}

function smartAlertId(type, spotId, date, at) {
  const key = `${type}:${spotId}:${date}:${at.toISOString().slice(11, 16)}`;
  let hash = 0;
  for (let index = 0; index < key.length; index += 1) {
    hash = ((hash << 5) - hash + key.charCodeAt(index)) | 0;
  }
  return 100000 + Math.abs(hash % 1900000000);
}

function limitSmartAlertsPerDay(maxPerDay) {
  const counts = new Map();
  return (candidate) => {
    const key = `${candidate.spotId}:${candidate.scheduledAt.slice(0, 10)}`;
    const count = counts.get(key) ?? 0;
    if (count >= maxPerDay) return false;
    counts.set(key, count + 1);
    return true;
  };
}

function isQuietTime(isoTime, quietHours) {
  const date = new Date(isoTime);
  if (Number.isNaN(date.getTime())) return false;
  const minute = date.getHours() * 60 + date.getMinutes();
  const start = minutesFromClockOrNull(quietHours?.start) ?? 21 * 60;
  const end = minutesFromClockOrNull(quietHours?.end) ?? 7 * 60;
  return start <= end
    ? minute >= start && minute < end
    : minute >= start || minute < end;
}

function forecastDate(value) {
  if (!value) return new Date(NaN);
  return new Date(String(value).length === 16 ? `${value}:00` : value);
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

function normalizePermissionState(value) {
  if (value === "granted" || value === "denied" || value === "prompt" || value === "prompt-with-rationale") {
    return value === "prompt-with-rationale" ? "prompt" : value;
  }
  return value ? String(value) : "prompt";
}

function permissionLabel(value) {
  if (value === "granted") return "Autorisé";
  if (value === "denied") return "Refusé";
  if (value === "unavailable") return "Indisponible";
  return "À configurer";
}

function renderNativeStatus() {
  const gpsLabel = t(permissionLabel(state.native.gpsPermission));
  const notificationLabel = state.notificationsEnabled
    ? t("Actives")
    : t(permissionLabel(state.native.notificationPermission));
  const offlineLabel = state.native.offlineReady ? t("Écran principal disponible hors ligne") : t("Cache en préparation");
  const privacyLabel = state.privacyAccepted ? t("Validée") : t("À valider");
  const onlineLabel = state.native.online ? t("En ligne") : t("Offline");

  setText(els.nativeGpsStatus, gpsLabel);
  setText(els.onboardingGpsStatus, gpsLabel);
  setText(els.nativeNotificationStatus, notificationLabel);
  setText(els.onboardingNotificationStatus, notificationLabel);
  setText(els.nativeOfflineStatus, offlineLabel);
  setText(els.onboardingOfflineStatus, offlineLabel);
  setText(els.nativePrivacyStatus, privacyLabel);

  [els.nativeOnlineBadge, els.onboardingOnlineBadge].forEach((badge) => {
    if (!badge) return;
    badge.textContent = onlineLabel;
    badge.classList.toggle("is-offline", !state.native.online);
  });

  togglePermissionButton(els.nativeGpsButton, state.native.gpsPermission === "granted", t("Autorisé"), t("Autoriser"));
  togglePermissionButton(els.onboardingGpsButton, state.native.gpsPermission === "granted", t("Autorisé"), t("Autoriser"));
  togglePermissionButton(els.nativeNotificationButton, state.notificationsEnabled, t("Actives"), t("Activer"));
  togglePermissionButton(els.onboardingNotificationButton, state.notificationsEnabled, t("Actives"), t("Activer"));
  togglePermissionButton(els.nativePrivacyButton, state.privacyAccepted, t("Validée"), t("Valider"));
}

function togglePermissionButton(button, done, doneLabel, todoLabel) {
  if (!button) return;
  button.textContent = done ? doneLabel : todoLabel;
  button.disabled = Boolean(done);
}

function setText(element, text) {
  if (element) element.textContent = text;
}

function maybeShowOnboarding() {
  if (!state.onboardingCompleted) {
    showOnboarding();
  }
}

function showOnboarding(options = {}) {
  if (!els.onboardingScreen) return;
  if (state.onboardingCompleted && !options.force) return;
  els.onboardingScreen.hidden = false;
  document.body.classList.add("is-onboarding-open");
  renderNativeStatus();
}

function hideOnboarding() {
  if (!els.onboardingScreen) return;
  els.onboardingScreen.hidden = true;
  document.body.classList.remove("is-onboarding-open");
}

function completeOnboarding(options = {}) {
  state.onboardingCompleted = true;
  if (options.privacyAccepted) state.privacyAccepted = true;
  saveSettings();
  hideOnboarding();
  renderNativeStatus();
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
    els.mapTitle.textContent = t(config.mapTitle);
  }

  if (els.marineOverlayControl) {
    els.marineOverlayControl.hidden = !isSeaMode();
  }

  if (els.mapSensitiveButton) {
    els.mapSensitiveButton.hidden = !isSeaMode();
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
    els.mapCoastalToggle,
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

  if (state.activeChart === "pressure") {
    state.activeChart = "cloud";
  }

  if (!isSeaMode()) {
    state.marineOverlayMode = "none";
    if (state.activeChart === "wave" || state.activeChart === "current") {
      state.activeChart = "cloud";
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
  state.osmSpotsRequestId += 1;
  state.osmSpotsBlockedUntil = 0;
  state.osmSpotsLoading = false;
  state.activeFishFilters = normalizeFishFilters(["all"]);
  state.activityFish = normalizeActivityFish(state.activityFish);
  if (!isSeaMode()) state.activeChart = "cloud";
  state.fishFilterOpen = false;
  populateActivityFish();
  populateCatchSpecies();
  populatePreferenceSpecies();
  populateRiggingTechniques();
  state.riggingDirty = false;
  applyWaterModeUI();
  applyDefaultWeatherChart();
  renderSpotTools();
  renderPreferenceControls();
  saveSettings();

  if (options.load !== false) {
    loadForecast();
  } else if (state.days.length) {
    safeRenderAll();
  }

  state.osmSpotsLastFetchedBounds = null;
  renderMapPins();
  scheduleOverpassSpotFetch({ force: true });
}

function normalizeMobileView(view) {
  if (view === "forecast") return "weather";
  if (view === "tides" || view === "astro") return "weather";
  if (view === "rigging" || view === "preferences" || view === "settings") return "more";
  return MOBILE_VIEWS.includes(view) ? view : "map";
}

function normalizeWeatherSubtab(tab) {
  if (tab === "tides") return "sun";
  return WEATHER_SUBTABS.includes(tab) ? tab : "overview";
}

function normalizeAtmosphereChart(chart) {
  return ATMOSPHERE_CHARTS.includes(chart) ? chart : "cloud";
}

function weatherSubtabFromMobileView(view) {
  if (view === "tides") return "sun";
  if (view === "astro") return "sun";
  return "overview";
}

function applyDefaultWeatherChart() {
  if (!isSeaMode() || state.activeWeatherSubtab !== "overview") return;
  if (state.activeChart === "current") return;
  state.activeChart = "current";
  document.querySelectorAll("[data-chart]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.chart === state.activeChart);
  });
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
  const standaloneView = state.activeMobileView === "more";
  document.documentElement.dataset.currentMobileView = state.activeMobileView;
  document.documentElement.dataset.currentWeatherSubtab = state.activeWeatherSubtab;

  els.mobileTabButtons.forEach((button) => {
    const active = normalizeMobileView(button.dataset.mobileTab) === state.activeMobileView;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });

  els.mobileViewSections.forEach((section) => {
    const preferenceSection = sectionSupportsMobileView(section, "more");
    const supportsActiveView = sectionSupportsMobileView(section, state.activeMobileView);
    section.hidden = standaloneView ? !supportsActiveView : preferenceSection || (mobile && !supportsActiveView);
  });

  applyWeatherSubviewUI();
}

function applyWeatherSubviewUI() {
  state.activeWeatherSubtab = normalizeWeatherSubtab(state.activeWeatherSubtab);

  els.weatherSubtabButtons.forEach((button) => {
    const active = button.dataset.weatherTab === state.activeWeatherSubtab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
    button.setAttribute("tabindex", active ? "0" : "-1");
  });

  const weatherVisible = state.activeMobileView === "weather" || !isMobileLayout();
  if (!weatherVisible) return;

  els.weatherSubviewSections.forEach((section) => {
    section.hidden = !sectionSupportsWeatherSubtab(section, state.activeWeatherSubtab);
  });
}

function sectionSupportsWeatherSubtab(section, tab) {
  return String(section.dataset.weatherSubview ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .includes(tab);
}

function scrollAppToTop(options = {}) {
  const behavior = options.behavior ?? "smooth";
  els.main?.scrollTo({ top: 0, behavior });
  window.scrollTo({ top: 0, behavior });
}

function refreshVisibleView() {
  window.requestAnimationFrame(() => {
    state.mapProvider?.invalidateSize?.();
    updateMapScale();
    drawCompass();
    renderActivity(getSelectedDay());
    renderDayTimeline(getSelectedDay());
    renderTides(getSelectedDay());
    renderChart();
    renderAtmosphereChart();
    renderAstro(getSelectedDay());
  });
}

function setMobileView(view) {
  const requestedView = view;
  if (requestedView === "tides" || requestedView === "astro") {
    state.activeWeatherSubtab = weatherSubtabFromMobileView(requestedView);
  }
  state.activeMobileView = normalizeMobileView(view);
  applyDefaultWeatherChart();
  applyMobileNavigationUI();
  if (isMobileLayout() || state.activeMobileView === "more") {
    scrollAppToTop();
  }
  refreshVisibleView();
  saveSettings();
}

function setWeatherSubtab(tab) {
  state.activeWeatherSubtab = normalizeWeatherSubtab(tab);
  state.activeMobileView = "weather";
  applyDefaultWeatherChart();
  applyMobileNavigationUI();
  if (isMobileLayout()) {
    scrollAppToTop();
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

function applyMapLayerChange(callback, { closeSheet = true } = {}) {
  callback();
  if (closeSheet) setMapLayerOpen(false);
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

function setFavoritesOverlayOpen(open) {
  state.favoritesOpen = Boolean(open);
  updateFavoritesOverlay();
}

function updateFavoritesOverlay() {
  if (els.mapFavoritesButton) {
    els.mapFavoritesButton.classList.toggle("is-active", state.favoritesOpen);
    els.mapFavoritesButton.setAttribute("aria-expanded", String(state.favoritesOpen));
  }

  if (els.mapFavoritesOverlay) {
    els.mapFavoritesOverlay.classList.toggle("is-open", state.favoritesOpen);
    els.mapFavoritesOverlay.setAttribute("aria-hidden", String(!state.favoritesOpen));
    els.mapFavoritesOverlay.inert = !state.favoritesOpen;
  }
  scheduleNativeMapInteractionRegionSync();
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
    state.mapProvider?.invalidateSize?.();
    updateMapScale();
    scheduleNativeMapInteractionRegionSync();
  });
}

function updateMapLayerPanel() {
  if (els.mapLayersButton) {
    els.mapLayersButton.classList.toggle("is-active", state.mapLayerOpen);
    els.mapLayersButton.setAttribute("aria-expanded", String(state.mapLayerOpen));
    els.mapLayersButton.classList.toggle("is-loading", state.osmSpotsLoading);
    els.mapLayersButton.setAttribute("aria-busy", String(state.osmSpotsLoading));
  }

  if (els.mapLayerSheet) {
    els.mapLayerSheet.classList.toggle("is-open", state.mapLayerOpen);
    els.mapLayerSheet.setAttribute("aria-hidden", String(!state.mapLayerOpen));
    els.mapLayerSheet.inert = !state.mapLayerOpen;
  }

  if (els.mapLayerBackdrop) {
    els.mapLayerBackdrop.hidden = !state.mapLayerOpen;
  }
  scheduleNativeMapInteractionRegionSync();
}

function updateOverpassLoadingIndicator() {
  if (!els.mapLayersButton) return;
  els.mapLayersButton.classList.toggle("is-loading", state.osmSpotsLoading);
  els.mapLayersButton.setAttribute("aria-busy", String(state.osmSpotsLoading));
}

function showToast(message, options = {}) {
  if (!message || !document.body) return;

  const toast = document.createElement("div");
  toast.className = "app-toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  document.body.append(toast);

  window.requestAnimationFrame(() => toast.classList.add("is-visible"));
  window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => toast.remove(), 220);
  }, options.duration ?? 3600);
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
    els.spotPanelButton.textContent = state.spotPanelOpen ? t("Masquer") : t("Changer spot");
  }

  if (els.spotForm) {
    els.spotForm.setAttribute("aria-hidden", String(!state.spotPanelOpen));
    els.spotForm.inert = !state.spotPanelOpen;
    els.spotForm.toggleAttribute("inert", !state.spotPanelOpen);
  }
  scheduleNativeMapInteractionRegionSync();
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

  if (isMapOverlayTarget(event.target)) return;

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
    if (!isMobileLayout()) {
      els.spotNameInput.focus();
      els.spotNameInput.select();
    }
  });
}

function renderSpotNameSheet() {
  const pending = state.pendingSpot;
  document.body.classList.toggle("is-spot-name-open", Boolean(pending));
  els.spotMap.classList.toggle("has-name-sheet", Boolean(pending));
  els.spotNameSheet.classList.toggle("is-open", Boolean(pending));
  els.spotNameSheet.setAttribute("aria-hidden", pending ? "false" : "true");
  els.spotNameSheet.inert = !pending;
  scheduleNativeMapInteractionRegionSync();

  if (!pending) return;

  els.spotNameCoords.textContent = formatCoordinates(pending.lat, pending.lon);
  if (document.activeElement !== els.spotNameInput) {
    els.spotNameInput.value = pending.name;
  }
}

function closeSpotNameSheet() {
  els.spotNameInput.blur();
  state.pendingSpot = null;
  renderSpotTools();
}

function confirmPendingSpot(options = {}) {
  const pending = state.pendingSpot;
  if (!pending) return;

  const name = sanitizeSpotName(els.spotNameInput.value) || getCustomSpotName(pending.lat, pending.lon);
  els.spotNameInput.blur();
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
  renderSpotSearchResults();
  renderNearbySpotResults();
  renderFishFilterControls();
  renderMapTiles();
  renderMapMarkers();
  renderFavorites();
  updateFavoriteButton();
  updateMapZoomControls();
  updateMapScale();
  updateNauticalOverlay();
  updateCoastalOverlay();
  updateBathymetryOverlay();
  scheduleBathymetryFocusRefresh();
  renderKnownFishingMarkers();
  updateKnownFishingOverlay();
  renderRegulationZones();
  updateRegulationOverlay();
  renderAnchorWatch();
  renderSafetyStatus();
  renderSpotResolution();
  updateMapLayerPanel();
  updateSpotPanel();
  renderSpotNameSheet();
  scheduleOverpassSpotFetch();

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

  if (!state.mapProvider || !state.nauticalLayer) return;

  state.mapProvider.setLayerVisible(state.nauticalLayer, nauticalEnabled);

  updateMapAttribution();
}

function updateCoastalOverlay() {
  const enabled = state.coastalEnabled && isSeaMode();

  if (els.mapCoastalToggle) {
    els.mapCoastalToggle.classList.toggle("is-active", enabled);
    els.mapCoastalToggle.setAttribute("aria-pressed", String(enabled));
  }

  if (!state.mapProvider || !state.coastalLayer) return;

  state.mapProvider.setLayerVisible(state.coastalLayer, enabled);

  updateMapAttribution();
}

function updateBathymetryOverlay() {
  const enabled = state.bathymetryEnabled && isSeaMode();

  if (els.mapBathymetryToggle) {
    els.mapBathymetryToggle.classList.toggle("is-active", enabled);
    els.mapBathymetryToggle.setAttribute("aria-pressed", String(enabled));
  }

  if (!state.mapProvider || !state.bathymetryLayer) return;

  markMapProviderMountStep("bathymetry-tile-visible");
  setProviderLayerVisible(state.emodnetBathymetryLayer, enabled, "bathymetry-tile");
  markMapProviderMountStep("bathymetry-markers-visible");
  setProviderLayerVisible(state.bathymetryLayer, enabled, "bathymetry-markers");

  updateMapAttribution();
}

function markMapProviderMountStep(step) {
  if ("mapProviderMountStep" in document.documentElement.dataset) {
    document.documentElement.dataset.mapProviderMountStep = step;
  }
}

function setProviderLayerVisible(layer, enabled, label) {
  if (!state.mapProvider || !layer) return false;
  const clearLayerError = () => {
    if (document.documentElement.dataset.mapProviderLayerError?.startsWith(`${label}:`)) {
      delete document.documentElement.dataset.mapProviderLayerError;
    }
  };
  const recordLayerError = (error) => {
    console.warn(`Map layer ${label} failed to update.`, error);
    document.documentElement.dataset.mapProviderLayerError = `${label}: ${String(error?.message ?? error ?? "layer failed").slice(0, 120)}`;
  };
  try {
    const result = state.mapProvider.setLayerVisible(layer, enabled);
    if (result && typeof result.then === "function") {
      result.then(clearLayerError).catch(recordLayerError);
    } else {
      clearLayerError();
    }
    return true;
  } catch (error) {
    recordLayerError(error);
    return false;
  }
}

function updateMapAttribution() {
  if (!els.mapAttribution) return;

  const credits = ["© OpenStreetMap"];
  if (state.nauticalEnabled && isSeaMode()) credits.push("OpenSeaMap");
  if (state.coastalEnabled && isSeaMode()) credits.push("EMODnet littoral");
  if (state.bathymetryEnabled && isSeaMode()) credits.push("EMODnet Bathymetry");
  els.mapAttribution.textContent = credits.join(" · ");
}

function updateKnownFishingOverlay() {
  if (els.mapFishingToggle) {
    els.mapFishingToggle.classList.toggle("is-active", state.knownFishingEnabled);
    els.mapFishingToggle.setAttribute("aria-pressed", String(state.knownFishingEnabled));
  }

  if (els.fishFilterControl) {
    els.fishFilterControl.classList.toggle("is-hidden", !state.knownFishingEnabled);
  }

  if (!state.mapProvider || !state.knownFishingLayer) return;

  state.mapProvider.setLayerVisible(state.knownFishingLayer, state.knownFishingEnabled);
}

function updateRegulationOverlay() {
  const enabled = state.regulationEnabled && isSeaMode();

  if (els.mapRegulationToggle) {
    els.mapRegulationToggle.classList.toggle("is-active", enabled);
    els.mapRegulationToggle.setAttribute("aria-pressed", String(enabled));
  }

  if (els.mapSensitiveButton) {
    els.mapSensitiveButton.classList.toggle("is-active", enabled);
    els.mapSensitiveButton.setAttribute("aria-pressed", String(enabled));
    els.mapSensitiveButton.hidden = !isSeaMode();
  }

  if (!state.mapProvider || !state.regulationLayer) return;

  state.mapProvider.setLayerVisible(state.regulationLayer, enabled);
}

function renderBathymetryLayer() {
  if (!state.bathymetryLayer || !state.mapProvider) return;

  state.mapProvider.clearLayer(state.bathymetryLayer);
  if (!state.bathymetryEnabled || !isSeaMode()) return;

  renderBathymetryFocusLabel();
}

function renderBathymetryFocusLabel() {
  const center = getMapFocusPoint();
  const estimate = currentBathymetryFocusEstimate(center);
  if (!estimate) return;
  const isEmodnet = estimate.source === "emodnet";
  const statusClass = isEmodnet ? "" : ` is-${estimate.source}`;
  const depthLabel = isValidNumber(estimate.depth) ? `~${formatNumber(estimate.depth, 0)} m` : "--";
  const detail = isEmodnet
    ? "Profondeur moyenne EMODnet au centre de la carte"
    : estimate.source === "unavailable"
      ? "Profondeur EMODnet indisponible pour ce point"
      : "Chargement de la profondeur EMODnet au centre de la carte";

  state.mapProvider.addMarker(state.bathymetryLayer, {
    lat: center.lat,
    lon: center.lon,
    icon: state.mapProvider.createDivIcon({
      className: `bathymetry-label bathymetry-focus-label${statusClass}`,
      html: `<span title="${escapeHtml(detail)}">Fond EMODnet</span><strong>${depthLabel}</strong>`,
      iconSize: [104, 36],
      iconAnchor: [52, 44],
      tooltipAnchor: [0, -42],
    }),
    interactive: false,
    title: detail,
    zIndexOffset: 175,
  });
}

function scheduleBathymetryFocusRefresh() {
  window.clearTimeout(state.bathymetryPointTimer);
  renderBathymetryLayer();

  if (!state.bathymetryEnabled || !isSeaMode() || !state.mapProvider) return;
  state.bathymetryPointTimer = window.setTimeout(loadBathymetryFocusDepth, 360);
}

async function loadBathymetryFocusDepth() {
  if (!state.bathymetryEnabled || !isSeaMode() || !state.mapProvider) return;

  const point = getMapFocusPoint();
  const key = bathymetryPointKey(point);
  const cached = state.bathymetryPointCache.get(key);
  if (cached) {
    state.bathymetryFocusDepth = cached;
    renderBathymetryLayer();
    return;
  }

  const requestId = state.bathymetryPointRequestId + 1;
  state.bathymetryPointRequestId = requestId;

  try {
    const payload = await fetchJson(buildBathymetryPointUrl(point));
    if (requestId !== state.bathymetryPointRequestId) return;
    const estimate = parseBathymetryPoint(payload, point, key);
    if (!estimate) {
      state.bathymetryFocusDepth = unavailableBathymetryPoint(point, key);
      renderBathymetryLayer();
      return;
    }
    state.bathymetryPointCache.set(key, estimate);
    state.bathymetryFocusDepth = estimate;
    renderBathymetryLayer();
  } catch (error) {
    if (requestId !== state.bathymetryPointRequestId) return;
    state.bathymetryFocusDepth = unavailableBathymetryPoint(point, key);
    renderBathymetryLayer();
    console.info("Bathymétrie EMODnet indisponible pour ce point.", error);
  }
}

function buildBathymetryPointUrl(point) {
  const url = new URL(BATHYMETRY_REST);
  url.searchParams.set("geom", `POINT(${point.lon.toFixed(5)} ${point.lat.toFixed(5)})`);
  return url;
}

function parseBathymetryPoint(payload, point, key) {
  const rawDepth = payload?.smoothed ?? payload?.avg ?? payload?.min ?? payload?.max;
  if (!isValidNumber(rawDepth)) return null;

  return {
    key,
    lat: point.lat,
    lon: point.lon,
    depth: Math.abs(rawDepth),
    source: "emodnet",
  };
}

function currentBathymetryFocusEstimate(center) {
  const key = bathymetryPointKey(center);
  if (state.bathymetryFocusDepth?.key === key) return state.bathymetryFocusDepth;

  const cached = state.bathymetryPointCache.get(key);
  if (cached) return cached;

  return {
    key,
    lat: center.lat,
    lon: center.lon,
    depth: null,
    source: "loading",
  };
}

function unavailableBathymetryPoint(point, key) {
  return {
    key,
    lat: point.lat,
    lon: point.lon,
    depth: null,
    source: "unavailable",
  };
}

function bathymetryPointKey(point) {
  return `${point.lat.toFixed(4)},${point.lon.toFixed(4)}`;
}

function renderRegulationZones() {
  if (!state.regulationLayer || !state.mapProvider) return;

  state.mapProvider.clearLayer(state.regulationLayer);
  if (!state.regulationEnabled || !isSeaMode()) return;

  regulationZones.forEach((zone) => {
    state.mapProvider.addPolygon(state.regulationLayer, {
      coordinates: zone.coordinates,
      color: zone.level === "danger" ? colors.gust : colors.wind,
      fillColor: zone.level === "danger" ? colors.gust : colors.wind,
      fillOpacity: zone.level === "danger" ? 0.18 : 0.12,
      weight: 2,
      dashArray: zone.level === "danger" ? "" : "7 6",
      interactive: true,
      tooltip: {
        content: zone.name,
        options: {
          direction: "top",
          opacity: 0.96,
          sticky: true,
        },
      },
      popup: `
        <strong>${escapeHtml(zone.name)}</strong>
        <span>${escapeHtml(zone.area)}</span>
        <small>${zone.level === "danger" ? "Alerte réglementation" : "Vigilance réglementation"}</small>
        <em>${escapeHtml(zone.rule)}</em>
      `,
    });
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
  let title = t("Sécurité");
  let detail = isSeaMode()
    ? t("Hors zone sensible connue autour de ce spot.")
    : t("Zones marines masquées en eau douce.");
  let mode = "ready";

  if (regulationStatus?.inside) {
    title = t("Zone sensible");
    detail = `${regulationStatus.zone.name}. ${regulationStatus.zone.rule}`;
    mode = regulationStatus.zone.level === "danger" ? "alert" : "warn";
  } else if (regulationStatus?.near) {
    title = t("Zone proche");
    detail = `${formatScaleDistance(regulationStatus.distance)} ${t("de")} ${regulationStatus.zone.name}. ${t("Vérifier avant pêche.")}`;
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

  if (!state.anchorLayer || !state.mapProvider) return;

  state.mapProvider.clearLayer(state.anchorLayer);
  if (!state.anchorWatch.anchor) return;

  state.mapProvider.addCircle(state.anchorLayer, {
    lat: state.anchorWatch.anchor.lat,
    lon: state.anchorWatch.anchor.lon,
    radius: ANCHOR_DRIFT_LIMIT_METERS,
    color: state.anchorWatch.status === "alert" ? colors.gust : colors.current,
    fillColor: state.anchorWatch.status === "alert" ? colors.gust : colors.current,
    fillOpacity: 0.12,
    weight: 2,
  });

  state.mapProvider.addMarker(state.anchorLayer, {
    lat: state.anchorWatch.anchor.lat,
    lon: state.anchorWatch.anchor.lon,
    icon: state.mapProvider.createDivIcon({
      className: "anchor-watch-marker",
      html: anchorIcon(),
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    }),
    keyboard: false,
    title: "Ancre",
    tooltip: {
      content: "Ancre",
      options: { direction: "top", offset: [0, -12], opacity: 0.96 },
    },
  });

  if (state.anchorWatch.position && state.anchorWatch.drift > 2) {
    state.mapProvider.addPolyline(state.anchorLayer, {
      coordinates: [
        [state.anchorWatch.anchor.lat, state.anchorWatch.anchor.lon],
        [state.anchorWatch.position.lat, state.anchorWatch.position.lon],
      ],
      color: state.anchorWatch.status === "alert" ? colors.gust : colors.current,
      dashArray: "5 5",
      weight: 2,
    });
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
  sendAnchorNotification();
}

async function sendAnchorNotification() {
  if (!state.notificationsEnabled) return;
  const notifications = getNotificationPlugin();
  if (!state.native.isNative || !notifications?.schedule) return;
  try {
    await notifications.schedule({
      notifications: [{
        id: Math.floor((Date.now() + 31) % 2147483647),
        title: "Alerte ancre",
        body: "Le bateau semble dériver au-delà du rayon configuré.",
        channelId: "fishing-alerts",
        schedule: { at: new Date(Date.now() + 500) },
      }],
    });
  } catch {
    // The vibration and sound remain as local fallbacks.
  }
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
  return isSeaMode() && state.marineOverlayMode !== "none" && Boolean(state.mapProvider && state.marineOverlayLayer);
}

function renderMarineOverlay() {
  updateMarineOverlayControls();
  if (!state.marineOverlayLayer || !state.mapProvider) return;

  state.mapProvider.clearLayer(state.marineOverlayLayer);
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
      drawMarineOverlayMarkers([]);
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
      const key = `${entry.lat.toFixed(4)},${entry.lon.toFixed(4)}`;
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
  url.searchParams.set("forecast_days", "10");
  url.searchParams.set("cell_selection", "sea");
  return url;
}

function regionalMarineSamplePoints() {
  const center = state.mapProvider?.getCenter?.() ?? { lat: getActiveSpot().lat, lon: getActiveSpot().lon };
  const bounds = state.mapProvider?.getBounds?.();
  const rawLatSpan = bounds ? Math.abs(bounds.north - bounds.south) : 0.55;
  const rawLonSpan = bounds ? Math.abs(bounds.east - bounds.west) : 0.75;
  const zoom = state.mapProvider?.getZoom?.() ?? state.mapZoom;
  const minSpan = zoom >= 16 ? 0 : zoom >= 13 ? 0.05 : 0.18;
  const latSpan = Math.min(Math.max(rawLatSpan || 0.002, minSpan), 2.4);
  const lonSpan = Math.min(Math.max(rawLonSpan || 0.002, minSpan), 3.2);
  const rows = zoom >= 16 || isMobileLayout() ? 3 : 4;
  const cols = zoom >= 16 || isMobileLayout() ? 3 : 4;
  const samples = [];
  const seen = new Set();

  function pushSample(lat, lon) {
    if (!isValidNumber(lat) || !isValidNumber(lon)) return;
    const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
    if (seen.has(key)) return;
    seen.add(key);
    samples.push({ lat, lon });
  }

  pushSample(center.lat, center.lon);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const lat = center.lat + latSpan * (0.5 - (row + 0.5) / rows);
      const lon = center.lon + lonSpan * ((col + 0.5) / cols - 0.5);
      pushSample(lat, lon);
    }
  }

  return samples;
}

function regionalMarineCacheKey(samples) {
  return samples.map((sample) => `${sample.lat.toFixed(4)},${sample.lon.toFixed(4)}`).join("|");
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
      depthCurrent: null,
      depthDirection: null,
      depthSource: "unavailable",
      waveHeight,
      waveDirection,
    };
  });

  return {
    lat: sample?.lat ?? payload.latitude,
    lon: sample?.lon ?? payload.longitude,
    sourceLat: payload.latitude ?? null,
    sourceLon: payload.longitude ?? null,
    days,
  };
}

function drawMarineOverlayMarkers(data) {
  if (!state.marineOverlayLayer || !state.mapProvider || !canShowMarineOverlay()) return;

  state.mapProvider.clearLayer(state.marineOverlayLayer);
  const day = getSelectedDay();
  const selectedDate = day?.date ?? state.selectedDate;
  let markerCount = 0;

  data.forEach((point) => {
    const dayData = point.days[selectedDate] ?? Object.values(point.days)[0];
    const metric = marineOverlayMetric(dayData);
    if (!metric || !isValidNumber(metric.value) || !isValidNumber(metric.direction)) return;

    state.mapProvider.addMarker(state.marineOverlayLayer, {
      lat: point.lat,
      lon: point.lon,
      icon: state.mapProvider.createDivIcon({
        className: `marine-overlay-icon marine-overlay-${state.marineOverlayMode}`,
        html: marineOverlayMarkerHtml(metric),
        iconSize: [84, 68],
        iconAnchor: [42, 34],
        tooltipAnchor: [0, -30],
      }),
      keyboard: false,
      interactive: false,
      zIndexOffset: 180,
      tooltip: {
        content: metric.tooltip,
        options: {
          direction: "top",
          offset: [0, -18],
          opacity: 0.96,
          sticky: true,
        },
      },
    });
    markerCount += 1;
  });

  if (!markerCount) {
    drawFocusedMarineOverlayMarker();
  }
}

function marineOverlayMetric(dayData) {
  if (!dayData) return null;
  const surfaceCurrent = dayData.surfaceCurrent;
  const currentDirection = dayData.currentDirection ?? dayData.surfaceCurrentDirection;
  const depthCurrent = dayData.depthSource === "copernicus" ? dayData.depthCurrent : null;
  const depthDirection = dayData.depthSource === "copernicus" ? dayData.depthDirection : null;
  const waveHeight = dayData.waveHeight ?? dayData.waveAvg;

  if (state.marineOverlayMode === "depth") {
    return {
      value: depthCurrent,
      direction: depthDirection,
      label: `${formatNumber(depthCurrent, 1)} kt`,
      tooltip: `Courant ${state.depth} m · ${formatNumber(depthCurrent, 1)} kt vers ${compassLabel(depthDirection)}`,
    };
  }

  if (state.marineOverlayMode === "wave") {
    return {
      value: waveHeight,
      direction: reverseDirection(dayData.waveDirection),
      label: `${formatNumber(waveHeight, 1)} m`,
      tooltip: `Houle ${formatNumber(waveHeight, 1)} m · de ${compassLabel(dayData.waveDirection)}`,
    };
  }

  if (state.marineOverlayMode === "surface") {
    return {
      value: surfaceCurrent,
      direction: currentDirection,
      label: `${formatNumber(surfaceCurrent, 1)} kt`,
      tooltip: `Courant surface · ${formatNumber(surfaceCurrent, 1)} kt vers ${compassLabel(currentDirection)}`,
    };
  }

  return null;
}

function drawFocusedMarineOverlayMarker() {
  const metric = marineOverlayMetric(getSelectedDay());
  if (!metric || !isValidNumber(metric.value) || !isValidNumber(metric.direction)) return;

  const point = getMapFocusPoint();
  state.mapProvider.addMarker(state.marineOverlayLayer, {
    lat: point.lat,
    lon: point.lon,
    icon: state.mapProvider.createDivIcon({
      className: `marine-overlay-icon marine-overlay-${state.marineOverlayMode} marine-overlay-focus`,
      html: marineOverlayMarkerHtml(metric),
      iconSize: [92, 74],
      iconAnchor: [46, 37],
      tooltipAnchor: [0, -34],
    }),
    keyboard: false,
    interactive: false,
    zIndexOffset: 210,
    tooltip: {
      content: `Centre carte · ${metric.tooltip}`,
      options: {
        direction: "top",
        offset: [0, -20],
        opacity: 0.96,
        sticky: true,
      },
    },
  });
}

function marineOverlayMarkerHtml(metric) {
  const strength = clamp(metric.value / (state.marineOverlayMode === "wave" ? 1.8 : 1.1), 0.72, 1.4);
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
  const activeLabel = t(filters.find((filter) => filter.id === active)?.label ?? "Tous");
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
      <strong>${escapeHtml(t(filter.label))}</strong>
      <span>${filter.id === "all" ? "Tous les coins" : `${countKnownFishingSpotsForFilter(filter.id)} coins`}</span>
    `;
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      selectFishFilter(filter.id);
    });
    els.fishFilterPanel.append(button);
  });
  scheduleNativeMapInteractionRegionSync();
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
  renderMapPins();
}

function selectKnownFishingSpot(spot) {
  state.pendingSpot = null;
  setCustomSpot(spot.lat, spot.lon, { load: true, name: spot.name });
}

function renderMapTiles() {
  if (state.mapProvider) {
    syncProviderMapView();
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

function syncProviderMapView() {
  const map = state.mapProvider;
  if (!map) return;

  map.invalidateSize?.();
  const center = getMapCenter();
  const currentCenter = map.getCenter();
  const shouldMove =
    map.getZoom() !== state.mapZoom ||
    Math.abs(currentCenter.lat - center.lat) > 0.00001 ||
    Math.abs(currentCenter.lon - center.lon) > 0.00001;

  if (shouldMove) {
    map.setView(center.lat, center.lon, state.mapZoom);
  }
}

function filterPinsByZoom(zoomLevel) {
  return getMapPinCatalog().filter((pin) => isPinVisibleAtZoom(pin, zoomLevel));
}

function getOverpassService() {
  return window.overpassSpots && typeof window.overpassSpots.fetchSpotsInBounds === "function"
    ? window.overpassSpots
    : null;
}

function getOsmSpotsCache() {
  const service = getOverpassService();
  return service?.spotsCache instanceof Map ? service.spotsCache : null;
}

function getOsmCachedSpots() {
  const cache = getOsmSpotsCache();
  return cache ? [...cache.values()] : [];
}

function mapBoundsToOverpassBounds(bounds) {
  if (!bounds) return null;

  const north = Number(bounds.getNorth?.() ?? bounds.north);
  const south = Number(bounds.getSouth?.() ?? bounds.south);
  const east = Number(bounds.getEast?.() ?? bounds.east);
  const west = Number(bounds.getWest?.() ?? bounds.west);

  if (![north, south, east, west].every(isValidNumber)) return null;
  return { north, south, east, west };
}

function scheduleOverpassSpotFetch(options = {}) {
  if (!state.mapProvider || state.mapZoom < OVERPASS_MIN_ZOOM) {
    window.clearTimeout(state.osmSpotsFetchTimer);
    state.osmSpotsFetchTimer = null;
    if (state.osmSpotsLoading) state.osmSpotsRequestId += 1;
    state.osmSpotsLoading = false;
    updateOverpassLoadingIndicator();
    return;
  }

  const bounds = mapBoundsToOverpassBounds(state.mapProvider.getBounds());
  if (!bounds || (!options.force && !shouldFetchOverpassBounds(bounds))) return;
  if (state.osmSpotsLoading) return;

  const now = Date.now();
  if (state.osmSpotsBlockedUntil > now) return;

  const elapsed = now - state.osmSpotsLastFetchTime;
  const delay = Math.max(0, OVERPASS_MIN_FETCH_INTERVAL_MS - elapsed);
  window.clearTimeout(state.osmSpotsFetchTimer);
  state.osmSpotsFetchTimer = window.setTimeout(fetchOverpassSpotsForCurrentBounds, delay);
}

function shouldFetchOverpassBounds(bounds) {
  if (!state.osmSpotsLastFetchedBounds) return true;
  return overpassBoundsMoveRatio(bounds, state.osmSpotsLastFetchedBounds) >= OVERPASS_BOUNDS_MOVE_RATIO;
}

function overpassBoundsMoveRatio(nextBounds, previousBounds) {
  const next = boundsMetrics(nextBounds);
  const previous = boundsMetrics(previousBounds);
  if (!next || !previous) return 1;

  const latShift = Math.abs(next.centerLat - previous.centerLat) / Math.max(previous.latSpan, 0.0001);
  const lngShift = Math.abs(next.centerLng - previous.centerLng) / Math.max(previous.lngSpan, 0.0001);
  const latScale = Math.abs(next.latSpan - previous.latSpan) / Math.max(previous.latSpan, 0.0001);
  const lngScale = Math.abs(next.lngSpan - previous.lngSpan) / Math.max(previous.lngSpan, 0.0001);

  return Math.max(latShift, lngShift, latScale, lngScale);
}

function boundsMetrics(bounds) {
  if (!bounds) return null;

  const latSpan = Math.abs(bounds.north - bounds.south);
  const lngSpan = Math.abs(bounds.east - bounds.west);
  return {
    centerLat: (bounds.north + bounds.south) / 2,
    centerLng: (bounds.east + bounds.west) / 2,
    latSpan,
    lngSpan,
  };
}

async function fetchOverpassSpotsForCurrentBounds() {
  const service = getOverpassService();
  if (!service || !state.mapProvider || state.osmSpotsLoading || state.mapZoom < OVERPASS_MIN_ZOOM) return;

  const bounds = mapBoundsToOverpassBounds(state.mapProvider.getBounds());
  if (!bounds || !shouldFetchOverpassBounds(bounds)) return;

  const requestId = state.osmSpotsRequestId + 1;
  state.osmSpotsRequestId = requestId;
  state.osmSpotsLoading = true;
  state.osmSpotsLastFetchTime = Date.now();
  updateOverpassLoadingIndicator();

  try {
    const spots = await service.fetchSpotsInBounds(bounds, state.waterMode);
    if (requestId !== state.osmSpotsRequestId) return;

    cacheOsmSpots(spots.filter((spot) => isOsmSpotAllowedForWaterMode(spot, state.waterMode)));
    state.osmSpotsLastFetchedBounds = bounds;
    renderMapPins();
  } catch (error) {
    state.osmSpotsBlockedUntil = Date.now() + OVERPASS_RETRY_DELAY_MS;
    showToast(t("Spots OSM indisponibles — réessai dans 30s"));
  } finally {
    if (requestId === state.osmSpotsRequestId) {
      state.osmSpotsLoading = false;
      updateOverpassLoadingIndicator();
    }
  }
}

function cacheOsmSpots(spotsList) {
  const cache = getOsmSpotsCache();
  if (!cache || !Array.isArray(spotsList)) return;

  spotsList.forEach((spot) => {
    if (!spot?.id || !isValidNumber(spot.lat) || !isValidNumber(spot.lng)) return;
    if (cache.has(spot.id)) cache.delete(spot.id);
    cache.set(spot.id, {
      ...spot,
      source: "osm",
      zoomLevel: OVERPASS_SPOT_ZOOM_LEVEL,
      type: normalizeWaterMode(spot.type),
    });
  });

  trimOsmSpotsCache(cache);
}

function trimOsmSpotsCache(cache) {
  if (!(cache instanceof Map) || cache.size <= OVERPASS_CACHE_LIMIT) return;

  const removeCount = Math.min(OVERPASS_CACHE_TRIM, cache.size - OVERPASS_CACHE_LIMIT);
  let removed = 0;
  for (const key of cache.keys()) {
    cache.delete(key);
    removed += 1;
    if (removed >= removeCount) break;
  }
}

function isOsmSpotAllowedForWaterMode(spot, waterMode) {
  return normalizeWaterMode(spot?.type) === normalizeWaterMode(waterMode);
}

function getMapPinCatalog() {
  const pins = [];

  getSpotsDb().forEach((spot) => {
    const pin = normalizeMapPin({
      id: `db:${spot.id}`,
      source: "db",
      name: spot.name,
      area: spot.area ?? "",
      lat: spot.lat,
      lon: spot.lng ?? spot.lon,
      zoomLevel: spot.zoomLevel,
      type: spot.type,
      species: spot.species,
      note: spot.note ?? "",
    });
    if (pin) pins.push(pin);
  });

  getOsmCachedSpots().forEach((spot) => {
    if (!isOsmSpotAllowedForWaterMode(spot, state.waterMode)) return;
    const pin = normalizeMapPin({
      id: spot.id,
      source: "osm",
      name: spot.name,
      area: spot.named ? "OpenStreetMap" : "",
      lat: spot.lat,
      lon: spot.lng ?? spot.lon,
      zoomLevel: spot.zoomLevel ?? OVERPASS_SPOT_ZOOM_LEVEL,
      type: spot.type,
      species: [],
      tags: spot.tags,
      named: spot.named !== false,
      osmElementType: spot.osmElementType,
    });
    if (pin) pins.push(pin);
  });

  spots.forEach((spot, index) => {
    if (spot.custom) return;
    const pin = normalizeMapPin({
      id: `preset:${spotFavoriteId(spot)}`,
      source: "preset",
      name: spot.name,
      area: spot.group ?? "",
      lat: spot.lat,
      lon: spot.lon,
      zoomLevel: spot.group?.includes("raccourcis") ? 5 : 11,
      type: spot.group?.startsWith("Méditerranée") || spot.group?.startsWith("Atlantique") ? WATER_MODES.SEA : state.waterMode,
      species: [],
      presetIndex: index,
    });
    if (pin) pins.push(pin);
  });

  if (state.knownFishingEnabled) {
    getVisibleKnownFishingSpots().forEach((spot) => {
      const pin = normalizeMapPin({
        id: `known:${spot.name}`,
        source: "known",
        name: spot.name,
        area: spot.area ?? "",
        lat: spot.lat,
        lon: spot.lon,
        zoomLevel: 14,
        type: isSeaMode() ? WATER_MODES.SEA : WATER_MODES.FRESHWATER,
        species: spot.fish,
        note: spot.note,
        caution: spot.caution,
      });
      if (pin) pins.push(pin);
    });
  }

  getMapDiscoveryResults().forEach((result) => {
    const pin = normalizeMapPin({
      id: `${result.source}:${result.id}`,
      source: result.source,
      name: discoveryResultName(result),
      area: discoveryResultDetail(result),
      lat: result.lat,
      lon: result.lon,
      zoomLevel: 14,
      type: result.waterMode ?? state.waterMode,
      species: [],
      discoveryId: result.id,
    });
    if (pin) pins.push(pin);
  });

  state.favorites.forEach((favorite) => {
    const pin = normalizeMapPin({
      id: `favorite:${favorite.id}`,
      source: "favorite",
      name: favorite.name,
      area: favorite.group ?? "Favori",
      lat: favorite.lat,
      lon: favorite.lon,
      zoomLevel: 8,
      type: favorite.waterMode ?? state.waterMode,
      species: [],
      favoriteId: favorite.id,
    });
    if (pin) pins.push(pin);
  });

  return dedupeMapPins(pins);
}

function getSpotsDb() {
  return Array.isArray(window.spotsDB) ? window.spotsDB : [];
}

function normalizeMapPin(pin) {
  if (!pin || !isValidNumber(pin.lat) || !isValidNumber(pin.lon) || !pin.name) return null;

  return {
    ...pin,
    id: String(pin.id),
    name: String(pin.name),
    area: typeof pin.area === "string" ? pin.area : "",
    lat: Number(pin.lat),
    lon: Number(pin.lon),
    zoomLevel: normalizePinZoomLevel(pin.zoomLevel),
    type: normalizePinType(pin.type),
    species: Array.isArray(pin.species) ? pin.species.filter(Boolean) : [],
  };
}

function normalizePinZoomLevel(value) {
  const zoom = Number(value);
  const defaultZoom = PIN_ZOOM_LEVELS[PIN_ZOOM_LEVELS.length - 1];
  if (!isValidNumber(zoom)) return defaultZoom;
  return Math.max(PIN_ZOOM_LEVELS[0], Math.min(MAP_MAX_ZOOM, zoom));
}

function normalizePinType(type) {
  return type === WATER_MODES.FRESHWATER ? WATER_MODES.FRESHWATER : WATER_MODES.SEA;
}

function dedupeMapPins(pins) {
  const priority = { favorite: 8, search: 7, nearby: 7, db: 6, preset: 5, osm: 3, known: 2 };
  const unique = new Map();

  pins.forEach((pin) => {
    const key = `${pin.lat.toFixed(3)},${pin.lon.toFixed(3)}`;
    const existing = unique.get(key);
    const currentPriority = priority[pin.source] ?? 1;
    const existingPriority = priority[existing?.source] ?? 0;

    if (!existing || currentPriority > existingPriority) {
      unique.set(key, pin);
      return;
    }

    if (currentPriority === existingPriority && pin.zoomLevel < existing.zoomLevel) {
      unique.set(key, pin);
    } else if (pin.zoomLevel < existing.zoomLevel) {
      unique.set(key, { ...existing, zoomLevel: pin.zoomLevel });
    }
  });

  return [...unique.values()];
}

function pinZoomThreshold(zoomLevel) {
  const zoom = Number(zoomLevel);
  if (zoom >= 14) return 14;
  if (zoom >= 11) return 11;
  if (zoom >= 8) return 8;
  return 5;
}

function pinTierForZoomLevel(zoomLevel) {
  const threshold = pinZoomThreshold(zoomLevel);
  if (threshold >= 14) return PIN_LAYER_TIERS[3];
  if (threshold >= 11) return PIN_LAYER_TIERS[2];
  if (threshold >= 8) return PIN_LAYER_TIERS[1];
  return PIN_LAYER_TIERS[0];
}

function pinTierId(pin) {
  return pinTierForZoomLevel(pin?.zoomLevel).id;
}

function isPinVisibleAtZoom(pin, zoomLevel) {
  const zoom = Number(zoomLevel);
  return isValidNumber(zoom) && pin.zoomLevel <= zoom;
}

function renderMapPins() {
  if (!state.mapProvider || !state.mapPinLayers) return;

  const pins = getMapPinCatalog();
  const nextIds = new Set(pins.map((pin) => pin.id));
  const newMarkersByTier = PIN_LAYER_TIERS.reduce((acc, tier) => {
    acc[tier.id] = [];
    return acc;
  }, {});
  const newMarkers = [];

  pins.forEach((pin) => {
    const tierId = pinTierId(pin);
    let existing = state.mapPinMarkers.get(pin.id);
    if (existing && existing.__pinTier !== tierId) {
      removeMapPinMarker(existing);
      state.mapPinMarkers.delete(pin.id);
      existing = null;
    }

    if (existing) {
      existing.__pinData = pin;
      state.mapProvider.setMarkerPosition(existing, pin.lat, pin.lon);
      state.mapProvider.setMarkerZIndex(existing, pinZIndex(pin));
      syncMapPinIcon(existing, pin);
      syncMapPinTooltip(existing, pin);
      updateMapPinElement(existing, pin);
      return;
    }

    const marker = state.mapProvider.addMarker(null, {
      lat: pin.lat,
      lon: pin.lon,
      icon: createMapPinIcon(pin),
      keyboard: true,
      opacity: 0,
      pane: pinTierForZoomLevel(pin.zoomLevel).pane,
      riseOnHover: true,
      title: pin.name,
      zIndexOffset: pinZIndex(pin),
      onClick: (event) => {
        state.mapProvider.stopEvent(event);
        handleMapPinClick(marker.__pinData, marker);
      },
    });
    marker.__pinData = pin;
    marker.__pinTier = tierId;
    marker.__iconSignature = mapPinIconSignature(pin);
    syncMapPinTooltip(marker, pin);
    state.mapPinMarkers.set(pin.id, marker);
    newMarkersByTier[tierId].push(marker);
    newMarkers.push(marker);
  });

  Object.entries(newMarkersByTier).forEach(([tierId, markers]) => {
    if (!markers.length) return;
    const batchGroup = state.mapProvider.addMarkerBatch(state.mapPinLayers[tierId], markers);
    markers.forEach((marker) => {
      marker.__pinBatchGroup = batchGroup;
    });
  });

  newMarkers.forEach((marker) => {
    window.requestAnimationFrame(() => {
      updateMapPinElement(marker, marker.__pinData);
      updateMapPinVisibilityForMarker(marker, marker.__pinData);
      fadeInMapMarker(marker);
    });
  });

  state.mapPinMarkers.forEach((marker, id) => {
    if (nextIds.has(id)) return;
    state.mapProvider.setMarkerOpacity(marker, 0);
    window.clearTimeout(state.mapPinFadeTimers.get(id));
    const timer = window.setTimeout(() => {
      removeMapPinMarker(marker);
      state.mapPinMarkers.delete(id);
      state.mapPinFadeTimers.delete(id);
    }, 260);
    state.mapPinFadeTimers.set(id, timer);
  });

  updateMapPinVisibility();
}

function updateMapPinVisibility() {
  if (!state.mapProvider || !state.mapPinMarkers) return;

  state.mapZoom = state.mapProvider.getZoom();
  updateMapPinPaneVisibility();
  const visibleIds = new Set(filterPinsByZoom(state.mapZoom).map((pin) => pin.id));
  state.mapPinMarkers.forEach((marker, id) => {
    updateMapPinVisibilityForMarker(marker, marker.__pinData, visibleIds.has(id));
  });
}

function updateMapPinPaneVisibility() {
  if (!state.mapProvider || !state.mapPinPanes) return;

  const zoom = state.mapProvider.getZoom();
  state.mapZoom = zoom;
  state.mapProvider.setPinPaneVisibility(state.mapPinPanes, PIN_LAYER_TIERS, zoom);
}

function updateMapPinVisibilityForMarker(marker, pin, forceVisible = null) {
  if (!marker || !pin) return;

  const visible = forceVisible ?? isPinVisibleAtZoom(pin, state.mapZoom);
  marker.__pinVisible = visible;
  const element = state.mapProvider?.getMarkerElement?.(marker);
  if (!element) {
    state.mapProvider?.setMarkerOpacity?.(marker, visible ? 1 : 0);
    return;
  }
  element.classList.toggle("is-visible", visible);
  element.classList.toggle("is-hidden", !visible);
  element.dataset.zoomLevel = String(pin.zoomLevel);
  element.dataset.pinSource = pin.source;
  element.dataset.pinType = pin.type;
  element.classList.toggle("is-label-enabled", pinHasHoverLabel(pin) && state.mapZoom >= 14);
}

function fadeInMapMarker(marker) {
  const element = state.mapProvider?.getMarkerElement?.(marker);
  if (!element) {
    state.mapProvider?.setMarkerOpacity?.(marker, marker.__pinVisible === false ? 0 : 1);
    return;
  }

  element.style.opacity = "0";
  element.style.transition = "opacity 250ms ease-out, transform 180ms ease, filter 180ms ease";
  window.requestAnimationFrame(() => state.mapProvider?.setMarkerOpacity?.(marker, 1));
}

function removeMapPinMarker(marker) {
  if (!marker) return;
  state.mapProvider?.removeMarkerFromBatch?.(marker, state.mapPinLayers);
}

function syncMapPinIcon(marker, pin) {
  const signature = mapPinIconSignature(pin);
  if (marker.__iconSignature === signature) return;
  state.mapProvider.setMarkerIcon(marker, createMapPinIcon(pin));
  marker.__iconSignature = signature;
  window.requestAnimationFrame(() => updateMapPinElement(marker, pin));
}

function syncMapPinTooltip(marker, pin) {
  const html = mapPinTooltipHtml(pin);
  state.mapProvider.ensureMarkerTooltip(marker, {
    content: html,
    options: {
      className: "map-pin-tooltip",
      direction: "top",
      offset: [0, -16],
      opacity: 0.96,
      sticky: true,
    },
  });
}

function updateMapPinElement(marker, pin) {
  const element = state.mapProvider?.getMarkerElement?.(marker);
  if (!element) return;

  element.dataset.zoomLevel = String(pin.zoomLevel);
  element.dataset.pinSource = pin.source;
  element.dataset.pinType = pin.type;
  element.classList.toggle("is-active", isMapPinActive(pin));
  element.classList.toggle("is-detail-pin", pin.zoomLevel >= 14);
  element.classList.toggle("is-named", pin.named !== false);
  element.classList.toggle("is-unnamed", pin.named === false);
  element.classList.toggle("is-label-enabled", pinHasHoverLabel(pin) && state.mapZoom >= 14);
}

function createMapPinIcon(pin) {
  const size = mapPinSize(pin);
  const anchor = pin.source === "favorite"
    ? [size[0] / 2, size[1] / 2]
    : [size[0] / 2, Math.max(30, size[1] - 4)];

  return state.mapProvider.createDivIcon({
    className: mapPinClassName(pin),
    html: mapPinHtml(pin),
    iconSize: size,
    iconAnchor: anchor,
    tooltipAnchor: [0, -Math.round(size[1] / 2)],
  });
}

function mapPinClassName(pin) {
  const classes = [
    "map-progressive-marker",
    `is-${pin.source}`,
    `is-${pin.type}`,
    `is-zoom-${pin.zoomLevel}`,
  ];

  if (pin.source === "favorite") classes.push("favorite-star-marker");
  else if (pin.source === "nearby" || pin.source === "search") classes.push("discovery-spot-marker");
  else if (pin.source === "osm") classes.push("osm-spot-marker");
  else classes.push("map-db-pin-marker");
  if (pin.named === false) classes.push("is-unnamed");
  else classes.push("is-named");
  if (isMapPinActive(pin)) classes.push("is-active");
  if (pin.zoomLevel >= 14) classes.push("is-detail-pin");

  return classes.join(" ");
}

function mapPinHtml(pin) {
  const icon = pin.source === "favorite"
    ? starIcon()
    : pin.source === "known"
      ? fishSpotIcon(markerFishForSpot({ fish: pin.species }))
      : pinIcon();
  const label = pinHasHoverLabel(pin) ? `<span class="map-pin-label">${escapeHtml(pin.name)}</span>` : "";
  return `${icon}${label}`;
}

function mapPinIconSignature(pin) {
  return `${pin.source}:${pin.type}:${pin.zoomLevel}:${pin.named !== false}:${isMapPinActive(pin)}:${markerFishForSpot({ fish: pin.species })}`;
}

function pinHasHoverLabel(pin) {
  if (pin.source === "osm") return pin.named !== false;
  return pin.zoomLevel >= 14;
}

function mapPinSize(pin) {
  if (pin.source === "osm" && pin.named === false) {
    return isMapPinActive(pin) ? [28, 34] : [22, 28];
  }

  if (pin.source === "favorite") {
    if (isMapPinActive(pin)) return [40, 40];
    return pin.zoomLevel <= 5 ? [40, 40] : [34, 34];
  }

  if (pin.zoomLevel <= 5) return [46, 56];
  if (pin.zoomLevel <= 8) return [40, 50];
  if (pin.zoomLevel <= 11) return [34, 42];
  return [30, 38];
}

function pinZIndex(pin) {
  if (isMapPinActive(pin)) return 1300;
  if (pin.source === "favorite") return 1100;
  if (pin.source === "osm") return pin.named === false ? 330 : 360;
  if (pin.zoomLevel <= 5) return 650;
  if (pin.zoomLevel <= 8) return 560;
  if (pin.zoomLevel <= 11) return 480;
  return 390;
}

function mapPinTooltipHtml(pin) {
  const detail = [
    pin.area,
    pin.type === WATER_MODES.FRESHWATER ? t("Eau douce") : t("Mer"),
    pin.species.length ? formatFishTargets(pin.species).replace("Cibles: ", "") : "",
  ].filter(Boolean).join(" · ");

  return `
    <strong>${escapeHtml(pin.name)}</strong>
    ${detail ? `<small>${escapeHtml(detail)}</small>` : ""}
  `;
}

function isMapPinActive(pin) {
  const active = getActiveSpot();
  if (pin.source === "favorite" && pin.favoriteId === active.id) return true;
  if (pin.source === "preset" && spotFavoriteId({ name: pin.name }) === active.id) return true;

  const distance = distanceMeters({ lat: pin.lat, lon: pin.lon }, active);
  return isValidNumber(distance) && distance < 40;
}

function hasCatalogPinForActive(active) {
  return getMapPinCatalog().some((pin) => {
    const distance = distanceMeters({ lat: pin.lat, lon: pin.lon }, active);
    return isValidNumber(distance) && distance < 40;
  });
}

function handleMapPinClick(pin, marker) {
  if (!pin) return;

  const currentZoom = state.mapProvider?.getZoom?.() ?? state.mapZoom;
  const targetZoom = Math.min(MAP_MAX_ZOOM, Math.max(14, pin.zoomLevel));

  if (state.mapProvider && currentZoom < 12) {
    pulseMapMarker(marker);
    state.mapProvider.once("moveend", () => selectMapPin(pin));
    state.mapProvider.flyTo(pin.lat, pin.lon, targetZoom, {
      animate: true,
      duration: 0.8,
      easeLinearity: 0.5,
    });
    return;
  }

  selectMapPin(pin);
}

function pulseMapMarker(marker) {
  const element = state.mapProvider?.getMarkerElement?.(marker);
  if (!element || !state.mapProvider) return;

  element.classList.add("marker-pulse");
  state.mapProvider.once("moveend", () => element.classList.remove("marker-pulse"));
}

function selectMapPin(pin) {
  if (!pin) return;

  if (pin.source === "favorite") {
    const favorite = state.favorites.find((item) => item.id === pin.favoriteId);
    if (favorite) selectFavorite(favorite);
    return;
  }

  if (pin.source === "preset" && Number.isInteger(pin.presetIndex)) {
    selectSpot(pin.presetIndex, { load: true });
    return;
  }

  if (pin.source === "nearby" || pin.source === "search") {
    selectDiscoveryMapResult({
      id: pin.discoveryId,
      source: pin.source,
      lat: pin.lat,
      lon: pin.lon,
      waterMode: pin.type,
    });
    return;
  }

  state.pendingSpot = null;
  setWaterMode(pin.type, { load: false });
  state.spotResolution = provisionalSpotResolutionFromSearchResult({
    name: pin.name,
    detail: pin.area,
    lat: pin.lat,
    lon: pin.lon,
    waterMode: pin.type,
    waterKind: pin.type,
  });
  setCustomSpot(pin.lat, pin.lon, { load: true, name: pin.name });
  setSpotPanelOpen(false);
}

function renderProviderMarkers() {
  if (!state.mapMarkers || !state.mapProvider) return;

  renderMapPins();
  state.mapProvider.clearLayer(state.mapMarkers);
  const active = getActiveSpot();

  if (active.custom && !hasFavorite(active.id) && !hasCatalogPinForActive(active) && isValidNumber(active.lat) && isValidNumber(active.lon)) {
    state.mapProvider.addCircleMarker(state.mapMarkers, {
      lat: active.lat,
      lon: active.lon,
      radius: 8,
      color: "#fff",
      weight: 3,
      fillColor: colors.depth,
      fillOpacity: 1,
      bubblingMouseEvents: false,
      tooltip: {
        content: textTooltip(active.name),
        options: {
          direction: "top",
          offset: [0, -10],
          opacity: 0.96,
          permanent: true,
        },
      },
    });
  }

  if (state.pendingSpot) {
    state.mapProvider.addMarker(state.mapMarkers, {
      lat: state.pendingSpot.lat,
      lon: state.pendingSpot.lon,
      icon: state.mapProvider.createDivIcon({
        className: "pending-spot-marker",
        html: pinIcon(),
        iconSize: [34, 42],
        iconAnchor: [17, 38],
      }),
      keyboard: false,
      interactive: false,
    });
  }
}

function selectProviderMapPoint(event) {
  const latlng = mapProviderEventLatLng(event);
  if (!latlng) return;
  openSpotNameSheet(latlng.lat, latlng.lng);
}

function syncProviderMapState() {
  if (!state.mapProvider) return;

  const center = state.mapProvider.getCenter();
  state.mapZoom = state.mapProvider.getZoom();
  if (center) state.mapCenter = center;
  updateMapZoomControls();
  updateMapScale();
  scheduleBathymetryFocusRefresh();
  scheduleMarineOverlayRefresh();
}

function renderMapMarkers() {
  if (state.mapProvider) {
    renderProviderMarkers();
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
    const label = document.createElement("span");
    label.className = "map-marker-label";
    label.textContent = spot.name;
    marker.append(label);
    marker.addEventListener("click", (event) => {
      event.stopPropagation();
      selectSpot(index, { load: true });
    });
    els.mapMarkers.append(marker);
  });

  getMapDiscoveryResults().forEach((result) => {
    if (!isInsideMapBounds(result.lat, result.lon)) return;
    const point = latLonToMapPoint(result.lat, result.lon);
    if (!isInsideMapViewport(point)) return;
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = `discovery-spot-marker is-${result.source}`;
    marker.classList.toggle("is-active", isDiscoveryResultActive(result, active));
    marker.style.left = `${point.x * 100}%`;
    marker.style.top = `${point.y * 100}%`;
    marker.title = discoveryResultName(result);
    marker.setAttribute("aria-label", `Sélectionner ${discoveryResultName(result)}`);
    marker.innerHTML = pinIcon();
    marker.addEventListener("click", (event) => {
      event.stopPropagation();
      selectDiscoveryMapResult(result);
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

  state.favorites.forEach((favorite) => {
    if (!isValidNumber(favorite.lat) || !isValidNumber(favorite.lon) || !isInsideMapBounds(favorite.lat, favorite.lon)) return;
    const point = latLonToMapPoint(favorite.lat, favorite.lon);
    if (!isInsideMapViewport(point)) return;
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "favorite-star-marker";
    marker.classList.toggle("is-active", favorite.id === active.id);
    marker.style.left = `${point.x * 100}%`;
    marker.style.top = `${point.y * 100}%`;
    marker.title = favorite.name;
    marker.setAttribute("aria-label", `Sélectionner le favori ${favorite.name}`);
    marker.innerHTML = starIcon();
    marker.addEventListener("click", (event) => {
      event.stopPropagation();
      selectFavorite(favorite);
    });
    els.mapMarkers.append(marker);
  });

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

function renderProviderDiscoveryMarkers(active) {
  if (!state.mapMarkers || !state.mapProvider) return;

  getMapDiscoveryResults().forEach((result) => {
    const isActive = isDiscoveryResultActive(result, active);
    const name = discoveryResultName(result);
    const detail = discoveryResultDetail(result);
    state.mapProvider.addMarker(state.mapMarkers, {
      lat: result.lat,
      lon: result.lon,
      icon: state.mapProvider.createDivIcon({
        className: `discovery-spot-marker is-${result.source}${isActive ? " is-active" : ""}`,
        html: pinIcon(),
        iconSize: isActive ? [36, 46] : [30, 38],
        iconAnchor: isActive ? [18, 42] : [15, 34],
        tooltipAnchor: [0, -18],
      }),
      keyboard: true,
      riseOnHover: true,
      title: name,
      zIndexOffset: isActive ? 1150 : result.source === "nearby" ? 760 : 720,
      tooltip: {
        content: `<strong>${escapeHtml(name)}</strong><small>${escapeHtml(detail)}</small>`,
        options: {
          direction: "top",
          offset: [0, -16],
          opacity: 0.96,
          sticky: true,
        },
      },
      onClick: (event) => {
        state.mapProvider.stopEvent(event);
        selectDiscoveryMapResult(result);
      },
    });
  });
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

function getMapDiscoveryResults() {
  const results = [
    ...state.spotSearchResults.map((result) => normalizeDiscoveryMapResult(result, "search")),
    ...state.nearbySpotResults.map((result) => normalizeDiscoveryMapResult(result, "nearby")),
  ].filter(Boolean);
  const unique = new Map();

  results.forEach((result) => {
    const key = `${result.lat.toFixed(4)},${result.lon.toFixed(4)}`;
    const existing = unique.get(key);
    if (!existing || result.source === "nearby") {
      unique.set(key, result);
    }
  });

  return [...unique.values()].slice(0, 24);
}

function normalizeDiscoveryMapResult(result, source) {
  if (!result || !isValidNumber(result.lat) || !isValidNumber(result.lon)) return null;
  return {
    ...result,
    source,
    lat: Number(result.lat),
    lon: Number(result.lon),
  };
}

function discoveryResultName(result) {
  return result.source === "nearby"
    ? localizeNearbySpotText(result.name)
    : result.name;
}

function discoveryResultDetail(result) {
  const fallback = formatCoordinates(result.lat, result.lon);
  return result.source === "nearby"
    ? localizeNearbySpotText(result.detail || fallback)
    : result.detail || fallback;
}

function isDiscoveryResultActive(result, active) {
  const distance = distanceMeters({ lat: result.lat, lon: result.lon }, active);
  return coordinateFavoriteId(result.lat, result.lon) === active.id
    || (isValidNumber(distance) && distance < 40);
}

function selectDiscoveryMapResult(result) {
  if (result.source === "nearby") {
    selectNearbySpotResult(result.id);
    return;
  }
  selectSpotSearchResult(result.id);
}

function changeMapZoom(delta, options = {}) {
  const currentZoom = state.mapProvider?.getZoom?.() ?? state.mapZoom;
  const nextZoom = clamp(currentZoom + delta, MAP_MIN_ZOOM, MAP_MAX_ZOOM);
  if (nextZoom === state.mapZoom) return;

  if (state.mapProvider) {
    state.mapZoom = nextZoom;
    state.mapProvider.setZoom(nextZoom, options);
    syncProviderMapState();
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
  const zoom = state.mapProvider?.getZoom?.() ?? state.mapZoom;
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

  if (state.mapProvider) {
    state.mapCenter = { lat, lon };
    state.mapProvider.setView(lat, lon, state.mapZoom);
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
  if (isMapOverlayTarget(event.target)) return;
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
  if (isMapOverlayTarget(event.target)) return;

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
  if (isMapOverlayTarget(event.target)) return;
  state.mapClickStart = { x: event.clientX, y: event.clientY };
}

function preventMapTouchScroll(event) {
  if (isMapOverlayTarget(event.target)) return;
  if (event.cancelable) event.preventDefault();
}

function isMapOverlayTarget(target) {
  return Boolean(target?.closest?.(
    ".map-marker, .map-control, .controls-band, .fish-filter-control, .map-overlay-actions, .map-sensitive-card, .map-favorites-overlay, .spot-name-sheet"
  ));
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
  if (!els.favoritesList) return;
  els.favoritesList.innerHTML = "";

  if (!state.favorites.length) {
    const empty = document.createElement("div");
    empty.className = "favorites-empty";
    empty.textContent = "Aucun favori";
    els.favoritesList.append(empty);
    updateFavoritesOverlay();
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
  updateFavoritesOverlay();
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
  setFavoritesOverlayOpen(false);
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
  if (!els.favoriteBtn) return;
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
  els.preferencesBack?.addEventListener("click", () => setMobileView("map"));
  els.onboardingClose?.addEventListener("click", () => completeOnboarding({ privacyAccepted: false }));
  els.onboardingLater?.addEventListener("click", () => completeOnboarding({ privacyAccepted: false }));
  els.onboardingDone?.addEventListener("click", () => completeOnboarding({ privacyAccepted: true }));
  els.onboardingGpsButton?.addEventListener("click", requestGpsPermission);
  els.onboardingNotificationButton?.addEventListener("click", requestNotificationPermission);
  els.nativeGpsButton?.addEventListener("click", requestGpsPermission);
  els.nativeNotificationButton?.addEventListener("click", requestNotificationPermission);
  els.nativePrivacyButton?.addEventListener("click", () => {
    state.privacyAccepted = true;
    saveSettings();
    renderNativeStatus();
  });
  els.nativeOnboardingButton?.addEventListener("click", () => showOnboarding({ force: true }));
  els.smartAlertType?.addEventListener("change", renderSmartAlertSetup);
  els.smartAlertEnabled?.addEventListener("change", () => {
    const type = SMART_ALERT_TYPES.includes(els.smartAlertType?.value) ? els.smartAlertType.value : SMART_ALERT_TYPES[0];
    const feature = smartAlertFeature(type);
    if (!canUseFeature(feature)) {
      els.smartAlertEnabled.checked = false;
      showProGate(feature);
      renderSmartAlertSetup();
      return;
    }
    updateSelectedSmartAlert({ enabled: els.smartAlertEnabled.checked });
  });
  els.smartAlertQuietStart?.addEventListener("change", updateSmartAlertQuietHours);
  els.smartAlertQuietEnd?.addEventListener("change", updateSmartAlertQuietHours);
  els.smartAlertScheduleButton?.addEventListener("click", handleSmartAlertSchedule);
  els.smartAlertCancelButton?.addEventListener("click", handleSmartAlertCancel);
  els.languageSelect?.addEventListener("change", () => {
    setLanguagePreference(els.languageSelect.value);
  });
  els.proToggle?.addEventListener("change", () => {
    setProStatus(els.proToggle.checked);
  });
  els.proGateClose?.addEventListener("click", hideProGate);
  els.proGateLater?.addEventListener("click", hideProGate);
  els.proGateBackdrop?.addEventListener("click", hideProGate);
  els.proGateCta?.addEventListener("click", () => {
    setProStatus(true);
    hideProGate();
  });
  els.proFeatureCards.forEach((card) => {
    card.addEventListener("click", () => {
      const feature = card.dataset.proFeature;
      if (feature && !canUseFeature(feature)) showProGate(feature);
    });
  });

  els.spotPanelButton.addEventListener("click", () => setSpotPanelOpen(!state.spotPanelOpen));
  els.spotPanelClose.addEventListener("click", () => setSpotPanelOpen(false));
  els.mapFavoritesButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    setFavoritesOverlayOpen(!state.favoritesOpen);
  });
  els.mapFavoritesClose?.addEventListener("click", (event) => {
    event.stopPropagation();
    setFavoritesOverlayOpen(false);
  });
  els.mapSensitiveButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleRegulationOverlay();
  });

  els.marineOverlayButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      applyMapLayerChange(() => setMarineOverlayMode(button.dataset.marineOverlay));
    });
  });

  els.spotPreset.addEventListener("change", () => {
    selectSpot(Number(els.spotPreset.value), { load: true });
  });

  els.spotSearchButton?.addEventListener("click", () => {
    searchSpotLocations();
  });
  els.spotSearchInput?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    searchSpotLocations();
  });
  els.spotSearchInput?.addEventListener("input", () => {
    if (els.spotSearchInput.value.trim()) return;
    state.spotSearchResults = [];
    state.spotSearchError = "";
    renderSpotSearchResults();
    renderMapMarkers();
  });
  els.spotSearchResults?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-spot-search-result]");
    if (!button) return;
    event.preventDefault();
    selectSpotSearchResult(button.dataset.spotSearchResult);
  });
  els.nearbySpotsButton?.addEventListener("click", () => {
    loadNearbySpots();
  });
  els.nearbySpotResults?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-nearby-spot-result]");
    if (!button) return;
    event.preventDefault();
    selectNearbySpotResult(button.dataset.nearbySpotResult);
  });

  els.spotForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const preset = getSelectedPreset();
    const lat = Number(els.latitude.value);
    const lon = Number(els.longitude.value);
    if (!isValidNumber(lat) || !isValidNumber(lon)) {
      setStatus("Coordonnées invalides", "error");
      return;
    }

    const isPresetPosition = Math.abs(preset.lat - lat) < 0.00005 && Math.abs(preset.lon - lon) < 0.00005;
    setSpotPanelOpen(false);
    if (preset.custom || !isPresetPosition) {
      const name = preset.custom && state.selectedSpotName ? state.selectedSpotName : getCustomSpotName(lat, lon);
      setCustomSpot(lat, lon, { load: true, name });
      return;
    }

    selectSpot(Number(els.spotPreset.value), { load: true });
  });

  els.depth.addEventListener("input", () => {
    if (!isSeaMode()) return;
    updateDepth();
    renderPreferenceControls(getSelectedDay());
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

  if (shouldInstallMapSurfaceGestures()) {
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
    const active = getActiveSpot();
    centerMapOn(active.lat, active.lon);
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
    applyMapLayerChange(() => {
      state.nauticalEnabled = !state.nauticalEnabled;
      updateNauticalOverlay();
      saveSettings();
    });
  });
  els.mapCoastalToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!isSeaMode()) return;
    state.coastalEnabled = !state.coastalEnabled;
    updateCoastalOverlay();
    saveSettings();
  });
  els.mapBathymetryToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!isSeaMode()) return;
    state.bathymetryEnabled = !state.bathymetryEnabled;
    updateBathymetryOverlay();
    updateNauticalOverlay();
    scheduleBathymetryFocusRefresh();
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
    renderPreferenceControls(getSelectedDay());
    renderAll();
    saveSettings();
  });
  els.preferenceSpecies?.addEventListener("change", () => {
    setPreferredSpecies(els.preferenceSpecies.value, { syncMap: true });
  });
  els.preferenceDepth?.addEventListener("input", () => {
    if (!isSeaMode()) return;
    updateDepth(els.preferenceDepth.value);
    renderPreferenceControls(getSelectedDay());
    recomputeDepthSensitiveViews();
  });
  els.preferenceDepth?.addEventListener("change", () => {
    if (!isSeaMode()) return;
    updateDepth(els.preferenceDepth.value);
    loadForecast();
  });
  els.profileButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const control = button.closest("[data-profile-control]")?.dataset.profileControl;
      setProfilePreference(control, button.dataset.profileValue);
    });
  });
  els.themeButtons.forEach((button) => {
    button.addEventListener("click", () => setThemePreference(button.dataset.themeValue));
  });
  els.weatherSubtabButtons.forEach((button) => {
    button.addEventListener("click", () => setWeatherSubtab(button.dataset.weatherTab));
  });
  els.catchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    let entry = null;
    try {
      entry = saveCatchLogEntry(createCatchLogEntry({
        species: els.catchSpecies.value || state.activityFish,
        measurements: {
          lengthCm: readOptionalNumber(els.catchLength.value),
          weightKg: readOptionalNumber(els.catchWeight.value),
        },
        notes: els.catchNotes.value.trim(),
        media: state.pendingCatchMedia,
      }));
    } catch (error) {
      console.warn("Catch save failed", error);
      setStatus("Stockage plein", "error");
      return;
    }

    if (!entry) return;
    els.catchLength.value = "";
    els.catchWeight.value = "";
    els.catchNotes.value = "";
    state.pendingCatchMedia = [];
    renderCatchPhotoPreview();
    renderCatchJournal();
  });
  els.catchPhotoButton?.addEventListener("click", pickCatchPhoto);
  els.catchPhotoInput?.addEventListener("change", handleCatchPhotoInput);
  els.catchPhotoPreview?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const removeButton = target.closest("[data-remove-photo]");
    if (!removeButton) return;
    state.pendingCatchMedia = state.pendingCatchMedia.filter((item) => item.id !== removeButton.dataset.removePhoto);
    renderCatchPhotoPreview();
  });
  els.catchLogList?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const deleteButton = target.closest("[data-catch-delete]");
    if (!deleteButton) return;
    deleteCatchLogEntry(deleteButton.dataset.catchDelete);
    renderCatchJournal();
  });
  els.dayTimeRange?.addEventListener("input", () => {
    setTimelineMinute(els.dayTimeRange.value);
  });
  els.liveTimelineCanvas?.addEventListener("pointerdown", handleLiveTimelinePointer);
  els.liveTimelineCanvas?.addEventListener("pointermove", handleLiveTimelinePointer);
  els.liveTimelineCanvas?.addEventListener("pointerup", handleLiveTimelineRelease);
  els.liveTimelineCanvas?.addEventListener("pointercancel", handleLiveTimelineRelease);
  els.liveTimelineCanvas?.addEventListener("click", handleLiveTimelinePointer);
  els.timelinePrevDay?.addEventListener("click", () => shiftTimelineDay(-1));
  els.timelineNextDay?.addEventListener("click", () => shiftTimelineDay(1));
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
  els.atmosphereChartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeAtmosphereChart = normalizeAtmosphereChart(button.dataset.atmosphereChart);
      renderAtmosphereChart();
      saveSettings();
    });
  });

  window.addEventListener("resize", () => {
    applyMobileNavigationUI();
    if (!isMobileLayout() && state.mapFullscreen) {
      setMapFullscreen(false);
    }
    drawCompass();
    renderActivity(getSelectedDay());
    renderTides(getSelectedDay());
    renderChart();
    renderAtmosphereChart();
    renderAstro(getSelectedDay());
    updateMapScale();
  });
}

function updateDepth(value = els.depth?.value ?? state.depth) {
  state.depth = Number(value);
  if (els.depth) els.depth.value = String(state.depth);
  if (els.depthOutput) els.depthOutput.value = `${state.depth} m`;
  if (els.preferenceDepth) els.preferenceDepth.value = String(state.depth);
  if (els.preferenceDepthOutput) els.preferenceDepthOutput.value = isSeaMode() ? `${state.depth} m` : "Eau douce";
}

function recomputeDepthSensitiveViews() {
  state.realDepthAvailable = false;
  state.realDepthError = "";
  state.hours = state.hours.map((row) => clearDepthCurrent(row));
  state.days = buildDailySummaries(state.hours);
  invalidateLiveTimelineCache();
  renderAll();
  saveSettings();
}

function setTimelineMinute(value, options = {}) {
  state.timelineMinute = normalizeTimelineMinute(value);
  scheduleTimelineSelectionRender(options);
}

function scheduleTimelineSelectionRender(options = {}) {
  state.timelineRenderOptions = mergeTimelineRenderOptions(state.timelineRenderOptions, options);
  if (state.timelineRenderFrame) return;
  state.timelineRenderFrame = requestAnimationFrame(() => {
    state.timelineRenderFrame = 0;
    const pendingOptions = state.timelineRenderOptions ?? {};
    state.timelineRenderOptions = null;
    renderTimelineSelection(pendingOptions);
  });
}

function mergeTimelineRenderOptions(previous, next) {
  const merged = { ...(previous ?? {}), ...(next ?? {}) };
  if (previous?.liveOnly && next && next.liveOnly !== true) {
    merged.liveOnly = false;
  }
  if (next?.heavy === true) {
    merged.heavy = true;
  }
  return merged;
}

function renderTimelineSelection(options = {}) {
  const selected = getSelectedDay();
  renderDayTimeline(selected);
  if (options.liveOnly) {
    return;
  }
  renderTimingWindow(selected);
  renderConditionBrief(selected);
  renderMetrics(selected);
  renderWaterInsights(selected);

  if (options.heavy !== false) {
    scheduleTimelineHeavyRender(selected);
  }
}

function scheduleTimelineHeavyRender(selected = getSelectedDay()) {
  if (state.timelineHeavyRenderTimer) {
    clearTimeout(state.timelineHeavyRenderTimer);
  }
  state.timelineHeavyRenderTimer = setTimeout(() => {
    state.timelineHeavyRenderTimer = 0;
    const day = selected ?? getSelectedDay();
    renderActivity(day);
    renderTides(day);
    renderChart();
    renderAtmosphereChart();
    renderAstro(day);
    drawCompass();
  }, 120);
}

function invalidateLiveTimelineCache() {
  state.liveTimelinePayloadKey = "";
  state.liveTimelinePayload = null;
}

function shiftTimelineDay(direction) {
  const days = state.days.slice(0, 10);
  if (!days.length) return;
  const currentIndex = Math.max(0, days.findIndex((day) => day.date === state.selectedDate));
  const nextIndex = clamp(currentIndex + direction, 0, days.length - 1);
  const day = days[nextIndex];
  if (!day || day.date === state.selectedDate) return;
  const lockedForecast = !canUseFeature("planning.10day") && nextIndex >= FREE_FORECAST_DAY_LIMIT;
  if (lockedForecast) {
    showProGate("planning.10day");
    return;
  }
  state.selectedDate = day.date;
  state.timelineMinute = selectedTimelineMinute();
  renderAll();
}

function handleLiveTimelinePointer(event) {
  if (!els.liveTimelineCanvas) return;
  if (event.type === "pointermove" && event.buttons !== 1) return;
  event.preventDefault();
  if (event.pointerId != null && event.type === "pointerdown") {
    els.liveTimelineCanvas.setPointerCapture?.(event.pointerId);
    state.liveTimelinePointerStart = {
      x: event.clientX,
      y: event.clientY,
      minute: selectedTimelineMinute(),
    };
  }
  const rect = els.liveTimelineCanvas.getBoundingClientRect();
  const x = clamp(event.clientX - rect.left, 0, rect.width);
  const minute = normalizeTimelineMinute((x / Math.max(1, rect.width)) * 1425);
  setTimelineMinute(minute, { heavy: false, liveOnly: true });
}

function handleLiveTimelineRelease(event) {
  const start = state.liveTimelinePointerStart;
  state.liveTimelinePointerStart = null;
  if (!start) return;
  const dx = event.clientX - start.x;
  const dy = event.clientY - start.y;
  if (Math.abs(dx) < 72 || Math.abs(dx) < Math.abs(dy) * 1.35) {
    scheduleTimelineSelectionRender({ heavy: true });
    scheduleTimelineHeavyRender();
    return;
  }
  state.timelineMinute = start.minute;
  shiftTimelineDay(dx < 0 ? 1 : -1);
  scheduleTimelineHeavyRender();
}

function scheduleLiveTimelineAnimation() {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
    state.liveTimelineProgress = 1;
    renderDayTimeline(getSelectedDay());
    return;
  }
  if (!window.requestAnimationFrame) {
    state.liveTimelineProgress = 1;
    return;
  }
  if (state.liveTimelineAnimationFrame) {
    cancelAnimationFrame(state.liveTimelineAnimationFrame);
  }
  const start = performance.now();
  const duration = 620;
  const tick = (timestamp) => {
    const raw = clamp((timestamp - start) / duration, 0, 1);
    state.liveTimelineProgress = 1 - Math.pow(1 - raw, 3);
    renderLiveTimeline(hybridTimelinePayload(getSelectedDay()), {
      isToday: getSelectedDay()?.date === localDateKey(),
      nowMinute: normalizeTimelineMinute(new Date().getHours() * 60 + new Date().getMinutes()),
    });
    if (raw < 1) {
      state.liveTimelineAnimationFrame = requestAnimationFrame(tick);
    } else {
      state.liveTimelineAnimationFrame = 0;
      state.liveTimelineProgress = 1;
    }
  };
  state.liveTimelineAnimationFrame = requestAnimationFrame(tick);
}

async function resolveSpotContext(lat, lon) {
  const requestId = state.spotResolutionRequestId + 1;
  const previousResolution = state.spotResolution;
  state.spotResolutionRequestId = requestId;
  state.spotResolutionLoading = true;
  state.spotResolutionError = "";
  renderSpotResolution();

  try {
    const url = buildSpotResolveUrl(lat, lon);
    const payload = await fetchJson(url, { timeoutMs: 8500 });
    if (requestId !== state.spotResolutionRequestId) return state.spotResolution;

    const resolution = mergeKnownSpotResolution(
      normalizeSpotResolution(payload, lat, lon),
      previousResolution,
      lat,
      lon,
    );
    state.spotResolution = resolution;
    applyResolvedWaterMode(resolution);
    return resolution;
  } catch (error) {
    if (requestId !== state.spotResolutionRequestId) return state.spotResolution;
    state.spotResolutionError = error?.message || "Analyse indisponible";
    state.spotResolution = fallbackSpotResolution(lat, lon);
    return state.spotResolution;
  } finally {
    if (requestId === state.spotResolutionRequestId) {
      state.spotResolutionLoading = false;
      renderSpotResolution();
      updateSpotMeta();
      renderPreferenceControls(getSelectedDay());
    }
  }
}

function buildSpotResolveUrl(lat, lon) {
  const url = buildAppApiUrl(SPOT_RESOLVE_API_PATH);
  url.searchParams.set("latitude", Number(lat).toFixed(5));
  url.searchParams.set("longitude", Number(lon).toFixed(5));
  return url;
}

function buildSpotSearchUrl(query) {
  const url = buildAppApiUrl(SPOT_SEARCH_API_PATH);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "8");
  return url;
}

function buildNearbySpotsUrl(lat, lon) {
  const url = buildAppApiUrl(NEARBY_SPOTS_API_PATH);
  url.searchParams.set("latitude", Number(lat).toFixed(5));
  url.searchParams.set("longitude", Number(lon).toFixed(5));
  url.searchParams.set("radius", "20000");
  url.searchParams.set("limit", "12");
  url.searchParams.set("waterMode", state.waterMode);
  return url;
}

async function searchSpotLocations() {
  const query = (els.spotSearchInput?.value || "").trim();
  if (query.length < 2) {
    state.spotSearchResults = [];
    state.spotSearchError = "Saisis au moins 2 caractères";
    state.spotSearchLoading = false;
    renderSpotSearchResults();
    renderMapMarkers();
    return;
  }

  const requestId = state.spotSearchRequestId + 1;
  state.spotSearchRequestId = requestId;
  state.spotSearchLoading = true;
  state.spotSearchError = "";
  state.spotSearchResults = [];
  renderSpotSearchResults();
  renderMapMarkers();

  try {
    const payload = await fetchJson(buildSpotSearchUrl(query), { timeoutMs: 9000 });
    if (requestId !== state.spotSearchRequestId) return;
    state.spotSearchResults = normalizeSpotSearchResults(payload);
    state.spotSearchError = state.spotSearchResults.length ? "" : "Aucun résultat";
  } catch (error) {
    if (requestId !== state.spotSearchRequestId) return;
    state.spotSearchResults = [];
    state.spotSearchError = error?.message || "Recherche indisponible";
  } finally {
    if (requestId === state.spotSearchRequestId) {
      state.spotSearchLoading = false;
      renderSpotSearchResults();
      renderMapMarkers();
    }
  }
}

async function loadNearbySpots() {
  const active = getActiveSpot();
  if (!isValidNumber(active.lat) || !isValidNumber(active.lon)) {
    state.nearbySpotResults = [];
    state.nearbySpotError = "Coordonnées invalides";
    state.nearbySpotLoading = false;
    renderNearbySpotResults();
    renderMapMarkers();
    return;
  }

  const requestId = state.nearbySpotRequestId + 1;
  state.nearbySpotRequestId = requestId;
  state.nearbySpotLoading = true;
  state.nearbySpotError = "";
  state.nearbySpotResults = [];
  renderNearbySpotResults();
  renderMapMarkers();

  try {
    const payload = await fetchJson(buildNearbySpotsUrl(active.lat, active.lon), { timeoutMs: 25000 });
    if (requestId !== state.nearbySpotRequestId) return;
    state.nearbySpotResults = normalizeNearbySpotResults(payload);
    state.nearbySpotError = state.nearbySpotResults.length ? "" : "Aucun spot proche trouvé";
  } catch (error) {
    if (requestId !== state.nearbySpotRequestId) return;
    state.nearbySpotResults = [];
    const message = error?.message || "";
    state.nearbySpotError = message.startsWith("Délai dépassé")
      ? "La recherche prend trop longtemps"
      : (message || "Exploration indisponible");
  } finally {
    if (requestId === state.nearbySpotRequestId) {
      state.nearbySpotLoading = false;
      renderNearbySpotResults();
      renderMapMarkers();
    }
  }
}

function normalizeSpotSearchResults(payload) {
  if (!payload?.ok || !Array.isArray(payload.results)) return [];

  return payload.results
    .map((item) => ({
      id: String(item.id || `${item.latitude},${item.longitude}`),
      name: String(item.name || "").trim(),
      detail: String(item.detail || item.displayName || "").trim(),
      lat: numberOrNull(item.latitude),
      lon: numberOrNull(item.longitude),
      waterKind: typeof item.waterKind === "string" ? item.waterKind : "unknown",
      waterMode: item.waterMode ? normalizeWaterMode(item.waterMode) : null,
      countryCode: typeof item.countryCode === "string" ? item.countryCode : "",
    }))
    .filter((item) => item.name && isValidNumber(item.lat) && isValidNumber(item.lon));
}

function normalizeNearbySpotResults(payload) {
  if (!payload?.ok || !Array.isArray(payload.results)) return [];

  return payload.results
    .map((item) => ({
      id: String(item.id || `${item.latitude},${item.longitude}`),
      name: String(item.name || "").trim(),
      detail: String(item.detail || item.displayName || "").trim(),
      lat: numberOrNull(item.latitude),
      lon: numberOrNull(item.longitude),
      waterKind: typeof item.waterKind === "string" ? item.waterKind : "unknown",
      waterMode: item.waterMode ? normalizeWaterMode(item.waterMode) : null,
      countryCode: typeof item.countryCode === "string" ? item.countryCode : "",
      distanceMeters: numberOrNull(item.distanceMeters),
    }))
    .filter((item) => item.name && item.waterMode && isValidNumber(item.lat) && isValidNumber(item.lon));
}

function renderSpotSearchResults() {
  if (!els.spotSearchResults) return;

  const shouldShow = state.spotSearchLoading || state.spotSearchError || state.spotSearchResults.length > 0;
  els.spotSearchResults.hidden = !shouldShow;
  if (!shouldShow) {
    els.spotSearchResults.innerHTML = "";
    return;
  }

  if (state.spotSearchLoading) {
    els.spotSearchResults.innerHTML = `<span class="spot-search-state">${escapeHtml(t("Recherche en cours"))}</span>`;
    return;
  }

  if (state.spotSearchError && !state.spotSearchResults.length) {
    els.spotSearchResults.innerHTML = `<span class="spot-search-state">${escapeHtml(t(state.spotSearchError))}</span>`;
    return;
  }

  els.spotSearchResults.innerHTML = state.spotSearchResults.map((result) => {
    const modeLabel = result.waterMode
      ? t(waterModeConfig[result.waterMode]?.label ?? "Spot")
      : t("Spot mondial");
    const country = result.countryCode ? ` · ${result.countryCode}` : "";
    return `
      <button class="spot-search-result" type="button" data-spot-search-result="${escapeHtml(result.id)}">
        <span>
          <strong>${escapeHtml(result.name)}</strong>
          <small>${escapeHtml(result.detail || formatCoordinates(result.lat, result.lon))}</small>
        </span>
        <em>${escapeHtml(`${modeLabel}${country}`)}</em>
      </button>
    `;
  }).join("");
}

function renderNearbySpotResults() {
  if (!els.nearbySpotResults) return;

  const shouldShow = state.nearbySpotLoading || state.nearbySpotError || state.nearbySpotResults.length > 0;
  els.nearbySpotResults.hidden = !shouldShow;
  if (!shouldShow) {
    els.nearbySpotResults.innerHTML = "";
    return;
  }

  if (state.nearbySpotLoading) {
    els.nearbySpotResults.innerHTML = `<span class="spot-search-state">${escapeHtml(t("Recherche des eaux proches"))}</span>`;
    return;
  }

  if (state.nearbySpotError && !state.nearbySpotResults.length) {
    els.nearbySpotResults.innerHTML = `<span class="spot-search-state">${escapeHtml(t(state.nearbySpotError))}</span>`;
    return;
  }

  els.nearbySpotResults.innerHTML = state.nearbySpotResults.map((result) => {
    const modeLabel = result.waterMode
      ? t(waterModeConfig[result.waterMode]?.label ?? "Spot")
      : t("Spot mondial");
    const distance = isValidNumber(result.distanceMeters) ? ` · ${formatMapDistance(result.distanceMeters)}` : "";
    const name = localizeNearbySpotText(result.name);
    const detail = localizeNearbySpotText(result.detail || formatCoordinates(result.lat, result.lon));
    return `
      <button class="spot-search-result nearby-spot-result" type="button" data-nearby-spot-result="${escapeHtml(result.id)}">
        <span>
          <strong>${escapeHtml(name)}</strong>
          <small>${escapeHtml(detail)}</small>
        </span>
        <em>${escapeHtml(`${modeLabel}${distance}`)}</em>
      </button>
    `;
  }).join("");
}

function localizeNearbySpotText(value) {
  if (!value) return "";
  return t(value);
}

function selectSpotSearchResult(id) {
  const result = state.spotSearchResults.find((item) => item.id === id);
  if (!result) return;

  if (els.spotSearchInput) {
    els.spotSearchInput.value = result.name;
    els.spotSearchInput.blur();
  }
  state.spotSearchResults = [];
  state.spotSearchError = "";
  state.nearbySpotResults = [];
  state.nearbySpotError = "";
  state.pendingSpot = null;
  if (result.waterMode) {
    setWaterMode(result.waterMode, { load: false });
  }
  state.spotResolution = provisionalSpotResolutionFromSearchResult(result);
  setCustomSpot(result.lat, result.lon, { load: true, name: result.name });
  setSpotPanelOpen(false);
}

function selectNearbySpotResult(id) {
  const result = state.nearbySpotResults.find((item) => item.id === id);
  if (!result) return;

  state.nearbySpotResults = [];
  state.nearbySpotError = "";
  state.spotSearchResults = [];
  state.spotSearchError = "";
  state.pendingSpot = null;
  if (result.waterMode) {
    setWaterMode(result.waterMode, { load: false });
  }
  state.spotResolution = provisionalSpotResolutionFromSearchResult(result);
  setCustomSpot(result.lat, result.lon, { load: true, name: result.name });
  setSpotPanelOpen(false);
}

function normalizeSpotResolution(payload, lat, lon) {
  const waterMode = payload?.waterMode ? normalizeWaterMode(payload.waterMode) : null;
  const waterKind = typeof payload?.waterKind === "string" ? payload.waterKind : "unknown";
  const confidence = ["high", "medium", "low"].includes(payload?.confidence) ? payload.confidence : "low";
  const name = typeof payload?.name === "string" && payload.name.trim()
    ? payload.name.trim()
    : getCustomSpotName(lat, lon);

  return {
    ok: payload?.ok !== false,
    latitude: roundNumber(lat, 5),
    longitude: roundNumber(lon, 5),
    name,
    waterKind,
    waterMode,
    confidence,
    confidenceScore: isValidNumber(payload?.confidenceScore) ? payload.confidenceScore : null,
    countryCode: typeof payload?.countryCode === "string" ? payload.countryCode : "",
    distanceMeters: isValidNumber(payload?.distanceMeters) ? payload.distanceMeters : null,
    providers: Array.isArray(payload?.providers) ? payload.providers : [],
    badges: Array.isArray(payload?.badges) ? payload.badges.filter((badge) => typeof badge === "string") : [],
    sources: payload?.sources && typeof payload.sources === "object" ? payload.sources : {},
    resolvedAt: new Date().toISOString(),
  };
}

function provisionalSpotResolutionFromSearchResult(result) {
  return {
    ok: true,
    latitude: roundNumber(result.lat, 5),
    longitude: roundNumber(result.lon, 5),
    name: result.name || getCustomSpotName(result.lat, result.lon),
    waterKind: result.waterKind || "unknown",
    waterMode: result.waterMode || null,
    confidence: result.waterMode ? "medium" : "low",
    confidenceScore: result.waterMode ? 0.68 : 0.35,
    countryCode: result.countryCode || "",
    distanceMeters: null,
    providers: [
      { id: "openstreetmap", label: "OpenStreetMap", status: "available", quality: "context", variables: ["place-search"] },
      { id: "open-meteo-weather", label: "Open-Meteo Weather", status: "available", quality: "forecast" },
    ],
    badges: result.waterMode === WATER_MODES.FRESHWATER
      ? ["weather-global", "freshwater"]
      : result.waterMode === WATER_MODES.SEA
        ? ["weather-global", "marine-partial"]
        : ["weather-global", "manual-check"],
    sources: { osmSearch: "available" },
    resolvedAt: new Date().toISOString(),
  };
}

function mergeKnownSpotResolution(resolution, previous, lat, lon) {
  if (resolution?.waterMode || !previous?.waterMode) return resolution;
  if (!sameSpotResolutionLocation(previous, lat, lon)) return resolution;

  return {
    ...resolution,
    waterKind: resolution.waterKind && resolution.waterKind !== "unknown" ? resolution.waterKind : previous.waterKind,
    waterMode: previous.waterMode,
    confidence: previous.confidence ?? resolution.confidence,
    confidenceScore: max([resolution.confidenceScore, previous.confidenceScore].filter(isValidNumber)) ?? resolution.confidenceScore,
    countryCode: resolution.countryCode || previous.countryCode,
    providers: resolution.providers?.length ? resolution.providers : previous.providers,
    badges: resolution.badges?.length ? Array.from(new Set([...resolution.badges, ...(previous.badges ?? [])])) : previous.badges,
    sources: { ...(previous.sources ?? {}), ...(resolution.sources ?? {}) },
  };
}

function sameSpotResolutionLocation(resolution, lat, lon) {
  if (!isValidNumber(resolution?.latitude) || !isValidNumber(resolution?.longitude)) return false;
  return Math.abs(resolution.latitude - roundNumber(lat, 5)) < 0.0001
    && Math.abs(resolution.longitude - roundNumber(lon, 5)) < 0.0001;
}

function fallbackSpotResolution(lat, lon) {
  const mode = state.waterMode;
  return {
    ok: false,
    latitude: roundNumber(lat, 5),
    longitude: roundNumber(lon, 5),
    name: getActiveSpot()?.name || getCustomSpotName(lat, lon),
    waterKind: isSeaMode() ? "sea" : "freshwater",
    waterMode: mode,
    confidence: "low",
    confidenceScore: 0.25,
    countryCode: "",
    distanceMeters: null,
    providers: [
      { id: "open-meteo-weather", label: "Open-Meteo Weather", status: "available", quality: "forecast" },
      ...(isSeaMode() ? [{ id: "open-meteo-marine", label: "Open-Meteo Marine", status: "candidate", quality: "forecast" }] : []),
    ],
    badges: isSeaMode() ? ["weather-global", "marine-partial", "manual-check"] : ["weather-global", "freshwater", "manual-check"],
    sources: {},
    resolvedAt: new Date().toISOString(),
  };
}

function applyResolvedWaterMode(resolution) {
  const nextMode = resolution?.waterMode ? normalizeWaterMode(resolution.waterMode) : null;
  if (!nextMode || nextMode === state.waterMode) return;
  setWaterMode(nextMode, { load: false });
}

async function loadForecast() {
  const requestId = state.forecastRequestId + 1;
  state.forecastRequestId = requestId;
  const isCurrentForecast = () => requestId === state.forecastRequestId;
  const lat = Number(els.latitude.value);
  const lon = Number(els.longitude.value);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    setStatus("Coordonnées invalides", "error");
    return;
  }

  setStatus("Chargement", "loading");
  saveSettings();

  try {
    state.riverForecast = null;
    state.riverForecastAvailable = false;
    state.riverForecastError = "";
    await resolveSpotContext(lat, lon);
    if (!isCurrentForecast()) return;

    const [weatherResult, marineResult, riverResult] = await Promise.allSettled([
      loadWeatherPayload(lat, lon),
      loadMarinePayload(lat, lon),
      loadRiverForecast(lat, lon),
    ]);
    if (!isCurrentForecast()) return;

    const weather = weatherResult.status === "fulfilled" ? weatherResult.value : null;
    const marine = marineResult.status === "fulfilled" ? marineResult.value : null;
    const river = riverResult.status === "fulfilled" ? riverResult.value : null;
    const weatherError = weatherResult.status === "rejected" ? weatherResult.reason : null;
    const marineError = marineResult.status === "rejected" ? marineResult.reason : null;
    const riverError = riverResult.status === "rejected" ? riverResult.reason : null;

    if (!weather && (!isSeaMode() || !marine)) {
      throw new Error(formatForecastLoadError(weatherError, marineError));
    }

    state.realDepthAvailable = false;
    state.realDepthError = "";
    state.riverForecast = river;
    state.riverForecastAvailable = !isSeaMode() && Boolean(river?.days?.length);
    state.riverForecastError = riverError?.message || (!isSeaMode() && !river?.days?.length ? "GloFAS indispo" : "");
    state.hours = mergeHourlyData(weather ?? buildMarineOnlyWeatherPayload(marine), marine);
    state.days = applyRiverForecastToDays(buildDailySummaries(state.hours), river);
    state.selectedDate = state.days[0]?.date ?? "";
    state.timelineMinute = defaultTimelineMinute(getSelectedDay());
    invalidateLiveTimelineCache();

    if (!state.days.length) {
      throw new Error("Aucune donnée horaire exploitable pour ce spot.");
    }

    safeRenderAll();
    const preliminaryStatus = forecastStatusLabel({ weather, marine, river, weatherError, marineError, riverError, realDepthApplied: false });
    setStatus(preliminaryStatus.label, preliminaryStatus.mode);
    const realDepthApplied = isSeaMode() ? await loadRealDepthCurrents(lat, lon, requestId) : false;
    if (!isCurrentForecast()) return;

    const status = forecastStatusLabel({ weather, marine, river, weatherError, marineError, riverError, realDepthApplied });
    setStatus(status.label, status.mode);
  } catch (error) {
    if (!isCurrentForecast()) return;
    console.error(error);
    setStatus("Erreur", "error");
    els.metricGrid.innerHTML = `<article class="metric-card metric-card-wide"><strong class="metric-value">Données indisponibles</strong><span class="metric-detail">${escapeHtml(error.message)}</span></article>`;
  }
}

async function loadWeatherPayload(lat, lon) {
  const errors = [];

  for (const endpoint of WEATHER_API_FALLBACKS) {
    try {
      return await fetchJson(buildWeatherUrl(lat, lon, endpoint));
    } catch (error) {
      errors.push(apiErrorSummary(endpoint, error));
    }
  }

  try {
    return normalizeMetNoWeather(await fetchJson(buildMetNoWeatherUrl(lat, lon), { timeoutMs: 12000 }));
  } catch (error) {
    errors.push(apiErrorSummary(METNO_API, error));
  }

  throw new Error(errors.join(" · ") || "Prévision météo indisponible");
}

async function loadMarinePayload(lat, lon) {
  if (!isSeaMode()) return null;
  return fetchJson(buildMarineUrl(lat, lon));
}

async function loadRiverForecast(lat, lon) {
  if (isSeaMode()) return null;
  return normalizeRiverForecast(await fetchJson(buildRiverForecastUrl(lat, lon), { timeoutMs: 10000 }));
}

function buildWeatherUrl(lat, lon, endpoint = WEATHER_API) {
  const url = new URL(endpoint);
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set(
    "hourly",
    "temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,pressure_msl,cloud_cover,precipitation",
  );
  url.searchParams.set("daily", "wind_speed_10m_max,wind_direction_10m_dominant,sunrise,sunset");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "10");
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
  url.searchParams.set("forecast_days", "10");
  url.searchParams.set("cell_selection", "sea");
  return url;
}

function buildRiverForecastUrl(lat, lon) {
  const url = buildAppApiUrl(RIVER_FORECAST_API_PATH);
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set("forecast_days", "10");
  return url;
}

function normalizeRiverForecast(payload) {
  if (!payload?.ok || !Array.isArray(payload.days)) return null;

  const days = payload.days
    .map((day) => ({
      date: typeof day.date === "string" ? day.date : "",
      discharge: numberOrNull(day.discharge),
      min: numberOrNull(day.min),
      max: numberOrNull(day.max),
      delta: numberOrNull(day.delta),
      deltaPercent: numberOrNull(day.deltaPercent),
      anomalyPercent: numberOrNull(day.anomalyPercent),
      stress: numberOrNull(day.stress),
    }))
    .filter((day) => day.date && isValidNumber(day.discharge));

  return days.length
    ? {
        provider: payload.provider || "Open-Meteo Flood API",
        source: payload.source || "GloFAS",
        unit: payload.unit || "m³/s",
        days,
      }
    : null;
}

function buildMetNoWeatherUrl(lat, lon) {
  const url = new URL(METNO_API);
  url.searchParams.set("lat", lat.toFixed(4));
  url.searchParams.set("lon", lon.toFixed(4));
  return url;
}

async function fetchJson(url, options = {}) {
  const timeoutMs = options.timeoutMs ?? 9000;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const reason = typeof payload === "object" && (payload?.error || payload?.reason)
        ? payload.error || payload.reason
        : `Erreur API ${response.status}`;
      throw new Error(reason);
    }

    if (payload?.error) {
      throw new Error(payload.error || payload.reason || `Erreur API ${response.status}`);
    }

    return payload;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Délai dépassé après ${Math.round(timeoutMs / 1000)} s`);
    }
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

function buildMarineOnlyWeatherPayload(marine) {
  const timeline = marine?.hourly?.time ?? [];
  const dates = [...new Set(timeline.map((time) => time.slice(0, 10)).filter(Boolean))];
  const blank = Array.from({ length: timeline.length }, () => null);

  return {
    hourly: {
      time: timeline,
      temperature_2m: blank,
      wind_speed_10m: blank,
      wind_direction_10m: blank,
      wind_gusts_10m: blank,
      pressure_msl: blank,
      cloud_cover: blank,
      precipitation: blank,
    },
    daily: {
      time: dates,
      sunrise: dates.map(() => null),
      sunset: dates.map(() => null),
    },
  };
}

function normalizeMetNoWeather(payload) {
  const timeseries = payload?.properties?.timeseries;
  if (!Array.isArray(timeseries) || !timeseries.length) {
    throw new Error("MET Norway n'a pas renvoyé de données horaires.");
  }

  const rows = timeseries
    .map((point) => {
      const time = localIsoHourFromUtc(point.time);
      const details = point.data?.instant?.details ?? {};
      if (!time) return null;

      return {
        time,
        airTemperature: numberOrNull(details.air_temperature),
        windSpeed: metersPerSecondToKnots(details.wind_speed),
        windDirection: numberOrNull(details.wind_from_direction),
        windGust: metersPerSecondToKnots(details.wind_speed_of_gust),
        pressure: numberOrNull(details.air_pressure_at_sea_level),
        cloudCover: numberOrNull(details.cloud_area_fraction),
        precipitation: numberOrNull(point.data?.next_1_hours?.details?.precipitation_amount),
      };
    })
    .filter(Boolean);

  if (!rows.length) {
    throw new Error("MET Norway n'a pas renvoyé de points exploitables.");
  }

  const dailyTimes = [...new Set(rows.map((row) => row.time.slice(0, 10)))];

  return {
    hourly: {
      time: rows.map((row) => row.time),
      temperature_2m: rows.map((row) => row.airTemperature),
      wind_speed_10m: rows.map((row) => row.windSpeed),
      wind_direction_10m: rows.map((row) => row.windDirection),
      wind_gusts_10m: rows.map((row) => row.windGust),
      pressure_msl: rows.map((row) => row.pressure),
      cloud_cover: rows.map((row) => row.cloudCover),
      precipitation: rows.map((row) => row.precipitation),
    },
    daily: {
      time: dailyTimes,
      sunrise: dailyTimes.map(() => null),
      sunset: dailyTimes.map(() => null),
    },
    source: "metno",
  };
}

function localIsoHourFromUtc(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:00`;
}

function numberOrNull(value) {
  const number = Number(value);
  return isValidNumber(number) ? number : null;
}

function metersPerSecondToKnots(value) {
  const number = numberOrNull(value);
  return number == null ? null : number * METERS_PER_SECOND_TO_KNOTS;
}

function forecastStatusLabel({ weather, marine, river, weatherError, marineError, riverError, realDepthApplied }) {
  if (!weather && marine) return { label: "Marine seule", mode: "warning" };
  if (weather && isSeaMode() && !marine) return { label: "Météo seule", mode: "warning" };
  if (weather && !isSeaMode()) {
    if (river?.days?.length) return { label: riverError ? "Partiel" : "GloFAS actif", mode: riverError ? "warning" : "ready" };
    return { label: "GloFAS indispo", mode: "warning" };
  }
  if (weatherError || marineError) return { label: "Partiel", mode: "warning" };
  if (realDepthApplied) return { label: "Copernicus", mode: "ready" };
  return { label: isSeaMode() ? "Partiel" : "À jour", mode: isSeaMode() ? "warning" : "ready" };
}

function formatForecastLoadError(weatherError, marineError) {
  const details = [
    weatherError ? `Météo: ${weatherError.message}` : "",
    marineError ? `Marine: ${marineError.message}` : "",
  ].filter(Boolean);

  return details.join(" · ") || "Aucune donnée météo exploitable pour ce spot.";
}

function apiErrorSummary(endpoint, error) {
  let host = "API";
  try {
    host = new URL(endpoint).host;
  } catch {
    host = String(endpoint);
  }

  return `${host}: ${error.message}`;
}

async function loadRealDepthCurrents(lat, lon, forecastRequestId = state.forecastRequestId) {
  const isCurrentForecast = () => forecastRequestId === state.forecastRequestId;
  if (!isSeaMode() || !state.hours.length) return false;

  try {
    const url = buildDepthCurrentUrl(lat, lon);
    const response = await fetch(url);
    const payload = await response.json().catch(() => null);
    if (!isCurrentForecast()) return false;

    if (!response.ok) {
      state.realDepthAvailable = false;
      state.realDepthError = payload?.error || `Erreur API Copernicus ${response.status}`;
      renderAll();
      return false;
    }

    if (!payload.ok || !Array.isArray(payload.hours) || !payload.hours.length) {
      state.realDepthAvailable = false;
      state.realDepthError = payload?.error || "Copernicus Marine n'a pas renvoyé de courant profondeur.";
      renderAll();
      return false;
    }

    state.hours = applyRealDepthData(state.hours, payload);
    state.days = buildDailySummaries(state.hours);
    state.realDepthAvailable = true;
    state.realDepthError = "";
    renderAll();
    return true;
  } catch (error) {
    if (!isCurrentForecast()) return false;
    console.info("Courant profondeur Copernicus indisponible.", error);
    state.realDepthAvailable = false;
    state.realDepthError = error?.message || "Copernicus Marine indisponible.";
    renderAll();
    return false;
  }
}

function buildDepthCurrentUrl(lat, lon) {
  const start = state.hours[0]?.time;
  const end = state.hours.at(-1)?.time;
  const url = buildAppApiUrl("api/depth-current");
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set("depth", state.depth.toFixed(1));
  url.searchParams.set("start", start);
  url.searchParams.set("end", end);
  return url;
}

function buildAppApiUrl(path) {
  const configBase = typeof getRuntimeConfig().apiBaseUrl === "string" ? getRuntimeConfig().apiBaseUrl.trim() : "";
  const base = configBase || DEFAULT_API_BASE_URL || window.location.origin;
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = String(path).replace(/^\/+/, "");

  try {
    return new URL(cleanPath, normalizedBase);
  } catch (error) {
    console.info("Configuration API invalide, fallback origine locale.", error);
    return new URL(cleanPath, window.location.origin);
  }
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

function clearDepthCurrent(row) {
  return {
    ...row,
    depthCurrent: null,
    depthDirection: null,
    depthSource: "unavailable",
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
      depthCurrent: null,
      depthDirection: null,
      depthSource: "unavailable",
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
    const depthCurrent = realDepthRows.length ? average(pluck(realDepthRows, "depthCurrent")) : null;
    const depthDir = realDepthRows.length ? circularMean(pluck(realDepthRows, "depthDirection"), pluck(realDepthRows, "depthCurrent")) : null;
    const hourlyScores = rows.map((row) => scoreHour(row));
    const depthSource = realDepthRows.length ? "copernicus" : "unavailable";

    const day = {
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
      riverFlow: null,
      riverFlowMin: null,
      riverFlowMax: null,
      riverFlowTrend: null,
      riverFlowTrendPercent: null,
      riverFlowAnomaly: null,
      riverFlowStress: null,
      tideEvents: tideEvents(rows),
      turbidity: turbidityEstimate(rows),
      score: Math.round(average(hourlyScores) ?? 0),
      bestWindow: bestWindow(rows),
    };

    return {
      ...day,
      planningSummary: dailyPlanningSummary(day),
    };
  });
}

function applyRiverForecastToDays(days, river) {
  if (isSeaMode() || !river?.days?.length) return days;
  const byDate = new Map(river.days.map((day) => [day.date, day]));

  return days.map((day) => {
    const riverDay = byDate.get(day.date);
    if (!riverDay) return day;

    const enrichedDay = {
      ...day,
      riverFlow: riverDay.discharge,
      riverFlowMin: riverDay.min,
      riverFlowMax: riverDay.max,
      riverFlowTrend: riverDay.delta,
      riverFlowTrendPercent: riverDay.deltaPercent,
      riverFlowAnomaly: riverDay.anomalyPercent,
      riverFlowStress: riverDay.stress,
    };

    return {
      ...enrichedDay,
      planningSummary: dailyPlanningSummary(enrichedDay),
    };
  });
}

function dailyPlanningSummaries(days, options = {}) {
  return (days ?? []).map((day) => dailyPlanningSummary(day, options));
}

function dailyPlanningSummary(day, options = {}) {
  const rows = day?.rows ?? [];
  const best = day?.bestWindow ?? bestFishingWindowForDay(day, {
    waterMode: options.waterMode ?? state.waterMode,
    selectedSpecies: options.selectedSpecies ?? state.activityFish,
    targetDepth: options.targetDepth ?? state.depth,
    profile: options.profile ?? state.profile,
  });
  const peakSample = timelineSample(day, best?.peakMinute ?? selectedTimelineMinute());
  const goNoGo = day ? weatherGoNoGo(day, peakSample) : null;
  const windows = solunarWindows(day);
  const tideList = tideEventList(day?.tideEvents, rows).slice(0, 4);
  const sourceAvailability = best?.sourceAvailability ?? timingSourceAvailability(day, rows, state.waterMode);

  return {
    date: day?.date ?? "",
    label: day?.label ?? "",
    shortLabel: day?.shortLabel ?? "",
    score: isValidNumber(best?.score) ? best.score : (day?.score ?? 0),
    tone: best?.tone ?? timingWindowTone(day?.score ?? 0),
    conditionTone: day ? dayConditionTone(day) : "maybe",
    weatherRisk: {
      tone: goNoGo?.tone ?? "warn",
      label: goNoGo?.label ?? "À confirmer",
      reasons: goNoGo?.reasons ?? ["Données partielles"],
    },
    bestWindow: {
      label: best?.label ?? "--",
      startMinute: best?.startMinute ?? null,
      endMinute: best?.endMinute ?? null,
      peakMinute: best?.peakMinute ?? null,
      peakHour: best?.peakHour ?? "--",
      reasons: best?.reasons ?? [],
      risks: best?.risks ?? [],
    },
    tideEvents: tideList.map((event) => ({
      type: event.type,
      hour: event.hour,
      height: event.height,
      label: `${event.type === "high" ? "Pleine mer" : "Basse mer"} ${event.hour}`,
    })),
    moon: {
      phase: windows.phase,
      label: moonPhaseLabel(windows.phase),
      major: windows.major.map((window) => window.label),
      minor: windows.minor.map((window) => window.label),
    },
    weather: {
      icon: dailyWeatherIcon(day),
      windAvg: day?.windAvg ?? null,
      windMax: day?.windMax ?? null,
      windGustMax: day?.windGustMax ?? null,
      windDirection: day?.windDirection ?? null,
      waveAvg: day?.waveAvg ?? null,
      waveMax: day?.waveMax ?? null,
      waveDirection: day?.waveDirection ?? null,
      wavePeriod: day?.wavePeriod ?? null,
      surfaceCurrent: day?.surfaceCurrent ?? null,
      surfaceCurrentDirection: day?.surfaceCurrentDirection ?? null,
      precipitationTotal: day?.precipitationTotal ?? null,
      pressureTrend: day?.pressureTrend ?? null,
      riverFlow: day?.riverFlow ?? null,
      riverFlowTrend: day?.riverFlowTrend ?? null,
      riverFlowStress: day?.riverFlowStress ?? null,
    },
    sourceAvailability,
  };
}

function tideEventList(events, rows = []) {
  const source = events ?? tideEvents(rows);
  const rawEvents = Array.isArray(source)
    ? source
    : [
        source?.high ? { ...source.high, type: "high" } : null,
        source?.low ? { ...source.low, type: "low" } : null,
      ].filter(Boolean);

  return rawEvents
    .map((event) => ({
      type: event.type === "low" ? "low" : "high",
      hour: event.hour ?? (typeof event.time === "string" ? event.time.slice(11, 16) : "--"),
      height: event.height ?? event.seaLevel ?? null,
      time: event.time ?? null,
    }))
    .sort((a, b) => {
      if (!a.time || !b.time) return 0;
      return Date.parse(a.time) - Date.parse(b.time);
    });
}

function syncGlancePayload(day = getSelectedDay()) {
  const payload = buildGlancePayload(day);
  state.glancePayload = payload;
  updateAppStore((store) => {
    store.glancePayload = payload;
  });
  return payload;
}

function buildGlancePayload(day = getSelectedDay(), options = {}) {
  const active = getActiveSpot();
  const summary = day?.planningSummary ?? dailyPlanningSummary(day, options);
  const sample = timelineSample(day, summary.bestWindow.peakMinute ?? selectedTimelineMinute());
  const generatedAt = new Date().toISOString();
  const staleAfterMinutes = summary.sourceAvailability?.weather ? 90 : 30;

  return normalizeGlancePayload({
    version: 1,
    generatedAt,
    staleAt: new Date(Date.parse(generatedAt) + staleAfterMinutes * 60000).toISOString(),
    state: state.native.online ? "fresh" : "offline",
    spot: {
      id: active.id,
      name: active.name,
      lat: active.lat,
      lon: active.lon,
      waterMode: state.waterMode,
    },
    species: {
      id: normalizeActivityFish(state.activityFish),
      label: getFishLabel(normalizeActivityFish(state.activityFish)),
    },
    day: {
      date: summary.date,
      label: summary.shortLabel,
    },
    activity: {
      score: summary.score,
      tone: summary.tone,
      label: activityLabel(summary.score),
    },
    window: {
      label: summary.bestWindow.label,
      peakMinute: summary.bestWindow.peakMinute,
      peakHour: summary.bestWindow.peakHour,
      reasons: summary.bestWindow.reasons.slice(0, 2),
      risks: summary.bestWindow.risks.slice(0, 2),
    },
    water: glanceWaterPayload(summary, sample, day),
    weather: {
      risk: summary.weatherRisk.label,
      tone: summary.weatherRisk.tone,
      windSpeed: sample.windSpeed ?? summary.weather.windAvg,
      windDirection: sample.windDirection ?? summary.weather.windDirection,
      windGust: sample.windGust ?? summary.weather.windGustMax,
      waveHeight: isSeaMode() ? sample.waveHeight ?? summary.weather.waveAvg : null,
      surfaceCurrent: isSeaMode() ? sample.surfaceCurrent ?? summary.weather.surfaceCurrent : null,
      precipitation: sample.precipitation ?? summary.weather.precipitationTotal,
    },
    moon: {
      label: summary.moon.label,
      major: summary.moon.major.slice(0, 1),
      minor: summary.moon.minor.slice(0, 1),
    },
    sourceAvailability: summary.sourceAvailability,
  });
}

function glanceWaterPayload(summary, sample, day = getSelectedDay()) {
  if (!isSeaMode()) {
    return {
      type: "river",
      label: "Rivière",
      value: isValidNumber(summary.weather.riverFlow) ? formatRiverFlow(summary.weather.riverFlow) : "Débit à confirmer",
      trend: riverTrendLabel(summary.weather.riverFlowTrend),
    };
  }

  return {
    type: "tide",
    label: "Marée",
    value: timingTideFact(day, sample),
    events: summary.tideEvents.slice(0, 2).map((event) => ({
      type: event.type,
      hour: event.hour,
      height: event.height,
    })),
  };
}

function renderAll() {
  const selected = getSelectedDay();
  updateSpotMeta();
  renderSpotTools();
  renderDayTabs();
  renderPreferenceControls(selected);
  renderActivity(selected);
  renderTimingWindow(selected);
  renderPlanningView();
  renderTides(selected);
  renderConditionBrief(selected);
  renderMetrics(selected);
  renderWaterInsights(selected);
  renderDayTimeline(selected);
  renderRiggingCalculator(selected);
  drawCompass();
  renderChart();
  renderAtmosphereChart();
  renderAstro(selected);
  renderCatchJournal();
  renderMarineOverlay();
  renderSpotResolution();
  syncGlancePayload(selected);
  applyTranslations(document.body);
}

function renderSpotResolution() {
  const resolution = state.spotResolution;
  const kindLabel = spotWaterKindLabel(resolution);
  const confidenceLabel = resolution ? t(spotConfidenceLabels[resolution.confidence] ?? "Confiance faible") : t("Analyse mondiale");
  const badgeLabel = spotResolutionBadgeLabel(resolution);
  const detail = state.spotResolutionLoading
    ? t("Analyse en cours")
    : resolution
      ? `${kindLabel} · ${confidenceLabel}`
      : t("Analyse mondiale du spot");
  const context = state.spotResolutionLoading
    ? t("Analyse en cours")
    : resolution
      ? `${kindLabel} · ${spotProviderSummary(resolution)}`
      : t("Analyse mondiale du spot");

  if (els.activeSpotContext) {
    els.activeSpotContext.textContent = context;
    els.activeSpotContext.title = context;
  }

  if (els.spotResolutionStatus) {
    els.spotResolutionStatus.textContent = state.spotResolutionError && !state.spotResolutionLoading
      ? `${t("Analyse indisponible")} · ${detail}`
      : detail;
  }

  if (els.spotResolutionBadge) {
    els.spotResolutionBadge.textContent = badgeLabel;
    els.spotResolutionBadge.classList.toggle("is-warning", state.spotResolutionError && !state.spotResolutionLoading);
  }
}

function spotWaterKindLabel(resolution) {
  if (!resolution) return t("Spot mondial");
  return t(spotWaterKindLabels[resolution.waterKind] ?? "Type d'eau à confirmer");
}

function spotProviderSummary(resolution) {
  if (!resolution) return t("Source mondiale");
  const badges = (resolution.badges ?? [])
    .map((badge) => spotProviderBadgeLabels[badge])
    .filter(Boolean)
    .slice(0, 2)
    .map((label) => t(label));

  return badges.length ? badges.join(" · ") : t("Source mondiale");
}

function spotResolutionBadgeLabel(resolution) {
  if (state.spotResolutionLoading) return t("Auto");
  if (!resolution) return t("Auto");
  if (resolution.waterMode === WATER_MODES.SEA) return t("Marine mondiale");
  if (resolution.waterMode === WATER_MODES.FRESHWATER) return t("Eau douce");
  return t("Vérification manuelle");
}

function updateSpotMeta() {
  const lat = Number(els.latitude.value);
  const lon = Number(els.longitude.value);
  const name = getActiveSpot().name;
  const coords = formatCoordinates(lat, lon);
  els.spotMeta.textContent = `${t(waterModeConfig[state.waterMode].metaPrefix)} · ${name} · ${coords}`;
  if (els.spotSummaryName) els.spotSummaryName.textContent = name;
  if (els.spotSummaryCoords) els.spotSummaryCoords.textContent = coords;
}

function renderPreferenceControls(day = getSelectedDay()) {
  if (!els.preferencePanel) return;

  state.profile = normalizeProfile(state.profile);
  const profile = state.profile;
  const species = normalizeActivityFish(state.activityFish);

  els.profileButtons.forEach((button) => {
    const control = button.closest("[data-profile-control]")?.dataset.profileControl;
    const active = control ? profile[control] === button.dataset.profileValue : false;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  els.themeButtons.forEach((button) => {
    const active = state.theme === button.dataset.themeValue;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  if (els.languageSelect) {
    els.languageSelect.value = currentLanguage();
  }

  if (els.proToggle) {
    els.proToggle.checked = isProUser();
    els.proToggle.setAttribute("aria-checked", String(isProUser()));
  }

  if (els.proStatusLabel) {
    els.proStatusLabel.textContent = isProUser() ? t("Pro actif") : t("Gratuit");
    els.proStatusLabel.classList.toggle("is-pro", isProUser());
  }

  if (els.preferenceSpecies) {
    if (!els.preferenceSpecies.options.length) populatePreferenceSpecies();
    els.preferenceSpecies.value = species;
  }

  if (els.preferenceDepth) {
    els.preferenceDepth.value = String(state.depth);
    els.preferenceDepth.disabled = !isSeaMode();
  }

  if (els.preferenceDepthOutput) {
    els.preferenceDepthOutput.value = isSeaMode() ? `${state.depth} m` : "Eau douce";
  }

  if (els.preferenceSummary) {
    const chips = preferenceSummaryChips(day, profile, species);
    els.preferenceSummary.replaceChildren(...chips.map((label) => {
      const chip = document.createElement("span");
      chip.className = "preference-chip";
      chip.textContent = label;
      return chip;
    }));
  }

  renderSmartAlertSetup();
}

function renderSmartAlertSetup() {
  if (!els.smartAlertType) return;
  populateSmartAlertTypes();

  state.smartAlerts = normalizeSmartAlertSettings(state.smartAlerts);
  const type = SMART_ALERT_TYPES.includes(els.smartAlertType.value) ? els.smartAlertType.value : SMART_ALERT_TYPES[0];
  const config = SMART_ALERT_CATALOG[type];
  const alertSettings = state.smartAlerts.alerts[type];
  const scheduled = normalizeSmartAlertSchedule(state.smartAlertSchedule);

  els.smartAlertType.value = type;
  if (els.smartAlertSpot) els.smartAlertSpot.textContent = getActiveSpot().name;
  if (els.smartAlertSpecies) els.smartAlertSpecies.textContent = getFishLabel(normalizeActivityFish(state.activityFish));
  if (els.smartAlertEnabled) els.smartAlertEnabled.checked = Boolean(alertSettings?.enabled);
  if (els.smartAlertQuietStart) els.smartAlertQuietStart.value = state.smartAlerts.quietHours.start;
  if (els.smartAlertQuietEnd) els.smartAlertQuietEnd.value = state.smartAlerts.quietHours.end;
  const feature = smartAlertFeature(type);
  const locked = config.proRequired && !canUseFeature(feature);
  const panel = els.smartAlertType.closest(".smart-alert-preferences");
  panel?.classList.toggle("is-pro-locked", locked);
  panel?.setAttribute("data-pro-feature", locked ? feature : "");
  if (els.smartAlertEnabled) els.smartAlertEnabled.disabled = locked;
  if (els.smartAlertScheduleButton) els.smartAlertScheduleButton.classList.toggle("is-pro-locked", locked);
  if (els.smartAlertPreview) {
    const mode = config.proRequired ? "Pro" : "Inclus";
    const lock = locked ? ` ${proFeatureReason(feature)}` : "";
    const lead = config.deliveryTime ? `à ${config.deliveryTime}` : `${alertSettings.leadMinutes} min avant`;
    els.smartAlertPreview.textContent = `${config.label} · ${mode} · ${lead}. ${config.description} ${config.uncertaintyNote}${lock}`;
  }
  if (els.smartAlertStatus) {
    els.smartAlertStatus.textContent = scheduled.length
      ? `${scheduled.length} alertes programmées pour ${scheduled[0].spotName}.`
      : "Aucune alerte programmée.";
  }
}

function smartAlertFeature(type) {
  return {
    "wind-drop": "alerts.windDrop",
    "species-activity": "alerts.speciesActivity",
  }[type] ?? "alerts.basic";
}

function populateSmartAlertTypes() {
  if (!els.smartAlertType || els.smartAlertType.options.length) return;
  SMART_ALERT_TYPES.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = SMART_ALERT_CATALOG[type].label;
    els.smartAlertType.append(option);
  });
}

function updateSelectedSmartAlert(partial = {}) {
  if (!els.smartAlertType) return;
  const type = SMART_ALERT_TYPES.includes(els.smartAlertType.value) ? els.smartAlertType.value : SMART_ALERT_TYPES[0];
  state.smartAlerts = normalizeSmartAlertSettings(state.smartAlerts);
  state.smartAlerts.alerts[type] = {
    ...state.smartAlerts.alerts[type],
    ...partial,
  };
  saveSettings();
  renderSmartAlertSetup();
}

function updateSmartAlertQuietHours() {
  state.smartAlerts = normalizeSmartAlertSettings({
    ...state.smartAlerts,
    quietHours: {
      start: els.smartAlertQuietStart?.value,
      end: els.smartAlertQuietEnd?.value,
    },
  });
  saveSettings();
  renderSmartAlertSetup();
}

async function handleSmartAlertSchedule() {
  const type = SMART_ALERT_TYPES.includes(els.smartAlertType?.value) ? els.smartAlertType.value : SMART_ALERT_TYPES[0];
  const feature = smartAlertFeature(type);
  if (!canUseFeature(feature)) {
    showProGate(feature);
    return;
  }

  if (!state.notificationsEnabled || state.native.notificationPermission !== "granted") {
    await requestNotificationPermission();
  }
  const result = await scheduleSmartFishingAlerts();
  if (els.smartAlertStatus) els.smartAlertStatus.textContent = result.message;
  renderSmartAlertSetup();
}

async function handleSmartAlertCancel() {
  const result = await cancelSmartFishingAlerts();
  if (els.smartAlertStatus) els.smartAlertStatus.textContent = `${result.canceled} alertes annulées.`;
  renderSmartAlertSetup();
}

function preferenceSummaryChips(day, profile, species) {
  return [
    t(waterModeConfig[state.waterMode]?.label),
    `${t("Cible")} ${getFishLabel(species)}`,
    profileOptionLabel("approach", profile.approach),
    profileOptionLabel("experience", profile.experience),
    isProUser() ? t("Pro actif") : t("Gratuit"),
    state.theme === "dark" ? t("Mode sombre") : t("Mode clair"),
    isSeaMode() ? `${state.depth} m` : null,
    preferenceFocusChip(day, profile.priority),
  ].filter(Boolean);
}

function preferenceFocusChip(day, priority) {
  if (priority === "weather") {
    return day ? `${t("Vent")} ${formatNumber(day.windAvg, 0)} kt` : profileOptionLabel("priority", priority);
  }

  if (priority === "spots") {
    return `${countKnownFishingSpotsForFilter(state.activityFish)} coins`;
  }

  return day?.bestWindow?.label ? `${t("Créneau")} ${day.bestWindow.label}` : profileOptionLabel("priority", priority);
}

function profileOptionLabel(control, value) {
  return t(profileOptions[control]?.find((option) => option.id === value)?.label ?? value);
}

function setLanguagePreference(language) {
  const nextLanguage = normalizeLanguage(language);
  if (state.language === nextLanguage) return;
  state.language = nextLanguage;
  document.documentElement.lang = nextLanguage;
  if (els.languageSelect) els.languageSelect.value = nextLanguage;
  saveSettings();
  populateActivityFish();
  populateCatchSpecies();
  populatePreferenceSpecies();
  populateRiggingTechniques();
  applyWaterModeUI();
  applyMobileNavigationUI();
  renderAll();
  renderNativeStatus();
  applyTranslations(document.body);
}

function setProfilePreference(control, value) {
  if (!profileOptions[control]) return;

  state.profile = normalizeProfile({
    ...state.profile,
    [control]: value,
  });

  if (control === "priority" && state.profile.priority === "spots") {
    state.activeFishFilters = normalizeFishFilters([state.activityFish]);
    state.fishFilterOpen = false;
    renderFishFilterControls();
    renderKnownFishingMarkers();
    updateKnownFishingOverlay();
  }

  renderPreferenceControls(getSelectedDay());
  saveSettings();
}

function setThemePreference(theme) {
  const nextTheme = normalizeTheme(theme);
  if (state.theme === nextTheme) {
    renderPreferenceControls(getSelectedDay());
    return;
  }

  state.theme = nextTheme;
  applyTheme({ render: true });
  renderPreferenceControls(getSelectedDay());
  saveSettings();
}

function setProStatus(isPro) {
  const nextValue = Boolean(isPro);
  if (state.isPro === nextValue) {
    renderPreferenceControls(getSelectedDay());
    return;
  }

  state.isPro = nextValue;
  applySubscriptionState();
  renderAll();
  renderPreferenceControls(getSelectedDay());
  saveSettings();
}

function setPreferredSpecies(fish, options = {}) {
  state.activityFish = normalizeActivityFish(fish);

  if (els.activityFish) els.activityFish.value = state.activityFish;
  if (els.catchSpecies) els.catchSpecies.value = state.activityFish;

  if (options.syncMap) {
    state.activeFishFilters = normalizeFishFilters([state.activityFish]);
    state.fishFilterOpen = false;
    renderFishFilterControls();
    renderKnownFishingMarkers();
    updateKnownFishingOverlay();
  }

  renderAll();
  saveSettings();
}

function renderDayTabs() {
  els.dayTabs.innerHTML = "";
  els.dayTabs.classList.toggle("is-forecast-expanded", state.forecastExpanded);
  const days = state.days.slice(0, 10);
  const lockedForecast = !canUseFeature("planning.10day");

  if (!days.length) {
    els.dayTabs.innerHTML = `
      <div class="forecast-strip-head">
        <div>
          <span class="eyebrow">Prévision</span>
          <h2>Prévisions 10 jours</h2>
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
      <h2>Prévisions 10 jours</h2>
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

  days.forEach((day, index) => {
    const activityScore = dayActivityScore(day);
    const weather = dailyWeatherIcon(day);
    const waterTemperature = dailyWaterTemperature(day);
    const conditionTone = dayConditionTone(day);
    const locked = lockedForecast && index >= FREE_FORECAST_DAY_LIMIT;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "day-tab";
    button.classList.add(`condition-${conditionTone}`);
    button.classList.toggle("is-pro-locked", locked);
    button.classList.toggle("is-active", day.date === state.selectedDate);
    button.setAttribute("aria-pressed", String(day.date === state.selectedDate));
    button.dataset.locked = String(locked);
    button.title = `${weather.label} · ${conditionToneLabel(conditionTone)}`;
    button.innerHTML = `
      <span class="day-tab-date">
        <strong>${escapeHtml(formatWeekday3(day.date))}</strong>
        <em>${escapeHtml(formatShortDateNoWeekday(day.date))}</em>
      </span>
      ${locked ? `<span class="pro-lock-badge day-tab-lock"><i class="ti ti-lock" aria-hidden="true"></i>Pro</span>` : ""}
      <i class="ti ${weather.icon} day-tab-weather" aria-hidden="true"></i>
      <span class="day-tab-temperatures">
        <span>Air ${escapeHtml(formatTemperatureBrief(day.airTemperature))}</span>
        <span>Eau ${escapeHtml(formatTemperatureBrief(waterTemperature))}</span>
      </span>
      <span class="day-tab-stats">
        ${forecastConditionRows(day).map((row) => `
          <span>
            <b>${escapeHtml(row.label)}</b>
            <em>${escapeHtml(row.value)}</em>
          </span>
        `).join("")}
      </span>
      <span class="day-tab-score ${scoreClass(activityScore)}">${activityScore}</span>
    `;
    button.addEventListener("click", () => {
      if (button.dataset.locked === "true") {
        showProGate("planning.10day");
        return;
      }
      state.selectedDate = day.date;
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
  const timelineScore = timelineSample(day).score ?? highlightedRow?.score ?? averageScore;
  const windows = solunarWindows(day);

  els.activityScore.textContent = String(averageScore);
  els.activityRing.style.setProperty("--activity-score", averageScore);
  els.activityLabel.textContent = activityLabel(averageScore);
  els.activityContext.textContent = `${t(fishActivityProfiles[fish].label)} · ${formatHourCompact(selectedTimelineMinute())} · ${activityLabel(timelineScore).toLowerCase()}`;
  els.activityMajor.textContent = `${windows.major.map((window) => window.label).join(" · ")} · ${t("estimation")}`;
  els.activityMinor.textContent = `${windows.minor.map((window) => window.label).join(" · ")} · ${t("estimation")}`;
  renderActivityReasons(highlightedRow ?? rows[0], fish);
  drawActivityChart(day, rows, highlighted);
}

function renderActivityReasons(row, fish) {
  els.activityReasons.innerHTML = "";
  activityReasons(row, fish).forEach((reason) => {
    const item = document.createElement("span");
    item.className = `activity-reason ${reason.type ?? ""}`.trim();
    item.textContent = t(reason.label);
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
  if (parts.temperature >= 72) {
    reasons.push({ label: `${t(isSeaMode() ? "Eau OK" : "Température OK")} ${t(profile.label)}` });
  }

  return reasons.slice(0, 4);
}

function highlightedActivityIndex(day, rows) {
  if (!rows.length) return 0;
  const target = selectedTimelineMinute();
  let bestIndex = 0;
  let bestDiff = Infinity;
  rows.forEach((row, index) => {
    const diff = Math.abs(minutesFromClock(row.hour) - target);
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
  const theme = canvasTheme();
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const padding = { top: 22, right: 18, bottom: 34, left: 58 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = theme.bg;
  roundRect(ctx, 0, 0, width, height, 8);
  ctx.fill();

  const zones = [
    { label: t("Haute"), value: 75 },
    { label: t("Moyenne"), value: 50 },
    { label: t("Faible"), value: 25 },
  ];

  ctx.strokeStyle = theme.line;
  ctx.lineWidth = 1;
  ctx.fillStyle = theme.muted;
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
  drawTwoHourGrid(ctx, rows, pointX, padding, chartHeight);

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
  drawTimelineMarker(ctx, timelineX(rows, pointX), padding, chartHeight);

  ctx.beginPath();
  rows.forEach((row, index) => {
    const x = pointX(index);
    const y = pointY(row.score);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = themeColor("current");
  ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke();

  const highlighted = rows[highlightedIndex];
  if (highlighted) {
    const x = pointX(highlightedIndex);
    const y = pointY(highlighted.score);
    ctx.fillStyle = themeColor("coral");
    ctx.strokeStyle = theme.pointStroke;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  drawHourTickLabels(ctx, rows, pointX, height - padding.bottom + 13);

  ctx.fillStyle = theme.ink;
  ctx.font = "800 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`${t(fishActivityProfiles[normalizeActivityFish(state.activityFish)].label)} · ${formatShortDay(day.date)}`, padding.left, padding.top - 10);
}

function activityLabel(score) {
  if (score >= 78) return t("Très bonne activité");
  if (score >= 62) return t("Bonne activité");
  if (score >= 42) return t("Activité moyenne");
  if (score >= 24) return t("Faible activité");
  return t("Très faible activité");
}

function renderTimingWindow(day) {
  if (!els.timingWindowCard) return;

  if (!day?.bestWindow) {
    els.timingWindowCard.className = "timing-window-card unavailable";
    els.timingWindowScore.textContent = "--";
    els.timingWindowTitle.textContent = "Créneau indisponible";
    els.timingWindowDetail.textContent = "Charge un spot pour calculer la prochaine fenêtre de pêche.";
    els.timingWindowFacts.innerHTML = "";
    els.timingWindowChips.innerHTML = "";
    return;
  }

  const window = day.bestWindow;
  const sample = timelineSample(day, window.peakMinute ?? selectedTimelineMinute());
  const score = isValidNumber(window.score) ? window.score : 0;
  const reasons = window.reasons?.length ? window.reasons : ["Signaux à confirmer"];
  const risks = window.risks ?? [];
  const facts = timingWindowFacts(day, window, sample);

  els.timingWindowCard.className = `timing-window-card ${window.tone ?? timingWindowTone(score)}`.trim();
  els.timingWindowScore.textContent = `${score}/100`;
  els.timingWindowTitle.textContent = `${window.label} · ${getFishLabel(normalizeActivityFish(state.activityFish))}`;
  els.timingWindowDetail.textContent = `${getActiveSpot().name} · pic ${formatHourCompact(window.peakMinute)} · ${reasons.slice(0, 2).join(" · ")}`;
  els.timingWindowFacts.innerHTML = facts.map((fact) => `
    <span>
      <b>${escapeHtml(fact.label)}</b>
      <em>${escapeHtml(fact.value)}</em>
    </span>
  `).join("");
  els.timingWindowChips.innerHTML = [
    ...reasons.map((label) => ({ label, tone: "good" })),
    ...risks.map((label) => ({ label, tone: "risk" })),
  ].slice(0, 6).map((chip) => `
    <span class="${escapeHtml(chip.tone)}">${escapeHtml(chip.label)}</span>
  `).join("");
}

function timingWindowFacts(day, window, sample) {
  return [
    {
      label: isSeaMode() ? "Marée" : "Rivière",
      value: isSeaMode() ? timingTideFact(day, sample) : timingRiverFact(day),
    },
    {
      label: "Lune",
      value: timingMoonFact(day),
    },
    {
      label: "Météo",
      value: timingWeatherFact(day, sample),
    },
  ];
}

function timingTideFact(day, sample) {
  if (!isValidNumber(sample?.seaLevel)) return "à confirmer";
  const trend = rowTideTrend(sample.weatherRow, tideRows(day));
  const label = trend === "rising"
    ? "montante"
    : trend === "falling"
      ? "descendante"
      : "étale";
  return `${label} · ${formatTideHeight(sample.seaLevel)}`;
}

function timingRiverFact(day) {
  if (!isValidNumber(day?.riverFlow)) return "débit à confirmer";
  return `${formatRiverFlow(day.riverFlow)} · ${riverTrendLabel(day.riverFlowTrend)}`;
}

function timingMoonFact(day) {
  const windows = solunarWindows(day);
  const nextWindow = nextSolunarWindow(windows, selectedTimelineMinute());
  return `${moonPhaseLabel(windows.phase)} · ${nextWindow?.label ?? "--"}`;
}

function nextSolunarWindow(windows, minute) {
  return [...(windows?.major ?? []), ...(windows?.minor ?? [])]
    .map((window) => ({ ...window, distance: minuteDistance(minute, window.center) }))
    .sort((a, b) => a.distance - b.distance)[0] ?? null;
}

function timingWeatherFact(day, sample) {
  const wind = sample?.windSpeed ?? day?.windAvg;
  const wave = sample?.waveHeight ?? day?.waveAvg;
  if (isSeaMode() && isValidNumber(wind) && isValidNumber(wave)) {
    return `${formatNumber(wind, 0)} kt · houle ${formatNumber(wave, 1)} m`;
  }
  if (isValidNumber(wind)) return `${formatNumber(wind, 0)} kt · ${formatHourCompact(selectedTimelineMinute())}`;
  return "conditions à confirmer";
}

function renderPlanningView() {
  if (!els.planningPanel || !els.planningList) return;

  const summaries = dailyPlanningSummaries(state.days.slice(0, 10));
  const lockedPlanning = !canUseFeature("planning.10day");
  if (els.planningContext) {
    els.planningContext.textContent = summaries.length
      ? `${getFishLabel(normalizeActivityFish(state.activityFish))} · ${getActiveSpot().name}`
      : "Prévisions indisponibles";
  }
  els.planningPanel.classList.toggle("is-pro-preview", lockedPlanning);
  els.planningPanel.dataset.proFeature = "planning.10day";

  if (!summaries.length) {
    els.planningList.innerHTML = `
      <div class="planning-empty">
        Charge un spot pour comparer les meilleurs créneaux des prochains jours.
      </div>
    `;
    return;
  }

  els.planningList.innerHTML = summaries.map((summary, index) => planningRowMarkup(summary, { locked: lockedPlanning && index >= FREE_FORECAST_DAY_LIMIT })).join("");
  els.planningList.querySelectorAll("[data-planning-date]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.locked === "true") {
        showProGate("planning.10day");
        return;
      }
      state.selectedDate = button.dataset.planningDate;
      renderAll();
    });
  });
}

function planningRowMarkup(summary, options = {}) {
  const active = summary.date === state.selectedDate;
  const locked = Boolean(options.locked);
  const weather = summary.weather.icon ?? { icon: "ti-sun", label: "Météo" };
  const risk = summary.weatherRisk ?? {};
  const sourceBadges = planningSourceBadges(summary);

  return `
    <button class="planning-row ${escapeHtml(summary.tone)} ${active ? "is-active" : ""} ${locked ? "is-pro-locked" : ""}" type="button"
      data-planning-date="${escapeHtml(summary.date)}" data-locked="${locked}" aria-pressed="${active}">
      <span class="planning-date">
        <strong>${escapeHtml(formatWeekday3(summary.date))}</strong>
        <em>${escapeHtml(formatShortDateNoWeekday(summary.date))}</em>
      </span>
      ${locked ? `<span class="pro-lock-badge"><i class="ti ti-lock" aria-hidden="true"></i>Pro</span>` : ""}
      <span class="planning-score ${escapeHtml(summary.tone)}">${escapeHtml(String(summary.score))}</span>
      <span class="planning-main">
        <strong>${escapeHtml(summary.bestWindow.label)}</strong>
        <em>${escapeHtml(planningWindowDetail(summary))}</em>
      </span>
      <span class="planning-facts">
        <span><i class="ti ${escapeHtml(weather.icon)}" aria-hidden="true"></i>${escapeHtml(planningWeatherSummary(summary))}</span>
        <span>${escapeHtml(planningWaterSummary(summary))}</span>
        <span>${escapeHtml(planningMoonSummary(summary))}</span>
      </span>
      <span class="planning-risk ${escapeHtml(risk.tone ?? "warn")}">${escapeHtml(risk.label ?? "À confirmer")}</span>
      ${sourceBadges.length ? `<span class="planning-sources">${sourceBadges.map((label) => `<em>${escapeHtml(label)}</em>`).join("")}</span>` : ""}
    </button>
  `;
}

function planningWindowDetail(summary) {
  const reasons = summary.bestWindow.reasons ?? [];
  const risks = summary.bestWindow.risks ?? [];
  const detail = reasons.length ? reasons.slice(0, 2) : risks.slice(0, 1);
  return detail.length ? detail.join(" · ") : "Signaux à confirmer";
}

function planningWeatherSummary(summary) {
  const weather = summary.weather ?? {};
  const wind = isValidNumber(weather.windAvg) ? `Vent ${formatNumber(weather.windAvg, 0)} kt` : "Vent --";
  if (isSeaMode()) {
    const wave = isValidNumber(weather.waveAvg) ? `houle ${formatNumber(weather.waveAvg, 1)} m` : "houle --";
    return `${wind} · ${wave}`;
  }
  const rain = isValidNumber(weather.precipitationTotal) ? `pluie ${formatNumber(weather.precipitationTotal, 1)} mm` : "pluie --";
  return `${wind} · ${rain}`;
}

function planningWaterSummary(summary) {
  if (!isSeaMode()) {
    const flow = isValidNumber(summary.weather?.riverFlow)
      ? `${formatRiverFlow(summary.weather.riverFlow)} · ${riverTrendLabel(summary.weather.riverFlowTrend)}`
      : "Débit à confirmer";
    return `Rivière ${flow}`;
  }

  if (summary.tideEvents?.length) {
    return summary.tideEvents.slice(0, 2).map((event) => (
      `${event.type === "high" ? "PM" : "BM"} ${event.hour}`
    )).join(" · ");
  }

  const current = isValidNumber(summary.weather?.surfaceCurrent)
    ? `${formatNumber(summary.weather.surfaceCurrent, 1)} kt`
    : "--";
  return `Courant ${current}`;
}

function planningMoonSummary(summary) {
  const major = summary.moon?.major?.[0];
  return `${summary.moon?.label ?? "Lune --"}${major ? ` · ${major}` : ""}`;
}

function planningSourceBadges(summary) {
  const source = summary.sourceAvailability ?? {};
  const badges = [];
  if (!source.weather) badges.push("météo partielle");
  if (isSeaMode() && !source.tide) badges.push("marée à confirmer");
  if (isSeaMode() && !source.marine) badges.push("marine partielle");
  if (!isSeaMode() && !source.river) badges.push("débit à confirmer");
  return badges.slice(0, 2);
}

function renderConditionBrief(day) {
  if (!els.conditionBrief) return;

  if (!day) {
    els.conditionGoNoGo.textContent = "--";
    els.conditionGoNoGo.className = "condition-go-nogo";
    els.conditionDecision.textContent = "--";
    els.conditionReason.textContent = "Données indisponibles.";
    if (els.conditionScore) els.conditionScore.textContent = "--";
    els.conditionFacts.innerHTML = "";
    return;
  }

  const sample = timelineSample(day);
  const goNoGo = weatherGoNoGo(day, sample);
  const decision = conditionDecision(day, sample, goNoGo);
  const facts = conditionFacts(day, sample, goNoGo);

  els.conditionGoNoGo.textContent = goNoGo.label;
  els.conditionGoNoGo.className = `condition-go-nogo ${goNoGo.tone}`.trim();
  els.conditionGoNoGo.title = goNoGo.detail;
  els.conditionDecision.textContent = decision.title;
  els.conditionReason.textContent = goNoGo.tone === "good" ? decision.detail : `${goNoGo.detail} ${decision.detail}`;
  if (els.conditionScore) els.conditionScore.textContent = "";
  els.conditionFacts.innerHTML = "";
  els.conditionBrief.classList.toggle("is-good", goNoGo.tone === "good");
  els.conditionBrief.classList.toggle("is-warn", goNoGo.tone === "warn");
  els.conditionBrief.classList.toggle("is-bad", goNoGo.tone === "bad");

  facts.forEach((fact) => {
    const item = document.createElement("span");
    item.className = `condition-fact ${fact.tone ?? ""}`.trim();
    item.innerHTML = `<strong>${escapeHtml(fact.label)}</strong>${escapeHtml(fact.value)}`;
    els.conditionFacts.append(item);
  });
}

function weatherGoNoGo(day, sample = timelineSample(day)) {
  const warnings = [];
  const blockers = [];
  const rainValue = sample.precipitation ?? day.precipitationTotal;
  const rainWarning = sample.precipitation == null ? (isSeaMode() ? 5 : 6) : 1.5;
  const rainBlocker = sample.precipitation == null ? 15 : 5;

  const addLimit = (label, value, warningLimit, blockerLimit, unit, digits = 0) => {
    if (!isValidNumber(value)) return;
    const formatted = `${label} ${formatNumber(value, digits)} ${unit}`;
    if (value >= blockerLimit) blockers.push(formatted);
    else if (value >= warningLimit) warnings.push(formatted);
  };

  addLimit("Vent", sample.windSpeed ?? day.windAvg, 16, 22, "kt");
  addLimit("Rafales", sample.windGust ?? day.windGustMax, 24, 32, "kt");
  addLimit("Pluie", rainValue, rainWarning, rainBlocker, "mm", 1);

  if (isSeaMode()) {
    addLimit("Houle", sample.waveHeight ?? day.waveAvg, 0.9, 1.4, "m", 1);
    addLimit("Courant", sample.surfaceCurrent ?? day.surfaceCurrent, 1, 1.5, "kt", 1);
  } else if (day.turbidity) {
    if (day.turbidity.score >= 70) blockers.push(`Eau ${day.turbidity.label.toLowerCase()}`);
    else if (day.turbidity.score >= 45) warnings.push(`Eau ${day.turbidity.label.toLowerCase()}`);
  }

  if (!isSeaMode() && isValidNumber(day.riverFlowStress)) {
    const flowText = `Débit ${formatRiverFlow(day.riverFlow)}`;
    if (day.riverFlowStress >= 75) blockers.push(flowText);
    else if (day.riverFlowStress >= 50) warnings.push(flowText);
  }

  if (blockers.length) {
    return {
      tone: "bad",
      label: "NO GO",
      detail: `Météo défavorable: ${blockers.slice(0, 2).join(", ")}.`,
      reasons: blockers,
    };
  }

  if (warnings.length) {
    return {
      tone: "warn",
      label: "À surveiller",
      detail: `Sortie possible avec prudence: ${warnings.slice(0, 2).join(", ")}.`,
      reasons: warnings,
    };
  }

  return {
    tone: "good",
    label: "GO",
    detail: "Météo exploitable sur les seuils principaux.",
    reasons: ["Météo stable"],
  };
}

function dayConditionTone(day) {
  if (!day) return "maybe";

  return conditionToneFromValues({
    wind: day.windMax ?? day.windAvg,
    gust: day.windGustMax,
    rain: max(pluck(day.rows ?? [], "precipitation")) ?? day.precipitationTotal,
    wave: day.waveMax ?? day.waveAvg,
    current: max(pluck(day.rows ?? [], "surfaceCurrent")) ?? day.surfaceCurrent,
    riverStress: day.riverFlowStress,
  });
}

function sampleConditionTone(day, sample = timelineSample(day)) {
  return conditionToneFromValues({
    wind: sample.windSpeed ?? day?.windAvg,
    gust: sample.windGust ?? day?.windGustMax,
    rain: sample.precipitation ?? day?.precipitationTotal,
    wave: sample.waveHeight ?? day?.waveAvg,
    current: sample.surfaceCurrent ?? day?.surfaceCurrent,
    riverStress: day?.riverFlowStress,
  });
}

function conditionToneFromValues(values) {
  const wind = values.wind;
  const gust = values.gust;
  const rain = values.rain;

  if (!isSeaMode()) {
    if ((values.riverStress ?? 0) >= 75) return "bad";
    if ((values.riverStress ?? 0) >= 50) return "warn";
    if ((values.riverStress ?? 0) >= 30) return "maybe";
    if ((wind ?? 0) >= 24 || (gust ?? 0) >= 34 || (rain ?? 0) >= 5) return "bad";
    if ((wind ?? 0) >= 18 || (gust ?? 0) >= 28 || (rain ?? 0) >= 2) return "warn";
    if ((wind ?? 0) >= 12 || (gust ?? 0) >= 20 || (rain ?? 0) >= 0.4) return "maybe";
    return "good";
  }

  const wave = values.wave;
  const current = values.current;

  if ((wind ?? 0) >= 22 || (gust ?? 0) >= 32 || (rain ?? 0) >= 5 || (wave ?? 0) >= 1.4 || (current ?? 0) >= 1.5) {
    return "bad";
  }

  if ((wind ?? 0) >= 16 || (gust ?? 0) >= 24 || (rain ?? 0) >= 1.5 || (wave ?? 0) >= 0.9 || (current ?? 0) >= 1) {
    return "warn";
  }

  if ((wind ?? 0) >= 11 || (gust ?? 0) >= 18 || (rain ?? 0) >= 0.3 || (wave ?? 0) >= 0.55 || (current ?? 0) >= 0.65) {
    return "maybe";
  }

  return "good";
}

function conditionToneLabel(tone) {
  return t({
    good: "GO",
    maybe: "Maybe",
    warn: "À surveiller",
    bad: "NO GO",
  }[tone] ?? "Maybe");
}

function conditionToneCanvasFill(tone) {
  return {
    good: "rgba(34, 197, 94, 0.26)",
    maybe: "rgba(234, 179, 8, 0.28)",
    warn: "rgba(249, 115, 22, 0.30)",
    bad: "rgba(239, 68, 68, 0.32)",
  }[tone] ?? "rgba(234, 179, 8, 0.24)";
}

function conditionDecision(day, sample = timelineSample(day), goNoGo = weatherGoNoGo(day, sample)) {
  const hour = formatHourCompact(selectedTimelineMinute());
  const wind = sample.windSpeed ?? day.windAvg;
  const gust = sample.windGust ?? day.windGustMax;
  const wave = sample.waveHeight ?? day.waveAvg;
  const current = sample.surfaceCurrent ?? day.surfaceCurrent;

  if (isSeaMode()) {
    const roughSea = (wave ?? 0) >= 1.4 || (gust ?? 0) >= 28;
    const cleanWindow = goNoGo.tone === "good" && (wind ?? 99) <= 12 && (wave ?? 99) <= 0.8 && (current ?? 99) <= 1;

    if (roughSea) {
      return {
        tone: "bad",
        title: t("Sortie prudente"),
        detail: i18nMessage("seaRough", { hour }),
      };
    }

    if (cleanWindow) {
      return {
        tone: "good",
        title: t("Créneau intéressant"),
        detail: i18nMessage("seaClean", { hour }),
      };
    }

    if (goNoGo.tone === "warn") {
      return {
        tone: "warn",
        title: t("Conditions à affiner"),
        detail: i18nMessage("seaWarn", { hour }),
      };
    }

    return {
      tone: "warn",
      title: t("Conditions correctes"),
      detail: i18nMessage("seaFair", { hour }),
    };
  }

  const heavyRain = (sample.precipitation ?? day.precipitationTotal ?? 0) >= 5 || day.turbidity?.score >= 62;
  const pressureDrop = (day.pressureTrend ?? 0) <= -3;
  const riverRisk = isValidNumber(day.riverFlowStress) && day.riverFlowStress >= 50;

  if (heavyRain) {
    return {
      tone: "bad",
      title: t("Eau à surveiller"),
      detail: i18nMessage("freshRain", { hour }),
    };
  }

  if (riverRisk) {
    return {
      tone: day.riverFlowStress >= 75 ? "bad" : "warn",
      title: t("Débit à surveiller"),
      detail: i18nMessage("freshRiver", { hour }),
    };
  }

  if (goNoGo.tone === "good" || pressureDrop) {
    return {
      tone: "good",
      title: t("Fenêtre exploitable"),
      detail: i18nMessage("freshGood", { hour }),
    };
  }

  return {
    tone: "warn",
    title: t("Conditions stables"),
    detail: i18nMessage("freshStable", { hour }),
  };
}

function conditionFacts(day, sample = timelineSample(day), goNoGo = weatherGoNoGo(day, sample)) {
  const minute = selectedTimelineMinute();
  const thermalRange = timelineThermalFrontRange(day, minute);
  const facts = [
    {
      label: "Créneau",
      value: formatHourCompact(minute),
    },
  ];

  if (isSeaMode()) {
    facts.push(
      {
        label: "Air",
        value: formatTemperatureBrief(sample.airTemperature ?? day.airTemperature),
      },
      {
        label: "SST",
        value: formatTemperatureBrief(sample.seaTemperature ?? day.seaTemperature),
      },
      {
        label: "Front thermique",
        value: `${thermalFrontLabel(thermalRange)}${isValidNumber(thermalRange) ? ` · ${formatNumber(thermalRange, 1)} °C` : ""}`,
        tone: (thermalRange ?? 0) >= 1.2 ? "warn" : "",
      },
      {
        label: "Vent",
        value: `${formatNumber(sample.windSpeed ?? day.windAvg, 0)} kt`,
        tone: (sample.windSpeed ?? day.windAvg ?? 0) >= 22 ? "bad" : (sample.windSpeed ?? day.windAvg ?? 0) >= 16 ? "warn" : "",
      },
      {
        label: "Houle",
        value: `${formatNumber(sample.waveHeight ?? day.waveAvg, 1)} m`,
        tone: (sample.waveHeight ?? day.waveAvg ?? 0) >= 1.4 ? "bad" : (sample.waveHeight ?? day.waveAvg ?? 0) >= 0.9 ? "warn" : "",
      },
      {
        label: "Courant",
        value: `${formatNumber(sample.surfaceCurrent ?? day.surfaceCurrent, 1)} kt`,
        tone: (sample.surfaceCurrent ?? day.surfaceCurrent ?? 0) >= 1.5 ? "bad" : (sample.surfaceCurrent ?? day.surfaceCurrent ?? 0) >= 1 ? "warn" : "",
      },
    );
  } else {
    facts.push(
      {
        label: "Air",
        value: formatTemperatureBrief(sample.airTemperature ?? day.airTemperature),
      },
      {
        label: "Débit",
        value: formatRiverFlow(day.riverFlow),
        tone: riverFlowTone(day),
      },
      {
        label: "Pression",
        value: `${formatNumber(sample.pressure ?? day.pressureAvg, 0)} hPa`,
        tone: (day.pressureTrend ?? 0) <= -3 ? "" : "warn",
      },
      {
        label: "Pluie",
        value: `${formatNumber(sample.precipitation ?? day.precipitationTotal, 1)} mm`,
        tone: (sample.precipitation ?? day.precipitationTotal ?? 0) >= 5 ? "bad" : "",
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
    els.metricGrid.hidden = false;
    return;
  }

  if (isSeaMode()) {
    els.metricGrid.innerHTML = "";
    els.metricGrid.hidden = true;
    return;
  }

  els.metricGrid.hidden = false;

  const sample = timelineSample(day);
  const hour = formatHourCompact(selectedTimelineMinute());
  const surfaceCurrent = sample.surfaceCurrent ?? day.surfaceCurrent;
  const surfaceDirection = sample.currentDirection ?? day.surfaceCurrentDirection;
  const depthCurrent = sample.depthCurrent ?? day.depthCurrent;
  const waveHeight = sample.waveHeight ?? day.waveAvg;
  const waveDirection = sample.waveDirection ?? day.waveDirection;
  const wavePeriod = sample.wavePeriod ?? day.wavePeriod;
  const windSpeed = sample.windSpeed ?? day.windAvg;
  const windDirection = sample.windDirection ?? day.windDirection;
  const windGust = sample.windGust ?? day.windGustMax;
  const pressure = sample.pressure ?? day.pressureAvg;
  const precipitation = sample.precipitation ?? day.precipitationTotal;
  const cloudCover = sample.cloudCover ?? day.cloudCoverAvg;
  const airTemperature = sample.airTemperature ?? day.airTemperature;

  const metrics = isSeaMode()
    ? [
        {
          label: "Courant surface",
          shortLabel: "Surface",
          value: `${formatNumber(surfaceCurrent, 1)} kt`,
          detail: `vers ${compassLabel(surfaceDirection)} · ${hour}`,
          color: "current",
          icon: currentIcon(),
        },
        {
          label: "Courant profondeur",
          shortLabel: "Profondeur",
          value: `${formatNumber(depthCurrent, 1)} kt`,
          detail: depthDetail(day, sample),
          color: "depth",
          icon: depthIcon(),
        },
        {
          label: "Houle totale",
          shortLabel: "Houle",
          value: `${formatNumber(waveHeight, 1)} m`,
          detail: `de ${compassLabel(waveDirection)} · ${formatNumber(wavePeriod, 0)} s · ${hour}`,
          color: "wave",
          icon: waveIcon(),
        },
        {
          label: "Vent moyen",
          shortLabel: "Vent",
          value: `${formatNumber(windSpeed, 0)} kt`,
          detail: `de ${compassLabel(windDirection)} · raf. ${formatNumber(windGust, 0)} kt · ${hour}`,
          color: "wind",
          icon: windIcon(),
        },
      ]
    : [
        {
          label: "Débit rivière",
          shortLabel: "Débit",
          value: formatRiverFlow(day.riverFlow),
          detail: `${riverTrendLabel(day.riverFlowTrend)} · ${t("Source GloFAS via Open-Meteo")}`,
          color: "current",
          icon: currentIcon(),
        },
        {
          label: "Vent moyen",
          shortLabel: "Vent",
          value: `${formatNumber(windSpeed, 0)} kt`,
          detail: `de ${compassLabel(windDirection)} · raf. ${formatNumber(windGust, 0)} kt · ${hour}`,
          color: "wind",
          icon: windIcon(),
        },
        {
          label: "Pression",
          shortLabel: "Pression",
          value: `${formatNumber(pressure, 0)} hPa`,
          detail: `${formatPressureTrend(day.pressureTrend)} · ${hour}`,
          color: "pressure",
          icon: pressureIcon(),
        },
        {
          label: "Pluie",
          shortLabel: "Pluie",
          value: `${formatNumber(precipitation, 1)} mm`,
          detail: `${hour} · indice turbidité à affiner au Ticket 5`,
          color: "rain",
          icon: rainIcon(),
        },
        {
          label: "Nuages",
          shortLabel: "Nuages",
          value: `${formatNumber(cloudCover, 0)} %`,
          detail: `air ${formatNumber(airTemperature, 1)} °C · ${hour}`,
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
  els.waterInsights.innerHTML = "";

  if (isSeaMode() || !day) {
    els.waterInsights.hidden = true;
    return;
  }

  els.waterInsights.hidden = false;
  const tone = riverFlowTone(day);
  const minMax = isValidNumber(day.riverFlowMin) && isValidNumber(day.riverFlowMax)
    ? `${formatRiverFlow(day.riverFlowMin)} - ${formatRiverFlow(day.riverFlowMax)}`
    : "--";
  const detail = state.riverForecastAvailable
    ? `${riverTrendLabel(day.riverFlowTrend)} · ${t("Source GloFAS via Open-Meteo")}`
    : state.riverForecastError
      ? `${t("GloFAS indispo")} · ${state.riverForecastError}`
      : t("GloFAS indispo");

  els.waterInsights.innerHTML = `
    <article class="water-insight-card ${tone}">
      <span>${escapeHtml(t("Tendance débit"))}</span>
      <strong>${escapeHtml(riverTrendPercentLabel(day))}</strong>
      <small>${escapeHtml(`${detail} · ${minMax}`)}</small>
    </article>
  `;
}

function renderDayTimeline(day) {
  if (!els.dayTimeline || !els.dayTimeRange || !els.dayTimelineTime) return;

  if (!day) {
    els.dayTimeline.hidden = true;
    return;
  }

  const minute = selectedTimelineMinute();
  const today = localDateKey();
  const now = new Date();
  const nowMinute = normalizeTimelineMinute(now.getHours() * 60 + now.getMinutes());
  const isToday = day.date === today;
  const peakMinute = day.bestWindow?.peakMinute;
  const payload = hybridTimelinePayload(day, minute);
  const renderKey = `${day.date}:${state.activityFish}:${isSeaMode() ? "sea" : "fresh"}`;
  if (state.liveTimelineRenderKey !== renderKey) {
    state.liveTimelineRenderKey = renderKey;
    state.liveTimelineProgress = 0;
    scheduleLiveTimelineAnimation();
  }

  els.dayTimeline.hidden = false;
  els.dayTimeline.classList.toggle("is-today", isToday);
  els.dayTimeline.classList.toggle("has-window-peak", isValidNumber(peakMinute));
  els.dayTimeline.dataset.pointCount = String(payload.points?.length ?? 0);
  els.dayTimeline.dataset.markerCount = String(payload.markers?.length ?? 0);
  els.dayTimeline.dataset.hasTide = String(Boolean(payload.hasTide));
  els.dayTimeline.dataset.hasActivity = String(Boolean(payload.hasActivity));
  els.dayTimeline.dataset.selectedMinute = String(minute);
  updateTimelineDayButtons(day);
  els.dayTimeline.style.setProperty("--timeline-now", `${(nowMinute / 1425) * 100}%`);
  els.dayTimeline.style.setProperty("--timeline-window-peak", `${((peakMinute ?? minute) / 1425) * 100}%`);
  els.dayTimeRange.value = String(minute);
  els.dayTimeRange.style.setProperty("--timeline-progress", `${(minute / 1425) * 100}%`);
  els.dayTimeRange.setAttribute("aria-valuetext", `Sélection ${formatHourCompact(minute)}`);
  els.dayTimelineTime.textContent = formatHourCompact(minute);
  renderLiveTimeline(payload, { isToday, nowMinute });
  renderLiveTimelineCards(payload);
  if (els.dayTimelineReadout) {
    const parts = [
      payload.hasTide ? `marée ${formatTideHeight(payload.sample.seaLevel)}` : `activité ${formatNumber(payload.sample.score, 0)}/100`,
      isToday ? `maintenant ${formatHourCompact(nowMinute)}` : null,
      isValidNumber(peakMinute) ? `pic ${formatHourCompact(peakMinute)}` : null,
      payload.sample.weatherRow ? conditionToneLabel(sampleConditionTone(day, payload.sample)) : null,
    ].filter(Boolean);
    els.dayTimelineReadout.textContent = parts.join(" · ");
  }
}

function updateTimelineDayButtons(day) {
  const days = state.days.slice(0, 10);
  const index = days.findIndex((candidate) => candidate.date === day?.date);
  if (els.timelinePrevDay) {
    els.timelinePrevDay.disabled = index <= 0;
  }
  if (els.timelineNextDay) {
    const nextLocked = !canUseFeature("planning.10day") && index + 1 >= FREE_FORECAST_DAY_LIMIT;
    els.timelineNextDay.disabled = index < 0 || index >= days.length - 1;
    els.timelineNextDay.classList.toggle("is-pro-target", nextLocked);
    els.timelineNextDay.title = nextLocked ? "Débloquer les jours suivants avec Pro" : "Jour suivant";
  }
}

function renderLiveTimeline(payload, options = {}) {
  const canvas = els.liveTimelineCanvas;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) {
    scheduleLiveTimelineVisibilityRedraw();
    return;
  }
  const ctx = setupCanvas(canvas);
  const width = rect.width;
  const height = rect.height;
  ctx.clearRect(0, 0, width, height);

  const padding = { top: 18, right: 18, bottom: 24, left: 18 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const points = payload.points ?? [];

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "rgba(109, 205, 255, 0.16)");
  gradient.addColorStop(0.55, "rgba(51, 134, 209, 0.10)");
  gradient.addColorStop(1, "rgba(5, 18, 38, 0.04)");
  ctx.fillStyle = gradient;
  roundRect(ctx, 0, 0, width, height, 10);
  ctx.fill();

  if (!points.length) {
    ctx.fillStyle = "rgba(225, 244, 255, 0.70)";
    ctx.font = "800 13px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Timeline indisponible", width / 2, height / 2);
    return;
  }

  const xForMinute = (value) => padding.left + (clamp(value, 0, 1425) / 1425) * chartWidth;
  const yForValue = (value) => padding.top + (1 - clamp(value, 0, 1)) * chartHeight;

  ctx.save();
  ctx.strokeStyle = "rgba(218, 239, 255, 0.10)";
  ctx.lineWidth = 1;
  [0, 360, 720, 1080, 1425].forEach((tick) => {
    const x = xForMinute(tick);
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, height - padding.bottom);
    ctx.stroke();
  });
  ctx.restore();

  payload.windows.forEach((window) => {
    const x = xForMinute(window.start);
    const w = Math.max(8, xForMinute(window.end) - x);
    ctx.fillStyle = window.type === "best" ? "rgba(91, 214, 170, 0.16)" : "rgba(153, 119, 255, 0.12)";
    roundRect(ctx, x, padding.top, w, chartHeight, 8);
    ctx.fill();
  });

  const progress = isValidNumber(state.liveTimelineProgress) ? state.liveTimelineProgress : 1;
  drawHybridCurve(ctx, points, xForMinute, yForValue, "tide", progress);
  drawHybridCurve(ctx, points, xForMinute, yForValue, "activity", progress);
  drawHybridCurve(ctx, points, xForMinute, yForValue, "hybrid", progress);

  payload.markers.forEach((marker) => drawLiveTimelineMarker(ctx, marker, xForMinute, padding, chartHeight));

  if (options.isToday && isValidNumber(options.nowMinute)) {
    const nowX = xForMinute(options.nowMinute);
    ctx.strokeStyle = "rgba(255, 214, 102, 0.56)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(nowX, padding.top);
    ctx.lineTo(nowX, height - padding.bottom);
    ctx.stroke();
  }

  const selectedX = xForMinute(payload.minute);
  const selected = payload.selectedPoint ?? points[0];
  const selectedY = yForValue(selected.hybrid);
  ctx.strokeStyle = "rgba(236, 249, 255, 0.80)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(selectedX, padding.top);
  ctx.lineTo(selectedX, height - padding.bottom);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#3fa2ff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(selectedX, selectedY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(225, 244, 255, 0.82)";
  ctx.font = "900 11px Inter, system-ui, sans-serif";
  ctx.textAlign = selectedX > width - 78 ? "right" : "left";
  ctx.fillText(formatHourCompact(payload.minute), selectedX + (selectedX > width - 78 ? -10 : 10), Math.max(16, selectedY - 12));
}

function scheduleLiveTimelineVisibilityRedraw() {
  if (state.liveTimelineVisibilityFrame || !window.requestAnimationFrame) return;
  state.liveTimelineVisibilityFrame = requestAnimationFrame(() => {
    state.liveTimelineVisibilityFrame = 0;
    const canvas = els.liveTimelineCanvas;
    if (!canvas || canvas.getBoundingClientRect().width < 2) return;
    renderDayTimeline(getSelectedDay());
  });
}

function installLiveTimelineResizeObserver() {
  if (state.liveTimelineResizeObserver || !window.ResizeObserver || !els.dayTimeline) return;
  state.liveTimelineResizeObserver = new ResizeObserver(() => {
    if (els.dayTimeline?.hidden) return;
    scheduleLiveTimelineVisibilityRedraw();
  });
  state.liveTimelineResizeObserver.observe(els.dayTimeline);
  if (els.liveTimelineCanvas) {
    state.liveTimelineResizeObserver.observe(els.liveTimelineCanvas);
  }
}

function drawHybridCurve(ctx, points, xForMinute, yForValue, kind, progress = 1) {
  const config = {
    tide: { key: "tideRatio", color: "rgba(186, 230, 255, 0.55)", width: 2, dash: [4, 6] },
    activity: { key: "activityRatio", color: "rgba(118, 232, 185, 0.50)", width: 2, dash: [1, 7] },
    hybrid: { key: "hybrid", color: "#43b8ff", width: 4, dash: [] },
  }[kind];
  if (!config) return;

  ctx.save();
  ctx.strokeStyle = config.color;
  ctx.lineWidth = config.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.setLineDash(config.dash);
  const animatedPoints = animatedTimelinePoints(points, config.key, progress);
  if (!animatedPoints.length) {
    ctx.restore();
    return;
  }

  ctx.beginPath();
  animatedPoints.forEach((point, index) => {
    const x = xForMinute(point.minute);
    const y = yForValue(point[config.key]);
    if (index === 0) ctx.moveTo(x, y);
    else {
      const previous = animatedPoints[index - 1];
      const previousX = xForMinute(previous.minute);
      const previousY = yForValue(previous[config.key]);
      const midX = (previousX + x) / 2;
      ctx.bezierCurveTo(midX, previousY, midX, y, x, y);
    }
  });
  ctx.stroke();

  if (kind === "hybrid") {
    const last = animatedPoints.at(-1);
    ctx.lineTo(xForMinute(last.minute), yForValue(0));
    ctx.lineTo(xForMinute(animatedPoints[0].minute), yForValue(0));
    ctx.closePath();
    const fill = ctx.createLinearGradient(0, 0, 0, ctx.canvas.clientHeight);
    fill.addColorStop(0, "rgba(67, 184, 255, 0.24)");
    fill.addColorStop(1, "rgba(67, 184, 255, 0.02)");
    ctx.fillStyle = fill;
    ctx.fill();
  }
  ctx.restore();
}

function animatedTimelinePoints(points, key, progress) {
  const safeProgress = clamp(progress, 0, 1);
  if (safeProgress >= 0.995) return points;
  const maxMinute = 1425 * safeProgress;
  const visible = points.filter((point) => point.minute <= maxMinute);
  const next = points.find((point) => point.minute > maxMinute);
  const previous = visible.at(-1);

  if (!previous) return points.length ? [{ ...points[0], minute: Math.min(points[0].minute, maxMinute), [key]: points[0][key] }] : [];
  if (!next) return visible;

  const span = Math.max(1, next.minute - previous.minute);
  const ratio = clamp((maxMinute - previous.minute) / span, 0, 1);
  visible.push({
    ...next,
    minute: maxMinute,
    [key]: previous[key] + (next[key] - previous[key]) * ratio,
  });
  return visible;
}

function drawLiveTimelineMarker(ctx, marker, xForMinute, padding, chartHeight) {
  const x = xForMinute(marker.minute);
  const colorsByType = {
    best: "#65d6a8",
    high: "#d9f2ff",
    low: "#6bbcff",
    sunrise: "#f8c95a",
    sunset: "#f59e5f",
    moon: "#b69cff",
  };
  const color = colorsByType[marker.type] ?? "#dff4ff";
  const y = marker.type === "best" ? padding.top + 10 : padding.top + chartHeight + 2;

  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = "rgba(3, 16, 32, 0.60)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, marker.type === "best" ? 5 : 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(225, 244, 255, 0.72)";
  ctx.font = "800 9px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(marker.label, x, marker.type === "best" ? y + 15 : y - 8);
  ctx.restore();
}

function renderLiveTimelineCards(payload) {
  if (!els.liveTimelineCards) return;
  const day = payload.day;
  const sample = payload.sample;
  const trend = rowTideTrend(sample.weatherRow, day?.rows);
  const tideLabel = trend === "rising" ? "Montante" : trend === "falling" ? "Descendante" : "Stable";
  const water = isSeaMode()
    ? {
        label: "Marée",
        value: formatTideHeight(sample.seaLevel),
        detail: tideLabel,
      }
    : {
        label: "Débit",
        value: formatRiverFlow(day?.riverFlow),
        detail: riverTrendLabel(day),
      };
  const cards = [
    water,
    {
      label: "Activité",
      value: `${formatNumber(sample.score, 0)}/100`,
      detail: getFishLabel(state.activityFish),
    },
    {
      label: "Météo",
      value: `${formatNumber(sample.windSpeed ?? day?.windAvg, 0)} kt`,
      detail: isSeaMode() ? `houle ${formatNumber(sample.waveHeight ?? day?.waveAvg, 1)} m` : `${formatNumber(sample.pressure ?? day?.pressureAvg, 0)} hPa`,
    },
  ];

  els.liveTimelineCards.innerHTML = cards.map((card) => `
    <article class="live-timeline-card">
      <span>${escapeHtml(card.label)}</span>
      <strong>${escapeHtml(card.value)}</strong>
      <small>${escapeHtml(card.detail)}</small>
    </article>
  `).join("");
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

function depthDetail(day, sample = null) {
  const depth = formatNumber(day.actualDepth ?? state.depth, 0);
  const direction = compassLabel(sample?.depthDirection ?? day.depthDirection);
  const source = sample?.depthSource ?? day.depthSource;
  const value = sample?.depthCurrent ?? day.depthCurrent;

  if (source === "copernicus" && isValidNumber(value)) {
    return `Copernicus ${depth} m · vers ${direction} · ${formatHourCompact(selectedTimelineMinute())}`;
  }

  return state.realDepthError ? "Copernicus indisponible" : "En attente Copernicus";
}

function formatPressureTrend(value) {
  if (!isValidNumber(value)) return "tendance --";
  const sign = value > 0 ? "+" : "";
  return `tendance ${sign}${formatNumber(value, 1)} hPa`;
}

function formatRiverFlow(value) {
  if (!isValidNumber(value)) return "--";
  const digits = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${formatNumber(value, digits)} m³/s`;
}

function riverFlowTone(day) {
  const stress = day?.riverFlowStress;
  if (!isValidNumber(stress)) return "";
  if (stress >= 75) return "bad";
  if (stress >= 50) return "warn";
  if (stress >= 30) return "maybe";
  return "good";
}

function riverTrendLabel(value) {
  if (!isValidNumber(value) || Math.abs(value) < 0.01) return t("Débit stable");
  return value > 0 ? t("Débit en hausse") : t("Débit en baisse");
}

function riverTrendPercentLabel(day) {
  if (!isValidNumber(day?.riverFlowTrendPercent) || Math.abs(day.riverFlowTrendPercent) < 0.1) {
    return t("Débit stable");
  }
  const sign = day.riverFlowTrendPercent > 0 ? "+" : "";
  return `${sign}${formatNumber(day.riverFlowTrendPercent, 1)} %`;
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

function timelineThermalFrontRange(day, minute = selectedTimelineMinute()) {
  const rows = (day?.rows ?? [])
    .map((row) => ({ row, minute: minutesFromClockOrNull(row.hour) }))
    .filter((point) => point.minute != null && isValidNumber(point.row.seaTemperature));
  if (!rows.length) return day?.seaTemperatureRange ?? null;

  const windowRows = rows.filter((point) => Math.abs(point.minute - minute) <= 120);
  const values = (windowRows.length >= 2 ? windowRows : rows).map((point) => point.row.seaTemperature);
  return valueRange(values) ?? day?.seaTemperatureRange ?? null;
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

function renderTides(day) {
  if (!els.tideCanvas || !els.tideSummaryGrid) return;

  if (els.tideLocation) {
    els.tideLocation.textContent = `${getActiveSpot().name} · ${day ? formatShortDay(day.date) : "--"}`;
  }

  const rows = tideRows(day);
  if (!day || !isSeaMode() || rows.length < 2) {
    drawEmptyPanelCanvas(els.tideCanvas, isSeaMode() ? "Marées indisponibles" : "Marées réservées aux spots mer");
    els.tideSummaryGrid.innerHTML = unavailableCards([
      ["Marnage", "--", "Aucune hauteur d'eau exploitable"],
      ["Pleine mer", "--", "Station marine indisponible"],
      ["Basse mer", "--", "Station marine indisponible"],
    ]);
    if (els.tideEventsList) els.tideEventsList.innerHTML = "";
    return;
  }

  const extrema = tideExtrema(rows);
  const focusRow = focusedTimeRow(rows);
  const tideState = tideTrendLabel(rows, focusRow);
  drawTideChart(day, rows, extrema, focusRow);

  const highLabels = extrema.highs.slice(0, 2).map((row) => `${row.hour} · ${formatTideHeight(row.seaLevel)}`);
  const lowLabels = extrema.lows.slice(0, 2).map((row) => `${row.hour} · ${formatTideHeight(row.seaLevel)}`);
  const nextEvent = nextTideEvent(rows, extrema, focusRow);
  const summary = [
    {
      label: "Marnage",
      value: `${formatNumber(day.seaLevelRange, 2)} m`,
      detail: tideRangeLabel(day.seaLevelRange),
    },
    {
      label: "Repère",
      value: formatTideHeight(focusRow?.seaLevel),
      detail: tideState,
    },
    {
      label: "Pleine mer",
      value: highLabels[0] ?? "--",
      detail: highLabels[1] ?? "prochain pic détecté",
    },
    {
      label: "Basse mer",
      value: lowLabels[0] ?? "--",
      detail: lowLabels[1] ?? "prochain creux détecté",
    },
  ];

  if (nextEvent) {
    summary.push({
      label: "Prochaine",
      value: `${nextEvent.type === "high" ? "Haute" : "Basse"} ${nextEvent.row.hour}`,
      detail: formatTideHeight(nextEvent.row.seaLevel),
    });
  }

  els.tideSummaryGrid.innerHTML = summaryCards(summary);
  if (els.tideEventsList) els.tideEventsList.innerHTML = "";
}

function tideRows(day) {
  return (day?.rows ?? []).filter((row) => isValidNumber(row.seaLevel));
}

function tideExtrema(rows) {
  const highs = [];
  const lows = [];

  for (let index = 1; index < rows.length - 1; index += 1) {
    const previous = rows[index - 1].seaLevel;
    const current = rows[index].seaLevel;
    const next = rows[index + 1].seaLevel;
    const peak = current >= previous && current >= next && (current > previous || current > next);
    const trough = current <= previous && current <= next && (current < previous || current < next);
    if (peak) highs.push(rows[index]);
    if (trough) lows.push(rows[index]);
  }

  if (!highs.length) highs.push(rows.reduce((best, row) => (row.seaLevel > best.seaLevel ? row : best), rows[0]));
  if (!lows.length) lows.push(rows.reduce((best, row) => (row.seaLevel < best.seaLevel ? row : best), rows[0]));

  return {
    highs: uniqueTideRows(highs).sort((a, b) => Date.parse(a.time) - Date.parse(b.time)),
    lows: uniqueTideRows(lows).sort((a, b) => Date.parse(a.time) - Date.parse(b.time)),
  };
}

function uniqueTideRows(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    if (seen.has(row.time)) return false;
    seen.add(row.time);
    return true;
  });
}

function focusedTimeRow(rows) {
  if (!rows.length) return null;
  const target = selectedTimelineMinute();
  return rows.reduce((best, row) => {
    const bestDiff = Math.abs(minutesFromClock(best.hour) - target);
    const diff = Math.abs(minutesFromClock(row.hour) - target);
    return diff < bestDiff ? row : best;
  }, rows[0]);
}

function tideTrendLabel(rows, focusRow) {
  if (!focusRow) return "tendance indisponible";
  const index = rows.findIndex((row) => row.time === focusRow.time);
  const before = rows[Math.max(0, index - 1)]?.seaLevel;
  const after = rows[Math.min(rows.length - 1, index + 1)]?.seaLevel;
  if (!isValidNumber(before) || !isValidNumber(after)) return "tendance stable";
  const delta = after - before;
  if (delta > 0.015) return "marée montante";
  if (delta < -0.015) return "marée descendante";
  return "étale ou faible variation";
}

function nextTideEvent(rows, extrema, focusRow) {
  if (!focusRow) return null;
  const focusTime = Date.parse(focusRow.time);
  const events = [
    ...extrema.highs.map((row) => ({ type: "high", row })),
    ...extrema.lows.map((row) => ({ type: "low", row })),
  ]
    .filter((event) => Date.parse(event.row.time) >= focusTime)
    .sort((a, b) => Date.parse(a.row.time) - Date.parse(b.row.time));
  return events[0] ?? null;
}

function renderTideEvents(rows, extrema) {
  const events = [
    ...extrema.highs.map((row) => ({ type: "high", row })),
    ...extrema.lows.map((row) => ({ type: "low", row })),
  ]
    .sort((a, b) => Date.parse(a.row.time) - Date.parse(b.row.time))
    .slice(0, 6);

  els.tideEventsList.innerHTML = events.map((event) => `
    <article class="tide-event ${event.type}">
      <span>${event.type === "high" ? "Pleine mer" : "Basse mer"}</span>
      <strong>${escapeHtml(event.row.hour)}</strong>
      <small>${escapeHtml(formatTideHeight(event.row.seaLevel))}</small>
    </article>
  `).join("");
}

function drawTideChart(day, rows, extrema, focusRow) {
  const canvas = els.tideCanvas;
  const ctx = setupCanvas(canvas);
  const theme = canvasTheme();
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const padding = { top: 28, right: 22, bottom: 42, left: 56 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  if (width <= 1 || height <= 1) return;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = theme.bg;
  roundRect(ctx, 0, 0, width, height, 8);
  ctx.fill();

  const values = rows.map((row) => row.seaLevel).filter(isValidNumber);
  const low = min(values) ?? 0;
  const high = max(values) ?? 1;
  const range = Math.max(0.04, high - low);
  const minValue = low - range * 0.16;
  const maxValue = high + range * 0.16;
  const valueSpan = Math.max(0.04, maxValue - minValue);

  const pointX = (index) => padding.left + (rows.length <= 1 ? 0 : (index / (rows.length - 1)) * chartWidth);
  const pointY = (value) => padding.top + chartHeight - ((value - minValue) / valueSpan) * chartHeight;

  ctx.strokeStyle = theme.line;
  ctx.lineWidth = 1;
  ctx.fillStyle = theme.muted;
  ctx.font = "700 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  for (let step = 0; step <= 4; step += 1) {
    const value = minValue + (valueSpan / 4) * step;
    const y = pointY(value);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(`${formatNumber(value, 2)} m`, padding.left - 10, y);
  }

  drawTwoHourGrid(ctx, rows, pointX, padding, chartHeight);

  const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
  gradient.addColorStop(0, "rgba(47, 116, 192, 0.28)");
  gradient.addColorStop(1, "rgba(47, 116, 192, 0.04)");

  ctx.beginPath();
  rows.forEach((row, index) => {
    const x = pointX(index);
    const y = pointY(row.seaLevel);
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
    const y = pointY(row.seaLevel);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = themeColor("wave");
  ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke();

  if (focusRow) {
    const focusIndex = rows.findIndex((row) => row.time === focusRow.time);
    if (focusIndex >= 0) {
      drawTimelineMarker(ctx, timelineX(rows, pointX) ?? pointX(focusIndex), padding, chartHeight);
    }
  }

  [
    ...extrema.highs.slice(0, 3).map((row) => ({ row, color: colors.good })),
    ...extrema.lows.slice(0, 3).map((row) => ({ row, color: colors.coral })),
  ].forEach((event) => {
    const index = rows.findIndex((row) => row.time === event.row.time);
    if (index < 0) return;
    const x = pointX(index);
    const y = pointY(event.row.seaLevel);
    ctx.fillStyle = event.color;
    ctx.strokeStyle = theme.pointStroke;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  drawHourTickLabels(ctx, rows, pointX, height - padding.bottom + 14);

  ctx.fillStyle = theme.ink;
  ctx.font = "800 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`${formatShortDay(day.date)} · ${t("hauteur relative au niveau moyen")}`, padding.left, padding.top - 12);
}

function renderAstro(day) {
  if (!els.astroCanvas || !els.moonCard || !els.astroSummaryGrid || !els.solunarWindowGrid) return;

  if (els.astroLocation) {
    els.astroLocation.textContent = `${getActiveSpot().name} · ${day ? formatShortDay(day.date) : "--"}`;
  }

  if (!day) {
    drawEmptyPanelCanvas(els.astroCanvas, "Cycle lumineux indisponible");
    els.moonCard.innerHTML = "";
    els.astroSummaryGrid.innerHTML = "";
    els.solunarWindowGrid.innerHTML = "";
    return;
  }

  const astro = buildAstroData(day);
  drawAstroChart(day, astro);
  renderMoonCard(astro);
  renderAstroSummary(astro);
  renderSolunarWindows(astro);
}

function buildAstroData(day) {
  const firstRow = day.rows?.[0] ?? {};
  const sunrise = minutesFromDateTime(firstRow.sunrise);
  const sunset = minutesFromDateTime(firstRow.sunset);
  const solarNoon = sunrise != null && sunset != null ? (sunrise + sunset) / 2 : null;
  const dayLength = sunrise != null && sunset != null ? Math.max(0, sunset - sunrise) : null;
  const phase = lunarPhase(day.date);
  const windows = solunarWindows(day);
  const illumination = ((1 - Math.cos(phase * Math.PI * 2)) / 2) * 100;

  return {
    sunrise,
    sunset,
    solarNoon,
    dayLength,
    nightLength: dayLength == null ? null : 1440 - dayLength,
    phase,
    moonAge: phase * 29.530588853,
    illumination,
    moonrise: windows.minor[0]?.center ?? null,
    moonset: windows.minor[1]?.center ?? null,
    windows,
  };
}

function renderMoonCard(astro) {
  const waxing = astro.phase < 0.5;
  els.moonCard.innerHTML = `
    <div class="moon-orb-wrap">
      <span class="moon-orb ${waxing ? "is-waxing" : "is-waning"}" style="--moon-illumination:${astro.illumination}"></span>
    </div>
    <div class="moon-card-copy">
      <span>Lune</span>
      <strong>${escapeHtml(moonPhaseFullLabel(astro.phase))}</strong>
      <small>${formatNumber(astro.illumination, 0)} % éclairée · âge ${formatNumber(astro.moonAge, 1)} j</small>
    </div>
  `;
}

function renderAstroSummary(astro) {
  const summary = [
    {
      label: "Lever soleil",
      value: formatAstroMinute(astro.sunrise),
      detail: "début du jour",
    },
    {
      label: "Coucher soleil",
      value: formatAstroMinute(astro.sunset),
      detail: "fin du jour",
    },
    {
      label: "Durée jour",
      value: formatDurationMinutes(astro.dayLength),
      detail: `nuit ${formatDurationMinutes(astro.nightLength)}`,
    },
    {
      label: "Lune",
      value: `${formatNumber(astro.illumination, 0)} %`,
      detail: `${formatAstroMinute(astro.moonrise)} lever estimé`,
    },
  ];
  els.astroSummaryGrid.innerHTML = summaryCards(summary);
}

function renderSolunarWindows(astro) {
  const windows = [
    { label: "Majeur 1", value: astro.windows.major[0]?.label ?? "--", detail: "lune au-dessus" },
    { label: "Majeur 2", value: astro.windows.major[1]?.label ?? "--", detail: "lune sous les pieds" },
    { label: "Mineur 1", value: astro.windows.minor[0]?.label ?? "--", detail: "lever lune estimé" },
    { label: "Mineur 2", value: astro.windows.minor[1]?.label ?? "--", detail: "coucher lune estimé" },
  ];
  els.solunarWindowGrid.innerHTML = summaryCards(windows);
}

function drawAstroChart(day, astro) {
  const canvas = els.astroCanvas;
  const ctx = setupCanvas(canvas);
  const theme = canvasTheme();
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const padding = { top: 28, right: 22, bottom: 42, left: 44 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  if (width <= 1 || height <= 1) return;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = theme.bg;
  roundRect(ctx, 0, 0, width, height, 8);
  ctx.fill();

  const baseY = padding.top + chartHeight * 0.74;
  const amplitude = chartHeight * 0.48;
  ctx.strokeStyle = theme.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding.left, baseY);
  ctx.lineTo(width - padding.right, baseY);
  ctx.stroke();

  for (let hour = 0; hour <= 24; hour += 2) {
    const x = padding.left + (hour / 24) * chartWidth;
    ctx.strokeStyle = theme.subtleLine;
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, padding.top + chartHeight);
    ctx.stroke();
    if (hour % 4 !== 0) continue;
    ctx.fillStyle = theme.muted;
    ctx.font = "700 11px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(formatHourTick(hour * 60), x, height - padding.bottom + 14);
  }

  drawVisibilityArc(ctx, {
    padding,
    chartWidth,
    baseY,
    amplitude,
    start: astro.sunrise,
    end: astro.sunset,
    color: themeColor("amber"),
    width: 4,
  });
  drawVisibilityArc(ctx, {
    padding,
    chartWidth,
    baseY,
    amplitude: amplitude * 0.52,
    start: astro.moonrise,
    end: astro.moonset,
    color: themeColor("violet"),
    width: 3,
    dash: [7, 7],
  });

  drawTimePoint(ctx, padding, chartWidth, baseY, astro.sunrise, themeColor("amber"), "Lever");
  drawTimePoint(ctx, padding, chartWidth, baseY, astro.sunset, themeColor("amber"), "Coucher");
  drawTimePoint(ctx, padding, chartWidth, baseY, astro.moonrise, themeColor("violet"), "Lune");

  drawTimelineMarker(ctx, padding.left + (selectedTimelineMinute() / 1440) * chartWidth, padding, chartHeight);

  ctx.fillStyle = theme.ink;
  ctx.font = "800 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`${formatShortDay(day.date)} · ${t("trajectoires estimées")}`, padding.left, padding.top - 12);
}

function drawVisibilityArc(ctx, options) {
  const { start, end } = options;
  if (start == null || end == null) return;
  const duration = end > start ? end - start : end + 1440 - start;
  if (duration <= 0) return;
  const segments = end > start
    ? [[start, end]]
    : [[start, 1440], [0, end]];

  ctx.save();
  ctx.strokeStyle = options.color;
  ctx.lineWidth = options.width ?? 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.setLineDash(options.dash ?? []);

  segments.forEach(([segmentStart, segmentEnd]) => {
    ctx.beginPath();
    let started = false;
    for (let minute = segmentStart; minute <= segmentEnd; minute += 12) {
      const absoluteMinute = minute < start ? minute + 1440 : minute;
      const progress = clamp((absoluteMinute - start) / duration, 0, 1);
      const x = options.padding.left + (minute / 1440) * options.chartWidth;
      const y = options.baseY - Math.sin(Math.PI * progress) * options.amplitude;
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  });
  ctx.restore();
}

function drawTimePoint(ctx, padding, chartWidth, baseY, minute, color, label) {
  if (minute == null) return;
  const theme = canvasTheme();
  const x = padding.left + (minute / 1440) * chartWidth;
  ctx.fillStyle = color;
  ctx.strokeStyle = theme.pointStroke;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, baseY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = theme.muted;
  ctx.font = "800 11px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText(label, x, baseY - 10);
}

function drawTwoHourGrid(ctx, rows, pointX, padding, chartHeight) {
  if (!rows?.length) return;
  const theme = canvasTheme();

  ctx.save();
  ctx.strokeStyle = theme.subtleLine;
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  rows.forEach((row, index) => {
    const minutes = minutesFromClockOrNull(row.hour);
    if (minutes == null || minutes % 120 !== 0) return;
    const x = pointX(index);
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, padding.top + chartHeight);
    ctx.stroke();
  });
  ctx.restore();
}

function drawTimelineMarker(ctx, x, padding, chartHeight) {
  if (!isValidNumber(x)) return;
  const theme = canvasTheme();

  ctx.save();
  ctx.strokeStyle = theme.marker;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, padding.top);
  ctx.lineTo(x, padding.top + chartHeight);
  ctx.stroke();
  ctx.restore();
}

function drawHourTickLabels(ctx, rows, pointX, y) {
  if (!rows?.length) return;
  const theme = canvasTheme();

  let lastX = -Infinity;
  ctx.save();
  ctx.fillStyle = theme.muted;
  ctx.font = "700 11px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  rows.forEach((row, index) => {
    const minutes = minutesFromClockOrNull(row.hour);
    if (minutes == null || minutes % 120 !== 0) return;
    const x = pointX(index);
    const isLast = index === rows.length - 1;
    if (x - lastX < (isLast ? 32 : 42)) return;
    ctx.fillText(formatHourTick(minutes), x, y);
    lastX = x;
  });
  ctx.restore();
}

function drawEmptyPanelCanvas(canvas, message) {
  const ctx = setupCanvas(canvas);
  const theme = canvasTheme();
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width <= 1 || height <= 1) return;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = theme.bg;
  roundRect(ctx, 0, 0, width, height, 8);
  ctx.fill();
  ctx.fillStyle = theme.muted;
  ctx.font = "900 16px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(message, width / 2, height / 2);
}

function summaryCards(items) {
  return items.map((item) => `
    <article class="summary-card">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
      <small>${escapeHtml(item.detail)}</small>
    </article>
  `).join("");
}

function unavailableCards(rows) {
  return rows.map(([label, value, detail]) => ({ label, value, detail })).map((item) => `
    <article class="summary-card is-muted">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
      <small>${escapeHtml(item.detail)}</small>
    </article>
  `).join("");
}

function formatTideHeight(value) {
  return isValidNumber(value) ? `${formatNumber(value, 2)} m` : "--";
}

function formatAstroMinute(value) {
  return value == null ? "--" : formatMinute(value);
}

function formatDurationMinutes(value) {
  if (!isValidNumber(value)) return "--";
  const minutes = Math.round(Math.max(0, value));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours} h ${String(rest).padStart(2, "0")}`;
}

function moonPhaseFullLabel(phase) {
  const value = ((phase % 1) + 1) % 1;
  if (value < 0.04 || value >= 0.96) return t("Nouvelle lune");
  if (value < 0.22) return t("Premier croissant");
  if (value < 0.29) return t("Premier quartier");
  if (value < 0.46) return t("Lune gibbeuse croissante");
  if (value < 0.54) return t("Pleine lune");
  if (value < 0.72) return t("Lune gibbeuse décroissante");
  if (value < 0.79) return t("Dernier quartier");
  return t("Dernier croissant");
}

function depthSeriesLabel(day) {
  if (day.depthSource === "copernicus") {
    return `${formatNumber(day.actualDepth ?? state.depth, 0)} m Copernicus`;
  }

  return t("Profondeur Copernicus indisponible");
}

function drawCompass() {
  const day = getSelectedDay();
  const canvas = els.compassCanvas;
  const ctx = setupCanvas(canvas);
  const theme = canvasTheme();
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.37;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = day ? conditionToneCanvasFill(sampleConditionTone(day)) : theme.bg;
  roundRect(ctx, 0, 0, width, height, 8);
  ctx.fill();

  ctx.strokeStyle = theme.line;
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

  ctx.fillStyle = theme.muted;
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

  const snapshot = compassTimelineSnapshot(day);

  if (isSeaMode()) {
    drawCompassArrow(
      ctx,
      cx,
      cy,
      compassArrowLength(radius, 0.82, snapshot.surfaceCurrent, 1.1),
      snapshot.surfaceCurrentDirection,
      themeColor("current"),
      `Courant ${formatCompassValue(snapshot.surfaceCurrent, "kt", 1)}`,
      false,
    );
    if (isValidNumber(snapshot.depthCurrent) && isValidNumber(snapshot.depthDirection)) {
      drawCompassArrow(
        ctx,
        cx,
        cy,
        compassArrowLength(radius, 0.68, snapshot.depthCurrent, 1),
        snapshot.depthDirection,
        themeColor("depth"),
        `Fond ${formatCompassValue(snapshot.depthCurrent, "kt", 1)}`,
        false,
      );
    }
    drawCompassArrow(
      ctx,
      cx,
      cy,
      compassArrowLength(radius, 0.55, snapshot.windSpeed, 18),
      reverseDirection(snapshot.windDirection),
      themeColor("wind"),
      `Vent ${formatCompassValue(snapshot.windSpeed, "kt", 0)}`,
      true,
    );
    drawCompassArrow(
      ctx,
      cx,
      cy,
      compassArrowLength(radius, 0.42, snapshot.waveHeight, 1.4),
      reverseDirection(snapshot.waveDirection),
      themeColor("wave"),
      `Houle ${formatCompassValue(snapshot.waveHeight, "m", 1)}`,
      true,
    );
  } else {
    drawCompassArrow(
      ctx,
      cx,
      cy,
      compassArrowLength(radius, 0.76, snapshot.windSpeed, 18),
      reverseDirection(snapshot.windDirection),
      themeColor("wind"),
      `Vent ${formatCompassValue(snapshot.windSpeed, "kt", 0)}`,
      true,
    );
  }

  drawCompassStatusBadge(ctx, width, day);
}

function compassTimelineSnapshot(day) {
  const sample = timelineSample(day);

  return {
    windSpeed: sample.windSpeed ?? day.windAvg,
    windDirection: sample.windDirection ?? day.windDirection,
    waveHeight: sample.waveHeight ?? day.waveAvg,
    waveDirection: sample.waveDirection ?? day.waveDirection,
    surfaceCurrent: sample.surfaceCurrent ?? day.surfaceCurrent,
    surfaceCurrentDirection: sample.currentDirection ?? day.surfaceCurrentDirection,
    depthCurrent: sample.depthCurrent ?? day.depthCurrent,
    depthDirection: sample.depthDirection ?? day.depthDirection,
  };
}

function compassArrowLength(radius, baseScale, value, reference) {
  if (!isValidNumber(value) || !isValidNumber(reference) || reference <= 0) {
    return radius * baseScale;
  }

  const factor = value <= 0.02 ? 0.34 : clamp(value / reference, 0.48, 1.18);
  return radius * baseScale * factor;
}

function formatCompassValue(value, unit, decimals) {
  return isValidNumber(value) ? `${formatNumber(value, decimals)} ${unit}` : "--";
}

function drawCompassStatusBadge(ctx, width, day) {
  const theme = canvasTheme();
  const minute = selectedTimelineMinute();
  const sample = timelineSample(day, minute);
  const waterTemperature = sample.seaTemperature ?? dailyWaterTemperature(day);
  const lines = [
    {
      text: `${formatShortDay(day.date)} · ${formatHourCompact(minute)}`,
      font: "900 12px Inter, system-ui, sans-serif",
      color: theme.ink,
    },
    {
      text: `Air ${formatTemperatureBrief(sample.airTemperature ?? day.airTemperature)} · Eau ${formatTemperatureBrief(waterTemperature)}`,
      font: "800 11px Inter, system-ui, sans-serif",
      color: theme.muted,
    },
  ];

  const paddingX = 10;
  const paddingY = 8;
  let textWidth = 0;
  lines.forEach((line) => {
    ctx.font = line.font;
    textWidth = Math.max(textWidth, ctx.measureText(line.text).width);
  });
  const badgeWidth = Math.min(width - 24, textWidth + paddingX * 2);
  const badgeHeight = 48;
  const x = width - badgeWidth - 12;
  const y = 12;

  ctx.save();
  ctx.fillStyle = theme.badge;
  ctx.strokeStyle = theme.badgeBorder;
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, badgeWidth, badgeHeight, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  lines.forEach((line, index) => {
    ctx.font = line.font;
    ctx.fillStyle = line.color;
    ctx.fillText(line.text, x + badgeWidth - paddingX, y + paddingY + index * 16);
  });
  ctx.restore();
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
  const theme = canvasTheme();
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const padding = { top: 24, right: 22, bottom: 38, left: 48 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  ctx.clearRect(0, 0, width, height);

  if (!day) return;

  if (state.activeWeatherSubtab === "forces") {
    els.chartTitle.textContent = t("Forces heure par heure");
    renderLegend(isSeaMode()
      ? [
          { label: t("Courant surface"), color: themeColor("current") },
          { label: t("Courant profondeur"), color: themeColor("depth") },
          { label: t("Houle"), color: themeColor("wave") },
          { label: t("Houle de fond"), color: themeColor("swell") },
          { label: t("Vent"), color: themeColor("wind") },
          { label: t("Rafales"), color: themeColor("gust") },
        ]
      : [
          { label: t("Vent"), color: themeColor("wind") },
          { label: t("Rafales"), color: themeColor("gust") },
          { label: t("Pluie"), color: themeColor("rain") },
        ]);
    drawForcesHourlyChart(ctx, day, width, height, theme);
    return;
  }

  const config = chartConfig(day);
  els.chartTitle.textContent = t(config.title);
  renderLegend(config.series.map((serie) => ({ ...serie, label: t(serie.label) })));

  const values = config.series.flatMap((serie) => serie.values).filter(isValidNumber);
  const minValue = isValidNumber(config.minValue) ? config.minValue : 0;
  const maxValue = isValidNumber(config.maxValue) ? config.maxValue : niceMax(max(values) ?? 1);
  const valueRangeSize = Math.max(0.01, maxValue - minValue);

  ctx.strokeStyle = theme.line;
  ctx.lineWidth = 1;
  ctx.fillStyle = theme.muted;
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
  drawTwoHourGrid(ctx, rows, pointX, padding, chartHeight);
  drawTimelineMarker(ctx, timelineX(rows, pointX), padding, chartHeight);

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

  drawHourTickLabels(ctx, rows, pointX, height - padding.bottom + 14);

  ctx.fillStyle = theme.ink;
  ctx.font = "800 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(config.unit, padding.left, padding.top - 14);
}

function renderAtmosphereChart() {
  if (!els.atmosphereChartCanvas || !els.atmosphereChartTitle || !els.atmosphereChartLegend) return;

  state.activeAtmosphereChart = normalizeAtmosphereChart(state.activeAtmosphereChart);
  els.atmosphereChartButtons.forEach((button) => {
    const active = button.dataset.atmosphereChart === state.activeAtmosphereChart;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
    button.setAttribute("tabindex", active ? "0" : "-1");
  });

  const day = getSelectedDay();
  const canvas = els.atmosphereChartCanvas;
  const ctx = setupCanvas(canvas);
  const theme = canvasTheme();
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  ctx.clearRect(0, 0, width, height);

  if (!day) {
    drawEmptyPanelCanvas(canvas, t("Atmosphère indisponible"));
    return;
  }

  const config = atmosphereChartConfig(day);
  els.atmosphereChartTitle.textContent = t(config.title);
  renderLegend(config.series.map((serie) => ({ ...serie, label: t(serie.label) })), els.atmosphereChartLegend);

  const padding = { top: 28, right: 22, bottom: 38, left: 54 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const values = config.series.flatMap((serie) => serie.values).filter(isValidNumber);

  if (!values.length) {
    drawEmptyPanelCanvas(canvas, `${t(config.title)} ${t("Indisponible").toLowerCase()}`);
    return;
  }

  const minValue = isValidNumber(config.minValue) ? config.minValue : 0;
  const maxValue = isValidNumber(config.maxValue) ? config.maxValue : niceMax(max(values) ?? 1);
  const valueRangeSize = Math.max(0.01, maxValue - minValue);

  ctx.fillStyle = theme.bg;
  roundRect(ctx, 0, 0, width, height, 8);
  ctx.fill();

  ctx.strokeStyle = theme.line;
  ctx.lineWidth = 1;
  ctx.fillStyle = theme.muted;
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
  drawTwoHourGrid(ctx, rows, pointX, padding, chartHeight);
  drawTimelineMarker(ctx, timelineX(rows, pointX), padding, chartHeight);

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

  drawHourTickLabels(ctx, rows, pointX, height - padding.bottom + 14);

  ctx.fillStyle = theme.ink;
  ctx.font = "800 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(config.unit, padding.left, padding.top - 14);
}

function drawForcesHourlyChart(ctx, day, width, height, theme) {
  const rows = day.rows ?? [];
  if (!rows.length) {
    drawEmptyPanelCanvas(els.chartCanvas, t("Forces indisponibles"));
    return;
  }

  const metrics = isSeaMode()
    ? [
        { label: t("Courant"), key: "surfaceCurrent", directionKey: "currentDirection", unit: "kt", digits: 1, type: "current", color: themeColor("current") },
        { label: t("Fond"), key: "depthCurrent", directionKey: "depthDirection", unit: "kt", digits: 1, type: "depth", color: themeColor("depth") },
        { label: t("Houle"), key: "waveHeight", directionKey: "waveDirection", unit: "m", digits: 1, type: "wave", color: themeColor("wave"), reverse: true },
        { label: t("Houle fond"), key: "swellHeight", directionKey: "swellDirection", unit: "m", digits: 1, type: "swell", color: themeColor("swell"), reverse: true },
        { label: t("Vent"), key: "windSpeed", directionKey: "windDirection", unit: "kt", digits: 0, type: "wind", color: themeColor("wind"), reverse: true },
        { label: t("Rafales"), key: "windGust", directionKey: "windDirection", unit: "kt", digits: 0, type: "gust", color: themeColor("gust"), reverse: true },
      ]
    : [
        { label: t("Vent"), key: "windSpeed", directionKey: "windDirection", unit: "kt", digits: 0, type: "wind", color: themeColor("wind"), reverse: true },
        { label: t("Rafales"), key: "windGust", directionKey: "windDirection", unit: "kt", digits: 0, type: "wind", color: themeColor("gust"), reverse: true },
        { label: t("Pluie"), key: "precipitation", directionKey: null, unit: "mm", digits: 1, type: "rain", color: themeColor("rain") },
      ];

  const padding = { top: 34, right: 16, bottom: 18, left: 78 };
  const chartWidth = width - padding.left - padding.right;
  const headerHeight = 34;
  const rowGap = 8;
  const rowHeight = Math.max(48, (height - padding.top - padding.bottom - headerHeight - rowGap * (metrics.length - 1)) / metrics.length);
  const colWidth = Math.max(30, chartWidth / rows.length);
  const selectedIndex = selectedHourIndex(rows);

  ctx.fillStyle = theme.bg;
  roundRect(ctx, 0, 0, width, height, 8);
  ctx.fill();

  ctx.fillStyle = theme.ink;
  ctx.font = "900 13px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(`${formatShortDay(day.date)} · ${formatHourCompact(selectedTimelineMinute())}`, padding.left, 17);

  ctx.font = "800 11px Inter, system-ui, sans-serif";
  ctx.fillStyle = theme.muted;
  ctx.textAlign = "center";
  rows.forEach((row, index) => {
    const x = padding.left + index * colWidth + colWidth / 2;
    const minutes = minutesFromClock(row.hour);
    if (minutes % 120 === 0 || index === selectedIndex) {
      ctx.fillText(formatHourTick(minutes), x, padding.top + 8);
    }
  });

  if (selectedIndex >= 0) {
    const x = padding.left + selectedIndex * colWidth;
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    ctx.fillRect(x, padding.top, colWidth, height - padding.top - padding.bottom);
    ctx.strokeStyle = theme.marker;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, padding.top + 1, colWidth - 2, height - padding.top - padding.bottom - 2);
  }

  metrics.forEach((metric, metricIndex) => {
    const y = padding.top + headerHeight + metricIndex * (rowHeight + rowGap);
    ctx.fillStyle = metric.color;
    ctx.font = "900 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(metric.label, padding.left - 12, y + rowHeight / 2 - 8);
    ctx.fillStyle = theme.muted;
    ctx.font = "700 10px Inter, system-ui, sans-serif";
    ctx.fillText(metric.unit, padding.left - 12, y + rowHeight / 2 + 10);

    rows.forEach((row, index) => {
      const x = padding.left + index * colWidth;
      const value = row[metric.key];
      const direction = metric.directionKey ? row[metric.directionKey] : null;
      const tone = forcePowerTone(metric.type, value);
      const cellWidth = Math.max(24, colWidth - 2);
      const valueY = y + rowHeight * 0.48;
      const valueHeight = rowHeight * 0.42;

      ctx.strokeStyle = theme.subtleLine;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, colWidth, rowHeight);

      ctx.fillStyle = isValidNumber(value) ? forceToneFill(tone) : "rgba(127, 168, 201, 0.12)";
      ctx.fillRect(x + 1, valueY, cellWidth, valueHeight);

      ctx.fillStyle = isValidNumber(direction) ? theme.ink : theme.muted;
      ctx.font = "900 16px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(directionArrow(metric.reverse ? reverseDirection(direction) : direction), x + colWidth / 2, y + rowHeight * 0.28);

      ctx.fillStyle = isValidNumber(value) ? "#06131f" : theme.muted;
      ctx.font = "800 12px Inter, system-ui, sans-serif";
      ctx.fillText(isValidNumber(value) ? formatNumber(value, metric.digits) : "--", x + colWidth / 2, valueY + valueHeight / 2);
    });
  });
}

function selectedHourIndex(rows) {
  const minute = selectedTimelineMinute();
  let bestIndex = -1;
  let bestDiff = Infinity;
  rows.forEach((row, index) => {
    const rowMinute = minutesFromClockOrNull(row.hour);
    if (rowMinute == null) return;
    const diff = Math.abs(rowMinute - minute);
    if (diff < bestDiff) {
      bestIndex = index;
      bestDiff = diff;
    }
  });
  return bestIndex;
}

function forcePowerTone(type, value) {
  if (!isValidNumber(value)) return "muted";

  const thresholds = {
    current: [0.45, 0.85, 1.25],
    depth: [0.35, 0.75, 1.15],
    wave: [0.45, 0.9, 1.35],
    swell: [0.4, 0.8, 1.2],
    wind: [8, 16, 22],
    gust: [12, 22, 30],
    rain: [0.3, 1.5, 5],
  }[type] ?? [0.4, 0.8, 1.2];

  if (value >= thresholds[2]) return "bad";
  if (value >= thresholds[1]) return "warn";
  if (value >= thresholds[0]) return "maybe";
  return "good";
}

function forceToneFill(tone) {
  return {
    good: "rgba(74, 222, 128, 0.88)",
    maybe: "rgba(250, 204, 21, 0.88)",
    warn: "rgba(251, 146, 60, 0.90)",
    bad: "rgba(248, 113, 113, 0.92)",
    muted: "rgba(127, 168, 201, 0.12)",
  }[tone] ?? "rgba(127, 168, 201, 0.12)";
}

function directionArrow(direction) {
  if (!isValidNumber(direction)) return "·";
  const arrows = ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"];
  return arrows[Math.round(normalizeDirection(direction) / 45) % arrows.length];
}

function chartConfig(day) {
  const rows = day.rows;

  if (isSeaMode() && state.activeChart === "wave") {
    return {
      title: "Houle",
      unit: "m",
      series: [
        { label: "Houle totale", color: themeColor("wave"), values: pluck(rows, "waveHeight") },
        { label: "Houle de fond", color: themeColor("swell"), values: pluck(rows, "swellHeight"), dash: [7, 6] },
      ],
    };
  }

  if (isSeaMode() && state.activeChart === "current") {
    return {
      title: "Courant",
      unit: "kt",
      series: [
        { label: "Surface", color: themeColor("current"), values: pluck(rows, "surfaceCurrent") },
        { label: depthSeriesLabel(day), color: themeColor("depth"), values: pluck(rows, "depthCurrent"), dash: [7, 6] },
      ],
    };
  }

  if (state.activeChart === "cloud") {
    return {
      title: "Couverture nuageuse",
      unit: "%",
      minValue: 0,
      maxValue: 100,
      series: [
        { label: "Nuages", color: themeColor("cloud"), values: pluck(rows, "cloudCover") },
      ],
    };
  }

  return {
    title: "Vent",
    unit: "kt",
    series: [
      { label: "Vent moyen", color: themeColor("wind"), values: pluck(rows, "windSpeed") },
      { label: "Rafales", color: themeColor("gust"), values: pluck(rows, "windGust"), dash: [7, 6] },
    ],
  };
}

function atmosphereChartConfig(day) {
  const rows = day.rows ?? [];

  if (state.activeAtmosphereChart === "pressure") {
    const values = pluck(rows, "pressure").filter(isValidNumber);
    const low = min(values);
    const high = max(values);
    const padding = isValidNumber(low) && isValidNumber(high)
      ? Math.max(1, (high - low) * 0.25)
      : 2;

    return {
      title: "Baromètre",
      unit: "hPa",
      minValue: isValidNumber(low) ? Math.floor(low - padding) : 1008,
      maxValue: isValidNumber(high) ? Math.ceil(high + padding) : 1028,
      series: [
        { label: "Pression", color: themeColor("pressure"), values: pluck(rows, "pressure") },
      ],
    };
  }

  return {
    title: "Couverture nuageuse",
    unit: "%",
    minValue: 0,
    maxValue: 100,
    series: [
      { label: "Nuages", color: themeColor("cloud"), values: pluck(rows, "cloudCover") },
    ],
  };
}

function renderLegend(series, target = els.chartLegend) {
  if (!target) return;
  target.innerHTML = "";
  series.forEach((serie) => {
    const item = document.createElement("span");
    item.className = "legend-item";
    item.innerHTML = `<span class="legend-swatch"></span>${serie.label}`;
    item.querySelector(".legend-swatch").style.background = serie.color;
    target.append(item);
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
  return new Intl.DateTimeFormat(currentLocale(), { weekday: "short" })
    .format(new Date(`${date}T12:00:00`))
    .replace(".", "")
    .slice(0, 3);
}

function formatShortDateNoWeekday(date) {
  return new Intl.DateTimeFormat(currentLocale(), {
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
    const media = renderCatchMedia(entry.media);
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
        ${media}
        ${notes}
      </article>
    `;
  }).join("");
}

function renderCatchMedia(media = []) {
  const photos = media.filter((item) => item?.type === "image" && typeof item.dataUrl === "string");
  if (!photos.length) return "";
  return `
    <div class="journal-media">
      ${photos.map((item) => `<img src="${escapeHtml(item.dataUrl)}" alt="${escapeHtml(item.alt ?? "Photo de prise")}" loading="lazy" />`).join("")}
    </div>
  `;
}

function renderCatchPhotoPreview() {
  if (!els.catchPhotoPreview) return;
  const photos = state.pendingCatchMedia.filter((item) => item.type === "image");
  els.catchPhotoPreview.hidden = photos.length === 0;
  els.catchPhotoPreview.innerHTML = photos.map((item) => `
    <span class="catch-photo-thumb-wrap">
      <img class="catch-photo-thumb" src="${escapeHtml(item.dataUrl)}" alt="${escapeHtml(item.alt ?? "Photo de prise")}" />
      <button class="catch-photo-remove" type="button" data-remove-photo="${escapeHtml(item.id)}" aria-label="Retirer la photo">x</button>
    </span>
  `).join("");
}

async function pickCatchPhoto() {
  const camera = getCameraPlugin();

  if (state.native.isNative && camera?.getPhoto) {
    try {
      const cameraEnums = window.capacitorCamera ?? {};
      const photo = await camera.getPhoto({
        quality: Math.round(PHOTO_JPEG_QUALITY * 100),
        resultType: cameraEnums.CameraResultType?.DataUrl ?? "dataUrl",
        source: cameraEnums.CameraSource?.Prompt ?? "PROMPT",
        correctOrientation: true,
        width: PHOTO_MAX_EDGE,
      });
      if (photo?.dataUrl) {
        await addCatchPhotoFromDataUrl(photo.dataUrl);
      }
      return;
    } catch (error) {
      if (!String(error?.message ?? "").toLowerCase().includes("cancel")) {
        console.warn("Native camera failed", error);
      }
    }
  }

  els.catchPhotoInput?.click();
}

async function handleCatchPhotoInput(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const dataUrl = await readFileAsDataUrl(file);
    await addCatchPhotoFromDataUrl(dataUrl, file.name);
  } catch (error) {
    console.warn("Photo import failed", error);
    setStatus("Photo impossible", "error");
  } finally {
    event.target.value = "";
  }
}

async function addCatchPhotoFromDataUrl(dataUrl, name = "") {
  const resized = await resizeImageDataUrl(dataUrl);
  const media = {
    id: `photo:${Date.now()}:${Math.random().toString(36).slice(2, 7)}`,
    type: "image",
    dataUrl: resized,
    alt: name ? `Photo ${name}` : "Photo de prise",
    createdAt: new Date().toISOString(),
  };
  state.pendingCatchMedia = [media, ...state.pendingCatchMedia].slice(0, 4);
  renderCatchPhotoPreview();
  setStatus("Photo ajoutée", "ready");
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function resizeImageDataUrl(dataUrl) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, PHOTO_MAX_EDGE / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#071526";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", PHOTO_JPEG_QUALITY));
    };
    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });
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
  return new Intl.DateTimeFormat(currentLocale(), {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function moonPhaseLabel(phase) {
  const value = ((phase % 1) + 1) % 1;
  if (value < 0.04 || value >= 0.96) return t("nouvelle");
  if (value < 0.22) return t("croissante");
  if (value < 0.29) return t("1er quartier");
  if (value < 0.46) return t("gibbeuse +");
  if (value < 0.54) return t("pleine");
  if (value < 0.72) return t("gibbeuse -");
  if (value < 0.79) return t("dernier quartier");
  return t("décroissante");
}

async function locateUser() {
  await requestGpsPermission();
}

function getSelectedDay() {
  return state.days.find((day) => day.date === state.selectedDate) ?? state.days[0];
}

function bestWindow(rows) {
  return bestFishingWindowForDay({ date: rows[0]?.date, rows }, {
    waterMode: state.waterMode,
    selectedSpecies: state.activityFish,
    targetDepth: state.depth,
    selectedMinute: selectedTimelineMinute(),
    profile: state.profile,
  });
}

function bestFishingWindowForDay(day, options = {}) {
  const rows = (day?.rows ?? []).filter((row) => row?.hour);
  const windowSize = Math.min(3, rows.length);
  const waterMode = normalizeWaterMode(options.waterMode ?? state.waterMode);
  const fish = normalizeActivityFish(options.selectedSpecies ?? state.activityFish);
  const windows = solunarWindows({ date: day?.date ?? rows[0]?.date, rows });
  const sourceAvailability = timingSourceAvailability(day, rows, waterMode);

  if (!rows.length || !windowSize) {
    return emptyBestFishingWindow(sourceAvailability);
  }

  let best = { score: -Infinity, index: 0, peakIndex: 0, slices: [] };

  for (let index = 0; index <= rows.length - windowSize; index += 1) {
    const slices = rows.slice(index, index + windowSize).map((row) => {
      const score = timingWindowScore(row, { waterMode, fish, windows, rows });
      return { row, score };
    });
    const score = average(slices.map((slice) => slice.score));
    if (score != null && score > best.score) {
      const peak = slices.reduce((winner, slice, sliceIndex) => (
        slice.score > winner.score ? { score: slice.score, index: sliceIndex } : winner
      ), { score: -Infinity, index: 0 });
      best = { score, index, peakIndex: index + peak.index, slices };
    }
  }

  const startRow = rows[best.index];
  const endRow = rows[best.index + windowSize - 1] ?? startRow;
  const peakRow = rows[best.peakIndex] ?? startRow;
  const score = Math.round(clamp(best.score, 0, 100));
  const reasons = timingWindowReasons(peakRow, { waterMode, fish, windows, rows, sourceAvailability });
  const risks = timingWindowRisks(peakRow, { waterMode, sourceAvailability });

  return {
    label: `${startRow?.hour ?? "--"} - ${endRow?.hour ?? "--"}`,
    score,
    tone: timingWindowTone(score),
    startMinute: minutesFromClockOrNull(startRow?.hour),
    endMinute: minutesFromClockOrNull(endRow?.hour),
    peakMinute: minutesFromClockOrNull(peakRow?.hour),
    peakHour: peakRow?.hour ?? "--",
    reasons,
    risks,
    sourceAvailability,
  };
}

function emptyBestFishingWindow(sourceAvailability = {}) {
  return {
    label: "--",
    score: 0,
    tone: "unavailable",
    startMinute: null,
    endMinute: null,
    peakMinute: null,
    peakHour: "--",
    reasons: [],
    risks: ["Prévision indisponible"],
    sourceAvailability,
  };
}

function timingWindowScore(row, context) {
  const base = scoreHour(row);
  const activity = fishActivityForHour(row, context.fish, context.windows);
  const light = lightActivityScore(row, "balanced");
  const cycle = solunarActivityScore(row, context.windows);
  const tide = context.waterMode === WATER_MODES.SEA ? tideTimingScore(row, context.rows) : freshwaterTimingScore(row);

  return clamp(
    base * 0.34 +
    activity * 0.28 +
    tide * 0.18 +
    cycle * 0.12 +
    light * 0.08,
    0,
    100,
  );
}

function tideTimingScore(row, rows = []) {
  if (!isValidNumber(row.seaLevel)) return 56;
  const trend = rowTideTrend(row, rows);
  if (trend === "rising") return 78;
  if (trend === "falling") return 66;
  return 58;
}

function freshwaterTimingScore(row) {
  const rain = row.precipitation ?? 0;
  const pressure = isValidNumber(row.pressure) ? rangeScore(row.pressure, [1007, 1016, 1028]) : 58;
  return clamp(pressure * 0.74 + clamp(100 - rain * 72, 0, 100) * 0.26, 0, 100);
}

function rowTideTrend(row, rows = []) {
  if (!isValidNumber(row?.seaLevel)) return "unknown";
  const tideRowsForDay = rows.filter((candidate) => isValidNumber(candidate.seaLevel));
  const index = tideRowsForDay.findIndex((candidate) => candidate.time === row.time);
  if (index < 0) return "unknown";
  const before = tideRowsForDay[Math.max(0, index - 1)]?.seaLevel;
  const after = tideRowsForDay[Math.min(tideRowsForDay.length - 1, index + 1)]?.seaLevel;
  if (!isValidNumber(before) || !isValidNumber(after)) return "unknown";
  const delta = after - before;
  if (delta > 0.015) return "rising";
  if (delta < -0.015) return "falling";
  return "slack";
}

function timingWindowReasons(row, context) {
  const reasons = [];
  const trend = context.waterMode === WATER_MODES.SEA ? rowTideTrend(row, context.rows) : "freshwater";
  const cycleScore = solunarActivityScore(row, context.windows);

  if (context.waterMode === WATER_MODES.SEA && trend === "rising") reasons.push("Marée montante");
  if (context.waterMode === WATER_MODES.SEA && trend === "falling") reasons.push("Marée descendante exploitable");
  if (context.waterMode !== WATER_MODES.SEA) reasons.push("Fenêtre eau douce");
  if (cycleScore >= 70) reasons.push("Signal solunar fort");
  if (lightActivityScore(row, "balanced") >= 72) reasons.push("Lumière favorable");
  if (fishActivityForHour(row, context.fish, context.windows) >= 70) reasons.push(`${getFishLabel(context.fish)} actif`);
  if (scoreHour(row) >= 72) reasons.push("Conditions calmes");
  if (!context.sourceAvailability.tide && context.waterMode === WATER_MODES.SEA) reasons.push("Marée à confirmer");

  return reasons.slice(0, 4);
}

function timingWindowRisks(row, context) {
  const risks = [];
  const wind = row.windSpeed ?? 0;
  const gust = row.windGust ?? wind;
  const wave = row.waveHeight ?? 0;
  const current = row.surfaceCurrent ?? 0;
  const rain = row.precipitation ?? 0;

  if (gust >= 24 || wind >= 18) risks.push("Vent à surveiller");
  if (context.waterMode === WATER_MODES.SEA && wave >= 1.2) risks.push("Houle marquée");
  if (context.waterMode === WATER_MODES.SEA && current >= 1.2) risks.push("Courant soutenu");
  if (context.waterMode !== WATER_MODES.SEA && rain >= 0.8) risks.push("Pluie / eau teintée");
  if (!context.sourceAvailability.marine && context.waterMode === WATER_MODES.SEA) risks.push("Marine partielle");
  if (!context.sourceAvailability.river && context.waterMode !== WATER_MODES.SEA) risks.push("Débit à confirmer");

  return risks.slice(0, 4);
}

function timingSourceAvailability(day, rows, waterMode) {
  return {
    weather: rows.some((row) => isValidNumber(row.windSpeed) || isValidNumber(row.pressure)),
    marine: rows.some((row) => isValidNumber(row.waveHeight) || isValidNumber(row.surfaceCurrent)),
    tide: rows.some((row) => isValidNumber(row.seaLevel)),
    river: waterMode !== WATER_MODES.SEA && isValidNumber(day?.riverFlow),
    solunar: Boolean(day?.date ?? rows[0]?.date),
  };
}

function timingWindowTone(score) {
  if (score >= 72) return "good";
  if (score >= 48) return "maybe";
  return "poor";
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

function minutesFromClockOrNull(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const [hour, minute] = value.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  return hour * 60 + minute;
}

function minutesFromClock(value) {
  return minutesFromClockOrNull(value) ?? 0;
}

function normalizeTimelineMinute(value) {
  const fallback = isValidNumber(state.timelineMinute) ? state.timelineMinute : 12 * 60;
  const minute = Number.isFinite(Number(value)) ? Number(value) : fallback;
  return clamp(Math.round(minute / 15) * 15, 0, 23 * 60 + 45);
}

function selectedTimelineMinute() {
  state.timelineMinute = normalizeTimelineMinute(state.timelineMinute);
  return state.timelineMinute;
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function defaultTimelineMinute(day) {
  if (!day) return 12 * 60;
  const today = localDateKey();
  if (day.date !== today) return 12 * 60;
  const now = new Date();
  return normalizeTimelineMinute(now.getHours() * 60 + now.getMinutes());
}

function timelineSample(day, minute = selectedTimelineMinute()) {
  const activity = activityRows(day, state.activityFish);
  const nearest = nearestTimelineRow(activity, minute) ?? activity[0] ?? null;
  const nearestWeatherRow = nearestTimelineRow(day?.rows, minute) ?? day?.rows?.[0] ?? null;

  return {
    row: nearest,
    weatherRow: nearestWeatherRow,
    score: interpolateTimelineValue(activity, minute, "score") ?? nearest?.score ?? dayActivityScore(day),
    airTemperature: interpolateTimelineValue(day.rows, minute, "airTemperature"),
    seaTemperature: interpolateTimelineValue(day.rows, minute, "seaTemperature"),
    seaLevel: interpolateTimelineValue(day.rows, minute, "seaLevel"),
    pressure: interpolateTimelineValue(day.rows, minute, "pressure"),
    cloudCover: interpolateTimelineValue(day.rows, minute, "cloudCover"),
    precipitation: interpolateTimelineValue(day.rows, minute, "precipitation"),
    windSpeed: interpolateTimelineValue(day.rows, minute, "windSpeed"),
    windDirection: interpolateTimelineDirection(day.rows, minute, "windDirection"),
    windGust: interpolateTimelineValue(day.rows, minute, "windGust"),
    waveHeight: interpolateTimelineValue(day.rows, minute, "waveHeight"),
    waveDirection: interpolateTimelineDirection(day.rows, minute, "waveDirection"),
    wavePeriod: interpolateTimelineValue(day.rows, minute, "wavePeriod"),
    swellHeight: interpolateTimelineValue(day.rows, minute, "swellHeight"),
    swellDirection: interpolateTimelineDirection(day.rows, minute, "swellDirection"),
    surfaceCurrent: interpolateTimelineValue(day.rows, minute, "surfaceCurrent"),
    currentDirection: interpolateTimelineDirection(day.rows, minute, "currentDirection"),
    depthCurrent: interpolateTimelineValue(day.rows, minute, "depthCurrent"),
    depthDirection: interpolateTimelineDirection(day.rows, minute, "depthDirection"),
    depthSource: nearestWeatherRow?.depthSource ?? day.depthSource,
  };
}

function hybridTimelinePayload(day, minute = selectedTimelineMinute()) {
  if (!day?.rows?.length) {
    return {
      day,
      minute,
      points: [],
      markers: [],
      windows: [],
      sample: timelineSample(day, minute),
      hasTide: false,
      hasActivity: false,
    };
  }

  const cacheKey = [
    day.date,
    state.activityFish,
    isSeaMode() ? "sea" : "fresh",
    day.rows.length,
    day.rows[0]?.time ?? "",
    day.rows.at(-1)?.time ?? "",
  ].join("|");
  let cached = state.liveTimelinePayloadKey === cacheKey ? state.liveTimelinePayload : null;
  if (cached) {
    return {
      ...cached,
      minute,
      sample: timelineSample(day, minute),
      selectedPoint: nearestTimelineRow(cached.points, minute),
    };
  }

  const rows = day.rows.filter((row) => minutesFromClockOrNull(row.hour) != null);
  const activity = activityRows(day, state.activityFish);
  const activityByHour = new Map(activity.map((row) => [row.hour, row]));
  const windows = solunarWindows(day);
  const tideValues = rows.map((row) => row.seaLevel).filter(isValidNumber);
  const activityValues = activity.map((row) => row.score).filter(isValidNumber);
  const tideMin = min(tideValues);
  const tideMax = max(tideValues);
  const tideRange = isValidNumber(tideMin) && isValidNumber(tideMax) ? Math.max(0.01, tideMax - tideMin) : null;
  const activityMin = min(activityValues);
  const activityMax = max(activityValues);
  const activityRange = isValidNumber(activityMin) && isValidNumber(activityMax) ? Math.max(1, activityMax - activityMin) : null;

  const points = rows.map((row) => {
    const rowMinute = minutesFromClock(row.hour);
    const activityScore = activityByHour.get(row.hour)?.score ?? fishActivityForHour(row, state.activityFish, windows);
    const tideScore = tideRange == null || !isValidNumber(row.seaLevel)
      ? 0.52
      : (row.seaLevel - tideMin) / tideRange;
    const activityRatio = activityRange == null || !isValidNumber(activityScore)
      ? 0.52
      : (activityScore - activityMin) / activityRange;
    const hybrid = clamp(tideScore * 0.58 + activityRatio * 0.42, 0, 1);

    return {
      minute: rowMinute,
      hour: row.hour,
      row,
      seaLevel: row.seaLevel,
      activityScore,
      weatherTone: sampleConditionTone(day, timelineSample(day, rowMinute)),
      tideRatio: tideScore,
      activityRatio,
      hybrid,
    };
  });

  const firstRow = rows[0] ?? {};
  const extrema = tideValues.length >= 2 ? tideExtrema(rows.filter((row) => isValidNumber(row.seaLevel))) : { highs: [], lows: [] };
  const tideMarkers = [
    ...extrema.highs.slice(0, 3).map((row) => ({
      type: "high",
      minute: minutesFromClockOrNull(row.hour),
      label: "PM",
      detail: `${row.hour} · ${formatTideHeight(row.seaLevel)}`,
    })),
    ...extrema.lows.slice(0, 3).map((row) => ({
      type: "low",
      minute: minutesFromClockOrNull(row.hour),
      label: "BM",
      detail: `${row.hour} · ${formatTideHeight(row.seaLevel)}`,
    })),
  ].sort((a, b) => a.minute - b.minute);
  const markers = [
    isValidNumber(day.bestWindow?.peakMinute)
      ? {
          type: "best",
          minute: day.bestWindow.peakMinute,
          label: "Pic",
          detail: day.bestWindow.label,
        }
      : null,
    ...tideMarkers,
    {
      type: "sunrise",
      minute: minutesFromDateTime(firstRow.sunrise),
      label: "Lever",
      detail: "Soleil",
    },
    {
      type: "sunset",
      minute: minutesFromDateTime(firstRow.sunset),
      label: "Coucher",
      detail: "Soleil",
    },
    ...windows.major.slice(0, 2).map((window) => ({
      type: "moon",
      minute: window.center,
      label: "Lune",
      detail: window.label,
    })),
  ].filter((marker) => marker && isValidNumber(marker.minute));

  const favorableWindows = [
    isValidNumber(day.bestWindow?.startMinute) && isValidNumber(day.bestWindow?.endMinute)
      ? {
          type: "best",
          start: day.bestWindow.startMinute,
          end: day.bestWindow.endMinute,
          label: day.bestWindow.label,
        }
      : null,
    ...windows.major.map((window) => ({
      type: "major",
      start: window.start,
      end: window.end,
      label: window.label,
    })),
  ].filter(Boolean);

  cached = {
    day,
    points,
    markers,
    windows: favorableWindows,
    hasTide: tideValues.length >= 2,
    hasActivity: activityValues.length >= 2,
  };
  state.liveTimelinePayloadKey = cacheKey;
  state.liveTimelinePayload = cached;

  return {
    ...cached,
    minute,
    sample: timelineSample(day, minute),
    selectedPoint: nearestTimelineRow(points, minute),
  };
}

function timelineBounds(rows, minute = selectedTimelineMinute()) {
  const points = (rows ?? [])
    .map((row, index) => ({ row, index, minute: minutesFromClockOrNull(row.hour) }))
    .filter((point) => point.minute != null);

  if (!points.length) return null;

  let before = points[0];
  let after = points.at(-1);
  for (const point of points) {
    if (point.minute <= minute) before = point;
    if (point.minute >= minute) {
      after = point;
      break;
    }
  }

  return { before, after };
}

function nearestTimelineRow(rows, minute = selectedTimelineMinute()) {
  const bounds = timelineBounds(rows, minute);
  if (!bounds) return null;
  const beforeDistance = Math.abs(bounds.before.minute - minute);
  const afterDistance = Math.abs(bounds.after.minute - minute);
  return beforeDistance <= afterDistance ? bounds.before.row : bounds.after.row;
}

function interpolateTimelineValue(rows, minute, key) {
  const bounds = timelineBounds(rows, minute);
  if (!bounds) return null;

  const beforeValue = bounds.before.row?.[key];
  const afterValue = bounds.after.row?.[key];
  const span = bounds.after.minute - bounds.before.minute;

  if (isValidNumber(beforeValue) && isValidNumber(afterValue) && span > 0) {
    return beforeValue + ((afterValue - beforeValue) * (minute - bounds.before.minute)) / span;
  }

  const nearestValue = nearestTimelineRow(rows, minute)?.[key];
  return isValidNumber(nearestValue) ? nearestValue : null;
}

function interpolateTimelineDirection(rows, minute, key) {
  const bounds = timelineBounds(rows, minute);
  if (!bounds) return null;

  const beforeValue = bounds.before.row?.[key];
  const afterValue = bounds.after.row?.[key];
  const span = bounds.after.minute - bounds.before.minute;

  if (isValidNumber(beforeValue) && isValidNumber(afterValue) && span > 0) {
    const progress = (minute - bounds.before.minute) / span;
    const delta = ((afterValue - beforeValue + 540) % 360) - 180;
    return normalizeDirection(beforeValue + delta * progress);
  }

  const nearestValue = nearestTimelineRow(rows, minute)?.[key];
  return isValidNumber(nearestValue) ? normalizeDirection(nearestValue) : null;
}

function timelineX(rows, pointX, minute = selectedTimelineMinute()) {
  const bounds = timelineBounds(rows, minute);
  if (!bounds) return null;
  const beforeX = pointX(bounds.before.index);
  const afterX = pointX(bounds.after.index);
  const span = bounds.after.minute - bounds.before.minute;
  if (span <= 0) return beforeX;
  return beforeX + ((afterX - beforeX) * (minute - bounds.before.minute)) / span;
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

function formatHourTick(value) {
  const rawMinutes = minutesFromClockOrNull(value);
  if (rawMinutes == null) return "--";
  if (Math.round(rawMinutes) === 1440) return "24h";
  const minutes = Math.round(wrapMinute(rawMinutes));
  const hour = Math.floor(minutes / 60) % 24;
  return `${String(hour).padStart(2, "0")}h`;
}

function formatHourCompact(value) {
  const rawMinutes = minutesFromClockOrNull(value);
  if (rawMinutes == null) return "--";
  if (Math.round(rawMinutes) === 1440) return "24h";
  const minutes = Math.round(wrapMinute(rawMinutes));
  const hour = Math.floor(minutes / 60) % 24;
  const minute = minutes % 60;
  return minute === 0
    ? `${String(hour).padStart(2, "0")}h`
    : `${String(hour).padStart(2, "0")}h${String(minute).padStart(2, "0")}`;
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

function getMapFocusPoint() {
  const providerCenter = state.mapProvider?.getCenter?.();
  if (providerCenter && isValidNumber(providerCenter.lat) && isValidNumber(providerCenter.lon)) {
    return providerCenter;
  }

  return getMapCenter();
}

function mapMetersPerCssPixel() {
  const rect = els.spotMap.getBoundingClientRect();
  const providerMetersPerPixel = state.mapProvider?.metersPerCssPixel?.();
  if (isValidNumber(providerMetersPerPixel)) return providerMetersPerPixel;

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

function formatMapDistance(meters) {
  if (!isValidNumber(meters)) return "--";
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

function mapOverlayTileUrl(overlay, x, y, zoom) {
  if (!overlay) return "";
  if (overlay.type === "xyz") return xyzTileUrl(overlay.url, x, y, zoom);
  if (overlay.type === "wms") return wmsTileUrl(overlay, x, y, zoom);
  return "";
}

function xyzTileUrl(template, x, y, zoom) {
  const worldTileCount = 2 ** zoom;
  return String(template)
    .replace("{z}", String(zoom))
    .replace("{x}", String(wrapTileX(x, worldTileCount)))
    .replace("{y}", String(y));
}

function wmsTileUrl(overlay, x, y, zoom) {
  const bbox = tileBbox4326(x, y, zoom);
  const params = new URLSearchParams({
    service: "WMS",
    request: "GetMap",
    version: overlay.version ?? "1.3.0",
    layers: overlay.layers,
    styles: overlay.styles ?? "",
    format: overlay.format ?? "image/png",
    transparent: String(overlay.transparent !== false),
    width: String(MAP_TILE_SIZE),
    height: String(MAP_TILE_SIZE),
    crs: "EPSG:4326",
    bbox: [bbox.south, bbox.west, bbox.north, bbox.east].map((value) => value.toFixed(6)).join(","),
  });
  return `${overlay.url}?${params.toString()}`;
}

function tileBbox4326(x, y, zoom) {
  const worldTileCount = 2 ** zoom;
  const westNorth = unprojectLatLon(wrapTileX(x, worldTileCount) * MAP_TILE_SIZE, y * MAP_TILE_SIZE, zoom);
  const eastSouth = unprojectLatLon((wrapTileX(x, worldTileCount) + 1) * MAP_TILE_SIZE, (y + 1) * MAP_TILE_SIZE, zoom);
  return {
    west: westNorth.lon,
    north: westNorth.lat,
    east: eastSouth.lon,
    south: eastSouth.lat,
  };
}

function removeGoogleOverlay(map, layer) {
  if (!map || !layer) return;
  const overlays = map.overlayMapTypes;
  const index = overlays.getArray().indexOf(layer);
  if (index >= 0) overlays.removeAt(index);
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

function roundNumber(value, precision = 2) {
  if (!isValidNumber(value)) return null;
  return Number(Number(value).toFixed(precision));
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
  return new Intl.DateTimeFormat(currentLocale(), {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${date}T12:00:00`));
}

function formatShortDay(date) {
  return new Intl.DateTimeFormat(currentLocale(), {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));
}

function formatNumber(value, digits = 0) {
  if (!isValidNumber(value)) return "--";
  return new Intl.NumberFormat(currentLocale(), {
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
  if (els.statusPill) {
    els.statusPill.textContent = t(label);
    els.statusPill.classList.toggle("is-loading", mode === "loading");
    els.statusPill.classList.toggle("is-error", mode === "error");
    els.statusPill.classList.toggle("is-warning", mode === "warning");
    els.statusPill.classList.toggle("is-ready", mode === "ready");
    els.statusPill.classList.toggle("is-offline", mode === "offline");
  }
  setText(els.forecastStatusDetail, forecastStatusDetail(label, mode));
}

function forecastStatusDetail(label, mode) {
  if (mode === "offline") {
    return t("Connexion absente. Les écrans déjà consultés restent disponibles hors ligne.");
  }
  if (mode === "loading") {
    return t("Chargement météo, mer, Copernicus et GloFAS pour le spot actif.");
  }
  if (mode === "error") {
    return t("Impossible de charger les conditions du spot. Vérifie la connexion ou les coordonnées.");
  }
  if (mode === "warning" && /copernicus/i.test(label)) {
    return state.realDepthError
      ? `${t("Copernicus indisponible")}: ${state.realDepthError}`
      : t("Copernicus indisponible pour le courant en profondeur. Les prévisions météo et marine restent affichées.");
  }
  if (mode === "warning" && /glofas/i.test(label)) {
    return state.riverForecastError && state.riverForecastError !== "GloFAS indispo"
      ? `${t("GloFAS indispo")}: ${state.riverForecastError}`
      : t("GloFAS indisponible pour le débit rivière. Les prévisions météo restent affichées.");
  }
  if (mode === "warning") {
    return t("Données partielles: certaines sources sont indisponibles pour ce spot.");
  }
  if (/copernicus/i.test(label)) {
    return t("Données Copernicus actives pour les courants en profondeur.");
  }
  if (/glofas/i.test(label)) {
    return t("Données GloFAS actives pour le débit rivière.");
  }
  if (label === "À jour" || mode === "ready") {
    return t("Données synchronisées pour le spot actif.");
  }
  return `${t("État des données")}: ${t(label)}`;
}

function saveSettings() {
  const spot = spots[Number(els.spotPreset.value)] ?? spots[0];
  const payload = {
    waterMode: state.waterMode,
    mobileView: state.activeMobileView,
    weatherSubtab: state.activeWeatherSubtab,
    atmosphereChart: normalizeAtmosphereChart(state.activeAtmosphereChart),
    spotIndex: Number(els.spotPreset.value),
    spotName: spot.name,
    customName: state.selectedSpotName,
    lat: Number(els.latitude.value),
    lon: Number(els.longitude.value),
    depth: Number(els.depth.value),
    nauticalEnabled: state.nauticalEnabled,
    coastalEnabled: state.coastalEnabled,
    bathymetryEnabled: state.bathymetryEnabled,
    knownFishingEnabled: state.knownFishingEnabled,
    regulationEnabled: state.regulationEnabled,
    marineOverlayMode: state.marineOverlayMode,
    fishFilters: [...state.activeFishFilters],
    activityFish: state.activityFish,
    theme: normalizeTheme(state.theme),
    language: normalizeLanguage(state.language),
    isPro: isProUser(),
    profile: normalizeProfile(state.profile),
    onboardingCompleted: Boolean(state.onboardingCompleted),
    privacyAccepted: Boolean(state.privacyAccepted),
    notificationsEnabled: Boolean(state.notificationsEnabled),
    smartAlerts: normalizeSmartAlertSettings(state.smartAlerts),
    smartAlertSchedule: normalizeSmartAlertSchedule(state.smartAlertSchedule),
    entitlements: normalizeEntitlementState(state.entitlements),
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
    glancePayload: null,
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
  const storage = safeLocalStorage();
  if (!storage) return;
  storage.setItem(STORE_KEY, JSON.stringify(normalizeStore(store)));
}

function normalizeStore(store) {
  return {
    version: STORE_VERSION,
    settings: normalizeSettings(store?.settings ?? {}),
    favorites: Array.isArray(store?.favorites) ? store.favorites.map(normalizeFavorite).filter(Boolean) : [],
    catchLog: Array.isArray(store?.catchLog) ? store.catchLog.map(normalizeCatchLogEntry).filter(Boolean) : [],
    glancePayload: normalizeGlancePayload(store?.glancePayload),
  };
}

function normalizeGlancePayload(payload) {
  if (!payload || typeof payload !== "object") return null;
  return {
    version: Number(payload.version) || 1,
    generatedAt: typeof payload.generatedAt === "string" ? payload.generatedAt : new Date().toISOString(),
    staleAt: typeof payload.staleAt === "string" ? payload.staleAt : new Date().toISOString(),
    state: ["fresh", "offline", "stale"].includes(payload.state) ? payload.state : "stale",
    spot: {
      id: typeof payload.spot?.id === "string" ? payload.spot.id : "",
      name: typeof payload.spot?.name === "string" ? payload.spot.name : "",
      lat: isValidNumber(payload.spot?.lat) ? payload.spot.lat : null,
      lon: isValidNumber(payload.spot?.lon) ? payload.spot.lon : null,
      waterMode: normalizeWaterMode(payload.spot?.waterMode),
    },
    species: {
      id: normalizeActivityFish(payload.species?.id),
      label: typeof payload.species?.label === "string" ? payload.species.label : "",
    },
    day: {
      date: typeof payload.day?.date === "string" ? payload.day.date : "",
      label: typeof payload.day?.label === "string" ? payload.day.label : "",
    },
    activity: {
      score: clamp(Number(payload.activity?.score) || 0, 0, 100),
      tone: typeof payload.activity?.tone === "string" ? payload.activity.tone : "maybe",
      label: typeof payload.activity?.label === "string" ? payload.activity.label : "",
    },
    window: {
      label: typeof payload.window?.label === "string" ? payload.window.label : "--",
      peakMinute: isValidNumber(payload.window?.peakMinute) ? payload.window.peakMinute : null,
      peakHour: typeof payload.window?.peakHour === "string" ? payload.window.peakHour : "--",
      reasons: Array.isArray(payload.window?.reasons) ? payload.window.reasons.slice(0, 2).map(String) : [],
      risks: Array.isArray(payload.window?.risks) ? payload.window.risks.slice(0, 2).map(String) : [],
    },
    water: payload.water && typeof payload.water === "object" ? payload.water : {},
    weather: payload.weather && typeof payload.weather === "object" ? payload.weather : {},
    moon: payload.moon && typeof payload.moon === "object" ? payload.moon : {},
    sourceAvailability: payload.sourceAvailability && typeof payload.sourceAvailability === "object"
      ? payload.sourceAvailability
      : {},
  };
}

function normalizeSettings(settings) {
  return {
    waterMode: normalizeWaterMode(settings.waterMode),
    mobileView: normalizeMobileView(settings.mobileView),
    weatherSubtab: normalizeWeatherSubtab(settings.weatherSubtab ?? weatherSubtabFromMobileView(settings.mobileView)),
    atmosphereChart: normalizeAtmosphereChart(settings.atmosphereChart),
    spotIndex: Number.isInteger(settings.spotIndex) ? settings.spotIndex : 0,
    spotName: typeof settings.spotName === "string" ? settings.spotName : "",
    customName: typeof settings.customName === "string" ? settings.customName : "",
    lat: isValidNumber(settings.lat) ? settings.lat : null,
    lon: isValidNumber(settings.lon) ? settings.lon : null,
    depth: isValidNumber(settings.depth) ? settings.depth : state.depth,
    nauticalEnabled: settings.nauticalEnabled !== false,
    coastalEnabled: settings.coastalEnabled !== false,
    bathymetryEnabled: settings.bathymetryEnabled !== false,
    knownFishingEnabled: settings.knownFishingEnabled !== false,
    regulationEnabled: settings.regulationEnabled !== false,
    marineOverlayMode: normalizeMarineOverlayMode(settings.marineOverlayMode),
    fishFilters: Array.isArray(settings.fishFilters) ? settings.fishFilters : ["all"],
    activityFish: typeof settings.activityFish === "string" ? settings.activityFish : "",
    theme: normalizeTheme(settings.theme),
    language: normalizeLanguage(settings.language),
    isPro: Boolean(settings.isPro),
    profile: normalizeProfile(settings.profile),
    onboardingCompleted: Boolean(settings.onboardingCompleted),
    privacyAccepted: Boolean(settings.privacyAccepted),
    notificationsEnabled: Boolean(settings.notificationsEnabled),
    smartAlerts: normalizeSmartAlertSettings(settings.smartAlerts),
    smartAlertSchedule: normalizeSmartAlertSchedule(settings.smartAlertSchedule),
    entitlements: normalizeEntitlementState(settings.entitlements),
  };
}

function defaultEntitlementState() {
  return {
    tier: "free",
    source: "local",
    expiresAt: null,
    checkedAt: null,
    features: {},
  };
}

function normalizeEntitlementState(entitlements) {
  const source = entitlements && typeof entitlements === "object" ? entitlements : {};
  const tier = ENTITLEMENT_TIERS.includes(source.tier) ? source.tier : "free";
  const entitlementSource = ENTITLEMENT_SOURCES.includes(source.source) ? source.source : "local";
  const features = source.features && typeof source.features === "object" ? source.features : {};

  return {
    tier,
    source: entitlementSource,
    expiresAt: typeof source.expiresAt === "string" ? source.expiresAt : null,
    checkedAt: typeof source.checkedAt === "string" ? source.checkedAt : null,
    features: Object.fromEntries(PRO_FEATURES.map((feature) => [feature, Boolean(features[feature])])),
  };
}

function hasEntitlement(entitlement = "pro") {
  if (entitlement === "pro" && isProUser()) return true;
  const entitlements = normalizeEntitlementState(state.entitlements);
  if (entitlement === "free") return true;
  if (entitlements.tier !== entitlement) return false;
  if (!entitlements.expiresAt) return true;
  return Date.parse(entitlements.expiresAt) > Date.now();
}

function featureRequiresPro(feature) {
  return FEATURE_ENTITLEMENTS[feature] === "pro";
}

function canUseFeature(feature) {
  const required = FEATURE_ENTITLEMENTS[feature] ?? "free";
  return required === "free" || hasEntitlement(required);
}

function proFeatureReason(feature) {
  if (canUseFeature(feature)) return "";
  return featureRequiresPro(feature)
    ? "Fonctionnalité MeteoCatch Pro."
    : "Fonctionnalité indisponible.";
}

function defaultSmartAlertSettings() {
  return {
    quietHours: { ...SMART_ALERT_DEFAULTS.quietHours },
    maxPerDay: SMART_ALERT_DEFAULTS.maxPerDay,
    alerts: Object.fromEntries(SMART_ALERT_TYPES.map((type) => {
      const config = SMART_ALERT_CATALOG[type];
      return [type, {
        enabled: Boolean(config?.defaultEnabled),
        leadMinutes: config?.leadMinutes ?? SMART_ALERT_DEFAULTS.leadMinutes,
        deliveryTime: config?.deliveryTime ?? null,
        proRequired: Boolean(config?.proRequired),
      }];
    })),
  };
}

function normalizeSmartAlertSettings(settings) {
  const defaults = defaultSmartAlertSettings();
  const source = settings && typeof settings === "object" ? settings : {};
  const sourceAlerts = source.alerts && typeof source.alerts === "object" ? source.alerts : {};

  return {
    quietHours: {
      start: normalizeClockTime(source.quietHours?.start, defaults.quietHours.start),
      end: normalizeClockTime(source.quietHours?.end, defaults.quietHours.end),
    },
    maxPerDay: clamp(Number(source.maxPerDay) || defaults.maxPerDay, 1, 5),
    alerts: Object.fromEntries(SMART_ALERT_TYPES.map((type) => {
      const config = SMART_ALERT_CATALOG[type];
      const saved = sourceAlerts[type] && typeof sourceAlerts[type] === "object" ? sourceAlerts[type] : {};
      const fallback = defaults.alerts[type];
      return [type, {
        enabled: Boolean(saved.enabled ?? fallback.enabled),
        leadMinutes: clamp(Number(saved.leadMinutes) || fallback.leadMinutes, 0, 180),
        deliveryTime: normalizeClockTime(saved.deliveryTime, fallback.deliveryTime),
        proRequired: Boolean(config?.proRequired),
      }];
    })),
  };
}

function normalizeClockTime(value, fallback = null) {
  if (value == null && fallback == null) return null;
  const text = typeof value === "string" ? value : fallback;
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(text) ? text : fallback;
}

function normalizeSmartAlertSchedule(schedule) {
  if (!Array.isArray(schedule)) return [];
  return schedule
    .map((item) => ({
      id: Number.isInteger(item?.id) ? item.id : null,
      type: SMART_ALERT_TYPES.includes(item?.type) ? item.type : "",
      title: typeof item?.title === "string" ? item.title : "",
      body: typeof item?.body === "string" ? item.body : "",
      spotId: typeof item?.spotId === "string" ? item.spotId : "",
      spotName: typeof item?.spotName === "string" ? item.spotName : "",
      date: typeof item?.date === "string" ? item.date : "",
      scheduledAt: typeof item?.scheduledAt === "string" ? item.scheduledAt : "",
    }))
    .filter((item) => item.id && item.type && item.scheduledAt);
}

function normalizeTheme(theme) {
  return THEME_MODES.includes(theme) ? theme : "light";
}

function normalizeProfile(profile) {
  const source = profile && typeof profile === "object" ? profile : {};
  return Object.fromEntries(Object.entries(profileOptions).map(([control, options]) => {
    const fallback = DEFAULT_PROFILE[control];
    const value = options.some((option) => option.id === source[control]) ? source[control] : fallback;
    return [control, value];
  }));
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
    media: Array.isArray(entry.media) ? entry.media.map(normalizeCatchMediaItem).filter(Boolean) : [],
  };
}

function normalizeCatchMediaItem(item) {
  if (!item || typeof item !== "object") return null;
  if (item.type !== "image" || typeof item.dataUrl !== "string" || !item.dataUrl.startsWith("data:image/")) {
    return null;
  }
  return {
    id: typeof item.id === "string" ? item.id : `photo:${Date.now()}`,
    type: "image",
    dataUrl: item.dataUrl,
    alt: typeof item.alt === "string" ? item.alt.slice(0, 80) : "Photo de prise",
    createdAt: item.createdAt ?? new Date().toISOString(),
  };
}

function parseStoredJson(key) {
  try {
    const storage = safeLocalStorage();
    const value = storage?.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function safeLocalStorage() {
  try {
    return window.localStorage ?? null;
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

function textTooltip(value) {
  const span = document.createElement("span");
  span.textContent = value;
  return span;
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

function mapProviderSmokeRoutes(baseUrl = window.location.href) {
  const base = String(baseUrl || window.location.href).split("?")[0];
  const route = (label, params, expected) => {
    const search = new URLSearchParams(params);
    return { label, url: `${base}?${search.toString()}`, params: Object.fromEntries(search.entries()), expected };
  };

  return [
    {
      label: "default",
      url: base,
      expected: {
        provider: MAP_PROVIDER_IDS.LEAFLET_OPENMAP,
        note: "Default builds keep Apple/Google providers disabled and fall back to Leaflet/OpenMap.",
      },
    },
    route("google-web-debug", {
      mapProviderOverride: MAP_PROVIDER_IDS.GOOGLE_WEB,
      mapProviderExperimental: MAP_PROVIDER_IDS.GOOGLE_WEB,
      mapProviderDebugSdk: "google",
    }, {
      provider: MAP_PROVIDER_IDS.GOOGLE_WEB,
      fallbackReason: "",
    }),
    route("apple-web-debug", {
      mapProviderOverride: MAP_PROVIDER_IDS.APPLE_WEB,
      mapProviderExperimental: MAP_PROVIDER_IDS.APPLE_WEB,
      mapProviderDebugSdk: "apple",
    }, {
      provider: MAP_PROVIDER_IDS.APPLE_WEB,
      fallbackReason: "",
    }),
    route("google-web-debug-fail", {
      mapProviderOverride: MAP_PROVIDER_IDS.GOOGLE_WEB,
      mapProviderExperimental: MAP_PROVIDER_IDS.GOOGLE_WEB,
      mapProviderDebugSdk: "google",
      mapProviderDebugSdkFail: "google",
    }, {
      provider: MAP_PROVIDER_IDS.LEAFLET_OPENMAP,
      preference: MAP_PROVIDER_IDS.GOOGLE_WEB,
      fallbackReason: "mount-failed",
    }),
    route("apple-web-debug-fail", {
      mapProviderOverride: MAP_PROVIDER_IDS.APPLE_WEB,
      mapProviderExperimental: MAP_PROVIDER_IDS.APPLE_WEB,
      mapProviderDebugSdk: "apple",
      mapProviderDebugSdkFail: "apple",
    }, {
      provider: MAP_PROVIDER_IDS.LEAFLET_OPENMAP,
      preference: MAP_PROVIDER_IDS.APPLE_WEB,
      fallbackReason: "mount-failed",
    }),
    route("apple-native-debug-bridge", {
      mapProviderOverride: MAP_PROVIDER_IDS.APPLE_NATIVE,
      mapProviderExperimental: MAP_PROVIDER_IDS.APPLE_NATIVE,
      mapProviderDebugBridge: "1",
    }, {
      provider: MAP_PROVIDER_IDS.APPLE_NATIVE,
      fallbackReason: "",
    }),
    route("apple-native-debug-bridge-events", {
      mapProviderOverride: MAP_PROVIDER_IDS.APPLE_NATIVE,
      mapProviderExperimental: MAP_PROVIDER_IDS.APPLE_NATIVE,
      mapProviderDebugBridge: "1",
      mapProviderDebugSimulateEvents: "1",
    }, {
      provider: MAP_PROVIDER_IDS.APPLE_NATIVE,
      fallbackReason: "",
      nativeEventCountMin: 2,
      nativeEventTypes: ["map:apple-native:moveend", "map:apple-native:zoomend"],
      optionalNativeEventTypes: ["map:apple-native:click"],
      nativeDebugDatasets: [
        "data-native-map-bridge-debug-event-count",
        "data-native-map-bridge-debug-last-camera-center",
        "data-native-map-bridge-debug-last-camera-zoom",
      ],
      note: "Auto-simulates native move and item-click callbacks for event parity smoke testing.",
    }),
    route("apple-native-debug-bridge-not-ready", {
      mapProviderOverride: MAP_PROVIDER_IDS.APPLE_NATIVE,
      mapProviderExperimental: MAP_PROVIDER_IDS.APPLE_NATIVE,
      mapProviderDebugBridge: "1",
      mapProviderDebugBridgeUnsupported: "apple",
    }, {
      provider: MAP_PROVIDER_IDS.LEAFLET_OPENMAP,
      preference: MAP_PROVIDER_IDS.APPLE_NATIVE,
      fallbackReason: "mount-failed",
    }),
    route("apple-native-debug-bridge-capability-protocol-fail", {
      mapProviderOverride: MAP_PROVIDER_IDS.APPLE_NATIVE,
      mapProviderExperimental: MAP_PROVIDER_IDS.APPLE_NATIVE,
      mapProviderDebugBridge: "1",
      mapProviderDebugBridgeCapabilityFail: "protocol",
    }, {
      provider: MAP_PROVIDER_IDS.LEAFLET_OPENMAP,
      preference: MAP_PROVIDER_IDS.APPLE_NATIVE,
      fallbackReason: "mount-failed",
      nativeCapabilityError: "protocol-version-mismatch",
    }),
    route("apple-native-debug-bridge-capability-commands-fail", {
      mapProviderOverride: MAP_PROVIDER_IDS.APPLE_NATIVE,
      mapProviderExperimental: MAP_PROVIDER_IDS.APPLE_NATIVE,
      mapProviderDebugBridge: "1",
      mapProviderDebugBridgeCapabilityFail: "commands",
    }, {
      provider: MAP_PROVIDER_IDS.LEAFLET_OPENMAP,
      preference: MAP_PROVIDER_IDS.APPLE_NATIVE,
      fallbackReason: "mount-failed",
      nativeCapabilityErrorPrefix: "missing-commands:",
    }),
    route("apple-native-debug-bridge-capability-events-fail", {
      mapProviderOverride: MAP_PROVIDER_IDS.APPLE_NATIVE,
      mapProviderExperimental: MAP_PROVIDER_IDS.APPLE_NATIVE,
      mapProviderDebugBridge: "1",
      mapProviderDebugBridgeCapabilityFail: "events",
    }, {
      provider: MAP_PROVIDER_IDS.LEAFLET_OPENMAP,
      preference: MAP_PROVIDER_IDS.APPLE_NATIVE,
      fallbackReason: "mount-failed",
      nativeCapabilityErrorPrefix: "missing-events:",
    }),
    route("google-native-debug-bridge", {
      mapProviderOverride: MAP_PROVIDER_IDS.GOOGLE_NATIVE,
      mapProviderExperimental: MAP_PROVIDER_IDS.GOOGLE_NATIVE,
      mapProviderDebugBridge: "1",
    }, {
      provider: MAP_PROVIDER_IDS.GOOGLE_NATIVE,
      fallbackReason: "",
    }),
    route("google-native-debug-bridge-events", {
      mapProviderOverride: MAP_PROVIDER_IDS.GOOGLE_NATIVE,
      mapProviderExperimental: MAP_PROVIDER_IDS.GOOGLE_NATIVE,
      mapProviderDebugBridge: "1",
      mapProviderDebugSimulateEvents: "1",
    }, {
      provider: MAP_PROVIDER_IDS.GOOGLE_NATIVE,
      fallbackReason: "",
      nativeEventCountMin: 2,
      nativeEventTypes: ["map:google-native:moveend", "map:google-native:zoomend"],
      optionalNativeEventTypes: ["map:google-native:click"],
      nativeDebugDatasets: [
        "data-native-map-bridge-debug-event-count",
        "data-native-map-bridge-debug-last-camera-center",
        "data-native-map-bridge-debug-last-camera-zoom",
      ],
      note: "Auto-simulates native move and item-click callbacks for event parity smoke testing.",
    }),
    route("google-native-debug-bridge-not-ready", {
      mapProviderOverride: MAP_PROVIDER_IDS.GOOGLE_NATIVE,
      mapProviderExperimental: MAP_PROVIDER_IDS.GOOGLE_NATIVE,
      mapProviderDebugBridge: "1",
      mapProviderDebugBridgeUnsupported: "google",
    }, {
      provider: MAP_PROVIDER_IDS.LEAFLET_OPENMAP,
      preference: MAP_PROVIDER_IDS.GOOGLE_NATIVE,
      fallbackReason: "mount-failed",
    }),
    route("google-native-debug-bridge-capability-protocol-fail", {
      mapProviderOverride: MAP_PROVIDER_IDS.GOOGLE_NATIVE,
      mapProviderExperimental: MAP_PROVIDER_IDS.GOOGLE_NATIVE,
      mapProviderDebugBridge: "1",
      mapProviderDebugBridgeCapabilityFail: "protocol",
    }, {
      provider: MAP_PROVIDER_IDS.LEAFLET_OPENMAP,
      preference: MAP_PROVIDER_IDS.GOOGLE_NATIVE,
      fallbackReason: "mount-failed",
      nativeCapabilityError: "protocol-version-mismatch",
    }),
    route("google-native-debug-bridge-capability-commands-fail", {
      mapProviderOverride: MAP_PROVIDER_IDS.GOOGLE_NATIVE,
      mapProviderExperimental: MAP_PROVIDER_IDS.GOOGLE_NATIVE,
      mapProviderDebugBridge: "1",
      mapProviderDebugBridgeCapabilityFail: "commands",
    }, {
      provider: MAP_PROVIDER_IDS.LEAFLET_OPENMAP,
      preference: MAP_PROVIDER_IDS.GOOGLE_NATIVE,
      fallbackReason: "mount-failed",
      nativeCapabilityErrorPrefix: "missing-commands:",
    }),
    route("google-native-debug-bridge-capability-events-fail", {
      mapProviderOverride: MAP_PROVIDER_IDS.GOOGLE_NATIVE,
      mapProviderExperimental: MAP_PROVIDER_IDS.GOOGLE_NATIVE,
      mapProviderDebugBridge: "1",
      mapProviderDebugBridgeCapabilityFail: "events",
    }, {
      provider: MAP_PROVIDER_IDS.LEAFLET_OPENMAP,
      preference: MAP_PROVIDER_IDS.GOOGLE_NATIVE,
      fallbackReason: "mount-failed",
      nativeCapabilityErrorPrefix: "missing-events:",
    }),
  ];
}

function installMapProviderDebugInspector() {
  const smokeRoutes = mapProviderSmokeRoutes();
  const expectedOutcomeRoutes = smokeRoutes.reduce((routes, route) => {
    routes[route.label] = {
      provider: route.expected?.provider ?? "",
      preference: route.expected?.preference ?? "",
      fallbackReason: route.expected?.fallbackReason ?? "",
    };
    return routes;
  }, {});
  const routeParamRoutes = smokeRoutes.reduce((routes, route) => {
    routes[route.label] = route.params ?? {};
    return routes;
  }, {});
  const routeUrlRoutes = smokeRoutes.reduce((routes, route) => {
    routes[route.label] = route.url ?? "";
    return routes;
  }, {});
  const eventSmokeRouteLabels = smokeRoutes
    .filter((route) => Number(route.expected?.nativeEventCountMin) > 0)
    .map((route) => route.label);
  const capabilitySmokeRouteLabels = smokeRoutes
    .filter((route) => route.expected?.nativeCapabilityError || route.expected?.nativeCapabilityErrorPrefix)
    .map((route) => route.label);
  const nativeCapabilityErrorRoutes = smokeRoutes
    .filter((route) => route.expected?.nativeCapabilityError || route.expected?.nativeCapabilityErrorPrefix)
    .reduce((routes, route) => {
      routes[route.label] = {
        error: route.expected?.nativeCapabilityError ?? "",
        errorPrefix: route.expected?.nativeCapabilityErrorPrefix ?? "",
      };
      return routes;
    }, {});
  const unsupportedSmokeRouteLabels = smokeRoutes
    .filter((route) => route.params?.mapProviderDebugBridgeUnsupported)
    .map((route) => route.label);
  const nativeDebugDatasetRoutes = smokeRoutes
    .filter((route) => Array.isArray(route.expected?.nativeDebugDatasets) && route.expected.nativeDebugDatasets.length > 0)
    .reduce((routes, route) => {
      routes[route.label] = route.expected.nativeDebugDatasets;
      return routes;
    }, {});
  const inspector = {
    mapOverlayTileUrl,
    tileBbox4326,
    xyzTileUrl,
    wmsTileUrl,
    coordinateNormalizationSamples: mapProviderCoordinateNormalizationSamples,
    nativeBridgeContract,
    mapProviderSmokeRoutes,
    nativeBridgeDebugState: (providerId = state.mapProviderId || state.mapProviderPreference) => nativeMapBridgeDebugState(resolveNativeMapBridge(), providerId),
    nativePayloadSamples: () => ({
      tileOverlay: nativeTileOverlayPayload(SHARED_MAP_TILE_OVERLAYS.seamarks),
      marker: nativeMarkerPayload({
        lat: 43.2965,
        lon: 5.3698,
        title: "Sample marker",
        icon: {
          className: "map-pin-marker",
          html: pinIcon(),
          iconSize: [34, 42],
          iconAnchor: [17, 42],
        },
        tooltip: { content: "Sample marker" },
        zIndexOffset: 1000,
      }),
      circle: nativeShapePayload({
        lat: 43.2965,
        lon: 5.3698,
        radius: 150,
        color: "#2f7fa3",
        fillColor: "#2f7fa3",
        fillOpacity: 0.18,
        weight: 2,
        tooltip: { content: "Sample circle" },
      }),
    }),
    providerMatrix: () => Object.values(MAP_PROVIDER_IDS).map(mapProviderDescriptor),
    providerState: () => ({
      provider: state.mapProviderId,
      preferred: state.mapProviderPreference,
      override: mapProviderOverride(),
      configReady: state.mapProviderConfigReady,
      fallbackActive: state.mapProviderFallbackActive,
      fallbackReason: state.mapProviderFallbackReason,
    }),
  };

  window.METEOPECHE_MAP_PROVIDER_DEBUG = Object.freeze(inspector);
  document.documentElement.dataset.mapProviderDebugInspector = "ready";
  document.documentElement.dataset.mapProviderSmokeRouteCount = String(smokeRoutes.length);
  document.documentElement.dataset.mapProviderSmokeRouteLabels = smokeRoutes.map((route) => route.label).join(",");
  document.documentElement.dataset.mapProviderSmokeRouteParams = JSON.stringify(routeParamRoutes);
  document.documentElement.dataset.mapProviderSmokeRouteUrls = JSON.stringify(routeUrlRoutes);
  document.documentElement.dataset.mapProviderSmokeExpectedOutcomes = JSON.stringify(expectedOutcomeRoutes);
  document.documentElement.dataset.mapProviderSmokeEventRouteLabels = eventSmokeRouteLabels.join(",");
  document.documentElement.dataset.mapProviderSmokeCapabilityRouteLabels = capabilitySmokeRouteLabels.join(",");
  document.documentElement.dataset.mapProviderSmokeNativeCapabilityErrors = JSON.stringify(nativeCapabilityErrorRoutes);
  document.documentElement.dataset.mapProviderSmokeUnsupportedRouteLabels = unsupportedSmokeRouteLabels.join(",");
  document.documentElement.dataset.mapProviderSmokeNativeDebugDatasets = JSON.stringify(nativeDebugDatasetRoutes);
}

installMapProviderDebugInspector();
init().catch((error) => {
  document.documentElement.dataset.appStartupError = error?.message || String(error);
  console.error("MeteoCatch startup failed", error);
  scheduleHideAppSplash(250);
});
window.addEventListener("load", () => scheduleHideAppSplash(250), { once: true });
