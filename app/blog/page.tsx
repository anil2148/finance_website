import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogSearch } from '@/components/ui/BlogSearch';
import { getCategories, getPosts, getTags } from '@/lib/markdown';
import { NewsletterForm } from '@/components/NewsletterForm';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'FinanceSphere Blog | Practical Money Guides',
  description: 'Read FinanceSphere explainers on credit cards, mortgages, savings rates, investing basics, and payoff strategies with calculator-backed examples.',
  alternates: { canonical: '/blog' }
};

export default function BlogPage() {
  const posts = getPosts();
  const categories = getCategories();
  const tags = getTags().slice(0, 12);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">FinanceSphere Blog</h1>
        <p className="text-slate-600">Read practical explainers tied to real decisions—choosing between loan terms, reducing credit-card interest, building an emergency fund, and improving long-term investing habits.</p>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {categories.map((category) => (
          <Link key={category} href={`/blog/category/${category}`} className="rounded-full bg-slate-100 px-3 py-1">
            {category}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {tags.map((tag) => (
          <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`} className="rounded-full border px-3 py-1 text-slate-600">
            #{tag}
          </Link>
        ))}
      </div>

      <BlogSearch posts={posts} />

      <NewsletterForm source="blog" className="max-w-xl" />
    </section>
  );
}
