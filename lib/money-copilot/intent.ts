export type Intent = 'job' | 'home' | 'debt' | 'retirement' | 'ambiguous' | 'general';

/**
 * Phrases that signal the user is asking about an "offer" or "deal" without
 * specifying what type (job, loan, credit card, mortgage, etc.).
 *
 * Exported so pipeline.ts and prompts.ts can share the same detection logic.
 */
export const AMBIGUOUS_OFFER_PATTERNS: string[] = [
  'should i accept the offer',
  'should i take the offer',
  'should i take this offer',
  'should i accept this offer',
  'is this offer worth it',
  'is this a good deal',
  'should i go for this',
  'should i accept it',
  'is this worth it',
];

/** Action-oriented words that, when combined with an unqualified "offer" or "deal",
 *  indicate a decision query (vs. a purely informational mention). */
export const OFFER_ACTION_WORDS: string[] = ['should', 'worth', 'accept', 'take'];

/** Keywords that firmly identify an offer as job-related. */
export const JOB_OFFER_QUALIFIERS: string[] = [
  'job offer', 'salary offer', 'compensation package', 'new job', 'job in',
  'w2', 'c2c', 'contractor', 'employment offer', 'position',
];

/** Keywords that firmly identify an offer as loan/debt-related. */
export const LOAN_OFFER_QUALIFIERS: string[] = [
  'loan offer', 'personal loan', 'mortgage offer', 'refinance offer',
  'balance transfer', 'credit card offer', 'card offer', 'apr', 'interest rate offer',
];

/** Clarification question shown to the user when the offer type is ambiguous. */
export const AMBIGUOUS_OFFER_CLARIFICATION =
  'I can help with that. Is this a job offer, loan offer, credit card offer, or mortgage/refinance offer?';

/**
 * Returns true when a question mentions an "offer" or "deal" in a decision context
 * without specifying a concrete offer type (job, loan, credit card, mortgage, etc.).
 *
 * @returns true if the query is an ambiguous offer/deal decision; false if a specific
 *   offer type (job, loan, credit card, mortgage) is mentioned or the question is unrelated.
 *
 * Centralised here so pipeline.ts and prompts.ts share identical detection logic.
 */
export function isAmbiguousOfferQuery(question: string): boolean {
  const q = question.toLowerCase();
  const hasJobQualifier = JOB_OFFER_QUALIFIERS.some((k) => q.includes(k));
  const hasLoanQualifier = LOAN_OFFER_QUALIFIERS.some((k) => q.includes(k));
  if (hasJobQualifier || hasLoanQualifier) return false;

  // Explicit ambiguous pattern match
  if (AMBIGUOUS_OFFER_PATTERNS.some((p) => q.includes(p))) return true;

  // Bare "offer" or "deal" combined with an action-oriented word
  const hasBareOffer = q.includes('offer') || q.includes(' deal');
  const hasActionWord = OFFER_ACTION_WORDS.some((w) => q.includes(w));
  return hasBareOffer && hasActionWord;
}

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

  // Ambiguous offer — check before the broad keyword matching below
  if (isAmbiguousOfferQuery(input)) return 'ambiguous';

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
