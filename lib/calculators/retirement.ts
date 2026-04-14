import { buildInvestmentProjection } from '@/lib/calculators/engine';
import { GrowthCalculatorInputs, CalculatorResult } from '@/lib/calculators/types';

export const calculateRetirement = (inputs: GrowthCalculatorInputs): CalculatorResult => {
  const projection = buildInvestmentProjection(inputs);
  const nestEgg = projection.at(-1)?.balance ?? 0;
  const inflationAdjusted = nestEgg / Math.pow(1 + (inputs.inflationRate ?? 0) / 100, inputs.years);
  const annualIncome = inflationAdjusted * 0.04;

  return {
    title: 'Retirement Readiness',
    summary: [
      { label: 'Projected Nest Egg', value: nestEgg, currency: true, helpText: 'Estimated retirement portfolio before inflation adjustment.' },
      { label: 'Today\'s Dollars', value: inflationAdjusted, currency: true, helpText: 'Inflation-adjusted value of your projected retirement balance.' },
      { label: '4% Rule Income', value: annualIncome, currency: true, helpText: 'Estimated sustainable first-year retirement withdrawal.' }
    ],
    projection,
    breakdown: [
      { label: 'Inflation Rate', value: `${inputs.inflationRate ?? 0}%` },
      { label: 'Expected Return', value: `${inputs.expectedReturn}%` },
      { label: 'Years to Retirement', value: `${inputs.years}` }
    ],
    chartKinds: ['growth', 'bar']
  };
};
