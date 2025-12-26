"use client";

import { motion, MotionProps } from "framer-motion";
import { ReactNode } from "react";
import { fadeInUp } from "@/lib/animations";

interface AnimatedDivProps {
  children: ReactNode;
  animation?: MotionProps["variants"];
  delay?: number;
  className?: string;
}

export function AnimatedDiv({
  children,
  animation = fadeInUp,
  delay = 0,
  className,
}: AnimatedDivProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animation}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
