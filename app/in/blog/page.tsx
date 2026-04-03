import type { Metadata } from 'next';
import { breadcrumbSchema, createPageMetadata, webpageSchema } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';
import { IndiaBlogHub } from '@/components/india/IndiaBlogHub';

const title = 'FinanceSphere India Blog | SIP, PPF, ELSS, and Home Loan Guides';
const description = 'Explore India-first personal finance guides on SIP, FD, PPF, ELSS, EMI planning, and tax-saving decisions.';

const guides = [
  {
    title: 'SIP vs FD in India: Which fits your 3, 5, and 10-year goals?',
    slug: 'sip-vs-fd',
    description: 'Compare certainty vs growth, liquidity, and tax treatment using practical ₹ scenarios.',
    category: 'investing' as const,
    publishedAt: '2026-03-15'
  },
  {
    title: 'PPF vs ELSS: Tax-saving decision framework for Indian investors',
    slug: 'ppf-vs-elss',
    description: 'Understand lock-in, volatility, flexibility, and Section 80C strategy by life stage.',
    category: 'tax' as const,
    publishedAt: '2026-03-10'
  }
];

const pathways = [
  { label: 'Run EMI stress test (+0.5%, +1.0%)', href: '/in/calculators/emi-calculator', group: 'Loan pressure check' },
  { label: 'Model SIP at ₹5,000 / ₹10,000 / ₹25,000', href: '/in/calculators/sip-calculator', group: 'Investing setup' },
  { label: 'Choose SIP vs FD by timeline', href: '/in/blog/sip-vs-fd', group: 'Allocation decision' },
  { label: 'Build 80C allocation plan', href: '/in/blog/ppf-vs-elss', group: 'Tax optimization' }
];

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  pathname: '/in/blog'
});

export default function IndiaBlogHubPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({
        pathname: '/in/blog',
        name: title,
        description
      }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' }
      ]),
      {
        '@type': 'CollectionPage',
        '@id': 'https://financesphere.io/in/blog',
        name: title,
        description,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: guides.map((guide, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: guide.title,
            url: `https://financesphere.io/in/blog/${guide.slug}`
          }))
        }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IndiaBlogHub guides={guides} pathways={pathways} />
      <IndiaAuthorityNote />
    </>
  );
}
