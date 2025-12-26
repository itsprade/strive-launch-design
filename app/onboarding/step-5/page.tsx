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

type Channel = {
  name: string;
  icon: string;
  enabled: boolean;
};

export default function OnboardingStep5() {
  const router = useRouter();

  const [paidChannels, setPaidChannels] = useState<Channel[]>([
    { name: "Google Ads", icon: "🔴", enabled: false },
    { name: "Meta Ads", icon: "🔵", enabled: false },
    { name: "LinkedIn Ads", icon: "🔵", enabled: false },
    { name: "Twitter/X Ads", icon: "⚫", enabled: false },
    { name: "TikTok Ads", icon: "⚫", enabled: false },
  ]);

  const [organicChannels, setOrganicChannels] = useState<Channel[]>([
    { name: "SEO / Content", icon: "📝", enabled: false },
    { name: "Organic Social", icon: "💬", enabled: false },
    { name: "Email Marketing", icon: "📧", enabled: false },
    { name: "Community", icon: "👥", enabled: false },
  ]);

  const [otherChannels, setOtherChannels] = useState<Channel[]>([
    { name: "Events / Webinars", icon: "📅", enabled: false },
    { name: "Partner Marketing", icon: "🤝", enabled: false },
    { name: "PR", icon: "📰", enabled: false },
    { name: "Affiliate", icon: "🔗", enabled: false },
    { name: "ABM", icon: "🎯", enabled: false },
  ]);

  const handleContinue = () => {
    router.push("/onboarding/step-6");
  };

  const handleBack = () => {
    router.push("/onboarding/step-4");
  };

  const togglePaidChannel = (index: number) => {
    setPaidChannels(
      paidChannels.map((channel, i) =>
        i === index ? { ...channel, enabled: !channel.enabled } : channel
      )
    );
  };

  const toggleOrganicChannel = (index: number) => {
    setOrganicChannels(
      organicChannels.map((channel, i) =>
        i === index ? { ...channel, enabled: !channel.enabled } : channel
      )
    );
  };

  const toggleOtherChannel = (index: number) => {
    setOtherChannels(
      otherChannels.map((channel, i) =>
        i === index ? { ...channel, enabled: !channel.enabled } : channel
      )
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
          <div className="h-1 w-[40px] rounded-full bg-foreground" />
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
            Which channels matter most to you today?
          </h1>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-foreground/60">
              Who are your main competitors?
            </p>
            <p className="text-sm text-foreground/60">
              Strive continuously tracks competitor content, SEO, ads, and messaging.
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {/* Paid channels */}
          <div>
            <label className="mb-3 block text-sm text-foreground">
              Paid channels
            </label>
            <div className="flex flex-wrap gap-2">
              {paidChannels.map((channel, index) => (
                <button
                  key={channel.name}
                  onClick={() => togglePaidChannel(index)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    channel.enabled
                      ? "bg-foreground text-background"
                      : "bg-card text-foreground hover:bg-card/80"
                  }`}
                >
                  {channel.name}
                </button>
              ))}
            </div>
          </div>

          {/* Organic channels */}
          <div>
            <label className="mb-3 block text-sm text-foreground">
              Organic channels
            </label>
            <div className="flex flex-wrap gap-2">
              {organicChannels.map((channel, index) => (
                <button
                  key={channel.name}
                  onClick={() => toggleOrganicChannel(index)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    channel.enabled
                      ? "bg-foreground text-background"
                      : "bg-card text-foreground hover:bg-card/80"
                  }`}
                >
                  {channel.name}
                </button>
              ))}
            </div>
          </div>

          {/* Other */}
          <div>
            <label className="mb-3 block text-sm text-foreground">
              Other
            </label>
            <div className="flex flex-wrap gap-2">
              {otherChannels.map((channel, index) => (
                <button
                  key={channel.name}
                  onClick={() => toggleOtherChannel(index)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    channel.enabled
                      ? "bg-foreground text-background"
                      : "bg-card text-foreground hover:bg-card/80"
                  }`}
                >
                  {channel.name}
                </button>
              ))}
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
