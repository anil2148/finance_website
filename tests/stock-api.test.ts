import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { STOCK_NO_STORE_HEADERS, stockFreshnessMeta } from '../lib/stock-api';

const repoRoot = process.cwd();

function read(filePath: string) {
  return fs.readFileSync(path.join(repoRoot, filePath), 'utf8');
}

export function runStockApiTests() {
  assert.equal(
    STOCK_NO_STORE_HEADERS['Cache-Control'],
    'no-store, no-cache, must-revalidate, proxy-revalidate',
    'stock API responses should forbid browser and CDN caching'
  );

  const meta = stockFreshnessMeta({ symbol: 'sofi', source: 'test-source', isFallback: true, warning: 'limited provider data' });
  assert.equal(meta.symbol, 'SOFI', 'freshness metadata should normalize ticker symbols');
  assert.equal(meta.isFallback, true, 'freshness metadata should preserve fallback state');
  assert.equal(meta.warning, 'limited provider data', 'freshness metadata should preserve warnings');
  assert.match(meta.fetchedAt, /^\d{4}-\d{2}-\d{2}T/, 'freshness metadata should include an ISO timestamp');

  const stockRoutes = [
    'app/api/stocks/search/route.ts',
    'app/api/stocks/profile/route.ts',
    'app/api/stocks/candles/route.ts',
    'app/api/stocks/earnings/route.ts',
    'app/api/stocks/smart-money/route.ts',
    'app/api/stocks/intelligence/route.ts',
    'app/api/stocks/quote/route.ts',
    'app/api/stocks/chat/route.ts',
    'app/api/stocks/analyze/route.ts',
  ];

  for (const route of stockRoutes) {
    const source = read(route);
    assert.match(source, /dynamic\s*=\s*'force-dynamic'/, `${route} should force dynamic stock data`);
    assert.match(source, /revalidate\s*=\s*0/, `${route} should disable route revalidation`);
    assert.match(source, /STOCK_NO_STORE_HEADERS/, `${route} should send no-cache headers`);
  }

  const searchRoute = read('app/api/stocks/search/route.ts');
  assert.ok(!searchRoute.includes('demoStocks.MSFT'), 'search route should not use MSFT fallback results');

  const liveRoutes = [
    'app/api/stocks/profile/route.ts',
    'app/api/stocks/intelligence/route.ts',
    'app/api/stocks/quote/route.ts',
    'app/api/stocks/analyze/route.ts',
  ];
  for (const route of liveRoutes) {
    const source = read(route);
    assert.ok(!source.includes("|| 'MSFT'"), `${route} should not default missing ticker requests to MSFT`);
    assert.ok(!source.includes('|| demoStocks.MSFT'), `${route} should not silently fallback to MSFT data`);
  }
}
