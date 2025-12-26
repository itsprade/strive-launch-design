"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations";
import { mockQuickActions, mockInsightCards } from "@/lib/data";
import { SparklesIcon } from "lucide-react";
import { PageLoader } from "@/components/loader";
import { ChatInput } from "@/components/chat-input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardHome() {
  const router = useRouter();

  // 🧪 Dummy Data: User name
  const userName = "Pradeep";
  const greeting = "Good Morning";

  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Only show loader on first page load (refresh), not when navigating back
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (hasVisited) {
      // Skip loader if user has already visited
      setIsLoading(false);
      setHasLoaded(true);
    } else {
      // Show loader for 2 seconds on first visit
      sessionStorage.setItem('hasVisited', 'true');
      const timer = setTimeout(() => {
        setIsLoading(false);
        setHasLoaded(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {isLoading && <PageLoader />}
      <motion.div
        className="flex min-h-screen w-full bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
      {/* 🔽 Sidebar Navigation */}
      <aside className="fixed left-0 top-0 flex h-screen w-16 flex-col items-center justify-center bg-background">
        <nav className="flex flex-col gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent transition-colors hover:bg-sidebar-accent/80">
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path d="M2 6.5L8 2L14 6.5V13.5C14 14.0523 13.5523 14.5 13 14.5H3C2.44772 14.5 2 14.0523 2 13.5V6.5Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-sidebar-accent">
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <circle cx="5.5" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="10.5" cy="10.5" r="3" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-sidebar-accent">
            <SparklesIcon className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-sidebar-accent">
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 5V8L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </nav>
      </aside>

      {/* 🔽 Main Content */}
      <main className="ml-16 flex w-full flex-col items-center">
        <div className="w-full max-w-[800px] px-8">
          {/* 🔽 Hero Section */}
          <div className="flex flex-col items-center pt-32">
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: isLoading ? 200 : 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
              className="flex w-full flex-col items-center"
            >
              <motion.h1
                initial={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
                animate={{
                  opacity: isLoading ? 0 : 1,
                  filter: isLoading ? "blur(20px)" : "blur(0px)",
                  scale: isLoading ? 1.1 : 1
                }}
                transition={{ delay: 0.02, duration: 0.8, ease: "easeOut" }}
                className="font-fraunces mb-12 text-center text-[40px] font-normal leading-[36px] tracking-[-0.8px]"
                style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
              >
                <span className="text-foreground/50">{greeting}, </span>
                <span className="text-foreground">{userName}</span>
              </motion.h1>

            {/* 🔽 Search Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mb-4 w-full"
            >
              <ChatInput onEnter={() => router.push('/chat')} />
            </motion.div>

            {/* 🔽 Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="mb-12 flex flex-wrap items-center justify-center gap-2"
            >
              {mockQuickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => router.push('/chat')}
                  className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium tracking-[-0.24px] text-foreground/50 transition-all hover:border-border/80 hover:bg-card/80"
                >
                  {action.label}
                </button>
              ))}
            </motion.div>
            </motion.div>
          </div>

          {/* 🔽 Recommended Actions */}
          <motion.div
            className="pb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoading ? 0 : 1 }}
              transition={{ delay: 1.4, duration: 0.4 }}
              className="mb-2 px-1 py-2"
            >
              <h2
                className="font-fraunces text-base font-normal leading-5 tracking-[-0.32px] text-foreground/50"
                style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
              >
                Recommended actions
              </h2>
            </motion.div>

            <div className="space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.95 : 1 }}
                  transition={{ delay: 1.6, duration: 0.4 }}
                  onClick={() => router.push('/chat')}
                  className="h-[166px] cursor-pointer overflow-hidden rounded-2xl p-5 transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: "#eff1f7" }}
                >
                  <div className="mb-4 flex items-end gap-2">
                    <span
                      className="font-fraunces text-[40px] font-normal leading-[36px] tracking-[-0.8px] text-foreground"
                      style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
                    >
                      12%
                    </span>
                    <span
                      className="font-fraunces text-base font-normal leading-5 tracking-[-0.32px] text-foreground/50"
                      style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
                    >
                      increase
                    </span>
                  </div>
                  <p className="text-base leading-5 tracking-[-0.32px] text-foreground">
                    Organic traffic is up 12% with an increase of 8% in conversions since 10 posts were refreshed.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.95 : 1 }}
                  transition={{ delay: 1.7, duration: 0.4 }}
                  onClick={() => router.push('/chat')}
                  className="h-[166px] cursor-pointer overflow-hidden rounded-2xl p-5 transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: "#dff0fb" }}
                >
                  <div className="mb-4">
                    <span
                      className="font-fraunces text-base font-normal leading-5 tracking-[-0.32px] text-foreground/50"
                      style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
                    >
                      Google Ads
                    </span>
                  </div>
                  <p className="text-base leading-5 tracking-[-0.32px] text-foreground">
                    Campaign "Search-Competitor-ForceAI" is performing well but capped by budget. Increase budget to untap more conversions.
                  </p>
                </motion.div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.95 : 1 }}
                  transition={{ delay: 1.8, duration: 0.4 }}
                  onClick={() => router.push('/chat')}
                  className="h-[166px] cursor-pointer overflow-hidden rounded-2xl p-5 transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: "#dff0fb" }}
                >
                  <div className="mb-4">
                    <span
                      className="font-fraunces text-base font-normal leading-5 tracking-[-0.32px] text-foreground/50"
                      style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
                    >
                      Google Ads
                    </span>
                  </div>
                  <p className="text-base leading-5 tracking-[-0.32px] text-foreground">
                    Campaign "Search-Competitor-ForceAI" is performing well but capped by budget. Increase budget to untap more conversions.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.95 : 1 }}
                  transition={{ delay: 1.9, duration: 0.4 }}
                  onClick={() => router.push('/chat')}
                  className="h-[166px] cursor-pointer overflow-hidden rounded-2xl p-5 transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: "#eff1f7" }}
                >
                  <div className="mb-4 flex items-end gap-2">
                    <span
                      className="font-fraunces text-[40px] font-normal leading-[36px] tracking-[-0.8px] text-foreground"
                      style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
                    >
                      12%
                    </span>
                    <span
                      className="font-fraunces text-base font-normal leading-5 tracking-[-0.32px] text-foreground/50"
                      style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
                    >
                      increase
                    </span>
                  </div>
                  <p className="text-base leading-5 tracking-[-0.32px] text-foreground">
                    Organic traffic is up 12% with an increase of 8% in conversions since 10 posts were refreshed.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      </motion.div>
    </>
  );
}
