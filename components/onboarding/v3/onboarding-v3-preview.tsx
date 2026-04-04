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
import {
  ONBOARDING_TOOLS,
  type ToolId,
} from "@/components/onboarding/constants";
import type { SiteMetaPreview } from "@/lib/site-meta";
import {
  SiteMetaHeroImage,
  SiteMetaWorkingCard,
} from "@/components/onboarding/site-meta-working-card";

const easeOut = [0.16, 1, 0.3, 1] as const;

function clipMetaText(s: string | null | undefined, max = 150): string | null {
  if (!s) return null;
  const t = s.trim();
  if (!t) return null;
  return t.length <= max ? t : `${t.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

const PREVIEW_LOADERS = {
  working:
    "Reading public pages and mapping how you go to market…",
  companySummary: "Synthesizing company summary from your site crawl…",
  brandTone: "Inferring brand voice from headlines and value props…",
  blog: "Scanning blog posts for age, traffic, and refresh fit…",
  adInsight: (toolLabel: string) =>
    `Extracting performance signals from ${toolLabel}…`,
} as const;

function toolLabel(id: ToolId): string {
  return ONBOARDING_TOOLS.find((t) => t.id === id)?.label ?? id;
}

/** Extra ms after the typewriter finishes before revealing the card. */
const PREVIEW_LOADER_POST_TYPE_MS = 2600;

function PreviewLoaderLine({
  text,
  start,
  onComplete,
}: {
  text: string;
  start: boolean;
  onComplete: () => void;
}) {
  const [holdGradient, setHoldGradient] = useState(false);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setHoldGradient(false);
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  }, [text, start]);

  useEffect(() => {
    return () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, []);

  return (
    <p className="mb-4 min-h-[1.25em] text-[13px] font-medium leading-relaxed">
      <TypewriterText
        key={text}
        text={text}
        start={start}
        cps={34}
        showCaret
        className={
          holdGradient
            ? "preview-loader-gradient-text text-[13px] font-semibold"
            : "text-[13px] font-medium text-neutral-800"
        }
        onComplete={() => {
          setHoldGradient(true);
          settleTimerRef.current = setTimeout(() => {
            settleTimerRef.current = null;
            onComplete();
          }, PREVIEW_LOADER_POST_TYPE_MS);
        }}
      />
    </p>
  );
}

function FloatShell({
  children,
  baseTiltDeg,
}: {
  children: ReactNode;
  baseTiltDeg: number;
}) {
  return (
    <motion.div
      className="min-w-0 w-full max-w-full origin-center will-change-transform"
      animate={{
        rotate: [baseTiltDeg, baseTiltDeg + 1.2, baseTiltDeg],
        y: [0, -4, 0],
        scale: [1, 1.012, 1],
        opacity: [0.96, 1, 0.96],
      }}
      transition={{
        duration: 5.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

function AdCardV3({
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
      data-preview-card="true"
      className="w-full max-w-full rounded-[20px] bg-white p-6 shadow-xl ring-1 ring-black/[0.06]"
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

/** Idle right column — layout only; gradient lives on the page shell. */
export function OnboardingV3PreviewEmpty() {
  return (
    <div
      className="relative min-h-[50vh] flex-1 lg:min-h-0"
      aria-hidden
    />
  );
}

/** Right column: cards over page gradient — no local gradient box. */
export function OnboardingV3Preview(props: InsightsPanelProps) {
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
    suppressContextLoadingCard = false,
    siteMeta,
  } = props;

  const [workingLoaderDone, setWorkingLoaderDone] = useState(false);

  const [summaryLoaderDone, setSummaryLoaderDone] = useState(false);
  const [brandLoaderDone, setBrandLoaderDone] = useState(false);
  const [summaryTypeStart, setSummaryTypeStart] = useState(false);
  const [summaryTypingDone, setSummaryTypingDone] = useState(false);
  const [brandAllowType, setBrandAllowType] = useState(false);

  const [blogLoaderDone, setBlogLoaderDone] = useState(false);
  const [contentStart, setContentStart] = useState(false);
  const [blogLinksVisible, setBlogLinksVisible] = useState(false);

  const [adCardVisible, setAdCardVisible] = useState<Record<string, boolean>>(
    {},
  );
  const brandDoneCb = useRef(onBrandTypingDone);
  brandDoneCb.current = onBrandTypingDone;

  const previewScrollRef = useRef<HTMLDivElement>(null);

  const toneReady = Boolean(brandTone);

  useEffect(() => {
    if (
      !(
        contextLoading &&
        submittedSiteDisplay &&
        !suppressContextLoadingCard
      )
    ) {
      setWorkingLoaderDone(false);
      return;
    }
    setWorkingLoaderDone(false);
  }, [contextLoading, submittedSiteDisplay, suppressContextLoadingCard]);

  useEffect(() => {
    if (contextLoading || !companySummary) {
      setSummaryLoaderDone(false);
      setBrandLoaderDone(false);
      setSummaryTypeStart(false);
      setSummaryTypingDone(false);
      setBrandAllowType(false);
      return;
    }
    setSummaryLoaderDone(false);
    setBrandLoaderDone(false);
    setSummaryTypeStart(false);
    setSummaryTypingDone(false);
    setBrandAllowType(false);
  }, [contextLoading, companySummary]);

  useEffect(() => {
    if (!summaryLoaderDone || !companySummary) {
      setSummaryTypeStart(false);
      return;
    }
    const t = window.setTimeout(() => setSummaryTypeStart(true), 520);
    return () => window.clearTimeout(t);
  }, [summaryLoaderDone, companySummary]);

  useEffect(() => {
    if (!brandLoaderDone) {
      setBrandAllowType(false);
      return;
    }
    const t = window.setTimeout(() => setBrandAllowType(true), 560);
    return () => window.clearTimeout(t);
  }, [brandLoaderDone]);

  useEffect(() => {
    if (!contentInsight) {
      setBlogLoaderDone(false);
      setContentStart(false);
      setBlogLinksVisible(false);
      return;
    }
    setBlogLoaderDone(false);
    setBlogLinksVisible(false);
  }, [contentInsight]);

  useEffect(() => {
    if (!blogLoaderDone) {
      setContentStart(false);
      return;
    }
    const t = window.setTimeout(() => setContentStart(true), 360);
    return () => window.clearTimeout(t);
  }, [blogLoaderDone, contentInsight]);

  useEffect(() => {
    setAdCardVisible((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const ins of adInsights) {
        if (!(ins.toolId in next)) {
          next[ins.toolId] = false;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [adInsights]);

  const adIds = adInsights.map((a) => a.toolId).join(",");
  const adCardVisibleKeys = Object.entries(adCardVisible)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(",");

  useEffect(() => {
    if (!active) return;
    const id = window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        const container = previewScrollRef.current;
        if (!container) return;
        const items = container.querySelectorAll<HTMLElement>(
          "[data-preview-card='true']",
        );
        const latest = items[items.length - 1];
        if (!latest) return;
        latest.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 250);
    });
    return () => cancelAnimationFrame(id);
  }, [
    active,
    contextLoading,
    companySummary,
    contentInsight,
    adIds,
    adCardVisibleKeys,
    summaryLoaderDone,
    summaryTypingDone,
    brandLoaderDone,
    brandAllowType,
    blogLoaderDone,
    blogLinksVisible,
    contentStart,
    suppressContextLoadingCard,
    workingLoaderDone,
  ]);

  if (!active) {
    return null;
  }

  const showContextSection = Boolean(companySummary) && !contextLoading;
  const showBlogSection = Boolean(contentInsight);

  const summarySiteLabel =
    submittedSiteDisplay ?? siteMeta?.hostname ?? "Your site";
  const summaryMetaHost = siteMeta?.hostname?.trim() || summarySiteLabel;
  const summaryMetaTitle = siteMeta?.title?.trim() || summarySiteLabel;
  const summaryMetaDesc = clipMetaText(siteMeta?.description, 220);

  const cardWhite =
    "min-w-0 w-full max-w-full rounded-[20px] bg-white p-6 shadow-xl ring-1 ring-black/[0.06]";

  return (
    <div className="relative flex h-full min-h-0 max-h-full flex-1 flex-col overflow-hidden">
      <div
        ref={previewScrollRef}
        className="no-scrollbar relative flex h-0 min-h-0 max-h-full flex-1 basis-0 flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain px-5 sm:px-6 lg:px-8"
      >
        <div className="flex min-h-0 w-full max-w-full flex-col gap-10 px-2 pt-6 pb-[45dvh] sm:px-3 lg:px-4 lg:pt-8">
          {contextLoading &&
          submittedSiteDisplay &&
          !suppressContextLoadingCard ? (
            <>
              {!workingLoaderDone ? (
                <div data-preview-card="true">
                  <PreviewLoaderLine
                    text={PREVIEW_LOADERS.working}
                    start
                    onComplete={() => setWorkingLoaderDone(true)}
                  />
                </div>
              ) : null}
              {workingLoaderDone ? (
                <FloatShell baseTiltDeg={-1}>
                  <div data-preview-card="true">
                    <SiteMetaWorkingCard
                      siteLabel={submittedSiteDisplay}
                      siteMeta={siteMeta}
                    />
                  </div>
                </FloatShell>
              ) : null}
            </>
          ) : null}

          {showContextSection && companySummary ? (
            <section className="flex min-w-0 w-full max-w-full flex-col gap-6">
              {!summaryLoaderDone ? (
                <div data-preview-card="true">
                  <PreviewLoaderLine
                    text={PREVIEW_LOADERS.companySummary}
                    start
                    onComplete={() => setSummaryLoaderDone(true)}
                  />
                </div>
              ) : null}
              {summaryLoaderDone ? (
                <FloatShell baseTiltDeg={-2.2}>
                  <motion.div
                    data-preview-card="true"
                    className="min-w-0 w-full max-w-full overflow-hidden rounded-[20px] bg-white shadow-xl ring-1 ring-black/[0.06]"
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.58, ease: easeOut }}
                  >
                    <SiteMetaHeroImage siteMeta={siteMeta} />
                    <div className="px-5 py-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                        {summaryMetaHost}
                      </p>
                      <p className="mt-1.5 text-base font-semibold leading-snug text-neutral-950">
                        {summaryMetaTitle}
                      </p>
                      {summaryMetaDesc ? (
                        <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">
                          {summaryMetaDesc}
                        </p>
                      ) : null}
                      <div className="mt-4 border-t border-black/10 pt-4">
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
                      </div>
                    </div>
                  </motion.div>
                </FloatShell>
              ) : null}

              {summaryLoaderDone &&
              summaryTypingDone &&
              !brandLoaderDone ? (
                <div data-preview-card="true">
                  <PreviewLoaderLine
                    text={PREVIEW_LOADERS.brandTone}
                    start
                    onComplete={() => setBrandLoaderDone(true)}
                  />
                </div>
              ) : null}
              {brandLoaderDone ? (
                <FloatShell baseTiltDeg={2}>
                  <motion.div
                    data-preview-card="true"
                    className={cardWhite}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
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
              ) : null}
            </section>
          ) : null}

          {showBlogSection && contentInsight ? (
            <section className="flex min-w-0 w-full max-w-full flex-col gap-4">
              {!blogLoaderDone ? (
                <div data-preview-card="true">
                  <PreviewLoaderLine
                    text={PREVIEW_LOADERS.blog}
                    start
                    onComplete={() => setBlogLoaderDone(true)}
                  />
                </div>
              ) : null}
              {blogLoaderDone ? (
                <FloatShell baseTiltDeg={-1.6}>
                  <motion.div
                    data-preview-card="true"
                    className={cardWhite}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.52, ease: easeOut }}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      Blog refresh
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-900">
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
                      className="mt-4 space-y-3 border-t border-black/10 pt-4"
                      linkClassName="text-sm font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-500"
                      urlLineClassName="text-neutral-500"
                    />
                  </motion.div>
                </FloatShell>
              ) : null}
            </section>
          ) : null}

          {adInsights.map((ins, index) => (
            <section key={ins.toolId} className="flex min-w-0 w-full max-w-full flex-col gap-4">
              {!adCardVisible[ins.toolId] ? (
                <div data-preview-card="true">
                  <PreviewLoaderLine
                    key={ins.toolId}
                    text={PREVIEW_LOADERS.adInsight(toolLabel(ins.toolId))}
                    start
                    onComplete={() =>
                      setAdCardVisible((p) => ({ ...p, [ins.toolId]: true }))
                    }
                  />
                </div>
              ) : null}
              {adCardVisible[ins.toolId] ? (
                <FloatShell
                  baseTiltDeg={index % 2 === 0 ? -1.4 : 1.8}
                >
                  <AdCardV3 insight={ins} start />
                </FloatShell>
              ) : null}
            </section>
          ))}

          <div className="h-px w-full shrink-0 scroll-mt-6" aria-hidden />
        </div>
      </div>
    </div>
  );
}
