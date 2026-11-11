/**
 * Netlify serves every page with a trailing slash and 301-redirects the other
 * form, so every internal URL we generate must end with "/" to avoid a
 * redirect hop (and to keep canonical / sitemap URLs on the final address).
 *
 * Adds the slash to the path part (before any `?query` or `#hash`). Leaves
 * alone: external URLs, `mailto:`/`tel:`, hash-only links, and paths whose
 * last segment has a file extension (`/rss.xml`, `/search.json`, images).
 * Absolute `https://villoro.com/...` URLs are treated as internal.
 */
const SITE = "https://villoro.com";

export function withTrailingSlash(path: string): string {
  if (!path || path.startsWith("#") || path.startsWith("//")) return path;
  if (/^[a-z][a-z0-9+.-]*:/i.test(path) && !path.startsWith(SITE)) return path;

  const cut = path.search(/[?#]/);
  const pathname = cut === -1 ? path : path.slice(0, cut);
  const rest = cut === -1 ? "" : path.slice(cut);

  // Strip the origin when checking the last segment of an absolute URL.
  const lastSegment = pathname.replace(/^https?:\/\/[^/]+/, "").split("/").pop() ?? "";
  if (pathname.endsWith("/") || /\.[a-z0-9]+$/i.test(lastSegment)) return path;
  // Bare origin ("https://villoro.com") becomes "https://villoro.com/".
  return `${pathname}/${rest}`;
}
