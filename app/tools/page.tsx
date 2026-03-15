import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

const tools = [
  { name: 'Net worth tracker', value: 'Track assets and liabilities with trend insights.', href: '/calculators/net-worth-calculator' },
  { name: 'Budget planner', value: 'Set spending caps and monitor monthly categories.', href: '/calculators/budget-planner' },
  { name: 'Savings tracker', value: 'Follow progress toward emergency and lifestyle goals.', href: '/calculators/savings-goal-calculator' },
  { name: 'Debt payoff planner', value: 'Choose avalanche or snowball payoff strategy.', href: '/calculators/debt-payoff-calculator' },
  { name: 'Investment portfolio tracker', value: 'Track allocation and long-term returns.', href: '/calculators/investment-growth-calculator' },
  { name: 'Financial independence calculator', value: 'Estimate years to FI using savings rate.', href: '/calculators/fire-calculator' }
];

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Use financial tools for net worth, savings, debt payoff, and investment planning on FinanceSphere.',
  alternates: { canonical: '/tools' }
};

export default function ToolsPage() {
  const toolsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: tools.map((tool, index) => ({
      '@type': 'SoftwareApplication',
      position: index + 1,
      name: tool.name,
      description: tool.value,
      applicationCategory: 'FinanceApplication',
      url: `https://financesphere.io${tool.href}`
    }))
  };

  return (
    <section className="space-y-6">
      {/* SEO: JSON-LD schema helps search engines understand tool/software pages. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsSchema) }} />

      <div>
        <h1 className="text-3xl font-bold">Financial Tools Platform</h1>
        <p className="text-slate-600">A suite of planning tools designed for viral SEO and practical daily money decisions.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.name} className="h-full">
            <h2 className="text-lg font-semibold">{tool.name}</h2>
            <p className="text-sm text-slate-600">{tool.value}</p>
            <Link href={tool.href} className="mt-2 inline-block text-sm font-semibold text-blue-700 hover:text-blue-800">
              Open tool →
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
