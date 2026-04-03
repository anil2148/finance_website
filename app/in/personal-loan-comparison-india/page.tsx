import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

export const metadata: Metadata = createPageMetadata({
  title: 'Personal Loan Comparison India 2026: HDFC vs SBI vs ICICI vs Fintech Lenders',
  description: 'Compare personal loans in India by rates, processing fees, disbursal speed, and borrower profile fit.',
  pathname: '/in/personal-loan-comparison-india'
});

const sections = [
  {
    type: 'table' as const,
    title: 'Personal loan comparison snapshot',
    table: {
      headers: ['Lender type', 'Typical rate range', 'Best for', 'Pros / Cons'],
      rows: [
        { 'Lender type': 'Large banks', 'Typical rate range': '~10.5%–16%', 'Best for': 'Strong-credit salaried borrowers', 'Pros / Cons': 'Pro: predictability / Con: slower approval' },
        { 'Lender type': 'Private banks', 'Typical rate range': '~11%–19%', 'Best for': 'Existing account holders', 'Pros / Cons': 'Pro: faster processing / Con: fee stack varies' },
        { 'Lender type': 'Fintech lenders', 'Typical rate range': '~12%–24%', 'Best for': 'Urgent disbursal users', 'Pros / Cons': 'Pro: quick disbursal / Con: higher all-in cost risk' }
      ]
    }
  },
  {
    type: 'decision-panel' as const,
    title: 'Borrowing decisions by cashflow stress level',
    tone: 'amber' as const,
    points: [
      { label: '₹3,00,000 emergency', text: 'Prioritize predictable fee structure and no hidden insurance bundling.' },
      { label: '₹7,00,000 debt consolidation', text: 'Select lowest 24-month total payout, not lowest EMI headline.' },
      { label: 'EMI capacity ~₹45,000', text: 'Stress-test +1% rate and one low-income month before choosing tenure.' }
    ]
  },
  {
    type: 'text' as const,
    title: 'What destroys repayment plans',
    content:
      'Longest-tenure bias, ignoring processing/insurance/foreclosure costs, and unchanged post-consolidation spending are the three most common failure modes.'
  },
  {
    type: 'cta-block' as const,
    title: 'Continue with linked money decisions',
    links: [
      { label: 'Loans hub', href: '/in/loans' },
      { label: 'Home loan rates comparison', href: '/in/home-loan-interest-rates-india' },
      { label: 'Credit cards comparison', href: '/in/best-credit-cards-india' },
      { label: 'Savings accounts comparison', href: '/in/best-savings-accounts-india' },
      { label: 'FD vs SIP allocation guide', href: '/in/fixed-deposit-vs-sip-india' },
      { label: 'EMI calculator', href: '/in/calculators/emi-calculator' },
      { label: 'SIP calculator', href: '/in/calculators/sip-calculator' }
    ]
  }
];

export default function PersonalLoanComparisonIndiaPage() {
  return (
    <IndiaArticleRenderer
      title="Personal loan comparison India: pick the loan that minimizes total damage to future cashflow"
      description="Who this is for: borrowers funding medical, relocation, or consolidation needs with clear repayment limits."
      subtitle="India loans decision guide"
      sections={sections}
    />
  );
}
