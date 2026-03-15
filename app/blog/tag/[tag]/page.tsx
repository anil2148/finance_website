import { BlogCard } from '@/components/ui/BlogCard';
import { getPosts } from '@/lib/markdown';

export default function BlogTagPage({ params }: { params: { tag: string } }) {
  const posts = getPosts().filter((post) => post.tags.includes(params.tag));

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Tag: #{params.tag}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <BlogCard key={p.slug} title={p.title} excerpt={p.description} slug={p.slug} />)}
      </div>
    </section>
  );
}
