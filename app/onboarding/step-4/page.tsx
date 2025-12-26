"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

// 🧪 Dummy Data: Replace with real data later
const initialSuggestedCompetitors = [
  "Zapier",
  "Tray.io",
  "Workato",
  "n8n",
  "Make",
];

type RankSlot = {
  id: string;
  label: string;
  competitor: string | null;
};

const rankSlots: { id: string; label: string }[] = [
  { id: "primary", label: "Primary" },
  { id: "one", label: "One" },
  { id: "two", label: "Two" },
  { id: "three", label: "Three" },
  { id: "four", label: "Four" },
  { id: "five", label: "Five" },
  { id: "six", label: "Six" },
  { id: "seven", label: "Seven" },
  { id: "eight", label: "Eight" },
];

export default function OnboardingStep4() {
  const router = useRouter();
  const [activeRankSlots, setActiveRankSlots] = useState<RankSlot[]>(
    rankSlots.map((slot) => ({ ...slot, competitor: null }))
  );
  const [suggestedCompetitors, setSuggestedCompetitors] = useState<string[]>(
    initialSuggestedCompetitors
  );
  const [draggedCompetitor, setDraggedCompetitor] = useState<string | null>(null);
  const [draggedFromRank, setDraggedFromRank] = useState<string | null>(null);

  const handleContinue = () => {
    router.push("/onboarding/step-5");
  };

  const handleBack = () => {
    router.push("/onboarding/step-3");
  };

  const handleDragStart = (competitor: string, fromRank?: string) => {
    setDraggedCompetitor(competitor);
    if (fromRank) {
      setDraggedFromRank(fromRank);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnRank = (slotId: string) => {
    if (!draggedCompetitor) return;

    // If dragged from another rank slot, remove it from there
    if (draggedFromRank) {
      setActiveRankSlots(
        activeRankSlots.map((slot) =>
          slot.id === draggedFromRank
            ? { ...slot, competitor: null }
            : slot.id === slotId
            ? { ...slot, competitor: draggedCompetitor }
            : slot
        )
      );
      setDraggedFromRank(null);
    } else {
      // Dragged from suggested - remove from suggested and add to rank
      setSuggestedCompetitors(
        suggestedCompetitors.filter((c) => c !== draggedCompetitor)
      );
      setActiveRankSlots(
        activeRankSlots.map((slot) =>
          slot.id === slotId ? { ...slot, competitor: draggedCompetitor } : slot
        )
      );
    }

    setDraggedCompetitor(null);
  };

  const handleDropBackToSuggested = () => {
    if (!draggedCompetitor) return;

    // If dragged from rank, remove from rank and add back to suggested
    if (draggedFromRank) {
      setActiveRankSlots(
        activeRankSlots.map((slot) =>
          slot.id === draggedFromRank ? { ...slot, competitor: null } : slot
        )
      );
      setSuggestedCompetitors([...suggestedCompetitors, draggedCompetitor]);
      setDraggedFromRank(null);
    }

    setDraggedCompetitor(null);
  };

  const removeCompetitorFromRank = (slotId: string) => {
    const slot = activeRankSlots.find((s) => s.id === slotId);
    if (slot?.competitor) {
      setSuggestedCompetitors([...suggestedCompetitors, slot.competitor]);
      setActiveRankSlots(
        activeRankSlots.map((s) =>
          s.id === slotId ? { ...s, competitor: null } : s
        )
      );
    }
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
          <div className="absolute inset-0" style={{ filter: "blur(60px)" }}>
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
          <div className="h-1 w-[40px] rounded-full bg-foreground" />
          <div className="h-1 w-[40px] rounded-full bg-foreground/20" />
          <div className="h-1 w-[40px] rounded-full bg-foreground/20" />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="font-fraunces text-[40px] font-normal leading-tight text-foreground">
            Who are your main competitors?
          </h1>
          <p className="mt-2 text-base text-foreground/60">
            Strive continuously tracks competitor content, SEO, ads, and
            messaging.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {/* Rank competitors */}
          <div>
            <label className="mb-3 block text-sm text-foreground">
              Rank competitors
            </label>

            {/* All rank slots displayed as drop zones */}
            <div className="mb-3 flex flex-wrap gap-2">
              {activeRankSlots.slice(0, 7).map((slot) => (
                <div
                  key={slot.id}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDropOnRank(slot.id)}
                  className="group relative"
                >
                  {slot.competitor ? (
                    <div
                      draggable
                      onDragStart={() =>
                        handleDragStart(slot.competitor!, slot.id)
                      }
                      className={`cursor-move rounded-full px-4 py-2 text-sm font-medium ${
                        slot.id === "primary"
                          ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                          : "bg-foreground text-background"
                      }`}
                    >
                      {slot.competitor}
                      <button
                        onClick={() => removeCompetitorFromRank(slot.id)}
                        className={`ml-2 ${
                          slot.id === "primary"
                            ? "text-white/60 hover:text-white"
                            : "text-background/60 hover:text-background"
                        }`}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`rounded-full border-2 border-dashed px-4 py-2 text-sm font-medium ${
                        slot.id === "primary"
                          ? "border-orange-400/40 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 text-orange-600"
                          : "border-foreground/20 bg-foreground/5 text-foreground/40"
                      }`}
                    >
                      + {slot.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {activeRankSlots.slice(7).map((slot) => (
                <div
                  key={slot.id}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDropOnRank(slot.id)}
                  className="group relative"
                >
                  {slot.competitor ? (
                    <div
                      draggable
                      onDragStart={() =>
                        handleDragStart(slot.competitor!, slot.id)
                      }
                      className="cursor-move rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
                    >
                      {slot.competitor}
                      <button
                        onClick={() => removeCompetitorFromRank(slot.id)}
                        className="ml-2 text-background/60 hover:text-background"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-full border-2 border-dashed border-foreground/20 bg-foreground/5 px-4 py-2 text-sm font-medium text-foreground/40">
                      + {slot.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Suggested competitors */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDropBackToSuggested}
          >
            <label className="mb-3 block text-sm text-foreground">
              Suggested competitors
            </label>
            <div className="flex flex-wrap gap-2">
              {suggestedCompetitors.map((competitor, index) => (
                <div
                  key={`${competitor}-${index}`}
                  draggable
                  onDragStart={() => handleDragStart(competitor)}
                  className="cursor-move rounded-full bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
                >
                  {competitor}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-foreground/50">
              Based on your industry and website, these companies are often
              compared to you.
            </p>
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
