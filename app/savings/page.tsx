import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { HumanJudgmentCallout } from '@/components/common/HumanJudgmentCallout';
import { CommonMistakeModule } from '@/components/common/CommonMistakeModule';

export const metadata: Metadata = createPageMetadata({
  title: 'Savings Account Decision Framework | FinanceSphere',
  description: 'Choose savings accounts using APY durability, transfer reliability, liquidity constraints, and emergency-fund fit.',
  pathname: '/savings'
});

export default function SavingsPage() {
  const scenarios = [
    {
      title: 'Scenario 1: Job loss anxiety with a thin buffer',
      emotion: 'You are losing sleep because one income interruption could force credit-card debt.',
      numbers: 'Essential spend: $3,200/month. Current emergency cash: $2,900. Gap to 3-month baseline: $6,700.',
      decision: 'Prioritize instant-access savings and automatic weekly transfers before optimizing APY.'
    },
    {
      title: 'Scenario 2: Stable income but slow transfer risk',
      emotion: 'You feel safe on paper, but your cash is trapped in accounts with slow outbound transfers.',
      numbers: 'Emergency cash: $15,000. Transfer delay: 3 business days. Urgent car repair: $1,450 due same day.',
      decision: 'Split reserves into a "fast-access" bucket and a "yield" bucket to reduce operational risk.'
    },
    {
      title: 'Scenario 3: APY-chasing fatigue',
      emotion: 'You keep switching accounts for small APY differences and lose consistency.',
      numbers: 'Balance: $20,000. APY delta: 0.30%. Annual gain from switching: about $60 pre-tax.',
      decision: 'Only switch when service quality and transfer reliability also improve, not APY alone.'
    }
  ];

  return (
    <section className="space-y-6">
      <header className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Decision framework</p>
        <h1 className="text-3xl font-bold text-slate-900">Savings account framework for real emergencies</h1>
        <p className="max-w-3xl text-slate-600">
          A savings account that looks perfect on a rate comparison site can fail you when it actually matters — if transfers take 3 business days, if minimum balance rules create friction, or if the APY drops after the first year. Use this page before opening or switching, not after.
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/best-savings-accounts-usa" className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Open savings comparison framework</Link>
          <Link href="/calculators/savings-goal-calculator" className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Run savings goal calculator</Link>
          <Link href="/blog/emergency-fund-target-by-recovery-timeline" className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Emergency fund guide</Link>
        </div>
      </header>

      <HumanJudgmentCallout>
        A higher APY is not free money. It is a conditional offer — conditional on meeting balance requirements, not breaking account rules, and the rate staying where it was advertised. Emergency cash needs to be there when you need it, not when conditions are perfect.
      </HumanJudgmentCallout>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-900">Decision checklist before you open or switch</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>Confirm your emergency target in months of essential expenses, not as a generic dollar amount.</li>
          <li>Test transfer rules and timing so you know how fast cash reaches checking during urgent weeks.</li>
          <li>Check monthly fee triggers, minimum balance rules, and any account activity requirements.</li>
          <li>Review support access quality for fraud holds, transfer reversals, and account lock events.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">Real situations — what actually matters</h2>
        <p className="mt-2 text-sm text-slate-600">Use these examples to connect stress signals with concrete numbers and a practical next action.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {scenarios.map((scenario) => (
            <article key={scenario.title} className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-base font-semibold text-slate-900">{scenario.title}</h3>
              <p className="mt-2 text-sm text-slate-700"><strong>The situation:</strong> {scenario.emotion}</p>
              <p className="mt-2 text-sm text-slate-700"><strong>The numbers:</strong> {scenario.numbers}</p>
              <p className="mt-2 text-sm text-slate-700"><strong>What to do:</strong> {scenario.decision}</p>
            </article>
          ))}
        </div>
      </section>

      <CommonMistakeModule
        mistake="Switching to a higher-APY savings account and then discovering the transfer window is 3–5 business days when an emergency requires same-day or next-day access."
        whyItBackfires="The extra yield — often $50–$100/year on a typical emergency fund balance — does not compensate for covering a gap expense with a credit card at 26% APR while the transfer clears. One emergency event can cost more in credit card interest than a full year of APY differential."
        betterAlternative="Keep one fast-access account (same-day or next-day transfer to checking) as your primary emergency bucket. Use a higher-yield, slower-access account for the portion of reserves you would not need within 72 hours. The yield difference is real — but only if you never need it fast."
      />

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="text-xl font-semibold text-amber-900">When to wait before optimizing APY</h2>
        <p className="mt-2 text-sm text-amber-900">
          If your buffer is below one month of required expenses, prioritize contribution consistency and liquidity first. A slightly lower APY with simpler
          access can be safer than a higher-yield account you cannot operate reliably under stress.
        </p>
      </section>
    </section>
  );
}
