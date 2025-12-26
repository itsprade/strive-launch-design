// ✅ Reusable Component: PillCard for displaying clickable suggestion chips
import { motion } from "framer-motion";

interface PillCardProps {
  text: string;
  onClick?: () => void;
}

export function PillCard({ text, onClick }: PillCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="overflow-hidden rounded-xl border border-border bg-card px-3 py-2 transition-colors hover:bg-sidebar-accent"
    >
      <span className="text-sm leading-5 text-foreground">
        {text}
      </span>
    </motion.button>
  );
}
