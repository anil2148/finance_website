import { Metadata } from 'next';
import { CalculatorPage, getCalculatorMetadata } from '@/components/calculators/CalculatorPage';

export const metadata: Metadata = getCalculatorMetadata('savings-goal-calculator');

export default function Page() {
  return <CalculatorPage slug="savings-goal-calculator" />;
}
