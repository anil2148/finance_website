import { NextResponse } from 'next/server';
import { STOCK_NO_STORE_HEADERS, stockFreshnessMeta } from '@/lib/stock-api';
import { getFinnhubJson } from '@/lib/stock-intelligence';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type InsiderTransaction = {
  name?: string;
  share?: number;
  change?: number;
  transactionPrice?: number;
  transactionDate?: string;
  transactionCode?: string;
};

type InsiderResponse = {
  data?: InsiderTransaction[];
};

type OwnershipItem = {
  name?: string;
  share?: number;
  change?: number;
  filingDate?: string;
  reportDate?: string;
};

type OwnershipResponse = {
  ownership?: OwnershipItem[];
  data?: OwnershipItem[];
};

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function computeSignal(value: number) {
  if (value > 0) return 'Bullish';
  if (value < 0) return 'Bearish';
  return 'Neutral';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || '').trim().toUpperCase();

  if (!symbol) {
    return NextResponse.json({ error: 'Stock symbol is required.' }, { status: 400, headers: STOCK_NO_STORE_HEADERS });
  }

  const [insider, ownership] = await Promise.all([
    getFinnhubJson<InsiderResponse>(`/stock/insider-transactions?symbol=${symbol}`),
    getFinnhubJson<OwnershipResponse>(`/stock/ownership?symbol=${symbol}`),
  ]);

  const insiderRows = (insider?.data || []).slice(0, 30);
  const insiderNetShares = sum(insiderRows.map((row) => Number(row.change || 0)));
  const insiderBuys = insiderRows.filter((row) => Number(row.change || 0) > 0).length;
  const insiderSells = insiderRows.filter((row) => Number(row.change || 0) < 0).length;

  const ownershipRows = (ownership?.ownership || ownership?.data || []).slice(0, 10);
  const institutionalNetChange = sum(ownershipRows.map((row) => Number(row.change || 0)));

  const smartMoneyScore = Math.max(0, Math.min(100,
    50 +
    (insiderNetShares > 0 ? 12 : insiderNetShares < 0 ? -12 : 0) +
    (institutionalNetChange > 0 ? 12 : institutionalNetChange < 0 ? -12 : 0) +
    (ownershipRows.length >= 5 ? 6 : 0)
  ));

  const warnings = [
    ...(insiderRows.length ? [] : ['No insider transaction rows were returned by the provider.']),
    ...(ownershipRows.length ? [] : ['No institutional ownership rows were returned by the provider or API tier.']),
  ];

  return NextResponse.json(
    {
      ...stockFreshnessMeta({ symbol, source: 'finnhub smart money', isFallback: warnings.length > 0, warning: warnings.join(' ') }),
      score: smartMoneyScore,
      signal: smartMoneyScore >= 65 ? 'Bullish' : smartMoneyScore <= 40 ? 'Bearish' : 'Neutral',
      insider: {
        signal: computeSignal(insiderNetShares),
        netShares: insiderNetShares,
        buys: insiderBuys,
        sells: insiderSells,
        transactions: insiderRows.map((row) => ({
          name: row.name,
          date: row.transactionDate,
          change: row.change,
          shares: row.share,
          price: row.transactionPrice,
          code: row.transactionCode,
        })),
      },
      institutional: {
        signal: computeSignal(institutionalNetChange),
        netChange: institutionalNetChange,
        holders: ownershipRows.map((row) => ({
          name: row.name,
          shares: row.share,
          change: row.change,
          filingDate: row.filingDate,
          reportDate: row.reportDate,
        })),
      },
      warnings,
    },
    { headers: STOCK_NO_STORE_HEADERS }
  );
}
