import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

export const metadata: Metadata = createPageMetadata({
  title: 'Home Loan Interest Rates India (2026): Compare Lenders and EMI Impact',
  description: 'Compare major Indian home-loan interest rates with EMI impact and borrower-fit guidance.',
  pathname: '/in/home-loan-interest-rates-india'
});

const sections = [
  {
    type: 'table' as const,
    title: 'Home-loan comparison snapshot',
    table: {
      headers: ['Lender', 'Starting rate p.a.', 'Processing fee', 'EMI on ₹50,00,000 / 20y'],
      rows: [
        { Lender: 'SBI', 'Starting rate p.a.': '~8.40%', 'Processing fee': 'Up to 0.35%', 'EMI on ₹50,00,000 / 20y': '~₹43,200' },
        { Lender: 'HDFC', 'Starting rate p.a.': '~8.50%', 'Processing fee': '0.50% range', 'EMI on ₹50,00,000 / 20y': '~₹43,500' },
        { Lender: 'ICICI', 'Starting rate p.a.': '~8.75%', 'Processing fee': '0.50% range', 'EMI on ₹50,00,000 / 20y': '~₹44,250' }
      ]
    }
  },
  {
    type: 'decision-panel' as const,
    title: 'Pick by 3-year all-in cost',
    tone: 'blue' as const,
    points: [
      { label: '₹25 lakh conservative borrower', text: 'Choose cleaner reset terms and low foreclosure friction.' },
      { label: '₹50 lakh moderate borrower', text: 'Compare 3-year fee + insurance + reset cost, not teaser rate.' },
      { label: '₹75 lakh+ with prepayment plan', text: 'Favor lenders allowing frequent part-prepayment without penalty.' }
    ]
  },
  {
    type: 'text' as const,
    title: 'Counterintuitive insight',
    content:
      'For many borrowers, one extra EMI each year can save more guaranteed money than short-term return chasing. This fails if emergency reserves drop below six months of expenses.'
  },
  {
    type: 'cta-block' as const,
    title: 'Continue with linked money decisions',
    links: [
      { label: 'Loans hub', href: '/in/loans' },
      { label: 'Real-estate hub', href: '/in/real-estate' },
      { label: 'Rent vs buy framework', href: '/in/rent-vs-buy-india' },
      { label: 'Home affordability guide', href: '/in/home-affordability-india' },
      { label: 'Personal loan comparison', href: '/in/personal-loan-comparison-india' },
      { label: 'EMI calculator', href: '/in/calculators/emi-calculator' },
      { label: 'SIP calculator', href: '/in/calculators/sip-calculator' }
    ]
  }
];

export default function HomeLoanRatesIndiaPage() {
  return (
    <IndiaArticleRenderer
      title="Home loan interest rates in India: optimize 3-year total cost, not teaser rate"
      description="Who this is for: buyers comparing floating-rate offers, fee stack, and prepayment flexibility."
      subtitle="India loans decision guide"
      sections={sections}
    />
  );
}
