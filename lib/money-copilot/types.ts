export type DecisionMode =
  | 'job-offer'
  | 'relocation'
  | 'debt-payoff'
  | 'roth-vs-traditional'
  | 'emergency-fund'
  | 'home-affordability'
  | 'budget-stress-test'
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
