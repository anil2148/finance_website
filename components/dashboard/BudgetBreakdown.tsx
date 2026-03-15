const budgetItems = [
  { category: 'Housing', amount: '$1,800' },
  { category: 'Food', amount: '$640' },
  { category: 'Transport', amount: '$420' },
  { category: 'Investing', amount: '$900' },
  { category: 'Discretionary', amount: '$520' }
];

export function BudgetBreakdown() {
  return (
    <div className="space-y-2 text-sm">
      {budgetItems.map((item) => (
        <div key={item.category} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
          <span className="font-medium">{item.category}</span>
          <span className="text-slate-600">{item.amount}</span>
        </div>
      ))}
    </div>
  );
}
