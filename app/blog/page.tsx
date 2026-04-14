import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BlogSearch } from '@/components/ui/BlogSearch';
import { getCategories, getPosts, getTags } from '@/lib/markdown';
import { NewsletterForm } from '@/components/NewsletterForm';
import { createPageMetadata } from '@/lib/seo';
import { AdUnit } from '@/components/ui/AdUnit';
import { AD_SLOTS } from '@/lib/adSlots';
import { slugifyTag } from '@/lib/tagSlug';

export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
  title: 'FinanceSphere Blog | Practical Money Guides',
  description: 'Read FinanceSphere explainers on credit cards, mortgages, savings rates, investing basics, and payoff strategies with calculator-backed examples.',
  pathname: '/blog'
});

const startHereGuides = [
  {
    title: 'Investing roadmap for beginners',
    href: '/blog/beginner-investing-roadmap-year-one-milestones',
    next: '/calculators/investment-growth-calculator',
    angle: 'Build a year-one contribution system you can sustain in volatile markets.'
  },
  {
    title: 'How to compare personal loan APR',
    href: '/blog/personal-loan-comparison-for-bad-month-resilience',
    next: '/calculators/loan-calculator',
    angle: 'Choose for bad-month resilience, not teaser-rate marketing.'
  },
  {
    title: 'Emergency fund target (3 to 6 months)',
    href: '/blog/emergency-fund-target-by-recovery-timeline',
    next: '/calculators/savings-goal-calculator',
    angle: 'Set your reserve target by recovery timeline and household risk.'
  }
];

const curatedCollections = [
  {
    title: 'Borrowing underwriter-ready',
    description: 'For readers applying in the next 30–120 days: clean your file, improve DTI, and avoid avoidable lender delays.',
    links: [
      { href: '/blog/category/loans', label: 'Loans category' },
      { href: '/learn/loans', label: 'Loans hub' },
      { href: '/compare/mortgage-rate-comparison', label: 'Compare mortgage offers' }
    ]
  },
  {
    title: 'Build savings with operating rules',
    description: 'These pieces focus on automation, transfer reliability, and what to do when fixed costs suddenly spike.',
    links: [
      { href: '/blog/category/savings-accounts', label: 'Savings category' },
      { href: '/calculators/savings-goal-calculator', label: 'Savings Goal Calculator' },
      { href: '/best-savings-accounts-usa', label: 'Best savings accounts' }
    ]
  },
  {
    title: 'Investing process over prediction',
    description: 'Use scenario-based guides on account location, contribution cadence, and downturn rules you can stick with.',
    links: [
      { href: '/blog/category/investing', label: 'Investing category' },
      { href: '/best-investment-apps', label: 'Best investment apps' },
      { href: '/learn/investing', label: 'Investing hub' }
    ]
  }
];

const featuredCategoryOrder = [
  'savings-accounts',
  'credit-cards',
  'investing',
  'loans',
  'budgeting',
  'retirement-planning',
  'tax',
  'saving-money',
  'mortgages'
];

export default function BlogPage() {
  const posts = getPosts();
  const categories = getCategories();
  const tags = getTags().slice(0, 12);
  const featuredAcrossCategories = featuredCategoryOrder
    .map((category) => {
      const topPost = posts.find((post) => post.category === category);
      return topPost ? { category, post: topPost } : null;
    })
    .filter((item): item is { category: string; post: (typeof posts)[number] } => Boolean(item));

  return (
    <section className="space-y-7">
      <div className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1.25fr_1fr] md:items-center dark:border-slate-700 dark:bg-slate-900">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">FinanceSphere Blog</h1>
          <p className="text-slate-600 dark:text-slate-300">Financial guides built around tradeoffs, not generic advice. Every article shows what typically goes wrong before explaining what to do instead.</p>
          <p className="mt-2 text-sm font-medium italic text-slate-500 dark:text-slate-400">If it only works in a perfect month, it is not realistic.</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Every article is reviewed for clarity, responsible framing, and real-world usability before publication.</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link href="/editorial-policy" className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 font-medium text-slate-700 hover:border-blue-200 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">Editorial standards</Link>
            <Link href="/how-we-make-money" className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 font-medium text-slate-700 hover:border-blue-200 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">How we make money</Link>
            <Link href="/financial-disclaimer" className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 font-medium text-slate-700 hover:border-blue-200 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">Financial disclaimer</Link>
            <Link href="/help" className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 font-medium text-slate-700 hover:border-blue-200 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">Help center</Link>
          </div>
        </div>
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-4">
          <Image
            src="/images/blog-visual-general.svg"
            alt="Editorial-style personal finance dashboard illustration for the FinanceSphere blog"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-contain p-4"
          />
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Start here: high-impact guides</h2>
        <p className="mt-1 text-sm text-slate-600">Each guide is paired with a calculator so you can apply what you read before closing the tab.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {startHereGuides.map((guide) => (
            <article key={guide.href} className="rounded-xl border border-slate-200 p-4">
              <Link href={guide.href} className="text-base font-semibold text-slate-900 hover:text-blue-700 hover:underline">{guide.title}</Link>
              <p className="mt-2 text-sm text-slate-600">{guide.angle}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">Test it immediately</p>
              <Link href={guide.next} className="text-sm font-medium text-blue-700 hover:underline">Open matching calculator →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Curated by decision type</h2>
        <p className="mt-1 text-sm text-slate-600">Fewer, stronger guides routed to the right tools and comparisons. Check the failure scenario before using the strategy.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {curatedCollections.map((collection) => (
            <article key={collection.title} className="rounded-xl border border-slate-200 p-4">
              <h3 className="text-base font-semibold text-slate-900">{collection.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{collection.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {collection.links.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">{link.label}</Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
        <h2 className="text-lg font-semibold text-slate-900">What goes wrong with financial reading</h2>
        <p className="mt-2 text-sm text-slate-700">Reading a guide and feeling ready—without running the numbers. A strategy that sounds logical can still fail under your specific income, debt load, or risk profile.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm">
          <div className="rounded-xl border border-amber-200 bg-white p-3">
            <p className="font-semibold text-amber-700">Mistake</p>
            <p className="mt-1 text-slate-700">Applying advice from a 90th-percentile income example to a median-income situation</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-white p-3">
            <p className="font-semibold text-amber-700">Failure point</p>
            <p className="mt-1 text-slate-700">The math works—but only if the $500/month surplus exists. Most budgets do not have that margin.</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-white p-3">
            <p className="font-semibold text-amber-700">Fix</p>
            <p className="mt-1 text-slate-700">Run the calculator with your actual numbers after reading. Every guide links to one.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Featured across categories</h2>
        <p className="mt-1 text-sm text-slate-600">Start with one high-quality article from each non-empty category instead of browsing only loans and investing.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {featuredAcrossCategories.map(({ category, post }) => (
            <article key={`${category}-${post.slug}`} className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{category.replace(/-/g, ' ')}</p>
              <Link href={`/blog/${post.slug}`} className="mt-1 block text-base font-semibold text-slate-900 hover:text-blue-700 hover:underline">{post.title}</Link>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">{post.description}</p>
              <Link href={`/blog/category/${category}`} className="mt-2 inline-block text-sm font-medium text-blue-700 hover:underline">View {category.replace(/-/g, ' ')} →</Link>
            </article>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-2 text-sm">
        {categories.map((category) => (
          <Link key={category} href={`/blog/category/${category}`} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50">
            {category}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {tags.map((tag) => (
          <Link key={tag} href={`/blog/tag/${slugifyTag(tag)}`} className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
            #{tag.replace(/-/g, ' ')}
          </Link>
        ))}
      </div>

      <BlogSearch posts={posts} />

      <AdUnit slot={AD_SLOTS.BLOG_INDEX} format="auto" className="my-2" />

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">All recent articles</h2>
        <p className="mt-1 text-sm text-slate-600">Direct links help crawlers and readers reach every published guide without relying on filters.</p>
        <ul className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          {posts.slice(0, 36).map((post) => (
            <li key={post.slug}>
              <Link className="font-medium text-slate-700 hover:text-blue-700 hover:underline" href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <NewsletterForm source="blog" className="max-w-xl" />
    </section>
  );
}
