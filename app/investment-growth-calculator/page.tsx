import { permanentRedirect } from 'next/navigation';

export default function LegacyCalculatorRedirectPage() {
  permanentRedirect('/calculators/investment-growth-calculator');
}
