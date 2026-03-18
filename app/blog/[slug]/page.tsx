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

  const schema = articleSchema(post.title, post.description, post.slug);
  const toc = getHeadings(post.content);
  const relatedLinks = getRelatedLinks(post.category);
  const calculatorLinks = matchingCalculatorLinksByBlogCategory[post.category] ?? defaultMatchingCalculatorLinks;
  const visual = getBlogVisual(post.category, post.slug);

  return (
    <article className="space-y-6 rounded-xl bg-white p-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="space-y-4">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-slate-600">{post.description}</p>
        <div className={`relative aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${visual.heroClassName} p-4 sm:p-6`}>
          <Image src={visual.src} alt={visual.alt} fill priority sizes="(max-width: 768px) 100vw, 900px" className="object-cover p-4 sm:p-6" />
        </div>
        <SocialShareButtons title={post.title} url={`https://financesphere.io/blog/${post.slug}`} />
      </header>

      <ArticleTrustPanel authorId={post.authorId} reviewedById={post.reviewedById} updatedAt={post.updatedAt} />

      <section className="rounded-lg border bg-slate-50 p-4">
        <h2 className="font-semibold">Table of contents</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
          {toc.map((item) => (
            <li key={item}>
              <a className="hover:text-slate-900 hover:underline" href={`#${item.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')}`}>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <InteractiveArticleContent content={post.content} />

      <NewsletterForm source="blog" leadMagnet="7-day-money-reset-checklist" className="max-w-2xl border-2 border-blue-100" />

      <section className="rounded-xl bg-blue-600 p-5 text-white">
        <h3 className="text-xl font-semibold">Put this guide into action</h3>
        <p className="text-sm text-blue-100">Use the matching calculators below first, then compare product options that fit your scenario.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {calculatorLinks.map((item) => {
            const href = resolveCalculatorHref(item.href);
            return (
              <Link key={`${item.label}-${href}`} href={href} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700">
                {item.label}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-semibold">Related tools</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            {relatedLinks.filter((link) => link.type === 'calculator').map((link) => (
              <Link key={link.href} className="rounded-full border px-3 py-1" href={link.href}>{link.label}</Link>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-semibold">Compare options</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            {relatedLinks.filter((link) => link.type === 'comparison').map((link) => (
              <Link key={link.href} className="rounded-full border px-3 py-1" href={link.href}>{link.label}</Link>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-semibold">Continue learning</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            {relatedLinks.filter((link) => link.type === 'hub' || link.type === 'article').map((link) => (
              <Link key={link.href} className="rounded-full border px-3 py-1" href={link.href}>{link.label}</Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Related articles</h2>
        <ul className="grid gap-3 text-sm md:grid-cols-2">
          {relatedPosts.map((related) => (
            <li key={related.slug}>
              <Link href={`/blog/${related.slug}`} className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50/40">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{related.category.replace(/-/g, ' ')}</p>
                <h3 className="mt-1 text-base font-semibold text-slate-900">{related.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{related.description}</p>
              </Link>
            </li>
          ))}
          {relatedPosts.length === 0 && <li className="text-slate-500">More related guides coming soon.</li>}
        </ul>
      </section>
    </article>
  );
}
