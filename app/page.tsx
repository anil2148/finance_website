import { HomepageLayout } from '@/components/home/HomepageLayout';
import type { Metadata } from 'next';
import { absoluteUrl, breadcrumbSchema, webpageSchema } from '@/lib/seo';

const homepageTitle = 'Make Smarter Money Decisions with Real Numbers | FinanceSphere';
const homepageDescription =
  'See exactly how much you save, invest, or lose before you decide. Use calculators, scenario comparisons, and decision guides built for real financial outcomes.';

export const metadata: Metadata = {
  title: homepageTitle,
  description: homepageDescription,
  alternates: {
    canonical: absoluteUrl('/'),
    languages: {
      'en-US': '/',
      'en-IN': '/in',
      'x-default': '/'
    }
  },
  openGraph: {
    title: homepageTitle,
    description: homepageDescription,
    url: absoluteUrl('/'),
    type: 'website',
    locale: 'en_US'
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
        name: homepageTitle,
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
