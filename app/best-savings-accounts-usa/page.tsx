import type { Metadata } from 'next';
import BestSavingsAccountsUSAPage from '@/app/compare/best-savings-accounts-usa/page';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Best Savings Accounts USA | Compare APY & Features',
  description: 'Review U.S. savings accounts using APY durability, transfer speed, account rules, and service quality—not headline rate alone.',
  pathname: '/best-savings-accounts-usa'
});

export default BestSavingsAccountsUSAPage;
