const assert = require('node:assert/strict');
const {
  buildEntryPlan,
  buildPortfolioDecision,
  calculateOptionsStrategy,
  compareAnalysisSnapshots,
  getDaysToExpiration,
  rankCompetitors,
} = require('../lib/stock-decision-tools.ts');
const { scoreStock } = require('../lib/stocks.ts');

const baseStock = {
  symbol: 'MSFT',
  name: 'Microsoft Corporation',
  price: 400,
  changePercent: 1,
  pe: 30,
  forwardPe: 28,
  epsGrowth: 14,
  revenueGrowth: 13,
  profitMargin: 35,
  debtToEquity: 0.4,
  roe: 35,
  dividendYield: 0.8,
  analystTarget: 480,
  rsi: 55,
  beta: 1,
};

function runStockDecisionToolsTests() {
  const option = calculateOptionsStrategy({
    strategyType: 'Covered Call',
    action: 'Sold option',
    currentStockPrice: 400,
    strikePrice: 420,
    expirationDate: '2026-08-01',
    averageCredit: 4,
    currentOptionPrice: 1,
    contracts: -2,
    ownsShares: true,
    sharesOwned: 200,
    riskTolerance: 'Balanced',
    beta: 1,
  }, new Date('2026-06-01'));
  assert.equal(option.totalCredit, 800);
  assert.equal(option.buybackCost, 200);
  assert.equal(option.currentProfit, 600);
  assert.equal(Math.round(option.premiumCapturedPercent), 75);
  assert.equal(option.breakeven, 424);
  assert.equal(option.daysToExpiration, getDaysToExpiration('2026-08-01', new Date('2026-06-01')));
  assert.equal(option.suggestedAction, 'Close');

  const score = scoreStock(baseStock);
  const entry = buildEntryPlan(baseStock, score, {
    currentPrice: 400,
    analystTarget: 480,
    allocationAmount: 10000,
    buyStyle: 'Balanced',
    timeHorizon: '1 year',
    pullbackPercent: 5,
    stagedBuys: 3,
  });
  assert.equal(entry.stages.length, 3);
  assert.equal(entry.stages.reduce((sum, stage) => sum + stage.allocationPercent, 0), 100);
  assert.ok(entry.starterBuyPrice <= 400);

  const portfolio = buildPortfolioDecision(baseStock, score, {
    portfolioSize: 100000,
    sharesOwned: 5,
    averageCost: 300,
    cashAvailable: 10000,
    targetAllocationPercent: 5,
    riskTolerance: 'Balanced',
    timeHorizon: '1-3 years',
    alreadyOwns: true,
  });
  assert.equal(portfolio.currentPositionValue, 2000);
  assert.equal(Math.round(portfolio.currentAllocationPercent), 2);
  assert.ok(portfolio.sharesToBuy > 0);

  const rankings = rankCompetitors([
    baseStock,
    { ...baseStock, symbol: 'NVDA', revenueGrowth: 40, epsGrowth: 35, forwardPe: 45, beta: 1.8 },
    { ...baseStock, symbol: 'AAPL', forwardPe: 20, debtToEquity: 0.2, beta: 0.8 },
  ]);
  assert.equal(rankings.bestGrowth, 'NVDA');
  assert.equal(rankings.bestValuation, 'AAPL');
  assert.equal(rankings.lowestDebtRisk, 'AAPL');

  const changes = compareAnalysisSnapshots(
    {
      symbol: 'MSFT',
      analyzedAt: '2026-06-01T00:00:00.000Z',
      price: 430,
      decision: 'HOLD / WATCH',
      confidence: 55,
      opportunityScore: 55,
      riskScore: 60,
      analystTarget: 460,
      revenueGrowth: 10,
      epsGrowth: 8,
      forwardPe: 36,
      rsi: 72,
      debtToEquity: 0.6,
      profitMargin: 30,
    },
    {
      symbol: 'MSFT',
      analyzedAt: '2026-06-08T00:00:00.000Z',
      price: 400,
      decision: 'BUY',
      confidence: 70,
      opportunityScore: 70,
      riskScore: 40,
      analystTarget: 480,
      revenueGrowth: 14,
      epsGrowth: 12,
      forwardPe: 28,
      rsi: 55,
      debtToEquity: 0.4,
      profitMargin: 35,
    }
  );
  assert.ok(changes.some((change) => change.label === 'Decision'));
  assert.ok(changes.some((change) => change.label === 'RSI' && change.tone === 'positive'));
}

module.exports = { runStockDecisionToolsTests };
