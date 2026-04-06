/**
 * Content Quality System — FinanceSphere
 *
 * Reusable content primitives for intro variation, mistake modules,
 * real-life contradiction patterns, decision layers, and failure scenarios.
 *
 * Use these types and helpers to keep page DNA distinct while enforcing
 * the same editorial philosophy: run numbers, stress-test, compare tradeoffs, decide.
 */

// ---------------------------------------------------------------------------
// Intro variation modes — pick the one that fits the page topic
// ---------------------------------------------------------------------------

export type IntroMode =
  | 'blunt-problem-first'   // Lead with the problem most readers have right now
  | 'mistake-first'         // Open with the mistake before the solution
  | 'scenario-first'        // Ground the reader in a real situation immediately
  | 'decision-first'        // Open with the decision that needs to be made
  | 'tradeoff-first'        // Name the tension before explaining it
  | 'urgency-without-hype'; // Create urgency through real stakes, not hype

export type IntroVariant = {
  mode: IntroMode;
  headline: string;
  body: string;
};

// ---------------------------------------------------------------------------
// Common Mistake micro-module
// Each page should surface at least one of these.
// ---------------------------------------------------------------------------

export type CommonMistakeBlock = {
  /** Short label for the mistake (e.g. "Starting SIP too large") */
  mistake: string;
  /** Why this specific mistake backfires in real life */
  whyItBackfires: string;
  /** The better, more durable alternative */
  betterAlternative: string;
};

// ---------------------------------------------------------------------------
// Real-Life Contradiction micro-module
// "Mathematically X wins. In real life many people choose Y because..."
// This adds authenticity and reduces template feel.
// ---------------------------------------------------------------------------

export type RealLifeContradiction = {
  /** What the math/theory says */
  mathWinner: string;
  /** What real people tend to do */
  realLifeChoice: string;
  /** The honest reason — not judgement, just reality */
  reason: string;
  /** Optional: what to do with this tension */
  resolution?: string;
};

// ---------------------------------------------------------------------------
// Decision Layer — every major page answers three questions
// ---------------------------------------------------------------------------

export type DecisionLayer = {
  /** Who should take this option / action */
  whoShouldChooseThis: string[];
  /** Who should avoid this option / action */
  whoShouldAvoidThis: string[];
  /** When this choice works */
  whenItWorks: string[];
  /** When this choice fails */
  whenItFails: string[];
  /** The safer middle-ground if neither extreme fits */
  saferMiddleGround?: string;
  /** What to do next after deciding */
  whatToDoNext?: Array<{ label: string; href: string }>;
};

// ---------------------------------------------------------------------------
// Failure Scenario — "where this breaks" layer
// ---------------------------------------------------------------------------

export type FailureScenario = {
  label: string;
  scenario: string;
  failurePoint: string;
  consequence: string;
  /** Rule of thumb to avoid this failure */
  rule?: string;
};

// ---------------------------------------------------------------------------
// Human judgment line — memorable, practical, non-dramatic
// One of these per page, naturally integrated into the copy.
// ---------------------------------------------------------------------------

export const HUMAN_JUDGMENT_LINES = {
  behaviorOverMath:
    'The biggest risk is often behavior, not math. A plan that only works when you feel confident is not a real plan.',
  worstMonthRule:
    'A plan that only works in your best month is not a real plan. Design around your worst recent month.',
  safetyVsOptimal:
    'Most people choose the option that feels safer — not always the one that is mathematically optimal. Both facts are worth knowing.',
  ambitionVsSustainability:
    'An ambitious number looks better on a projection chart. A sustainable number actually builds the corpus.',
  paperDiscipline:
    'Paper discipline is easy. Real discipline is tested when the market is down 25% and a large expense arrives the same week.',
  higherPaymentFragility:
    'A higher payment may be technically affordable but still fragile. Fragile plans fail at the worst possible moments.',
  lossAversion:
    'Most people overestimate their risk tolerance when markets rise and underestimate it when markets fall. Design for the real version of yourself.',
  redemptionTiming:
    'Redeeming at the wrong time turns a paper loss into a real one. The plan only works if you leave it alone when it is uncomfortable.',
  compoundingAndConsistency:
    'Consistency compounds more reliably than optimization. A smaller amount you never miss is worth more than a larger amount you pause twice a year.',
  debtConsolidationTrap:
    'Debt consolidation without a spending-control mechanism often accelerates the problem it was designed to solve.'
} as const;

// ---------------------------------------------------------------------------
// Page-type intent signatures
// Use these to stay consistent across pages of the same type.
// ---------------------------------------------------------------------------

export const PAGE_INTENT = {
  indiaArticle: {
    headerTag: 'FinanceSphere India',
    reviewNote: 'FY 2025–26 India',
    footerDisclaimer:
      'Educational content only. Verify current rates, tax rules, and product terms directly with providers before acting.'
  },
  usComparison: {
    headerTag: 'FinanceSphere',
    footerDisclaimer:
      'Educational content only. Verify current rates, fees, and eligibility terms with providers before applying.'
  }
} as const;
