/**
 * Resolve a public-folder asset path against Vite's configured base URL.
 *
 * Locally `import.meta.env.BASE_URL` is `/`, so `asset('/photos/foo.jpg')`
 * resolves to `/photos/foo.jpg`. On GitHub Pages it's `/Portfolio/`, so the
 * same call resolves to `/Portfolio/photos/foo.jpg`.
 *
 * External URLs (http/https/data) and already-prefixed paths are returned
 * as-is so the helper is safe to call indiscriminately.
 */
export function asset(path: string): string {
  if (!path) return path;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL ?? '/';
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  if (path.startsWith(base)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${trimmedBase}${normalized}`;
}
