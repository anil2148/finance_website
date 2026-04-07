import type { Metadata } from 'next';
import { createPageMetadata, breadcrumbSchema, webpageSchema } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

const title = 'GST Impact on Personal Finance India: Where Costs Quietly Compound';
const description =
  'A practical guide to how GST affects personal finance in India — insurance premiums, mutual fund fees, loan processing charges, and the recurring costs most households do not track.';

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  pathname: '/in/blog/gst-impact-on-finance',
  type: 'article'
});

const sections = [
  {
    type: 'text' as const,
    title: 'GST adds 18% to many financial service costs — and most people do not notice',
    content:
      "GST at 18% applies to a range of financial services: mutual fund management fees, insurance premiums, loan processing fees, credit card annual fees, and brokerage. These are not large single charges — they are small recurring amounts that compound quietly over years. A mutual fund with a 1% expense ratio effectively has 1% + 18% GST on the service component (though GST is built into the TER for mutual funds). An insurance premium of ₹30,000 includes ₹4,589 in GST at 18%. A loan processing fee of ₹10,000 becomes ₹11,800 after GST. These are not hidden charges in a legal sense — they are disclosed — but they are rarely accounted for in household financial planning."
  },
  {
    type: 'table' as const,
    title: 'GST on common financial products and services',
    table: {
      headers: ['Product/service', 'GST rate', 'Example amount', 'GST component', 'Annual impact (if recurring)'],
      rows: [
        {
          'Product/service': 'Term insurance premium',
          'GST rate': '18%',
          'Example amount': '₹20,000/year premium',
          'GST component': '₹3,051',
          'Annual impact (if recurring)': '₹3,051/year additional cost'
        },
        {
          'Product/service': 'Health insurance premium',
          'GST rate': '18%',
          'Example amount': '₹25,000/year',
          'GST component': '₹3,814',
          'Annual impact (if recurring)': '₹3,814/year — partially offset by 80D deduction'
        },
        {
          'Product/service': 'Home loan processing fee',
          'GST rate': '18%',
          'Example amount': '₹10,000 one-time',
          'GST component': '₹1,800',
          'Annual impact (if recurring)': 'One-time but worth including in total loan cost comparison'
        },
        {
          'Product/service': 'Credit card annual fee',
          'GST rate': '18%',
          'Example amount': '₹5,000/year',
          'GST component': '₹763',
          'Annual impact (if recurring)': '₹763/year — relevant when calculating net card value'
        },
        {
          'Product/service': 'Demat account AMC',
          'GST rate': '18%',
          'Example amount': '₹400/year',
          'GST component': '₹61',
          'Annual impact (if recurring)': 'Small but worth knowing'
        }
      ]
    },
    content:
      'GST on insurance premiums is significant enough to affect the Section 80D deduction calculation — the premium including GST is what is paid and what counts toward 80D. Verify with your insurer whether the premium quoted includes or excludes GST.'
  },
  {
    type: 'decision-path' as const,
    title: 'Where GST most affects household financial decisions',
    points: [
      {
        label: 'Insurance premium planning',
        text: 'When budgeting annual insurance costs, add 18% GST to the base premium. A ₹1 lakh family floater health insurance policy actually costs ₹1.18 lakh per year. The Section 80D deduction limit (₹25,000 for self and family, ₹50,000 for parents above 60) applies to the premium including GST — this is a minor benefit that partially offsets the cost.'
      },
      {
        label: 'Credit card net value calculation',
        text: 'When calculating whether a credit card annual fee is worth paying, include GST on the fee. A ₹5,000 annual fee card costs ₹5,900 after GST. Your reward earnings must exceed ₹5,900 in net value, not just ₹5,000, to justify the card.'
      },
      {
        label: 'Loan processing fees in total cost comparison',
        text: 'Processing fees, document charges, and legal fees on loans all attract 18% GST. When comparing two lenders where one has lower rate but higher processing fees, include GST in the total fee calculation for an apples-to-apples comparison.'
      },
      {
        label: 'Mutual fund direct vs regular plans',
        text: 'Regular plan mutual funds pay distributor commission from the expense ratio — the TER includes this commission and its associated GST. Direct plans have lower TER. The GST component of the commission cost is one of the reasons direct plans save more than just the commission amount.'
      }
    ]
  },
  {
    type: 'mistake' as const,
    title: 'The insurance renewal mistake',
    mistake: 'Budgeting for insurance renewal based on last year\'s base premium without accounting for premium increases plus 18% GST on the new amount.',
    whyItBackfires:
      'Insurance premiums increase with age, claims history, and medical inflation each year. If the base premium increased from ₹20,000 to ₹24,000, the total with GST moves from ₹23,600 to ₹28,320 — a ₹4,720 increase, not ₹4,000. Households that budget for the increment without GST find themselves short at renewal.',
    betterAlternative:
      'Get the renewal quote 30 days before due date and budget for the GST-inclusive amount. Factor insurance premium increases of 5%–15% per year for health insurance when planning annual finance outflows.'
  },
  {
    type: 'contradiction' as const,
    title: 'GST on insurance looks like a small tax. Over a lifetime it is not.',
    mathWinner:
      'On a ₹20,000 health insurance premium, 18% GST is ₹3,600/year — less than ₹300/month. Most people consider this negligible relative to the coverage value.',
    realLifeChoice:
      'Over 30 years, with premiums rising 8%–10% annually, the cumulative GST paid on health insurance alone often exceeds ₹3–₹4 lakh. This is money that many households absorb without tracking because each annual outflow feels small.',
    reason:
      'Insurance is a need, not a choice — so the GST component is unavoidable. But it is not invisible. Many household financial plans that work on paper break on timing because insurance renewal, advance tax, and school fee cycles all fall in the same months. GST adds to this crunch without being obviously planned for.',
    resolution:
      'Include the GST component explicitly in your annual financial outflow calendar. The 80D deduction applies to the full premium including GST — so if you are on the old tax regime, some of this cost is indirectly recovered. But the cashflow impact arrives before the deduction benefit, which requires a float.'
  },
  {
    type: 'cta-block' as const,
    title: 'Include GST in your annual financial planning',
    content:
      'Add up your recurring financial service costs: insurance premiums, demat charges, credit card fees, and loan processing charges if applicable. Calculate the GST component. Include this as a line item in your household budget — it is typically ₹8,000–₹20,000/year for a middle-income household with standard insurance cover.',
    links: [
      { label: 'India tax hub', href: '/in/tax' },
      { label: '80C deductions guide', href: '/in/80c-deductions' },
      { label: 'India investing hub', href: '/in/investing' }
    ]
  }
];

const nextDecisions = [
  {
    title: 'For insurance cost planning with 80D deduction',
    description: 'The 80D deduction applies to the premium including GST. Understand current limits and whether your regime allows the deduction.',
    links: [
      { label: 'Old vs new tax regime', href: '/in/blog/old-vs-new-tax-regime' },
      { label: 'India tax hub', href: '/in/tax' }
    ]
  }
];

const references = [
  { label: 'Central Board of Indirect Taxes and Customs (CBIC)', href: 'https://cbic.gov.in/', external: true },
  { label: 'Income Tax Department India', href: 'https://www.incometax.gov.in/', external: true }
];

export default function GstImpactOnFinancePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({ pathname: '/in/blog/gst-impact-on-finance', name: title, description }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: 'GST Impact on Finance', item: '/in/blog/gst-impact-on-finance' }
      ])
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IndiaArticleRenderer
        title="GST impact on personal finance: where 18% quietly adds to your annual financial costs"
        subtitle="India tax guide · FY 2025–26"
        description="GST does not show up in your salary or investment return — it shows up in the premiums, fees, and charges layered onto the financial products you use. This guide quantifies where it matters most and helps you account for it in your annual planning, from insurance renewals to loan processing costs."
        sections={sections}
        nextDecisions={nextDecisions}
        references={references}
      />
    </>
  );
}
