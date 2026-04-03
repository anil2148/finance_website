import assert from 'node:assert/strict';
import { getHomepageRoutingDecision } from '../middleware';
import { detectRegionFromCountry, parsePreferredRegion } from '../lib/region-preference';

export function runRegionRoutingTests() {
  assert.equal(parsePreferredRegion('IN'), 'in', 'Region cookie parser should normalize case');
  assert.equal(parsePreferredRegion('US'), 'us', 'Region cookie parser should normalize US values');
  assert.equal(parsePreferredRegion('eu'), null, 'Unexpected region cookie values should be ignored');

  assert.equal(detectRegionFromCountry('IN'), 'in', 'India visitors should map to India region');
  assert.equal(detectRegionFromCountry('US'), 'us', 'US visitors should map to US region');
  assert.equal(detectRegionFromCountry(undefined), 'us', 'Unknown countries should default to US region');

  assert.deepEqual(
    getHomepageRoutingDecision({ pathname: '/', preferredRegion: 'in', userAgent: null, countryCode: 'US' }),
    { action: 'redirect', region: 'in' },
    'Saved India preference should override geo detection'
  );

  assert.deepEqual(
    getHomepageRoutingDecision({ pathname: '/', preferredRegion: 'us', userAgent: null, countryCode: 'IN' }),
    { action: 'next' },
    'Saved US preference should override geo detection'
  );

  assert.deepEqual(
    getHomepageRoutingDecision({ pathname: '/', preferredRegion: null, userAgent: null, countryCode: 'IN' }),
    { action: 'redirect', region: 'in' },
    'First-time India visitors should redirect from homepage to /in'
  );

  assert.deepEqual(
    getHomepageRoutingDecision({ pathname: '/', preferredRegion: null, userAgent: null, countryCode: null }),
    { action: 'next' },
    'Unknown countries should stay on global homepage'
  );

  assert.deepEqual(
    getHomepageRoutingDecision({ pathname: '/blog', preferredRegion: null, userAgent: null, countryCode: 'IN' }),
    { action: 'next' },
    'Deep links should never auto-redirect'
  );

  assert.deepEqual(
    getHomepageRoutingDecision({ pathname: '/in/blog', preferredRegion: null, userAgent: null, countryCode: 'IN' }),
    { action: 'next' },
    'India deep links should never be redirected when already off root'
  );

  assert.deepEqual(
    getHomepageRoutingDecision({ pathname: '/in/blog/sip-vs-fd', preferredRegion: 'in', userAgent: null, countryCode: 'US' }),
    { action: 'next' },
    'Saved India cookie should only redirect root visits and should not override deep links'
  );

  assert.deepEqual(
    getHomepageRoutingDecision({ pathname: '/', preferredRegion: null, userAgent: 'Googlebot', countryCode: 'IN' }),
    { action: 'next' },
    'Bots should not be redirected to preserve crawlability'
  );
}
