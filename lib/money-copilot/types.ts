export type DecisionMode =
  | 'job-offer'
  | 'relocation'
  | 'debt-payoff'
  | 'roth-vs-traditional'
  | 'emergency-fund'
  | 'home-affordability'
  | 'budget-stress-test'
  | 'ambiguous-offer'
  | 'custom';

export interface FinancialInputs {
  annualSalary?: number;
  hourlyRate?: number;
  bonus?: number;
  employmentType?: 'w2' | 'c2c' | 'full-time' | 'contractor';
  state?: string;
  city?: string;
  monthlyRent?: number;
  mortgage?: number;
  debtPayments?: number;
  childcare?: number;
  insurance?: number;
  transportation?: number;
  groceries?: number;
  utilities?: number;
  taxAssumption?: number;
  savingsRate?: number;
  employerMatch?: number;
  cashOnHand?: number;
  targetEmergencyMonths?: number;
  riskTolerance?: 'low' | 'medium' | 'high';
  timeHorizon?: number;
  /** New income for job-offer / relocation comparisons */
  newAnnualSalary?: number;
  newHourlyRate?: number;
  /** Whether salary/income fields are monthly or annual */
  incomePeriod?: 'monthly' | 'annual';
  /** Estimated benefits value per year; undefined = unknown */
  benefitsValueAnnual?: number;
}

export interface ScenarioResults {
  monthlyTakeHome: number;
  fixedObligations: number;
  monthlyLeftover: number;
  savingsCapacity: number;
  riskLevel: 'low' | 'medium' | 'high';
  housingBurdenRatio: number;
  debtLoadRatio: number;
  emergencyRunwayMonths: number;
  tradeoffs: string[];
}

export interface Scenario {
  id: string;
  name: string;
  inputs: FinancialInputs;
  results?: ScenarioResults;
}

export interface CopilotResponse {
  summary: string;
  recommendation: string;
  assumptions: string[];
  keyMetrics: Array<{ label: string; value: string; note?: string }>;
  scenarios: Scenario[];
  sensitivities: string[];
  risks: string[];
  nextSteps: string[];
  disclaimer: string;
  confidenceLevel: 'low' | 'medium' | 'high';
  missingData: string[];
  /** Decision engine structured fields */
  decisionSummary?: {
    confidenceLevel: 'High' | 'Medium' | 'Low';
    monthlyTakeHome: string;
    riskLevel: 'Low' | 'Medium' | 'High';
  };
  decisionEngine?: {
    currentIncome: string;
    newIncome: string;
    netChange: string;
    benefitsImpact: string;
    riskScore: number;
    confidenceScore: number;
  };
  insight?: string;
}

export interface CopilotRequest {
  mode: DecisionMode;
  question: string;
  /** Optional freeform financial context extracted from the context textarea */
  context?: string;
  inputs: FinancialInputs;
  scenarios: Scenario[];
  /** 'deep' (default) returns full CopilotResponse; 'quick' returns BubbleResponse */
  responseMode?: 'deep' | 'quick';
  /** Region context for locale-aware salary normalization. Defaults to 'US'. */
  region?: 'US' | 'India';
}

export interface PageContext {
  path: string;
  title?: string;
  keywords?: string[];
}

export interface BubbleRequest {
  question: string;
  pageContext: PageContext;
}

export interface BubbleResponse {
  summary: string;
  quickTake: string;
  keyPoints: string[];
  riskFlags: string[];
  nextStep: string;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  disclaimer: string;
}

// ─── Institutional AI Execution Engine ──────────────────────────────────────

export type ExecutionActionType = 'rebalance' | 'simulate' | 'report' | 'hedge';

/** Result of the Intent Layer: what the user wants + how certain we are. */
export interface IntentClassification {
  type: DecisionMode;
  category: 'income' | 'debt' | 'investment' | 'real-estate' | 'tax' | 'retirement' | 'general' | 'ambiguous';
  confidence: number; // 0–1
  signals: string[];  // keywords that drove classification
  /** True when the intent cannot be determined without a follow-up clarification. */
  needsClarification?: boolean;
  /** Suggested clarification question to surface to the user. */
  clarificationQuestion?: string;
}

/** Result of the Context Layer: who the user is and what history exists. */
export interface ContextSnapshot {
  region: 'US' | 'India';
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  portfolio?: { totalValue?: number; allocation?: Record<string, number> };
  history: ReasoningHistoryEntry[];
  sessionId: string;
}

/** Result of the Reasoning Layer: structured financial analysis without conversational text. */
export interface ReasoningOutput {
  methodology: string;
  dataPoints: Array<{ label: string; value: string; source: 'input' | 'derived' | 'assumed' }>;
  comparisons: Array<{ optionA: string; optionB: string; delta: string; winner: 'A' | 'B' | 'neutral' }>;
  keyFindings: string[];
  /** The financial recommendation text from the AI/rule-based engine (shown as the Recommendation section). */
  recommendation: string;
  /** Concrete next steps from the AI/rule-based engine (shown as the Best next step section). */
  nextSteps: string[];
}

/** A single executable action from the Execution Layer. */
export interface ExecutionAction {
  type: ExecutionActionType;
  label: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedImpact: string;
  timeframe: string;
  parameters?: Record<string, string | number>;
}

/** Full 5-step pipeline output. */
export interface PipelineResult {
  step1_intent: IntentClassification;
  step2_context: ContextSnapshot;
  step3_analysis: ReasoningOutput;
  step4_risk: {
    overallScore: number; // 0–100
    factors: Array<{ factor: string; severity: 'low' | 'medium' | 'high'; detail: string }>;
    mitigations: string[];
  };
  step5_actionPlan: {
    actions: ExecutionAction[];
    primaryAction: ExecutionAction;
    timeline: string;
  };
  requestId: string;
  timestamp: string;
}

/** A single entry in the global reasoning history. */
export interface ReasoningHistoryEntry {
  id: string;
  question: string;
  intent: IntentClassification;
  result: PipelineResult;
  timestamp: string;
}

/** Global Copilot state persisted across routes. */
export interface CopilotGlobalState {
  sessionId: string;
  region: 'US' | 'India';
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  history: ReasoningHistoryEntry[];
  isExecutionPanelOpen: boolean;
  activeResult: PipelineResult | null;
  activeQuestion: string;
}
