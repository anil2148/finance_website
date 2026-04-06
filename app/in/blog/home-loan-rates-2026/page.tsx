import type { Metadata } from 'next';
import { createPageMetadata, breadcrumbSchema, webpageSchema } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

const title = 'Home Loan Interest Rates India 2026: what the bank quote does not tell you';
const description =
  'A practical India home loan rate guide — covering floating vs fixed, RLLR reset risk, bank vs HFC tradeoffs, and why stress-testing your EMI at +1% is more important than negotiating 0.1% off the rate.';

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  pathname: '/in/blog/home-loan-rates-2026',
  type: 'article'
});

const sections = [
  {
    type: 'text' as const,
    title: 'The rate you see on the brochure is not the rate you will pay',
    content:
      "Most home loan buyers compare the headline rate. They should compare the reset risk. India home loans are predominantly floating-rate loans linked to an external benchmark — RLLR (Repo Linked Lending Rate) or MCLR. When RBI raises the repo rate, your EMI or tenure extends. A borrower who took a ₹60 lakh loan at 8.5% in 2022 saw their effective rate at 9.5%–10% by 2023. The EMI increase at 9.5% on a ₹60 lakh / 20-year loan is roughly ₹3,500–₹4,500 per month — without any increase in home price or income. If that ₹3,500–₹4,500 gap was already tight in the household budget, the loan became fragile before the first monsoon."
  },
  {
    type: 'decision-path' as const,
    title: 'How to evaluate a home loan rate offer — decision checklist',
    points: [
      {
        label: 'Run the stress test before accepting any offer',
        text: "Calculate your monthly EMI at the offered rate. Then calculate it at the offered rate + 0.5% and + 1.0%. If the highest scenario leaves under ₹15,000/month of discretionary income after EMI, rent-equivalent, school fees, and emergency savings — the loan is too large regardless of what the bank approved."
      },
      {
        label: 'Floating rate: understand what resets your EMI',
        text: 'RLLR-linked loans reset with RBI repo rate changes. MCLR-linked loans reset on a defined schedule (3 months, 6 months, or 1 year). Ask your lender: which benchmark, what reset frequency, and what the spread is. The spread does not move with RBI — it is the bank margin fixed at origination.'
      },
      {
        label: 'Fixed rate: useful for budgeting, expensive for long tenures',
        text: 'Fixed rates are typically 0.75%–1.5% above the prevailing floating rate. On a 20-year loan, fixed rate reduces risk but significantly increases total interest outflow if rates stay flat or decline. Use fixed rate if budget predictability is more important than total cost optimization.'
      },
      {
        label: 'Bank vs Housing Finance Company (HFC)',
        text: 'Banks are generally better for salaried employees with clean documentation — they process faster and often have lower origination fees. HFCs may be better for self-employed borrowers with complex income proof, lower formal income declarations, or when buying under-construction property in a smaller city.'
      }
    ]
  },
  {
    type: 'table' as const,
    title: 'EMI impact of rate changes on ₹50 lakh and ₹75 lakh loans (20-year tenure)',
    table: {
      headers: ['Rate', '₹50L EMI', '₹75L EMI', 'Δ from 8.5% (₹50L)', 'Δ from 8.5% (₹75L)'],
      rows: [
        { 'Rate': '8.5%', '₹50L EMI': '₹43,391', '₹75L EMI': '₹65,087', 'Δ from 8.5% (₹50L)': '—', 'Δ from 8.5% (₹75L)': '—' },
        { 'Rate': '9.0%', '₹50L EMI': '₹44,986', '₹75L EMI': '₹67,479', 'Δ from 8.5% (₹50L)': '+₹1,595/month', 'Δ from 8.5% (₹75L)': '+₹2,392/month' },
        { 'Rate': '9.5%', '₹50L EMI': '₹46,607', '₹75L EMI': '₹69,911', 'Δ from 8.5% (₹50L)': '+₹3,216/month', 'Δ from 8.5% (₹75L)': '+₹4,824/month' },
        { 'Rate': '10.0%', '₹50L EMI': '₹48,251', '₹75L EMI': '₹72,377', 'Δ from 8.5% (₹50L)': '+₹4,860/month', 'Δ from 8.5% (₹75L)': '+₹7,290/month' }
      ]
    },
    content:
      'A 1.5% rate increase on a ₹75 lakh loan adds over ₹7,000/month to your EMI. That is not a rounding error — it is ₹84,000/year in additional outflow. Run these scenarios before signing, not after.'
  },
  {
    type: 'mistake' as const,
    title: 'The home loan mistake that most buyers do not see coming',
    mistake:
      'Evaluating affordability at the current rate without modeling what happens if rates increase 0.5%–1.0% in the first 3 years of the loan.',
    whyItBackfires:
      'Bank eligibility criteria are based on income-to-EMI ratios at the current rate. They do not automatically apply a rate-stress buffer. A buyer who qualifies at 8.5% may find the loan stressful at 9.5% — especially when school fees, car insurance, and house maintenance costs appear in years 2–4 that were not in the pre-booking mental budget.',
    betterAlternative:
      "Run EMI at current rate, +0.5%, and +1.0%. For each scenario, subtract the EMI from your stable post-tax monthly income. If the +1% scenario leaves under ₹15,000–₹20,000 for all other household spending, reduce the loan size — not the stress-test threshold."
  },
  {
    type: 'decision-panel' as const,
    title: 'Where home loan plans break in India — real scenarios',
    tone: 'amber' as const,
    points: [
      {
        label: 'Rate reset in year 2–3 after RBI tightening cycle',
        text: 'Borrowers who took loans at 2021–22 rates saw EMI increases of ₹3,000–₹8,000/month by 2023 when RBI increased the repo rate 250 basis points. Those who had stress-tested their EMI budget absorbed it. Those who had not found themselves in a cash crunch — sometimes alongside car loan EMIs and school fee hikes.'
      },
      {
        label: 'Buying at full bank-approved eligibility',
        text: 'Bank approval is not a spending recommendation — it is a credit risk limit. A bank approving a ₹80 lakh loan does not know about your parents\' health costs, school fee trajectory, or career plans. Borrow at 70–80% of bank approval to maintain buffer.'
      },
      {
        label: 'Not reading prepayment terms before signing',
        text: 'Banks differ on foreclosure charges and part-prepayment rules. Some HFCs charge 2–4% on floating loans closed within 3 years. If you plan to make bulk prepayments from bonus income, confirm the prepayment policy before choosing the lender — not after.'
      }
    ]
  },
  {
    type: 'contradiction' as const,
    title: 'Everyone compares rates. Few compare reset risk.',
    mathWinner:
      'A 0.25% lower rate on a ₹60 lakh loan saves roughly ₹850/month. Over 20 years, that is ₹2 lakh in interest savings. Worth negotiating.',
    realLifeChoice:
      'Many borrowers spend weeks comparing rates across 5 lenders to save 0.1%–0.25% — then sign a loan with an aggressive MCLR reset clause or a HFC that has historically passed on repo rate increases faster than decreases.',
    reason:
      'The headline rate comparison is visible and quantifiable. Reset behavior, spread history, and prepayment policies are disclosed in the loan agreement — which most buyers read after signing. The 0.25% savings can be erased in one asymmetric reset cycle.',
    resolution:
      'Negotiate rate, but also ask: what benchmark links this loan, what is the reset frequency, and what has the effective rate been for similar borrowers in the past 3 years? The lender\'s reset history is a better predictor of total cost than the day-1 rate.'
  },
  {
    type: 'cta-block' as const,
    title: 'Test your EMI before booking',
    content:
      'Use the India EMI calculator to run your loan amount at the current quoted rate, at +0.5%, and at +1.0%. If the +1% scenario still leaves comfortable monthly breathing room — the loan is sized right. If it does not — reduce the purchase price, increase the down payment, or wait.',
    links: [
      { label: 'Run EMI stress test', href: '/in/calculators/emi-calculator' },
      { label: 'Home affordability check', href: '/in/home-affordability-india' },
      { label: 'India home loan rates comparison', href: '/in/home-loan-interest-rates-india' }
    ]
  }
];

const nextDecisions = [
  {
    title: 'Check live India home loan rate ranges',
    description:
      'Current RLLR-linked home loan rates from major lenders — along with spread, reset frequency, and effective rate context.',
    links: [{ label: 'Home loan interest rates India 2026', href: '/in/home-loan-interest-rates-india' }]
  },
  {
    title: 'Run affordability with your actual numbers',
    description:
      'EMI calculator with India loan parameters — calculate at the offered rate and stress-test at +0.5% and +1.0% before committing.',
    links: [
      { label: 'EMI calculator India', href: '/in/calculators/emi-calculator' },
      { label: 'India loans hub', href: '/in/loans' }
    ]
  }
];

const references = [
  { label: 'Reserve Bank of India (RBI)', href: 'https://www.rbi.org.in/', external: true },
  { label: 'National Housing Bank (NHB)', href: 'https://nhb.org.in/', external: true }
];

export default function HomeLoanRates2026Page() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({ pathname: '/in/blog/home-loan-rates-2026', name: title, description }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: 'Home Loan Rates 2026', item: '/in/blog/home-loan-rates-2026' }
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the current home loan interest rate in India in 2026?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Floating home loan rates in India are linked to RBI repo rate via RLLR or MCLR. Effective rates for salaried borrowers typically range from 8.35% to 9.25% depending on lender, LTV, credit profile, and benchmark. Verify current rates directly with lenders as rates change with repo rate decisions.'
            }
          },
          {
            '@type': 'Question',
            name: 'Should I choose a fixed or floating home loan rate?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Floating rates are cheaper upfront but expose you to EMI increases when repo rates rise. Fixed rates provide budget predictability but cost more. The choice depends on how much rate risk you can absorb — always stress-test your EMI at current rate + 1% before deciding.'
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
        title="Home Loan Interest Rates India 2026: rate comparison, reset risk, and EMI stress-testing"
        subtitle="India loans guide · FY 2025–26"
        description="Most home buyers compare rates and stop there. This guide covers the full picture: floating vs fixed, RLLR reset risk, how rate increases translate to real monthly budget impact, and why the stress test at +1% matters more than negotiating 0.1% off the headline rate."
        sections={sections}
        nextDecisions={nextDecisions}
        references={references}
      />
    </>
  );
}
