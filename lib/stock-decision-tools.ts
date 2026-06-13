import { scoreStock, type StockMetrics } from '@/lib/stocks';
import { daysUntil } from '@/lib/date-utils';

export type RiskTolerance = 'Conservative' | 'Balanced' | 'Aggressive';

export type StockDecisionSnapshot = {
  symbol: string;
  analyzedAt: string;
  price: number;
  decision: string;
  confidence: number;
  opportunityScore: number;
  riskScore: number;
  analystTarget: number;
  analystUpside?: number;
  revenueGrowth: number;
  epsGrowth: number;
  forwardPe: number;
  rsi: number;
  debtToEquity: number;
  profitMargin: number;
};

export type OptionStrategyInput = {
  strategyType: 'Covered Call' | 'Cash-Secured Put' | 'Short Call' | 'Short Put';
  action: 'Sold option' | 'Considering selling' | 'Considering buying to close';
  currentStockPrice: number;
  strikePrice: number;
  expirationDate: string;
  averageCredit: number;
  currentOptionPrice: number;
  contracts: number;
  dateSold?: string;
  ownsShares: boolean;
  sharesOwned?: number;
  riskTolerance: RiskTolerance;
  beta?: number;
};

export type OptionStrategyResult = {
  totalCredit: number;
  buybackCost: number;
  currentProfit: number;
  premiumCapturedPercent: number;
  remainingPremium: number;
  breakeven: number;
  distanceToStrike: number;
  distanceToStrikePercent: number;
  daysToExpiration: number;
  annualizedReturnPercent: number;
  assignmentRisk: 'Low' | 'Medium' | 'High';
  suggestedAction: 'Close' | 'Close Half' | 'Hold' | 'Roll' | 'Avoid / Review';
  why: string[];
  scenarios: Array<{
    name: string;
    optionPrice: number;
    buybackCost: number;
    profitLocked: number;
    additionalProfitVsNow: number;
  }>;
};

export type EntryPlannerInput = {
  currentPrice: number;
  analystTarget: number;
  fairValueEstimate?: number;
  allocationAmount: number;
  buyStyle: RiskTolerance;
  timeHorizon: 'Short-term' | '1 year' | '3+ years';
  pullbackPercent: number;
  stagedBuys: number;
};

export type EntryPlan = {
  verdict: 'Yes' | 'Wait' | 'Buy small starter';
  preferredEntryZone: string;
  starterBuyPrice: number;
  addMorePrice: number;
  finalAddPrice: number;
  avoidAddingAbove: number;
  stopReviewLevel: number;
  trimZone: number;
  riskRewardSummary: string;
  marginOfSafety: number;
  stages: Array<{ label: string; allocationPercent: number; price: number; dollars: number; shares: number }>;
};

export type PortfolioInput = {
  portfolioSize: number;
  sharesOwned: number;
  averageCost: number;
  cashAvailable: number;
  targetAllocationPercent: number;
  riskTolerance: RiskTolerance;
  timeHorizon: '< 1 year' | '1-3 years' | '3+ years';
  alreadyOwns: boolean;
};

export type PortfolioDecision = {
  currentPositionValue: number;
  currentAllocationPercent: number;
  unrealizedGainLoss: number;
  unrealizedGainLossPercent: number;
  targetExposureValue: number;
  additionalDollarsNeeded: number;
  sharesToBuy: number;
  sizingStatus: 'Overweight' | 'Underweight' | 'Right-sized';
  suggestedAction: 'Add' | 'Hold' | 'Trim' | 'Avoid new buying';
  suggestedMaxPositionPercent: number;
  warning: string;
  checklist: string[];
};

export type CompetitorRanking = {
  bestGrowth?: string;
  bestValuation?: string;
  bestProfitability?: string;
  lowestDebtRisk?: string;
  bestMomentum?: string;
  lowestVolatility?: string;
  bestOverall?: string;
};

export type AnalysisChange = {
  label: string;
  before: string;
  after: string;
  tone: 'positive' | 'negative' | 'neutral';
  explanation: string;
};

export function pct(value: number, digits = 1) {
  if (!Number.isFinite(value)) return 'N/A';
  return `${value.toFixed(digits)}%`;
}

export function currency(value: number) {
  if (!Number.isFinite(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function getDaysToExpiration(expirationDate: string, now = new Date()) {
  const days = daysUntil(expirationDate, now);
  return days === null ? 0 : Math.max(0, days);
}

function isCallStrategy(strategyType: OptionStrategyInput['strategyType']) {
  return strategyType === 'Covered Call' || strategyType === 'Short Call';
}

export function calculateOptionsStrategy(input: OptionStrategyInput, now = new Date()): OptionStrategyResult {
  const contracts = Math.max(1, Math.abs(Math.round(input.contracts || 1)));
  const totalCredit = input.averageCredit * 100 * contracts;
  const buybackCost = input.currentOptionPrice * 100 * contracts;
  const currentProfit = totalCredit - buybackCost;
  const premiumCapturedPercent = totalCredit > 0 ? (currentProfit / totalCredit) * 100 : 0;
  const call = isCallStrategy(input.strategyType);
  const breakeven = call ? input.strikePrice + input.averageCredit : input.strikePrice - input.averageCredit;
  const distanceToStrike = call ? input.strikePrice - input.currentStockPrice : input.currentStockPrice - input.strikePrice;
  const distanceToStrikePercent = input.currentStockPrice > 0 ? (distanceToStrike / input.currentStockPrice) * 100 : 0;
  const daysToExpiration = getDaysToExpiration(input.expirationDate, now);
  const capitalBase = call ? Math.max(1, input.currentStockPrice * 100 * contracts) : Math.max(1, input.strikePrice * 100 * contracts);
  const annualizedReturnPercent = daysToExpiration > 0 ? (totalCredit / capitalBase) * (365 / daysToExpiration) * 100 : 0;

  let assignmentRisk: OptionStrategyResult['assignmentRisk'] = 'Low';
  if (distanceToStrikePercent <= 0 || daysToExpiration <= 7) assignmentRisk = 'High';
  else if (distanceToStrikePercent < 5 || daysToExpiration <= 21 || (input.beta || 0) > 1.5) assignmentRisk = 'Medium';

  const why: string[] = [];
  let suggestedAction: OptionStrategyResult['suggestedAction'] = 'Hold';
  if (premiumCapturedPercent >= 70) {
    suggestedAction = 'Close';
    why.push('You have captured at least 70% of the credit, so the remaining reward is small versus assignment and gap risk.');
  } else if (premiumCapturedPercent >= 50 && daysToExpiration > 30) {
    suggestedAction = input.riskTolerance === 'Conservative' ? 'Close' : input.riskTolerance === 'Balanced' ? 'Close Half' : 'Hold';
    why.push('More than half the premium is already captured with meaningful time left before expiration.');
  } else if (assignmentRisk === 'High') {
    suggestedAction = 'Roll';
    why.push('The option is near or in the money, so assignment risk is elevated.');
  } else if (premiumCapturedPercent < 25 && distanceToStrikePercent > 8) {
    suggestedAction = 'Hold';
    why.push('Premium captured is still low and the stock remains far from the strike.');
  }

  if ((input.beta || 0) > 1.5) why.push('High beta means moves can accelerate, so smaller risk or earlier closing may be prudent.');
  if (call && input.strategyType === 'Covered Call' && input.ownsShares && (input.sharesOwned || 0) < contracts * 100) {
    suggestedAction = 'Avoid / Review';
    why.push('Shares owned are below the contract share requirement, so assignment risk needs review.');
  }
  if (!why.length) why.push('Risk/reward is balanced; use a stop rule and reassess if price moves toward the strike.');

  const scenarioPrices = [
    ['Buy to close now', input.currentOptionPrice],
    ['Option drops to 75% of current price', input.currentOptionPrice * 0.75],
    ['Option drops to 50% of current price', input.currentOptionPrice * 0.5],
    ['Option drops to 25% of current price', input.currentOptionPrice * 0.25],
    ['Expires worthless', 0],
  ] as const;
  const scenarios = scenarioPrices.map(([name, optionPrice]) => {
    const scenarioBuyback = optionPrice * 100 * contracts;
    const profitLocked = totalCredit - scenarioBuyback;
    return {
      name,
      optionPrice,
      buybackCost: scenarioBuyback,
      profitLocked,
      additionalProfitVsNow: profitLocked - currentProfit,
    };
  });

  return {
    totalCredit,
    buybackCost,
    currentProfit,
    premiumCapturedPercent,
    remainingPremium: buybackCost,
    breakeven,
    distanceToStrike,
    distanceToStrikePercent,
    daysToExpiration,
    annualizedReturnPercent,
    assignmentRisk,
    suggestedAction,
    why,
    scenarios,
  };
}

export function buildDecisionSnapshot(stock: StockMetrics, score: ReturnType<typeof scoreStock>, upside: number): StockDecisionSnapshot {
  const riskScore = clamp(
    (stock.beta > 0 ? stock.beta * 20 : 25) +
    (stock.forwardPe > 40 ? 25 : stock.forwardPe > 30 ? 15 : stock.forwardPe > 22 ? 8 : 0) +
    (stock.debtToEquity > 1.5 ? 20 : stock.debtToEquity > 0.8 ? 10 : 0) +
    (stock.rsi >= 70 ? 10 : 0) +
    (stock.profitMargin < 6 ? 10 : 0)
  );
  const confidence = clamp(score.total + Math.max(-12, Math.min(12, upside / 2)));
  const decision = confidence >= 78 ? 'STRONG BUY' : confidence >= 62 ? 'BUY' : confidence >= 45 ? 'HOLD / WATCH' : confidence >= 32 ? 'REDUCE' : 'SELL / AVOID';
  return {
    symbol: stock.symbol,
    analyzedAt: new Date().toISOString(),
    price: stock.price,
    decision,
    confidence,
    opportunityScore: confidence,
    riskScore,
    analystTarget: stock.analystTarget,
    analystUpside: upside,
    revenueGrowth: stock.revenueGrowth,
    epsGrowth: stock.epsGrowth,
    forwardPe: stock.forwardPe,
    rsi: stock.rsi,
    debtToEquity: stock.debtToEquity,
    profitMargin: stock.profitMargin,
  };
}

export function buildEntryPlan(stock: StockMetrics, score: ReturnType<typeof scoreStock>, input: EntryPlannerInput): EntryPlan {
  const currentPrice = Math.max(0.01, input.currentPrice);
  const target = input.analystTarget || stock.analystTarget || currentPrice;
  const fairValue = input.fairValueEstimate || target;
  const upside = ((target - currentPrice) / currentPrice) * 100;
  const marginOfSafety = ((fairValue - currentPrice) / fairValue) * 100;
  const expensive = stock.forwardPe > 35 || marginOfSafety < 0 || upside < 8;
  const overbought = stock.rsi >= 68;
  const highQuality = score.total >= 65 && stock.beta < 1.5;
  const verdict: EntryPlan['verdict'] = expensive || overbought ? 'Wait' : highQuality ? 'Buy small starter' : 'Buy small starter';
  const styleAdjustment = input.buyStyle === 'Conservative' ? 1.4 : input.buyStyle === 'Aggressive' ? 0.7 : 1;
  const starterPullback = input.pullbackPercent * 0.6 * styleAdjustment;
  const addPullback = input.pullbackPercent * 1.2 * styleAdjustment;
  const finalPullback = Math.max(input.pullbackPercent * 1.8 * styleAdjustment, 10);
  const starterBuyPrice = verdict === 'Wait' ? currentPrice * (1 - starterPullback / 100) : Math.min(currentPrice, currentPrice * (1 - starterPullback / 100));
  const addMorePrice = currentPrice * (1 - addPullback / 100);
  const finalAddPrice = currentPrice * (1 - finalPullback / 100);
  const avoidAddingAbove = Math.min(target, currentPrice * (1 + (upside > 15 ? 0.06 : 0.02)));
  const stopReviewLevel = currentPrice * (stock.beta > 1.5 ? 0.84 : 0.9);
  const trimZone = target > currentPrice ? target : currentPrice * 1.12;
  const allocations = input.stagedBuys === 2 ? [40, 60] : input.stagedBuys === 4 ? [20, 25, 25, 30] : [25, 35, 40];
  const stagePrices = [starterBuyPrice, addMorePrice, finalAddPrice, currentPrice * 0.86];
  const stages = allocations.map((allocationPercent, index) => {
    const dollars = input.allocationAmount * (allocationPercent / 100);
    const price = stagePrices[index] || finalAddPrice;
    return { label: `Stage ${index + 1}`, allocationPercent, price, dollars, shares: price > 0 ? dollars / price : 0 };
  });
  const riskRewardSummary = expensive
    ? 'Valuation or upside is not compelling enough to chase. Use staged entries and wait for a better price.'
    : overbought
      ? 'Momentum is stretched. A starter may be reasonable only if conviction is high; otherwise wait for RSI to cool.'
      : 'Risk/reward is constructive enough for staged buying, while keeping cash for pullbacks.';

  return {
    verdict,
    preferredEntryZone: `${currency(finalAddPrice)} - ${currency(starterBuyPrice)}`,
    starterBuyPrice,
    addMorePrice,
    finalAddPrice,
    avoidAddingAbove,
    stopReviewLevel,
    trimZone,
    riskRewardSummary,
    marginOfSafety,
    stages,
  };
}

export function buildPortfolioDecision(stock: StockMetrics, score: ReturnType<typeof scoreStock>, input: PortfolioInput): PortfolioDecision {
  const portfolioSize = Math.max(1, input.portfolioSize);
  const currentPositionValue = Math.max(0, input.sharesOwned) * stock.price;
  const costBasis = Math.max(0, input.sharesOwned) * Math.max(0, input.averageCost);
  const currentAllocationPercent = (currentPositionValue / portfolioSize) * 100;
  const targetExposureValue = portfolioSize * (clamp(input.targetAllocationPercent, 0, 100) / 100);
  const additionalDollarsNeeded = Math.max(0, targetExposureValue - currentPositionValue);
  const sharesToBuy = stock.price > 0 ? Math.min(input.cashAvailable, additionalDollarsNeeded) / stock.price : 0;
  const unrealizedGainLoss = currentPositionValue - costBasis;
  const unrealizedGainLossPercent = costBasis > 0 ? (unrealizedGainLoss / costBasis) * 100 : 0;
  const tolerance = input.riskTolerance === 'Conservative' ? 0.7 : input.riskTolerance === 'Aggressive' ? 1.4 : 1;
  const suggestedMaxPositionPercent = clamp((stock.beta > 1.6 ? 5 : stock.beta > 1.2 ? 7 : 9) * tolerance, 2, 12);
  const target = clamp(input.targetAllocationPercent, 0, suggestedMaxPositionPercent);
  const sizingStatus = currentAllocationPercent > target + 1 ? 'Overweight' : currentAllocationPercent < target - 1 ? 'Underweight' : 'Right-sized';
  let suggestedAction: PortfolioDecision['suggestedAction'] = 'Hold';
  if (sizingStatus === 'Overweight') suggestedAction = stock.beta > 1.5 || score.total < 55 ? 'Trim' : 'Hold';
  else if (sizingStatus === 'Underweight' && score.total >= 60) suggestedAction = 'Add';
  else if (sizingStatus === 'Underweight') suggestedAction = 'Avoid new buying';
  const warning = currentAllocationPercent > suggestedMaxPositionPercent
    ? 'Position is above the suggested max size for this risk profile. Consider trimming or pausing new buys.'
    : stock.beta > 1.6
      ? 'High beta means price swings may be large. Use smaller position sizing.'
      : 'Position sizing is within a reasonable range for the selected risk profile.';
  return {
    currentPositionValue,
    currentAllocationPercent,
    unrealizedGainLoss,
    unrealizedGainLossPercent,
    targetExposureValue,
    additionalDollarsNeeded,
    sharesToBuy,
    sizingStatus,
    suggestedAction,
    suggestedMaxPositionPercent,
    warning,
    checklist: [
      suggestedAction === 'Add' ? 'Add in stages instead of all at once.' : 'Do not add until sizing and thesis improve.',
      'Set a review level before adding more capital.',
      'Recheck allocation after major price moves or earnings.',
      'Keep enough cash for other opportunities and emergencies.',
    ],
  };
}

export function rankCompetitors(stocks: StockMetrics[]): CompetitorRanking {
  const valid = stocks.filter((stock) => stock.price > 0);
  const byMax = (selector: (stock: StockMetrics) => number) => valid.slice().sort((a, b) => selector(b) - selector(a))[0]?.symbol;
  const byMin = (selector: (stock: StockMetrics) => number) => valid.slice().sort((a, b) => selector(a) - selector(b))[0]?.symbol;
  const overall = valid
    .map((stock) => ({ symbol: stock.symbol, total: scoreStock(stock).total }))
    .sort((a, b) => b.total - a.total)[0]?.symbol;
  return {
    bestGrowth: byMax((stock) => stock.revenueGrowth + stock.epsGrowth),
    bestValuation: byMin((stock) => stock.forwardPe > 0 ? stock.forwardPe : 999),
    bestProfitability: byMax((stock) => stock.profitMargin),
    lowestDebtRisk: byMin((stock) => stock.debtToEquity),
    bestMomentum: byMax((stock) => 100 - Math.abs(55 - stock.rsi)),
    lowestVolatility: byMin((stock) => stock.beta > 0 ? stock.beta : 999),
    bestOverall: overall,
  };
}

export function compareAnalysisSnapshots(previous: StockDecisionSnapshot, current: StockDecisionSnapshot): AnalysisChange[] {
  const changes: AnalysisChange[] = [];
  const previousAnalystUpside = Number.isFinite(previous.analystUpside) ? Number(previous.analystUpside) : previous.price > 0 ? ((previous.analystTarget - previous.price) / previous.price) * 100 : 0;
  const currentAnalystUpside = Number.isFinite(current.analystUpside) ? Number(current.analystUpside) : current.price > 0 ? ((current.analystTarget - current.price) / current.price) * 100 : 0;
  const add = (label: string, before: string, after: string, tone: AnalysisChange['tone'], explanation: string) => {
    if (before !== after) changes.push({ label, before, after, tone, explanation });
  };
  add('Decision', previous.decision, current.decision, current.confidence > previous.confidence ? 'positive' : current.confidence < previous.confidence ? 'negative' : 'neutral', 'The verdict moved because the confidence and risk/reward inputs changed.');
  add('Confidence', `${Math.round(previous.confidence)}`, `${Math.round(current.confidence)}`, current.confidence > previous.confidence ? 'positive' : 'negative', 'Confidence compares bullish signals against risk signals.');
  add('Opportunity score', `${Math.round(previous.opportunityScore)}`, `${Math.round(current.opportunityScore)}`, current.opportunityScore > previous.opportunityScore ? 'positive' : 'negative', 'Higher opportunity score means the setup improved.');
  add('Risk score', `${Math.round(previous.riskScore)}`, `${Math.round(current.riskScore)}`, current.riskScore < previous.riskScore ? 'positive' : 'negative', 'Lower risk score is generally better.');
  add('Price', currency(previous.price), currency(current.price), current.price < previous.price ? 'neutral' : 'neutral', 'Price changed since the last saved analysis.');
  add('Analyst upside', pct(previousAnalystUpside), pct(currentAnalystUpside), currentAnalystUpside > previousAnalystUpside ? 'positive' : 'negative', 'Analyst upside compares the target price with the current stock price.');
  add('RSI', previous.rsi.toFixed(1), current.rsi.toFixed(1), current.rsi < previous.rsi && current.rsi <= 65 ? 'positive' : current.rsi > 70 ? 'negative' : 'neutral', 'RSI cooling from overbought levels can improve entry timing.');
  add('Forward P/E', previous.forwardPe.toFixed(1), current.forwardPe.toFixed(1), current.forwardPe < previous.forwardPe ? 'positive' : 'negative', 'A lower forward P/E can mean valuation compressed.');
  add('Revenue growth', pct(previous.revenueGrowth), pct(current.revenueGrowth), current.revenueGrowth > previous.revenueGrowth ? 'positive' : 'negative', 'Revenue growth is a key demand signal.');
  add('EPS growth', pct(previous.epsGrowth), pct(current.epsGrowth), current.epsGrowth > previous.epsGrowth ? 'positive' : 'negative', 'EPS growth shows profit improvement.');
  add('Debt/equity', previous.debtToEquity.toFixed(2), current.debtToEquity.toFixed(2), current.debtToEquity < previous.debtToEquity ? 'positive' : 'negative', 'Lower leverage can reduce balance-sheet risk.');
  add('Profit margin', pct(previous.profitMargin), pct(current.profitMargin), current.profitMargin > previous.profitMargin ? 'positive' : 'negative', 'Higher margin suggests better profitability.');
  return changes;
}
