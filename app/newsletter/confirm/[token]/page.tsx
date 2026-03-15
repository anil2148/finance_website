'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type ConfirmPageProps = {
  params: {
    token: string;
  };
};

type ConfirmState =
  | { status: 'loading'; message: string }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };

export default function NewsletterConfirmPage({ params }: ConfirmPageProps) {
  const [state, setState] = useState<ConfirmState>({
    status: 'loading',
    message: 'Confirming your subscription...'
  });

  useEffect(() => {
    let cancelled = false;

    async function confirmSubscription() {
      try {
        const response = await fetch(`/newsletter/confirm/${encodeURIComponent(params.token)}`, {
          method: 'POST'
        });

        const payload = (await response.json()) as { message?: string; error?: string };

        if (!cancelled) {
          if (response.ok) {
            setState({ status: 'success', message: payload.message ?? 'Your subscription has been confirmed.' });
          } else {
            setState({ status: 'error', message: payload.error ?? 'Confirmation link is invalid or expired.' });
          }
        }
      } catch {
        if (!cancelled) {
          setState({ status: 'error', message: 'Unable to confirm right now. Please try again later.' });
        }
      }
    }

    void confirmSubscription();

    return () => {
      cancelled = true;
    };
  }, [params.token]);

  const isSuccess = state.status === 'success';
  const title = state.status === 'loading' ? 'Confirming your subscription' : isSuccess ? 'Subscription confirmed 🎉' : 'Confirmation failed';

  return (
    <section
      className={`mx-auto max-w-2xl rounded-2xl border p-6 text-center ${
        isSuccess
          ? 'border-emerald-200 bg-emerald-50'
          : state.status === 'loading'
            ? 'border-slate-200 bg-white'
            : 'border-red-200 bg-red-50'
      }`}
    >
      <h1 className={`text-2xl font-bold ${isSuccess ? 'text-emerald-900' : state.status === 'loading' ? 'text-slate-900' : 'text-red-900'}`}>
        {title}
      </h1>
      <p className={`mt-3 text-sm ${isSuccess ? 'text-emerald-800' : state.status === 'loading' ? 'text-slate-700' : 'text-red-800'}`}>
        {state.message}
      </p>
      <Link
        href="/"
        className={`mt-6 inline-block rounded-lg px-4 py-2 font-semibold text-white ${isSuccess ? 'bg-emerald-700' : 'bg-slate-900'}`}
      >
        Return to homepage
      </Link>
    </section>
  );
}
