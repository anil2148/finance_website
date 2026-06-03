'use client';

import { useMemo, useState } from 'react';
import type { StockMetrics } from '@/lib/stocks';

type Score = {
  total: number;
  rating: string;
};

type EarningsItem = {
  date?: string;
  epsActual?: number;
  epsEstimate?: number;
  revenueActual?: number;
  revenueEstimate?: number;
  quarter?: number;
  year?: number;
};

type BeginnerVerdict = {
  headline: string;
  positives: string[];
  risks: string[];
};

type ChecklistItem = {
  title: string;
  status: string;
  detail: string;
};

type ExportScope = 'current' | 'full';
type ReportTabId = 'decision' | 'overview' | 'thesis' | 'smart-money' | 'metrics' | 'earnings' | 'ai';

type ReportMetric = {
  label: string;
  value: string;
  note?: string;
};

type ReportList = {
  title: string;
  items: string[];
};

type ReportTable = {
  title: string;
  headers: string[];
  rows: string[][];
};

type ReportSection = {
  id: ReportTabId | 'disclaimer';
  title: string;
  summary?: string;
  metrics?: ReportMetric[];
  lists?: ReportList[];
  tables?: ReportTable[];
};

type Props = {
  stock: StockMetrics;
  score: Score;
  upside: number;
  earnings?: EarningsItem[];
  earningsSource?: string | null;
  currentTabId?: string;
  currentTabLabel?: string;
  beginnerVerdict?: BeginnerVerdict | null;
  checklist?: ChecklistItem[];
  aiQuestion?: string;
  aiAnswer?: string | null;
};

type Pointer = {
  title: string;
  detail: string;
  impact: number;
};

const reportTabLabels: Record<ReportTabId, string> = {
  decision: 'Decision',
  overview: 'Overview',
  thesis: 'Thesis',
  'smart-money': 'Smart Money',
  metrics: 'Metrics',
  earnings: 'Earnings',
  ai: 'AI Assistant',
};

const disclaimerText = 'Educational information only. This is not financial advice or a recommendation to buy or sell any security.';

function isReportTabId(value?: string): value is ReportTabId {
  return !!value && value in reportTabLabels;
}

function cleanText(value?: string | number | null) {
  return String(value ?? 'Not available')
    .replace(/https?:\/\/[^\s)]+/gi, 'link removed')
    .replace(/\/api\/[^\s)]+/gi, 'internal data route removed')
    .replace(/\/stock-analyzer[^\s)]*/gi, 'Stock Analyzer')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(value: string) {
  return cleanText(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function currency(value?: number) {
  if (!Number.isFinite(Number(value))) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));
}

function pct(value?: number) {
  if (!Number.isFinite(Number(value))) return 'N/A';
  return `${Number(value).toFixed(1)}%`;
}

function numberValue(value?: number, digits = 2) {
  if (!Number.isFinite(Number(value))) return 'N/A';
  return Number(value).toFixed(digits);
}

function marketCap(value?: number) {
  if (!Number.isFinite(Number(value))) return 'N/A';
  const numeric = Number(value);
  if (numeric >= 1_000_000_000_000) return `$${(numeric / 1_000_000_000_000).toFixed(2)}T`;
  if (numeric >= 1_000_000_000) return `$${(numeric / 1_000_000_000).toFixed(2)}B`;
  if (numeric >= 1_000_000) return `$${(numeric / 1_000_000).toFixed(2)}M`;
  return currency(numeric);
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getEarningsBeatRate(earnings: EarningsItem[], field: 'eps' | 'revenue') {
  const actualKey = field === 'eps' ? 'epsActual' : 'revenueActual';
  const estimateKey = field === 'eps' ? 'epsEstimate' : 'revenueEstimate';
  const comparable = earnings
    .slice(0, 8)
    .filter((item) => typeof item[actualKey] === 'number' && typeof item[estimateKey] === 'number');
  if (!comparable.length) return null;
  const beats = comparable.filter((item) => Number(item[actualKey]) >= Number(item[estimateKey])).length;
  return (beats / comparable.length) * 100;
}

function buildDecision(stock: StockMetrics, score: Score, earnings: EarningsItem[], upside: number) {
  const bullish: Pointer[] = [];
  const bearish: Pointer[] = [];
  const addBull = (title: string, detail: string, impact: number) => bullish.push({ title, detail, impact });
  const addBear = (title: string, detail: string, impact: number) => bearish.push({ title, detail, impact });

  if (score.total >= 75) addBull('Strong overall research score', `FinanceSphere score is ${score.total}/100 (${score.rating}).`, 16);
  else if (score.total >= 60) addBull('Constructive overall score', `FinanceSphere score is ${score.total}/100 (${score.rating}).`, 9);
  else addBear('Weak overall score', `FinanceSphere score is only ${score.total}/100 (${score.rating}).`, 15);

  if (upside >= 20) addBull('Attractive estimated upside', `Estimated upside is ${pct(upside)} based on the current analyst target.`, 15);
  else if (upside >= 8) addBull('Some estimated upside', `Estimated upside is ${pct(upside)}.`, 8);
  else if (upside < -5) addBear('Estimated downside risk', `Estimated target is below current price by ${pct(Math.abs(upside))}.`, 14);
  else addBear('Limited estimated upside', `Estimated upside is only ${pct(upside)}, so risk/reward may not be strong today.`, 7);

  if (stock.revenueGrowth >= 15) addBull('Revenue growth supports the thesis', `Revenue growth is ${pct(stock.revenueGrowth)}.`, 13);
  else if (stock.revenueGrowth >= 6) addBull('Revenue growth is positive', `Revenue growth is ${pct(stock.revenueGrowth)}.`, 6);
  else addBear('Revenue growth is weak', `Revenue growth is ${pct(stock.revenueGrowth)}, which can limit price upside.`, 12);

  if (stock.epsGrowth >= 15) addBull('EPS growth is strong', `EPS growth is ${pct(stock.epsGrowth)}, showing profit improvement.`, 13);
  else if (stock.epsGrowth < 0) addBear('EPS growth is negative', `EPS growth is ${pct(stock.epsGrowth)}, which can pressure valuation.`, 13);
  else addBear('EPS growth needs confirmation', `EPS growth is ${pct(stock.epsGrowth)}, not strong enough by itself.`, 6);

  if (stock.profitMargin >= 15) addBull('Profitability is healthy', `Profit margin is ${pct(stock.profitMargin)}.`, 9);
  else if (stock.profitMargin < 6) addBear('Profitability is weak', `Profit margin is ${pct(stock.profitMargin)}.`, 10);

  if (stock.debtToEquity <= 0.8) addBull('Debt looks manageable', `Debt/equity is ${numberValue(stock.debtToEquity)}.`, 7);
  else if (stock.debtToEquity > 1.5) addBear('Debt risk is elevated', `Debt/equity is ${numberValue(stock.debtToEquity)}.`, 10);

  if (stock.forwardPe > 0 && stock.forwardPe <= 22) addBull('Forward valuation is reasonable', `Forward P/E is ${numberValue(stock.forwardPe)}.`, 9);
  else if (stock.forwardPe > 40) addBear('Valuation is expensive', `Forward P/E is ${numberValue(stock.forwardPe)}, so growth must stay strong.`, 13);
  else if (stock.forwardPe > 30) addBear('Valuation needs growth support', `Forward P/E is ${numberValue(stock.forwardPe)}.`, 8);

  if (stock.rsi >= 70) addBear('Entry timing may be stretched', `RSI is ${numberValue(stock.rsi, 1)}, which may indicate overbought short-term momentum.`, 8);
  else if (stock.rsi <= 35) addBear('Short-term momentum is weak', `RSI is ${numberValue(stock.rsi, 1)}.`, 5);
  else addBull('Momentum is not extreme', `RSI is ${numberValue(stock.rsi, 1)}, not showing an overbought extreme.`, 4);

  const beatRate = getEarningsBeatRate(earnings, 'eps');
  if (beatRate !== null && beatRate >= 65) addBull('Recent EPS beat history is strong', `EPS beat rate is ${pct(beatRate)} across available recent quarters.`, 9);
  else if (beatRate !== null && beatRate < 45) addBear('Recent EPS beat history is weak', `EPS beat rate is ${pct(beatRate)} across available recent quarters.`, 9);
  else if (beatRate === null) addBear('Earnings history needs manual verification', 'Provider did not return enough comparable EPS rows for a strong earnings signal.', 5);

  if (stock.beta > 1.6) addBear('Volatility risk is high', `Beta is ${numberValue(stock.beta)}, so position size should be smaller.`, 7);

  const bullScore = bullish.reduce((sum, item) => sum + item.impact, 0);
  const bearScore = bearish.reduce((sum, item) => sum + item.impact, 0);
  const confidence = clamp(50 + bullScore - bearScore);
  const verdict = confidence >= 78 ? 'STRONG BUY' : confidence >= 62 ? 'BUY' : confidence >= 45 ? 'HOLD / WATCH' : confidence >= 32 ? 'REDUCE' : 'SELL / AVOID';
  const riskScore = clamp(
    (stock.beta > 0 ? stock.beta * 20 : 25) +
    (stock.forwardPe > 40 ? 25 : stock.forwardPe > 30 ? 15 : stock.forwardPe > 22 ? 8 : 0) +
    (stock.debtToEquity > 1.5 ? 20 : stock.debtToEquity > 0.8 ? 10 : 0) +
    (stock.rsi >= 70 ? 10 : 0) +
    (stock.profitMargin < 6 ? 10 : 0)
  );
  const marginOfSafety = stock.analystTarget > 0 && stock.price > 0 ? ((stock.analystTarget - stock.price) / stock.analystTarget) * 100 : 0;
  const bullProbability = confidence >= 78 ? 55 : confidence >= 62 ? 45 : confidence >= 45 ? 30 : 20;
  const bearProbability = riskScore >= 65 ? 35 : riskScore >= 40 ? 25 : 15;
  const baseProbability = Math.max(10, 100 - bullProbability - bearProbability);
  const bullPrice = stock.analystTarget > stock.price ? stock.analystTarget * 1.08 : stock.price * 1.2;
  const basePrice = stock.analystTarget > 0 ? (stock.price + stock.analystTarget) / 2 : stock.price * 1.08;
  const bearPrice = stock.price * (riskScore >= 65 ? 0.72 : riskScore >= 40 ? 0.82 : 0.9);
  const expectedValue = (bullPrice * bullProbability + basePrice * baseProbability + bearPrice * bearProbability) / 100;
  const positionSize = verdict === 'STRONG BUY'
    ? '5% - 8% max portfolio allocation, accumulated in stages'
    : verdict === 'BUY'
      ? '3% - 5% starter-to-core allocation, staged entries preferred'
      : verdict === 'HOLD / WATCH'
        ? '0% - 2% watchlist or small starter only'
        : verdict === 'REDUCE'
          ? 'Trim 25% - 50% if already owned, avoid adding'
          : '0%; avoid new buying until thesis improves';

  return {
    verdict,
    confidence,
    opportunityScore: confidence,
    riskScore,
    marginOfSafety,
    expectedValue,
    positionSize,
    scenarios: [
      { name: 'Bull Case', price: bullPrice, probability: bullProbability, note: 'Growth remains strong, earnings execution improves, and valuation stays supported.' },
      { name: 'Base Case', price: basePrice, probability: baseProbability, note: 'Business performs near current expectations without major positive or negative surprise.' },
      { name: 'Bear Case', price: bearPrice, probability: bearProbability, note: 'Growth slows, valuation compresses, earnings miss, or risk appetite weakens.' },
    ],
    invalidation: [
      'Revenue growth falls below 5% or keeps decelerating.',
      'EPS misses expectations for two consecutive quarters.',
      'Debt/equity increases materially or margins weaken.',
      'Forward valuation expands while growth slows.',
      'Price breaks down while earnings and smart money signals weaken.',
    ],
    monitor: [
      'Next earnings report: EPS, revenue, and guidance.',
      'Forward P/E versus revenue and EPS growth.',
      'Profit margin and debt/equity trend.',
      'RSI and price trend for entry timing.',
      'Analyst target changes after earnings or major news.',
    ],
    bullish: bullish.sort((a, b) => b.impact - a.impact),
    bearish: bearish.sort((a, b) => b.impact - a.impact),
  };
}

function buildReportSections({
  stock,
  score,
  upside,
  earnings = [],
  earningsSource,
  beginnerVerdict,
  checklist = [],
  aiQuestion,
  aiAnswer,
}: Props): ReportSection[] {
  const decision = buildDecision(stock, score, earnings, upside);
  const epsBeatRate = getEarningsBeatRate(earnings, 'eps');
  const revenueBeatRate = getEarningsBeatRate(earnings, 'revenue');
  const hasEarnings = earnings.length > 0;
  const growthTone = stock.revenueGrowth >= 10 || stock.epsGrowth >= 10 ? 'growth is supportive' : 'growth needs confirmation';
  const valuationTone = stock.forwardPe > 35 ? 'valuation risk is elevated' : 'valuation is not extreme relative to the provided metrics';

  return [
    {
      id: 'decision',
      title: 'Decision',
      summary: `${stock.symbol} receives a ${decision.verdict} decision with ${decision.confidence}/100 confidence. The model balances opportunity, risk, margin of safety, scenario outcomes, and position sizing.`,
      metrics: [
        { label: 'Stock', value: `${stock.symbol} - ${stock.name}` },
        { label: 'Current price', value: currency(stock.price) },
        { label: 'Final verdict', value: decision.verdict },
        { label: 'Confidence score', value: `${decision.confidence}/100` },
        { label: 'Opportunity score', value: `${decision.opportunityScore}/100` },
        { label: 'Risk score', value: `${decision.riskScore}/100` },
        { label: 'Margin of safety', value: pct(decision.marginOfSafety) },
        { label: 'Probability-weighted expected value', value: currency(decision.expectedValue) },
        { label: 'Position size suggestion', value: decision.positionSize },
      ],
      tables: [
        {
          title: 'Bull / Base / Bear Scenario Model',
          headers: ['Scenario', 'Price', 'Probability', 'Explanation'],
          rows: decision.scenarios.map((scenario) => [scenario.name, currency(scenario.price), `${scenario.probability}%`, scenario.note]),
        },
      ],
      lists: [
        { title: 'Why this could be a BUY', items: decision.bullish.map((item) => `${item.title}: ${item.detail}`) },
        { title: 'Why this could be a SELL / Avoid', items: decision.bearish.map((item) => `${item.title}: ${item.detail}`) },
        { title: 'What could go wrong', items: decision.invalidation },
        { title: 'What to monitor next', items: decision.monitor },
        {
          title: 'Position sizing notes',
          items: [
            'Use staged entries to reduce timing risk.',
            'Use smaller size when Risk Score is high.',
            'Avoid concentrating too much portfolio weight in one stock.',
          ],
        },
      ],
    },
    {
      id: 'overview',
      title: 'Overview',
      summary: beginnerVerdict?.headline || `${stock.symbol} has a FinanceSphere score of ${score.total}/100 (${score.rating}). The main beginner takeaway is that ${growthTone}, while ${valuationTone}.`,
      lists: [
        { title: 'Bullish factors', items: beginnerVerdict?.positives || decision.bullish.slice(0, 4).map((item) => `${item.title}: ${item.detail}`) },
        { title: 'Bearish factors', items: beginnerVerdict?.risks || decision.bearish.slice(0, 4).map((item) => `${item.title}: ${item.detail}`) },
        {
          title: 'Decision checklist',
          items: checklist.length
            ? checklist.map((item) => `${item.title} - ${item.status}: ${item.detail}`)
            : [
                `Business Quality: Profit margin is ${pct(stock.profitMargin)} and ROE is ${pct(stock.roe)}.`,
                `Growth Strength: Revenue growth is ${pct(stock.revenueGrowth)} and EPS growth is ${pct(stock.epsGrowth)}.`,
                `Risk/Reward: Estimated upside is ${pct(upside)}.`,
              ],
        },
        {
          title: 'Beginner explanation',
          items: [
            'Use the score as a research starting point, not a standalone trade signal.',
            'Compare growth, profitability, valuation, debt, and momentum before deciding.',
            'If signals are mixed, patience and smaller sizing can reduce avoidable risk.',
          ],
        },
      ],
    },
    {
      id: 'thesis',
      title: 'Thesis',
      summary: `Research thesis: ${stock.name} looks ${score.total >= 65 ? 'constructive' : score.total >= 50 ? 'mixed' : 'high risk'} based on the current score, estimated upside of ${pct(upside)}, ${growthTone}, and ${valuationTone}.`,
      lists: [
        { title: 'Bull case', items: decision.bullish.slice(0, 5).map((item) => `${item.title}: ${item.detail}`) },
        { title: 'Bear case', items: decision.bearish.slice(0, 5).map((item) => `${item.title}: ${item.detail}`) },
        {
          title: 'SWOT snapshot',
          items: [
            `Strength: ${stock.profitMargin >= 15 ? 'Healthy profitability supports business quality.' : 'Business quality needs margin improvement.'}`,
            `Weakness: ${stock.forwardPe > 35 ? 'High forward valuation leaves less room for disappointment.' : 'Valuation risk is manageable but should still be tracked.'}`,
            `Opportunity: Analyst target implies ${pct(upside)} estimated upside from the current price.`,
            `Threat: ${decision.invalidation[0]}`,
          ],
        },
        {
          title: 'Investment committee verdict',
          items: [
            `Committee stance: ${decision.verdict}.`,
            `Suggested sizing: ${decision.positionSize}.`,
            'Require earnings, valuation, and balance-sheet confirmation before increasing exposure.',
          ],
        },
      ],
    },
    {
      id: 'smart-money',
      title: 'Smart Money',
      summary: 'Smart money export uses a clean fallback when live insider or institutional data is unavailable for this symbol.',
      lists: [
        { title: 'Insider activity summary', items: ['Insider activity summary is unavailable in the clean export for this symbol right now. Review the live Smart Money tab when data is returned.'] },
        { title: 'Institutional activity summary', items: ['Institutional activity summary is unavailable in the clean export for this symbol right now.'] },
        { title: 'Smart money score/signals', items: ['No clean smart money score is available from the current report data.', 'Treat missing smart money data as neutral, not bullish.'] },
        { title: 'Warnings', items: ['Do not make a buy or sell decision based only on unavailable smart money data.', 'Confirm insider and institutional filings from trusted sources before acting.'] },
      ],
    },
    {
      id: 'metrics',
      title: 'Metrics',
      summary: 'Key valuation, growth, profitability, balance-sheet, technical, and company profile metrics are summarized below in a clean table.',
      tables: [
        {
          title: 'Company and Trading Metrics',
          headers: ['Metric', 'Value', 'Explanation'],
          rows: [
            ['Current price', currency(stock.price), 'Latest available trading price from the profile data.'],
            ['Market cap', marketCap(stock.marketCap), 'Company size based on share price and shares outstanding.'],
            ['Sector', stock.sector || 'Not available', 'Broad business category.'],
            ['Industry', stock.industry || 'Not available', 'More specific business category.'],
            ['Exchange', stock.exchange || 'Not available', 'Primary listing exchange if available.'],
            ['Country', stock.country || 'Not available', 'Company listing or headquarters country if available.'],
            ['IPO', stock.ipo || 'Not available', 'Initial public offering date if available.'],
            ['Website', stock.website ? 'Available' : 'Not available', 'Raw website URLs are removed from the clean PDF.'],
            ['P/E', numberValue(stock.pe), 'Price divided by trailing earnings. Higher values can mean higher expectations.'],
            ['Forward P/E', numberValue(stock.forwardPe), 'Price divided by expected future earnings.'],
            ['EPS growth', pct(stock.epsGrowth), 'Profit growth per share.'],
            ['Revenue growth', pct(stock.revenueGrowth), 'Sales growth trend.'],
            ['Profit margin', pct(stock.profitMargin), 'Profit retained from each dollar of sales.'],
            ['Debt/equity', numberValue(stock.debtToEquity), 'Balance-sheet leverage. Higher values can raise risk.'],
            ['RSI', numberValue(stock.rsi, 1), 'Short-term momentum indicator. Above 70 may be overbought.'],
            ['Dividend yield', pct(stock.dividendYield), 'Annual dividend return as a percentage of price.'],
          ],
        },
      ],
    },
    {
      id: 'earnings',
      title: 'Earnings',
      summary: hasEarnings
        ? `Earnings data is available. EPS beat rate is ${epsBeatRate === null ? 'not available' : pct(epsBeatRate)} and revenue beat rate is ${revenueBeatRate === null ? 'not available' : pct(revenueBeatRate)}.`
        : 'Earnings data is not available from the provider right now.',
      metrics: [
        { label: 'Source', value: earningsSource || 'Not available' },
        { label: 'EPS beat rate', value: epsBeatRate === null ? 'Not available' : pct(epsBeatRate) },
        { label: 'Revenue beat rate', value: revenueBeatRate === null ? 'Not available' : pct(revenueBeatRate) },
      ],
      tables: hasEarnings
        ? [
            {
              title: 'EPS Beat / Miss Table',
              headers: ['Period', 'Actual EPS', 'Estimated EPS', 'Result'],
              rows: earnings.slice(0, 8).map((item) => {
                const actual = typeof item.epsActual === 'number' ? item.epsActual : null;
                const estimate = typeof item.epsEstimate === 'number' ? item.epsEstimate : null;
                return [
                  item.date || `${item.year || 'Year N/A'} Q${item.quarter || 'N/A'}`,
                  actual === null ? 'N/A' : numberValue(actual),
                  estimate === null ? 'N/A' : numberValue(estimate),
                  actual === null || estimate === null ? 'Not comparable' : actual >= estimate ? 'Beat' : 'Miss',
                ];
              }),
            },
            {
              title: 'Revenue Beat / Miss Table',
              headers: ['Period', 'Actual Revenue', 'Estimated Revenue', 'Result'],
              rows: earnings.slice(0, 8).map((item) => {
                const actual = typeof item.revenueActual === 'number' ? item.revenueActual : null;
                const estimate = typeof item.revenueEstimate === 'number' ? item.revenueEstimate : null;
                return [
                  item.date || `${item.year || 'Year N/A'} Q${item.quarter || 'N/A'}`,
                  actual === null ? 'N/A' : marketCap(actual),
                  estimate === null ? 'N/A' : marketCap(estimate),
                  actual === null || estimate === null ? 'Not comparable' : actual >= estimate ? 'Beat' : 'Miss',
                ];
              }),
            },
          ]
        : undefined,
      lists: hasEarnings ? undefined : [{ title: 'Earnings unavailable explanation', items: ['Earnings data is not available from the provider right now. Check again later or verify earnings manually from company filings.'] }],
    },
    {
      id: 'ai',
      title: 'AI Assistant',
      summary: 'Clean AI Assistant export includes only the user question and the generated answer when available.',
      metrics: [
        { label: 'User question', value: aiQuestion || 'No question entered.' },
      ],
      lists: [
        { title: 'AI answer', items: [aiAnswer ? cleanText(aiAnswer) : 'No AI response generated yet.'] },
      ],
    },
    {
      id: 'disclaimer',
      title: 'Disclaimer',
      summary: disclaimerText,
    },
  ];
}

function sectionText(section: ReportSection) {
  const lines = [`${section.title}`, ''.padEnd(section.title.length, '=')];
  if (section.summary) lines.push(cleanText(section.summary), '');
  section.metrics?.forEach((metric) => {
    lines.push(`${metric.label}: ${metric.value}${metric.note ? ` - ${metric.note}` : ''}`);
  });
  if (section.metrics?.length) lines.push('');
  section.tables?.forEach((table) => {
    lines.push(table.title, table.headers.join(' | '));
    table.rows.forEach((row) => lines.push(row.map(cleanText).join(' | ')));
    lines.push('');
  });
  section.lists?.forEach((list) => {
    lines.push(list.title);
    list.items.forEach((item) => lines.push(`- ${cleanText(item)}`));
    lines.push('');
  });
  return lines.join('\n');
}

function reportToText(title: string, sections: ReportSection[]) {
  return [title, ''.padEnd(title.length, '='), '', ...sections.map(sectionText)].join('\n');
}

function reportToHtml(title: string, sections: ReportSection[]) {
  const sectionHtml = sections.map((section) => `
    <section class="report-section">
      <h2>${escapeHtml(section.title)}</h2>
      ${section.summary ? `<p class="summary">${escapeHtml(section.summary)}</p>` : ''}
      ${section.metrics?.length ? `<dl>${section.metrics.map((metric) => `<div><dt>${escapeHtml(metric.label)}</dt><dd>${escapeHtml(metric.value)}${metric.note ? `<span>${escapeHtml(metric.note)}</span>` : ''}</dd></div>`).join('')}</dl>` : ''}
      ${section.tables?.map((table) => `
        <h3>${escapeHtml(table.title)}</h3>
        <table>
          <thead><tr>${table.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>
          <tbody>${table.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      `).join('') || ''}
      ${section.lists?.map((list) => `
        <h3>${escapeHtml(list.title)}</h3>
        <ul>${list.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      `).join('') || ''}
    </section>
  `).join('');

  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${escapeHtml(title)}</title>
      <style>
        @page { margin: 0.65in; }
        * { box-sizing: border-box; }
        body { background: #ffffff; color: #111827; font-family: Arial, Helvetica, sans-serif; line-height: 1.45; margin: 0; padding: 32px; }
        header { border-bottom: 2px solid #111827; margin-bottom: 24px; padding-bottom: 16px; }
        h1 { font-size: 28px; margin: 0 0 8px; }
        h2 { border-bottom: 1px solid #d1d5db; font-size: 22px; margin: 0 0 12px; padding-bottom: 8px; }
        h3 { color: #1f2937; font-size: 15px; margin: 18px 0 8px; }
        p, li, td, th, dd, dt { font-size: 12px; }
        .report-section { break-inside: avoid; margin-bottom: 26px; }
        .summary { color: #374151; margin: 0 0 12px; }
        dl { display: grid; gap: 8px; grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 12px 0; }
        dl div { border: 1px solid #e5e7eb; border-radius: 8px; padding: 9px; }
        dt { color: #6b7280; font-weight: 700; text-transform: uppercase; }
        dd { font-weight: 700; margin: 3px 0 0; }
        dd span { color: #6b7280; display: block; font-weight: 400; margin-top: 2px; }
        table { border-collapse: collapse; margin: 10px 0 16px; width: 100%; }
        th, td { border: 1px solid #d1d5db; padding: 7px; text-align: left; vertical-align: top; }
        th { background: #f3f4f6; }
        ul { margin: 8px 0 14px 20px; padding: 0; }
        footer { border-top: 1px solid #d1d5db; color: #4b5563; font-size: 11px; margin-top: 28px; padding-top: 12px; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <header>
        <h1>${escapeHtml(title)}</h1>
        <p>Generated by FinanceSphere Stock Analyzer</p>
      </header>
      ${sectionHtml}
      <footer>${escapeHtml(disclaimerText)}</footer>
    </body>
  </html>`;
}

export function ResearchReportExport(props: Props) {
  const { stock, score, upside, earnings, earningsSource, beginnerVerdict, checklist, aiQuestion, aiAnswer } = props;
  const [scope, setScope] = useState<ExportScope>('current');
  const [status, setStatus] = useState('');
  const currentTabId = isReportTabId(props.currentTabId) ? props.currentTabId : 'decision';
  const currentTabLabel = props.currentTabLabel || reportTabLabels[currentTabId];
  const title = `FinanceSphere-${stock.symbol}-Stock-Research-Report`;
  const allSections = useMemo(
    () => buildReportSections({ stock, score, upside, earnings, earningsSource, beginnerVerdict, checklist, aiQuestion, aiAnswer }),
    [stock, score, upside, earnings, earningsSource, beginnerVerdict, checklist, aiQuestion, aiAnswer]
  );

  function sectionsFor(nextScope: ExportScope) {
    if (nextScope === 'full') return allSections;
    const selected = allSections.find((section) => section.id === currentTabId);
    const disclaimer = allSections.find((section) => section.id === 'disclaimer');
    return [selected, disclaimer].filter(Boolean) as ReportSection[];
  }

  async function exportPdf(nextScope: ExportScope) {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    doc.setProperties({ title });
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    const addPageIfNeeded = (needed = 24) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    const write = (text: string, size = 10, style: 'normal' | 'bold' = 'normal', gap = 8) => {
      const safe = cleanText(text);
      const lines = doc.splitTextToSize(safe, maxWidth);
      const lineHeight = size + 4;
      addPageIfNeeded(lines.length * lineHeight + gap);
      doc.setFont('helvetica', style);
      doc.setFontSize(size);
      doc.setTextColor(17, 24, 39);
      doc.text(lines, margin, y);
      y += lines.length * lineHeight + gap;
    };

    const divider = () => {
      addPageIfNeeded(18);
      doc.setDrawColor(209, 213, 219);
      doc.line(margin, y, pageWidth - margin, y);
      y += 18;
    };

    write(title, 18, 'bold', 4);
    write(nextScope === 'full' ? 'Full clean research report' : `Current tab clean report: ${currentTabLabel}`, 11, 'normal', 14);
    divider();

    sectionsFor(nextScope).forEach((section) => {
      write(section.title, 15, 'bold', 8);
      if (section.summary) write(section.summary, 10, 'normal', 10);
      section.metrics?.forEach((metric) => write(`${metric.label}: ${metric.value}${metric.note ? ` - ${metric.note}` : ''}`, 9, 'normal', 4));
      section.tables?.forEach((table) => {
        write(table.title, 11, 'bold', 4);
        write(table.headers.join(' | '), 8, 'bold', 4);
        table.rows.forEach((row) => write(row.join(' | '), 8, 'normal', 3));
      });
      section.lists?.forEach((list) => {
        write(list.title, 11, 'bold', 4);
        list.items.forEach((item) => write(`- ${item}`, 9, 'normal', 3));
      });
      divider();
    });

    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
      doc.setPage(page);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(75, 85, 99);
      doc.text(disclaimerText, margin, pageHeight - 24, { maxWidth });
      doc.text(`Page ${page} of ${pageCount}`, pageWidth - margin - 56, pageHeight - 24);
    }

    doc.save(`${title}.pdf`);
    setStatus(nextScope === 'full' ? 'Full report PDF generated.' : `${currentTabLabel} PDF generated.`);
  }

  async function copySummary() {
    const text = reportToText(title, sectionsFor(scope));
    if (!navigator.clipboard) {
      setStatus('Clipboard is not available in this browser.');
      return;
    }
    await navigator.clipboard.writeText(text);
    setStatus(scope === 'full' ? 'Clean full report summary copied.' : `Clean ${currentTabLabel} summary copied.`);
  }

  function printReport() {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      setStatus('Pop-up blocker prevented opening the clean print report.');
      return;
    }
    printWindow.document.open();
    printWindow.document.write(reportToHtml(title, sectionsFor(scope)));
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => printWindow.print(), 250);
    setStatus(scope === 'full' ? 'Clean full report opened for printing.' : `Clean ${currentTabLabel} report opened for printing.`);
  }

  return (
    <section className="mt-6 space-y-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6 print:hidden">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Research Report Export</p>
          <h3 className="mt-2 text-2xl font-bold">Clean PDF reports for {stock.symbol}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Export a focused report for the last selected research tab or a full report across all Stock Analyzer sections. The clean report removes navigation, buttons, raw links, dark UI, and technical error output.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
          Current report tab: <span className="font-bold text-white">{currentTabLabel}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <p className="text-sm font-bold text-white">Export scope</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setScope('current')}
            className={scope === 'current' ? 'rounded-xl bg-emerald-400 px-4 py-3 text-left font-bold text-slate-950' : 'rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left font-semibold text-slate-200 hover:bg-white/10'}
          >
            Current Tab Only
            <span className="mt-1 block text-sm font-normal opacity-80">{currentTabLabel} report only</span>
          </button>
          <button
            type="button"
            onClick={() => setScope('full')}
            className={scope === 'full' ? 'rounded-xl bg-emerald-400 px-4 py-3 text-left font-bold text-slate-950' : 'rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left font-semibold text-slate-200 hover:bg-white/10'}
          >
            Full Report / All Tabs
            <span className="mt-1 block text-sm font-normal opacity-80">Decision, overview, thesis, smart money, metrics, earnings, AI, and disclaimer</span>
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <button onClick={() => exportPdf('current')} className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300">
          Export Current Tab as PDF
        </button>
        <button onClick={() => exportPdf('full')} className="rounded-xl bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300">
          Export Full Report as PDF
        </button>
        <button onClick={copySummary} className="rounded-xl border border-white/10 bg-black/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
          Copy Clean Summary
        </button>
        <button onClick={printReport} className="rounded-xl border border-white/10 bg-black/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
          Print Clean Report
        </button>
      </div>

      {status && <p className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-emerald-100">{status}</p>}

      <p className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
        {disclaimerText} Clean exports are designed for research notes and remove raw URLs, navigation links, API routes, buttons, and dark interface styling.
      </p>
    </section>
  );
}
