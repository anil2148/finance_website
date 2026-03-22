import type { Metadata } from 'next';
import { ComparisonPageClient } from '@/components/comparison/ComparisonPageClient';
import { absoluteUrl } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Compare Credit Cards, Savings, Mortgages, Loans & Investment Apps | FinanceSphere',
  description: 'Compare APR/APY, annual fees, bonus offers, and product strengths across credit cards, savings accounts, lenders, loans, and investing apps.',
  alternates: { canonical: '/comparison' }
};

const comparisonSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'FinanceSphere Product Comparisons',
  description: 'Compare financial products by rates, fees, bonuses, and practical fit for your goals.',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Credit Cards', url: absoluteUrl('/best-credit-cards-2026') },
    { '@type': 'ListItem', position: 2, name: 'Savings Accounts', url: absoluteUrl('/best-savings-accounts-usa') },
    { '@type': 'ListItem', position: 3, name: 'Investment Apps', url: absoluteUrl('/best-investment-apps') },
    { '@type': 'ListItem', position: 4, name: 'Mortgage Lenders', url: absoluteUrl('/mortgage-rate-comparison') },
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
