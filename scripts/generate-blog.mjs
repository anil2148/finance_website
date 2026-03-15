import fs from 'node:fs';
import path from 'node:path';

const topics = [
  { slug: 'credit-cards', title: 'Credit Cards', tags: ['credit', 'rewards', 'apr'] },
  { slug: 'saving-money', title: 'Saving Money', tags: ['savings', 'budget', 'cashflow'] },
  { slug: 'mortgages', title: 'Mortgages', tags: ['home', 'rates', 'down-payment'] },
  { slug: 'investing', title: 'Investing', tags: ['portfolio', 'etf', 'stocks'] },
  { slug: 'retirement-planning', title: 'Retirement Planning', tags: ['401k', 'ira', 'fire'] },
  { slug: 'budgeting', title: 'Budgeting', tags: ['expenses', 'planning', 'goals'] },
  { slug: 'tax-optimization', title: 'Tax Optimization', tags: ['tax', 'deductions', 'strategy'] }
];

const outDir = path.join(process.cwd(), 'content/blog');
fs.mkdirSync(outDir, { recursive: true });

for (let i = 1; i <= 1000; i++) {
  const topic = topics[(i - 1) % topics.length];
  const slug = `${topic.slug}-guide-${i}`;
  const title = `${topic.title}: Practical 2026 Guide #${i}`;

  const content = `---
title: "${title}"
seoTitle: "${topic.title} Strategy Guide ${i} | FinanceSite"
metaDescription: "Actionable ${topic.slug.replace('-', ' ')} strategies, comparison table, FAQ, and affiliate picks in one guide."
slug: "${slug}"
description: "Learn ${topic.slug.replace('-', ' ')} with actionable tactics and smart decision frameworks."
keywords: ["finance", "${topic.slug}", "comparison"]
tags: ["${topic.tags.join('", "')}"]
category: "${topic.slug}"
date: "2026-01-01"
---

## Why this matters
${topic.title} can accelerate your long-term wealth strategy when done consistently.

## Comparison table
| Option | Benefit | Consideration |
|---|---|---|
| Option A | Lower cost | Fewer premium perks |
| Option B | Higher upside | Requires stronger credit profile |

## Step-by-step plan
1. Audit your current financial baseline.
2. Compare total cost and long-term outcomes.
3. Automate the winning strategy.

## FAQ
**Is this beginner friendly?** Yes, start simple and optimize as you go.

## Affiliate CTA
Explore partner recommendations and apply with confidence.

Internal links: [/comparison](/comparison), [/calculators](/calculators), [/tools](/tools), [/dashboard](/dashboard).
`;

  fs.writeFileSync(path.join(outDir, `${slug}.mdx`), content);
}

console.log('Generated 1000 posts.');
