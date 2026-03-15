import { NextResponse } from 'next/server';
import { getCurrencyList } from '@/lib/api/currency';

export const revalidate = 86400;

export async function GET() {
  const currencies = getCurrencyList();

  return NextResponse.json(
    {
      currencies,
      updatedAt: new Date().toISOString()
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
      }
    }
  );
}
