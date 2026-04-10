import type { Metadata } from 'next';
import { createPageMetadata, breadcrumbSchema, webpageSchema } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

const title = 'Education Loan India: Repayment Strategy After Graduation';
const description =
  'A practical guide to education loan repayment in India — moratorium management, EMI ramp-up planning, prepayment strategy, and how to avoid the interest compounding trap during the study period.';

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  pathname: '/in/blog/education-loan-india',
  type: 'article'
});

const sections = [
  {
    type: 'text' as const,
    title: 'The moratorium is not free — interest still accrues',
    content:
      'Most education loans in India include a moratorium period: no EMI during the study period plus 6–12 months after graduation. This feels like relief, but interest typically continues to accrue on the principal during this period. A ₹15 lakh loan at 11% APR accrues roughly ₹1.65 lakh in interest per year. Over 5 years of study plus 1 year moratorium, that is ₹9.9 lakh in additional interest added to the principal before you make a single payment — if nothing is paid during the moratorium. Understanding this matters because paying interest during the moratorium, even in small amounts, dramatically reduces the total repayment burden.'
  },
  {
    type: 'table' as const,
    title: 'Moratorium interest impact on ₹15 lakh loan at 11% APR',
    table: {
      headers: ['Scenario', 'Balance at EMI start', '10-year EMI', 'Total repayment', 'Difference'],
      rows: [
        {
          'Scenario': 'No payments during 5-year moratorium',
          'Balance at EMI start': '~₹25.2 lakh (after 5Y interest)',
          '10-year EMI': '~₹34,600/month',
          'Total repayment': '~₹41.5 lakh',
          'Difference': 'Baseline'
        },
        {
          'Scenario': 'Interest paid monthly during moratorium',
          'Balance at EMI start': '₹15 lakh (principal only)',
          '10-year EMI': '~₹20,600/month',
          'Total repayment': '~₹24.7 lakh',
          'Difference': '~₹16.8 lakh less total repayment'
        }
      ]
    },
    content:
      'Paying interest during the moratorium — even with part-time income during studies — reduces total repayment by a significant amount. Paying ₹13,750/month (interest only) during a 5-year moratorium saves far more than that amount in total EMI burden afterward.'
  },
  {
    type: 'decision-path' as const,
    title: 'Repayment strategy after graduation',
    points: [
      {
        label: 'First year of employment: ramp-up, not maximum EMI',
        text: 'Salary in year one of a job is often lower than year two and three. Take the lower EMI option initially — do not stretch to clear the loan in minimum time if it means no emergency buffer and no breathing room. Build a 2-month expense buffer before increasing EMI aggressively.'
      },
      {
        label: 'Year 2–4: prepayment from salary increments',
        text: 'Each year\'s increment is a natural prepayment opportunity. Redirect 40%–60% of each annual increment to education loan prepayment until the loan-to-income ratio improves. Prepaying ₹50,000–₹1,00,000/year from bonuses significantly reduces tenure.'
      },
      {
        label: 'Section 80E deduction: use it actively',
        text: 'Interest paid on education loans is fully deductible under Section 80E for 8 years from the start of repayment. This deduction has no upper limit — ₹2 lakh in education loan interest saves ₹60,000 in tax at 30% bracket. Keep interest payment certificates from your lender each year.'
      },
      {
        label: 'Balance transfer to lower-rate lender',
        text: 'Education loan rates vary from 8.5% (PSU banks for meritorious students) to 14%+ (private NBFCs). If you took a higher-rate loan, refinancing to a PSU bank 2 years into employment — when your income proof is stronger — can save 2%–4% on remaining principal.'
      }
    ]
  },
  {
    type: 'mistake' as const,
    title: 'The moratorium trap: assuming interest stops accruing',
    mistake: 'Treating the moratorium period as free money — no payments, no planning — and arriving at repayment start with a significantly larger principal than expected.',
    whyItBackfires:
      'Compounded interest during a 5–6 year moratorium on a ₹15–₹25 lakh loan can add ₹10–₹15 lakh to the principal. The EMI required to repay this in 10 years is substantially higher than what was budgeted when the loan was originally taken. Fresh graduates often face a sticker shock when the first EMI statement arrives.',
    betterAlternative:
      'Even if you cannot pay the full interest during the moratorium, make partial interest payments (₹2,000–₹5,000/month) from part-time income, family support, or summer internship earnings. Every rupee paid during the moratorium reduces the compounded principal you start repayment with.'
  },
  {
    type: 'contradiction' as const,
    title: 'Everyone says prioritize education loan repayment. Not everyone should.',
    mathWinner:
      'An education loan at 11% APR is expensive. Prepaying it is a guaranteed 11% return on the prepaid amount — better than FD and comparable to moderate equity returns.',
    realLifeChoice:
      'Many fresh graduates with education loans also need to build an emergency buffer, start SIP for long-term wealth, and potentially save for a down payment — all on a starting salary.',
    reason:
      'Aggressive education loan prepayment in years 1–2 of employment can leave zero emergency buffer. A single medical bill or job change in that period creates a crisis. The 11% "guaranteed return" on prepayment is real but it comes at a liquidity cost.',
    resolution:
      'Priority order for fresh graduates: emergency buffer (3 months) → minimum SIP (even ₹2,000–₹3,000) → education loan prepayment from surplus → larger prepayments once income stabilises. Do not sacrifice liquidity entirely for debt reduction speed.'
  },
  {
    type: 'cta-block' as const,
    title: 'Model your repayment timeline',
    content:
      'Use an EMI calculator to compare your current EMI schedule with what a prepayment of ₹50,000–₹1,00,000/year does to total tenure and interest. The numbers are often motivating enough to act.',
    links: [
      { label: 'India loans hub', href: '/in/loans' },
      { label: 'EMI calculator', href: '/in/calculators/emi-calculator' }
    ]
  }
];

const nextDecisions = [
  {
    title: 'Section 80E deduction',
    description: 'Education loan interest is deductible for 8 years with no upper limit. Keep annual interest payment certificates and claim this deduction even on the new tax regime (for self/family education loans this benefit was retained).',
    links: [
      { label: 'India tax hub', href: '/in/tax' },
      { label: 'Old vs new tax regime guide', href: '/in/old-vs-new-tax-regime' }
    ]
  }
];

const references = [
  { label: 'Reserve Bank of India (RBI)', href: 'https://www.rbi.org.in/', external: true },
  { label: 'Income Tax Department India', href: 'https://www.incometax.gov.in/', external: true }
];

export default function EducationLoanIndiaPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({ pathname: '/in/blog/education-loan-india', name: title, description }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: 'Education Loan India', item: '/in/blog/education-loan-india' }
      ])
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IndiaArticleRenderer
        title="Education loan India: repayment strategy, moratorium reality, and the Section 80E deduction"
        subtitle="India loans guide · FY 2025–26"
        description="The moratorium period is not free — interest accrues silently while you study. By graduation, the loan balance can be significantly higher than the original principal. This guide helps you plan payments during and after the moratorium, use Section 80E deduction, and build wealth alongside loan repayment without starving yourself of emergency reserves."
        sections={sections}
        nextDecisions={nextDecisions}
        references={references}
      />
    </>
  );
}
