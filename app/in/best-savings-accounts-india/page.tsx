import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

export const metadata: Metadata = createPageMetadata({
  title: 'Best Savings Accounts India (2026): Rates, Fees, and Fit',
  description: 'Compare Indian savings accounts by interest rate, minimum balance, and digital usability for salary and family use.',
  pathname: '/in/best-savings-accounts-india'
});

const sections = [
  {
    type: 'table' as const,
    title: 'Savings account comparison snapshot',
    table: {
      headers: ['Bank', 'Interest p.a.', 'Min balance', 'Fee signal', 'Best for'],
      rows: [
        { Bank: 'Kotak 811', 'Interest p.a.': 'Up to 7.00%', 'Min balance': '₹0', 'Fee signal': 'Debit-card and service charges vary', 'Best for': 'Digital-first users' },
        { Bank: 'IDFC FIRST Savings', 'Interest p.a.': 'Up to 7.25%', 'Min balance': '₹10,000 in some variants', 'Fee signal': 'Check non-maintenance rules', 'Best for': 'Higher-balance users' },
        { Bank: 'HDFC Regular Savings', 'Interest p.a.': '~3.00–3.50%', 'Min balance': 'City-based', 'Fee signal': 'Higher convenience, lower rate', 'Best for': 'Branch-reliant families' }
      ]
    }
  },
  {
    type: 'decision-panel' as const,
    title: 'Pick account type by balance behavior',
    tone: 'blue' as const,
    points: [
      { label: 'Emergency reserve ₹3–6 lakh', text: 'Zero-minimum accounts reduce penalty risk and protect liquidity.' },
      { label: 'Operating float ₹50,000–₹2,00,000', text: 'Higher-rate variants only work if minimum-balance rules are realistic.' },
      { label: 'Variable income households', text: 'Predictable charges often beat higher headline rates.' }
    ]
  },
  {
    type: 'text' as const,
    title: 'Fee leakage matters more than headline rate',
    content:
      'The highest rate does not dominate when usable balance is small and charges are frequent. Re-check promotional slabs and effective yield every quarter.'
  },
  {
    type: 'cta-block' as const,
    title: 'Continue with linked money decisions',
    links: [
      { label: 'Banking hub', href: '/in/banking' },
      { label: 'Fixed deposits comparison', href: '/in/best-fixed-deposits-india' },
      { label: 'Credit cards comparison', href: '/in/best-credit-cards-india' },
      { label: 'FD vs SIP decision page', href: '/in/fixed-deposit-vs-sip-india' },
      { label: 'Personal loan comparison', href: '/in/personal-loan-comparison-india' },
      { label: 'SIP calculator', href: '/in/calculators/sip-calculator' },
      { label: 'EMI calculator', href: '/in/calculators/emi-calculator' }
    ]
  }
];

export default function BestSavingsIndiaPage() {
  return (
    <IndiaArticleRenderer
      title="Best savings accounts in India (2026): choose the account that protects cashflow first"
      description="For salary-account users and families who need fast access to emergency money without minimum-balance penalties."
      subtitle="India banking decision guide"
      sections={sections}
    />
  );
}
