import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Loans Hub 2026: EMI Stress Testing, Borrowing Limits, and Home Loan Trade-offs',
  description:
    'Use this India loans hub to size safe EMI, compare home and personal loan offers, and avoid eligibility-led overborrowing.',
  pathname: '/in/loans'
});

const loanScenarios = [
  {
    loan: '₹40L home loan',
    setup: 'In-hand ₹90k, 20 years, floating rate',
    failure: 'Plan works only at teaser rate and breaks after +1.0% reset.',
    saferMove: 'Downsize ticket or increase down payment until bad-month EMI remains manageable.'
  },
  {
    loan: '₹60L home loan',
    setup: 'In-hand ₹1.2L, dual-income household',
    failure: 'EMI fine on two salaries, fragile if one income pauses for 2 months.',
    saferMove: 'Run single-income month simulation and hold 6-month reserve before booking.'
  },
  {
    loan: '₹90L+ home loan',
    setup: 'In-hand ₹1.7L+, metro city purchase',
    failure: 'Ignoring interior, maintenance, and schooling cost stack post-possession.',
    saferMove: 'Model total housing cost, not just EMI, before sanction acceptance.'
  }
];

const nextSteps = {
  calculators: [
    { href: '/in/calculators/emi-calculator', label: 'Run EMI calculator with +0.5% and +1.0% rate shocks' }
  ],
  comparisons: [
    { href: '/in/home-loan-interest-rates-india', label: 'Compare home-loan rate and reset structures' },
    { href: '/in/personal-loan-comparison-india', label: 'Compare personal-loan fee stack and tenure trade-offs' }
  ],
  deepGuides: [
    { href: '/in/real-estate', label: 'Real-estate checklist before booking' },
    { href: '/in/rent-vs-buy-india', label: 'Rent vs buy decision framework (India)' },
    { href: '/in/blog/home-loan-rates-2026', label: 'Home-loan stress-test guide' }
  ]
};

export default function IndiaLoansHubPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What EMI is usually safe for Indian households?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Many households target total EMI around 25% to 35% of take-home income, but the right number depends on job stability and emergency reserves.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is bank eligibility the same as affordability?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Eligibility is what the lender may sanction, while affordability is what your monthly budget can survive in bad months.'
        }
      },
      {
        '@type': 'Question',
        name: 'What should I check before signing a loan offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Review floating-rate reset rules, processing and insurance charges, foreclosure terms, and whether EMI stays manageable after a rate shock.'
        }
      }
    ]
  };

  return (
    <section className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India • Loans decision hub</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">India Loans Hub: borrow for resilience, not just sanction size</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Who this page is for: first-time home buyers, upgrade buyers, and personal-loan applicants. <strong>Core rule:</strong> bank eligibility is not the same as safe affordability.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Borrowing framework you can actually execute</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
          <li><strong>Step 1:</strong> Run EMI at current rate, then +0.5% and +1.0%.</li>
          <li><strong>Step 2:</strong> Add all housing costs (maintenance, insurance, commuting, furnishing).</li>
          <li><strong>Step 3:</strong> Test one bad month (bonus delay, medical spend, or one-income period).</li>
          <li><strong>Step 4:</strong> Only then compare lenders, fees, and reset clauses.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">₹ loan scenarios and failure modes</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {loanScenarios.map((item) => (
            <article key={item.loan} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{item.loan}</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">{item.setup}</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><strong>Where it goes wrong:</strong> {item.failure}</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><strong>Safer move:</strong> {item.saferMove}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Good fit signals</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-900/90 dark:text-emerald-100/90">
            <li>Emergency reserve remains intact after down payment and fees.</li>
            <li>EMI remains manageable even in stress-rate scenarios.</li>
            <li>You can prepay strategically without breaking monthly liquidity.</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 dark:border-rose-500/30 dark:bg-rose-500/10">
          <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100">Bad fit signals</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-900/90 dark:text-rose-100/90">
            <li>You need perfect income stability for EMI to work.</li>
            <li>You have to pause insurance or emergency savings to service the loan.</li>
            <li>You are ignoring processing, legal, and reset-cost clauses.</li>
          </ul>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Calculator pathway</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {nextSteps.calculators.map((item) => (
              <li key={item.href}><Link href={item.href} className="content-link">{item.label}</Link></li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Comparison pathway</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {nextSteps.comparisons.map((item) => (
              <li key={item.href}><Link href={item.href} className="content-link">{item.label}</Link></li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Related deep guides</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {nextSteps.deepGuides.map((item) => (
              <li key={item.href}><Link href={item.href} className="content-link">{item.label}</Link></li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">What EMI is usually safe for Indian households?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Many households target total EMI at 25–35% of take-home income, but the right number depends on job stability, income variability, and how much emergency reserve remains after down payment.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">Is bank eligibility the same as affordability?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">No. Eligibility is the maximum the lender may sanction based on income multiples. Affordability is what your monthly budget can survive in bad months — after accounting for rate resets, medical spend, or income gaps.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">What should I check before signing a loan offer?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Review floating-rate reset rules, processing and insurance charges, foreclosure terms, and whether EMI stays manageable after a rate shock. Request the full sanction letter terms before signing, not just the rate headline.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">Should I prepay my home loan or invest the surplus?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">If your loan rate is above 9%, prepayment often beats investment returns net of tax. Below that threshold, compare post-tax return on investments against post-tax cost of the loan. Keep emergency reserves intact either way — never prepay at the cost of liquidity.</dd>
          </div>
        </dl>
      </section>

      <IndiaAuthorityNote />
    </section>
  );
}
