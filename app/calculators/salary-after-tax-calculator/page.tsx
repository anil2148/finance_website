import { Metadata } from 'next';
import { CalculatorPage, getCalculatorMetadata } from '@/components/calculators/CalculatorPage';

export const metadata: Metadata = getCalculatorMetadata('salary-after-tax-calculator');

export default function Page() {
  return <CalculatorPage slug="salary-after-tax-calculator" />;
}
