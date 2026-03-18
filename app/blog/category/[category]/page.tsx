import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogCard } from '@/components/ui/BlogCard';
import { getPosts } from '@/lib/markdown';

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const categoryName = params.category.replace(/-/g, ' ');
  return {
    title: `${categoryName} Articles | FinanceSphere Blog`,
    description: `Browse FinanceSphere ${categoryName} articles with practical guidance, calculators, and product comparison links.`,
    alternates: { canonical: `/blog/category/${params.category}` }
  };
}

export default function BlogCategoryPage({ params }: { params: { category: string } }) {
  const posts = getPosts().filter((post) => post.category === params.category);

  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold capitalize">{params.category.replace(/-/g, ' ')} Articles</h1>
        <p className="mt-2 text-slate-600">Focused explainers, examples, and decision frameworks for this topic.</p>
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
