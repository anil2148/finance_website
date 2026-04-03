import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Real Estate Hub 2026: Rent vs Buy, Affordability, and Home Loan Readiness',
  description:
    'Use this India real-estate hub to evaluate rent-vs-buy, down payment vs liquidity, and EMI resilience before booking.',
  pathname: '/in/real-estate'
});

const scenarios = [
  {
    profile: '₹12L salary household, metro renter',
    decision: 'Buy now vs wait 18 months',
    whatBreaks: 'EMI on a ₹45–₹50L loan would be ~₹39,000–₹43,400/month — over 50% of take-home (₹85k–₹90k). Down payment exhausts emergency fund. Any rate reset or income dip triggers card rollover.',
    whatLooksSafe: 'Renting at ₹18,000–₹22,000/month while building down payment and emergency reserve over 18 months. SIP continues. No liquidity crunch.',
    action: 'Wait until take-home exceeds ₹1.05L or down payment + 6-month reserve are simultaneously available. Run EMI stress test before any property visit.'
  },
  {
    profile: '₹18L salary, planning first home',
    decision: 'Larger down payment vs keeping liquidity',
    whatBreaks: 'Putting ₹25L+ down on a ₹60L property leaves ₹2–₹3L in savings. No buffer for interiors (₹8–₹12L), moving costs, rate reset, or a medical emergency in year one.',
    whatLooksSafe: '₹15L down payment, ₹8L emergency reserve intact, ₹5L interiors budget set aside. EMI at ₹43,400 on ₹48L loan (9%) = 35% of take-home. Stress EMI at +1% = ₹47,200 (38%) — survivable.',
    action: 'Keep minimum 6 months expenses post-booking before maximizing down payment. Budget separately for stamp duty, registration, and interiors before booking.'
  },
  {
    profile: '₹25L salary, upgrade buyer',
    decision: 'Stretch budget for larger home vs protect investment pace',
    whatBreaks: 'Upgrading to ₹1.2Cr home with ₹96L loan: EMI ~₹85,000/month (49% of ₹1.75L take-home). SIP paused. No emergency reserve after possession costs. One income gap creates crisis.',
    whatLooksSafe: 'Buying ₹90L home with ₹72L loan: EMI ~₹64,000 (37% of take-home). SIP at ₹15,000/month continues. 6-month reserve intact. Stress EMI at +1% still manageable.',
    action: 'Model total housing cost and preserve a non-housing investment lane at ≥₹12,000/month. If that is not possible at current ticket size, reduce budget or delay.'
  }
];

const pathways = {
  calculators: [
    { href: '/in/calculators/emi-calculator', label: 'EMI stress test calculator (current rate, +0.5%, +1.0%)' }
  ],
  comparisons: [
    { href: '/in/home-loan-interest-rates-india', label: 'Home-loan rate comparison (India)' },
    { href: '/in/rent-vs-buy-india', label: 'Rent vs buy comparison guide' },
    { href: '/in/home-affordability-india', label: 'Affordability check before booking' }
  ],
  deepGuides: [
    { href: '/in/loans', label: 'Loans hub for sanction and tenure decisions' },
    { href: '/in/blog/home-loan-rates-2026', label: 'Rate reset impact on monthly budget' },
    { href: '/in/banking', label: 'Banking hub for down-payment liquidity planning' }
  ]
};

export default function IndiaRealEstateHubPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'If EMI equals rent, should I buy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Not automatically. Include maintenance, interiors, taxes, commute changes, and the liquidity impact of down payment before deciding.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much emergency reserve should remain after down payment?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A common resilience target is at least 6 months of core household expenses after booking and moving costs.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the most expensive home-buying mistake?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Treating lender eligibility as affordability and skipping stress tests for rate and expense shocks.'
        }
      }
    ]
  };

  return (
    <section className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India • Real-estate decision hub</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">India Real Estate Hub: buy with full-cost clarity, not EMI optimism</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Who this page is for: first-time and upgrade buyers comparing renting flexibility against ownership stability. <strong>Costly mistake:</strong> exhausting liquidity for down payment and hoping cashflow recovers later.
        </p>
      </header>

      <IndiaAuthorityNote />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Decision framework before booking</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700 dark:text-slate-300">
          <li>Check <strong>stay horizon</strong>: buying is usually safer when 5+ year location stability is likely.</li>
          <li>Calculate <strong>total housing cost</strong>: EMI + maintenance + interiors + commute + taxes.</li>
          <li>Protect <strong>liquidity reserve</strong>: do not optimize yield before securing resilience.</li>
          <li>Use EMI calculator before lender comparison. Then confirm clauses and processing fees.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">What goes wrong (real estate)</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 dark:border-rose-500/30 dark:bg-rose-500/10">
            <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-100">Liquidity wiped out at booking</h3>
            <p className="mt-2 text-sm text-rose-900/80 dark:text-rose-100/80">Down payment + stamp duty + interiors consume cash that should cover 6 months of core costs.</p>
            <p className="mt-2 text-xs font-semibold text-rose-800 dark:text-rose-200">If your reserve disappears after booking, you are exposed.</p>
          </article>
          <article className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 dark:border-rose-500/30 dark:bg-rose-500/10">
            <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-100">Wrong stay horizon</h3>
            <p className="mt-2 text-sm text-rose-900/80 dark:text-rose-100/80">Buying with a 2–4 year stay plan creates an exit-cost problem, not an asset-building strategy.</p>
            <p className="mt-2 text-xs font-semibold text-rose-800 dark:text-rose-200">A forced early sale can erase years of EMI effort.</p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Failure simulation before you book</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Scenario</th>
                <th className="px-3 py-2">Failure point</th>
                <th className="px-3 py-2">Consequence</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 align-top dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">₹12L salary (fragile case)</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">EMI close to 50% and one salary-delay month hits during school-fee cycle.</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">No absorption capacity; credit use rises and buying decision becomes a recovery exercise.</td>
              </tr>
              <tr className="border-b border-slate-100 align-top dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">₹18L salary (base case)</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">₹25L+ down payment leaves only ₹2L–₹3L after registration and furnishing setup.</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">One emergency forces liquidation or costly debt right after possession.</td>
              </tr>
              <tr className="border-b border-slate-100 align-top dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">₹25L salary (optimization case)</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Upgrade decision pauses SIP and uses reserve for interiors.</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Household becomes asset-rich but cashflow-fragile for 18–24 months.</td>
              </tr>
              <tr className="align-top">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Any salary, 3-year stay horizon</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Job relocation forces exit before transaction costs are recovered.</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Net proceeds disappoint; renting would have preserved flexibility and liquidity.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Stay horizon: why 5+ years changes the math</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Buying a home locks you into a geography. If your city, career, or family situation changes within 3 years of purchase, you do not just lose flexibility — you lose money. Here is why the 5-year threshold matters:</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Transaction cost recovery</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Stamp duty (5–8%), registration, brokerage (1–2%), and interiors are sunk costs. A ₹60L flat needs property appreciation of ₹6L–₹9L just to break even on transaction costs before capital gains tax.</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Early exit cost</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Selling within 2 years triggers short-term capital gains at your income tax rate. After 2 years, 20% LTCG with indexation applies. Factor these into any exit calculation — the EMI savings from buying can disappear in one early exit.</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Mobility risk households</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Startup employees, IT professionals with relocation exposure, and dual-income households where either partner might move cities face real mobility risk. Renting preserves career optionality that a locked home does not.</p>
          </article>
        </div>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-sm dark:border-amber-500/30 dark:bg-amber-500/10">
          <p className="font-semibold text-amber-900 dark:text-amber-100">Buying too early creates mobility risk that cannot be solved with savings.</p>
          <p className="mt-1 text-amber-900/80 dark:text-amber-100/80">If your 5-year plan has more uncertainty than stability, renting is a financial decision, not a concession. The rent vs buy calculation should include exit costs, not just monthly payment comparison.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Rent vs buy is a flexibility decision first, EMI decision second</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">The most common buying mistake in India is treating &ldquo;EMI ≈ rent&rdquo; as sufficient reason to buy. The real comparison is about risk allocation, not monthly payments.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">What renting preserves</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              <li>Geographic flexibility — you can move for a better career opportunity without financial penalty.</li>
              <li>Liquidity — down payment money stays available for emergencies, investments, or income gap coverage.</li>
              <li>Rate shock immunity — you are not exposed to home loan rate resets.</li>
              <li>Time flexibility — you can buy when prices and personal readiness align, not under pressure.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">What buying provides</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              <li>Long-term cost certainty — EMI is fixed (floating rate aside), rent escalates annually.</li>
              <li>Asset creation — principal repayment builds equity over time.</li>
              <li>Stability — no eviction risk, ability to customize, sense of permanence.</li>
              <li>Inflation hedge — property in tier-1 cities has historically beaten inflation over 10+ year horizons.</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Use the <Link href="/in/rent-vs-buy-india" className="content-link">rent vs buy comparison guide</Link> to run your own numbers with actual rental rates and property prices. Do not decide based on intuition alone.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">₹ scenarios: buy decision in real life</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {scenarios.map((item) => (
            <article key={item.profile} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{item.profile}</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">{item.decision}</p>
              <p className="mt-2 text-sm text-rose-800 dark:text-rose-300"><strong>What breaks:</strong> {item.whatBreaks}</p>
              <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-300"><strong>What looks safe:</strong> {item.whatLooksSafe}</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><strong>Next step:</strong> {item.action}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">The real monthly cost of ownership (not just EMI)</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Buyers who run only the EMI number routinely underestimate total ownership cost by 30–50%. Here is the actual stack for a ₹60L apartment in a tier-1 city:</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Cost item</th>
                <th className="px-3 py-2">One-time cost</th>
                <th className="px-3 py-2">Monthly recurring</th>
                <th className="px-3 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 align-top dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Home loan EMI (₹48L at 8.75%, 20 yr)</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">—</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">~₹42,000</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Rises to ~₹45,800 if rate moves to 9.75%</td>
              </tr>
              <tr className="border-b border-slate-100 align-top dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Stamp duty + registration</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">₹3.6L–₹4.8L (6–8%)</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">—</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Varies by state; paid at registration</td>
              </tr>
              <tr className="border-b border-slate-100 align-top dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Interiors / furnishing</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">₹5L–₹15L</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">—</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Bare shell units often need ₹8L–₹12L to be liveable</td>
              </tr>
              <tr className="border-b border-slate-100 align-top dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Society maintenance</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">—</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">₹3,000–₹8,000</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Higher in gated communities; rises with age of building</td>
              </tr>
              <tr className="border-b border-slate-100 align-top dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Property tax</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">—</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">₹500–₹2,000 avg/month</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Paid annually or semi-annually to municipality</td>
              </tr>
              <tr className="align-top">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Home insurance</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">—</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">₹300–₹800</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Structure + contents; often ignored until loss occurs</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs font-semibold text-rose-700 dark:text-rose-400">Total true monthly cost (EMI + maintenance + tax + insurance): roughly ₹46,000–₹53,000 — not ₹42,000.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Down payment vs liquidity: when bigger is risky</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">A larger down payment reduces loan size and total interest. But it can also drain savings to dangerous levels. The question is not &ldquo;how much can I put down?&rdquo; — it is &ldquo;how much can I put down while still having an emergency reserve?&rdquo;</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">When a larger down payment makes sense</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              <li>You will still have 6+ months of core expenses in liquid savings after paying down, stamp duty, registration, and interiors.</li>
              <li>A larger down payment reduces your EMI enough to survive a +1% rate shock without strain.</li>
              <li>Your income is stable and a job gap in the next 2 years is unlikely.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">When a smaller down payment is safer</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              <li>A larger down payment would leave you with under 3 months of emergency reserve — this is a dangerous position for a household entering a 20-year obligation.</li>
              <li>Your income is variable or you are self-employed. Liquidity is more important than debt reduction during uncertain income phases.</li>
              <li>Interiors, registration, and moving costs are likely to exceed your estimate. Keep a buffer.</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-sm dark:border-rose-500/30 dark:bg-rose-500/10">
          <p className="font-semibold text-rose-900 dark:text-rose-100">Protect liquidity before optimizing yield or debt reduction.</p>
          <p className="mt-1 text-rose-900/80 dark:text-rose-100/80">A household that puts ₹25L down and has ₹1.5L left in savings has no buffer for a medical emergency, EMI delay, or income gap. A ₹15L down payment with ₹11.5L in liquid savings is significantly safer — even if the loan is larger and monthly EMI is slightly higher.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Mobility risk: when location flexibility matters more than ownership</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">A home is not just a financial decision — it is a geography lock. If your career, family, or industry may require a city change in the next 3–5 years, the financial math changes significantly.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Early exit cost (within 3 years)</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Stamp duty, registration, brokerage (1–2%), and capital-gains tax on appreciation can consume ₹5L–₹12L on a ₹60L property sold within 3 years of purchase.</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Rental yield vs EMI gap</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">In most Indian tier-1 cities, rental yield is 2–3% annually. A ₹60L property rents for ₹15,000–₹18,000/month — well below the ₹42,000+ monthly EMI. Renting the same property and investing the difference often wins over a 5-year horizon.</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Career-risk households</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Startup employees, IT professionals in uncertain roles, and dual-income households where one partner may relocate should delay buying until 5+ year location stability is likely. Renting preserves mobility premium.</p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Pre-booking checklist</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Before committing to a booking amount or signing any agreement, verify all of the following. If any item fails, resolve it before proceeding.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Financial readiness tests</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2"><span className="mt-0.5 text-blue-600 dark:text-blue-400">☐</span> Stay horizon is 5+ years with high confidence.</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-blue-600 dark:text-blue-400">☐</span> Emergency reserve (6 months) survives after down payment, stamp duty, and interiors estimate.</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-blue-600 dark:text-blue-400">☐</span> EMI at current rate passed. EMI at +1% also passed.</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-blue-600 dark:text-blue-400">☐</span> Bad-month test: one income paused for 2 months — EMI still serviceable?</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-blue-600 dark:text-blue-400">☐</span> SIP and insurance continue after EMI starts — nothing is paused to accommodate the purchase.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Lender and cost verification</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2"><span className="mt-0.5 text-blue-600 dark:text-blue-400">☐</span> Total housing cost modelled (not just EMI): maintenance + tax + insurance + commute delta.</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-blue-600 dark:text-blue-400">☐</span> Lender fee stack reviewed: processing, insurance bundling, legal/tech, reset clause.</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-blue-600 dark:text-blue-400">☐</span> Floating-rate loan confirmed (free prepayment option preserved).</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-blue-600 dark:text-blue-400">☐</span> Interior/furnishing budget estimated — bare shell units require ₹8L–₹12L to become liveable.</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-blue-600 dark:text-blue-400">☐</span> Stamp duty + registration cost calculated for your state (typically 6–8% of property value).</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Use the <Link href="/in/calculators/emi-calculator" className="content-link">EMI stress test calculator</Link> and the <Link href="/in/loans" className="content-link">loans hub fee section</Link> before running lender comparisons.</p>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6 dark:border-amber-500/30 dark:bg-amber-500/10">
        <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">Three minimum checks before signing anything</h2>
        <p className="mt-2 text-sm text-amber-900/80 dark:text-amber-100/80">Run these three checks before any booking amount is paid. All three must pass. If any fails, do not book yet — resolve the gap first.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-amber-300 bg-white p-4 dark:border-amber-500/40 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">1. Reserve after booking</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">After paying booking amount, stamp duty, registration, and interiors estimate — do you still have 6 months of core expenses in a liquid account?</p>
            <p className="mt-2 text-xs font-semibold text-rose-700 dark:text-rose-400">If no: do not book. Build reserve first or reduce property budget.</p>
          </div>
          <div className="rounded-xl border border-amber-300 bg-white p-4 dark:border-amber-500/40 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">2. EMI survivability</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Run EMI at current rate and at +1%. Does the higher EMI still leave room for SIP, insurance, school fees, and monthly essentials — without cutting savings?</p>
            <p className="mt-2 text-xs font-semibold text-rose-700 dark:text-rose-400">If no: reduce loan size. Rate resets happen — plan for them, not around them.</p>
          </div>
          <div className="rounded-xl border border-amber-300 bg-white p-4 dark:border-amber-500/40 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">3. Total cost, not just EMI</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Add EMI + maintenance + property tax + insurance. Does the total stay below 45% of take-home — even after a rate reset? EMI alone routinely understates true monthly housing cost by 30–50%.</p>
            <p className="mt-2 text-xs font-semibold text-rose-700 dark:text-rose-400">If no: model a smaller ticket or wait until income grows.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">India real estate journey: from ambition to decision</h2>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          Start with the <Link href="/in/calculators/emi-calculator" className="content-link">EMI stress test</Link> at your target loan amount plus a +1% rate shock.
          If that EMI still fits monthly cashflow, move to the <Link href="/in/home-loan-interest-rates-india" className="content-link">home-loan rate comparison</Link> to find floating-rate lenders.
          Then do a rent-vs-buy check with the <Link href="/in/rent-vs-buy-india" className="content-link">rent vs buy guide</Link> to confirm that ownership makes financial sense over your intended stay horizon.
        </p>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          After booking, the <Link href="/in/loans" className="content-link">loans hub</Link> will help you manage prepayment strategy and the <Link href="/in/banking" className="content-link">banking hub</Link> will keep your emergency reserve intact alongside EMI obligations.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Good fit to buy now</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-900/90 dark:text-emerald-100/90">
            <li>5+ year stay probability is high.</li>
            <li>Emergency reserve survives even after registration/interiors.</li>
            <li>EMI stress test still supports insurance + SIP continuity.</li>
            <li>Total housing cost (not just EMI) fits comfortably in monthly budget.</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 dark:border-rose-500/30 dark:bg-rose-500/10">
          <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100">Bad fit to buy now</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-900/90 dark:text-rose-100/90">
            <li>Location/job mobility is still uncertain over next 2–3 years.</li>
            <li>Down payment drains all savings and forces future borrowing.</li>
            <li>One bad month would cause card rollover or SIP shutdown.</li>
            <li>Total housing cost exceeds 50% of take-home income.</li>
          </ul>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Calculator pathway</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {pathways.calculators.map((item) => (
              <li key={item.href}><Link href={item.href} className="content-link">{item.label}</Link></li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Comparison pathway</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {pathways.comparisons.map((item) => (
              <li key={item.href}><Link href={item.href} className="content-link">{item.label}</Link></li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Related deep guides</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {pathways.deepGuides.map((item) => (
              <li key={item.href}><Link href={item.href} className="content-link">{item.label}</Link></li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">If EMI equals rent, should I buy?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Not automatically. Include maintenance (₹3,000–₹8,000/month for most apartments), interiors (₹5–15L one-time), taxes, commute changes, and the liquidity impact of down payment before deciding. The true monthly cost of ownership is often 30–50% above EMI alone.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">How much emergency reserve should remain after down payment?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Keep at least 6 months of core household expenses after booking and moving costs. Many buyers exhaust savings on down payment and interiors, leaving no buffer for rate resets or income gaps in the first year.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">What is the most expensive home-buying mistake?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Treating lender eligibility as affordability and skipping stress tests for rate and expense shocks. A ₹60L loan at 8.5% needs ₹52,000 EMI — if rates move to 9.5%, the EMI rises to ₹56,000. Many households cannot absorb that delta without cutting SIP or emergency savings.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">When does renting clearly beat buying in India?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Renting is usually better when you plan to stay less than 4–5 years, your job or city plans are uncertain, or the total buying cost (EMI + maintenance + stamp duty + interiors) exceeds rent by more than 30% with no realistic appreciation buffer.</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-red-200 bg-red-50/40 p-6 dark:border-red-500/30 dark:bg-red-500/10">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">What buyers regret later</h2>
        <div className="mt-4 space-y-5">
          <div className="rounded-xl border border-red-200 bg-white p-4 dark:border-red-500/30 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">₹18L salary → most savings used for down payment</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <li><span className="font-medium text-red-700 dark:text-red-400">Setup:</span> Large down payment made to reduce EMI. Savings nearly exhausted.</li>
              <li><span className="font-medium text-red-700 dark:text-red-400">Failure:</span> No liquidity left after booking.</li>
              <li><span className="font-medium text-red-700 dark:text-red-400">Consequence:</span> Interiors cost ₹8–12L. First emergency arrives. Stress begins within 3 months of possession.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-red-200 bg-white p-4 dark:border-red-500/30 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">₹12L salary → buys early, {'<'}5 year stay planned</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <li><span className="font-medium text-red-700 dark:text-red-400">Setup:</span> Buys believing relocation will not happen.</li>
              <li><span className="font-medium text-red-700 dark:text-red-400">Failure:</span> Job change or life event forces relocation in year 3–4.</li>
              <li><span className="font-medium text-red-700 dark:text-red-400">Consequence:</span> Stamp duty loss + broker fees + price stagnation = net financial loss on exit.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-red-200 bg-white p-4 dark:border-red-500/30 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">₹25L salary → EMI looks comfortable</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <li><span className="font-medium text-red-700 dark:text-red-400">Setup:</span> EMI at 30–33% of income. Feels manageable.</li>
              <li><span className="font-medium text-red-700 dark:text-red-400">Failure:</span> Total cost ignored: maintenance + society charges + lifestyle upgrade creep.</li>
              <li><span className="font-medium text-red-700 dark:text-red-400">Consequence:</span> Actual housing cost reaches 45–50% of income. SIP and goals quietly stall.</li>
            </ul>
          </div>
        </div>
        <p className="mt-5 text-sm font-semibold text-red-800 dark:text-red-300">If one bad month breaks your EMI, the house is too expensive.</p>
      </section>
    </section>
  );
}
