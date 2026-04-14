import { buildAmortizationProjection, currencyBreakdown, paymentFromPrincipal } from '@/lib/calculators/engine';
import { MortgageCalculatorInputs, CalculatorResult } from '@/lib/calculators/types';

export const calculateMortgage = (inputs: MortgageCalculatorInputs): CalculatorResult => {
  const principal = inputs.loanAmount > 0 ? inputs.loanAmount : Math.max(0, inputs.homePrice - inputs.downPayment);
  const basePayment = paymentFromPrincipal(principal, inputs.interestRate, inputs.years);
  const payment = basePayment + (inputs.monthlyContribution ?? 0);
  const projection = buildAmortizationProjection({ ...inputs, loanAmount: principal }, payment);
  const payoffMonths = projection.find((point) => point.balance <= 0)?.month ?? inputs.years * 12;
  const totalInterest = Math.abs(projection.at(-1)?.interestEarned ?? 0);
  const escrowMonthly = inputs.propertyTax / 12 + inputs.insurance / 12 + inputs.pmi;
  const totalMonthlyHousing = payment + escrowMonthly;
  const totalPaid = payment * payoffMonths;

  return {
    title: 'Mortgage Projection',
    summary: [
      { label: 'Monthly P&I Payment', value: payment, currency: true, helpText: 'Principal and interest payment, including extra monthly principal.' },
      { label: 'Estimated Total Monthly Cost', value: totalMonthlyHousing, currency: true, helpText: 'P&I plus property tax, home insurance, and PMI inputs.' },
      { label: 'Total Interest', value: totalInterest, currency: true, helpText: 'Total financing cost over the payoff timeline.' }
    ],
    projection,
    breakdown: [
      currencyBreakdown('Home Price', inputs.homePrice),
      currencyBreakdown('Down Payment', inputs.downPayment),
      currencyBreakdown('Mortgage Principal', principal),
      currencyBreakdown('Property Tax (Annual)', inputs.propertyTax),
      currencyBreakdown('Home Insurance (Annual)', inputs.insurance),
      currencyBreakdown('PMI (Monthly)', inputs.pmi),
      { label: 'Interest Rate', value: `${inputs.interestRate}%` },
      { label: 'Loan Term', value: `${inputs.years} years` },
      { label: 'Estimated Payoff', value: `${(payoffMonths / 12).toFixed(1)} years` },
      currencyBreakdown('Total Paid (P&I)', totalPaid)
    ],
    chartKinds: ['amortization', 'pie', 'bar']
  };
};
