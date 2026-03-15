import { Metadata } from 'next';
import { CalculatorPage, getCalculatorMetadata } from '@/components/calculators/CalculatorPage';

export const metadata: Metadata = getCalculatorMetadata('fire-calculator');

export default function Page() {
  return <CalculatorPage slug="fire-calculator" />;
}
