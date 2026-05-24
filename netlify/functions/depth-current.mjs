export default async function handler() {
  return Response.json({
    ok: false,
    source: "netlify",
    error: "Courant profondeur Copernicus indisponible sur le déploiement Netlify statique.",
  });
}
