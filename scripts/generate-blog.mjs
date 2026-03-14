import fs from 'node:fs';
import path from 'node:path';

const topics = [
  'best-cashback-credit-cards',
  'best-travel-credit-cards',
  'best-savings-accounts',
  'how-to-improve-credit-score',
  'how-to-save-500-month',
  'best-investment-apps',
  'beginner-investing-guides',
  'mortgage-tips',
  'tax-saving-strategies'
];

const outDir = path.join(process.cwd(), 'content/blog');
fs.mkdirSync(outDir, { recursive: true });

for (let i = 1; i <= 100; i++) {
  const topic = topics[(i - 1) % topics.length];
  const slug = `${topic}-${i}`;
  const title = `${topic.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())}: 2026 Guide #${i}`;
  const content = `---\ntitle: "${title}"\nslug: "${slug}"\ndescription: "Learn ${topic.replace(/-/g, ' ')} with practical tips, comparison tables, and affiliate offers."\nkeywords: ["finance", "${topic}", "comparison", "money"]\ncategory: "${topic.split('-')[0]}"\ndate: "2026-01-01"\n---\n\n## Why this matters\nA complete overview for ${topic.replace(/-/g, ' ')}.\n\n## Comparison table\n| Product | Feature | Rating |\n|---|---|---|\n| Option A | Strong value | 4.5/5 |\n| Option B | Balanced perks | 4.3/5 |\n\n## Action plan\n1. Define your goal\n2. Compare total costs\n3. Choose best-fit product\n\n## Affiliate CTA\nReady to move forward? Use trusted partner offers and click **Apply Now**.\n\nInternal links: [/credit-cards](/credit-cards), [/loans](/loans), [/savings](/savings).\n`;
  fs.writeFileSync(path.join(outDir, `${slug}.mdx`), content);
}

console.log('Generated 100 posts.');
