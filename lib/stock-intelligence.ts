import { demoStocks, scoreStock, type StockMetrics } from '@/lib/stocks';

export type IntelligenceReport = {
  stock: StockMetrics;
  score: ReturnType<typeof scoreStock>;
  earningsTranscript: {
    ceoConfidence: 'High' | 'Medium' | 'Low';
    positives: string[];
    concerns: string[];
    summary: string;
  };
  secFiling: {
    businessQuality: string;
    riskFactors: string[];
    accountingWatchlist: string[];
  };
  newsSentiment: {
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    drivers: string[];
  };
  insiderTransactions: {
    signal: 'Bullish' | 'Neutral' | 'Bearish';
    explanation: string;
  };
  analystRevisions: {
    signal: 'Bullish' | 'Neutral' | 'Bearish';
    explanation: string;
  };
  institutionalOwnership: {
    signal: 'Stable' | 'Accumulation Watch' | 'Distribution Watch';
    explanation: string;
  };
  economicCalendar: {
    upcomingEvents: string[];
    macroRisks: string[];
  };
  finalVerdict: {
    verdict: 'BUY CANDIDATE' | 'HOLD / WATCH' | 'AVOID / WAIT';
    confidence: number;
    reason: string;
  };
};

function getStock(symbol: string) {
  return demoStocks[symbol.toUpperCase()] || demoStocks.MSFT;
}

export function buildStockIntelligenceReport(symbol: string): IntelligenceReport {
  const stock = getStock(symbol);
  const score = scoreStock(stock);
  const upside = ((stock.analystTarget - stock.price) / stock.price) * 100;
  const highGrowth = stock.revenueGrowth > 12 && stock.epsGrowth > 12;
  const expensive = stock.forwardPe > 35;
  const volatile = stock.beta > 1.5;

  const verdict = score.total >= 78 && upside > 8
    ? 'BUY CANDIDATE'
    : score.total < 55 || upside < -5
      ? 'AVOID / WAIT'
      : 'HOLD / WATCH';

  const confidence = Math.min(95, Math.max(45, score.total + (upside > 10 ? 6 : upside < 0 ? -8 : 0)));

  return {
    stock,
    score,
    earningsTranscript: {
      ceoConfidence: highGrowth && stock.profitMargin > 20 ? 'High' : stock.revenueGrowth > 5 ? 'Medium' : 'Low',
      positives: [
        highGrowth ? 'Growth commentary should be supportive if management confirms demand durability.' : 'Growth is positive but needs stronger guidance to become a major bullish driver.',
        stock.profitMargin > 20 ? 'Margins suggest pricing power and operating discipline.' : 'Margins need monitoring for cost pressure.',
        stock.debtToEquity < 0.8 ? 'Balance sheet flexibility can support investment and buybacks.' : 'Debt levels should be watched if cash flow weakens.',
      ],
      concerns: [
        expensive ? 'Premium valuation leaves less room for weak guidance.' : 'Valuation risk is not extreme relative to high-growth peers.',
        stock.rsi > 70 ? 'Momentum may be overbought before earnings.' : 'Technical momentum is not extremely stretched.',
        volatile ? 'High beta can amplify post-earnings moves.' : 'Volatility profile is manageable relative to aggressive growth stocks.',
      ],
      summary: `${stock.name} earnings quality depends on whether revenue growth, margin durability, and guidance can support the current valuation.`,
    },
    secFiling: {
      businessQuality: stock.profitMargin > 25 ? 'High-margin business with strong quality indicators.' : 'Business quality is mixed and should be validated with 10-K/10-Q trends.',
      riskFactors: [
        expensive ? 'Multiple compression risk if growth slows.' : 'Valuation risk appears manageable but still depends on earnings delivery.',
        volatile ? 'Market volatility and macro sensitivity can impact returns.' : 'Lower volatility profile may reduce drawdown risk.',
        stock.debtToEquity > 1.2 ? 'Leverage and refinancing risk should be reviewed in filings.' : 'Debt burden does not appear to be the main risk from available metrics.',
      ],
      accountingWatchlist: ['Revenue recognition trends', 'Free cash flow vs net income', 'Share-based compensation', 'Debt maturity schedule'],
    },
    newsSentiment: {
      sentiment: highGrowth && upside > 5 ? 'Positive' : expensive || stock.changePercent < 0 ? 'Neutral' : 'Neutral',
      drivers: [
        'Product demand and earnings guidance',
        'Analyst estimate revisions',
        'Sector momentum and macro rate expectations',
      ],
    },
    insiderTransactions: {
      signal: stock.forwardPe < 30 && upside > 10 ? 'Bullish' : expensive ? 'Neutral' : 'Neutral',
      explanation: 'This demo proxy should be replaced with live insider buy/sell data from SEC Form 4 or a market-data provider.',
    },
    analystRevisions: {
      signal: upside > 15 ? 'Bullish' : upside < 0 ? 'Bearish' : 'Neutral',
      explanation: upside > 15 ? 'Analyst target implies meaningful upside.' : upside < 0 ? 'Analyst target is below current price.' : 'Analyst target suggests balanced risk/reward.',
    },
    institutionalOwnership: {
      signal: highGrowth ? 'Accumulation Watch' : volatile ? 'Distribution Watch' : 'Stable',
      explanation: 'Institutional signal is modeled from quality/growth/volatility until live 13F ownership data is connected.',
    },
    economicCalendar: {
      upcomingEvents: ['Next earnings report', 'Federal Reserve rate decision', 'CPI inflation report', 'Sector-specific demand data'],
      macroRisks: [
        stock.forwardPe > 35 ? 'High valuation is sensitive to interest-rate increases.' : 'Interest-rate sensitivity is moderate.',
        stock.beta > 1.5 ? 'High beta can underperform during broad risk-off markets.' : 'Beta profile is not extremely aggressive.',
      ],
    },
    finalVerdict: {
      verdict,
      confidence,
      reason: `${stock.symbol} receives a ${score.total}/100 score with ${upside.toFixed(1)}% analyst-target upside. Verdict is based on valuation, growth, profitability, risk, and technical momentum.`,
    },
  };
}
