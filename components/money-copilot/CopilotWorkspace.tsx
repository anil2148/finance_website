'use client';

/**
 * CopilotWorkspace — Institutional AI Execution Engine: decision history viewer.
 *
 * Copilot execution happens exclusively through the CommandBar (top strip) and
 * the ExecutionPanel (right panel). This workspace renders the global reasoning
 * history so users can review past pipeline results on a dedicated page.
 */

import { useCopilot } from '@/components/money-copilot/CopilotProvider';
import type { PipelineResult, ReasoningHistoryEntry } from '@/lib/money-copilot/types';

// ─── Step badges ──────────────────────────────────────────────────────────────

const RISK_COLOR: Record<string, string> = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-700/40',
  medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-700/40',
  high: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-700/40',
};

const SEVERITY_ICON: Record<string, string> = { low: '🟢', medium: '🟡', high: '🔴' };
const ACTION_ICON: Record<string, string> = { rebalance: '⚖️', simulate: '📊', report: '📄', hedge: '🛡️' };

// ─── Inline pipeline result card ──────────────────────────────────────────────

function PipelineCard({ entry }: { entry: ReasoningHistoryEntry }) {
  const { result: r } = entry;
  const { step1_intent: intent, step2_context: ctx, step3_analysis: analysis, step4_risk: risk, step5_actionPlan: plan } = r;

  const scoreColor =
    risk.overallScore >= 60
      ? 'text-red-600 dark:text-red-400'
      : risk.overallScore >= 30
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-emerald-600 dark:text-emerald-400';

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 dark:border-slate-700">
        <div className="min-w-0">
          <p className="text-sm font-bold text-white line-clamp-2">&ldquo;{entry.question}&rdquo;</p>
          <p className="mt-0.5 text-[10px] text-blue-100">
            {new Date(entry.timestamp).toLocaleString()} · ID: {r.requestId}
          </p>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
          intent.confidence >= 0.7
            ? 'border-emerald-300 bg-emerald-500/20 text-emerald-100'
            : intent.confidence >= 0.4
            ? 'border-amber-300 bg-amber-500/20 text-amber-100'
            : 'border-rose-300 bg-rose-500/20 text-rose-100'
        }`}>
          {Math.round(intent.confidence * 100)}% conf
        </span>
      </div>

      <div className="grid gap-0 divide-y divide-slate-100 dark:divide-slate-700/60 md:grid-cols-2 md:divide-x md:divide-y-0">
        {/* Left column */}
        <div className="space-y-4 p-5">
          {/* Step 1 */}
          <section>
            <StepHeader step={1} title="Intent" />
            <div className="space-y-1.5 text-xs">
              <Row label="Type" value={intent.type.replace(/-/g, ' ')} />
              <Row label="Category" value={intent.category} />
              {intent.signals.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {intent.signals.slice(0, 5).map((s) => (
                    <span key={s} className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Step 2 */}
          <section>
            <StepHeader step={2} title="Context" />
            <div className="space-y-1.5 text-xs">
              <Row label="Region" value={ctx.region} />
              <Row label="Risk profile" value={ctx.riskProfile} />
              {ctx.portfolio?.allocation && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {Object.entries(ctx.portfolio.allocation).map(([k, v]) => (
                    <span key={k} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {k} {v}%
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Step 3 */}
          <section>
            <StepHeader step={3} title="Analysis" />
            <p className="mb-2 text-[11px] italic text-slate-500 dark:text-slate-400">{analysis.methodology}</p>
            {analysis.keyFindings.length > 0 && (
              <ul className="space-y-1">
                {analysis.keyFindings.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="mt-0.5 shrink-0 text-blue-500">›</span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-4 p-5">
          {/* Step 4 */}
          <section>
            <StepHeader step={4} title="Risk" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Overall score</span>
              <span className={`text-lg font-bold tabular-nums ${scoreColor}`}>
                {risk.overallScore}<span className="text-xs font-normal">/100</span>
              </span>
            </div>
            <div className="my-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={`h-full rounded-full ${risk.overallScore >= 60 ? 'bg-red-500' : risk.overallScore >= 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${risk.overallScore}%` }}
              />
            </div>
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

          {/* Step 5 */}
          <section>
            <StepHeader step={5} title="Action Plan" />
            <div className="mb-2 rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-800/50">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Timeline: </span>
              <span className="text-slate-700 dark:text-slate-300">{plan.timeline}</span>
            </div>
            <div className={`rounded-xl border p-3 border-blue-300 bg-blue-50 dark:border-blue-700/60 dark:bg-blue-950/30`}>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Primary action</div>
              <div className="flex items-start gap-2">
                <span className="text-base leading-none">{ACTION_ICON[plan.primaryAction.type]}</span>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{plan.primaryAction.label}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">{plan.primaryAction.description}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${RISK_COLOR[plan.primaryAction.riskLevel]}`}>
                      {plan.primaryAction.riskLevel} risk
                    </span>
                    <span className="text-[10px] text-slate-400">{plan.primaryAction.timeframe}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function StepHeader({ step, title }: { step: number; title: string }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
        {step}
      </span>
      <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">{title}</h3>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">{value}</span>
    </div>
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
        <p className="text-base font-bold text-slate-800 dark:text-slate-200">No analyses yet</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Use the <strong className="text-blue-600 dark:text-blue-400">Ask AI</strong> button in the bottom-right corner to run a financial decision analysis. Results will appear here.
        </p>
      </div>
      <p className="rounded-xl bg-blue-50 px-4 py-2.5 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
        Try: &ldquo;Should I accept this job offer?&rdquo; or &ldquo;Can I afford a $500k house?&rdquo;
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
            Past pipeline analyses from this session — all 5 steps preserved.
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

      {/* How to use — shown always as a sticky reminder */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 dark:border-blue-800/30 dark:bg-blue-950/20">
        <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>To run a new analysis</strong>, click the{' '}
          <span className="font-bold">Ask AI</span> button in the bottom-right corner, type your financial question, and press{' '}
          <kbd className="rounded border border-blue-300 bg-white px-1 py-0.5 font-mono text-[10px] text-blue-700 dark:border-blue-600 dark:bg-slate-800 dark:text-blue-300">Enter</kbd>{' '}
          or click <strong>Ask</strong>. Results open in the right panel and are saved here.
        </p>
      </div>

      {/* History list */}
      {history.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-5">
          {history.map((entry) => (
            <div key={entry.id}>
              <PipelineCard entry={entry} />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() =>
                    dispatch({ type: 'OPEN_PANEL', payload: { question: entry.question, result: entry.result } })
                  }
                  className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  Open in execution panel →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
