'use client';

import Link from 'next/link';
import { AICopilotPreview } from '@/components/home/AICopilotPreview';
import { DecisionOnboarding } from '@/components/home/DecisionOnboarding';
import { DecisionDashboardPreview } from '@/components/home/DecisionDashboardPreview';
import { SocialProofSection } from '@/components/home/SocialProofSection';
import { HomeCalculatorsSection } from '@/components/home/HomeCalculatorsSection';
import { NewsletterForm } from '@/components/NewsletterForm';
import { trackEvent } from '@/lib/analytics';

export function HomepageLayout() {
  return (
    <section className="space-y-6 pb-24" aria-label="FinanceSphere homepage">
      <AICopilotPreview />

      <DecisionOnboarding />

      <DecisionDashboardPreview />

      <HomeCalculatorsSection />

      <section className="grid gap-4 md:grid-cols-3" aria-label="Decision platform highlights">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Cards over walls of text</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Decision cards summarize cost, downside, and next action in one view.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Graphs and sliders</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Scenario bars and risk sliders make trade-offs obvious in seconds.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Fast loading</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Heavy calculator previews are lazy loaded to help keep LCP under 2.5s.</p>
        </article>
      </section>

      <SocialProofSection />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-label="Primary navigation hubs">
        <h2 className="text-xl font-semibold">Explore by workflow</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/comparison" className="rounded-full border border-slate-300 px-3 py-1 font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">Decisions</Link>
          <Link href="/calculators" className="rounded-full border border-slate-300 px-3 py-1 font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">Calculators</Link>
          <Link href="/learn" className="rounded-full border border-slate-300 px-3 py-1 font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">Learn</Link>
          <Link href="/ai-money-copilot" className="rounded-full border border-slate-300 px-3 py-1 font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">AI Copilot</Link>
        </div>
      </section>

      <NewsletterForm source="homepage" className="scroll-mt-24" />

      <div className="fixed inset-x-0 bottom-3 z-20 px-4 md:hidden">
        <Link
          href="/ai-money-copilot"
          onClick={() => trackEvent({ event: 'cta_click', category: 'mobile_sticky', label: 'start_first_decision_sticky' })}
          className="block rounded-xl bg-cyan-400 px-4 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg"
        >
          Start Your First Decision
        </Link>
      </div>
    </section>
  );
}
