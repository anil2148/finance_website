export type BlogVisual = {
  src: string;
  alt: string;
  cardClassName: string;
  heroClassName: string;
};

const visuals: Array<{ keyword: string; visual: BlogVisual }> = [
  {
    keyword: 'dollar-cost-averaging',
    visual: {
      src: '/images/blog-visual-investing-growth.svg',
      alt: 'Contribution schedule chart comparing monthly investing versus one-time investing',
      cardClassName: 'from-emerald-50 via-cyan-50 to-sky-100',
      heroClassName: 'from-emerald-50 via-cyan-50 to-sky-100'
    }
  },
  {
    keyword: 'expense-ratios',
    visual: {
      src: '/images/blog-visual-investing-risk.svg',
      alt: 'Fund fee comparison panel showing long-term cost drag across portfolios',
      cardClassName: 'from-teal-50 via-emerald-50 to-lime-100',
      heroClassName: 'from-teal-50 via-emerald-50 to-lime-100'
    }
  },
  {
    keyword: 'credit-utilization',
    visual: {
      src: '/images/blog-visual-credit-utilization.svg',
      alt: 'Credit utilization dashboard with statement timing and limit usage indicators',
      cardClassName: 'from-fuchsia-50 via-purple-50 to-violet-100',
      heroClassName: 'from-fuchsia-50 via-purple-50 to-violet-100'
    }
  },
  {
    keyword: 'automate-your-savings',
    visual: {
      src: '/images/blog-visual-savings-cashflow.svg',
      alt: 'Paycheck-based transfer schedule for emergency, bills, and sinking funds',
      cardClassName: 'from-cyan-50 via-sky-50 to-blue-100',
      heroClassName: 'from-cyan-50 via-sky-50 to-blue-100'
    }
  },
  {
    keyword: 'emergency-fund',
    visual: {
      src: '/images/blog-visual-savings-goals.svg',
      alt: 'Emergency fund target tracker with monthly progress and reserve milestones',
      cardClassName: 'from-sky-50 via-cyan-50 to-teal-100',
      heroClassName: 'from-sky-50 via-cyan-50 to-teal-100'
    }
  },
  {
    keyword: 'mortgage-preapproval',
    visual: {
      src: '/images/blog-visual-loans-docs.svg',
      alt: 'Mortgage document checklist board with underwriting timeline markers',
      cardClassName: 'from-indigo-50 via-blue-50 to-sky-100',
      heroClassName: 'from-indigo-50 via-blue-50 to-sky-100'
    }
  },
  {
    keyword: 'invest',
    visual: {
      src: '/images/blog-visual-investing.svg',
      alt: 'Portfolio allocation dashboard with risk and return trend lines',
      cardClassName: 'from-emerald-50 via-teal-50 to-cyan-100',
      heroClassName: 'from-emerald-50 via-teal-50 to-cyan-100'
    }
  },
  {
    keyword: 'retirement',
    visual: {
      src: '/images/blog-visual-investing.svg',
      alt: 'Retirement projection chart with contribution timeline and inflation markers',
      cardClassName: 'from-teal-50 via-emerald-50 to-lime-100',
      heroClassName: 'from-teal-50 via-emerald-50 to-lime-100'
    }
  },
  {
    keyword: 'mortgage',
    visual: {
      src: '/images/blog-visual-credit.svg',
      alt: 'Mortgage affordability dashboard with monthly payment and down-payment planning',
      cardClassName: 'from-indigo-50 via-blue-50 to-sky-100',
      heroClassName: 'from-indigo-50 via-blue-50 to-sky-100'
    }
  },
  {
    keyword: 'loan',
    visual: {
      src: '/images/blog-visual-credit.svg',
      alt: 'Loan comparison board with APR, fees, and funding timeline checkpoints',
      cardClassName: 'from-blue-50 via-indigo-50 to-violet-100',
      heroClassName: 'from-blue-50 via-indigo-50 to-violet-100'
    }
  },
  {
    keyword: 'credit',
    visual: {
      src: '/images/blog-visual-credit.svg',
      alt: 'Credit-card strategy panel with utilization, statement cycle, and reward categories',
      cardClassName: 'from-fuchsia-50 via-purple-50 to-violet-100',
      heroClassName: 'from-fuchsia-50 via-purple-50 to-violet-100'
    }
  },
  {
    keyword: 'tax',
    visual: {
      src: '/images/blog-visual-tax.svg',
      alt: 'Tax planning worksheet with account buckets and filing timeline milestones',
      cardClassName: 'from-amber-50 via-orange-50 to-rose-100',
      heroClassName: 'from-amber-50 via-orange-50 to-rose-100'
    }
  },
  {
    keyword: 'budget',
    visual: {
      src: '/images/blog-visual-saving.svg',
      alt: 'Monthly budgeting board with category envelopes and automated transfer plan',
      cardClassName: 'from-sky-50 via-cyan-50 to-teal-100',
      heroClassName: 'from-sky-50 via-cyan-50 to-teal-100'
    }
  },
  {
    keyword: 'saving',
    visual: {
      src: '/images/blog-visual-saving.svg',
      alt: 'Savings goals tracker showing emergency fund and sinking fund milestones',
      cardClassName: 'from-cyan-50 via-sky-50 to-blue-100',
      heroClassName: 'from-cyan-50 via-sky-50 to-blue-100'
    }
  },
  {
    keyword: 'passive',
    visual: {
      src: '/images/blog-visual-investing.svg',
      alt: 'Passive income portfolio layout with dividend and bond allocation indicators',
      cardClassName: 'from-lime-50 via-green-50 to-emerald-100',
      heroClassName: 'from-lime-50 via-green-50 to-emerald-100'
    }
  }
];

const fallbackVisual: BlogVisual = {
  src: '/images/blog-visual-general.svg',
  alt: 'Personal finance editorial dashboard with planning checklist and progress charts',
  cardClassName: 'from-slate-50 via-blue-50 to-indigo-100',
  heroClassName: 'from-slate-50 via-blue-50 to-indigo-100'
};

export function getBlogVisual(category: string, topic = ''): BlogVisual {
  const normalized = `${category} ${topic}`.toLowerCase();
  const match = visuals.find((item) => normalized.includes(item.keyword));
  return match?.visual ?? fallbackVisual;
}
