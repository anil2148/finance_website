import { BlogCard } from '@/components/ui/BlogCard';
import { getPosts } from '@/lib/markdown';

export default function BlogCategoryPage({ params }: { params: { category: string } }) {
  const posts = getPosts().filter((post: any) => post.category === params.category);
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold capitalize">Category: {params.category}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((p) => <BlogCard key={p.slug} title={p.title} excerpt={p.description} slug={p.slug} />)}
      </div>
    </section>
  );
}
