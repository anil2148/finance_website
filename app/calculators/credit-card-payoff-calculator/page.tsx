import { Metadata } from 'next';
import { CalculatorPage, getCalculatorMetadata } from '@/components/calculators/CalculatorPage';

export const metadata: Metadata = getCalculatorMetadata('credit-card-payoff-calculator');

export default function Page() {
  return <CalculatorPage slug="credit-card-payoff-calculator" />;
}
