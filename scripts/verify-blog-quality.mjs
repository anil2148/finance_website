import fs from 'node:fs';
import path from 'node:path';

const blogDir = path.join(process.cwd(), 'content/blog');
const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.mdx'));

const records = files.map((file) => {
  const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) throw new Error(`Missing frontmatter: ${file}`);

  const get = (key) => {
    const m = fm[1].match(new RegExp(`^${key}:\\s*"([^"]+)"`, 'm'));
    return m ? m[1] : '';
  };

  const title = get('title');
  const slug = get('slug');
  const description = get('description');
  const date = get('date');
  const body = raw.slice(fm[0].length).trim();
  const wordCount = body.split(/\s+/).filter(Boolean).length;

  const calcLinks = [...body.matchAll(/\]\((\/calculators\/[^)]+)\)/g)].map((m) => m[1]);
  const comparisonLinks = [
    ...body.matchAll(/\]\((\/comparison(?:\/[^)]*)?)\)/g),
    ...body.matchAll(/\]\((\/compare\/[^)]+)\)/g),
    ...body.matchAll(/\]\((\/best-[^)]+)\)/g),
    ...body.matchAll(/\]\((\/mortgage-rate-comparison)\)/g)
  ].map((m) => m[1]);

  return { file, title, slug, description, date, wordCount, calcLinks, comparisonLinks, body };
});

const now = new Date('2026-03-18T23:59:59Z');
const errors = [];

const titles = new Map();
const descriptions = new Map();

for (const r of records) {
  if (/guide\s*#/i.test(r.title) || /guide\s*#/i.test(r.body) || /guide\s*#/i.test(r.slug)) {
    errors.push(`Guide-number pattern remains: ${r.slug}`);
  }

  if (r.wordCount < 220) {
    errors.push(`Thin page (<220 words): ${r.slug} (${r.wordCount})`);
  }

  if (r.calcLinks.length < 1) {
    errors.push(`Missing calculator link: ${r.slug}`);
  }

  if (r.comparisonLinks.length < 1) {
    errors.push(`Missing comparison link: ${r.slug}`);
  }

  const dateObj = new Date(`${r.date}T00:00:00Z`);
  if (dateObj > now) {
    errors.push(`Future date found: ${r.slug} (${r.date})`);
  }

  const titleKey = r.title.toLowerCase();
  const descKey = r.description.toLowerCase();
  if (titles.has(titleKey)) errors.push(`Repeated title: ${r.slug} and ${titles.get(titleKey)}`);
  if (descriptions.has(descKey)) errors.push(`Repeated snippet/description: ${r.slug} and ${descriptions.get(descKey)}`);
  titles.set(titleKey, r.slug);
  descriptions.set(descKey, r.slug);
}

const structuralFingerprints = records.map((r) => ({
  slug: r.slug,
  headings: [...r.body.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim())
}));

for (let i = 0; i < structuralFingerprints.length; i += 1) {
  for (let j = i + 1; j < structuralFingerprints.length; j += 1) {
    const a = structuralFingerprints[i];
    const b = structuralFingerprints[j];
    const overlap = a.headings.filter((h) => b.headings.includes(h)).length;
    if (overlap >= 3) {
      errors.push(`Potential repeated structure (${overlap} shared headings): ${a.slug} <> ${b.slug}`);
    }
  }
}

console.log(`Inventory count: ${records.length}`);
console.log('Slugs:');
for (const r of records.sort((a, b) => a.slug.localeCompare(b.slug))) {
  console.log(`- ${r.slug} (${r.wordCount} words)`);
}

if (errors.length) {
  console.error('\nVALIDATION FAILED');
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log('\nVALIDATION PASSED');
