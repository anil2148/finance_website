'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import type { CopilotResponse } from '@/lib/money-copilot/types';

type StreamState = 'idle' | 'loading' | 'streaming' | 'done' | 'error';

const shimmerLineClass =
  'h-3 rounded bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-pulse dark:from-slate-700 dark:via-slate-600 dark:to-slate-700';

function normalizeRiskScore(result: CopilotResponse | null): number {
  if (typeof result?.decisionEngine?.riskScore === 'number') {
    return Math.max(0, Math.min(100, Math.round(result.decisionEngine.riskScore)));
  }
  if (result?.confidenceLevel === 'low') return 72;
  if (result?.confidenceLevel === 'medium') return 45;
  return 24;
}

export function HeroDecisionRunner({
  className,
  inputClassName,
  buttonClassName,
  cardClassName,
  id = 'hero-question'
}: {
  className?: string;
  inputClassName: string;
  buttonClassName: string;
  cardClassName?: string;
  id?: string;
}) {
  const [question, setQuestion] = useState('');
  const [streamState, setStreamState] = useState<StreamState>('idle');
  const [result, setResult] = useState<CopilotResponse | null>(null);
  const [streamingText, setStreamingText] = useState('');

  const riskScore = useMemo(() => normalizeRiskScore(result), [result]);
  const nextSteps = useMemo(() => {
    const raw = result?.nextSteps ?? [];
    if (raw.length >= 3) return raw.slice(0, 3);
    return [...raw, 'Stress-test a downside case.', 'Set a monthly guardrail.', 'Re-run with your exact numbers.'].slice(0, 3);
  }, [result]);

  const recommendationLine = streamingText.trim() || result?.recommendation || 'Analyzing your decision...';

  const runDecision = async () => {
    const prompt = question.trim();
    if (!prompt) return;

    setStreamState('loading');
    setResult(null);
    setStreamingText('');

    try {
      const region = window.location.pathname.startsWith('/in') ? 'India' : 'US';
      const response = await fetch('/api/money-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: prompt, context: '', scenarios: [], region }),
        signal: AbortSignal.timeout(60_000)
      });
      if (!response.ok) throw new Error('Request failed');

      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('text/event-stream')) {
        setResult((await response.json()) as CopilotResponse);
        setStreamState('done');
        return;
      }

      setStreamState('streaming');
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No stream');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') continue;

          try {
            const event = JSON.parse(raw) as { type: 'base' | 'chunk' | 'narrative' | 'error'; payload?: CopilotResponse; content?: string; message?: string };
            if (event.type === 'base' && event.payload) setResult(event.payload);
            if (event.type === 'chunk' && event.content) setStreamingText((prev) => prev + event.content);
            if (event.type === 'narrative' && event.payload) {
              setResult(event.payload);
              setStreamingText('');
            }
            if (event.type === 'error') throw new Error(event.message ?? 'Streaming error');
          } catch {
            // ignore malformed event line
          }
        }
      }

      setStreamState('done');
    } catch {
      setStreamState('error');
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await runDecision();
  };

  return (
    <div className={className}>
      <form onSubmit={onSubmit} aria-label="AI copilot question input">
        <label htmlFor={id} className="sr-only">Ask your financial question</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={id}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            className={inputClassName}
            placeholder="Ask your financial question"
          />
          <button type="submit" className={buttonClassName} disabled={streamState === 'loading' || streamState === 'streaming'}>
            Run decision
          </button>
        </div>
      </form>

      {(streamState === 'loading' || streamState === 'streaming' || streamState === 'done' || streamState === 'error') && (
        <div className={`mt-4 rounded-xl border p-4 ${cardClassName ?? 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/70'}`} aria-live="polite">
          {streamState === 'loading' && (
            <div className="space-y-2">
              <div className={shimmerLineClass} style={{ animationDuration: '200ms' }} />
              <div className={`${shimmerLineClass} w-11/12`} style={{ animationDuration: '200ms' }} />
              <div className={`${shimmerLineClass} w-2/3`} style={{ animationDuration: '200ms' }} />
            </div>
          )}

          {streamState === 'error' && (
            <>
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">Something went wrong — try again</p>
              <button type="button" onClick={runDecision} className="mt-3 rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/40">
                Retry
              </button>
            </>
          )}

          {(streamState === 'streaming' || streamState === 'done') && (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommendation</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{recommendationLine}</p>
              <div className="mt-3 inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:border-blue-700/60 dark:bg-blue-950/30 dark:text-blue-300">
                Risk score: {riskScore}/100
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">3 things to do next</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700 dark:text-slate-300">
                {nextSteps.map((step, index) => (
                  <li key={`${index}-${step}`}>{step}</li>
                ))}
              </ul>
              {streamState === 'done' && (
                <Link href={`/ai-money-copilot?q=${encodeURIComponent(question.trim())}`} className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">
                  Refine with your numbers →
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
