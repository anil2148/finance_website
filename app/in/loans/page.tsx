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

      <IndiaAuthorityNote />

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

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">The full fee stack: what lenders actually charge</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Most borrowers compare only interest rates. The true cost of a loan includes fees that rarely appear in the headline offer.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Fee type</th>
                <th className="px-3 py-2">Typical range</th>
                <th className="px-3 py-2">On a ₹50L loan</th>
                <th className="px-3 py-2">Watch out for</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 align-top dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Processing fee</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">0.25%–1% of loan</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">₹12,500–₹50,000</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Non-refundable if offer is rejected or you switch lender</td>
              </tr>
              <tr className="border-b border-slate-100 align-top dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Loan insurance (HLPP)</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">0.5%–1.5% of loan</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">₹25,000–₹75,000</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Often bundled at disbursal — not mandatory, negotiate separately</td>
              </tr>
              <tr className="border-b border-slate-100 align-top dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Legal / technical fee</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">₹5,000–₹15,000</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">₹5,000–₹15,000</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Paid regardless of whether loan is finally sanctioned</td>
              </tr>
              <tr className="align-top">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Foreclosure / prepayment charge</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">0% (floating) to 2–3% (fixed)</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">₹0–₹1,00,000+</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Always choose floating-rate loans to preserve free prepayment option</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Add all upfront fees to your total borrowing cost before comparing lender offers on interest rate alone.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Prepayment vs flexibility: a common trade-off</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">When prepayment wins</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              <li>Your home loan rate is above 9% — prepayment effectively delivers a guaranteed post-tax return at that rate.</li>
              <li>Prepaying reduces tenure, not EMI — this is usually more interest-efficient over a 20-year horizon.</li>
              <li>You have a bonus or windfall that will sit idle in a low-yield savings account otherwise.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">When flexibility wins</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              <li>Your loan rate is below 8.5% and long-term SIP returns are reasonably above that post-tax.</li>
              <li>Your emergency fund is below 6 months — never prepay at the cost of liquidity.</li>
              <li>A near-term goal (child education, renovation) needs capital within 3–5 years.</li>
            </ul>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">A ₹10L prepayment on a ₹50L, 20-year loan at 9% saves roughly ₹14L–₹16L in interest over tenure. Run your scenario in the <Link href="/in/calculators/emi-calculator" className="content-link">EMI calculator</Link> before deciding.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">India loans journey: from eligibility to execution</h2>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          Start with the <Link href="/in/calculators/emi-calculator" className="content-link">EMI calculator</Link> at current rate and then at +1% — this sets your safe borrowing ceiling before any lender talks.
          Then compare offers using the <Link href="/in/home-loan-interest-rates-india" className="content-link">home-loan rate comparison</Link> to find floating-rate options without heavy fee stacks.
        </p>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          If you are deciding between buying now vs waiting, read the <Link href="/in/real-estate" className="content-link">real-estate hub</Link> for full cost clarity. And once the loan is active, the <Link href="/in/banking" className="content-link">banking hub</Link> will help you maintain emergency liquidity alongside EMI obligations.
        </p>
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
    </section>
  );
}
