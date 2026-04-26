import assert from 'node:assert/strict';
import { getHomepageRoutingDecision } from '../middleware';
import { detectRegionFromCountry, parsePreferredRegion } from '../lib/region-preference';

export function runRegionRoutingTests() {
  assert.equal(parsePreferredRegion('IN'), 'IN', 'Region cookie parser should normalize case');
  assert.equal(parsePreferredRegion('US'), 'US', 'Region cookie parser should normalize US values');
  assert.equal(parsePreferredRegion('eu'), 'EU', 'EU region cookie values should be parsed');

  assert.equal(detectRegionFromCountry('IN'), 'IN', 'India visitors should map to India region');
  assert.equal(detectRegionFromCountry('US'), 'US', 'US visitors should map to US region');
  assert.equal(detectRegionFromCountry(undefined), 'US', 'Unknown countries should default to US region');

  assert.deepEqual(
    getHomepageRoutingDecision({ pathname: '/', preferredRegion: 'IN', userAgent: null, countryCode: 'US' }),
    { action: 'redirect', region: 'IN' },
    'Saved India preference should redirect to region-prefixed homepage'
  );

  assert.deepEqual(
    getHomepageRoutingDecision({ pathname: '/', preferredRegion: 'US', userAgent: null, countryCode: 'IN' }),
    { action: 'next' },
    'Saved US preference should keep US homepage'
  );

  assert.deepEqual(
    getHomepageRoutingDecision({ pathname: '/', preferredRegion: null, userAgent: null, countryCode: 'IN' }),
    { action: 'redirect', region: 'IN' },
    'First-time India visitors should redirect from homepage to /in'
  );

  assert.deepEqual(
    getHomepageRoutingDecision({ pathname: '/blog', preferredRegion: null, userAgent: null, countryCode: 'IN' }),
    { action: 'next' },
    'Deep links should not be auto-redirected by homepage routing helper'
  );
}
