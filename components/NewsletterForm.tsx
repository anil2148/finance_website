'use client';

import { FormEvent, useMemo, useState } from 'react';
import { isValidEmail, normalizeEmail } from '@/lib/newsletter/validation';
import { trackEvent } from '@/lib/analytics';

type NewsletterFormProps = {
  className?: string;
  source?: string;
  leadMagnet?: string;
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

const copyBySource: Record<string, { title: string; description: string; button: string }> = {
  homepage: {
    title: 'One email. One decision. Every week.',
    description:
      'Each issue walks through a real scenario — mortgage timing, card choice, or debt payoff order — with actual numbers you can apply to your situation.',
    button: 'Send me the playbook →'
  },
  'india-homepage': {
    title: 'One email. One decision. Every week.',
    description:
      'Each issue walks through a real scenario — mortgage timing, card choice, or debt payoff order — with actual numbers you can apply to your situation.',
    button: 'Send me the playbook →'
  },
  blog: {
    title: 'Get new guides in your inbox',
    description: 'Choose a focus area and get playbooks, checklists, and monthly updates.',
    button: 'Unlock free guide'
  }
};

const defaultCopy = {
  title: 'Subscribe to the newsletter',
  description: 'Get one concise weekly email with calculator walkthroughs, rate-watch insights, and actionable money moves.',
  button: 'Subscribe'
};

function getClientErrorMessage(response: NewsletterApiResponse) {
  if (response.success || !response.error?.code) {
    return response.success ? response.message ?? "You're subscribed. Check your inbox for future guides and updates." : 'Unable to process subscription right now.';
  }

  switch (response.error.code) {
    case 'INVALID_EMAIL':
      return 'Please enter a valid email address.';
    case 'INVALID_JSON':
    case 'INVALID_CONTENT_TYPE':
      return 'Something went wrong while submitting the form. Please refresh and try again.';
    case 'NEWSLETTER_CONFIG_MISSING':
      return 'Newsletter signup is temporarily unavailable. Please try again soon.';
    case 'RATE_LIMITED':
      return 'Too many signup attempts right now. Please wait a moment and try again.';
    case 'PROVIDER_ERROR':
      return 'Unable to subscribe right now. Please try again in a moment.';
    default:
      return response.error.message ?? 'Unable to process subscription right now.';
  }
}

export function NewsletterForm({ className, source, leadMagnet = 'weekly-finance-playbook' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [persona, setPersona] = useState('beginner');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const copy = useMemo(() => (source ? copyBySource[source] ?? defaultCopy : defaultCopy), [source]);
  const isHomepageCapture = source === 'homepage' || source === 'india-homepage';

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === 'loading') {
      return;
    }

    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('Subscribing...');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ email: normalizedEmail, source: source ?? 'unknown', persona, leadMagnet })
      });

      const payload = (await response.json()) as NewsletterApiResponse;

      if (!response.ok) {
        setStatus('error');
        setMessage(getClientErrorMessage(payload));
        return;
      }

      trackEvent({
        event: 'newsletter_signup',
        category: 'lead_capture',
        label: source ?? 'unknown',
        metadata: { persona, lead_magnet: leadMagnet }
      });

      const successMessage = payload.success ? payload.message : undefined;
      setStatus('success');
      setEmail('');
      setMessage(successMessage ?? "You're subscribed. Check your inbox for future guides and updates.");
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  if (isHomepageCapture) {
    return (
      <form onSubmit={submit} className={`card ${className ?? ''}`} aria-busy={status === 'loading'}>
        <div className="grid gap-6 md:grid-cols-5 md:gap-8">
          <div className="space-y-4 md:col-span-3">
            <h3 className="text-2xl font-semibold leading-tight text-slate-900 dark:text-slate-100">{copy.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{copy.description}</p>

            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              {[
                'A worked example with real dollar amounts',
                'The calculator walkthrough behind it',
                'One action you can take this week'
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="newsletter-email"
                  className="input sm:flex-1"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={status === 'error'}
                />
                <button className="btn-primary whitespace-nowrap disabled:opacity-70" type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Subscribing...' : copy.button}
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">No spam. Unsubscribe in one click.</p>
            </div>
          </div>

          <div className="space-y-4 md:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Weekly Decision Brief</p>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Issue #12: Should I buy or rent in 2026?</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">We compare a $425,000 starter home vs renting at $2,350/month and break down the 5-year cash impact.</p>
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-slate-800 dark:text-slate-100">Personalise your first issue:</legend>
              <select id="newsletter-persona" className="input" value={persona} onChange={(event) => setPersona(event.target.value)}>
                <option value="beginner">I am building the basics</option>
                <option value="debt-payoff">I am focused on debt payoff</option>
                <option value="investing">I am focused on investing</option>
              </select>
            </fieldset>
          </div>
        </div>

        {message ? (
          <p className={`mt-3 ${status === 'success' ? 'alert-success' : status === 'loading' ? 'text-sm text-slate-600 dark:text-slate-300' : 'text-sm text-red-600 dark:text-red-300'}`} role="status" aria-live="polite">
            {message}
          </p>
        ) : null}
      </form>
    );
  }

  return (
    <form onSubmit={submit} className={`card space-y-3 ${className ?? ''}`} aria-busy={status === 'loading'}>
      <h3 className="text-lg font-semibold">{copy.title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">{copy.description}</p>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-800 dark:text-slate-100">What best describes your current goal?</legend>
        <p id="newsletter-persona-help" className="text-xs text-slate-500 dark:text-slate-400">Choose one focus so we can send the most relevant planning playbooks.</p>
        <select id="newsletter-persona" aria-describedby="newsletter-persona-help" className="input" value={persona} onChange={(event) => setPersona(event.target.value)}>
          <option value="beginner">I am building the basics</option>
          <option value="debt-payoff">I am focused on debt payoff</option>
          <option value="investing">I am focused on investing</option>
        </select>
      </fieldset>

      <label htmlFor="newsletter-email" className="text-sm font-medium text-slate-800 dark:text-slate-100">
        Email address
      </label>
      <input
        id="newsletter-email"
        className="input"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        aria-invalid={status === 'error'}
      />
      <button className="btn-primary disabled:opacity-70" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing...' : copy.button}
      </button>

      <p className="text-xs text-slate-500 dark:text-slate-400">Lead magnet: <span className="font-medium">{leadMagnet.replace(/-/g, ' ')}</span></p>
      {message ? (
        <p className={status === 'success' ? 'alert-success' : status === 'loading' ? 'text-sm text-slate-600 dark:text-slate-300' : 'text-sm text-red-600 dark:text-red-300'} role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
    </form>
  );
}
