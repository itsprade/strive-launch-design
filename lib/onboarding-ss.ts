/** Shared URL guard for onboarding server-side fetches (SSRF-safe public HTTP/S only). */

export function isAllowedOnboardingFetchUrl(u: URL): boolean {
  if (u.protocol !== "http:" && u.protocol !== "https:") return false;
  const host = u.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "0.0.0.0" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local")
  ) {
    return false;
  }
  if (/^127\./.test(host)) return false;
  if (/^10\./.test(host)) return false;
  if (/^192\.168\./.test(host)) return false;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return false;
  if (host === "[::1]") return false;
  return true;
}

export function onboardingTargetUrlFromQuery(raw: string): URL | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(t) ? t : `https://${t}`);
    if (!isAllowedOnboardingFetchUrl(u)) return null;
    return u;
  } catch {
    return null;
  }
}

export function sameRegistrableSite(a: URL, b: URL): boolean {
  const h = (u: URL) => u.hostname.replace(/^www\./i, "").toLowerCase();
  return h(a) === h(b);
}
