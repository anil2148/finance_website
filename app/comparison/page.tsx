import type { Metadata } from 'next';
import { ComparisonPageClient } from '@/components/comparison/ComparisonPageClient';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Compare Credit Cards, Savings Accounts, Loans & Investment Apps',
  description: 'Explore top-rated finance offers by category, compare APR/APY and features, and find the best fit in one dynamic comparison experience.'
};

const comparisonSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'FinanceSphere Product Comparisons',
  description: 'Compare financial products by rating, pricing, and feature trade-offs.',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Credit Cards', url: 'https://www.financesphere.io/comparison?category=credit-cards' },
    { '@type': 'ListItem', position: 2, name: 'Savings Accounts', url: 'https://www.financesphere.io/comparison?category=savings-accounts' },
    { '@type': 'ListItem', position: 3, name: 'Loans', url: 'https://www.financesphere.io/comparison?category=loans' },
    { '@type': 'ListItem', position: 4, name: 'Investment Apps', url: 'https://www.financesphere.io/comparison?category=investment-apps' }
  ]
};

export default function ComparisonPage() {
  return (
    <>
      <ComparisonPageClient />
      {/* Structured data helps search engines interpret comparison content. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }} />
    </>
  );
}
