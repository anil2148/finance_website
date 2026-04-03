'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { BanknotesIcon, HomeModernIcon } from '@heroicons/react/24/outline';
import { useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { InputSlider } from '@/components/ui/input-slider';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { DownloadPdfButton } from '@/components/pdf/DownloadPdfButton';

const ChartSkeleton = () => <div className="h-72 animate-pulse rounded-xl bg-slate-100" />;

const AmortizationLineChart = dynamic(
  () => import('./CalculatorCharts').then((mod) => ({ default: mod.AmortizationLineChart })),
  { ssr: false, loading: ChartSkeleton }
);

const PaymentBreakdownPie = dynamic(
  () => import('./CalculatorCharts').then((mod) => ({ default: mod.PaymentBreakdownPie })),
  { ssr: false, loading: ChartSkeleton }
);

export function MortgageCalculator() {
  const exportRef = useRef<HTMLDivElement>(null);
  const [homePrice, setHomePrice] = useState(550000);
  const [downPayment, setDownPayment] = useState(90000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);

  const { monthlyPayment, totalInterest, loanAmount, amortization } = useMemo(() => {
    const principal = Math.max(0, homePrice - downPayment);
    const months = loanTerm * 12;
    const monthlyRate = interestRate / 12 / 100;
    const payment =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);

    const totalPaid = payment * months;
    const interest = Math.max(0, totalPaid - principal);

    let balance = principal;
    const timeline = Array.from({ length: loanTerm }, (_, index) => {
      for (let month = 0; month < 12; month += 1) {
        const monthlyInterest = balance * monthlyRate;
        const principalPart = payment - monthlyInterest;
        balance = Math.max(0, balance - principalPart);
      }

      return { year: index + 1, balance: Math.round(balance) };
    });

    return { monthlyPayment: payment, totalInterest: interest, loanAmount: principal, amortization: timeline };
  }, [downPayment, homePrice, interestRate, loanTerm]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DownloadPdfButton targetRef={exportRef} calculatorTitle="Mortgage Calculator" />
      </div>

      <div ref={exportRef} className="space-y-4 rounded-xl bg-white p-2">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold text-slate-900">Mortgage Calculator</h2>
          <p className="text-sm text-slate-600">Estimate your monthly EMI based on loan amount, interest rate, and tenure.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
          <Card className="space-y-6">
            <InputSlider label="Home price" prefix="$" value={homePrice} min={100000} max={2000000} step={5000} onChange={setHomePrice} />
            <InputSlider label="Down payment" prefix="$" value={downPayment} min={0} max={500000} step={1000} onChange={setDownPayment} />
            <InputSlider label="Interest rate" value={interestRate} min={2} max={12} step={0.1} suffix="%" onChange={setInterestRate} />
            <InputSlider label="Loan term" value={loanTerm} min={5} max={40} suffix=" years" onChange={setLoanTerm} />

            <motion.div layout className="grid gap-3 rounded-xl bg-slate-900 p-4 text-white sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-300">Monthly payment</p>
                <p className="text-2xl font-semibold"><AnimatedNumber value={monthlyPayment} /></p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-300">Total interest</p>
                <p className="text-2xl font-semibold"><AnimatedNumber value={totalInterest} /></p>
              </div>
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Loan amount</p>
                <p className="mt-1 flex items-center gap-2 text-lg font-semibold"><HomeModernIcon className="h-5 w-5 text-brand" /><AnimatedNumber value={loanAmount} /></p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Interest ratio</p>
                <p className="mt-1 flex items-center gap-2 text-lg font-semibold"><BanknotesIcon className="h-5 w-5 text-cyan-500" />{((totalInterest / Math.max(loanAmount, 1)) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-lg font-semibold">Payment visuals</h3>
            <AmortizationLineChart data={amortization} />
            <PaymentBreakdownPie principal={loanAmount} interest={totalInterest} />
          </Card>
        </div>

        <p className="border-t border-slate-200 pt-2 text-right text-xs text-slate-500">
          Exported on {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
