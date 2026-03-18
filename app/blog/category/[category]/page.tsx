import type { Metadata } from 'next';
import Link from 'next/link';
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
  }
};

const featuredOrderByCategory: Record<string, string[]> = {
  investing: ['seo-investing-for-beginners-roadmap', 'seo-tax-efficient-investing-tips'],
  loans: ['seo-mortgage-preapproval-checklist', 'seo-how-to-compare-personal-loan-apr', 'seo-debt-to-income-ratio-guide'],
  'credit-cards': ['seo-how-credit-utilization-works'],
  'savings-accounts': ['seo-emergency-fund-3-to-6-months', 'seo-high-yield-savings-basics', 'seo-50-30-20-rule-for-saving']
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

  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold">{copy.title}</h1>
        <p className="mt-2 text-slate-600">{copy.description}</p>
        <p className="mt-2 text-sm text-slate-500">{copy.editorialAngle}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Link href="/calculators" className="rounded-full border px-3 py-1 hover:border-blue-200 hover:bg-blue-50">Related tools</Link>
          <Link href="/comparison" className="rounded-full border px-3 py-1 hover:border-blue-200 hover:bg-blue-50">Compare options</Link>
          <Link href="/blog" className="rounded-full border px-3 py-1 hover:border-blue-200 hover:bg-blue-50">All blog topics</Link>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedPosts.map((p) => (
          <BlogCard key={p.slug} title={p.title} excerpt={p.description} slug={p.slug} category={p.category} />
        ))}
      </div>
    </section>
  );
}
