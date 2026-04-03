import type { Metadata } from 'next';
import { breadcrumbSchema, createPageMetadata, webpageSchema } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

export const metadata: Metadata = createPageMetadata({
  title: 'PPF vs ELSS: India Tax-Saving Decision Guide for 2026',
  description:
    'Compare PPF and ELSS using lock-in reality, family cashflow needs, and practical ₹ allocation examples for Section 80C planning.',
  pathname: '/in/blog/ppf-vs-elss',
  type: 'article'
});

const sections = [
  {
    type: 'table' as const,
    title: 'PPF vs ELSS at a glance',
    table: {
      headers: ['Factor', 'PPF', 'ELSS'],
      rows: [
        { Factor: 'Lock-in', PPF: '15 years (partial withdrawal rules apply)', ELSS: '3 years' },
        {
          Factor: 'Return profile',
          PPF: 'Government-backed, stable but moderate',
          ELSS: 'Equity-linked, can outperform over long periods with volatility'
        },
        { Factor: 'Liquidity fit', PPF: 'Low for short-term goals', ELSS: 'Moderate after lock-in' },
        { Factor: 'Typical role', PPF: 'Stability core for conservative savers', ELSS: 'Growth sleeve for long-term tax saving' }
      ]
    }
  },
  {
    type: 'table' as const,
    title: 'Timeline and break-even outcome (₹1.5 lakh/year)',
    table: {
      headers: ['Horizon', 'PPF at 7.1%', 'ELSS at 11% (illustrative)', 'Gap'],
      rows: [
        { Horizon: '5 years', 'PPF at 7.1%': '~₹8.8 lakh', 'ELSS at 11% (illustrative)': '~₹10.2 lakh', Gap: '~₹1.4 lakh' },
        { Horizon: '10 years', 'PPF at 7.1%': '~₹22.0 lakh', 'ELSS at 11% (illustrative)': '~₹30.5 lakh', Gap: '~₹8.5 lakh' },
        { Horizon: '20 years', 'PPF at 7.1%': '~₹65.4 lakh', 'ELSS at 11% (illustrative)': '~₹1.24 crore', Gap: '~₹58.6 lakh' }
      ]
    },
    content:
      'Break-even insight: if you need liquidity before year 5, high ELSS allocation can create timing risk. If your goal is 15+ years and you can tolerate volatility, growth differential becomes very large.'
  },
  {
    type: 'decision-panel' as const,
    title: 'What happens if you choose wrong',
    tone: 'amber' as const,
    points: [
      {
        label: 'Too much PPF for a growth goal',
        text: 'You can lose long-term purchasing power; inflation-adjusted wealth may lag by tens of lakhs over 20 years.'
      },
      {
        label: 'Too much ELSS for a near-term need',
        text: 'A market decline near withdrawal can force exits at poor values exactly when you need cash.'
      },
      {
        label: 'March-only tax investing habit',
        text: 'Lump-sum panic decisions often create mismatch between risk profile and real household timeline.'
      }
    ]
  },
  {
    type: 'cta-block' as const,
    title: 'Build a tax plan that survives real life cashflow',
    content:
      'Set a monthly 80C contribution, then stress-test how much volatility you can tolerate without stopping contributions in bad market months.',
    links: [
      { label: 'Open India tax hub', href: '/in/tax' },
      { label: 'Compare old vs new regime', href: '/in/old-vs-new-tax-regime' },
      { label: 'Run SIP scenario', href: '/in/calculators/sip-calculator' }
    ]
  }
];

const nextDecisions = [
  {
    title: 'Tax cluster',
    description: 'Finalize 80C + regime + contribution timing.',
    links: [
      { label: 'Tax hub', href: '/in/tax' },
      { label: '80C guide', href: '/in/80c-deductions-guide' }
    ]
  },
  {
    title: 'Investing cluster',
    description: 'Use ELSS as long-term growth sleeve only when fit.',
    links: [
      { label: 'Investing hub', href: '/in/investing' },
      { label: 'SIP vs FD', href: '/in/blog/sip-vs-fd' }
    ]
  },
  {
    title: 'Savings cluster',
    description: 'Keep near-term goals separate from tax buckets.',
    links: [
      { label: 'Banking hub', href: '/in/banking' },
      { label: 'Savings options', href: '/in/best-savings-accounts-india' }
    ]
  }
];

const references = [
  { label: 'Reserve Bank of India (RBI)', href: 'https://www.rbi.org.in/', external: true },
  { label: 'Income Tax Department (India)', href: 'https://www.incometax.gov.in/', external: true }
];

export default function PpfVsElssIndiaPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({
        pathname: '/in/blog/ppf-vs-elss',
        name: 'PPF vs ELSS: India Tax-Saving Decision Guide for 2026',
        description:
          'Compare PPF and ELSS using lock-in reality, family cashflow needs, and practical ₹ allocation examples for Section 80C planning.'
      }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: 'PPF vs ELSS', item: '/in/blog/ppf-vs-elss' }
      ])
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IndiaArticleRenderer
        title="PPF vs ELSS: lock-in, liquidity, and growth trade-offs"
        subtitle="India tax-saving guide"
        description="In many households, the real confusion starts in January: “How do we finish 80C quickly without hurting monthly cashflow?” This page helps you decide based on timeline, risk comfort, and liquidity needs—not just tax-saving urgency."
        sections={sections}
        nextDecisions={nextDecisions}
        references={references}
      />
    </>
  );
}
