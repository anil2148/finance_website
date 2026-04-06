import type { Metadata } from 'next';
import { createPageMetadata, breadcrumbSchema, webpageSchema } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

const title = 'SIP for Beginners: Start with ₹5,000/month and Build From There';
const description =
  'A practical India SIP guide for first-time investors — how much to start with, which fund type to use, how to stay invested when markets fall, and what common early mistakes cost you in the long run.';

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  pathname: '/in/blog/sip-for-beginners',
  type: 'article'
});

const sections = [
  {
    type: 'text' as const,
    title: 'The most expensive SIP mistake is starting too large',
    content:
      "Most first-time SIP guides tell you to start as high as possible. That advice ignores real life. A ₹10,000 SIP you pause after 6 months builds far less long-term wealth than a ₹3,000 SIP you run uninterrupted for 10 years. The reason most people pause their SIP is not market crashes — it is a salary delay, a medical bill, or a sudden large expense that makes the SIP feel like pressure instead of a habit. The number you start with should survive your worst recent month without forcing a choice between the SIP and a real expense."
  },
  {
    type: 'decision-path' as const,
    title: 'Where to start based on your salary and cashflow',
    points: [
      {
        label: '₹25,000–₹40,000 monthly take-home (new job, first SIP)',
        text: 'Start with ₹2,000–₹3,000/month in a single large-cap index fund. Build the habit and the emergency buffer simultaneously. Do not step up until you have ₹60,000–₹80,000 liquid in a savings account or FD.'
      },
      {
        label: '₹40,000–₹60,000 take-home, some expenses stable',
        text: 'Start ₹5,000/month in a flexi-cap or large-cap index fund. This is enough to build meaningful compounding over 10 years without creating liquidity stress. Add ₹500–₹1,000 step-up each April after salary increment.'
      },
      {
        label: '₹60,000–₹1,00,000 take-home, EMI running alongside',
        text: 'Run EMI + SIP as two separate fixed expenses. SIP amount should come from disposable income after EMI, rent, and essential costs. Do not use the emergency buffer as a SIP source. ₹8,000–₹12,000/month is achievable and sustainable at this range if EMI is under ₹25,000.'
      },
      {
        label: '₹1,00,000+ take-home, building serious long-term wealth',
        text: "Separate your 80C bucket (ELSS SIP) from your wealth-building bucket (index + flexi-cap). Use step-up SIPs every April. At this level, asset allocation across large-cap, flexi-cap, and mid-cap starts making sense — but don't add categories until you've held your first SIP for at least 12 months without breaking it."
      }
    ]
  },
  {
    type: 'table' as const,
    title: '₹3,000 vs ₹5,000 vs ₹10,000/month: what consistency builds over time',
    table: {
      headers: ['Monthly SIP', '5 years @12%', '10 years @12%', '15 years @12%', 'Real constraint'],
      rows: [
        {
          'Monthly SIP': '₹3,000',
          '5 years @12%': '~₹2.5 lakh',
          '10 years @12%': '~₹6.9 lakh',
          '15 years @12%': '~₹15.1 lakh',
          'Real constraint': 'Start here if cashflow is tight. The compounding is still real — and consistency is the main variable.'
        },
        {
          'Monthly SIP': '₹5,000',
          '5 years @12%': '~₹4.1 lakh',
          '10 years @12%': '~₹11.6 lakh',
          '15 years @12%': '~₹25.2 lakh',
          'Real constraint': 'Sweet spot for ₹35K–₹55K salary bands. Most households can sustain this through bad months.'
        },
        {
          'Monthly SIP': '₹10,000',
          '5 years @12%': '~₹8.2 lakh',
          '10 years @12%': '~₹23.2 lakh',
          '15 years @12%': '~₹50.4 lakh',
          'Real constraint': 'Achievable at ₹60K+ take-home with no large EMI. If paused twice a year, returns shrink significantly.'
        }
      ]
    },
    content:
      'Projections assume 12% annualised return — actual equity returns vary. The key variable in this table is not the return rate. It is how many months you actually invest. Breaking a SIP in year 2 and restarting in year 3 is not the same as running it 120 months straight.'
  },
  {
    type: 'mistake' as const,
    title: 'The most common first-SIP mistake',
    mistake: 'Starting with too many funds — a large-cap, a mid-cap, a sectoral fund, and an ELSS simultaneously because each "looked good" on a comparison website.',
    whyItBackfires: 'Multiple SIPs in different funds create complexity without diversification. Large-cap and flexi-cap index funds already cover most market exposure. Adding sectoral funds early adds category risk. The mental load of tracking 5 funds makes it easier to pause or exit during a correction.',
    betterAlternative: 'Start with a single large-cap index fund or flexi-cap fund for your first 12 months. Add a second fund only after you have stayed invested through at least one market correction without panic.'
  },
  {
    type: 'decision-panel' as const,
    title: 'Where SIP plans break — and how to avoid it',
    tone: 'amber' as const,
    points: [
      {
        label: 'Stopping when the market falls',
        text: "This is the most expensive SIP mistake. When the market drops 15–25%, SIP units are bought at lower prices. Stopping at this exact moment locks in the behavior loss and misses the recovery months. The plan only works if you treat the SIP like a rent payment — not optional when things feel uncertain."
      },
      {
        label: 'Starting SIP before building emergency reserves',
        text: 'A SIP that gets broken because a medical bill or car repair arrived is not a SIP problem — it is a sequencing problem. Build ₹50,000–₹1,00,000 liquid before your first SIP instalment. This buffer is what protects the SIP during stress.'
      },
      {
        label: 'Mixing the 80C tax-saving SIP with the wealth-building SIP',
        text: 'ELSS is locked for 3 years per instalment. If your only SIP is ELSS and you need the money in 2 years, you cannot exit. Keep tax-saving investments and wealth-building investments in separate buckets from day one.'
      },
      {
        label: 'Choosing funds based on last-year performance',
        text: 'The best-performing fund category of the past 2 years is often the most volatile going forward. Small-cap and sectoral funds that topped returns charts in 2022–24 can lose 35–45% in a correction year. For beginners, large-cap index funds are the right starting point because they lower the behavioral risk of exit.'
      }
    ]
  },
  {
    type: 'contradiction' as const,
    title: 'The math says more. Real life says otherwise.',
    mathWinner:
      'A ₹10,000/month SIP over 15 years at 12% produces roughly ₹50 lakh. A ₹5,000/month SIP produces ₹25 lakh. The math clearly favors starting higher.',
    realLifeChoice:
      'Many first-time investors who start at ₹10,000/month pause or stop within 2 years when a large expense arrives. Many who start at ₹3,000–₹5,000 sustain it for 10+ years.',
    reason:
      'The higher number feels right when income is stable, but most households underestimate how often large one-off expenses appear. Each pause resets the compounding clock for that period.',
    resolution:
      'Start lower than you think is ambitious. Sustain it through two market corrections. Then step up by ₹1,000/month each April. Ten years of this beats three years of maximum contribution followed by a stop.'
  },
  {
    type: 'decision-panel' as const,
    title: 'SIP fund choice for beginners: keep it simple',
    tone: 'emerald' as const,
    points: [
      {
        label: 'Year 1–2: Single large-cap index fund',
        text: 'Lowest cost, broad diversification, least volatile within equity. Nifty 50 or Sensex index funds from major AMCs have expense ratios under 0.15%. Start here. Complexity later.'
      },
      {
        label: 'Year 2–4: Add a flexi-cap fund',
        text: 'Once you have held through one market correction without panic, add a diversified flexi-cap fund for a second monthly SIP. This gives exposure across large and mid-cap without you having to manage it.'
      },
      {
        label: 'Only after 4+ years: Consider mid-cap',
        text: 'Mid-cap funds add return potential but also correction depth. A 35% mid-cap drawdown tests behavioral resilience more than most beginners expect. Wait until you have held through multiple corrections before adding mid-cap exposure.'
      },
      {
        label: 'For 80C: ELSS SIP, separate from wealth SIP',
        text: 'If you are on the old tax regime, ELSS is the most return-efficient 80C product. Run it as a separate SIP — not the same one you plan to redeem before 7 years. Treat it as a 10-year SIP with a 3-year minimum lock per instalment.'
      }
    ]
  },
  {
    type: 'cta-block' as const,
    title: 'Build a realistic SIP number before starting',
    content:
      'Run a SIP calculator at two numbers: your target amount and the amount that would still feel comfortable in a bad salary month. The lower number is your real starting point. Step-up SIPs in April handle the ambition part — consistency handles everything else.',
    links: [
      { label: 'SIP calculator — project corpus', href: '/in/calculators/sip-calculator' },
      { label: 'India investing hub', href: '/in/investing' },
      { label: 'SIP vs FD: goal-based choice', href: '/in/blog/sip-vs-fd' }
    ]
  }
];

const nextDecisions = [
  {
    title: 'Once your SIP is running',
    description:
      'Separate your tax-saving 80C contribution from your wealth SIP. Then check whether ELSS, PPF, or a split makes sense for your timeline and risk tolerance.',
    links: [
      { label: 'PPF vs ELSS guide', href: '/in/blog/ppf-vs-elss' },
      { label: 'India tax planning hub', href: '/in/tax' }
    ]
  },
  {
    title: 'If you are also managing an EMI',
    description:
      'Confirm that your SIP amount is budgeted from disposable income after EMI — not from the emergency reserve. Running both together is fine; running both from the same limited buffer is not.',
    links: [
      { label: 'India loans hub', href: '/in/loans' },
      { label: 'EMI calculator — stress test at rate +1%', href: '/in/calculators/emi-calculator' }
    ]
  },
  {
    title: 'For comparison: FD vs SIP by goal timeline',
    description:
      'Not all money should be in SIP. If you have goals within 3 years — down payment, travel, education — keep that bucket in FD or recurring deposit, separate from your SIP.',
    links: [{ label: 'SIP vs FD: which fits your goal?', href: '/in/blog/sip-vs-fd' }]
  }
];

const references = [
  { label: 'Reserve Bank of India (RBI)', href: 'https://www.rbi.org.in/', external: true },
  { label: 'Securities and Exchange Board of India (SEBI)', href: 'https://www.sebi.gov.in/', external: true }
];

export default function SipForBeginnersPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({ pathname: '/in/blog/sip-for-beginners', name: title, description }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: 'SIP for Beginners', item: '/in/blog/sip-for-beginners' }
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How much should I start my SIP with as a beginner?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Start with an amount that survives your worst recent month comfortably. For most ₹35,000–₹55,000 take-home households, ₹3,000–₹5,000/month is the sustainable starting point. Increase annually after salary increments.'
            }
          },
          {
            '@type': 'Question',
            name: 'Which fund should I pick for my first SIP?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A single large-cap index fund (Nifty 50 or Sensex) is the right starting point. Low cost, broad diversification, and less behavioral pressure during corrections. Add a second fund only after 12–18 months of uninterrupted investing.'
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
        title="SIP for Beginners: start with the amount you can sustain, not the most ambitious number"
        subtitle="India investing guide · FY 2025–26"
        description="The biggest SIP mistake is not choosing the wrong fund. It is starting at an amount that feels ambitious in a good month but breaks the first time real life applies pressure. This guide is built around one idea: consistency beats optimization. A ₹5,000 SIP you sustain for 10 years builds more wealth than a ₹15,000 SIP you pause twice a year."
        sections={sections}
        nextDecisions={nextDecisions}
        references={references}
      />
    </>
  );
}

