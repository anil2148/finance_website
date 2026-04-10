'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { BubbleResponse } from '@/lib/money-copilot/types';

const CONFIDENCE_COLOR: Record<string, string> = {
  HIGH: 'text-emerald-600 dark:text-emerald-400',
  MEDIUM: 'text-amber-600 dark:text-amber-400',
  LOW: 'text-rose-600 dark:text-rose-400'
};

const DEFAULT_SUGGESTIONS = [
  'Job decision',
  'Debt vs savings',
  'Home affordability',
  'Retirement check'
];

function getPageSuggestions(path: string): string[] {
  const p = path.toLowerCase();
  if (p.includes('mortgage') || p.includes('home') || p.includes('real-estate')) {
    return ['Home affordability', 'Rent vs Buy', 'How much house can I afford?'];
  }
  if (p.includes('debt') || p.includes('loan') || p.includes('credit')) {
    return ['Debt vs savings', 'Which debt first?', 'Is this loan risky?'];
  }
  if (p.includes('retirement') || p.includes('401k') || p.includes('roth')) {
    return ['Retirement check', 'Roth vs Traditional?', 'Am I on track?'];
  }
  if (p.includes('savings') || p.includes('invest')) {
    return ['Debt vs savings', 'Save vs invest', 'Am I saving enough?'];
  }
  return DEFAULT_SUGGESTIONS;
}

function QuickResultCard({ r }: { r: BubbleResponse }) {
  return (
    <div className="space-y-3 text-sm">
      <p className="font-semibold leading-snug text-slate-900 dark:text-slate-100">{r.summary}</p>
      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{r.quickTake}</p>

      {r.keyPoints.length > 0 && (
        <ul className="space-y-1">
          {r.keyPoints.map((n, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="mt-0.5 shrink-0 text-blue-400">•</span>
              {n}
            </li>
          ))}
        </ul>
      )}

      {r.riskFlags.length > 0 && (
        <ul className="space-y-1">
          {r.riskFlags.map((f, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-rose-600 dark:text-rose-400">
              <span className="mt-0.5 shrink-0">⚠</span>
              {f}
            </li>
          ))}
        </ul>
      )}

      <div className="rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-950/30">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Next step</p>
        <p className="mt-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">{r.nextStep}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold ${CONFIDENCE_COLOR[r.confidence] ?? CONFIDENCE_COLOR.LOW}`}>
          {r.confidence} confidence
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">{r.disclaimer}</span>
      </div>
    </div>
  );
}

export function CopilotBubble() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<BubbleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const suggestions = getPageSuggestions(pathname);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = useCallback(async (text: string) => {
    const q = text.trim();
    if (!q || isLoading) return;

    setQuestion(q);
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/money-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          responseMode: 'quick'
        })
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const data: BubbleResponse = await res.json();
      setResult(data);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        void handleSubmit(question);
      }
    },
    [question, handleSubmit]
  );

  const handleReset = useCallback(() => {
    setResult(null);
    setQuestion('');
    setError('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Hide bubble entirely on the full copilot page (after all hooks)
  if (pathname === '/ai-money-copilot') return null;

  return (
    <>
      {/* Floating pill button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close Copilot' : 'Open AI Copilot'}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg ring-2 ring-blue-400/30 transition hover:bg-blue-700 focus:outline-none focus-visible:ring-4 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Copilot
      </button>

      {/* Compact panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="AI Money Copilot"
          className="fixed bottom-20 right-5 z-50 w-[min(360px,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 dark:border-slate-700">
            <div>
              <p className="text-sm font-bold text-white">AI Money Copilot</p>
              <p className="text-[10px] text-blue-100">Quick decision helper · not financial advice</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/ai-money-copilot"
                className="rounded-md bg-white/15 px-2 py-1 text-[10px] font-semibold text-white hover:bg-white/25 transition"
              >
                Deep analysis →
              </a>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="rounded-md p-1 text-white/70 hover:text-white transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Result panel */}
            {result && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Your question</p>
                  <button
                    onClick={handleReset}
                    className="text-[10px] text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Ask another
                  </button>
                </div>
                <p className="mb-3 text-xs text-slate-500 dark:text-slate-400 italic">&ldquo;{question}&rdquo;</p>
                <QuickResultCard r={result} />
              </div>
            )}

            {/* Input area — shown when no result yet */}
            {!result && (
              <>
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    Ask a quick financial question
                  </p>
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. Should I pay off debt or invest?"
                      disabled={isLoading}
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                    />
                    <button
                      onClick={() => void handleSubmit(question)}
                      disabled={isLoading || question.trim().length === 0}
                      aria-label="Analyze"
                      className="rounded-xl bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700 disabled:opacity-40 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      {isLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
                </div>

                {/* Suggestion chips */}
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Quick questions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => void handleSubmit(s)}
                        disabled={isLoading}
                        className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                Analyzing your question…
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

