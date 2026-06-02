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

function buildSyntheticCandles(symbol: string) {
  const base = Math.max(5, symbol.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 180);
  const today = new Date();
  return Array.from({ length: 120 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (119 - index));
    const wave = Math.sin(index / 9) * 4 + Math.cos(index / 17) * 3;
    const trend = index * 0.08;
    const close = Number((base + wave + trend).toFixed(2));
    return {
      date: date.toISOString().slice(0, 10),
      open: close,
      high: Number((close * 1.015).toFixed(2)),
      low: Number((close * 0.985).toFixed(2)),
      close,
      volume: 0,
    };
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || '').trim().toUpperCase();
  const resolution = searchParams.get('resolution') || 'D';
  const now = Math.floor(Date.now() / 1000);
  const from = Number(searchParams.get('from')) || now - 60 * 60 * 24 * 365;
  const to = Number(searchParams.get('to')) || now;

  if (!symbol) {
    return NextResponse.json({ error: 'Stock symbol is required.', candles: [] }, { status: 400 });
  }

  const data = await getFinnhubJson<FinnhubCandleResponse>(`/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`);

  if (!data || data.s !== 'ok' || !data.t?.length) {
    return NextResponse.json({
      symbol,
      source: 'fallback',
      warning: 'Finnhub historical candle data was unavailable for this symbol or account tier. Showing illustrative chart data.',
      candles: buildSyntheticCandles(symbol),
    });
  }

  const candles = data.t.map((timestamp, index) => ({
    date: new Date(timestamp * 1000).toISOString().slice(0, 10),
    open: data.o?.[index] ?? 0,
    high: data.h?.[index] ?? 0,
    low: data.l?.[index] ?? 0,
    close: data.c?.[index] ?? 0,
    volume: data.v?.[index] ?? 0,
  }));

  return NextResponse.json({ symbol, source: 'finnhub', candles });
}
