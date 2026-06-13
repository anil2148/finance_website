import Module from 'node:module';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
require('sucrase/register/ts');

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function patchedResolve(request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    const mappedRequest = path.join(projectRoot, request.slice(2));
    return originalResolveFilename.call(this, mappedRequest, parent, isMain, options);
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

const sitemapModule = require('../app/sitemap.ts');
const robotsModule = require('../app/robots.ts');
const { SITE_ORIGIN } = require('../lib/seo-urls.ts');

const sitemap = sitemapModule.default ?? sitemapModule;
const robots = robotsModule.default ?? robotsModule;

const DEPLOYED_BASE_URL = process.env.SITEMAP_VALIDATION_BASE_URL;
const ROOT_SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`;
const CHILD_SITEMAP_PATH_PATTERN = /\/sitemap-[^/]+\.xml/;
const XML_LINK_REGEX = /<loc>([^<]+)<\/loc>/g;
const CANONICAL_REGEX = /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i;
const META_ROBOTS_NOINDEX_REGEX = /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i;
const X_ROBOTS_NOINDEX_REGEX = /(^|,|\s)noindex(\s|,|$)/i;
const PREVIEW_HOST_REGEX = /(localhost|vercel\.app|preview|staging)/i;
const REQUIRED_PUBLIC_URLS = new Set([
  `${SITE_ORIGIN}/`,
  `${SITE_ORIGIN}/stock-analyzer`,
  `${SITE_ORIGIN}/stock-opportunity`,
]);

function fail(message) {
  throw new Error(message);
}

function ensureAbsoluteCanonicalUrl(url) {
  if (!url.startsWith(`${SITE_ORIGIN}/`)) fail(`Non-canonical host found in sitemap: ${url}`);
  if (!url.startsWith('https://')) fail(`Non-https URL found in sitemap: ${url}`);
  if (url.includes('?') || url.includes('#')) fail(`Query/hash URL found in sitemap: ${url}`);
  if (PREVIEW_HOST_REGEX.test(url)) fail(`Preview/local URL found in sitemap: ${url}`);
  if (url.includes('/api/')) fail(`API route found in sitemap: ${url}`);
  if (url.includes('/admin/')) fail(`Admin route found in sitemap: ${url}`);
  if (url.includes('/dashboard')) fail(`Private dashboard route found in sitemap: ${url}`);
  if (CHILD_SITEMAP_PATH_PATTERN.test(new URL(url).pathname)) fail(`Nested sitemap file found in sitemap URL list: ${url}`);
}

function normalizeComparableUrl(value) {
  const url = new URL(value);
  const pathname = url.pathname !== '/' ? url.pathname.replace(/\/+$/, '') : '/';
  return `${url.origin}${pathname}`;
}

function extractLocs(xml) {
  return [...xml.matchAll(XML_LINK_REGEX)].map((match) => match[1].trim());
}

function validateUrlList(pageUrls) {
  if (pageUrls.length === 0) fail('Sitemap has no page URLs.');
  if (new Set(pageUrls).size !== pageUrls.length) fail('Duplicate page URLs found in sitemap.');

  for (const requiredUrl of REQUIRED_PUBLIC_URLS) {
    if (!pageUrls.includes(requiredUrl)) fail(`Missing required public URL from sitemap: ${requiredUrl}`);
  }

  for (const pageUrl of pageUrls) {
    ensureAbsoluteCanonicalUrl(pageUrl);
  }
}

function validateSingleSitemapXml(xml) {
  if (!xml.includes('<urlset')) fail('/sitemap.xml must be a urlset document.');
  if (xml.includes('<sitemapindex')) fail('/sitemap.xml must not be a sitemap index.');
  if (CHILD_SITEMAP_PATH_PATTERN.test(xml)) fail('/sitemap.xml must not reference nested child sitemap files.');

  const pageUrls = extractLocs(xml);
  validateUrlList(pageUrls);
  return pageUrls;
}

function validateLocalSitemap() {
  const sitemapEntries = sitemap();
  const pageUrls = sitemapEntries.map((entry) => entry.url);
  validateUrlList(pageUrls);

  const robotsOutput = robots();
  const robotSitemaps = Array.isArray(robotsOutput.sitemap) ? robotsOutput.sitemap : [robotsOutput.sitemap];
  if (!robotSitemaps.includes(ROOT_SITEMAP_URL)) {
    fail(`robots.ts must reference the canonical sitemap: ${ROOT_SITEMAP_URL}`);
  }

  console.log(`✅ Local sitemap route entries checked: ${pageUrls.length}`);
  console.log(`✅ robots.ts references ${ROOT_SITEMAP_URL}`);
}

async function fetchStrict(url) {
  const response = await fetch(url, { redirect: 'manual' });

  if (response.status >= 300 && response.status < 400) {
    fail(`Redirect detected for URL: ${url} -> ${response.headers.get('location')}`);
  }

  if (response.status !== 200) {
    fail(`Expected 200 for URL: ${url}, got ${response.status}`);
  }

  return response;
}

async function validatePageUrl(url) {
  ensureAbsoluteCanonicalUrl(url);

  const response = await fetchStrict(url);
  const xRobotsTag = response.headers.get('x-robots-tag') ?? '';

  if (X_ROBOTS_NOINDEX_REGEX.test(xRobotsTag)) {
    fail(`X-Robots-Tag has noindex for URL: ${url}`);
  }

  const html = await response.text();
  if (META_ROBOTS_NOINDEX_REGEX.test(html)) {
    fail(`Meta robots noindex detected for URL: ${url}`);
  }

  const canonical = html.match(CANONICAL_REGEX)?.[1];
  if (!canonical) {
    fail(`Missing canonical tag for URL: ${url}`);
  }

  if (normalizeComparableUrl(canonical) !== normalizeComparableUrl(url)) {
    fail(`Canonical mismatch for URL: ${url}, canonical is ${canonical}`);
  }
}

async function validateDeployedSitemap(baseUrl) {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  const sitemapUrl = `${normalizedBaseUrl}/sitemap.xml`;
  const robotsUrl = `${normalizedBaseUrl}/robots.txt`;

  const rootResponse = await fetchStrict(sitemapUrl);
  const rootXml = await rootResponse.text();
  const pageUrls = validateSingleSitemapXml(rootXml);

  const robotsResponse = await fetchStrict(robotsUrl);
  const robotsText = await robotsResponse.text();
  if (!robotsText.includes(ROOT_SITEMAP_URL)) {
    fail(`robots.txt must reference ${ROOT_SITEMAP_URL}`);
  }

  if (process.env.SITEMAP_VALIDATE_PAGE_URLS === '1') {
    for (const pageUrl of pageUrls) {
      await validatePageUrl(pageUrl);
    }
  }

  console.log(`✅ Deployed sitemap fetched: ${sitemapUrl}`);
  console.log(`✅ Deployed robots fetched: ${robotsUrl}`);
  console.log(`✅ Page URLs checked: ${pageUrls.length}`);
}

async function run() {
  validateLocalSitemap();

  if (DEPLOYED_BASE_URL) {
    await validateDeployedSitemap(DEPLOYED_BASE_URL);
  } else {
    console.log('ℹ️ Set SITEMAP_VALIDATION_BASE_URL to also fetch a deployed sitemap and robots.txt.');
  }
}

run().catch((error) => {
  const allowNetworkFailure = process.env.SITEMAP_VALIDATION_ALLOW_NETWORK_FAILURE === '1';
  if (allowNetworkFailure && /fetch failed/i.test(error.message)) {
    console.warn(`⚠️ ${error.message} (skipped due to SITEMAP_VALIDATION_ALLOW_NETWORK_FAILURE=1)`);
    process.exit(0);
    return;
  }

  console.error(`❌ ${error.message}`);
  process.exit(1);
});
