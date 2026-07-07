/** Resolve a public/ asset path for the current Vite base (supports subdirectory deploy). */
export function resolvePublicPath(path) {
  const base = import.meta.env.BASE_URL;
  const clean = path.replace(/^\//, '');
  return `${base}${clean}`;
}
