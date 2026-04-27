import type { Metadata } from 'next';
import { IndiaHomepageLayout } from '@/components/home/IndiaHomepageLayout';
import { breadcrumbSchema, webpageSchema } from '@/lib/seo';
import { buildRegionAlternates } from '@/lib/regionSeo';

const title = 'FinanceSphere India | SIP, ELSS, GST, and Income Tax Planning Guides';
const description =
  'India-focused personal finance platform for SIP investing, ELSS vs PPF decisions, GST impacts, income tax slab planning, and EMI stress tests.';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['Ind AS finance guides', 'GST personal finance', 'income tax slabs India', 'SIP and ELSS planning'],
  alternates: buildRegionAlternates('/', 'INDIA')
};

export default function IndiaRoutePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({
        pathname: '/india',
        name: title,
        description
      }),
      breadcrumbSchema([
        { name: 'Home', item: '/india' },
        { name: 'India', item: '/india' }
      ])
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IndiaHomepageLayout />
    </>
  );
}
