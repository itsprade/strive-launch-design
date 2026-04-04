"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TypewriterText } from "@/components/onboarding/typewriter-text";
import {
  InsightOutdatedBlogLinks,
  type InsightsPanelProps,
  type ActiveAdInsight,
} from "@/components/onboarding/insights-panel";
import type { ToolId } from "@/components/onboarding/constants";

const easeOut = [0.16, 1, 0.3, 1] as const;

function FloatShell({
  children,
  baseTiltDeg,
}: {
  children: ReactNode;
  baseTiltDeg: number;
}) {
  return (
    <motion.div
      className="origin-center will-change-transform"
      animate={{
        y: [0, -7, 0],
        rotate: [baseTiltDeg, baseTiltDeg + 1.2, baseTiltDeg],
      }}
      transition={{
        duration: 4.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

function WorkingBlockV2({ siteLabel }: { siteLabel: string }) {
  return (
    <div
      className="rounded-2xl border border-white/30 bg-white/15 px-4 py-3.5 text-sm leading-relaxed text-white shadow-lg backdrop-blur-md"
      role="status"
      aria-live="polite"
    >
      <p>
        Strive is working on{" "}
        <span className="font-semibold text-white">{siteLabel}</span> — reading
        pages and gathering context.
      </p>
      <p className="mt-2 flex items-center gap-1 text-white/85">
        <span className="inline-flex gap-0.5">
          <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:0ms]" />
          <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:150ms]" />
          <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:300ms]" />
        </span>
        Agent thinking
      </p>
    </div>
  );
}

function AdCardV2({
  insight,
  start,
}: {
  insight: ActiveAdInsight;
  start: boolean;
}) {
  const [bodyStart, setBodyStart] = useState(false);
  const [statTypeStart, setStatTypeStart] = useState(false);

  useEffect(() => {
    if (!start) {
      setBodyStart(false);
      setStatTypeStart(false);
      return;
    }
    const t = window.setTimeout(() => setStatTypeStart(true), 460);
    return () => window.clearTimeout(t);
  }, [start, insight.toolId]);

  return (
    <motion.div
      className="rounded-[20px] bg-white/95 p-6 shadow-xl ring-1 ring-black/5 dark:bg-white/90"
      initial={{ opacity: 0, y: 22 }}
      animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{ duration: 0.5, ease: easeOut }}
    >
      <p className="font-fraunces text-3xl font-normal tracking-tight text-neutral-900 md:text-4xl">
        <TypewriterText
          text={insight.stat}
          start={statTypeStart}
          cps={24}
          showCaret={false}
          onComplete={() => setBodyStart(true)}
        />
      </p>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">
        <TypewriterText
          text={insight.body}
          start={bodyStart}
          cps={42}
          showCaret={false}
        />
      </p>
    </motion.div>
  );
}

/** Left-column Strivelabs v2 visuals: gradient + floating white cards, synced to chat steps. */
export function OnboardingV2Preview(props: InsightsPanelProps) {
  const {
    active,
    submittedSiteDisplay,
    contextLoading,
    companySummary,
    brandTone,
    contentInsight,
    contentInsightOutdatedPosts,
    adInsights,
    onBrandTypingDone,
    integrationLoading,
    suppressContextLoadingCard = false,
  } = props;

  const [summaryCardIn, setSummaryCardIn] = useState(false);
  const [brandCardIn, setBrandCardIn] = useState(false);
  const [summaryTypeStart, setSummaryTypeStart] = useState(false);
  const [summaryTypingDone, setSummaryTypingDone] = useState(false);
  const [brandAllowType, setBrandAllowType] = useState(false);
  const [contentCardIn, setContentCardIn] = useState(false);
  const [contentStart, setContentStart] = useState(false);
  const [blogLinksVisible, setBlogLinksVisible] = useState(false);
  const [adReveal, setAdReveal] = useState<Record<string, boolean>>({});
  const scheduledAdsRef = useRef<Set<string>>(new Set());
  const brandDoneCb = useRef(onBrandTypingDone);
  brandDoneCb.current = onBrandTypingDone;

  const toneReady = Boolean(brandTone);

  useEffect(() => {
    if (contextLoading || !companySummary) {
      setSummaryCardIn(false);
      setBrandCardIn(false);
      setSummaryTypeStart(false);
      setSummaryTypingDone(false);
      setBrandAllowType(false);
      return;
    }
    setSummaryCardIn(false);
    setBrandCardIn(false);
    setSummaryTypeStart(false);
    setSummaryTypingDone(false);
    setBrandAllowType(false);

    const t1 = window.setTimeout(() => setSummaryCardIn(true), 400);
    const t2 = window.setTimeout(() => setBrandCardIn(true), 400 + 420);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [contextLoading, companySummary]);

  useEffect(() => {
    if (!summaryCardIn || !companySummary) {
      setSummaryTypeStart(false);
      return;
    }
    const t = window.setTimeout(() => setSummaryTypeStart(true), 520);
    return () => window.clearTimeout(t);
  }, [summaryCardIn, companySummary]);

  useEffect(() => {
    if (!brandCardIn) {
      setBrandAllowType(false);
      return;
    }
    const t = window.setTimeout(() => setBrandAllowType(true), 560);
    return () => window.clearTimeout(t);
  }, [brandCardIn]);

  useEffect(() => {
    if (!contentInsight) {
      setContentCardIn(false);
      setContentStart(false);
      setBlogLinksVisible(false);
      return;
    }
    setBlogLinksVisible(false);
    const show = window.setTimeout(() => setContentCardIn(true), 280);
    return () => window.clearTimeout(show);
  }, [contentInsight]);

  useEffect(() => {
    if (!contentCardIn) {
      setContentStart(false);
      return;
    }
    const t = window.setTimeout(() => setContentStart(true), 360);
    return () => window.clearTimeout(t);
  }, [contentCardIn, contentInsight]);

  const adIds = adInsights.map((a) => a.toolId).join(",");

  useEffect(() => {
    const timers: number[] = [];
    let slot = 0;
    const ids = adIds.split(",").filter(Boolean) as ToolId[];
    ids.forEach((toolId) => {
      if (scheduledAdsRef.current.has(toolId)) return;
      scheduledAdsRef.current.add(toolId);
      const delay = 280 + slot * 180;
      slot += 1;
      timers.push(
        window.setTimeout(() => {
          setAdReveal((prev) => ({ ...prev, [toolId]: true }));
        }, delay),
      );
    });
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [adIds]);

  if (!active) {
    return null;
  }

  const showContextSection = Boolean(companySummary) && !contextLoading;
  const showBlogSection = Boolean(contentInsight);

  const sectionTitle =
    "font-fraunces text-[1.35rem] font-normal leading-snug tracking-tight text-white drop-shadow-sm md:text-xl";

  const cardWhite =
    "rounded-[20px] bg-white/95 p-6 shadow-xl ring-1 ring-black/5 dark:bg-white/90";

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-3xl lg:rounded-[28px]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(145deg, #ff9528 0%, #ffb347 42%, #ffc84d 72%, #fff5e6 100%)",
        }}
      />
      <div className="pointer-events-none absolute -right-24 top-1/4 h-[120%] w-[80%] rounded-full bg-white/25 blur-3xl" />
      <div className="relative flex h-full min-h-0 flex-col overflow-y-auto px-5 py-8 lg:h-screen lg:px-6 lg:py-10">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/80 lg:text-left">
          Strivelabs preview
        </p>

        <div className="flex flex-col gap-10 pb-8">
          {contextLoading &&
          submittedSiteDisplay &&
          !suppressContextLoadingCard ? (
            <FloatShell baseTiltDeg={-1}>
              <WorkingBlockV2 siteLabel={submittedSiteDisplay} />
            </FloatShell>
          ) : null}

          {integrationLoading ? (
            <FloatShell baseTiltDeg={-0.8}>
              <div
                className="rounded-2xl border border-white/35 bg-white/20 px-4 py-3.5 text-sm leading-relaxed text-white shadow-lg backdrop-blur-md"
                role="status"
                aria-live="polite"
              >
                <p>{integrationLoading.message}</p>
                <p className="mt-2 text-white/85">Retrieving content…</p>
              </div>
            </FloatShell>
          ) : null}

          {showContextSection && companySummary ? (
            <section>
              <h2 className={sectionTitle}>
                I am building your company context
              </h2>
              <div className="mt-5 grid gap-5">
                <FloatShell baseTiltDeg={-2.2}>
                  <motion.div
                    className={cardWhite}
                    initial={{ opacity: 0, y: 28 }}
                    animate={
                      summaryCardIn
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 28 }
                    }
                    transition={{ duration: 0.58, ease: easeOut }}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      Company summary
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-900">
                      <TypewriterText
                        key={companySummary.slice(0, 40)}
                        text={companySummary}
                        start={summaryTypeStart}
                        cps={38}
                        onComplete={() => setSummaryTypingDone(true)}
                      />
                    </p>
                  </motion.div>
                </FloatShell>

                <FloatShell baseTiltDeg={2}>
                  <motion.div
                    className={cardWhite}
                    initial={{ opacity: 0, y: 28 }}
                    animate={
                      brandCardIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }
                    }
                    transition={{ duration: 0.58, ease: easeOut }}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      Brand tone
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-900">
                      {toneReady && brandTone ? (
                        <TypewriterText
                          key={brandTone.slice(0, 40)}
                          text={brandTone}
                          start={
                            summaryTypingDone && brandAllowType && toneReady
                          }
                          cps={38}
                          onComplete={() => brandDoneCb.current?.()}
                        />
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </p>
                  </motion.div>
                </FloatShell>
              </div>
            </section>
          ) : null}

          {showBlogSection && contentInsight ? (
            <section>
              <h2 className={sectionTitle}>We found outdated blog posts</h2>
              <div className="mt-5">
                <FloatShell baseTiltDeg={-1.6}>
                  <motion.div
                    className={cardWhite}
                    initial={{ opacity: 0, y: 22 }}
                    animate={
                      contentCardIn
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 22 }
                    }
                    transition={{ duration: 0.52, ease: easeOut }}
                  >
                    <p className="text-sm leading-relaxed text-neutral-900">
                      <TypewriterText
                        text={contentInsight}
                        start={contentStart}
                        cps={36}
                        onComplete={() => setBlogLinksVisible(true)}
                      />
                    </p>
                    <InsightOutdatedBlogLinks
                      posts={contentInsightOutdatedPosts ?? []}
                      visible={blogLinksVisible}
                      className="mt-4 space-y-3 border-t border-neutral-200 pt-4"
                      linkClassName="text-sm font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-500"
                      urlLineClassName="text-neutral-500"
                    />
                  </motion.div>
                </FloatShell>
              </div>
            </section>
          ) : null}

          {adInsights.map((ins, index) => (
            <section key={ins.toolId}>
              <h2 className={sectionTitle}>{ins.sectionTitle}</h2>
              <div className="mt-5">
                <FloatShell
                  baseTiltDeg={index % 2 === 0 ? -1.4 : 1.8}
                >
                  <AdCardV2 insight={ins} start={!!adReveal[ins.toolId]} />
                </FloatShell>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
