import Link from 'next/link';

const clusterLinks = [
  { href: '/in/tax', label: 'build your India tax plan' },
  { href: '/in/investing', label: 'choose an India investing strategy' },
  { href: '/in/banking', label: 'compare savings accounts in India' },
  { href: '/in/loans', label: 'reduce debt with India loan decisions' },
  { href: '/in/real-estate', label: 'plan home buying in India' },
  { href: '/in/blog/sip-vs-fd', label: 'decide SIP vs FD for your timeline' },
  { href: '/in/blog/ppf-vs-elss', label: 'compare PPF vs ELSS for 80C' },
  { href: '/in/old-vs-new-tax-regime', label: 'pick old vs new tax regime' }
];

const calculatorLinks = [
  { href: '/in/calculators/emi-calculator', label: 'run the India EMI calculator' },
  { href: '/in/calculators/sip-calculator', label: 'project returns with the SIP calculator' }
];

const comparisonLinks = [
  { href: '/in/best-credit-cards-india', label: 'compare credit cards in India' },
  { href: '/in/personal-loan-comparison-india', label: 'compare personal loans in India' }
];

export function IndiaDecisionEngineGlobal() {
  return (
    <section className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <header>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">2-line summary</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">This page gives direct money decisions for FY 2025–26 India, not neutral explanations.</p>
        <p className="text-sm text-slate-700 dark:text-slate-300">Use it if you want an action path based on your timeline, risk comfort, and monthly income stability.</p>
      </header>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Best choice based on your situation</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li><strong>Timeline decision:</strong> goal below 5 years → stability-first options dominate; goal above 7 years → growth-first options dominate; uncertain goal date → use a hybrid split.</li>
          <li><strong>Risk decision:</strong> conservative households should cap volatile allocation; moderate users can combine stability + growth; aggressive users can prioritize growth only after securing emergency liquidity.</li>
          <li><strong>Income decision:</strong> if take-home cashflow swings, choose lower fixed commitments and automate smaller monthly amounts; if income is stable, increase SIP or prepayment in planned steps.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">When this advice FAILS</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>SIP-heavy plans fail when money is needed in 12–36 months during equity drawdowns.</li>
          <li>FD-heavy plans fail when inflation remains above post-tax FD yield for long periods.</li>
          <li>EMI optimization fails if you ignore maintenance, insurance, and rate-reset shocks.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Decision matrix: amount × time × risk</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-3 py-2">Monthly amount</th>
                <th className="px-3 py-2">3 years</th>
                <th className="px-3 py-2">5 years</th>
                <th className="px-3 py-2">10 years</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-800"><td className="px-3 py-2">₹5,000</td><td className="px-3 py-2">Conservative: liquidity + FD focus.</td><td className="px-3 py-2">Moderate: hybrid stability + SIP.</td><td className="px-3 py-2">Aggressive: SIP-first compounding.</td></tr>
              <tr className="border-b border-slate-100 dark:border-slate-800"><td className="px-3 py-2">₹10,000</td><td className="px-3 py-2">Conservative: protect cashflow buffers.</td><td className="px-3 py-2">Moderate: step-up SIP after reserve is done.</td><td className="px-3 py-2">Aggressive: growth allocation dominates.</td></tr>
              <tr className="border-b border-slate-100 dark:border-slate-800"><td className="px-3 py-2">₹25,000</td><td className="px-3 py-2">Conservative: avoid locking all funds.</td><td className="px-3 py-2">Moderate: split between goals and equity.</td><td className="px-3 py-2">Aggressive: long-run wealth acceleration.</td></tr>
              <tr><td className="px-3 py-2">₹50,000</td><td className="px-3 py-2">Conservative: cap leverage and keep liquidity.</td><td className="px-3 py-2">Moderate: diversify with tax-aware buckets.</td><td className="px-3 py-2">Aggressive: combine growth and tactical prepayment.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">What most people get wrong</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>80C does not automatically create maximum tax savings if your regime and cashflow are mismatched.</li>
          <li>ELSS is not always better than PPF for families with high short-term uncertainty.</li>
          <li>Low interest rates do not always mean a cheap loan once processing fees and tenure drag are included.</li>
        </ul>
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300"><strong>Counterintuitive insight:</strong> in many households, prepaying expensive debt early beats investing extra money because the risk-free return equals the avoided borrowing cost.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Real-world example (FY 2025–26)</h3>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">A ₹12 lakh salaried employee can choose a simpler new regime if deductions are limited, then run a ₹10,000 monthly SIP for long-term goals and maintain a 6-month buffer in banking products aligned with RBI-regulated rules and Income Tax filing evidence.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Key takeaways</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>Decide by timeline first, risk second, and product third.</li>
          <li>Use scenario ranges (₹5,000 to ₹50,000) before committing fixed monthly plans.</li>
          <li>Review decisions every quarter or after major income/rate changes.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Continue your India decision path</h3>
        <div className="mt-3 india-link-cluster text-sm">
          {clusterLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full border border-slate-300 px-3 py-1 text-slate-700 hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300">{link.label}</Link>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {calculatorLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full border border-blue-300 px-3 py-1 font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-500/10">{link.label}</Link>
          ))}
          {comparisonLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full border border-indigo-300 px-3 py-1 font-medium text-indigo-700 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-300 dark:hover:bg-indigo-500/10">{link.label}</Link>
          ))}
        </div>
      </section>
    </section>
  );
}
