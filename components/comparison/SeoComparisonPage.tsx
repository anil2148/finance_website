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

const relatedCalculatorsByCategory: Partial<Record<FinancialCategory, Array<{ label: string; href: string }>>> = {
  credit_card: [
    { label: 'Credit Card Payoff Calculator', href: '/calculators/credit-card-payoff-calculator' },
    { label: 'Debt Avalanche Calculator', href: '/calculators/debt-avalanche-calculator' }
  ],
  savings_account: [
    { label: 'Savings Goal Calculator', href: '/calculators/savings-goal-calculator' },
    { label: 'Emergency Fund Calculator', href: '/calculators/emergency-fund-calculator' }
  ],
  investment_app: [
    { label: 'Investment Growth Calculator', href: '/calculators/investment-growth-calculator' },
    { label: 'Retirement Calculator', href: '/calculators/retirement-calculator' }
  ],
  mortgage_lender: [
    { label: 'Mortgage Calculator', href: '/calculators/mortgage-calculator' },
    { label: 'Refinance Calculator', href: '/calculators/refinance-calculator' }
  ],
  personal_loan: [
    { label: 'Debt Payoff Calculator', href: '/calculators/debt-payoff-calculator' },
    { label: 'Loan Repayment Calculator', href: '/calculators/loan-repayment-calculator' }
  ]
};

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function SeoComparisonPage({ pageTitle, intro, category, faq, slug }: SeoComparisonPageProps) {
  const pageProducts = getFinancialProducts().filter((item) => item.category === category);
  const topRated = [...pageProducts].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const relatedCalculators = relatedCalculatorsByCategory[category] ?? [{ label: 'Explore all calculators', href: '/calculators' }];

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
        <p className="text-xs text-slate-500">Reviewed by FinanceSphere editorial team • Last updated {formatDate(new Date())}</p>
      </header>

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm">
        <p className="font-semibold text-blue-900">Top picks by use case</p>
        <ul className="mt-2 grid gap-2 md:grid-cols-3">
          {topRated.map((item, index) => (
            <li key={item.id} className="rounded-lg border border-blue-100 bg-white p-3">
              <p className="text-xs text-blue-600">#{index + 1} Rated</p>
              <p className="font-medium text-slate-900">{item.name}</p>
              <p className="text-xs text-slate-600">Best for: {item.pros[0]}</p>
            </li>
          ))}
        </ul>
      </div>

      <ComparisonEngine defaultCategory={category} />

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
            {relatedCalculators.map((item) => (
              <li key={item.href}><Link href={item.href} className="text-brand hover:underline">{item.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold">Alternatives to compare</h2>
          <ul className="space-y-1 text-sm">
            <li><Link href="/best-savings-accounts-usa" className="text-brand hover:underline">Best savings accounts</Link></li>
            <li><Link href="/best-investment-apps" className="text-brand hover:underline">Best investment apps</Link></li>
            <li><Link href="/comparison" className="text-brand hover:underline">Full comparison engine</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold">How we review</h2>
          <p className="text-sm text-slate-600">We score products by fee drag, value, features, and user-fit. Learn our methodology and disclosures before acting.</p>
          <div className="mt-2 flex gap-2 text-xs">
            <Link className="rounded-full border px-2 py-1" href="/editorial-policy">Editorial policy</Link>
            <Link className="rounded-full border px-2 py-1" href="/how-we-make-money">How we make money</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': schemaProducts }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </section>
  );
}
