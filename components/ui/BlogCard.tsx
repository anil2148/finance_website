import Link from 'next/link';

export function BlogCard({ title, excerpt, slug }: { title: string; excerpt: string; slug: string }) {
  return (
    <article className="card">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-slate-600">{excerpt}</p>
      <Link className="mt-4 inline-block text-brand" href={`/blog/${slug}`}>Read article →</Link>
    </article>
  );
}
