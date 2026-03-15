import { Metadata } from 'next';
import { CalculatorPage, getCalculatorMetadata } from '@/components/calculators/CalculatorPage';

export const metadata: Metadata = getCalculatorMetadata('mortgage-calculator');

export default function Page() {
  return <CalculatorPage slug="mortgage-calculator" />;
}
