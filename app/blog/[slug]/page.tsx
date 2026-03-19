import Link from 'next/link';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getHeadings, getPostBySlug, getPosts } from '@/lib/markdown';
import { InteractiveArticleContent } from '@/components/blog/InteractiveArticleContent';
import { articleSchema } from '@/lib/seo';
import { SocialShareButtons } from '@/components/ui/SocialShareButtons';
import { ArticleTrustPanel } from '@/components/blog/ArticleTrustPanel';
import { getRelatedLinks } from '@/lib/internalLinks';
import { NewsletterForm } from '@/components/NewsletterForm';
import { getBlogVisual } from '@/lib/blogVisuals';
import { defaultMatchingCalculatorLinks, matchingCalculatorLinksByBlogCategory, resolveCalculatorHref } from '@/lib/calculatorLinks';
import { redirectForSlug } from '@/lib/blogCleanup';

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  const canonicalPath = `/blog/${post.slug}`;

  return {
    title: post.seoTitle ?? post.title,
    description: post.metaDescription ?? post.description,
    alternates: { canonical: canonicalPath },
    openGraph: { title: post.seoTitle ?? post.title, description: post.metaDescription ?? post.description, type: 'article', url: `https://financesphere.io${canonicalPath}` },
    twitter: { card: 'summary_large_image', title: post.seoTitle ?? post.title, description: post.metaDescription ?? post.description }
  };
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    const mappedRedirect = redirectForSlug(params.slug);
    if (mappedRedirect?.destination) {
      redirect(mappedRedirect.destination);
    }
    notFound();
  }

  const posts = getPosts();
  const relatedPosts = posts
    .filter((item) => item.slug !== post.slug && (item.category === post.category || item.tags.some((tag) => post.tags.includes(tag))))
    .slice(0, 3);

  const schema = articleSchema({
    title: post.title,
    description: post.description,
    slug: post.slug,
    publishedTime: post.date,
    modifiedTime: post.updatedAt
  });
  const toc = getHeadings(post.content);
  const isTaxBracketArticle = post.slug === '2026-federal-tax-brackets-marginal-rate-decisions';
  const faqSchema = isTaxBracketArticle
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is a marginal tax rate?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A marginal tax rate is the tax rate applied to your next dollar of taxable ordinary income.'
            }
          },
          {
            '@type': 'Question',
            name: 'How do tax brackets work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Federal tax brackets are progressive, so each band of income is taxed at its own rate instead of your entire income being taxed at the top rate.'
            }
          },
          {
            '@type': 'Question',
            name: 'Should I choose Roth or pre-tax contributions?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The best choice depends on your current marginal bracket, expected future tax rate, and current cash-flow flexibility. Many households use a blend for tax diversification.'
            }
          }
        ]
      }
    : null;
  const relatedLinks = getRelatedLinks(post.category);
  const calculatorLinks = matchingCalculatorLinksByBlogCategory[post.category] ?? defaultMatchingCalculatorLinks;
  const visual = getBlogVisual(post.category, post.slug);
  const calculatorSupportLinks = Array.from(
    new Map(
      [
        ...calculatorLinks.map((item) => ({ label: item.label, href: resolveCalculatorHref(item.href) })),
        ...relatedLinks.filter((link) => link.type === 'calculator').map((link) => ({ label: link.label, href: link.href }))
      ].map((link) => [link.href, link])
    ).values()
  );
  const comparisonLinks = Array.from(
    new Map(
      relatedLinks
        .filter((link) => link.type === 'comparison')
        .map((link) => [link.href, link] as const)
    ).values()
  );
  const continueLearningLinks = Array.from(
    new Map(
      relatedLinks
        .filter((link) => link.type === 'hub' || link.type === 'article')
        .map((link) => [link.href, link] as const)
    ).values()
  );

  return (
    <article className="mx-auto max-w-4xl space-y-8 rounded-xl bg-white p-5 sm:p-6 lg:p-8 dark:bg-gray-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> : null}

      <header className="space-y-4">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">{post.title}</h1>
        <p className="max-w-3xl leading-relaxed text-gray-600 dark:text-gray-400">{post.description}</p>
        <div className={`relative aspect-[16/9] overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br ${visual.heroClassName} p-4 sm:p-6 dark:border-gray-700`}>
          <Image src={visual.src} alt={visual.alt} fill priority sizes="(max-width: 768px) 100vw, 900px" className="object-cover p-4 sm:p-6" />
        </div>
        <SocialShareButtons title={post.title} url={`https://financesphere.io/blog/${post.slug}`} />
      </header>

      <ArticleTrustPanel authorId={post.authorId} reviewedById={post.reviewedById} updatedAt={post.updatedAt} />

      <section className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">Table of contents</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-400">
          {toc.map((item) => (
            <li key={item}>
              <a
                className="text-blue-600 hover:underline dark:text-blue-400"
                href={`#${item.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')}`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <InteractiveArticleContent content={post.content} />

      <NewsletterForm source="blog" leadMagnet="7-day-money-reset-checklist" className="max-w-2xl border-2 border-blue-100" />

      {calculatorSupportLinks.length > 0 && (
        <section className="rounded-xl bg-blue-600 p-5 text-white">
          <h3 className="text-xl font-semibold">Related tools</h3>
          <p className="text-sm text-blue-100">Run your numbers first so the next decision is based on your actual scenario, not averages.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {calculatorSupportLinks.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700">
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {comparisonLinks.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">Compare options</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            {comparisonLinks.map((link) => (
              <Link key={link.href} className="rounded-full border border-gray-300 px-3 py-1 text-gray-900 dark:border-gray-600 dark:text-gray-100" href={link.href}>{link.label}</Link>
            ))}
          </div>
        </section>
      )}

      {(continueLearningLinks.length > 0 || relatedPosts.length > 0) && (
        <section className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Continue learning</h2>
          {relatedPosts.length > 0 && (
            <ul className="grid gap-3 text-sm md:grid-cols-2">
              {relatedPosts.map((related) => (
                <li key={related.slug}>
                  <Link href={`/blog/${related.slug}`} className="block rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-gray-700 dark:bg-gray-950 dark:hover:border-blue-500/50 dark:hover:bg-blue-900/20">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">{related.category.replace(/-/g, ' ')}</p>
                    <h3 className="mt-1 text-base font-semibold text-gray-900 dark:text-gray-100">{related.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{related.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {continueLearningLinks.length > 0 && (
            <div className="flex flex-wrap gap-2 text-sm">
              {continueLearningLinks.map((link) => (
                <Link key={link.href} className="rounded-full border border-gray-300 bg-white px-3 py-1 text-blue-600 hover:underline dark:border-gray-600 dark:bg-gray-950 dark:text-blue-400" href={link.href}>{link.label}</Link>
              ))}
            </div>
          )}
          {relatedPosts.length === 0 && continueLearningLinks.length === 0 && (
            <p className="text-gray-600 dark:text-gray-400">More related guides coming soon.</p>
          )}
        </section>
      )}
    </article>
  );
}
