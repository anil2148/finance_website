import type { Metadata } from 'next';
import { createPageMetadata, breadcrumbSchema, webpageSchema } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

const title = 'ETF vs Mutual Funds India: Cost, Behavior, and SIP Suitability';
const description =
  'Compare ETFs and mutual funds for Indian investors — expense ratio differences, trading behavior risks, SIP usability, and which structure fits which goal and investor type.';

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  pathname: '/in/blog/etf-vs-mutual-funds',
  type: 'article'
});

const sections = [
  {
    type: 'text' as const,
    title: 'Both track the same index. That does not make them the same.',
    content:
      'A Nifty 50 ETF and a Nifty 50 index mutual fund often hold nearly identical portfolios and return very similar amounts over a decade. The structural differences — how you buy, how you cost, and how easily you trade — determine which is actually better for your investing behavior. For most beginners and SIP investors, the mutual fund version wins on usability. For cost-conscious, demat-enabled investors investing in lump sums, the ETF wins on expense ratio. The right answer depends on your access, behavior, and contribution pattern.'
  },
  {
    type: 'table' as const,
    title: 'ETF vs index mutual fund: key differences',
    table: {
      headers: ['Factor', 'ETF', 'Index Mutual Fund'],
      rows: [
        { 'Factor': 'Expense ratio', 'ETF': '0.05%–0.20% (typically lower)', 'Index Mutual Fund': '0.10%–0.35% (direct plan)' },
        { 'Factor': 'How you buy', 'ETF': 'Through demat account, at market price during trading hours', 'Index Mutual Fund': 'Through AMC website or platform, at day-end NAV' },
        { 'Factor': 'SIP usability', 'ETF': 'Requires manual execution or specialized platform support', 'Index Mutual Fund': 'Fully automated SIP via most platforms' },
        { 'Factor': 'Bid-ask spread risk', 'ETF': 'Small spread exists; can widen in thin markets', 'Index Mutual Fund': 'None — transacts at exact NAV' },
        { 'Factor': 'Minimum investment', 'ETF': 'One unit (often ₹150–₹650 per unit)', 'Index Mutual Fund': '₹100–₹500 minimum SIP' },
        { 'Factor': 'LTCG/STCG tax treatment', 'ETF': 'Same as equity — >12 months LTCG at 12.5%', 'Index Mutual Fund': 'Same as equity — >12 months LTCG at 12.5%' }
      ]
    },
    content:
      'For most long-term, SIP-based Indian investors, the usability advantage of index mutual funds outweighs the 0.1%–0.15% annual cost difference. For lump-sum investors with demat accounts and disciplined execution, ETFs are the better cost structure.'
  },
  {
    type: 'decision-path' as const,
    title: 'Which structure fits your investor profile',
    points: [
      {
        label: 'SIP investor, first-time or intermediate',
        text: 'Use index mutual funds (direct plan). Fully automated SIP, no demat required, NAV-based pricing without spread. The slight cost disadvantage versus ETF is more than offset by simplicity and automation reliability.'
      },
      {
        label: 'Lump-sum investor with demat account',
        text: 'ETFs make sense here. Lower expense ratio, real-time trading if you need it, and no minimum investment beyond one unit. Useful for deploying annual bonuses or windfall amounts efficiently.'
      },
      {
        label: 'Investor who follows market news closely',
        text: "ETFs have one structural risk for active followers: intraday trading availability. If you are prone to reacting to market headlines by adjusting positions, the end-of-day NAV structure of a mutual fund creates a useful friction. Choose mutual fund if you know you'll trade on impulse."
      },
      {
        label: 'Gold allocation',
        text: 'Gold ETFs are more cost-efficient than gold mutual funds (which add a fund-of-funds layer). If you want gold exposure and have a demat account, a gold ETF has lower total cost than a gold savings fund.'
      }
    ]
  },
  {
    type: 'mistake' as const,
    title: 'The ETF mistake that surprises first-time buyers',
    mistake: 'Buying an ETF at a price significantly higher than the NAV because of a thin order book or elevated market volatility.',
    whyItBackfires:
      'ETFs have a bid-ask spread. During low-liquidity periods — market open/close, intraday volatility, or illiquid ETF categories — the price you pay can exceed the underlying NAV by 0.3%–1.0%. For small-cap or sectoral ETFs, spreads can be larger. The cost advantage of the ETF disappears if spread costs are consistently above what an index mutual fund charges.',
    betterAlternative:
      'Check the ETF\'s average daily volume and bid-ask spread history before buying. For most retail investors in India, large-cap Nifty 50 or Sensex ETFs from major AMCs have tight spreads. Avoid small-cap, sectoral, or thematic ETFs if you are cost-optimizing — the spread risk outweighs the expense ratio benefit.'
  },
  {
    type: 'contradiction' as const,
    title: 'ETFs are cheaper. Most SIP investors are better off with mutual funds.',
    mathWinner:
      'A Nifty 50 ETF with 0.05% expense ratio versus an index mutual fund at 0.20% saves 0.15%/year — roughly ₹1,500/year on a ₹10 lakh portfolio.',
    realLifeChoice:
      'The majority of India SIP investors use regular or direct index mutual funds rather than ETFs, even those with demat accounts.',
    reason:
      'Automated SIP is the primary reason. Setting up a systematic ETF purchase requires either a specialized platform, manual execution each month, or ETF SIP support that is not universally available. Index mutual fund SIPs run automatically without any monthly action.',
    resolution:
      'For SIP investors below ₹15–₹20 lakh corpus, the automation advantage of index mutual funds outweighs the cost difference. For larger portfolios or lump-sum investors, ETFs become more compelling. Use both if it helps — index MF for SIP, ETF for lump-sum top-ups.'
  },
  {
    type: 'cta-block' as const,
    title: 'If you are setting up a SIP',
    content:
      'Start with a direct-plan large-cap index mutual fund for maximum automation reliability. Once your corpus reaches ₹10–₹15 lakh and you have a demat account, evaluate whether ETFs make cost sense for your situation.',
    links: [
      { label: 'SIP for beginners guide', href: '/in/blog/sip-for-beginners' },
      { label: 'India investing hub', href: '/in/investing' },
      { label: 'SIP calculator', href: '/in/calculators/sip-calculator' }
    ]
  }
];

const nextDecisions = [
  {
    title: 'For your tax-saving allocation',
    description: 'ELSS mutual funds (not ETFs) are the only equity route with Section 80C tax benefit. If tax-saving is a goal, ELSS mutual funds are the right vehicle — there is no ELSS ETF.',
    links: [
      { label: 'PPF vs ELSS guide', href: '/in/blog/ppf-vs-elss' },
      { label: 'India tax hub', href: '/in/tax' }
    ]
  }
];

const references = [
  { label: 'SEBI India', href: 'https://www.sebi.gov.in/', external: true },
  { label: 'Association of Mutual Funds in India (AMFI)', href: 'https://www.amfiindia.com/', external: true }
];

export default function EtfVsMutualFundsPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({ pathname: '/in/blog/etf-vs-mutual-funds', name: title, description }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: 'ETF vs Mutual Funds', item: '/in/blog/etf-vs-mutual-funds' }
      ])
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IndiaArticleRenderer
        title="ETF vs Mutual Funds India: which structure fits your investing pattern?"
        subtitle="India investing guide · FY 2025–26"
        description="ETFs and index mutual funds both track the same benchmark and return nearly the same over long periods. The differences that matter are cost structure, SIP usability, and behavioral risk. This guide helps you choose based on how you actually invest — not based on which looks better on a feature comparison table."
        sections={sections}
        nextDecisions={nextDecisions}
        references={references}
      />
    </>
  );
}
