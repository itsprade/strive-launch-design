import {
  isAllowedOnboardingFetchUrl,
  sameRegistrableSite,
} from "@/lib/onboarding-ss";

const USER_AGENT =
  "Mozilla/5.0 (compatible; StriveOnboarding/1.0; +https://strive.app)";

export type DiscoveredBlogPost = { title: string; url: string };

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&nbsp;/gi, " ");
}

function titleFromHtml(html: string): string | null {
  const og =
    html.match(
      /<meta\s+[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i,
    )?.[1] ??
    html.match(
      /<meta\s+[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["']/i,
    )?.[1];
  if (og?.trim()) return decodeEntities(og.trim());
  const raw = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
  if (!raw?.trim()) return null;
  let t = decodeEntities(raw.trim());
  t = t.replace(/\s*[|\u2013\u2014-]\s*[^|<]{2,80}$/i, "").trim();
  return t || null;
}

function extractSitemapLocs(xml: string): string[] {
  const out: string[] = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const s = m[1]?.trim();
    if (s) out.push(s);
  }
  return out;
}

function isSitemapIndex(xml: string): boolean {
  return /<sitemapindex\b/i.test(xml);
}

function looksLikeArticlePath(pathname: string): boolean {
  const p = pathname.toLowerCase();
  if (p.length < 4) return false;
  if (
    /\.(pdf|jpg|jpeg|png|gif|webp|svg|zip|xml|json|css|js|ico)$/i.test(p)
  ) {
    return false;
  }
  if (
    /\/(tag|tags|category|categories|author|authors|topic|topics|page|search|login|sign-in|signup|cart|checkout)\b/i.test(
      p,
    )
  ) {
    return false;
  }
  const segments = p.split("/").filter(Boolean);
  if (segments.length < 2) return false;

  const first = segments[0];
  if (/^\d{4}$/.test(first) && segments.length >= 3) return true;

  const blogRoots = new Set([
    "blog",
    "blogs",
    "articles",
    "news",
    "posts",
    "insights",
    "journal",
    "stories",
    "updates",
    "learn",
    "writing",
  ]);
  if (blogRoots.has(first)) return true;
  if (first === "resources" && segments[1] === "blog" && segments.length >= 3) {
    return true;
  }
  return false;
}

function extractAnchorHrefs(html: string, base: URL): string[] {
  const out: string[] = [];
  const re = /<a\s+[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const href = m[1]?.trim();
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("javascript:") ||
      href.startsWith("mailto:")
    ) {
      continue;
    }
    try {
      const u = new URL(href, base);
      if (!isAllowedOnboardingFetchUrl(u)) continue;
      if (!sameRegistrableSite(u, base)) continue;
      u.hash = "";
      out.push(u.toString());
    } catch {
      /* ignore */
    }
  }
  return out;
}

function addCandidatesFromHtml(
  html: string,
  pageBase: URL,
  candidates: Set<string>,
): void {
  for (const href of extractAnchorHrefs(html, pageBase)) {
    try {
      const u = new URL(href);
      if (looksLikeArticlePath(u.pathname)) candidates.add(u.toString());
    } catch {
      /* ignore */
    }
  }
}

function ingestUrlset(xml: string, base: URL, candidates: Set<string>): void {
  for (const loc of extractSitemapLocs(xml)) {
    try {
      const u = new URL(loc);
      if (!sameRegistrableSite(u, base)) continue;
      if (looksLikeArticlePath(u.pathname)) candidates.add(u.toString());
    } catch {
      /* ignore */
    }
  }
}

async function fetchText(
  url: string,
  maxBytes: number,
  timeoutMs: number,
): Promise<string> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ac.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,text/xml;q=0.8,*/*;q=0.7",
      },
      redirect: "follow",
    });
    if (!res.ok) return "";
    const reader = res.body?.getReader();
    if (!reader) return "";
    const dec = new TextDecoder();
    let text = "";
    let total = 0;
    while (total < maxBytes) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      text += dec.decode(value, { stream: true });
    }
    reader.releaseLock();
    return text;
  } catch {
    return "";
  } finally {
    clearTimeout(timer);
  }
}

function titleFromUrlFallback(url: string): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] ?? "Post";
    const words = last
      .replace(/\.[a-z0-9]+$/i, "")
      .split(/[-_]+/)
      .filter(Boolean)
      .slice(0, 8);
    if (!words.length) return "Blog article";
    return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  } catch {
    return "Blog article";
  }
}

export async function discoverBlogPosts(base: URL): Promise<DiscoveredBlogPost[]> {
  const candidates = new Set<string>();

  const homeHtml = await fetchText(base.toString(), 1_400_000, 14_000);
  if (homeHtml) addCandidatesFromHtml(homeHtml, base, candidates);

  if (candidates.size < 6) {
    const hubPaths = [
      "/blog",
      "/blog/",
      "/articles",
      "/articles/",
      "/news",
      "/news/",
      "/posts",
      "/insights/",
      "/journal",
    ];
    for (const path of hubPaths) {
      if (candidates.size >= 14) break;
      const hubUrl = new URL(path, base);
      const html = await fetchText(hubUrl.toString(), 900_000, 10_000);
      if (html) addCandidatesFromHtml(html, hubUrl, candidates);
    }
  }

  const smUrl = new URL("/sitemap.xml", base).toString();
  const smXml = await fetchText(smUrl, 950_000, 11_000);
  if (smXml.includes("<loc>")) {
    if (isSitemapIndex(smXml)) {
      const nested = extractSitemapLocs(smXml)
        .filter((l) => /\.xml(\?|$)/i.test(l))
        .slice(0, 4);
      for (const loc of nested) {
        if (candidates.size >= 20) break;
        const inner = await fetchText(loc, 950_000, 10_000);
        if (inner) ingestUrlset(inner, base, candidates);
      }
    } else {
      ingestUrlset(smXml, base, candidates);
    }
  }

  const ordered = [...candidates].slice(0, 14);
  const results: DiscoveredBlogPost[] = [];

  for (const url of ordered) {
    if (results.length >= 6) break;
    const html = await fetchText(url, 32_000, 8_000);
    let title = html ? titleFromHtml(html) : null;
    if (!title?.trim()) title = titleFromUrlFallback(url);
    if (title.length > 130) title = `${title.slice(0, 127)}…`;
    results.push({ title, url });
  }

  return results;
}
