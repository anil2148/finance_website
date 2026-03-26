import type { Metadata } from 'next';
import BestInvestmentAppsPage from '@/app/compare/best-investment-apps/page';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Investment App Comparison Framework | FinanceSphere',
  description: "Compare investment app models by all-in costs, account coverage, automation quality, and support fit.",
  pathname: '/best-investment-apps'
});

export default BestInvestmentAppsPage;
