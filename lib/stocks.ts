export type StockMetrics = {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  pe: number;
  forwardPe: number;
  epsGrowth: number;
  revenueGrowth: number;
  profitMargin: number;
  debtToEquity: number;
  roe: number;
  dividendYield: number;
  analystTarget: number;
  rsi: number;
  beta: number;
};

export const demoStocks: Record<string, StockMetrics> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 214.35,
    changePercent: 1.24,
    pe: 28.4,
    forwardPe: 24.6,
    epsGrowth: 8.1,
    revenueGrowth: 5.4,
    profitMargin: 26.3,
    debtToEquity: 1.45,
    roe: 145.2,
    dividendYield: 0.47,
    analystTarget: 235,
    rsi: 58,
    beta: 1.12,
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 427.8,
    changePercent: 0.86,
    pe: 34.7,
    forwardPe: 29.2,
    epsGrowth: 14.8,
    revenueGrowth: 13.2,
    profitMargin: 36.4,
    debtToEquity: 0.35,
    roe: 37.8,
    dividendYield: 0.72,
    analystTarget: 485,
    rsi: 62,
    beta: 0.94,
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 139.12,
    changePercent: 2.91,
    pe: 49.5,
    forwardPe: 35.8,
    epsGrowth: 36.5,
    revenueGrowth: 42.1,
    profitMargin: 48.8,
    debtToEquity: 0.21,
    roe: 91.4,
    dividendYield: 0.03,
    analystTarget: 165,
    rsi: 68,
    beta: 1.76,
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 184.44,
    changePercent: -1.18,
    pe: 61.2,
    forwardPe: 47.4,
    epsGrowth: 6.7,
    revenueGrowth: 8.2,
    profitMargin: 9.7,
    debtToEquity: 0.18,
    roe: 13.9,
    dividendYield: 0,
    analystTarget: 205,
    rsi: 44,
    beta: 2.02,
  },
};

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function scoreStock(stock: StockMetrics) {
  const valuation = clamp(25 - stock.forwardPe * 0.45 + Math.max(0, stock.analystTarget / stock.price - 1) * 30, 0, 25);
  const growth = clamp((stock.epsGrowth + stock.revenueGrowth) * 0.6, 0, 25);
  const profitability = clamp(stock.profitMargin * 0.35 + stock.roe * 0.08, 0, 20);
  const health = clamp(15 - stock.debtToEquity * 4 + (stock.beta < 1.4 ? 3 : 0), 0, 15);
  const technical = clamp(15 - Math.abs(55 - stock.rsi) * 0.35 + (stock.changePercent > 0 ? 2 : -1), 0, 15);
  const total = Math.round(valuation + growth + profitability + health + technical);

  let rating = 'Avoid';
  if (total >= 80) rating = 'Strong Buy';
  else if (total >= 65) rating = 'Buy';
  else if (total >= 50) rating = 'Hold';

  return {
    total,
    rating,
    parts: [
      { name: 'Valuation', value: Math.round(valuation), max: 25 },
      { name: 'Growth', value: Math.round(growth), max: 25 },
      { name: 'Profitability', value: Math.round(profitability), max: 20 },
      { name: 'Financial Health', value: Math.round(health), max: 15 },
      { name: 'Technical Trend', value: Math.round(technical), max: 15 },
    ],
  };
}

export function calculateDcf({
  freeCashFlow,
  growthRate,
  discountRate,
  terminalGrowthRate,
  sharesOutstanding,
}: {
  freeCashFlow: number;
  growthRate: number;
  discountRate: number;
  terminalGrowthRate: number;
  sharesOutstanding: number;
}) {
  const yearlyCashFlows = Array.from({ length: 5 }, (_, index) => freeCashFlow * Math.pow(1 + growthRate / 100, index + 1));
  const presentValue = yearlyCashFlows.reduce((sum, cashFlow, index) => sum + cashFlow / Math.pow(1 + discountRate / 100, index + 1), 0);
  const terminalValue = yearlyCashFlows[4] * (1 + terminalGrowthRate / 100) / ((discountRate - terminalGrowthRate) / 100);
  const terminalPresentValue = terminalValue / Math.pow(1 + discountRate / 100, 5);
  return (presentValue + terminalPresentValue) / sharesOutstanding;
}

export function optionIncome({ stockPrice, strikePrice, premium, contracts }: { stockPrice: number; strikePrice: number; premium: number; contracts: number }) {
  const shares = contracts * 100;
  const income = premium * shares;
  const maxGain = income + Math.max(0, strikePrice - stockPrice) * shares;
  const breakeven = stockPrice - premium;
  return { income, maxGain, breakeven };
}
