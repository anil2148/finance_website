import { Metadata } from 'next';
import { CalculatorPage, getCalculatorMetadata } from '@/components/calculators/CalculatorPage';

export const metadata: Metadata = getCalculatorMetadata('student-loan-calculator');

export default function Page() {
  return <CalculatorPage slug="student-loan-calculator" />;
}
