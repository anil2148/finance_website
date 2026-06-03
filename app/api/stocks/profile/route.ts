import { NextResponse } from 'next/server';
import { STOCK_NO_STORE_HEADERS, stockFreshnessMeta } from '@/lib/stock-api';
import { buildLiveStockProfileResult } from '@/lib/stock-intelligence';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || '').trim().toUpperCase();

  if (!symbol) {
    return NextResponse.json({ error: 'Stock symbol is required.' }, { status: 400, headers: STOCK_NO_STORE_HEADERS });
  }

  try {
    const result = await buildLiveStockProfileResult(symbol);
    const { stock } = result;
    if (!stock || stock.price <= 0) {
      return NextResponse.json(
        {
          ...stockFreshnessMeta({ symbol, source: result.source, isFallback: true, warning: result.warning || `No live stock profile found for ${symbol}.` }),
          error: `No live stock profile found for ${symbol}.`,
        },
        { status: 404, headers: STOCK_NO_STORE_HEADERS }
      );
    }
    return NextResponse.json(
      {
        ...stockFreshnessMeta({ symbol, source: result.source, isFallback: result.isFallback, warning: result.warning }),
        stock,
      },
      { headers: STOCK_NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error(`Live stock profile failed for ${symbol}`, error);
    return NextResponse.json(
      { ...stockFreshnessMeta({ symbol, source: 'finnhub', isFallback: true, warning: 'Provider request failed.' }), error: `Unable to load live stock profile for ${symbol} right now.` },
      { status: 500, headers: STOCK_NO_STORE_HEADERS }
    );
  }
}
