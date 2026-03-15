import type { Metadata } from 'next';
import { ComparisonPageClient } from '@/components/comparison/ComparisonPageClient';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Compare Credit Cards, Savings, Mortgages, Loans & Investment Apps',
  description: 'Explore top-rated finance offers by category, compare APR/APY and features, and find the best fit across cards, savings, mortgages, loans, and investment apps.',
  alternates: { canonical: '/comparison' }
};

const comparisonSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'FinanceSphere Product Comparisons',
  description: 'Compare financial products by rating, pricing, and feature trade-offs.',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Credit Cards', url: 'https://www.financesphere.io/comparison?category=credit_card' },
    { '@type': 'ListItem', position: 2, name: 'Savings Accounts', url: 'https://www.financesphere.io/comparison?category=savings_account' },
    { '@type': 'ListItem', position: 3, name: 'Investment Apps', url: 'https://www.financesphere.io/comparison?category=investment_app' },
    { '@type': 'ListItem', position: 4, name: 'Mortgage Lenders', url: 'https://www.financesphere.io/comparison?category=mortgage_lender' },
    { '@type': 'ListItem', position: 5, name: 'Personal Loans', url: 'https://www.financesphere.io/comparison?category=personal_loan' }
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
