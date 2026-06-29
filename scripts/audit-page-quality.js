const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

const projectRoot = path.resolve(__dirname, '..');
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function patchedResolve(request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    return originalResolveFilename.call(this, path.join(projectRoot, request.slice(2)), parent, isMain, options);
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require('sucrase/register/ts');

const { getAllIndexableRoutes } = require('../lib/sitemap-routes.ts');
const { isIndexableRoute } = require('../lib/seo-locale-routes.ts');
const { calculatorMap } = require('../lib/calculators/registry.ts');

const APP_DIR = path.join(projectRoot, 'app');
const OUTPUT_FILE = path.join(projectRoot, 'docs/page-quality-inventory.json');
const PLACEHOLDER_PATTERN = /\b(under construction|coming soon|lorem ipsum|TODO|FIXME|dummy|sample content|test page|content coming|write later)\b/i;
const WARNING_WORD_THRESHOLD = 300;

function walkPages(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const pages = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'api') continue;
      pages.push(...walkPages(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name === 'page.tsx') {
      pages.push(fullPath);
    }
  }

  return pages;
}

function filePathToRoute(pageFilePath) {
  const relativeDir = path.relative(APP_DIR, path.dirname(pageFilePath));
  if (!relativeDir) return '/';

  return `/${relativeDir.split(path.sep).filter(Boolean).join('/')}`;
}

function cleanTextForWordCount(source) {
  return source
    .replace(/import[\s\S]*?;\n/g, ' ')
    .replace(/export\s+(const|function|default|type|interface)[\s\S]*?(?=\n(?:export|const|function|type|interface)|$)/g, ' ')
    .replace(/className="[^"]*"/g, ' ')
    .replace(/placeholder="[^"]*"/g, ' ')
    .replace(/[{}()[\]<>`"'=.,:;|/_*-]/g, ' ');
}

function estimateWords(source) {
  const words = cleanTextForWordCount(source).match(/[A-Za-z0-9$%₹]+/g);
  return words ? words.length : 0;
}

function extractLiteral(source, key) {
  const pattern = new RegExp(`${key}\\s*:\\s*(['"\`])([\\s\\S]*?)\\1`, 'm');
  const match = source.match(pattern);
  if (!match) return '';
  return match[2].replace(/\s+/g, ' ').trim();
}

function extractMetadata(source) {
  return {
    title: extractLiteral(source, 'title'),
    metaDescription: extractLiteral(source, 'description'),
    canonical: extractLiteral(source, 'canonical')
  };
}

function hasMetadataExport(source) {
  return /export\s+(const|function)\s+(metadata|generateMetadata)\b/.test(source)
    || /export\s+{\s*metadata\s*}/.test(source);
}

function getCalculatorSlug(route) {
  const match = route.match(/^\/calculators\/([^/]+)$/);
  return match ? match[1] : '';
}

function hasNoindex(source) {
  return /robots\s*:\s*{[^}]*index\s*:\s*false/s.test(source);
}

function hasRedirect(source) {
  return /\b(permanentRedirect|redirect)\s*\(/.test(source);
}

function hasPlaceholderPhrase(source) {
  const stripped = source
    .replace(/placeholder="[^"]*"/g, '')
    .replace(/placeholder=\{[^}]*\}/g, '');
  return PLACEHOLDER_PATTERN.test(stripped);
}

function isRoutePattern(route) {
  return route.includes('[') || route.includes(']');
}

function recommendedActionFor({ indexStatus, sitemapIncluded, estimatedUniqueWords, issueTypes, path: route }) {
  if (issueTypes.includes('redirect')) return 'remove';
  if (indexStatus === 'noindex') return 'noindex';
  if (issueTypes.includes('placeholder')) return 'noindex';
  if (issueTypes.includes('missing-title') || issueTypes.includes('missing-description')) return 'improve';
  if (issueTypes.includes('indexable-missing-from-sitemap')) return 'improve';
  if (issueTypes.includes('canonicalized-duplicate')) return 'canonicalize';
  if (estimatedUniqueWords < WARNING_WORD_THRESHOLD && !route.startsWith('/calculators/')) return 'improve';
  if (sitemapIncluded) return 'keep-indexed';
  return 'improve';
}

function main() {
  const sitemapRoutes = new Set(getAllIndexableRoutes().map((entry) => entry.pathname));
  const pageFiles = walkPages(APP_DIR);
  const entries = [];
  const duplicateDescriptions = new Map();

  for (const filePath of pageFiles) {
    const route = filePathToRoute(filePath);
    const source = fs.readFileSync(filePath, 'utf8');
    const metadata = extractMetadata(source);
    const noindex = hasNoindex(source);
    const redirect = hasRedirect(source);
    const sitemapIncluded = sitemapRoutes.has(route);
    const estimatedUniqueWords = estimateWords(source);
    const calculatorSlug = getCalculatorSlug(route);
    if (calculatorSlug && calculatorMap[calculatorSlug]) {
      metadata.title = calculatorMap[calculatorSlug].seoTitle;
      metadata.metaDescription = calculatorMap[calculatorSlug].seoDescription;
      metadata.canonical = `/calculators/${calculatorSlug}`;
    }
    const hasMetadata = hasMetadataExport(source) || Boolean(calculatorSlug && calculatorMap[calculatorSlug]);
    const issueTypes = [];
    const indexStatus = noindex || redirect || !isIndexableRoute(route) ? 'noindex' : 'index';

    if (redirect) issueTypes.push('redirect');
    if (noindex) issueTypes.push('noindex');
    if (metadata.canonical && metadata.canonical !== route) issueTypes.push('canonicalized-duplicate');
    if (!metadata.title && !redirect && !hasMetadata && indexStatus === 'index') issueTypes.push('missing-title');
    if (!metadata.metaDescription && !redirect && !hasMetadata && indexStatus === 'index') issueTypes.push('missing-description');
    if (hasPlaceholderPhrase(source)) issueTypes.push('placeholder');
    if (estimatedUniqueWords < WARNING_WORD_THRESHOLD && !redirect && !route.startsWith('/calculators/')) issueTypes.push('thin-source');
    if (!noindex && !redirect && !isRoutePattern(route) && isIndexableRoute(route) && !sitemapIncluded) {
      issueTypes.push('indexable-missing-from-sitemap');
    }
    if (noindex && sitemapIncluded) issueTypes.push('noindex-in-sitemap');

    const entry = {
      path: route,
      title: metadata.title,
      metaDescription: metadata.metaDescription,
      canonical: metadata.canonical || (isRoutePattern(route) ? '' : route),
      indexStatus,
      sitemapIncluded,
      estimatedUniqueWords,
      issueTypes,
      recommendedAction: '',
      notes: path.relative(projectRoot, filePath)
    };

    entry.recommendedAction = recommendedActionFor(entry);
    entries.push(entry);

    if (metadata.metaDescription && entry.indexStatus === 'index' && entry.sitemapIncluded) {
      const key = metadata.metaDescription.toLowerCase();
      if (!duplicateDescriptions.has(key)) duplicateDescriptions.set(key, []);
      duplicateDescriptions.get(key).push(route);
    }
  }

  for (const route of sitemapRoutes) {
    if (!entries.some((entry) => entry.path === route)) {
      entries.push({
        path: route,
        title: '',
        metaDescription: '',
        canonical: route,
        indexStatus: 'index',
        sitemapIncluded: true,
        estimatedUniqueWords: 0,
        issueTypes: ['dynamic-or-content-route'],
        recommendedAction: 'verify generated content remains high-value',
        notes: 'Generated dynamic route or content collection entry'
      });
    }
  }

  const duplicateMetaDescriptions = [...duplicateDescriptions.entries()]
    .filter(([, routes]) => routes.length > 1)
    .map(([description, routes]) => ({ description, routes }));

  for (const duplicate of duplicateMetaDescriptions) {
    for (const route of duplicate.routes) {
      const entry = entries.find((item) => item.path === route);
      if (entry && !entry.issueTypes.includes('duplicate-meta-description')) {
        entry.issueTypes.push('duplicate-meta-description');
        entry.recommendedAction = 'make meta description unique or canonicalize/noindex duplicate page';
      }
    }
  }

  entries.sort((a, b) => a.path.localeCompare(b.path));
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(entries, null, 2)}\n`);

  const criticalIssues = entries.filter((entry) =>
    entry.issueTypes.includes('noindex-in-sitemap')
    || entry.issueTypes.includes('placeholder')
    || (entry.indexStatus === 'index' && entry.issueTypes.includes('missing-title'))
    || (entry.indexStatus === 'index' && entry.issueTypes.includes('missing-description'))
  );

  const missingFromSitemap = entries.filter((entry) => entry.issueTypes.includes('indexable-missing-from-sitemap'));

  console.log(`Page quality inventory written: ${path.relative(projectRoot, OUTPUT_FILE)}`);
  console.log(`Routes inventoried: ${entries.length}`);
  console.log(`Duplicate meta descriptions detected: ${duplicateMetaDescriptions.length}`);
  console.log(`Indexable public routes missing from sitemap: ${missingFromSitemap.length}`);
  console.log(`Critical metadata/noindex/placeholder issues: ${criticalIssues.length}`);

  if (duplicateMetaDescriptions.length > 0) {
    for (const duplicate of duplicateMetaDescriptions) {
      console.log(`Duplicate description on: ${duplicate.routes.join(', ')}`);
    }
  }

  if (missingFromSitemap.length > 0) {
    for (const entry of missingFromSitemap) {
      console.log(`Missing from sitemap: ${entry.path}`);
    }
  }

  if (criticalIssues.length > 0) {
    for (const entry of criticalIssues) {
      console.log(`Critical issue: ${entry.path} [${entry.issueTypes.join(', ')}]`);
    }
    process.exitCode = 1;
  }
}

main();
