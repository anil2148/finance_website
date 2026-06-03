import { NextResponse } from 'next/server';
import { getFinnhubJson } from '@/lib/stock-intelligence';

export const runtime = 'nodejs';

type EarningsItem = {
  date?: string;
  epsActual?: number;
  epsEstimate?: number;
  revenueActual?: number;
  revenueEstimate?: number;
  quarter?: number;
  year?: number;
  source?: string;
};

type EarningsCalendarResponse = {
  earningsCalendar?: Array<{
    date?: string;
    epsActual?: number;
    epsEstimate?: number;
    revenueActual?: number;
    revenueEstimate?: number;
  }>;
};

type AlphaVantageEarningsResponse = {
  quarterlyEarnings?: Array<{
    fiscalDateEnding?: string;
    reportedDate?: string;
    reportedEPS?: string;
    estimatedEPS?: string;
    surprise?: string;
    surprisePercentage?: string;
  }>;
  Information?: string;
  Note?: string;
};

async function getAlphaVantageEarnings(symbol: string): Promise<{ earnings: EarningsItem[]; warning?: string }> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) return { earnings: [], warning: 'ALPHA_VANTAGE_API_KEY is not configured.' };

  try {
    const response = await fetch(`https://www.alphavantage.co/query?function=EARNINGS&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`, {
      next: { revalidate: 21600 },
    });
    if (!response.ok) return { earnings: [], warning: `Alpha Vantage returned HTTP ${response.status}.` };
    const data = await response.json() as AlphaVantageEarningsResponse;
    if (data.Note || data.Information) return { earnings: [], warning: data.Note || data.Information };

    const earnings = (data.quarterlyEarnings || []).slice(0, 12).map((item) => ({
      date: item.reportedDate || item.fiscalDateEnding,
      epsActual: Number.isFinite(Number(item.reportedEPS)) ? Number(item.reportedEPS) : undefined,
      epsEstimate: Number.isFinite(Number(item.estimatedEPS)) ? Number(item.estimatedEPS) : undefined,
      source: 'Alpha Vantage',
    }));

    return { earnings };
  } catch (error) {
    return { earnings: [], warning: error instanceof Error ? error.message : 'Alpha Vantage request failed.' };
  }
}

function buildManualResearchLinks(symbol: string) {
  return [
    {
      label: 'SEC EDGAR company search',
      url: `https://www.sec.gov/edgar/search/#/q=${encodeURIComponent(symbol)}&dateRange=custom&category=form-cat1`,
      guidance: 'Use this to review 10-K, 10-Q, and 8-K filings when provider earnings data is missing.',
    },
    {
      label: 'Company investor relations search',
      url: `https://www.google.com/search?q=${encodeURIComponent(`${symbol} investor relations earnings results`)}`,
      guidance: 'Use this to find the official earnings press release and quarterly presentation.',
    },
  ];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || '').trim().toUpperCase();

  if (!symbol) {
    return NextResponse.json({ error: 'Stock symbol is required.' }, { status: 400 });
  }

  const warnings: string[] = [];
  const history = await getFinnhubJson<EarningsItem[]>(`/stock/earnings?symbol=${symbol}`);

  if (history?.length) {
    return NextResponse.json({
      symbol,
      source: 'Finnhub historical earnings',
      providerPriority: ['Finnhub historical earnings'],
      earnings: history.map((item) => ({ ...item, source: 'Finnhub' })),
      warnings,
      researchLinks: buildManualResearchLinks(symbol),
    });
  }

  warnings.push('Finnhub historical earnings returned no rows.');

  const today = new Date();
  const from = today.toISOString().slice(0, 10);
  const future = new Date(today);
  future.setMonth(future.getMonth() + 6);
  const to = future.toISOString().slice(0, 10);

  const calendar = await getFinnhubJson<EarningsCalendarResponse>(`/calendar/earnings?from=${from}&to=${to}&symbol=${symbol}`);
  const calendarEarnings = (calendar?.earningsCalendar || []).map((item) => ({
    date: item.date,
    epsActual: item.epsActual,
    epsEstimate: item.epsEstimate,
    revenueActual: item.revenueActual,
    revenueEstimate: item.revenueEstimate,
    source: 'Finnhub Calendar',
  }));

  if (calendarEarnings.length) {
    return NextResponse.json({
      symbol,
      source: 'Finnhub earnings calendar',
      providerPriority: ['Finnhub historical earnings', 'Finnhub earnings calendar'],
      earnings: calendarEarnings,
      warnings,
      researchLinks: buildManualResearchLinks(symbol),
    });
  }

  warnings.push('Finnhub earnings calendar returned no rows.');

  const alpha = await getAlphaVantageEarnings(symbol);
  if (alpha.warning) warnings.push(alpha.warning);
  if (alpha.earnings.length) {
    return NextResponse.json({
      symbol,
      source: 'Alpha Vantage quarterly earnings',
      providerPriority: ['Finnhub historical earnings', 'Finnhub earnings calendar', 'Alpha Vantage quarterly earnings'],
      earnings: alpha.earnings,
      warnings,
      researchLinks: buildManualResearchLinks(symbol),
    });
  }

  return NextResponse.json({
    symbol,
    source: 'manual research required',
    providerPriority: ['Finnhub historical earnings', 'Finnhub earnings calendar', 'Alpha Vantage quarterly earnings', 'SEC EDGAR manual review', 'Company investor relations manual review'],
    earnings: [],
    warnings,
    researchLinks: buildManualResearchLinks(symbol),
  });
}
