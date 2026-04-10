import type { FinancialInputs, ScenarioResults } from './types';

const STATE_TAX_RATES: Record<string, number> = {
  AL: 0.05, AK: 0.00, AZ: 0.025, AR: 0.055, CA: 0.093, CO: 0.044, CT: 0.065,
  DE: 0.066, FL: 0.00, GA: 0.055, HI: 0.11, ID: 0.058, IL: 0.0495, IN: 0.032,
  IA: 0.06, KS: 0.057, KY: 0.045, LA: 0.0425, ME: 0.075, MD: 0.0575,
  MA: 0.05, MI: 0.0425, MN: 0.0985, MS: 0.05, MO: 0.054, MT: 0.069,
  NE: 0.0684, NV: 0.00, NH: 0.00, NJ: 0.1075, NM: 0.059, NY: 0.109,
  NC: 0.0525, ND: 0.029, OH: 0.04, OK: 0.05, OR: 0.099, PA: 0.0307,
  RI: 0.0599, SC: 0.07, SD: 0.00, TN: 0.00, TX: 0.00, UT: 0.0495,
  VT: 0.0875, VA: 0.0575, WA: 0.00, WV: 0.065, WI: 0.0765, WY: 0.00,
  DC: 0.1075
};

export function estimateMonthlyNetIncome(
  annualSalary: number,
  state?: string,
  employmentType?: string
): { monthlyGross: number; estimatedTaxRate: number; monthlyNet: number; note: string } {
  const monthlyGross = annualSalary / 12;
  const stateKey = state?.toUpperCase().trim();
  const stateTax = stateKey && STATE_TAX_RATES[stateKey] !== undefined ? STATE_TAX_RATES[stateKey] : 0.05;

  let federalRate = 0.22;
  if (annualSalary <= 44725) federalRate = 0.12;
  else if (annualSalary <= 95375) federalRate = 0.22;
  else if (annualSalary <= 201050) federalRate = 0.24;
  else if (annualSalary <= 383900) federalRate = 0.32;
  else federalRate = 0.35;

  const ficaRate = 0.0765;
  let totalTaxRate = federalRate * 0.75 + stateTax + ficaRate;

  let note = `Estimated using ~${Math.round(federalRate * 100)}% federal effective rate, ${Math.round(stateTax * 100)}% state (${stateKey ?? 'avg'}), and 7.65% FICA`;

  if (employmentType === 'c2c') {
    totalTaxRate += 0.0765;
    note += '. C2C adds ~7.65% additional self-employment tax (employer-side FICA).';
  } else if (employmentType === 'contractor') {
    totalTaxRate += 0.05;
    note += '. Independent contractor estimate includes partial self-employment tax.';
  }

  totalTaxRate = Math.min(totalTaxRate, 0.55);
  const monthlyNet = monthlyGross * (1 - totalTaxRate);

  return {
    monthlyGross,
    estimatedTaxRate: totalTaxRate,
    monthlyNet,
    note
  };
}

export function calcMonthlyObligations(inputs: FinancialInputs): number {
  const housing = inputs.monthlyRent ?? inputs.mortgage ?? 0;
  return (
    housing +
    (inputs.debtPayments ?? 0) +
    (inputs.childcare ?? 0) +
    (inputs.insurance ?? 0) +
    (inputs.transportation ?? 0) +
    (inputs.groceries ?? 0) +
    (inputs.utilities ?? 0)
  );
}

export function calcMonthlyLeftover(monthlyNet: number, obligations: number): number {
  return Math.max(0, monthlyNet - obligations);
}

export function calcHousingBurdenRatio(monthlyHousingCost: number, monthlyGross: number): number {
  if (monthlyGross <= 0) return 1;
  return Math.min(1, monthlyHousingCost / monthlyGross);
}

export function calcDebtLoadRatio(monthlyDebt: number, monthlyGross: number): number {
  if (monthlyGross <= 0) return 1;
  return Math.min(1, monthlyDebt / monthlyGross);
}

export function calcEmergencyRunway(cashOnHand: number, monthlyObligations: number): number {
  if (monthlyObligations <= 0) return 99;
  return cashOnHand / monthlyObligations;
}

export function calcSavingsCapacity(monthlyLeftover: number, savingsRatePct?: number): number {
  if (savingsRatePct !== undefined) {
    return monthlyLeftover * (savingsRatePct / 100);
  }
  return monthlyLeftover * 0.5;
}

export function calcHomeAffordability(
  annualSalary: number,
  downPayment: number = 0,
  monthlyDebt: number = 0
): { maxHomePrice: number; monthlyPaymentEstimate: number; note: string } {
  const monthlyGross = annualSalary / 12;
  const maxHousingPayment28 = monthlyGross * 0.28;
  const maxTotalDebt36 = monthlyGross * 0.36;
  const availableForHousing = Math.max(0, maxTotalDebt36 - monthlyDebt);
  const maxMonthlyPayment = Math.min(maxHousingPayment28, availableForHousing);

  const annualRate = 0.07;
  const monthlyRate = annualRate / 12;
  const termMonths = 360;
  const loanAmount = maxMonthlyPayment / (monthlyRate * Math.pow(1 + monthlyRate, termMonths) / (Math.pow(1 + monthlyRate, termMonths) - 1));
  const maxHomePrice = loanAmount + downPayment;

  return {
    maxHomePrice,
    monthlyPaymentEstimate: maxMonthlyPayment,
    note: `Based on 28/36 rule with 7% assumed mortgage rate, 30-year term, ${formatCurrency(downPayment)} down payment.`
  };
}

export function assessRiskLevel(results: Partial<ScenarioResults>): 'low' | 'medium' | 'high' {
  const { housingBurdenRatio = 0, debtLoadRatio = 0, emergencyRunwayMonths = 6 } = results;

  const highRisk =
    housingBurdenRatio > 0.35 ||
    debtLoadRatio > 0.2 ||
    emergencyRunwayMonths < 3;

  const mediumRisk =
    housingBurdenRatio > 0.28 ||
    debtLoadRatio > 0.15 ||
    emergencyRunwayMonths < 6;

  if (highRisk) return 'high';
  if (mediumRisk) return 'medium';
  return 'low';
}

export function scoreScenario(results: ScenarioResults): number {
  let score = 100;

  if (results.housingBurdenRatio > 0.35) score -= 25;
  else if (results.housingBurdenRatio > 0.28) score -= 12;

  if (results.debtLoadRatio > 0.2) score -= 20;
  else if (results.debtLoadRatio > 0.15) score -= 10;

  if (results.emergencyRunwayMonths < 1) score -= 30;
  else if (results.emergencyRunwayMonths < 3) score -= 20;
  else if (results.emergencyRunwayMonths < 6) score -= 10;

  if (results.monthlyLeftover < 200) score -= 15;
  else if (results.monthlyLeftover < 500) score -= 5;

  if (results.savingsCapacity > 500) score += 5;

  return Math.max(0, Math.min(100, score));
}

export function formatCurrency(value: number): string {
  return '$' + Math.round(value).toLocaleString('en-US');
}

export function formatPercent(value: number): string {
  return (value * 100).toFixed(1) + '%';
}
