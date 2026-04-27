import type { Metadata } from 'next';
import { IndiaHomepageLayout } from '@/components/home/IndiaHomepageLayout';
import { absoluteUrl, breadcrumbSchema, webpageSchema } from '@/lib/seo';

const title = 'FinanceSphere India | SIP, ELSS, GST, and Income Tax Planning Guides';
const description =
  'India-focused personal finance platform for SIP investing, ELSS vs PPF decisions, GST impacts, income tax slab planning, and EMI stress tests.';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['Ind AS finance guides', 'GST personal finance', 'income tax slabs India', 'SIP and ELSS planning'],
  alternates: {
    canonical: absoluteUrl('/india'),
    languages: {
      'en-US': absoluteUrl('/us'),
      'en-IN': absoluteUrl('/india'),
      'x-default': absoluteUrl('/us')
    }
  }
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
