import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({ title: 'India Loans Hub: home loan, EMI planning, and debt reduction', description: 'India loan decisions with EMI stress tests, interest-rate comparison pages, and debt reduction workflows.', pathname: '/in/loans' });

export default function IndiaLoansHubPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border bg-white p-6">
        <h1 className="text-3xl font-semibold">India Loans Hub: borrow with EMI resilience, not maximum eligibility</h1>
        <p className="mt-2 text-sm">Who this is for: families evaluating home loans, balance transfer users, and borrowers managing rising rates.</p>
        <p className="mt-2 text-sm"><strong>Biggest mistake to avoid:</strong> approving EMI at 40%+ of take-home without shock testing. <strong>Best decision by scenario:</strong> choose lower principal if +1% rate makes monthly budget fragile.</p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        <Link href="/in/home-loan-interest-rates-india" className="rounded-xl border p-4">Home loan interest rates India</Link>
        <Link href="/in/calculators/emi-calculator" className="rounded-xl border p-4">Calculator: EMI planner</Link>
        <Link href="/in/real-estate" className="rounded-xl border p-4">Real estate decision hub</Link>
        <Link href="/in/best-credit-cards-india" className="rounded-xl border p-4">Credit card alternatives</Link>
      </div>
      <IndiaAuthorityNote />
    </section>
  );
}
