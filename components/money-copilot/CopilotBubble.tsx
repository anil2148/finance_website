'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { BubbleResponse } from '@/lib/money-copilot/types';

interface BubbleMessage {
  role: 'user' | 'assistant';
  text: string;
  response?: BubbleResponse;
}

const CONFIDENCE_COLOR: Record<string, string> = {
  HIGH: 'text-emerald-600 dark:text-emerald-400',
  MEDIUM: 'text-amber-600 dark:text-amber-400',
  LOW: 'text-rose-600 dark:text-rose-400'
};

function BubbleResultCard({ r }: { r: BubbleResponse }) {
  return (
    <div className="space-y-2 text-sm">
      <p className="font-semibold text-slate-900 dark:text-slate-100">{r.summary}</p>
      <p className="text-slate-600 dark:text-slate-400">{r.quickTake}</p>

      {r.keyNumbers.length > 0 && (
        <ul className="mt-1 space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
          {r.keyNumbers.map((n, i) => (
            <li key={i}>📌 {n}</li>
          ))}
        </ul>
      )}

      {r.riskFlags.length > 0 && (
        <ul className="mt-1 space-y-0.5 text-xs text-rose-600 dark:text-rose-400">
          {r.riskFlags.map((f, i) => (
            <li key={i}>⚠️ {f}</li>
          ))}
        </ul>
      )}

      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
        Next step: <span className="text-blue-600 dark:text-blue-400">{r.nextStep}</span>
      </p>

      <p className={`text-xs font-semibold ${CONFIDENCE_COLOR[r.confidence] ?? CONFIDENCE_COLOR.LOW}`}>
        Confidence: {r.confidence}
      </p>

      <p className="text-[10px] text-slate-400 dark:text-slate-500">{r.disclaimer}</p>
    </div>
  );
}

export function CopilotBubble() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<BubbleMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Derive page-aware default suggestions without an API call.
  useEffect(() => {
    const p = pathname.toLowerCase();
    if (p.includes('mortgage') || p.includes('home') || p.includes('real-estate') || p.includes('housing')) {
      setSuggestions(['Should I buy or rent?', 'Can I afford this home?', 'How much house can I afford?']);
    } else if (p.includes('debt') || p.includes('loan') || p.includes('credit')) {
      setSuggestions(['Should I pay off debt or invest?', 'Which debt should I tackle first?', 'Is this loan risky?']);
    } else if (p.includes('savings') || p.includes('saving')) {
      setSuggestions(['Am I saving enough?', 'HYSA vs investing — which is better?', 'How long to reach my savings goal?']);
    } else if (p.includes('retirement') || p.includes('401k') || p.includes('roth') || p.includes('ira')) {
      setSuggestions(['Roth vs Traditional 401(k)?', 'Am I on track to retire?', 'Max 401(k) or IRA first?']);
    } else if (p.includes('budget') || p.includes('cash-flow')) {
      setSuggestions(['What improves cash flow fastest?', 'Where should I cut spending?', 'Can I afford this expense?']);
    } else {
      setSuggestions(['Should I buy or rent?', 'Am I saving enough?', 'What improves cash flow fastest?']);
    }
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSubmit = useCallback(async (text: string) => {
    const q = text.trim();
    if (!q || isLoading) return;

    setQuestion('');
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/money-copilot/bubble', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          pageContext: {
            path: pathname,
            title: typeof document !== 'undefined' ? document.title : '',
            keywords: []
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      const data: BubbleResponse = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', text: data.summary, response: data }]);

      // Update suggestions from AI response if available.
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Something went wrong. Please try again or visit the full AI Money Copilot.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, pathname]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        void handleSubmit(question);
      }
    },
    [question, handleSubmit]
  );

  return (
    <>
      {/* Floating bubble button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close AI Money Copilot' : 'Open AI Money Copilot'}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg ring-2 ring-blue-400/30 transition hover:bg-blue-700 focus:outline-none focus-visible:ring-4 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.803L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="AI Money Copilot"
          className="fixed bottom-24 right-5 z-50 flex w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        >
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-slate-100 bg-blue-600 px-4 py-3 dark:border-slate-700">
            <span className="text-lg">🤖</span>
            <div>
              <p className="text-sm font-semibold text-white">AI Money Copilot</p>
              <p className="text-[10px] text-blue-100">Decision support · not financial advice</p>
            </div>
            <a
              href="/ai-money-copilot"
              className="ml-auto shrink-0 rounded-lg bg-white/10 px-2 py-1 text-[10px] font-semibold text-white hover:bg-white/20"
            >
              Full analysis →
            </a>
          </div>

          {/* Messages */}
          <div className="flex max-h-72 flex-col gap-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ask me a quick financial decision question — I&apos;ll give you a structured take.
                </p>
                <div className="flex flex-col gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => void handleSubmit(s)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'user' ? (
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-blue-600 px-3 py-2 text-sm text-white">
                    {msg.text}
                  </div>
                ) : (
                  <div className="w-full rounded-2xl rounded-tl-sm border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                    {msg.response ? (
                      <BubbleResultCard r={msg.response} />
                    ) : (
                      <p className="text-sm text-slate-600 dark:text-slate-400">{msg.text}</p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                Analyzing…
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-100 p-3 dark:border-slate-700">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a financial question…"
                rows={2}
                disabled={isLoading}
                className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
              />
              <button
                onClick={() => void handleSubmit(question)}
                disabled={isLoading || question.trim().length === 0}
                aria-label="Send"
                className="self-end rounded-xl bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700 disabled:opacity-40 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="mt-1.5 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                Clear chat
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
