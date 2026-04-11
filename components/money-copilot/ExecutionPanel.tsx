'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCopilot } from '@/components/money-copilot/CopilotProvider';
import { runPipeline } from '@/lib/money-copilot/pipeline';
import type { CopilotResponse, ExecutionAction, IntentClassification, PipelineResult, ReasoningHistoryEntry } from '@/lib/money-copilot/types';
import { CONFIDENCE_THRESHOLD_MID } from '@/lib/money-copilot/pipeline';

/** Returns true when the intent is ambiguous or confidence is too low to proceed. */
function needsClarificationState(intent: IntentClassification): boolean {
  return (
    intent.type === 'ambiguous-offer' ||
    intent.needsClarification === true ||
    intent.confidence < CONFIDENCE_THRESHOLD_MID
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RISK_COLOR: Record<string, string> = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-700/40',
  medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-700/40',
  high: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-700/40',
};

const SEVERITY_ICON: Record<string, string> = {
  low: '🟢',
  medium: '🟡',
  high: '🔴',
};

const ACTION_ICON: Record<string, string> = {
  rebalance: '⚖️',
  simulate: '📊',
  report: '📄',
  hedge: '🛡️',
};

/** Maps intent type to a short consumer-readable label. */
const INTENT_TYPE_LABEL: Record<string, string> = {
  'job-offer': 'Job offer',
  'relocation': 'Relocation',
  'debt-payoff': 'Debt payoff',
  'roth-vs-traditional': 'Retirement',
  'emergency-fund': 'Emergency fund',
  'home-affordability': 'Home buying',
  'budget-stress-test': 'Budget',
  'ambiguous-offer': 'Offer',
  'custom': 'Decision',
};

// ─── Decision category cards ──────────────────────────────────────────────────

const DECISION_CARDS = [
  {
    key: 'job',
    label: 'Job offer',
    emoji: '💼',
    description: 'Compare offers or evaluate a raise',
    question: 'I have a job offer — should I take it?',
  },
  {
    key: 'home',
    label: 'Buying a home',
    emoji: '🏠',
    description: 'Estimate what you can afford',
    question: 'Can I afford to buy a home right now?',
  },
  {
    key: 'credit',
    label: 'Credit card',
    emoji: '💳',
    description: 'Find the right card for your spending',
    question: 'Which credit card is right for my spending?',
  },
  {
    key: 'debt',
    label: 'Debt payoff',
    emoji: '📉',
    description: 'Find the fastest way out of debt',
    question: 'What is the fastest way to pay off my debt?',
  },
  {
    key: 'invest',
    label: 'Investing',
    emoji: '📈',
    description: 'Plan your investment strategy',
    question: 'How should I start investing my money?',
  },
];

// ─── Consumer-friendly result sections ────────────────────────────────────────

function RecommendationSection({ result }: { result: PipelineResult }) {
  const { step5_actionPlan: plan, step4_risk: risk, step1_intent: intent } = result;
  const primary = plan.primaryAction;
  const isAmbiguous = needsClarificationState(intent);

  const riskLabel =
    risk.overallScore >= 60 ? 'Higher risk' : risk.overallScore >= 30 ? 'Moderate risk' : 'Lower risk';
  const riskColor =
    risk.overallScore >= 60
      ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-700/40'
      : risk.overallScore >= 30
      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-700/40'
      : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-700/40';

  return (
    <section>
      {isAmbiguous && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-700/40 dark:bg-amber-950/20 dark:text-amber-400">
          <p className="font-semibold">More detail needed</p>
          {intent.clarificationQuestion && (
            <p className="mt-0.5 opacity-90">{intent.clarificationQuestion}</p>
          )}
        </div>
      )}
      <h3 className="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100">Recommendation</h3>
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-700/60 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{primary.label}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{primary.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${riskColor}`}>{riskLabel}</span>
          {primary.timeframe && (
            <span className="text-xs text-slate-500 dark:text-slate-400">{primary.timeframe}</span>
          )}
          {primary.expectedImpact && (
            <span className="text-xs text-slate-500 dark:text-slate-400 italic">{primary.expectedImpact}</span>
          )}
        </div>
      </div>
    </section>
  );
}

function KeyFindingsSection({ result }: { result: PipelineResult }) {
  const { step3_analysis: analysis } = result;
  if (!analysis.keyFindings.length && !analysis.comparisons.length) return null;
  return (
    <section>
      <h3 className="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100">Key findings</h3>
      {analysis.keyFindings.length > 0 && (
        <ul className="space-y-2">
          {analysis.keyFindings.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
              <span className="mt-0.5 shrink-0 text-blue-500">›</span>
              {f}
            </li>
          ))}
        </ul>
      )}
      {analysis.comparisons.length > 0 && (
        <div className="mt-3 space-y-2">
          {analysis.comparisons.map((c, i) => (
            <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800/50">
              <div className="flex items-center justify-between gap-1 font-medium text-slate-800 dark:text-slate-100">
                <span>{c.optionA}</span>
                <span className="text-slate-400">vs</span>
                <span>{c.optionB}</span>
              </div>
              {c.winner !== 'neutral' && (
                <p className={`mt-1 text-[11px] font-medium ${c.winner === 'A' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {c.winner === 'A' ? c.optionA : c.optionB} looks better — {c.delta}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function RisksSection({ result }: { result: PipelineResult }) {
  const { step4_risk: risk } = result;
  if (!risk.factors.length) return null;
  return (
    <section>
      <h3 className="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100">Risks to watch</h3>
      <div className="space-y-2">
        {risk.factors.map((f, i) => (
          <div key={i} className={`flex items-start gap-2 rounded-lg border p-2 text-xs ${RISK_COLOR[f.severity]}`}>
            <span>{SEVERITY_ICON[f.severity]}</span>
            <div>
              <p className="font-semibold">{f.factor}</p>
              <p className="mt-0.5 opacity-80">{f.detail}</p>
            </div>
          </div>
        ))}
        {risk.mitigations.length > 0 && (
          <div className="pt-1">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">What you can do</p>
            <ul className="space-y-1">
              {risk.mitigations.map((m, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function NextStepsSection({ result }: { result: PipelineResult }) {
  const { step5_actionPlan: plan } = result;
  const secondaryActions = plan.actions.filter((a) => a.type !== plan.primaryAction.type);
  if (!secondaryActions.length && !plan.timeline) return null;
  return (
    <section>
      <h3 className="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100">Next steps</h3>
      {plan.timeline && (
        <div className="mb-3 rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-800/50">
          <span className="font-semibold text-slate-500 dark:text-slate-400">Timeline: </span>
          <span className="text-slate-700 dark:text-slate-300">{plan.timeline}</span>
        </div>
      )}
      {secondaryActions.length > 0 && (
        <div className="space-y-2">
          {secondaryActions.map((action) => (
            <div key={action.type} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/50">
              <div className="flex items-start gap-2">
                <span className="text-base leading-none">{ACTION_ICON[action.type] ?? '📋'}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{action.label}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">{action.description}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${RISK_COLOR[action.riskLevel]}`}>
                      {action.riskLevel} risk
                    </span>
                    <span className="text-[10px] text-slate-400">{action.timeframe}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Inline input form ────────────────────────────────────────────────────────

function PanelInputForm() {
  const pathname = usePathname();
  const { state, dispatch } = useCopilot();
  const [query, setQuery] = useState(state.activeQuestion ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync region from pathname
  const pathRegion: 'US' | 'India' =
    pathname === '/in' || pathname.startsWith('/in/') ? 'India' : 'US';
  useEffect(() => {
    if (pathRegion !== state.region) {
      dispatch({ type: 'SET_REGION', payload: pathRegion });
    }
  }, [pathRegion, state.region, dispatch]);

  // When the panel first opens: sync any prefill question and focus the input.
  // We capture the initial values as refs so the focus effect only runs on mount.
  const initialQuestion = useRef(state.activeQuestion);
  const initialHasResult = useRef(!!state.activeResult);
  useEffect(() => {
    if (initialQuestion.current && !initialHasResult.current) {
      setQuery(initialQuestion.current);
    }
    // Focus after the component paints using rAF so the element is definitely in the DOM.
    const raf = requestAnimationFrame(() => { inputRef.current?.focus(); });
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally runs once on mount only — initial values captured via refs above.

  // Sync prefill question when OPEN_DRAWER is dispatched while the panel is already
  // mounted (e.g. clicking a prompt in DrawerEmptyState or an AskAIButton while open).
  // Only fires in input mode (activeResult === null) to avoid overwriting the query
  // after a successful submission when OPEN_PANEL sets activeQuestion to the submitted text.
  useEffect(() => {
    if (state.activeResult === null && state.activeQuestion) {
      setQuery(state.activeQuestion);
      const raf = requestAnimationFrame(() => { inputRef.current?.focus(); });
      return () => cancelAnimationFrame(raf);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeQuestion]);

  const handleSubmit = useCallback(async (text: string) => {
    const q = text.trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
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

      let copilotResponse: CopilotResponse | null = null;
      const contentType = res.headers.get('content-type') ?? '';

      if (contentType.includes('text/event-stream')) {
        if (!res.body) throw new Error('Response body is empty');
        const reader = res.body.getReader();
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

      const pipelineResult = runPipeline(
        q, copilotResponse, state.region, state.riskProfile, state.sessionId, state.history,
      );

      const historyEntry: ReasoningHistoryEntry = {
        id: pipelineResult.requestId,
        question: q,
        intent: pipelineResult.step1_intent,
        result: pipelineResult,
        timestamp: pipelineResult.timestamp,
      };
      dispatch({ type: 'ADD_HISTORY_ENTRY', payload: historyEntry });
      dispatch({ type: 'OPEN_PANEL', payload: { question: q, result: pipelineResult } });
      setQuery('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, state, dispatch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); void handleSubmit(query); }
    if (e.key === 'Escape') { setQuery(''); inputRef.current?.blur(); }
  }, [query, handleSubmit]);

  return (
    <div className="shrink-0 border-b border-slate-100 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-slate-800/40">
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            placeholder="What are you deciding?"
            disabled={isLoading}
            aria-label="What financial decision are you trying to make?"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-700"
          />
          {error && (
            <span role="alert" className="absolute -bottom-5 left-0 whitespace-nowrap text-[10px] text-rose-600 dark:text-rose-400">
              {error}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => void handleSubmit(query)}
          disabled={isLoading || query.trim().length === 0}
          aria-label="Run analysis"
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isLoading ? (
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
          <span>{isLoading ? 'Analyzing…' : 'Ask'}</span>
        </button>
      </div>
    </div>
  );
}

// ─── Empty input state ────────────────────────────────────────────────────────

function DrawerEmptyState({ history, dispatch }: { history: ReturnType<typeof useCopilot>['state']['history']; dispatch: ReturnType<typeof useCopilot>['dispatch'] }) {
  return (
    <div className="flex flex-col gap-5 px-5 py-6">
      {/* Icon + subtitle */}
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/60">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">What are you deciding?</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Describe your situation above or pick a topic to get a clear recommendation.
        </p>
      </div>

      {/* Decision category cards */}
      <div>
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Start a decision</p>
        <div className="flex flex-col gap-2">
          {DECISION_CARDS.map((card) => (
            <button
              key={card.key}
              type="button"
              onClick={() => dispatch({ type: 'OPEN_DRAWER', payload: { prefillQuestion: card.question } })}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500 dark:hover:bg-blue-950/30"
            >
              <span className="text-xl leading-none">{card.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{card.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{card.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent decisions */}
      {history.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Recent decisions</p>
          <div className="flex flex-col gap-1.5">
            {history.slice(0, 3).map((entry) => {
              const typeLabel =
                INTENT_TYPE_LABEL[entry.result.step1_intent.type] ?? entry.result.step1_intent.category;
              const summary = entry.result.step5_actionPlan.primaryAction.label;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() =>
                    dispatch({ type: 'OPEN_PANEL', payload: { question: entry.question, result: entry.result } })
                  }
                  className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-left transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                      {typeLabel}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {entry.question}
                  </p>
                  {summary && (
                    <p className="line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400">{summary}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Panel Root ───────────────────────────────────────────────────────────────

/**
 * Right-side execution panel.
 *
 * Slides in from the right when `state.isExecutionPanelOpen` is true.
 * Shows an inline input form at the top for new questions, and the
 * 5-step pipeline output below when a result is available.
 */
export function ExecutionPanel() {
  const { state, dispatch } = useCopilot();
  const { isExecutionPanelOpen, activeResult, activeQuestion, history } = state;

  if (!isExecutionPanelOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => dispatch({ type: 'CLOSE_PANEL' })}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="complementary"
        aria-label="AI Decision Assistant"
        className="fixed right-0 top-0 z-50 flex h-full w-[min(420px,100vw)] flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-sm font-bold text-white">AI Decision Assistant</p>
          </div>
          <button
            onClick={() => dispatch({ type: 'CLOSE_PANEL' })}
            aria-label="Close AI assistant"
            className="rounded-md p-1 text-white/70 transition hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Inline input form — always visible */}
        <PanelInputForm />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {activeResult ? (
            <>
              {/* Active question label */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-1.5 text-[10px] text-slate-400 dark:border-slate-700/60 dark:bg-slate-800/40">
                <span className="line-clamp-1 italic">&ldquo;{activeQuestion}&rdquo;</span>
                <span className="shrink-0">{new Date(activeResult.timestamp).toLocaleTimeString()}</span>
              </div>

              {/* Consumer-friendly result output */}
              <div className="px-5 py-4">
                <div className="space-y-5">
                  <RecommendationSection result={activeResult} />
                  <hr className="border-slate-100 dark:border-slate-700/60" />
                  <KeyFindingsSection result={activeResult} />
                  <hr className="border-slate-100 dark:border-slate-700/60" />
                  <RisksSection result={activeResult} />
                  <hr className="border-slate-100 dark:border-slate-700/60" />
                  <NextStepsSection result={activeResult} />
                </div>
              </div>

              {/* History breadcrumb */}
              {history.length > 1 && (
                <div className="shrink-0 border-t border-slate-100 px-5 py-3 dark:border-slate-700">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Recent decisions ({history.length})
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {history.slice(0, 4).map((entry) => {
                      const typeLabel =
                        INTENT_TYPE_LABEL[entry.result.step1_intent.type] ?? entry.result.step1_intent.category;
                      return (
                        <button
                          key={entry.id}
                          onClick={() =>
                            dispatch({ type: 'OPEN_PANEL', payload: { question: entry.question, result: entry.result } })
                          }
                          className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-left transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                              {typeLabel}
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-xs text-slate-600 dark:text-slate-400">
                            {entry.question}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <DrawerEmptyState history={history} dispatch={dispatch} />
          )}
        </div>

        {/* Footer: disclaimer */}
        <div className="shrink-0 border-t border-slate-100 px-5 py-3 dark:border-slate-700">
          <p className="text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
            Educational decision-support only. Not financial, tax, or legal advice. All projections use estimates and stated assumptions.
          </p>
        </div>
      </aside>
    </>
  );
}
