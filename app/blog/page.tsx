import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BlogSearch } from '@/components/ui/BlogSearch';
import { getCategories, getPosts, getTags } from '@/lib/markdown';
import { NewsletterForm } from '@/components/NewsletterForm';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'FinanceSphere Blog | Practical Money Guides',
  description: 'Read FinanceSphere explainers on credit cards, mortgages, savings rates, investing basics, and payoff strategies with calculator-backed examples.',
  alternates: { canonical: '/blog' }
};

const startHereGuides = [
  {
    title: 'Investing roadmap for beginners',
    href: '/blog/beginner-investing-roadmap-year-one-milestones',
    next: '/calculators/investment-growth-calculator'
  },
  {
    title: 'How to compare personal loan APR',
    href: '/blog/personal-loan-comparison-for-bad-month-resilience',
    next: '/calculators/loan-calculator'
  },
  {
    title: 'Emergency fund target (3 to 6 months)',
    href: '/blog/emergency-fund-target-by-recovery-timeline',
    next: '/calculators/savings-goal-calculator'
  }
];

export default function BlogPage() {
  const posts = getPosts();
  const categories = getCategories();
  const tags = getTags().slice(0, 12);

  return (
    <section className="space-y-7">
      <div className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1.25fr_1fr] md:items-center">
        <div>
          <h1 className="text-3xl font-bold">FinanceSphere Blog</h1>
          <p className="text-slate-600">Read practical explainers tied to real decisions—choosing between loan terms, reducing credit-card interest, building an emergency fund, and improving long-term investing habits.</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link href="/editorial-policy" className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 font-medium text-slate-700 hover:border-blue-200 hover:text-blue-700">Editorial standards</Link>
            <Link href="/how-we-make-money" className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 font-medium text-slate-700 hover:border-blue-200 hover:text-blue-700">How we make money</Link>
            <Link href="/help" className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 font-medium text-slate-700 hover:border-blue-200 hover:text-blue-700">Help center</Link>
          </div>
        </div>
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-4">
          <Image
            src="/images/blog-visual-general.svg"
            alt="Editorial-style personal finance dashboard illustration for the FinanceSphere blog"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-contain p-4"
          />
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Start here: high-impact guides</h2>
        <p className="mt-1 text-sm text-slate-600">Pick one guide, then continue into the linked calculator so you can apply what you read immediately.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {startHereGuides.map((guide) => (
            <article key={guide.href} className="rounded-xl border border-slate-200 p-4">
              <Link href={guide.href} className="text-base font-semibold text-slate-900 hover:text-blue-700 hover:underline">{guide.title}</Link>
              <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">Recommended next step</p>
              <Link href={guide.next} className="text-sm font-medium text-blue-700 hover:underline">Open matching calculator →</Link>
            </article>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-2 text-sm">
        {categories.map((category) => (
          <Link key={category} href={`/blog/category/${category}`} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50">
            {category}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {tags.map((tag) => (
          <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`} className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
            #{tag}
          </Link>
        ))}
      </div>

      <BlogSearch posts={posts} />

      <NewsletterForm source="blog" className="max-w-xl" />
    </section>
  );
}
