import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout';
import { calculatorMap } from '@/lib/calculators/registry';

export function getCalculatorMetadata(slug: string): Metadata {
  const calculator = calculatorMap[slug];

  return {
    title: calculator.seoTitle,
    description: calculator.seoDescription,
    alternates: {
      canonical: `/calculators/${slug}`
    },
    openGraph: {
      title: calculator.seoTitle,
      description: calculator.seoDescription,
      url: `https://financesphere.io/calculators/${slug}`,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: calculator.seoTitle,
      description: calculator.seoDescription
    }
  };
}

export function CalculatorPage({ slug }: { slug: string }) {
  const calculator = calculatorMap[slug];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: calculator.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    applicationCategory: 'FinanceApplication',
    name: calculator.title,
    description: calculator.description,
    url: `https://financesphere.io/calculators/${slug}`
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${calculator.title}`,
    step: [
      { '@type': 'HowToStep', name: 'Enter your current numbers', text: 'Add your balance, rate, timeline, and monthly contribution assumptions.' },
      { '@type': 'HowToStep', name: 'Review cost and timeline outputs', text: 'Check monthly payment, total interest, ending balance, and payoff or growth timeline.' },
      { '@type': 'HowToStep', name: 'Compare scenarios before deciding', text: 'Adjust one variable at a time to compare trade-offs, then use related guides and comparison pages.' }
    ]
  };

  return (
    <>
      <CalculatorLayout slug={slug} />
      {/* SEO: calculator + FAQ + HowTo schemas improve rich search coverage. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
    </>
  );
}
