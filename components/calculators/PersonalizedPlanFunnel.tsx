'use client';

import { FormEvent, useMemo, useState } from 'react';
import { isValidEmail, normalizeEmail } from '@/lib/newsletter/validation';

type PersonalizedPlanFunnelProps = {
  source: string;
  headlineMetric: string;
  headlineValue: string;
};

type NewsletterApiResponse =
  | {
      success: true;
      message?: string;
    }
  | {
      success: false;
      error?: {
        code?: string;
        message?: string;
      };
    };

const GOAL_OPTIONS = [
  'Pay off debt faster',
  'Build emergency savings',
  'Start investing consistently',
  'Lower monthly payment stress'
];

const INCOME_OPTIONS = ['Under $3,000', '$3,000-$6,000', '$6,000-$10,000', '$10,000+'];

const CHALLENGE_OPTIONS = ['High monthly debt payments', 'Inconsistent income', 'Not sure what to prioritize first', 'I start plans but do not stick with them'];

function getPreviewRecommendation(goal: string, challenge: string) {
  if (challenge.toLowerCase().includes('debt')) {
    return 'You should prioritize debt payoff over investing right now.';
  }

  if (challenge.toLowerCase().includes('inconsistent')) {
    return 'You should prioritize a cash-buffer plan before increasing long-term commitments.';
  }

  if (goal.toLowerCase().includes('invest')) {
    return 'You should use a baseline emergency fund, then automate small recurring investments.';
  }

  if (goal.toLowerCase().includes('savings')) {
    return 'You should prioritize a weekly cashflow check-in to grow your savings without overcommitting.';
  }

  return 'You should prioritize one weekly action tied to your biggest cashflow bottleneck.';
}

export function PersonalizedPlanFunnel({ source, headlineMetric, headlineValue }: PersonalizedPlanFunnelProps) {
  const [goal, setGoal] = useState(GOAL_OPTIONS[0]);
  const [incomeRange, setIncomeRange] = useState(INCOME_OPTIONS[0]);
  const [challenge, setChallenge] = useState(CHALLENGE_OPTIONS[0]);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'inputs' | 'preview' | 'email' | 'success'>('inputs');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const recommendation = useMemo(() => getPreviewRecommendation(goal, challenge), [goal, challenge]);

  const submitEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'loading') return;

    const normalizedEmail = normalizeEmail(email);
    if (!isValidEmail(normalizedEmail)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('Saving your plan...');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          email: normalizedEmail,
          source,
          persona: `${goal} | ${incomeRange}`,
          leadMagnet: `personalized-weekly-plan:${challenge}`
        })
      });

      const payload = (await response.json()) as NewsletterApiResponse;

      if (!response.ok || !payload.success) {
        setStatus('error');
        setMessage(payload.success ? 'Unable to subscribe right now.' : payload.error?.message ?? 'Unable to subscribe right now.');
        return;
      }

      setStatus('idle');
      setStep('success');
      setMessage(payload.message ?? "You're subscribed.");
      window.location.assign(`/dashboard/personalized?source=${encodeURIComponent(source)}&goal=${encodeURIComponent(goal)}&income=${encodeURIComponent(incomeRange)}&challenge=${encodeURIComponent(challenge)}`);
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again in a moment.');
    }
  };

  return (
    <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-500/40 dark:bg-indigo-950/30">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-200">Personalized funnel</p>
      <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Get a weekly plan based on YOUR numbers</h2>
      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">This is not a generic newsletter. Your weekly plan is generated from your calculator outcome and your stated priorities.</p>

      {step === 'inputs' ? (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-100">What is your goal?</span>
            <select className="input" value={goal} onChange={(event) => setGoal(event.target.value)}>
              {GOAL_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-100">Monthly income range</span>
            <select className="input" value={incomeRange} onChange={(event) => setIncomeRange(event.target.value)}>
              {INCOME_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-100">Biggest challenge</span>
            <select className="input" value={challenge} onChange={(event) => setChallenge(event.target.value)}>
              {CHALLENGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="btn-primary md:col-span-3" onClick={() => setStep('preview')}>
            Preview my plan
          </button>
        </div>
      ) : null}

      {step === 'preview' ? (
        <div className="mt-4 space-y-3 rounded-xl border border-indigo-200 bg-white p-4 text-sm dark:border-indigo-500/30 dark:bg-slate-900">
          <p className="font-semibold text-slate-900 dark:text-slate-100">Based on your inputs:</p>
          <p className="text-slate-700 dark:text-slate-200">{recommendation}</p>
          <p className="text-slate-600 dark:text-slate-300">
            Current calculator signal: <span className="font-medium">{headlineMetric}</span> = <span className="font-medium">{headlineValue}</span>
          </p>
          <button type="button" className="btn-primary" onClick={() => setStep('email')}>
            Get your full plan + weekly actions
          </button>
        </div>
      ) : null}

      {step === 'email' ? (
        <form className="mt-4 space-y-3" onSubmit={submitEmail} aria-busy={status === 'loading'}>
          <label htmlFor="personalized-plan-email" className="text-sm font-medium text-slate-800 dark:text-slate-100">
            Email address
          </label>
          <input
            id="personalized-plan-email"
            className="input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
          <button className="btn-primary disabled:opacity-70" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Saving...' : 'Get your full plan + weekly actions'}
          </button>
        </form>
      ) : null}

      {message ? <p className={`mt-3 text-sm ${status === 'error' ? 'text-red-600 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{message}</p> : null}
      {step === 'success' ? <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">You are being redirected to your personalized dashboard.</p> : null}
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Every weekly email includes one action, one scenario, and one mistake to avoid based on your inputs.</p>
    </section>
  );
}
