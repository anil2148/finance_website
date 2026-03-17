'use client';

import { useMemo, useState } from 'react';
import type { FinancialProduct } from '@/lib/financialProducts';

export function CreditScoreImpactSimulator() {
  const [score, setScore] = useState(680);
  const [utilization, setUtilization] = useState(35);
  const [missedPayments, setMissedPayments] = useState(0);

  const projected = useMemo(() => {
    let result = score;
    if (utilization < 30) result += 20;
    if (utilization < 10) result += 40;
    result -= missedPayments * 50;
    return Math.max(300, Math.min(850, result));
  }, [score, utilization, missedPayments]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
      <h3 className="font-semibold">Credit Score Impact Simulator</h3>
      <input className="input" type="number" value={score} onChange={(e) => setScore(Number(e.target.value))} placeholder="Current credit score" />
      <input className="input" type="number" value={utilization} onChange={(e) => setUtilization(Number(e.target.value))} placeholder="Credit utilization %" />
      <input className="input" type="number" value={missedPayments} onChange={(e) => setMissedPayments(Number(e.target.value))} placeholder="Missed payments" />
      <p className="text-sm text-slate-600">Projected score range after these changes: <strong>{projected}</strong></p>
    </div>
  );
}

export function SavingsGrowthCalculator() {
  const [principal, setPrincipal] = useState(5000);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(5);

  const futureValue = useMemo(() => principal * ((1 + rate / 100) ** years), [principal, rate, years]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
      <h3 className="font-semibold">Savings Growth Calculator</h3>
      <input className="input" type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} placeholder="Initial deposit" />
      <input className="input" type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} placeholder="Interest rate" />
      <input className="input" type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} placeholder="Years" />
      <p className="text-sm text-slate-600">Estimated ending balance (annual compounding): <strong>${futureValue.toFixed(2)}</strong></p>
    </div>
  );
}

export function CreditCardRecommendationTool({ products }: { products: FinancialProduct[] }) {
  const [creditScore, setCreditScore] = useState(700);
  const [monthlySpending, setMonthlySpending] = useState(2000);
  const [preferredRewards, setPreferredRewards] = useState('cashback');
  const [annualFeePreference, setAnnualFeePreference] = useState('no_fee');
  const [topCategory, setTopCategory] = useState('groceries');

  const recommendation = useMemo(() => {
    const cards = products.filter((item) => item.category === 'credit_card');
    return cards.find((card) => {
      const noFeeMatch = annualFeePreference === 'any' || card.annual_fee === '$0';
      const rewardsMatch = card.pros.join(' ').toLowerCase().includes(preferredRewards.toLowerCase());
      const categoryMatch = card.pros.join(' ').toLowerCase().includes(topCategory.toLowerCase());
      const scoreOk = creditScore > 720 ? card.rating >= 4.4 : card.rating >= 4.0;
      return noFeeMatch && scoreOk && (rewardsMatch || categoryMatch || monthlySpending > 1500);
    }) ?? cards[0];
  }, [annualFeePreference, creditScore, monthlySpending, preferredRewards, products, topCategory]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
      <h3 className="font-semibold">Credit Card Fit Finder</h3>
      <input className="input" type="number" value={creditScore} onChange={(e) => setCreditScore(Number(e.target.value))} placeholder="Credit score" />
      <input className="input" type="number" value={monthlySpending} onChange={(e) => setMonthlySpending(Number(e.target.value))} placeholder="Monthly spending" />
      <input className="input" value={preferredRewards} onChange={(e) => setPreferredRewards(e.target.value)} placeholder="Preferred rewards" />
      <select className="input" value={annualFeePreference} onChange={(e) => setAnnualFeePreference(e.target.value)}>
        <option value="no_fee">No annual fee</option>
        <option value="any">Any annual fee</option>
      </select>
      <input className="input" value={topCategory} onChange={(e) => setTopCategory(e.target.value)} placeholder="Top spending category" />
      {recommendation && <p className="text-sm text-slate-600">Best match based on your inputs: <strong>{recommendation.name}</strong> by {recommendation.bank}. <a className="text-brand underline" href={`/go/${recommendation.id}`} target="_blank" rel="noreferrer">View Offer</a></p>}
    </div>
  );
}
