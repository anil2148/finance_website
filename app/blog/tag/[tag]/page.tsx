import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogCard } from '@/components/ui/BlogCard';
import { getPosts, normalizeTag } from '@/lib/markdown';

export function generateMetadata({ params }: { params: { tag: string } }): Metadata {
  const tag = params.tag;
  return {
    title: `#${tag} Articles | FinanceSphere Blog`,
    description: `Browse FinanceSphere articles tagged with ${tag}, including related tools and comparison guides.`,
    alternates: { canonical: `/blog/tag/${encodeURIComponent(tag)}` }
  };
}

export default function BlogTagPage({ params }: { params: { tag: string } }) {
  const currentTag = normalizeTag(params.tag);
  const posts = getPosts().filter((post) => post.tags.some((tag) => normalizeTag(tag) === currentTag));

  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold">Tag: #{params.tag}</h1>
        <p className="mt-2 text-slate-600">
          This tag collects decision-focused articles around one theme. After reading, continue to a matching calculator and comparison page so you can apply the guidance with your own numbers.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Link href="/calculators" className="rounded-full border px-3 py-1 hover:border-blue-200 hover:bg-blue-50">Related tools</Link>
          <Link href="/comparison" className="rounded-full border px-3 py-1 hover:border-blue-200 hover:bg-blue-50">Compare options</Link>
          <Link href="/blog" className="rounded-full border px-3 py-1 hover:border-blue-200 hover:bg-blue-50">All blog topics</Link>
        </div>
      </header>

      {posts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <BlogCard key={p.slug} title={p.title} excerpt={p.description} slug={p.slug} category={p.category} />
          ))}
        </div>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-lg font-semibold text-slate-900">No published articles under this tag yet</h2>
          <p className="mt-1 text-sm text-slate-600">Try a nearby category or start with one of our high-impact decision pages below.</p>
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
