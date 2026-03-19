export type BlogVisual = {
  src: string;
  alt: string;
  cardClassName: string;
  heroClassName: string;
};

type VisualVariant = BlogVisual;

function hashNumber(value: string) {
  return [...value].reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
}

const visualPools: Array<{ keyword: string; variants: VisualVariant[] }> = [
  {
    keyword: 'invest',
    variants: [
      {
        src: '/images/blog-visual-investing-growth.svg',
        alt: 'Portfolio growth projection with contribution and compounding trend lines',
        cardClassName: 'from-emerald-50 via-cyan-50 to-sky-100',
        heroClassName: 'from-emerald-50 via-cyan-50 to-sky-100'
      },
      {
        src: '/images/blog-visual-investing-risk.svg',
        alt: 'Risk and fee comparison panel for long-term investment choices',
        cardClassName: 'from-teal-50 via-emerald-50 to-lime-100',
        heroClassName: 'from-teal-50 via-emerald-50 to-lime-100'
      },
      {
        src: '/images/blog-visual-investing.svg',
        alt: 'Diversified portfolio dashboard with allocation and return markers',
        cardClassName: 'from-lime-50 via-green-50 to-emerald-100',
        heroClassName: 'from-lime-50 via-green-50 to-emerald-100'
      }
    ]
  },
  {
    keyword: 'retirement',
    variants: [
      {
        src: '/images/blog-visual-investing-growth.svg',
        alt: 'Retirement account contribution growth timeline with milestones',
        cardClassName: 'from-sky-50 via-teal-50 to-emerald-100',
        heroClassName: 'from-sky-50 via-teal-50 to-emerald-100'
      },
      {
        src: '/images/blog-visual-investing.svg',
        alt: 'Retirement income projection chart showing drawdown and inflation',
        cardClassName: 'from-teal-50 via-cyan-50 to-lime-100',
        heroClassName: 'from-teal-50 via-cyan-50 to-lime-100'
      }
    ]
  },
  {
    keyword: 'loan',
    variants: [
      {
        src: '/images/blog-visual-loans-docs.svg',
        alt: 'Loan document checklist and underwriting timeline board',
        cardClassName: 'from-indigo-50 via-blue-50 to-sky-100',
        heroClassName: 'from-indigo-50 via-blue-50 to-sky-100'
      },
      {
        src: '/images/blog-visual-credit.svg',
        alt: 'Loan offer comparison panel with APR, term, and fee rows',
        cardClassName: 'from-blue-50 via-indigo-50 to-violet-100',
        heroClassName: 'from-blue-50 via-indigo-50 to-violet-100'
      }
    ]
  },
  {
    keyword: 'mortgage',
    variants: [
      {
        src: '/images/blog-visual-mortgage-home.svg',
        alt: 'Mortgage decision dashboard with rate, home price, and payment checkpoints',
        cardClassName: 'from-sky-50 via-blue-50 to-indigo-100',
        heroClassName: 'from-sky-50 via-blue-50 to-indigo-100'
      },
      {
        src: '/images/blog-visual-credit.svg',
        alt: 'Home-loan affordability dashboard with payment and down-payment ranges',
        cardClassName: 'from-indigo-50 via-blue-50 to-sky-100',
        heroClassName: 'from-indigo-50 via-blue-50 to-sky-100'
      }
    ]
  },
  {
    keyword: 'credit',
    variants: [
      {
        src: '/images/blog-visual-credit-utilization.svg',
        alt: 'Credit utilization tracker by statement cycle and card limit usage',
        cardClassName: 'from-fuchsia-50 via-purple-50 to-violet-100',
        heroClassName: 'from-fuchsia-50 via-purple-50 to-violet-100'
      },
      {
        src: '/images/blog-visual-credit.svg',
        alt: 'Credit strategy board showing APR, rewards, and due-date controls',
        cardClassName: 'from-purple-50 via-violet-50 to-indigo-100',
        heroClassName: 'from-purple-50 via-violet-50 to-indigo-100'
      }
    ]
  },
  {
    keyword: 'saving',
    variants: [
      {
        src: '/images/blog-visual-savings-goals.svg',
        alt: 'Savings milestone tracker with emergency and sinking fund goals',
        cardClassName: 'from-cyan-50 via-sky-50 to-blue-100',
        heroClassName: 'from-cyan-50 via-sky-50 to-blue-100'
      },
      {
        src: '/images/blog-visual-savings-cashflow.svg',
        alt: 'Cash-flow allocation schedule for bills, reserves, and goals',
        cardClassName: 'from-sky-50 via-cyan-50 to-teal-100',
        heroClassName: 'from-sky-50 via-cyan-50 to-teal-100'
      },
      {
        src: '/images/blog-visual-saving.svg',
        alt: 'Budget and savings planning worksheet with transfer automation',
        cardClassName: 'from-teal-50 via-cyan-50 to-sky-100',
        heroClassName: 'from-teal-50 via-cyan-50 to-sky-100'
      }
    ]
  },
  {
    keyword: 'budget',
    variants: [
      {
        src: '/images/blog-visual-saving.svg',
        alt: 'Monthly budget board with fixed and flexible spending categories',
        cardClassName: 'from-sky-50 via-cyan-50 to-teal-100',
        heroClassName: 'from-sky-50 via-cyan-50 to-teal-100'
      },
      {
        src: '/images/blog-visual-savings-cashflow.svg',
        alt: 'Cash bucket planning board for recurring bills and sinking funds',
        cardClassName: 'from-cyan-50 via-sky-50 to-blue-100',
        heroClassName: 'from-cyan-50 via-sky-50 to-blue-100'
      }
    ]
  },

  {
    keyword: 'passive-income',
    variants: [
      {
        src: '/images/blog-visual-investing-growth.svg',
        alt: 'Passive-income mix tracker showing dividend, interest, and cash-flow streams',
        cardClassName: 'from-emerald-50 via-teal-50 to-cyan-100',
        heroClassName: 'from-emerald-50 via-teal-50 to-cyan-100'
      },
      {
        src: '/images/blog-visual-savings-cashflow.svg',
        alt: 'Recurring income calendar with cash-flow stability checkpoints',
        cardClassName: 'from-cyan-50 via-sky-50 to-indigo-100',
        heroClassName: 'from-cyan-50 via-sky-50 to-indigo-100'
      }
    ]
  },

  {
    keyword: 'tax',
    variants: [
      {
        src: '/images/blog-visual-tax.svg',
        alt: 'Tax-aware investing worksheet with account location choices',
        cardClassName: 'from-amber-50 via-orange-50 to-rose-100',
        heroClassName: 'from-amber-50 via-orange-50 to-rose-100'
      },
      {
        src: '/images/blog-visual-investing-risk.svg',
        alt: 'After-tax return comparison for different account placements',
        cardClassName: 'from-orange-50 via-amber-50 to-yellow-100',
        heroClassName: 'from-orange-50 via-amber-50 to-yellow-100'
      }
    ]
  }
];

const fallbackVisual: BlogVisual = {
  src: '/images/blog-visual-general.svg',
  alt: 'Personal finance editorial dashboard with planning checklist and progress charts',
  cardClassName: 'from-slate-50 via-blue-50 to-indigo-100',
  heroClassName: 'from-slate-50 via-blue-50 to-indigo-100'
};

const slugVisualOverrides: Record<string, BlogVisual> = {
  'budget-rule-based-reset': {
    src: '/images/blog-visual-savings-cashflow.svg',
    alt: 'Flexible paycheck budget map with needs, wants, and goals reallocation paths',
    cardClassName: 'from-cyan-50 via-sky-50 to-blue-100',
    heroClassName: 'from-cyan-50 via-sky-50 to-blue-100'
  },
  'emergency-fund-target-by-recovery-timeline': {
    src: '/images/blog-visual-savings-goals.svg',
    alt: 'Emergency-fund milestone ladder with layered reserve targets',
    cardClassName: 'from-sky-50 via-cyan-50 to-teal-100',
    heroClassName: 'from-sky-50 via-cyan-50 to-teal-100'
  },
  'how-to-choose-a-high-yield-savings-account': {
    src: '/images/blog-visual-saving.svg',
    alt: 'Savings account operations checklist comparing APY, transfer speed, and rules',
    cardClassName: 'from-teal-50 via-cyan-50 to-sky-100',
    heroClassName: 'from-teal-50 via-cyan-50 to-sky-100'
  },
  'seo-mortgage-preapproval-checklist': {
    src: '/images/blog-visual-mortgage-home.svg',
    alt: 'Mortgage preapproval planning board linking document readiness to payment affordability targets',
    cardClassName: 'from-sky-50 via-blue-50 to-indigo-100',
    heroClassName: 'from-sky-50 via-blue-50 to-indigo-100'
  },
  'seo-how-to-compare-personal-loan-apr': {
    src: '/images/blog-visual-credit.svg',
    alt: 'Personal loan offer comparison worksheet with APR, fee, and payment stress columns',
    cardClassName: 'from-blue-50 via-indigo-50 to-violet-100',
    heroClassName: 'from-blue-50 via-indigo-50 to-violet-100'
  },
  'debt-to-income-ratio-90-day-plan': {
    src: '/images/comparison-analytics-illustration.svg',
    alt: 'Debt-to-income analysis board comparing required payments, ratios, and lender thresholds',
    cardClassName: 'from-indigo-50 via-sky-50 to-cyan-100',
    heroClassName: 'from-indigo-50 via-sky-50 to-cyan-100'
  },
  'credit-utilization-statement-cycle-playbook': {
    src: '/images/blog-visual-credit-utilization.svg',
    alt: 'Credit utilization trend dashboard with per-card concentration controls',
    cardClassName: 'from-fuchsia-50 via-purple-50 to-violet-100',
    heroClassName: 'from-fuchsia-50 via-purple-50 to-violet-100'
  },
  'beginner-investing-roadmap-year-one-milestones': {
    src: '/images/blog-visual-investing-growth.svg',
    alt: 'Quarter-by-quarter investing roadmap with contribution growth milestones',
    cardClassName: 'from-emerald-50 via-cyan-50 to-sky-100',
    heroClassName: 'from-emerald-50 via-cyan-50 to-sky-100'
  },
  'tax-efficient-investing-account-location-decisions': {
    src: '/images/blog-visual-tax.svg',
    alt: 'Tax-efficient investing checklist for asset location and rebalance sequencing',
    cardClassName: 'from-amber-50 via-orange-50 to-rose-100',
    heroClassName: 'from-amber-50 via-orange-50 to-rose-100'
  }
};

export function getBlogVisual(category: string, topic = ''): BlogVisual {
  const bySlug = slugVisualOverrides[topic];
  if (bySlug) return bySlug;

  const normalized = `${category} ${topic}`.toLowerCase();
  const pool = visualPools.find((entry) => normalized.includes(entry.keyword));

  if (!pool) return fallbackVisual;

  const variant = pool.variants[Math.abs(hashNumber(topic || category)) % pool.variants.length];
  return variant ?? fallbackVisual;
}
