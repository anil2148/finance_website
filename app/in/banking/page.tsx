import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Banking Hub 2026: Build Liquidity, Reduce Fee Leakage, and Choose Safer Account Systems',
  description:
    'Use this India banking hub to design emergency-liquidity buckets, reduce avoidable account fees, and connect decisions to calculators and comparison pages.',
  pathname: '/in/banking'
});

const scenarioRows = [
  {
    salary: '₹8L–₹12L annual salary',
    mistake: 'Keeping only one account and losing control of bill, spend, and emergency buckets.',
    whatBreaks: 'Salary arrives and immediately bleeds into bills, daily spend, and unplanned purchases — nothing reaches savings.',
    whatToAutomate: 'Auto-transfer to bills and reserve on salary day. Do not leave money in one account waiting to be spent.',
    whatToAvoidFirst: 'Long FD tenures before emergency fund is funded. Any yield gain is erased by one penalty break.',
    framework: 'Create separate salary, bills, and reserve buckets with automation on salary day.',
    startingPlan: 'Start with 70/20/10 flow: essentials / goals / cushion. Emergency fund target: 3 months expenses in liquid savings.'
  },
  {
    salary: '₹12L–₹18L annual salary',
    mistake: 'Chasing high FD rates while paying hidden card penalties and missing liquidity windows.',
    whatBreaks: 'Card rollover at 36–42% annual interest eliminates any FD return in the same month. Net position is negative.',
    whatToAutomate: 'Full statement balance auto-pay for cards. Quarterly fee audit scheduled in calendar. Reserve auto-transfer on salary day.',
    whatToAvoidFirst: 'Optimizing FD rate before clearing card debt. Do not book a new FD while carrying any card balance.',
    framework: 'Prioritize fee transparency and liquidity before yield optimization.',
    startingPlan: 'Audit quarterly charges, disable optional paid add-ons, and keep 4–5 month emergency reserve accessible.'
  },
  {
    salary: '₹18L–₹25L+ annual salary',
    mistake: 'Over-fragmenting across multiple products without a clear operating system.',
    whatBreaks: 'Four accounts with no rules. Salary arrives; confusion about which account to pull from in an emergency. Manual decisions on every expense.',
    whatToAutomate: 'One operating account for daily spend. Auto SIP on the 2nd of the month. Auto reserve top-up on salary day.',
    whatToAvoidFirst: 'Opening new savings or investment products before documenting existing account rules. More accounts ≠ better system.',
    framework: 'Use one operating account, one reserve account, and deliberate SIP/investment pipelines.',
    startingPlan: 'Document transfer rules, build 6-month reserve, and handle bad-month exceptions without breaking investment cadence.'
  }
];

const pathwayLinks = {
  calculators: [
    { href: '/in/calculators/emi-calculator', label: 'Stress-test EMI before increasing fixed obligations' },
    { href: '/in/calculators/sip-calculator', label: 'Model SIP contribution ranges for long-term goals' }
  ],
  comparisons: [
    { href: '/in/best-savings-accounts-india', label: 'Compare savings-account reliability, limits, and fee terms' },
    { href: '/in/fixed-deposit-vs-sip-india', label: 'Compare FD vs SIP by liquidity and horizon fit' }
  ],
  deepGuides: [
    { href: '/in/investing', label: 'India investing hub: process over prediction' },
    { href: '/in/loans', label: 'India loans hub: safe borrowing thresholds' },
    { href: '/in/blog', label: 'Read India-focused finance guides' }
  ]
};

export default function BankingPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How should Indian households structure everyday banking?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Many households do best with separate salary, bills, and emergency buckets so monthly cashflow remains stable and spending leakage is easier to detect.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is a common banking mistake in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A common mistake is optimizing for headline interest rates before checking fee terms, penalties, and liquidity needs for bad-month scenarios.'
        }
      },
      {
        '@type': 'Question',
        name: 'When should I add more banking products?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Add new products only after your base banking workflow is stable, automated, and reviewed periodically for hidden charges and friction.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much emergency fund should I keep in a bank savings account?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A common target is 3–6 months of core household expenses in a liquid, accessible account — not locked in FDs. If your income is variable or you are self-employed, 6 months is a safer floor.'
        }
      }
    ]
  };

  return (
    <section className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India • Banking decision hub</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">India Banking Hub: build a cashflow-safe system before optimizing returns</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          This page is for salaried households, dual-income families, and self-employed professionals who want fewer money leaks and stronger monthly resilience.
          <strong> Costly mistake:</strong> optimizing yield before protecting liquidity.
        </p>
      </header>

      <IndiaAuthorityNote />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Who this is for</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">This hub is built around three household types with different banking failure modes:</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Salaried household</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Single income, predictable credit date. The risk is one-account chaos — bills, spending, and emergencies all sharing the same pool with no separation rules.</p>
            <p className="mt-2 text-sm font-medium text-blue-700 dark:text-blue-300">Goal: 3-bucket automation before any FD or SIP step.</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Dual-income family</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Two salaries, often two banks, frequently fragmented without an operating rule. The risk is one income pause making EMI or credit unmanageable because no joint reserve was built.</p>
            <p className="mt-2 text-sm font-medium text-blue-700 dark:text-blue-300">Goal: shared reserve account + single-income stress test passed.</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Self-employed professional</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Variable income, irregular credit dates. The risk is treating a good month as normal and under-reserving. One slow quarter wrecks accounts, loan payments, and investments simultaneously.</p>
            <p className="mt-2 text-sm font-medium text-blue-700 dark:text-blue-300">Goal: 6–9 month reserve before any yield or SIP optimization.</p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Decision framework (India banking)</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700 dark:text-slate-300">
          <li><strong>Protect essentials first:</strong> Keep emergency reserves in accessible, low-friction accounts.</li>
          <li><strong>Stop fee leakage:</strong> Audit SMS, maintenance, card, and ATM penalties every quarter.</li>
          <li><strong>Separate horizons:</strong> 0–3 year goals in stable buckets; 7+ year goals can use SIP.</li>
          <li><strong>Pressure test:</strong> If this plan fails in a bad month, it is too aggressive.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Where banking systems fail in real life</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Most Indian banking problems are not about rates. They are about structure — or the absence of it.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 dark:border-rose-500/30 dark:bg-rose-500/10">
            <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-100">One account for everything</h3>
            <p className="mt-2 text-sm text-rose-900/80 dark:text-rose-100/80">Salary, bills, EMI, emergency, and daily spend all in the same account. No rules. Money disappears each month without a clear leak.</p>
            <p className="mt-2 text-xs font-semibold text-rose-800 dark:text-rose-200">Outcome: chronic month-end shortfall even at good salary levels.</p>
          </article>
          <article className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 dark:border-rose-500/30 dark:bg-rose-500/10">
            <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-100">Chasing FD rates while paying card penalties</h3>
            <p className="mt-2 text-sm text-rose-900/80 dark:text-rose-100/80">Booking a ₹2L FD at 7.5% while carrying a ₹20,000 card rollover at 36% annual interest. Net position: deeply negative.</p>
            <p className="mt-2 text-xs font-semibold text-rose-800 dark:text-rose-200">Outcome: household earns ₹15,000/year on FD, loses ₹7,200/year on card interest.</p>
          </article>
          <article className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 dark:border-rose-500/30 dark:bg-rose-500/10">
            <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-100">Too many fragmented accounts, no rules</h3>
            <p className="mt-2 text-sm text-rose-900/80 dark:text-rose-100/80">Four accounts at three banks. Two RD accounts from different years. One salary account with low balance. Confusion on which account to use in an emergency.</p>
            <p className="mt-2 text-xs font-semibold text-rose-800 dark:text-rose-200">Outcome: decision fatigue and money locked in low-value products.</p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Practical account system: four lanes, clear rules</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">A useful banking system does not need to be complicated. It needs to have rules. Four accounts with clear purposes handle most Indian household needs without over-engineering.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Operating account (salary account)</h3>
            <p className="mt-2 text-sm text-blue-900/80 dark:text-blue-100/80">Where salary lands. Used for daily spending and card payments only. Keep minimum balance. On salary day, auto-transfer fixed amounts to bills and reserve accounts.</p>
            <p className="mt-2 text-xs font-semibold text-blue-800 dark:text-blue-200">Do not park long FDs or emergency funds here.</p>
          </article>
          <article className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Bills account</h3>
            <p className="mt-2 text-sm text-blue-900/80 dark:text-blue-100/80">Dedicated account for all fixed obligations: EMI, rent, utilities, SIP, insurance premiums. Auto-debit all recurring expenses from here. Never touch this for daily spending.</p>
            <p className="mt-2 text-xs font-semibold text-blue-800 dark:text-blue-200">Keep 1.5x monthly obligations parked here as buffer.</p>
          </article>
          <article className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
            <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Reserve / emergency account</h3>
            <p className="mt-2 text-sm text-emerald-900/80 dark:text-emerald-100/80">3–6 months of core household expenses in a savings or sweep-in FD account. Zero daily touch. Only opened for genuine emergencies: medical spend, job loss, urgent repair.</p>
            <p className="mt-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200">Top priority to fund before SIP, FD, or any investment step.</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">SIP / investing lane</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">A separate account or auto-debit instruction linked to long-term investments: equity mutual funds, PPF, NPS. Activated only after reserve is fully funded. Contribution size fixed to survive a bad income month.</p>
            <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">Review contribution size annually — do not automate and forget for 3+ years without a check.</p>
          </article>
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">When not to overcomplicate: if monthly surplus is under ₹15,000, start with just two accounts — operating and reserve. Add lanes only when surplus is stable enough to warrant routing rules.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">₹ scenarios: where plans usually break</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Salary band</th>
                <th className="px-3 py-2">Common costly mistake</th>
                <th className="px-3 py-2">What breaks</th>
                <th className="px-3 py-2">What to automate</th>
                <th className="px-3 py-2">What to avoid first</th>
              </tr>
            </thead>
            <tbody>
              {scenarioRows.map((row) => (
                <tr key={row.salary} className="border-b border-slate-100 align-top dark:border-slate-800">
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{row.salary}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.mistake}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.whatBreaks}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.whatToAutomate}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.whatToAvoidFirst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Emergency fund: do this before anything else</h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Build 3–6 months of core expenses in a liquid savings account before chasing FD rates or equity returns. For a household spending ₹50,000/month, that means ₹1.5L–₹3L parked and accessible — not in a 2-year FD you cannot break without penalty.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            <li>Self-employed or variable income? Target 6 months minimum.</li>
            <li>Single income household? Target 6–9 months before investing extra surplus.</li>
            <li>Until the reserve is funded, new investments can wait.</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Credit card traps to avoid</h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Reward points rarely justify carrying a balance. At 36–42% annual interest on rollovers, a ₹20,000 unpaid balance costs ₹600–₹700/month in interest — far more than points ever return.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            <li>Pay full statement balance monthly, not minimum due.</li>
            <li>Do not use credit cards as a bridge loan for salary-day shortfalls.</li>
            <li>Annual fee cards only make sense when benefits exceed fee by 2× or more.</li>
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">FD vs liquidity: when each makes sense</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">The question is not "what gives the best rate?" It is "what gives the best rate for this specific purpose and horizon?"</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">When FD is appropriate</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              <li>Your emergency reserve is already fully funded in a liquid account.</li>
              <li>You have a specific, predictable goal 1–3 years away: school fees, vacation, vehicle purchase.</li>
              <li>You want a guaranteed, no-monitoring return on surplus you will not need before the tenure ends.</li>
              <li>You can afford to break the FD only at penalty cost — and have modelled that penalty.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">When liquid access matters more</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              <li>Emergency fund is below 3 months. Liquidity first, yield second.</li>
              <li>You carry a home loan with a floating rate — rate resets can increase monthly outflow unpredictably.</li>
              <li>Self-employed with variable income — any FD lock-in creates a potential penalty trap in a bad quarter.</li>
              <li>Large upcoming expense (interiors, registration fees) is likely within the FD tenure.</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-sm dark:border-amber-500/30 dark:bg-amber-500/10">
          <p className="font-semibold text-amber-900 dark:text-amber-100">Yield optimization comes after resilience.</p>
          <p className="mt-1 text-amber-900/80 dark:text-amber-100/80">A sweep-in FD earns FD-level rates while keeping your money accessible on demand. For emergency reserves, this is often the right structure. Compare your bank's sweep-in terms before booking a standard FD for money you might need quickly.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Savings account vs FD vs sweep-in FD: which works when</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Each instrument has a different liquidity-and-yield trade-off. Picking the wrong one for the wrong goal is a common fee and penalty source.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Instrument</th>
                <th className="px-3 py-2">Typical rate</th>
                <th className="px-3 py-2">Liquidity</th>
                <th className="px-3 py-2">Best used for</th>
                <th className="px-3 py-2">Hidden cost risk</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 align-top dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Savings account</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">2.5%–7% (varies by bank)</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Immediate, any amount</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Emergency fund, salary buffer, monthly bills</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Quarterly maintenance fees if balance falls below minimum</td>
              </tr>
              <tr className="border-b border-slate-100 align-top dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Fixed Deposit (FD)</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">6.5%–7.5% (12–24 months)</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Restricted — penalty on early break (0.5%–1% lower rate)</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Predictable goals 1–3 years out (vacation fund, school fees)</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Breaking early for emergencies costs ₹2,000–₹5,000 on a ₹5L FD</td>
              </tr>
              <tr className="align-top">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Sweep-in FD</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">FD rate with savings liquidity</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Auto-broken in units; no formal penalty in most banks</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Emergency reserve that should also earn more than savings rate</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Terms vary by bank — check auto-renewal and reverse-sweep rules before relying on it</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Rule of thumb: keep your 3–6 month emergency reserve in savings or sweep-in FD. Only park surplus beyond that in standard FDs.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">India banking journey: from stability to returns</h2>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          Start with your emergency reserve — use the <Link href="/in/best-savings-accounts-india" className="content-link">savings account comparison</Link> to find a zero-fee, high-liquidity base account.
          Once 3–6 months of expenses are parked, run the <Link href="/in/calculators/emi-calculator" className="content-link">EMI calculator</Link> before taking on any new fixed obligation.
          Then use the <Link href="/in/fixed-deposit-vs-sip-india" className="content-link">FD vs SIP comparison</Link> to allocate surplus above that reserve.
        </p>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          If you are carrying credit card debt, clear it before any FD or SIP step — card rollovers at 36–42% annual interest erase any investment benefit. If you are planning to take a home loan, read the <Link href="/in/loans" className="content-link">loans hub</Link> before committing to a loan size that strains monthly cashflow.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Good fit</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-900/90 dark:text-emerald-100/90">
            <li>You want monthly predictability and clear money buckets.</li>
            <li>You can automate transfers right after salary credit.</li>
            <li>You review fees and card interest before chasing reward points.</li>
            <li>You are ready to fund emergency reserve before starting SIP.</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 dark:border-rose-500/30 dark:bg-rose-500/10">
          <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100">Bad fit</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-900/90 dark:text-rose-100/90">
            <li>You frequently dip into overdraft or card rollovers to survive month-end.</li>
            <li>You lock most surplus into long FD tenure without liquidity backup.</li>
            <li>Monthly surplus is fragile — any unexpected expense breaks the system.</li>
            <li>You optimize headline rate while ignoring terms that create penalties.</li>
          </ul>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Calculator pathways</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {pathwayLinks.calculators.map((item) => (
              <li key={item.href}><Link href={item.href} className="content-link">{item.label}</Link></li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Comparison pathways</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {pathwayLinks.comparisons.map((item) => (
              <li key={item.href}><Link href={item.href} className="content-link">{item.label}</Link></li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Related deep guides</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {pathwayLinks.deepGuides.map((item) => (
              <li key={item.href}><Link href={item.href} className="content-link">{item.label}</Link></li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">How should Indian households structure everyday banking?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Many households do best with separate salary, bills, and emergency buckets so monthly cashflow remains stable and spending leakage is easier to detect. Automate transfers on salary day to remove manual decisions.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">What is a common banking mistake in India?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Optimizing for headline interest rates before checking fee terms, penalties, and liquidity needs for bad-month scenarios. A 0.5% higher rate can disappear quickly if quarterly maintenance or penalty charges apply.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">When should I add more banking products?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Add new products only after your base banking workflow is stable, automated, and reviewed periodically for hidden charges and friction. Fragmented accounts without clear rules create confusion during high-expense months.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">How much emergency fund should I keep in a bank savings account?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">A common target is 3–6 months of core household expenses in a liquid, accessible account — not locked in FDs. If your income is variable or you are self-employed, 6 months is a safer floor.</dd>
          </div>
        </dl>
      </section>
    </section>
  );
}
