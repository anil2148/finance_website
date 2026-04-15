import type { AiPageContext, AiPageType } from '@/lib/money-copilot/types';

export function regionFromPath(pathname: string): 'US' | 'IN' {
  return pathname === '/in' || pathname.startsWith('/in/') ? 'IN' : 'US';
}

export function currencyFromRegion(region: 'US' | 'IN'): 'USD' | 'INR' {
  return region === 'IN' ? 'INR' : 'USD';
}

interface AiContextBuilder {
  matches: (pathname: string) => boolean;
  build: (context: AiPageContext) => AiPageContextOverrides;
}

type RequiredAiPageContextFields = Pick<
  AiPageContext,
  'pageType' | 'pageTitle' | 'pageUrl' | 'region' | 'currency' | 'intent'
>;

export type AiPageContextOverrides = Partial<AiPageContext> & Partial<RequiredAiPageContextFields>;

function defaultSuggestedPrompts(region: 'US' | 'IN'): string[] {
  if (region === 'IN') {
    return [
      'Explain this result',
      'Stress-test this plan if rates rise by 1%',
      'What is a safer monthly target for this scenario?',
    ];
  }

  return [
    'Explain this result',
    'Stress-test this plan in a bad month',
    'What safer target should I use?',
  ];
}

function inferPageType(pathname: string): AiPageType {
  if (pathname === '/' || pathname === '/in') return 'homepage';
  if (pathname.includes('/calculators/')) return 'calculator';
  if (pathname.includes('/compare/')) return 'comparison';
  if (pathname.includes('/learn/')) return 'guide';
  if (pathname.includes('/blog/')) return 'blog';
  if (pathname.includes('/tag/') || pathname.includes('/topic/') || pathname.includes('/blog/tag/')) return 'topic';
  if (pathname === '/in/tax') return 'india-tax-hub';
  if (pathname === '/in/home-loan-interest-rates-india') return 'india-home-loan-rates';
  if (pathname.startsWith('/in/')) return 'india-page';
  return 'decision-page';
}

export function shouldHideContextualAi(pathname: string): boolean {
  return pathname.includes('/tag/') || pathname.includes('/topic/') || pathname.includes('/blog/tag/');
}

function isLowContextTagOrTopicPage(pathname: string): boolean {
  return pathname.includes('/tag/') || pathname.includes('/topic/') || pathname.includes('/blog/tag/');
}

function isMortgageOrAffordabilityPage(pathname: string): boolean {
  return (
    pathname.includes('mortgage-calculator') ||
    pathname.includes('home-affordability') ||
    pathname.includes('rent-vs-buy') ||
    pathname === '/mortgage-calculator' ||
    pathname === '/in/home-affordability-india' ||
    pathname === '/in/rent-vs-buy-india'
  );
}

function isDtiOrDebtGuidePage(pathname: string): boolean {
  return (
    pathname.includes('debt-to-income') ||
    pathname.includes('/learn/loans') ||
    pathname === '/loans' ||
    pathname === '/in/loans'
  );
}

function isInvestingHubPage(pathname: string): boolean {
  return pathname === '/learn/investing' || pathname === '/in/investing';
}

function isSipOrCompoundCalculatorPage(pathname: string): boolean {
  return (
    pathname.includes('/calculators/compound-interest-calculator') ||
    pathname === '/compound-interest-calculator' ||
    pathname.includes('/in/calculators/sip-calculator')
  );
}

function inferPageTitle(pathname: string, pageType: AiPageType): string {
  if (pathname === '/') return 'FinanceSphere Homepage';
  if (pathname === '/in') return 'FinanceSphere India Homepage';
  if (pathname === '/ai-money-copilot') return 'AI Job Offer Analyzer';
  if (pathname === '/about' || pathname === '/about-us') return 'About FinanceSphere';

  const lastSegment = pathname.split('/').filter(Boolean).pop();
  if (!lastSegment) return pageType;
  return lastSegment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const AI_CONTEXT_BUILDERS: AiContextBuilder[] = [
  {
    // Low-context topic/tag archives should not pretend we have deep grounding.
    matches: isLowContextTagOrTopicPage,
    build: () => ({
      pageType: 'low-context-page',
      aiMode: 'hidden',
      intent: 'generic-finance-question',
      groundingMessage: 'This is a low-context tag/topic listing page; I only have lightweight navigation context.',
      structuredValues: undefined,
      calculatorState: undefined,
      suggestedPrompts: undefined,
    }),
  },
  {
    // Homepage (US + India)
    matches: (pathname) => pathname === '/' || pathname === '/in',
    build: (context) => ({
      pageType: 'homepage',
      aiMode: 'contextual',
      intent: 'financial-decision-triage',
      groundingMessage:
        context.region === 'IN'
          ? 'I’m using the India homepage context and available values to route your next move.'
          : 'I’m using the homepage context and available values to route your next move.',
      structuredValues:
        context.region === 'IN'
          ? {
              availableTracks: ['SIP planning', 'home affordability', 'tax regime check', 'debt payoff'],
              defaultPlanningLens: 'Monthly cashflow first, then long-term growth',
            }
          : {
              availableTracks: ['job offers', 'home affordability', 'debt payoff', 'investing basics'],
              defaultPlanningLens: 'Cashflow resilience first, optimization second',
            },
      suggestedPrompts:
        context.region === 'IN'
          ? [
              'Which India calculator should I run first for my goal?',
              'Help me prioritize SIP vs debt payoff this month',
              'What is the safest next money move from this homepage?',
            ]
          : [
              'Which calculator should I run first for my situation?',
              'Help me choose my best next financial move',
              'Stress-test my current plan before I commit',
            ],
    }),
  },
  {
    // Job-offer analyzer workspace
    matches: (pathname) => pathname === '/ai-money-copilot',
    build: () => ({
      pageType: 'job-offer-analyzer',
      aiMode: 'contextual',
      intent: 'job-offer-comparison',
      groundingMessage: 'I’m using the job-offer analyzer context and your current decision inputs.',
      structuredValues: {
        supportedDecisions: ['job-offer', 'relocation', 'debt-payoff', 'home-affordability', 'investing'],
        defaultFlow: 'Recommendation → Why → Risks → Next step',
      },
      suggestedPrompts: [
        'Compare my current job and new offer with risk-adjusted take-home',
        'What salary increase is required to justify switching?',
        'How should I evaluate benefits vs base pay?',
      ],
    }),
  },
  {
    // Mortgage + home affordability pages
    matches: isMortgageOrAffordabilityPage,
    build: (context) => ({
      pageType: 'home-affordability',
      aiMode: 'contextual',
      intent: 'home-affordability-decision',
      groundingMessage:
        context.region === 'IN'
          ? 'I’m using your current home affordability inputs in India context.'
          : 'I’m using your current mortgage and affordability values.',
      suggestedPrompts:
        context.region === 'IN'
          ? [
              'Explain if this EMI is safe with my current numbers',
              'What happens if home-loan rates rise 1%?',
              'Should I buy now or delay and increase down payment?',
            ]
          : [
              'Can I safely afford this payment in a bad month?',
              'How does +1% rate change my monthly payment and total interest?',
              'Should I lower budget or extend term based on this result?',
            ],
    }),
  },
  {
    // Debt snowball calculator
    matches: (pathname) => pathname.includes('/calculators/debt-snowball-calculator'),
    build: () => ({
      pageType: 'debt-snowball-calculator',
      aiMode: 'contextual',
      intent: 'debt-payoff-prioritization',
      groundingMessage: 'I’m using your current debt-snowball inputs and payoff outputs.',
      suggestedPrompts: [
        'Which debt should I prioritize first based on these results?',
        'How much faster if I add an extra monthly payment?',
        'What risk if I miss one payment month?',
      ],
    }),
  },
  {
    // DTI + debt guides
    matches: isDtiOrDebtGuidePage,
    build: () => ({
      pageType: 'dti-debt-guide',
      aiMode: 'contextual',
      intent: 'debt-capacity-and-dti',
      groundingMessage: 'I’m using this debt/DTI guide context to explain actionable next steps.',
      suggestedPrompts: [
        'How can I reduce DTI fastest in 90 days?',
        'What DTI level is safer before applying for a mortgage?',
        'Should I prioritize debt payoff or emergency fund first?',
      ],
    }),
  },
  {
    // Investing hub
    matches: isInvestingHubPage,
    build: (context) => ({
      pageType: 'investing-hub',
      aiMode: 'contextual',
      intent: 'investing-plan-setup',
      groundingMessage:
        context.region === 'IN'
          ? 'I’m using India investing context (SIP, tax, and risk profile) from this page.'
          : 'I’m using this investing hub context and your available planning values.',
      suggestedPrompts:
        context.region === 'IN'
          ? [
              'How should I split SIP vs emergency fund contributions?',
              'What return assumption should I use for a conservative SIP plan?',
              'Should I use FD or SIP for a 3-year goal?',
            ]
          : [
              'How should I allocate between emergency fund and investing?',
              'What return assumption should I use for conservative planning?',
              'Is my contribution level enough for my timeline?',
            ],
    }),
  },
  {
    // SIP + compound calculators
    matches: isSipOrCompoundCalculatorPage,
    build: (context) => ({
      pageType: context.region === 'IN' ? 'sip-calculator' : 'compound-calculator',
      aiMode: 'contextual',
      intent: 'compounding-result-explainer',
      groundingMessage:
        context.region === 'IN'
          ? 'I’m using your SIP calculator inputs and projected output values.'
          : 'I’m using your compound calculator inputs and projected output values.',
      suggestedPrompts:
        context.region === 'IN'
          ? [
              'Explain this SIP projection using my current values',
              'What if I increase SIP by ₹2,000 monthly?',
              'How sensitive is this to lower returns?',
            ]
          : [
              'Explain this compound growth result with my current numbers',
              'What if I increase monthly contribution by $100?',
              'How much does a lower return assumption change this outcome?',
            ],
    }),
  },
  {
    // India tax pages
    matches: (pathname) =>
      pathname === '/in/tax' ||
      pathname === '/in/tax-slabs' ||
      pathname === '/in/tax-slabs-2026-india' ||
      pathname === '/in/tax-saving-strategies' ||
      pathname.includes('/in/tax-') ||
      pathname.includes('/in/old-vs-new-tax-regime') ||
      pathname.includes('/in/80c'),
    build: () => ({
      pageType: 'india-tax-page',
      aiMode: 'contextual',
      intent: 'tax-regime-comparison',
      groundingMessage: 'I’m using the current India tax page values and assumptions shown here.',
      structuredValues: {
        salaryBands: ['₹8L', '₹12L', '₹18L', '₹25L+'],
        monthly80CTarget: '₹12,500',
        oldRegimePotentialSavings: '₹30,000–₹60,000 at ₹18L with full deductions',
        newRegimeTypicalWinRange: 'Often wins below ~₹2L–₹3L deductions',
      },
      suggestedPrompts: [
        'Compare old vs new regime for my salary band',
        'What deduction level flips the better regime?',
        'How should I prioritize 80C vs liquidity this year?',
      ],
    }),
  },
  {
    // India home-loan comparison pages
    matches: (pathname) =>
      pathname === '/in/home-loan-interest-rates-india' ||
      pathname.includes('/in/home-loan') ||
      pathname.includes('/in/real-estate'),
    build: () => ({
      pageType: 'india-home-loan-comparison',
      aiMode: 'contextual',
      intent: 'home-loan-lender-comparison',
      groundingMessage: 'I’m using the India home-loan comparison values shown on this page.',
      structuredValues: {
        lenders: [
          { name: 'SBI', rate: '~8.40%', processingFee: 'Up to 0.35%', emiOn50L20Y: '~₹43,200' },
          { name: 'HDFC', rate: '~8.50%', processingFee: '0.50% range', emiOn50L20Y: '~₹43,500' },
          { name: 'ICICI', rate: '~8.75%', processingFee: '0.50% range', emiOn50L20Y: '~₹44,250' },
        ],
        benchmarkLoan: '₹50,00,000 / 20 years',
        threeYearDecisionRule: 'Compare 3-year all-in cost, not teaser rate',
      },
      suggestedPrompts: [
        'Compare SBI vs HDFC using 3-year all-in cost',
        'What changes if rates rise by 1% next year?',
        'Is one extra EMI better than equivalent SIP contribution?',
      ],
    }),
  },
  {
    // Comparison pages
    matches: (pathname) => pathname.includes('/compare/') || pathname === '/comparison',
    build: (context) => ({
      pageType: 'comparison',
      aiMode: 'contextual',
      intent: 'generic-finance-question',
      groundingMessage: 'I’m using this comparison page context, including page title, region, and values visible on this page.',
      structuredValues: {
        ...context.structuredValues,
        comparisonPath: context.pageUrl,
      },
      suggestedPrompts: [
        'Summarize the trade-offs on this comparison page',
        'Which option profile looks safest for a bad-month budget?',
        'What should I verify before I choose from these options?',
      ],
    }),
  },
  {
    // Guides and learning hubs
    matches: (pathname) => pathname.includes('/learn/'),
    build: (context) => ({
      pageType: 'guide',
      aiMode: 'contextual',
      intent: 'generic-finance-question',
      groundingMessage: 'I’m using this guide page context (title, region, and key points shown on the page).',
      structuredValues: {
        ...context.structuredValues,
        guidePath: context.pageUrl,
      },
      suggestedPrompts: [
        'Give me a checklist based on this guide',
        'What would this guide suggest as my next decision?',
        'Which calculator should I run after reading this page?',
      ],
    }),
  },
  {
    // Blog articles
    matches: (pathname) => pathname.includes('/blog/'),
    build: (context) => ({
      pageType: 'blog',
      aiMode: 'contextual',
      intent: 'generic-finance-question',
      groundingMessage: 'I’m using this article context (page title, region, and current on-page values).',
      structuredValues: {
        ...context.structuredValues,
        articlePath: context.pageUrl,
      },
      suggestedPrompts: [
        'Summarize this article into an action plan',
        'What assumptions in this article should I stress-test?',
        'Turn this article into next-week decisions for me',
      ],
    }),
  },
  {
    // About pages
    matches: (pathname) => pathname === '/about' || pathname === '/about-us',
    build: () => ({
      pageType: 'about-page',
      aiMode: 'generic',
      intent: 'platform-trust-and-methodology',
      groundingMessage: 'I’m using the About page context (methodology, scope, and limitations).',
      suggestedPrompts: [
        'How does FinanceSphere evaluate recommendations?',
        'What assumptions does this platform use by default?',
        'What should I verify with a human advisor?',
      ],
    }),
  },
  {
    // Catch-all calculator mode ensures current inputs/outputs are carried by overrides.
    matches: (pathname) => pathname.includes('/calculators/'),
    build: () => ({
      pageType: 'calculator',
      aiMode: 'contextual',
      intent: 'calculator-result-explainer',
      groundingMessage: 'I’m using your current calculator inputs and outputs.',
      suggestedPrompts: [
        'Explain this result',
        'Stress-test this scenario',
        'Show safer target values',
      ],
    }),
  },
];

export function buildBaseAiPageContext(pathname: string, title?: string): AiPageContext {
  const region = regionFromPath(pathname);
  const currency = currencyFromRegion(region);
  const pageType = inferPageType(pathname);
  const pageTitle = inferPageTitle(pathname, pageType);
  const pageFamily = pathname.split('/').filter(Boolean)[0] ?? 'root';
  const pathSegments = pathname.split('/').filter(Boolean);
  const topicKey = pathSegments[pathSegments.length - 1] ?? 'home';

  let context: AiPageContext = {
    pageType,
    pageTitle: title ?? pageTitle,
    region,
    currency,
    intent: 'general-financial-guidance',
    pageUrl: pathname,
    marketContext: region === 'IN' ? 'India personal finance context (CTC, EMI, SIP, tax regime, RBI)' : 'US personal finance context (mortgage, DTI, APR, credit score)',
    pageFamily,
    structuredValues: {
      pageType,
      region,
      pageTitle: title ?? pageTitle,
      pageFamily,
      topicKey,
      pathDepth: pathSegments.length,
    },
    suggestedPrompts: defaultSuggestedPrompts(region),
    groundingMessage:
      region === 'IN'
        ? `I’m using the values shown on this India page (${title ?? pageTitle}), plus page title and region context.`
        : `I’m using the values shown on this page (${title ?? pageTitle}), plus page title and region context.`,
    aiMode: shouldHideContextualAi(pathname) ? 'hidden' : 'generic',
  };

  for (const builder of AI_CONTEXT_BUILDERS) {
    if (!builder.matches(pathname)) continue;
    context = mergeAiPageContext(context, builder.build(context));
  }

  return context;
}

export function mergeAiPageContext(base: AiPageContext, overrides?: AiPageContextOverrides): AiPageContext {
  if (!overrides) return base;

  return {
    ...base,
    ...overrides,
    // Guard rails: routing-derived identity should always win for correctness.
    region: base.region,
    currency: base.currency,
    pageUrl: base.pageUrl,
    structuredValues: {
      ...(base.structuredValues ?? {}),
      ...(overrides.structuredValues ?? {}),
    },
    calculatorState: {
      ...(base.calculatorState ?? {}),
      ...(overrides.calculatorState ?? {}),
    },
    suggestedPrompts: overrides.suggestedPrompts ?? base.suggestedPrompts,
  };
}

export function serializeAiPageContext(context: AiPageContext | null): string {
  if (!context) return '';
  return JSON.stringify(context);
}
