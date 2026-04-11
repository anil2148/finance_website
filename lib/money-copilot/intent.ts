export type Intent = 'job' | 'home' | 'debt' | 'retirement' | 'ambiguous' | 'general';

/**
 * Phrases that signal the user is asking about an "offer" or "deal" without
 * specifying what type (job, loan, credit card, mortgage, etc.).
 */
const AMBIGUOUS_OFFER_PATTERNS: string[] = [
  'should i accept the offer',
  'should i take the offer',
  'should i take this offer',
  'should i accept this offer',
  'is this offer worth it',
  'is this a good deal',
  'should i go for this',
  'should i accept it',
  'is this worth it',
  'good deal',
  'worth it',
];

/** Keywords that firmly identify an offer as job-related. */
const JOB_OFFER_QUALIFIERS: string[] = [
  'job offer', 'salary offer', 'compensation package', 'new job', 'job in',
  'w2', 'c2c', 'contractor', 'employment offer', 'position',
];

/** Keywords that firmly identify an offer as loan/debt-related. */
const LOAN_OFFER_QUALIFIERS: string[] = [
  'loan offer', 'personal loan', 'mortgage offer', 'refinance offer',
  'balance transfer', 'credit card offer', 'card offer', 'apr', 'interest rate offer',
];

/**
 * Detect the financial intent of a user's free-form question using keyword matching.
 *
 * Examples:
 *   "Should I take a job offer in Texas?" → 'job'
 *   "Can I afford a $500k house?"         → 'home'
 *   "Should I pay off my loan?"           → 'debt'
 *   "Am I saving enough for retirement?"  → 'retirement'
 *   "Should I accept the offer?"          → 'ambiguous'
 */
export function detectIntent(input: string): Intent {
  const q = input.toLowerCase();

  // Ambiguous offer — check before the broad "offer" catch below
  const matchedAmbiguous = AMBIGUOUS_OFFER_PATTERNS.some((p) => q.includes(p));
  if (matchedAmbiguous) {
    const hasJobQualifier = JOB_OFFER_QUALIFIERS.some((k) => q.includes(k));
    const hasLoanQualifier = LOAN_OFFER_QUALIFIERS.some((k) => q.includes(k));
    if (!hasJobQualifier && !hasLoanQualifier) return 'ambiguous';
    if (hasJobQualifier) return 'job';
    if (hasLoanQualifier) return 'debt';
  }

  // Job / salary decisions (require explicit job signals, not just "offer")
  if (
    q.includes('job') ||
    q.includes('salary') ||
    q.includes('w2') ||
    q.includes('c2c') ||
    q.includes('contractor') ||
    q.includes('compensation') ||
    q.includes('income') ||
    q.includes('reloc') ||
    q.includes('moving to') ||
    q.includes('new state')
  ) {
    return 'job';
  }

  // Home / mortgage decisions
  if (
    q.includes('house') ||
    q.includes('home') ||
    q.includes('mortgage') ||
    q.includes('rent vs') ||
    q.includes('buy a') ||
    q.includes('afford') ||
    q.includes('down payment') ||
    q.includes('real estate') ||
    q.includes('property')
  ) {
    return 'home';
  }

  // Debt / loan decisions
  if (
    q.includes('debt') ||
    q.includes('loan') ||
    q.includes('credit card') ||
    q.includes('payoff') ||
    q.includes('pay off') ||
    q.includes('interest rate') ||
    q.includes('refinanc') ||
    q.includes('student loan')
  ) {
    return 'debt';
  }

  // Retirement decisions
  if (
    q.includes('retire') ||
    q.includes('401k') ||
    q.includes('401(k)') ||
    q.includes('roth') ||
    q.includes('ira') ||
    q.includes('pension') ||
    q.includes('social security') ||
    q.includes('on track')
  ) {
    return 'retirement';
  }

  return 'general';
}

/**
 * Map an Intent to a DecisionMode string used throughout the copilot system.
 */
export function intentToDecisionMode(intent: Intent): string {
  switch (intent) {
    case 'job':
      return 'job-offer';
    case 'home':
      return 'home-affordability';
    case 'debt':
      return 'debt-payoff';
    case 'retirement':
      return 'roth-vs-traditional';
    case 'ambiguous':
      return 'ambiguous-offer';
    default:
      return 'custom';
  }
}
