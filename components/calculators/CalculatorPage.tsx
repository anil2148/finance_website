import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout';
import { calculatorMap } from '@/lib/calculators/registry';
import { absoluteUrl, createPageMetadata } from '@/lib/seo';

const howToStepsBySlug: Record<string, Array<{ name: string; text: string }>> = {
  'mortgage-calculator': [
    { name: 'Set home loan assumptions', text: 'Enter loan amount, interest rate, and term to reflect the mortgage offer you are evaluating.' },
    { name: 'Review monthly cost and total interest', text: 'Check monthly payment and total interest to understand long-run housing cost before committing.' },
    { name: 'Stress-test affordability', text: 'Adjust term and rate to compare affordability and choose a payment range that fits your budget.' }
  ],
  'loan-calculator': [
    { name: 'Input borrowing details', text: 'Add loan amount, APR, and repayment period for the personal or auto loan you are considering.' },
    { name: 'Compare EMI and payoff timeline', text: 'Use monthly installment and projection outputs to compare lender quotes on equal footing.' },
    { name: 'Test alternate terms', text: 'Shorten or extend the term to balance lower monthly payments against total borrowing cost.' }
  ],
  'compound-interest-calculator': [
    { name: 'Start with current balance and contribution', text: 'Enter your current amount and monthly addition to mirror your real saving or investing habit.' },
    { name: 'Model expected growth', text: 'Use return and timeline inputs to estimate long-term value created by compounding.' },
    { name: 'Adjust contribution pace', text: 'Increase or decrease monthly contributions to see how each change shifts your final balance.' }
  ]
};

const defaultHowToSteps = [
  { name: 'Enter your current numbers', text: 'Add your balance, rate, timeline, and monthly contribution assumptions.' },
  { name: 'Review cost and timeline outputs', text: 'Check monthly payment, total interest, ending balance, and payoff or growth timeline.' },
  { name: 'Compare scenarios before deciding', text: 'Adjust one variable at a time to compare trade-offs, then use related guides and comparison pages.' }
];

export function getCalculatorMetadata(slug: string): Metadata {
  const calculator = calculatorMap[slug];

  return createPageMetadata({
    title: calculator.seoTitle,
    description: calculator.seoDescription,
    pathname: `/calculators/${slug}`
  });
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
    url: absoluteUrl(`/calculators/${slug}`)
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${calculator.title}`,
    step: (howToStepsBySlug[slug] ?? defaultHowToSteps).map((step) => ({
      '@type': 'HowToStep',
      name: step.name,
      text: step.text
    }))
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
