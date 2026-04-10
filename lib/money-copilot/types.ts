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
}

export interface CopilotRequest {
  mode: DecisionMode;
  question: string;
  inputs: FinancialInputs;
  scenarios: Scenario[];
}
