import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const blogDir = path.join(process.cwd(), 'content/blog');
const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.mdx')).sort();
const posts = files.map((file) => {
  const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
  const { data, content } = matter(raw);
  const headings = content
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => line.slice(3).trim().toLowerCase());

  const words = content.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return {
    file,
    slug: data.slug,
    title: String(data.title || ''),
    description: String(data.description || ''),
    date: String(data.date || ''),
    content,
    headings,
    words
  };
});

const failures = [];

// full inventory
console.log(`Inventory (${posts.length} live posts):`);
for (const p of posts) console.log(`- ${p.slug} (${p.file})`);

const dup = (arr, keyFn, label) => {
  const map = new Map();
  for (const item of arr) {
    const key = keyFn(item);
    map.set(key, (map.get(key) || 0) + 1);
  }
  for (const [key, count] of map.entries()) {
    if (key && count > 1) failures.push(`${label} repeated: "${key}" (${count}x)`);
  }
};

dup(posts, (p) => p.title.trim().toLowerCase(), 'Title');
dup(posts, (p) => p.description.trim().toLowerCase(), 'Snippet');

for (const p of posts) {
  if (/guide\s*#\d+/i.test(`${p.title} ${p.description} ${p.content}`)) {
    failures.push(`${p.slug}: contains Guide # pattern`);
  }
  if (!/\[.*?\]\(\/calculators\//.test(p.content)) {
    failures.push(`${p.slug}: missing calculator link`);
  }
  if (!/\]\(\/(comparison|compare\/|best-|mortgage-rate-comparison|high-yield-savings-vs-cds)/.test(p.content)) {
    failures.push(`${p.slug}: missing comparison-style link`);
  }
  if (p.words < 350) {
    failures.push(`${p.slug}: thin content (${p.words} words)`);
  }
  const d = new Date(`${p.date}T00:00:00Z`);
  const now = new Date('2026-03-18T00:00:00Z');
  if (d > now) failures.push(`${p.slug}: future date ${p.date}`);
}

// structure similarity: identical first 3 H2 headings across posts
for (let i = 0; i < posts.length; i++) {
  for (let j = i + 1; j < posts.length; j++) {
    const a = posts[i].headings.slice(0, 3).join('|');
    const b = posts[j].headings.slice(0, 3).join('|');
    if (a && a === b) failures.push(`Structural duplicate: ${posts[i].slug} and ${posts[j].slug}`);
  }
}

if (failures.length) {
  console.error('\nFAILED checks:');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}

console.log('\nAll quality checks passed.');
