import type { Metadata } from 'next';
import { breadcrumbSchema, createPageMetadata, webpageSchema } from '@/lib/seo';
import { SITE_ORIGIN } from '@/lib/seo-urls';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';
import { IndiaBlogHub } from '@/components/india/IndiaBlogHub';

const title = 'FinanceSphere India Blog | SIP, PPF, ELSS, and Home Loan Guides';
const description = 'Explore India-first personal finance guides on SIP, FD, PPF, ELSS, EMI planning, and tax-saving decisions.';

const guides = [
  {
    title: 'Capital Gains Tax in India: LTCG vs STCG for equity investing',
    slug: 'capital-gains-tax-india',
    description: 'Understand holding-period rules, tax bands, and sale-order planning before rebalancing.',
    category: 'tax' as const,
    publishedAt: '2026-04-03'
  },
  {
    title: 'GST impact on personal finance: where costs quietly compound',
    slug: 'gst-impact-on-finance',
    description: 'See where GST influences EMI-adjacent costs, insurance, and recurring expenses.',
    category: 'tax' as const,
    publishedAt: '2026-04-03'
  },
  {
    title: 'SIP for beginners: from first ₹5,000 to long-horizon consistency',
    slug: 'sip-for-beginners',
    description: 'Build a realistic SIP start plan, step-up rhythm, and behavior guardrails for market volatility.',
    category: 'investing' as const,
    publishedAt: '2026-04-03'
  },
  {
    title: 'SIP vs FD in India: Which fits your 3, 5, and 10-year goals?',
    slug: 'sip-vs-fd',
    description: 'Compare certainty vs growth, liquidity, and tax treatment using practical ₹ scenarios.',
    category: 'investing' as const,
    publishedAt: '2026-03-15'
  },
  {
    title: 'PPF vs ELSS: Tax-saving decision framework for Indian investors',
    slug: 'ppf-vs-elss',
    description: 'Understand lock-in, volatility, flexibility, and Section 80C strategy by life stage.',
    category: 'tax' as const,
    publishedAt: '2026-03-10'
  },
  {
    title: 'Home Loan EMI Stress Test: How rate changes impact your monthly budget',
    slug: 'home-loan-rates-2026',
    description: 'Model EMI impact at +0.5% and +1.0% before you commit to a long-tenure loan.',
    category: 'loans' as const,
    publishedAt: '2026-04-01'
  },
  {
    title: 'Emergency Fund Target for Indian households: 3 vs 6 months',
    slug: 'emergency-fund-india',
    description: 'Set a realistic reserve target based on job risk, dependents, and fixed monthly costs.',
    category: 'savings' as const,
    publishedAt: '2026-04-02'
  },
  {
    title: 'Old vs New Tax Regime: quick framework for FY planning',
    slug: 'old-vs-new-tax-regime',
    description: 'Use deduction profile, salary structure, and simplicity to choose the right regime.',
    category: 'tax' as const,
    publishedAt: '2026-03-27'
  },
  {
    title: 'Education Loan in India: repayment strategy after graduation',
    slug: 'education-loan-india',
    description: 'Plan moratorium, EMI ramp-up, and prepayment decisions without cashflow stress.',
    category: 'loans' as const,
    publishedAt: '2026-03-25'
  },
  {
    title: 'Fixed Deposit Ladder in India: build liquidity without one big maturity risk',
    slug: 'fixed-deposit-ladder',
    description: 'Split deposits across maturities to improve flexibility while preserving certainty.',
    category: 'savings' as const,
    publishedAt: '2026-03-21'
  },
  {
    title: 'High-yield savings accounts in India: rate chasing without fee traps',
    slug: 'high-yield-savings-india',
    description: 'Compare headline rates, minimum balance rules, and effective yield after penalties.',
    category: 'savings' as const,
    publishedAt: '2026-03-20'
  },
  {
    title: 'ETF vs Mutual Funds in India: cost, execution, and behavior fit',
    slug: 'etf-vs-mutual-funds',
    description: 'Compare cost structure, trading behavior, and SIP suitability for long-term investors.',
    category: 'investing' as const,
    publishedAt: '2026-03-19'
  },
  {
    title: 'NPS in India: tax benefits, lock-in, and retirement role',
    slug: 'nps-vs-401k-equivalent',
    description: 'Use NPS as a retirement sleeve with clear expectations on liquidity and withdrawal rules.',
    category: 'investing' as const,
    publishedAt: '2026-03-18'
  },
  {
    title: 'Personal loan vs credit card debt: which to close first',
    slug: 'personal-loan-vs-cc',
    description: 'Use interest-cost and cashflow sequencing to reduce total debt burden faster.',
    category: 'loans' as const,
    publishedAt: '2026-03-17'
  }
];

const pathways = [
  { label: 'Is my SIP amount right for my income?', href: '/in/calculators/sip-calculator', group: 'Investing setup' },
  { label: 'SIP vs FD: which fits my goal timeline?', href: '/in/blog/sip-vs-fd', group: 'Investing setup' },
  { label: 'Can I afford this EMI if rates rise 1%?', href: '/in/calculators/emi-calculator', group: 'Home loan check' },
  { label: 'Build a smart 80C allocation plan', href: '/in/blog/ppf-vs-elss', group: 'Tax planning' },
  { label: 'Old vs new tax regime: which is better for me?', href: '/in/blog/old-vs-new-tax-regime', group: 'Tax planning' },
  { label: 'How large should my emergency fund be?', href: '/in/blog/emergency-fund-india', group: 'Safety net first' }
];

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  pathname: '/in/blog'
});

export default function IndiaBlogHubPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({
        pathname: '/in/blog',
        name: title,
        description
      }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' }
      ]),
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_ORIGIN}/in/blog`,
        name: title,
        description,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: guides.map((guide, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: guide.title,
            url: `${SITE_ORIGIN}/in/blog/${guide.slug}`
          }))
        }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IndiaBlogHub guides={guides} pathways={pathways} />
      <IndiaAuthorityNote />
    </>
  );
}
