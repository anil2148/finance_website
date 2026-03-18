'use client';

import { FormEvent, useState } from 'react';
import { isValidEmail, normalizeEmail } from '@/lib/newsletter/validation';

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

function getClientErrorMessage(response: NewsletterApiResponse) {
  if (response.success || !response.error?.code) {
    return response.success ? response.message ?? "You're subscribed. Check your inbox for the confirmation email." : 'Unable to process subscription right now.';
  }

  switch (response.error.code) {
    case 'INVALID_EMAIL':
      return 'Please enter a valid email address.';
    case 'TOKEN_CONFIG_ERROR':
      return 'Newsletter setup is currently unavailable. Please try again later.';
    case 'EMAIL_PROVIDER_ERROR':
      return 'Unable to send confirmation email right now. Please try again in a moment.';
    default:
      return response.error.message ?? 'Could not subscribe right now. Please try again in a moment.';
  }
}

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();

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
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ email: normalizedEmail })
      });

      const payload = (await res.json()) as NewsletterApiResponse;

      if (!res.ok) {
        setStatus('error');
        setMessage(getClientErrorMessage(payload));
        return;
      }

      const successMessage = payload.success ? payload.message : undefined;
      setStatus('success');
      setMessage(successMessage ?? "You're subscribed. Check your inbox for the confirmation email.");
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again in a moment.');
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-3">
      <h3 className="text-lg font-semibold">Get FinanceSphere updates</h3>
      <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <button className="btn-primary disabled:opacity-70" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting...' : 'Subscribe'}
      </button>
      {message && <p className={status === 'success' ? 'alert-success' : status === 'loading' ? 'text-sm text-slate-600' : 'text-sm text-red-600'}>{message}</p>}
    </form>
  );
}
