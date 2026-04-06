import type { Metadata } from 'next';
import { createPageMetadata, breadcrumbSchema, webpageSchema } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

const title = 'Emergency Fund for Indian Households: 3 Months vs 6 Months';
const description =
  'How to set the right emergency fund target for your household — based on income stability, dependents, fixed costs, and job risk — and why the wrong amount in the wrong place is almost as bad as none at all.';

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  pathname: '/in/blog/emergency-fund-india',
  type: 'article'
});

const sections = [
  {
    type: 'text' as const,
    title: 'The question everyone gets wrong: "How many months?"',
    content:
      '3 months vs 6 months is the wrong starting question. The right question is: how long would it realistically take you to replace lost income in your specific situation? A salaried employee in a large company might replace income in 45–60 days. A freelancer in a specific niche might need 4–6 months. A household supporting parents or paying a school loan has very different break-even resilience than a DINKs household with low fixed costs. The number of months that matters is the one specific to your recovery time, not a generic guideline.'
  },
  {
    type: 'decision-path' as const,
    title: 'How much emergency fund you need — by situation',
    points: [
      {
        label: 'Stable government or large-corporate job, low fixed costs',
        text: '3 months of essential expenses is defensible. Notice boards, notice periods, and gratuity typically buffer the gap. Keep the 3-month fund in a liquid FD or high-yield savings account — not SIP or equity.'
      },
      {
        label: 'Private sector mid-tier job, EMI running, single income',
        text: 'Aim for 4–5 months. Indian private sector layoffs can be quick and job searches in competitive fields take 2–4 months. EMI still needs to be paid during that gap — and it does not pause because your income stopped.'
      },
      {
        label: 'Freelancer, consultant, or commission-based income',
        text: 'Build 6+ months before starting any SIP or long-term investment. Your income has no base floor. A slow quarter or a client leaving creates a 2–3 month income gap that an underfunded emergency buffer cannot absorb.'
      },
      {
        label: 'Single income, supporting parents or school fees in the budget',
        text: 'Your fixed obligations are higher and less negotiable than average. 5–6 months is the right target. Consider keeping 2 months in an instant-access savings account and the rest in an FD with premature closure option for the extra yield.'
      },
      {
        label: 'Dual income, both employed, limited dependents',
        text: '3 months is sufficient if both incomes cannot disappear simultaneously. But keep it truly liquid — not in a SIP that could be down 20% when you need it, and not in a FD that matures 4 months from now.'
      }
    ]
  },
  {
    type: 'table' as const,
    title: 'Emergency fund size by household expense profile',
    table: {
      headers: ['Monthly essential spend', '3-month buffer', '4-month buffer', '6-month buffer', 'Suitable for'],
      rows: [
        {
          'Monthly essential spend': '₹30,000',
          '3-month buffer': '₹90,000',
          '4-month buffer': '₹1.2 lakh',
          '6-month buffer': '₹1.8 lakh',
          'Suitable for': 'Low-fixed-cost, stable salaried household'
        },
        {
          'Monthly essential spend': '₹50,000',
          '3-month buffer': '₹1.5 lakh',
          '4-month buffer': '₹2.0 lakh',
          '6-month buffer': '₹3.0 lakh',
          'Suitable for': 'Mid-tier salaried with EMI; aim for 4–5 months'
        },
        {
          'Monthly essential spend': '₹80,000',
          '3-month buffer': '₹2.4 lakh',
          '4-month buffer': '₹3.2 lakh',
          '6-month buffer': '₹4.8 lakh',
          'Suitable for': 'Higher-income, higher-fixed-cost, often needs 5+ months'
        }
      ]
    },
    content:
      '"Essential spend" means rent/EMI, groceries, utilities, school fees, insurance premiums, and minimum debt payments. It does not include dining, travel, or discretionary items. Calculate the floor, not the lifestyle average.'
  },
  {
    type: 'mistake' as const,
    title: 'The emergency fund mistake that compounds quietly',
    mistake: 'Counting SIP units, ELSS investments, or FD that matures in 8 months as part of the emergency fund.',
    whyItBackfires:
      'Emergency money must be accessible within 24–48 hours without selling at a market-dictated price. If your emergency fund is partially in equity (down 20% when you need it) or in a locked FD, you either sell at a loss or miss the payment. The fund is only functional if it is both fully liquid and fully available.',
    betterAlternative:
      'Keep emergency funds in a savings account with a same-day NEFT facility, a liquid mutual fund (T+1 redemption), or an FD with premature closure option. Rate differences are negligible when weighed against availability during a real emergency.'
  },
  {
    type: 'decision-panel' as const,
    title: 'Where emergency fund plans break in real India households',
    tone: 'amber' as const,
    points: [
      {
        label: 'Starting SIP before the emergency buffer exists',
        text: 'A SIP started before 3 months of expenses are liquid is fragile by design. One medical bill, car repair, or month of reduced income can force you to break the SIP — which destroys compounding continuity and, often, the investing habit.'
      },
      {
        label: 'Emergency fund in an account with minimum balance requirements',
        text: 'If accessing the emergency fund risks a monthly fee or penalty, you may hesitate to use it during a real emergency. The hesitation costs you more than the fee. Use an account with no minimum balance for the emergency fund or use a liquid fund with T+1 redemption.'
      },
      {
        label: 'Building emergency fund in a joint account with mixed-purpose spending',
        text: 'If your emergency fund is in the same account you use for regular expenses, it erodes quietly through normal spending. Keep it in a separate, dedicated account. The psychological boundary matters — "I do not spend this account" needs to be literal, not aspirational.'
      },
      {
        label: 'Rebuilding too slowly after using it',
        text: 'After using your emergency fund, the priority is to rebuild it before resuming SIP or discretionary spending. A household that used its full ₹2 lakh buffer in a medical emergency and then restarts SIP without rebuilding is one more emergency away from debt.'
      }
    ]
  },
  {
    type: 'contradiction' as const,
    title: 'The advice says 6 months. Most Indian households hold 2.',
    mathWinner:
      'Financial planning guidelines recommend 3–6 months of essential expenses as emergency reserves. At 5 months average, a ₹50,000/month household needs ₹2.5 lakh liquid.',
    realLifeChoice:
      'Most Indian households — even those earning ₹12–₹18 lakh annually — hold under ₹75,000 in liquid savings. Some hold nothing identifiable as a dedicated emergency fund.',
    reason:
      'EMI obligations, school fees, family commitments, and the pull of SIP or FD lock-in mean that liquid savings get allocated away as soon as they appear. The emergency fund never gets formally built — it stays as a mental note.',
    resolution:
      'Automate ₹3,000–₹5,000/month to a separate savings account specifically labeled as emergency fund. Treat it as a fixed expense until it reaches the target. Only then redirect those savings toward investment goals.'
  },
  {
    type: 'cta-block' as const,
    title: 'Before you open a SIP, check this',
    content:
      'Calculate your monthly essential spend (rent/EMI, groceries, school fees, utilities, insurance). Multiply by 3–5 depending on your job type. If your liquid savings do not cover that number, build the buffer before starting SIP. The SIP will still be there in 4 months. The emergency might not wait.',
    links: [
      { label: 'India investing hub', href: '/in/investing' },
      { label: 'SIP calculator — project corpus', href: '/in/calculators/sip-calculator' },
      { label: 'SIP vs FD: which fits your goal?', href: '/in/blog/sip-vs-fd' }
    ]
  }
];

const nextDecisions = [
  {
    title: 'Where to keep the emergency fund',
    description:
      'A liquid savings account, a high-yield savings account with quick transfer, or a liquid mutual fund (T+1) are the right places. FD is acceptable if premature closure is cost-free or low-cost.',
    links: [
      { label: 'Best savings accounts India', href: '/in/best-savings-accounts-india' },
      { label: 'India banking hub', href: '/in/banking' }
    ]
  },
  {
    title: 'After the emergency fund is in place',
    description:
      'Once your target buffer exists and is liquid, start SIP from disposable income after all fixed commitments. Do not reduce the emergency fund to add SIP.',
    links: [
      { label: 'SIP for beginners guide', href: '/in/blog/sip-for-beginners' },
      { label: 'India investing hub', href: '/in/investing' }
    ]
  }
];

const references = [
  { label: 'Reserve Bank of India (RBI)', href: 'https://www.rbi.org.in/', external: true },
  { label: 'National Stock Exchange (NSE)', href: 'https://www.nseindia.com/', external: true }
];

export default function EmergencyFundIndiaPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({ pathname: '/in/blog/emergency-fund-india', name: title, description }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: 'Emergency Fund India', item: '/in/blog/emergency-fund-india' }
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How many months emergency fund should an Indian household hold?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '3 months for stable salaried employees with low fixed costs. 4–5 months for single-income households with EMI or school fees. 6+ months for freelancers, consultants, or variable-income earners. Calculate based on your actual monthly essential spend and realistic income recovery time.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can I keep my emergency fund in a SIP or FD?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Emergency funds must be accessible within 24–48 hours without selling at a market price. Equity SIP can be down 20% when you need it. FD may have lock-in penalties. Use a savings account, liquid fund, or penalty-free FD.'
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
        title="Emergency Fund for Indian Households: how much, where to keep it, and why most people get it wrong"
        subtitle="India savings guide · FY 2025–26"
        description="Most Indian households either undersize their emergency fund or keep it in the wrong place. Both mistakes become visible only when a real emergency arrives — which is exactly when there is no time to fix them. This guide gives you the framework to size it correctly for your specific situation and keep it where it is actually useful."
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
  pathname: '/in/blog/emergency-fund-india',
  type: 'article'
});

export default function IndiaGuide() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({
        pathname: '/in/blog/emergency-fund-india',
        name: title,
        description
      }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: title, item: '/in/blog/emergency-fund-india' }
      ])
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IndiaArticleRenderer
        title="Emergency Fund for Indian Households: Months of Coverage"
        subtitle="Savings guide"
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
