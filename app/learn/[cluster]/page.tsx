import type { Metadata } from 'next';
import Link from 'next/link';
import { FAQAccordion, JumpNav, ResourceGrid, TrustBar } from '@/components/hubs/PillarPageSections';
import { createPageMetadata } from '@/lib/seo';

type HubConfig = {
  title: string;
  description: string;
  startHere: string[];
  updatedAt: string;
  popularDecisions: string[];
  resources: Array<{ href: string; title: string; description: string; tag?: string }>;
  calculators: Array<{ href: string; label: string }>;
  comparisons: Array<{ href: string; label: string }>;
  faqs: Array<{ question: string; answer: string }>;
  microReality: string;
  whatGoesWrong: { scenario: string; failurePoint: string; consequence: string };
  bestFor: string[];
  notIdealFor: string[];
  decisionBranch: Array<{ condition: string; action: string }>;
};

const hubs: Record<string, HubConfig> = {
  investing: {
    title: 'Investing Hub',
    description: 'Build a long-term portfolio with practical asset allocation, fee analysis, and app comparisons.',
    updatedAt: 'March 18, 2026',
    microReality: 'If you invest $500/month at 8% for 25 years, the difference between 0.1% and 1.0% in annual fees is roughly $100,000. That is not a rounding error.',
    whatGoesWrong: {
      scenario: 'You open an investing account, fund it with $400/month, and feel set. Six months later, a market dip triggers anxiety and you pause contributions "until it stabilizes."',
      failurePoint: 'Contributions stop for 4 months. The money sits in cash. The market recovers without you.',
      consequence: 'Long-term returns are more sensitive to contribution gaps than to short-term volatility. Pausing during dips is one of the most common ways disciplined plans fail.'
    },
    bestFor: ['Stable-income earners building a 10+ year plan', 'People with employer match available and no high-interest debt', 'Anyone ready to automate and review quarterly—not daily'],
    notIdealFor: ['Households with high-interest debt above 15% APR (pay that first)', 'Anyone without 1–2 months of emergency cash as a buffer', 'Active traders looking for short-term speculation tools'],
    decisionBranch: [
      { condition: 'If you have employer match available', action: 'Contribute at least enough to capture the full match before anything else' },
      { condition: 'If your debt APR is above 10%', action: 'Compare expected investment return vs guaranteed interest savings before splitting contributions' },
      { condition: 'If you are within 5 years of a major goal', action: 'Shift allocation toward lower-volatility options—long horizon rules do not apply at short horizons' }
    ],
    startHere: [
      'Define your goal horizon first (under 3 years, 3–10 years, 10+ years).',
      'Choose account type before investment selection (retirement, taxable, education).',
      'Automate contributions and review quarterly—not daily.'
    ],
    popularDecisions: ['Choose account type before fund selection', 'Set contribution cadence you can sustain for 12 months', 'Compare app fees before transferring assets'],
    resources: [
      { href: '/blog/beginner-investing-roadmap-year-one-milestones', title: 'Investing for beginners roadmap', description: 'A practical sequence for choosing accounts, funds, and contribution cadence.', tag: 'Start here' },
      { href: '/blog/tax-efficient-investing-account-location-decisions', title: 'Tax-efficient investing moves', description: 'Learn how account location and turnover discipline improve after-tax results.' },
      { href: '/best-investment-apps', title: 'Best investment apps comparison', description: 'Compare platforms by fees, account types, and automation support.' }
    ],
    calculators: [
      { href: '/calculators/investment-growth-calculator', label: 'Investment growth calculator' },
      { href: '/calculators/retirement-calculator', label: 'Retirement calculator' }
    ],
    comparisons: [
      { href: '/best-investment-apps', label: 'Best investment apps comparison' },
      { href: '/comparison', label: 'Full comparison engine' }
    ],
    faqs: [
      { question: 'Should I invest before paying off debt?', answer: 'Usually contribute enough to capture employer match first, then compare high-interest debt APR versus expected long-term return.' },
      { question: 'How often should I rebalance?', answer: 'Quarterly or semi-annually is usually enough unless your allocation drifts materially.' }
    ]
  },
  'credit-cards': {
    title: 'Credit Cards Hub',
    description: 'Find the best cards for rewards, low fees, and credit-building with transparent trade-offs.',
    updatedAt: 'March 18, 2026',
    microReality: 'A $95 annual fee is worth it only if you actually redeem enough to cover it. Most people do not run this math before applying.',
    whatGoesWrong: {
      scenario: 'You apply for a premium travel card to earn 80,000 signup points. Life gets busy—you forget to use the travel credits and annual lounge benefit.',
      failurePoint: 'The card has a $550 annual fee. You redeem $120 in cashback-equivalent value. Net annual cost: $430.',
      consequence: 'The card costs more than a no-fee option would have. The mistake was not the card—it was applying without a realistic redemption plan.'
    },
    bestFor: ['Households that pay in full every month without exception', 'Travelers who will realistically use specific card credits', 'People building credit with a controlled utilization strategy'],
    notIdealFor: ['Anyone currently carrying a revolving balance—interest drag erases reward value', 'People with under one month of emergency savings', 'Households applying for a mortgage in the next 90 days (new inquiries can affect approval)'],
    decisionBranch: [
      { condition: 'If you carry a balance month to month', action: 'Prioritize a low-APR card over rewards—interest cost will outpace any points earned' },
      { condition: 'If you spend heavily in one category (dining, travel, groceries)', action: 'Find a card that multiplies points in that category—flat-rate cards often lose here' },
      { condition: 'If your credit score is below 670', action: 'Start with a secured or credit-builder card before chasing premium products' }
    ],
    startHere: [
      'Decide if your priority is rewards, balance transfer savings, or building credit.',
      'Estimate annual spending categories and compare net annual value after fees.',
      'Set autopay and utilization targets before applying for additional cards.'
    ],
    popularDecisions: ['Pick rewards vs transfer strategy before applying', 'Set utilization and autopay rules first', 'Compare no-fee vs annual-fee break-even'],
    resources: [
      { href: '/best-credit-cards-2026', title: 'Best credit cards comparison', description: 'Compare reward structures, annual fees, and intro APR terms.', tag: 'Start here' },
      { href: '/blog/credit-utilization-statement-cycle-playbook', title: 'Credit utilization timing tactics', description: 'Use statement timing and per-card management to protect your score.' },
      { href: '/best-credit-cards', title: 'Best cards for everyday spending', description: 'Review no-fee and rewards-focused card structures for daily use.' }
    ],
    calculators: [
      { href: '/calculators/credit-card-payoff-calculator', label: 'Credit card payoff calculator' },
      { href: '/calculators/debt-avalanche-calculator', label: 'Debt avalanche calculator' }
    ],
    comparisons: [
      { href: '/best-credit-cards-2026', label: 'Best credit cards comparison' },
      { href: '/comparison', label: 'Full comparison engine' }
    ],
    faqs: [
      { question: 'How many credit cards should I have?', answer: 'There is no universal number. Start with a manageable setup and expand only when each card has a clear purpose.' },
      { question: 'Do annual-fee cards always win?', answer: 'No. Annual-fee cards only outperform no-fee options if your real usage consistently exceeds fee break-even.' }
    ]
  },
  loans: {
    title: 'Loans Hub',
    description: 'Compare personal loans, understand APR, and choose repayment strategies that reduce interest.',
    updatedAt: 'March 18, 2026',
    microReality: 'Monthly payment is the number lenders lead with. Total repayment cost is the number that actually matters.',
    whatGoesWrong: {
      scenario: 'You refinance $22,000 in credit card debt into a 60-month personal loan at 11% APR. The monthly payment drops from $750 to $478 and feels like relief.',
      failurePoint: 'The cards are now empty. Within 8 months, spending habits fill them again. You now carry the loan AND the card balances.',
      consequence: 'Debt consolidation without a spending-control plan frequently increases total debt. The loan solved the symptom, not the cause.'
    },
    bestFor: ['Borrowers with stable income and a clear, fixed repayment timeline', 'Households consolidating high-APR debt with a no-new-debt commitment', 'People applying in the next 30–120 days with documents ready'],
    notIdealFor: ['Variable-income households where monthly cash flow swings significantly', 'Anyone without an emergency buffer of at least 1 month of expenses', 'Consolidation situations where spending habits have not changed'],
    decisionBranch: [
      { condition: 'If your debt APR is above 20%', action: 'Prioritize payoff or consolidation immediately—interest cost is compounding against you' },
      { condition: 'If your APR is below 8%', action: 'Consider whether investing the difference could outperform early payoff before aggressively prepaying' },
      { condition: 'If your income is variable', action: 'Choose the longer term for lower payment flexibility, then prepay aggressively in strong months' }
    ],
    startHere: [
      'Check debt-to-income ratio and payment affordability before rate shopping.',
      'Compare total borrowing cost, not just monthly payment.',
      'Run payoff acceleration scenarios for 12- and 24-month prepayment options.'
    ],
    popularDecisions: ['Stress-test monthly payment under income volatility', 'Compare APR + fee stack instead of APR only', 'Choose prepayment-flexible terms when possible'],
    resources: [
      { href: '/blog/personal-loan-comparison-for-bad-month-resilience', title: 'How to compare personal loan APR', description: 'Evaluate offers using APR, fees, repayment flexibility, and stress-tested payment ranges.', tag: 'Start here' },
      { href: '/blog/mortgage-preapproval-checklist-underwriting', title: 'Mortgage preapproval checklist', description: 'Prepare documents and timeline expectations to avoid underwriting delays.' },
      { href: '/blog/debt-to-income-ratio-90-day-plan', title: 'Debt-to-income ratio guide', description: 'Use front-end and back-end DTI targets to improve approval odds before applying.' }
    ],
    calculators: [
      { href: '/calculators/loan-calculator', label: 'Loan calculator' },
      { href: '/calculators/debt-payoff-calculator', label: 'Debt payoff calculator' },
      { href: '/calculators/debt-snowball-calculator', label: 'Debt snowball calculator' }
    ],
    comparisons: [
      { href: '/loans', label: 'Personal loan comparisons' },
      { href: '/compare/mortgage-rate-comparison', label: 'Mortgage rate comparisons' }
    ],
    faqs: [
      { question: 'What APR range is considered reasonable?', answer: 'Reasonable depends on credit profile and loan type. Benchmark at least 3 lenders with identical term requests.' },
      { question: 'When does refinancing make sense?', answer: 'Usually when rate reduction and fee structure create meaningful net savings over your expected holding period.' }
    ]
  },
  budgeting: {
    title: 'Budgeting Hub',
    description: 'Create a spending plan that aligns with your goals and adapts to irregular expenses.',
    updatedAt: 'March 18, 2026',
    microReality: 'The best budget is not the most optimized one. It is the one you actually stick to in a difficult month.',
    whatGoesWrong: {
      scenario: 'You build a tight 50/30/20 budget, automate transfers, and track spending for two weeks. Then rent goes up $200 and a medical bill arrives.',
      failurePoint: 'The budget breaks. Instead of adjusting one line item, you abandon the system entirely because "it doesn\'t work for my situation."',
      consequence: 'Most budgets fail not because the math is wrong, but because they have no emergency flexibility built in. A single unexpected cost becomes permission to stop entirely.'
    },
    bestFor: ['Anyone resetting after a life change (new job, new city, new bills)', 'Households with irregular income who need a low-income baseline plan', 'People automating savings for the first time'],
    notIdealFor: ['Highly variable self-employed income without a separate operating account', 'Households in active debt crisis where cash flow is already severely negative'],
    decisionBranch: [
      { condition: 'If your income is stable (salaried)', action: 'Start with 50/30/20 as a baseline and adjust one category at a time' },
      { condition: 'If your income varies by more than 30% month to month', action: 'Budget from your lowest expected income month and treat surplus months as goal accelerators' },
      { condition: 'If fixed costs exceed 60% of income', action: 'Address fixed-cost reduction (housing, insurance, subscriptions) before optimizing discretionary spending' }
    ],
    startHere: [
      'Separate fixed vs variable costs so you know what is negotiable.',
      'Create one realistic weekly spending guardrail before optimizing categories.',
      'Automate savings and debt payments right after income lands.'
    ],
    popularDecisions: ['Choose one weekly spending guardrail', 'Automate transfers after paycheck hits', 'Use emergency-fund timeline, not fixed month-count only'],
    resources: [
      { href: '/blog/budget-rule-based-reset', title: 'How to adapt the 50/30/20 rule', description: 'Use a flexible spending split that still works in high-cost or debt-heavy months.', tag: 'Start here' },
      { href: '/blog/emergency-fund-target-by-recovery-timeline', title: 'Emergency fund target by risk level', description: 'Pick a 3-to-6 month reserve using job stability, dependents, and replacement-time risk.' },
      { href: '/blog/how-to-choose-a-high-yield-savings-account', title: 'How to choose a high-yield savings account', description: 'Compare APY quality, transfer speed, and account rules beyond headline rates.' }
    ],
    calculators: [
      { href: '/calculators/budget-planner', label: 'Budget planner' },
      { href: '/calculators/savings-goal-calculator', label: 'Savings goal calculator' }
    ],
    comparisons: [
      { href: '/best-savings-accounts-usa', label: 'Best savings accounts' },
      { href: '/comparison', label: 'Full comparison engine' }
    ],
    faqs: [
      { question: 'How often should I update my budget?', answer: 'Monthly is a good baseline, with extra check-ins after major income or bill changes.' },
      { question: 'What if my income is irregular?', answer: 'Use a base-income budget and treat variable income as a separate allocation pool for goals and buffers.' }
    ]
  },
  'passive-income': {
    title: 'Passive Income Hub',
    description: 'Use savings yield, dividends, and automation systems to create repeatable cash flow.',
    updatedAt: 'March 18, 2026',
    microReality: 'Most passive income is semi-passive. The setup takes work, the monitoring takes time, and the tax treatment takes attention.',
    whatGoesWrong: {
      scenario: 'You move $30,000 into a dividend ETF targeting 4% annual yield to generate $1,200/year in supplemental income.',
      failurePoint: 'In a down year, the portfolio drops 18% and dividends are partially cut. You sell at a loss to cover an unexpected expense.',
      consequence: 'Market-based passive income is not stable cash flow. Mixing it with emergency funds or near-term spending needs creates forced selling at the worst time.'
    },
    bestFor: ['People with a stable emergency fund who want to grow long-term cash flow beyond it', 'Savers earning less than 4% APY in their current account who can move without penalty', 'Households separating short-term reserves from medium-term income goals'],
    notIdealFor: ['Households that need guaranteed monthly income (market yield fluctuates)', 'Anyone without 3+ months of liquid emergency savings set aside first', 'People expecting passive income to replace active income quickly'],
    decisionBranch: [
      { condition: 'If you need stable, accessible cash', action: 'High-yield savings or short-term CDs—not market income. Stability comes first.' },
      { condition: 'If your timeline is 5+ years and you can tolerate volatility', action: 'Dividend investing or index funds are viable; expect multi-year drawdowns without panic-selling' },
      { condition: 'If you want income from existing real estate', action: 'Model net yield after vacancy, maintenance, and taxes—not gross rent—before comparing to other options' }
    ],
    startHere: [
      'Define whether your goal is stability, growth, or supplemental income.',
      'Separate low-risk cash-flow ideas from higher-risk strategies.',
      'Track net return after taxes and fees, not gross yield alone.'
    ],
    popularDecisions: ['Separate low-risk yield from market-return goals', 'Track after-tax yield, not headline income only', 'Set review cadence for semi-passive strategies'],
    resources: [
      { href: '/blog/tax-efficient-investing-account-location-decisions', title: 'Tax-efficient investing basics', description: 'Improve after-tax outcomes with better asset location and contribution sequencing.', tag: 'Start here' },
      { href: '/blog/how-to-choose-a-high-yield-savings-account', title: 'High-yield savings account basics', description: 'Choose accounts by APY, transfer speed, withdrawal rules, and emergency access quality.' },
      { href: '/blog/beginner-investing-roadmap-year-one-milestones', title: 'Investing roadmap for beginners', description: 'Build a repeatable first-year investing system with realistic contribution pacing.' }
    ],
    calculators: [
      { href: '/calculators/compound-interest-calculator', label: 'Compound interest calculator' },
      { href: '/calculators/net-worth-calculator', label: 'Net worth calculator' }
    ],
    comparisons: [
      { href: '/best-savings-accounts-usa', label: 'Best savings accounts' },
      { href: '/best-investment-apps', label: 'Investment app comparisons' }
    ],
    faqs: [
      { question: 'Is passive income truly hands-off?', answer: 'Most strategies are semi-passive. They need setup, monitoring, and occasional rebalancing.' },
      { question: 'What is the safest place to start?', answer: 'Usually emergency savings + high-yield savings or short-term CDs before adding market-based income assets.' }
    ]
  }
};

export function generateStaticParams() {
  return Object.keys(hubs).map((cluster) => ({ cluster }));
}

export function generateMetadata({ params }: { params: { cluster: string } }): Metadata {
  const data = hubs[params.cluster];
  if (!data) return {};
  return createPageMetadata({
    title: `${data.title} | FinanceSphere`,
    description: data.description,
    pathname: `/learn/${params.cluster}`
  });
}

export default function ClusterHubPage({ params }: { params: { cluster: string } }) {
  const data = hubs[params.cluster];
  if (!data) {
    return <div className="rounded-xl border bg-white p-5">Cluster not found.</div>;
  }

  return (
    <section className="space-y-7">
      <header className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-3xl font-bold">{data.title}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">{data.description}</p>
        {data.microReality && (
          <p className="mt-3 text-sm font-medium italic text-slate-500">{data.microReality}</p>
        )}
      </header>

      <JumpNav links={[{ href: '#start-here', label: 'Start here' }, { href: '#what-fails', label: 'What fails' }, { href: '#top-guides', label: 'Top guides' }, { href: '#tools', label: 'Tools and comparisons' }, { href: '#methodology', label: 'Methodology' }, { href: '#faq', label: 'FAQ' }]} />

      <TrustBar updatedAt={data.updatedAt} disclaimer="Some links are affiliate links, but rankings and guides follow editorial methodology." methodologyAnchor="/editorial-policy" />

      <section id="start-here" className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-2xl font-semibold">Start here</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          {data.startHere.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section id="what-fails" className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
        <h2 className="text-2xl font-semibold text-slate-900">What people get wrong</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <article className="rounded-xl border border-amber-200 bg-white p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700">Scenario</h3>
            <p className="mt-1 text-sm text-slate-700">{data.whatGoesWrong.scenario}</p>
          </article>
          <article className="rounded-xl border border-amber-200 bg-white p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700">Failure point</h3>
            <p className="mt-1 text-sm text-slate-700">{data.whatGoesWrong.failurePoint}</p>
          </article>
          <article className="rounded-xl border border-amber-200 bg-white p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700">Consequence</h3>
            <p className="mt-1 text-sm text-slate-700">{data.whatGoesWrong.consequence}</p>
          </article>
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Best for</h2>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
            {data.bestFor.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Not ideal for</h2>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
            {data.notIdealFor.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Decision branching</h2>
        <p className="mt-1 text-sm text-slate-600">Match your situation to the right starting point.</p>
        <div className="mt-3 space-y-2 text-sm">
          {data.decisionBranch.map((branch) => (
            <div key={branch.condition} className="rounded-lg border border-slate-200 p-3">
              <span className="font-semibold text-blue-700">If: </span>
              <span className="text-slate-700">{branch.condition}</span>
              <span className="mx-2 text-slate-400">→</span>
              <span className="text-slate-800">{branch.action}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-2xl font-semibold">Popular decisions in this topic</h2>
        <ul className="mt-3 grid gap-2 text-sm md:grid-cols-3">
          {data.popularDecisions.map((item) => (
            <li key={item} className="rounded-lg border border-slate-200 bg-white p-3 text-slate-700">{item}</li>
          ))}
        </ul>
      </section>

      <section id="top-guides" className="space-y-3">
        <h2 className="text-2xl font-semibold">Top guides by subtopic</h2>
        <ResourceGrid resources={data.resources} />
      </section>

      <section id="tools" className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-semibold">Related calculators</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data.calculators.map((item) => (
              <li key={item.href}><Link className="font-semibold text-blue-700 hover:underline" href={item.href}>{item.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-semibold">Compare options</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data.comparisons.map((item) => (
              <li key={item.href}><Link className="font-semibold text-blue-700 hover:underline" href={item.href}>{item.label}</Link></li>
            ))}
          </ul>
        </div>
      </section>

      <section id="methodology" className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-2xl font-semibold">Our methodology and disclosures</h2>
        <p className="mt-2 text-sm text-slate-600">FinanceSphere reviews product categories using fee impact, feature fit, account protections, and usability. Content is educational and does not provide personalized financial advice.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link className="rounded-full border border-slate-300 px-3 py-1 font-medium hover:border-blue-300 hover:text-blue-700" href="/editorial-policy">Editorial standards</Link>
          <Link className="rounded-full border border-slate-300 px-3 py-1 font-medium hover:border-blue-300 hover:text-blue-700" href="/how-we-make-money">Affiliate disclosures</Link>
          <Link className="rounded-full border border-slate-300 px-3 py-1 font-medium hover:border-blue-300 hover:text-blue-700" href="/help">Help center</Link>
        </div>
      </section>


      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-2xl font-semibold">Need help choosing your next step?</h2>
        <p className="mt-2 text-sm text-slate-600">If you are unsure which calculator or comparison to use, our support pages can route you quickly.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link className="rounded-full border border-slate-300 px-3 py-1 font-medium hover:border-blue-300 hover:text-blue-700" href="/help">Open Help Center</Link>
          <Link className="rounded-full border border-slate-300 px-3 py-1 font-medium hover:border-blue-300 hover:text-blue-700" href="/contact">Contact FinanceSphere</Link>
        </div>
      </section>

      <section id="faq" className="space-y-3">
        <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
        <FAQAccordion items={data.faqs} />
      </section>
    </section>
  );
}
