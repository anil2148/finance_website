'use client';

import { useEffect, useMemo, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

type Scenario = 'Base case' | 'Income drops 12%' | 'Rate +1%';

type OnboardingState = {
  income: string;
  scenario: Scenario;
  step: 1 | 2 | 3;
};

const STORAGE_KEY = 'financesphere_decision_onboarding_v2';

const defaultState: OnboardingState = {
  income: '6000',
  scenario: 'Income drops 12%',
  step: 1
};

const stepMeta = [
  { id: 1, label: 'Input data' },
  { id: 2, label: 'Stress test scenario' },
  { id: 3, label: 'Show recommendation' }
] as const;

export function DecisionOnboarding() {
  const [state, setState] = useState<OnboardingState>(defaultState);
  const [complete, setComplete] = useState(false);

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

  const nextStep = () => {
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
    trackEvent({
      event: 'decision_completion_rate',
      category: 'onboarding',
      label: 'completed',
      value: 1,
      metadata: {
        scenario: state.scenario,
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
          <label className="block animate-in fade-in duration-300">
            <span className="text-sm font-medium">Step 1: Input data</span>
            <input
              type="number"
              min={0}
              value={state.income}
              onChange={(event) => setState((prev) => ({ ...prev, income: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
              placeholder="Monthly take-home income"
              aria-label="Monthly income"
            />
          </label>
        ) : null}

        {state.step === 2 ? (
          <label className="block animate-in fade-in duration-300">
            <span className="text-sm font-medium">Step 2: Stress test scenario</span>
            <select
              value={state.scenario}
              onChange={(event) => setState((prev) => ({ ...prev, scenario: event.target.value as Scenario }))}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
              aria-label="Stress test scenario"
            >
              <option>Base case</option>
              <option>Income drops 12%</option>
              <option>Rate +1%</option>
            </select>
          </label>
        ) : null}

        {state.step === 3 ? (
          <article className="animate-in fade-in rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm duration-300 dark:border-emerald-800 dark:bg-emerald-950/30">
            <h3 className="font-semibold">Step 3: Show recommendation</h3>
            <p className="mt-2">Scenario selected: <span className="font-semibold">{state.scenario}</span></p>
            <p>Projected monthly impact: <span className="font-semibold">$3,420 housing spend</span></p>
            <p>Recommendation: <span className="font-semibold">Delay purchase and build 3-month reserve.</span></p>
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
            Continue
          </button>
        ) : (
          <button onClick={finish} className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            Save recommendation
          </button>
        )}
      </div>
    </section>
  );
}
