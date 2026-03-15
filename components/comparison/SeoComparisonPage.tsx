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

export function SeoComparisonPage({ pageTitle, intro, category, faq, slug }: SeoComparisonPageProps) {
  const pageProducts = getFinancialProducts().filter((item) => item.category === category);

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
      </header>

      <ComparisonEngine defaultCategory={category} />

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        {faq.map((item) => (
          <details key={item.question} className="rounded-lg border border-slate-200 p-3">
            <summary className="cursor-pointer font-medium">{item.question}</summary>
            <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
          </details>
        ))}
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
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': schemaProducts }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </section>
  );
}
