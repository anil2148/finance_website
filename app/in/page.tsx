import type { Metadata } from 'next';
import { IndiaHomepageLayout } from '@/components/home/IndiaHomepageLayout';
import { absoluteUrl, breadcrumbSchema, webpageSchema } from '@/lib/seo';

const title = 'FinanceSphere India | SIP, EMI, Tax-Saving, and Money Decision Guides';
const description =
  'FinanceSphere India helps you plan SIP investing, compare FD vs SIP, evaluate PPF vs ELSS, and estimate home loan EMI with practical ₹-based scenarios.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: absoluteUrl('/in'),
    languages: {
      'en-US': '/us',
      'en-IN': '/in',
      'x-default': '/us'
    }
  },
  openGraph: {
    title,
    description,
    url: absoluteUrl('/in'),
    type: 'website',
    locale: 'en_IN'
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description
  }
};

export default function IndiaHomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({
        pathname: '/in',
        name: title,
        description
      }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' }
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
