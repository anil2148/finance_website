import type { Metadata } from 'next';
import BestCreditCards2026Page from '@/app/compare/best-credit-cards-2026/page';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Credit Card Comparison Framework (2026) | FinanceSphere',
  description: 'Use a transparent framework to compare credit card options by annual value, downside APR risk, and approval fit.',
  pathname: '/best-credit-cards-2026'
});

export default BestCreditCards2026Page;
