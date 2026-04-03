import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Banking Hub 2026: Build Liquidity, Reduce Fee Leakage, and Choose Safer Account Systems',
  description:
    'Use this India banking hub to design emergency-liquidity buckets, reduce avoidable account fees, and connect decisions to calculators and comparison pages.',
  pathname: '/in/banking'
});

const scenarioRows = [
  {
    salary: '₹8L–₹12L annual (₹67k–₹1L/month)',
    mistake: 'Keeping only one account and losing control of bill, spend, and emergency buckets.',
    framework: 'Create separate salary, bills, and reserve buckets with automation on salary day.',
    startingPlan: 'Start with 70/20/10 flow: essentials / goals / cushion. Emergency fund target: 3 months expenses in liquid savings.'
  },
  {
    salary: '₹12L–₹18L annual (₹1L–₹1.5L/month)',
    mistake: 'Chasing high FD rates while paying hidden card penalties and missing liquidity windows.',
    framework: 'Prioritize fee transparency and liquidity before yield optimization.',
    startingPlan: 'Audit quarterly charges, disable optional paid add-ons, and keep 4–5 month emergency reserve accessible.'
  },
  {
    salary: '₹18L–₹25L+ annual (₹1.5L–₹2L+/month)',
    mistake: 'Over-fragmenting across multiple products without a clear operating system.',
    framework: 'Use one operating account, one reserve account, and deliberate SIP/investment pipelines.',
    startingPlan: 'Document transfer rules, build 6-month reserve, and handle bad-month exceptions without breaking investment cadence.'
  }
];

const pathwayLinks = {
  calculators: [
    { href: '/in/calculators/emi-calculator', label: 'Stress-test EMI before increasing fixed obligations' },
    { href: '/in/calculators/sip-calculator', label: 'Model SIP contribution ranges for long-term goals' }
  ],
  comparisons: [
    { href: '/in/best-savings-accounts-india', label: 'Compare savings-account reliability, limits, and fee terms' },
    { href: '/in/fixed-deposit-vs-sip-india', label: 'Compare FD vs SIP by liquidity and horizon fit' }
  ],
  deepGuides: [
    { href: '/in/investing', label: 'India investing hub: process over prediction' },
    { href: '/in/loans', label: 'India loans hub: safe borrowing thresholds' },
    { href: '/in/blog', label: 'Read India-focused finance guides' }
  ]
};

export default function BankingPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How should Indian households structure everyday banking?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Many households do best with separate salary, bills, and emergency buckets so monthly cashflow remains stable and spending leakage is easier to detect.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is a common banking mistake in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A common mistake is optimizing for headline interest rates before checking fee terms, penalties, and liquidity needs for bad-month scenarios.'
        }
      },
      {
        '@type': 'Question',
        name: 'When should I add more banking products?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Add new products only after your base banking workflow is stable, automated, and reviewed periodically for hidden charges and friction.'
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
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Emergency fund: do this before anything else</h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Build 3–6 months of core expenses in a liquid savings account before chasing FD rates or equity returns. For a household spending ₹50,000/month, that means ₹1.5L–₹3L parked and accessible — not in a 2-year FD you cannot break without penalty.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            <li>Self-employed or variable income? Target 6 months minimum.</li>
            <li>Single income household? Target 6–9 months before investing extra surplus.</li>
            <li>Until the reserve is funded, new investments can wait.</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Credit card traps to avoid</h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Reward points rarely justify carrying a balance. At 36–42% annual interest on rollovers, a ₹20,000 unpaid balance costs ₹600–₹700/month in interest — far more than points ever return.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            <li>Pay full statement balance monthly, not minimum due.</li>
            <li>Do not use credit cards as a bridge loan for salary-day shortfalls.</li>
            <li>Annual fee cards only make sense when benefits exceed fee by 2× or more.</li>
          </ul>
        </article>
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
              <li key={item.href}><Link href={item.href} className="content-link">{item.label}</Link></li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Comparison pathways</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {pathwayLinks.comparisons.map((item) => (
              <li key={item.href}><Link href={item.href} className="content-link">{item.label}</Link></li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Related deep guides</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {pathwayLinks.deepGuides.map((item) => (
              <li key={item.href}><Link href={item.href} className="content-link">{item.label}</Link></li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">How should Indian households structure everyday banking?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Many households do best with separate salary, bills, and emergency buckets so monthly cashflow remains stable and spending leakage is easier to detect. Automate transfers on salary day to remove manual decisions.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">What is a common banking mistake in India?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Optimizing for headline interest rates before checking fee terms, penalties, and liquidity needs for bad-month scenarios. A 0.5% higher rate can disappear quickly if quarterly maintenance or penalty charges apply.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">When should I add more banking products?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Add new products only after your base banking workflow is stable, automated, and reviewed periodically for hidden charges and friction. Fragmented accounts without clear rules create confusion during high-expense months.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">How much emergency fund should I keep in a bank savings account?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">A common target is 3–6 months of core household expenses in a liquid, accessible account — not locked in FDs. If your income is variable or you are self-employed, 6 months is a safer floor.</dd>
          </div>
        </dl>
      </section>

      <IndiaAuthorityNote />
    </section>
  );
}
