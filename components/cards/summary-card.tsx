// ✅ Reusable Component: SummaryCard for displaying analytics summaries with metrics
import { motion } from "framer-motion";
import { Expand, Image, Link } from "lucide-react";

interface MetricData {
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  label: string;
}

interface SummaryCardProps {
  tags?: string[];
  headline: string;
  description: string;
  metricsTitle?: string;
  metricsGrid: MetricData[][];
  secondaryMetrics?: MetricData[];
  secondaryDescription?: string;
  onDeepDive?: () => void;
  onCopyAsImage?: () => void;
  onShare?: () => void;
}

export function SummaryCard({
  tags = [],
  headline,
  description,
  metricsTitle = "Last 8 weeks average",
  metricsGrid,
  secondaryMetrics,
  secondaryDescription,
  onDeepDive,
  onCopyAsImage,
  onShare
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-0 mb-3 w-full overflow-hidden rounded-2xl border-[0.5px] border-border bg-card"
    >
      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex gap-1 px-[31.5px] pt-[27.5px]">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="rounded-3xl border-[0.5px] border-border px-[10px] pt-[1px] pb-[2px] h-fit"
            >
              <span className="text-[10px] uppercase leading-normal text-foreground/60">
                {tag}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Headline */}
      <div className={`px-[31.5px] ${tags.length > 0 ? 'pt-7' : 'pt-[55.5px]'}`}>
        <h3 className="text-[34px] leading-[42px] text-foreground/60">
          {headline.split(' ').map((word, i) => {
            const isHighlight = word.includes('Clicks') || word.includes('Impressions') || word.includes('Engagement');
            return (
              <span key={i} className={isHighlight ? 'text-foreground' : ''}>
                {word}{' '}
              </span>
            );
          })}
        </h3>
      </div>

      {/* Description */}
      <p className="px-[31.5px] pt-6 mb-5 text-sm leading-6 tracking-[-0.28px] text-foreground">
        {description}
      </p>

      {/* Metrics Grid */}
      <div className="mx-[31.5px] mt-6 rounded-xl bg-background pb-0 pt-8 text-black">
        <div className="relative">
          <p className="absolute left-2 top-[-24px] text-xs leading-normal text-foreground/60">
            {metricsTitle}
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border-[0.5px] border-border bg-card">
          {metricsGrid.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`flex border-border ${
                rowIndex > 0 ? 'border-t-[0.5px]' : ''
              }`}
            >
              {row.map((metric, colIndex) => (
                <div
                  key={colIndex}
                  className={`flex-1 px-5 py-[18px] ${
                    colIndex > 0 ? 'border-l-[0.5px] border-border' : ''
                  }`}
                >
                  <div className="flex items-end gap-[7px]">
                    <p className="text-xl font-medium leading-normal text-foreground">
                      {metric.value}
                    </p>
                    <div className="flex h-4 items-center leading-normal">
                      <span
                        className={`text-xs ${
                          metric.changeType === 'positive'
                            ? 'text-[#2eb67d]'
                            : metric.changeType === 'negative'
                            ? 'text-[#f64545]'
                            : 'text-foreground/60'
                        }`}
                      >
                        {metric.change}
                      </span>
                      {metric.changeType !== 'neutral' && (
                        <span
                          className={`ml-0.5 text-xs ${
                            metric.changeType === 'positive'
                              ? 'text-[#2eb67d]'
                              : 'text-[#f64545]'
                          }`}
                        >
                          {metric.changeType === 'positive' ? '▲' : '▼'}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-xs leading-normal text-foreground/60">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Metrics (if provided) */}
      {secondaryMetrics && secondaryMetrics.length > 0 && (
        <div className="mt-6 px-[31.5px]">
          <div className="overflow-hidden rounded-lg border-[0.5px] border-border">
            <div className="flex">
              {secondaryMetrics.map((metric, index) => (
                <div
                  key={index}
                  className={`flex-1 px-5 py-4 ${
                    index > 0 ? 'border-l-[0.5px] border-border' : ''
                  }`}
                >
                  <div className="flex items-end gap-[7px]">
                    <p className="text-xl font-medium leading-normal text-foreground">
                      {metric.value}
                    </p>
                    <span className="h-4 text-xs leading-normal text-[#b94937]">
                      {metric.change}
                    </span>
                  </div>
                  <p className="mt-2 text-xs uppercase leading-normal text-foreground/60">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Secondary Description */}
      {secondaryDescription && (
        <p className="px-[31.5px] pt-6 text-sm leading-6 tracking-[-0.28px] text-foreground">
          {secondaryDescription}
        </p>
      )}

      {/* Action Buttons */}
      <div className="mt-auto flex h-[46px] items-center justify-end gap-1 border-t-[0.5px] border-border px-2 py-[7.5px]">
        <button
          onClick={onDeepDive}
          className="flex items-center gap-1.5 rounded-md border-[0.5px] border-border px-3 py-2 transition-colors hover:bg-sidebar-accent"
        >
          <Expand className="h-3 w-3 text-foreground/60" />
          <span className="text-xs font-medium leading-[14px] text-foreground/60">
            Deep dive
          </span>
        </button>
        <button
          onClick={onCopyAsImage}
          className="flex items-center gap-1.5 rounded-md border-[0.5px] border-border px-3 py-2 transition-colors hover:bg-sidebar-accent"
        >
          <Image className="h-3 w-3 text-foreground/60" />
          <span className="text-xs font-medium leading-[14px] text-foreground/60">
            Copy as image
          </span>
        </button>
        <button
          onClick={onShare}
          className="flex items-center gap-1.5 rounded-md border-[0.5px] border-border px-3 py-2 transition-colors hover:bg-sidebar-accent"
        >
          <Link className="h-3 w-3 text-foreground/60" />
          <span className="text-xs font-medium leading-[14px] text-foreground/60">
            Share
          </span>
        </button>
      </div>
    </motion.div>
  );
}
