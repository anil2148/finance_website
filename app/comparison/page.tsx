import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ComparisonPageClient } from '@/components/comparison/ComparisonPageClient';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Comparison',
  description: 'Compare credit cards, savings accounts, loans, and investment apps in one place.',
  alternates: { canonical: '/comparison' }
};

export default function ComparisonPage() {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Finance Product Comparison List',
    itemListElement: [
      { '@type': 'Product', position: 1, name: 'Credit Cards', category: 'FinancialProduct', url: 'https://financesphere.io/comparison?category=credit-cards' },
      { '@type': 'Product', position: 2, name: 'Savings Accounts', category: 'FinancialProduct', url: 'https://financesphere.io/comparison?category=savings-accounts' },
      { '@type': 'Product', position: 3, name: 'Loans', category: 'FinancialProduct', url: 'https://financesphere.io/comparison?category=loans' },
      { '@type': 'Product', position: 4, name: 'Investment Apps', category: 'FinancialProduct', url: 'https://financesphere.io/comparison?category=investment-apps' }
    ]
  };

  return (
    <>
      {/* SEO: product JSON-LD makes comparison categories discoverable as financial products. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Suspense fallback={<p className="text-sm text-slate-500">Loading comparison tools...</p>}><ComparisonPageClient /></Suspense>
    </>
  );
}
