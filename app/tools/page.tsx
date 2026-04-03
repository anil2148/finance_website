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
          <p className="text-slate-600">Each tool answers a concrete question. Run your base case first, then test it under pressure with a lower income month or one surprise expense.</p>
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
              Test before committing →
            </Link>
          </Card>
        ))}
      </div>

      <section className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
        <h2 className="text-lg font-semibold text-slate-900">What goes wrong</h2>
        <p className="mt-2 text-sm text-slate-700">Running a calculator once with ideal assumptions, then making a decision. The number looks good in a normal month. One expense spike later, the plan collapses.</p>
        <p className="mt-2 text-sm font-medium text-slate-800 italic">If this only works in a perfect month, it is not realistic.</p>
        <p className="mt-3 text-sm text-slate-700">Fix: run each tool twice — once at your target and once at your worst recent month. If only one scenario passes, dial back until both hold.</p>
        <p className="mt-2 text-sm text-slate-700">Example: if income drops from $6,200 to $4,900 for one month and your plan fails instantly, the target is too tight.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Decision branching before opening a tool</h2>
        <div className="mt-2 space-y-1 text-sm text-slate-700">
          <p><span className="font-semibold text-blue-700">If your urgent issue is debt APR above 20%</span> → start with the debt payoff planner first.</p>
          <p><span className="font-semibold text-blue-700">If your income is variable by more than 25%</span> → start with budget planner and savings runway tools.</p>
          <p><span className="font-semibold text-blue-700">If core bills are stable and debt is controlled</span> → run investing or FI projections next.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Best for / Not ideal for</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-blue-700">Best for</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
              <li>Comparing two concrete strategies before moving money</li>
              <li>Households with stable income and a fixed monthly surplus</li>
              <li>Anyone facing a major financial decision in the next 30–90 days</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Not ideal for</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
              <li>Same-day decisions without verifying live lender terms</li>
              <li>Replacing a conversation with a financial professional for complex situations</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">Compare after stress-testing</h2>
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
