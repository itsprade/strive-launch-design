import type { LucideIcon } from "lucide-react";
import { BarChart3, Building2, Facebook, Linkedin } from "lucide-react";

export type ToolId = "google-ads" | "linkedin-ads" | "meta-ads" | "hubspot";

export interface OnboardingTool {
  id: ToolId;
  label: string;
  Icon: LucideIcon;
}

export const ONBOARDING_TOOLS: OnboardingTool[] = [
  { id: "google-ads", label: "Google Ads", Icon: BarChart3 },
  { id: "linkedin-ads", label: "LinkedIn Ads", Icon: Linkedin },
  { id: "meta-ads", label: "Meta Ads", Icon: Facebook },
  { id: "hubspot", label: "HubSpot", Icon: Building2 },
];

export interface IntegrationInsight {
  sectionTitle: string;
  stat: string;
  body: string;
}

export const TOOL_INSIGHTS: Record<ToolId, IntegrationInsight> = {
  "google-ads": {
    sectionTitle: "Found issues in your google ad campaign",
    stat: "12% increase",
    body: "Organic traffic is up 12% with an increase of 8% in conversions since 10 posts were refreshed.",
  },
  "linkedin-ads": {
    sectionTitle: "LinkedIn campaign signal",
    stat: "3.2× ROAS",
    body: "Sponsored content is outperforming single-image ads; consider shifting 15% of budget to thought leadership creative.",
  },
  "meta-ads": {
    sectionTitle: "Meta placement mix",
    stat: "−18% CPA",
    body: "Reels placements are driving cheaper signups than feed; consolidate underperforming ad sets this week.",
  },
  hubspot: {
    sectionTitle: "CRM + marketing alignment",
    stat: "24% more MQLs",
    body: "Lifecycle stages are syncing cleanly; nurture sequences could shorten time-to-opportunity by ~6 days.",
  },
};

/** Assistant message inviting the tools stack step (after site analysis). */
export const TOOLS_STACK_INVITE_TEXT =
  "Share the tools that you use in your marketing team—ads platforms, CRM, and anything else you rely on. We’ll list them below so you can connect or skip each one.";

/** Right-panel copy while a tool is “connecting” before the insight card appears. */
export const TOOL_LOADING_COPY: Record<ToolId, string> = {
  "google-ads":
    "Working with Google Ads — authorizing access, then scanning active campaigns and change history for quick wins.",
  "linkedin-ads":
    "Connecting LinkedIn Ads — pulling recent campaign performance and audience signals from your account.",
  "meta-ads":
    "Linking Meta Ads — reviewing placements and ad sets to surface efficiency and spend patterns.",
  hubspot:
    "Syncing HubSpot — loading lifecycle stages, lists, and marketing handoff data for context.",
};

export const WEBSITE_ANALYSIS_MS = 4000;
export const INTEGRATION_SIMULATED_MS = 2600;

export type ContentInsightOutdatedPost = { title: string; url: string };

/** Fallback when live blog discovery returns no URLs (see `/api/onboarding/blog-posts`). */
export function buildOutdatedBlogPostExamples(
  submittedSiteDisplay: string | null,
): ContentInsightOutdatedPost[] {
  const raw = submittedSiteDisplay?.trim() ?? "";
  let host = "example.com";
  if (raw) {
    try {
      const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      const u = new URL(withProto);
      host = u.hostname.replace(/^www\./, "") || host;
    } catch {
      host =
        raw.replace(/^https?:\/\//, "").split("/")[0]?.trim() || host;
    }
  }
  const origin = `https://${host}`;
  return [
    {
      title: "Rebuilding our analytics stack",
      url: `${origin}/blog/analytics-stack`,
    },
    {
      title: "Q2 roadmap: what shipped",
      url: `${origin}/blog/q2-roadmap`,
    },
    {
      title: "Notes from our first user conference",
      url: `${origin}/blog/user-conference-2023`,
    },
  ];
}
