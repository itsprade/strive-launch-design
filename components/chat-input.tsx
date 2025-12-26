// ✅ Reusable Component: Chat input field used across pages

import { SparklesIcon, SendIcon, PlusIcon } from "lucide-react";

interface ChatInputProps {
  onEnter?: () => void;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  className?: string;
}

export function ChatInput({ onEnter, value, onChange, onSubmit, className = "" }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const textarea = e.currentTarget;
      const text = textarea.value;

      if (onSubmit) {
        onSubmit(text);
      } else if (onEnter) {
        onEnter();
      }
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border border-border bg-card ${className}`}>
      <textarea
        placeholder="Ask anything..."
        rows={1}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="min-h-[116px] w-full resize-none border-none bg-transparent px-[17.5px] py-[17.5px] align-top text-base leading-normal text-foreground placeholder:text-muted-foreground focus:outline-none"
        style={{ fieldSizing: 'content' }}
        onKeyDown={handleKeyDown}
      />
      <div className="absolute bottom-[17.5px] left-[17.5px] flex items-center gap-2">
        <button className="flex h-4 w-4 items-center justify-center rounded transition-opacity hover:opacity-70">
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="absolute bottom-[17.5px] right-[17.5px] flex items-center gap-2">
        <button
          onClick={() => {
            if (value && onSubmit) {
              onSubmit(value);
            }
          }}
          className="flex h-4 w-4 items-center justify-center rounded transition-opacity hover:opacity-70"
        >
          <SendIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
