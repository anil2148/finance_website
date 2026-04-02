import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { InteractiveArticleContent } from '@/components/blog/InteractiveArticleContent';
import { createCountryMetadata } from '@/lib/country/seo';
import { getCountryContent, getCountryContentBySlug } from '@/lib/country/content';
import { localizeRelatedLinks } from '@/lib/internalLinks';

export function generateStaticParams() {
  return getCountryContent('in', 'blog').map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getCountryContentBySlug('in', 'blog', params.slug);
  if (!post) return {};
  const usEquivalent = getCountryContentBySlug('us', 'blog', params.slug);

  return createCountryMetadata({
    country: 'in',
    pathname: `/blog/${post.slug}`,
    title: post.seoTitle ?? post.title,
    description: post.metaDescription ?? post.description,
    type: 'article',
    equivalentPaths: {
      in: `/blog/${post.slug}`,
      us: usEquivalent ? `/blog/${post.slug}` : undefined
    }
  });
}

export default function IndiaBlogArticlePage({ params }: { params: { slug: string } }) {
  const post = getCountryContentBySlug('in', 'blog', params.slug);
  if (!post) notFound();

  const related = getCountryContent('in', 'blog').filter((item) => item.slug !== post.slug && item.category === post.category).slice(0, 3);
  const calculators = localizeRelatedLinks([
    { label: 'EMI Calculator', href: '/calculators/emi-calculator', type: 'calculator' },
    { label: 'SIP Calculator', href: '/calculators/sip-calculator', type: 'calculator' }
  ], 'in');

  return (
    <article className="mx-auto max-w-4xl space-y-6 rounded-xl bg-white p-6">
      <header>
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="mt-2 text-slate-600">{post.description}</p>
      </header>
      <InteractiveArticleContent content={post.content} />
      <section className="rounded-xl border border-slate-200 p-4">
        <h2 className="text-lg font-semibold">Related India calculators</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {calculators.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full border border-slate-300 px-3 py-1 text-sm hover:border-blue-300 hover:text-blue-700">{item.label}</Link>
          ))}
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 p-4">
        <h2 className="text-lg font-semibold">Continue with India guides</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {related.map((item) => (
            <li key={item.slug}><Link href={`/in/blog/${item.slug}`} className="hover:text-blue-700 hover:underline">{item.title}</Link></li>
          ))}
        </ul>
      </section>
    </article>
  );
}
