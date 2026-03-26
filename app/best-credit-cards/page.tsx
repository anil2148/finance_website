import type { Metadata } from 'next';
import BestCreditCards2026Page from '@/app/compare/best-credit-cards-2026/page';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Credit Card Comparison Framework | FinanceSphere',
  description: 'Compare credit card options with a transparent framework that prioritizes annual net value, downside APR risk, and approval fit.',
  pathname: '/best-credit-cards'
});

export default BestCreditCards2026Page;
