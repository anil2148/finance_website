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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || '').trim().toUpperCase();

  if (!symbol) {
    return NextResponse.json({ error: 'Stock symbol is required.' }, { status: 400 });
  }

  const earnings = await getFinnhubJson<FinnhubEarningsItem[]>(`/stock/earnings?symbol=${symbol}`);

  return NextResponse.json({
    symbol,
    earnings: earnings || [],
  });
}
