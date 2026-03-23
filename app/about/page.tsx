import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About FinanceSphere | Practical Financial Planning Tools and Guides',
  description:
    'Learn how FinanceSphere helps people make better money decisions with practical calculators, planning tools, and straightforward educational guides.',
  alternates: {
    canonical: '/about'
  }
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-10">
      <header className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">About FinanceSphere: Clear tools for real money decisions</h1>
          <p className="max-w-3xl text-lg text-slate-600">
            FinanceSphere helps you plan major financial choices with practical calculators and plain-language guides, so you can compare options and move
            forward with confidence.
          </p>
        </div>
        <div className="relative h-52 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <Image
            src="/images/about-mission-illustration.svg"
            alt="FinanceSphere mission illustration showing a planning dashboard, growth graph, and trust badge"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 35vw"
            className="object-cover"
          />
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">Our mission</h2>
        <p className="text-slate-700">
          FinanceSphere exists to make financial planning more usable day to day. Big money decisions often involve tradeoffs across time, risk, and monthly
          cash flow. We build tools and content that make those tradeoffs visible, so you can evaluate scenarios with numbers instead of guesswork.
        </p>
        <p className="text-slate-700">
          Whether you are deciding between mortgage options, setting a debt payoff plan, or checking if your savings rate supports retirement goals, our
          goal is the same: help you understand your next best step.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">What we offer</h2>
        <div className="space-y-3 text-slate-700">
          <p>
            <span className="font-semibold text-slate-900">Mortgage and loan tools:</span> estimate monthly payments, compare borrowing scenarios, and model
            loan EMI structures so you can see how rates, terms, and down payments change total cost.
          </p>
          <p>
            <span className="font-semibold text-slate-900">Retirement and FIRE planning tools:</span> test timelines, contribution strategies, and return
            assumptions to evaluate long-term outcomes and financial independence targets.
          </p>
          <p>
            <span className="font-semibold text-slate-900">Savings, net worth, debt payoff, and investment growth tools:</span> track progress toward goals,
            understand payoff strategies, and project how regular contributions can compound over time.
          </p>
          <p>
            <span className="font-semibold text-slate-900">Educational content:</span> practical articles that explain key concepts, break down tradeoffs, and
            support smarter day-to-day money decisions alongside the calculators.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">Who it&apos;s for</h2>
        <p className="text-slate-700">FinanceSphere is built for people who want clarity before making a move, including:</p>
        <ul className="list-disc space-y-2 pl-6 text-slate-700 marker:text-slate-400">
          <li>Anyone planning major decisions like buying a home, refinancing, or taking a new loan.</li>
          <li>People comparing multiple options and trying to understand short-term affordability versus long-term cost.</li>
          <li>Households building a retirement plan, exploring FIRE, or balancing debt payoff with investing and savings goals.</li>
          <li>Individuals who want straightforward explanations without jargon-heavy financial content.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">How we think about financial tools</h2>
        <p className="text-slate-700">
          We prioritize simplicity and practical guidance. A good financial tool should answer a real question, show the assumptions clearly, and make
          outcomes easy to compare. It should not overwhelm you with complexity that hides the decision.
        </p>
        <p className="text-slate-700">
          That is why FinanceSphere focuses on clean inputs, understandable outputs, and context that helps you interpret results in your own situation.
        </p>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Editorial and commercial transparency</h2>
        <p className="text-slate-700">FinanceSphere is an educational platform, not a personalized advisory service. Some pages include affiliate links, but editorial frameworks and comparison criteria are designed to prioritize user fit, fee impact, and decision clarity.</p>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700" href="/editorial-policy">Editorial policy</Link>
          <Link className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700" href="/affiliate-disclosure">Affiliate disclosure</Link>
          <Link className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700" href="/how-we-make-money">How we make money</Link>
          <Link className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700" href="/financial-disclaimer">Financial disclaimer</Link>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Start exploring</h2>
        <p className="text-slate-700">
          If you&apos;re ready to plan your next step, start with our calculators and guides. Use them to compare scenarios, test assumptions, and build a plan
          you can act on.
        </p>
        <p>
          <Link className="font-semibold text-blue-700 hover:text-blue-800" href="/tools">
            Explore FinanceSphere tools →
          </Link>
        </p>
      </section>
    </article>
  );
}
