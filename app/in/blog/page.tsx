import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts } from '@/lib/markdown';
import { createCountryPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createCountryPageMetadata({
  title: 'FinanceSphere India Blog | Personal Finance in India',
  description: 'India-focused personal finance guides on SIP, FD, ELSS, PPF, home loans, and practical planning in INR.',
  pathname: '/blog',
  country: 'IN'
});

export default function IndiaBlogPage() {
  const posts = getPosts('IN');

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-3xl font-bold">FinanceSphere India Blog</h1>
        <p className="mt-2 text-slate-600">Country-specific content for Indian readers. No content swapping: each article is separately authored for India.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-blue-700">{post.category.replace(/-/g, ' ')}</p>
            <Link href={`/in/blog/${post.slug}`} className="mt-1 block text-lg font-semibold hover:text-blue-700 hover:underline">{post.title}</Link>
            <p className="mt-2 text-sm text-slate-600">{post.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
