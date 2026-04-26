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

type ScenarioRow = {
  monthly: string;
  annual: string;
  longTerm: string;
  note: string;
};

type ContentQualityMetrics = {
  wordCount: number;
  sentenceCount: number;
  uniqueHeadings: number;
  internalLinks: number;
  readabilityScore: number;
  templateMatches: number;
  hasIntroduction: boolean;
  hasConclusion: boolean;
};

// ============================================================================
// IMPROVED: Enhanced thin content detection patterns
// ============================================================================
const THIN_PATTERNS = [
  /^a complete overview for/i,
  /can accelerate your long-term wealth strategy when done consistently/i,
  /^action plan:/i,
  /^step-by-step plan:/i,
  /^option [a-z]$/i,
  /with practical steps, examples, and expert tips/i,
  /actionable tactics and smart decision frameworks/i,
  /learn (more about|how to)/i,
  /this guide (covers|explains|breaks down)/i,
  /in this (article|guide|post)/i
];

const REPETITIVE_TITLE_PATTERNS = [
  /practical\s+\d{4}\s+guide\s*#\d+/i,
  /complete guide\s*\(\d{4}\)/i,
  /guide\s*#\d+/i,
  /(\d{4})\s+guide\s+\(updated\)/i,
  /^(the\s+)?ultimate\s+\w+\s+guide/i,
  /^how\s+to\s+\w+\s+\(\d{4}\)/i
];

// ============================================================================
// IMPROVED: Content deduplication and normalization
// ============================================================================
const STOPWORDS_FOR_DEDUP = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that',
  'the', 'to', 'was', 'will', 'with'
]);

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
    .replace(/-\d+$/, '')
    .replace(/-guide$/, '')
    .replace(/-tips$/, '')
    .replace(/-/g, ' ')
    .trim();
}

// ============================================================================
// IMPROVED: Canonical topic key with better deduplication
// ============================================================================
export function canonicalTopicKey(post: BlogPost): string {
  const base = cleanSlug(post.slug)
    .replace(/\b(best|how|to|for|with|and|the|a|an|guide|roadmap|basics|explained|complete|ultimate|practical)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  // Further normalize by removing years and common suffixes
  const normalized = base
    .replace(/\s*\b\d{4}\b\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return normalized;
}

// ============================================================================
// IMPROVED: Content quality metrics calculation
// ============================================================================
export function calculateContentMetrics(content: string): ContentQualityMetrics {
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const sentenceCount = (content.match(/[.!?]+/g) || []).length;
  const headingMatches = content.match(/^#+\s+/gm) || [];
  const uniqueHeadings = new Set(headingMatches.map(h => h.trim())).size;
  const internalLinks = (content.match(/\]\((\/[^)]+)\)/g) || []).length;
  
  // Calculate readability: penalize very short sentences (< 5 words)
  const sentences = content.split(/[.!?]+/).filter(s => s.trim());
  const avgWordsPerSentence = sentences.length > 0 
    ? sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length 
    : 0;
  
  const readabilityScore = Math.max(0, Math.min(100, 
    50 + (avgWordsPerSentence - 10) * 2 // Target: 10-15 words per sentence
  ));

  const templateMatches = THIN_PATTERNS.filter(p => p.test(content)).length;
  const hasIntroduction = /^#+\s+(introduction|overview|start here|quick answer)/im.test(content);
  const hasConclusion = /^#+\s+(conclusion|bottom line|takeaway|summary|next step)/im.test(content);

  return {
    wordCount,
    sentenceCount,
    uniqueHeadings,
    internalLinks,
    readabilityScore,
    templateMatches,
    hasIntroduction,
    hasConclusion
  };
}

// ============================================================================
// IMPROVED: Thin content detection with configurable thresholds
// ============================================================================
function isLowValueContent(content: string, minWords = 220, maxTemplateMatches = 2): boolean {
  const metrics = calculateContentMetrics(content);
  
  // Multiple quality signals
  if (metrics.wordCount < minWords) return true;
  if (metrics.templateMatches > maxTemplateMatches) return true;
  if (metrics.sentenceCount === 0 && metrics.wordCount > 0) return true; // No punctuation
  if (metrics.internalLinks < 2) return true; // Insufficient linking
  if (!metrics.hasIntroduction || !metrics.hasConclusion) return true;
  
  return false;
}

// ============================================================================
// IMPROVED: Template title detection
// ============================================================================
function hasTemplatedTitle(title: string): boolean {
  return REPETITIVE_TITLE_PATTERNS.some((pattern) => pattern.test(title));
}

// ============================================================================
// IMPROVED: Blueprint inference with better categorization
// ============================================================================
function inferBlueprint(topic: string): TopicBlueprint {
  const lowerTopic = topic.toLowerCase();
  
  if (lowerTopic.includes('credit') || lowerTopic.includes('card')) {
    return {
      archetype: 'credit-cards',
      audience: 'cardholders choosing between rewards, intro APR offers, or annual-fee upgrades',
      opening:
        'Credit-card content often overpromises rewards and underexplains risk. This article focuses on real break-even math, statement timing, and ways to avoid paying interest.',
      links: {
        calculator: { label: 'Credit Card Payoff Calculator', href: '/calculators/credit-card-payoff-calculator' },
        comparison: { label: 'Credit card comparisons', href: '/best-credit-cards-2026' },
        hub: { label: 'Credit cards hub', href: '/learn/credit-cards' },
        related: { label: 'How credit utilization works', href: '/blog/credit-utilization-statement-cycle-playbook' }
      },
      titleTemplates: [
        '%TOPIC%: How to Compare Offers Without Overpaying',
        '%TOPIC%: Fees, Rewards, and Interest Tradeoffs',
        '%TOPIC%: A Smarter Decision Framework'
      ],
      descriptionTemplates: [
        'Make a better %TOPIC_LOWER% decision with fee break-even math, statement-timing tactics, and links to the right calculators.',
        'Learn how to evaluate %TOPIC_LOWER% using realistic spending examples, risk checks, and next-step tools.'
      ]
    };
  }

  if (lowerTopic.includes('mortgage') || lowerTopic.includes('loan') || lowerTopic.includes('heloc')) {
    return {
      archetype: 'loans',
      audience: 'borrowers comparing lenders, rates, and monthly payment risk before applying',
      opening:
        'Borrowing decisions are won or lost before you sign: in documentation, APR comparison, and timeline planning. This guide emphasizes those high-impact details.',
      links: {
        calculator: { label: 'Loan Calculator', href: '/calculators/loan-calculator' },
        comparison: { label: 'Personal loan comparisons', href: '/loans' },
        hub: { label: 'Loans hub', href: '/learn/loans' },
        related: { label: 'Debt-to-income ratio guide', href: '/blog/debt-to-income-ratio-90-day-plan' }
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

  if (lowerTopic.includes('invest') || lowerTopic.includes('retirement') || lowerTopic.includes('dividend') || lowerTopic.includes('asset')) {
    return {
      archetype: 'investing',
      audience: 'beginners and intermediate investors building a repeatable long-term contribution plan',
      opening:
        'Strong investing outcomes usually come from process quality, not prediction. This guide translates the topic into scenarios, fee tradeoffs, and actions you can automate.',
      links: {
        calculator: { label: 'Investment Growth Calculator', href: '/calculators/investment-growth-calculator' },
        comparison: { label: 'Best investment apps', href: '/best-investment-apps' },
        hub: { label: 'Investing hub', href: '/learn/investing' },
        related: { label: 'Dollar-cost averaging guide', href: '/blog/beginner-investing-roadmap-year-one-milestones' }
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

  if (lowerTopic.includes('tax')) {
    return {
      archetype: 'tax',
      audience: 'workers and investors trying to improve after-tax returns legally and consistently',
      opening:
        'Tax optimization is rarely one trick. It is account location, contribution order, and withdrawal timing working together. This article keeps the focus there.',
      links: {
        calculator: { label: 'Retirement Calculator', href: '/calculators/retirement-calculator' },
        comparison: { label: 'Investment account comparisons', href: '/best-investment-apps' },
        hub: { label: 'Investing hub', href: '/learn/investing' },
        related: { label: 'Roth vs Traditional IRA', href: '/blog/tax-efficient-investing-account-location-decisions' }
      },
      titleTemplates: [
        '%TOPIC%: Account Choices That Keep More of Your Return',
        '%TOPIC%: Practical Tax-Efficiency Moves',
        '%TOPIC%: How to Reduce Tax Drag Without Guesswork'
      ],
      descriptionTemplates: [
        'Use this %TOPIC_LOWER% guide to prioritize account type, contribution order, and withdrawal rules based on your timeline.',
        'Tax-smart %TOPIC_LOWER% planning with clear examples, tradeoffs, and links to relevant tools.'
      ]
    };
  }

  if (lowerTopic.includes('budget') || lowerTopic.includes('save') || lowerTopic.includes('emergency')) {
    return {
      archetype: 'budgeting',
      audience: 'households tightening cash flow while still saving for short-term goals',
      opening:
        'Budgeting advice gets repetitive fast. This piece focuses on a realistic monthly system you can actually follow when bills and variable costs change.',
      links: {
        calculator: { label: 'Budget Planner', href: '/calculators/budget-planner' },
        comparison: { label: 'Best savings accounts', href: '/best-savings-accounts-usa' },
        hub: { label: 'Budgeting hub', href: '/learn/budgeting' },
        related: { label: 'Emergency fund guide', href: '/blog/emergency-fund-target-by-recovery-timeline' }
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
      related: { label: 'Automate your savings plan', href: '/blog/emergency-fund-target-by-recovery-timeline' }
    },
    titleTemplates: ['%TOPIC%: Clear Priorities and Smart Next Steps'],
    descriptionTemplates: ['Get practical %TOPIC_LOWER% guidance with examples, tradeoffs, and next-step tools.']
  };
}

// ============================================================================
// Content building functions (unchanged for brevity - keep original implementations)
// ============================================================================

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

const repeatedHeadingReplacements: Array<{ pattern: RegExp; options: string[] }> = [
  {
    pattern: /^##\s*quick answer\s*$/gim,
    options: ['## Decision snapshot', '## The tradeoff in one minute', '## Start with this lens']
  },
  {
    pattern: /^##\s*when this matters\s*$/gim,
    options: ['## Use this framework when', '## Timing signals to watch', '## Where this decision has the biggest impact']
  },
  {
    pattern: /^##\s*best option if\s*$/gim,
    options: ['## Best-fit path', '## Strong fit signals', '## Who each path serves best']
  },
  {
    pattern: /^##\s*avoid this mistake\s*$/gim,
    options: ['## High-cost errors to avoid', '## Mistakes that quietly cost thousands', '## Failure patterns to catch early']
  },
  {
    pattern: /^##\s*what should you do now\??\s*$/gim,
    options: ['## Your next move this week', '## Execution plan for the next 7 days', '## Turn analysis into action']
  }
];

const secondaryCalculatorByArchetype: Record<TopicBlueprint['archetype'], { label: string; href: string }> = {
  investing: { label: 'Retirement Calculator', href: '/calculators/retirement-calculator' },
  loans: { label: 'Debt Payoff Calculator', href: '/calculators/debt-payoff-calculator' },
  budgeting: { label: 'Savings Goal Calculator', href: '/calculators/savings-goal-calculator' },
  savings: { label: 'Compound Interest Calculator', href: '/calculators/compound-interest-calculator' },
  'credit-cards': { label: 'Debt Avalanche Calculator', href: '/calculators/debt-avalanche-calculator' },
  tax: { label: 'Salary After-Tax Calculator', href: '/calculators/salary-after-tax-calculator' }
};

const relatedBlogsByArchetype: Record<TopicBlueprint['archetype'], Array<{ label: string; href: string }>> = {
  investing: [
    { label: '401(k) contribution rate targets', href: '/blog/401k-contribution-rate-sustainable-target-2026' },
    { label: 'Dollar-cost averaging playbook', href: '/blog/beginner-investing-roadmap-year-one-milestones' }
  ],
  loans: [
    { label: 'Debt-to-income 90-day plan', href: '/blog/debt-to-income-ratio-90-day-plan' },
    { label: '15-year vs 30-year mortgage cost', href: '/blog/15-year-vs-30-year-mortgage-2026-total-cost' }
  ],
  budgeting: [
    { label: 'Zero-based budget operating system', href: '/blog/zero-based-budget-assign-every-dollar-job' },
    { label: 'Monthly expense audit system', href: '/blog/monthly-expense-audit-system' }
  ],
  savings: [
    { label: 'Where to store savings', href: '/blog/where-to-store-savings-hysa-vs-other-options' },
    { label: 'How to increase your savings rate', href: '/blog/how-to-increase-your-savings-rate' }
  ],
  'credit-cards': [
    { label: 'Credit utilization statement-cycle playbook', href: '/blog/credit-utilization-statement-cycle-playbook' },
    { label: 'APR cost-to-carry breakdown', href: '/blog/credit-card-apr-what-it-actually-costs' }
  ],
  tax: [
    { label: 'Roth vs Traditional 401(k) decision guide', href: '/blog/roth-vs-traditional-401k-decision-guide' },
    { label: '0% capital-gains harvesting rules', href: '/blog/capital-gains-tax-strategy-0-percent-harvesting-2026' }
  ]
};

const scenarioRowsByArchetype: Record<TopicBlueprint['archetype'], ScenarioRow[]> = {
  investing: [
    { monthly: '$600 invested', annual: '$7,200 contribution', longTerm: '≈ $196,000 in 15 years at 8%', note: 'Skipping one full year can reduce the 15-year result by ~10–12%.' },
    { monthly: '$1,000 invested', annual: '$12,000 contribution', longTerm: '≈ $549,000 in 20 years at 7%', note: 'Cutting monthly contributions to $700 lowers the 20-year total by roughly six figures.' }
  ],
  loans: [
    { monthly: '$375 payment', annual: '$4,500 cash outflow', longTerm: '≈ $22,500 over 5 years', note: 'Refinancing 3 points lower could save roughly $2,000–$3,000 total interest.' },
    { monthly: '$550 payment', annual: '$6,600 cash outflow', longTerm: '≈ $39,600 over 6 years', note: 'Extending term to lower payment may add ~$4,000+ in total interest.' }
  ],
  budgeting: [
    { monthly: '$350 auto-transfer', annual: '$4,200 saved', longTerm: '≈ $24,000 in 5 years at 4.5% APY', note: 'Skipping transfers for three high-spend months can erase one full quarter of progress.' },
    { monthly: '$500 auto-transfer', annual: '$6,000 saved', longTerm: '≈ $40,000 in 6 years at 4.0% APY', note: 'A $200 recurring leak can cost ~$14,000 over six years including foregone growth.' }
  ],
  savings: [
    { monthly: '$250 contribution', annual: '$3,000 saved', longTerm: '≈ $16,600 in 5 years at 4.2% APY', note: 'Using a near-zero-yield account can leave ~$1,500+ on the table versus HYSA rates.' },
    { monthly: '$800 contribution', annual: '$9,600 saved', longTerm: '≈ $53,000 in 5 years at 4.0% APY', note: 'Missing six deposits in a bad cash-flow year can reduce the 5-year result by ~$5,000.' }
  ],
  'credit-cards': [
    { monthly: '$400 revolving balance', annual: '≈ $1,056 annual interest at 22% APR', longTerm: '≈ $5,280 over 5 years if balance persists', note: 'A payoff plan that clears this in 18 months saves ~$1,000+ in interest.' },
    { monthly: '$1,200 revolving balance', annual: '≈ $3,168 annual interest at 22% APR', longTerm: '≈ $15,800 over 5 years if unchanged', note: 'Chasing rewards while carrying debt is often a net loss after interest.' }
  ],
  tax: [
    { monthly: '$700 pre-tax contribution', annual: '$8,400 sheltered from current tax', longTerm: 'Potentially $170,000+ account value in 12 years at 7%', note: 'Wrong account mix can create avoidable tax drag of 0.3–0.8% annually.' },
    { monthly: '$500 Roth contribution', annual: '$6,000 after-tax invested', longTerm: '≈ $250,000 in 20 years at 7%', note: 'Deferring tax planning until retirement can reduce withdrawal flexibility and increase final tax bill.' }
  ]
};

function normalizeTemplateHeadings(content: string, slug: string) {
  let updated = content;
  for (const item of repeatedHeadingReplacements) {
    const replacement = pick(item.options, `${slug}-${item.pattern.source}`);
    updated = updated.replace(item.pattern, replacement);
  }
  return updated;
}

function hasMinRelatedLinks(content: string) {
  const internalLinks = content.match(/\]\((\/[^)]+)\)/g) ?? [];
  return internalLinks.length >= 5;
}

function buildDecisionUpgradeBlock(post: BlogPost, blueprint: TopicBlueprint) {
  const scenario = pick(scenarioRowsByArchetype[blueprint.archetype], `${post.slug}-scenario`);
  const altScenario = pick(scenarioRowsByArchetype[blueprint.archetype], `${post.slug}-scenario-alt`);
  const secondaryCalculator = secondaryCalculatorByArchetype[blueprint.archetype];
  const relatedBlogs = relatedBlogsByArchetype[blueprint.archetype];

  const introVariants = [
    '## Scenario lab: run this with your real numbers',
    '## Stress-test view: base case vs bad-month case',
    '## Decision simulator: monthly to long-term impact'
  ];
  const costVariants = [
    '## Cost of the wrong decision (in dollars)',
    '## What the wrong choice can cost you',
    '## Dollar downside if you optimize the wrong metric'
  ];
  const edgeVariants = [
    '## Edge cases that break a good plan',
    '## Bad-month scenarios to model before acting',
    '## Non-ideal conditions to include in your model'
  ];

  return `
${pick(introVariants, `${post.slug}-intro-variant`)}

| Monthly decision input | 12-month effect | Longer-term projection | What changes the outcome |
|---|---|---|---|
| ${scenario.monthly} | ${scenario.annual} | ${scenario.longTerm} | ${scenario.note} |
| ${altScenario.monthly} | ${altScenario.annual} | ${altScenario.longTerm} | ${altScenario.note} |

## Decision table: choose by context, not hype

| Situation | Best option | Why |
|---|---|---|
| You need downside protection first | Simpler lower-risk setup | Preserves flexibility when a surprise expense hits. |
| You can commit for 12+ months | Optimization path with automation | Compounding and habit consistency usually beat one-time tactics. |
| You expect an irregular-income quarter | Conservative payment/savings target | Avoids plan collapse and expensive resets. |

${pick(costVariants, `${post.slug}-cost-variant`)}

- Choosing based on headline upside only can create a **multi-thousand-dollar drag** from avoidable fees, interest, or tax friction.
- A single bad-month miss (income dip + surprise bill) can undo several months of progress if liquidity and payment buffers are thin.
- Write a hard ceiling now: maximum fee, payment, or risk level you will accept before acting.

${pick(edgeVariants, `${post.slug}-edge-variant`)}

1. Income temporarily drops 15–20% for one quarter.
2. A $1,200 unexpected expense lands in the same month.
3. Product terms worsen after onboarding or teaser periods end.

If your plan still works in this stress case, it is probably durable.

## Execute the workflow: calculator → compare → decide

- Run primary math in [${blueprint.links.calculator.label}](${blueprint.links.calculator.href}).
- Pressure-test with a second model in [${secondaryCalculator.label}](${secondaryCalculator.href}).
- Shortlist options on [${blueprint.links.comparison.label}](${blueprint.links.comparison.href}).
- Read [${relatedBlogs[0].label}](${relatedBlogs[0].href}) and [${relatedBlogs[1].label}](${relatedBlogs[1].href}) before final action.
- Keep your operating playbook in [${blueprint.links.hub.label}](${blueprint.links.hub.href}).
`;
}

function enrichContent(post: BlogPost, blueprint: TopicBlueprint) {
  let content = normalizeTemplateHeadings(post.content, post.slug);
  const hasScenarioSection = /cost of the wrong decision|decision table|bad-month|stress-test/i.test(content);

  if (!hasScenarioSection || !hasMinRelatedLinks(content)) {
    content = `${content.trim()}\n${buildDecisionUpgradeBlock(post, blueprint)}\n`;
  }

  return content;
}

// ============================================================================
// IMPROVED: Quality scoring with enhanced metrics
// ============================================================================
export function qualityScore(post: BlogPost): number {
  const metrics = calculateContentMetrics(post.content);
  
  // Base score from word count (max 60 points)
  let score = Math.min(60, Math.floor(metrics.wordCount / 10));

  // Title quality (max 15 points)
  if (!hasTemplatedTitle(post.title)) score += 10;
  if (!/\(\d{4}\)/.test(post.title)) score += 5;

  // Content quality (max 25 points)
  if (!isLowValueContent(post.content)) score += 15;
  if (metrics.sentenceCount > 0 && metrics.readabilityScore > 40) score += 10;

  // Structure quality (max 10 points)
  if (metrics.hasIntroduction) score += 5;
  if (metrics.hasConclusion) score += 5;

  // Link quality (max 5 points)
  if (metrics.internalLinks >= 5) score += 5;

  // Penalize numeric slugs with weak content
  if (/-\d+$/.test(post.slug)) score -= 8;

  return Math.max(0, Math.min(100, score));
}

// ============================================================================
// IMPROVED: Post exclusion with better logic
// ============================================================================
export function shouldExcludePost(post: BlogPost): boolean {
  const metrics = calculateContentMetrics(post.content);
  const numericTail = /-\d+$/.test(post.slug);
  const thin = isLowValueContent(post.content);
  const templated = hasTemplatedTitle(post.title) || 
    /with practical steps, examples, and expert tips/i.test(post.description);

  // Exclude if:
  // 1. Has numeric tail AND (thin OR templated)
  // 2. Word count critically low
  // 3. No internal links AND thin content
  if (numericTail && (thin || templated)) return true;
  if (metrics.wordCount < 150) return true;
  if (metrics.internalLinks < 2 && thin) return true;

  return false;
}

// ============================================================================
// IMPROVED: Post enhancement with deduplication awareness
// ============================================================================
export function enhancePost(post: BlogPost, deduplicationMap?: Map<string, string>): BlogPost {
  const topicLabel = cleanSlug(post.slug);
  const canonicalKey = canonicalTopicKey(post);
  
  // Check for duplicates using canonical topic key
  if (deduplicationMap?.has(canonicalKey)) {
    console.warn(`[blogEnhancer] Duplicate content detected: "${post.slug}" matches existing "${deduplicationMap.get(canonicalKey)}"`);
  }

  const blueprint = inferBlueprint(`${post.category} ${post.slug}`.toLowerCase());
  const title = normalizeTitle(post, topicLabel, blueprint);
  const description = normalizeDescription(post, topicLabel, blueprint);

  return {
    ...post,
    title,
    description,
    seoTitle: `${title} | FinanceSphere`,
    metaDescription: description,
    content: enrichContent(post, blueprint)
  };
}

// ============================================================================
// NEW: Batch deduplication utility
// ============================================================================
export function buildDeduplicationMap(posts: BlogPost[]): Map<string, string> {
  const map = new Map<string, string>();
  const duplicates: Array<{ canonical: string; posts: string[] }> = [];

  for (const post of posts) {
    const key = canonicalTopicKey(post);
    
    if (map.has(key)) {
      // Find the group this belongs to
      const existing = duplicates.find(d => d.canonical === key);
      if (existing) {
        existing.posts.push(post.slug);
      } else {
        duplicates.push({
          canonical: key,
          posts: [map.get(key)!, post.slug]
        });
      }
    } else {
      map.set(key, post.slug);
    }
  }

  // Log duplicates for manual review
  if (duplicates.length > 0) {
    console.warn(`[blogEnhancer] Found ${duplicates.length} duplicate topic groups:`);
    duplicates.forEach(dup => {
      console.warn(`  ${dup.canonical}: ${dup.posts.join(', ')}`);
    });
  }

  return map;
}
