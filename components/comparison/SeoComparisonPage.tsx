import Link from 'next/link';
import { ComparisonEngine } from '@/components/comparison/ComparisonEngine';
import type { FinancialCategory } from '@/lib/financialProducts';
import { defaultMatchingCalculatorLinks, matchingCalculatorLinksByFinancialCategory, resolveCalculatorHref } from '@/lib/calculatorLinks';
import { breadcrumbSchema, webpageSchema } from '@/lib/seo';
import AuthorBox from '@/components/common/AuthorBox';

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
    setup: 'If a household spends $2,000 per month and shifts 70% of spend to a 2% no-fee card, annual rewards are about $336. A $395 premium card needs near-full credit usage plus higher redemption value to stay net positive.',
    takeaway: 'Run your own annual net value math using realistic redemption assumptions before applying.'
  },
  savings_account: {
    title: 'Illustrative scenario: APY vs access reliability',
    setup: 'On a $25,000 emergency fund, 4.60% APY vs 4.20% APY is roughly a $100 annual difference after rough tax adjustment. One delayed transfer during a true emergency can cost more than that spread.',
    takeaway: 'For emergency funds, reliability and liquidity can outweigh small yield differences.'
  },
  investment_app: {
    title: 'Illustrative scenario: fee drag over long horizons',
    setup: 'Investing $600 monthly for 25 years at 8% gross return can produce a gap of roughly $90,000+ between a 0.20% and 1.00% annual all-in fee profile.',
    takeaway: 'Compare all-in annual costs first, then evaluate feature depth.'
  },
  mortgage_lender: {
    title: 'Illustrative scenario: lower rate, higher fee stack',
    setup: 'On a $400,000 mortgage, a 6.25% quote with $9,500 total lender fees can lose to a 6.40% quote with $2,500 fees depending on expected time in the home.',
    takeaway: 'Compare total borrowing cost and timeline reliability together.'
  },
  personal_loan: {
    title: 'Illustrative scenario: smaller payment, longer payoff',
    setup: 'Refinancing $18,000 at 11% into 36 months costs about $588/month, while a 60-month term drops payment near $391 but adds roughly $2,300 more total interest.',
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

const shortlistByCategory: Record<FinancialCategory, Array<{ label: string; bestFor: string; avoidWhen: string }>> = {
  credit_card: [
    { label: 'No-annual-fee cashback card', bestFor: 'Households that want predictable value with minimal management.', avoidWhen: 'You frequently carry balances month to month.' },
    { label: 'Low-APR card', bestFor: 'People prioritizing balance-carry risk control over premium perks.', avoidWhen: 'You only compare based on intro offers without post-intro APR.' },
    { label: 'Premium travel card', bestFor: 'Frequent travelers who can reliably redeem high-value credits.', avoidWhen: 'Credits and travel redemptions are likely to go unused.' }
  ],
  savings_account: [
    { label: 'Simple online HYSA', bestFor: 'Emergency funds requiring strong APY with straightforward rules.', avoidWhen: 'You need in-person branch support for frequent cash tasks.' },
    { label: 'Hybrid checking + savings setup', bestFor: 'Users who want easy bill-pay and transfer automation.', avoidWhen: 'Linked account structure adds complexity you will not maintain.' },
    { label: 'CD ladder alongside HYSA', bestFor: 'Households separating near-term cash and medium-term reserves.', avoidWhen: 'You may need full balance liquidity before maturity windows.' }
  ],
  investment_app: [
    { label: 'Automated robo platform', bestFor: 'Beginners building consistency with recurring contributions.', avoidWhen: 'You need advanced tax-lot controls or complex strategy overlays.' },
    { label: 'Low-cost brokerage app', bestFor: 'Hands-on investors with a written allocation plan.', avoidWhen: 'You often react impulsively to market volatility.' },
    { label: 'Retirement-focused platform', bestFor: 'Workers optimizing IRA/401(k) rollover and long-term planning.', avoidWhen: 'Account-type coverage is too narrow for your next 24 months.' }
  ],
  mortgage_lender: [
    { label: 'Execution-focused lender', bestFor: 'Buyers with tight closing timelines and complex coordination.', avoidWhen: 'Rate is attractive but process reliability is weak.' },
    { label: 'Low-fee lender', bestFor: 'Borrowers optimizing lifetime cost with flexible timelines.', avoidWhen: 'You ignore service quality during underwriting exceptions.' },
    { label: 'Niche-profile lender', bestFor: 'Self-employed or non-standard income borrowers.', avoidWhen: 'Standard W-2 profile can get lower all-in cost elsewhere.' }
  ],
  personal_loan: [
    { label: 'Consolidation-focused loan', bestFor: 'Borrowers replacing high APR revolving debt with fixed payments.', avoidWhen: 'No spending-control system is in place after consolidation.' },
    { label: 'Lower-payment longer-term loan', bestFor: 'Cash-flow protection during variable-income periods.', avoidWhen: 'Total interest cost crowds out future savings goals.' },
    { label: 'Fast-funding emergency loan', bestFor: 'Time-sensitive needs with clear short repayment horizon.', avoidWhen: 'You can stabilize with expenses cuts and short-term buffer instead.' }
  ]
};

const userTypeRecommendations: Record<FinancialCategory, Array<{ userType: string; bestOption: string; why: string }>> = {
  credit_card: [
    { userType: 'Pays in full monthly', bestOption: 'No-fee cashback or optimized rewards card', why: 'Maximizes net value without interest drag.' },
    { userType: 'Carries occasional balance', bestOption: 'Low-APR card', why: 'Reduces downside cost when balances roll over.' },
    { userType: 'Frequent traveler', bestOption: 'Premium travel card only if credits are fully used', why: 'Annual fee only works when redemption rate is reliable.' }
  ],
  savings_account: [
    { userType: 'Emergency-fund builder', bestOption: 'Simple online HYSA', why: 'Strong yield and fast liquidity with fewer rule traps.' },
    { userType: 'Needs branch support', bestOption: 'Hybrid checking + savings setup', why: 'Support availability can outweigh slight APY differences.' },
    { userType: 'Multi-bucket saver', bestOption: 'HYSA + laddered CDs', why: 'Balances liquidity with better medium-term yield.' }
  ],
  investment_app: [
    { userType: 'Beginner automator', bestOption: 'Robo platform with recurring investing', why: 'Consistency beats manual complexity early on.' },
    { userType: 'Self-directed investor', bestOption: 'Low-cost brokerage app', why: 'Lower fee drag with broad product access.' },
    { userType: 'Retirement optimizer', bestOption: 'Retirement-focused platform', why: 'Account coverage and rollover workflows matter most.' }
  ],
  mortgage_lender: [
    { userType: 'First-time buyer', bestOption: 'Execution-focused lender', why: 'Process reliability reduces closing risk.' },
    { userType: 'Rate-sensitive borrower', bestOption: 'Low-fee lender after APR comparison', why: 'Total cost matters more than note rate alone.' },
    { userType: 'Complex income profile', bestOption: 'Niche-profile lender', why: 'Underwriting fit can improve approval odds.' }
  ],
  personal_loan: [
    { userType: 'Debt consolidator', bestOption: 'Consolidation-focused loan', why: 'Fixed payments can accelerate payoff with discipline.' },
    { userType: 'Variable-income borrower', bestOption: 'Lower-payment longer-term loan', why: 'Payment resilience reduces default risk in weak months.' },
    { userType: 'Urgent cash need', bestOption: 'Fast-funding loan with short payoff plan', why: 'Speed matters, but cap total interest with a strict timeline.' }
  ]
};


const whatGoesWrongByCategory: Record<FinancialCategory, { scenario: string; failurePoint: string; consequence: string }> = {
  credit_card: {
    scenario: 'You sign up for a premium rewards card to earn travel points on $3,000/month in spending. The welcome bonus requires $4,000 spend in 3 months.',
    failurePoint: 'You overspend to hit the threshold. A $600 balance carries into the next month at 27% APR.',
    consequence: 'Interest charges in the first month alone erase several months of reward value. The card that looked free ended up costing money.'
  },
  savings_account: {
    scenario: 'You move your $18,000 emergency fund to a high-yield account at 5.10% APY to capture better interest—a reasonable move.',
    failurePoint: 'Six weeks later, your water heater fails. The new account takes 3–5 business days to transfer out. Your checking account cannot cover the repair.',
    consequence: 'The extra $50/year in interest is irrelevant. A 72-hour transfer delay during a real emergency turned a small win into a cash crisis.'
  },
  investment_app: {
    scenario: 'You start investing $300/month with a robo-advisor. The market drops 18% over three months.',
    failurePoint: 'Anxiety triggers a pause. Contributions stop for 5 months while you "wait to see where things settle."',
    consequence: 'You miss buying at lower prices and reduce total contributions. The platform was not the problem—the behavior gap was. Automating contributions without a market-drop rule means the plan only works when it does not feel scary.'
  },
  mortgage_lender: {
    scenario: 'A lender quotes you 6.35% with $3,200 in origination fees—the lowest rate you have seen. You commit quickly to lock it in.',
    failurePoint: 'Two weeks from closing, the underwriter flags a documentation issue. The lender is slow to respond. Your rate lock expires and you pay to extend it.',
    consequence: 'The lowest-rate lender created the highest stress and added unexpected cost. Execution reliability is not visible on a rate quote sheet—but it matters as much as the rate.'
  },
  personal_loan: {
    scenario: 'You consolidate $14,000 in credit card debt into a 48-month personal loan at 9.5% APR. Monthly payment drops by $230.',
    failurePoint: 'The credit cards are now zeroed out. Within 7 months, spending habits rebuild $6,000 in new balances.',
    consequence: 'Total debt increased. The consolidation improved the rate but not the behavior. Debt consolidation without a spending-control mechanism often accelerates the problem it was supposed to solve.'
  }
};

const microRealityLineByCategory: Record<FinancialCategory, string> = {
  credit_card: 'Rewards are only profitable if you would have spent the money anyway.',
  savings_account: 'An account that earns 0.3% more APY but takes 4 days to transfer is not a better emergency fund.',
  investment_app: 'Consistency beats optimization. A simpler plan you stick to outperforms a complex one you abandon.',
  mortgage_lender: 'The rate you see on day one and the rate you close at are not always the same number.',
  personal_loan: 'Lower payments are not safer if they extend the timeline and hide the total cost.'
};

const decisionBranchingByCategory: Record<FinancialCategory, Array<{ condition: string; action: string }>> = {
  credit_card: [
    { condition: 'If you carry a balance more than 2 months per year', action: 'Choose a low-APR card—interest cost will outpace rewards at any APR above 15%' },
    { condition: 'If you pay in full consistently and spend over $1,500/month', action: 'A no-fee cashback or category rewards card likely pays for itself' },
    { condition: 'If you are rebuilding credit', action: 'Start with a secured card or credit-builder product before applying for rewards cards' }
  ],
  savings_account: [
    { condition: 'If this is your emergency fund', action: 'Transfer speed and fee rules matter as much as APY—test the transfer workflow before relying on it' },
    { condition: 'If this is medium-term savings (1–3 years)', action: 'A CD ladder or slightly lower-rate account with better withdrawal terms may be the right trade-off' },
    { condition: 'If you want to switch for a higher APY', action: 'Verify that the new rate is not a promotional teaser before moving money and updating bill-pay links' }
  ],
  investment_app: [
    { condition: 'If you are just starting and want to build a habit', action: 'Use a robo-advisor or automated index fund platform—reduce friction, not maximize features' },
    { condition: 'If you already have a written allocation plan', action: 'A low-cost self-directed brokerage with broad fund access fits better' },
    { condition: 'If you frequently react to market news', action: 'Choose a platform that makes impulse trades harder, not easier' }
  ],
  mortgage_lender: [
    { condition: 'If your closing timeline is inflexible (under 45 days)', action: 'Prioritize lender execution reliability over headline rate—a delayed close costs more than a minor rate difference' },
    { condition: 'If you are self-employed or have complex income', action: 'Work with a lender experienced in non-standard files before comparing rates' },
    { condition: 'If you have flexibility on closing date', action: 'Get Loan Estimates from at least 3 lenders and compare APR + total fee stack, not note rate only' }
  ],
  personal_loan: [
    { condition: 'If your debt APR is above 20%', action: 'Prioritize payoff or consolidation—interest is compounding faster than most investments can beat' },
    { condition: 'If your APR is below 8%', action: 'Weigh whether prepaying early is worth more than investing the same dollars' },
    { condition: 'If your income is variable month to month', action: 'Choose a longer term for payment safety, then prepay in strong months' }
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
          We use transparent evaluation frameworks, real-world scenarios, and provider disclosures so you can compare options confidently.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link href="/editorial-policy" className="rounded-full border border-slate-300 px-2 py-1 dark:border-slate-600">Editorial standards</Link>
          <Link href="/affiliate-disclosure" className="rounded-full border border-slate-300 px-2 py-1 dark:border-slate-600">Affiliate disclosure</Link>
          <Link href="/how-we-make-money" className="rounded-full border border-slate-300 px-2 py-1 dark:border-slate-600">How we make money</Link>
        </div>
      </header>
      <AuthorBox className="mt-0" />

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

      <section className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">What goes wrong</h2>
        <p className="mt-1 text-xs font-medium italic text-slate-500 dark:text-slate-400">&ldquo;{microRealityLineByCategory[category]}&rdquo;</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <article className="rounded-xl border border-amber-200 bg-white p-3 dark:border-amber-800/40 dark:bg-slate-900">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">Scenario</h3>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{whatGoesWrongByCategory[category].scenario}</p>
          </article>
          <article className="rounded-xl border border-amber-200 bg-white p-3 dark:border-amber-800/40 dark:bg-slate-900">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">Failure point</h3>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{whatGoesWrongByCategory[category].failurePoint}</p>
          </article>
          <article className="rounded-xl border border-amber-200 bg-white p-3 dark:border-amber-800/40 dark:bg-slate-900">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">Consequence</h3>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{whatGoesWrongByCategory[category].consequence}</p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Scenario-based recommendation table</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Which option is best for YOU? Match your profile first, then validate pricing and eligibility.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-[640px] w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="px-2 py-2">User type</th>
                <th className="px-2 py-2">Best option</th>
                <th className="px-2 py-2">Why</th>
              </tr>
            </thead>
            <tbody>
              {userTypeRecommendations[category].map((item) => (
                <tr key={item.userType} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-2 py-2 font-medium text-slate-900 dark:text-slate-100">{item.userType}</td>
                  <td className="px-2 py-2 text-slate-700 dark:text-slate-300">{item.bestOption}</td>
                  <td className="px-2 py-2 text-slate-700 dark:text-slate-300">{item.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ComparisonEngine defaultCategory={category} />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Shortlist: 3 option archetypes to test first</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Use these as starting points, then map real providers to each archetype using your exact constraints.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-[640px] w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="px-2 py-2">Option type</th>
                <th className="px-2 py-2">Best for</th>
                <th className="px-2 py-2">When not to choose</th>
              </tr>
            </thead>
            <tbody>
              {shortlistByCategory[category].map((item) => (
                <tr key={item.label} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-2 py-2 font-medium text-slate-900 dark:text-slate-100">{item.label}</td>
                  <td className="px-2 py-2 text-slate-700 dark:text-slate-300">{item.bestFor}</td>
                  <td className="px-2 py-2 text-slate-700 dark:text-slate-300">{item.avoidWhen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

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
          <li>{updateCadenceByCategory[category]}</li>
          <li>Terms, rates, and eligibility can change quickly; always verify with the provider.</li>
          <li>This page is educational and not personalized financial advice.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Decision branching: match your situation first</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Your starting point changes the right answer. Find your scenario before comparing specific options.</p>
        <div className="mt-3 space-y-2 text-sm">
          {decisionBranchingByCategory[category].map((branch) => (
            <div key={branch.condition} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <span className="font-semibold text-blue-700 dark:text-blue-300">If: </span>
              <span className="text-slate-700 dark:text-slate-300">{branch.condition}</span>
              <span className="mx-2 text-slate-400">→</span>
              <span className="text-slate-800 dark:text-slate-200">{branch.action}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Decision checklist before you apply or switch</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>Write one sentence for what success looks like over the next 12 months.</li>
          <li>Set a failure condition upfront (fee cap, payment cap, transfer speed, or response time).</li>
          <li>Keep only options that pass both the success target and the failure-condition test.</li>
          <li>Confirm final pricing and eligibility with provider disclosures the same day you act.</li>
        </ol>
        <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-500/40 dark:bg-blue-950/30 dark:text-blue-100">
          <p className="font-semibold">Decision shortcut:</p>
          <p className="mt-1">If two options are close, choose the one that still works in your stress-case month (income down, one surprise expense, and less flexibility).</p>
        </div>
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
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Data sources used: provider disclosures, official fee schedules, eligibility terms, and historical user-decision patterns from FinanceSphere workflow analytics.</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Last reviewed logic: refreshed after material policy changes and during scheduled editorial update windows.</p>
          <div className="mt-2 flex gap-2 text-xs">
            <Link className="rounded-full border border-slate-300 px-2 py-1 dark:border-slate-600" href="/editorial-policy">Editorial policy</Link>
            <Link className="rounded-full border border-slate-300 px-2 py-1 dark:border-slate-600" href="/affiliate-disclosure">Affiliate disclosure</Link>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/40">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Continue your decision workflow</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/blog/how-to-increase-your-savings-rate" className="rounded-full border border-slate-300 bg-white px-3 py-1 dark:border-slate-600 dark:bg-slate-900">Read related blog: Increase your savings rate</Link>
          <Link href="/blog/personal-loan-comparison-for-bad-month-resilience" className="rounded-full border border-slate-300 bg-white px-3 py-1 dark:border-slate-600 dark:bg-slate-900">Read related blog: Bad-month resilience</Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsSchema) }} />
    </section>
  );
}
