import Link from 'next/link';
import { ComparisonEngine } from '@/components/comparison/ComparisonEngine';
import { getFinancialProducts, type FinancialCategory } from '@/lib/financialProducts';

type SeoComparisonPageProps = {
  pageTitle: string;
  intro: string;
  category: FinancialCategory;
  faq: Array<{ question: string; answer: string }>;
  slug: string;
};

const relatedContent: Record<string, { calculators: Array<{ label: string; href: string }>; guides: Array<{ label: string; href: string }> }> = {
  'best-credit-cards-2026': {
    calculators: [
      { label: 'Credit Card Payoff Calculator', href: '/calculators/credit-card-payoff-calculator' },
      { label: 'Debt Avalanche Calculator', href: '/calculators/debt-avalanche-calculator' },
      { label: 'Budget Planner', href: '/calculators/budget-planner' }
    ],
    guides: [
      { label: 'Best first credit card guide', href: '/blog/seo-best-first-credit-card' },
      { label: 'Common loan mistakes to avoid', href: '/blog/seo-common-loan-mistakes' }
    ]
  },
  'best-investment-apps': {
    calculators: [
      { label: 'Investment Growth Calculator', href: '/calculators/investment-growth-calculator' },
      { label: 'Retirement Calculator', href: '/calculators/retirement-calculator' },
      { label: 'FIRE Calculator', href: '/calculators/fire-calculator' }
    ],
    guides: [
      { label: 'Retirement planning guide', href: '/blog/retirement-planning-guide-873' },
      { label: 'Budgeting guide for higher savings rates', href: '/blog/budgeting-guide-314' }
    ]
  }
};

const defaultRelated = {
  calculators: [
    { label: 'Mortgage Calculator', href: '/calculators/mortgage-calculator' },
    { label: 'Savings Goal Calculator', href: '/calculators/savings-goal-calculator' },
    { label: 'Loan Calculator', href: '/calculators/loan-calculator' }
  ],
  guides: [
    { label: 'Online bank vs traditional bank', href: '/blog/seo-online-bank-vs-traditional-bank' },
    { label: 'Loan scam red flags', href: '/blog/seo-loan-scams-red-flags' }
  ]
};

export function SeoComparisonPage({ pageTitle, intro, category, faq, slug }: SeoComparisonPageProps) {
  const pageProducts = getFinancialProducts().filter((item) => item.category === category);
  const related = relatedContent[slug] ?? defaultRelated;

  const schemaProducts = pageProducts.map((item) => ({
    '@type': 'Product',
    name: item.name,
    brand: item.bank,
    offers: { '@type': 'Offer', url: `https://www.financesphere.io/go/${item.id}` },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: item.rating, reviewCount: 120 }
  }));

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } }))
  };

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
        <p className="max-w-3xl text-slate-600">{intro}</p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full border border-slate-200 px-3 py-1">Last updated: March 18, 2026</span>
          <span className="rounded-full border border-slate-200 px-3 py-1">Educational content — not individualized advice</span>
          <Link href="/affiliate-disclosure" className="rounded-full border border-slate-200 px-3 py-1 hover:text-blue-700">Editorial & affiliate disclosure</Link>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px] lg:items-start">
        <ComparisonEngine defaultCategory={category} />
        <aside className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 lg:sticky lg:top-24">
          <h2 className="text-base font-semibold">Need a faster decision?</h2>
          <p className="text-sm text-slate-600">Shortlist 2–3 offers, run the matching calculator, and check product terms before submitting any application.</p>
          <Link href="/calculators" className="btn-primary w-full">Run matching calculator</Link>
          <Link href="/help" className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700">See comparison methodology</Link>
        </aside>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">How we rank these products</h2>
        <p className="text-sm text-slate-600">Ratings are based on cost (APR/APY and annual fees), core features, customer usability, and fit for common financial goals. Partner relationships do not directly set rankings.</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>Cost metrics: APR/APY, fees, and bonus conditions.</li>
          <li>Product fit: who benefits most based on common user goals.</li>
          <li>Experience factors: app usability, support quality, and account flexibility.</li>
        </ul>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        {faq.map((item) => (
          <details key={item.question} className="rounded-lg border border-slate-200 p-3">
            <summary className="cursor-pointer font-medium">{item.question}</summary>
            <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
          </details>
        ))}
        <details className="rounded-lg border border-slate-200 p-3">
          <summary className="cursor-pointer font-medium">How should I choose between similar offers?</summary>
          <p className="mt-2 text-sm text-slate-600">Prioritize the total annual value for your usage pattern: expected rewards or yield minus fees, then validate terms and eligibility criteria.</p>
        </details>
      </div>

      <section className="related-links-grid">
        <div>
          <h2 className="mb-2 text-lg font-semibold">Related calculators</h2>
          <ul className="space-y-1 text-sm">
            {related.calculators.map((item) => (
              <li key={item.href}><Link href={item.href} className="text-brand hover:underline">{item.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold">Related reading</h2>
          <ul className="space-y-1 text-sm">
            {related.guides.map((item) => (
              <li key={item.href}><Link href={item.href} className="text-brand hover:underline">{item.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold">Need support?</h2>
          <p className="text-sm text-slate-600">Have a scenario that is not covered by filters? We can help you pick the right tools and pages.</p>
          <Link href="/contact" className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">Contact the FinanceSphere team →</Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': schemaProducts }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </section>
  );
}
