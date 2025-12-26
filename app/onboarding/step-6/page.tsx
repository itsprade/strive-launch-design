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

type DataSource = {
  name: string;
  enabled: boolean;
  logo: React.ReactNode;
};

// 🧪 Dummy Data: SVG Logos
const GoogleLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const MetaLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#0866FF"/>
  </svg>
);

const LinkedInLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"/>
  </svg>
);

export default function OnboardingStep6() {
  const router = useRouter();

  const [channels, setChannels] = useState<DataSource[]>([
    { name: "Google Ads", enabled: false, logo: <GoogleLogo /> },
    { name: "Meta Ads", enabled: false, logo: <MetaLogo /> },
    { name: "LinkedIn Ads", enabled: false, logo: <LinkedInLogo /> },
    { name: "Meta Ads", enabled: false, logo: <MetaLogo /> },
    { name: "Google Ads", enabled: false, logo: <GoogleLogo /> },
    { name: "LinkedIn Ads", enabled: false, logo: <LinkedInLogo /> },
  ]);

  const handleContinue = () => {
    router.push("/");
  };

  const handleBack = () => {
    router.push("/onboarding/step-5");
  };

  const toggleChannel = (index: number) => {
    setChannels(
      channels.map((channel, i) =>
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
          <div className="h-1 w-[40px] rounded-full bg-foreground" />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="font-fraunces text-[40px] font-normal leading-tight text-foreground">
            Connect your data
          </h1>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-foreground/60">
              Connect your tools to unlock real insights. You can also explore with sample data first.
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
          {/* Channels */}
          <div>
            <label className="mb-3 block text-sm text-foreground">
              Channels
            </label>
            <div className="grid grid-cols-3 gap-3">
              {channels.map((channel, index) => (
                <div
                  key={`${channel.name}-${index}`}
                  className={`flex flex-col items-start gap-3 rounded-xl border p-4 transition-colors ${
                    channel.enabled
                      ? "border-foreground/20 bg-foreground text-background"
                      : "border-foreground/10 bg-card text-foreground"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className={channel.enabled ? "[&_path]:fill-white" : ""}>
                      {channel.logo}
                    </div>
                    {/* Toggle Switch */}
                    <button
                      onClick={() => toggleChannel(index)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        channel.enabled ? "bg-white" : "bg-foreground/20"
                      }`}
                    >
                      <div
                        className={`absolute top-1 h-4 w-4 rounded-full transition-all ${
                          channel.enabled
                            ? "right-1 bg-foreground"
                            : "left-1 bg-white"
                        }`}
                      />
                    </button>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{channel.name}</div>
                    <div className="mt-1 flex items-center gap-1">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          channel.enabled ? "bg-green-400" : "bg-foreground/30"
                        }`}
                      />
                      <span className="text-xs opacity-60">
                        {channel.enabled ? "Connected" : "Not connected"}
                      </span>
                    </div>
                  </div>
                </div>
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
