import type { Metadata } from 'next';
import BestInvestmentAppsPage from '@/app/compare/best-investment-apps/page';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Investment App Comparison Table | Fees, Ratings, and Features',
  description: "Use FinanceSphere's side-by-side investment app comparison table to evaluate fees, ratings, account features, and platform fit.",
  pathname: '/best-investment-apps'
});

export default BestInvestmentAppsPage;
