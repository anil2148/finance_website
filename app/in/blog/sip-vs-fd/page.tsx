import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

export const metadata: Metadata = createPageMetadata({
  title: 'SIP vs FD in India: A Scenario-Based Decision Guide (2026)',
  description:
    'Compare SIP and FD in India with ₹5,000/₹10,000/₹25,000 examples, volatility reality, and practical decision rules based on timeline and cashflow.',
  pathname: '/in/blog/sip-vs-fd',
  type: 'article'
});

const sections = [
  {
    type: 'table' as const,
    title: 'Real monthly example: ₹5,000 vs ₹10,000 vs ₹25,000 for 10 years',
    table: {
      headers: ['Monthly amount', 'If SIP averages 11%', 'If FD averages 6.8%', 'Gap after 10 years'],
      rows: [
        { 'Monthly amount': '₹5,000', 'If SIP averages 11%': '~₹10.3 lakh', 'If FD averages 6.8%': '~₹8.4 lakh', 'Gap after 10 years': '~₹1.9 lakh more via SIP' },
        { 'Monthly amount': '₹10,000', 'If SIP averages 11%': '~₹20.6 lakh', 'If FD averages 6.8%': '~₹16.8 lakh', 'Gap after 10 years': '~₹3.8 lakh more via SIP' },
        { 'Monthly amount': '₹25,000', 'If SIP averages 11%': '~₹51.4 lakh', 'If FD averages 6.8%': '~₹42.0 lakh', 'Gap after 10 years': '~₹9.4 lakh more via SIP' }
      ]
    }
  },
  {
    type: 'table' as const,
    title: 'Timeline decision depth (5y, 10y, 20y)',
    table: {
      headers: ['Horizon', '₹10,000/month SIP @11%', '₹10,000/month FD @6.8%', 'Break-even interpretation'],
      rows: [
        {
          Horizon: '5 years',
          '₹10,000/month SIP @11%': '~₹8.3 lakh',
          '₹10,000/month FD @6.8%': '~₹7.1 lakh',
          'Break-even interpretation': 'Gap is modest; volatility risk may dominate comfort.'
        },
        {
          Horizon: '10 years',
          '₹10,000/month SIP @11%': '~₹20.6 lakh',
          '₹10,000/month FD @6.8%': '~₹16.8 lakh',
          'Break-even interpretation': 'Gap becomes meaningful for long goals.'
        },
        {
          Horizon: '20 years',
          '₹10,000/month SIP @11%': '~₹75.9 lakh',
          '₹10,000/month FD @6.8%': '~₹50.0 lakh',
          'Break-even interpretation': 'Long compounding strongly favors SIP if you stay invested.'
        }
      ]
    },
    content:
      'Break-even mindset: if your goal is under ~3 years, certainty usually matters more than return spread. Beyond ~7 years, consistency and behavioral discipline become the main driver.'
  },
  {
    type: 'decision-panel' as const,
    title: 'What happens if you choose wrong',
    tone: 'amber' as const,
    points: [
      { label: 'Choosing SIP for near-term goal', text: 'A 20% market drawdown in year 2 can delay a fixed down-payment goal by 12–24 months.' },
      { label: 'Choosing FD for very long-term goal', text: 'Lower growth can reduce retirement corpus by double-digit lakhs over 15–20 years.' },
      { label: 'Choosing either without emergency fund', text: 'You may break investments early, losing return compounding and confidence together.' }
    ]
  },
  {
    type: 'cta-block' as const,
    title: 'Before home buying, separate down-payment money from wealth-building money',
    content:
      'If you are targeting a home purchase in 2–4 years, keep down-payment funds in safety-first buckets. Then pressure-test EMI at current rate, +0.5%, and +1% so your monthly budget stays realistic.',
    links: [
      { label: 'Run the India EMI calculator', href: '/in/calculators/emi-calculator' },
      { label: 'Check home affordability path', href: '/in/home-affordability-india' }
    ]
  }
];

const nextDecisions = [
  {
    title: 'Investing cluster',
    description: 'Choose SIP allocation and automation rules.',
    links: [
      { label: 'India investing hub', href: '/in/investing' },
      { label: 'SIP calculator', href: '/in/calculators/sip-calculator' }
    ]
  },
  {
    title: 'Savings cluster',
    description: 'Use safety buckets for near-term goals.',
    links: [
      { label: 'Banking hub', href: '/in/banking' },
      { label: 'FD comparison page', href: '/in/best-fixed-deposits-india' }
    ]
  },
  {
    title: 'Tax cluster',
    description: 'Don’t mix tax panic with allocation decisions.',
    links: [
      { label: 'India tax hub', href: '/in/tax' },
      { label: 'PPF vs ELSS scenario', href: '/in/blog/ppf-vs-elss' }
    ]
  }
];

const references = [
  { label: 'Reserve Bank of India (RBI)', href: 'https://www.rbi.org.in/', external: true },
  { label: 'Securities and Exchange Board of India (SEBI)', href: 'https://www.sebi.gov.in/', external: true }
];

export default function SipVsFdIndiaPage() {
  return (
    <IndiaArticleRenderer
      title="SIP vs FD in India: which one should you choose?"
      subtitle="India investing decision guide"
      description="Most families are not choosing between “safe” and “smart” investing. They are balancing school fees, emergency reserves, and long-term wealth in the same monthly budget. That is why SIP vs FD should be decided by goal timeline, not by headlines."
      sections={sections}
      nextDecisions={nextDecisions}
      references={references}
    />
  );
}
