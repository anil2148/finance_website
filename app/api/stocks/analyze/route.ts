import { NextResponse } from 'next/server';
import { demoStocks, scoreStock } from '@/lib/stocks';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || 'MSFT').toUpperCase();
  const stock = demoStocks[symbol] || demoStocks.MSFT;
  const score = scoreStock(stock);

  return NextResponse.json({
    stock,
    score,
    insight: `${stock.name} has a ${score.rating} rating with a ${score.total}/100 blended score. Review valuation, growth, profitability, debt, and RSI before making any investment decision.`,
    disclaimer: 'Educational information only. Not financial advice.',
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const symbol = String(body.symbol || 'MSFT').toUpperCase();
  const stock = demoStocks[symbol] || demoStocks.MSFT;
  const score = scoreStock(stock);

  return NextResponse.json({ stock, score });
}
