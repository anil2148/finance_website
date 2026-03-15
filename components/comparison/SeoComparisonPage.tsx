import Link from 'next/link';
import { FinancialComparisonTable } from '@/components/comparison-table/FinancialComparisonTable';
import { OfferCard } from '@/components/comparison-table/OfferCard';
import { SocialShareButtons } from '@/components/ui/SocialShareButtons';
import products from '@/data/financial-products.json';

type SeoComparisonPageProps = {
  pageTitle: string;
  intro: string;
  category: string;
  faq: Array<{ question: string; answer: string }>;
  slug: string;
};

export function SeoComparisonPage({ pageTitle, intro, category, faq, slug }: SeoComparisonPageProps) {
  const pageProducts = products.filter((item) => item.category === category);
  const relatedComparisons = [
    { label: 'Best Credit Cards 2026', href: '/compare/best-credit-cards-2026' },
    { label: 'Best Savings Accounts USA', href: '/compare/best-savings-accounts-usa' },
    { label: 'Best Investment Apps', href: '/compare/best-investment-apps' },
    { label: 'Mortgage Rate Comparison', href: '/compare/mortgage-rate-comparison' },
    { label: 'High Yield Savings Accounts', href: '/compare/high-yield-savings-accounts' }
  ].filter((item) => item.href !== `/compare/${slug}`);

  const schemaProducts = pageProducts.map((item) => ({
    '@type': 'Product',
    name: item.name,
    brand: item.bank,
    offers: { '@type': 'Offer', url: item.affiliate_url, priceCurrency: 'USD', price: item.annual_fee.replace(/[^\d.]/g, '') || '0' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: item.rating, reviewCount: 120 }
  }));

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@type': 'Thing', name: pageTitle },
    reviewRating: { '@type': 'Rating', ratingValue: pageProducts[0]?.rating ?? 4.5, bestRating: 5 },
    author: { '@type': 'Organization', name: 'FinanceSphere Editorial Team' }
  };

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
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {pageProducts.slice(0, 2).map((product) => (
          <OfferCard key={product.id} product={product} />
        ))}
      </div>

      <FinancialComparisonTable data={products} defaultCategory={category} />

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        {faq.map((item) => (
          <details key={item.question} className="rounded-lg border border-slate-200 p-3">
            <summary className="cursor-pointer font-medium">{item.question}</summary>
            <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Share this comparison</h2>
        <SocialShareButtons url={`https://www.financesphere.io/compare/${slug}`} title={pageTitle} />
      </div>

      <section className="related-links-grid">
        <div>
          <h2 className="mb-2 text-lg font-semibold">Related calculators</h2>
          <ul className="space-y-1 text-sm">
            <li><Link href="/calculators/credit-card-payoff-calculator" className="text-brand hover:underline">Credit Card Payoff Calculator</Link></li>
            <li><Link href="/calculators/mortgage-calculator" className="text-brand hover:underline">Mortgage Calculator</Link></li>
            <li><Link href="/calculators/savings-goal-calculator" className="text-brand hover:underline">Savings Goal Calculator</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold">Related comparison pages</h2>
          <ul className="space-y-1 text-sm">
            {relatedComparisons.map((item) => (
              <li key={item.href}><Link href={item.href} className="text-brand hover:underline">{item.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold">Related blog posts</h2>
          <ul className="space-y-1 text-sm">
            <li><Link href="/blog/best-credit-cards-2025" className="text-brand hover:underline">Best Credit Cards for Everyday Spending</Link></li>
            <li><Link href="/blog/how-to-improve-credit-score-fast" className="text-brand hover:underline">How to Improve Your Credit Score Fast</Link></li>
            <li><Link href="/blog/high-yield-savings-vs-cd" className="text-brand hover:underline">High Yield Savings vs CDs</Link></li>
          </ul>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': schemaProducts }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </section>
  );
}
