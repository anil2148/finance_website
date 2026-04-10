import type { Metadata } from 'next';
import { breadcrumbSchema, createPageMetadata, webpageSchema } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

export const metadata: Metadata = createPageMetadata({
  title: 'PPF vs ELSS: India Tax-Saving Decision Guide for 2026',
  description:
    'Compare PPF and ELSS using lock-in reality, family cashflow needs, and practical ₹ allocation examples for Section 80C planning.',
  pathname: '/in/blog/ppf-vs-elss',
  type: 'article'
});

const sections = [
  {
    type: 'decision-path' as const,
    title: 'Who should choose what — decide before reading further',
    points: [
      {
        label: 'If your horizon is under 5 years',
        text: 'Do not use ELSS for this bucket. Market timing risk near your goal date is real. Use PPF or FD for near-term tax-saving amounts, and keep ELSS only for goals 7+ years away.'
      },
      {
        label: 'If your income is unstable (freelancer, business, commission)',
        text: 'PPF is safer. ELSS requires staying invested through bad income months without stopping SIPs. Stopping and restarting ELSS midway loses consistency and return-averaging benefits.'
      },
      {
        label: 'If you are 45+ and less than 10 years from retirement',
        text: 'Gradually shift ELSS allocation to PPF or debt instruments. You have less time to recover from a major market correction before you need the money.'
      },
      {
        label: 'If you are 30–40 with a stable salary and 15+ year horizon',
        text: 'ELSS as your primary 80C vehicle likely makes sense. The growth differential over 15+ years is significant, and you have time to ride out volatility cycles.'
      },
      {
        label: 'If family obligations limit your flexibility (EMI + school fees + parents)',
        text: 'Split your 80C: use PPF for 40–50% as your safe anchor, and ELSS for the rest. Do not put all 80C into ELSS if stopping it during a bad quarter would feel stressful.'
      }
    ]
  },
  {
    type: 'table' as const,
    title: 'PPF vs ELSS at a glance',
    table: {
      headers: ['Factor', 'PPF', 'ELSS'],
      rows: [
        { Factor: 'Lock-in', PPF: '15 years (partial withdrawal rules apply after year 7)', ELSS: '3 years per investment instalment' },
        {
          Factor: 'Return profile',
          PPF: 'Government-backed, quarterly revised — currently 7.1%. Stable but trails inflation in high-growth years.',
          ELSS: 'Equity-linked. Long-run average near 11–12%, but individual years can be -20% to +40%.'
        },
        { Factor: 'Liquidity after lock-in', PPF: 'Partial withdrawals allowed from year 7 onward, subject to rules. No premature full exit.', ELSS: 'Can redeem 3 years after each SIP instalment. Not all instalments unlock simultaneously.' },
        { Factor: 'Tax at maturity', PPF: 'Fully exempt — EEE status (invest, grow, and withdraw all tax-free)', ELSS: 'LTCG above ₹1 lakh taxed at 10%. Still tax-efficient, but not fully exempt.' },
        { Factor: 'Typical role', PPF: 'Safe, slow wealth-building for conservative risk appetite or near-retirement years', ELSS: 'Higher-growth option for long horizons (10+ years) where short-term volatility is acceptable' }
      ]
    }
  },
  {
    type: 'table' as const,
    title: 'Outcome comparison: ₹1.5 lakh invested per year',
    table: {
      headers: ['Horizon', 'PPF at 7.1%', 'ELSS at 11% (illustrative)', 'Gap'],
      rows: [
        { Horizon: '5 years', 'PPF at 7.1%': '~₹8.8 lakh', 'ELSS at 11% (illustrative)': '~₹10.2 lakh', Gap: '~₹1.4 lakh more via ELSS — but ELSS can also be ₹8.0 lakh in a bad market year' },
        { Horizon: '10 years', 'PPF at 7.1%': '~₹22.0 lakh', 'ELSS at 11% (illustrative)': '~₹30.5 lakh', Gap: '~₹8.5 lakh more via ELSS — gap is real, but requires staying invested through 1–2 market cycles' },
        { Horizon: '20 years', 'PPF at 7.1%': '~₹65.4 lakh', 'ELSS at 11% (illustrative)': '~₹1.24 crore', Gap: '~₹58.6 lakh — this is where compounding and equity premium diverge dramatically' }
      ]
    },
    content:
      'The numbers favor ELSS for long horizons. But the 11% ELSS return is an average — actual returns vary widely year to year. The real question is not which performs better on paper. It is whether you will stay invested through a 25–30% drawdown without exiting. Most people say yes before the drawdown, and no during it.'
  },
  {
    type: 'decision-panel' as const,
    title: 'Where each strategy breaks in real life',
    tone: 'amber' as const,
    points: [
      {
        label: 'PPF breaks when inflation runs ahead of 7.1%',
        text: "PPF has historically returned below India's long-run equity returns. Over 20 years, your real (inflation-adjusted) wealth in PPF may grow more slowly than expected, especially during high-inflation periods. Parking all 80C in PPF for a 25-year goal is a common mistake among risk-averse investors who later feel they saved well but stayed poor."
      },
      {
        label: 'ELSS breaks when you exit at the wrong time',
        text: 'The 3-year lock-in creates a false sense of timing control. If your ELSS is deep in loss when the lock-in ends, many investors exit anyway — either out of frustration or because a family expense has come up. Premature exit during a correction turns a paper loss into a real one. The strategy only works if you genuinely commit to 7–10 years.'
      },
      {
        label: 'The March rush breaks both strategies',
        text: 'Most salaried Indians invest for 80C in January–March under pressure. This creates lump-sum investments at whatever price the market happens to be, instead of rupee-cost averaging via monthly SIPs throughout the year. The outcome is emotionally driven, poorly timed, and often over-concentrated.'
      },
      {
        label: 'Stopping ELSS SIPs during a market correction is the most common failure',
        text: 'When the market is down 20–25%, instinct says to stop. This is exactly when ELSS SIPs are buying more units at lower prices. People who stopped in 2020 and 2022 corrections locked in a lower corpus and missed the recovery. The plan only works if you do not touch it when it feels uncomfortable — which is when it is working hardest.'
      }
    ]
  },
  {
    type: 'text' as const,
    title: 'The behavioral reality most guides skip',
    content:
      'Most people overestimate their risk tolerance when the market is rising and underestimate it when it falls. If you have never stayed invested through a 25% drawdown, you cannot confidently say you will handle it next time. This is not a character flaw — it is how most humans respond to financial loss. Design your allocation around this reality, not around your optimistic version of yourself. A smaller ELSS allocation you actually hold is worth more than a larger one you panic-exit.'
  },
  {
    type: 'mistake' as const,
    title: 'The most common PPF vs ELSS mistake',
    mistake:
      'Investing the full ₹1.5 lakh 80C in ELSS as a lump sum in February or March because "ELSS gives better long-term returns than PPF."',
    whyItBackfires:
      'A lump-sum ELSS in February or March is timed by the tax deadline, not by market conditions. If markets are elevated at year-end (as they often are after a good year), you buy at peak prices. Missing monthly SIP rupee-cost averaging across 12 months can cost a meaningful amount of return over a decade. Additionally, lump-sum investing at market highs followed by a 20–30% correction makes ELSS feel like a bad choice — which leads to stopping the investment entirely.',
    betterAlternative:
      'Set up ELSS SIPs from April at ₹12,500/month. This spreads risk across the year, avoids March panic, and builds the habit of consistent investment rather than annual deadline-driven lump sums. PPF can absorb any remaining 80C limit if SIP consistency is uncertain.'
  },
  {
    type: 'contradiction' as const,
    title: 'ELSS wins over 20 years. Many investors end up with less.',
    mathWinner:
      'Over 20 years at illustrative rates, ELSS at 11% builds roughly ₹1.24 crore against PPF at 7.1% building ₹65 lakh — a gap of nearly ₹59 lakh on the same ₹1.5 lakh/year contribution.',
    realLifeChoice:
      'Many investors who started ELSS allocations in 2019–2020 exited during the March 2020 correction and did not reinvest. Many more paused ELSS SIPs in 2022 when valuations fell. The paper advantage only materializes if you hold through 2–3 full market cycles without exiting.',
    reason:
      "Equity market drawdowns test the investor's conviction more severely than any projection chart can convey. A 25% paper loss on an ELSS fund feels very different from a 25% paper loss on a PPF — because PPF never shows you a loss. The behavioral gap between ELSS's theoretical return and many investors' actual return is often 2–4% per year.",
    resolution:
      'Choose ELSS only for the portion of 80C you are genuinely prepared to leave untouched through a 30% correction. PPF is not the inferior choice for investors who know they will exit ELSS at the wrong time. A smaller ELSS allocation that stays invested beats a larger one abandoned during a downturn.'
  },
  {
    type: 'decision-panel' as const,
    title: 'A practical 80C split by income and risk profile',
    tone: 'emerald' as const,
    points: [
      {
        label: 'Conservative saver (family obligations, unstable income, or under 5-year horizon)',
        text: 'PPF: 70–80% of 80C. ELSS: 20–30% for long-term growth exposure. If any of the 80C money might be needed within 5 years, keep it all in PPF.'
      },
      {
        label: 'Moderate risk, stable salary, 5–15 year horizon',
        text: 'PPF: 40–50% as your guaranteed core. ELSS: 50–60% for compounding via monthly SIPs throughout the year (not lump sum in March). Do not break the SIP for market drops.'
      },
      {
        label: 'Longer horizon, high risk tolerance, 20+ years to goal',
        text: 'ELSS can form 70–80% of your 80C. PPF still makes sense for a stability anchor. But only allocate what you will genuinely not touch for the full duration. Paper discipline is easy; real discipline is tested in a 30% correction.'
      },
      {
        label: 'If you are already overweight PPF from previous years',
        text: 'Do not feel forced to rebalance quickly. Gradually shift new contributions toward ELSS while keeping existing PPF intact. Sudden reallocation creates more disruption than benefit.'
      }
    ]
  },
  {
    type: 'cta-block' as const,
    title: 'Build a tax plan that survives real cashflow — not just spreadsheet math',
    content:
      'The right 80C mix is not the one with the highest theoretical return. It is the one you will stick to in February when the market is down 18% and your car needs a repair. Set up SIPs in January, not March. Test your contribution amount against a bad income month. And keep near-term money in safety-first buckets regardless of tax benefit.',
    links: [
      { label: 'India tax planning hub', href: '/in/tax' },
      { label: 'Compare old vs new tax regime', href: '/in/old-vs-new-tax-regime' },
      { label: 'Run SIP projection scenarios', href: '/in/calculators/sip-calculator' },
      { label: '80C deductions complete guide', href: '/in/80c-deductions' }
    ]
  }
];

const nextDecisions = [
  {
    title: 'Finalize your 80C structure',
    description: 'Once you know your PPF vs ELSS split, check which regime benefits you more, and whether PF, insurance, or home loan principal already covers some 80C automatically.',
    links: [
      { label: 'India tax hub', href: '/in/tax' },
      { label: '80C deductions guide', href: '/in/80c-deductions' }
    ]
  },
  {
    title: 'Set up a SIP that works through bad months',
    description: 'ELSS SIPs are only effective if you do not break them during corrections. Use a SIP calculator to find a monthly amount that feels manageable even in a lean salary month.',
    links: [
      { label: 'India investing hub', href: '/in/investing' },
      { label: 'SIP vs FD: goal-based choice', href: '/in/blog/sip-vs-fd' }
    ]
  },
  {
    title: 'Keep near-term savings separate',
    description: 'Tax-saving money and short-term goal money should live in different buckets. Mixing them creates pressure to break long-term investments when expenses arrive.',
    links: [
      { label: 'India banking hub', href: '/in/banking' },
      { label: 'Best savings accounts India', href: '/in/best-savings-accounts-india' }
    ]
  }
];

const references = [
  { label: 'Reserve Bank of India (RBI)', href: 'https://www.rbi.org.in/', external: true },
  { label: 'Income Tax Department (India)', href: 'https://www.incometax.gov.in/', external: true }
];

export default function PpfVsElssIndiaPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({
        pathname: '/in/blog/ppf-vs-elss',
        name: 'PPF vs ELSS: India Tax-Saving Decision Guide for 2026',
        description:
          'Compare PPF and ELSS using lock-in reality, family cashflow needs, and practical ₹ allocation examples for Section 80C planning.'
      }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: 'PPF vs ELSS', item: '/in/blog/ppf-vs-elss' }
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Should I choose PPF or ELSS for Section 80C?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It depends on your timeline and risk tolerance. For goals under 7 years or unstable income, PPF is safer. For goals 10+ years away with stable income, ELSS typically produces higher long-run returns but requires staying invested through market corrections.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can I invest in both PPF and ELSS?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, and for most households a split allocation makes sense. PPF provides a guaranteed, tax-free anchor. ELSS provides equity growth potential. The right ratio depends on your income stability, age, and how close you are to needing the money.'
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
        title="PPF vs ELSS: who should choose what — and where each breaks under real pressure"
        subtitle="India tax-saving guide · FY 2025–26"
        description="Every January, the 80C pressure arrives. Most salaried Indians try to finish it fast — sometimes with the wrong instrument for their actual situation. The honest answer to PPF vs ELSS is not about which one produces higher returns on paper. It is about your age, your income stability, and whether you will genuinely stay invested when the market falls 25% and a large unexpected expense arrives in the same month."
        sections={sections}
        nextDecisions={nextDecisions}
        references={references}
      />
    </>
  );
}
