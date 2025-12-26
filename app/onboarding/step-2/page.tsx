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

export default function OnboardingStep2() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "Strivelabs",
    website: "https://strivelabs.ai",
    industry: "SaaS",
    companySize: "1 - 50"
  });

  const handleContinue = () => {
    router.push("/onboarding/step-3");
  };

  const handleBack = () => {
    router.push("/onboarding");
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
          <div className="h-1 w-[40px] rounded-full bg-foreground/20" />
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
            Tell us about your company
          </h1>
          <p className="mt-2 text-base text-foreground/60">
            This helps us understand your market, competitors, and benchmarks.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {/* Company Name */}
          <div>
            <label className="mb-2 block text-sm text-foreground">
              Company name
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground transition-colors focus:border-foreground/40 focus:outline-none"
              placeholder="Strivelabs"
            />
          </div>

          {/* Website */}
          <div>
            <label className="mb-2 block text-sm text-foreground">
              Company name
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground transition-colors focus:border-foreground/40 focus:outline-none"
              placeholder="https://strivelabs.ai"
            />
          </div>

          {/* Industry & Company Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm text-foreground">
                Industry
              </label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full appearance-none rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground transition-colors focus:border-foreground/40 focus:outline-none"
              >
                <option>SaaS</option>
                <option>E-commerce</option>
                <option>Healthcare</option>
                <option>Finance</option>
                <option>Education</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-foreground">
                Company Size
              </label>
              <select
                value={formData.companySize}
                onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                className="w-full appearance-none rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground transition-colors focus:border-foreground/40 focus:outline-none"
              >
                <option>1 - 50</option>
                <option>51 - 200</option>
                <option>201 - 500</option>
                <option>501 - 1000</option>
                <option>1000+</option>
              </select>
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
