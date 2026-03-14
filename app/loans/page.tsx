import { ComparisonTable } from '@/components/comparison-table/ComparisonTable';
import { loans } from '@/data/loans';

export const revalidate = 3600;

export default function LoansPage() {
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Compare Personal Loans</h1><ComparisonTable data={loans} /></div>;
}
