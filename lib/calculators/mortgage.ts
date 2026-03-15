import { asCurrency, buildAmortizationProjection, paymentFromPrincipal } from '@/lib/calculators/engine';
import { BaseCalculatorInputs, CalculatorResult } from '@/lib/calculators/types';

export const calculateMortgage = (inputs: BaseCalculatorInputs): CalculatorResult => {
  const payment = paymentFromPrincipal(inputs.loanAmount, inputs.interestRate, inputs.years);
  const projection = buildAmortizationProjection(inputs, payment);
  const totalPaid = payment * inputs.years * 12;
  const totalInterest = totalPaid - inputs.loanAmount;

  return {
    title: 'Mortgage Projection',
    summary: [
      { label: 'Monthly Payment', value: payment, currency: true, helpText: 'Estimated monthly principal and interest payment.' },
      { label: 'Total Interest', value: totalInterest, currency: true, helpText: 'Total financing cost over the full term.' },
      { label: 'Total Paid', value: totalPaid, currency: true, helpText: 'Total amount paid over loan duration.' }
    ],
    projection,
    breakdown: [
      { label: 'Loan Amount', value: asCurrency(inputs.loanAmount) },
      { label: 'Interest Rate', value: `${inputs.interestRate}%` },
      { label: 'Loan Term', value: `${inputs.years} years` }
    ],
    chartKinds: ['amortization', 'pie', 'bar']
  };
};
