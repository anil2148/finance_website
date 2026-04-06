import type { Metadata } from 'next';
import Link from 'next/link';
import { EmiCalculator } from '@/components/calculator/EmiCalculator';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Home Loan EMI Calculator (₹) | FinanceSphere India',
  description:
    'Estimate monthly EMI, total payable amount, and affordability scenarios for Indian home loans with practical salary and rate-change framing.',
  pathname: '/in/calculators/emi-calculator'
});

export default function IndiaEmiCalculatorPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India calculator</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">Home Loan EMI Calculator (India)</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          Use this before you finalise a loan amount — not after. Most buyers clear bank eligibility and feel confident at booking. The pressure shows up later: when maintenance bills arrive, school fees increase, the rate resets upward, and one income source is temporarily interrupted. Run the numbers now with realistic assumptions, including a rate that is 0.5–1% higher than what you were quoted.
        </p>
      </header>
      <IndiaAuthorityNote />

      <EmiCalculator type="mortgage" />

      <section className="rounded-2xl border border-rose-100 bg-rose-50/60 p-6 dark:border-rose-900/40 dark:bg-rose-950/20">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">When EMI plans break: real scenarios most buyers ignore</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">The EMI looks fine at the time of booking. These are the situations where it stops looking fine — usually within 18–36 months.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-rose-200 bg-white p-4 dark:border-rose-800/40 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-400">Rate reset + school fee increase in the same year</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Floating rate loans reset every 12 months. A 0.75% increase on ₹60 lakh adds ₹2,800–₹3,200/month to your EMI. If school fees for your child also increase ₹3,000–₹5,000 the same year, your monthly cashflow just lost ₹6,000+ with no warning. Many households never stress-test these two events occurring together.</p>
          </article>
          <article className="rounded-xl border border-rose-200 bg-white p-4 dark:border-rose-800/40 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-400">Job loss or income gap — even temporarily</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">A 2–3 month career transition is common. But most households take a home loan with exactly enough to cover EMI from both salaries. When one income pauses — layoff, health, maternity, career change — the EMI does not pause with it. The question is not whether you can afford it today. It is whether you can afford it during your worst two months of the last three years.</p>
          </article>
          <article className="rounded-xl border border-rose-200 bg-white p-4 dark:border-rose-800/40 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-400">Possession delay — paying EMI and rent simultaneously</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Builder possession delays of 12–24 months are common in metro projects. If you took disbursement and the property is not ready, you pay the bank EMI while still paying rent. This dual payment period — often 6–18 months — is one of the most financially stressful situations for buyers who did not plan for it. Budget for it before you sign.</p>
          </article>
          <article className="rounded-xl border border-rose-200 bg-white p-4 dark:border-rose-800/40 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-400">Emergency reserves depleted by down payment</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Down payment, registration, stamp duty, brokerage, and moving costs together often take ₹10–₹20 lakh out of savings. Many buyers exhaust their emergency fund at the same time they take on the highest fixed obligation of their life. A single large repair or medical bill in year one — with no buffer — sends them to a personal loan at 12–18% interest on top of the home loan.</p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-amber-50/60 p-6 dark:border-amber-900/40 dark:bg-amber-950/20">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">The costs most buyers forget to include</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Your EMI is only part of the monthly housing cost. These are the items that break affordability in practice:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li><strong>Maintenance charges:</strong> ₹3,000–₹8,000/month for most metro societies, rising every 2–3 years. Often invisible at booking time.</li>
          <li><strong>Rent overlap during possession transition:</strong> If possession delays by 3–6 months (common), you pay EMI and rent simultaneously.</li>
          <li><strong>Rate reset risk:</strong> Floating rate loans typically reset every 12 months. A 0.5% increase on ₹60 lakh adds roughly ₹2,000–₹2,500/month to EMI.</li>
          <li><strong>School fees and childcare:</strong> Timing a home loan with school fee increases or a second child is common — and compresses disposable income at the same time.</li>
          <li><strong>Emergency reserve depletion:</strong> Down payment often exhausts savings. One large repair in the first year can push a household into credit card debt at 36–42% effective interest.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">How to use this calculator result</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>Run at your expected interest rate first to get the baseline EMI.</li>
          <li>Then run at +0.5% and +1.0% to test what a rate reset does to your budget. If the +1.0% scenario feels uncomfortable, the loan amount is likely too large.</li>
          <li>Add ₹4,000–₹6,000/month as a maintenance and surprise buffer on top of the EMI result.</li>
          <li>Do the single-income month test: can your household cover EMI and essentials on one salary alone for 2–3 months if needed?</li>
          <li>Keep EMI plus all fixed obligations below 40–45% of in-hand monthly income, not just EMI alone.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Affordability reality check by in-hand salary</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">In-hand income</th>
                <th className="px-3 py-2">Comfortable EMI range</th>
                <th className="px-3 py-2">Warning signal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-800"><td className="px-3 py-2">₹70,000</td><td className="px-3 py-2">₹18,000–₹23,000</td><td className="px-3 py-2">EMI above ₹26,000 with no emergency reserve and school fees rising.</td></tr>
              <tr className="border-b border-slate-100 dark:border-slate-800"><td className="px-3 py-2">₹85,000</td><td className="px-3 py-2">₹22,000–₹28,000</td><td className="px-3 py-2">EMI above ₹32,000 if rent overlap is possible during possession transition.</td></tr>
              <tr className="border-b border-slate-100 dark:border-slate-800"><td className="px-3 py-2">₹1,20,000</td><td className="px-3 py-2">₹32,000–₹40,000</td><td className="px-3 py-2">If one income gap month would require dipping into SIP or FD.</td></tr>
              <tr><td className="px-3 py-2">₹1,50,000+</td><td className="px-3 py-2">₹40,000–₹55,000</td><td className="px-3 py-2">Still stress-test the +1.0% rate scenario. Higher incomes can also overextend on property size.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Real example: ₹85,000 in-hand household with ₹60 lakh loan</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          At 8.75%, the EMI is roughly ₹27,500. That looks fine. Add ₹5,000 for maintenance and ₹4,000 for vehicle loan EMI — total fixed obligations reach ₹36,500, which is 43% of in-hand income. Now test at 9.25%: EMI rises to ~₹30,000, and total fixed obligations hit ₹39,000 — 46% of in-hand. If school fees rise ₹3,000 the same year, the household has no buffer.
        </p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          In this case, reducing loan size to ₹52–₹55 lakh and increasing down payment improves long-run stability far more than finding a slightly lower rate. A higher EMI looks fine on paper but breaks under real-life expenses arriving simultaneously.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/in/home-loan-interest-rates-india" className="content-link">Compare live home-loan rate ranges in India</Link>
          <Link href="/in/home-affordability-india" className="content-link">Check home affordability before booking</Link>
          <Link href="/in/personal-loan-comparison-india" className="content-link">Compare personal-loan fallback options</Link>
          <Link href="/in/blog/home-loan-rates-2026" className="content-link">How rate changes affect monthly budget</Link>
        </div>
      </section>
    </section>
  );
}
