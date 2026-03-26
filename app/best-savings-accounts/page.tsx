import type { Metadata } from 'next';
import BestSavingsAccountsUSAPage from '@/app/compare/best-savings-accounts-usa/page';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Savings Account Comparison Framework | FinanceSphere',
  description: 'Evaluate savings account options using APY durability, transfer reliability, account rules, and liquidity fit.',
  pathname: '/best-savings-accounts'
});

export default BestSavingsAccountsUSAPage;
