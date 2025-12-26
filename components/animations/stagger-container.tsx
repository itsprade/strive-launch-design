"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { staggerContainer } from "@/lib/animations";

interface StaggerContainerProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  delay = 0,
  className,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
