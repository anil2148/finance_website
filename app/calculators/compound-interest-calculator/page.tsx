import { Metadata } from 'next';
import { CalculatorPage, getCalculatorMetadata } from '@/components/calculators/CalculatorPage';

export const metadata: Metadata = getCalculatorMetadata('compound-interest-calculator');

export default function Page() {
  return <CalculatorPage slug="compound-interest-calculator" />;
}
