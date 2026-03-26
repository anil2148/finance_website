import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BlogCard } from '@/components/ui/BlogCard';
import { getPosts } from '@/lib/markdown';

const categoryCopy: Record<string, { title: string; description: string; editorialAngle: string }> = {
  investing: {
    title: 'Investing Articles',
    description: 'Allocation decisions, fee comparisons, and beginner-to-intermediate investing strategy with practical scenario modeling.',
    editorialAngle: 'Expect framework-first analysis: contribution cadence, risk limits, and account placement decisions.'
  },
  loans: {
    title: 'Loans Articles',
    description: 'Loan and mortgage explainers with approval timelines, lender requirements, and total-cost tradeoff analysis.',
    editorialAngle: 'These guides prioritize borrower execution: documents, underwriting friction points, and payment resilience checks.'
  },
  mortgages: {
    title: 'Mortgage Articles',
    description: 'Preapproval checklists, payment planning, and mortgage term comparisons focused on real household budgets.',
    editorialAngle: 'Expect lender-process detail and timeline realism rather than headline-rate commentary.'
  },
  budgeting: {
    title: 'Budgeting Articles',
    description: 'Category-based budgeting systems, automation tactics, and realistic spending plans for uneven monthly expenses.',
    editorialAngle: 'Articles in this cluster focus on decision rules that still hold during irregular income months.'
  },
  'retirement-planning': {
    title: 'Retirement Planning Articles',
    description: 'Workplace plan contribution strategy, IRA decision rules, and practical retirement savings escalation frameworks.',
    editorialAngle: 'Expect contribution-rate sequencing, tax-bracket tradeoffs, and long-horizon compounding discipline.'
  },
  savings: {
    title: 'Savings Articles',
    description: 'Emergency fund planning, savings account choices, and practical plans to build cash reserves with consistency.',
    editorialAngle: 'Coverage is cash-flow centric: reserve sizing logic, access constraints, and transfer automation.'
  },
  'savings-accounts': {
    title: 'Savings Account Articles',
    description: 'Emergency reserve sizing, account-selection scorecards, and practical systems to protect liquidity while earning yield.',
    editorialAngle: 'These pieces focus on reliability-first cash decisions: transfer speed, account rules, and sustainable funding plans.'
  },
  'credit-cards': {
    title: 'Credit Card Articles',
    description: 'APR and fee tradeoffs, utilization strategy, and practical ways to maximize rewards without paying interest.',
    editorialAngle: 'Expect payment-timing tactics and break-even math over promotional marketing language.'
  },
  tax: {
    title: 'Tax Planning Articles',
    description: 'Tax-efficiency frameworks that prioritize account location and repeatable annual maintenance, not one-off tricks.',
    editorialAngle: 'Coverage centers on after-tax return outcomes, guardrails, and coordination with long-term investing goals.'
  },
  'saving-money': {
    title: 'Saving Money Articles',
    description: 'Practical cost-cutting systems, recurring-expense controls, and implementation checklists that free up monthly cash flow.',
    editorialAngle: 'Coverage is process-first: repeatable audits, automation, and redirection of savings to higher-priority goals.'
  },
  'passive-income': {
    title: 'Passive Income Articles',
    description: 'Decision frameworks for building durable recurring income streams without overconcentration risk.',
    editorialAngle: 'Expect tradeoff-heavy coverage across yield reliability, liquidity, and tax complexity.'
  }
};

const categoryJourneyLinks: Record<string, Array<{ href: string; label: string }>> = {
  investing: [
    { href: '/learn/investing', label: 'Investing Hub' },
    { href: '/calculators/investment-growth-calculator', label: 'Investment Growth Calculator' },
    { href: '/best-investment-apps', label: 'Best Investment Apps' }
  ],
  loans: [
    { href: '/learn/loans', label: 'Loans Hub' },
    { href: '/calculators/loan-calculator', label: 'Loan Calculator' },
    { href: '/compare/mortgage-rate-comparison', label: 'Mortgage Rate Comparison' }
  ],
  mortgages: [
    { href: '/learn/loans', label: 'Mortgage & Loans Hub' },
    { href: '/calculators/mortgage-calculator', label: 'Mortgage Calculator' },
    { href: '/compare/mortgage-rate-comparison', label: 'Compare Mortgage Rates' }
  ],
  'credit-cards': [
    { href: '/learn/credit-cards', label: 'Credit Cards Hub' },
    { href: '/calculators/credit-card-payoff-calculator', label: 'Credit Card Payoff Calculator' },
    { href: '/best-credit-cards-2026', label: 'Best Credit Cards 2026' }
  ],
  'savings-accounts': [
    { href: '/learn/budgeting', label: 'Budgeting Hub' },
    { href: '/calculators/savings-goal-calculator', label: 'Savings Goal Calculator' },
    { href: '/best-savings-accounts-usa', label: 'Best Savings Accounts' }
  ],
  budgeting: [
    { href: '/learn/budgeting', label: 'Budgeting Hub' },
    { href: '/calculators/budget-planner', label: 'Budget Planner' },
    { href: '/compare/high-yield-savings-accounts', label: 'Compare High-Yield Savings' }
  ],
  'retirement-planning': [
    { href: '/learn/investing', label: 'Retirement & Investing Hub' },
    { href: '/calculators/retirement-calculator', label: 'Retirement Calculator' },
    { href: '/calculators/investment-growth-calculator', label: 'Investment Growth Calculator' }
  ],
  tax: [
    { href: '/learn/investing', label: 'Tax-Aware Investing Hub' },
    { href: '/calculators/salary-after-tax-calculator', label: 'Salary After-Tax Calculator' },
    { href: '/best-investment-apps', label: 'Tax-Friendly Brokerage Options' }
  ],
  'saving-money': [
    { href: '/learn/budgeting', label: 'Budgeting Hub' },
    { href: '/calculators/savings-goal-calculator', label: 'Savings Goal Calculator' },
    { href: '/compare/best-savings-accounts-usa', label: 'Best Savings Accounts USA' }
  ]
};

const categoryVisuals: Record<string, { src: string; alt: string; shell: string }> = {
  investing: {
    src: '/images/blog-visual-investing-growth.svg',
    alt: 'Investment portfolio growth chart and allocation visuals',
    shell: 'from-blue-50 to-indigo-50'
  },
  loans: {
    src: '/images/blog-visual-loans-docs.svg',
    alt: 'Loan paperwork and approval checklist illustration',
    shell: 'from-amber-50 to-orange-50'
  },
  mortgages: {
    src: '/images/blog-visual-mortgage.svg',
    alt: 'Mortgage affordability and approval planning illustration',
    shell: 'from-teal-50 to-sky-50'
  },
  'credit-cards': {
    src: '/images/blog-visual-credit.svg',
    alt: 'Credit card rewards and billing cycle illustration',
    shell: 'from-violet-50 to-fuchsia-50'
  },
  'savings-accounts': {
    src: '/images/blog-visual-savings-cashflow.svg',
    alt: 'Savings cashflow and emergency fund illustration',
    shell: 'from-emerald-50 to-lime-50'
  },
  budgeting: {
    src: '/images/blog-visual-savings-goals.svg',
    alt: 'Budget category planning board with monthly cashflow checkpoints',
    shell: 'from-sky-50 to-indigo-50'
  },
  tax: {
    src: '/images/blog-visual-tax.svg',
    alt: 'Tax planning worksheet and timeline illustration',
    shell: 'from-rose-50 to-pink-50'
  },
  'retirement-planning': {
    src: '/images/blog-visual-investing-growth.svg',
    alt: 'Retirement contribution and long-horizon growth planning illustration',
    shell: 'from-indigo-50 to-blue-50'
  },
  'saving-money': {
    src: '/images/blog-visual-saving.svg',
    alt: 'Household savings checklist and recurring expense controls illustration',
    shell: 'from-emerald-50 to-teal-50'
  },
  'passive-income': {
    src: '/images/blog-visual-investing-risk.svg',
    alt: 'Passive income allocation panel with risk and cashflow indicators',
    shell: 'from-emerald-50 to-teal-50'
  }
};

const featuredOrderByCategory: Record<string, string[]> = {
  investing: ['beginner-investing-roadmap-year-one-milestones', 'tax-efficient-investing-account-location-decisions'],
  loans: ['mortgage-preapproval-checklist-underwriting', 'personal-loan-comparison-for-bad-month-resilience', 'debt-to-income-ratio-90-day-plan'],
  'credit-cards': ['credit-utilization-statement-cycle-playbook'],
  'savings-accounts': ['emergency-fund-target-by-recovery-timeline', 'how-to-choose-a-high-yield-savings-account', 'budget-rule-based-reset']
};

function getCategoryContent(category: string) {
  return (
    categoryCopy[category] ?? {
      title: `${category.replace(/-/g, ' ')} Articles`,
      description: 'Focused explainers, examples, and decision frameworks for this topic.',
      editorialAngle: 'This topic page curates practical guides with calculator and comparison next steps.'
    }
  );
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const copy = getCategoryContent(params.category);
  return {
    title: `${copy.title} | FinanceSphere Blog`,
    description: copy.description,
    alternates: { canonical: `/blog/category/${params.category}` }
  };
}

export default function BlogCategoryPage({ params }: { params: { category: string } }) {
  const posts = getPosts().filter((post) => post.category === params.category);
  const featuredOrder = featuredOrderByCategory[params.category] ?? [];
  const featuredIndex = new Map(featuredOrder.map((slug, index) => [slug, index]));
  const sortedPosts = [...posts].sort((a, b) => {
    const aRank = featuredIndex.get(a.slug);
    const bRank = featuredIndex.get(b.slug);

    if (aRank !== undefined && bRank !== undefined) return aRank - bRank;
    if (aRank !== undefined) return -1;
    if (bRank !== undefined) return 1;
    return a.date < b.date ? 1 : -1;
  });
  const copy = getCategoryContent(params.category);
  const visual = categoryVisuals[params.category] ?? {
    src: '/images/blog-visual-general.svg',
    alt: 'FinanceSphere editorial topic illustration',
    shell: 'from-slate-50 to-blue-50'
  };
  const journeyLinks = categoryJourneyLinks[params.category] ?? [
    { href: '/learn/investing', label: 'Learn hubs' },
    { href: '/calculators', label: 'Calculator suite' },
    { href: '/comparison', label: 'Comparison center' }
  ];
  const featuredPosts = sortedPosts.slice(0, 3);
  const morePosts = sortedPosts.slice(3);
  const hasPosts = sortedPosts.length > 0;

  return (
    <section className="space-y-5">
      <header className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-[1.25fr_1fr] md:items-center">
        <div>
          <h1 className="text-2xl font-bold">{copy.title}</h1>
          <p className="mt-2 text-slate-600">{copy.description}</p>
          <p className="mt-2 text-sm text-slate-500">{copy.editorialAngle}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Editorial curation: strongest execution-oriented guides first.</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {journeyLinks.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full border px-3 py-1 hover:border-blue-200 hover:bg-blue-50">{item.label}</Link>
            ))}
            <Link href="/blog" className="rounded-full border px-3 py-1 hover:border-blue-200 hover:bg-blue-50">All blog topics</Link>
          </div>
        </div>
        <div className={`relative aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${visual.shell} p-3`}>
          <Image src={visual.src} alt={visual.alt} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-contain p-3 sm:p-5" />
        </div>
      </header>

      {hasPosts ? (
        <>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Featured in this category</h2>
            <p className="text-sm text-slate-600">Each featured card includes a different decision angle so this category reads like an editorial selection, not a templated list.</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((p) => (
                <BlogCard key={p.slug} title={p.title} excerpt={p.description} slug={p.slug} category={p.category} />
              ))}
            </div>
          </section>

          {morePosts.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">More guides</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {morePosts.map((p) => (
                  <BlogCard key={p.slug} title={p.title} excerpt={p.description} slug={p.slug} category={p.category} />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-semibold">No published guides in this category yet</h2>
          <p className="mt-2 text-sm text-slate-600">Use the linked hub, calculator, and comparison pages below while this category is being expanded with review-ready content.</p>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Continue your decision path</h2>
        <p className="mt-1 text-sm text-slate-600">Run numbers first, compare offers second, then return to this category for scenario-specific decisions.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {journeyLinks.map((item) => (
            <Link key={`${item.href}-path`} href={item.href} className="rounded-full border border-slate-300 px-3 py-1 font-medium hover:border-blue-300 hover:text-blue-700">{item.label}</Link>
          ))}
        </div>
      </section>
    </section>
  );
}
