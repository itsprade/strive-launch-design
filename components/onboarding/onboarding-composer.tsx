"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Paperclip, SendHorizonal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OnboardingComposerSendPayload {
  text: string;
  files: File[];
}

interface OnboardingComposerProps {
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onSend: (payload: OnboardingComposerSendPayload) => void;
}

/** Minimal surface for Web Speech API (DOM typings vary by TS version). */
type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((ev: SpeechRecognitionResultEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type SpeechRecognitionResultEvent = {
  results: ArrayLike<{ 0?: { transcript?: string } }>;
};

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function OnboardingComposer({
  placeholder = "Message…",
  disabled = false,
  className,
  onSend,
}: OnboardingComposerProps) {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [listening, setListening] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const recRef = useRef<SpeechRecognitionInstance | null>(null);

  const speechSupported =
    typeof window !== "undefined" && !!getSpeechRecognitionCtor();

  useEffect(() => {
    return () => {
      recRef.current?.stop();
      recRef.current = null;
    };
  }, []);

  const addFiles = useCallback((list: FileList | File[]) => {
    const next = Array.from(list);
    setFiles((prev) => [...prev, ...next]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const flushSend = useCallback(() => {
    const t = value.trim();
    if (!t && files.length === 0) return;
    onSend({ text: t, files: [...files] });
    setValue("");
    setFiles([]);
  }, [value, files, onSend]);

  const toggleMic = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    if (listening) {
      recRef.current?.stop();
      recRef.current = null;
      setListening(false);
      return;
    }

    const r = new Ctor();
    r.lang = "en-US";
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (ev) => {
      const said = ev.results[0]?.[0]?.transcript?.trim();
      if (said) {
        setValue((v) => (v ? `${v} ${said}` : said));
      }
    };
    r.onend = () => {
      setListening(false);
      recRef.current = null;
    };
    r.onerror = () => {
      setListening(false);
      recRef.current = null;
    };
    recRef.current = r;
    setListening(true);
    try {
      r.start();
    } catch {
      setListening(false);
      recRef.current = null;
    }
  }, [listening]);

  return (
    <div className={cn("min-w-0 space-y-2", className)}>
      {files.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {files.map((f, i) => (
            <span
              key={`${f.name}-${i}`}
              className="inline-flex max-w-[200px] items-center gap-1 rounded-full bg-[#F2F2F4] px-2 py-0.5 text-xs text-foreground dark:bg-muted/80"
            >
              <span className="truncate">{f.name}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                aria-label={`Remove ${f.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <div
        className={cn(
          "relative flex min-h-[52px] min-w-0 items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:bg-card",
          disabled && "pointer-events-none opacity-60",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Attach files"
        >
          <Paperclip className="h-[18px] w-[18px]" />
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="min-w-0 flex-1 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              flushSend();
            }
          }}
        />
        <button
          type="button"
          onClick={toggleMic}
          disabled={!speechSupported || disabled}
          title={
            speechSupported
              ? listening
                ? "Stop listening"
                : "Speak to add text"
              : "Voice input not supported in this browser"
          }
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
            listening
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
            !speechSupported && "cursor-not-allowed opacity-40 hover:bg-transparent",
          )}
          aria-label="Voice input"
        >
          <Mic className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          onClick={flushSend}
          disabled={disabled || (!value.trim() && files.length === 0)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background transition-opacity hover:opacity-90 disabled:opacity-30"
          aria-label="Send"
        >
          <SendHorizonal className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}
