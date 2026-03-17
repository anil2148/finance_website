'use client';

import { FormEvent, useState } from 'react';

type NewsletterFormProps = {
  className?: string;
  source?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm({ className }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

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
    <form onSubmit={submit} className={`card space-y-3 ${className ?? ""}`}>
      <h3 className="text-lg font-semibold">Subscribe to the newsletter</h3>
      <p className="text-sm text-slate-600">Get one concise weekly email with calculator walkthroughs, rate-watch insights, and actionable money moves.</p>
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
        {status === 'loading' ? 'Submitting...' : 'Subscribe'}
      </button>
      {message ? (
        <p className={status === 'success' ? 'alert-success' : 'text-sm text-red-600'} role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
    </form>
  );
}
