import type { Metadata } from 'next';
import BestSavingsAccountsUSAPage from '@/app/compare/best-savings-accounts-usa/page';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Savings Account Comparison Framework (US) | FinanceSphere',
  description: 'Use a practical framework to evaluate U.S. savings account options by APY durability, transfer reliability, and account rules.',
  pathname: '/best-savings-accounts-usa'
});

export default BestSavingsAccountsUSAPage;
