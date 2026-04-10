export type Intent = 'job' | 'home' | 'debt' | 'retirement' | 'general';

/**
 * Detect the financial intent of a user's free-form question using keyword matching.
 *
 * Examples:
 *   "Should I take a job offer in Texas?" → 'job'
 *   "Can I afford a $500k house?"         → 'home'
 *   "Should I pay off my loan?"           → 'debt'
 *   "Am I saving enough for retirement?"  → 'retirement'
 */
export function detectIntent(input: string): Intent {
  const q = input.toLowerCase();

  // Job / salary decisions
  if (
    q.includes('job') ||
    q.includes('salary') ||
    q.includes('offer') ||
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
    default:
      return 'custom';
  }
}
