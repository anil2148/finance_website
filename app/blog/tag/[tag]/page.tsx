import { BlogCard } from '@/components/ui/BlogCard';
import { getPosts, normalizeTag } from '@/lib/markdown';

export default function BlogTagPage({ params }: { params: { tag: string } }) {
  const currentTag = normalizeTag(params.tag);
  const posts = getPosts().filter((post) => post.tags.some((tag) => normalizeTag(tag) === currentTag));

  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold">Tag: #{decodeURIComponent(params.tag)}</h1>
        <p className="mt-2 text-slate-600">Articles grouped by this theme with practical actions and related tools.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <BlogCard key={p.slug} title={p.title} excerpt={p.description} slug={p.slug} category={p.category} />
        ))}
      </div>
    </section>
  );
}
