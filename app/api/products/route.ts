import { NextResponse } from 'next/server';
import { getFinancialProducts } from '@/lib/financialProducts';

export async function GET() {
  return NextResponse.json(getFinancialProducts(), {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
