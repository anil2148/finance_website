import type { Metadata } from 'next';
import { createPageMetadata, breadcrumbSchema, webpageSchema } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

const title = 'NPS India: Tax Benefits, Lock-in Reality, and Retirement Role';
const description =
  'A practical guide to India National Pension System — Section 80CCD tax benefits, annuity rules, the lock-in you need to plan around, and who should use NPS versus other retirement vehicles.';

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  pathname: '/in/blog/nps-vs-401k-equivalent',
  type: 'article'
});

const sections = [
  {
    type: 'text' as const,
    title: 'NPS is tax-efficient. It is also illiquid until 60.',
    content:
      'NPS offers one of India\'s best tax-saving structures: Section 80CCD(1) deduction within the ₹1.5 lakh 80C limit, plus an additional ₹50,000 deduction under 80CCD(1B) that no other instrument provides. But the price of that tax benefit is strict lock-in: you cannot fully withdraw before age 60. At 60, only 60% of the corpus is available as a lump sum — the remaining 40% must be used to purchase an annuity, which typically pays a lower return than what the equity component of NPS can earn. For salaried employees with a long investment horizon and stable income, NPS is genuinely useful. For younger investors with uncertain career plans or liquidity needs in their 40s and 50s, the lock-in is a real constraint to model.'
  },
  {
    type: 'table' as const,
    title: 'NPS tax benefits at a glance',
    table: {
      headers: ['Tax section', 'Limit', 'Over 80C limit?', 'Tax saving at 30% bracket', 'Suitable for'],
      rows: [
        {
          'Tax section': 'Section 80CCD(1)',
          'Limit': 'Up to 10% of salary (max ₹1.5L within 80C)',
          'Over 80C limit?': 'No — counts within ₹1.5L',
          'Tax saving at 30% bracket': '₹45,000 max (shared with 80C)',
          'Suitable for': 'Investors using old regime who want retirement focus within 80C'
        },
        {
          'Tax section': 'Section 80CCD(1B)',
          'Limit': '₹50,000 additional above 80C',
          'Over 80C limit?': 'Yes — exclusive to NPS',
          'Tax saving at 30% bracket': '₹15,000 additional',
          'Suitable for': 'Old regime investors at ₹12L+ salary who want to go beyond ₹1.5L deduction limit'
        },
        {
          'Tax section': 'Employer contribution (80CCD(2))',
          'Limit': 'Up to 10% of salary (no cap)',
          'Over 80C limit?': 'Yes — completely separate',
          'Tax saving at 30% bracket': 'Depends on employer contribution amount',
          'Suitable for': 'Employees whose employer offers NPS matching — significant free benefit'
        }
      ]
    },
    content:
      'The ₹50,000 Section 80CCD(1B) deduction is the most underutilized NPS benefit. For a ₹20 lakh salary salaried employee in the old regime, this alone saves ₹15,000/year in tax — with no equivalent in any other instrument.'
  },
  {
    type: 'decision-path' as const,
    title: 'Who should use NPS and how much',
    points: [
      {
        label: 'If you are on the old tax regime, ₹15L+ salary, and have already maxed 80C',
        text: 'NPS 80CCD(1B) — ₹50,000/year — is one of the best additional tax-saving options available. At 30% bracket, it saves ₹15,000 in tax on a ₹50,000 investment. Returns from NPS equity fund have historically been competitive. Use it as a dedicated retirement bucket separate from your 80C allocation.'
      },
      {
        label: 'If your employer offers NPS contribution matching',
        text: "Take the full employer match. It is free money with additional tax deduction under 80CCD(2) — completely outside the 80C limit. Missing employer NPS matching is equivalent to declining part of your salary."
      },
      {
        label: 'If you are under 35 with uncertain career plans',
        text: 'Consider NPS carefully. The lock-in to age 60 is absolute for the 40% annuity component. If there is any possibility you may need flexibility — career break, entrepreneurship, family obligations — keep NPS contribution limited to the 80CCD(1B) top-up and use ELSS or SIP for the rest of your retirement corpus.'
      },
      {
        label: 'If you are already on the new tax regime',
        text: 'NPS deductions do not apply under the new regime except for employer contribution under 80CCD(2). If you switched to new regime, NPS\'s tax advantage for personal contributions disappears. Evaluate whether NPS equity fund returns alone (without the deduction benefit) still justify the lock-in.'
      }
    ]
  },
  {
    type: 'decision-panel' as const,
    title: 'The annuity reality most NPS guides skip',
    tone: 'amber' as const,
    points: [
      {
        label: '40% of the corpus must go into annuity at age 60',
        text: 'You cannot take 100% of your NPS corpus as lump sum. The mandatory 40% annuity purchase locks a significant portion into a monthly pension — typically at 5%–6.5% per annum. This is lower than what the equity component of NPS could have earned if it stayed invested.'
      },
      {
        label: 'Annuity income is fully taxable',
        text: 'Unlike EPFO pension which has tax exemption limits, NPS annuity income is taxed at slab rate as income in retirement. This significantly reduces the net benefit for retirees in higher income brackets who continue to receive other income.'
      },
      {
        label: 'NPS exit before 60 triggers a higher annuity requirement',
        text: 'If you exit NPS before 60 (permitted after 10 years of subscription), 80% of the corpus must go into annuity — only 20% is available as lump sum. This is significantly more restrictive than the standard 40/60 split at age 60.'
      }
    ]
  },
  {
    type: 'mistake' as const,
    title: 'The NPS contribution mistake most salaried investors make',
    mistake:
      'Opening an NPS account in March for the 80CCD(1B) ₹50,000 deduction and contributing a lump sum at whatever equity allocation is available — without considering NPS fund selection, allocation percentages, or how the mandatory annuity component fits the retirement plan.',
    whyItBackfires:
      'A lump-sum NPS contribution in March is subject to the same market-timing risk as any other equity investment. The auto-choice lifecycle fund reduces equity allocation as you age, but many investors select aggressive allocation manually and then forget to rebalance. Additionally, treating NPS as a pure tax-saving move without retirement planning context means the annuity realization at 60 often surprises investors who expected full corpus flexibility.',
    betterAlternative:
      'Contribute monthly to NPS (₹4,200/month for ₹50,000 annual deduction). Choose the asset allocation thoughtfully — for those aged 30–40, moderate allocation (around 50% equity) through active choice is reasonable. Treat NPS explicitly as locked-until-60 retirement money and model the annuity obligation into your retirement income plan before starting.'
  },
  {
    type: 'contradiction' as const,
    title: 'NPS has the best additional tax deduction. Not everyone should prioritize it.',
    mathWinner:
      'Section 80CCD(1B) provides an exclusive ₹50,000 deduction unavailable in any other instrument. At 30% bracket, this saves ₹15,000/year in tax — effectively a 30% guaranteed return on the contribution.',
    realLifeChoice:
      'Many salaried employees at ₹15L–₹25L salary do not use the 80CCD(1B) top-up, missing the most efficient deduction available to them.',
    reason:
      'NPS accounts require setup, the lock-in feels restrictive compared to ELSS (3-year lock-in vs age-60 lock-in), and the mandatory annuity component is a real constraint many investors find unappealing. The "free" tax saving looks less free when the exit rules are fully understood.',
    resolution:
      'For stable-income, old-regime salaried employees at ₹15L+ salary: the 80CCD(1B) tax saving is hard to beat. Use ₹50,000/year in NPS specifically for this deduction and treat the corpus as locked-until-60 retirement money. For ELSS-first investors or those on the new regime, ELSS SIP and PPF provide better flexibility.'
  },
  {
    type: 'cta-block' as const,
    title: 'Evaluate NPS as part of your full tax and retirement plan',
    content:
      'NPS makes most sense when: (a) you are on the old tax regime, (b) your 80C is already maxed, and (c) you have a long horizon and stable income. Run the tax saving vs lock-in tradeoff with your specific numbers before contributing.',
    links: [
      { label: 'India tax hub', href: '/in/tax' },
      { label: 'PPF vs ELSS guide', href: '/in/blog/ppf-vs-elss' },
      { label: 'India investing hub', href: '/in/investing' }
    ]
  }
];

const nextDecisions = [
  {
    title: 'For the rest of your 80C allocation',
    description: 'Once NPS 80CCD(1B) is decided, build your ₹1.5L 80C allocation using PPF, ELSS, or EPF depending on timeline and risk appetite.',
    links: [
      { label: 'PPF vs ELSS decision guide', href: '/in/blog/ppf-vs-elss' },
      { label: '80C deductions guide', href: '/in/80c-deductions' }
    ]
  }
];

const references = [
  { label: 'Pension Fund Regulatory and Development Authority (PFRDA)', href: 'https://www.pfrda.org.in/', external: true },
  { label: 'Income Tax Department India', href: 'https://www.incometax.gov.in/', external: true }
];

export default function NpsVs401kEquivalentPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({ pathname: '/in/blog/nps-vs-401k-equivalent', name: title, description }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: 'NPS India Guide', item: '/in/blog/nps-vs-401k-equivalent' }
      ])
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IndiaArticleRenderer
        title="NPS India: tax benefits, lock-in reality, and when it makes sense for your retirement plan"
        subtitle="India investing guide · FY 2025–26"
        description="NPS has one of India's most underused additional tax deductions — ₹50,000 under Section 80CCD(1B) that goes beyond the ₹1.5 lakh 80C limit. But the lock-in to age 60 and the mandatory annuity component change the calculation for investors with flexibility needs. This guide explains who benefits most and what the real trade-offs are."
        sections={sections}
        nextDecisions={nextDecisions}
        references={references}
      />
    </>
  );
}
