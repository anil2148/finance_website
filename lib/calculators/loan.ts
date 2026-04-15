import { buildAmortizationProjection, currencyBreakdown, paymentFromPrincipal } from '@/lib/calculators/engine';
import { LoanCalculatorInputs, CalculatorResult } from '@/lib/calculators/types';

export const calculateLoan = (inputs: LoanCalculatorInputs): CalculatorResult => {
  const safePrincipal = Number.isFinite(inputs.loanAmount) ? Math.max(0, inputs.loanAmount) : 0;
  const safeRate = Number.isFinite(inputs.interestRate) ? Math.max(0, inputs.interestRate) : 0;
  const safeYears = Number.isFinite(inputs.years) ? Math.max(1, inputs.years) : 1;
  const payment = paymentFromPrincipal(safePrincipal, safeRate, safeYears);
  const projection = buildAmortizationProjection({ ...inputs, loanAmount: safePrincipal, interestRate: safeRate, years: safeYears }, payment);
  const totalPaid = payment * safeYears * 12;
  const totalInterest = Math.max(0, totalPaid - safePrincipal);

  return {
    title: 'Loan Repayment',
    summary: [
      { label: 'Monthly Payment', value: payment, currency: true, helpText: 'Fixed monthly payment required to repay the loan.' },
      { label: 'Total Interest', value: totalInterest, currency: true, helpText: 'Cumulative interest paid by end of term.' },
      { label: 'Debt-Free Date', value: safeYears, suffix: ' yrs', helpText: 'Estimated timeline to fully repay the loan based on your current term.' }
    ],
    projection,
    breakdown: [
      currencyBreakdown('Principal', safePrincipal),
      { label: 'Term', value: `${safeYears} years` },
      { label: 'APR', value: `${safeRate}%` }
    ],
    chartKinds: ['amortization', 'bar']
  };
};
