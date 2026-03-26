import type { Metadata } from 'next';
import { ComparisonPageClient } from '@/components/comparison/ComparisonPageClient';
import { absoluteUrl, createPageMetadata } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
  title: 'Finance Product Comparison Frameworks | FinanceSphere',
  description: 'Use transparent comparison frameworks to evaluate credit cards, savings accounts, investing apps, mortgages, and loans without fake rankings or placeholder rates.',
  pathname: '/comparison'
});

const comparisonSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'FinanceSphere Product Comparisons',
  description: 'Compare financial product types by cost structure, constraints, support quality, and fit for your situation.',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Credit Cards', url: absoluteUrl('/best-credit-cards-2026') },
    { '@type': 'ListItem', position: 2, name: 'Savings Accounts', url: absoluteUrl('/best-savings-accounts-usa') },
    { '@type': 'ListItem', position: 3, name: 'Investment Apps', url: absoluteUrl('/best-investment-apps') },
    { '@type': 'ListItem', position: 4, name: 'Mortgage Lenders', url: absoluteUrl('/compare/mortgage-rate-comparison') },
    { '@type': 'ListItem', position: 5, name: 'Personal Loans', url: absoluteUrl('/loans') }
  ]
};

export default function ComparisonPage() {
  return (
    <>
      <ComparisonPageClient />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }} />
    </>
  );
}
