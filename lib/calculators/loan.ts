import { buildAmortizationProjection, currencyBreakdown, paymentFromPrincipal } from '@/lib/calculators/engine';
import { BaseCalculatorInputs, CalculatorResult } from '@/lib/calculators/types';

export const calculateLoan = (inputs: BaseCalculatorInputs): CalculatorResult => {
  const payment = paymentFromPrincipal(inputs.loanAmount, inputs.interestRate, inputs.years);
  const projection = buildAmortizationProjection(inputs, payment);
  const totalPaid = payment * inputs.years * 12;
  const totalInterest = totalPaid - inputs.loanAmount;

  return {
    title: 'Loan Repayment',
    summary: [
      { label: 'Monthly EMI', value: payment, currency: true, helpText: 'Equal monthly installment required to repay the loan.' },
      { label: 'Total Interest', value: totalInterest, currency: true, helpText: 'Cumulative interest paid by end of term.' },
      { label: 'Debt-Free Date', value: inputs.years, suffix: ' yrs', helpText: 'Estimated timeline to fully repay the loan.' }
    ],
    projection,
    breakdown: [
      currencyBreakdown('Principal', inputs.loanAmount),
      { label: 'Term', value: `${inputs.years} years` },
      { label: 'APR', value: `${inputs.interestRate}%` }
    ],
    chartKinds: ['amortization', 'bar']
  };
};
