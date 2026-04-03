import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'Best Credit Cards India (2026): Fees, Rewards, and User-Type Fit',
  description: 'Compare top Indian credit cards with annual fee, reward rate, and waiver rules by user profile.',
  pathname: '/in/best-credit-cards-india'
});

export default function BestCardsIndiaPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border bg-white p-6">
        <h1 className="text-3xl font-semibold">Best credit cards in India (2026): choose by annual spend, not by launch offer</h1>
        <p className="mt-2 text-sm">Built for users selecting one primary card based on yearly spend and waiver eligibility, not banner rewards.</p>
      </header>
      <IndiaAuthorityNote />

      <section className="rounded-2xl border bg-white p-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-3 py-2 text-left">Card</th>
              <th className="px-3 py-2 text-left">Joining/Annual fee</th>
              <th className="px-3 py-2 text-left">Reward potential</th>
              <th className="px-3 py-2 text-left">Best for</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="px-3 py-2">HDFC Millennia</td><td className="px-3 py-2">₹1,000/₹1,000</td><td className="px-3 py-2">Up to 5% on selected merchants</td><td className="px-3 py-2">Online-first spenders</td></tr>
            <tr className="border-b"><td className="px-3 py-2">SBI Cashback Card</td><td className="px-3 py-2">₹999/₹999</td><td className="px-3 py-2">5% online cashback (caps apply)</td><td className="px-3 py-2">Simple cashback optimization</td></tr>
            <tr><td className="px-3 py-2">ICICI Amazon Pay</td><td className="px-3 py-2">₹0/₹0</td><td className="px-3 py-2">Amazon-biased cashback</td><td className="px-3 py-2">No-fee, low-maintenance users</td></tr>
          </tbody>
        </table>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">Choose card depth by annual spend band</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          <li>₹1–2 lakh annual card spend: no-fee cards usually win because waiver miss-risk is high.</li>
          <li>₹5–10 lakh annual spend: a paid cashback card dominates if your categories match reward multipliers.</li>
          <li>Frequent flyers with predictable travel: airline/travel cards only win if redemption value beats fee drag.</li>
        </ul>
        <h3 className="mt-4 text-lg font-semibold">Skip premium cards when…</h3>
        <p className="mt-2">You cannot reliably cross the annual-fee waiver threshold or pay in full each month. High APR + fee wipes out rewards.</p>
        <p className="mt-3"><strong>Counterintuitive insight:</strong> a lower-reward no-fee card can create higher net value than a premium card when annual spend is irregular.</p>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">What most people get wrong</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          <li>Reward rate is meaningless if redemption categories do not match your monthly spend.</li>
          <li>Low annual fee is not cheap when late fees and revolving interest are frequent.</li>
          <li>Using multiple cards without spend-tracking often reduces total reward capture.</li>
        </ul>
        <p className="mt-3"><strong>FY 2025–26 lens:</strong> Use one primary card + one backup no-fee card, then review every quarter against actual spend statements.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/in/banking" className="text-blue-700">Banking hub for liquidity-first money decisions</Link>
          <Link href="/in/best-savings-accounts-india" className="text-blue-700">compare savings accounts in India</Link>
          <Link href="/in/personal-loan-comparison-india" className="text-blue-700">compare personal loans in India before revolving card debt</Link>
          <Link href="/in/home-loan-interest-rates-india" className="text-blue-700">compare home loan rates in India</Link>
          <Link href="/in/best-investment-apps-india" className="text-blue-700">compare investment apps in India</Link>
          <Link href="/in/calculators/emi-calculator" className="text-blue-700">stress-test fixed obligations with the EMI calculator</Link>
          <Link href="/in/calculators/sip-calculator" className="text-blue-700">project long-term SIP alternatives in ₹</Link>
        </div>
      </section>
    </article>
  );
}
