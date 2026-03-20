import { permanentRedirect } from 'next/navigation';

export default function LegacyCalculatorRedirectPage() {
  permanentRedirect('/calculators/savings-goal-calculator');
}
