import type { Metadata } from 'next';
import { createPageMetadata, breadcrumbSchema, webpageSchema } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

const title = 'Old vs New Tax Regime India 2026: which one saves you more?';
const description =
  'Compare old and new tax regimes using real salary examples — from ₹8 lakh to ₹25 lakh — with deduction thresholds, break-even logic, and the one timing mistake that wipes out the benefit of getting it right.';

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  pathname: '/in/blog/old-vs-new-tax-regime',
  type: 'article'
});

const sections = [
  {
    type: 'text' as const,
    title: 'Most people choose a tax regime in February. Most get it wrong.',
    content:
      'India\'s dual tax regime system sounds like a choice between two clearly explained options. In practice, most salaried employees lock their regime at the start of the year based on a quick HR form, a WhatsApp forward, or a CA friend\'s general advice. The regime that saves ₹30,000–₹80,000 at ₹18 lakh salary requires systematic deduction execution from April — not a last-minute decision in January. The new regime is simpler. The old regime is more tax-efficient for certain income and deduction profiles. Neither is universally better. The answer depends on your specific deduction reality.'
  },
  {
    type: 'table' as const,
    title: 'New regime tax slabs FY 2025–26 (for reference)',
    table: {
      headers: ['Income slab', 'Tax rate (new regime)', 'Tax rate (old regime)'],
      rows: [
        { 'Income slab': 'Up to ₹3 lakh', 'Tax rate (new regime)': 'Nil', 'Tax rate (old regime)': 'Nil' },
        { 'Income slab': '₹3L–₹7L', 'Tax rate (new regime)': '5%', 'Tax rate (old regime)': '5% (after ₹2.5L exemption)' },
        { 'Income slab': '₹7L–₹10L', 'Tax rate (new regime)': '10%', 'Tax rate (old regime)': '20%' },
        { 'Income slab': '₹10L–₹12L', 'Tax rate (new regime)': '15%', 'Tax rate (old regime)': '30%' },
        { 'Income slab': '₹12L–₹15L', 'Tax rate (new regime)': '20%', 'Tax rate (old regime)': '30%' },
        { 'Income slab': 'Above ₹15L', 'Tax rate (new regime)': '30%', 'Tax rate (old regime)': '30%' }
      ]
    },
    content:
      'New regime has lower slab rates but no standard deductions beyond ₹75,000. Old regime allows HRA, 80C, 80D, home loan interest, and other deductions that can significantly reduce taxable income. The right regime depends on whether your deductions cross the break-even threshold.'
  },
  {
    type: 'decision-path' as const,
    title: 'Which regime makes sense for your salary — quick decision framework',
    points: [
      {
        label: '₹8 lakh annual salary',
        text: 'New regime almost always wins at this level. Standard deduction alone (₹75,000) is the main benefit available. Old regime advantage requires consistent HRA, full 80C (₹1.5L), and 80D — which together must exceed ₹3+ lakh in documented deductions to tip the balance.'
      },
      {
        label: '₹12 lakh annual salary',
        text: 'Compare both regimes with your actual deductions before deciding. Old regime wins if HRA + EPF + 80C + 80D cross ₹4L–₹5L total. The math is close. Do not assume — calculate.'
      },
      {
        label: '₹18 lakh annual salary',
        text: 'Old regime can save ₹30,000–₹65,000 if fully executed. Requires documented HRA (rent receipts), EPF contribution (likely ₹1.08L), full 80C (₹1.5L), 80D (₹25,000), and optionally Section 24 home-loan interest (₹2L). All must be consistent from April.'
      },
      {
        label: '₹25 lakh+ annual salary',
        text: 'Old regime can save ₹60,000–₹1.2 lakh when NPS (80CCD), HRA, full 80C, 80D, and home-loan interest are all claimed. But the complexity and proof management are real. New regime at this income is a defensible simplicity choice if the savings do not justify the execution overhead for you.'
      }
    ]
  },
  {
    type: 'mistake' as const,
    title: 'The most expensive tax regime mistake',
    mistake:
      'Choosing the old regime in April based on a projected deduction plan, then failing to execute 80C contributions consistently through the year — and realising in February that actual deductions are ₹80,000 below the planned level.',
    whyItBackfires:
      'At ₹15 lakh salary, the old regime only wins if cumulative deductions exceed roughly ₹3.5L. If you declared ₹1.5L for ELSS but only invested ₹75,000, and your HRA claim is smaller than expected, the new regime might have been better — but you cannot switch in February without losing the advance tax positioning.',
    betterAlternative:
      'Calculate break-even deductions before April. If you choose the old regime, automate ₹12,500/month for 80C from the first payday. Do not leave tax investments for January–March.'
  },
  {
    type: 'decision-panel' as const,
    title: 'When old regime wins — checklist',
    tone: 'emerald' as const,
    points: [
      {
        label: 'HRA is significant and landlord receipts are collected',
        text: 'Metro cities: HRA claim can be ₹1.5L–₹3L depending on rent and salary. This single deduction often tips the balance toward old regime. Without it, new regime frequently wins.'
      },
      {
        label: 'EPF contribution fills ₹1.0L–₹1.5L of 80C automatically',
        text: 'Salaried employees with EPF often meet most of their 80C limit passively. If EPF fills ₹1L, the remaining 80C gap is only ₹50,000 — achievable through LIC premium, PPF, or ELSS.'
      },
      {
        label: 'Health insurance premium generates ₹25,000–₹50,000 in 80D',
        text: 'If you pay for self and parents, 80D can add ₹50,000 in deductions. This alone can justify old regime at ₹12L–₹18L salary bands when combined with EPF and HRA.'
      },
      {
        label: 'Home loan interest under Section 24 adds ₹1.5L–₹2L',
        text: 'For home buyers with a loan, Section 24 deduction is one of the most powerful in the old regime. Combined with the above, the total deduction stack can easily cross ₹5L–₹6L.'
      }
    ]
  },
  {
    type: 'decision-panel' as const,
    title: 'When new regime wins — checklist',
    tone: 'blue' as const,
    points: [
      {
        label: 'Your total declared deductions are below ₹2.5L',
        text: 'If you do not have HRA (own home or employer-paid accommodation), EPF is small, and you have not consistently built 80C — the new regime is likely cheaper. Do not maintain old regime complexity for sub-₹5,000 savings.'
      },
      {
        label: 'You switched jobs mid-year',
        text: 'Mid-year job switches disrupt HRA claims, Form 16 consistency, and advance tax declarations. New regime removes most of this complexity. If switching was recent, verify with CA before filing.'
      },
      {
        label: 'You prefer simplicity over ₹20,000–₹40,000 in annual savings',
        text: 'At ₹12L salary where the old regime advantage is small, managing proofs, declarations, and investment discipline year-round may not be worth the hassle. New regime is not wrong here — it is a legitimate tradeoff.'
      },
      {
        label: 'Variable or commission income makes deduction planning unreliable',
        text: 'If your income fluctuates, your tax liability fluctuates, and over-investing in 80C because of an expected high-income year creates cashflow pressure if the year turns out lower. New regime removes this guessing.'
      }
    ]
  },
  {
    type: 'contradiction' as const,
    title: 'The math says old regime. Many people choose new anyway.',
    mathWinner:
      'At ₹18 lakh salary with full HRA, EPF, 80C, 80D, and home-loan interest, the old regime can save ₹30,000–₹65,000 versus the new regime.',
    realLifeChoice:
      'A growing number of salaried employees — even at ₹18–₹25 lakh — are choosing the new regime despite the savings available in the old one.',
    reason:
      'The old regime requires HRA proof collection, consistent 80C investment from April, advance tax calculations if freelance income exists, and Form 15G/15H submissions. For many households managing EMI, school fees, and family obligations simultaneously, the simplification of the new regime is worth ₹30,000–₹40,000.',
    resolution:
      'Neither choice is wrong if it is made with full information. If you can execute old regime systematically and the savings exceed ₹25,000/year, it is worth the effort. If not — particularly with a mid-year job switch or variable income — new regime removes a source of financial administration pressure.'
  },
  {
    type: 'cta-block' as const,
    title: 'Run the real comparison before April',
    content:
      'Do not decide based on a general guideline. Calculate your specific deductions: HRA (if applicable), EPF contribution, 80C gap, 80D premium, home loan interest. Compare your taxable income under both regimes. Lock the decision in April. Automate 80C contributions monthly if you choose old regime.',
    links: [
      { label: 'Old vs new regime comparison guide', href: '/in/old-vs-new-tax-regime' },
      { label: 'India tax hub', href: '/in/tax' },
      { label: '80C deductions guide', href: '/in/80c-deductions' }
    ]
  }
];

const nextDecisions = [
  {
    title: 'If you chose the old regime',
    description:
      'Automate 80C contributions by April. Split your ₹1.5L limit across EPF (auto), PPF (monthly), and ELSS (monthly SIP). Do not leave it for February.',
    links: [
      { label: 'PPF vs ELSS: which fits your 80C plan?', href: '/in/blog/ppf-vs-elss' },
      { label: '80C deductions complete guide', href: '/in/80c-deductions' }
    ]
  },
  {
    title: 'If you have a home loan',
    description:
      'Section 24 deduction (₹2L interest) is one of the strongest old-regime benefits. Confirm your lender issues a certificate of interest by April.',
    links: [
      { label: 'India home loan hub', href: '/in/loans' },
      { label: 'Home loan rates 2026', href: '/in/blog/home-loan-rates-2026' }
    ]
  }
];

const references = [
  { label: 'Income Tax Department India', href: 'https://www.incometax.gov.in/', external: true },
  { label: 'Central Board of Direct Taxes (CBDT)', href: 'https://www.incometaxindia.gov.in/', external: true }
];

export default function OldVsNewTaxRegimeBlogPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({ pathname: '/in/blog/old-vs-new-tax-regime', name: title, description }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: 'Old vs New Tax Regime', item: '/in/blog/old-vs-new-tax-regime' }
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Which tax regime is better in India for salaried employees?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It depends on your deduction profile. New regime wins at low deduction levels (below ₹2.5L). Old regime wins at ₹15L–₹25L salary when HRA, EPF, 80C, 80D, and home-loan interest are fully executed. Always calculate using your actual deductions before deciding in April.'
            }
          },
          {
            '@type': 'Question',
            name: 'When does the old tax regime stop making sense?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'When your actual (not planned) deductions are below ₹2.5L–₹3L, the new regime is likely cheaper. Also when you have variable income, frequent job switches, or cannot maintain consistent 80C from April through March.'
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IndiaArticleRenderer
        title="Old vs New Tax Regime 2026: who wins depends entirely on your deduction reality"
        subtitle="India tax guide · FY 2025–26"
        description="The old tax regime can save ₹30,000–₹80,000 at the right salary band — but only if you execute it correctly from April, not January. This guide helps you calculate your specific break-even point and decide before your HR form deadline, not after."
        sections={sections}
        nextDecisions={nextDecisions}
        references={references}
      />
    </>
  );
}


export const metadata: Metadata = createPageMetadata({
  title,
  description,
  pathname: '/in/blog/old-vs-new-tax-regime',
  type: 'article'
});

export default function IndiaGuide() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({
        pathname: '/in/blog/old-vs-new-tax-regime',
        name: title,
        description
      }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: title, item: '/in/blog/old-vs-new-tax-regime' }
      ])
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IndiaArticleRenderer
        title="Old vs New Tax Regime: 2026 Slabs & Section 80C"
        subtitle="Tax guide"
        description="Practical guide with India-specific scenarios and decision frameworks."
        sections={[
          {
            type: 'text',
            title: 'Quick takeaway',
            content: 'This guide provides actionable insights for Indian financial decisions with real ₹ examples.'
          }
        ]}
        references={[
          { label: 'Reserve Bank of India (RBI)', href: 'https://www.rbi.org.in/', external: true }
        ]}
      />
    </>
  );
}
