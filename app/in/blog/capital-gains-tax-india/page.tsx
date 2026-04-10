import type { Metadata } from 'next';
import { createPageMetadata, breadcrumbSchema, webpageSchema } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

const title = 'Capital Gains Tax India 2026: LTCG, STCG, and Tax-Efficient Selling';
const description =
  'Understand India capital gains tax rules for equity, mutual funds, and property — holding period thresholds, LTCG and STCG rates, and how to time exits to reduce tax drag without market-timing risk.';

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  pathname: '/in/blog/capital-gains-tax-india',
  type: 'article'
});

const sections = [
  {
    type: 'text' as const,
    title: 'The holding period question most investors get wrong',
    content:
      'When you redeem a mutual fund unit or sell a stock, the tax treatment depends on how long you held that specific unit — not when you started the fund. Each SIP instalment has its own holding period. If you redeemed ₹2 lakh from an ELSS fund after 3 years but invested via monthly SIPs over 2 years, only the units older than 12 months qualify for LTCG treatment. The rest may trigger STCG. This distinction alone is worth understanding before placing any redemption order.'
  },
  {
    type: 'table' as const,
    title: 'Capital gains tax rates for Indian investors (FY 2025–26)',
    table: {
      headers: ['Asset type', 'LTCG holding period', 'LTCG rate', 'STCG rate', 'Annual exemption'],
      rows: [
        {
          'Asset type': 'Listed equity / equity mutual funds',
          'LTCG holding period': '>12 months',
          'LTCG rate': '12.5% above ₹1.25 lakh',
          'STCG rate': '20%',
          'Annual exemption': '₹1.25 lakh LTCG from equity is tax-free'
        },
        {
          'Asset type': 'Debt mutual funds (post April 2023)',
          'LTCG holding period': 'No distinction',
          'LTCG rate': 'Slab rate (income tax)',
          'STCG rate': 'Slab rate',
          'Annual exemption': 'None — indexation benefit removed'
        },
        {
          'Asset type': 'Residential property',
          'LTCG holding period': '>24 months',
          'LTCG rate': '12.5% without indexation',
          'STCG rate': 'Slab rate',
          'Annual exemption': 'Sec 54/54EC reinvestment can defer'
        },
        {
          'Asset type': 'Gold ETF / gold mutual fund',
          'LTCG holding period': '>24 months',
          'LTCG rate': '12.5%',
          'STCG rate': 'Slab rate',
          'Annual exemption': 'None'
        }
      ]
    },
    content:
      'Tax rates are subject to change each budget. Verify current rules with a CA before large redemptions. LTCG above ₹1.25 lakh from equity is subject to 12.5% — planning annual redemptions below this threshold can significantly reduce tax drag for long-term investors.'
  },
  {
    type: 'decision-path' as const,
    title: 'Tax-aware redemption decisions — when and how to sell',
    points: [
      {
        label: 'Harvesting ₹1.25 lakh LTCG each year',
        text: 'Equity LTCG up to ₹1.25 lakh/year is tax-free. Long-term investors can redeem and reinvest annually to reset cost basis and stay within the exemption. Calculate unrealised LTCG across all equity holdings before March 31 each year.'
      },
      {
        label: 'Before rebalancing a large portfolio',
        text: 'If equity is significantly above target allocation, check whether rebalancing triggers LTCG above ₹1.25 lakh. Consider spreading redemptions across two financial years to use two exemption windows.'
      },
      {
        label: 'Redeeming ELSS after the 3-year lock-in',
        text: 'Monthly ELSS SIP instalments unlock on a rolling basis — the first instalment unlocks 36 months after purchase, not 3 years from the most recent SIP. Plan ELSS redemption by checking which units have crossed 36 months individually, not just when you "started" the fund.'
      },
      {
        label: 'Before selling property',
        text: 'Post July 2024 changes, residential property LTCG is taxed at 12.5% without indexation. Reinvestment under Section 54 (new property within 2 years) or Section 54EC (bonds within 6 months) can defer the liability. Consult a CA before any property sale above ₹50 lakh.'
      }
    ]
  },
  {
    type: 'mistake' as const,
    title: 'ELSS redemption mistake: selling at exactly 3 years',
    mistake:
      'Investors redeem all ELSS units immediately when the fund "completes 3 years," assuming the full lock-in has passed.',
    whyItBackfires:
      'Monthly SIP instalments each have a separate 3-year lock-in. If you invested ₹10,000/month for 24 months, only the earliest instalments have unlocked at the 3-year mark from your first instalment. Redeeming the full fund either fails or triggers error on locked units.',
    betterAlternative:
      'Most fund platforms show "available for redemption" units separately. Redeem only unlocked units, and plan the rest to exit over subsequent months. Redeeming across two financial years also lets you use two LTCG exemption windows, reducing tax further.'
  },
  {
    type: 'contradiction' as const,
    title: 'Annual LTCG harvesting is mathematically worth it. Most investors skip it.',
    mathWinner:
      'Systematic LTCG harvesting within the ₹1.25 lakh annual exemption can save ₹15,000–₹20,000/year for investors with large equity portfolios — equivalent to reducing all-in cost by 0.1%–0.2%.',
    realLifeChoice:
      'Most long-term equity investors — including those with portfolios above ₹30–50 lakh — do not harvest LTCG annually, leaving the exemption unused year after year.',
    reason:
      'The process requires calculating unrealised LTCG across funds, placing redemption orders, and reinvesting before March 31. Most investors do not track this, or assume it is too complex.',
    resolution:
      'Set a February reminder to check unrealised LTCG. If it exceeds ₹1 lakh, consider partial redemption and reinvestment before March 31. Even doing this every 2 years has measurable net impact.'
  },
  {
    type: 'cta-block' as const,
    title: 'Before a major redemption or rebalance',
    content:
      'Check unrealised LTCG balance, identify holding periods per instalment, and consider splitting redemptions across financial years if gains are large. Tax drag is real — reducing it methodically is worth a few hours per year.',
    links: [
      { label: 'India tax hub', href: '/in/tax' },
      { label: 'India investing hub', href: '/in/investing' },
      { label: 'Old vs new regime guide', href: '/in/old-vs-new-tax-regime' }
    ]
  }
];

const nextDecisions = [
  {
    title: 'For ongoing tax planning',
    description: 'Capital gains planning is part of the broader tax picture — including regime choice, 80C optimization, and NPS.',
    links: [
      { label: 'India tax hub', href: '/in/tax' },
      { label: 'PPF vs ELSS for 80C', href: '/in/blog/ppf-vs-elss' }
    ]
  }
];

const references = [
  { label: 'Income Tax Department India', href: 'https://www.incometax.gov.in/', external: true },
  { label: 'SEBI India', href: 'https://www.sebi.gov.in/', external: true }
];

export default function CapitalGainsTaxIndiaPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({ pathname: '/in/blog/capital-gains-tax-india', name: title, description }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: 'Capital Gains Tax India', item: '/in/blog/capital-gains-tax-india' }
      ])
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IndiaArticleRenderer
        title="Capital Gains Tax India 2026: LTCG, STCG, and how to sell more tax-efficiently"
        subtitle="India tax guide · FY 2025–26"
        description="Every equity redemption, mutual fund exit, or property sale has a tax consequence that depends on holding period and gain size. This guide covers the rules, the most common mistakes, and practical strategies to reduce capital gains tax drag without disrupting your investment plan."
        sections={sections}
        nextDecisions={nextDecisions}
        references={references}
      />
    </>
  );
}
