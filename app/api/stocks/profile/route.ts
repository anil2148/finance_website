import { NextResponse } from 'next/server';
import { buildLiveStockProfile } from '@/lib/stock-intelligence';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || '').trim().toUpperCase();

  if (!symbol) {
    return NextResponse.json({ error: 'Stock symbol is required.' }, { status: 400 });
  }

  try {
    const stock = await buildLiveStockProfile(symbol);
    if (!stock || stock.price <= 0) {
      return NextResponse.json({ error: `No live stock profile found for ${symbol}.` }, { status: 404 });
    }
    return NextResponse.json({ stock, source: 'finnhub' });
  } catch (error) {
    console.error('Live stock profile failed', error);
    return NextResponse.json({ error: 'Unable to load live stock profile right now.' }, { status: 500 });
  }
}
