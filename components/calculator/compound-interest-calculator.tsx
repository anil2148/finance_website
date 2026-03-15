'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { InputSlider } from '@/components/ui/input-slider';
import { AnimatedNumber } from '@/components/ui/animated-number';

const ChartSkeleton = () => <div className="h-72 animate-pulse rounded-xl bg-slate-100" />;

const GrowthAreaChart = dynamic(
  () => import('./CalculatorCharts').then((mod) => ({ default: mod.GrowthAreaChart })),
  { ssr: false, loading: ChartSkeleton }
);

export function CompoundInterestCalculator() {
  const [initialAmount, setInitialAmount] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(400);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [years, setYears] = useState(20);

  const { futureValue, investedAmount, growth, projections } = useMemo(() => {
    const yearly = [] as { year: number; balance: number }[];
    let balance = initialAmount;
    for (let i = 1; i <= years; i += 1) {
      for (let month = 0; month < 12; month += 1) {
        balance = (balance + monthlyContribution) * (1 + annualReturn / 1200);
      }
      yearly.push({ year: i, balance: Math.round(balance) });
    }
    const invested = initialAmount + monthlyContribution * years * 12;
    return {
      futureValue: balance,
      investedAmount: invested,
      growth: balance - invested,
      projections: yearly
    };
  }, [annualReturn, initialAmount, monthlyContribution, years]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
      <Card className="space-y-5">
        <h2 className="text-xl font-bold">Compound Interest Calculator</h2>

        <InputSlider label="Initial investment" prefix="$" value={initialAmount} min={0} max={500000} step={1000} onChange={setInitialAmount} />
        <InputSlider label="Monthly contribution" prefix="$" value={monthlyContribution} min={0} max={10000} step={50} onChange={setMonthlyContribution} />
        <InputSlider label="Expected annual return" suffix="%" value={annualReturn} min={1} max={15} step={0.1} onChange={setAnnualReturn} />
        <InputSlider label="Investment horizon" suffix=" years" value={years} min={1} max={40} onChange={setYears} />

        <motion.div layout className="grid gap-3 rounded-xl bg-gradient-to-r from-slate-900 to-brand p-4 text-white sm:grid-cols-3">
          <div>
            <p className="text-xs text-slate-200">Future value</p>
            <p className="text-lg font-semibold"><AnimatedNumber value={futureValue} /></p>
          </div>
          <div>
            <p className="text-xs text-slate-200">Invested</p>
            <p className="text-lg font-semibold"><AnimatedNumber value={investedAmount} /></p>
          </div>
          <div>
            <p className="text-xs text-slate-200">Growth</p>
            <p className="text-lg font-semibold"><AnimatedNumber value={growth} /></p>
          </div>
        </motion.div>
      </Card>

      <Card>
        <h3 className="mb-3 text-lg font-semibold">Growth projection</h3>
        <GrowthAreaChart data={projections} />
      </Card>
    </div>
  );
}
