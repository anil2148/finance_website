import type { Metadata } from 'next';
import Link from 'next/link';
import { FAQAccordion, JumpNav, ResourceGrid, TrustBar } from '@/components/hubs/PillarPageSections';

type HubConfig = {
  title: string;
  description: string;
  startHere: string[];
  updatedAt: string;
  resources: Array<{ href: string; title: string; description: string; tag?: string }>;
  calculators: Array<{ href: string; label: string }>;
  comparisons: Array<{ href: string; label: string }>;
  faqs: Array<{ question: string; answer: string }>;
};

const hubs: Record<string, HubConfig> = {
  investing: {
    title: 'Investing Hub',
    description: 'Build a long-term portfolio with practical asset allocation, fee analysis, and app comparisons.',
    updatedAt: 'March 18, 2026',
    startHere: [
      'Define your goal horizon first (under 3 years, 3–10 years, 10+ years).',
      'Choose account type before investment selection (retirement, taxable, education).',
      'Automate contributions and review quarterly—not daily.'
    ],
    resources: [
      { href: '/blog/seo-investing-for-beginners-roadmap', title: 'Investing for beginners roadmap', description: 'A practical sequence for choosing accounts, funds, and contribution cadence.', tag: 'Start here' },
      { href: '/blog/seo-index-funds-vs-etfs', title: 'Index funds vs ETFs', description: 'Understand structure, fees, and when each approach fits best.' },
      { href: '/blog/seo-how-to-read-expense-ratios', title: 'How to read expense ratios', description: 'Translate small percentage fees into long-term dollar impact.' }
    ],
    calculators: [
      { href: '/calculators/investment-growth-calculator', label: 'Investment growth calculator' },
      { href: '/calculators/retirement-calculator', label: 'Retirement calculator' }
    ],
    comparisons: [
      { href: '/best-investment-apps', label: 'Best investment apps comparison' },
      { href: '/comparison?category=investment_app', label: 'All investing app offers' }
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
    startHere: [
      'Decide if your priority is rewards, balance transfer savings, or building credit.',
      'Estimate annual spending categories and compare net annual value after fees.',
      'Set autopay and utilization targets before applying for additional cards.'
    ],
    resources: [
      { href: '/blog/seo-best-first-credit-card', title: 'Best first credit card checklist', description: 'How to choose a first card with manageable limits and low risk.', tag: 'Start here' },
      { href: '/blog/seo-avoid-credit-card-interest', title: 'How to avoid credit card interest', description: 'Payment timing, statement cycles, and carry-cost prevention.' },
      { href: '/blog/seo-how-credit-utilization-works', title: 'Credit utilization timing tactics', description: 'Use statement-cycle timing and payment controls to protect your score.' }
    ],
    calculators: [
      { href: '/calculators/credit-card-payoff-calculator', label: 'Credit card payoff calculator' },
      { href: '/calculators/debt-avalanche-calculator', label: 'Debt avalanche calculator' }
    ],
    comparisons: [
      { href: '/best-credit-cards-2026', label: 'Best credit cards comparison' },
      { href: '/comparison?category=credit_card', label: 'All card offers' }
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
    startHere: [
      'Check debt-to-income ratio and payment affordability before rate shopping.',
      'Compare total borrowing cost, not just monthly payment.',
      'Run payoff acceleration scenarios for 12- and 24-month prepayment options.'
    ],
    resources: [
      { href: '/blog/seo-how-to-compare-personal-loan-apr', title: 'How to compare personal loan APR', description: 'Evaluate offers using APR, fees, repayment flexibility, and stress-tested payment ranges.', tag: 'Start here' },
      { href: '/blog/seo-what-lenders-check', title: 'What lenders check before approval', description: 'See how underwriters evaluate credit, debt, income, and documentation quality.' },
      { href: '/blog/seo-debt-to-income-ratio-guide', title: 'Debt-to-income ratio guide', description: 'Use front-end and back-end DTI targets to improve approval odds before applying.' }
    ],
    calculators: [
      { href: '/calculators/loan-calculator', label: 'Loan calculator' },
      { href: '/calculators/debt-payoff-calculator', label: 'Debt payoff calculator' }
    ],
    comparisons: [
      { href: '/comparison?category=personal_loan', label: 'Personal loan comparisons' },
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
    startHere: [
      'Separate fixed vs variable costs so you know what is negotiable.',
      'Create one realistic weekly spending guardrail before optimizing categories.',
      'Automate savings and debt payments right after income lands.'
    ],
    resources: [
      { href: '/blog/seo-50-30-20-rule-for-saving', title: 'How to adapt the 50/30/20 rule', description: 'Use a flexible spending split that still works in high-cost or debt-heavy months.', tag: 'Start here' },
      { href: '/blog/seo-emergency-fund-3-to-6-months', title: 'Emergency fund target by risk level', description: 'Pick a 3-to-6 month reserve using job stability, dependents, and replacement-time risk.' },
      { href: '/blog/seo-automate-your-savings-plan', title: 'How to automate your savings plan', description: 'Set transfers around paycheck and bill timing so savings continue through uneven months.' }
    ],
    calculators: [
      { href: '/calculators/budget-planner', label: 'Budget planner' },
      { href: '/calculators/savings-goal-calculator', label: 'Savings goal calculator' }
    ],
    comparisons: [
      { href: '/best-savings-accounts-usa', label: 'Best savings accounts' },
      { href: '/comparison?category=savings_account', label: 'Savings account offers' }
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
    startHere: [
      'Define whether your goal is stability, growth, or supplemental income.',
      'Separate low-risk cash-flow ideas from higher-risk strategies.',
      'Track net return after taxes and fees, not gross yield alone.'
    ],
    resources: [
      { href: '/blog/seo-tax-efficient-investing-tips', title: 'Tax-efficient investing basics', description: 'Improve after-tax outcomes with better asset location and contribution sequencing.', tag: 'Start here' },
      { href: '/blog/seo-high-yield-savings-basics', title: 'High-yield savings account basics', description: 'Choose accounts by APY, transfer speed, withdrawal rules, and emergency access quality.' },
      { href: '/blog/seo-index-funds-vs-etfs', title: 'Index funds vs ETFs', description: 'Compare automation, tax behavior, and trading flexibility for long-term investing.' }
    ],
    calculators: [
      { href: '/calculators/compound-interest-calculator', label: 'Compound interest calculator' },
      { href: '/calculators/net-worth-calculator', label: 'Net worth calculator' }
    ],
    comparisons: [
      { href: '/best-savings-accounts-usa', label: 'Best savings accounts' },
      { href: '/high-yield-savings-accounts', label: 'High-yield savings guide' }
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
  return {
    title: `${data.title} | FinanceSphere`,
    description: data.description,
    alternates: { canonical: `/learn/${params.cluster}` }
  };
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
      </header>

      <JumpNav links={[{ href: '#start-here', label: 'Start here' }, { href: '#top-guides', label: 'Top guides' }, { href: '#tools', label: 'Tools and comparisons' }, { href: '#methodology', label: 'Methodology' }, { href: '#faq', label: 'FAQ' }]} />

      <TrustBar updatedAt={data.updatedAt} disclaimer="Some links are affiliate links, but rankings and guides follow editorial methodology." methodologyAnchor="/editorial-policy" />

      <section id="start-here" className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-2xl font-semibold">Start here</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          {data.startHere.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
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
