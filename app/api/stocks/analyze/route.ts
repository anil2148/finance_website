import { NextResponse } from 'next/server';
import { STOCK_NO_STORE_HEADERS, stockFreshnessMeta } from '@/lib/stock-api';
import { demoStocks, scoreStock } from '@/lib/stocks';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || '').trim().toUpperCase();
  if (!symbol) return NextResponse.json({ error: 'Stock symbol is required.' }, { status: 400, headers: STOCK_NO_STORE_HEADERS });
  const stock = demoStocks[symbol];
  if (!stock) return NextResponse.json({ ...stockFreshnessMeta({ symbol, source: 'demo analyzer', isFallback: true, warning: `No demo analyzer data is available for ${symbol}.` }), error: `No demo analyzer data is available for ${symbol}.` }, { status: 404, headers: STOCK_NO_STORE_HEADERS });
  const score = scoreStock(stock);

  return NextResponse.json({
    ...stockFreshnessMeta({ symbol, source: 'demo analyzer', isFallback: true, warning: 'This legacy analyzer route uses marked demo data.' }),
    stock,
    score,
    insight: `${stock.name} has a ${score.rating} rating with a ${score.total}/100 blended score. Review valuation, growth, profitability, debt, and RSI before making any investment decision.`,
    disclaimer: 'Educational information only. Not financial advice.',
  }, { headers: STOCK_NO_STORE_HEADERS });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const symbol = String(body.symbol || '').trim().toUpperCase();
  if (!symbol) return NextResponse.json({ error: 'Stock symbol is required.' }, { status: 400, headers: STOCK_NO_STORE_HEADERS });
  const stock = demoStocks[symbol];
  if (!stock) return NextResponse.json({ ...stockFreshnessMeta({ symbol, source: 'demo analyzer', isFallback: true, warning: `No demo analyzer data is available for ${symbol}.` }), error: `No demo analyzer data is available for ${symbol}.` }, { status: 404, headers: STOCK_NO_STORE_HEADERS });
  const score = scoreStock(stock);

  return NextResponse.json({ ...stockFreshnessMeta({ symbol, source: 'demo analyzer', isFallback: true, warning: 'This legacy analyzer route uses marked demo data.' }), stock, score }, { headers: STOCK_NO_STORE_HEADERS });
}
