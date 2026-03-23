import Link from 'next/link';
import { ComparisonEngine } from '@/components/comparison/ComparisonEngine';
import { getFinancialProducts, type FinancialCategory } from '@/lib/financialProducts';
import { defaultMatchingCalculatorLinks, matchingCalculatorLinksByFinancialCategory, resolveCalculatorHref } from '@/lib/calculatorLinks';
import { absoluteUrl, breadcrumbSchema, webpageSchema } from '@/lib/seo';

type SeoComparisonPageProps = {
  pageTitle: string;
  intro: string;
  category: FinancialCategory;
  faq: Array<{ question: string; answer: string }>;
  slug: string;
};

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function SeoComparisonPage({ pageTitle, intro, category, faq, slug }: SeoComparisonPageProps) {
  const pageProducts = getFinancialProducts().filter((item) => item.category === category);
  const topRated = [...pageProducts].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const relatedCalculators = matchingCalculatorLinksByFinancialCategory[category] ?? defaultMatchingCalculatorLinks;

  const schemaProducts = pageProducts.map((item) => ({
    '@type': 'Product',
    name: item.name,
    brand: item.bank,
    offers: { '@type': 'Offer', url: absoluteUrl(`/go/${item.id}`) }
  }));

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } }))
  };
  const pageSchema = webpageSchema({ pathname: `/${slug}`, name: pageTitle, description: intro });
  const crumbsSchema = breadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Comparison', item: '/comparison' },
    { name: pageTitle, item: `/${slug}` }
  ]);
  const criteriaByCategory: Record<FinancialCategory, string[]> = {
    credit_card: ['Net value after annual fee', 'APR risk if balance carries', 'Rewards fit by spending pattern', 'Approval and underwriting fit'],
    savings_account: ['APY durability and restrictions', 'Transfer speed and funding friction', 'Fee and minimum balance policy', 'Mobile/app reliability'],
    investment_app: ['All-in fee drag', 'Account type coverage', 'Automation and recurring buys', 'Research and risk controls'],
    mortgage_lender: ['Rate + fees as total borrowing cost', 'Closing timeline reliability', 'Refinance flexibility', 'Customer support quality'],
    personal_loan: ['APR and origination fee', 'Prepayment flexibility', 'Funding speed', 'Payment resilience in bad months']
  };
  const fitCalloutsByCategory: Record<FinancialCategory, Array<{ title: string; text: string }>> = {
    credit_card: [
      { title: 'Best for fee sensitivity', text: 'Focus on no-annual-fee cards where expected rewards still exceed your current setup.' },
      { title: 'Best for balance transfer users', text: 'Prioritize intro APR window length and realistic payoff schedule before it expires.' },
      { title: 'When to skip', text: 'Skip new applications if your underwriting profile is fragile in the next 60 days.' }
    ],
    savings_account: [
      { title: 'Best for high APY seekers', text: 'Compare APY trend stability and transfer restrictions, not teaser rates alone.' },
      { title: 'Best for emergency funds', text: 'Choose accounts with predictable transfer speed and low account-maintenance friction.' },
      { title: 'When to skip', text: 'Skip accounts with balance rules likely to trigger recurring fees.' }
    ],
    investment_app: [
      { title: 'Best for beginners', text: 'Look for simple recurring investments, broad fund access, and clear tax documents.' },
      { title: 'Best for long-term consistency', text: 'Prioritize low fee drag and account coverage over short-term feature novelty.' },
      { title: 'When to skip', text: 'Skip if account types do not support your next 1-3 years of goals.' }
    ],
    mortgage_lender: [
      { title: 'Best for first-time buyers', text: 'Compare lender communication quality and document turnaround expectations.' },
      { title: 'Best for refinancing', text: 'Use break-even months and expected holding period before accepting lower-rate offers.' },
      { title: 'When to skip', text: 'Skip if fee stack wipes out rate advantage during your likely hold period.' }
    ],
    personal_loan: [
      { title: 'Best for debt consolidation', text: 'Compare total repayment cost against current balances and timeline.' },
      { title: 'Best for cash-flow protection', text: 'Use payment scenarios that remain manageable during income dips.' },
      { title: 'When to skip', text: 'Skip offers with high fee drag unless repayment certainty is very strong.' }
    ]
  };

  return (
    <section className="space-y-8">
      <header className="space-y-3" id="methodology">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{pageTitle}</h1>
        <p className="max-w-3xl text-slate-600 dark:text-slate-300">{intro}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Reviewed by: FinanceSphere Editorial Team • Last updated {formatDate(new Date())}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Fact-check and compliance review completed before publication updates.</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link href="/editorial-policy" className="rounded-full border border-slate-300 px-2 py-1 dark:border-slate-600">Editorial standards</Link>
          <Link href="/affiliate-disclosure" className="rounded-full border border-slate-300 px-2 py-1 dark:border-slate-600">Affiliate disclosure</Link>
          <Link href="/how-we-make-money" className="rounded-full border border-slate-300 px-2 py-1 dark:border-slate-600">How we make money</Link>
        </div>
      </header>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2 dark:border-slate-700 dark:bg-slate-900/70">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">How to use this page</h2>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
            <li>Pick the outcome you care about first (lower cost, higher yield, easier approval).</li>
            <li>Filter options by your real constraints and compare at least 2 alternatives.</li>
            <li>Open one calculator before clicking through so your choice matches your numbers.</li>
          </ol>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Criteria that matter most</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {criteriaByCategory[category].map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm dark:border-blue-500/40 dark:bg-blue-500/10">
        <p className="font-semibold text-blue-900 dark:text-blue-100">Top picks by use case</p>
        <ul className="mt-2 grid gap-2 md:grid-cols-3">
          {topRated.map((item, index) => (
            <li key={item.id} className="rounded-lg border border-blue-100 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs text-blue-600 dark:text-blue-300">#{index + 1} Rated</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">{item.name}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">Best for: {item.pros[0]}</p>
            </li>
          ))}
        </ul>
      </div>

      <ComparisonEngine defaultCategory={category} initialProducts={pageProducts} />

      <section className="grid gap-3 md:grid-cols-3">
        {fitCalloutsByCategory[category].map((item) => (
          <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.text}</p>
          </article>
        ))}
      </section>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        {faq.map((item) => (
          <details key={item.question} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <summary className="cursor-pointer font-medium text-slate-900 dark:text-slate-100">{item.question}</summary>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.answer}</p>
          </details>
        ))}
        <details className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <summary className="cursor-pointer font-medium text-slate-900 dark:text-slate-100">How should I choose between similar offers?</summary>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Prioritize the total annual value for your usage pattern: expected rewards or yield minus fees, then validate terms and eligibility criteria.</p>
        </details>
      </div>

      <section className="related-links-grid">
        <div>
          <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Related tools and guides</h2>
          <ul className="space-y-1 text-sm">
            {relatedCalculators.map((item) => {
              const href = resolveCalculatorHref(item.href);
              return <li key={`${item.label}-${href}`}><Link href={href} className="text-brand hover:underline">{item.label}</Link></li>;
            })}
            <li><Link href="/learn/investing" className="text-brand hover:underline">Investing hub</Link></li>
            <li><Link href="/blog/beginner-investing-roadmap-year-one-milestones" className="text-brand hover:underline">Investing for beginners roadmap</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Alternatives to compare</h2>
          <ul className="space-y-1 text-sm">
            <li><Link href="/best-savings-accounts-usa" className="text-brand hover:underline">Best savings accounts</Link></li>
            <li><Link href="/best-investment-apps" className="text-brand hover:underline">Best investment apps</Link></li>
            <li><Link href="/comparison" className="text-brand hover:underline">Full comparison engine</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">How we review</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">We score products by fee drag, account protection, usability, account types, feature depth, and likely user fit. Ratings are editorial and not personalized advice—review full terms and eligibility before applying.</p>
          <div className="mt-2 flex gap-2 text-xs">
            <Link className="rounded-full border border-slate-300 px-2 py-1 dark:border-slate-600" href="/editorial-policy">Editorial policy</Link>
            <Link className="rounded-full border border-slate-300 px-2 py-1 dark:border-slate-600" href="/how-we-make-money">How we make money</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': schemaProducts }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsSchema) }} />
    </section>
  );
}
