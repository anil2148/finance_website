import { NextRequest, NextResponse } from 'next/server';
import { getExchangeRates } from '@/lib/api/currency';

export const revalidate = 900;

export async function GET(request: NextRequest) {
  const base = request.nextUrl.searchParams.get('base') ?? 'USD';
  const rates = await getExchangeRates(base);

  return NextResponse.json(rates, {
    headers: {
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600'
    }
  });
}
