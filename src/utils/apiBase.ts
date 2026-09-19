/**
 * Single source of truth for the API base URL.
 *
 * Reads VITE_API_URI once and guards against it being missing — a missing var
 * previously produced silent `https://.../undefined/api/...` requests. If it's
 * absent we log a loud error (dev) and fall back to a same-origin relative base
 * ('') so the URL is at least `/api/...` rather than `/undefined/api/...`.
 */
const rawBase = import.meta.env.VITE_API_URI;

if (!rawBase) {
  // eslint-disable-next-line no-console
  console.error(
    '[config] VITE_API_URI is not set — API calls will use a relative base. ' +
      'Add it to .env (e.g. VITE_API_URI="https://localhost:3001") and restart the dev server.'
  );
}

/** The resolved API base, never the string "undefined". */
export const API_BASE: string = rawBase ?? '';

/** Build a full API URL from a path. `apiUrl('/api/profile')`. */
export const apiUrl = (path: string): string =>
  `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
