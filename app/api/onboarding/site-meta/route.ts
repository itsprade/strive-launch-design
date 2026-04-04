import { NextResponse } from "next/server";
import {
  isAllowedOnboardingFetchUrl,
  onboardingTargetUrlFromQuery,
} from "@/lib/onboarding-ss";

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&nbsp;/gi, " ");
}

function metaProperty(html: string, property: string): string | undefined {
  const esc = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta\\s+[^>]*property=["']${esc}["'][^>]*content=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<meta\\s+[^>]*content=["']([^"']*)["'][^>]*property=["']${esc}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]?.trim()) return decodeEntities(m[1].trim());
  }
  return undefined;
}

function metaName(html: string, name: string): string | undefined {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta\\s+[^>]*name=["']${esc}["'][^>]*content=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<meta\\s+[^>]*content=["']([^"']*)["'][^>]*name=["']${esc}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]?.trim()) return decodeEntities(m[1].trim());
  }
  return undefined;
}

function titleTag(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (m?.[1]?.trim()) return decodeEntities(m[1].trim());
  return undefined;
}

function resolveUrl(href: string, base: URL): string | null {
  try {
    const u = new URL(href, base);
    if (!isAllowedOnboardingFetchUrl(u)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

const MAX_BYTES = 850_000;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("url")?.trim() ?? "";
  const pageUrl = onboardingTargetUrlFromQuery(raw);
  if (!pageUrl) {
    return NextResponse.json(
      { error: "URL not allowed" },
      { status: 400 },
    );
  }

  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 12_000);

  try {
    const res = await fetch(pageUrl.toString(), {
      signal: ac.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; StriveOnboarding/1.0; +https://strive.app)",
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      return NextResponse.json({
        hostname: pageUrl.hostname.replace(/^www\./, ""),
        title: null,
        description: null,
        image: null,
      });
    }

    const reader = res.body?.getReader();
    if (!reader) {
      return NextResponse.json({
        hostname: pageUrl.hostname.replace(/^www\./, ""),
        title: null,
        description: null,
        image: null,
      });
    }

    const dec = new TextDecoder();
    let html = "";
    let total = 0;
    while (total < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      html += dec.decode(value, { stream: true });
      if (html.includes("</head>") || total >= MAX_BYTES) break;
    }
    reader.releaseLock();

    const title =
      metaProperty(html, "og:title") ??
      metaName(html, "twitter:title") ??
      titleTag(html);

    const description =
      metaProperty(html, "og:description") ??
      metaName(html, "twitter:description") ??
      metaName(html, "description");

    const rawImage =
      metaProperty(html, "og:image") ??
      metaName(html, "twitter:image") ??
      metaName(html, "twitter:image:src");

    const image = rawImage ? resolveUrl(rawImage, pageUrl) : null;

    return NextResponse.json({
      hostname: pageUrl.hostname.replace(/^www\./, ""),
      title: title ?? null,
      description: description ?? null,
      image,
    });
  } catch {
    return NextResponse.json({
      hostname: pageUrl.hostname.replace(/^www\./, ""),
      title: null,
      description: null,
      image: null,
    });
  } finally {
    clearTimeout(t);
  }
}
