import { Metadata } from 'next';
import { CalculatorPage, getCalculatorMetadata } from '@/components/calculators/CalculatorPage';

export const metadata: Metadata = getCalculatorMetadata('budget-planner');

export default function Page() {
  return <CalculatorPage slug="budget-planner" />;
}
