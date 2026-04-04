import type { ReactNode } from "react";
import type { SiteMetaPreview } from "@/lib/site-meta";
import { Globe } from "lucide-react";

function clipMetaText(s: string | null | undefined, max = 150): string | null {
  const t = s?.trim();
  if (!t) return null;
  return t.length <= max ? t : `${t.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

/** Full-width OG / hero region — top of stacked preview cards (rounded by parent `overflow-hidden`). */
export function SiteMetaHeroImage({
  siteMeta,
  className = "",
  /** `fill` = stretch to parent height (fixed-split cards); `aspect` = intrinsic hero height. */
  layout = "aspect",
}: {
  siteMeta?: SiteMetaPreview | null;
  className?: string;
  layout?: "aspect" | "fill";
}) {
  const imageUrl = siteMeta?.image?.trim() || null;
  const shell =
    layout === "fill"
      ? "relative h-full min-h-0 w-full overflow-hidden bg-gradient-to-br from-violet-100/90 via-sky-50/80 to-amber-50/70"
      : "relative w-full shrink-0 overflow-hidden bg-gradient-to-br from-violet-100/90 via-sky-50/80 to-amber-50/70 aspect-[16/10] min-h-[11.5rem] sm:aspect-video sm:min-h-[13rem] md:min-h-[14.5rem]";
  return (
    <div className={`${shell} ${className}`}>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 size-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          <Globe
            className="h-20 w-20 text-neutral-400/90 sm:h-24 sm:w-24"
            strokeWidth={1.1}
            aria-hidden
          />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
    </div>
  );
}

export type SiteMetaWorkingCardProps = {
  siteLabel: string;
  siteMeta?: SiteMetaPreview | null;
  /** Tailwind height class; default matches preview column card. */
  heightClassName?: string;
  /** Renders at the top of the white pane (e.g. typewriter status in chat). */
  leadSlot?: ReactNode;
  /**
   * When false, omits the “Strive is working on…” line (use when `leadSlot` carries that narrative).
   */
  showStriveWorkingLine?: boolean;
};

/**
 * Link-preview style block: OG image ~top half, solid white body ~bottom half.
 * Used while site context is loading (onboarding).
 */
export function SiteMetaWorkingCard({
  siteLabel,
  siteMeta,
  heightClassName = "h-[min(26rem,58dvh)]",
  leadSlot,
  showStriveWorkingLine = true,
}: SiteMetaWorkingCardProps) {
  const host = siteMeta?.hostname?.trim() || siteLabel;
  const title = clipMetaText(siteMeta?.title, 120) || siteLabel;
  const description =
    clipMetaText(siteMeta?.description, 200) ??
    "We're mapping how you show up—headlines, positioning, and the story visitors see first.";

  return (
    <div
      className={`flex w-full max-w-full flex-col overflow-hidden rounded-[32px] border border-black/[0.08] bg-white text-neutral-900 shadow-xl ring-1 ring-black/[0.04] ${heightClassName}`}
      role="status"
      aria-live="polite"
    >
      <div className="relative min-h-0 flex-[1.15] overflow-hidden">
        <SiteMetaHeroImage siteMeta={siteMeta} layout="fill" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto overscroll-y-contain bg-white px-5 py-4 text-sm leading-relaxed">
        {leadSlot ? <div className="mb-3 shrink-0">{leadSlot}</div> : null}
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
          {host}
        </p>
        <p className="mt-1.5 text-base font-semibold leading-snug text-neutral-950">
          {title}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">
          {description}
        </p>
        <div className="mt-4 border-t border-neutral-200/90 pt-3.5">
          {showStriveWorkingLine ? (
            <p className="text-[13px] text-neutral-800">
              Strive is working on{" "}
              <span className="font-semibold text-neutral-950">{siteLabel}</span>{" "}
              — reading pages and gathering context.
            </p>
          ) : null}
          <p
            className={
              showStriveWorkingLine
                ? "mt-2 flex items-center gap-1.5 text-[13px] text-neutral-600"
                : "flex items-center gap-1.5 text-[13px] text-neutral-600"
            }
          >
            <span className="inline-flex gap-0.5">
              <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:0ms]" />
              <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:150ms]" />
              <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:300ms]" />
            </span>
            Agent thinking
          </p>
        </div>
      </div>
    </div>
  );
}
