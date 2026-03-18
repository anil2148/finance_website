import type { Metadata } from 'next';
import Link from 'next/link';

const clusters = {
  investing: {
    title: 'Investing Hub',
    description: 'Build a long-term portfolio with practical asset allocation, fee analysis, and app comparisons.',
    links: [
      { label: 'Best investment apps', href: '/best-investment-apps' },
      { label: 'Investment growth calculator', href: '/calculators/investment-growth-calculator' },
      { label: 'Beginner investing guide', href: '/blog/beginner-investing-guides-97' }
    ]
  },
  'credit-cards': {
    title: 'Credit Cards Hub',
    description: 'Find the best cards for rewards, low fees, and credit-building with transparent trade-offs.',
    links: [
      { label: 'Best credit cards 2026', href: '/best-credit-cards-2026' },
      { label: 'Credit card payoff calculator', href: '/calculators/credit-card-payoff-calculator' },
      { label: 'Credit mistakes to avoid', href: '/blog/seo-credit-card-mistakes-to-avoid' }
    ]
  },
  loans: {
    title: 'Loans Hub',
    description: 'Compare personal loans, understand APR, and choose repayment strategies that reduce interest.',
    links: [
      { label: 'Loan comparison page', href: '/comparison?category=personal_loan' },
      { label: 'Loan calculator', href: '/calculators/loan-calculator' },
      { label: 'Debt-to-income guide', href: '/blog/seo-debt-to-income-ratio-guide' }
    ]
  },
  budgeting: {
    title: 'Budgeting Hub',
    description: 'Create a spending plan that aligns with your goals and adapts to irregular expenses.',
    links: [
      { label: 'Budget planner', href: '/calculators/budget-planner' },
      { label: 'Savings goal calculator', href: '/calculators/savings-goal-calculator' },
      { label: 'Sinking funds system', href: '/blog/seo-sinking-funds-system' }
    ]
  },
  'passive-income': {
    title: 'Passive Income Hub',
    description: 'Use savings yield, dividends, and automation systems to create repeatable cash flow.',
    links: [
      { label: 'Best savings accounts', href: '/best-savings-accounts-usa' },
      { label: 'Compound interest calculator', href: '/calculators/compound-interest-calculator' },
      { label: 'High-yield savings comparison', href: '/high-yield-savings-accounts' }
    ]
  }
} as const;

type ClusterKey = keyof typeof clusters;

export function generateStaticParams() {
  return Object.keys(clusters).map((cluster) => ({ cluster }));
}

export function generateMetadata({ params }: { params: { cluster: string } }): Metadata {
  const data = clusters[params.cluster as ClusterKey];
  if (!data) return {};
  return {
    title: `${data.title} | FinanceSphere`,
    description: data.description,
    alternates: { canonical: `/learn/${params.cluster}` }
  };
}

export default function ClusterHubPage({ params }: { params: { cluster: string } }) {
  const data = clusters[params.cluster as ClusterKey];
  if (!data) {
    return <div className="rounded-xl border bg-white p-5">Cluster not found.</div>;
  }

  return (
    <section className="space-y-5 rounded-2xl border bg-white p-6">
      <header>
        <h1 className="text-3xl font-bold">{data.title}</h1>
        <p className="mt-2 text-slate-600">{data.description}</p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {data.links.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-xl border border-slate-200 p-4 text-sm font-medium hover:border-blue-300 hover:bg-blue-50">
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
