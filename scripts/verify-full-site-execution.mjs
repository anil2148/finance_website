import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const homepageFile = path.join(root, 'components/home/HomepageLayout.tsx');
const redirectMapFile = path.join(root, 'content/audit/blog-redirect-map.json');
const inventoryFile = path.join(root, 'content/audit/FULL_SITE_INVENTORY_AUDIT_2026-03-18.md');
const blogDir = path.join(root, 'content/blog');
const categoryPageFile = path.join(root, 'app/blog/category/[category]/page.tsx');
const blogArticlePageFile = path.join(root, 'app/blog/[slug]/page.tsx');
const comparePageFile = path.join(root, 'app/compare/best-investment-apps/page.tsx');

const fail = (msg) => {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
};

const pass = (msg) => console.log(`PASS: ${msg}`);

const homepageSource = fs.readFileSync(homepageFile, 'utf8');
const whatToDoFirstCount = (homepageSource.match(/id="what-to-do-first"/g) || []).length;
if (whatToDoFirstCount === 1) pass('Homepage has a single “What to do first” section');
else fail(`Homepage duplication detected (id="what-to-do-first" count: ${whatToDoFirstCount})`);

const redirects = JSON.parse(fs.readFileSync(redirectMapFile, 'utf8'));
const redirectSources = new Set(redirects.map((entry) => entry.source));

const requiredLegacy = [
  ['/blog/beginner-investing-guides-79', '/blog/seo-investing-for-beginners-roadmap'],
  ['/blog/tax-saving-strategies-99', '/blog/seo-tax-efficient-investing-tips']
];

for (const [source, destination] of requiredLegacy) {
  const match = redirects.find((entry) => entry.source === source);
  if (!match) {
    fail(`Missing redirect for legacy URL ${source}`);
    continue;
  }
  if (match.destination !== destination) {
    fail(`Legacy URL ${source} redirects to ${match.destination} instead of ${destination}`);
  } else {
    pass(`Legacy URL ${source} redirects to canonical ${destination}`);
  }
}

let redirectChainCount = 0;
for (const entry of redirects) {
  if (redirectSources.has(entry.destination)) {
    redirectChainCount += 1;
  }
}
if (redirectChainCount === 0) pass('No redirect chains found in blog redirect map');
else fail(`Redirect chains found: ${redirectChainCount}`);

const liveBlogFiles = fs.readdirSync(blogDir).filter((f) => f.endsWith('.mdx')).sort();
const livePosts = liveBlogFiles.map((file) => {
  const { data, content } = matter(fs.readFileSync(path.join(blogDir, file), 'utf8'));
  return { file, ...data, content };
});

const badPattern = /(guide\s*#|complete guide\s*\(2026\))/i;
const patternViolations = livePosts.filter((post) => badPattern.test(`${post.title}\n${post.description}\n${post.seoTitle || ''}\n${post.metaDescription || ''}\n${post.content}`));
if (patternViolations.length === 0) pass('No weak “Guide #” or “Complete Guide (2026)” patterns in live blog content/metadata');
else fail(`Weak metadata/content patterns found in: ${patternViolations.map((p) => p.slug).join(', ')}`);

const uniqueDescriptions = new Set(livePosts.map((post) => String(post.description || '').trim().toLowerCase()));
if (uniqueDescriptions.size === livePosts.length) pass('Live blog card summaries are unique across active posts');
else fail(`Duplicate blog summaries found (${livePosts.length - uniqueDescriptions.size} duplicates)`);

const categoryPageSource = fs.readFileSync(categoryPageFile, 'utf8');
const hasFeaturedSection = categoryPageSource.includes('Featured in this category');
const hasJourneySection = categoryPageSource.includes('Continue your decision path');
if (hasFeaturedSection && hasJourneySection) pass('Category pages include editorial curation + decision-path modules');
else fail('Category pages are missing curated/decision-path sections');

const topicVisualChecks = [
  'blog-visual-investing-growth.svg',
  'blog-visual-tax.svg',
  'blog-visual-savings-goals.svg',
  'blog-visual-mortgage.svg',
  'blog-visual-credit.svg',
  'blog-visual-savings-cashflow.svg'
];
const missingVisuals = topicVisualChecks.filter((asset) => !categoryPageSource.includes(asset));
if (missingVisuals.length === 0) pass('Topic-family visual differentiation configured across key categories');
else fail(`Missing topic visual mappings: ${missingVisuals.join(', ')}`);

const articleSource = fs.readFileSync(blogArticlePageFile, 'utf8');
const linksToTools = articleSource.includes('Related tools');
const linksToCompare = articleSource.includes('Compare options');
const linksToHub = articleSource.includes('Continue learning');
if (linksToTools && linksToCompare && linksToHub) pass('Blog article pages link into tools, comparisons, and hub/learn paths');
else fail('Blog article internal journey modules are incomplete');

const compareSource = fs.readFileSync(comparePageFile, 'utf8');
if (compareSource.includes('Best Investment Apps') || compareSource.includes('best investment apps')) {
  pass('Best Investment Apps comparison page remains present');
} else {
  fail('Best Investment Apps comparison page appears regressed or missing core heading');
}

if (fs.existsSync(inventoryFile)) {
  const inventory = fs.readFileSync(inventoryFile, 'utf8');
  if (inventory.includes('| URL | Page type | Topic |') && inventory.includes('/blog/tax-saving-strategies-99')) {
    pass('Full-site inventory audit file includes required table schema and legacy URL entries');
  } else {
    fail('Full-site inventory audit file is missing required table headers or legacy URL rows');
  }
} else {
  fail('Missing full-site inventory audit file');
}

if (livePosts.length <= 12) pass(`Live blog inventory is constrained (${livePosts.length} posts) and curated`);
else fail(`Live blog inventory too large after cleanup (${livePosts.length} posts)`);

if (process.exitCode) {
  console.error('\nFull-site execution verification: FAILED');
  process.exit(process.exitCode);
}

console.log('\nFull-site execution verification: PASSED');
