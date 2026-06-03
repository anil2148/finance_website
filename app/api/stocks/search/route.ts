import { NextResponse } from 'next/server';
import { STOCK_NO_STORE_HEADERS, stockFreshnessMeta } from '@/lib/stock-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type FinnhubSearchResult = {
  description?: string;
  displaySymbol?: string;
  exchange?: string;
  symbol?: string;
  type?: string;
};

type FinnhubSearchResponse = {
  result?: FinnhubSearchResult[];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').trim().toUpperCase();
  const token = process.env.FINNHUB_API_KEY;

  if (!query) {
    return NextResponse.json({ ...stockFreshnessMeta({ symbol: '', source: 'finnhub search' }), results: [] }, { headers: STOCK_NO_STORE_HEADERS });
  }

  if (!token) {
    return NextResponse.json(
      { ...stockFreshnessMeta({ symbol: query, source: 'finnhub search', isFallback: true, warning: 'FINNHUB_API_KEY is not configured.' }), results: [], message: 'Stock search is unavailable right now.' },
      { status: 500, headers: STOCK_NO_STORE_HEADERS }
    );
  }

  try {
    const response = await fetch(`https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${token}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { ...stockFreshnessMeta({ symbol: query, source: 'finnhub search', isFallback: true, warning: `Finnhub search returned HTTP ${response.status}.` }), results: [], message: `No fresh search results are available for ${query}.` },
        { status: response.status, headers: STOCK_NO_STORE_HEADERS }
      );
    }

    const data = await response.json() as FinnhubSearchResponse;
    const results = (data.result || [])
      .filter((item) => item.symbol && item.description)
      .filter((item) => !item.symbol?.includes('.') || item.symbol?.endsWith('.US'))
      .map((item) => ({
        symbol: item.displaySymbol || item.symbol,
        description: item.description,
        exchange: item.exchange || '',
        type: item.type || 'Common Stock',
      }))
      .sort((a, b) => {
        const aExact = a.symbol?.toUpperCase() === query ? 0 : 1;
        const bExact = b.symbol?.toUpperCase() === query ? 0 : 1;
        return aExact - bExact || String(a.symbol).localeCompare(String(b.symbol));
      })
      .slice(0, 10);

    return NextResponse.json(
      { ...stockFreshnessMeta({ symbol: query, source: 'finnhub search' }), results, message: results.length ? undefined : `No matches found for ${query}.` },
      { headers: STOCK_NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error(`Stock search failed for ${query}`, error);
    return NextResponse.json(
      { ...stockFreshnessMeta({ symbol: query, source: 'finnhub search', isFallback: true, warning: 'Search provider request failed.' }), results: [], message: `No matches found for ${query}.` },
      { status: 500, headers: STOCK_NO_STORE_HEADERS }
    );
  }
}
