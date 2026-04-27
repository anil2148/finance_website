import type { Metadata } from 'next';
import { HomepageLayout } from '@/components/home/HomepageLayout';
import { breadcrumbSchema, webpageSchema } from '@/lib/seo';
import { buildRegionAlternates } from '@/lib/regionSeo';

const title = 'FinanceSphere US | 401(k), IRS Taxes, Credit Cards, and Investing Guides';
const description =
  'US-focused personal finance tools and guides for IRS tax planning, 401(k) contributions, capital gains decisions, and credit optimization.';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['US GAAP personal finance', 'IRS tax planning', '401k contribution strategy', 'capital gains tax US'],
  alternates: buildRegionAlternates('/', 'US')
};

export default function UsRoutePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({
        pathname: '/us',
        name: title,
        description
      }),
      breadcrumbSchema([
        { name: 'Home', item: '/us' },
        { name: 'United States', item: '/us' }
      ])
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <HomepageLayout />
    </>
  );
}
