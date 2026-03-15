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

export const comparisonProducts: ComparisonProduct[] = [
  {
    id: 'cc-1',
    category: 'credit-cards',
    name: 'Aurora Cashback Card',
    rating: 4.8,
    apr: '18.99%',
    pros: ['5% groceries', 'No annual fee'],
    cons: ['High balance transfer fee'],
    affiliateUrl: '#'
  },
  {
    id: 'loan-1',
    category: 'personal-loans',
    name: 'Northline Personal Loan',
    rating: 4.4,
    apr: '10.49%',
    pros: ['Same-day funding', 'Flexible term lengths'],
    cons: ['Origination fee'],
    affiliateUrl: '#'
  },
  {
    id: 'mort-1',
    category: 'mortgage-lenders',
    name: 'Atlas Home Lending',
    rating: 4.6,
    apr: '6.10%',
    pros: ['Strong first-time buyer support', 'Rate lock options'],
    cons: ['Limited branch access'],
    affiliateUrl: '#'
  },
  {
    id: 'sav-1',
    category: 'savings-accounts',
    name: 'EverYield Savings',
    rating: 4.7,
    apr: '4.85% APY',
    pros: ['No minimum balance', 'Great mobile app'],
    cons: ['No ATM card'],
    affiliateUrl: '#'
  },
  {
    id: 'inv-1',
    category: 'investment-apps',
    name: 'Orbit Invest',
    rating: 4.5,
    apr: 'N/A',
    pros: ['Auto-investing', 'ETF portfolios'],
    cons: ['No tax-loss harvesting on basic plan'],
    affiliateUrl: '#'
  }
];
