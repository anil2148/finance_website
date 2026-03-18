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
    title: 'Get weekly planning ideas',
    description: 'Receive one concise weekly email with calculator walkthroughs, offer updates, and practical actions you can take this week.',
    button: 'Get weekly ideas'
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
    return response.success ? response.message ?? 'Check your email to confirm subscription.' : 'Unable to process subscription right now.';
  }

  switch (response.error.code) {
    case 'INVALID_EMAIL':
      return 'Please enter a valid email address.';
    case 'INVALID_JSON':
    case 'INVALID_CONTENT_TYPE':
      return 'Something went wrong while submitting the form. Please refresh and try again.';
    case 'TOKEN_CONFIG_ERROR':
      return 'Newsletter setup is currently unavailable. Please try again later.';
    case 'EMAIL_PROVIDER_ERROR':
      return 'Unable to send confirmation email right now. Please try again in a moment.';
    default:
      return response.error.message ?? 'Unable to process subscription right now.';
  }
}

export function NewsletterForm({ className, source, leadMagnet = 'weekly-finance-playbook' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [persona, setPersona] = useState('beginner');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [step, setStep] = useState<1 | 2>(1);
  const [message, setMessage] = useState('');
  const copy = useMemo(() => (source ? copyBySource[source] ?? defaultCopy : defaultCopy), [source]);

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
    setMessage('Submitting...');

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
      setMessage(successMessage ?? 'Check your email to confirm subscription.');
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <form onSubmit={submit} className={`card space-y-3 ${className ?? ''}`} aria-busy={status === 'loading'}>
      <h3 className="text-lg font-semibold">{copy.title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">{copy.description}</p>

      {step === 1 ? (
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-800 dark:text-slate-100" htmlFor="newsletter-persona">What best describes your current goal?</label>
          <select id="newsletter-persona" className="input" value={persona} onChange={(event) => setPersona(event.target.value)}>
            <option value="beginner">I am building the basics</option>
            <option value="debt-payoff">I am focused on debt payoff</option>
            <option value="investing">I am focused on investing</option>
          </select>
          <button type="button" className="btn-primary" onClick={() => setStep(2)}>Continue</button>
        </div>
      ) : (
        <>
          <input
            className="input"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            aria-invalid={status === 'error'}
          />
          <button className="btn-primary disabled:opacity-70" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Submitting...' : copy.button}
          </button>
        </>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400">Lead magnet: <span className="font-medium">{leadMagnet.replace(/-/g, ' ')}</span></p>
      {message ? (
        <p className={status === 'success' ? 'alert-success' : status === 'loading' ? 'text-sm text-slate-600 dark:text-slate-300' : 'text-sm text-red-600 dark:text-red-300'} role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
    </form>
  );
}
