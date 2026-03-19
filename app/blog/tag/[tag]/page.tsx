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
        <p className="mt-2 text-slate-600">Articles grouped by this theme with practical actions and related tools.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Link href="/calculators" className="rounded-full border px-3 py-1 hover:border-blue-200 hover:bg-blue-50">Related tools</Link>
          <Link href="/comparison" className="rounded-full border px-3 py-1 hover:border-blue-200 hover:bg-blue-50">Compare options</Link>
          <Link href="/blog" className="rounded-full border px-3 py-1 hover:border-blue-200 hover:bg-blue-50">All blog topics</Link>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <BlogCard key={p.slug} title={p.title} excerpt={p.description} slug={p.slug} category={p.category} />
        ))}
      </div>
    </section>
  );
}
