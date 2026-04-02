import type { Metadata } from 'next';
import Link from 'next/link';
import { createCountryMetadata } from '@/lib/country/seo';
import { getCountryContent } from '@/lib/country/content';

export const metadata: Metadata = createCountryMetadata({
  country: 'in',
  pathname: '/blog',
  title: 'FinanceSphere India Blog | SIP, PPF, FD, Home Loan Guides',
  description: 'India-focused money guides covering SIP, FD, PPF, ELSS, home loans, and tax-saving decisions with practical examples.',
  equivalentPaths: { us: '/blog', in: '/blog' }
});

export default function IndiaBlogPage() {
  const posts = getCountryContent('in', 'blog');

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-3xl font-bold">FinanceSphere India Blog</h1>
        <p className="mt-2 text-slate-600">Localized content clusters for Indian financial products and tax context.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{post.category}</p>
            <Link href={`/in/blog/${post.slug}`} className="mt-1 block text-lg font-semibold hover:text-blue-700 hover:underline">
              {post.title}
            </Link>
            <p className="mt-2 text-sm text-slate-600">{post.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
