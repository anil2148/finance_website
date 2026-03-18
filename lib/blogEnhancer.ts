import type { BlogPost } from '@/lib/markdown';

type TopicBlueprint = {
  intent: string;
  audience: string;
  matters: string;
  mistakes: string[];
  scenario: string;
  nextSteps: string[];
  relatedLinks: Array<{ label: string; href: string }>;
};

const HEADING_VARIANTS = [
  'How to evaluate your options',
  'Decision framework',
  'Practical game plan',
  'How to choose confidently',
  'Implementation checklist'
] as const;

const OPENERS = [
  'Most people do not fail because they pick the wrong product once; they struggle because the decision process is unclear.',
  'The biggest win in personal finance is not a “perfect” choice—it is making a good choice early and revisiting it with better data.',
  'This topic gets oversimplified online, so this guide focuses on practical tradeoffs you can actually use.',
  'Instead of generic tips, this guide breaks the topic into a clear decision path and shows where mistakes usually happen.'
] as const;

function hashNumber(value: string) {
  return [...value].reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
}

function pick<T>(arr: readonly T[], key: string) {
  const idx = Math.abs(hashNumber(key)) % arr.length;
  return arr[idx];
}

function humanizeSlug(slug: string) {
  return slug
    .replace(/^seo-/, '')
    .replace(/-\d+$/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function isLowValueContent(content: string) {
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const lowSignalPhrases = [
    'A complete overview for',
    'can accelerate your long-term wealth strategy when done consistently',
    'Compare your options',
    'Action plan',
    'Step-by-step plan',
    'Option A',
    'Option B'
  ];

  return wordCount < 220 || lowSignalPhrases.some((phrase) => content.includes(phrase));
}

function inferBlueprint(topic: string): TopicBlueprint {
  if (topic.includes('credit')) {
    return {
      intent: 'compare card features and avoid expensive interest charges',
      audience: 'people choosing their first rewards card or trying to optimize an existing setup',
      matters: 'small APR and fee differences can outweigh rewards if balances are carried',
      mistakes: ['chasing points while paying interest', 'ignoring annual fee break-even math', 'missing statement due dates'],
      scenario: 'A traveler compares a no-fee card vs. a $95-fee travel card and checks whether annual perks actually exceed the fee.',
      nextSteps: ['Estimate annual spending by category', 'Compare effective reward rate after fees', 'Set autopay for statement balance'],
      relatedLinks: [
        { label: 'Best credit cards', href: '/best-credit-cards-2026' },
        { label: 'Credit cards hub', href: '/credit-cards' },
        { label: 'Loan & debt tools', href: '/loan-emi-calculator' }
      ]
    };
  }

  if (topic.includes('mortgage') || topic.includes('loan')) {
    return {
      intent: 'lower borrowing cost while keeping monthly payments sustainable',
      audience: 'borrowers comparing rates, terms, and refinance or payoff strategies',
      matters: 'term length and rate structure can change total interest by thousands',
      mistakes: ['shopping only by monthly payment', 'ignoring closing costs and fees', 'overextending debt-to-income ratio'],
      scenario: 'A buyer choosing between a 15-year and 30-year mortgage models payment stress and total interest before signing.',
      nextSteps: ['Check credit profile and debt-to-income', 'Model multiple term options', 'Stress-test budget at a higher rate'],
      relatedLinks: [
        { label: 'Mortgage calculator', href: '/mortgage-calculator' },
        { label: 'Mortgage comparisons', href: '/compare/mortgage-rate-comparison' },
        { label: 'Loan EMI calculator', href: '/loan-emi-calculator' }
      ]
    };
  }

  if (topic.includes('invest') || topic.includes('retirement')) {
    return {
      intent: 'build a repeatable long-term investing plan with manageable risk',
      audience: 'beginners and intermediate investors aligning accounts to goals',
      matters: 'asset mix, contribution consistency, and fees have compounding impact over decades',
      mistakes: ['trading based on headlines', 'holding too much cash for long periods', 'not rebalancing after big market moves'],
      scenario: 'A household splitting contributions across 401(k), IRA, and taxable brokerage based on tax treatment and timeline.',
      nextSteps: ['Define time horizon and volatility tolerance', 'Set contribution automation', 'Review allocation quarterly, not daily'],
      relatedLinks: [
        { label: 'Investment growth calculator', href: '/investment-growth-calculator' },
        { label: 'Retirement calculator', href: '/retirement-calculator' },
        { label: 'Best investing apps', href: '/best-investment-apps' }
      ]
    };
  }

  if (topic.includes('tax')) {
    return {
      intent: 'reduce tax drag legally through account and withdrawal strategy',
      audience: 'workers and investors looking for better tax efficiency',
      matters: 'net return after taxes is what funds real goals, not headline yield',
      mistakes: ['selling assets without tax impact planning', 'missing tax-advantaged account limits', 'confusing marginal and effective tax rate'],
      scenario: 'An investor compares taxable brokerage dividends with tax-advantaged retirement contributions to improve after-tax growth.',
      nextSteps: ['List available tax-advantaged accounts', 'Prioritize contribution order', 'Track holding periods before selling'],
      relatedLinks: [
        { label: 'Editorial policy', href: '/editorial-policy' },
        { label: 'Investment tools', href: '/tools' },
        { label: 'Retirement planning', href: '/retirement-calculator' }
      ]
    };
  }

  return {
    intent: 'improve cash flow and financial stability with a realistic system',
    audience: 'households tightening budgets or building emergency savings',
    matters: 'cash flow control creates room for debt payoff, investing, and fewer financial shocks',
    mistakes: ['setting unrealistic savings targets', 'tracking too many categories', 'not planning for irregular bills'],
    scenario: 'A family creates a baseline budget, then automates transfers for emergency savings before discretionary spending.',
    nextSteps: ['Separate fixed and variable expenses', 'Automate one savings transfer immediately', 'Review progress each month'],
    relatedLinks: [
      { label: 'Savings account comparisons', href: '/best-savings-accounts-usa' },
      { label: 'Budget & planning tools', href: '/tools' },
      { label: 'Net worth calculator', href: '/net-worth-calculator' }
    ]
  };
}

function buildEnhancedBody(post: BlogPost, topicLabel: string, blueprint: TopicBlueprint) {
  const headingVariant = pick(HEADING_VARIANTS, post.slug);
  const opener = pick(OPENERS, `${post.slug}-opener`);

  return `## Why ${topicLabel} deserves a strategy
${opener} In this article, you will learn how to ${blueprint.intent} without relying on hype or one-size-fits-all advice.

## Who this guide is best for
This article is built for ${blueprint.audience}. If your situation is unique, use this as an educational framework and validate key assumptions before making decisions.

## Why it matters in real dollars
${blueprint.matters}. Over time, even a small improvement in cost, tax efficiency, or contribution consistency can materially improve outcomes.

## ${headingVariant}
1. Clarify your primary objective (cost reduction, growth, flexibility, or risk control).
2. Compare at least two realistic alternatives using total cost and long-term impact.
3. Pick a default plan you can automate and review on a calendar.

### Common mistakes to avoid
- ${blueprint.mistakes[0]}.
- ${blueprint.mistakes[1]}.
- ${blueprint.mistakes[2]}.

## Example scenario
${blueprint.scenario} The key is not perfection—it is picking a process that fits your cash flow and sticking to it.

## Risks, tradeoffs, and alternatives
Every choice in ${topicLabel.toLowerCase()} involves tradeoffs between flexibility, cost, and risk. If your first-choice option is not available, use a close alternative and revisit in 3–6 months after your profile improves.

## Next steps and related tools
${blueprint.nextSteps.map((step, index) => `${index + 1}. ${step}.`).join('\n')}

Related resources: ${blueprint.relatedLinks.map((link) => `[${link.label}](${link.href})`).join(', ')}.

## FAQ
### How often should I review my plan?
Monthly for cash-flow changes, and quarterly for long-term decisions is usually enough.

### What if I am starting from scratch?
Start with one measurable action this week, automate it, and expand once it is stable.

### Do I need expert advice?
For complex tax, legal, or large lending decisions, professional advice can prevent expensive mistakes.

## Bottom line
${topicLabel} works best when decisions are specific, measurable, and repeatable. Use the linked tools to test assumptions, then commit to a plan you can maintain.`;
}

export function enhancePost(post: BlogPost): BlogPost {
  const lowValue = isLowValueContent(post.content);
  const topicLabel = humanizeSlug(post.slug);
  const blueprint = inferBlueprint(`${post.category} ${post.slug}`.toLowerCase());
  const seoTitle = post.seoTitle ?? `${topicLabel}: Practical Guide for Smarter Money Decisions (2026)`;
  const metaDescription =
    post.metaDescription ??
    `Learn ${topicLabel.toLowerCase()} with practical examples, key risks, and decision frameworks. Includes links to calculators and comparison tools.`;

  if (!lowValue) {
    return {
      ...post,
      seoTitle,
      metaDescription,
      description: post.description.length < 90 ? metaDescription : post.description
    };
  }

  return {
    ...post,
    title: post.title.includes('Guide #') ? topicLabel : post.title,
    description: metaDescription,
    seoTitle,
    metaDescription,
    content: buildEnhancedBody(post, topicLabel, blueprint)
  };
}
