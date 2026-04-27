import type { RegionCode } from '@/lib/region-config';

export type FinanceTermKey =
  | 'accounting_standard'
  | 'tax_authority'
  | 'retirement_account'
  | 'capital_gains'
  | 'tax_framework'
  | 'investment_vehicle';

type TermMap = Record<FinanceTermKey, string>;

const US_TERMS: TermMap = {
  accounting_standard: 'US GAAP',
  tax_authority: 'IRS',
  retirement_account: '401(k)',
  capital_gains: 'capital gains',
  tax_framework: 'federal and state income tax brackets',
  investment_vehicle: 'taxable brokerage and retirement accounts'
};

const INDIA_TERMS: TermMap = {
  accounting_standard: 'Ind AS',
  tax_authority: 'Income Tax Department (India)',
  retirement_account: 'EPF/PPF/NPS',
  capital_gains: 'short-term and long-term capital gains (India)',
  tax_framework: 'income tax slabs and GST impact',
  investment_vehicle: 'SIP, ELSS, PPF, and mutual fund accounts'
};

const FALLBACK_TERMS: TermMap = US_TERMS;

export function getFinanceTerms(region: RegionCode): TermMap {
  if (region === 'IN') return INDIA_TERMS;
  if (region === 'US') return US_TERMS;
  return FALLBACK_TERMS;
}
