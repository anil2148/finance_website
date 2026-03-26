import { HomepageLayout } from '@/components/home/HomepageLayout';
import type { Metadata } from 'next';
import { absoluteUrl, webpageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'FinanceSphere Home | Compare, Calculate, and Plan Your Next Money Move',
  description:
    'Use FinanceSphere to model major financial decisions with calculators, compare products side-by-side, and follow practical guides with transparent editorial standards.',
  alternates: {
    canonical: absoluteUrl('/')
  },
  openGraph: {
    url: absoluteUrl('/'),
    title: 'FinanceSphere Home | Compare, Calculate, and Plan Your Next Money Move',
    description:
      'Calculator-first personal finance guidance with product comparisons, decision checklists, and transparent methodology.',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinanceSphere Home | Compare, Calculate, and Plan',
    description: 'Run the numbers first, compare your options second, then act with a clear plan.'
  }
};

export default function HomePage() {
  const homepageSchema = webpageSchema({
    pathname: '/',
    name: 'FinanceSphere Home',
    description:
      'FinanceSphere helps readers evaluate mortgages, debt payoff, savings, and investing decisions using calculators, comparisons, and guides.'
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How should I use FinanceSphere for a major money decision?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Start with a calculator to test your numbers, compare products side-by-side, and then read the related guide before taking action.'
        }
      },
      {
        '@type': 'Question',
        name: 'Does FinanceSphere provide personalized financial advice?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. FinanceSphere provides educational tools and editorial analysis. Verify product terms directly with providers and consult licensed professionals for personal advice.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does FinanceSphere evaluate financial products?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'FinanceSphere evaluates products using transparent criteria such as fees, rates, flexibility, and fit for common scenarios. Methodology and disclosures are published on-site.'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [homepageSchema, faqSchema] }) }}
      />
      <HomepageLayout />
    </>
  );
}
