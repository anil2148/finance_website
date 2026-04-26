#!/usr/bin/env node

/**
 * SEO integrity crawler:
 * - multiple/missing canonical tags
 * - redirect chains and loop targets
 * - internal links that point to non-canonical URLs
 */

const BASE_URL = process.env.SEO_AUDIT_BASE_URL || 'http://localhost:3000';
const MAX_REDIRECT_HOPS = 8;

const seedUrls = [
  '/',
  '/blog',
  '/calculators',
  '/comparison',
  '/best-credit-cards-2026',
  '/best-savings-accounts-usa',
  '/best-investment-apps',
  '/compare/mortgage-rate-comparison',
  '/in',
  '/in/blog',
  '/in/calculators'
];

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

function extractCanonicals(html) {
  const matches = [...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]*>/gi)];
  return matches
    .map((m) => {
      const href = m[0].match(/href=["']([^"']+)["']/i)?.[1];
      return href || null;
    })
    .filter(Boolean);
}

function extractInternalLinks(html) {
  const links = [...html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)].map((m) => m[1]);
  return links.filter((href) => href.startsWith('/'));
}

async function resolveUrl(pathname) {
  const visited = new Set();
  let current = new URL(pathname, BASE_URL);
  const hops = [];

  for (let i = 0; i < MAX_REDIRECT_HOPS; i += 1) {
    const key = `${current.origin}${current.pathname}${current.search}`;
    if (visited.has(key)) {
      return { type: 'loop', hops };
    }
    visited.add(key);

    const response = await fetch(current, { redirect: 'manual' });
    hops.push({ url: key, status: response.status });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) {
        return { type: 'broken_redirect', hops };
      }
      current = new URL(location, current.origin);
      continue;
    }

    const html = response.headers.get('content-type')?.includes('text/html') ? await response.text() : '';
    return {
      type: 'final',
      status: response.status,
      finalUrl: `${current.origin}${normalizePath(current.pathname)}`,
      hops,
      html
    };
  }

  return { type: 'chain_too_long', hops };
}

function isCanonicalInternalLink(href) {
  return !href.includes('?') && !href.endsWith('/') && !href.startsWith('/blog/category/');
}

async function main() {
  const report = {
    multipleCanonical: [],
    missingCanonical: [],
    redirectIssues: [],
    nonCanonicalInternalLinks: []
  };

  for (const pathname of seedUrls) {
    const result = await resolveUrl(pathname);

    if (result.type !== 'final') {
      report.redirectIssues.push({ url: pathname, issue: result.type, hops: result.hops });
      continue;
    }

    if (result.hops.length > 2) {
      report.redirectIssues.push({ url: pathname, issue: 'redirect_chain', hops: result.hops });
    }

    if (result.status >= 400) {
      report.redirectIssues.push({ url: pathname, issue: `final_${result.status}`, hops: result.hops });
      continue;
    }

    const canonicals = extractCanonicals(result.html);
    if (canonicals.length === 0) report.missingCanonical.push({ url: pathname, finalUrl: result.finalUrl });
    if (canonicals.length > 1) report.multipleCanonical.push({ url: pathname, canonicals });

    const internalLinks = extractInternalLinks(result.html);
    const badLinks = internalLinks.filter((href) => !isCanonicalInternalLink(href));
    if (badLinks.length > 0) {
      report.nonCanonicalInternalLinks.push({ url: pathname, links: [...new Set(badLinks)].slice(0, 20) });
    }
  }

  const totalIssues =
    report.multipleCanonical.length +
    report.missingCanonical.length +
    report.redirectIssues.length +
    report.nonCanonicalInternalLinks.length;

  if (totalIssues === 0) {
    console.log('✅ SEO canonical audit passed with no issues.');
    return;
  }

  console.log(JSON.stringify(report, null, 2));
  process.exitCode = 1;
}

main().catch((error) => {
  console.error('SEO validation failed:', error);
  process.exit(1);
});
