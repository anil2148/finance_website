import fs from 'node:fs';
import path from 'node:path';

const outDir = path.join(process.cwd(), 'content/blog');
const allowBulk = process.argv.includes('--allow-bulk-template');

if (allowBulk) {
  console.error('Refusing to generate bulk templated posts. This script now supports only curated single-post scaffolds.');
  process.exit(1);
}

const slug = process.argv[2];
const title = process.argv[3];
const category = process.argv[4] ?? 'general';

if (!slug || !title) {
  console.log('Usage: node scripts/generate-blog.mjs <slug> "<title>" [category]');
  console.log('Creates a single editorial scaffold with topic-specific sections.');
  process.exit(0);
}

const categorySections = {
  investing: [
    '## Who this is for',
    '## Risk and fee tradeoffs',
    '## Account order of operations',
    '## Scenario walkthrough',
    '## Mistakes to avoid',
    '## What to do next'
  ],
  loans: [
    '## Who this is for',
    '## Documents and qualification factors',
    '## Cost comparison framework',
    '## Timeline and decision checkpoints',
    '## Common blockers',
    '## What to do next'
  ],
  'savings-accounts': [
    '## Who this is for',
    '## Sample monthly budget context',
    '## Savings tactics by category',
    '## Automation plan',
    '## Constraints and tradeoffs',
    '## What to do next'
  ]
};

const sections = categorySections[category] ?? [
  '## Who this is for',
  '## Key decisions',
  '## Tradeoffs',
  '## Scenario example',
  '## Mistakes to avoid',
  '## What to do next'
];

const today = new Date().toISOString().slice(0, 10);
const content = `---
title: "${title}"
slug: "${slug}"
description: ""
keywords: []
category: "${category}"
date: "${today}"
updatedAt: "${today}"
country: "US"
seoTitle: "${title} | FinanceSphere"
metaDescription: ""
---

> Draft scaffold: replace all placeholders with topic-specific analysis and concrete examples before publishing.

${sections.map((section) => `${section}

`).join('')}
`;

fs.mkdirSync(outDir, { recursive: true });
const filePath = path.join(outDir, `${slug}.mdx`);

if (fs.existsSync(filePath)) {
  console.error(`File already exists: ${filePath}`);
  process.exit(1);
}

fs.writeFileSync(filePath, content);
console.log(`Created curated scaffold: ${filePath}`);
