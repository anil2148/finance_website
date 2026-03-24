import products from '@/data/financial-products.json';

export type FinancialCategory = 'credit_card' | 'savings_account' | 'investment_app' | 'mortgage_lender' | 'personal_loan';

export type FinancialProduct = {
  id: string;
  name: string;
  bank: string;
  category: FinancialCategory;
  rating: number;
  apr_apy: string;
  annual_fee: string;
  pros: string[];
  cons: string[];
  affiliate_url: string;
  bonus_offer: string;
  recommended_flag: boolean;
};

const productIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidAbsoluteUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export const CATEGORY_LABELS: Record<FinancialCategory, string> = {
  credit_card: 'Credit Cards',
  savings_account: 'Savings Accounts',
  investment_app: 'Investment Apps',
  mortgage_lender: 'Mortgage Lenders',
  personal_loan: 'Personal Loans'
};

export function getFinancialProducts() {
  return products as FinancialProduct[];
}

export function validateFinancialProducts(data: FinancialProduct[] = getFinancialProducts()) {
  const errors: string[] = [];

  for (const product of data) {
    if (!productIdPattern.test(product.id)) {
      errors.push(`Invalid product id "${product.id}"`);
    }

    if (!isValidAbsoluteUrl(product.affiliate_url)) {
      errors.push(`Invalid affiliate_url for ${product.id}: "${product.affiliate_url}"`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function getFinancialProductById(productId: string) {
  return getFinancialProducts().find((item) => item.id === productId);
}

export function getCategoryFromSlug(slug: string): FinancialCategory | null {
  const map: Record<string, FinancialCategory> = {
    'best-credit-cards-2026': 'credit_card',
    'best-savings-accounts-usa': 'savings_account',
    'best-investment-apps': 'investment_app',
    'mortgage-rate-comparison': 'mortgage_lender',
    'high-yield-savings-accounts': 'savings_account'
  };

  return map[slug] ?? null;
}
