import { Metadata } from 'next';
import { CalculatorPage, getCalculatorMetadata } from '@/components/calculators/CalculatorPage';

export const metadata: Metadata = getCalculatorMetadata('debt-snowball-calculator');

export default function Page() {
  return <CalculatorPage slug="debt-snowball-calculator" />;
}
