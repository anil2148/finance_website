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
  const title = `${topic.title}: Practical Money Guide`;

  const content = `---
title: "${title}"
seoTitle: "${topic.title} Guide | FinanceSphere"
metaDescription: "Practical ${topic.slug.replace('-', ' ')} tips, examples, and planning steps for better day-to-day money decisions."
slug: "${slug}"
description: "Learn ${topic.slug.replace('-', ' ')} with actionable tactics and smart decision frameworks."
keywords: ["finance", "${topic.slug}", "comparison"]
tags: ["${topic.tags.join('", "')}"]
category: "${topic.slug}"
date: "2026-01-01"
---

## Why this matters
${topic.title} can accelerate your long-term wealth strategy when done consistently.

## Compare your options
| Approach | Helpful when | Watch for |
|---|---|---|
| Lower monthly payment | You need breathing room in your budget | Higher total interest over time |
| Faster payoff plan | You want to lower total borrowing cost | Higher monthly payment commitment |

## Step-by-step plan
1. Audit your current financial baseline.
2. Compare total cost and long-term outcomes.
3. Automate the winning strategy.

## FAQ
**Is this beginner friendly?** Yes. Start with one simple change and review your progress each month.

## Next steps
See also: [Calculators](/calculators), [Tools](/tools), and [Comparison guides](/comparison).
`;

  fs.writeFileSync(path.join(outDir, `${slug}.mdx`), content);
}

console.log('Generated 1000 posts.');
