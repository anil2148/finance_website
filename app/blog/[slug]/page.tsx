import Link from 'next/link';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getHeadings, getPostBySlug, getPosts } from '@/lib/markdown';
import { InteractiveArticleContent } from '@/components/blog/InteractiveArticleContent';
import { absoluteUrl, articleSchema, breadcrumbSchema, webpageSchema } from '@/lib/seo';
import { SocialShareButtons } from '@/components/ui/SocialShareButtons';
import { ArticleTrustPanel } from '@/components/blog/ArticleTrustPanel';
import { getClusterForCategory, getDiversifiedMoneyLinks, getRelatedLinks } from '@/lib/internalLinks';
import { NewsletterForm } from '@/components/NewsletterForm';
import { getBlogVisual } from '@/lib/blogVisuals';
import { defaultMatchingCalculatorLinks, matchingCalculatorLinksByBlogCategory, resolveCalculatorHref } from '@/lib/calculatorLinks';
import { redirectForSlug } from '@/lib/blogCleanup';
import { AUTHOR_PROFILES, EDITORIAL_REVIEWER_ID, PRIMARY_AUTHOR_ID } from '@/lib/authors';
import { DecisionSupportPanel } from '@/components/common/DecisionSupportPanel';

export const dynamic = 'force-dynamic';

const decisionPanelByCategory: Record<
  string,
  {
    title: string;
    intro: string;
    points: Array<{ label: string; text: string }>;
  }
> = {
  'credit-cards': {
    title: 'Card choice framework: protect downside before points upside',
    intro: 'This guide is most useful when you are deciding whether a card helps your cash flow or makes it easier to carry debt.',
    points: [
      { label: 'Best option if...', text: 'Choose the setup that still works when one month runs above budget and you cannot revolve a balance.' },
      { label: 'Avoid this mistake', text: 'Do not value points at premium redemption rates you are unlikely to use.' },
      { label: 'Decision trigger', text: 'If your emergency buffer is below one month of expenses, prioritize liquidity before applying for another card.' }
    ]
  },
  mortgages: {
    title: 'Mortgage readiness lens: execution risk is a real cost',
    intro: 'Use this guide if you expect to apply in the next 30 to 120 days and need fewer underwriting surprises.',
    points: [
      { label: 'Best option if...', text: 'Choose the path that keeps your DTI, document quality, and reserves strong through closing.' },
      { label: 'Avoid this mistake', text: 'Do not compare offers using only note rate; check APR and total fee stack together.' },
      { label: 'Decision trigger', text: 'If timeline flexibility is low, prioritize execution reliability over tiny rate differences.' }
    ]
  },
  tax: {
    title: 'Tax decision lens: optimize lifetime after-tax flexibility',
    intro: 'This guide helps when your next contribution or withdrawal decision can move you into a higher marginal bracket.',
    points: [
      { label: 'Best option if...', text: 'Use the account location or contribution mix that reduces total expected lifetime tax drag.' },
      { label: 'Avoid this mistake', text: 'Do not make a one-year tax move that hurts long-term flexibility across account types.' },
      { label: 'Decision trigger', text: 'If taxable income is near a bracket edge, model both sides before changing contribution strategy.' }
    ]
  }
};

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
    openGraph: { title: post.seoTitle ?? post.title, description: post.metaDescription ?? post.description, type: 'article', url: absoluteUrl(canonicalPath) },
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
  const primaryRelatedPosts = posts
    .filter((item) => item.slug !== post.slug && (item.category === post.category || item.tags.some((tag) => post.tags.includes(tag))))
    .slice(0, 3);
  const relatedPosts =
    primaryRelatedPosts.length >= 2
      ? primaryRelatedPosts
      : Array.from(
          new Map(
            [...primaryRelatedPosts, ...posts.filter((item) => item.slug !== post.slug).slice(0, 4)].map((item) => [item.slug, item])
          ).values()
        ).slice(0, 3);

  const displayTitle = post.seoTitle ?? post.title;
  const displayDescription = post.metaDescription ?? post.description;
  const schema = articleSchema({
    title: displayTitle,
    description: post.description,
    slug: post.slug,
    authorName: (AUTHOR_PROFILES[post.authorId] ?? AUTHOR_PROFILES[PRIMARY_AUTHOR_ID])?.name,
    authorRole: (AUTHOR_PROFILES[post.authorId] ?? AUTHOR_PROFILES[PRIMARY_AUTHOR_ID])?.role,
    reviewerName: (AUTHOR_PROFILES[post.reviewedById] ?? AUTHOR_PROFILES[EDITORIAL_REVIEWER_ID])?.name,
    publishedTime: post.date,
    modifiedTime: post.updatedAt
  });
  const pageSchema = webpageSchema({ pathname: `/blog/${post.slug}`, name: displayTitle, description: displayDescription });
  const crumbsSchema = breadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Blog', item: '/blog' },
    { name: post.title, item: `/blog/${post.slug}` }
  ]);
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
            name: 'Do tax brackets apply to all of my income?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Federal tax brackets are progressive, so only the portion of income inside each bracket is taxed at that bracket’s rate.'
            }
          },
          {
            '@type': 'Question',
            name: 'Should I choose Roth or pre-tax contributions?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It depends on whether your future tax rate will likely be higher or lower than your current one. Many households use a blend for flexibility.'
            }
          },
          {
            '@type': 'Question',
            name: 'When does a Roth conversion make sense?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Roth conversions are often most attractive in temporarily low-income years, especially when the conversion can stay within a target bracket and tax can be paid from outside cash.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can I really realize long-term capital gains at 0%?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'In some cases, yes. If taxable income falls within the 0% long-term capital-gains range for your filing status, some or all gains may be taxed at 0% federally.'
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
  const enrichedCalculatorLinks =
    calculatorSupportLinks.length >= 2
      ? calculatorSupportLinks
      : Array.from(
          new Map(
            [
              ...calculatorSupportLinks,
              { label: 'Budget Planner', href: '/calculators/budget-planner' },
              { label: 'Savings Goal Calculator', href: '/calculators/savings-goal-calculator' },
              { label: 'Loan Calculator', href: '/calculators/loan-calculator' }
            ].map((item) => [item.href, item])
          ).values()
        );
  const comparisonLinks = Array.from(
    new Map(
      relatedLinks
        .filter((link) => link.type === 'comparison')
        .map((link) => [link.href, link] as const)
    ).values()
  );
  const enrichedComparisonLinks =
    comparisonLinks.length > 0
      ? comparisonLinks
      : [
          { label: 'Compare financial products', href: '/comparison', type: 'comparison' as const },
          { label: 'Best savings accounts', href: '/best-savings-accounts-usa', type: 'comparison' as const }
        ];
  const continueLearningLinks = Array.from(
    new Map(
      relatedLinks
        .filter((link) => link.type === 'hub' || link.type === 'article')
        .map((link) => [link.href, link] as const)
    ).values()
  );
  const cluster = getClusterForCategory(post.category);
  const diversifiedMoneyLinks = getDiversifiedMoneyLinks(cluster).filter((item) => !comparisonLinks.some((link) => link.href === item.href));
  const decisionPanel =
    decisionPanelByCategory[post.category] ??
    ({
      title: 'Use this guide as a decision worksheet',
      intro: 'Use this page to make one concrete decision, then pressure-test it with your own numbers.',
      points: [
        { label: 'Decision window', text: `This page is most useful when you are comparing ${post.category.replace(/-/g, ' ')} options in the next 30 to 90 days.` },
        { label: 'Stress-test lens', text: 'Choose the option that still works in a bad month, not only in an optimistic projection.' },
        { label: 'Blind spot check', text: 'Do not optimize one metric only; weigh fees, timeline risk, and flexibility together.' }
      ]
    } as const);

  return (
    <article className="mx-auto max-w-4xl space-y-8 rounded-xl bg-white p-5 sm:p-6 lg:p-8 dark:bg-neutral-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsSchema) }} />
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> : null}

      <header className="space-y-4">
        <h1 className="text-3xl font-bold leading-tight text-neutral-900 dark:text-neutral-100">{displayTitle}</h1>
        <p className="max-w-3xl leading-relaxed text-neutral-600 dark:text-neutral-400">{displayDescription}</p>
        <div className={`relative aspect-[16/9] overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br ${visual.heroClassName} p-4 sm:p-6 dark:border-neutral-700`}>
          <Image src={visual.src} alt={visual.alt} fill priority sizes="(max-width: 768px) 100vw, 900px" className="object-cover p-4 sm:p-6" />
        </div>
        <SocialShareButtons title={displayTitle} url={absoluteUrl(`/blog/${post.slug}`)} />
      </header>

      <ArticleTrustPanel authorId={post.authorId} reviewedById={post.reviewedById} updatedAt={post.updatedAt} />

      <DecisionSupportPanel
        title={decisionPanel.title}
        tone="blue"
        intro={decisionPanel.intro}
        points={decisionPanel.points}
        links={enrichedCalculatorLinks.slice(0, 2)}
      />

      <section className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
        <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Table of contents</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
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

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/50 dark:bg-amber-950/30">
        <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">Before you act on this guide</h2>
        <p className="mt-2 text-sm leading-6 text-amber-900 dark:text-amber-100">
          FinanceSphere articles are for informational and educational purposes only and are not individualized investment, tax, legal, or accounting advice.
          Run your own numbers, verify product terms, and consider speaking with a qualified professional for your situation.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/editorial-policy" className="rounded-full border border-amber-300 bg-white/70 px-3 py-1 font-medium text-amber-900 hover:bg-white dark:border-amber-400/60 dark:bg-amber-900/40 dark:text-amber-100">
            Editorial policy
          </Link>
          <Link href="/financial-disclaimer" className="rounded-full border border-amber-300 bg-white/70 px-3 py-1 font-medium text-amber-900 hover:bg-white dark:border-amber-400/60 dark:bg-amber-900/40 dark:text-amber-100">
            Financial disclaimer
          </Link>
          <Link href="/contact" className="rounded-full border border-amber-300 bg-white/70 px-3 py-1 font-medium text-amber-900 hover:bg-white dark:border-amber-400/60 dark:bg-amber-900/40 dark:text-amber-100">
            Contact the editorial team
          </Link>
        </div>
      </section>

      <NewsletterForm source="blog" leadMagnet="7-day-money-reset-checklist" className="max-w-2xl border-2 border-blue-100" />

      {calculatorSupportLinks.length > 0 && (
        <section className="rounded-xl bg-blue-600 p-5 text-white">
          <h3 className="text-xl font-semibold">Run your scenario now</h3>
          <p className="text-sm text-blue-100">Run your numbers first so the next decision is based on your actual scenario, not averages.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {enrichedCalculatorLinks.slice(0, 4).map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700">
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {enrichedComparisonLinks.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">Compare options</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            {enrichedComparisonLinks.map((link) => (
              <Link key={link.href} className="rounded-full border border-gray-300 px-3 py-1 text-gray-900 dark:border-gray-600 dark:text-gray-100" href={link.href}>{link.label}</Link>
            ))}
          </div>
        </section>
      )}

      <DecisionSupportPanel
        title="Read this before deciding"
        intro="Use at least one comparison page and one calculator before applying, opening, or refinancing."
        checklist={[
          'Confirm total annual value after fees and realistic usage assumptions.',
          'Check eligibility constraints, minimum balances, and timeline sensitivity.',
          'Write your next action in one sentence: apply now, wait, or gather more data.'
        ]}
        links={[
          ...enrichedComparisonLinks.slice(0, 2).map((item) => ({ href: item.href, label: item.label })),
          ...diversifiedMoneyLinks.slice(0, 2).map((item) => ({ href: item.href, label: item.label }))
        ]}
      />

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
            <p className="text-gray-600 dark:text-gray-400">No close-match article right now. Continue with a calculator run and comparison framework before making a commitment.</p>
          )}
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Practical next step path</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Move from reading to action: run numbers, compare options, then finalize a checklist.</p>
        <div className="mt-3 grid gap-2 text-sm md:grid-cols-3">
          <Link href={enrichedCalculatorLinks[0]?.href ?? '/calculators'} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-900">Use this calculator next</Link>
          <Link href={enrichedComparisonLinks[0]?.href ?? '/comparison'} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-900">Compare before you choose</Link>
          <Link href={`/learn/${cluster}`} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-900">Read the cluster playbook</Link>
        </div>
      </section>
    </article>
  );
}
