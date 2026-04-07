import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About FinanceSphere | Decision-First Personal Finance Tools',
  description:
    'Learn who runs FinanceSphere, how our decision-first content is built, and how we keep calculators, comparisons, and guides transparent and useful.',
  alternates: {
    canonical: '/about'
  }
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-10">
      <header className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">About FinanceSphere: Built for real money decisions, not content volume</h1>
          <p className="max-w-3xl text-lg text-slate-600">
            FinanceSphere exists to help people make high-stakes household finance decisions with practical tools, clearer tradeoff analysis, and transparent editorial standards.
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
        <h2 className="text-2xl font-semibold text-slate-900">Why FinanceSphere exists</h2>
        <p className="text-slate-700">
          Most personal-finance content explains concepts but does not help with the moment that actually matters: choosing what to do next with your own constraints.
          FinanceSphere is built around that decision moment.
        </p>
        <p className="text-slate-700">
          We focus on practical scenarios like: whether to prioritize debt payoff or investing this quarter, whether a refinance actually lowers total cost,
          and whether a product still fits when your month goes off plan.
        </p>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Who runs FinanceSphere</h2>
        <p className="text-slate-700">
          FinanceSphere was founded by <strong>Smita Chowdhary</strong> and is maintained by a small editorial and product team.
          We are a publishing and software team focused on educational decision support, not a personalized advisory service.
        </p>
        <p className="text-slate-700">
          Our internal process is simple by design: define the user decision, test the guidance with calculator scenarios, review for disclosure clarity,
          and publish only when the page gives a concrete next step.
        </p>
        <p className="text-slate-700">
          If real-time provider data is unavailable in-repo, we publish a clearly labeled comparison framework rather than pretending to provide exhaustive live rankings.
        </p>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-900">About the Author</h2>
        <p className="text-slate-700">
          <strong>Smita Chowdhary</strong> is the founder of FinanceSphere and a personal finance enthusiast dedicated to helping individuals make smarter financial decisions using simple tools and data-driven insights.
        </p>
        <p className="text-slate-700">
          With a strong interest in areas like credit cards, savings strategies, investing, and debt management, Smita focuses on breaking down complex financial concepts into easy-to-understand guidance that anyone can apply in real life.
        </p>
        <p className="text-slate-700">
          At FinanceSphere, his goal is to combine <strong>interactive calculators, practical comparisons, and educational content</strong> to help users:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-slate-700">
          <li>Understand their financial situation</li>
          <li>Evaluate different options</li>
          <li>Make confident money decisions</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900">Experience &amp; Approach</h3>
        <p className="text-slate-700">
          Smita has spent years researching financial products, tools, and strategies across the U.S. market. His approach is based on:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-slate-700">
          <li>Practical, real-world scenarios</li>
          <li>Transparent comparisons</li>
          <li>User-first recommendations (not sales-driven)</li>
        </ul>
        <p className="text-slate-700">
          Every piece of content is designed to answer one simple question:
          <br />
          <span aria-label="decision question">👉 <em>“What is the best financial decision for this situation?”</em></span>
        </p>

        <h3 className="text-xl font-semibold text-slate-900">Editorial Standards</h3>
        <p className="text-slate-700">Content published on FinanceSphere follows a strict quality process:</p>
        <ul className="list-disc space-y-2 pl-6 text-slate-700">
          <li>Thorough research and verification</li>
          <li>Clear and unbiased explanations</li>
          <li>Regular updates to reflect the latest financial information</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900">Disclaimer</h3>
        <p className="text-slate-700">
          The information provided by Smita Chowdhary on FinanceSphere is for <strong>educational purposes only</strong> and should not be considered financial, investment, or legal advice. Always consult with a qualified financial professional before making financial decisions.
        </p>

        <h3 className="text-xl font-semibold text-slate-900">Contact</h3>
        <p className="text-slate-700">
          For feedback, questions, or collaboration:
          <br />
          📧 <a className="font-semibold text-blue-700 hover:underline" href="mailto:support@financesphere.io">support@financesphere.io</a>
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">How we build useful pages</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Calculators</h3>
            <p className="mt-2 text-sm text-slate-700">We prioritize transparent assumptions, easy input changes, and output views that support comparison—not false precision.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Guides</h3>
            <p className="mt-2 text-sm text-slate-700">Guides are written to answer: who this is for, what mistake is costly, and what the reader should do next.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Comparisons</h3>
            <p className="mt-2 text-sm text-slate-700">We use methodology-first comparison frameworks and call out limitations, instead of publishing unverified ranking claims.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Quality control</h3>
            <p className="mt-2 text-sm text-slate-700">Before updates ship, we check internal links, route consistency, and whether a page still supports a clear decision workflow.</p>
          </article>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Editorial and commercial transparency</h2>
        <p className="text-slate-700">
          FinanceSphere may earn revenue from affiliate relationships, but our editorial standards are designed around user fit, downside risk, and clarity—not conversion-first copy.
        </p>
        <p className="text-slate-700">
          If a page is unclear, outdated, or missing a key caveat, email <a className="font-semibold text-blue-700 hover:underline" href="mailto:support@financesphere.io">support@financesphere.io</a> with the URL.
          We review feedback as part of our refresh cycle.
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700" href="/editorial-policy">Editorial policy</Link>
          <Link className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700" href="/affiliate-disclosure">Affiliate disclosure</Link>
          <Link className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700" href="/how-we-make-money">How we make money</Link>
          <Link className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700" href="/financial-disclaimer">Financial disclaimer</Link>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Start here</h2>
        <p className="text-slate-700">If you are making a decision soon, start with one calculator run, then one comparison framework, then one guide that matches your scenario.</p>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link className="rounded-full border border-slate-300 px-3 py-1 font-medium hover:border-blue-300 hover:text-blue-700" href="/calculators">Open calculators</Link>
          <Link className="rounded-full border border-slate-300 px-3 py-1 font-medium hover:border-blue-300 hover:text-blue-700" href="/comparison">Open comparisons</Link>
          <Link className="rounded-full border border-slate-300 px-3 py-1 font-medium hover:border-blue-300 hover:text-blue-700" href="/blog">Read guides</Link>
        </div>
      </section>
    </article>
  );
}
