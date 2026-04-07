import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { AUTHOR_PROFILES, PRIMARY_AUTHOR_ID } from '@/lib/authors';

export const metadata: Metadata = {
  title: 'About FinanceSphere | Decision-First Personal Finance Tools',
  description:
    'Learn who runs FinanceSphere, how our decision-first content is built, and how we keep calculators, comparisons, and guides transparent and useful.',
  alternates: {
    canonical: '/about'
  }
};

export default function AboutPage() {
  const author = AUTHOR_PROFILES[PRIMARY_AUTHOR_ID];

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
        <p className="text-slate-700">
          The content here is not written for the best-case reader with above-average income, no debt, and unlimited time. It is written for the household managing
          real constraints — and trying to make the least-regret decision with the information available right now.
        </p>
      </section>

      {/* Author section */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Who runs FinanceSphere</h2>

        <div className="grid gap-5 md:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            <div>
              <p className="text-xl font-semibold text-slate-900">{author.name}</p>
              <p className="text-base text-blue-700">{author.role}</p>
              {author.yearsOfExperience ? (
                <p className="mt-1 text-sm text-slate-600">{author.yearsOfExperience}+ years in consumer finance systems &amp; personal finance research</p>
              ) : null}
            </div>

            {author.credentials && author.credentials.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {author.credentials.map((cred) => (
                  <span key={cred} className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {cred}
                  </span>
                ))}
              </div>
            ) : null}

            {author.expertise && author.expertise.length > 0 ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Areas of focus</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {author.expertise.map((area) => (
                    <span key={area} className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <p className="text-slate-700">{author.bio}</p>

        {author.experience ? (
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Background</p>
            <p className="mt-1 text-sm text-slate-600">{author.experience}</p>
          </div>
        ) : null}

        {author.methodology ? (
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-800">Content methodology</p>
            <p className="mt-1 text-sm text-blue-900">{author.methodology}</p>
          </div>
        ) : null}

        {author.philosophy ? (
          <blockquote className="border-l-4 border-slate-300 pl-4 text-base italic text-slate-600">
            &ldquo;{author.philosophy}&rdquo;
          </blockquote>
        ) : null}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">How we build useful pages</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Calculators</h3>
            <p className="mt-2 text-sm text-slate-700">We prioritize transparent assumptions, easy input changes, and output views that support comparison — not false precision. Every calculator includes an insight layer that explains what the result means in real-world terms.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Guides</h3>
            <p className="mt-2 text-sm text-slate-700">Each guide answers three questions: who this is for, what costly mistake the reader is trying to avoid, and what to do next. We start from the failure mode, not the ideal scenario.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Comparisons</h3>
            <p className="mt-2 text-sm text-slate-700">We use methodology-first comparison frameworks with explicit evaluation weights and call out limitations — instead of publishing unverified ranking claims tied to affiliate commission volume.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Quality control</h3>
            <p className="mt-2 text-sm text-slate-700">Before updates ship, we check internal links, route consistency, and whether a page still supports a clear decision workflow. Pages are updated when assumptions, product constraints, or decision workflows materially change.</p>
          </article>
        </div>
      </section>

      {/* Editorial process section */}
      <section className="space-y-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Our content review process</h2>
        <p className="text-slate-700">
          Every article and comparison page on FinanceSphere goes through the same four-step review before publication and again before any major update.
        </p>
        <ol className="space-y-3 text-sm text-slate-700">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">1</span>
            <div>
              <strong className="text-slate-900">Scope pass:</strong> Define the target reader decision, identify the most common mistake, and confirm the content addresses a specific scenario rather than giving generic explanations.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">2</span>
            <div>
              <strong className="text-slate-900">Draft pass:</strong> Write guidance with specific thresholds, real-world examples with numbers, tradeoff tables, and a concrete next step. No generic wrap-up copy.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">3</span>
            <div>
              <strong className="text-slate-900">Accuracy &amp; disclosure review:</strong> Check factual framing, verify disclosure clarity, confirm affiliate relationships are labeled, and validate that limitations and risk notes are present.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">4</span>
            <div>
              <strong className="text-slate-900">Publication check:</strong> Verify route integrity, internal linking, and consistency with FinanceSphere trust and disclosure requirements before the page goes live.
            </div>
          </li>
        </ol>
      </section>

      {/* Why trust us section */}
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Why trust FinanceSphere?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900">Transparent about conflicts</p>
            <p className="text-sm text-slate-600">We disclose affiliate relationships clearly. Every comparison page links to how we make money and our editorial independence policy. Partners cannot buy rankings, suppress risk disclosures, or remove limitations.</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900">Decision-first, not product-first</p>
            <p className="text-sm text-slate-600">Every guide begins with a decision scenario, not a product feature list. We surface the failure mode before describing the solution — because knowing what goes wrong is usually more valuable than the ideal-case pitch.</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900">Educational scope, not advice</p>
            <p className="text-sm text-slate-600">FinanceSphere is explicitly educational. We model scenarios and explain trade-offs. We do not give personalized financial advice and clearly state when a professional — CPA, licensed advisor, attorney — should be consulted.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Editorial and commercial transparency</h2>
        <p className="text-slate-700">
          FinanceSphere may earn revenue from affiliate relationships, but our editorial standards are designed around user fit, downside risk, and clarity — not conversion-first copy.
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
