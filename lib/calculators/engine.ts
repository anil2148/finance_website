import { BaseCalculatorInputs, GrowthCalculatorInputs, LoanCalculatorInputs, ProjectionPoint } from '@/lib/calculators/types';

export const toMonthlyRate = (annualRate: number) => annualRate / 100 / 12;

export const clampNumber = (value: number, min = 0) => Math.max(min, value);

export const paymentFromPrincipal = (principal: number, annualRate: number, years: number) => {
  const safePrincipal = Number.isFinite(principal) ? Math.max(0, principal) : 0;
  const safeAnnualRate = Number.isFinite(annualRate) ? Math.max(0, annualRate) : 0;
  const months = Number.isFinite(years) ? Math.max(1, Math.round(years * 12)) : 12;
  const monthlyRate = toMonthlyRate(safeAnnualRate);

  if (monthlyRate === 0) {
    return safePrincipal / months;
  }

  return (safePrincipal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
};

export const buildInvestmentProjection = (inputs: GrowthCalculatorInputs, initial = inputs.loanAmount) => {
  const months = Math.max(1, Math.round(inputs.years * 12));
  const monthlyReturn = toMonthlyRate(inputs.expectedReturn);
  const projection: ProjectionPoint[] = [];

  let balance = initial;
  let contributed = initial;

  for (let month = 1; month <= months; month += 1) {
    balance = balance * (1 + monthlyReturn) + inputs.monthlyContribution;
    contributed += inputs.monthlyContribution;

    projection.push({
      month,
      year: month / 12,
      balance,
      contributed,
      interestEarned: balance - contributed
    });
  }

  return projection;
};

export const buildAmortizationProjection = (inputs: LoanCalculatorInputs, payment?: number) => {
  const months = Math.max(1, Math.round(inputs.years * 12));
  const monthlyRate = toMonthlyRate(inputs.interestRate);
  const monthlyPayment = payment ?? paymentFromPrincipal(inputs.loanAmount, inputs.interestRate, inputs.years);
  const projection: ProjectionPoint[] = [];

  let balance = inputs.loanAmount;
  let principalPaidTotal = 0;
  let interestPaidTotal = 0;

  for (let month = 1; month <= months; month += 1) {
    const interestPaid = balance * monthlyRate;
    const principalPaid = clampNumber(monthlyPayment - interestPaid);
    balance = clampNumber(balance - principalPaid);

    principalPaidTotal += principalPaid;
    interestPaidTotal += interestPaid;

    projection.push({
      month,
      year: month / 12,
      balance,
      contributed: principalPaidTotal,
      interestEarned: -interestPaidTotal,
      principalPaid,
      interestPaid,
      payment: monthlyPayment
    });
  }

  return projection;
};

export const asCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);

export const currencyBreakdown = (label: string, amount: number) => ({
  label,
  value: asCurrency(amount),
  amount,
  currency: true as const
});

export const asPercent = (value: number) => `${value.toFixed(2)}%`;
