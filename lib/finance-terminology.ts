import type { RegionCode } from '@/lib/region-config';

export type TerminologyRegion = RegionCode | 'INDIA';

export type FinanceTermKey =
  | 'mortgage'
  | 'checking_account'
  | 'tax_bracket'
  | 'stocks'
  | 'revenue'
  | 'accounting_standard'
  | 'tax_authority'
  | 'retirement_account'
  | 'capital_gains'
  | 'tax_framework'
  | 'investment_vehicle';

export type FinanceTerminologyMap = Record<FinanceTermKey, string>;

export const terminology: Record<'US' | 'INDIA', TermMap> = {
  US: {
    mortgage: 'Mortgage',
    checking_account: 'Checking Account',
    tax_bracket: 'Tax Brackets',
    stocks: 'Stocks',
    revenue: 'Revenue',
    accounting_standard: 'US GAAP',
    tax_authority: 'IRS',
    retirement_account: '401(k)',
    capital_gains: 'capital gains',
    tax_framework: 'federal and state income tax brackets',
    investment_vehicle: 'taxable brokerage and retirement accounts'
  },
  INDIA: {
    mortgage: 'Home Loan',
    checking_account: 'Current Account',
    tax_bracket: 'Income Tax Slabs',
    stocks: 'Shares',
    revenue: 'Turnover',
    accounting_standard: 'Ind AS',
    tax_authority: 'Income Tax Department (India)',
    retirement_account: 'EPF/PPF/NPS',
    capital_gains: 'short-term and long-term capital gains (India)',
    tax_framework: 'income tax slabs and GST impact',
    investment_vehicle: 'SIP, ELSS, PPF, and mutual fund accounts'
  }
};

function normalizeTerminologyRegion(region?: TerminologyRegion | null): keyof typeof terminology {
  if (region === 'IN' || region === 'INDIA') return 'INDIA';
  return 'US';
}

export function getTerm(key: FinanceTermKey, region?: TerminologyRegion | null): string {
  const regionKey = normalizeTerminologyRegion(region);
  return terminology[regionKey][key] ?? key;
}

export function getFinanceTerms(region: TerminologyRegion): TermMap {
  const regionKey = normalizeTerminologyRegion(region);
  return terminology[regionKey];
}
