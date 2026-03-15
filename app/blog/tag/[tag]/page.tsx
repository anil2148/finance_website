import { BlogCard } from '@/components/ui/BlogCard';
import { getPosts, normalizeTag } from '@/lib/markdown';

export default function BlogTagPage({ params }: { params: { tag: string } }) {
  const currentTag = normalizeTag(params.tag);
  const posts = getPosts().filter((post) => post.tags.some((tag) => normalizeTag(tag) === currentTag));

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Tag: #{decodeURIComponent(params.tag)}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <BlogCard key={p.slug} title={p.title} excerpt={p.description} slug={p.slug} />)}
      </div>
    </section>
  );
}
