"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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

export default function OnboardingWelcome() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <style>{blobStyles}</style>

      {/* Gradient Blob Background - Bottom */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute bottom-[-40%] left-1/2 -translate-x-1/2"
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

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-fraunces text-[56px] font-normal leading-tight text-foreground"
          style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
        >
          Welcome to Strive
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 text-xl text-foreground/60"
        >
          Strive is your AI-powered marketing intelligence system.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 max-w-[600px] text-base leading-relaxed text-foreground"
        >
          In the next few steps, we'll understand your business so we can
          <br />
          surface insights that actually matter to you.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          onClick={() => router.push("/onboarding/step-2")}
          className="mt-12 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          Get started
        </motion.button>
      </div>

      {/* Strive AI Badge - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="fixed bottom-8 right-8 z-20"
      >
        <div className="flex items-center gap-2 rounded-full bg-[#ff4d4f] px-4 py-2 shadow-lg">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-white"
          >
            <path
              d="M2 8L8 2L14 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm font-medium text-white">Strive AI</span>
        </div>
      </motion.div>
    </div>
  );
}
