"use client";

import { useState, useEffect } from "react";

const defaultTexts = [
  "Initializing Strive Labs",
  "Loading your campaigns",
  "Fetching analytics data",
  "Analyzing performance",
  "Processing insights",
  "Optimizing recommendations",
  "Preparing your dashboard",
  "Almost ready",
];

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

interface AILoaderProps {
  size?: number;
  texts?: string[];
}

export function PageLoader({ size = 200, texts = defaultTexts }: AILoaderProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % texts.length);
        setIsVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        <style>{blobStyles}</style>

        {/* Blob Animation Container */}
        <div
          className="relative overflow-hidden rounded-full"
          style={{ width: size, height: size, filter: "blur(14px)" }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ filter: "blur(20px)" }}
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

        {/* Brand Name */}
        <h2
          className="font-fraunces mt-8 text-2xl font-medium tracking-tight text-foreground"
          style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
        >
          Strive Labs
        </h2>

        {/* Loading Text */}
        <p
          className="mt-3 text-lg font-medium tracking-wide text-foreground/70 transition-all duration-300"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(8px)",
          }}
        >
          {texts[textIndex]}
        </p>
      </div>
    </div>
  );
}
