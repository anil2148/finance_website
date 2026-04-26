'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useRegion } from '@/components/providers/RegionProvider';
import { REGION_FINANCE_CONTEXT } from '@/lib/region-finance-context';

type DecisionGoal = 'Buy home' | 'Pay off debt' | 'Start investing' | 'Retirement planning' | 'Other';
type ScenarioRow = {
  label: string;
  monthlyImpact: string;
  riskScore: number;
  note: string;
};

type OnboardingState = {
  income: string;
  goal: DecisionGoal | '';
  step: 1 | 2 | 3;
};

const STORAGE_KEY = 'financesphere_decision_onboarding_v2';
const PREFILL_KEY = 'financesphere_money_copilot_prefill_v1';

const defaultState: OnboardingState = {
  income: '',
  goal: '',
  step: 1
};

const stepMeta = [
  { id: 1, label: 'Input data' },
  { id: 2, label: 'Stress test' },
  { id: 3, label: 'Recommendation' }
] as const;

const goalOptions: DecisionGoal[] = ['Buy home', 'Pay off debt', 'Start investing', 'Retirement planning', 'Other'];

export function DecisionOnboarding() {
  const { region } = useRegion();
  const financeContext = REGION_FINANCE_CONTEXT[region];
  const [state, setState] = useState<OnboardingState>(defaultState);
  const [complete, setComplete] = useState(false);
  const [errors, setErrors] = useState<{ income?: string; goal?: string }>({});

  useEffect(() => {
    const cached = window.localStorage.getItem(STORAGE_KEY) || window.sessionStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as OnboardingState;
        setState({ ...defaultState, ...parsed });
      } catch {
        setState(defaultState);
      }
    }
  }, []);

  useEffect(() => {
    const payload = JSON.stringify(state);
    window.localStorage.setItem(STORAGE_KEY, payload);
    window.sessionStorage.setItem(STORAGE_KEY, payload);
  }, [state]);

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'hidden' && !complete) {
        trackEvent({
          event: 'drop_off_point',
          category: 'onboarding',
          label: `step_${state.step}`,
          metadata: { dropoff_step: state.step }
        });
      }
    };

    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [complete, state.step]);

  const progress = useMemo(() => Math.round((state.step / 3) * 100), [state.step]);
  const monthlyIncome = Number(state.income || 0);
  const scenarioRows = useMemo(() => buildScenarioRows(state.goal, monthlyIncome, region), [state.goal, monthlyIncome, region]);
  const recommendation = useMemo(() => buildRecommendation(state.goal, monthlyIncome, scenarioRows, region), [state.goal, monthlyIncome, scenarioRows, region]);

  const nextStep = () => {
    if (state.step === 1) {
      const incomeMissing = !state.income || monthlyIncome <= 0;
      const goalMissing = !state.goal;
      if (incomeMissing || goalMissing) {
        setErrors({
          income: incomeMissing ? 'Enter monthly income.' : undefined,
          goal: goalMissing ? 'Select your biggest decision.' : undefined
        });
        return;
      }
    }

    setErrors({});
    const next = Math.min(3, state.step + 1) as 1 | 2 | 3;
    setState((prev) => ({ ...prev, step: next }));
    trackEvent({ event: 'decision_step_advanced', category: 'onboarding', label: `step_${next}`, metadata: { step: next } });
  };

  const previousStep = () => {
    const prev = Math.max(1, state.step - 1) as 1 | 2 | 3;
    setState((old) => ({ ...old, step: prev }));
  };

  const finish = () => {
    setComplete(true);
    window.sessionStorage.setItem(
      PREFILL_KEY,
      JSON.stringify({
        source: 'homepage_decision_wizard',
        income: monthlyIncome,
        goal: state.goal,
        recommendation: recommendation.action,
        riskScore: recommendation.riskScore,
        nextSteps: recommendation.nextSteps
      })
    );
    trackEvent({
      event: 'decision_completion_rate',
      category: 'onboarding',
      label: 'completed',
      value: 1,
      metadata: {
        goal: state.goal,
        income_band: state.income ? 'provided' : 'missing'
      }
    });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="onboarding-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="onboarding-heading" className="text-xl font-semibold">Decision flow</h2>
        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Step {state.step} of 3</span>
      </div>

      <ol className="mt-4 grid gap-2 sm:grid-cols-3" aria-label="Step indicators">
        {stepMeta.map((item) => (
          <li
            key={item.id}
            className={`rounded-lg border px-3 py-2 text-xs transition-all duration-300 ${state.step >= item.id ? 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200' : 'border-slate-200 text-slate-500 dark:border-slate-700'}`}
          >
            {item.id}. {item.label}
          </li>
        ))}
      </ol>

      <div className="mt-3" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Decision onboarding progress">
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700">
          <div className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-5 min-h-36 transition-all duration-300">
        {state.step === 1 ? (
          <div className="grid gap-3 animate-in fade-in duration-300">
            <label className="block">
              <span className="text-sm font-medium">Monthly income ({financeContext.currencySymbol})</span>
              <input
                type="number"
                min={0}
                value={state.income}
                onChange={(event) => setState((prev) => ({ ...prev, income: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
                placeholder={`e.g. ${financeContext.sampleMonthlyIncome.toLocaleString()}`}
                aria-label={`Monthly income (${financeContext.currencySymbol})`}
              />
              {errors.income ? <p className="mt-1 text-xs text-rose-600">{errors.income}</p> : null}
            </label>

            <label className="block">
              <span className="text-sm font-medium">Biggest financial decision right now</span>
              <select
                value={state.goal}
                onChange={(event) => setState((prev) => ({ ...prev, goal: event.target.value as DecisionGoal }))}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
                aria-label="Biggest financial decision right now"
              >
                <option value="">Select one</option>
                {goalOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              {errors.goal ? <p className="mt-1 text-xs text-rose-600">{errors.goal}</p> : null}
            </label>
          </div>
        ) : null}

        {state.step === 2 ? (
          <div className="animate-in fade-in space-y-3 duration-300">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Stress test for <span className="font-semibold">{state.goal || 'your decision'}</span> at <span className="font-semibold">{financeContext.currencySymbol}{monthlyIncome.toLocaleString()}</span>/month.
            </p>
            {scenarioRows.map((row) => (
              <article key={row.label} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{row.label}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{row.riskScore}/100 risk</span>
                </div>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{row.monthlyImpact}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{row.note}</p>
              </article>
            ))}
          </div>
        ) : null}

        {state.step === 3 ? (
          <article className="animate-in fade-in rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm duration-300 dark:border-emerald-800 dark:bg-emerald-950/30">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold">Recommendation summary</h3>
              <span className="rounded-full bg-emerald-700 px-2 py-1 text-xs font-semibold text-white">{recommendation.riskScore}/100 risk</span>
            </div>
            <p className="mt-2 text-sm"><span className="font-semibold">Recommended action:</span> {recommendation.action}</p>
            <p className="mt-2 text-xs text-emerald-800 dark:text-emerald-200">
              {financeContext.interestRateRange} • {financeContext.taxAssumption}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-4 text-xs">
              {recommendation.nextSteps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {state.step > 1 ? (
          <button onClick={previousStep} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">
            Back
          </button>
        ) : null}
        {state.step < 3 ? (
          <button onClick={nextStep} className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            {state.step === 2 ? 'See recommendation' : 'Continue'}
          </button>
        ) : (
          <Link
            onClick={finish}
            href="/ai-money-copilot?prefill=true"
            className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Refine further →
          </Link>
        )}
      </div>
    </section>
  );
}

function buildScenarioRows(goal: DecisionGoal | '', income: number, region: 'US' | 'IN' | 'EU'): ScenarioRow[] {
  const floorIncome = region === 'IN' ? 40000 : region === 'EU' ? 2000 : 2500;
  const baseIncome = Math.max(income || 0, floorIncome);
  const baseRate = goal === 'Buy home' ? 0.33 : goal === 'Pay off debt' ? 0.28 : goal === 'Start investing' ? 0.2 : goal === 'Retirement planning' ? 0.24 : 0.24;
  const worstRate = Math.min(baseRate + 0.12, 0.52);
  const baseAmount = Math.round(baseIncome * baseRate);
  const worstAmount = Math.round(baseIncome * worstRate);

  return [
    {
      label: 'Worst-case',
      monthlyImpact: `${REGION_FINANCE_CONTEXT[region].currencySymbol}${worstAmount.toLocaleString()}/month needed for this decision if income drops or costs jump.`,
      riskScore: Math.min(95, Math.round(worstRate * 180)),
      note: goal === 'Buy home' ? 'Assumes higher rate and maintenance pressure.' : 'Assumes margin pressure from one unexpected expense.'
    },
    {
      label: 'Base case',
      monthlyImpact: `${REGION_FINANCE_CONTEXT[region].currencySymbol}${baseAmount.toLocaleString()}/month needed with today’s assumptions.`,
      riskScore: Math.min(90, Math.round(baseRate * 160)),
      note: 'Use this as your baseline before committing.'
    },
    {
      label: 'Resilient plan',
      monthlyImpact: `${REGION_FINANCE_CONTEXT[region].currencySymbol}${Math.max(0, Math.round(baseAmount * 0.72)).toLocaleString()}/month after trimming discretionary spend.`,
      riskScore: Math.max(20, Math.round(baseRate * 120)),
      note: 'Target this level before locking in a long-term commitment.'
    }
  ];
}

function buildRecommendation(goal: DecisionGoal | '', income: number, rows: ScenarioRow[], region: 'US' | 'IN' | 'EU') {
  const worst = rows[0];
  const products = REGION_FINANCE_CONTEXT[region].primaryProducts.join(', ');
  const actionByGoal: Record<DecisionGoal, string> = {
    'Buy home': 'Delay purchase until housing costs stay under one-third of income and buffer is funded.',
    'Pay off debt': `Prioritize highest-APR debt first, then redirect freed cash toward ${products}.`,
    'Start investing': `Automate monthly investing and focus on region-fit products like ${products}.`,
    'Retirement planning': `Build a tax-aware retirement plan using ${products}.`,
    Other: 'Run one more scenario with a tighter budget before choosing a product.'
  };

  return {
    action: goal ? actionByGoal[goal] : 'Clarify your top decision and run one more pass.',
    riskScore: worst?.riskScore ?? 50,
    nextSteps: [
      `Protect at least ${Math.max(1, Math.round((income || 3000) / 2500))} month of essentials in cash.`,
      `Align your plan with ${REGION_FINANCE_CONTEXT[region].taxAssumption.toLowerCase()}`,
      `Shortlist ${products} and pick one action this week.`
    ]
  };
}
