export type ComparisonProduct = {
  id: string;
  category: 'credit-cards' | 'personal-loans' | 'mortgage-lenders' | 'savings-accounts' | 'investment-apps';
  name: string;
  rating: number;
  apr: string;
  pros: string[];
  cons: string[];
  affiliateUrl: string;
};

// Intentionally empty: FinanceSphere no longer ships fictional comparison entries.
// Use framework-based comparisons unless verified live product data is available.
export const comparisonProducts: ComparisonProduct[] = [];
