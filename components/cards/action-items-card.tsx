// ✅ Reusable Component: ActionItemsCard for displaying checklist of action items
import { motion } from "framer-motion";
import { useState } from "react";

interface ActionItem {
  id: string;
  text: string;
  completed?: boolean;
}

interface ActionItemsCardProps {
  title?: string;
  items: ActionItem[];
  onToggle?: (id: string) => void;
}

export function ActionItemsCard({
  title = "Action items",
  items,
  onToggle
}: ActionItemsCardProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(
    new Set(items.filter(item => item.completed).map(item => item.id))
  );

  const handleToggle = (id: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    onToggle?.(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full overflow-hidden rounded-2xl border border-border bg-card"
    >
      {/* Title */}
      <div className="px-8 py-7">
        <h3 className="text-[34px] leading-[42px] text-foreground">
          {title}
        </h3>
      </div>

      {/* Action Items List */}
      <div className="flex flex-col gap-3 px-5 pb-7">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <button
              onClick={() => handleToggle(item.id)}
              className="h-4 w-4 shrink-0 rounded border border-border transition-colors hover:border-foreground/40"
            >
              {checkedItems.has(item.id) && (
                <svg viewBox="0 0 16 16" fill="none" className="h-full w-full">
                  <path
                    d="M3 8L6.5 11.5L13 4.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <p className="flex-1 text-sm leading-5 text-foreground">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
