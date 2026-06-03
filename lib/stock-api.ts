export const STOCK_NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export function stockFreshnessMeta({
  symbol,
  source,
  isFallback = false,
  warning,
}: {
  symbol: string;
  source: string;
  isFallback?: boolean;
  warning?: string;
}) {
  return {
    symbol: symbol.trim().toUpperCase(),
    fetchedAt: new Date().toISOString(),
    source,
    isFallback,
    ...(warning ? { warning } : {}),
  };
}
