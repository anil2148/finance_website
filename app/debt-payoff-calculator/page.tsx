import { permanentRedirect } from 'next/navigation';

export default function LegacyCalculatorRedirectPage() {
  permanentRedirect('/calculators/debt-payoff-calculator');
}
