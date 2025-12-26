"use client";

import { motion } from "framer-motion";
import { SparklesIcon, ArrowLeft } from "lucide-react";
import { ChatInput } from "@/components/chat-input";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SummaryCard } from "@/components/cards/summary-card";
import { ActionItemsCard } from "@/components/cards/action-items-card";
import { PillCard } from "@/components/cards/pill-card";

export default function ChatPage() {
  const router = useRouter();

  // 🧪 Dummy Data: AI responses pool
  const aiResponses = [
    "Joining an early-stage startup as a founding designer isn't just about crafting beautiful interfaces—it's about shaping the product, the business, and the vision from the ground up. Unlike in a well-established company, where design operates within structured teams and processes, early-stage startups demand speed, adaptability, and deep strategic thinking. The lines between product, design, engineering, and even business blur, and that's where a founding designer thrives.",
    "Great question! In the world of product design, understanding user needs is paramount. It's about creating experiences that not only look good but solve real problems. Every design decision should be backed by research, testing, and iteration. Remember, design is never truly finished—it evolves with your users.",
    "From a marketing perspective, consistency is key. Your brand identity should be cohesive across all touchpoints—from your website to social media, email campaigns, and beyond. Think about your color palette, typography, and tone of voice. These elements work together to create a memorable brand experience that resonates with your audience.",
  ];

  interface Message {
    id: string;
    text?: string;
    sender: 'user' | 'ai';
    type?: 'text' | 'summary' | 'actions' | 'pills';
    data?: any;
  }

  // 🧪 Dummy Data: Sample card data
  const sampleSummaryData = {
    tags: ["Search Rank Lost Impression Share", "Other"],
    headline: "Significant Drop in Clicks, Impressions, and Engagement Amid Rising Competition",
    description: "Clicks dropped critically by -70.68% to 92, with impressions also decreasing by -71.65%. Cost reduced by -62.75%, reflecting lower ad activity. CTR remained stable at 1.91%, with minimal change.",
    metricsGrid: [
      [
        { value: "94.44%", change: "-4", changeType: "negative" as const, label: "Search Impression Share" },
        { value: "18", change: "+2", changeType: "positive" as const, label: "Impressions" },
        { value: "27.78%", change: "-4", changeType: "negative" as const, label: "Click-Through Rate" }
      ],
      [
        { value: "18", change: "-52", changeType: "negative" as const, label: "Impressions" },
        { value: "27.78%", change: "-23", changeType: "negative" as const, label: "Click-Through Rate" },
        { value: "94.44%", change: "-4", changeType: "negative" as const, label: "Search Impression Share" }
      ]
    ],
    secondaryMetrics: [
      { value: "94.44%", change: "-4.30%", changeType: "negative" as const, label: "Search Impression Share" },
      { value: "18", change: "-52%", changeType: "negative" as const, label: "Impressions" },
      { value: "27.78%", change: "-23.93%", changeType: "negative" as const, label: "Click-Through Rate" }
    ],
    secondaryDescription: "Search impression share declined by 4.30% to 94.44%, with clicks dropping 62.81% and impressions down 52.35%. CTR also fell by 23.93% to 27.78%. These trends indicate potential issues with keyword targeting or competition."
  };

  const sampleActionItems = {
    title: "Action items",
    items: [
      { id: "1", text: "Investigate the 47.29% drop in Search Impression Share to identify competitive or targeting issues." },
      { id: "2", text: "Address the 78.77% decline in Search Absolute Top Impression Share by optimizing bids or targeting." },
      { id: "3", text: "Reassess campaign strategy to recover engagement and visibility." },
      { id: "4", text: "Evaluate the 100.00% cost reduction to ensure alignment with campaign objectives." }
    ]
  };

  const samplePills = [
    "Investigate the 47.29% drop",
    "Search_Competitor_DoubleO_EU",
    "Reviewing Procurement 2"
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "The Founding Designer's Mindset",
      sender: 'user',
      type: 'text'
    },
    {
      id: '2',
      text: aiResponses[0],
      sender: 'ai',
      type: 'text'
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [currentTypingText, setCurrentTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiThinking]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      type: 'text'
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Show thinking indicator
    setIsAiThinking(true);

    // Simulate AI thinking delay (1 second)
    setTimeout(() => {
      setIsAiThinking(false);

      // Randomly decide response type: text, summary, actions, or pills
      const responseTypes = ['text', 'summary', 'actions', 'pills'] as const;
      const randomType = responseTypes[Math.floor(Math.random() * responseTypes.length)];

      if (randomType === 'text') {
        // Text response with typing animation
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          sender: 'ai',
          type: 'text'
        };
        setMessages(prev => [...prev, aiMessage]);

        // Start typing animation
        setIsTyping(true);
        setCurrentTypingText("");

        let currentIndex = 0;
        const totalChars = randomResponse.length;
        const typingSpeed = 2000 / totalChars;

        const typingInterval = setInterval(() => {
          if (currentIndex <= totalChars) {
            setCurrentTypingText(randomResponse.slice(0, currentIndex));
            currentIndex++;
          } else {
            setIsTyping(false);
            clearInterval(typingInterval);
          }
        }, typingSpeed);
      } else if (randomType === 'summary') {
        // Summary card response
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          type: 'summary',
          data: sampleSummaryData
        };
        setMessages(prev => [...prev, aiMessage]);
      } else if (randomType === 'actions') {
        // Action items card response
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          type: 'actions',
          data: sampleActionItems
        };
        setMessages(prev => [...prev, aiMessage]);
      } else if (randomType === 'pills') {
        // Pills response
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          type: 'pills',
          data: { pills: samplePills }
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    }, 1000);
  };

  return (
    <motion.div
      className="flex min-h-screen w-full bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 🔽 Sidebar Navigation */}
      <aside className="fixed left-0 top-0 flex h-screen w-16 flex-col items-center justify-center bg-background">
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => router.push("/")}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent transition-colors hover:bg-sidebar-accent/80"
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path d="M2 6.5L8 2L14 6.5V13.5C14 14.0523 13.5523 14.5 13 14.5H3C2.44772 14.5 2 14.0523 2 13.5V6.5Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-sidebar-accent">
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <circle cx="5.5" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="10.5" cy="10.5" r="3" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-sidebar-accent">
            <SparklesIcon className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-sidebar-accent">
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 5V8L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </nav>
      </aside>

      {/* 🔽 Breadcrumb - Fixed at top left */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed left-[80px] top-5 z-10 flex items-center gap-1 text-sm text-foreground/50"
      >
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
        <span className="opacity-30">/</span>
        <span className="max-w-[287px] overflow-hidden text-ellipsis opacity-60">
          {messages[0]?.text || "Chat"}
        </span>
      </motion.div>

      {/* 🔽 Main Content */}
      <main className="ml-16 flex w-full flex-col items-center">
        <div className="w-full max-w-[800px] px-8">

          {/* 🔽 Chat Messages */}
          <div className="flex flex-col gap-6 pb-40 pt-12">
            {messages.map((message, index) => (
              <div key={message.id}>
                {message.sender === 'user' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="ml-auto max-w-[460px]"
                  >
                    <div className="rounded-xl bg-sidebar-accent px-4 py-3">
                      <p className="text-sm leading-6 tracking-[-0.28px] text-foreground">
                        {message.text}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="max-w-[700px]">
                    {message.type === 'text' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <p className="text-sm leading-6 tracking-[-0.28px] text-foreground">
                          {index === messages.length - 1 && isTyping
                            ? currentTypingText
                            : message.text}
                          {index === messages.length - 1 && isTyping && (
                            <span className="inline-block h-4 w-[2px] animate-pulse bg-foreground" />
                          )}
                        </p>
                      </motion.div>
                    )}

                    {message.type === 'summary' && message.data && (
                      <SummaryCard
                        tags={message.data.tags}
                        headline={message.data.headline}
                        description={message.data.description}
                        metricsGrid={message.data.metricsGrid}
                        secondaryMetrics={message.data.secondaryMetrics}
                        secondaryDescription={message.data.secondaryDescription}
                      />
                    )}

                    {message.type === 'actions' && message.data && (
                      <ActionItemsCard
                        title={message.data.title}
                        items={message.data.items}
                      />
                    )}

                    {message.type === 'pills' && message.data && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-wrap gap-4"
                      >
                        {message.data.pills.map((pill: string, pillIndex: number) => (
                          <PillCard
                            key={pillIndex}
                            text={pill}
                            onClick={() => console.log(`Clicked: ${pill}`)}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Thinking Indicator */}
            {isAiThinking && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 text-sm text-foreground/50"
              >
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/30" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/30" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/30" style={{ animationDelay: '300ms' }} />
                </div>
                <span>Strive Labs AI is thinking...</span>
              </motion.div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* 🔽 Input Area - Fixed at bottom */}
          <div className="fixed bottom-5 left-[calc(50%-400px+32px)] w-[800px]">
            {/* Shadow effect behind input */}
            <div className="absolute bottom-[25px] left-0 h-[31px] w-full rounded-[10px] bg-black/[0.04] blur-[1px]" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleSendMessage}
              />
            </motion.div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
