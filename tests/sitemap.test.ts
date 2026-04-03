import assert from 'node:assert/strict';
import { getCanonicalUrl } from '@/lib/seo-locale-routes';
import { getSitemapRoutesByRegion } from '@/lib/sitemap-routes';
import { createSitemapIndexXml } from '@/lib/sitemap-xml';

function isIndiaPath(pathname: string) {
  return pathname === '/in' || pathname.startsWith('/in/');
}

export function runSitemapTests() {
  const usRoutes = getSitemapRoutesByRegion('us');
  const inRoutes = getSitemapRoutesByRegion('in');

  assert.ok(usRoutes.length > 0, 'US sitemap route list should not be empty');
  assert.ok(inRoutes.length > 0, 'India sitemap route list should not be empty');

  for (const entry of usRoutes) {
    assert.equal(isIndiaPath(entry.pathname), false, `US sitemap must not contain India route: ${entry.pathname}`);
    assert.equal(getCanonicalUrl(entry.pathname, 'us'), entry.pathname, `US sitemap route must be canonical for US: ${entry.pathname}`);
  }

  for (const entry of inRoutes) {
    assert.equal(isIndiaPath(entry.pathname), true, `India sitemap must contain only /in routes: ${entry.pathname}`);
    assert.equal(getCanonicalUrl(entry.pathname, 'in'), entry.pathname, `India sitemap route must be canonical for India: ${entry.pathname}`);
  }

  const overlap = usRoutes.filter((usEntry) => inRoutes.some((inEntry) => inEntry.pathname === usEntry.pathname));
  assert.equal(overlap.length, 0, 'US and India sitemap route sets must not overlap');

  const indexXml = createSitemapIndexXml(['/sitemap-us.xml', '/sitemap-in.xml']);
  assert.ok(indexXml.includes('<sitemapindex'), 'Root sitemap must be a sitemapindex document');
  assert.equal(indexXml.includes('<urlset'), false, 'Root sitemap must not be a urlset document');
  assert.ok(indexXml.includes('/sitemap-us.xml'), 'Root sitemap index must include US child sitemap');
  assert.ok(indexXml.includes('/sitemap-in.xml'), 'Root sitemap index must include India child sitemap');
}
