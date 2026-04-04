"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TypewriterText } from "@/components/onboarding/typewriter-text";
import type {
  ContentInsightOutdatedPost,
  IntegrationInsight,
  ToolId,
} from "@/components/onboarding/constants";
import type { SiteMetaPreview } from "@/lib/site-meta";

export interface ActiveAdInsight extends IntegrationInsight {
  toolId: ToolId;
}

export interface InsightsPanelProps {
  /** Falsy before the user submits a website — panel renders nothing. */
  active: boolean;
  /** Shown in the working state (e.g. user-typed URL or host). */
  submittedSiteDisplay: string | null;
  contextLoading: boolean;
  companySummary: string | null;
  brandTone: string | null;
  contentInsight: string | null;
  /** Shown as a compact list under the blog insight paragraph when set. */
  contentInsightOutdatedPosts?: ContentInsightOutdatedPost[];
  adInsights: ActiveAdInsight[];
  /** Fires when brand-tone typewriter finishes — parent can unlock blog section. */
  onBrandTypingDone?: () => void;
  /** While integrating, show tool-specific loading copy on the right. */
  integrationLoading: { toolId: ToolId; message: string } | null;
  /**
   * When true, hide the “working on your site” right card while `contextLoading` is still true
   * (e.g. wait until the in-chat working line finishes typing).
   */
  suppressContextLoadingCard?: boolean;
  /** Open Graph / meta snapshot for the submitted site (v3 visual hero). */
  siteMeta?: SiteMetaPreview | null;
}

const easeOut = [0.16, 1, 0.3, 1] as const;

export function InsightOutdatedBlogLinks({
  posts,
  visible,
  className,
  linkClassName,
  urlLineClassName,
}: {
  posts: ContentInsightOutdatedPost[];
  visible: boolean;
  className?: string;
  linkClassName?: string;
  urlLineClassName?: string;
}) {
  if (!posts.length || !visible) return null;

  return (
    <motion.ul
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: easeOut }}
      className={className}
    >
      {posts.map((post) => (
        <li key={post.url} className="list-none">
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className={
              linkClassName ??
              "text-sm font-medium text-foreground underline-offset-4 hover:underline"
            }
          >
            {post.title}
          </a>
          <p
            className={cn(
              "mt-0.5 truncate font-mono text-[11px] leading-relaxed text-muted-foreground",
              urlLineClassName,
            )}
          >
            {post.url}
          </p>
        </li>
      ))}
    </motion.ul>
  );
}

const cardNeutral = "rounded-[20px] bg-[#F2F2F4] p-6 dark:bg-zinc-900/60";
const cardBlue =
  "rounded-[20px] bg-[#E8F1FA] p-6 dark:bg-sky-950/40";

function WorkingBlock({ siteLabel }: { siteLabel: string }) {
  return (
    <div
      className="rounded-2xl bg-muted/90 px-4 py-3.5 text-sm leading-relaxed text-foreground"
      role="status"
      aria-live="polite"
    >
      <p>
        <span className="text-muted-foreground">Strive is working on</span>{" "}
        <span className="font-medium text-foreground">{siteLabel}</span>
        <span className="text-muted-foreground">
          {" "}
          — reading pages and gathering context. This usually takes a few
          seconds.
        </span>
      </p>
      <p className="mt-2 flex items-center gap-1 text-muted-foreground">
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

function AdInsightCard({
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
      className={cardNeutral}
      initial={{ opacity: 0, y: 22 }}
      animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{ duration: 0.5, ease: easeOut }}
    >
      <p className="font-fraunces text-4xl font-normal tracking-tight text-foreground">
        <TypewriterText
          text={insight.stat}
          start={statTypeStart}
          cps={24}
          showCaret={false}
          onComplete={() => setBodyStart(true)}
        />
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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

export function InsightsPanel({
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
}: InsightsPanelProps) {
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

  return (
    <div className="flex h-full flex-col gap-10 overflow-y-auto pr-1">
      {contextLoading &&
      submittedSiteDisplay &&
      !suppressContextLoadingCard ? (
        <WorkingBlock siteLabel={submittedSiteDisplay} />
      ) : null}

      {integrationLoading ? (
        <div
          className="rounded-2xl bg-muted/80 px-4 py-3.5 text-sm leading-relaxed text-foreground"
          role="status"
          aria-live="polite"
        >
          <p>{integrationLoading.message}</p>
          <p className="mt-2 text-muted-foreground">Retrieving content…</p>
        </div>
      ) : null}

      {showContextSection && companySummary ? (
        <section>
          <h2 className="font-fraunces text-[1.35rem] font-normal leading-snug tracking-tight text-foreground md:text-xl">
            I am building your company context
          </h2>
          <div className="mt-5 grid gap-4">
            <motion.div
              className={cardNeutral}
              initial={{ opacity: 0, y: 28 }}
              animate={
                summaryCardIn
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 28 }
              }
              transition={{ duration: 0.58, ease: easeOut }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Company summary
              </p>
              <p className="mt-3 text-sm leading-relaxed text-foreground">
                <TypewriterText
                  key={companySummary.slice(0, 40)}
                  text={companySummary}
                  start={summaryTypeStart}
                  cps={38}
                  onComplete={() => setSummaryTypingDone(true)}
                />
              </p>
            </motion.div>

            <motion.div
              className={cardNeutral}
              initial={{ opacity: 0, y: 28 }}
              animate={
                brandCardIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }
              }
              transition={{ duration: 0.58, ease: easeOut }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Brand tone
              </p>
              <p className="mt-3 text-sm leading-relaxed text-foreground">
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
                  <span className="text-muted-foreground">—</span>
                )}
              </p>
            </motion.div>
          </div>
        </section>
      ) : null}

      {showBlogSection && contentInsight ? (
        <section>
          <h2 className="font-fraunces text-[1.35rem] font-normal leading-snug tracking-tight text-foreground md:text-xl">
            We found outdated blog posts
          </h2>
          <div className="mt-5">
            <motion.div
              className={cardBlue}
              initial={{ opacity: 0, y: 22 }}
              animate={
                contentCardIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }
              }
              transition={{ duration: 0.52, ease: easeOut }}
            >
              <p className="text-sm leading-relaxed text-foreground">
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
                className="mt-4 space-y-3 border-t border-sky-300/40 pt-4 dark:border-sky-400/25"
              />
            </motion.div>
          </div>
        </section>
      ) : null}

      {adInsights.map((ins) => (
        <section key={ins.toolId}>
          <h2 className="font-fraunces text-[1.35rem] font-normal leading-snug tracking-tight text-foreground md:text-xl">
            {ins.sectionTitle}
          </h2>
          <div className="mt-5">
            <AdInsightCard insight={ins} start={!!adReveal[ins.toolId]} />
          </div>
        </section>
      ))}
    </div>
  );
}
