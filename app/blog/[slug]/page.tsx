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
import { AdUnit } from '@/components/ui/AdUnit';
import { AD_SLOTS } from '@/lib/adSlots';

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
    title: 'Card decision lens: protect downside before chasing rewards',
    intro: 'This guide is most useful when you are deciding whether a card helps your cash flow or makes it easier to carry debt.',
    points: [
      { label: 'Strong fit signal', text: 'Choose the setup that still works when one month runs above budget and you cannot revolve a balance.' },
      { label: 'Frequent trap', text: 'Do not value points at premium redemption rates you are unlikely to use.' },
      { label: 'Pause condition', text: 'If your emergency buffer is below one month of expenses, prioritize liquidity before applying for another card.' }
    ]
  },
  mortgages: {
    title: 'Mortgage readiness snapshot: execution risk matters as much as rate',
    intro: 'Use this guide if you expect to apply in the next 30 to 120 days and need fewer underwriting surprises.',
    points: [
      { label: 'Strong fit signal', text: 'Choose the path that keeps your DTI, document quality, and reserves strong through closing.' },
      { label: 'Frequent trap', text: 'Do not compare offers using only note rate; check APR and total fee stack together.' },
      { label: 'Pause condition', text: 'If timeline flexibility is low, prioritize execution reliability over tiny rate differences.' }
    ]
  },
  tax: {
    title: 'Tax planning frame: optimize after-tax outcomes, not headline returns',
    intro: 'This guide helps when your next contribution or withdrawal decision can move you into a higher marginal bracket.',
    points: [
      { label: 'Strong fit signal', text: 'Use the account location or contribution mix that reduces total expected lifetime tax drag.' },
      { label: 'Frequent trap', text: 'Do not make a one-year tax move that hurts long-term flexibility across account types.' },
      { label: 'Pause condition', text: 'If taxable income is near a bracket edge, model both sides before changing contribution strategy.' }
    ]
  }
};

const moneyImpactByCategory: Record<string, { hook: string; scenario: string; decision: string; action: string }> = {
  'credit-cards': {
    hook: 'Carrying a $5,000 balance at 24% APR can cost about $1,200/year in interest alone.',
    scenario: 'If you switch to a lower-APR path and add $200/month payoff, you can often compress payoff time by years.',
    decision: 'Use the linked calculator to compare annual fee + APR downside versus realistic rewards upside.',
    action: 'Keep only options that remain net-positive in your stress-case month.'
  },
  mortgages: {
    hook: 'On a $400,000 30-year mortgage, moving from 7% to 6% can reduce lifetime interest by roughly $87,000.',
    scenario: 'Paying an extra $200/month toward principal can shorten payoff by years when the payment is sustainable.',
    decision: 'Run base and stress assumptions before accepting a lender quote.',
    action: 'Choose the loan that stays affordable if one major expense hits.'
  },
  investing: {
    hook: 'A 1% annual fee drag can reduce long-term portfolio outcomes by six figures over multi-decade horizons.',
    scenario: 'Increasing automated investing from $500 to $650/month can add roughly $80,000+ over 20 years at 8% growth.',
    decision: 'Compare all-in cost and behavior support, not features alone.',
    action: 'Automate first, then optimize allocation once consistency is stable.'
  }
};

// Category-specific failure insight replaces the generic timeline stress test
const failureInsightByCategory: Record<string, { title: string; scenario: string; rule: string }> = {
  'credit-cards': {
    title: 'Where credit card strategies break',
    scenario: 'A household earns $400 in annual rewards but carries a balance for two months at 26% APR. Those two months of interest cost roughly $215 — wiping out nearly half the year\'s reward value.',
    rule: 'A strategy that only works if you never carry a balance is not a strategy. It is a bet on perfect behavior every month.'
  },
  mortgages: {
    title: 'Where mortgage plans break',
    scenario: 'A buyer chooses the 15-year term because the interest savings are real. Eighteen months later, a $12,000 HVAC replacement and a one-month income gap at the same time creates structural payment stress.',
    rule: 'The mortgage that works on paper is not always the one that works across 180 months of real life. Test the payment against a genuinely bad month before signing.'
  },
  investing: {
    title: 'Where investing plans break',
    scenario: 'A household starts at $650/month after a salary increase. When a $1,400 car repair hits three months later, contributions stop. The pause becomes a habit. The behavior gap costs more than any fee optimization would have saved.',
    rule: 'Set contributions from your worst recent month — not your best. A smaller amount that runs for 10 years beats an ambitious one you pause twice a year.'
  },
  tax: {
    title: 'Where tax strategies break',
    scenario: 'A household makes a Roth conversion in a year that turns out not to be a low-income year — because a bonus hits at year-end. The conversion pushes them into a higher bracket and the anticipated tax savings reverse.',
    rule: 'Tax decisions are made with incomplete information. Model the scenario at year-end, not in January. Bracket edges are the most expensive place to guess wrong.'
  },
  loans: {
    title: 'Where loan plans break',
    scenario: 'A borrower consolidates $18,000 of debt into a 60-month personal loan for a lower payment. Without a no-new-spending rule, two of the original card balances rebuild within 18 months. Total debt is now higher than before consolidation.',
    rule: 'Debt consolidation is a structural tool, not a cure. It only works if spending behavior changes at the same time. Same income, same habits, lower payment — the gap usually refills.'
  },
  'savings-accounts': {
    title: 'Where savings strategies break',
    scenario: 'A household chases a 5.10% HYSA with a 10-day external transfer window. A true emergency arrives on a Friday — the transfer does not clear until the following week. They cover the gap with a credit card at 26% APR.',
    rule: 'Emergency cash is only as useful as its transfer speed. A slightly lower APY with same-day access can be worth more than the best rate in a slow account.'
  },
  budgeting: {
    title: 'Where budgeting plans break',
    scenario: 'A household builds a tight 50/30/20 budget in a good month. Three months later, a $900 car repair and a medical co-pay arrive in the same week. The "savings" category funds the gap and the system collapses.',
    rule: 'A budget is not stress-tested until it has survived one real emergency without requiring new debt. Run the scenario before assuming the plan is working.'
  },
  'retirement-planning': {
    title: 'Where retirement plans break',
    scenario: 'A household targets 15% contribution but relies on end-of-year bonuses to hit the number. In the year a bonus does not come, contributions are 8% for the year. Over a decade, these gaps quietly compress the final number.',
    rule: 'Retirement plans that depend on discretionary decisions in good months often underperform projections. Automate on base salary; treat any bonus as optional extra, not required core.'
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
    openGraph: { title: post.title, description: post.metaDescription ?? post.description, type: 'article', url: absoluteUrl(canonicalPath) },
    twitter: { card: 'summary_large_image', title: post.title, description: post.metaDescription ?? post.description }
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
    description: post.metaDescription ?? post.description,
    slug: post.slug,
    authorName: (AUTHOR_PROFILES[post.authorId] ?? AUTHOR_PROFILES[PRIMARY_AUTHOR_ID])?.name,
    authorRole: (AUTHOR_PROFILES[post.authorId] ?? AUTHOR_PROFILES[PRIMARY_AUTHOR_ID])?.role,
    reviewerName: (AUTHOR_PROFILES[post.reviewedById] ?? AUTHOR_PROFILES[EDITORIAL_REVIEWER_ID])?.name,
    publishedTime: post.date,
    modifiedTime: post.updatedAt
  });
  const pageSchema = webpageSchema({
    pathname: `/blog/${post.slug}`,
    name: post.title,
    description: post.metaDescription ?? post.description
  });
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
  const cluster = getClusterForCategory(post.category);
  const diversifiedMoneyLinks = getDiversifiedMoneyLinks(cluster).filter((item) => !comparisonLinks.some((link) => link.href === item.href));
  const decisionPanel =
    decisionPanelByCategory[post.category] ??
    ({
      title: 'How to use this guide in one pass',
      intro: 'Use this page to make one concrete decision, then pressure-test it with your own numbers.',
      points: [
        { label: 'Use this when', text: `This is most useful when you are actively comparing ${post.category.replace(/-/g, ' ')} options in the next 30 to 90 days.` },
        { label: 'What to prioritize', text: 'Choose the option that holds up in a bad-month scenario, not only in a best-case projection.' },
        { label: 'What to avoid', text: 'Do not optimize for one metric alone; always check fees, timeline risk, and flexibility together.' }
      ]
    } as const);
  const additionalRelatedBlogs = posts.filter((item) => item.slug !== post.slug && !relatedPosts.some((r) => r.slug === item.slug)).slice(0, 2);
  const moneyImpact = moneyImpactByCategory[post.category] ?? {
    hook: 'Moving one major input can materially change outcomes: for example, increasing investing from $500 to $550 monthly can add about $39,000 over 20 years at 8% growth.',
    scenario: 'Compare at least two numeric scenarios such as a 1-point rate change or an extra $200 monthly payment before committing.',
    decision: 'Use this article with a calculator and a comparison page for a full decision loop.',
    action: 'Document your next step: act now, wait, or gather one missing data point.'
  };

  return (
    <article className="mx-auto max-w-4xl space-y-8 rounded-xl bg-white p-5 sm:p-6 lg:p-8 dark:bg-neutral-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsSchema) }} />
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> : null}

      <header className="space-y-4">
        <h1 className="text-3xl font-bold leading-tight text-neutral-900 dark:text-neutral-100">{post.title}</h1>
        <p className="max-w-3xl leading-relaxed text-neutral-600 dark:text-neutral-400">{post.description}</p>
        <div className={`relative aspect-[16/9] overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br ${visual.heroClassName} p-4 sm:p-6 dark:border-neutral-700`}>
          <Image src={visual.src} alt={visual.alt} fill priority sizes="(max-width: 768px) 100vw, 900px" className="object-cover p-4 sm:p-6" />
        </div>
        <SocialShareButtons title={post.title} url={absoluteUrl(`/blog/${post.slug}`)} />
      </header>

      <ArticleTrustPanel authorId={post.authorId} reviewedById={post.reviewedById} updatedAt={post.updatedAt} />

      <DecisionSupportPanel
        title={decisionPanel.title}
        tone="blue"
        intro={decisionPanel.intro}
        points={decisionPanel.points}
        links={calculatorSupportLinks.slice(0, 2)}
      />

      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/40 dark:bg-emerald-950/30">
        <h2 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100">What this means in practice</h2>
        <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
          <article><h3 className="font-semibold text-emerald-900 dark:text-emerald-100">The numbers</h3><p className="mt-1 text-emerald-900 dark:text-emerald-100">{moneyImpact.hook}</p></article>
          <article><h3 className="font-semibold text-emerald-900 dark:text-emerald-100">In practice</h3><p className="mt-1 text-emerald-900 dark:text-emerald-100">{moneyImpact.scenario}</p></article>
          <article><h3 className="font-semibold text-emerald-900 dark:text-emerald-100">How to decide</h3><p className="mt-1 text-emerald-900 dark:text-emerald-100">{moneyImpact.decision}</p></article>
          <article><h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Your next step</h3><p className="mt-1 text-emerald-900 dark:text-emerald-100">{moneyImpact.action}</p></article>
        </div>
      </section>

      {(() => {
        const insight = failureInsightByCategory[post.category];
        if (!insight) return null;
        return (
          <section className="rounded-xl border border-amber-200 bg-amber-50/70 p-5 dark:border-amber-500/40 dark:bg-amber-950/20">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{insight.title}</h2>
            <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
              <article className="rounded-lg border border-amber-200/70 bg-white/90 p-3 dark:border-amber-500/40 dark:bg-slate-900">
                <h3 className="font-semibold text-amber-800 dark:text-amber-300">Real-life scenario</h3>
                <p className="mt-1 text-slate-700 dark:text-slate-300">{insight.scenario}</p>
              </article>
              <article className="rounded-lg border border-amber-200/70 bg-white/90 p-3 dark:border-amber-500/40 dark:bg-slate-900">
                <h3 className="font-semibold text-amber-800 dark:text-amber-300">The rule that holds</h3>
                <p className="mt-1 text-slate-700 dark:text-slate-300">{insight.rule}</p>
              </article>
            </div>
          </section>
        );
      })()}


      <section className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
        <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Table of contents</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
          {toc.map((item) => (
            <li key={item}>
              <a
                className="content-link"
                href={`#${item.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')}`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <InteractiveArticleContent content={post.content} />

      <AdUnit slot={AD_SLOTS.BLOG_POST_TOP} format="auto" className="my-2" />

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

      <section className="rounded-2xl border border-blue-200 bg-white p-5 dark:border-blue-500/40 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Get the decision checklist</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Use this form to receive structured weekly decision playbooks tied to calculators and scenario analysis.</p>
        <NewsletterForm source="blog" leadMagnet="7-day-money-reset-checklist" className="mt-4 max-w-2xl border-2 border-blue-100" />
      </section>

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

      <DecisionSupportPanel
        title="Read this before deciding"
        intro="Use at least one comparison page and one calculator before applying, opening, or refinancing."
        checklist={[
          'Confirm total annual value after fees and realistic usage assumptions.',
          'Check eligibility constraints, minimum balances, and timeline sensitivity.',
          'Write your next action in one sentence: apply now, wait, or gather more data.'
        ]}
        links={[
          ...comparisonLinks.slice(0, 2).map((item) => ({ href: item.href, label: item.label })),
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
          {relatedPosts.length < 2 && additionalRelatedBlogs.length > 0 && (
            <ul className="grid gap-2 text-sm md:grid-cols-2">
              {additionalRelatedBlogs.map((related) => (
                <li key={`fallback-${related.slug}`}>
                  <Link href={`/blog/${related.slug}`} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200">
                    {related.title}
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

      <AdUnit slot={AD_SLOTS.BLOG_POST_BOTTOM} format="auto" className="my-2" />

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Where to go next</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Complete one decision loop: read the guide, run the numbers, then compare options before committing.</p>
        <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Go deeper</h3>
            <ul className="mt-2 space-y-2">
              <li><Link href={`/learn/${cluster}`} className="content-link-chip w-full justify-start">{post.category.replace(/-/g, ' ')} hub</Link></li>
              {continueLearningLinks[0] ? <li><Link href={continueLearningLinks[0].href} className="content-link-chip w-full justify-start">{continueLearningLinks[0].label}</Link></li> : null}
            </ul>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Run the numbers</h3>
            <ul className="mt-2 space-y-2">
              {calculatorSupportLinks.slice(0, 2).map((item) => (
                <li key={item.href}><Link href={item.href} className="content-link-chip w-full justify-start">{item.label}</Link></li>
              ))}
              {calculatorSupportLinks.length === 0 ? <li><Link href="/calculators" className="content-link-chip w-full justify-start">Browse all calculators</Link></li> : null}
            </ul>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Compare options</h3>
            <ul className="mt-2 space-y-2">
              {comparisonLinks.slice(0, 2).map((item) => (
                <li key={item.href}><Link href={item.href} className="content-link-chip w-full justify-start">{item.label}</Link></li>
              ))}
              {comparisonLinks.length === 0 ? <li><Link href="/comparison" className="content-link-chip w-full justify-start">Comparison frameworks</Link></li> : null}
            </ul>
          </article>
        </div>
      </section>
    </article>
  );
}
