'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { Card } from '@/components/ui/card';

const supportEmail = 'support@financesphere.io';

export function ContactPageContent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('General support');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = `[${topic}] Support request from ${name || 'FinanceSphere user'}`;
    const body = [
      `Name: ${name || 'N/A'}`,
      `Email: ${email || 'N/A'}`,
      `Topic: ${topic}`,
      '',
      message || 'No message entered.'
    ].join('\n');

    window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('submitted');
  };

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-950 via-blue-900 to-indigo-900 text-white">
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div className="space-y-4">
            <p className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
              Contact FinanceSphere
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Need help with a calculator, guide, or comparison?</h1>
            <p className="max-w-2xl text-sm text-blue-100 sm:text-base">
              Reach our editorial and support team for product feedback, tool issues, and content questions. We usually respond within <strong>1–2 business days</strong>.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <a href={`mailto:${supportEmail}`} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-semibold text-white transition hover:bg-white/20">
                {supportEmail}
              </a>
              <Link href="/help" className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-semibold text-white transition hover:bg-white/20">
                Explore Help Center first
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <Image
              src="/images/contact-support-illustration.svg"
              alt="Illustration of customer support contact options"
              width={420}
              height={320}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Send us a message</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Share as much context as possible (page URL, calculator name, or question) so we can help quickly.</p>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Name
                <input
                  className="input"
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>

              <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Email
                <input
                  className="input"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
            </div>

            <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              Topic
              <select className="input" value={topic} onChange={(event) => setTopic(event.target.value)}>
                <option>General support</option>
                <option>Calculator question</option>
                <option>Comparison page feedback</option>
                <option>Partnership inquiry</option>
                <option>Bug report</option>
              </select>
            </label>

            <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              Message
              <textarea
                className="input min-h-36"
                name="message"
                required
                placeholder="Tell us what you need help with..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" className="btn-primary">
                Send message
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-400">By submitting, your email app will open a pre-filled message to our support team.</p>
            </div>
          </form>

          {status === 'submitted' && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200">
              Thanks! If your mail app did not open, send your message directly to {supportEmail}.
            </p>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Popular help topics</h2>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <li>
                <Link className="font-medium text-brand hover:underline" href="/help">
                  Choosing the right calculator for your goal
                </Link>
              </li>
              <li>
                <Link className="font-medium text-brand hover:underline" href="/comparison">
                  Comparing rates, fees, and product fit
                </Link>
              </li>
              <li>
                <Link className="font-medium text-brand hover:underline" href="/blog">
                  Learning path for savings and investing basics
                </Link>
              </li>
            </ul>
          </Card>

          <Card className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Other contact options</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              For partnerships and ad opportunities, review our media materials first.
            </p>
            <Link className="inline-flex rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-200" href="/media-kit">
              Open Media Kit
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
