import { NextResponse } from 'next/server';
import { STOCK_NO_STORE_HEADERS, stockFreshnessMeta } from '@/lib/stock-api';
import { demoStocks } from '@/lib/stocks';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || '').trim().toUpperCase();
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!symbol) {
    return NextResponse.json({ error: 'Stock symbol is required.' }, { status: 400, headers: STOCK_NO_STORE_HEADERS });
  }

  if (apiKey) {
    try {
      const quoteResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`, {
        cache: 'no-store',
      });
      const quote = await quoteResponse.json();
      const fallback = demoStocks[symbol];
      if (!fallback && !Number(quote.c)) {
        return NextResponse.json(
          { ...stockFreshnessMeta({ symbol, source: 'finnhub quote', isFallback: true, warning: `No quote data found for ${symbol}.` }), error: `No quote data found for ${symbol}.` },
          { status: 404, headers: STOCK_NO_STORE_HEADERS }
        );
      }

      return NextResponse.json({
        ...stockFreshnessMeta({ symbol, source: 'finnhub quote', isFallback: !Number(quote.c) }),
        ...(fallback || { symbol, name: symbol, price: 0, changePercent: 0 }),
        symbol,
        price: Number(quote.c || fallback?.price || 0),
        changePercent: Number(quote.dp || fallback?.changePercent || 0),
      }, { headers: STOCK_NO_STORE_HEADERS });
    } catch (error) {
      console.error(`Stock quote fetch failed for ${symbol}`, error);
    }
  }

  const fallback = demoStocks[symbol];
  if (!fallback) {
    return NextResponse.json(
      { ...stockFreshnessMeta({ symbol, source: 'demo quote fallback', isFallback: true, warning: `No quote fallback is available for ${symbol}.` }), error: `No quote data found for ${symbol}.` },
      { status: 404, headers: STOCK_NO_STORE_HEADERS }
    );
  }

  return NextResponse.json(
    { ...stockFreshnessMeta({ symbol, source: 'demo quote fallback', isFallback: true, warning: 'Live quote provider is unavailable. Showing marked demo fallback data.' }), ...fallback },
    { headers: STOCK_NO_STORE_HEADERS }
  );
}
