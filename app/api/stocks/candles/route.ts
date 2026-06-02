import { NextResponse } from 'next/server';
import { getFinnhubJson } from '@/lib/stock-intelligence';

export const runtime = 'nodejs';

type FinnhubCandleResponse = {
  c?: number[];
  h?: number[];
  l?: number[];
  o?: number[];
  s?: string;
  t?: number[];
  v?: number[];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || '').trim().toUpperCase();
  const resolution = searchParams.get('resolution') || 'D';
  const now = Math.floor(Date.now() / 1000);
  const from = Number(searchParams.get('from')) || now - 60 * 60 * 24 * 365;
  const to = Number(searchParams.get('to')) || now;

  if (!symbol) {
    return NextResponse.json({ error: 'Stock symbol is required.' }, { status: 400 });
  }

  const data = await getFinnhubJson<FinnhubCandleResponse>(`/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`);

  if (!data || data.s !== 'ok' || !data.t?.length) {
    return NextResponse.json({ error: `No historical price data found for ${symbol}.`, candles: [] }, { status: 404 });
  }

  const candles = data.t.map((timestamp, index) => ({
    date: new Date(timestamp * 1000).toISOString().slice(0, 10),
    open: data.o?.[index] ?? 0,
    high: data.h?.[index] ?? 0,
    low: data.l?.[index] ?? 0,
    close: data.c?.[index] ?? 0,
    volume: data.v?.[index] ?? 0,
  }));

  return NextResponse.json({ symbol, candles });
}
