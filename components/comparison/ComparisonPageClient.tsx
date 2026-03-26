import Image from 'next/image';
import Link from 'next/link';
import { ComparisonEngine } from '@/components/comparison/ComparisonEngine';

export function ComparisonPageClient() {
  return (
    <section className="space-y-6">
      <div className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 md:grid-cols-[1.3fr_1fr] md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Compare financial options with a decision framework</h1>
          <p className="text-slate-600">Use category-specific frameworks to compare cost structure, constraints, support quality, and fit. We prioritize honest decision support over fake live-rate rankings.</p>
        </div>
        <div className="relative h-44 overflow-hidden rounded-2xl sm:h-52">
          <Image
            src="/images/comparison-analytics-illustration.svg"
            alt="Finance comparison dashboard showing framework rows, checklists, and cost fields"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 35vw"
            className="object-cover"
          />
        </div>
      </div>
      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-3">
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Start here</h2>
          <p className="mt-1 text-sm text-slate-700">Pick one goal: lower borrowing cost, improve cash yield reliability, or choose tools you can sustain monthly.</p>
        </article>
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700">How to use this</h2>
          <p className="mt-1 text-sm text-slate-700">Shortlist 2-3 options from the framework, then run one calculator scenario before taking action.</p>
        </article>
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Transparency</h2>
          <p className="mt-1 text-sm text-slate-700">Read <Link href="/editorial-policy" className="font-medium text-blue-700 hover:underline">editorial standards</Link> and <Link href="/affiliate-disclosure" className="font-medium text-blue-700 hover:underline">affiliate disclosure</Link> before making decisions.</p>
        </article>
      </section>
      <ComparisonEngine />
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Popular comparison pages</h2>
        <ul className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          <li><Link href="/best-credit-cards-2026" className="font-medium text-blue-700 hover:underline">Credit card framework (2026)</Link></li>
          <li><Link href="/best-investment-apps" className="font-medium text-blue-700 hover:underline">Investment app framework</Link></li>
          <li><Link href="/best-savings-accounts-usa" className="font-medium text-blue-700 hover:underline">Savings account framework (US)</Link></li>
          <li><Link href="/compare/mortgage-rate-comparison" className="font-medium text-blue-700 hover:underline">Mortgage lender framework</Link></li>
        </ul>
      </section>
    </section>
  );
}
