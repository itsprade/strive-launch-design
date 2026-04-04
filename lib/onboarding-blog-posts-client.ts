import type { ContentInsightOutdatedPost } from "@/components/onboarding/constants";
import { normalizeSiteUrlForFetch } from "@/lib/site-meta";

/** Client fetch for `/api/onboarding/blog-posts`; returns null if none or error (use mock fallback). */
export async function fetchBlogPostsForOnboarding(
  submittedSiteDisplay: string,
): Promise<ContentInsightOutdatedPost[] | null> {
  const metaUrl = normalizeSiteUrlForFetch(submittedSiteDisplay);
  if (!metaUrl) return null;
  try {
    const res = await fetch(
      `/api/onboarding/blog-posts?url=${encodeURIComponent(metaUrl)}`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { posts?: unknown };
    if (!Array.isArray(data.posts) || data.posts.length === 0) return null;
    const posts: ContentInsightOutdatedPost[] = [];
    for (const p of data.posts) {
      if (
        p &&
        typeof p === "object" &&
        "url" in p &&
        "title" in p &&
        typeof (p as { url: unknown }).url === "string" &&
        typeof (p as { title: unknown }).title === "string"
      ) {
        const row = p as { title: string; url: string };
        posts.push({ title: row.title.trim(), url: row.url.trim() });
      }
    }
    return posts.length > 0 ? posts : null;
  } catch {
    return null;
  }
}
