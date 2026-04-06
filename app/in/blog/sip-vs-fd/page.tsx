import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

const title = 'SIP vs FD in India: Which one should you choose by goal timeline?';
const description =
  'India SIP vs FD guide with monthly investment scenarios, timeline-based decision logic, and practical downside checks.';

export const metadata: Metadata = createPageMetadata({
  title,
  description,
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
    title: 'Goal timeline decision: which product fits which horizon?',
    table: {
      headers: ['Horizon', '₹10,000/month SIP @11%', '₹10,000/month FD @6.8%', 'What drives the decision'],
      rows: [
        {
          Horizon: '5 years or less',
          '₹10,000/month SIP @11%': '~₹8.3 lakh',
          '₹10,000/month FD @6.8%': '~₹7.1 lakh',
          'What drives the decision': 'A 20–25% drawdown in year 3–4 can delay a fixed goal by 1–2 years. Certainty usually wins here.'
        },
        {
          Horizon: '7–10 years',
          '₹10,000/month SIP @11%': '~₹20.6 lakh',
          '₹10,000/month FD @6.8%': '~₹16.8 lakh',
          'What drives the decision': 'The gap is meaningful. Behavioral discipline — staying invested in down years — becomes the key variable.'
        },
        {
          Horizon: '15–20 years',
          '₹10,000/month SIP @11%': '~₹75.9 lakh',
          '₹10,000/month FD @6.8%': '~₹50.0 lakh',
          'What drives the decision': 'Long compounding strongly favors SIP. The question is whether you stay invested through 2–3 full market cycles.'
        }
      ]
    },
    content:
      'Rule of thumb: if you would panic-exit the SIP during a 30% market correction, the FD is the safer real-world choice for that bucket of money — even if the theoretical SIP return is higher.'
  },
  {
    type: 'decision-panel' as const,
    title: 'The real costs of choosing wrong',
    tone: 'amber' as const,
    points: [
      { label: 'SIP for a 2-year down payment goal', text: 'A 20–25% market drawdown can push a fixed purchase timeline back by 12–24 months. Down payment money should not carry market risk.' },
      { label: 'FD for a 20-year retirement goal', text: 'At 6.8% vs 11% over 20 years on ₹10,000/month, the FD path produces roughly ₹25 lakh less. That is not a rounding error.' },
      { label: 'Either, without emergency money first', text: 'If your SIP or FD gets broken early because of a cashflow emergency, you lose return compounding and often confidence. Rebuild the buffer first.' }
    ]
  },
  {
    type: 'decision-panel' as const,
    title: 'Blended strategy: the approach most households actually need',
    tone: 'emerald' as const,
    points: [
      { label: 'Emergency bucket (3–6 months expenses)', text: 'FD or liquid fund only. This money should not be in market instruments. Keep it boring and accessible.' },
      { label: 'Near-term goals (under 3 years)', text: 'FD, recurring deposit, or debt fund. Do not expose fixed-timeline money to equity volatility.' },
      { label: 'Long-term wealth (7+ years)', text: 'SIP into diversified equity mutual funds. Start small, build consistency, step up annually. Do not panic-exit during corrections.' },
      { label: 'Part FD, part SIP for 4–6 year goals', text: 'Split the monthly amount: keep 40–50% in FD for downside protection, put the rest in a balanced advantage or hybrid fund. Reduces regret in either scenario.' }
    ]
  },
  {
    type: 'cta-block' as const,
    title: 'If you are saving for a home purchase in 2–4 years',
    content:
      'Keep the down payment in safety-first buckets. Then run EMI scenarios at today\'s rate, +0.5%, and +1.0% to make sure the monthly budget still works if rates rise. Many families locked a home loan they could comfortably afford on paper — and found it tight once school fees, maintenance, and a rate reset arrived together.',
    links: [
      { label: 'Run the India EMI stress test', href: '/in/calculators/emi-calculator' },
      { label: 'Check home affordability before booking', href: '/in/home-affordability-india' }
    ]
  }
];

const nextDecisions = [
  {
    title: 'For long-term wealth building',
    description: 'If your SIP horizon is 10+ years, learn how to set up automation, step up contributions, and stay invested through volatility without panic-exiting.',
    links: [
      { label: 'India investing hub', href: '/in/investing' },
      { label: 'SIP calculator — project your corpus', href: '/in/calculators/sip-calculator' }
    ]
  },
  {
    title: 'For near-term goals and safety',
    description: 'If your goal is under 3 years, use FD or liquid instruments. Compare rates and understand the real yield after penalties and premature closure charges.',
    links: [
      { label: 'India banking hub', href: '/in/banking' },
      { label: 'Best fixed deposits in India', href: '/in/best-fixed-deposits-india' }
    ]
  },
  {
    title: 'For tax-saving decisions',
    description: 'Keep tax decisions separate from SIP/FD allocation. Tax pressure in March should not drive your long-term investing structure.',
    links: [
      { label: 'India tax planning hub', href: '/in/tax' },
      { label: 'PPF vs ELSS: which fits your tax plan?', href: '/in/blog/ppf-vs-elss' }
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
      title="SIP vs FD in India: which fits your goal and timeline?"
      subtitle="India investing decision guide"
      description="Most Indian families are not choosing between 'safe' and 'smart' investing. They are balancing school fees, home down-payment timelines, emergency reserves, and long-term wealth goals in the same monthly salary. SIP vs FD cannot be answered without knowing your goal timeline, your comfort with market drops, and whether your emergency money is already protected separately."
      sections={sections}
      nextDecisions={nextDecisions}
      references={references}
    />
  );
}
