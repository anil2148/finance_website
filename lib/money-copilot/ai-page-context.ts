import type { AiPageContext } from '@/lib/money-copilot/types';

export function regionFromPath(pathname: string): 'US' | 'IN' {
  return pathname === '/in' || pathname.startsWith('/in/') ? 'IN' : 'US';
}

export function currencyFromRegion(region: 'US' | 'IN'): 'USD' | 'INR' {
  return region === 'IN' ? 'INR' : 'USD';
}

function defaultSuggestedPrompts(region: 'US' | 'IN'): string[] {
  if (region === 'IN') {
    return [
      'Explain this result using my current India numbers',
      'Stress-test this plan if rates rise by 1%',
      'What is the safer monthly target for this scenario?',
    ];
  }

  return [
    'Explain this result with my current numbers',
    'Stress-test this plan in a bad month',
    'What safer target should I use?',
  ];
}

function inferPageType(pathname: string): string {
  if (pathname === '/' || pathname === '/in') return 'homepage';
  if (pathname.includes('/calculators/')) return 'calculator';
  if (pathname.includes('/compare/')) return 'comparison';
  if (pathname.includes('/learn/')) return 'guide';
  if (pathname.includes('/blog/')) return 'blog';
  if (pathname.includes('/tag/') || pathname.includes('/topic/')) return 'topic';
  if (pathname === '/in/tax') return 'india-tax-hub';
  if (pathname === '/in/home-loan-interest-rates-india') return 'india-home-loan-rates';
  if (pathname.startsWith('/in/')) return 'india-page';
  return 'decision-page';
}

export function shouldHideContextualAi(pathname: string): boolean {
  return pathname.includes('/tag/') || pathname.includes('/topic/');
}

export function buildBaseAiPageContext(pathname: string, title?: string): AiPageContext {
  const region = regionFromPath(pathname);
  const currency = currencyFromRegion(region);
  const pageType = inferPageType(pathname);
  const pageFamily = pathname.split('/').filter(Boolean)[0] ?? 'root';

  const context: AiPageContext = {
    pageType,
    pageTitle: title ?? pageType,
    region,
    currency,
    pageUrl: pathname,
    marketContext: region === 'IN' ? 'India personal finance context (CTC, EMI, SIP, tax regime, RBI)' : 'US personal finance context (mortgage, DTI, APR, credit score)',
    pageFamily,
    suggestedPrompts: defaultSuggestedPrompts(region),
    groundingMessage:
      region === 'IN'
        ? 'I’m using the current India page context and values available here.'
        : 'I’m using the current page context and values available here.',
    aiMode: shouldHideContextualAi(pathname) ? 'hidden' : 'generic',
  };

  if (pathname === '/in/tax') {
    context.pageType = 'india-tax-hub';
    context.aiMode = 'contextual';
    context.intent = 'tax-regime-comparison';
    context.groundingMessage = 'I’m using the current tax page values and India context.';
    context.structuredValues = {
      salaryBands: ['₹8L', '₹12L', '₹18L', '₹25L+'],
      monthly80CTarget: '₹12,500',
      oldRegimePotentialSavings: '₹30,000–₹60,000 at ₹18L with full deductions',
      newRegimeTypicalWinRange: 'Often wins below ~₹2L–₹3L deductions',
    };
    context.suggestedPrompts = [
      'Compare old vs new regime for ₹12L',
      'Explain break-even deduction threshold',
      'Which regime usually wins at ₹18L?',
    ];
  }

  if (pathname === '/in/home-loan-interest-rates-india') {
    context.pageType = 'india-home-loan-rates';
    context.aiMode = 'contextual';
    context.intent = 'home-loan-lender-comparison';
    context.groundingMessage = 'I’m using the home-loan comparison data shown on this page.';
    context.structuredValues = {
      lenders: [
        { name: 'SBI', rate: '~8.40%', processingFee: 'Up to 0.35%', emiOn50L20Y: '~₹43,200' },
        { name: 'HDFC', rate: '~8.50%', processingFee: '0.50% range', emiOn50L20Y: '~₹43,500' },
        { name: 'ICICI', rate: '~8.75%', processingFee: '0.50% range', emiOn50L20Y: '~₹44,250' },
      ],
      benchmarkLoan: '₹50,00,000 / 20 years',
      threeYearDecisionRule: 'Compare 3-year all-in cost, not teaser rate',
    };
    context.suggestedPrompts = [
      'Compare SBI vs HDFC for 3-year cost',
      'What if rates rise 1%?',
      'Is one extra EMI better than SIP?',
    ];
  }

  if (pathname === '/' || pathname === '/in') {
    context.pageType = 'homepage';
    context.aiMode = 'contextual';
    context.intent = 'financial-decision-triage';
    context.groundingMessage =
      region === 'IN'
        ? 'I’m using the India homepage context to route your decision.'
        : 'I’m using the homepage context to route your decision.';
  }

  if (pathname.includes('/calculators/')) {
    context.pageType = 'calculator';
    context.aiMode = 'contextual';
    context.intent = 'calculator-result-explainer';
    context.groundingMessage = 'I’m using your current calculator inputs and outputs.';
    context.suggestedPrompts = [
      'Explain this result',
      'Stress-test this scenario',
      'Show safer target values',
    ];
  }

  if (pathname.includes('/learn/') || pathname.includes('/blog/')) {
    context.aiMode = 'generic';
  }

  return context;
}

export function mergeAiPageContext(base: AiPageContext, overrides?: Partial<AiPageContext>): AiPageContext {
  if (!overrides) return base;

  return {
    ...base,
    ...overrides,
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
