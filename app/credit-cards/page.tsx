import { ComparisonTable } from '@/components/comparison-table/ComparisonTable';
import { creditCards } from '@/data/creditCards';

export const revalidate = 3600;

export default function CreditCardsPage() {
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Compare Credit Cards</h1><ComparisonTable data={creditCards} /></div>;
}
