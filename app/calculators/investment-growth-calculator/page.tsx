import { Metadata } from 'next';
import { CalculatorPage, getCalculatorMetadata } from '@/components/calculators/CalculatorPage';

export const metadata: Metadata = getCalculatorMetadata('investment-growth-calculator');

export default function Page() {
  return <CalculatorPage slug="investment-growth-calculator" />;
}
