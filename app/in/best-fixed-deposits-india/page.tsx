import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({ title: 'Best Fixed Deposits in India 2026: SBI vs HDFC vs ICICI vs Small Finance Banks', description: 'Compare best fixed deposits in India with rates, tenure, payout options, and user-type fit.', pathname: '/in/best-fixed-deposits-india' });

export default function BestFixedDepositsIndiaPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border bg-white p-6"><h1 className="text-3xl font-semibold">Best fixed deposits in India (2026): rates + liquidity fit</h1><p className="mt-2 text-sm">Who this is for: households parking emergency and short-term goal funds in predictable return products.</p></header>
      <section className="rounded-2xl border bg-white p-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm"><thead><tr className="border-b"><th className="px-3 py-2 text-left">Bank</th><th className="px-3 py-2 text-left">Indicative 1Y rate</th><th className="px-3 py-2 text-left">Best for</th><th className="px-3 py-2 text-left">Pros / Cons</th></tr></thead><tbody>
          <tr className="border-b"><td className="px-3 py-2">SBI</td><td className="px-3 py-2">~6.80%</td><td className="px-3 py-2">Conservative savers</td><td className="px-3 py-2">Pro: trust + branch network / Con: not always highest rates</td></tr>
          <tr className="border-b"><td className="px-3 py-2">HDFC</td><td className="px-3 py-2">~7.00%</td><td className="px-3 py-2">Existing salary account users</td><td className="px-3 py-2">Pro: strong digital journey / Con: penalty rules vary</td></tr>
          <tr><td className="px-3 py-2">ICICI</td><td className="px-3 py-2">~7.00%</td><td className="px-3 py-2">Convenience-first users</td><td className="px-3 py-2">Pro: flexible tenures / Con: compare payout options carefully</td></tr>
        </tbody></table>
      </section>
      <section className="rounded-2xl border bg-white p-6 text-sm"><h2 className="text-xl font-semibold">Best for by scenario</h2><ul className="mt-3 list-disc pl-5 space-y-2"><li>₹5 lakh emergency fund: prioritize easy premature withdrawal terms.</li><li>₹10 lakh near-term down payment: ladder FD tenures to reduce reinvestment risk.</li><li>₹20 lakh retired household corpus: mix monthly payout and cumulative FDs.</li></ul><p className="mt-3"><strong>CTA:</strong> Compare with SIP before locking long tenures.</p><div className="mt-3 flex flex-wrap gap-3"><Link href="/in/banking">Banking hub</Link><Link href="/in/fixed-deposit-vs-sip-india">FD vs SIP comparison</Link><Link href="/in/best-savings-accounts-india">Savings accounts comparison</Link><Link href="/in/calculators/sip-calculator">SIP calculator</Link><Link href="/in/best-investment-apps-india">Investment apps comparison</Link></div></section>
      <IndiaAuthorityNote />
    </article>
  );
}
