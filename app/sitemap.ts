import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

const indiaIndexablePages = [
  '/in',
  '/in/tax',
  '/in/tax-slabs',
  '/in/80c-deductions',
  '/in/old-vs-new-tax-regime',
  '/in/tax-saving-strategies',
  '/in/banking',
  '/in/investing',
  '/in/loans',
  '/in/real-estate',
  '/in/calculators',
  '/in/calculators/emi-calculator',
  '/in/calculators/sip-calculator',
  '/in/best-savings-accounts-india',
  '/in/best-credit-cards-india',
  '/in/best-investment-apps-india',
  '/in/home-loan-interest-rates-india',
  '/in/fixed-deposit-vs-sip-india',
  '/in/blog',
  '/in/blog/sip-vs-fd',
  '/in/blog/ppf-vs-elss'
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return indiaIndexablePages.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '/in' ? 1 : 0.8
  }));
}
