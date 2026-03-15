import { NextRequest, NextResponse } from 'next/server';
import { convertCurrency } from '@/lib/api/currency';

export const revalidate = 900;

export async function GET(request: NextRequest) {
  const amount = Number(request.nextUrl.searchParams.get('amount') ?? 0);
  const from = request.nextUrl.searchParams.get('from') ?? 'USD';
  const to = request.nextUrl.searchParams.get('to') ?? 'EUR';

  const result = await convertCurrency(amount, from, to);

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600'
    }
  });
}
