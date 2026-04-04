"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { OnboardingV2Preview } from "@/components/onboarding/v2/onboarding-v2-preview";
import type { ActiveAdInsight } from "@/components/onboarding/insights-panel";
import { OnboardingComposer } from "@/components/onboarding/onboarding-composer";
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

const V2_INTRO_PLACEHOLDER = "add more context to strivelabs ai";

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

let v2MsgSeq = 0;
function nextId(): string {
  v2MsgSeq += 1;
  return `v2-m-${v2MsgSeq}`;
}

export default function OnboardingV2Page() {
  const router = useRouter();
  const [flow, setFlow] = useState<FlowState>("askWebsite");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: nextId(),
      role: "assistant",
      text: "Please share your company website to get started.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

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
  const [blogPostsFromSite, setBlogPostsFromSite] = useState<
    ContentInsightOutdatedPost[] | null
  >(null);

  const blogUnlockedRef = useRef(false);

  const adInsights: ActiveAdInsight[] = useMemo(
    () =>
      activeIntegrations.map((id) => ({
        toolId: id,
        ...TOOL_INSIGHTS[id],
      })),
    [activeIntegrations],
  );

  const rightInsightsActive = flow !== "askWebsite";
  const isCenteredIntro = flow === "askWebsite";

  const integrationLoading = useMemo(() => {
    if (!busyTool) return null;
    return {
      toolId: busyTool,
      message: TOOL_LOADING_COPY[busyTool],
    };
  }, [busyTool]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, flow, connected]);

  const pushAssistant = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "assistant", text, variant: "default" },
    ]);
  }, []);

  const pushUser = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", text, variant: "default" },
    ]);
  }, []);

  const handleBrandTypingDone = useCallback(() => {
    if (blogUnlockedRef.current) return;
    blogUnlockedRef.current = true;
    setContentInsight(CONTENT_INSIGHT_TEXT);
  }, []);

  const startWebsiteFlow = useCallback(
    (rawUrl: string) => {
      const host = hostFromInput(rawUrl);
      if (!host) return;

      const display = rawUrl.trim();
      pushUser(display);
      setFlow("generatingContext");
      setContextLoading(true);
      setSubmittedSiteDisplay(display);
      setCompanySummary(null);
      setBrandTone(null);
      setContentInsight(null);
      blogUnlockedRef.current = false;
      setBlogPostsFromSite(null);
      void (async () => {
        const discovered = await fetchBlogPostsForOnboarding(display);
        if (discovered?.length) setBlogPostsFromSite(discovered);
      })();

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
        setMessages((prev) => prev.filter((m) => m.id !== workingId));
        const summary = buildCompanySummary(host);
        const tone = buildBrandTone(host);
        setCompanySummary(summary);
        setBrandTone(tone);
        setContextLoading(false);
        pushAssistant(TOOLS_STACK_INVITE_TEXT);
        setFlow("showTools");
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
        pushAssistant(`Success — ${label} is connected.`);
        setBusyTool(null);
      }, INTEGRATION_SIMULATED_MS);
    },
    [flow, connected, busyTool, pushAssistant],
  );

  const finishTools = useCallback(() => {
    if (flow !== "showTools") return;
    pushAssistant(
      "Share anything else that helps: your marketing team setup, tools, or problems you’re hitting—we’ll fold it into your dashboard.",
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
      const names = files.map((f) => f.name).join(", ");
      const body =
        text +
        (names
          ? `${text ? "\n\n" : ""}Attachments: ${names}`
          : "");
      if (!body.trim()) return;
      pushUser(body.trim());
      window.setTimeout(() => {
        pushAssistant(
          "Thanks — I’ve logged that context. You can keep adding detail here anytime from the main workspace.",
        );
      }, 650);
    },
    [flow, startWebsiteFlow, pushUser, pushAssistant],
  );

  const composerDisabled =
    flow === "generatingContext" || flow === "showTools";

  const placeholder =
    flow === "askWebsite"
      ? V2_INTRO_PLACEHOLDER
      : "Add context about your team, tools, or challenges…";

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
  };

  return (
    <div className="min-h-screen w-full bg-background px-5 sm:px-8 lg:px-10 xl:px-14">
      <div
        className={cn(
          "mx-auto flex w-full max-w-[952px] min-h-screen transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isCenteredIntro
            ? "flex-col items-center justify-center py-8"
            : "flex-col gap-6 pt-8 pb-10 lg:min-h-screen lg:flex-row lg:items-stretch lg:gap-8 lg:pt-10",
        )}
      >
        {rightInsightsActive ? (
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 30,
              delay: 0.06,
            }}
            className="order-2 flex min-h-[260px] w-full flex-col lg:order-1 lg:h-screen lg:min-h-0 lg:w-[460px] lg:max-w-[460px] lg:shrink-0"
          >
            <OnboardingV2Preview {...panelProps} />
          </motion.div>
        ) : null}

        <motion.div
          layout
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className={cn(
            "flex w-full flex-col",
            isCenteredIntro
              ? "order-1 max-w-[460px] items-center text-center"
              : "order-1 min-h-0 lg:order-2 lg:h-screen lg:w-[460px] lg:max-w-[460px] lg:shrink-0 lg:items-stretch lg:text-left",
          )}
        >
          <header
            className={cn(
              "shrink-0 pb-4",
              isCenteredIntro ? "pt-4" : "pt-2 lg:pt-0",
            )}
          >
            <h1 className="font-fraunces text-3xl font-normal tracking-tight text-foreground md:text-4xl">
              Welcome, {USER_NAME}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Strive is your AI-powered marketing intelligence system.
            </p>
          </header>

          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto w-full",
              isCenteredIntro && "flex flex-col items-center",
            )}
          >
            <div
              className={cn(
                "flex flex-col gap-4 pb-6 w-full",
                isCenteredIntro && "items-center",
              )}
            >
              {messages.map((m) =>
                m.role === "user" ? (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ml-auto w-full max-w-[92%] flex justify-end"
                  >
                    <div className="rounded-2xl border border-border/60 bg-white px-4 py-3 text-left shadow-sm dark:bg-card">
                      <p className="text-sm leading-relaxed text-foreground">
                        {m.text}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "max-w-[92%]",
                      isCenteredIntro ? "mx-auto" : "mr-auto",
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 text-left shadow-sm text-white",
                        m.variant === "working"
                          ? "bg-[#ff9528]/92"
                          : "bg-[#ff9528]",
                      )}
                    >
                      <p className="text-sm leading-relaxed text-white">
                        {m.text}
                      </p>
                    </div>
                  </motion.div>
                ),
              )}

              {flow === "showTools" || flow === "freeForm" ? (
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

              <div ref={scrollRef} />
            </div>
          </div>

          <div
            className={cn(
              "shrink-0 w-full bg-background py-4",
              isCenteredIntro && "max-w-[460px]",
            )}
          >
            <OnboardingComposer
              placeholder={placeholder}
              disabled={composerDisabled}
              onSend={handleComposerSend}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
