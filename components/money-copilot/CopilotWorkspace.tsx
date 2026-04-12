'use client';

/**
 * CopilotWorkspace — Decision-first entry point.
 *
 * Shows decision category cards that open the AI Decision Assistant drawer
 * and immediately generate an answer. Past decisions appear below.
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
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Key reasons</h3>
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

        {/* Right: Risks + next step */}
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
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Next steps</h3>
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

// ─── Workspace root ───────────────────────────────────────────────────────────

export function CopilotWorkspace() {
  const { state, dispatch } = useCopilot();
  const { history } = state;

  const handleCardClick = (question: string) => {
    dispatch({ type: 'OPEN_DRAWER', payload: { prefillQuestion: question, autoSubmit: true } });
  };

  return (
    <div className="space-y-8">
      {/* Hero: decision-first entry point */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 md:p-10">
        <div className="mb-6 max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            AI Decision Assistant
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            Get a clear recommendation on your next financial decision
          </p>
          <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
            No account required · No data stored · Instant answer
          </p>
        </div>

        {/* You'll get */}
        <div className="mb-6 flex flex-wrap gap-3">
          {[
            { icon: '✅', text: 'Clear recommendation' },
            { icon: '💡', text: 'Why it makes sense' },
            { icon: '⚠️', text: 'Risks to watch' },
            { icon: '→', text: 'What to do next' },
          ].map(({ icon, text }) => (
            <span
              key={text}
              className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-medium text-blue-700 shadow-sm dark:border-blue-700/40 dark:bg-slate-800 dark:text-blue-300"
            >
              <span>{icon}</span>
              {text}
            </span>
          ))}
        </div>

        {/* Decision category cards */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Start a decision</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {DECISION_CARDS.map((card) => (
              <button
                key={card.key}
                type="button"
                onClick={() => handleCardClick(card.question)}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-blue-400 hover:bg-blue-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-500 dark:hover:bg-blue-950/30"
              >
                <span className="text-2xl leading-none">{card.emoji}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{card.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{card.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Decision history */}
      {history.length > 0 && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Your decisions</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                From this session — click any to review the full recommendation.
              </p>
            </div>
            <button
              onClick={() => dispatch({ type: 'CLEAR_HISTORY' })}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-rose-300 hover:text-rose-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
            >
              Clear history
            </button>
          </div>
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
