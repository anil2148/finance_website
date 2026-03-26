import Link from 'next/link';
import { ComparisonEngine } from '@/components/comparison/ComparisonEngine';
import type { FinancialCategory } from '@/lib/financialProducts';
import { defaultMatchingCalculatorLinks, matchingCalculatorLinksByFinancialCategory, resolveCalculatorHref } from '@/lib/calculatorLinks';
import { breadcrumbSchema, webpageSchema } from '@/lib/seo';

type SeoComparisonPageProps = {
  pageTitle: string;
  intro: string;
  category: FinancialCategory;
  faq: Array<{ question: string; answer: string }>;
  slug: string;
};

const methodologyWeights: Record<FinancialCategory, Array<{ factor: string; weight: string; why: string }>> = {
  credit_card: [
    { factor: 'Total annual value after fees', weight: '35%', why: 'Rewards only matter if net value stays positive for your real spending mix.' },
    { factor: 'Downside risk (APR + debt carry)', weight: '25%', why: 'A single carried balance can erase reward gains quickly.' },
    { factor: 'Eligibility and approval fit', weight: '20%', why: 'The best card on paper is irrelevant if approval odds are low.' },
    { factor: 'Usability and benefit friction', weight: '20%', why: 'Benefits that are hard to redeem usually get underused.' }
  ],
  savings_account: [
    { factor: 'Yield quality and stability', weight: '35%', why: 'Sustained APY quality matters more than short-lived teaser rates.' },
    { factor: 'Liquidity reliability', weight: '30%', why: 'Emergency money is only useful if transfers work when needed.' },
    { factor: 'Fee and balance rules', weight: '20%', why: 'Hidden conditions can reduce effective return.' },
    { factor: 'Support and operations', weight: '15%', why: 'Clear support prevents avoidable delays during urgent needs.' }
  ],
  investment_app: [
    { factor: 'All-in cost drag', weight: '30%', why: 'Small annual fee differences compound materially over time.' },
    { factor: 'Account-type coverage', weight: '25%', why: 'Missing account types create expensive migration later.' },
    { factor: 'Automation and behavior support', weight: '25%', why: 'Consistency usually beats feature-heavy but unused tools.' },
    { factor: 'Tax/reporting and support', weight: '20%', why: 'Operational quality matters during filing season and transfers.' }
  ],
  mortgage_lender: [
    { factor: 'Total borrowing cost (rate + fees)', weight: '40%', why: 'APR and fee stack determine real long-term cost.' },
    { factor: 'Execution reliability', weight: '25%', why: 'Closing delays can create contract and moving risks.' },
    { factor: 'Fit for borrower profile', weight: '20%', why: 'Not all lenders handle self-employed or complex files equally.' },
    { factor: 'Service quality and escalation', weight: '15%', why: 'You need responsive support when underwriting issues appear.' }
  ],
  personal_loan: [
    { factor: 'All-in repayment cost', weight: '40%', why: 'APR plus origination fee determines true payoff burden.' },
    { factor: 'Payment resilience', weight: '25%', why: 'The loan must remain manageable in lower-income months.' },
    { factor: 'Flexibility terms', weight: '20%', why: 'Prepayment and hardship policies can reduce downside risk.' },
    { factor: 'Funding and servicing quality', weight: '15%', why: 'Reliability matters for urgent consolidation or cash flow needs.' }
  ]
};

const audienceSummaries: Record<FinancialCategory, Array<{ title: string; text: string }>> = {
  credit_card: [
    { title: 'Best for beginners', text: 'Start with one no-annual-fee card you can pay in full monthly. Build payment consistency before chasing complex reward stacks.' },
    { title: 'Best for low fees', text: 'Prioritize cards with no annual fee and minimal penalty fees; model value assuming conservative redemption rates.' },
    { title: 'Not ideal if…', text: 'If your cash buffer is under one month of expenses, focus on emergency reserves before opening new credit lines.' }
  ],
  savings_account: [
    { title: 'Best for beginners', text: 'Choose a simple HYSA with reliable outbound transfers and clear fee policy. Simplicity beats marginal APY differences.' },
    { title: 'Best if you value support', text: 'Households that need phone support may accept slightly lower APY for stronger service and clearer transfer help.' },
    { title: 'Not ideal if…', text: 'Avoid complex tiered-rate products if you are unlikely to meet ongoing balance or activity conditions.' }
  ],
  investment_app: [
    { title: 'Best for beginners', text: 'Automated investing with recurring contributions is usually the strongest starting point for year-one consistency.' },
    { title: 'Best for hands-on users', text: 'Self-directed apps fit investors who already have a written allocation, contribution, and rebalancing rule.' },
    { title: 'Not ideal if…', text: 'If you frequently react to market headlines, avoid app setups that make impulse trading too easy.' }
  ],
  mortgage_lender: [
    { title: 'Best for first-time buyers', text: 'Pick lenders that communicate documentation requirements clearly and keep milestone updates predictable.' },
    { title: 'Best for low total cost', text: 'Compare Loan Estimates line by line; a lower rate can still lose if fee stack is materially higher.' },
    { title: 'Not ideal if…', text: 'If your closing timeline is inflexible, skip lenders with weak turnaround consistency even if headline pricing looks better.' }
  ],
  personal_loan: [
    { title: 'Best for debt consolidation', text: 'Use consolidation only with a no-new-debt plan and a realistic payment schedule you can keep for the full term.' },
    { title: 'Best if you value support', text: 'Borrowers rebuilding credit often benefit from lenders with transparent hardship options and reachable support teams.' },
    { title: 'Not ideal if…', text: 'If your cash flow is currently unstable, stabilize essentials and emergency runway before taking fixed-payment debt.' }
  ]
};

export function SeoComparisonPage({ pageTitle, intro, category, faq, slug }: SeoComparisonPageProps) {
  const relatedCalculators = matchingCalculatorLinksByFinancialCategory[category] ?? defaultMatchingCalculatorLinks;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } }))
  };
  const pageSchema = webpageSchema({ pathname: `/${slug}`, name: pageTitle, description: intro });
  const crumbsSchema = breadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Comparison', item: '/comparison' },
    { name: pageTitle, item: `/${slug}` }
  ]);

  return (
    <section className="space-y-8">
      <header className="space-y-3" id="methodology">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{pageTitle}</h1>
        <p className="max-w-3xl text-slate-600 dark:text-slate-300">{intro}</p>
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          FinanceSphere does not publish live-rate rankings on this page. We publish an evaluation framework you can use with current provider disclosures.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link href="/editorial-policy" className="rounded-full border border-slate-300 px-2 py-1 dark:border-slate-600">Editorial standards</Link>
          <Link href="/affiliate-disclosure" className="rounded-full border border-slate-300 px-2 py-1 dark:border-slate-600">Affiliate disclosure</Link>
          <Link href="/how-we-make-money" className="rounded-full border border-slate-300 px-2 py-1 dark:border-slate-600">How we make money</Link>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">How to evaluate options on this page</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Use this process: define your non-negotiables, shortlist 2–3 options, run one calculator scenario, then verify current terms directly with each provider.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[620px] w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="px-2 py-2">Evaluation factor</th>
                <th className="px-2 py-2">Weight</th>
                <th className="px-2 py-2">Why it matters</th>
              </tr>
            </thead>
            <tbody>
              {methodologyWeights[category].map((row) => (
                <tr key={row.factor} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-2 py-2 font-medium text-slate-900 dark:text-slate-100">{row.factor}</td>
                  <td className="px-2 py-2">{row.weight}</td>
                  <td className="px-2 py-2 text-slate-600 dark:text-slate-300">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ComparisonEngine defaultCategory={category} />

      <section className="grid gap-3 md:grid-cols-3">
        {audienceSummaries[category].map((item) => (
          <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Coverage and limitations</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>We do not claim exhaustive market coverage on this page.</li>
          <li>Illustrative decision frameworks are updated during editorial refresh cycles.</li>
          <li>Terms, rates, and eligibility can change quickly; always verify with the provider.</li>
          <li>This page is educational and not personalized financial advice.</li>
        </ul>
      </section>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        {faq.map((item) => (
          <details key={item.question} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <summary className="cursor-pointer font-medium text-slate-900 dark:text-slate-100">{item.question}</summary>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.answer}</p>
          </details>
        ))}
      </div>

      <section className="related-links-grid">
        <div>
          <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Run your numbers first</h2>
          <ul className="space-y-1 text-sm">
            {relatedCalculators.map((item) => {
              const href = resolveCalculatorHref(item.href);
              return <li key={`${item.label}-${href}`}><Link href={href} className="text-brand hover:underline">{item.label}</Link></li>;
            })}
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Related comparisons</h2>
          <ul className="space-y-1 text-sm">
            <li><Link href="/best-savings-accounts-usa" className="text-brand hover:underline">Savings account framework</Link></li>
            <li><Link href="/best-investment-apps" className="text-brand hover:underline">Investment app framework</Link></li>
            <li><Link href="/comparison" className="text-brand hover:underline">All comparison frameworks</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Methodology and transparency</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Our framework emphasizes cost, constraints, and downside resilience before upside claims. We surface tradeoffs and avoid fake precision where live market data is unavailable in-repo.</p>
          <div className="mt-2 flex gap-2 text-xs">
            <Link className="rounded-full border border-slate-300 px-2 py-1 dark:border-slate-600" href="/editorial-policy">Editorial policy</Link>
            <Link className="rounded-full border border-slate-300 px-2 py-1 dark:border-slate-600" href="/affiliate-disclosure">Affiliate disclosure</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsSchema) }} />
    </section>
  );
}
