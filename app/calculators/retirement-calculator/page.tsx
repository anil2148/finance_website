import { Metadata } from 'next';
import { CalculatorPage, getCalculatorMetadata } from '@/components/calculators/CalculatorPage';

export const metadata: Metadata = getCalculatorMetadata('retirement-calculator');

export default function Page() {
  return <CalculatorPage slug="retirement-calculator" />;
}
