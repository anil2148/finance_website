import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'Rent vs Buy in India 2026: Mumbai, Bengaluru, Pune Scenario Analysis',
  description: 'Rent vs buy decision framework for India with EMI, maintenance, and opportunity-cost examples.',
  pathname: '/in/rent-vs-buy-india'
});

export default function RentVsBuyIndiaPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border bg-white p-6">
        <h1 className="text-3xl font-semibold">Rent vs buy in India: follow horizon and liquidity rules, not emotion</h1>
        <p className="mt-2 text-sm">Who this is for: first-time buyers deciding whether to rent longer or buy now in major Indian cities.</p>
      </header>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <ul className="list-disc pl-5 space-y-2">
          <li>Mumbai: rent ₹55,000 vs EMI ₹82,000 + ₹12,000 maintenance + registration + furnishing reserve.</li>
          <li>Bengaluru: rent ₹38,000 vs EMI ₹61,000 + ₹8,000 society + periodic upkeep.</li>
          <li>Pune: rent ₹27,000 vs EMI ₹48,000 + furnishing amortization and vacancy-risk assumptions.</li>
          <li>Down payment opportunity cost: ₹25 lakh at ~7% FD can be ~₹1.75 lakh/year pre-tax.</li>
        </ul>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">Best choice based on your situation</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          <li><strong>Timeline rule:</strong> stay horizon below 5 years → renting usually wins; 7+ years with stable city commitment → buying can dominate.</li>
          <li><strong>Risk rule:</strong> conservative households should only buy when EMI + ownership costs stay below ~35% of take-home after stress test.</li>
          <li><strong>Income rule:</strong> variable income households should prefer rent until 9–12 month liquidity runway is built.</li>
        </ul>
        <h3 className="mt-4 text-lg font-semibold">When this advice FAILS</h3>
        <ul className="mt-2 list-disc pl-5 space-y-2">
          <li>Buy-rule fails if job mobility is high and forced resale risk is material.</li>
          <li>Rent-rule fails when rent inflation outpaces income and long-term tenure is certain.</li>
          <li>EMI math fails when maintenance and furnishing are excluded from decision spreadsheets.</li>
        </ul>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">What most people get wrong</h2>
        <p className="mt-2">“EMI equals rent” is not a buy signal. Total ownership cost and liquidity lock-in matter more.</p>
        <p className="mt-2"><strong>Real-world FY 2025–26 example:</strong> a ₹12 lakh salaried employee in Bengaluru may still prefer renting if down payment wipes out emergency buffer.</p>
        <div className="mt-3 india-link-cluster">
          <Link href="/in/real-estate">real-estate hub for complete buy workflow</Link>
          <Link href="/in/home-affordability-india">check home affordability in India</Link>
          <Link href="/in/home-loan-interest-rates-india">compare home loan rates and reset risk</Link>
          <Link href="/in/personal-loan-comparison-india">avoid layering expensive personal debt on top</Link>
          <Link href="/in/fixed-deposit-vs-sip-india">decide where down-payment money should sit</Link>
          <Link href="/in/calculators/emi-calculator">run EMI stress test with +1% interest</Link>
          <Link href="/in/calculators/sip-calculator">model opportunity-cost of down payment</Link>
        </div>
      </section>
      <IndiaAuthorityNote />
    </article>
  );
}
