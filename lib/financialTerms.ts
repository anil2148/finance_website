export type BlogRegion = 'US' | 'INDIA';

export const financialTerms = {
  mortgage: {
    US: 'Mortgage',
    INDIA: 'Home Loan'
  },
  checking_account: {
    US: 'Checking Account',
    INDIA: 'Current Account'
  },
  salary: {
    US: 'Salary / Wages',
    INDIA: 'CTC (Cost to Company)'
  },
  tax_system: {
    US: 'IRS Tax System',
    INDIA: 'Income Tax Department'
  },
  sales_tax: {
    US: 'Sales Tax',
    INDIA: 'GST'
  },
  stocks: {
    US: 'Stocks',
    INDIA: 'Shares'
  },
  retirement_accounts: {
    US: '401(k) / IRA',
    INDIA: 'EPF / PPF / NPS'
  },
  fiscal_year: {
    US: 'Fiscal Year',
    INDIA: 'Financial Year (Apr–Mar)'
  }
} as const;

export const financialTermPatterns: Array<{ key: keyof typeof financialTerms; variants: string[] }> = [
  { key: 'mortgage', variants: ['mortgage', 'mortgages', 'home loan', 'home loans'] },
  { key: 'checking_account', variants: ['checking account', 'checking accounts', 'current account', 'current accounts'] },
  { key: 'salary', variants: ['salary', 'salaries', 'wages', 'ctc'] },
  { key: 'tax_system', variants: ['irs tax system', 'irs', 'income tax department'] },
  { key: 'sales_tax', variants: ['sales tax', 'gst'] },
  { key: 'stocks', variants: ['stocks', 'stock', 'shares', 'share'] },
  { key: 'retirement_accounts', variants: ['401(k)', '401k', 'ira', 'retirement account', 'retirement accounts', 'epf', 'ppf', 'nps'] },
  { key: 'fiscal_year', variants: ['fiscal year', 'financial year'] }
];

export const BLOG_REGION_KEYWORDS: Record<BlogRegion, string[]> = {
  US: ['mortgage', '401k', 'IRS', 'stocks'],
  INDIA: ['home loan', 'EPF', 'GST', 'shares']
};
