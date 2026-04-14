import type { Metadata } from 'next';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';
import { BlogCard } from '@/components/ui/BlogCard';
import { getPosts } from '@/lib/markdown';

const defaultCategoryJourney = [
  { href: '/calculators/savings-goal-calculator', label: 'Savings Goal Calculator' },
  { href: '/calculators/loan-calculator', label: 'Loan Calculator' },
  { href: '/calculators/mortgage-calculator', label: 'Mortgage Calculator' }
];

function normalizeCategory(value: string) {
  try {
    return decodeURIComponent(value).trim().toLowerCase().replace(/\s+/g, '-');
  } catch {
    return value.trim().toLowerCase().replace(/\s+/g, '-');
  }
}

function formatCategoryLabel(category: string) {
  return normalizeCategory(category).replace(/-/g, ' ');
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const normalizedCategory = normalizeCategory(params.category);
  const categoryLabel = formatCategoryLabel(normalizedCategory);

  return {
    title: `${categoryLabel} Guides and Decision Support | FinanceSphere Blog`,
    description: `Browse FinanceSphere ${categoryLabel} guides with practical walkthroughs, calculators, and next-step links.`,
    alternates: { canonical: `/blog/category/${normalizedCategory}` }
  };
}

export default function BlogCategoryPage({ params }: { params: { category: string } }) {
  const currentCategory = normalizeCategory(params.category);
  if (params.category !== currentCategory) {
    permanentRedirect(`/blog/category/${currentCategory}`);
  }
  const posts = getPosts().filter((post) => normalizeCategory(post.category) === currentCategory);
  const categoryLabel = formatCategoryLabel(params.category);
  const categoryScenario = `A household earning $74K reads ${categoryLabel} advice built around a $1,000 monthly surplus.`;

  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold">Category: {categoryLabel}</h1>
        <p className="mt-2 text-slate-600">Explore guides in this category, then test them under your actual constraints before acting.</p>
        <p className="mt-2 text-sm italic text-slate-500">A plan that fails once is not a plan.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {defaultCategoryJourney.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full border px-3 py-1 hover:border-blue-200 hover:bg-blue-50">{item.label}</Link>
          ))}
          <Link href="/blog" className="rounded-full border px-3 py-1 hover:border-blue-200 hover:bg-blue-50">All blog topics</Link>
        </div>
      </header>

      {posts.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                title={post.title}
                excerpt={post.description}
                slug={post.slug}
                category={post.category}
              />
            ))}
          </div>
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">After reading this category</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
              <li>Choose one recommendation you can apply this month.</li>
              <li>Run one calculator with your actual numbers.</li>
              <li>Compare at least two providers before committing.</li>
            </ol>
          </section>

          <section className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
            <h2 className="text-lg font-semibold text-slate-900">Where this breaks</h2>
            <div className="mt-2 space-y-2 text-sm text-slate-700">
              <p><span className="font-semibold">Scenario:</span> {categoryScenario}</p>
              <p><span className="font-semibold">Failure:</span> They copy the tactic exactly, hit one unexpected cost, and stop after two weeks.</p>
              <p><span className="font-semibold">Consequence:</span> They label the strategy “bad,” even though the issue was mismatch between advice and cash-flow reality.</p>
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <p><span className="font-semibold text-blue-700">If your monthly surplus is under $250</span> → start with expense-floor changes before aggressive targets.</p>
              <p><span className="font-semibold text-blue-700">If your monthly surplus is over $600</span> → test faster acceleration, then keep only what survives a bad-month run.</p>
            </div>
          </section>
        </>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-lg font-semibold text-slate-900">No published articles in this category yet</h2>
          <p className="mt-1 text-sm text-slate-600">Try one of our active categories below while we publish more category-specific guides.</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link href="/blog/category/investing" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium hover:border-blue-300 hover:text-blue-700">Investing category</Link>
            <Link href="/blog/category/loans" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium hover:border-blue-300 hover:text-blue-700">Loans category</Link>
            <Link href="/blog/category/savings-accounts" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium hover:border-blue-300 hover:text-blue-700">Savings category</Link>
          </div>
        </section>
      )}
    </section>
  );
}
