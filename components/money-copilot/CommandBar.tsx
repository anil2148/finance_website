'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCopilot } from '@/components/money-copilot/CopilotProvider';
import { runPipeline } from '@/lib/money-copilot/pipeline';
import type { CopilotResponse, ReasoningHistoryEntry } from '@/lib/money-copilot/types';

/**
 * Top command bar — the only persistent Copilot entry point.
 *
 * Sits just below the Navbar as a slim sticky strip. On submit it calls the
 * existing /api/money-copilot endpoint (quick mode for speed), runs the
 * client-side 4-layer pipeline over the result, then opens the ExecutionPanel.
 */
export function CommandBar() {
  const pathname = usePathname();
  const { state, dispatch } = useCopilot();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep region in sync with the current path
  const isIndiaPath = pathname === '/in' || pathname.startsWith('/in/');
  const pathRegion: 'US' | 'India' = isIndiaPath ? 'India' : 'US';
  useEffect(() => {
    if (pathRegion !== state.region) {
      dispatch({ type: 'SET_REGION', payload: pathRegion });
    }
  }, [pathRegion, state.region, dispatch]);

  const handleSubmit = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || isLoading) return;

      setIsLoading(true);
      setError('');

      try {
        // Step A: call the existing AI endpoint (deep mode for full CopilotResponse)
        const res = await fetch('/api/money-copilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: q,
            responseMode: 'deep',
            region: state.region,
            mode: 'custom',
            inputs: {},
            scenarios: [],
          }),
        });

        if (!res.ok) throw new Error(`Analysis failed (${res.status})`);

        // The deep mode returns SSE — collect the final narrative event
        let copilotResponse: CopilotResponse | null = null;
        const contentType = res.headers.get('content-type') ?? '';

        if (contentType.includes('text/event-stream')) {
          const reader = res.body!.getReader();
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
              if (raw === '[DONE]') break;
              try {
                const ev = JSON.parse(raw) as { type: string; payload?: CopilotResponse };
                if ((ev.type === 'narrative' || ev.type === 'base') && ev.payload) {
                  copilotResponse = ev.payload;
                }
              } catch { /* ignore parse errors */ }
            }
          }
        } else {
          copilotResponse = await res.json() as CopilotResponse;
        }

        if (!copilotResponse) throw new Error('No response received from analysis engine');

        // Step B: run the client-side 4-layer pipeline
        const pipelineResult = runPipeline(
          q,
          copilotResponse,
          state.region,
          state.riskProfile,
          state.sessionId,
          state.history,
        );

        // Step C: record in history
        const historyEntry: ReasoningHistoryEntry = {
          id: pipelineResult.requestId,
          question: q,
          intent: pipelineResult.step1_intent,
          result: pipelineResult,
          timestamp: pipelineResult.timestamp,
        };
        dispatch({ type: 'ADD_HISTORY_ENTRY', payload: historyEntry });

        // Step D: open the execution panel with the result
        dispatch({ type: 'OPEN_PANEL', payload: { question: q, result: pipelineResult } });
        setQuery('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, state, dispatch],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        void handleSubmit(query);
      }
      if (e.key === 'Escape') {
        setQuery('');
        inputRef.current?.blur();
      }
    },
    [query, handleSubmit],
  );

  return (
    <div
      className="sticky top-[57px] z-20 border-b border-slate-200/80 bg-white/95 px-4 py-2 shadow-sm backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/95"
      role="search"
      aria-label="Copilot command bar"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2">
        {/* Brand pill */}
        <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Copilot
        </div>

        {/* Command input */}
        <div className="relative flex flex-1 items-center gap-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            placeholder="Run a financial decision analysis…  e.g. Should I accept this job offer?"
            disabled={isLoading}
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-800"
          />
          {error && (
            <span className="absolute -bottom-5 left-0 text-[10px] text-rose-600 dark:text-rose-400">{error}</span>
          )}
        </div>

        {/* Execute button */}
        <button
          onClick={() => void handleSubmit(query)}
          disabled={isLoading || query.trim().length === 0}
          aria-label="Execute analysis"
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isLoading ? (
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
          {isLoading ? 'Analyzing…' : 'Execute'}
        </button>

        {/* History count + open panel shortcut */}
        {state.history.length > 0 && !state.isExecutionPanelOpen && (
          <button
            onClick={() => {
              const last = state.history[0];
              if (last) {
                dispatch({ type: 'OPEN_PANEL', payload: { question: last.question, result: last.result } });
              }
            }}
            className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] font-medium text-slate-500 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
            title="View last result"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {state.history.length}
          </button>
        )}
      </div>
    </div>
  );
}
