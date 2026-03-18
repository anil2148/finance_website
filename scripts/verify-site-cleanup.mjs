import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

function pass(name) {
  console.log(`PASS: ${name}`);
}

function fail(name, details) {
  console.error(`FAIL: ${name}${details ? ` — ${details}` : ''}`);
  process.exitCode = 1;
}

const homepage = fs.readFileSync(path.join(process.cwd(), 'components/home/HomepageLayout.tsx'), 'utf8');
const whatToDoCount = (homepage.match(/What to do first/g) || []).length;
if (whatToDoCount === 1) pass('Homepage has one "What to do first" block');
else fail('Homepage has duplicated "What to do first" block', `count=${whatToDoCount}`);

const redirects = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content/audit/blog-redirect-map.json'), 'utf8'));
const redirectSources = new Set(redirects.map((entry) => entry.source));
if (redirectSources.has('/blog/beginner-investing-guides-79') && redirectSources.has('/blog/tax-saving-strategies-99')) {
  pass('Known legacy URLs are in redirect map');
} else {
  fail('Known legacy URLs missing from redirect map');
}

const hasNumberedRedirects = redirects.some((entry) => /\/blog\/.*\d+$/.test(entry.source) || /guide-\d+/i.test(entry.source));
if (hasNumberedRedirects) pass('Redirect map includes numbered legacy slugs');
else fail('Redirect map missing numbered legacy slugs');

const blogFiles = fs.readdirSync(path.join(process.cwd(), 'content/blog')).filter((file) => file.endsWith('.mdx'));
let badMeta = 0;
let weakSlug = 0;
for (const file of blogFiles) {
  const raw = fs.readFileSync(path.join(process.cwd(), 'content/blog', file), 'utf8');
  const { data } = matter(raw);
  if ((data.title || '').includes('Complete Guide (2026)') || (data.seoTitle || '').includes('Complete Guide (2026)')) badMeta += 1;
  if (/guide-\d+/i.test(data.slug || '') || /\d+$/.test(data.slug || '')) weakSlug += 1;
}
if (badMeta === 0) pass('No active blog metadata uses "Complete Guide (2026)"');
else fail('Active blog metadata still has legacy guide pattern', `count=${badMeta}`);
if (weakSlug === 0) pass('No active blog article has numbered legacy slug');
else fail('Active blog articles still include numbered legacy slugs', `count=${weakSlug}`);

const articleTemplate = fs.readFileSync(path.join(process.cwd(), 'app/blog/[slug]/page.tsx'), 'utf8');
const hasRelatedTools = articleTemplate.includes('Related tools');
const hasCompare = articleTemplate.includes('Compare options');
const hasContinue = articleTemplate.includes('Continue learning');
if (hasRelatedTools && hasCompare && hasContinue) pass('Article template links tools/comparisons/hubs');
else fail('Article template missing one of tools/comparisons/hubs modules');

const bestInvestmentApps = fs.readFileSync(path.join(process.cwd(), 'app/compare/best-investment-apps/page.tsx'), 'utf8');
if (bestInvestmentApps.includes('Best Investment Apps')) pass('Best investment apps comparison page preserved');
else fail('Best investment apps page appears regressed');

const inventoryJsonPath = path.join(process.cwd(), 'content/audit/full-site-inventory-audit.json');
if (fs.existsSync(inventoryJsonPath)) {
  const inventory = JSON.parse(fs.readFileSync(inventoryJsonPath, 'utf8'));
  if (inventory.length >= 40) pass('Full-site inventory audit exists with broad coverage');
  else fail('Full-site inventory audit too small', `rows=${inventory.length}`);
} else {
  fail('Full-site inventory audit file missing');
}

if (process.exitCode) {
  console.error('\nOne or more verification checks failed.');
} else {
  console.log('\nAll verification checks passed.');
}
