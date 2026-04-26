'use client';

import { useEffect, useMemo, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

type Goal = 'Buy a home' | 'Pay off debt' | 'Invest for retirement' | 'Build emergency fund';

type OnboardingState = {
  income: string;
  goal: Goal;
  riskTolerance: number;
  step: 1 | 2 | 3;
};

const STORAGE_KEY = 'financesphere_decision_onboarding_v1';

const defaultState: OnboardingState = {
  income: '',
  goal: 'Buy a home',
  riskTolerance: 55,
  step: 1
};

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
          event: 'decision_onboarding_dropoff',
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
        goal: state.goal,
        risk_tolerance: state.riskTolerance,
        income_band: state.income ? 'provided' : 'missing'
      }
    });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="onboarding-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="onboarding-heading" className="text-xl font-semibold">Decision onboarding</h2>
        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Step {state.step} of 3</span>
      </div>

      <div className="mt-3" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Decision onboarding progress">
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700">
          <div className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {state.step === 1 ? (
          <label className="block">
            <span className="text-sm font-medium">Step 1: Income input</span>
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
          <label className="block">
            <span className="text-sm font-medium">Step 2: Goal selection</span>
            <select
              value={state.goal}
              onChange={(event) => setState((prev) => ({ ...prev, goal: event.target.value as Goal }))}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
              aria-label="Primary financial goal"
            >
              <option>Buy a home</option>
              <option>Pay off debt</option>
              <option>Invest for retirement</option>
              <option>Build emergency fund</option>
            </select>
          </label>
        ) : null}

        {state.step === 3 ? (
          <label className="block">
            <span className="text-sm font-medium">Step 3: Risk tolerance</span>
            <input
              type="range"
              min={0}
              max={100}
              value={state.riskTolerance}
              onChange={(event) => setState((prev) => ({ ...prev, riskTolerance: Number(event.target.value) }))}
              className="mt-2 w-full accent-blue-600"
              aria-label="Risk tolerance slider"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500">
              <span>Conservative</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{state.riskTolerance}/100</span>
              <span>Aggressive</span>
            </div>
          </label>
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
            Complete decision setup
          </button>
        )}
      </div>
    </section>
  );
}
