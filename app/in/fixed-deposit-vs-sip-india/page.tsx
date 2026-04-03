import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

export const metadata: Metadata = createPageMetadata({
  title: 'Fixed Deposit vs SIP India (2026): Returns, Risk, and Goal Fit',
  description: 'Compare FD and SIP for Indian investors with real monthly investment scenarios and trade-off tables.',
  pathname: '/in/fixed-deposit-vs-sip-india'
});

const sections = [
  {
    type: 'table' as const,
    title: '10-year projection snapshot',
    table: {
      headers: ['Monthly invest', 'FD @ 7.0% (10y)', 'SIP @ 12.0% (10y)', 'Decision note'],
      rows: [
        { 'Monthly invest': '₹5,000', 'FD @ 7.0% (10y)': '~₹8,60,000', 'SIP @ 12.0% (10y)': '~₹11,60,000', 'Decision note': 'SIP only if 5+ year volatility is acceptable.' },
        { 'Monthly invest': '₹10,000', 'FD @ 7.0% (10y)': '~₹17,20,000', 'SIP @ 12.0% (10y)': '~₹23,20,000', 'Decision note': 'Hybrid split works well for uncertain goals.' },
        { 'Monthly invest': '₹25,000', 'FD @ 7.0% (10y)': '~₹43,00,000', 'SIP @ 12.0% (10y)': '~₹58,00,000', 'Decision note': 'Goal bucket segregation is mandatory.' },
        { 'Monthly invest': '₹50,000', 'FD @ 7.0% (10y)': '~₹86,00,000', 'SIP @ 12.0% (10y)': '~₹1,16,00,000', 'Decision note': 'Use rebalancing and risk-cap rules.' }
      ]
    }
  },
  {
    type: 'decision-panel' as const,
    title: 'Choose allocation by goal window',
    tone: 'blue' as const,
    points: [
      { label: '0–3 year goals', text: 'Keep most money in FD or high-liquidity buckets to avoid forced exits.' },
      { label: '5+ year goals', text: 'SIP can take larger allocation if you keep one year withdrawals in stable assets.' },
      { label: 'Variable income', text: 'Build FD ladder first, then increase SIP after 2–3 stable quarters.' }
    ]
  },
  {
    type: 'text' as const,
    title: 'Failure checkpoints',
    content:
      'SIP-heavy plans fail when equity money is needed during drawdowns; FD-only plans fail when post-tax returns trail inflation. Hybrid plans fail when never rebalanced after salary or timeline changes.'
  },
  {
    type: 'cta-block' as const,
    title: 'Continue with linked money decisions',
    links: [
      { label: 'Investing hub', href: '/in/investing' },
      { label: 'Banking hub', href: '/in/banking' },
      { label: 'Fixed deposits comparison', href: '/in/best-fixed-deposits-india' },
      { label: 'Investment apps comparison', href: '/in/best-investment-apps-india' },
      { label: 'SIP vs FD strategy blog', href: '/in/blog/sip-vs-fd' },
      { label: 'SIP calculator', href: '/in/calculators/sip-calculator' },
      { label: 'EMI calculator', href: '/in/calculators/emi-calculator' }
    ]
  }
];

export default function FdVsSipIndiaMoneyPage() {
  return (
    <IndiaArticleRenderer
      title="Fixed Deposit vs SIP in India: choose by timeline first, return second"
      description="Who this is for: savers deciding where monthly surplus belongs across 3, 5, and 10-year goals."
      subtitle="India investing decision guide"
      sections={sections}
    />
  );
}
