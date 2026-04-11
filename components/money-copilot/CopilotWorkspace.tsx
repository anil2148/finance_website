'use client';

/**
 * CopilotWorkspace — Decision history viewer.
 *
 * Shows all past decisions from this session in a consumer-friendly format.
 * Copilot execution happens through the floating Ask AI button + ExecutionPanel.
 */

import { useCopilot } from '@/components/money-copilot/CopilotProvider';
import type { ReasoningHistoryEntry } from '@/lib/money-copilot/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RISK_COLOR: Record<string, string> = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-700/40',
  medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-700/40',
  high: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-700/40',
};

const SEVERITY_ICON: Record<string, string> = { low: '🟢', medium: '🟡', high: '🔴' };

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

// ─── Decision summary card ─────────────────────────────────────────────────────

function DecisionCard({ entry }: { entry: ReasoningHistoryEntry }) {
  const { result: r } = entry;
  const { step1_intent: intent, step3_analysis: analysis, step4_risk: risk, step5_actionPlan: plan } = r;

  const typeLabel = INTENT_TYPE_LABEL[intent.type] ?? intent.category;
  const riskLabel =
    risk.overallScore >= 60 ? 'Higher risk' : risk.overallScore >= 30 ? 'Moderate risk' : 'Lower risk';
  const riskColor =
    risk.overallScore >= 60
      ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-700/40'
      : risk.overallScore >= 30
      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-700/40'
      : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-700/40';

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 dark:border-slate-700">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {typeLabel}
            </span>
          </div>
          <p className="text-sm font-bold text-white line-clamp-2">&ldquo;{entry.question}&rdquo;</p>
          <p className="mt-0.5 text-[10px] text-blue-100">{new Date(entry.timestamp).toLocaleString()}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${riskColor}`}>
          {riskLabel}
        </span>
      </div>

      <div className="grid gap-0 divide-y divide-slate-100 dark:divide-slate-700/60 md:grid-cols-2 md:divide-x md:divide-y-0">
        {/* Left: Recommendation + key findings */}
        <div className="space-y-4 p-5">
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Recommendation</h3>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-700/60 dark:bg-blue-950/30">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{plan.primaryAction.label}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{plan.primaryAction.description}</p>
            </div>
          </section>

          {analysis.keyFindings.length > 0 && (
            <section>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Key findings</h3>
              <ul className="space-y-1">
                {analysis.keyFindings.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="mt-0.5 shrink-0 text-blue-500">›</span>
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right: Risks + timeline */}
        <div className="space-y-4 p-5">
          {risk.factors.length > 0 && (
            <section>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Risks to watch</h3>
              {risk.factors.slice(0, 2).map((f, i) => (
                <div key={i} className={`flex items-start gap-2 rounded-lg border p-2 text-xs ${RISK_COLOR[f.severity]} mt-1.5`}>
                  <span>{SEVERITY_ICON[f.severity]}</span>
                  <div>
                    <p className="font-semibold">{f.factor}</p>
                    <p className="mt-0.5 opacity-80">{f.detail}</p>
                  </div>
                </div>
              ))}
            </section>
          )}

          {plan.timeline && (
            <section>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Timeline</h3>
              <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-800/50">
                <span className="text-slate-700 dark:text-slate-300">{plan.timeline}</span>
              </div>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center dark:border-slate-700 dark:bg-slate-800/30">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div>
        <p className="text-base font-bold text-slate-800 dark:text-slate-200">No decisions yet</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Use the <strong className="text-blue-600 dark:text-blue-400">Ask AI</strong> button in the bottom-right corner to get a recommendation. Results will appear here.
        </p>
      </div>
      <p className="rounded-xl bg-blue-50 px-4 py-2.5 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
        Try: &ldquo;I have a job offer — should I take it?&rdquo; or &ldquo;Can I afford to buy a home?&rdquo;
      </p>
    </div>
  );
}

// ─── Workspace root ───────────────────────────────────────────────────────────

export function CopilotWorkspace() {
  const { state, dispatch } = useCopilot();
  const { history } = state;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Decision History</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Your past decisions from this session — click any to review the full recommendation.
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => dispatch({ type: 'CLEAR_HISTORY' })}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-rose-300 hover:text-rose-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
          >
            Clear history
          </button>
        )}
      </div>

      {/* How to use */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 dark:border-blue-800/30 dark:bg-blue-950/20">
        <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>To start a new decision</strong>, click the{' '}
          <span className="font-bold">Ask AI</span> button in the bottom-right corner, describe what you are deciding, and press{' '}
          <kbd className="rounded border border-blue-300 bg-white px-1 py-0.5 font-mono text-[10px] text-blue-700 dark:border-blue-600 dark:bg-slate-800 dark:text-blue-300">Enter</kbd>{' '}
          or click <strong>Ask</strong>. Your recommendation will appear here.
        </p>
      </div>

      {/* History list */}
      {history.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-5">
          {history.map((entry) => (
            <div key={entry.id}>
              <DecisionCard entry={entry} />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() =>
                    dispatch({ type: 'OPEN_PANEL', payload: { question: entry.question, result: entry.result } })
                  }
                  className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  Open recommendation →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
