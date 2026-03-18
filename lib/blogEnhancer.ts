import type { BlogPost } from '@/lib/markdown';

type LinkGroup = {
  calculator: { label: string; href: string };
  comparison: { label: string; href: string };
  hub: { label: string; href: string };
  related: { label: string; href: string };
};

type TopicBlueprint = {
  archetype: 'investing' | 'loans' | 'budgeting' | 'credit-cards' | 'savings' | 'tax';
  audience: string;
  opening: string;
  links: LinkGroup;
  titleTemplates: string[];
  descriptionTemplates: string[];
};

const THIN_PATTERNS = [
  'A complete overview for',
  'can accelerate your long-term wealth strategy when done consistently',
  'Compare your options',
  'Action plan',
  'Step-by-step plan',
  'Option A',
  'Option B',
  'with practical steps, examples, and expert tips'
];

const REPETITIVE_TITLE_PATTERNS = [/practical\s+\d{4}\s+guide\s*#\d+/i, /complete guide\s*\(\d{4}\)/i, /guide\s*#\d+/i];

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
  return wordCount < 360 || THIN_PATTERNS.some((phrase) => content.includes(phrase));
}

function hasTemplatedTitle(title: string) {
  return REPETITIVE_TITLE_PATTERNS.some((pattern) => pattern.test(title));
}

function inferBlueprint(topic: string): TopicBlueprint {
  if (topic.includes('credit') || topic.includes('card')) {
    return {
      archetype: 'credit-cards',
      audience: 'cardholders choosing between rewards, intro APR offers, or annual-fee upgrades',
      opening:
        'Credit-card content often overpromises rewards and underexplains risk. This article focuses on real break-even math, statement timing, and ways to avoid paying interest.',
      links: {
        calculator: { label: 'Credit Card Payoff Calculator', href: '/calculators/credit-card-payoff-calculator' },
        comparison: { label: 'Credit card comparisons', href: '/comparison?category=credit_card' },
        hub: { label: 'Credit cards hub', href: '/learn/credit-cards' },
        related: { label: 'How credit utilization works', href: '/blog/seo-how-credit-utilization-works' }
      },
      titleTemplates: [
        '%TOPIC%: How to Compare Offers Without Overpaying',
        '%TOPIC%: Fees, Rewards, and Interest Tradeoffs',
        '%TOPIC%: A Smarter Decision Framework for 2026'
      ],
      descriptionTemplates: [
        'Make a better %TOPIC_LOWER% decision with fee break-even math, statement-timing tactics, and links to the right calculators.',
        'Learn how to evaluate %TOPIC_LOWER% using realistic spending examples, risk checks, and next-step tools.'
      ]
    };
  }

  if (topic.includes('mortgage') || topic.includes('loan') || topic.includes('heloc')) {
    return {
      archetype: 'loans',
      audience: 'borrowers comparing lenders, rates, and monthly payment risk before applying',
      opening:
        'Borrowing decisions are won or lost before you sign: in documentation, APR comparison, and timeline planning. This guide emphasizes those high-impact details.',
      links: {
        calculator: { label: 'Loan Calculator', href: '/calculators/loan-calculator' },
        comparison: { label: 'Personal loan comparisons', href: '/comparison?category=personal_loan' },
        hub: { label: 'Loans hub', href: '/learn/loans' },
        related: { label: 'Debt-to-income ratio guide', href: '/blog/seo-debt-to-income-ratio-guide' }
      },
      titleTemplates: [
        '%TOPIC%: Cost, Approval, and Timeline Checklist',
        'Before You Borrow: %TOPIC% Strategy That Reduces Surprises',
        '%TOPIC%: Comparing Lenders, Fees, and Real Monthly Cost'
      ],
      descriptionTemplates: [
        'Use this %TOPIC_LOWER% playbook to compare lenders, prepare documents, and avoid approval delays that cost time and money.',
        'A practical %TOPIC_LOWER% guide with approval timelines, fee tradeoffs, and links to calculators and comparison tools.'
      ]
    };
  }

  if (topic.includes('invest') || topic.includes('retirement') || topic.includes('dividend') || topic.includes('asset')) {
    return {
      archetype: 'investing',
      audience: 'beginners and intermediate investors building a repeatable long-term contribution plan',
      opening:
        'Strong investing outcomes usually come from process quality, not prediction. This guide translates the topic into scenarios, fee tradeoffs, and actions you can automate.',
      links: {
        calculator: { label: 'Investment Growth Calculator', href: '/calculators/investment-growth-calculator' },
        comparison: { label: 'Best investment apps', href: '/best-investment-apps' },
        hub: { label: 'Investing hub', href: '/learn/investing' },
        related: { label: 'Dollar-cost averaging guide', href: '/blog/seo-investing-for-beginners-roadmap' }
      },
      titleTemplates: [
        '%TOPIC%: Risk, Fees, and Allocation Choices That Matter',
        '%TOPIC% for Real Life: A Practical Investor Playbook',
        '%TOPIC%: What to Do, What to Avoid, and Why'
      ],
      descriptionTemplates: [
        'Improve your %TOPIC_LOWER% plan with allocation scenarios, platform-fee comparisons, and practical next steps.',
        'A clearer %TOPIC_LOWER% roadmap with risk tradeoffs, common beginner errors, and internal tools to model outcomes.'
      ]
    };
  }

  if (topic.includes('tax')) {
    return {
      archetype: 'tax',
      audience: 'workers and investors trying to improve after-tax returns legally and consistently',
      opening:
        'Tax optimization is rarely one trick. It is account location, contribution order, and withdrawal timing working together. This article keeps the focus there.',
      links: {
        calculator: { label: 'Retirement Calculator', href: '/calculators/retirement-calculator' },
        comparison: { label: 'Investment account comparisons', href: '/comparison?category=investment_app' },
        hub: { label: 'Investing hub', href: '/learn/investing' },
        related: { label: 'Roth vs Traditional IRA', href: '/blog/seo-tax-efficient-investing-tips' }
      },
      titleTemplates: [
        '%TOPIC%: Account Choices That Keep More of Your Return',
        '%TOPIC%: Practical Tax-Efficiency Moves for 2026',
        '%TOPIC%: How to Reduce Tax Drag Without Guesswork'
      ],
      descriptionTemplates: [
        'Use this %TOPIC_LOWER% guide to prioritize account type, contribution order, and withdrawal rules based on your timeline.',
        'Tax-smart %TOPIC_LOWER% planning with clear examples, tradeoffs, and links to relevant tools.'
      ]
    };
  }

  if (topic.includes('budget') || topic.includes('save') || topic.includes('emergency')) {
    return {
      archetype: 'budgeting',
      audience: 'households tightening cash flow while still saving for short-term goals',
      opening:
        'Budgeting advice gets repetitive fast. This piece focuses on a realistic monthly system you can actually follow when bills and variable costs change.',
      links: {
        calculator: { label: 'Budget Planner', href: '/calculators/budget-planner' },
        comparison: { label: 'Best savings accounts', href: '/best-savings-accounts-usa' },
        hub: { label: 'Budgeting hub', href: '/learn/budgeting' },
        related: { label: 'Emergency fund guide', href: '/blog/seo-emergency-fund-3-to-6-months' }
      },
      titleTemplates: [
        '%TOPIC%: A Monthly System That Actually Works',
        '%TOPIC%: Cash-Flow Priorities, Tradeoffs, and Next Moves',
        '%TOPIC%: Practical Planning for Irregular Real Life Expenses'
      ],
      descriptionTemplates: [
        'Build a stronger %TOPIC_LOWER% routine with sample category targets, automation ideas, and realistic constraints.',
        'A practical %TOPIC_LOWER% framework with examples, mistakes to avoid, and links to tools that support action.'
      ]
    };
  }

  return {
    archetype: 'savings',
    audience: 'readers trying to create stability first, then grow toward medium-term goals',
    opening: 'This guide turns the topic into concrete choices, realistic timelines, and useful next steps.',
    links: {
      calculator: { label: 'Savings Goal Calculator', href: '/calculators/savings-goal-calculator' },
      comparison: { label: 'Best savings accounts', href: '/best-savings-accounts-usa' },
      hub: { label: 'Budgeting hub', href: '/learn/budgeting' },
      related: { label: 'Automate your savings plan', href: '/blog/seo-emergency-fund-3-to-6-months' }
    },
    titleTemplates: ['%TOPIC%: Clear Priorities and Smart Next Steps'],
    descriptionTemplates: ['Get practical %TOPIC_LOWER% guidance with examples, tradeoffs, and next-step tools.']
  };
}

function buildInvestingBody(topicLabel: string, blueprint: TopicBlueprint) {
  return `## Start with the investor scenario you are actually in
${blueprint.opening}

- **Early-stage builder:** You are prioritizing contribution rate and account setup over security selection.
- **Mid-stage optimizer:** You already invest monthly and need to improve fees, diversification, or tax placement.
- **Near-goal risk manager:** You are reducing volatility risk as a spending date gets closer.

## Fee and risk tradeoffs that change outcomes
A 1.00% fund-cost difference on a $25,000 portfolio growing at 7% can mean thousands of dollars less after a decade. The same is true for platform fees and cash drag from under-investing.

Instead of asking "which asset is best," ask:
1. What level of drawdown can I tolerate without panic selling?
2. What total annual cost am I paying (fund expense ratio + platform fee + advisory fee)?
3. Is my account type aligned with my timeline and taxes?

## Platform comparison checklist
When comparing brokerages or investing apps, score each option on:
- recurring investment automation,
- fractional-share support,
- account transfer friction,
- total fee transparency,
- quality of tax reporting.

## Beginner mistakes to avoid early
- Switching allocation every time headlines change.
- Holding idle cash for months while waiting for a "perfect entry." 
- Picking many overlapping funds that look diversified but are not.

## What to do next
1. Model your monthly contribution path with the [${blueprint.links.calculator.label}](${blueprint.links.calculator.href}).
2. Compare available providers on the [${blueprint.links.comparison.label}](${blueprint.links.comparison.href}) page.
3. Read the [${blueprint.links.related.label}](${blueprint.links.related.href}) to build consistency.
4. Keep your reference framework in the [${blueprint.links.hub.label}](${blueprint.links.hub.href}).

### Related tools
- [${blueprint.links.calculator.label}](${blueprint.links.calculator.href})

### Compare options
- [${blueprint.links.comparison.label}](${blueprint.links.comparison.href})

### Continue learning
- [${blueprint.links.hub.label}](${blueprint.links.hub.href})
- [${blueprint.links.related.label}](${blueprint.links.related.href})

## Bottom line
The strongest ${topicLabel.toLowerCase()} plan is the one you can keep funding through good and bad markets.`;
}

function buildLoansBody(topicLabel: string, blueprint: TopicBlueprint) {
  return `## Borrower profile and goal
${blueprint.opening}

Before rate shopping, clarify if your goal is lower monthly payment, faster payoff, or approval certainty. You usually can optimize only two at once.

## Document checklist (prepare before applying)
- Last 2 pay stubs or income statements
- Recent bank statements
- Government ID and proof of address
- Existing debt obligations and minimum payments
- Purpose-of-loan details and amount requested

## Approval timeline you should expect
A realistic path for many borrowers is:
1. **Day 1-2:** Prequalification and soft-pull estimates.
2. **Day 2-5:** Document submission and income verification.
3. **Day 4-7:** Underwriting review and conditional approval.
4. **Day 7+:** Final terms, signature, and funding.

Timeline slows when documentation is incomplete or debt-to-income is close to the lender cutoff.

## Cost tradeoffs that matter most
- Lower monthly payment usually means longer term and higher total interest.
- No-fee loans can beat lower-rate loans once origination fees are included.
- Fixed rates improve certainty; variable rates can reduce initial cost but increase payment risk.

## Common delays and how to avoid them
- Mismatched income documents → submit matching pay period dates.
- Credit report surprises → review credit file before applying.
- Last-minute account activity changes → avoid opening new debt during underwriting.

## What to do next
1. Run the payment and total-cost scenarios in the [${blueprint.links.calculator.label}](${blueprint.links.calculator.href}).
2. Compare lender structures in [${blueprint.links.comparison.label}](${blueprint.links.comparison.href}).
3. Validate eligibility using this [${blueprint.links.related.label}](${blueprint.links.related.href}).
4. Review the full borrower playbook in [${blueprint.links.hub.label}](${blueprint.links.hub.href}).

### Related tools
- [${blueprint.links.calculator.label}](${blueprint.links.calculator.href})

### Compare options
- [${blueprint.links.comparison.label}](${blueprint.links.comparison.href})

### What to do next
- [${blueprint.links.hub.label}](${blueprint.links.hub.href})
- [${blueprint.links.related.label}](${blueprint.links.related.href})

## Bottom line
For ${topicLabel.toLowerCase()}, preparation beats speed: complete documents, compare all-in cost, and pick terms you can sustain under stress.`;
}

function buildBudgetingBody(topicLabel: string, blueprint: TopicBlueprint) {
  return `## Build around your real monthly constraints
${blueprint.opening}

Start from your actual fixed costs first (housing, transport, insurance, debt minimums), then allocate variable categories with clear limits.

## Sample category-level budget split
For a take-home income of $4,800, one realistic baseline could look like:
- Fixed obligations: $2,700 (56%)
- Food and essentials: $700 (15%)
- Transportation and utilities: $550 (11%)
- Savings and sinking funds: $600 (13%)
- Flexible spending: $250 (5%)

Use this as a starting model, not a rigid rule.

## Automation strategy that reduces drift
1. Route paycheck to a bills account and spending account.
2. Trigger an automatic transfer to savings within 24 hours of payday.
3. Use weekly category reviews for food, dining, and discretionary categories.

## Real-world constraints to plan for
- Seasonal utility spikes,
- annual or semiannual insurance bills,
- school, healthcare, or travel months that break normal spending patterns.

Create sinking funds so irregular costs do not become credit-card debt.

## What to do next
1. Set up your baseline in [${blueprint.links.calculator.label}](${blueprint.links.calculator.href}).
2. Move excess cash into one of the options in [${blueprint.links.comparison.label}](${blueprint.links.comparison.href}).
3. Use [${blueprint.links.related.label}](${blueprint.links.related.href}) to set your first target.
4. Keep improving with the [${blueprint.links.hub.label}](${blueprint.links.hub.href}).

### Related tools
- [${blueprint.links.calculator.label}](${blueprint.links.calculator.href})

### Compare options
- [${blueprint.links.comparison.label}](${blueprint.links.comparison.href})

### Continue learning
- [${blueprint.links.hub.label}](${blueprint.links.hub.href})
- [${blueprint.links.related.label}](${blueprint.links.related.href})

## Bottom line
Great ${topicLabel.toLowerCase()} systems are simple enough to repeat and flexible enough to survive an uneven month.`;
}

function buildCreditBody(topicLabel: string, blueprint: TopicBlueprint) {
  return `## Choose cards based on behavior, not marketing
${blueprint.opening}

If you carry balances, APR and payoff speed matter more than points. If you pay in full, reward structure and redemption flexibility matter more.

## Annual-fee break-even example
A $95 annual-fee card with a 3% grocery category bonus beats a no-fee 1.5% card only if your category spending clears the fee hurdle. Always run the math before upgrading.

## Practical comparison checklist
- Effective reward rate after annual fee
- Foreign transaction fee policy
- Intro APR duration and reversion APR
- Redemption restrictions and transfer options
- Customer support quality and dispute process

## High-cost mistakes to avoid
- Keeping utilization high while chasing sign-up bonuses.
- Missing statement due dates and losing grace period.
- Opening multiple cards before a major loan application.

## What to do next
1. Build a payoff timeline in the [${blueprint.links.calculator.label}](${blueprint.links.calculator.href}).
2. Compare issuer options through [${blueprint.links.comparison.label}](${blueprint.links.comparison.href}).
3. Improve score mechanics with [${blueprint.links.related.label}](${blueprint.links.related.href}).
4. Explore strategy guides in [${blueprint.links.hub.label}](${blueprint.links.hub.href}).

### Related tools
- [${blueprint.links.calculator.label}](${blueprint.links.calculator.href})

### Compare options
- [${blueprint.links.comparison.label}](${blueprint.links.comparison.href})

### What to do next
- [${blueprint.links.hub.label}](${blueprint.links.hub.href})
- [${blueprint.links.related.label}](${blueprint.links.related.href})

## Bottom line
The best ${topicLabel.toLowerCase()} choice is the one that matches your payment behavior and keeps borrowing costs near zero.`;
}

function buildTaxBody(topicLabel: string, blueprint: TopicBlueprint) {
  return `## Optimize taxes through sequence, not hacks
${blueprint.opening}

Tax outcomes improve when you choose account type, contribution order, and withdrawal timing intentionally.

## Practical order of operations
1. Capture employer retirement match (if available).
2. Prioritize tax-advantaged contributions based on marginal bracket.
3. Use taxable accounts for flexibility goals and long holding periods.

## Example tradeoff
An investor deciding between extra taxable investing vs. retirement-account contributions should compare immediate tax savings, withdrawal restrictions, and future bracket expectations.

## Where people lose efficiency
- Ignoring fund turnover in taxable accounts.
- Triggering short-term gains unnecessarily.
- Making contribution decisions without reviewing current-year taxable income.

## What to do next
1. Model target outcomes in the [${blueprint.links.calculator.label}](${blueprint.links.calculator.href}).
2. Compare account providers using [${blueprint.links.comparison.label}](${blueprint.links.comparison.href}).
3. Use [${blueprint.links.related.label}](${blueprint.links.related.href}) for account-type decisions.
4. Keep a long-term framework in [${blueprint.links.hub.label}](${blueprint.links.hub.href}).

### Related tools
- [${blueprint.links.calculator.label}](${blueprint.links.calculator.href})

### Compare options
- [${blueprint.links.comparison.label}](${blueprint.links.comparison.href})

### Continue learning
- [${blueprint.links.hub.label}](${blueprint.links.hub.href})
- [${blueprint.links.related.label}](${blueprint.links.related.href})

## Bottom line
Better ${topicLabel.toLowerCase()} results come from consistent, documented decisions—not one-time moves at filing season.`;
}

function buildEnhancedBody(post: BlogPost, topicLabel: string, blueprint: TopicBlueprint) {
  switch (blueprint.archetype) {
    case 'investing':
      return buildInvestingBody(topicLabel, blueprint);
    case 'loans':
      return buildLoansBody(topicLabel, blueprint);
    case 'budgeting':
    case 'savings':
      return buildBudgetingBody(topicLabel, blueprint);
    case 'credit-cards':
      return buildCreditBody(topicLabel, blueprint);
    case 'tax':
      return buildTaxBody(topicLabel, blueprint);
    default:
      return buildBudgetingBody(topicLabel, blueprint);
  }
}

function normalizeTitle(post: BlogPost, topicLabel: string, blueprint: TopicBlueprint) {
  if (hasTemplatedTitle(post.title) || /\(\d{4}\)/.test(post.title)) {
    const template = pick(blueprint.titleTemplates, post.slug);
    return template.replace('%TOPIC%', titleCase(topicLabel));
  }

  return post.title;
}

function normalizeDescription(post: BlogPost, topicLabel: string, blueprint: TopicBlueprint) {
  if (
    post.description.length < 90 ||
    /with practical steps, examples, and expert tips/i.test(post.description) ||
    /actionable tactics and smart decision frameworks/i.test(post.description) ||
    /^learn\b/i.test(post.description)
  ) {
    return pick(blueprint.descriptionTemplates, `${post.slug}-description`)
      .replace('%TOPIC_LOWER%', topicLabel.toLowerCase())
      .replace('%TOPIC%', titleCase(topicLabel));
  }

  return post.description;
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

export function enhancePost(post: BlogPost): BlogPost {
  const topicLabel = cleanSlug(post.slug);
  const blueprint = inferBlueprint(`${post.category} ${post.slug}`.toLowerCase());
  const title = normalizeTitle(post, topicLabel, blueprint);
  const description = normalizeDescription(post, topicLabel, blueprint);
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
