import type { Metadata } from 'next';
import { HomepageLayout } from '@/components/home/HomepageLayout';
import { absoluteUrl, breadcrumbSchema, webpageSchema } from '@/lib/seo';

const title = 'Make Smarter Money Decisions with Real Numbers | FinanceSphere';
const description =
  'FinanceSphere helps you run calculators, compare products, and execute practical money decisions with region-specific defaults.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: absoluteUrl('/'),
    languages: {
      'en-US': absoluteUrl('/?region=us'),
      'en-IN': absoluteUrl('/?region=in'),
      'x-default': absoluteUrl('/')
    }
  },
  openGraph: {
    title,
    description,
    url: absoluteUrl('/'),
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
        pathname: '/',
        name: title,
        description
      }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/?region=in' }
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
