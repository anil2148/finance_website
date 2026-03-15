import Link from 'next/link';
import { BlogSearch } from '@/components/ui/BlogSearch';
import { getCategories, getPosts, getTags } from '@/lib/markdown';

export const revalidate = 3600;

export default function BlogPage() {
  const posts = getPosts();
  const categories = getCategories();
  const tags = getTags().slice(0, 12);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SEO Finance Content Engine</h1>
        <p className="text-slate-600">1,000 SEO-ready articles with categories, tags, internal links, and structured FAQ content.</p>
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
          <Link key={tag} href={`/blog/tag/${tag}`} className="rounded-full border px-3 py-1 text-slate-600">
            #{tag}
          </Link>
        ))}
      </div>

      <BlogSearch posts={posts} />
    </section>
  );
}
