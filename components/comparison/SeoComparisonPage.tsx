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
  pathname?: string;
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


const scenarioExamples: Record<FinancialCategory, { title: string; setup: string; takeaway: string }> = {
  credit_card: {
    title: 'Illustrative scenario: no-fee cashback vs premium rewards',
    setup: 'If a household spends about $2,000 per month and redeems rewards at conservative cash-back value, a premium annual fee card often needs consistently used credits to beat a no-fee setup.',
    takeaway: 'Run your own annual net value math using realistic redemption assumptions before applying.'
  },
  savings_account: {
    title: 'Illustrative scenario: APY vs access reliability',
    setup: 'A slightly lower APY can still be the better choice when transfer speed and support reliability prevent emergency-cash delays.',
    takeaway: 'For emergency funds, reliability and liquidity can outweigh small yield differences.'
  },
  investment_app: {
    title: 'Illustrative scenario: fee drag over long horizons',
    setup: 'Even a modest annual platform fee gap can materially change outcomes across 10+ years when contributions are consistent.',
    takeaway: 'Compare all-in annual costs first, then evaluate feature depth.'
  },
  mortgage_lender: {
    title: 'Illustrative scenario: lower rate, higher fee stack',
    setup: 'A lower headline rate is not always cheaper if origination and closing fees are materially higher on the Loan Estimate.',
    takeaway: 'Compare total borrowing cost and timeline reliability together.'
  },
  personal_loan: {
    title: 'Illustrative scenario: smaller payment, longer payoff',
    setup: 'A longer term can reduce monthly pressure but raise total interest enough to delay other goals.',
    takeaway: 'Use a payment you can sustain in bad months, then prepay aggressively when cash flow improves.'
  }
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

const prepChecklistByCategory: Record<FinancialCategory, Array<{ label: string; detail: string }>> = {
  credit_card: [
    { label: '12-month spend estimate', detail: 'Use your real category spend so reward break-even math is realistic.' },
    { label: 'Carry-balance risk check', detail: 'If you may revolve debt, APR downside usually outweighs points upside.' },
    { label: 'Credit-profile timing', detail: 'Review utilization and recent inquiries before submitting new applications.' }
  ],
  savings_account: [
    { label: 'Emergency runway target', detail: 'Define the amount that must stay liquid before chasing marginal APY differences.' },
    { label: 'Transfer timing need', detail: 'Decide whether next-day or same-day access is necessary for your workflow.' },
    { label: 'Account-rule tolerance', detail: 'Avoid tiered or conditional products if you are unlikely to meet ongoing requirements.' }
  ],
  investment_app: [
    { label: 'Account map', detail: 'List which account types you need now and within 24 months to avoid transfer friction later.' },
    { label: 'All-in fee estimate', detail: 'Include platform, advisory, and fund expense ratios in one annual percentage.' },
    { label: 'Behavior plan', detail: 'Choose an app design that supports recurring contributions and limits impulse trades.' }
  ],
  mortgage_lender: [
    { label: 'Timeline readiness', detail: 'Write your closing deadline and prioritize lenders with reliable execution.' },
    { label: 'Document readiness', detail: 'Gather income, asset, and liability documentation before comparing quotes.' },
    { label: 'Cost comparison method', detail: 'Compare Loan Estimates line-by-line instead of using note rate only.' }
  ],
  personal_loan: [
    { label: 'Payment ceiling', detail: 'Set a max monthly payment that still works in a below-average income month.' },
    { label: 'Net-proceeds check', detail: 'Account for origination fees so usable cash matches your actual need.' },
    { label: 'No-new-debt rule', detail: 'If consolidating, pair the loan with a card-spend control plan immediately.' }
  ]
};

const decisionSignalsByCategory: Record<FinancialCategory, { bestIf: string; avoidIf: string; whenToWait: string }> = {
  credit_card: {
    bestIf: 'Best if you pay in full monthly and can document realistic annual net value after fees.',
    avoidIf: 'Avoid applying when you are carrying revolving debt and do not have a payoff schedule.',
    whenToWait: 'Wait if your emergency buffer is below one month of expenses or your utilization is temporarily elevated.'
  },
  savings_account: {
    bestIf: 'Best if you need dependable liquidity and can automate contributions with minimal maintenance.',
    avoidIf: 'Avoid complex account-rule structures if you are unlikely to meet activity or balance conditions.',
    whenToWait: 'Wait before switching if your current account is tied to pending payroll or bill migration work.'
  },
  investment_app: {
    bestIf: 'Best if the platform supports your account types and recurring-contribution workflow for at least 12 months.',
    avoidIf: 'Avoid platforms that encourage high-friction trading behavior you already struggle to control.',
    whenToWait: 'Wait if you still need to define baseline allocation and contribution amount.'
  },
  mortgage_lender: {
    bestIf: 'Best if the lender can execute your file type reliably within your real closing timeline.',
    avoidIf: 'Avoid choosing solely by headline note rate without full fee and process comparison.',
    whenToWait: 'Wait when key documentation is incomplete or your debt profile is likely to improve within 60–90 days.'
  },
  personal_loan: {
    bestIf: 'Best if the fixed payment remains manageable in your conservative cash-flow month.',
    avoidIf: 'Avoid debt consolidation loans if spending controls are not in place yet.',
    whenToWait: 'Wait when income variability is high and emergency runway is still too thin.'
  }
};

const updateCadenceByCategory: Record<FinancialCategory, string> = {
  credit_card: 'Reviewed during major issuer-term or fee-structure updates.',
  savings_account: 'Reviewed when account-rule patterns and transfer reliability guidance materially change.',
  investment_app: 'Reviewed when platform fee models, account support, or automation capabilities change.',
  mortgage_lender: 'Reviewed when borrower-process guidance or underwriting workflow assumptions change.',
  personal_loan: 'Reviewed when repayment-structure assumptions or fee patterns materially change.'
};

const shortlistByCategory: Record<FinancialCategory, Array<{ persona: string; bestFor: string; watchOut: string }>> = {
  credit_card: [
    { persona: 'Cash-back simplifier', bestFor: 'One no-fee card with broad earn categories and easy redemption.', watchOut: 'High APR can erase all rewards if you carry balances.' },
    { persona: 'Frequent traveler', bestFor: 'Travel card when annual credits and transfer partners match your actual use.', watchOut: 'Do not pay annual fees for benefits you rarely redeem.' },
    { persona: 'Debt payoff phase', bestFor: 'Low-interest or intro-APR option paired with a fixed payoff plan.', watchOut: 'Avoid new spending patterns that extend repayment timelines.' }
  ],
  savings_account: [
    { persona: 'Emergency fund builder', bestFor: 'HYSA with fast transfers and predictable support.', watchOut: 'Tiny APY gains are not worth delayed access risk.' },
    { persona: 'Rate optimizer', bestFor: 'High-yield account with clear balance rules and no maintenance fees.', watchOut: 'Teaser rates can reset lower; read timing terms carefully.' },
    { persona: 'Joint household saver', bestFor: 'Account with simple automation and shared visibility.', watchOut: 'Complex tier requirements can create avoidable friction.' }
  ],
  investment_app: [
    { persona: 'Set-and-forget investor', bestFor: 'Automation-first app with recurring contributions and rebalancing.', watchOut: 'Avoid interfaces that trigger impulse trading behavior.' },
    { persona: 'DIY portfolio builder', bestFor: 'Low-cost self-directed platform with account-type depth.', watchOut: 'Do not ignore tax-lot/reporting quality at filing time.' },
    { persona: 'Retirement-focused user', bestFor: 'Provider with IRA support and long-term cost transparency.', watchOut: 'Promotional features can distract from fee drag.' }
  ],
  mortgage_lender: [
    { persona: 'First-time buyer', bestFor: 'Lender with strong documentation guidance and predictable milestones.', watchOut: 'Lowest quoted rate can lose once fee stack is included.' },
    { persona: 'Tight closing deadline', bestFor: 'Execution reliability and underwriting responsiveness.', watchOut: 'Avoid teams with weak communication cadence.' },
    { persona: 'Self-employed borrower', bestFor: 'Lender experienced with complex income files.', watchOut: 'Do not assume every lender handles non-W2 files equally.' }
  ],
  personal_loan: [
    { persona: 'Debt consolidator', bestFor: 'Lower all-in APR and a payment below your conservative monthly ceiling.', watchOut: 'Consolidation fails if new card debt restarts immediately.' },
    { persona: 'Cash-flow stabilizer', bestFor: 'Predictable servicing and transparent hardship options.', watchOut: 'Long terms can reduce payment but raise lifetime interest cost.' },
    { persona: 'Credit rebuild phase', bestFor: 'Clear fee disclosure and no prepayment penalty.', watchOut: 'Origination fees may reduce usable proceeds more than expected.' }
  ]
};

const relatedBlogsByCategory: Record<FinancialCategory, Array<{ label: string; href: string }>> = {
  credit_card: [
    { label: 'Credit utilization statement-cycle playbook', href: '/blog/credit-utilization-statement-cycle-playbook' },
    { label: 'Credit card APR real balance cost', href: '/blog/credit-card-apr-2026-real-balance-cost' }
  ],
  savings_account: [
    { label: 'How to choose a high-yield savings account', href: '/blog/how-to-choose-a-high-yield-savings-account' },
    { label: 'Emergency fund target by recovery timeline', href: '/blog/emergency-fund-target-by-recovery-timeline' }
  ],
  investment_app: [
    { label: 'Beginner investing roadmap: year-one milestones', href: '/blog/beginner-investing-roadmap-year-one-milestones' },
    { label: 'Tax-efficient investing account location decisions', href: '/blog/tax-efficient-investing-account-location-decisions' }
  ],
  mortgage_lender: [
    { label: 'Mortgage preapproval checklist for underwriting readiness', href: '/blog/mortgage-preapproval-checklist-underwriting' },
    { label: 'Debt-to-income ratio 90-day plan', href: '/blog/debt-to-income-ratio-90-day-plan' }
  ],
  personal_loan: [
    { label: 'Personal loan comparison for bad-month resilience', href: '/blog/personal-loan-comparison-for-bad-month-resilience' },
    { label: 'Debt-to-income ratio 90-day plan', href: '/blog/debt-to-income-ratio-90-day-plan' }
  ]
};



export function SeoComparisonPage({ pageTitle, intro, category, faq, slug, pathname }: SeoComparisonPageProps) {
  const relatedCalculators = matchingCalculatorLinksByFinancialCategory[category] ?? defaultMatchingCalculatorLinks;
  const fallbackPath = slug.startsWith('/') ? slug : `/${slug}`;
  const resolvedPath = pathname
    ? pathname
    : fallbackPath.includes('/compare/')
      ? fallbackPath
      : `/compare/${slug}`;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } }))
  };
  const pageSchema = webpageSchema({ pathname: resolvedPath, name: pageTitle, description: intro });
  const crumbsSchema = breadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Comparison', item: '/comparison' },
    { name: pageTitle, item: resolvedPath }
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

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-3 dark:border-slate-700 dark:bg-slate-900/40">
        <article>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Who this helps most</h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Readers making a decision in the next one to three months who need a shortlist based on tradeoffs, not marketing claims.</p>
        </article>
        <article>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Costly mistake to avoid</h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Picking only on headline rate or rewards while missing constraints, fee triggers, and service reliability in bad-month scenarios.</p>
        </article>
        <article>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Do this after reading</h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Take two options into a calculator, run best/base/stress assumptions, then verify final terms directly with providers.</p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Collect this before you compare</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">A strong comparison starts with your own constraints. Use this pre-check so you do not optimize the wrong metric.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {prepChecklistByCategory[category].map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">{item.label}</h3>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>


      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-3 dark:border-slate-700 dark:bg-slate-900/40">
        <article>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Best option if...</h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{decisionSignalsByCategory[category].bestIf}</p>
        </article>
        <article>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Avoid if...</h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{decisionSignalsByCategory[category].avoidIf}</p>
        </article>
        <article>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">When to wait</h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{decisionSignalsByCategory[category].whenToWait}</p>
        </article>
      </section>


      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{scenarioExamples[category].title}</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{scenarioExamples[category].setup}</p>
        <p className="mt-2 text-sm font-medium text-blue-800 dark:text-blue-200">{scenarioExamples[category].takeaway}</p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Examples are illustrative decision models, not live market quotes.</p>
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Best for specific users: quick shortlist</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Use this as a first-pass shortlist, then pressure-test each option with your own numbers and constraints.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {shortlistByCategory[category].map((item) => (
            <article key={item.persona} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">{item.persona}</h3>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300"><strong>Best option pattern:</strong> {item.bestFor}</p>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-200"><strong>When not to choose:</strong> {item.watchOut}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Coverage and limitations</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>We do not claim exhaustive market coverage on this page.</li>
          <li>{updateCadenceByCategory[category]}</li>
          <li>Terms, rates, and eligibility can change quickly; always verify with the provider.</li>
          <li>This page is educational and not personalized financial advice.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Decision checklist before you apply or switch</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>Write one sentence for what success looks like over the next 12 months.</li>
          <li>Set a failure condition upfront (fee cap, payment cap, transfer speed, or response time).</li>
          <li>Keep only options that pass both the success target and the failure-condition test.</li>
          <li>Confirm final pricing and eligibility with provider disclosures the same day you act.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/40">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Decision shortcuts for busy weeks</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>If you only have 15 minutes: shortlist two options and run one stress-case calculator scenario.</li>
          <li>If you are within 30 days of action: prioritize execution reliability and downside risk over small upside differences.</li>
          <li>If results are close: pick the option with lower irreversible downside (fees, penalties, or timeline risk).</li>
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
          <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Related guides</h2>
          <ul className="space-y-1 text-sm">
            {relatedBlogsByCategory[category].map((item) => (
              <li key={item.href}><Link href={item.href} className="text-brand hover:underline">{item.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Methodology and transparency</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Our framework emphasizes cost, constraints, and downside resilience before upside claims. We surface tradeoffs and avoid fake precision where live market data is unavailable in-repo.</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Data sources used: provider terms, official disclosures, and in-house calculator assumptions. Last reviewed logic: March 28, 2026 (UTC).</p>
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
