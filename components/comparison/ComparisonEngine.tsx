'use client';

import { useMemo, useState } from 'react';
import type { FinancialCategory } from '@/lib/financialProducts';

type FrameworkOption = {
  id: string;
  title: string;
  bestFor: string;
  fees: string;
  minimums: string;
  strengths: string;
  limitations: string;
  easeOfUse: 'Beginner' | 'Intermediate' | 'Advanced';
  support: string;
  riskFit: string;
  chooseWhen: string;
  avoidWhen: string;
};

type ComparisonEngineProps = {
  defaultCategory?: FinancialCategory | 'all';
};

const frameworkByCategory: Record<FinancialCategory, FrameworkOption[]> = {
  credit_card: [
    {
      id: 'cashback-no-fee',
      title: 'No-annual-fee cashback setup',
      bestFor: 'Everyday spending with predictable categories',
      fees: '$0 annual fee; watch balance transfer and foreign transaction fees',
      minimums: 'Usually no minimum spend requirement after approval',
      strengths: 'Simple rewards math and lower carrying-cost risk',
      limitations: 'Fewer premium perks and lower welcome bonuses',
      easeOfUse: 'Beginner',
      support: 'Large issuers often include robust app + phone support',
      riskFit: 'Lower complexity; strong fit if you pay in full monthly',
      chooseWhen: 'You want stable rewards without needing lounge/travel perks',
      avoidWhen: 'You can reliably maximize premium travel credits each year'
    },
    {
      id: 'travel-rewards-premium',
      title: 'Premium travel rewards card',
      bestFor: 'Frequent travelers who can use annual credits',
      fees: 'Higher annual fee; potential offset through statement credits',
      minimums: 'Approval and credit profile requirements are usually stricter',
      strengths: 'Stronger transfer partners and travel protections',
      limitations: 'Can underperform if credits go unused',
      easeOfUse: 'Intermediate',
      support: 'Often includes premium servicing lines and travel portals',
      riskFit: 'Better for organized users who track credits and renewal value',
      chooseWhen: 'Your annual travel spend and redemption habits are consistent',
      avoidWhen: 'You carry balances or dislike tracking rotating benefits'
    },
    {
      id: 'intro-apr-balance-transfer',
      title: 'Intro APR / balance transfer card',
      bestFor: 'Structured payoff plans over 12–21 months',
      fees: 'Common transfer fee of 3%–5%; standard APR after promo window',
      minimums: 'Need a realistic payoff schedule before intro period ends',
      strengths: 'Can materially reduce interest if payoff plan is disciplined',
      limitations: 'Fails if spending continues while debt is being repaid',
      easeOfUse: 'Intermediate',
      support: 'Typical digital account management and autopay options',
      riskFit: 'High benefit only when paired with strict no-new-debt rule',
      chooseWhen: 'You can clear transferred balance before regular APR starts',
      avoidWhen: 'Income is unstable and payoff timeline is uncertain'
    }
  ],
  savings_account: [
    {
      id: 'online-hysa-core',
      title: 'Online high-yield savings account',
      bestFor: 'Emergency funds and short-term reserves',
      fees: 'Usually $0 monthly fee; APY may change anytime',
      minimums: 'Low opening minimums are common',
      strengths: 'Higher yield than many brick-and-mortar savings accounts',
      limitations: 'No branch cash access and possible transfer timing limits',
      easeOfUse: 'Beginner',
      support: 'Chat, email, and phone support quality varies widely',
      riskFit: 'Good default for cash runway if transfer reliability is proven',
      chooseWhen: 'You prioritize liquidity and automation over in-person banking',
      avoidWhen: 'You need same-day cash or branch withdrawals frequently'
    },
    {
      id: 'relationship-rate-savings',
      title: 'Relationship-rate savings program',
      bestFor: 'Households already using one primary bank ecosystem',
      fees: 'May require linked checking/direct deposit to keep top APY',
      minimums: 'Often includes balance tiers or activity requirements',
      strengths: 'Convenient transfers inside one bank and unified login',
      limitations: 'Rate can drop if requirements are missed',
      easeOfUse: 'Intermediate',
      support: 'Usually broader branch + digital support mix',
      riskFit: 'Useful when you can consistently meet eligibility rules',
      chooseWhen: 'Bundling accounts saves friction and still keeps competitive yield',
      avoidWhen: 'Rules are complex enough that missed conditions are likely'
    },
    {
      id: 'cash-management-account',
      title: 'Brokerage cash management account',
      bestFor: 'Investors managing cash and taxable investments together',
      fees: 'May include sweep-program terms and ATM reimbursement rules',
      minimums: 'Depends on platform policy and account type',
      strengths: 'Unified view of investable assets + cash operations',
      limitations: 'Protection model and transfer mechanics vary by provider',
      easeOfUse: 'Advanced',
      support: 'Support quality ranges from self-service to advisor-assisted',
      riskFit: 'Best for users comfortable reading account sweep disclosures',
      chooseWhen: 'You want one dashboard for portfolio cash and spending buffer',
      avoidWhen: 'You prefer straightforward FDIC-only savings structure'
    }
  ],
  investment_app: [
    {
      id: 'robo-advisor',
      title: 'Automated robo-advisor portfolio',
      bestFor: 'Hands-off long-term investors',
      fees: 'Advisory fee plus underlying ETF expense ratios',
      minimums: 'Often low or none, but varies by provider',
      strengths: 'Automatic rebalancing and behavior-friendly investing process',
      limitations: 'Less control over individual holdings',
      easeOfUse: 'Beginner',
      support: 'Ranges from chat support to hybrid advisor tiers',
      riskFit: 'Strong for people who need automation to stay consistent',
      chooseWhen: 'You want a repeatable contribution system with minimal decisions',
      avoidWhen: 'You need full control over security-level tax strategy'
    },
    {
      id: 'self-directed-brokerage',
      title: 'Self-directed investing app',
      bestFor: 'Investors choosing their own ETFs or stocks',
      fees: 'Commissions may be $0, but options/margin/data fees can apply',
      minimums: 'Usually low minimums with fractional-share support',
      strengths: 'Maximum flexibility and broad instrument access',
      limitations: 'Higher behavioral risk and planning burden',
      easeOfUse: 'Intermediate',
      support: 'Platform documentation quality matters more than marketing',
      riskFit: 'Best for users with a written allocation and rebalancing process',
      chooseWhen: 'You can maintain discipline without constant app-driven trading',
      avoidWhen: 'You tend to trade headlines or chase short-term moves'
    },
    {
      id: 'hybrid-advisor',
      title: 'Hybrid app with human advice access',
      bestFor: 'Investors wanting digital tools plus occasional professional input',
      fees: 'Higher all-in cost than pure self-directed apps',
      minimums: 'Some tiers require larger balances for advisor access',
      strengths: 'Can improve plan quality during major life transitions',
      limitations: 'Advice scope and responsiveness vary by service tier',
      easeOfUse: 'Intermediate',
      support: 'Human support is a key differentiator; verify availability first',
      riskFit: 'Useful when accountability and planning confidence matter most',
      chooseWhen: 'You need periodic coaching on allocation and tax location',
      avoidWhen: 'You only need low-cost automated investing'
    }
  ],
  mortgage_lender: [
    {
      id: 'digital-lender',
      title: 'Digital-first mortgage lender',
      bestFor: 'Borrowers comfortable with online document workflows',
      fees: 'Compare APR and lender fees together, not rate alone',
      minimums: 'Credit score and DTI requirements vary by loan program',
      strengths: 'Fast pre-approval and status visibility',
      limitations: 'Less face-to-face support for complex files',
      easeOfUse: 'Intermediate',
      support: 'Can be efficient, but escalation channels are important',
      riskFit: 'Good when your documentation is clean and timeline is tight',
      chooseWhen: 'You want speed and transparent task tracking',
      avoidWhen: 'You need heavy underwriting guidance for nonstandard income'
    },
    {
      id: 'bank-lender',
      title: 'Traditional bank mortgage channel',
      bestFor: 'Borrowers who value branch access and relationship banking',
      fees: 'Can include lender and third-party fee stacks; request full LE',
      minimums: 'Program-specific overlays may be stricter than agency minimums',
      strengths: 'Potential relationship perks and in-person process support',
      limitations: 'Turn times may lag pure digital channels in busy markets',
      easeOfUse: 'Beginner',
      support: 'Often strong local support with variable processing speed',
      riskFit: 'Useful when communication and certainty are top priorities',
      chooseWhen: 'You want direct loan officer access during underwriting',
      avoidWhen: 'Your priority is lowest possible friction and fastest close'
    },
    {
      id: 'broker-channel',
      title: 'Mortgage broker channel',
      bestFor: 'Borrowers who need multiple lender options in one search',
      fees: 'Compensation structure must be clear upfront',
      minimums: 'Depends on wholesale lender options available through broker',
      strengths: 'Can improve fit for edge-case files and pricing',
      limitations: 'Experience depends heavily on broker execution quality',
      easeOfUse: 'Advanced',
      support: 'High-touch support if broker has strong processor network',
      riskFit: 'Good for complex cases requiring broader lender access',
      chooseWhen: 'You need program flexibility or non-QM comparisons',
      avoidWhen: 'You prefer single-institution communication and servicing'
    }
  ],
  personal_loan: [
    {
      id: 'prime-unsecured-loan',
      title: 'Prime unsecured personal loan',
      bestFor: 'Strong-credit borrowers consolidating high-interest debt',
      fees: 'Watch origination fee and APR together as all-in cost',
      minimums: 'Credit and income documentation usually required',
      strengths: 'Lower potential APR and predictable fixed payments',
      limitations: 'Rate offers can worsen if credit utilization is high',
      easeOfUse: 'Beginner',
      support: 'Digital servicing with standard phone support',
      riskFit: 'Strong if payment fits even in lower-income months',
      chooseWhen: 'Debt payoff timeline is clear and spending plan is fixed',
      avoidWhen: 'You expect to re-borrow without spending controls'
    },
    {
      id: 'near-prime-lender',
      title: 'Near-prime lender program',
      bestFor: 'Borrowers rebuilding credit with stable income',
      fees: 'Higher APR band and potential origination charges',
      minimums: 'May have broader credit acceptance than prime lenders',
      strengths: 'Access to funding when prime approval is unlikely',
      limitations: 'Total repayment cost can escalate quickly',
      easeOfUse: 'Intermediate',
      support: 'Servicing quality varies; review hardship policy before signing',
      riskFit: 'Only suitable with conservative payment-to-income ratio',
      chooseWhen: 'You need fixed-structure debt replacement and can accelerate payoff',
      avoidWhen: 'Cash flow is unstable or emergency reserves are minimal'
    },
    {
      id: 'credit-union-loan',
      title: 'Credit union personal loan',
      bestFor: 'Members seeking transparent terms and local support',
      fees: 'Often fewer penalty fees; verify membership requirements',
      minimums: 'Membership eligibility may apply before application',
      strengths: 'Potentially better service and member-focused underwriting',
      limitations: 'Digital experience can be less polished than fintech lenders',
      easeOfUse: 'Beginner',
      support: 'Branch and phone support can be a meaningful advantage',
      riskFit: 'Good for borrowers valuing predictability over instant approvals',
      chooseWhen: 'You prefer relationship lending and clear repayment terms',
      avoidWhen: 'You need fastest possible same-day digital funding'
    }
  ]
};

const categoryLabel: Record<FinancialCategory, string> = {
  credit_card: 'Credit Cards',
  savings_account: 'Savings Accounts',
  investment_app: 'Investment Apps',
  mortgage_lender: 'Mortgage Lenders',
  personal_loan: 'Personal Loans'
};


const categoryByFrameworkId: Record<string, FinancialCategory> = Object.entries(frameworkByCategory).reduce((acc, [category, rows]) => {
  for (const row of rows) acc[row.id] = category as FinancialCategory;
  return acc;
}, {} as Record<string, FinancialCategory>);
export function ComparisonEngine({ defaultCategory = 'all' }: ComparisonEngineProps) {
  const [category, setCategory] = useState<FinancialCategory | 'all'>(defaultCategory);

  const rows = useMemo(() => {
    if (category === 'all') return Object.values(frameworkByCategory).flat();
    return frameworkByCategory[category];
  }, [category]);

  return (
    <section className="space-y-4">
      <div className="comparison-filter-grid">
        <select className="input" value={category} onChange={(event) => setCategory(event.target.value as FinancialCategory | 'all')}>
          <option value="all">All Categories</option>
          <option value="credit_card">Credit Cards</option>
          <option value="savings_account">Savings Accounts</option>
          <option value="investment_app">Investment Apps</option>
          <option value="mortgage_lender">Mortgage Lenders</option>
          <option value="personal_loan">Personal Loans</option>
        </select>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-100">
        This is an evaluation framework, not a live ranking table. Use it to shortlist providers and then verify current terms directly on provider sites.
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <table className="min-w-[980px] w-full text-sm">
          <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <tr>
              <th className="px-3 py-3">Framework option</th>
              <th className="px-3 py-3">Best for</th>
              <th className="px-3 py-3">Fees / cost structure</th>
              <th className="px-3 py-3">Minimums</th>
              <th className="px-3 py-3">Key strengths</th>
              <th className="px-3 py-3">Main limitations</th>
              <th className="px-3 py-3">Ease of use</th>
              <th className="px-3 py-3">Support / access</th>
              <th className="px-3 py-3">Risk / fit notes</th>
              <th className="px-3 py-3">When to choose / avoid</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-200 align-top dark:border-slate-700">
                <td className="px-3 py-3 font-semibold text-slate-900 dark:text-slate-100">
                  {row.title}
                  {category === 'all' ? <p className="mt-1 text-xs font-medium text-blue-700 dark:text-blue-300">{categoryLabel[categoryByFrameworkId[row.id]]}</p> : null}
                </td>
                <td className="px-3 py-3">{row.bestFor}</td>
                <td className="px-3 py-3">{row.fees}</td>
                <td className="px-3 py-3">{row.minimums}</td>
                <td className="px-3 py-3">{row.strengths}</td>
                <td className="px-3 py-3">{row.limitations}</td>
                <td className="px-3 py-3">{row.easeOfUse}</td>
                <td className="px-3 py-3">{row.support}</td>
                <td className="px-3 py-3">{row.riskFit}</td>
                <td className="px-3 py-3">
                  <p><span className="font-semibold">Choose:</span> {row.chooseWhen}</p>
                  <p className="mt-2"><span className="font-semibold">Avoid:</span> {row.avoidWhen}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
