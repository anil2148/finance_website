import { buildAmortizationProjection, currencyBreakdown, paymentFromPrincipal } from '@/lib/calculators/engine';
import { MortgageCalculatorInputs, CalculatorResult } from '@/lib/calculators/types';

export const calculateMortgage = (inputs: MortgageCalculatorInputs): CalculatorResult => {
  const safeHomePrice = Number.isFinite(inputs.homePrice) ? inputs.homePrice : 0;
  const safeDownPayment = Number.isFinite(inputs.downPayment) ? inputs.downPayment : 0;
  const safeInterestRate = Number.isFinite(inputs.interestRate) ? Math.max(0, inputs.interestRate) : 0;
  const safeYears = Number.isFinite(inputs.years) ? Math.max(1, inputs.years) : 30;
  const safePropertyTax = Number.isFinite(inputs.propertyTax) ? Math.max(0, inputs.propertyTax) : 0;
  const safeInsurance = Number.isFinite(inputs.insurance) ? Math.max(0, inputs.insurance) : 0;
  const safePmi = Number.isFinite(inputs.pmi) ? Math.max(0, inputs.pmi) : 0;
  const safeExtraPrincipal = Number.isFinite(inputs.monthlyContribution ?? 0)
    ? Math.max(0, inputs.monthlyContribution ?? 0)
    : 0;

  const principal = Math.max(0, safeHomePrice - safeDownPayment);
  const basePayment = paymentFromPrincipal(principal, safeInterestRate, safeYears);
  const payment = basePayment + safeExtraPrincipal;
  const projection = buildAmortizationProjection(
    { ...inputs, loanAmount: principal, interestRate: safeInterestRate, years: safeYears },
    payment
  );
  const payoffMonths = projection.find((point) => point.balance <= 0)?.month ?? safeYears * 12;
  const totalInterest = Math.abs(projection.at(-1)?.interestEarned ?? 0);
  const escrowMonthly = safePropertyTax / 12 + safeInsurance / 12 + safePmi;
  const totalMonthlyHousing = payment + escrowMonthly;
  const totalPaid = payment * payoffMonths;

  return {
    title: 'Mortgage Projection',
    summary: [
      { label: 'Monthly P&I Payment', value: basePayment, currency: true, helpText: 'Baseline principal-and-interest payment from your loan amount, APR, and term.' },
      { label: 'Extra Monthly Principal', value: safeExtraPrincipal, currency: true, helpText: 'Optional extra principal added monthly to reduce payoff time and total interest.' },
      { label: 'Estimated Total Monthly Cost', value: totalMonthlyHousing, currency: true, helpText: 'P&I plus property tax, home insurance, and PMI inputs.' },
      { label: 'Total Interest', value: totalInterest, currency: true, helpText: 'Total financing cost over the payoff timeline.' },
    ],
    projection,
    breakdown: [
      currencyBreakdown('Home Price', safeHomePrice),
      currencyBreakdown('Down Payment', safeDownPayment),
      currencyBreakdown('Mortgage Principal', principal),
      currencyBreakdown('Property Tax (Annual)', safePropertyTax),
      currencyBreakdown('Home Insurance (Annual)', safeInsurance),
      currencyBreakdown('PMI (Monthly)', safePmi),
      { label: 'Interest Rate', value: `${safeInterestRate}%` },
      { label: 'Loan Term', value: `${safeYears} years` },
      { label: 'Estimated Payoff', value: `${(payoffMonths / 12).toFixed(1)} years` },
      currencyBreakdown('Total Paid (P&I)', totalPaid)
    ],
    chartKinds: ['amortization', 'pie', 'bar']
  };
};
