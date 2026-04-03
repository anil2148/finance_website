import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

export const metadata: Metadata = createPageMetadata({
  title: 'Best Investment Apps India (2026): Charges, Features, and Investor Fit',
  description: 'Compare Indian investment apps by brokerage, AMC access, direct mutual fund support, and UX quality.',
  pathname: '/in/best-investment-apps-india'
});

const sections = [
  {
    type: 'table' as const,
    title: 'App comparison snapshot',
    table: {
      headers: ['App', 'Equity delivery', 'F&O/Intraday', 'Direct MF', 'Best for'],
      rows: [
        { App: 'Zerodha', 'Equity delivery': '₹0', 'F&O/Intraday': 'Up to ₹20/order', 'Direct MF': 'Yes (Coin)', 'Best for': 'Disciplined mixed investors' },
        { App: 'Groww', 'Equity delivery': 'Free/low cost', 'F&O/Intraday': 'Per-order charge', 'Direct MF': 'Yes', 'Best for': 'Beginner SIP + ETF users' },
        { App: 'Upstox', 'Equity delivery': '₹0 delivery', 'F&O/Intraday': 'Up to ₹20/order', 'Direct MF': 'Yes', 'Best for': 'Higher-frequency traders' }
      ]
    }
  },
  {
    type: 'decision-panel' as const,
    title: 'Platform fit by investing style',
    tone: 'blue' as const,
    points: [
      { label: '₹5,000–₹10,000 monthly SIP', text: 'Prioritize reliable SIP automation and direct mutual-fund workflows.' },
      { label: '₹25,000 investing with moderate trading', text: 'Choose transparent brokerage plus strong reporting for tax filing.' },
      { label: '₹50,000+ aggressive style', text: 'Pick robust order execution only with pre-set risk controls.' }
    ]
  },
  {
    type: 'text' as const,
    title: 'The real drag most investors miss',
    content:
      'Brokerage is usually not the largest leak; inconsistent execution, random exits, and missed SIP months are bigger drags. Avoid apps that increase overtrading behavior.'
  },
  {
    type: 'cta-block' as const,
    title: 'Continue with linked money decisions',
    links: [
      { label: 'Investing hub', href: '/in/investing' },
      { label: 'SIP strategy guide', href: '/in/sip-strategy-india' },
      { label: 'FD vs SIP decision page', href: '/in/fixed-deposit-vs-sip-india' },
      { label: 'PPF vs ELSS blog', href: '/in/blog/ppf-vs-elss' },
      { label: 'Savings accounts comparison', href: '/in/best-savings-accounts-india' },
      { label: 'SIP calculator', href: '/in/calculators/sip-calculator' },
      { label: 'EMI calculator', href: '/in/calculators/emi-calculator' }
    ]
  }
];

export default function BestAppsIndiaPage() {
  return (
    <IndiaArticleRenderer
      title="Best investment apps in India: pick the app your behavior can sustain for 10 years"
      description="For SIP-first investors and hybrid users who need dependable execution, clean reports, and fewer behavior mistakes."
      subtitle="India investing decision guide"
      sections={sections}
    />
  );
}
