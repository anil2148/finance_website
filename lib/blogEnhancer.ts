import type { BlogPost } from '@/lib/markdown';

type TopicBlueprint = {
  intent: string;
  audience: string;
  matters: string;
  tradeoff: string;
  mistakes: string[];
  scenario: string;
  nextSteps: string[];
  relatedLinks: Array<{ label: string; href: string }>;
};

const HEADING_VARIANTS = [
  'How to evaluate your options',
  'Decision framework you can actually use',
  'Practical game plan',
  'How to choose with confidence',
  'Implementation checklist'
] as const;

const OPENERS = [
  'Most people do not fail because they pick the wrong product once; they struggle because the decision process is unclear.',
  'The biggest win in personal finance is not a “perfect” choice—it is making a good choice early and revisiting it with better data.',
  'This topic gets oversimplified online, so this guide focuses on practical tradeoffs you can actually use.',
  'Instead of generic tips, this guide breaks the topic into a clear decision path and shows where mistakes usually happen.'
] as const;

const THIN_PATTERNS = [
  'A complete overview for',
  'can accelerate your long-term wealth strategy when done consistently',
  'Compare your options',
  'Action plan',
  'Step-by-step plan',
  'Option A',
  'Option B',
  'Learn ',
  'with practical steps, examples, and expert tips',
  'Complete Guide (2026)'
];

const REPETITIVE_TITLE_PATTERNS = [
  /practical\s+\d{4}\s+guide\s*#\d+/i,
  /complete guide\s*\(\d{4}\)/i,
  /guide\s*#\d+/i
];

function hashNumber(value: string) {
  return [...value].reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
}

function pick<T>(arr: readonly T[], key: string) {
  const idx = Math.abs(hashNumber(key)) % arr.length;
  return arr[idx];
}

function titleCase(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/\bApy\b/g, 'APY')
    .replace(/\bApr\b/g, 'APR')
    .replace(/\bEtf\b/g, 'ETF')
    .replace(/\bIra\b/g, 'IRA')
    .replace(/\b401k\b/g, '401(k)');
}

function cleanSlug(slug: string) {
  return slug
    .replace(/^seo-/, '')
    .replace(/-\d+$/, '')
    .replace(/-guide$/, '')
    .replace(/-tips$/, '')
    .replace(/-/g, ' ')
    .trim();
}

export function canonicalTopicKey(post: BlogPost) {
  return cleanSlug(post.slug)
    .replace(/\b(best|how|to|for|with|and|the|a|an|guide|roadmap|basics|explained)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isLowValueContent(content: string) {
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  return wordCount < 280 || THIN_PATTERNS.some((phrase) => content.includes(phrase));
}

function hasTemplatedTitle(title: string) {
  return REPETITIVE_TITLE_PATTERNS.some((pattern) => pattern.test(title));
}

export function qualityScore(post: BlogPost) {
  const wordCount = post.content.split(/\s+/).filter(Boolean).length;
  let score = Math.min(60, Math.floor(wordCount / 10));

  if (post.slug.startsWith('seo-')) score += 12;
  if (!hasTemplatedTitle(post.title)) score += 10;
  if (!/\(\d{4}\)/.test(post.title)) score += 5;
  if (!isLowValueContent(post.content)) score += 15;
  if (/^-?\d+$/.test(post.slug.split('-').at(-1) ?? '')) score -= 8;

  return score;
}

export function shouldExcludePost(post: BlogPost) {
  const numericTail = /-\d+$/.test(post.slug);
  const thin = isLowValueContent(post.content);
  const templated = hasTemplatedTitle(post.title) || /with practical steps, examples, and expert tips/i.test(post.description);

  if (!numericTail) return false;
  return thin && templated;
}

function inferBlueprint(topic: string): TopicBlueprint {
  if (topic.includes('credit')) {
    return {
      intent: 'compare card features and avoid expensive interest charges',
      audience: 'people choosing their first rewards card or trying to optimize an existing setup',
      matters: 'small APR and fee differences can outweigh rewards if balances are carried',
      tradeoff: 'premium perks can be valuable, but only if your real spending and travel habits justify annual fees',
      mistakes: ['chasing points while paying interest', 'ignoring annual fee break-even math', 'missing statement due dates'],
      scenario: 'A traveler compares a no-fee card vs. a $95-fee travel card and checks whether annual perks actually exceed the fee.',
      nextSteps: ['Estimate annual spending by category', 'Compare effective reward rate after fees', 'Set autopay for statement balance'],
      relatedLinks: [
        { label: 'Best credit cards', href: '/best-credit-cards-2026' },
        { label: 'Credit cards hub', href: '/learn/credit-cards' },
        { label: 'Credit card payoff calculator', href: '/calculators/credit-card-payoff-calculator' }
      ]
    };
  }

  if (topic.includes('mortgage') || topic.includes('loan')) {
    return {
      intent: 'lower borrowing cost while keeping monthly payments sustainable',
      audience: 'borrowers comparing rates, terms, and refinance or payoff strategies',
      matters: 'term length and rate structure can change total interest by thousands',
      tradeoff: 'lower monthly payment improves flexibility, while shorter terms reduce total interest cost',
      mistakes: ['shopping only by monthly payment', 'ignoring closing costs and fees', 'overextending debt-to-income ratio'],
      scenario: 'A buyer choosing between a 15-year and 30-year mortgage models payment stress and total interest before signing.',
      nextSteps: ['Check credit profile and debt-to-income', 'Model multiple term options', 'Stress-test budget at a higher rate'],
      relatedLinks: [
        { label: 'Mortgage calculator', href: '/calculators/mortgage-calculator' },
        { label: 'Mortgage comparison', href: '/compare/mortgage-rate-comparison' },
        { label: 'Loan calculator', href: '/calculators/loan-calculator' }
      ]
    };
  }

  if (topic.includes('invest') || topic.includes('retirement') || topic.includes('passive')) {
    return {
      intent: 'build a repeatable long-term investing plan with manageable risk',
      audience: 'beginners and intermediate investors aligning accounts to goals',
      matters: 'asset mix, contribution consistency, and fees have compounding impact over decades',
      tradeoff: 'higher expected returns usually come with higher short-term volatility and behavioral risk',
      mistakes: ['trading based on headlines', 'holding too much cash for long periods', 'not rebalancing after big market moves'],
      scenario: 'A household splitting contributions across 401(k), IRA, and taxable brokerage based on tax treatment and timeline.',
      nextSteps: ['Define time horizon and volatility tolerance', 'Set contribution automation', 'Review allocation quarterly, not daily'],
      relatedLinks: [
        { label: 'Investment apps comparison', href: '/best-investment-apps' },
        { label: 'Investment growth calculator', href: '/calculators/investment-growth-calculator' },
        { label: 'Investing hub', href: '/learn/investing' }
      ]
    };
  }

  if (topic.includes('tax')) {
    return {
      intent: 'reduce tax drag legally through account and withdrawal strategy',
      audience: 'workers and investors looking for better tax efficiency',
      matters: 'net return after taxes is what funds real goals, not headline yield',
      tradeoff: 'the most tax-efficient choice can limit liquidity, so timelines matter',
      mistakes: ['selling assets without tax impact planning', 'missing tax-advantaged account limits', 'confusing marginal and effective tax rate'],
      scenario: 'An investor compares taxable brokerage dividends with tax-advantaged retirement contributions to improve after-tax growth.',
      nextSteps: ['List available tax-advantaged accounts', 'Prioritize contribution order', 'Track holding periods before selling'],
      relatedLinks: [
        { label: 'Retirement calculator', href: '/calculators/retirement-calculator' },
        { label: 'Investing hub', href: '/learn/investing' },
        { label: 'Editorial policy', href: '/editorial-policy' }
      ]
    };
  }

  return {
    intent: 'improve cash flow and financial stability with a realistic system',
    audience: 'households tightening budgets or building emergency savings',
    matters: 'cash flow control creates room for debt payoff, investing, and fewer financial shocks',
    tradeoff: 'aggressive savings targets work only if your monthly plan remains realistic and sustainable',
    mistakes: ['setting unrealistic savings targets', 'tracking too many categories', 'not planning for irregular bills'],
    scenario: 'A family creates a baseline budget, then automates transfers for emergency savings before discretionary spending.',
    nextSteps: ['Separate fixed and variable expenses', 'Automate one savings transfer immediately', 'Review progress each month'],
    relatedLinks: [
      { label: 'Budgeting hub', href: '/learn/budgeting' },
      { label: 'Savings goal calculator', href: '/calculators/savings-goal-calculator' },
      { label: 'Best savings accounts', href: '/best-savings-accounts-usa' }
    ]
  };
}

function buildEnhancedBody(post: BlogPost, topicLabel: string, blueprint: TopicBlueprint) {
  const headingVariant = pick(HEADING_VARIANTS, post.slug);
  const opener = pick(OPENERS, `${post.slug}-opener`);

  return `## Who this is for
${opener} This guide is for ${blueprint.audience}.

## Why ${topicLabel.toLowerCase()} matters
${blueprint.matters}. If you improve one high-impact decision, you create room for faster progress in other goals.

## ${headingVariant}
1. Define your primary objective (cost reduction, growth, flexibility, or risk control).
2. Compare two realistic alternatives using total cost and long-term impact.
3. Choose a default plan you can automate and revisit.

## Key tradeoffs
${blueprint.tradeoff}.

## Example scenario
${blueprint.scenario}

## Common mistakes
- ${blueprint.mistakes[0]}.
- ${blueprint.mistakes[1]}.
- ${blueprint.mistakes[2]}.

## Next steps
${blueprint.nextSteps.map((step, index) => `${index + 1}. ${step}.`).join('\n')}

### Related tools and pages
${blueprint.relatedLinks.map((link) => `- [${link.label}](${link.href})`).join('\n')}

## Bottom line
${titleCase(topicLabel)} improves when your process is specific, measurable, and repeatable. Use the linked tools first, then compare options with confidence.`;
}

function normalizeTitle(post: BlogPost, topicLabel: string) {
  if (post.slug.startsWith('seo-') || hasTemplatedTitle(post.title) || /\(\d{4}\)/.test(post.title)) {
    return `${titleCase(topicLabel)}: Practical Decisions, Tradeoffs, and Next Steps`;
  }

  return post.title;
}

function normalizeDescription(post: BlogPost, topicLabel: string) {
  if (
    post.description.length < 90 ||
    /practical steps, examples, and expert tips/i.test(post.description) ||
    /actionable tactics and smart decision frameworks/i.test(post.description)
  ) {
    return `Clear guidance on ${topicLabel.toLowerCase()}, including who it is for, key tradeoffs, common mistakes, and tools to take the next step.`;
  }

  return post.description;
}

export function enhancePost(post: BlogPost): BlogPost {
  const topicLabel = cleanSlug(post.slug);
  const blueprint = inferBlueprint(`${post.category} ${post.slug}`.toLowerCase());
  const title = normalizeTitle(post, topicLabel);
  const description = normalizeDescription(post, topicLabel);
  const lowValue = isLowValueContent(post.content);

  return {
    ...post,
    title,
    description,
    seoTitle: `${title} | FinanceSphere`,
    metaDescription: description,
    content: lowValue ? buildEnhancedBody(post, topicLabel, blueprint) : post.content
  };
}
