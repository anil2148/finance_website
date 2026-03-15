import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout';
import { calculatorMap } from '@/lib/calculators/registry';

export function getCalculatorMetadata(slug: string): Metadata {
  const calculator = calculatorMap[slug];

  return {
    title: calculator.seoTitle,
    description: calculator.seoDescription
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

  return (
    <>
      <CalculatorLayout slug={slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
