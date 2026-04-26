import type { RegionCode } from '@/lib/region-config';

export type RegionalFinanceContext = {
  currencySymbol: '$' | '₹' | '€';
  sampleMonthlyIncome: number;
  interestRateRange: string;
  taxAssumption: string;
  primaryProducts: string[];
  localizedScenario: {
    incomeLabel: string;
    decisionLabel: string;
    monthlyCostLines: string[];
    riskAlert: string;
    recommendation: string;
  };
};

const US_CONTEXT: RegionalFinanceContext = {
  currencySymbol: '$',
  sampleMonthlyIncome: 6000,
  interestRateRange: '4.5%–7.5% typical borrowing range',
  taxAssumption: 'Assumes federal marginal bracket (22%–24%) and payroll taxes.',
  primaryProducts: ['401(k)', 'Roth IRA', 'HSA'],
  localizedScenario: {
    incomeLabel: 'Income: $6,000/month',
    decisionLabel: 'Decision: Buy house',
    monthlyCostLines: ['Mortgage: $2,430', 'Taxes/insurance: $640', 'Maintenance: $350'],
    riskAlert: 'Housing spend crosses safe threshold in downside scenario.',
    recommendation: 'Wait + build reserves first.'
  }
};

const INDIA_CONTEXT: RegionalFinanceContext = {
  currencySymbol: '₹',
  sampleMonthlyIncome: 120000,
  interestRateRange: '8.0%–11.5% typical loan range',
  taxAssumption: 'Assumes old vs new regime comparison and 80C optimization.',
  primaryProducts: ['PPF', 'ELSS', 'NPS'],
  localizedScenario: {
    incomeLabel: 'Income: ₹1,20,000/month',
    decisionLabel: 'Decision: Buy flat',
    monthlyCostLines: ['Home loan EMI: ₹48,600', 'Property taxes/charges: ₹7,800', 'Maintenance + society: ₹5,500'],
    riskAlert: 'EMI load becomes tight if rates rise by 1% or bonus is delayed.',
    recommendation: 'Reduce loan size or extend down payment runway.'
  }
};

const EU_CONTEXT: RegionalFinanceContext = {
  currencySymbol: '€',
  sampleMonthlyIncome: 4500,
  interestRateRange: '3.0%–6.0% typical borrowing range',
  taxAssumption: 'Assumes country-specific progressive taxes and social contributions.',
  primaryProducts: ['Private pension plan', 'ETF savings plan', 'Emergency fund'],
  localizedScenario: {
    incomeLabel: 'Income: €4,500/month',
    decisionLabel: 'Decision: Buy home',
    monthlyCostLines: ['Mortgage: €1,650', 'Taxes/insurance: €290', 'Maintenance: €180'],
    riskAlert: 'Housing spend leaves limited room for emergency savings.',
    recommendation: 'Increase buffer before committing to purchase.'
  }
};

export const REGION_FINANCE_CONTEXT: Record<RegionCode, RegionalFinanceContext> = {
  US: US_CONTEXT,
  IN: INDIA_CONTEXT,
  EU: EU_CONTEXT
};
