import type { Metadata } from 'next';
import BestCreditCards2026Page from '@/app/compare/best-credit-cards-2026/page';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Best Credit Cards 2026 | Compare Rewards, APR & Fees',
  description: 'Compare 2026 credit cards with issuer data, fee math, and approval-fit guidance so you can choose rewards that match your spending profile.',
  pathname: '/best-credit-cards-2026'
});

export default BestCreditCards2026Page;
