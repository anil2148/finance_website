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
    setup: 'In-hand ₹90k/month, single-income household, 20 years, floating rate',
    failure: 'At 8.5%, EMI is ~₹34,700 — manageable at 38% of take-home. After a +1% reset, EMI rises to ~₹37,500. One month with a medical or car expense pushes the household into card rollover.',
    whatBreaks: 'Fragile single-income month. No emergency reserve after down payment. Rate reset at year 3 makes the plan unsustainable.',
    saferMove: 'Downsize ticket to ₹32–₹35L, or increase down payment so post-reset EMI stays below 32% of take-home with 6-month reserve still intact.'
  },
  {
    loan: '₹60L home loan',
    setup: 'Combined in-hand ₹1.4L, dual-income household, 20 years, floating rate',
    failure: 'EMI of ~₹52,000 is fine on two salaries (37% of take-home). If one income pauses for 2 months — maternity, medical leave, job gap — EMI alone consumes 74% of single salary.',
    whatBreaks: 'No single-income survivability tested before booking. Down payment exhausted emergency fund. Dual-income assumed to be permanent.',
    saferMove: 'Run single-income month simulation. Hold 6-month reserve before booking. If single salary cannot service EMI + essentials, the loan is structurally too large for this household.'
  },
  {
    loan: '₹90L+ home loan',
    setup: 'In-hand ₹1.8L+, metro city purchase, 20 years, floating rate',
    failure: 'EMI of ~₹78,000 looks like 43% of take-home — tight but survivable. After adding ₹8,000 maintenance, ₹2,000 property tax, ₹15,000 schooling cost post-possession, and a rate reset to 9.5%, total fixed monthly outflow exceeds ₹1.1L.',
    whatBreaks: 'Post-possession cost stack not modelled. Interior/furnishing budget (₹10–₹18L for bare-shell) not planned. Rate shock + cost stack together exceed monthly surplus.',
    saferMove: 'Model total housing cost including possession-day costs. Preserve a 6-month reserve after all one-time charges. If total housing cost exceeds 50% of take-home, reduce loan or wait until income improves.'
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

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Affordability vs eligibility: the gap that causes most loan regret</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Banks sanction based on income multiples and credit scores. They do not model your school fees, your dependent parents, or what happens if one income pauses for two months. That is your job.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">What eligibility means</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-blue-900/80 dark:text-blue-100/80">
              <li>The maximum loan a lender will sanction given your declared income and credit score.</li>
              <li>Calculated on gross income, not take-home.</li>
              <li>Does not account for your actual monthly obligations or lifestyle expenses.</li>
              <li>A ₹1.5L gross income household can often get ₹80L+ eligibility. That does not mean ₹80L is safe.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 dark:border-rose-500/30 dark:bg-rose-500/10">
            <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-100">What affordability means</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-900/80 dark:text-rose-100/80">
              <li>The loan size where EMI fits monthly cashflow without breaking in a bad month.</li>
              <li>Calculated on actual take-home after tax, PF, and existing obligations.</li>
              <li>Accounts for rate resets: +0.5% and +1.0% above current rate.</li>
              <li>Leaves emergency reserve intact, not depleted, after down payment and fees.</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-300">Bank approval is not proof of affordability. Use the <Link href="/in/calculators/emi-calculator" className="content-link">EMI calculator</Link> to find your own ceiling before any lender conversation.</p>
      </section>

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
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Rate shock: what a 1% increase actually does to your decision</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Floating rate loans reset periodically. A 1% rate increase on a large loan is not a small rounding error — it can shift a manageable EMI into a month-end crisis. Here is what the numbers look like:</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Loan size</th>
                <th className="px-3 py-2">EMI at 8.5% (20 yr)</th>
                <th className="px-3 py-2">EMI at 9.0% (+0.5%)</th>
                <th className="px-3 py-2">EMI at 9.5% (+1.0%)</th>
                <th className="px-3 py-2">Monthly delta at +1%</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 align-top dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">₹30L</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">~₹26,000</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">~₹27,000</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">~₹28,000</td>
                <td className="px-3 py-2 font-medium text-rose-700 dark:text-rose-400">+₹2,000/month</td>
              </tr>
              <tr className="border-b border-slate-100 align-top dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">₹50L</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">~₹43,400</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">~₹45,000</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">~₹46,600</td>
                <td className="px-3 py-2 font-medium text-rose-700 dark:text-rose-400">+₹3,200/month</td>
              </tr>
              <tr className="align-top">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">₹80L</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">~₹69,500</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">~₹72,000</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">~₹74,500</td>
                <td className="px-3 py-2 font-medium text-rose-700 dark:text-rose-400">+₹5,000/month</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">If your current monthly surplus cannot absorb the +1% delta without cutting SIP or emergency savings, your loan size is too aggressive. Run your own numbers in the <Link href="/in/calculators/emi-calculator" className="content-link">EMI calculator</Link>.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">₹ loan scenarios and failure modes</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
        {loanScenarios.map((item) => (
            <article key={item.loan} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{item.loan}</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">{item.setup}</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><strong>Where it goes wrong:</strong> {item.failure}</p>
              <p className="mt-2 text-sm text-rose-800 dark:text-rose-300"><strong>What breaks:</strong> {item.whatBreaks}</p>
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
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">What to verify before comparing lenders</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Comparison is the last step, not the first. Lender comparison only makes sense once you know your safe EMI ceiling and have stress-tested the loan size. Before comparing:</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li><strong>Confirm loan size survives rate shock:</strong> Run +1% scenario in the <Link href="/in/calculators/emi-calculator" className="content-link">EMI calculator</Link>. If cashflow breaks, reduce loan before shopping.</li>
          <li><strong>Check total housing cost, not just EMI:</strong> Add maintenance, insurance, commute change, and interiors. The real cost is 30–50% above EMI for most properties.</li>
          <li><strong>Verify emergency reserve survives down payment:</strong> If booking cost drains all savings, you enter ownership without a buffer for rate resets or income gaps.</li>
          <li><strong>Understand reset clause before rate:</strong> A slightly lower headline rate with quarterly reset terms can cost more over 5 years than a slightly higher rate with annual benchmark reset.</li>
          <li><strong>Check foreclosure terms:</strong> Floating-rate loans from regulated banks in India allow free prepayment. Fixed-rate loans often do not. Know your flexibility before signing.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">When to reduce loan size instead of stretching tenure</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Stretching tenure reduces monthly EMI but dramatically increases total interest paid. A ₹50L loan at 9% over 20 years costs ₹57L in interest. Extended to 30 years, that rises to ₹96L — nearly double the loan amount paid in interest alone. When to reduce loan size instead:</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>The stress-rate EMI (current rate +1%) is already at the edge of survivable cashflow.</li>
          <li>You have no emergency reserve left after down payment — a smaller loan reduces risk more than a longer tenure.</li>
          <li>You are a single-income household — income disruption risk is higher and a smaller EMI provides more real resilience than a longer tenure.</li>
          <li>You plan to prepay aggressively — a smaller loan with shorter tenure saves more interest than a larger loan you prepay after 5 years.</li>
        </ul>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-sm dark:border-amber-500/30 dark:bg-amber-500/10">
          <p className="font-semibold text-amber-900 dark:text-amber-100">A lower EMI is not safer if it hides weak flexibility elsewhere.</p>
          <p className="mt-1 text-amber-900/80 dark:text-amber-100/80">Tenure extension keeps EMI low but keeps you in debt longer. If income stability is uncertain over 20+ years, a smaller loan you can actually service is safer than the maximum the bank will sanction at stretched tenure.</p>
        </div>
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

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">When NOT to take the maximum loan the bank offers</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Banks maximise their loan book. Their eligibility ceiling is designed for the borrower who can service the loan under ideal conditions. That is not your safe ceiling. If any of the following apply, the maximum sanction is too large for your situation.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 dark:border-rose-500/30 dark:bg-rose-500/10">
            <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-100">Income risk signals</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-900/80 dark:text-rose-100/80">
              <li>Single income household — if that income stops for 2 months, can EMI still be paid without touching emergency savings?</li>
              <li>Variable or commission-based income — a bad quarter makes max EMI impossible, not just uncomfortable.</li>
              <li>Recent job change or probation period — lenders ignore this; your cashflow plan should not.</li>
              <li>Industry exposed to cycles (IT, real estate, fintech) — income stability over a 20-year tenure is not guaranteed.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 dark:border-rose-500/30 dark:bg-rose-500/10">
            <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-100">Cashflow risk signals</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-900/80 dark:text-rose-100/80">
              <li>Down payment has consumed emergency savings — you enter a 20-year obligation with no buffer.</li>
              <li>EMI at current rate already exceeds 35–40% of take-home — a +1% reset creates a cashflow crisis.</li>
              <li>You need to pause SIP or insurance to service the EMI — this is a structural warning, not a trade-off.</li>
              <li>Post-possession costs (interiors, maintenance, stamp duty) are not yet budgeted — year-one real cost is far above what the sanction letter shows.</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-sm dark:border-amber-500/30 dark:bg-amber-500/10">
          <p className="font-semibold text-amber-900 dark:text-amber-100">The rule: if the plan breaks in a bad month, the loan is too large.</p>
          <p className="mt-1 text-amber-900/80 dark:text-amber-100/80">Reducing loan size by ₹15L cuts EMI by roughly ₹12,000–₹13,500/month on a 20-year loan at 9%. That monthly difference between surviving a bad month and entering card rollover is worth more than the extra room the bank is willing to fund. Use the <Link href="/in/calculators/emi-calculator" className="content-link">EMI calculator</Link> to find your own safe ceiling, not the bank&apos;s maximum.</p>
        </div>
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
            <li>Affordability test passes even on single-income month simulation.</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 dark:border-rose-500/30 dark:bg-rose-500/10">
          <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100">Bad fit signals</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-900/90 dark:text-rose-100/90">
            <li>You need perfect income stability for EMI to work.</li>
            <li>You have to pause insurance or emergency savings to service the loan.</li>
            <li>You are ignoring processing, legal, and reset-cost clauses.</li>
            <li>Rate shock (+1%) would push EMI above 45% of take-home.</li>
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
