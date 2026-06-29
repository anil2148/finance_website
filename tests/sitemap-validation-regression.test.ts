import assert from 'node:assert/strict';
import { shouldIncludeInSitemap } from '../lib/seo/sitemap-filter';
import { isIndexableRoute } from '../lib/seo-locale-routes';

export function runSitemapValidationRegressionTests() {
  assert.equal(shouldIncludeInSitemap('/'), true, 'Homepage should be sitemap-eligible');
  assert.equal(shouldIncludeInSitemap('/in'), true, 'India homepage should be sitemap-eligible');
  assert.equal(shouldIncludeInSitemap('/in/blog'), true, 'India blog hub should be sitemap-eligible as an editorial hub');
  assert.equal(shouldIncludeInSitemap('/in/blog/sip-vs-fd'), true, 'India SIP vs FD guide should be included as a blog article');
  assert.equal(shouldIncludeInSitemap('/in/blog/ppf-vs-elss'), true, 'India PPF vs ELSS guide should be included as a blog article');
  assert.equal(shouldIncludeInSitemap('/blog'), true, 'US blog hub should be sitemap-eligible');
  assert.equal(shouldIncludeInSitemap('/learn'), true, 'Learn hub should be sitemap-eligible');
  assert.equal(shouldIncludeInSitemap('/tools'), true, 'Tools hub should be sitemap-eligible when content-rich');
  assert.equal(shouldIncludeInSitemap('/options-trading'), true, 'Options education hub should be sitemap-eligible');
  assert.equal(shouldIncludeInSitemap('/in/tax-saving-strategies'), true, 'India static guide pages should be sitemap-eligible');
  assert.equal(shouldIncludeInSitemap('/media-kit'), false, 'Media kit utility page should stay out of sitemap');

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
  assert.equal(isIndexableRoute('/blog/tag/investing'), false, 'Blog tag archives should not be indexable landing pages');
  assert.equal(isIndexableRoute('/blog/category/investing'), false, 'Blog category archives should not be indexable landing pages');
  assert.equal(isIndexableRoute('/compare/credit-cards-for/california'), false, 'Thin regional comparison variants should not be indexable');
  assert.equal(isIndexableRoute('/compare/best-investment-apps/beginners'), false, 'Thin audience comparison variants should not be indexable');
  assert.equal(isIndexableRoute('/preview/launch-checklist'), true, 'Preview detection is enforced by sitemap filter, not locale route guard');
}
