import { demoStocks, scoreStock, type StockMetrics } from '@/lib/stocks';

export type IntelligenceReport = {
  stock: StockMetrics;
  score: ReturnType<typeof scoreStock>;
  dataSources: string[];
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
    latestFiling?: { form: string; filedDate: string; accessionNumber: string };
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
  aiSummary?: string;
  finalVerdict: {
    verdict: 'BUY CANDIDATE' | 'HOLD / WATCH' | 'AVOID / WAIT';
    confidence: number;
    reason: string;
  };
};

export type LiveStockProfileResult = {
  stock: StockMetrics;
  source: string;
  isFallback: boolean;
  warning?: string;
};

type FinnhubNewsItem = { headline?: string; summary?: string; datetime?: number };
type FinnhubRecommendation = { buy?: number; hold?: number; sell?: number; strongBuy?: number; strongSell?: number; period?: string };
type FinnhubInsider = { name?: string; share?: number; change?: number; transactionPrice?: number; transactionDate?: string };
type FinnhubQuote = { c?: number; dp?: number };
type FinnhubProfile = {
  name?: string;
  ticker?: string;
  marketCapitalization?: number;
  finnhubIndustry?: string;
  exchange?: string;
  country?: string;
  ipo?: string;
  weburl?: string;
  logo?: string;
};
type FinnhubMetric = {
  metric?: {
    peNormalizedAnnual?: number;
    peTTM?: number;
    forwardPE?: number;
    epsGrowth3Y?: number;
    revenueGrowth3Y?: number;
    netProfitMarginTTM?: number;
    totalDebtToEquityAnnual?: number;
    roeTTM?: number;
    dividendYieldIndicatedAnnual?: number;
    beta?: number;
    rsi14?: number;
  };
};

function fallbackStock(symbol: string): StockMetrics {
  const normalized = symbol.toUpperCase();
  return demoStocks[normalized] || {
    symbol: normalized,
    name: normalized,
    price: 0,
    changePercent: 0,
    pe: 30,
    forwardPe: 30,
    epsGrowth: 5,
    revenueGrowth: 5,
    profitMargin: 10,
    debtToEquity: 1,
    roe: 10,
    dividendYield: 0,
    analystTarget: 0,
    rsi: 50,
    beta: 1,
  };
}

export async function getFinnhubJson<T>(path: string): Promise<T | null> {
  const token = process.env.FINNHUB_API_KEY;
  if (!token) return null;
  try {
    const response = await fetch(`https://finnhub.io/api/v1${path}${path.includes('?') ? '&' : '?'}token=${token}`, { cache: 'no-store' });
    if (!response.ok) {
      console.warn(`Finnhub request failed for ${path}: HTTP ${response.status}`);
      return null;
    }
    return response.json() as Promise<T>;
  } catch (error) {
    console.error('Finnhub request failed', error);
    return null;
  }
}

async function buildStockFromFinnhubResult(symbol: string): Promise<LiveStockProfileResult> {
  const normalized = symbol.toUpperCase();
  const fallback = fallbackStock(normalized);
  const [quote, profile, metric] = await Promise.all([
    getFinnhubJson<FinnhubQuote>(`/quote?symbol=${normalized}`),
    getFinnhubJson<FinnhubProfile>(`/stock/profile2?symbol=${normalized}`),
    getFinnhubJson<FinnhubMetric>(`/stock/metric?symbol=${normalized}&metric=all`),
  ]);
  const metrics = metric?.metric || {};
  const livePrice = Number(quote?.c || 0);
  const price = Number(livePrice || fallback.price || 0);
  const forwardPe = Number(metrics.forwardPE || fallback.forwardPe || metrics.peTTM || 30);
  const pe = Number(metrics.peTTM || metrics.peNormalizedAnnual || fallback.pe || forwardPe);
  const analystTarget = fallback.analystTarget && fallback.analystTarget > 0 ? fallback.analystTarget : price > 0 ? price * 1.08 : 0;
  const isFallback = !(livePrice > 0) || !profile?.name || !metric?.metric;
  const missingParts = [
    livePrice > 0 ? '' : 'quote',
    profile?.name ? '' : 'company profile',
    metric?.metric ? '' : 'fundamental metrics',
  ].filter(Boolean);
  const warning = isFallback
    ? `Provider data was limited for ${normalized}. Missing or fallback-backed fields: ${missingParts.join(', ')}.`
    : undefined;

  return {
    source: isFallback ? 'finnhub + FinanceSphere fallback' : 'finnhub',
    isFallback,
    warning,
    stock: {
      symbol: normalized,
      name: profile?.name || fallback.name || normalized,
      price,
      changePercent: Number(quote?.dp || fallback.changePercent || 0),
      pe,
      forwardPe,
      epsGrowth: Number(metrics.epsGrowth3Y || fallback.epsGrowth || 5),
      revenueGrowth: Number(metrics.revenueGrowth3Y || fallback.revenueGrowth || 5),
      profitMargin: Number(metrics.netProfitMarginTTM || fallback.profitMargin || 10),
      debtToEquity: Number(metrics.totalDebtToEquityAnnual || fallback.debtToEquity || 1),
      roe: Number(metrics.roeTTM || fallback.roe || 10),
      dividendYield: Number(metrics.dividendYieldIndicatedAnnual || fallback.dividendYield || 0),
      analystTarget,
      rsi: Number(metrics.rsi14 || fallback.rsi || 50),
      beta: Number(metrics.beta || fallback.beta || 1),
      marketCap: profile?.marketCapitalization ? profile.marketCapitalization * 1_000_000 : fallback.marketCap,
      sector: fallback.sector,
      industry: profile?.finnhubIndustry || fallback.industry,
      exchange: profile?.exchange || fallback.exchange,
      country: profile?.country || fallback.country,
      ipo: profile?.ipo || fallback.ipo,
      website: profile?.weburl || fallback.website,
      logo: profile?.logo || fallback.logo,
    },
  };
}

export async function buildLiveStockProfile(symbol: string): Promise<StockMetrics> {
  const result = await buildStockFromFinnhubResult(symbol);
  return result.stock;
}

export async function buildLiveStockProfileResult(symbol: string): Promise<LiveStockProfileResult> {
  return buildStockFromFinnhubResult(symbol);
}

async function getSecLatestFiling(symbol: string): Promise<{ form: string; filedDate: string; accessionNumber: string } | null> {
  const userAgent = process.env.SEC_USER_AGENT;
  if (!userAgent) return null;
  try {
    const tickersResponse = await fetch('https://www.sec.gov/files/company_tickers.json', {
      headers: { 'User-Agent': userAgent, Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!tickersResponse.ok) return null;
    const tickers = await tickersResponse.json() as Record<string, { cik_str: number; ticker: string; title: string }>;
    const company = Object.values(tickers).find((entry) => entry.ticker.toUpperCase() === symbol.toUpperCase());
    if (!company) return null;
    const cik = String(company.cik_str).padStart(10, '0');
    const submissionsResponse = await fetch(`https://data.sec.gov/submissions/CIK${cik}.json`, {
      headers: { 'User-Agent': userAgent, Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!submissionsResponse.ok) return null;
    const submissions = await submissionsResponse.json();
    const forms: string[] = submissions?.filings?.recent?.form || [];
    const dates: string[] = submissions?.filings?.recent?.filingDate || [];
    const accessionNumbers: string[] = submissions?.filings?.recent?.accessionNumber || [];
    const index = forms.findIndex((form) => form === '10-K' || form === '10-Q');
    if (index < 0 || !forms[index] || !dates[index] || !accessionNumbers[index]) return null;
    return { form: forms[index], filedDate: dates[index], accessionNumber: accessionNumbers[index] };
  } catch (error) {
    console.error('SEC request failed', error);
    return null;
  }
}

async function generateAiSummary(reportSeed: string): Promise<string | undefined> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return undefined;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a cautious equity research assistant. Provide educational decision-support only, never personalized financial advice. Keep it under 140 words.' },
          { role: 'user', content: reportSeed },
        ],
        temperature: 0.3,
      }),
    });
    if (!response.ok) return undefined;
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    return typeof content === 'string' ? content : undefined;
  } catch (error) {
    console.error('OpenAI request failed', error);
    return undefined;
  }
}

export async function buildLiveStockIntelligenceReport(symbol: string): Promise<IntelligenceReport> {
  const profileResult = await buildStockFromFinnhubResult(symbol);
  const stock = profileResult.stock;
  const base = buildStockIntelligenceReport(stock.symbol, stock);
  const from = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10);
  const to = new Date().toISOString().slice(0, 10);

  const [news, recommendations, insider, filing] = await Promise.all([
    getFinnhubJson<FinnhubNewsItem[]>(`/company-news?symbol=${stock.symbol}&from=${from}&to=${to}`),
    getFinnhubJson<FinnhubRecommendation[]>(`/stock/recommendation?symbol=${stock.symbol}`),
    getFinnhubJson<{ data?: FinnhubInsider[] }>(`/stock/insider-transactions?symbol=${stock.symbol}`),
    getSecLatestFiling(stock.symbol),
  ]);

  const dataSources = ['FinanceSphere scoring model'];
  if (stock.price > 0) dataSources.push('Finnhub quote and metrics');
  if (news?.length) dataSources.push('Finnhub company news');
  if (recommendations?.length) dataSources.push('Finnhub analyst recommendations');
  if (insider?.data?.length) dataSources.push('Finnhub insider transactions');
  if (filing) dataSources.push('SEC EDGAR company filings');

  const latestRecommendation = recommendations?.[0];
  const bullishAnalysts = (latestRecommendation?.strongBuy || 0) + (latestRecommendation?.buy || 0);
  const bearishAnalysts = (latestRecommendation?.sell || 0) + (latestRecommendation?.strongSell || 0);
  const analystSignal = bullishAnalysts > bearishAnalysts + 2 ? 'Bullish' : bearishAnalysts > bullishAnalysts ? 'Bearish' : 'Neutral';

  const insiderRows = insider?.data || [];
  const insiderNetChange = insiderRows.slice(0, 20).reduce((sum, row) => sum + Number(row.change || 0), 0);
  const insiderSignal = insiderNetChange > 0 ? 'Bullish' : insiderNetChange < 0 ? 'Bearish' : 'Neutral';

  const newsHeadlines = (news || []).slice(0, 5).map((item) => item.headline || item.summary || '').filter(Boolean);
  const positiveWords = ['beat', 'growth', 'raises', 'upgrade', 'record', 'strong', 'profit'];
  const negativeWords = ['miss', 'cut', 'downgrade', 'weak', 'lawsuit', 'decline', 'probe'];
  const newsText = newsHeadlines.join(' ').toLowerCase();
  const positiveHits = positiveWords.filter((word) => newsText.includes(word)).length;
  const negativeHits = negativeWords.filter((word) => newsText.includes(word)).length;
  const newsSentiment = positiveHits > negativeHits ? 'Positive' : negativeHits > positiveHits ? 'Negative' : 'Neutral';

  const aiSummary = await generateAiSummary(`Analyze ${stock.symbol} (${stock.name}) for educational decision support. Score: ${base.score.total}/100. Rating: ${base.score.rating}. Price: ${stock.price}. Forward PE: ${stock.forwardPe}. EPS growth: ${stock.epsGrowth}%. Revenue growth: ${stock.revenueGrowth}%. Profit margin: ${stock.profitMargin}%. Debt/equity: ${stock.debtToEquity}. RSI: ${stock.rsi}. Recent news headlines: ${newsHeadlines.join(' | ') || 'No live headlines available'}. Analyst signal: ${analystSignal}. Insider signal: ${insiderSignal}. Latest SEC filing: ${filing ? `${filing.form} filed ${filing.filedDate}` : 'not available'}.`);
  if (aiSummary) dataSources.push('OpenAI AI summary');

  return {
    ...base,
    stock,
    score: scoreStock(stock),
    dataSources,
    aiSummary,
    secFiling: {
      ...base.secFiling,
      latestFiling: filing || undefined,
      riskFactors: filing ? [`Latest ${filing.form} filed on ${filing.filedDate}. Review risk factors and MD&A before investing.`, ...base.secFiling.riskFactors] : base.secFiling.riskFactors,
    },
    newsSentiment: {
      sentiment: newsSentiment,
      drivers: newsHeadlines.length ? newsHeadlines : base.newsSentiment.drivers,
    },
    insiderTransactions: {
      signal: insiderSignal,
      explanation: insiderRows.length ? `Recent insider net share change proxy: ${insiderNetChange.toLocaleString()} shares across latest reported transactions.` : base.insiderTransactions.explanation,
    },
    analystRevisions: {
      signal: analystSignal,
      explanation: latestRecommendation ? `Latest recommendation mix: strong buy ${latestRecommendation.strongBuy || 0}, buy ${latestRecommendation.buy || 0}, hold ${latestRecommendation.hold || 0}, sell ${latestRecommendation.sell || 0}, strong sell ${latestRecommendation.strongSell || 0}.` : base.analystRevisions.explanation,
    },
  };
}

export function buildStockIntelligenceReport(symbol: string, overrideStock?: StockMetrics): IntelligenceReport {
  const stock = overrideStock || fallbackStock(symbol);
  const score = scoreStock(stock);
  const upside = stock.price > 0 ? ((stock.analystTarget - stock.price) / stock.price) * 100 : 0;
  const highGrowth = stock.revenueGrowth > 12 && stock.epsGrowth > 12;
  const expensive = stock.forwardPe > 35;
  const volatile = stock.beta > 1.5;

  const verdict = score.total >= 78 && upside > 8 ? 'BUY CANDIDATE' : score.total < 55 || upside < -5 ? 'AVOID / WAIT' : 'HOLD / WATCH';
  const confidence = Math.min(95, Math.max(45, score.total + (upside > 10 ? 6 : upside < 0 ? -8 : 0)));

  return {
    stock,
    score,
    dataSources: ['FinanceSphere scoring model'],
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
      drivers: ['Product demand and earnings guidance', 'Analyst estimate revisions', 'Sector momentum and macro rate expectations'],
    },
    insiderTransactions: {
      signal: stock.forwardPe < 30 && upside > 10 ? 'Bullish' : expensive ? 'Neutral' : 'Neutral',
      explanation: 'This demo proxy is replaced with live insider data when FINNHUB_API_KEY is configured.',
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
      macroRisks: [stock.forwardPe > 35 ? 'High valuation is sensitive to interest-rate increases.' : 'Interest-rate sensitivity is moderate.', stock.beta > 1.5 ? 'High beta can underperform during broad risk-off markets.' : 'Beta profile is not extremely aggressive.'],
    },
    finalVerdict: {
      verdict,
      confidence,
      reason: `${stock.symbol} receives a ${score.total}/100 score with ${upside.toFixed(1)}% analyst-target upside. Verdict is based on valuation, growth, profitability, risk, and technical momentum.`,
    },
  };
}
