import type { Metadata } from 'next';
import { createPageMetadata, breadcrumbSchema, webpageSchema } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

const title = 'SIP vs FD in India: A Scenario-Based Decision Guide (2026)';
const description = 'Compare SIP and FD in India with ₹5,000/₹10,000/₹25,000 examples...';

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  pathname: '/in/blog/sip-vs-fd',
  type: 'article'
});

export default function SipVsFdIndiaPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({
        pathname: '/in/blog/sip-vs-fd',
        name: title,
        description
      }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: 'SIP vs FD', item: '/in/blog/sip-vs-fd' }
      ])
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IndiaArticleRenderer
        title="SIP vs FD in India: which one should you choose?"
        subtitle="India investing decision guide"
        description="Most families are not choosing between safe and smart investing. They are balancing school fees, emergency reserves, and long-term wealth in the same monthly budget."
        sections={[
          {
            type: 'table',
            title: 'Real monthly example: ���5,000 vs ₹10,000 vs ₹25,000 for 10 years',
            table: {
              headers: ['Monthly amount', 'If SIP averages 11%', 'If FD averages 6.8%', 'Gap after 10 years'],
              rows: [
                {
                  'Monthly amount': '₹5,000',
                  'If SIP averages 11%': '~₹10.3 lakh',
                  'If FD averages 6.8%': '~₹8.4 lakh',
                  'Gap after 10 years': '~₹1.9 lakh more via SIP'
                },
                {
                  'Monthly amount': '₹10,000',
                  'If SIP averages 11%': '~₹20.6 lakh',
                  'If FD averages 6.8%': '~₹16.8 lakh',
                  'Gap after 10 years': '~₹3.8 lakh more via SIP'
                },
                {
                  'Monthly amount': '₹25,000',
                  'If SIP averages 11%': '~₹51.4 lakh',
                  'If FD averages 6.8%': '~₹42.0 lakh',
                  'Gap after 10 years': '~₹9.4 lakh more via SIP'
                }
              ]
            }
          },
          {
            type: 'decision-panel',
            title: 'What happens if you choose wrong',
            tone: 'amber',
            points: [
              { label: 'Choosing SIP for near-term goal', text: 'A 20% market drawdown in year 2 can delay a fixed down-payment goal by 12–24 months.' },
              { label: 'Choosing FD for very long-term goal', text: 'Lower growth can reduce retirement corpus by double-digit lakhs over 15–20 years.' },
              { label: 'Choosing either without emergency fund', text: 'You may break investments early, losing return compounding and confidence together.' }
            ]
          },
          {
            type: 'cta-block',
            title: 'Before home buying, separate down-payment money from wealth-building money',
            content: 'If you are targeting a home purchase in 2–4 years, keep down-payment funds in safety-first buckets. Then pressure-test EMI affordability.',
            links: [
              { label: 'Run the India EMI calculator', href: '/in/calculators/emi-calculator' },
              { label: 'Check home affordability path', href: '/in/home-affordability-india' }
            ]
          },
          {
            type: 'decision-path',
            title: 'Next decision path',
            points: [
              { label: 'Investing cluster', text: 'Choose SIP allocation and automation rules.' },
              { label: 'Savings cluster', text: 'Use safety buckets for near-term goals.' },
              { label: 'Tax cluster', text: 'Don't mix tax panic with allocation decisions.' }
            ]
          }
        ]}
        references={[
          { label: 'Reserve Bank of India (RBI)', href: 'https://www.rbi.org.in/', external: true },
          { label: 'Securities and Exchange Board of India (SEBI)', href: 'https://www.sebi.gov.in/', external: true }
        ]}
      />
    </>
  );
}
