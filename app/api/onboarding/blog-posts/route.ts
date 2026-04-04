import { NextResponse } from "next/server";
import { discoverBlogPosts } from "@/lib/discover-blog-posts";
import { onboardingTargetUrlFromQuery } from "@/lib/onboarding-ss";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("url")?.trim() ?? "";
  const pageUrl = onboardingTargetUrlFromQuery(raw);
  if (!pageUrl) {
    return NextResponse.json(
      { error: "Invalid URL" },
      { status: 400 },
    );
  }

  try {
    const posts = await discoverBlogPosts(pageUrl);
    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ posts: [] as { title: string; url: string }[] });
  }
}
