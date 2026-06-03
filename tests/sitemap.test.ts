import assert from 'node:assert/strict';
import sitemap from '@/app/sitemap';
import { absoluteUrl } from '@/lib/seo';
import { getAllIndexableRoutes } from '@/lib/sitemap-routes';
import { createUrlSetXml } from '@/lib/sitemap-xml';

const REQUIRED_PUBLIC_PATHS = ['/', '/stock-analyzer', '/stock-opportunity', '/pdf-editor'];
const CHILD_SITEMAP_PATH_PATTERN = /\/sitemap-[^/]+\.xml/;

export function runSitemapTests() {
  const routeEntries = getAllIndexableRoutes();
  const sitemapEntries = sitemap();
  const sitemapUrls = sitemapEntries.map((entry) => entry.url);

  assert.ok(routeEntries.length > 0, 'Sitemap route list should not be empty');
  assert.ok(sitemapEntries.length > 0, 'Sitemap output should not be empty');
  assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'Sitemap output must not contain duplicate URLs');

  for (const pathname of REQUIRED_PUBLIC_PATHS) {
    assert.ok(
      sitemapUrls.includes(absoluteUrl(pathname)),
      `Sitemap must include required public URL: ${absoluteUrl(pathname)}`,
    );
  }

  for (const url of sitemapUrls) {
    assert.ok(url.startsWith('https://www.financesphere.io/'), `Sitemap URL must be absolute and canonical: ${url}`);
    assert.equal(url.includes('localhost'), false, `Sitemap URL must not include localhost: ${url}`);
    assert.equal(url.includes('/api/'), false, `Sitemap URL must not include API routes: ${url}`);
    assert.equal(url.includes('/admin/'), false, `Sitemap URL must not include admin routes: ${url}`);
  }

  const xml = createUrlSetXml(routeEntries);
  assert.ok(xml.includes('<urlset'), 'Root sitemap XML should be a urlset document');
  assert.equal(xml.includes('<sitemapindex'), false, 'Root sitemap must not be a sitemapindex document');
  assert.equal(CHILD_SITEMAP_PATH_PATTERN.test(xml), false, 'Root sitemap must not reference nested child sitemap files');
}
