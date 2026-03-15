import assert from 'node:assert/strict';
import {
  asCurrency,
  asPercent,
  buildAmortizationProjection,
  buildInvestmentProjection,
  paymentFromPrincipal,
  toMonthlyRate
} from '../lib/calculators/engine';
import { calculateCompoundInterest } from '../lib/calculators/compoundInterest';
import { calculateMortgage } from '../lib/calculators/mortgage';
import { calculateLoan } from '../lib/calculators/loan';
import { calculateRetirement } from '../lib/calculators/retirement';
import type { BaseCalculatorInputs } from '../lib/calculators/types';

const baseInputs: BaseCalculatorInputs = {
  loanAmount: 100000,
  interestRate: 6,
  monthlyContribution: 500,
  years: 10,
  inflationRate: 2,
  expectedReturn: 7
};

export function runCalculatorTests() {
  assert.equal(toMonthlyRate(12), 0.01, '12% annually should be 1% monthly');

  assert.equal(paymentFromPrincipal(1200, 0, 1), 100, 'Zero-interest monthly payment should divide principal equally');
  assert.ok(
    Math.abs(paymentFromPrincipal(100000, 6, 30) - 599.55) < 0.1,
    '30-year mortgage payment should match amortization formula'
  );

  const investmentProjection = buildInvestmentProjection(baseInputs);
  assert.equal(investmentProjection.length, 120, '10-year projection should contain 120 monthly points');
  assert.equal(investmentProjection[0]?.contributed, 100500, 'Contributed amount should include first monthly contribution');
  assert.ok(
    (investmentProjection.at(-1)?.balance ?? 0) > (investmentProjection.at(-1)?.contributed ?? 0),
    'Ending balance should exceed contributed principal when return is positive'
  );

  const amortizationProjection = buildAmortizationProjection(baseInputs);
  assert.equal(amortizationProjection.length, 120, 'Amortization should contain one point per month');
  assert.ok((amortizationProjection[0]?.payment ?? 0) > 0, 'Amortization payment must be positive');
  assert.ok((amortizationProjection.at(-1)?.balance ?? baseInputs.loanAmount) < baseInputs.loanAmount, 'Ending balance should be lower than starting balance');

  assert.equal(asCurrency(1234), '$1,234', 'Currency formatting should include symbol and separators');
  assert.equal(asPercent(3.456), '3.46%', 'Percentage formatting should round to 2 decimals');

  const mortgageResult = calculateMortgage(baseInputs);
  assert.equal(mortgageResult.title, 'Mortgage Projection', 'Mortgage calculator should return the expected title');
  assert.deepEqual(mortgageResult.chartKinds, ['amortization', 'pie', 'bar'], 'Mortgage calculator should return expected chart types');

  const loanResult = calculateLoan(baseInputs);
  assert.equal(loanResult.title, 'Loan Repayment', 'Loan calculator should return the expected title');
  assert.equal(loanResult.summary[2]?.label, 'Debt-Free Date', 'Loan summary should include debt-free metric');

  const compoundResult = calculateCompoundInterest(baseInputs);
  assert.equal(compoundResult.title, 'Compound Growth Projection', 'Compound calculator should return the expected title');
  assert.equal(compoundResult.projection.length, 120, 'Compound calculator should return monthly projection data');

  const retirementResult = calculateRetirement(baseInputs);
  assert.equal(retirementResult.title, 'Retirement Readiness', 'Retirement calculator should return the expected title');
  assert.ok(
    (retirementResult.summary[1]?.value ?? 0) < (retirementResult.summary[0]?.value ?? 0),
    'Inflation-adjusted value should be lower than projected nest egg'
  );
}
