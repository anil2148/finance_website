'use client';

import { FormEvent, useMemo, useState } from 'react';

type NewsletterFormProps = {
  className?: string;
  source?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const copyBySource: Record<string, { title: string; description: string; button: string }> = {
  homepage: {
    title: 'Get weekly planning ideas',
    description: 'Receive one short email each week with practical calculator use-cases for debt, savings, and long-term planning.',
    button: 'Send weekly ideas'
  },
  blog: {
    title: 'Get new guides in your inbox',
    description: 'Get updates when we publish practical explainers on mortgages, credit cards, saving, and investing basics.',
    button: 'Send blog updates'
  }
};

const defaultCopy = {
  title: 'Subscribe to the newsletter',
  description: 'Get one concise weekly email with calculator walkthroughs, rate-watch insights, and actionable money moves.',
  button: 'Subscribe'
};

export function NewsletterForm({ className, source }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const copy = useMemo(() => (source ? copyBySource[source] ?? defaultCopy : defaultCopy), [source]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailPattern.test(email.trim())) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const payload = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        setStatus('error');
        setMessage(payload.error ?? 'Unable to subscribe right now.');
        return;
      }

      setStatus('success');
      setEmail('');
      setMessage(payload.message ?? 'Check your email to confirm subscription.');
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <form onSubmit={submit} className={`card space-y-3 ${className ?? ''}`}>
      <h3 className="text-lg font-semibold">{copy.title}</h3>
      <p className="text-sm text-slate-600">{copy.description}</p>
      <input
        className="input"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        aria-label="Email address"
      />
      <button className="btn-primary disabled:opacity-70" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting...' : copy.button}
      </button>
      {message ? (
        <p className={status === 'success' ? 'alert-success' : 'text-sm text-red-600'} role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
    </form>
  );
}
