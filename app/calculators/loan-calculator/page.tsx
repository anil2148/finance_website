import { Metadata } from 'next';
import { CalculatorPage, getCalculatorMetadata } from '@/components/calculators/CalculatorPage';
import { absoluteUrl } from '@/lib/seo';

const baseMetadata = getCalculatorMetadata('loan-calculator');

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: '/calculators/loan-calculator',
    languages: {
      'en-US': absoluteUrl('/calculators/loan-calculator'),
      'en-IN': absoluteUrl('/in/calculators/emi-calculator'),
      'x-default': absoluteUrl('/calculators/loan-calculator')
    }
  }
};

export default function Page() {
  return <CalculatorPage slug="loan-calculator" />;
}
