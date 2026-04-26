'use client';

import Link from 'next/link';
import { HeroDecisionRunner } from '@/components/home/HeroDecisionRunner';
import { useRegion } from '@/components/providers/RegionProvider';
import { REGION_FINANCE_CONTEXT } from '@/lib/region-finance-context';

const platformMetrics = [
  { value: '128,400+', label: 'decisions analyzed' },
  { value: '18 pts', label: 'Avg. risk score reduction' },
  { value: '$340', label: 'Avg. monthly savings surfaced' }
];

const credibilityPills = [
  '28/36 Rule',
  'Dave Ramsey Baby Steps',
  'Bogle Index Method',
  'CFPB Guidelines',
  'Behavioral Cashflow Stress Testing'
];

export function AICopilotPreview() {
  const { region } = useRegion();
  const financeContext = REGION_FINANCE_CONTEXT[region];

  return (
    <section className="grid gap-4 lg:grid-cols-2" aria-label="AI Copilot and hero section">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">AI Copilot</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight text-slate-900 dark:text-slate-100">Test Your Financial Decisions Before You Risk Money</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">AI-powered engine that simulates real-life scenarios and worst-case outcomes.</p>

        <HeroDecisionRunner
          className="mt-4"
          id="ai-question"
          inputClassName="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
          buttonClassName="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <div className="mt-5 flex flex-wrap gap-3">
          <a href="/ai-money-copilot" className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
            Start Your First Decision
          </a>
          <a href="#instant-demo" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">
            Try Demo Scenario
          </a>
        </div>

        <section className="mt-5" aria-label="Platform impact metrics">
          <div className="grid gap-3 md:grid-cols-3">
            {platformMetrics.map((metric) => (
              <article key={metric.label} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{metric.value}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{metric.label}</p>
              </article>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {financeContext.interestRateRange} • {financeContext.taxAssumption}
          </p>
        </section>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900" id="ai-output">
        <h2 className="text-lg font-semibold">Copilot response</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Your answer appears inline on the left as it streams in. Use this panel to jump into the full assistant for a deeper analysis.</p>
        <Link href="/ai-money-copilot" className="mt-4 inline-block rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">
          Open full AI Copilot →
        </Link>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 lg:col-span-2" aria-label="Credibility methods and standards">
        <div className="flex flex-wrap gap-2">
          {credibilityPills.map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
            >
              {pill}
            </span>
          ))}
        </div>
      </article>

      <article id="instant-demo" className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 lg:col-span-2" aria-label="Instant demo block">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Instant demo</p>
            <h2 className="mt-2 text-xl font-semibold">Try a scenario in 10 seconds</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {financeContext.localizedScenario.incomeLabel}
              <br />
              {financeContext.localizedScenario.decisionLabel}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Monthly cost breakdown</h3>
            {financeContext.localizedScenario.monthlyCostLines.map((line) => (
              <p key={line} className="mt-2 text-sm first:mt-2">{line}</p>
            ))}
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
            <h3 className="text-sm font-semibold">Risk alert</h3>
            <p className="mt-1 text-sm">{financeContext.localizedScenario.riskAlert}</p>
            <p className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">Recommendation: {financeContext.localizedScenario.recommendation}</p>
          </div>
        </div>
      </article>
    </section>
  );
}
