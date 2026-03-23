import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { absoluteUrl, createPageMetadata } from '@/lib/seo';

const tools = [
  { name: 'Net worth tracker', value: 'Track how assets and liabilities change over time so you can measure real wealth progress.', href: '/calculators/net-worth-calculator' },
  { name: 'Budget planner', value: 'Test spending and saving scenarios before changing fixed expenses or debt payments.', href: '/calculators/budget-planner' },
  { name: 'Savings tracker', value: 'Estimate how much to save each month to reach emergency, travel, or home goals on schedule.', href: '/calculators/savings-goal-calculator' },
  { name: 'Debt payoff planner', value: 'Compare repayment approaches and see the interest impact of adding extra monthly payments.', href: '/calculators/debt-payoff-calculator' },
  { name: 'Investment growth tracker', value: 'Project long-term balance growth and understand how contributions and returns compound.', href: '/calculators/investment-growth-calculator' },
  { name: 'Financial independence calculator', value: 'Estimate your path to FI by modeling savings rate, return assumptions, and timeline.', href: '/calculators/fire-calculator' }
];

export const metadata: Metadata = createPageMetadata({
  title: 'Finance Tools | FinanceSphere',
  description: 'Use FinanceSphere tools to plan net worth growth, debt payoff, savings goals, and financial independence with scenario-based projections.',
  pathname: '/tools'
});

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
      url: absoluteUrl(tool.href)
    }))
  };

  return (
    <section className="space-y-6">
      {/* SEO: JSON-LD schema helps search engines understand tool/software pages. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsSchema) }} />

      <div className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 md:grid-cols-[1.25fr_1fr] md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Finance tools for planning, not guesswork</h1>
          <p className="text-slate-600">Each tool is designed to answer a concrete question—how long payoff will take, how much to save monthly, or whether your current plan supports future goals.</p>
        </div>
        <div className="relative h-44 overflow-hidden rounded-2xl sm:h-52">
          <Image
            src="/images/calculator-tools-illustration.svg"
            alt="Financial calculator tools illustration with planning cards and projected outcome charts"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
        </div>
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

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">Plan → Compare → Decide workflow</h2>
        <p className="mt-1 text-sm text-slate-600">These tools are educational planning aids. Use the matching comparison and guide pages to validate your next move.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/comparison" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Compare options before clicking through</Link>
          <Link href="/blog" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Read practical scenario guides</Link>
          <Link href="/financial-disclaimer" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Educational-use disclaimer</Link>
        </div>
      </section>
    </section>
  );
}
