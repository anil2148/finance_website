import { HomepageLayout } from '@/components/home/HomepageLayout';
import type { Metadata } from 'next';
import { absoluteUrl, breadcrumbSchema, webpageSchema } from '@/lib/seo';

const homepageTitle = 'FinanceSphere | Personal Finance Calculators, Comparisons, and Decision Guides';
const homepageDescription =
  'Use FinanceSphere to run calculators, compare financial products, and follow practical step-by-step guides for savings, debt payoff, mortgages, and investing.';

export const metadata: Metadata = {
  title: homepageTitle,
  description: homepageDescription,
  alternates: {
    canonical: absoluteUrl('/')
  },
  openGraph: {
    title: homepageTitle,
    description: homepageDescription,
    url: absoluteUrl('/'),
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: homepageTitle,
    description: homepageDescription
  }
};

export default function HomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({
        pathname: '/',
        name: 'FinanceSphere Homepage',
        description: homepageDescription
      }),
      breadcrumbSchema([{ name: 'Home', item: '/' }]),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Where should I start if I need quick financial clarity?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Start with the calculator matching your immediate decision, then read the linked comparison page before taking action.'
            }
          },
          {
            '@type': 'Question',
            name: 'Is FinanceSphere financial advice?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. FinanceSphere is educational and should be used to build your own decision framework before confirming terms with providers.'
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <HomepageLayout />
    </>
  );
}
