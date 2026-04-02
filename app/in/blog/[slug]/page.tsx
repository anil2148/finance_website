import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { InteractiveArticleContent } from '@/components/blog/InteractiveArticleContent';
import { getPostBySlug, getPosts } from '@/lib/markdown';
import { absoluteUrl, breadcrumbSchema, createCountryPageMetadata, webpageSchema } from '@/lib/seo';
import { getRelatedLinks } from '@/lib/internalLinks';
import { localizeHref } from '@/lib/country';

export function generateStaticParams() {
  return getPosts('IN').map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug, 'IN');
  if (!post) return {};

  return createCountryPageMetadata({
    title: post.seoTitle ?? post.title,
    description: post.metaDescription ?? post.description,
    pathname: `/blog/${post.slug}`,
    country: 'IN',
    type: 'article'
  });
}

export default function IndiaBlogArticlePage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug, 'IN');
  if (!post) notFound();

  const relatedLinks = getRelatedLinks(post.category).slice(0, 4);
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription ?? post.description,
    url: absoluteUrl(`/in/blog/${post.slug}`),
    datePublished: post.date,
    dateModified: post.updatedAt
  };
  const pageJsonLd = webpageSchema({
    pathname: `/in/blog/${post.slug}`,
    name: post.title,
    description: post.metaDescription ?? post.description
  });
  const breadcrumbsJsonLd = breadcrumbSchema([
    { name: 'Home', item: '/in' },
    { name: 'Blog', item: '/in/blog' },
    { name: post.title, item: `/in/blog/${post.slug}` }
  ]);

  return (
    <article className="mx-auto max-w-4xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-xs uppercase tracking-wide text-blue-700">India Edition</p>
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-slate-600">{post.description}</p>
      <InteractiveArticleContent content={post.content} />

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-lg font-semibold">Continue planning</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {relatedLinks.map((link) => (
            <li key={link.href}>
              <Link href={localizeHref(link.href, 'IN')} className="font-medium text-blue-700 hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />
    </article>
  );
}
