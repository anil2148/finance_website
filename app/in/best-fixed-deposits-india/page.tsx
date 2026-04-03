import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

export const metadata: Metadata = createPageMetadata({
  title: 'Best Fixed Deposits in India 2026: SBI vs HDFC vs ICICI vs Small Finance Banks',
  description: 'Compare best fixed deposits in India with rates, tenure, payout options, and user-type fit.',
  pathname: '/in/best-fixed-deposits-india'
});

const sections = [
  {
    type: 'table' as const,
    title: 'FD comparison snapshot',
    table: {
      headers: ['Bank', 'Indicative 1Y rate', 'Best for', 'Pros / Cons'],
      rows: [
        { Bank: 'SBI', 'Indicative 1Y rate': '~6.80%', 'Best for': 'Conservative savers', 'Pros / Cons': 'Pro: trust + branch network / Con: not always highest rates' },
        { Bank: 'HDFC', 'Indicative 1Y rate': '~7.00%', 'Best for': 'Salary-account users', 'Pros / Cons': 'Pro: strong digital flow / Con: penalty rules vary' },
        { Bank: 'ICICI', 'Indicative 1Y rate': '~7.00%', 'Best for': 'Convenience-first users', 'Pros / Cons': 'Pro: flexible tenures / Con: compare payout options carefully' }
      ]
    }
  },
  {
    type: 'decision-panel' as const,
    title: 'FD fit-check by surplus and timeline',
    tone: 'blue' as const,
    points: [
      { label: '₹5,000–₹10,000/month for 3-year goals', text: 'FD ladder usually wins where principal stability matters more than upside.' },
      { label: '₹25,000/month for 5-year goals', text: 'A hybrid FD + SIP setup often improves risk-adjusted outcomes.' },
      { label: '₹50,000/month for 10-year goals', text: 'FD should be a stability sleeve, not the core wealth engine.' }
    ]
  },
  {
    type: 'text' as const,
    title: 'Counterintuitive insight',
    content:
      'Even conservative households can improve outcomes by moving only incremental surplus to SIP while keeping near-term corpus in FD. This fails if premature-withdrawal penalties are ignored or SIP gets paused during volatility.'
  },
  {
    type: 'cta-block' as const,
    title: 'Continue with linked money decisions',
    links: [
      { label: 'Banking hub', href: '/in/banking' },
      { label: 'FD vs SIP timeline guide', href: '/in/fixed-deposit-vs-sip-india' },
      { label: 'Savings accounts comparison', href: '/in/best-savings-accounts-india' },
      { label: 'Investing hub', href: '/in/investing' },
      { label: 'Investment apps comparison', href: '/in/best-investment-apps-india' },
      { label: 'SIP calculator', href: '/in/calculators/sip-calculator' },
      { label: 'EMI calculator', href: '/in/calculators/emi-calculator' }
    ]
  }
];

export default function BestFixedDepositsIndiaPage() {
  return (
    <IndiaArticleRenderer
      title="Best fixed deposits in India (2026): use FD for stability windows, not for every goal"
      description="Useful for households ring-fencing 1–3 year goals where capital swings can derail plans."
      subtitle="India banking decision guide"
      sections={sections}
    />
  );
}
