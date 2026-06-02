import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type FinnhubSearchResult = {
  description?: string;
  displaySymbol?: string;
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
    return NextResponse.json({ results: [] });
  }

  if (!token) {
    return NextResponse.json({ error: 'FINNHUB_API_KEY is not configured.' }, { status: 500 });
  }

  try {
    const response = await fetch(`https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${token}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Unable to search symbols.' }, { status: response.status });
    }

    const data = await response.json() as FinnhubSearchResponse;
    const results = (data.result || [])
      .filter((item) => item.symbol && item.description)
      .filter((item) => !item.symbol?.includes('.') || item.symbol?.endsWith('.US'))
      .slice(0, 10)
      .map((item) => ({
        symbol: item.displaySymbol || item.symbol,
        description: item.description,
        type: item.type || 'Common Stock',
      }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Stock search failed', error);
    return NextResponse.json({ error: 'Unable to search symbols right now.' }, { status: 500 });
  }
}
