/**
 * Institutional AI Execution Engine — 4-Layer Pipeline
 *
 * Layer 1 – Intent:    classify the request type and compute a confidence score
 * Layer 2 – Context:   snapshot portfolio, region, risk profile, and history
 * Layer 3 – Reasoning: produce structured financial analysis (no conversational text)
 * Layer 4 – Execution: derive concrete actions (rebalance, simulate, report, hedge)
 *                      with explicit risk and impact annotations
 */

import type {
  DecisionMode,
  FinancialInputs,
  CopilotResponse,
  IntentClassification,
  ContextSnapshot,
  ReasoningOutput,
  ExecutionAction,
  ExecutionActionType,
  PipelineResult,
  ReasoningHistoryEntry,
} from './types';
import { getModeFromQuestion } from './prompts';
import {
  isAmbiguousOfferQuery,
  AMBIGUOUS_OFFER_CLARIFICATION,
} from './intent';

// ─── Layer 1: Intent ─────────────────────────────────────────────────────────

type IntentCategory = IntentClassification['category'];

interface RuleSet {
  keywords: string[];
  category: IntentCategory;
  mode: DecisionMode;
  weight: number;
}

const INTENT_RULES: RuleSet[] = [
  {
    // Require explicit job-related signals — bare "offer" is NOT sufficient
    keywords: ['salary', 'job', 'job offer', 'w2', 'c2c', 'contractor', 'compensation', 'income', 'hire', 'promotion'],
    category: 'income',
    mode: 'job-offer',
    weight: 2,
  },
  {
    keywords: ['relocat', 'moving', 'move to', 'new state', 'new city', 'no-income-tax', 'cost of living'],
    category: 'income',
    mode: 'relocation',
    weight: 2,
  },
  {
    keywords: ['debt', 'loan', 'credit card', 'payoff', 'pay off', 'refinanc', 'student loan', 'interest rate', 'balance transfer'],
    category: 'debt',
    mode: 'debt-payoff',
    weight: 2,
  },
  {
    keywords: ['mortgage', 'home', 'house', 'afford', 'down payment', 'real estate', 'rent vs', 'buy a'],
    category: 'real-estate',
    mode: 'home-affordability',
    weight: 2,
  },
  {
    keywords: ['retire', '401k', '401(k)', 'roth', 'ira', 'pension', 'social security', 'on track'],
    category: 'retirement',
    mode: 'roth-vs-traditional',
    weight: 2,
  },
  {
    keywords: ['tax', 'deduction', 'bracket', 'irs', 'withholding', 'capital gain'],
    category: 'tax',
    mode: 'custom',
    weight: 1,
  },
  {
    keywords: ['invest', 'portfolio', 'stock', 'etf', 'mutual fund', 'dividend', 'market', 'sip', 'fd'],
    category: 'investment',
    mode: 'custom',
    weight: 1,
  },
  {
    keywords: ['budget', 'cash flow', 'spending', 'emergency fund', 'savings', 'monthly expenses'],
    category: 'general',
    mode: 'budget-stress-test',
    weight: 1,
  },
];

/**
 * Confidence thresholds that control routing:
 *   >= HIGH   → proceed with intent-specific flow
 *   MID–HIGH  → suggest clarification but allow provisional analysis
 *   < MID     → block analysis; ask a concise clarification question
 *
 * CONFIDENCE_THRESHOLD_MID is exported for use in the UI layer.
 */
const CONFIDENCE_THRESHOLD_HIGH = 0.75;
export const CONFIDENCE_THRESHOLD_MID = 0.50;

export function classifyIntent(question: string): IntentClassification {
  // ── Ambiguity check: use the shared helper before keyword scoring ──────────
  if (isAmbiguousOfferQuery(question)) {
    return {
      type: 'ambiguous-offer',
      category: 'ambiguous',
      confidence: 0.3,
      signals: ['offer (type unclear)'],
      needsClarification: true,
      clarificationQuestion: AMBIGUOUS_OFFER_CLARIFICATION,
    };
  }

  const q = question.toLowerCase();
  const scores: Map<string, { category: IntentCategory; mode: DecisionMode; score: number; signals: string[] }> =
    new Map();

  for (const rule of INTENT_RULES) {
    for (const kw of rule.keywords) {
      if (q.includes(kw)) {
        const key = rule.mode;
        const existing = scores.get(key);
        if (existing) {
          existing.score += rule.weight;
          existing.signals.push(kw);
        } else {
          scores.set(key, { category: rule.category, mode: rule.mode, score: rule.weight, signals: [kw] });
        }
      }
    }
  }

  if (scores.size === 0) {
    return {
      type: getModeFromQuestion(question),
      category: 'general',
      confidence: 0.3,
      signals: [],
      needsClarification: true,
      clarificationQuestion: 'Could you share more details? For example, is this about a job offer, loan, investment, or retirement decision?',
    };
  }

  // Pick the mode with the highest score
  let best = { mode: 'custom' as DecisionMode, category: 'general' as IntentCategory, score: 0, signals: [] as string[] };
  for (const [, v] of scores) {
    if (v.score > best.score) best = { mode: v.mode, category: v.category, score: v.score, signals: v.signals };
  }

  // Confidence: scale score/maxPossible capped at 0.95
  const maxPossible = Math.max(...INTENT_RULES.map((r) => r.weight * r.keywords.length));
  const confidence = Math.min(0.95, best.score / (maxPossible * 0.3));

  // ── Confidence threshold routing ──────────────────────────────────────────
  // < 0.50: block analysis — ask a concise clarification question
  // 0.50–0.74: suggest clarification but allow provisional analysis
  // >= 0.75: proceed without interruption
  const needsClarification = confidence < CONFIDENCE_THRESHOLD_MID;
  const clarificationQuestion =
    confidence < CONFIDENCE_THRESHOLD_MID
      ? 'Could you provide more context? For example: what type of offer is this, and what is your current financial situation?'
      : confidence < CONFIDENCE_THRESHOLD_HIGH
      ? 'A few more details would help me give you a more accurate analysis. What is the specific offer type and key terms?'
      : undefined;

  return {
    type: best.mode,
    category: best.category,
    confidence: parseFloat(confidence.toFixed(2)),
    signals: [...new Set(best.signals)],
    needsClarification: needsClarification ? true : undefined,
    clarificationQuestion,
  };
}

// ─── Layer 2: Context ─────────────────────────────────────────────────────────

export function buildContext(
  region: 'US' | 'India',
  riskProfile: 'conservative' | 'moderate' | 'aggressive',
  sessionId: string,
  history: ReasoningHistoryEntry[],
  inputs?: FinancialInputs,
): ContextSnapshot {
  const portfolio = inputs?.annualSalary
    ? {
        totalValue: inputs.annualSalary,
        allocation: buildAllocationGuess(riskProfile),
      }
    : undefined;

  return {
    region,
    riskProfile,
    portfolio,
    history: history.slice(-5), // keep last 5 entries
    sessionId,
  };
}

function buildAllocationGuess(riskProfile: 'conservative' | 'moderate' | 'aggressive'): Record<string, number> {
  switch (riskProfile) {
    case 'conservative':
      return { bonds: 60, equities: 30, cash: 10 };
    case 'aggressive':
      return { equities: 80, bonds: 10, alternatives: 10 };
    default:
      return { equities: 60, bonds: 30, cash: 10 };
  }
}

// ─── Layer 3: Reasoning ───────────────────────────────────────────────────────

export function buildReasoning(
  intent: IntentClassification,
  context: ContextSnapshot,
  copilotResponse: CopilotResponse,
): ReasoningOutput {
  const dataPoints: ReasoningOutput['dataPoints'] = copilotResponse.keyMetrics.map((m) => ({
    label: m.label,
    value: m.value,
    source: 'derived' as const,
  }));

  // Assumptions map to "assumed" data points
  for (const a of copilotResponse.assumptions) {
    dataPoints.push({ label: 'Assumption', value: a, source: 'assumed' as const });
  }

  // Build comparisons from scenarios
  const comparisons = copilotResponse.scenarios
    .filter((s) => s.results != null)
    .slice(0, 2)
    .map((s, idx, arr) => {
      if (idx === 0 && arr[1]?.results) {
        const a = s.results!;
        const b = arr[1].results!;
        const delta = a.monthlyLeftover - b.monthlyLeftover;
        return {
          optionA: s.name,
          optionB: arr[1].name,
          delta: `${delta >= 0 ? '+' : ''}$${Math.abs(Math.round(delta)).toLocaleString()}/mo`,
          winner: (delta > 0 ? 'A' : delta < 0 ? 'B' : 'neutral') as 'A' | 'B' | 'neutral',
        };
      }
      return null;
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  const keyFindings: string[] = [
    copilotResponse.summary,
    ...copilotResponse.sensitivities.slice(0, 2),
  ].filter(Boolean);

  return {
    methodology: `Rule-based financial analysis for ${intent.category} decision (${intent.type}) — region: ${context.region}, risk profile: ${context.riskProfile}`,
    dataPoints,
    comparisons,
    keyFindings,
  };
}

// ─── Layer 4: Execution ───────────────────────────────────────────────────────

interface ActionTemplate {
  type: ExecutionActionType;
  label: string;
  description: (ctx: { intent: IntentClassification; context: ContextSnapshot }) => string;
  riskLevel: 'low' | 'medium' | 'high';
  impact: (ctx: { intent: IntentClassification; context: ContextSnapshot }) => string;
  timeframe: string;
  relevantCategories: IntentCategory[];
}

const ACTION_TEMPLATES: ActionTemplate[] = [
  {
    type: 'simulate',
    label: 'Run Scenario Simulation',
    description: ({ intent }) =>
      `Model the financial impact of your ${intent.category} decision across 3 time horizons (1yr, 5yr, 10yr) using current inputs.`,
    riskLevel: 'low',
    impact: () => 'Quantifies cash-flow delta and compounding effect of the decision before commitment.',
    timeframe: 'Immediate — results in seconds',
    relevantCategories: ['income', 'debt', 'investment', 'retirement', 'general'],
  },
  {
    type: 'report',
    label: 'Generate Decision Report',
    description: ({ intent }) =>
      `Produce a structured ${intent.type.replace(/-/g, ' ')} analysis report with numbered sections, key metrics, and actionable recommendations.`,
    riskLevel: 'low',
    impact: () => 'Creates a shareable, auditable record of the decision rationale and assumptions.',
    timeframe: 'Immediate',
    relevantCategories: ['income', 'debt', 'investment', 'real-estate', 'tax', 'retirement', 'general'],
  },
  {
    type: 'rebalance',
    label: 'Rebalance Portfolio Allocation',
    description: ({ context }) =>
      `Adjust asset allocation toward the ${context.riskProfile} target (${JSON.stringify(buildAllocationGuess(context.riskProfile))}) based on the decision outcome.`,
    riskLevel: 'medium',
    impact: () => 'Realigns risk exposure after a major income, debt, or investment event.',
    timeframe: '1–4 weeks',
    relevantCategories: ['investment', 'retirement', 'income'],
  },
  {
    type: 'hedge',
    label: 'Apply Downside Hedge',
    description: ({ intent }) =>
      `Implement a protective strategy against the primary risk identified in the ${intent.category} analysis (e.g., income interruption insurance, emergency fund sizing, or fixed-rate lock-in).`,
    riskLevel: 'medium',
    impact: () => 'Limits maximum loss exposure while preserving upside — critical for high-confidence, high-stakes decisions.',
    timeframe: '2–8 weeks',
    relevantCategories: ['real-estate', 'debt', 'income', 'retirement'],
  },
];

export function buildExecutionPlan(
  intent: IntentClassification,
  context: ContextSnapshot,
  riskScore: number,
): { actions: ExecutionAction[]; primaryAction: ExecutionAction; timeline: string } {
  const ctx = { intent, context };

  const actions: ExecutionAction[] = ACTION_TEMPLATES.filter((t) =>
    t.relevantCategories.includes(intent.category),
  ).map((t) => ({
    type: t.type,
    label: t.label,
    description: t.description(ctx),
    riskLevel: t.riskLevel,
    expectedImpact: t.impact(ctx),
    timeframe: t.timeframe,
  }));

  // Primary action: simulate first if low risk, hedge if risk > 60
  const primary =
    riskScore > 60
      ? (actions.find((a) => a.type === 'hedge') ?? actions[0])
      : (actions.find((a) => a.type === 'simulate') ?? actions[0]);

  const timeline =
    riskScore > 70
      ? 'Urgent: address primary risk within 1–2 weeks'
      : riskScore > 40
      ? 'Moderate: execute plan within 1–3 months'
      : 'Standard: implement over 3–6 months';

  return { actions, primaryAction: primary, timeline };
}

// ─── Risk Scoring ─────────────────────────────────────────────────────────────

export function scoreRisk(
  intent: IntentClassification,
  context: ContextSnapshot,
  copilotResponse: CopilotResponse,
): PipelineResult['step4_risk'] {
  const factors: PipelineResult['step4_risk']['factors'] = [];

  // Risk factor: data confidence
  if (intent.confidence < 0.5) {
    factors.push({ factor: 'Low intent confidence', severity: 'medium', detail: 'Ambiguous question — analysis may target the wrong decision mode.' });
  }

  // Risk factor: missing data
  for (const missing of copilotResponse.missingData.slice(0, 3)) {
    factors.push({ factor: 'Missing input', severity: 'medium', detail: missing });
  }

  // Risk factor: copilot risk level
  if (copilotResponse.confidenceLevel === 'low') {
    factors.push({ factor: 'Low analytical confidence', severity: 'high', detail: 'Insufficient data for high-confidence projection.' });
  }

  // Risk factor: scenario risks
  for (const r of copilotResponse.risks.slice(0, 2)) {
    factors.push({ factor: 'Identified risk', severity: 'medium', detail: r });
  }

  // Risk factor: aggressive allocation on conservative profile
  if (intent.category === 'investment' && context.riskProfile === 'conservative') {
    factors.push({ factor: 'Profile mismatch', severity: 'high', detail: 'Investment decision in context of conservative risk profile — review suitability.' });
  }

  const highCount = factors.filter((f) => f.severity === 'high').length;
  const medCount = factors.filter((f) => f.severity === 'medium').length;
  const overallScore = Math.min(100, highCount * 25 + medCount * 10 + (intent.confidence < 0.4 ? 15 : 0));

  const mitigations = copilotResponse.nextSteps.slice(0, 3);

  return { overallScore, factors, mitigations };
}

// ─── Full Pipeline ────────────────────────────────────────────────────────────

export function runPipeline(
  question: string,
  copilotResponse: CopilotResponse,
  region: 'US' | 'India',
  riskProfile: 'conservative' | 'moderate' | 'aggressive',
  sessionId: string,
  history: ReasoningHistoryEntry[],
  inputs?: FinancialInputs,
): PipelineResult {
  const intent = classifyIntent(question);
  const context = buildContext(region, riskProfile, sessionId, history, inputs);
  const reasoning = buildReasoning(intent, context, copilotResponse);
  const risk = scoreRisk(intent, context, copilotResponse);
  const executionPlan = buildExecutionPlan(intent, context, risk.overallScore);

  return {
    step1_intent: intent,
    step2_context: context,
    step3_analysis: reasoning,
    step4_risk: risk,
    step5_actionPlan: executionPlan,
    requestId: `req_${Date.now()}_${typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID().slice(0, 8) : Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
  };
}
