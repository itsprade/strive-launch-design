"use client";

import { motion } from "framer-motion";
import { HTMLAttributes } from "react";
import { staggerContainer } from "@/lib/animations";

interface StaggerContainerProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number;
}

export function StaggerContainer({
  children,
  delay = 0,
  className,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
