'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { InputSlider } from '@/components/ui/input-slider';
import { AnimatedNumber } from '@/components/ui/animated-number';

const ChartSkeleton = () => <div className="h-72 animate-pulse rounded-xl bg-slate-100" />;

const AmortizationLineChart = dynamic(
  () => import('./CalculatorCharts').then((mod) => ({ default: mod.AmortizationLineChart })),
  { ssr: false, loading: ChartSkeleton }
);

export function LoanCalculator() {
  const [principal, setPrincipal] = useState(25000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [loanTerm, setLoanTerm] = useState(5);

  const { monthlyPayment, totalInterest, totalRepayment, amortization } = useMemo(() => {
    const months = loanTerm * 12;
    const monthlyRate = interestRate / 12 / 100;
    const payment =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
    const repay = payment * months;

    let balance = principal;
    const points = Array.from({ length: loanTerm }, (_, idx) => {
      for (let month = 0; month < 12; month += 1) {
        const monthlyInterest = balance * monthlyRate;
        const principalPart = payment - monthlyInterest;
        balance = Math.max(0, balance - principalPart);
      }
      return { year: idx + 1, balance: Math.round(balance) };
    });

    return { monthlyPayment: payment, totalInterest: repay - principal, totalRepayment: repay, amortization: points };
  }, [interestRate, loanTerm, principal]);

  const principalPct = (principal / totalRepayment) * 100;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-5">
        <h2 className="text-xl font-bold">Loan Calculator</h2>
        <InputSlider label="Loan amount" prefix="$" value={principal} min={1000} max={200000} step={500} onChange={setPrincipal} />
        <InputSlider label="Interest rate" suffix="%" value={interestRate} min={1} max={30} step={0.1} onChange={setInterestRate} />
        <InputSlider label="Tenure" suffix=" years" value={loanTerm} min={1} max={15} onChange={setLoanTerm} />

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary w-full rounded-xl">
          Recalculate instantly
        </motion.button>

        <div className="space-y-3 rounded-xl bg-slate-900 p-4 text-white">
          <p className="text-sm text-slate-300">Monthly Payment</p>
          <p className="text-3xl font-bold"><AnimatedNumber value={monthlyPayment} /></p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Principal share</span><span>{principalPct.toFixed(1)}%</span></div>
            <div className="h-2 rounded-full bg-slate-700"><div className="h-2 rounded-full bg-brand" style={{ width: `${principalPct}%` }} /></div>
            <div className="flex justify-between"><span>Total interest</span><span><AnimatedNumber value={totalInterest} /></span></div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-lg font-semibold">Amortization trend</h3>
        <AmortizationLineChart data={amortization} />
      </Card>
    </div>
  );
}
