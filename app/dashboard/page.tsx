import { AssetsLiabilitiesChart } from '@/components/charts/AssetsLiabilitiesChart';
import { FinanceLineChart } from '@/components/charts/FinanceLineChart';
import { BudgetBreakdown } from '@/components/dashboard/BudgetBreakdown';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Card } from '@/components/ui/card';

const growth = [
  { name: 'Jan', value: 45000 },
  { name: 'Feb', value: 47200 },
  { name: 'Mar', value: 49900 },
  { name: 'Apr', value: 53300 },
  { name: 'May', value: 57000 },
  { name: 'Jun', value: 60800 }
];

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Personal Finance Dashboard</h1>
        <p className="text-slate-600">Monitor net worth, investments, savings progress, and budget allocations in one place.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Net Worth" value="$128,400" helper="+8.2% vs last quarter" />
        <MetricCard label="Total Assets" value="$182,300" helper="Cash, investments, property" />
        <MetricCard label="Total Liabilities" value="$53,900" helper="Mortgages and credit" />
        <MetricCard label="Savings Rate" value="31%" helper="Monthly income allocation" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Assets vs liabilities</h2>
          <AssetsLiabilitiesChart assets={182300} liabilities={53900} />
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Investment growth</h2>
          <FinanceLineChart data={growth} dataKey="value" />
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">Monthly budget breakdown</h2>
        <BudgetBreakdown />
      </Card>
    </section>
  );
}
