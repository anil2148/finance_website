import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Savings Account Decision Framework | FinanceSphere',
  description: 'Choose savings accounts using APY durability, transfer reliability, liquidity constraints, and emergency-fund fit.',
  pathname: '/savings'
});

export default function SavingsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-3xl font-bold text-slate-900">Savings account framework for real emergencies</h1>
        <p className="max-w-3xl text-slate-600">
          Use this page if you are deciding where to keep emergency cash and short-term reserves. The biggest mistake is chasing a headline APY without
          verifying transfer speed, withdrawal constraints, and account rules.
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/best-savings-accounts-usa" className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Open savings comparison framework</Link>
          <Link href="/calculators/savings-goal-calculator" className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Run savings goal calculator</Link>
          <Link href="/blog/emergency-fund-target-by-recovery-timeline" className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Emergency fund guide</Link>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-900">Decision checklist before you open or switch</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>Confirm your emergency target in months of essential expenses, not as a generic dollar amount.</li>
          <li>Test transfer rules and timing so you know how fast cash reaches checking during urgent weeks.</li>
          <li>Check monthly fee triggers, minimum balance rules, and any account activity requirements.</li>
          <li>Review support access quality for fraud holds, transfer reversals, and account lock events.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="text-xl font-semibold text-amber-900">When to wait before optimizing APY</h2>
        <p className="mt-2 text-sm text-amber-900">
          If your buffer is below one month of required expenses, prioritize contribution consistency and liquidity first. A slightly lower APY with simpler
          access can be safer than a higher-yield account you cannot operate reliably under stress.
        </p>
      </section>
    </section>
  );
}
