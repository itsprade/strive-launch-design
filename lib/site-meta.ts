export type SiteMetaPreview = {
  hostname: string;
  title: string | null;
  description: string | null;
  image: string | null;
};

export function normalizeSiteUrlForFetch(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(t) ? t : `https://${t}`);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}
