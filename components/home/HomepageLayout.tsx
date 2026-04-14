import Link from 'next/link';
import Image from 'next/image';
import {
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/card';
import { NewsletterForm } from '@/components/NewsletterForm';
import { HumanJudgmentCallout } from '@/components/common/HumanJudgmentCallout';
import { AUTHOR_PROFILES, PRIMARY_AUTHOR_ID } from '@/lib/authors';
import { AskAIButton } from '@/components/money-copilot/AskAIButton';
import { CalculatorCardPreview } from '@/components/home/CalculatorCardPreview';

const popularCalculators = [
  {
    title: 'Mortgage Calculator',
    previewType: 'mortgage' as const,
    href: '/calculators/mortgage-calculator',
    description: 'Estimate monthly principal-and-interest payments before you choose a home budget or loan term.'
  },
  {
    title: 'Compound Interest Calculator',
    previewType: 'compound' as const,
    href: '/calculators/compound-interest-calculator',
    description: 'See how recurring contributions and time compound into long-term growth for future goals.'
  },
  {
    title: 'Debt Payoff Calculator',
    previewType: 'debt-payoff' as const,
    href: '/calculators/debt-payoff-calculator',
    description: 'Compare payoff timelines and interest cost when you add extra monthly payments.'
  },
  {
    title: 'Debt Snowball Calculator',
    previewType: 'debt-snowball' as const,
    href: '/calculators/debt-snowball-calculator',
    description: 'Sequence your debts smallest-first, see the momentum effect, and model when each balance clears.'
  }
];

const goalCards = [
  {
    tag: 'Calculate → then stress-test',
    title: 'Pay off debt faster',
    description: 'Estimate payoff dates and interest savings, then compare balance transfer cards or consolidation loans that fit your profile.',
    primaryLabel: 'Start with the Debt Payoff Calculator',
    primaryHref: '/calculators/debt-payoff-calculator',
    secondaryLabel: 'Improve your DTI before applying',
    secondaryHref: '/blog/debt-to-income-ratio-90-day-plan'
  },
  {
    tag: 'Model it before you commit',
    title: 'Compare investing apps',
    description: 'Model how much you can invest each month, then review platforms by fees, account types, and beginner-friendly tools.',
    primaryLabel: 'Run an investment growth projection',
    primaryHref: '/calculators/investment-growth-calculator',
    secondaryLabel: 'See best investment apps',
    secondaryHref: '/best-investment-apps'
  },
  {
    tag: 'Numbers first, then lenders',
    title: 'Estimate mortgage costs',
    description: 'Test home prices, down payments, and rates to see affordable monthly payments before speaking with lenders.',
    primaryLabel: 'Use the Mortgage Calculator',
    primaryHref: '/calculators/mortgage-calculator',
    secondaryLabel: 'Compare mortgage offers',
    secondaryHref: '/compare/mortgage-rate-comparison'
  },
  {
    tag: 'Project it, then decide',
    title: 'Plan for retirement',
    description: 'Estimate how much you may need, where you are today, and account types that can help close the gap.',
    primaryLabel: 'Check your retirement trajectory',
    primaryHref: '/calculators/retirement-calculator',
    secondaryLabel: 'Read retirement planning basics',
    secondaryHref: '/learn/investing'
  }
];

const tools = [
  {
    title: 'Plan major money moves',
    desc: 'Model home-buying, refinancing, debt payoff, and long-term investing before you commit.',
    href: '/calculators'
  },
  {
    title: 'Read practical money guides',
    desc: 'Get step-by-step explainers on credit cards, savings rates, loan terms, and tax basics.',
    href: '/blog'
  },
  {
    title: 'Compare real product trade-offs',
    desc: 'Review APR/APY, fees, bonuses, and key pros/cons side-by-side in minutes.',
    href: '/comparison'
  }
];

const trustSignals = [
  { label: 'Educational content — not personalized advice', href: '/financial-disclaimer' },
  { label: 'Affiliate transparency and editorial independence', href: '/affiliate-disclosure' },
  { label: 'How FinanceSphere evaluates products', href: '/editorial-policy' }
];

const trustStory = [
  {
    title: 'Start with your own numbers',
    text: 'Pick one decision, quantify it with a calculator, and compare options only after you know your baseline.'
  },
  {
    title: 'Pressure-test for bad months',
    text: 'A plan that works only in your best month usually fails in real life. Stress-test with downside assumptions first.'
  },
  {
    title: 'Choose from transparent trade-offs',
    text: 'Comparison pages focus on total cost, downside risk, flexibility, and fit — not commission rate.'
  }
];

const homepageMistake = {
  label: 'Common first move',
  mistake: 'Comparing products before running the numbers for your own situation.',
  why: 'The best credit card, savings account, or mortgage offer on a comparison site may be wrong for your income stability, debt profile, or timeline — even if the rate looks right.',
  fix: 'Run a calculator first. The number tells you which comparison page to read next — and which options to skip entirely.'
};

const whatGoesWrong = {
  title: 'The part most plans skip',
  scenarios: [
    {
      label: 'The income-growth trap',
      scenario: 'A household sets up a $650/month investment after a raise. Three months later, a $1,400 car repair forces a pause.',
      failure: 'The pause becomes permanent. Five months of contributions are missed. The behavior gap here costs more compounded wealth than the extra $150/month would ever have added.',
      rule: 'Set your contribution ceiling from your worst income month in the past year — not your best. If the plan survives that month, it will survive most things.'
    },
    {
      label: 'The premium card math trap',
      scenario: 'A household applies for a $395/year premium card to earn travel rewards. The welcome bonus requires $4,000 in spend within 90 days.',
      failure: 'Spending increases by $400/month to hit the threshold. A balance carries one month at 27% APR. Interest in month one erases multiple months of reward value.',
      rule: 'Rewards are only profitable if you would have spent the money anyway. If hitting the threshold requires new spending, the card costs money — not earns it.'
    }
  ],
  microReality: 'An ambitious plan that only works in your best month is not a real plan.'
};

const crawlPriorityLinks = [
  { href: '/blog/debt-to-income-ratio-90-day-plan', label: 'DTI 90-day plan' },
  { href: '/calculators/debt-snowball-calculator', label: 'Debt Snowball Calculator' },
  { href: '/learn/investing', label: 'Investing Hub' },
  { href: '/best-credit-cards-2026', label: 'Best Credit Cards 2026' },
  { href: '/best-investment-apps', label: 'Best Investment Apps' },
  { href: '/best-savings-accounts-usa', label: 'Best Savings Accounts USA' },
  { href: '/learn/credit-cards', label: 'Credit Cards Hub' },
  { href: '/learn/loans', label: 'Loans Hub' },
  { href: '/compare/mortgage-rate-comparison', label: 'Mortgage Rate Comparison' }
];

const homepageFaqs = [
  {
    question: 'Where should I start if I need quick financial clarity?',
    answer:
      'Pick one decision you need to make this month and run the matching calculator first. The numbers will tell you which comparison page to read next — before you apply, switch, or move money.',
    href: '/calculators',
    label: 'Browse all calculators'
  },
  {
    question: 'How are product recommendations evaluated?',
    answer:
      'Comparison pages prioritize transparent trade-offs: total cost, downside risk, fees, flexibility, and who each option actually fits. We do not rank by commission rate or affiliate volume.',
    href: '/editorial-policy',
    label: 'Read editorial policy'
  },
  {
    question: 'Is FinanceSphere financial advice?',
    answer:
      'No. Every page here is educational. Use it to build a decision framework — then verify current rates, terms, and eligibility directly with providers before you commit.',
    href: '/financial-disclaimer',
    label: 'Read full disclaimer'
  }
];


const userSegments = [
  {
    title: 'Stable income, just starting out',
    note: 'Start with a number you can hit every month for 6 months straight — not what feels ambitious. Raising it later is easy. Recovering from quitting early is not.',
    next: { href: '/calculators/savings-goal-calculator', label: 'Model a realistic target' }
  },
  {
    title: 'Variable or commission-based income',
    note: 'Every plan here should be built around your lowest recent income month — not your average. If it survives that month, it survives most things. If it does not, the plan is not ready yet.',
    next: { href: '/calculators/savings-goal-calculator', label: 'Model emergency runway' }
  },
  {
    title: 'Carrying high-interest debt right now',
    note: 'If your debt carries more than 15% APR, paying it down almost always wins over investing the same dollar. Run the actual numbers — the break-even math is often surprising.',
    next: { href: '/calculators/debt-payoff-calculator', label: 'Test debt payoff scenarios' }
  },
  {
    title: 'Buying a home in the next 12 months',
    note: 'Run the payment at the quoted rate and at +1%. If the +1% scenario is uncomfortable, the purchase price is likely too high for your real cashflow — not just for bank qualification.',
    next: { href: '/calculators/mortgage-calculator', label: 'Stress-test at worst-case rate' }
  }
];

const momentumExamples = [
  {
    label: 'Increase investing from $500 to $550/month',
    outcome: '≈ $39,000 more over 20 years',
    note: 'Assumes 8% annual growth. A $50 monthly increase can materially shift long-run flexibility.'
  },
  {
    label: 'Lower a $400,000 mortgage from 7% to 6%',
    outcome: '≈ $87,000 less total interest over 30 years',
    note: 'Illustrative principal-and-interest comparison before taxes/insurance. Confirm APR and closing-fee trade-offs.'
  },
  {
    label: 'Add $200/month on a $15,000 balance at 22% APR',
    outcome: 'Can cut payoff time by roughly 3+ years',
    note: 'Interest savings can reach five figures depending on balance, APR, and whether you avoid new card spending.'
  }
];

export function HomepageLayout() {
  const author = AUTHOR_PROFILES[PRIMARY_AUTHOR_ID];
  return (
    <section className="space-y-10" aria-label="FinanceSphere homepage">
      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white shadow-[0_30px_80px_-40px_rgba(37,99,235,0.9)]">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.6),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(129,140,248,0.5),transparent_35%),linear-gradient(rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.22)_1px,transparent_1px)] [background-size:auto,auto,26px_26px,26px_26px]" />
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="relative space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200/60 bg-white/15 px-3 py-1 text-xs font-medium text-cyan-100">
              FinanceSphere • Interactive personal finance platform
            </p>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200/60 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
              Primary entry: Start a decision
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">Make smarter money decisions with real numbers</h1>
            <p className="max-w-xl text-blue-100/95">
              Most financial content explains what things are. This site helps you decide what to do — with actual numbers, stress tests, and what happens when things do not go according to plan.
            </p>
            <div className="flex flex-wrap gap-3">
              <AskAIButton
                label="Start a decision"
                prefillQuestion="Help me make a smarter financial decision"
                aiContext={{
                  pageType: 'homepage',
                  intent: 'financial-decision-triage',
                  groundingMessage: 'I’m using the homepage context to route your decision.',
                  suggestedPrompts: [
                    'Help me choose the best next financial move',
                    'Which calculator should I run first?',
                    'Stress-test my plan before I commit',
                  ],
                }}
                className="border-cyan-300/60 bg-cyan-300 text-slate-950 hover:bg-cyan-200 dark:border-cyan-400/40 dark:bg-cyan-300 dark:text-slate-950"
              />
            </div>
            <p className="text-xs text-blue-200">1) Start a decision → 2) Run the recommended calculator → 3) Follow the next-step guide.</p>
            <p className="text-xs text-blue-200">Last homepage review: April 8, 2026 • Educational content only; verify final terms with providers before action.</p>
          </div>
          <div className="relative space-y-3 rounded-xl border border-cyan-100/30 bg-slate-900/60 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur">
            <div className="relative h-56 overflow-hidden rounded-lg border border-white/20">
              <Image
                src="/images/home-hero-finance-dashboard.svg"
                alt="Finance dashboard illustration showing savings growth, investment trend, and budget goals"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold">Test before you commit</h2>
            <p className="text-sm text-cyan-100">Run your scenario in a good month and a bad month. If only one works, rethink the plan before you move money.</p>
          </div>
        </div>
      </Card>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="trust-summary">
        <h2 id="trust-summary" className="text-xl font-semibold text-slate-900 dark:text-slate-100">Why trust FinanceSphere?</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Built by <strong className="text-slate-800 dark:text-slate-200">{author.name}</strong>
          {author.yearsOfExperience ? <span>, {author.yearsOfExperience}+ years in consumer finance systems and personal finance research</span> : null}
          {author.credentials && author.credentials.length > 0 ? (
            <span className="ml-1">
              ({author.credentials.join(', ')})
            </span>
          ) : null}.
        </p>
        {author.methodology ? (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Methodology: {author.methodology}</p>
        ) : null}
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">Decision-first</div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">Transparent about conflicts</div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">Calculator-backed</div>
        </div>
      </section>

      <aside className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400" aria-label="Affiliate disclosure notice">
        FinanceSphere may earn affiliate commissions from some partners. <Link href="/affiliate-disclosure" className="font-medium text-blue-700 hover:underline dark:text-blue-400">Full disclosure →</Link>
      </aside>

      <section aria-labelledby="what-to-do-first" className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 id="what-to-do-first" className="text-2xl font-semibold text-slate-900 dark:text-slate-100">What to do first</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Pick a goal, run the numbers, then choose your next step — not the other way around.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {goalCards.map((goal) => (
            <article key={goal.title} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">{goal.tag}</p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{goal.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{goal.description}</p>
              <div className="mt-3 space-y-1 text-sm">
                <Link href={goal.primaryHref} className="block font-semibold text-blue-700 hover:underline dark:text-blue-300">{goal.primaryLabel}</Link>
                <Link href={goal.secondaryHref} className="block font-medium text-slate-700 hover:text-blue-700 hover:underline dark:text-slate-200 dark:hover:text-blue-300">{goal.secondaryLabel}</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="segment-plans">
        <h2 id="segment-plans" className="text-xl font-semibold text-slate-900 dark:text-slate-100">Find the path that matches your situation</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Income stability, existing debt, and how close you are to a major purchase all change what the right move is — before any product comparison.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {userSegments.map((segment) => (
            <article key={segment.title} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">{segment.title}</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{segment.note}</p>
              <Link href={segment.next.href} className="mt-2 inline-block text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">{segment.next.label}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{whatGoesWrong.title}</h2>
        <p className="mt-1 text-xs font-medium italic text-slate-500 dark:text-slate-400">&ldquo;{whatGoesWrong.microReality}&rdquo;</p>
        <div className="mt-4 space-y-4">
          {whatGoesWrong.scenarios.map((s) => (
            <div key={s.label} className="grid gap-3 md:grid-cols-3">
              <article className="rounded-xl border border-amber-200 bg-white p-3 dark:border-amber-800/40 dark:bg-slate-900">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">Scenario — {s.label}</h3>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{s.scenario}</p>
              </article>
              <article className="rounded-xl border border-amber-200 bg-white p-3 dark:border-amber-800/40 dark:bg-slate-900">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">Failure point</h3>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{s.failure}</p>
              </article>
              <article className="rounded-xl border border-amber-200 bg-white p-3 dark:border-amber-800/40 dark:bg-slate-900">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">What to do instead</h3>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{s.rule}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="real-number-examples">
        <h2 id="real-number-examples" className="text-xl font-semibold text-slate-900 dark:text-slate-100">Small decisions, large long-run impact</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {momentumExamples.map((example) => (
            <article key={example.label} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Illustrative scenario</p>
              <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{example.label}</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{example.outcome}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{example.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-900/40 dark:bg-blue-950/20">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Get a weekly plan that matches your goal</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Pick your goal first, then get weekly action ideas tailored to that path.</p>
        <div className="mt-4">
          <NewsletterForm source="homepage" leadMagnet="goal-matched-weekly-plan" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">How FinanceSphere works</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Use this sequence: run one calculator, stress-test your downside, then use a comparison page to choose between options that still work.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm">
          {trustStory.map((item) => (
            <div key={item.title}>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
              <p className="mt-1 text-slate-600 dark:text-slate-300">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <HumanJudgmentCallout>
        Most people choose a plan that only works in their best month. The plan that actually builds wealth is the one that survives your worst recent month — and keeps running when optimism fades.
      </HumanJudgmentCallout>

      <section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5 dark:border-rose-900/40 dark:bg-rose-950/10">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Before you compare products: one common mistake</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm">
          <div className="rounded-xl border border-rose-200 bg-white p-3 dark:border-rose-800/40 dark:bg-slate-900">
            <p className="font-semibold text-rose-700 dark:text-rose-400">Common move</p>
            <p className="mt-1 text-slate-700 dark:text-slate-300">{homepageMistake.mistake}</p>
          </div>
          <div className="rounded-xl border border-rose-200 bg-white p-3 dark:border-rose-800/40 dark:bg-slate-900">
            <p className="font-semibold text-rose-700 dark:text-rose-400">Why it backfires</p>
            <p className="mt-1 text-slate-700 dark:text-slate-300">{homepageMistake.why}</p>
          </div>
          <div className="rounded-xl border border-rose-200 bg-white p-3 dark:border-rose-800/40 dark:bg-slate-900">
            <p className="font-semibold text-emerald-700 dark:text-emerald-400">Better approach</p>
            <p className="mt-1 text-slate-700 dark:text-slate-300">{homepageMistake.fix}</p>
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-label="Trust and transparency links">
        {trustSignals.map((signal) => (
          <Link key={signal.label} href={signal.href} className="flex items-center gap-2 rounded-xl border border-slate-100 px-3 py-2 text-sm transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-700 dark:hover:border-blue-400/40 dark:hover:bg-blue-500/10">
            <ShieldCheckIcon className="h-4 w-4 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
            <span className="font-medium text-slate-700 dark:text-slate-200">{signal.label}</span>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="priority-pages-heading">
        <h2 id="priority-pages-heading" className="text-xl font-semibold text-slate-900 dark:text-slate-100">Comparisons and guides worth reading first</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {crawlPriorityLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300">
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Popular calculators</h2>
          <Link href="/calculators" className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">See all calculators</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {popularCalculators.map((calculator) => (
            <article key={calculator.href} className="group rounded-xl focus-within:ring-2 focus-within:ring-blue-500">
              <Card className="h-full border-slate-200/80 bg-white/85 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.8)] transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                <ChartBarIcon className="h-6 w-6 text-blue-700 dark:text-blue-300" aria-hidden="true" />
                <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{calculator.title}</h3>
                <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{calculator.description}</p>
                <CalculatorCardPreview type={calculator.previewType} />
                <Link href={calculator.href} className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">Open calculator →</Link>
              </Card>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.title} className="rounded-2xl border-slate-200/90 bg-gradient-to-b from-white to-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{tool.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{tool.desc}</p>
            <Link href={tool.href} className="mt-3 inline-block text-sm font-semibold text-blue-700 dark:text-blue-300">Open section →</Link>
          </Card>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="homepage-faq-heading">
        <h2 id="homepage-faq-heading" className="text-xl font-semibold text-slate-900 dark:text-slate-100">Common questions before you start</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {homepageFaqs.map((faq) => (
            <article key={faq.question} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">{faq.question}</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{faq.answer}</p>
              <Link href={faq.href} className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">{faq.label}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="why-trust-us">
        <h2 id="why-trust-us" className="text-xl font-semibold text-slate-900 dark:text-slate-100">Trust details and disclosures</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Built by <strong className="text-slate-800 dark:text-slate-200">{author.name}</strong>
          {author.yearsOfExperience ? <span>, {author.yearsOfExperience}+ years in consumer finance systems and personal finance research</span> : null}
          {author.credentials && author.credentials.length > 0 ? (
            <span className="ml-1">
              ({author.credentials.join(', ')})
            </span>
          ) : null}.
        </p>
        {author.methodology ? (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">&ldquo;{author.methodology}&rdquo;</p>
        ) : null}
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Decision-first methodology</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Every article starts from the common mistake, not a product pitch. We explain what goes wrong before explaining what to do.</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Transparent about conflicts</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Affiliate relationships are clearly disclosed. Partners cannot buy rankings, suppress risk notes, or remove limitations from any page. <Link href="/affiliate-disclosure" className="font-medium text-blue-600 hover:underline dark:text-blue-400">See full disclosure</Link>.</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Calculator-backed content</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Every guide links to a calculator so you can apply the advice to your specific numbers before closing the tab.</p>
          </div>
        </div>
        {author.expertise && author.expertise.length > 0 ? (
          <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Topics covered</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {author.expertise.map((area) => (
                <span key={area} className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  {area}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Link href="/about" className="font-medium text-blue-600 hover:underline dark:text-blue-400">About Smita &amp; FinanceSphere</Link>
          <Link href="/editorial-policy" className="font-medium text-blue-600 hover:underline dark:text-blue-400">Editorial policy</Link>
          <Link href="/affiliate-disclosure" className="font-medium text-blue-600 hover:underline dark:text-blue-400">Affiliate disclosure</Link>
          <Link href="/how-we-make-money" className="font-medium text-blue-600 hover:underline dark:text-blue-400">How we make money</Link>
          <Link href="/financial-disclaimer" className="font-medium text-blue-600 hover:underline dark:text-blue-400">Financial disclaimer</Link>
        </div>
      </section>

      <NewsletterForm source="homepage" className="scroll-mt-24" />
    </section>
  );
}
