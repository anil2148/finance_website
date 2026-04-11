import type { DecisionMode, FinancialInputs, Scenario, ScenarioResults } from './types';
import {
  assessRiskLevel,
  calcDebtLoadRatio,
  calcEmergencyRunway,
  calcHousingBurdenRatio,
  calcMonthlyLeftover,
  calcMonthlyObligations,
  calcSavingsCapacity,
  estimateMonthlyNetIncome
} from './calculators';

export function computeScenarioResults(inputs: FinancialInputs): ScenarioResults {
  const salary = inputs.annualSalary ?? (inputs.hourlyRate ? inputs.hourlyRate * 2080 : 0);
  const { monthlyGross, monthlyNet } = estimateMonthlyNetIncome(salary, inputs.state, inputs.employmentType);
  const fixedObligations = calcMonthlyObligations(inputs);
  const monthlyLeftover = calcMonthlyLeftover(monthlyNet, fixedObligations);
  const savingsCapacity = calcSavingsCapacity(monthlyLeftover, inputs.savingsRate);
  const housingCost = inputs.monthlyRent ?? inputs.mortgage ?? 0;
  const housingBurdenRatio = calcHousingBurdenRatio(housingCost, monthlyGross);
  const debtLoadRatio = calcDebtLoadRatio(inputs.debtPayments ?? 0, monthlyGross);
  const cashOnHand = inputs.cashOnHand ?? 0;
  const emergencyRunwayMonths = calcEmergencyRunway(cashOnHand, fixedObligations);

  const partial = { housingBurdenRatio, debtLoadRatio, emergencyRunwayMonths };
  const riskLevel = assessRiskLevel(partial);

  const tradeoffs: string[] = [];
  if (housingBurdenRatio > 0.35) tradeoffs.push('Housing costs exceed 35% of gross income — financially stressful.');
  else if (housingBurdenRatio > 0.28) tradeoffs.push('Housing costs are above the recommended 28% of gross income.');
  if (debtLoadRatio > 0.2) tradeoffs.push('Total debt load exceeds 20% of gross income — limits financial flexibility.');
  if (emergencyRunwayMonths < 3) tradeoffs.push('Emergency fund covers less than 3 months — high vulnerability.');
  else if (emergencyRunwayMonths < 6) tradeoffs.push('Emergency fund covers less than 6 months — some vulnerability.');
  if (monthlyLeftover < 300) tradeoffs.push('Monthly surplus is very thin — little room for unexpected expenses.');
  if (savingsCapacity > 1000) tradeoffs.push('Strong savings capacity enables wealth-building.');

  return {
    monthlyTakeHome: monthlyNet,
    fixedObligations,
    monthlyLeftover,
    savingsCapacity,
    riskLevel,
    housingBurdenRatio,
    debtLoadRatio,
    emergencyRunwayMonths,
    tradeoffs
  };
}

export function compareScenarios(scenarios: Scenario[]): Scenario[] {
  return scenarios.map((s) => ({
    ...s,
    results: computeScenarioResults(s.inputs)
  }));
}

export function extractMissingData(inputs: FinancialInputs, mode: DecisionMode): string[] {
  const missing: string[] = [];

  // Ambiguous offer — the offer type itself is the missing data
  if (mode === 'ambiguous-offer') {
    missing.push('Offer type (job offer, loan offer, credit card offer, or mortgage/refinance offer)');
    return missing;
  }

  const hasSalary = inputs.annualSalary || inputs.hourlyRate;
  if (!hasSalary) missing.push('Annual salary or hourly rate');

  switch (mode) {
    case 'job-offer':
    case 'relocation':
      if (!inputs.state) missing.push('State (for tax estimate)');
      if (!inputs.monthlyRent && !inputs.mortgage) missing.push('Monthly housing cost in destination');
      break;
    case 'debt-payoff':
      if (!inputs.debtPayments) missing.push('Monthly debt payment amounts');
      if (!inputs.cashOnHand) missing.push('Current cash on hand / savings');
      break;
    case 'roth-vs-traditional':
      if (!inputs.taxAssumption) missing.push('Current marginal tax rate (for Roth vs. traditional comparison)');
      if (!inputs.timeHorizon) missing.push('Investment time horizon (years)');
      break;
    case 'emergency-fund':
      if (!inputs.cashOnHand) missing.push('Current cash on hand / emergency savings');
      if (!inputs.targetEmergencyMonths) missing.push('Target emergency fund months');
      break;
    case 'home-affordability':
      if (!inputs.cashOnHand) missing.push('Available down payment / cash on hand');
      if (!inputs.debtPayments) missing.push('Existing monthly debt obligations');
      break;
    case 'budget-stress-test':
      if (!inputs.monthlyRent && !inputs.mortgage) missing.push('Monthly housing cost');
      if (!inputs.groceries) missing.push('Monthly grocery / food spending');
      break;
    default:
      break;
  }

  return missing;
}

export function assessConfidence(inputs: FinancialInputs, mode: DecisionMode): 'low' | 'medium' | 'high' {
  // Ambiguous offer always returns low confidence — the offer type is unknown
  if (mode === 'ambiguous-offer') return 'low';

  const missing = extractMissingData(inputs, mode);

  const hasSalary = inputs.annualSalary || inputs.hourlyRate;
  const hasHousing = inputs.monthlyRent || inputs.mortgage;
  const hasState = !!inputs.state;

  if (!hasSalary) return 'low';
  if (missing.length >= 3) return 'low';
  if (missing.length >= 1 || !hasHousing || !hasState) return 'medium';
  return 'high';
}
