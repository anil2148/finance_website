import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

const title = 'SIP vs FD in India: which one fits your goal, timeline, and real-life budget?';
const description =
  'India SIP vs FD guide with monthly investment scenarios, timeline-based decision logic, failure scenarios, and salary-pressure reality checks.';

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  pathname: '/in/blog/sip-vs-fd',
  type: 'article'
});

const sections = [
  {
    type: 'text' as const,
    title: 'The question most guides answer wrong',
    content:
      'Most SIP vs FD guides start by showing you a table of returns. This one starts differently. The real question is not which instrument produces a higher number on paper — it is which one you will actually stick to when your salary is delayed, your EMI has just gone up, or a family emergency arrives. A ₹5,000 SIP you sustain for 10 years beats a ₹15,000 SIP you stop after 18 months. Most people choose the ambitious number because it looks better on a projection chart, and then abandon it the first time real life applies pressure. Choose the number that survives your worst recent month — not your best.'
  },
  {
    type: 'decision-path' as const,
    title: 'If you are in this situation — here is what to do',
    points: [
      {
        label: 'If you need the money in 2–3 years for a fixed goal (down payment, wedding, higher education)',
        text: 'Use FD or recurring deposit. Do not expose fixed-timeline money to equity volatility. A 20% market drawdown 6 months before your goal pushes the date back — there is no recovery window.'
      },
      {
        label: 'If your salary has not yet stabilized or you are on variable pay',
        text: 'Start with FD until you have 6 months of expenses saved. Then begin a small SIP you can maintain even in a low-income month. Starting SIP at ₹2,000/month and sustaining it is far better than starting at ₹8,000 and stopping it twice a year.'
      },
      {
        label: 'If you are supporting parents or have a single income household',
        text: 'Keep a larger portion in FD for near-term security. SIP only with the surplus that can genuinely be locked away for 7+ years without touching. Family obligations are real and unpredictable — do not ignore that when projecting returns.'
      },
      {
        label: 'If your goal is 10+ years away (retirement, child education, long-term wealth)',
        text: 'SIP makes sense here. Set up automatic monthly deductions, use step-up SIPs when income increases, and have a rule before you start: you will not pause the SIP for market corrections. Write it down.'
      },
      {
        label: 'If you have an EMI running alongside',
        text: 'Calculate your actual disposable income after EMI. SIP amount must come from what is left — not from reducing your FD emergency fund. Running SIP alongside a high EMI with no buffer is a liquidity trap.'
      }
    ]
  },
  {
    type: 'decision-panel' as const,
    title: 'Where these strategies fail — real India scenarios',
    tone: 'amber' as const,
    points: [
      {
        label: 'SIP for a 2–3 year down payment goal',
        text: 'A 20–25% market drawdown can push a fixed purchase timeline back by 12–24 months. Down payment money should not carry market risk. If the home booking is in 2026, keep that corpus in FD from today — regardless of what the market is doing.'
      },
      {
        label: 'FD for a 20-year retirement goal',
        text: 'At 6.8% vs 11% over 20 years on ₹10,000/month, the FD path produces roughly ₹25 lakh less. That is not a rounding error. If you are 35 and starting retirement savings in FD only, you are likely underbuilding long-term wealth significantly.'
      },
      {
        label: 'Starting SIP without emergency money first',
        text: 'If your SIP gets broken because a cashflow emergency arrives — medical, job loss, family — you lose both compounding momentum and often confidence. The break becomes a habit. Rebuild the buffer first, then start the SIP. Not both at once.'
      },
      {
        label: 'Stopping SIP when the market falls',
        text: 'This is the most expensive mistake in SIP investing. Stopping in March 2020 meant missing the recovery months when SIP units were being bought cheapest. The plan only works if you treat it like a fixed expense — not an optional one that you pause when things feel uncertain.'
      }
    ]
  },
  {
    type: 'table' as const,
    title: 'The numbers: ₹5,000 vs ₹10,000 vs ₹25,000/month over 10 years',
    table: {
      headers: ['Monthly amount', 'If SIP averages 11%', 'If FD averages 6.8%', 'Gap after 10 years'],
      rows: [
        { 'Monthly amount': '₹5,000', 'If SIP averages 11%': '~₹10.3 lakh', 'If FD averages 6.8%': '~₹8.4 lakh', 'Gap after 10 years': '~₹1.9 lakh more via SIP — assuming you stay invested through 1–2 bad years' },
        { 'Monthly amount': '₹10,000', 'If SIP averages 11%': '~₹20.6 lakh', 'If FD averages 6.8%': '~₹16.8 lakh', 'Gap after 10 years': '~₹3.8 lakh more via SIP — narrowed significantly if you pause SIP during market corrections' },
        { 'Monthly amount': '₹25,000', 'If SIP averages 11%': '~₹51.4 lakh', 'If FD averages 6.8%': '~₹42.0 lakh', 'Gap after 10 years': '~₹9.4 lakh more via SIP — but this requires 120 months of uninterrupted discipline' }
      ]
    }
  },
  {
    type: 'table' as const,
    title: 'Goal timeline: which instrument fits which horizon?',
    table: {
      headers: ['Horizon', '₹10,000/month SIP @11%', '₹10,000/month FD @6.8%', 'What actually drives the decision'],
      rows: [
        {
          Horizon: 'Under 3 years',
          '₹10,000/month SIP @11%': '~₹4.2 lakh',
          '₹10,000/month FD @6.8%': '~₹3.9 lakh',
          'What actually drives the decision': 'Almost no gap in outcome — but a 20% drawdown in year 2 can push a fixed goal back by 12+ months. Use FD here.'
        },
        {
          Horizon: '5 years or less',
          '₹10,000/month SIP @11%': '~₹8.3 lakh',
          '₹10,000/month FD @6.8%': '~₹7.1 lakh',
          'What actually drives the decision': 'A 20–25% drawdown in year 3–4 can delay a fixed goal by 1–2 years. Certainty usually wins when the goal is specific.'
        },
        {
          Horizon: '7–10 years',
          '₹10,000/month SIP @11%': '~₹20.6 lakh',
          '₹10,000/month FD @6.8%': '~₹16.8 lakh',
          'What actually drives the decision': 'The gap is meaningful. Behavioral discipline — staying invested in down years — becomes the key variable, not the instrument itself.'
        },
        {
          Horizon: '15–20 years',
          '₹10,000/month SIP @11%': '~₹75.9 lakh',
          '₹10,000/month FD @6.8%': '~₹50.0 lakh',
          'What actually drives the decision': 'Long compounding strongly favors SIP. The question is whether you stay invested through 2–3 full market cycles over 15–20 years.'
        }
      ]
    },
    content:
      'Rule of thumb: if you would panic-exit the SIP during a 30% market correction, the FD is the safer real-world choice for that bucket of money — even if the theoretical SIP return is higher. A plan abandoned at the worst moment costs more than a lower-return plan you keep running.'
  },
  {
    type: 'text' as const,
    title: 'Why variable income changes everything',
    content:
      'Most SIP vs FD comparisons are written for people with stable salaries, no EMIs, and no family obligations. That is a small percentage of Indian households. If your salary comes with variable components — bonus, commission, or irregular payments — your monthly cashflow looks very different from a projection spreadsheet. The right strategy is the one that works in your worst month, not your best. People stop investing after losses or income shocks — that is where plans actually fail, not in the math. Size your SIP around a month when things were genuinely tight, not a month when everything aligned.'
  },
  {
    type: 'mistake' as const,
    title: 'The most common SIP vs FD mistake',
    mistake:
      'Using SIP for a fixed-timeline goal (home down payment in 2–3 years, education fees, wedding) because the projected return looks better than FD.',
    whyItBackfires:
      'A 20–25% market drawdown 6–12 months before your goal date means you either delay the goal or sell at a loss. Unlike FD, equity SIP has no guaranteed floor. The return advantage of SIP is real over 10+ years but meaningless — or actively harmful — when the goal date is fixed and near.',
    betterAlternative:
      'Keep fixed-timeline money in FD, recurring deposits, or debt funds regardless of what the projected SIP return chart shows. Use SIP only for goals where the timeline is flexible enough to absorb a 2-year market recovery period. Near-term certainty is worth the 2–4% yield difference.'
  },
  {
    type: 'contradiction' as const,
    title: 'SIP wins long-term. Many investors do not capture that win.',
    mathWinner:
      'Over 10 years at ₹10,000/month, a SIP at 11% builds roughly ₹20.6 lakh versus ₹16.8 lakh in FD at 6.8% — about ₹3.8 lakh more. Over 20 years the gap is much larger. The math clearly favors SIP for long horizons.',
    realLifeChoice:
      'Many investors who started SIPs in 2019–2020 paused during the March 2020 crash. Many paused again in 2022. Each pause compressed the actual return achieved versus the theoretical return. The average equity investor\'s return often significantly underperforms the fund\'s own published returns because of behaviorally-timed entry and exit.',
    reason:
      "SIP's compounding advantage depends on uninterrupted investment through market cycles. Most people maintain discipline during flat or rising markets and break it during corrections — which is exactly when staying invested matters most. The gap between theoretical SIP return and actual investor return is sometimes called the 'behavior gap.'",
    resolution:
      'If you would pause a SIP during a 25% market fall, the FD is the right real-world choice for that money — even if the projection chart says otherwise. Choose SIP only for the money you can genuinely commit to not touching for 7+ years, including during your next period of financial stress.'
  },
  {
    type: 'decision-panel' as const,
    title: 'Blended allocation: what most households actually need',
    tone: 'emerald' as const,
    points: [
      {
        label: 'Emergency bucket (3–6 months expenses)',
        text: 'FD or liquid fund only. This money should not be in market instruments. Keep it boring and accessible. Do not let it earn 11% if it means you cannot reach it in 48 hours when something breaks.'
      },
      {
        label: 'Near-term goals (under 3 years)',
        text: 'FD, recurring deposit, or debt fund. Do not expose fixed-timeline money to equity volatility. The extra 3–4% return from SIP is not worth pushing your goal date back by a year.'
      },
      {
        label: 'Long-term wealth (7+ years)',
        text: 'SIP into diversified equity mutual funds. Start small, build consistency, step up annually. Do not panic-exit during corrections — that is when the plan does most of its work.'
      },
      {
        label: 'Split allocation for 4–6 year goals',
        text: 'Keep 40–50% in FD for downside protection, put the rest in a balanced advantage or hybrid fund. This reduces regret in either market scenario and keeps the goal achievable even if markets are flat.'
      }
    ]
  },
  {
    type: 'cta-block' as const,
    title: 'If you are saving for a home purchase in the next 2–4 years',
    content:
      "Keep the down payment in safety-first buckets. Then run EMI scenarios at today's rate, +0.5%, and +1.0% to make sure the monthly budget still works if rates rise. Many families locked a home loan they could comfortably afford on paper — and found it tight once school fees, maintenance, and a rate reset arrived together.",
    links: [
      { label: 'Run the India EMI stress test', href: '/in/calculators/emi-calculator' },
      { label: 'Check home affordability before booking', href: '/in/home-affordability-india' }
    ]
  }
];

const nextDecisions = [
  {
    title: 'For long-term wealth building',
    description: 'If your SIP horizon is 10+ years, learn how to set up automation, step up contributions annually, and stay invested through volatility without panic-exiting.',
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
    description: 'Keep tax decisions separate from SIP/FD allocation. Tax pressure in March should not drive your long-term investing structure — they are different decisions.',
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
      title="SIP vs FD in India: which fits your goal, timeline, and actual salary?"
      subtitle="India investing decision guide · FY 2025–26"
      description="Most Indian families are not choosing between 'safe' and 'smart' investing. They are balancing school fees, home down-payment timelines, emergency reserves, family obligations, and long-term wealth goals within the same monthly salary. SIP vs FD cannot be answered without knowing your goal timeline, your real disposable income after EMI, your comfort with market drops, and whether your emergency money is already protected separately."
      sections={sections}
      nextDecisions={nextDecisions}
      references={references}
    />
  );
}
