import assert from 'node:assert/strict';
import { shouldIncludeInSitemap } from '../lib/seo/sitemap-filter';
import { isIndexableRoute } from '../lib/seo-locale-routes';

export function runSitemapValidationRegressionTests() {
  assert.equal(shouldIncludeInSitemap('/'), true, 'Homepage should be sitemap-eligible');
  assert.equal(shouldIncludeInSitemap('/in'), true, 'India homepage should be sitemap-eligible');
  assert.equal(shouldIncludeInSitemap('/in/blog'), false, 'India blog hub should not be included when not explicitly whitelisted');
  assert.equal(shouldIncludeInSitemap('/in/blog/sip-vs-fd'), true, 'India SIP vs FD guide should be included as a blog article');
  assert.equal(shouldIncludeInSitemap('/in/blog/ppf-vs-elss'), true, 'India PPF vs ELSS guide should be included as a blog article');

  assert.equal(
    shouldIncludeInSitemap('/preview/launch-checklist'),
    false,
    'Preview URLs should never be included in sitemap output'
  );

  assert.equal(
    shouldIncludeInSitemap('/blog/sip-vs-fd', { canonical: '/blog/ppf-vs-elss' }),
    false,
    'Non-canonical routes should be excluded from sitemap output'
  );

  assert.equal(
    shouldIncludeInSitemap('/in/blog/sip-vs-fd', { canonical: '/blog/sip-vs-fd' }),
    false,
    'Wrong-country canonical mismatch should be excluded from sitemap output'
  );

  assert.equal(isIndexableRoute('/best-credit-cards'), false, 'Redirect-only routes should fail indexability checks');
  assert.equal(isIndexableRoute('/preview/launch-checklist'), true, 'Preview detection is enforced by sitemap filter, not locale route guard');
}
