import { BlogCard } from '@/components/ui/BlogCard';
import { getPosts } from '@/lib/markdown';

export const revalidate = 3600;

export default function BlogPage() {
  const posts = getPosts();
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Finance Blog</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {posts.slice(0, 24).map((p) => <BlogCard key={p.slug} title={p.title} excerpt={p.description} slug={p.slug} />)}
      </div>
    </section>
  );
}
