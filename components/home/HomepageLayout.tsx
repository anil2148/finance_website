'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

type DecisionKey = 'debt' | 'home' | 'invest' | 'retire';

const decisionSelector = [
  { key: 'debt' as const, label: 'Pay off debt', href: '/debt-payoff-calculator' },
  { key: 'home' as const, label: 'Buy a home', href: '/mortgage-calculator' },
  { key: 'invest' as const, label: 'Invest monthly', href: '/investment-growth-calculator' },
  { key: 'retire' as const, label: 'Plan retirement', href: '/retirement-calculator' }
];

const previewByDecision: Record<DecisionKey, { output: string; risk: string; action: string }> = {
  debt: {
    output: "You're spending 26% of monthly cash flow on high-interest debt → Risk: HIGH",
    risk: 'Priority: Stop interest bleed first',
    action: 'Next step: Run your debt payoff scenario'
  },
  home: {
    output: "You're spending 42% of income on housing → Risk: HIGH",
    risk: 'Priority: Keep fixed costs flexible',
    action: 'Next step: Stress test affordability before buying'
  },
  invest: {
    output: "You invest monthly, but your cash buffer covers 0.7 months → Risk: MEDIUM",
    risk: 'Priority: Improve downside resilience',
    action: 'Next step: Test contribution level under bad months'
  },
  retire: {
    output: 'Your retirement plan only works with high-return assumptions → Risk: HIGH',
    risk: 'Priority: De-risk assumptions now',
    action: 'Next step: Run a lower-return retirement stress test'
  }
};

const stepCards = [
  {
    icon: '🧮',
    title: 'Step 1: Enter your numbers',
    detail: 'Use your real income, costs, and balances.',
    cta: 'Enter numbers',
    href: '/calculators'
  },
  {
    icon: '⚠️',
    title: 'Step 2: See worst-case scenario',
    detail: 'Run downside conditions before committing.',
    cta: 'Stress test now',
    href: '/comparison'
  },
  {
    icon: '✅',
    title: 'Step 3: Get a clear action',
    detail: 'Pick the next move with trade-offs visible.',
    cta: 'Get clear action',
    href: '/ai-money-copilot'
  }
];

const decisionPathCards = [
  {
    title: 'Pay off debt faster',
    outcome: 'Lower interest drag and shorten payoff timeline.',
    href: '/debt-payoff-calculator'
  },
  {
    title: 'Buy a home safely',
    outcome: 'Check if payment still works in rate and income shocks.',
    href: '/mortgage-calculator'
  },
  {
    title: 'Invest monthly with confidence',
    outcome: 'Balance growth with liquidity for bad months.',
    href: '/investment-growth-calculator'
  },
  {
    title: 'Plan retirement under pressure',
    outcome: 'Validate long-term viability under conservative returns.',
    href: '/retirement-calculator'
  }
];

const behavioralInsights = [
  {
    insight: 'Plans fail when built on best months',
    consequence: 'Use your lowest income month instead.'
  },
  {
    insight: 'Debt feels fine until variable rates reset',
    consequence: 'Model higher APR before choosing payment strategy.'
  },
  {
    insight: 'Optimistic projections create false safety',
    consequence: 'Decide using stress-case outcomes, not best-case charts.'
  }
];

export function HomepageLayout() {
  const [selectedDecision, setSelectedDecision] = useState<DecisionKey>('home');
  const [showWeeklyPlanCta, setShowWeeklyPlanCta] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const ratio = window.scrollY / scrollable;
      if (ratio >= 0.5) {
        setShowWeeklyPlanCta(true);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const selectedPreview = useMemo(() => previewByDecision[selectedDecision], [selectedDecision]);

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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-label="Live output preview">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Live output preview</h2>
          <Link href={decisionSelector.find((item) => item.key === selectedDecision)?.href ?? '/comparison'} className="text-sm font-semibold text-cyan-700 hover:text-cyan-600 dark:text-cyan-300">
            Run this scenario →
          </Link>
        </div>
        <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-700 dark:bg-cyan-900/20">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-50">{selectedPreview.output}</p>
          <p className="mt-2 text-sm font-semibold text-amber-700 dark:text-amber-300">{selectedPreview.risk}</p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{selectedPreview.action}</p>
        </div>
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
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">→ {item.consequence}</p>
              <Link href="/learn" className="mt-3 inline-flex text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Apply insight →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 md:grid-cols-3" aria-label="Trust block">
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Founder credibility</h2>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Built by finance operators and analysts focused on practical decision quality.</p>
          <Link href="/about" className="mt-3 inline-flex text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Meet the team →</Link>
        </article>
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Method (decision-first)</h2>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Every tool follows: numbers first, worst-case second, action third.</p>
          <Link href="/comparison" className="mt-3 inline-flex text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">See the method →</Link>
        </article>
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Transparency</h2>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Assumptions are visible so you can validate and adjust every recommendation.</p>
          <Link href="/help" className="mt-3 inline-flex text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Review assumptions →</Link>
        </article>
      </section>

      {showWeeklyPlanCta && (
        <section className="rounded-2xl border border-cyan-300 bg-cyan-100 p-6 text-center shadow-sm dark:border-cyan-700 dark:bg-cyan-900/30" aria-label="Weekly plan call to action">
          <h2 className="text-2xl font-bold">Get a weekly plan based on YOUR numbers</h2>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">Pick your decision path and get one practical weekly action.</p>
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
