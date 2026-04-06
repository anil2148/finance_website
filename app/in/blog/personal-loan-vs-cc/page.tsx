import type { Metadata } from 'next';
import { createPageMetadata, breadcrumbSchema, webpageSchema } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

const title = 'Personal Loan vs Credit Card Debt India: Which to Close First?';
const description =
  'Compare the real cost of personal loans and credit card debt in India — interest rates, payoff strategies, and the sequencing decision that most debt-repayment guides get wrong.';

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  pathname: '/in/blog/personal-loan-vs-cc',
  type: 'article'
});

const sections = [
  {
    type: 'text' as const,
    title: 'Credit card debt in India costs more than most people realize',
    content:
      'A personal loan at 14%–18% APR feels expensive. A credit card balance at 36%–42% annualized (3%–3.5%/month) is roughly twice as costly. Many Indian households carry both simultaneously — a personal loan taken to manage a large purchase, and a revolving credit card balance from monthly shortfalls. The payoff sequence matters enormously: paying minimum balance on the card while accelerating the personal loan repayment is almost always the wrong order. The card\'s interest compounds daily or monthly at a rate that makes the personal loan look cheap by comparison.'
  },
  {
    type: 'table' as const,
    title: 'Interest cost comparison: personal loan vs credit card',
    table: {
      headers: ['Debt type', 'Typical APR range', 'Monthly interest on ₹1 lakh balance', '12-month total interest', 'Risk if only minimum paid'],
      rows: [
        {
          'Debt type': 'Personal loan',
          'Typical APR range': '12%–20%',
          'Monthly interest on ₹1 lakh balance': '₹1,000–₹1,667',
          '12-month total interest': '₹12,000–₹20,000 (on reducing balance)',
          'Risk if only minimum paid': 'Fixed tenure — loan ends at maturity regardless'
        },
        {
          'Debt type': 'Credit card (revolving)',
          'Typical APR range': '36%–42% (3%–3.5%/month)',
          'Monthly interest on ₹1 lakh balance': '₹3,000–₹3,500',
          '12-month total interest': '₹36,000–₹42,000 (if balance unchanged)',
          'Risk if only minimum paid': 'Minimum payment barely covers interest — balance does not reduce meaningfully'
        }
      ]
    },
    content:
      'A ₹1 lakh credit card balance at 3%/month costs ₹36,000 in interest over a year if you maintain the balance. The same amount in a personal loan at 18% costs ₹18,000. Always pay credit card debt first.'
  },
  {
    type: 'decision-path' as const,
    title: 'Payoff sequencing strategy — what to do first',
    points: [
      {
        label: 'If you have only credit card debt',
        text: 'Pay maximum possible above the minimum every month. Stop using the card for new purchases until the balance is zero. If APR is above 24%, consider a balance transfer to a lower-rate card or a personal loan consolidation at 14%–16% — the rate reduction alone saves thousands.'
      },
      {
        label: 'If you have both personal loan and credit card debt',
        text: 'Pay minimum on personal loan, put all surplus toward credit card balance first. The card debt at 36%–42% is growing faster. Once the card is cleared, redirect the former card payment to accelerate the personal loan prepayment.'
      },
      {
        label: 'If considering a personal loan to close credit card debt',
        text: 'This is usually correct when: (a) the personal loan APR is materially lower than your card rate, and (b) you will not rebuild card balance after clearing it. The consolidation only helps if you stop accumulating new card debt. Without this commitment, consolidation adds debt instead of reducing it.'
      },
      {
        label: 'If your EMI is already consuming 40%+ of take-home pay',
        text: 'Before any prepayment strategy, stabilize cashflow first. Calculate your monthly debt service ratio (all EMI + minimum card payment / take-home pay). If it exceeds 40%, reducing any new credit is the priority. Borrowing more to consolidate under cashflow stress can extend the problem.'
      }
    ]
  },
  {
    type: 'mistake' as const,
    title: 'The consolidation loan mistake',
    mistake: 'Taking a personal loan to pay off all credit card debt, clearing the cards to zero, then gradually rebuilding the card balances over the next 12 months while also paying the loan EMI.',
    whyItBackfires:
      'Now the household has both the personal loan EMI and growing card balances. Total debt increased. The interest savings from the lower personal loan rate were more than offset by new credit card interest on the rebuilt balances.',
    betterAlternative:
      'If consolidating credit card debt into a personal loan, cut card spending limits immediately after clearing them — or freeze the cards. The loan helps only if new card usage stays at zero or full-payment-each-month discipline is maintained permanently.'
  },
  {
    type: 'contradiction' as const,
    title: 'Avalanche method says clear highest rate first. Many choose smallest balance first.',
    mathWinner:
      'The debt avalanche method (highest interest rate first) minimizes total interest paid. Applied to credit card vs personal loan, this means always attacking the card balance first — it saves thousands in interest.',
    realLifeChoice:
      'Many people pay off the smallest balance first (debt snowball) because clearing a full account feels like a win and provides motivation to continue.',
    reason:
      'Behavioral momentum matters in debt repayment. If the snowball method keeps someone paying consistently, it may produce better real results than the mathematically superior avalanche that gets abandoned after 3 months.',
    resolution:
      'If you have high-rate credit card debt alongside lower-rate debt, the mathematical case for avalanche is overwhelming — the rate gap is too large to ignore. But if your credit card balance is small, clearing it first is psychologically reasonable. The key: never stop. A paused debt repayment plan is a growth plan in disguise.'
  },
  {
    type: 'cta-block' as const,
    title: 'Calculate your payoff timeline before choosing a strategy',
    content:
      'Run your current balances, rates, and monthly payment capacity through a payoff calculator to see exactly how long each sequence takes and how much total interest each approach costs. The numbers often make the decision obvious.',
    links: [
      { label: 'India loans hub', href: '/in/loans' },
      { label: 'EMI calculator', href: '/in/calculators/emi-calculator' }
    ]
  }
];

const nextDecisions = [
  {
    title: 'After clearing high-interest debt',
    description: 'Once credit card and personal loan debt is under control, redirect surplus toward emergency buffer first, then SIP.',
    links: [
      { label: 'Emergency fund guide', href: '/in/blog/emergency-fund-india' },
      { label: 'SIP for beginners', href: '/in/blog/sip-for-beginners' }
    ]
  }
];

const references = [
  { label: 'Reserve Bank of India (RBI)', href: 'https://www.rbi.org.in/', external: true }
];

export default function PersonalLoanVsCcPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({ pathname: '/in/blog/personal-loan-vs-cc', name: title, description }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: 'Personal Loan vs Credit Card', item: '/in/blog/personal-loan-vs-cc' }
      ])
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <IndiaArticleRenderer
        title="Personal loan vs credit card debt: which to close first and why sequence matters"
        subtitle="India loans guide · FY 2025–26"
        description="Carrying both a personal loan and credit card debt simultaneously is expensive — but the order you pay them off matters as much as the total amount. This guide explains the real interest cost difference, the right payoff sequence, and the consolidation trap that makes things worse before making them better."
        sections={sections}
        nextDecisions={nextDecisions}
        references={references}
      />
    </>
  );
}
