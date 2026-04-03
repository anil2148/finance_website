import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Banking Hub 2026: Savings, FDs, Fee Leakage, and Monthly Liquidity Decisions',
  description:
    'Build a resilient India banking setup: emergency runway first, then savings accounts, FD ladders, and card usage with practical ₹ scenarios.',
  pathname: '/in/banking'
});

const pathwayLinks = {
  calculators: [
    { href: '/in/calculators/sip-calculator', label: 'Run SIP capacity calculator (₹5k / ₹10k / ₹20k)' },
    { href: '/in/calculators/emi-calculator', label: 'Stress-test EMI before fixed commitments' }
  ],
  comparisons: [
    { href: '/in/best-savings-accounts-india', label: 'Compare savings accounts in India' },
    { href: '/in/best-fixed-deposits-india', label: 'Compare fixed deposits by tenure' },
    { href: '/in/fixed-deposit-vs-sip-india', label: 'Decide FD vs SIP by timeline' }
  ],
  deepGuides: [
    { href: '/in/blog/emergency-fund-india', label: 'Emergency fund sizing guide' },
    { href: '/in/blog/high-yield-savings-india', label: 'Rate chasing without fee traps' },
    { href: '/in/loans', label: 'Loans hub for EMI-linked banking decisions' }
  ]
};

const scenarioRows = [
  {
    salary: '₹8L (≈ ₹55k/month in-hand)',
    mistake: 'Keeping everything in one account and paying avoidable penalty fees.',
    framework: 'Split money into salary account + emergency bucket + bill buffer.',
    startingPlan: '₹15k emergency refill, ₹5k SIP, ₹3k goal-based recurring transfer.'
  },
  {
    salary: '₹12L (≈ ₹78k/month in-hand)',
    mistake: 'Locking too much in long-tenure FD with no monthly liquidity plan.',
    framework: 'Build 4–6 month reserve, then ladder FDs in smaller chunks.',
    startingPlan: '₹25k reserve top-up, ₹10k SIP, ₹10k short-tenure FD ladder.'
  },
  {
    salary: '₹18L (≈ ₹1.15L/month in-hand)',
    mistake: 'Optimizing card rewards while rolling balances at high interest.',
    framework: 'Protect cashflow first, then optimize rewards and yield.',
    startingPlan: 'No revolver debt, ₹20k SIP, 6-month reserve and fee audit.'
  },
  {
    salary: '₹25L+ (≈ ₹1.5L+/month in-hand)',
    mistake: 'Chasing small yield differences while liquidity is fragile.',
    framework: 'Create liquidity tiers and automate transfers by goal horizon.',
    startingPlan: '6+ month reserve, ₹20k+ SIP, FD buckets for 12–24 month goals.'
  }
];

export default function IndiaBankingHubPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Should I pick the highest savings account interest rate?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Only after checking minimum balance rules, fee penalties, and how often your account balance drops during the month.'
        }
      },
      {
        '@type': 'Question',
        name: 'When should I use FD instead of SIP?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use FD for goals within 3 years or money you cannot afford to fluctuate. Use SIP for long-term goals where volatility is acceptable.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the biggest banking leak for Indian households?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Recurring fees and card interest leaks that feel small monthly but become large annual drag on investable surplus.'
        }
      }
    ]
  };

  return (
    <section className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India • Banking decision hub</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">India Banking Hub: build a cashflow-safe system before optimizing returns</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          This page is for salaried households, dual-income families, and self-employed professionals who want fewer money leaks and stronger monthly resilience.
          <strong> Costly mistake:</strong> optimizing yield before protecting liquidity.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Decision framework (India banking)</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700 dark:text-slate-300">
          <li><strong>Protect essentials first:</strong> Keep emergency reserves in accessible, low-friction accounts.</li>
          <li><strong>Stop fee leakage:</strong> Audit SMS, maintenance, card, and ATM penalties every quarter.</li>
          <li><strong>Separate horizons:</strong> 0–3 year goals in stable buckets; 7+ year goals can use SIP.</li>
          <li><strong>Pressure test:</strong> If this plan fails in a bad month, it is too aggressive.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">₹ scenarios: where plans usually break</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Salary band</th>
                <th className="px-3 py-2">Common costly mistake</th>
                <th className="px-3 py-2">Better framework</th>
                <th className="px-3 py-2">Practical starting plan</th>
              </tr>
            </thead>
            <tbody>
              {scenarioRows.map((row) => (
                <tr key={row.salary} className="border-b border-slate-100 align-top dark:border-slate-800">
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{row.salary}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.mistake}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.framework}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.startingPlan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Good fit</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-900/90 dark:text-emerald-100/90">
            <li>You want monthly predictability and clear money buckets.</li>
            <li>You can automate transfers right after salary credit.</li>
            <li>You review fees and card interest before chasing reward points.</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 dark:border-rose-500/30 dark:bg-rose-500/10">
          <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100">Bad fit</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-900/90 dark:text-rose-100/90">
            <li>You frequently dip into overdraft or card rollovers to survive month-end.</li>
            <li>You lock most surplus into long FD tenure without liquidity backup.</li>
            <li>You optimize headline rate while ignoring terms that create penalties.</li>
          </ul>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Calculator pathways</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {pathwayLinks.calculators.map((item) => (
              <li key={item.href}><Link href={item.href} className="text-blue-600 hover:underline dark:text-blue-400">{item.label}</Link></li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Comparison pathways</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {pathwayLinks.comparisons.map((item) => (
              <li key={item.href}><Link href={item.href} className="text-blue-600 hover:underline dark:text-blue-400">{item.label}</Link></li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Related deep guides</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {pathwayLinks.deepGuides.map((item) => (
              <li key={item.href}><Link href={item.href} className="text-blue-600 hover:underline dark:text-blue-400">{item.label}</Link></li>
            ))}
          </ul>
        </article>
      </section>

      <IndiaAuthorityNote />
    </section>
  );
}
