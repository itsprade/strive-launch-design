"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/** Strive wordless mark (three-path ribbon) from design SVG. */
export function StriveLogoMark({ className }: { className?: string }) {
  const rawId = useId().replace(/:/g, "");
  const g0 = `strive-mark-g0-${rawId}`;
  const g1 = `strive-mark-g1-${rawId}`;
  const g2 = `strive-mark-g2-${rawId}`;

  return (
    <svg
      width={52}
      height={55}
      viewBox="0 0 52 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        d="M24.0391 39.7544C24.0391 26.5063 35.2799 16.9504 47.6629 15.2313C48.252 15.1495 48.8017 15.5276 48.9595 16.1011L51.3983 24.9636C51.5796 25.6225 51.182 26.2988 50.5323 26.5108C44.6215 28.4397 37.4275 33.936 37.4275 39.7544C37.4275 42.0504 38.1089 44.1756 39.2851 45.9532C39.6838 46.5558 39.5768 47.3882 38.98 47.7956L30.1169 53.8457C29.6024 54.1968 28.9029 54.1047 28.5192 53.6141C25.372 49.5896 24.0391 45.4278 24.0391 39.7544Z"
        fill={`url(#${g0})`}
      />
      <path
        d="M14.3013 15.4151C14.3013 12.8172 13.4274 10.4319 11.948 8.52502C11.4732 7.91289 11.5599 6.99921 12.2074 6.57379L22.2127 0C23.4844 1.25475 22.7615 0.518533 23.7385 2.02658C26.2356 5.88071 27.6898 10.4812 27.6898 15.4151C27.6898 28.613 16.534 37.4829 4.48406 40.784C3.85203 40.9571 3.20619 40.5786 3.0283 39.9479L0.374903 30.5404C0.175946 29.835 0.641255 29.1166 1.34883 28.9256C7.2302 27.3374 14.3013 21.1836 14.3013 15.4151Z"
        fill={`url(#${g1})`}
      />
      <path
        d="M47.4563 15.1773L1.18274 29.0594C0.532308 29.2545 0.167353 29.9442 0.371842 30.5917L3.28612 39.8203C3.48806 40.4597 4.16922 40.8154 4.80937 40.6156L50.3341 26.4072C50.9469 26.216 51.3059 25.5815 51.1541 24.9577L48.9887 16.0555C48.8238 15.3778 48.1244 14.9769 47.4563 15.1773Z"
        fill={`url(#${g2})`}
      />
      <defs>
        <linearGradient
          id={g0}
          x1="35.9061"
          y1="50.812"
          x2="43.2364"
          y2="32.843"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F7BB5C" />
          <stop offset="0.494547" stopColor="#F56B10" />
          <stop offset="1" stopColor="#B34086" />
        </linearGradient>
        <linearGradient
          id={g1}
          x1="13.6928"
          y1="-1.21714"
          x2="4.04312"
          y2="25.2022"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F7BB5C" />
          <stop offset="0.494547" stopColor="#F56B10" />
          <stop offset="1" stopColor="#9E1468" stopOpacity={0.76} />
        </linearGradient>
        <linearGradient
          id={g2}
          x1="51.424"
          y1="20.3891"
          x2="3.04284"
          y2="34.6904"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F7BB5C" />
          <stop offset="0.494547" stopColor="#F56B10" />
          <stop offset="1" stopColor="#AA2175" />
        </linearGradient>
      </defs>
    </svg>
  );
}
