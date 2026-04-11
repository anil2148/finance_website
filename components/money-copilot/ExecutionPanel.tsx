'use client';

import { useCopilot } from '@/components/money-copilot/CopilotProvider';
import type { ExecutionAction, PipelineResult } from '@/lib/money-copilot/types';

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

function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = pct >= 70 ? 'text-emerald-600 dark:text-emerald-400' : pct >= 45 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400';
  return <span className={`text-xs font-bold tabular-nums ${color}`}>{pct}%</span>;
}

// ─── Section: Step 1 — Intent ────────────────────────────────────────────────

function IntentStep({ result }: { result: PipelineResult }) {
  const { step1_intent: intent } = result;
  const isAmbiguous = intent.type === 'ambiguous-offer' || intent.needsClarification || intent.confidence < 0.5;
  return (
    <section>
      <SectionHeader step={1} title="Intent" />
      {isAmbiguous && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-700/40 dark:bg-amber-950/20 dark:text-amber-400">
          <p className="font-semibold">⚠️ Needs clarification</p>
          {intent.clarificationQuestion && (
            <p className="mt-0.5 opacity-90">{intent.clarificationQuestion}</p>
          )}
        </div>
      )}
      <div className="space-y-2 text-sm">
        <Row
          label="Type"
          value={intent.type === 'ambiguous-offer' ? 'Offer type unclear' : intent.type.replace(/-/g, ' ')}
        />
        <Row label="Category" value={intent.category} />
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">Confidence</span>
          <ConfidenceBadge value={intent.confidence} />
        </div>
        {intent.signals.length > 0 && (
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Signals</p>
            <div className="flex flex-wrap gap-1">
              {intent.signals.slice(0, 6).map((s) => (
                <span key={s} className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Section: Step 2 — Context ───────────────────────────────────────────────

function ContextStep({ result }: { result: PipelineResult }) {
  const { step2_context: ctx } = result;
  return (
    <section>
      <SectionHeader step={2} title="Context" />
      <div className="space-y-2 text-sm">
        <Row label="Region" value={ctx.region} />
        <Row label="Risk profile" value={ctx.riskProfile} />
        {ctx.portfolio?.allocation && (
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Target allocation</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(ctx.portfolio.allocation).map(([k, v]) => (
                <span key={k} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {k} {v}%
                </span>
              ))}
            </div>
          </div>
        )}
        <Row label="Session history" value={`${ctx.history.length} prior decision${ctx.history.length !== 1 ? 's' : ''}`} />
      </div>
    </section>
  );
}

// ─── Section: Step 3 — Analysis ──────────────────────────────────────────────

function AnalysisStep({ result }: { result: PipelineResult }) {
  const { step1_intent: intent, step3_analysis: analysis } = result;
  const needsClarification = intent.type === 'ambiguous-offer' || intent.needsClarification || intent.confidence < 0.5;
  const title = needsClarification ? 'Next Step' : 'Analysis';
  return (
    <section>
      <SectionHeader step={3} title={title} />
      {needsClarification && (
        <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:border-blue-700/40 dark:bg-blue-950/20 dark:text-blue-400">
          Provide more context or clarify the offer type to unlock a full analysis.
        </div>
      )}
      <div className="space-y-3">
        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 italic">{analysis.methodology}</p>

        {analysis.keyFindings.length > 0 && (
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Key findings</p>
            <ul className="space-y-1">
              {analysis.keyFindings.map((f, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                  <span className="mt-0.5 shrink-0 text-blue-500">›</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysis.dataPoints.length > 0 && (
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Data points</p>
            <div className="space-y-1">
              {analysis.dataPoints.slice(0, 6).map((dp, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{dp.label}</span>
                  <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${dp.source === 'assumed' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                    {dp.value.slice(0, 30)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.comparisons.length > 0 && (
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Comparison</p>
            {analysis.comparisons.map((c, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800/50">
                <div className="flex items-center justify-between gap-1 font-medium text-slate-800 dark:text-slate-100">
                  <span>{c.optionA}</span>
                  <span className="text-slate-400">vs</span>
                  <span>{c.optionB}</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Delta</span>
                  <span className={`font-bold tabular-nums ${c.winner === 'A' ? 'text-emerald-600 dark:text-emerald-400' : c.winner === 'B' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600'}`}>
                    {c.delta} {c.winner !== 'neutral' ? `→ ${c.winner === 'A' ? c.optionA : c.optionB} wins` : '(neutral)'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Section: Step 4 — Risk ───────────────────────────────────────────────────

function RiskStep({ result }: { result: PipelineResult }) {
  const { step4_risk: risk } = result;
  const scoreColor = risk.overallScore >= 60 ? 'text-red-600 dark:text-red-400' : risk.overallScore >= 30 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400';

  return (
    <section>
      <SectionHeader step={4} title="Risk" />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">Overall risk score</span>
          <span className={`text-lg font-bold tabular-nums ${scoreColor}`}>{risk.overallScore}<span className="text-xs font-normal">/100</span></span>
        </div>

        {/* Score bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className={`h-full rounded-full transition-all ${risk.overallScore >= 60 ? 'bg-red-500' : risk.overallScore >= 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${risk.overallScore}%` }}
          />
        </div>

        {risk.factors.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {risk.factors.map((f, i) => (
              <div key={i} className={`flex items-start gap-2 rounded-lg border p-2 text-xs ${RISK_COLOR[f.severity]}`}>
                <span>{SEVERITY_ICON[f.severity]}</span>
                <div>
                  <p className="font-semibold">{f.factor}</p>
                  <p className="mt-0.5 opacity-80">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {risk.mitigations.length > 0 && (
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Mitigations</p>
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

// ─── Section: Step 5 — Action Plan ───────────────────────────────────────────

function ActionCard({ action, isPrimary }: { action: ExecutionAction; isPrimary: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${isPrimary ? 'border-blue-300 bg-blue-50 dark:border-blue-700/60 dark:bg-blue-950/30' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50'}`}>
      {isPrimary && (
        <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Primary action</div>
      )}
      <div className="flex items-start gap-2">
        <span className="text-base leading-none">{ACTION_ICON[action.type]}</span>
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{action.label}</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">{action.description}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${RISK_COLOR[action.riskLevel]}`}>
              {action.riskLevel} risk
            </span>
            <span className="text-[10px] text-slate-400">{action.timeframe}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 italic">
            Impact: {action.expectedImpact}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionPlanStep({ result }: { result: PipelineResult }) {
  const { step5_actionPlan: plan } = result;
  return (
    <section>
      <SectionHeader step={5} title="Action Plan" />
      <div className="space-y-2">
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-800/50">
          <span className="font-semibold text-slate-500 dark:text-slate-400">Timeline: </span>
          <span className="text-slate-700 dark:text-slate-300">{plan.timeline}</span>
        </div>
        {[plan.primaryAction, ...plan.actions.filter((a) => a.type !== plan.primaryAction.type)].map((action) => (
          <ActionCard key={action.type} action={action} isPrimary={action.type === plan.primaryAction.type} />
        ))}
      </div>
    </section>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function SectionHeader({ step, title }: { step: number; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
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
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-xs font-semibold capitalize text-slate-800 dark:text-slate-200">{value}</span>
    </div>
  );
}

// ─── Panel Root ───────────────────────────────────────────────────────────────

/**
 * Right-side execution panel.
 *
 * Slides in from the right when `state.isExecutionPanelOpen` is true.
 * Displays the 5-step pipeline output in numbered, collapsible-free sections.
 */
export function ExecutionPanel() {
  const { state, dispatch } = useCopilot();
  const { isExecutionPanelOpen, activeResult, activeQuestion } = state;

  if (!isExecutionPanelOpen || !activeResult) return null;

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
        aria-label="Copilot execution panel"
        className="fixed right-0 top-0 z-50 flex h-full w-[min(420px,100vw)] flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 dark:border-slate-700">
          <div>
            <p className="text-sm font-bold text-white">Execution Engine</p>
            <p className="mt-0.5 text-[10px] text-blue-100 line-clamp-1">&ldquo;{activeQuestion}&rdquo;</p>
          </div>
          <button
            onClick={() => dispatch({ type: 'CLOSE_PANEL' })}
            aria-label="Close execution panel"
            className="rounded-md p-1 text-white/70 transition hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Request metadata */}
        <div className="shrink-0 flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-1.5 text-[10px] text-slate-400 dark:border-slate-700/60 dark:bg-slate-800/40">
          <span>ID: {activeResult.requestId}</span>
          <span>{new Date(activeResult.timestamp).toLocaleTimeString()}</span>
        </div>

        {/* Scrollable 5-step content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-6">
            <IntentStep result={activeResult} />
            <hr className="border-slate-100 dark:border-slate-700/60" />
            <ContextStep result={activeResult} />
            <hr className="border-slate-100 dark:border-slate-700/60" />
            <AnalysisStep result={activeResult} />
            <hr className="border-slate-100 dark:border-slate-700/60" />
            <RiskStep result={activeResult} />
            <hr className="border-slate-100 dark:border-slate-700/60" />
            <ActionPlanStep result={activeResult} />
          </div>
        </div>

        {/* Footer: history breadcrumb */}
        {state.history.length > 1 && (
          <div className="shrink-0 border-t border-slate-100 px-5 py-3 dark:border-slate-700">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Recent analyses ({state.history.length})</p>
            <div className="flex flex-col gap-1">
              {state.history.slice(0, 4).map((entry) => (
                <button
                  key={entry.id}
                  onClick={() =>
                    dispatch({ type: 'OPEN_PANEL', payload: { question: entry.question, result: entry.result } })
                  }
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-left text-xs text-slate-600 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                >
                  <span className="line-clamp-1">{entry.question}</span>
                </button>
              ))}
            </div>
          </div>
        )}

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
