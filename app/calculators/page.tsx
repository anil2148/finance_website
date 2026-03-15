import Link from 'next/link';
import { Card } from '@/components/ui/card';

const tools = [
  { href: '/mortgage-calculator', title: 'Mortgage calculator', description: 'Live monthly payment and principal vs interest chart.' },
  { href: '/loan-emi-calculator', title: 'Loan EMI calculator', description: 'Interactive EMI with amortization trend.' },
  { href: '/compound-interest-calculator', title: 'Compound interest calculator', description: 'Track growth with dynamic area charts.' },
  { href: '/retirement-calculator', title: 'Retirement calculator', description: 'Estimate long-term savings potential.' },
  { href: '/net-worth-calculator', title: 'Net worth calculator', description: 'Measure assets and liabilities quickly.' }
];

export default function CalculatorsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Calculators</h1>
        <p className="max-w-3xl text-slate-600">Choose a calculator to model payments, growth, and long-term scenarios with interactive controls.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Card className="h-full transition hover:-translate-y-1">
              <h2 className="text-lg font-semibold">{tool.title}</h2>
              <p className="text-sm text-slate-600">{tool.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
