"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { StriveLogoMark } from "@/components/strive-logo-mark";
import {
  OnboardingV3Preview,
  OnboardingV3PreviewEmpty,
} from "@/components/onboarding/v3/onboarding-v3-preview";
import type { ActiveAdInsight } from "@/components/onboarding/insights-panel";
import { OnboardingComposer } from "@/components/onboarding/onboarding-composer";
import { TypewriterText } from "@/components/onboarding/typewriter-text";
import {
  normalizeSiteUrlForFetch,
  type SiteMetaPreview,
} from "@/lib/site-meta";
import { fetchBlogPostsForOnboarding } from "@/lib/onboarding-blog-posts-client";
import {
  buildOutdatedBlogPostExamples,
  INTEGRATION_SIMULATED_MS,
  ONBOARDING_TOOLS,
  TOOL_INSIGHTS,
  TOOL_LOADING_COPY,
  TOOLS_STACK_INVITE_TEXT,
  WEBSITE_ANALYSIS_MS,
  type ContentInsightOutdatedPost,
  type ToolId,
} from "@/components/onboarding/constants";

const USER_NAME = "Pradeep Kumar";

const V3_URL_PLACEHOLDER = "yoursite.com";

type FlowState =
  | "askWebsite"
  | "generatingContext"
  | "showTools"
  | "freeForm";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  variant?: "default" | "working";
  /** Renders below the “Tools in your stack?” card (success lines, follow-up prompt, free-form chat). */
  belowToolsCard?: boolean;
  /** Typing this message finishes before the tools card appears. */
  unlocksToolsCard?: boolean;
};

function normalizeUrl(input: string): string {
  const t = input.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

function hostFromInput(input: string): string {
  const raw = input.trim();
  try {
    const host = new URL(normalizeUrl(raw)).hostname.replace(/^www\./, "");
    return host || raw;
  } catch {
    return raw.replace(/^https?:\/\//, "").split("/")[0] ?? raw;
  }
}

function buildCompanySummary(host: string): string {
  return `${host} — from your public site we’re inferring positioning, primary offers, and likely buyer motion. Strive is compressing that into a working model of your business so downstream insights stay grounded in how you actually go to market.`;
}

function buildBrandTone(host: string): string {
  return `For ${host}, brand voice reads as confident and precise: proof-first language, minimal hype, and a steady drumbeat of product truth. We’ll weight recommendations toward that tone so creative and paid briefs stay on-brand.`;
}

const CONTENT_INSIGHT_TEXT =
  "A cluster of older blog posts is still capturing branded traffic but hasn’t been refreshed in over 18 months. Updating those URLs while new campaigns ramp could compound paid and organic lift.";

let v3MsgSeq = 0;
function nextId(): string {
  v3MsgSeq += 1;
  return `v3-m-${v3MsgSeq}`;
}

const ORB_BOX = {
  width: "min(175vh, 1200px)",
  height: "min(175vh, 1200px)",
  right: "calc(max(-32vh, -9rem) - 300px)",
} as const;

function V3GradientOrbit() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Two stacked orbs: slow scale + rotation + opacity drift */}
      <div className="absolute top-1/2 -translate-y-1/2" style={ORB_BOX}>
        <motion.div
          className="size-full origin-center rounded-full bg-[radial-gradient(circle_at_82%_50%,#ffffff_0%,#fff7ee_12%,#ffe4c7_28%,#ffc266_48%,#ff9528_70%,#c94100_100%)] blur-[64px] will-change-transform"
          animate={{
            scale: [1, 1.052, 0.988, 1],
            rotate: [0, 5, -4, 0],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <div className="absolute top-1/2 -translate-y-1/2" style={ORB_BOX}>
        <motion.div
          className="size-full origin-center rounded-full bg-[radial-gradient(circle_at_66%_44%,#fffefd_0%,#ffe8d4_20%,#ffb85c_45%,#ff7518_72%,#9c2f00_100%)] blur-[72px] will-change-transform"
          style={{ mixBlendMode: "multiply" }}
          animate={{
            scale: [1.045, 0.975, 1.045],
            rotate: [0, -7, 5, 0],
            opacity: [0.26, 0.52, 0.26],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        />
      </div>
    </div>
  );
}

export default function OnboardingV3Page() {
  const router = useRouter();
  const [flow, setFlow] = useState<FlowState>("askWebsite");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: nextId(),
      role: "assistant",
      text: "Please share your company website to get started",
    },
  ]);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const typeScrollRafRef = useRef<number | null>(null);
  /** When false, user has scrolled up — don’t fight them with auto-scroll. */
  const stickChatToBottomRef = useRef(true);
  const CHAT_BOTTOM_STICK_THRESHOLD_PX = 72;

  const updateChatStickFromScroll = useCallback(() => {
    const el = messagesScrollRef.current;
    if (!el) return;
    const distFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    stickChatToBottomRef.current =
      distFromBottom < CHAT_BOTTOM_STICK_THRESHOLD_PX;
  }, []);

  const scrollChatDuringTyping = useCallback(() => {
    if (typeScrollRafRef.current != null) return;
    typeScrollRafRef.current = window.requestAnimationFrame(() => {
      typeScrollRafRef.current = null;
      const el = messagesScrollRef.current;
      if (!el || !stickChatToBottomRef.current) return;
      el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
    });
  }, []);

  useEffect(() => {
    return () => {
      if (typeScrollRafRef.current != null) {
        window.cancelAnimationFrame(typeScrollRafRef.current);
      }
    };
  }, []);

  const [contextLoading, setContextLoading] = useState(false);
  const [submittedSiteDisplay, setSubmittedSiteDisplay] = useState<
    string | null
  >(null);
  const [companySummary, setCompanySummary] = useState<string | null>(null);
  const [brandTone, setBrandTone] = useState<string | null>(null);
  const [contentInsight, setContentInsight] = useState<string | null>(null);
  const [activeIntegrations, setActiveIntegrations] = useState<ToolId[]>([]);
  const [connected, setConnected] = useState<Partial<Record<ToolId, boolean>>>(
    {},
  );
  const [busyTool, setBusyTool] = useState<ToolId | null>(null);
  const [siteAnalysisChatterDone, setSiteAnalysisChatterDone] = useState(false);
  const [toolsCardUnlocked, setToolsCardUnlocked] = useState(false);
  const [siteMetaPreview, setSiteMetaPreview] = useState<SiteMetaPreview | null>(
    null,
  );
  const [blogPostsFromSite, setBlogPostsFromSite] = useState<
    ContentInsightOutdatedPost[] | null
  >(null);

  const blogUnlockedRef = useRef(false);

  const toolStackOrder = useMemo(
    () => new Map(ONBOARDING_TOOLS.map((t, i) => [t.id, i] as const)),
    [],
  );

  const adInsights: ActiveAdInsight[] = useMemo(
    () =>
      [...activeIntegrations]
        .sort(
          (a, b) =>
            (toolStackOrder.get(a) ?? 0) - (toolStackOrder.get(b) ?? 0),
        )
        .map((id) => ({
          toolId: id,
          ...TOOL_INSIGHTS[id],
        })),
    [activeIntegrations, toolStackOrder],
  );

  const rightInsightsActive = flow !== "askWebsite";

  const integrationLoading = useMemo(() => {
    if (!busyTool) return null;
    return {
      toolId: busyTool,
      message: TOOL_LOADING_COPY[busyTool],
    };
  }, [busyTool]);

  useEffect(() => {
    const el = messagesScrollRef.current;
    if (!el || !stickChatToBottomRef.current) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, flow, connected]);

  const pushAssistant = useCallback(
    (
      text: string,
      options?: { belowToolsCard?: boolean; unlocksToolsCard?: boolean },
    ) => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          text,
          variant: "default",
          ...(options?.belowToolsCard
            ? { belowToolsCard: true as const }
            : {}),
          ...(options?.unlocksToolsCard
            ? { unlocksToolsCard: true as const }
            : {}),
        },
      ]);
    },
    [],
  );

  const pushUser = useCallback(
    (text: string, options?: { belowToolsCard?: boolean }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "user",
          text,
          variant: "default",
          ...(options?.belowToolsCard
            ? { belowToolsCard: true as const }
            : {}),
        },
      ]);
    },
    [],
  );

  const handleBrandTypingDone = useCallback(() => {
    if (blogUnlockedRef.current) return;
    blogUnlockedRef.current = true;
    setContentInsight(CONTENT_INSIGHT_TEXT);
  }, []);

  const resetOnboarding = useCallback(() => {
    setFlow("askWebsite");
    setMessages([
      {
        id: nextId(),
        role: "assistant",
        text: "Please share your company website to get started",
      },
    ]);
    setContextLoading(false);
    setSubmittedSiteDisplay(null);
    setCompanySummary(null);
    setBrandTone(null);
    setContentInsight(null);
    blogUnlockedRef.current = false;
    setToolsCardUnlocked(false);
    setSiteMetaPreview(null);
    setBlogPostsFromSite(null);
    setActiveIntegrations([]);
    setConnected({});
    setBusyTool(null);
    setSiteAnalysisChatterDone(false);
    stickChatToBottomRef.current = true;
  }, []);

  const startWebsiteFlow = useCallback(
    (rawUrl: string) => {
      const host = hostFromInput(rawUrl);
      if (!host) return;

      const display = rawUrl.trim();
      stickChatToBottomRef.current = true;
      pushUser(display);
      setSiteAnalysisChatterDone(false);
      setFlow("generatingContext");
      setContextLoading(true);
      setSubmittedSiteDisplay(display);
      setCompanySummary(null);
      setBrandTone(null);
      setContentInsight(null);
      blogUnlockedRef.current = false;
      setToolsCardUnlocked(false);
      setSiteMetaPreview(null);
      setBlogPostsFromSite(null);
      setActiveIntegrations([]);
      setConnected({});
      setBusyTool(null);

      const metaUrl = normalizeSiteUrlForFetch(display);
      if (metaUrl) {
        void (async () => {
          try {
            const res = await fetch(
              `/api/onboarding/site-meta?url=${encodeURIComponent(metaUrl)}`,
            );
            const data = (await res.json()) as SiteMetaPreview & {
              error?: string;
            };
            if (!res.ok || ("error" in data && data.error)) {
              setSiteMetaPreview({
                hostname: host,
                title: null,
                description: null,
                image: null,
              });
              return;
            }
            setSiteMetaPreview({
              hostname: data.hostname || host,
              title: data.title,
              description: data.description,
              image: data.image,
            });
          } catch {
            setSiteMetaPreview({
              hostname: host,
              title: null,
              description: null,
              image: null,
            });
          }
        })();
        void (async () => {
          const discovered = await fetchBlogPostsForOnboarding(display);
          if (discovered?.length) setBlogPostsFromSite(discovered);
        })();
      }

      const workingId = nextId();
      setMessages((prev) => [
        ...prev,
        {
          id: workingId,
          role: "assistant",
          text: `I’m working on ${display} — reading your site and gathering context…`,
          variant: "working",
        },
      ]);

      window.setTimeout(() => {
        const summary = buildCompanySummary(host);
        const tone = buildBrandTone(host);
        setCompanySummary(summary);
        setBrandTone(tone);
        setContextLoading(false);
        setToolsCardUnlocked(false);
        setFlow("showTools");
        pushAssistant(TOOLS_STACK_INVITE_TEXT, { unlocksToolsCard: true });
      }, WEBSITE_ANALYSIS_MS);
    },
    [pushAssistant, pushUser],
  );

  const integrateTool = useCallback(
    (id: ToolId) => {
      if (flow !== "showTools" && flow !== "freeForm") return;
      if (connected[id] || busyTool) return;
      setBusyTool(id);
      window.setTimeout(() => {
        setConnected((c) => ({ ...c, [id]: true }));
        setActiveIntegrations((list) =>
          list.includes(id) ? list : [...list, id],
        );
        const label = ONBOARDING_TOOLS.find((t) => t.id === id)?.label ?? id;
        pushAssistant(`Success — ${label} is connected.`, {
          belowToolsCard: true,
        });
        setBusyTool(null);
      }, INTEGRATION_SIMULATED_MS);
    },
    [flow, connected, busyTool, pushAssistant],
  );

  const finishTools = useCallback(() => {
    if (flow !== "showTools") return;
    pushAssistant(
      "Share anything else that helps: your marketing team setup, tools, or problems you’re hitting—we’ll fold it into your dashboard.",
      { belowToolsCard: true },
    );
    setFlow("freeForm");
  }, [flow, pushAssistant]);

  const handleComposerSend = useCallback(
    ({
      text,
      files,
    }: {
      text: string;
      files: File[];
    }) => {
      if (flow === "askWebsite") {
        startWebsiteFlow(text);
        return;
      }
      if (flow !== "freeForm") return;
      stickChatToBottomRef.current = true;
      const names = files.map((f) => f.name).join(", ");
      const body =
        text +
        (names
          ? `${text ? "\n\n" : ""}Attachments: ${names}`
          : "");
      if (!body.trim()) return;
      pushUser(body.trim(), { belowToolsCard: true });
      window.setTimeout(() => {
        pushAssistant(
          "Thanks — I’ve logged that context. You can keep adding detail here anytime from the main workspace.",
          { belowToolsCard: true },
        );
      }, 650);
    },
    [flow, startWebsiteFlow, pushUser, pushAssistant],
  );

  const composerDisabled =
    flow === "generatingContext" || flow === "showTools";

  const placeholder =
    flow === "askWebsite"
      ? V3_URL_PLACEHOLDER
      : "Share context…";

  const panelProps = {
    active: rightInsightsActive,
    submittedSiteDisplay,
    contextLoading,
    companySummary,
    brandTone,
    contentInsight,
    contentInsightOutdatedPosts: contentInsight
      ? blogPostsFromSite && blogPostsFromSite.length > 0
        ? blogPostsFromSite
        : buildOutdatedBlogPostExamples(submittedSiteDisplay)
      : undefined,
    adInsights,
    onBrandTypingDone: handleBrandTypingDone,
    integrationLoading,
    suppressContextLoadingCard:
      contextLoading && !siteAnalysisChatterDone,
    siteMeta: siteMetaPreview,
  };

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-background lg:h-dvh lg:max-h-dvh lg:overscroll-y-none">
      <V3GradientOrbit />

      <div className="relative z-10 flex h-dvh max-h-dvh min-h-0 flex-col overflow-x-hidden overflow-y-visible px-5 sm:px-8 lg:h-full lg:min-h-0 lg:max-h-dvh lg:px-10 lg:pb-5 lg:pt-3 xl:px-14">
        <div
          className={cn(
            "relative mx-auto flex min-h-0 w-full max-w-[1020px] flex-1 flex-col gap-6 overflow-visible py-8 pb-10 transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:h-full lg:max-h-full lg:min-h-0 lg:flex-row lg:items-stretch lg:justify-start lg:gap-[100px] lg:py-10",
          )}
        >
          <div className="order-1 flex h-full min-h-0 w-full min-w-0 max-h-full flex-1 flex-col overflow-visible lg:order-1 lg:h-full lg:max-h-full lg:min-h-0 lg:w-[460px] lg:max-w-[460px] lg:flex-none lg:shrink-0 lg:items-stretch lg:text-left">
            <header className="z-20 shrink-0 border-b border-transparent bg-background/95 pb-4 pt-2 lg:border-b-0 lg:bg-transparent lg:pb-4 lg:pt-0">
              <StriveLogoMark className="mb-4 block" />
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h1 className="font-fraunces text-3xl font-normal tracking-tight text-foreground md:text-4xl">
                    Welcome, {USER_NAME}
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Strive is your AI-powered marketing intelligence system.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetOnboarding}
                  aria-label="Start again"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-muted/60"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </header>

            <div
              ref={messagesScrollRef}
              onScroll={updateChatStickFromScroll}
              className="no-scrollbar flex h-0 min-h-0 w-full min-w-0 flex-1 basis-0 flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain pr-1"
            >
              <div className="flex w-full flex-col gap-4 py-2 pb-6">
                {messages
                  .filter((m) => !m.belowToolsCard)
                  .map((m) =>
                    m.role === "user" ? (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="ml-auto flex w-full max-w-[92%] justify-end"
                      >
                        <div className="rounded-2xl border-[0.5px] border-black/10 bg-white px-4 py-3 text-left dark:bg-white">
                          <p className="min-h-[1.25em] text-sm leading-relaxed text-foreground">
                            <TypewriterText
                              text={m.text}
                              start
                              cps={44}
                              showCaret
                              className="text-sm leading-relaxed text-foreground"
                              onUpdate={scrollChatDuringTyping}
                              onComplete={scrollChatDuringTyping}
                            />
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mr-auto max-w-[92%]"
                      >
                        <div className="rounded-2xl bg-[#F7F7F8] px-4 py-3 text-left text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:bg-muted/30">
                          <p className="min-h-[1.35em] font-fraunces text-[15px] leading-relaxed md:text-base">
                            <TypewriterText
                              text={m.text}
                              start
                              cps={34}
                              showCaret
                              className="font-fraunces text-[15px] leading-relaxed md:text-base text-foreground"
                              onUpdate={scrollChatDuringTyping}
                              onComplete={() => {
                                scrollChatDuringTyping();
                                if (m.variant === "working") {
                                  setSiteAnalysisChatterDone(true);
                                }
                                if (m.unlocksToolsCard) {
                                  setToolsCardUnlocked(true);
                                }
                              }}
                            />
                          </p>
                        </div>
                      </motion.div>
                    ),
                  )}

                {flow === "freeForm" ||
                (flow === "showTools" && toolsCardUnlocked) ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-[#F7F7F8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:bg-muted/30"
                  >
                    <p className="text-sm font-medium text-foreground">
                      Tools in your stack?
                    </p>
                    <ul className="mt-3 space-y-1">
                      {ONBOARDING_TOOLS.map((tool) => {
                        const isOn = connected[tool.id];
                        const busy = busyTool === tool.id;
                        const Icon = tool.Icon;
                        return (
                          <li
                            key={tool.id}
                            className="flex items-center gap-3 rounded-xl py-3 pl-0 pr-1 first:pt-0 last:pb-0"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                              <Icon className="h-4 w-4 text-foreground" />
                            </div>
                            <span className="min-w-0 flex-1 text-sm text-foreground">
                              {tool.label}
                            </span>
                            {isOn ? (
                              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Authorised
                              </span>
                            ) : (
                              <button
                                type="button"
                                disabled={!!busyTool && !busy}
                                onClick={() => integrateTool(tool.id)}
                                className="text-xs font-medium text-foreground underline-offset-4 hover:underline disabled:opacity-40"
                              >
                                {busy ? "Connecting…" : "Integrate"}
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    {flow === "showTools" ? (
                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={finishTools}
                          className="rounded-full bg-[#F2F2F4] px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-[#E8E8EC] dark:bg-muted"
                        >
                          Skip
                        </button>
                        <button
                          type="button"
                          onClick={finishTools}
                          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
                        >
                          Done
                        </button>
                      </div>
                    ) : null}
                  </motion.div>
                ) : null}

                {flow === "freeForm" ||
                (flow === "showTools" && toolsCardUnlocked)
                  ? messages
                      .filter((m) => m.belowToolsCard)
                      .map((m) =>
                        m.role === "user" ? (
                          <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="ml-auto flex w-full max-w-[92%] justify-end"
                          >
                            <div className="rounded-2xl border-[0.5px] border-black/10 bg-white px-4 py-3 text-left dark:bg-white">
                              <p className="min-h-[1.25em] text-sm leading-relaxed text-foreground">
                                <TypewriterText
                                  text={m.text}
                                  start
                                  cps={44}
                                  showCaret
                                  className="text-sm leading-relaxed text-foreground"
                                  onUpdate={scrollChatDuringTyping}
                                  onComplete={scrollChatDuringTyping}
                                />
                              </p>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mr-auto max-w-[92%]"
                          >
                            <div className="rounded-2xl bg-[#F7F7F8] px-4 py-3 text-left text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:bg-muted/30">
                              <p className="min-h-[1.35em] font-fraunces text-[15px] leading-relaxed md:text-base">
                                <TypewriterText
                                  text={m.text}
                                  start
                                  cps={34}
                                  showCaret
                                  className="font-fraunces text-[15px] leading-relaxed md:text-base text-foreground"
                                  onUpdate={scrollChatDuringTyping}
                                  onComplete={scrollChatDuringTyping}
                                />
                              </p>
                            </div>
                          </motion.div>
                        ),
                      )
                  : null}

                {flow === "freeForm" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-2"
                  >
                    <button
                      type="button"
                      onClick={() => router.push("/")}
                      className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
                    >
                      Open dashboard
                    </button>
                  </motion.div>
                ) : null}

              </div>
            </div>

            <div className="z-20 min-w-0 shrink-0 border-t border-transparent bg-background/95 py-4 lg:border-t-0 lg:bg-transparent">
              <OnboardingComposer
                placeholder={placeholder}
                disabled={composerDisabled}
                onSend={handleComposerSend}
              />
            </div>
          </div>

          <div
            className="order-2 flex min-h-[42dvh] w-full min-w-0 flex-none flex-col overflow-hidden lg:order-2 lg:h-full lg:min-h-0 lg:max-h-full lg:w-[460px] lg:max-w-[460px] lg:flex-none lg:shrink-0"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)",
            }}
          >
            {flow === "askWebsite" ? (
              <OnboardingV3PreviewEmpty />
            ) : (
              <motion.div
                key="preview-active"
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 30,
                  delay: 0.04,
                }}
                className="flex h-full min-h-0 max-h-full w-full min-w-0 flex-1 basis-0 flex-col overflow-hidden lg:h-full lg:min-h-0"
              >
                <OnboardingV3Preview {...panelProps} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
