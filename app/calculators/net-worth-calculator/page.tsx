import { Metadata } from 'next';
import { CalculatorPage, getCalculatorMetadata } from '@/components/calculators/CalculatorPage';

export const metadata: Metadata = getCalculatorMetadata('net-worth-calculator');

export default function Page() {
  return <CalculatorPage slug="net-worth-calculator" />;
}
