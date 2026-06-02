import { NextResponse } from 'next/server';
import { buildLiveStockIntelligenceReport } from '@/lib/stock-intelligence';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || 'MSFT').toUpperCase();

  try {
    const report = await buildLiveStockIntelligenceReport(symbol);
    return NextResponse.json(report);
  } catch (error) {
    console.error('Live stock intelligence failed', error);
    return NextResponse.json(
      { error: 'Unable to build stock intelligence report right now.' },
      { status: 500 }
    );
  }
}
