import { NextResponse } from 'next/server';
import { getFinnhubJson } from '@/lib/stock-intelligence';

export const runtime = 'nodejs';

type FinnhubEarningsItem = {
  date?: string;
  epsActual?: number;
  epsEstimate?: number;
  revenueActual?: number;
  revenueEstimate?: number;
  quarter?: number;
  year?: number;
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || '').trim().toUpperCase();

  if (!symbol) {
    return NextResponse.json({ error: 'Stock symbol is required.' }, { status: 400 });
  }

  const history = await getFinnhubJson<FinnhubEarningsItem[]>(`/stock/earnings?symbol=${symbol}`);

  if (history?.length) {
    return NextResponse.json({
      symbol,
      source: 'history',
      earnings: history,
    });
  }

  const today = new Date();
  const from = today.toISOString().slice(0, 10);
  const future = new Date(today);
  future.setMonth(future.getMonth() + 6);
  const to = future.toISOString().slice(0, 10);

  const calendar = await getFinnhubJson<EarningsCalendarResponse>(`/calendar/earnings?from=${from}&to=${to}&symbol=${symbol}`);

  const earnings = (calendar?.earningsCalendar || []).map((item) => ({
    date: item.date,
    epsActual: item.epsActual,
    epsEstimate: item.epsEstimate,
    revenueActual: item.revenueActual,
    revenueEstimate: item.revenueEstimate,
  }));

  return NextResponse.json({
    symbol,
    source: 'calendar',
    earnings,
  });
}
