'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useRegion } from '@/components/providers/RegionProvider';
import { REGION_FINANCE_CONTEXT } from '@/lib/region-finance-context';

type DecisionKey = 'debt' | 'home' | 'invest' | 'retire';

const decisionSelector = [
  { key: 'debt' as const, label: 'Pay off debt', href: '/debt-payoff-calculator' },
  { key: 'home' as const, label: 'Buy a home', href: '/mortgage-calculator' },
  { key: 'invest' as const, label: 'Invest monthly', href: '/investment-growth-calculator' },
  { key: 'retire' as const, label: 'Plan retirement', href: '/retirement-calculator' }
];

const previewByDecision: Record<DecisionKey, { output: string; risk: string; action: string }> = {
  debt: {
    output: "You're paying 31% APR equivalent on revolving balances",
    risk: 'Risk: HIGH',
    action: 'Focus action: Avalanche payoff + emergency floor'
  },
  home: {
    output: "You're spending 42% of income on housing",
    risk: 'Risk: HIGH',
    action: 'Focus action: Lower price target before approval'
  },
  invest: {
    output: "You're investing 8% monthly while cash buffer covers 0.7 months",
    risk: 'Risk: MEDIUM',
    action: 'Focus action: Build cash runway first, then automate'
  },
  retire: {
    output: "Your plan succeeds only if returns stay above 10%",
    risk: 'Risk: HIGH',
    action: 'Focus action: Stress test with lower-return assumptions'
  }
};

const stepCards = [
  {
    icon: '①',
    title: 'Enter your numbers',
    detail: 'Income, costs, balances, and timeline.',
    cta: 'Input numbers',
    href: '/calculators'
  },
  {
    icon: '②',
    title: 'See worst-case scenario',
    detail: 'Run the downside before you commit.',
    cta: 'Stress test now',
    href: '/comparison'
  },
  {
    icon: '③',
    title: 'Get a clear action',
    detail: 'Pick one next move with trade-offs visible.',
    cta: 'Choose next step',
    href: '/ai-money-copilot'
  }
];

const decisionPathCards = [
  {
    title: 'Pay off debt faster',
    outcome: 'See payoff date shifts as rates or monthly payment change.',
    href: '/debt-payoff-calculator'
  },
  {
    title: 'Buy a home safely',
    outcome: 'Test payment shock across rates, taxes, and insurance.',
    href: '/mortgage-calculator'
  },
  {
    title: 'Invest monthly with confidence',
    outcome: 'Compare conservative vs optimistic outcomes side-by-side.',
    href: '/investment-growth-calculator'
  },
  {
    title: 'Plan retirement under pressure',
    outcome: 'Stress test inflation and sequence-of-returns risk.',
    href: '/retirement-calculator'
  }
];

const behavioralInsights = [
  {
    insight: 'Plans fail when built on best months',
    consequence: 'Use your lowest income month instead.'
  },
  {
    insight: 'Debt feels manageable until variable rates jump',
    consequence: 'Model rate spikes before consolidating.'
  },
  {
    insight: 'Big goals break when cash buffers are ignored',
    consequence: 'Protect one month of expenses before stretching risk.'
  }
];

export function HomepageLayout() {
  const { region } = useRegion();
  const financeContext = REGION_FINANCE_CONTEXT[region];

  return (
    <section className="space-y-8 pb-24" aria-label="FinanceSphere homepage">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900" aria-label="Decision-first hero">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">Start with numbers → stress test → then decide</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl">Find your biggest financial mistake in 2 minutes</h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">Run your numbers, test worst-case scenarios, and get a clear next step.</p>

        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Choose your decision path">
          {decisionSelector.map((decision) => (
            <button
              key={decision.key}
              type="button"
              onClick={() => setSelectedDecision(decision.key)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                selectedDecision === decision.key
                  ? 'border-cyan-400 bg-cyan-100 text-slate-900 dark:border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-100'
                  : 'border-slate-300 text-slate-700 hover:border-cyan-300 hover:text-slate-900 dark:border-slate-600 dark:text-slate-200'
              }`}
            >
              {decision.label}
            </button>
          ))}
        </div>

        <Link
          href={decisionSelector.find((item) => item.key === selectedDecision)?.href ?? '/comparison'}
          onClick={() => trackEvent({ event: 'cta_click', category: 'homepage_hero', label: `start_decision_${selectedDecision}` })}
          className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-900 hover:bg-cyan-300"
        >
          Start your decision →
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Three step system">
        {stepCards.map((step) => (
          <article key={step.title} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-2xl" aria-hidden="true">{step.icon}</p>
            <h2 className="mt-3 text-lg font-semibold">{step.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{step.detail}</p>
            <Link href={step.href} className="mt-4 inline-flex text-sm font-semibold text-cyan-700 hover:text-cyan-600 dark:text-cyan-300">{step.cta} →</Link>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-label="Regional money context">
        <h2 className="text-xl font-semibold">Regional assumptions driving your results</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-4 text-sm">
          <article className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Currency</p>
            <p className="mt-1 font-semibold">{financeContext.currencySymbol} localized defaults</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Interest rates</p>
            <p className="mt-1 font-semibold">{financeContext.interestRateRange}</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tax assumptions</p>
            <p className="mt-1 font-semibold">{financeContext.taxAssumption}</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Priority products</p>
            <p className="mt-1 font-semibold">{financeContext.primaryProducts.join(' • ')}</p>
          </article>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Decision platform highlights">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Cards over walls of text</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Decision cards summarize cost, downside, and next action in one view.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Graphs and sliders</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Scenario bars and risk sliders make trade-offs obvious in seconds.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Fast loading</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Heavy calculator previews are lazy loaded to help keep LCP under 2.5s.</p>
        </article>
      </section>

      <section className="space-y-3" aria-label="Decision paths">
        <h2 className="text-xl font-semibold">Choose a decision path</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {decisionPathCards.map((path) => (
            <article key={path.title} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-lg font-semibold">{path.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{path.outcome}</p>
              <Link href={path.href} className="mt-4 inline-flex text-sm font-semibold text-cyan-700 hover:text-cyan-600 dark:text-cyan-300">Run scenario →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3" aria-label="Behavioral insights">
        <h2 className="text-xl font-semibold">Behavioral insights that prevent bad decisions</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {behavioralInsights.map((item) => (
            <article key={item.insight} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="font-semibold text-slate-900 dark:text-slate-50">{item.insight}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.consequence}</p>
              <Link href="/learn" className="mt-3 inline-flex text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Apply insight →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 md:grid-cols-3" aria-label="Trust block">
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Founder credibility</h2>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Built by analysts and operators focused on practical personal-finance decisions.</p>
        </article>
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Method</h2>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Decision-first workflow: numbers first, downside next, recommendation last.</p>
        </article>
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Transparency</h2>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Assumptions are visible so you can adjust inputs and verify every output.</p>
        </article>
      </section>

      {showWeeklyPlanCta && (
        <section className="rounded-2xl border border-cyan-300 bg-cyan-100 p-6 text-center shadow-sm dark:border-cyan-700 dark:bg-cyan-900/30" aria-label="Weekly plan call to action">
          <h2 className="text-2xl font-bold">Get a weekly plan based on YOUR numbers</h2>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">Tell us your current decision and receive one practical action each week.</p>
          <Link
            href="/ai-money-copilot"
            onClick={() => trackEvent({ event: 'cta_click', category: 'homepage_scroll', label: 'weekly_plan_after_50_percent' })}
            className="mt-4 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white dark:bg-cyan-300 dark:text-slate-950"
          >
            Start weekly plan →
          </Link>
        </section>
      )}
    </section>
  );
}
