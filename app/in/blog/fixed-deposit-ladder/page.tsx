import type { Metadata } from 'next';
import { createPageMetadata, breadcrumbSchema, webpageSchema } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

const title = 'FD Ladder Strategy India: Better Liquidity Without Sacrificing Returns';
const description =
  'Learn how to structure a fixed deposit ladder in India — split maturities, avoid premature closure penalties, and improve liquidity without keeping all your savings in a low-yield savings account.';

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  pathname: '/in/blog/fixed-deposit-ladder',
  type: 'article'
});

const sections = [
  {
    type: 'text' as const,
    title: 'The problem with one large FD',
    content:
      'Most people who use FDs put their savings into one or two large deposits. The problem: if an emergency arrives before maturity, premature closure costs you 0.5%–1.0% penalty and you lose the higher long-tenure rate you locked in. You get all-or-nothing liquidity. A ladder solves this by splitting the same money across multiple FDs with staggered maturities — so part of your money always becomes available soon, while the rest earns the higher rate.'
  },
  {
    type: 'decision-path' as const,
    title: 'How to build a basic FD ladder',
    points: [
      {
        label: 'Step 1: Decide total FD corpus and goal',
        text: 'Separate your emergency fund from your goal-based FDs. The emergency fund should stay in an instant-access savings account or liquid fund — not in an FD, even with a ladder. The ladder works for savings you will not need immediately but might need in phases.'
      },
      {
        label: 'Step 2: Split into 3–5 tranches by maturity',
        text: 'A typical 3-tranche ladder: one third matures in 6 months, one third in 12 months, one third in 24 months. As each tranche matures, reinvest in the longest rung (24 months). This creates a rolling structure where money becomes available every 6–12 months.'
      },
      {
        label: 'Step 3: Match ladder rungs to real future needs',
        text: 'If you know school fees land in June and insurance renewals in November, align a rung to mature near each. A ladder built around known future expenses avoids premature closure entirely — the money arrives when you need it.'
      },
      {
        label: 'Step 4: Use different banks for different rungs',
        text: 'Spreading FDs across 2–3 banks improves resilience and — for amounts above ₹5 lakh — protects more of your savings under DICGC deposit insurance (₹5 lakh per bank per depositor). Rates also vary by bank, so comparison is worthwhile.'
      }
    ]
  },
  {
    type: 'table' as const,
    title: 'Simple ladder example: ₹3 lakh across 3 rungs',
    table: {
      headers: ['Tranche', 'Amount', 'Maturity', 'Rate (illustrative)', 'Purpose'],
      rows: [
        { 'Tranche': 'Rung 1', 'Amount': '₹1,00,000', 'Maturity': '6 months', 'Rate (illustrative)': '6.5%', 'Purpose': 'Near-term expenses or short-term goal' },
        { 'Tranche': 'Rung 2', 'Amount': '₹1,00,000', 'Maturity': '12 months', 'Rate (illustrative)': '7.0%', 'Purpose': 'Annual renewal / medium-term goal' },
        { 'Tranche': 'Rung 3', 'Amount': '₹1,00,000', 'Maturity': '24 months', 'Rate (illustrative)': '7.25%', 'Purpose': 'Longer goal or reinvest at maturity' }
      ]
    },
    content:
      'As Rung 1 matures, reinvest it into a new 24-month FD. Over time, the ladder self-renews and you always have a rung maturing within 6 months. Rates are illustrative — compare current FD rates before placing deposits.'
  },
  {
    type: 'mistake' as const,
    title: 'FD ladder mistake: using it as the emergency fund',
    mistake: 'Building a 3-rung FD ladder and considering it your emergency fund because "money becomes available every 6 months."',
    whyItBackfires:
      'A real emergency does not wait for your next FD maturity. Premature closure of an FD costs 0.5%–1.0% penalty and resets the rate. If the emergency lands 2 months after a rung just matured, you either pay the penalty or are short of funds.',
    betterAlternative:
      'Keep 1–2 months of essential expenses in an instant-access savings account or liquid fund outside the ladder. The ladder covers medium-term liquidity needs; the savings/liquid fund covers true emergencies. Both serve different purposes.'
  },
  {
    type: 'contradiction' as const,
    title: 'A single large FD looks simpler. A ladder is actually more useful.',
    mathWinner:
      'One ₹3 lakh FD at a 24-month rate earns slightly more than a staggered 3-rung ladder (short-tenure rates are typically 0.25%–0.75% lower).',
    realLifeChoice:
      'Many Indians use large single FDs and then break them prematurely when unexpected expenses arrive — paying the penalty and losing the rate advantage they were trying to capture.',
    reason:
      'The single FD looks optimized on day one but creates forced premature closure when real life arrives. The ladder earns slightly less on the near-term rungs but eliminates the penalty cost that most large-FD holders end up paying.',
    resolution:
      'If you have ever broken an FD before maturity due to an unplanned expense, a ladder is the right structure. The marginal rate loss on near-term rungs is almost always less than one premature closure penalty.'
  },
  {
    type: 'cta-block' as const,
    title: 'Compare current FD rates before building your ladder',
    content:
      'FD rates vary significantly across banks and small finance banks. Compare headline rates, premature closure penalty clauses, and interest payout options (monthly vs maturity) before committing.',
    links: [
      { label: 'Best fixed deposits India', href: '/in/best-fixed-deposits-india' },
      { label: 'India banking hub', href: '/in/banking' },
      { label: 'SIP vs FD: goal-based choice', href: '/in/blog/sip-vs-fd' }
    ]
  }
];

const nextDecisions = [
  {
    title: 'For the portion beyond the FD ladder',
    description: 'Once your liquid emergency buffer and FD ladder are in place, surplus savings for 5+ year goals should move into equity SIP for better long-run returns.',
    links: [
      { label: 'SIP vs FD guide', href: '/in/blog/sip-vs-fd' },
      { label: 'India investing hub', href: '/in/investing' }
    ]
  }
];

const references = [
  { label: 'Reserve Bank of India (RBI)', href: 'https://www.rbi.org.in/', external: true },
  { label: 'Deposit Insurance and Credit Guarantee Corporation (DICGC)', href: 'https://www.dicgc.org.in/', external: true }
];

export default function FixedDepositLadderPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({ pathname: '/in/blog/fixed-deposit-ladder', name: title, description }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: 'FD Ladder Strategy', item: '/in/blog/fixed-deposit-ladder' }
      ])
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IndiaArticleRenderer
        title="FD Ladder Strategy India: split maturities, avoid premature closure, improve liquidity"
        subtitle="India savings guide · FY 2025–26"
        description="A fixed deposit ladder lets you earn higher long-tenure rates while maintaining access to part of your money every 6–12 months — without the all-or-nothing problem of a single large FD. This guide shows how to build one, when it makes sense, and the one mistake that turns a ladder into a liability."
        sections={sections}
        nextDecisions={nextDecisions}
        references={references}
      />
    </>
  );
}
