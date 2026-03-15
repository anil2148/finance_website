import { Card } from '@/components/ui/card';

const tools = [
  { name: 'Net worth tracker', value: 'Track assets and liabilities with trend insights.' },
  { name: 'Budget planner', value: 'Set spending caps and monitor monthly categories.' },
  { name: 'Savings tracker', value: 'Follow progress toward emergency and lifestyle goals.' },
  { name: 'Debt payoff planner', value: 'Choose avalanche or snowball payoff strategy.' },
  { name: 'Investment portfolio tracker', value: 'Track allocation and long-term returns.' },
  { name: 'Financial independence calculator', value: 'Estimate years to FI using savings rate.' }
];

export default function ToolsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Tools Platform</h1>
        <p className="text-slate-600">A suite of planning tools designed for viral SEO and practical daily money decisions.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.name} className="h-full">
            <h2 className="text-lg font-semibold">{tool.name}</h2>
            <p className="text-sm text-slate-600">{tool.value}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
