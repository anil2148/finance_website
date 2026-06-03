import { NextResponse } from 'next/server';
import { STOCK_NO_STORE_HEADERS, stockFreshnessMeta } from '@/lib/stock-api';
import { buildLiveStockIntelligenceReport } from '@/lib/stock-intelligence';

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
    const report = await buildLiveStockIntelligenceReport(symbol);
    return NextResponse.json(
      { ...stockFreshnessMeta({ symbol, source: report.dataSources.join(', ') || 'FinanceSphere scoring model', isFallback: !report.dataSources.some((source) => source.toLowerCase().includes('finnhub')) }), ...report },
      { headers: STOCK_NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error(`Live stock intelligence failed for ${symbol}`, error);
    return NextResponse.json(
      { ...stockFreshnessMeta({ symbol, source: 'FinanceSphere intelligence', isFallback: true, warning: 'Unable to build stock intelligence report right now.' }), error: `Unable to build stock intelligence report for ${symbol} right now.` },
      { status: 500, headers: STOCK_NO_STORE_HEADERS }
    );
  }
}
