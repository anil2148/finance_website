import { ComparisonTable } from '@/components/comparison-table/ComparisonTable';
import { savingsAccounts } from '@/data/savingsAccounts';

export const revalidate = 3600;

export default function SavingsPage() {
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Compare Savings Accounts</h1><ComparisonTable data={savingsAccounts} /></div>;
}
