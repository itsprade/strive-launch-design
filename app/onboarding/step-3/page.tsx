"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

const blobStyles = `
  @keyframes blob1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(20%, 15%) scale(1.1); }
    50% { transform: translate(10%, 25%) scale(0.95); }
    75% { transform: translate(-10%, 10%) scale(1.05); }
  }
  @keyframes blob2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(-15%, 20%) scale(1.05); }
    50% { transform: translate(-25%, -10%) scale(1.1); }
    75% { transform: translate(5%, -15%) scale(0.95); }
  }
  @keyframes blob3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(15%, -20%) scale(0.95); }
    50% { transform: translate(-15%, -15%) scale(1.1); }
    75% { transform: translate(-20%, 10%) scale(1); }
  }
  @keyframes blob4 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(-20%, 15%) scale(1.1); }
    66% { transform: translate(15%, -10%) scale(0.9); }
  }
`;

export default function OnboardingStep3() {
  const router = useRouter();
  const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null);
  const [selectedBuyerPersona, setSelectedBuyerPersona] = useState<string | null>(null);
  const [selectedVerticals, setSelectedVerticals] = useState<string[]>([]);

  // AI Cursor state
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);

  // Auto-select with AI cursor animation
  useEffect(() => {
    const sequence = async () => {
      // Wait 1 second after page load
      await new Promise(resolve => setTimeout(resolve, 1000));

      setShowCursor(true);
      setCursorVisible(true);

      // Move to SMB button
      await animateCursorTo('smb-button', 800);
      await new Promise(resolve => setTimeout(resolve, 300));
      setSelectedCompanySize('SMB');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Move to Head of marketing button
      await animateCursorTo('head-of-marketing-button', 800);
      await new Promise(resolve => setTimeout(resolve, 300));
      setSelectedBuyerPersona('Head of marketing');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Move to Technology button
      await animateCursorTo('technology-button', 800);
      await new Promise(resolve => setTimeout(resolve, 300));
      setSelectedVerticals(['Technology']);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Move to Finance button
      await animateCursorTo('finance-button', 800);
      await new Promise(resolve => setTimeout(resolve, 300));
      setSelectedVerticals(prev => [...prev, 'Finance']);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Fade out cursor
      setCursorVisible(false);
      await new Promise(resolve => setTimeout(resolve, 300));
      setShowCursor(false);
    };

    sequence();
  }, []);

  const animateCursorTo = (elementId: string, duration: number) => {
    return new Promise<void>((resolve) => {
      const element = document.getElementById(elementId);
      if (element) {
        const rect = element.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;

        setCursorPosition({ x: targetX, y: targetY });
        setTimeout(resolve, duration);
      } else {
        resolve();
      }
    });
  };

  const handleContinue = () => {
    router.push("/onboarding/step-4");
  };

  const handleBack = () => {
    router.push("/onboarding/step-2");
  };

  const toggleVertical = (vertical: string) => {
    setSelectedVerticals(prev =>
      prev.includes(vertical)
        ? prev.filter(v => v !== vertical)
        : [...prev, vertical]
    );
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <style>{blobStyles}</style>

      {/* Gradient Blob Background - Bottom */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute bottom-[-60%] left-1/2 -translate-x-1/2"
          style={{ width: 1200, height: 1200, filter: "blur(120px)" }}
        >
          <div
            className="absolute inset-0"
            style={{ filter: "blur(60px)" }}
          >
            {/* Blob 1 - Orange */}
            <div
              className="absolute rounded-full"
              style={{
                width: "120%",
                height: "120%",
                background:
                  "radial-gradient(circle, #fb923c 0%, transparent 70%)",
                top: "-10%",
                left: "-20%",
                animation: "blob1 4s ease-in-out infinite",
              }}
            />
            {/* Blob 2 - Yellow */}
            <div
              className="absolute rounded-full"
              style={{
                width: "110%",
                height: "110%",
                background:
                  "radial-gradient(circle, #fbbf24 0%, transparent 70%)",
                top: "0%",
                right: "-20%",
                animation: "blob2 5s ease-in-out infinite",
              }}
            />
            {/* Blob 3 - Deep Orange */}
            <div
              className="absolute rounded-full"
              style={{
                width: "100%",
                height: "100%",
                background:
                  "radial-gradient(circle, #f97316 0%, transparent 70%)",
                bottom: "-20%",
                left: "0%",
                animation: "blob3 4.5s ease-in-out infinite",
              }}
            />
            {/* Blob 4 - Light Yellow */}
            <div
              className="absolute rounded-full"
              style={{
                width: "90%",
                height: "90%",
                background:
                  "radial-gradient(circle, #fde047 0%, transparent 70%)",
                top: "-15%",
                right: "-10%",
                animation: "blob4 3.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* AI Cursor */}
      <AnimatePresence>
        {showCursor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: cursorVisible ? 1 : 0,
              x: cursorPosition.x,
              y: cursorPosition.y
            }}
            exit={{ opacity: 0 }}
            transition={{
              x: { type: "spring", stiffness: 100, damping: 20 },
              y: { type: "spring", stiffness: 100, damping: 20 },
              opacity: { duration: 0.3 }
            }}
            className="pointer-events-none fixed z-50"
            style={{ left: 0, top: 0 }}
          >
            <div className="relative">
              {/* Simple triangle indicator */}
              <div className="absolute -left-2 -top-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M0 0L16 8L8 8L0 16L0 0Z"
                    fill="#FF5537"
                  />
                </svg>
              </div>

              <div className="flex flex-col gap-0.5 rounded-xl bg-[#FF5537] px-3 py-2 shadow-xl">
                <span className="text-sm font-semibold text-white leading-tight">Strive AI</span>
                <span className="text-xs text-white/70 leading-tight">Based on your company...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[500px] px-8">
        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 flex items-center gap-2"
        >
          <div className="h-1 w-[40px] rounded-full bg-foreground" />
          <div className="h-1 w-[40px] rounded-full bg-foreground" />
          <div className="h-1 w-[40px] rounded-full bg-foreground" />
          <div className="h-1 w-[40px] rounded-full bg-foreground/20" />
          <div className="h-1 w-[40px] rounded-full bg-foreground/20" />
          <div className="h-1 w-[40px] rounded-full bg-foreground/20" />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="font-fraunces text-[40px] font-normal leading-tight text-foreground">
            Who do you sell to?
          </h1>
          <p className="mt-2 text-base text-foreground/60">
            We'll use this to analyze content gaps, competitors, and performance benchmarks.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-8"
        >
          {/* Target company size */}
          <div>
            <label className="mb-3 block text-sm text-foreground">
              Target company size
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                id="smb-button"
                onClick={() => setSelectedCompanySize('SMB')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCompanySize === 'SMB'
                    ? 'bg-foreground text-background'
                    : 'bg-card text-foreground hover:bg-foreground/5'
                }`}
              >
                SMB
              </button>
              <button
                id="mid-market-button"
                onClick={() => setSelectedCompanySize('Mid-Market')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCompanySize === 'Mid-Market'
                    ? 'bg-foreground text-background'
                    : 'bg-card text-foreground hover:bg-foreground/5'
                }`}
              >
                Mid-Market
              </button>
              <button
                id="enterprise-button"
                onClick={() => setSelectedCompanySize('Enterprise')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCompanySize === 'Enterprise'
                    ? 'bg-foreground text-background'
                    : 'bg-card text-foreground hover:bg-foreground/5'
                }`}
              >
                Enterprise
              </button>
            </div>
          </div>

          {/* Primary buyer persona */}
          <div>
            <label className="mb-3 block text-sm text-foreground">
              Primary buyer persona
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                id="head-of-marketing-button"
                onClick={() => setSelectedBuyerPersona('Head of marketing')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedBuyerPersona === 'Head of marketing'
                    ? 'bg-foreground text-background'
                    : 'bg-card text-foreground hover:bg-foreground/5'
                }`}
              >
                Head of marketing
              </button>
              <button
                id="mid-market-persona-button"
                onClick={() => setSelectedBuyerPersona('Mid-Market')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedBuyerPersona === 'Mid-Market'
                    ? 'bg-foreground text-background'
                    : 'bg-card text-foreground hover:bg-foreground/5'
                }`}
              >
                Mid-Market
              </button>
              <button
                id="enterprise-persona-button"
                onClick={() => setSelectedBuyerPersona('Enterprise')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedBuyerPersona === 'Enterprise'
                    ? 'bg-foreground text-background'
                    : 'bg-card text-foreground hover:bg-foreground/5'
                }`}
              >
                Enterprise
              </button>
            </div>
          </div>

          {/* Primary verticals */}
          <div>
            <label className="mb-3 block text-sm text-foreground">
              Primary verticals
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                id="technology-button"
                onClick={() => toggleVertical('Technology')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedVerticals.includes('Technology')
                    ? 'bg-foreground text-background'
                    : 'bg-card text-foreground hover:bg-foreground/5'
                }`}
              >
                Technology
              </button>
              <button
                id="finance-button"
                onClick={() => toggleVertical('Finance')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedVerticals.includes('Finance')
                    ? 'bg-foreground text-background'
                    : 'bg-card text-foreground hover:bg-foreground/5'
                }`}
              >
                Finance
              </button>
              <button
                id="retail-button"
                onClick={() => toggleVertical('Retail')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedVerticals.includes('Retail')
                    ? 'bg-foreground text-background'
                    : 'bg-card text-foreground hover:bg-foreground/5'
                }`}
              >
                Retail
              </button>
              <button
                id="healthcare-button"
                onClick={() => toggleVertical('Healthcare')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedVerticals.includes('Healthcare')
                    ? 'bg-foreground text-background'
                    : 'bg-card text-foreground hover:bg-foreground/5'
                }`}
              >
                Healthcare
              </button>
              <button
                id="manufacturing-button"
                onClick={() => toggleVertical('Manufacturing')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedVerticals.includes('Manufacturing')
                    ? 'bg-foreground text-background'
                    : 'bg-card text-foreground hover:bg-foreground/5'
                }`}
              >
                Manufacturing
              </button>
              <button
                id="other-button"
                onClick={() => toggleVertical('Other')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedVerticals.includes('Other')
                    ? 'bg-foreground text-background'
                    : 'bg-card text-foreground hover:bg-foreground/5'
                }`}
              >
                Other
              </button>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 flex items-center justify-end gap-3"
        >
          <button
            onClick={handleBack}
            className="rounded-lg px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            className="rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Continue
          </button>
        </motion.div>
      </div>
    </div>
  );
}
