import { NextResponse } from 'next/server';
import { demoStocks } from '@/lib/stocks';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || 'MSFT').toUpperCase();
  const apiKey = process.env.FINNHUB_API_KEY;

  if (apiKey) {
    try {
      const quoteResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`, {
        next: { revalidate: 60 },
      });
      const quote = await quoteResponse.json();
      const fallback = demoStocks[symbol] || demoStocks.MSFT;

      return NextResponse.json({
        ...fallback,
        symbol,
        price: Number(quote.c || fallback.price),
        changePercent: Number(quote.dp || fallback.changePercent),
        source: 'finnhub',
      });
    } catch (error) {
      console.error('Stock quote fetch failed', error);
    }
  }

  return NextResponse.json({ ...(demoStocks[symbol] || demoStocks.MSFT), source: 'demo' });
}
