import { BlogCard } from '@/components/ui/BlogCard';
import { getPosts } from '@/lib/markdown';

export default function BlogCategoryPage({ params }: { params: { category: string } }) {
  const posts = getPosts().filter((post: any) => post.category === params.category);

  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold capitalize">{params.category.replace(/-/g, ' ')} Articles</h1>
        <p className="mt-2 text-slate-600">Focused explainers, examples, and decision frameworks for this topic.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <BlogCard key={p.slug} title={p.title} excerpt={p.description} slug={p.slug} category={p.category} />
        ))}
      </div>
    </section>
  );
}
