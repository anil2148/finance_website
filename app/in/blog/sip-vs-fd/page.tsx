import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'SIP vs FD in India: A Scenario-Based Decision Guide (2026)',
  description:
    'Compare SIP and FD in India with ₹5,000/₹10,000/₹25,000 examples, volatility reality, and practical decision rules based on timeline and cashflow.',
  pathname: '/in/blog/sip-vs-fd',
  type: 'article'
});

export default function SipVsFdIndiaPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">India investing decision guide</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">SIP vs FD in India: which one should you choose?</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Most families are not choosing between “safe” and “smart” investing. They are balancing school fees, emergency reserves, and long-term wealth in the same monthly budget. That is why SIP vs FD should be decided by goal timeline, not by headlines.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Real monthly example: ₹5,000 vs ₹10,000 vs ₹25,000 for 10 years</h2>
        <div className="table-shell mt-4">
          <table className="comparison-table min-w-[720px]">
            <thead>
              <tr>
                <th>Monthly amount</th>
                <th>If SIP averages 11%</th>
                <th>If FD averages 6.8%</th>
                <th>How this usually feels in real life</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>₹5,000</td><td>~₹10.3 lakh</td><td>~₹8.4 lakh</td><td>Good starter amount for first-time investors learning volatility.</td></tr>
              <tr><td>₹10,000</td><td>~₹20.6 lakh</td><td>~₹16.8 lakh</td><td>Common salaried household split: growth + safety bucket.</td></tr>
              <tr><td>₹25,000</td><td>~₹51.4 lakh</td><td>~₹42.0 lakh</td><td>Works when income is stable and emergency fund already strong.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          These are directional planning illustrations, not guaranteed returns. SIP may build larger corpus over long periods, but it can look uncomfortable during market falls. FD feels calmer month to month, which is exactly why many people still keep one.
        </p>
      </section>


      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Common household statements (and what they usually mean)</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li><strong>“I want growth but don’t want to see losses every month.”</strong> Keep a stability sleeve in FD and start SIP at an amount you can continue through volatility.</li>
          <li><strong>“I need this money in 2–3 years.”</strong> Prioritize capital safety over return chasing.</li>
          <li><strong>“I can invest more when bonus comes.”</strong> Build baseline SIP from regular salary first, then top-up from variable income.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Who usually prefers FD, and why that can be the right call</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>Households with a known expense in the next 12–36 months (fees, wedding, down payment) where capital loss is unacceptable.</li>
          <li>Families under monthly cashflow pressure who cannot tolerate seeing investment value drop during a rough market year.</li>
          <li>People entering investing for the first time who need confidence and consistency before increasing equity exposure.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">When SIP volatility is usually acceptable</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>Goal is 7+ years away and you can continue SIP during market corrections.</li>
          <li>You already have 6+ months of expenses in liquid/emergency buffers.</li>
          <li>You can mentally separate short-term market noise from long-term goal planning.</li>
        </ul>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          A practical middle path: keep short-term money in FD or low-volatility options, and run SIP for long-term goals like retirement or children’s higher education.
        </p>
      </section>

      <section id="emi-transition" className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Before home buying, separate down-payment money from wealth-building money</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          If you are targeting a home purchase in 2–4 years, keep down-payment funds in safety-first buckets. Don’t let equity volatility decide your booking timeline. Then pressure-test EMI at current rate, +0.5%, and +1% so your monthly budget stays realistic.
        </p>
        <Link href="/in/calculators/emi-calculator" className="mt-4 inline-flex content-link text-sm font-semibold">Run the India EMI calculator →</Link>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Quick decide framework (use this in 2 minutes)</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li><strong>Need this money in under 3 years?</strong> Keep majority in FD-like safety buckets.</li>
          <li><strong>Need this money after 7+ years?</strong> SIP can be your growth engine.</li>
          <li><strong>Confused during tax-saving season?</strong> Keep SIP/FD decision separate from 80C decisions like PPF/ELSS.</li>
          <li><strong>Unsure emotionally?</strong> Start with a split (for example, 60% SIP, 40% FD) and review every 6 months.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Continue your India planning path</h2>
        <div className="mt-3 india-link-cluster text-sm">
          <Link href="/in/blog/ppf-vs-elss" className="content-link-chip">PPF vs ELSS guide</Link>
          <Link href="/in/calculators/sip-calculator" className="content-link-chip">SIP calculator</Link>
          <Link href="/in/calculators/emi-calculator" className="content-link-chip">EMI calculator</Link>
          <Link href="/in/blog" className="content-link-chip">India blog hub</Link>
        </div>
      </section>
      <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-6 dark:border-blue-500/40 dark:bg-blue-900/20">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">FAQ: SIP vs FD</h2>
        <dl className="mt-3 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">Is SIP always better than FD?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">No. SIP generally fits long timelines, while FD usually fits near-term certainty and low volatility tolerance.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">Can I combine both in one plan?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Yes. Many households keep short-term goals in FD and long-term goals in SIP.</dd>
          </div>
        </dl>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">References</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
          <li><Link href="https://www.rbi.org.in/" target="_blank" rel="noreferrer" className="content-link">Reserve Bank of India (RBI)</Link></li>
          <li><Link href="https://www.sebi.gov.in/" target="_blank" rel="noreferrer" className="content-link">Securities and Exchange Board of India (SEBI)</Link></li>
        </ul>
      </section>
      <IndiaAuthorityNote />
    </article>
  );
}
