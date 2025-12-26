"use client";

import { motion, MotionProps } from "framer-motion";
import { HTMLAttributes } from "react";
import { fadeInUp } from "@/lib/animations";

interface AnimatedDivProps extends HTMLAttributes<HTMLDivElement> {
  animation?: MotionProps["variants"];
  delay?: number;
}

export function AnimatedDiv({
  children,
  animation = fadeInUp,
  delay = 0,
  className,
  ...props
}: AnimatedDivProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animation}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
