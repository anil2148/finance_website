import { permanentRedirect } from 'next/navigation';

export default function LegacyCalculatorRedirectPage() {
  permanentRedirect('/calculators/net-worth-calculator');
}
