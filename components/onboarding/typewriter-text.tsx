"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_CPS = 42;

interface TypewriterTextProps {
  text: string;
  start: boolean;
  className?: string;
  cps?: number;
  showCaret?: boolean;
  onComplete?: () => void;
  /** Called after each revealed character (e.g. keep a chat scroll pinned to the bottom). */
  onUpdate?: () => void;
}

export function TypewriterText({
  text,
  start,
  className = "",
  cps = DEFAULT_CPS,
  showCaret = true,
  onComplete,
  onUpdate,
}: TypewriterTextProps) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    if (!start || !text) {
      setDisplay("");
      setDone(false);
      return;
    }

    setDisplay("");
    setDone(false);
    const ms = Math.max(8, 1000 / cps);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      const next = text.slice(0, i);
      setDisplay(next);
      onUpdateRef.current?.();
      if (i >= text.length) {
        window.clearInterval(id);
        setDone(true);
        onCompleteRef.current?.();
      }
    }, ms);

    return () => window.clearInterval(id);
  }, [text, start, cps]);

  if (!start && !display) return null;

  return (
    <span className={className}>
      {display}
      {showCaret && start && !done ? (
        <span className="ml-0.5 inline-block h-[1em] w-px animate-pulse bg-current align-[-2px]" />
      ) : null}
    </span>
  );
}
