'use client';

import { trackEvent } from '@/lib/analytics';

const breakdown = [
  { label: 'Mortgage + interest', value: '$2,430/mo' },
  { label: 'Tax + insurance', value: '$640/mo' },
  { label: 'Maintenance reserve', value: '$350/mo' },
  { label: 'Total monthly housing cost', value: '$3,420/mo' }
];

export function AICopilotPreview() {
  const onCta = (label: string) => {
    trackEvent({ event: 'cta_click', category: 'homepage_hero', label });
  };

  return (
    <section className="grid gap-4 lg:grid-cols-2" aria-label="AI Copilot preview">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">AI Copilot</h2>
        <div className="mt-4 space-y-3" role="log" aria-live="polite" aria-label="Example AI conversation">
          <div className="ml-auto max-w-[90%] rounded-2xl bg-blue-600 px-4 py-2 text-sm text-white">
            Should I buy a house?
          </div>
          <div className="max-w-[95%] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="font-semibold">Monthly cost breakdown</p>
            <ul className="mt-2 space-y-1">
              {breakdown.map((item) => (
                <li key={item.label} className="flex justify-between gap-3 text-xs sm:text-sm">
                  <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
              <span className="font-semibold">Worst-case scenario:</span> 12% income drop + 1% rate reset drives housing cost to 49% of take-home pay.
            </div>
            <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100">
              <span className="font-semibold">Recommendation:</span> wait 6 months, build 3 months reserves, then re-run with max payment of $2,900.
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Make Financial Decisions with Real Numbers, Not Guesswork</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">AI-powered engine that stress-tests your decisions before you commit money</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="/ai-money-copilot" onClick={() => onCta('start_first_decision')} className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
            Start Your First Decision
          </a>
          <a href="#example-decision" onClick={() => onCta('see_example_decision')} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">
            See Example Decision
          </a>
        </div>
      </article>
    </section>
  );
}
