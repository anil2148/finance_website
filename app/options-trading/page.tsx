import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { FAQAccordion, JumpNav, ResourceGrid, TrustBar } from '@/components/hubs/PillarPageSections';

export const metadata: Metadata = {
  title: 'Options Trading Explained: Basics, Strategies, Risks, and Platforms | FinanceSphere',
  description:
    'Learn options trading fundamentals in plain English, review common strategies and risks, and compare platform considerations before placing your first options trade.',
  alternates: {
    canonical: '/options-trading'
  }
};

const jumpLinks = [
  { href: '#what-is-options', label: 'What is options trading' },
  { href: '#calls-puts', label: 'How call and put options work' },
  { href: '#strategies', label: 'Common strategies' },
  { href: '#risks', label: 'Risks and terminology' },
  { href: '#platforms', label: 'Best platforms and tools' },
  { href: '#faq', label: 'FAQs' },
  { href: '#related', label: 'Related resources' }
];

const optionBasics = [
  {
    term: 'Call option',
    meaning: 'A contract that gives the buyer the right (not obligation) to buy shares at a strike price before expiration.'
  },
  {
    term: 'Put option',
    meaning: 'A contract that gives the buyer the right (not obligation) to sell shares at a strike price before expiration.'
  },
  {
    term: 'Strike price',
    meaning: 'The pre-set price where the option can be exercised.'
  },
  {
    term: 'Premium',
    meaning: 'The upfront price paid (or received) for the option contract.'
  },
  {
    term: 'Expiration',
    meaning: 'The date after which the contract no longer exists.'
  },
  {
    term: 'In the money / out of the money',
    meaning: 'Describes whether exercising the option is currently favorable based on market price versus strike.'
  },
  {
    term: 'Assignment / exercise',
    meaning: 'Exercise means using the contract right. Assignment means the seller must fulfill that obligation.'
  }
];

const strategies = [
  {
    name: 'Covered calls',
    what: 'Selling call options against shares you already own.',
    when: 'Used to generate income on stock positions with neutral-to-moderate upside expectations.',
    risk: 'You may have shares called away if price rises above strike.',
    level: 'Beginner to intermediate'
  },
  {
    name: 'Cash-secured puts',
    what: 'Selling put options while keeping enough cash to buy shares if assigned.',
    when: 'Used when willing to own a stock at a lower effective purchase price.',
    risk: 'Stock can drop sharply, creating unrealized losses after assignment.',
    level: 'Beginner to intermediate'
  },
  {
    name: 'Long calls',
    what: 'Buying calls to gain upside exposure with limited premium risk.',
    when: 'Used for bullish directional views with a defined loss cap.',
    risk: 'Entire premium can expire worthless.',
    level: 'Beginner'
  },
  {
    name: 'Long puts',
    what: 'Buying puts to hedge downside or speculate on price declines.',
    when: 'Used for bearish views or to protect stock holdings.',
    risk: 'Time decay can erode value quickly if move does not happen in time.',
    level: 'Beginner'
  },
  {
    name: 'Vertical spreads',
    what: 'Combining long and short options at different strikes in same expiration.',
    when: 'Used to define max profit/loss and reduce net premium cost.',
    risk: 'Profit is capped; incorrect strike selection can limit edge.',
    level: 'Intermediate'
  },
  {
    name: 'Protective puts',
    what: 'Buying puts against existing stock to create downside insurance.',
    when: 'Used to protect gains during uncertain or volatile periods.',
    risk: 'Ongoing hedge cost can reduce portfolio returns over time.',
    level: 'Beginner to intermediate'
  }
];

const faqs = [
  {
    question: 'What is options trading?',
    answer:
      'Options trading involves contracts tied to an underlying asset. These contracts can be used for speculation, hedging, or income strategies depending on your objective and risk tolerance.'
  },
  {
    question: 'Is options trading risky?',
    answer:
      'Yes. Options include leverage, expiration pressure, and strategy-specific risks. Some approaches have defined risk, while others can involve significant or theoretically unlimited risk.'
  },
  {
    question: 'What is the difference between calls and puts?',
    answer:
      'Calls generally benefit from upward price movement. Puts generally benefit from downward price movement or can hedge long stock positions.'
  },
  {
    question: 'What is the safest options strategy for beginners?',
    answer:
      'No strategy is risk-free, but defined-risk approaches such as long calls, long puts, or carefully structured covered calls are commonly used as early learning paths.'
  },
  {
    question: 'What platform is best for options trading?',
    answer:
      'The best platform depends on your level: beginners may value education and trade guardrails, while advanced traders may prioritize analytics depth, order routing, and chain tooling.'
  },
  {
    question: 'Can I lose more than my initial investment?',
    answer:
      'With some strategies, yes. Option buyers typically risk the premium paid, while certain option-selling strategies can create losses beyond initial premium received.'
  }
];

export default function OptionsTradingPillarPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <article className="space-y-10">
      <header className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 p-8 text-white md:p-10">
        <div className="grid gap-6 md:grid-cols-[1.25fr_1fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">Options education hub</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">Options Trading Explained: Learn the Basics, Risks, and Platform Fit</h1>
            <p className="mt-4 max-w-3xl text-base text-slate-100 md:text-lg">
              Understand how calls and puts work, when common strategies are used, and what to evaluate in an options-capable platform before you trade real capital.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#calls-puts" className="btn-primary">Learn the Basics</a>
              <Link href="/comparison?category=investment_app" className="inline-flex items-center justify-center rounded-xl border border-indigo-200 px-4 py-2 font-medium text-white transition hover:bg-white/10">
                Compare Platforms
              </Link>
            </div>
          </div>
          <div className="relative h-52 overflow-hidden rounded-2xl border border-white/20">
            <Image
              src="/images/options-trading-illustration.svg"
              alt="Options trading illustration with strike chart, risk controls, and analytical dashboard elements"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </header>

      <TrustBar
        updatedAt="March 18, 2026"
        disclaimer="FinanceSphere may earn compensation from partner links; education-first content is written independently."
        methodologyAnchor="#platforms"
      />

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Educational disclaimer</p>
        <p className="mt-1">This page is for educational purposes only and is not individualized investment advice. Options are complex and not suitable for every investor.</p>
      </div>

      <JumpNav links={jumpLinks} />

      <section id="what-is-options" className="space-y-4">
        <h2 className="text-2xl font-bold">What is options trading?</h2>
        <p className="text-slate-700">
          Options trading uses contracts based on an underlying asset (like a stock or ETF). Each contract has a strike price and expiration date. Traders use options to express directional views, manage risk on stock holdings, or generate income.
        </p>
        <p className="text-slate-700">
          In plain English: options are tools with expiration and pricing dynamics that can amplify outcomes—for better or worse. They demand more planning than simply buying and holding shares.
        </p>
      </section>

      <section id="calls-puts" className="space-y-4">
        <h2 className="text-2xl font-bold">How call and put options work</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {optionBasics.map((basic) => (
            <article key={basic.term} className="card">
              <h3 className="text-lg font-semibold">{basic.term}</h3>
              <p className="mt-2 text-sm text-slate-600">{basic.meaning}</p>
            </article>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Simple example</p>
          <p className="mt-2">
            If a stock trades at $100 and you buy a $105 call expiring next month, your contract gains intrinsic value only if the stock rises above $105 before expiration. If it stays below, the option can expire worthless and you lose the premium paid.
          </p>
        </div>
      </section>

      <section id="strategies" className="space-y-4">
        <h2 className="text-2xl font-bold">Common options strategies</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {strategies.map((strategy) => (
            <article key={strategy.name} className="card">
              <h3 className="text-lg font-semibold">{strategy.name}</h3>
              <dl className="mt-3 space-y-2 text-sm text-slate-700">
                <div>
                  <dt className="font-semibold">What it is</dt>
                  <dd>{strategy.what}</dd>
                </div>
                <div>
                  <dt className="font-semibold">When people use it</dt>
                  <dd>{strategy.when}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Main risk</dt>
                  <dd>{strategy.risk}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Skill level</dt>
                  <dd>{strategy.level}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section id="risks" className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50 p-6">
        <h2 className="text-2xl font-bold text-rose-950">Risk warning and suitability</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-rose-900">
          <li>Options include leverage and time decay, which can accelerate losses.</li>
          <li>Complex multi-leg strategies can have assignment and liquidity risks.</li>
          <li>Not all accounts are approved for all options levels or spread strategies.</li>
          <li>Always understand max loss, breakeven, and exit plan before entering a trade.</li>
        </ul>
        <p className="text-sm text-rose-900">If you are new to options, build a paper-trading or small-position practice period before risking significant capital.</p>
      </section>

      <section id="platforms" className="space-y-4">
        <h2 className="text-2xl font-bold">Best platforms and tools for options traders</h2>
        <p className="text-slate-700">FinanceSphere&rsquo;s investment app comparison can help you identify options-capable platforms by your needs and experience level.</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            'Best for beginners: platforms with guided order tickets and risk education',
            'Best for analytics: robust chains, Greeks visibility, and spread builders',
            'Best for mobile: fast, stable execution and clear order confirmation',
            'Best for low-cost trading: competitive contract fees and transparent margin rates'
          ].map((useCase) => (
            <div key={useCase} className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">{useCase}</div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/comparison?category=investment_app" className="btn-primary">Compare investment platforms</Link>
          <Link href="/best-investment-apps" className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 font-medium text-slate-800 transition hover:bg-slate-100">
            View curated picks
          </Link>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-bold">Suggested learning path for beginners</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>Start with call/put mechanics and order ticket basics.</li>
          <li>Learn risk terms (max loss, assignment, theta decay, liquidity).</li>
          <li>Practice one defined-risk strategy before adding complexity.</li>
          <li>Compare brokers for education quality, risk controls, and total fees.</li>
        </ol>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/blog/investing-for-beginners-roadmap" className="rounded-full border border-slate-300 px-3 py-1 hover:bg-slate-100">Investing roadmap</Link>
          <Link href="/blog/tax-efficient-investing-playbook" className="rounded-full border border-slate-300 px-3 py-1 hover:bg-slate-100">Tax-efficient investing playbook</Link>
          <Link href="/best-investment-apps" className="rounded-full border border-slate-300 px-3 py-1 hover:bg-slate-100">Compare options-ready apps</Link>
        </div>
      </section>

      <section id="faq" className="space-y-4">
        <h2 className="text-2xl font-bold">Options trading FAQ</h2>
        <FAQAccordion items={faqs} />
      </section>

      <section id="related" className="space-y-4">
        <h2 className="text-2xl font-bold">Related resources</h2>
        <ResourceGrid
          resources={[
            {
              href: '/best-investment-apps',
              title: 'Best Investment Apps',
              description: 'Review platform fit, pricing cues, and product-level highlights.',
              tag: 'Comparison'
            },
            {
              href: '/investing-apps',
              title: 'Investing Apps Hub',
              description: 'Learn how to choose an investing app by goal, fees, and experience.',
              tag: 'Hub'
            },
            {
              href: '/investment-growth-calculator',
              title: 'Investment Growth Calculator',
              description: 'Project outcomes under different return and contribution assumptions.',
              tag: 'Calculator'
            },
            {
              href: '/retirement-calculator',
              title: 'Retirement Calculator',
              description: 'Use long-term planning assumptions before adding options risk.',
              tag: 'Calculator'
            },
            {
              href: '/blog/investing-for-beginners-roadmap',
              title: 'Beginner Investing Roadmap',
              description: 'Evaluate setup decisions, permissions, and fee disclosures.',
              tag: 'Guide'
            },
            {
              href: '/financial-disclaimer',
              title: 'Financial Disclaimer',
              description: 'Review FinanceSphere&rsquo;s educational and editorial boundaries.',
              tag: 'Policy'
            }
          ]}
        />
      </section>

      <section className="rounded-3xl bg-slate-900 p-8 text-white">
        <h2 className="text-2xl font-bold">Before you trade options, build your framework.</h2>
        <p className="mt-2 max-w-2xl text-slate-200">Compare platform tools, test assumptions in calculators, and commit to a repeatable risk process before scaling any strategy.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/comparison?category=investment_app" className="btn-primary">Compare platforms</Link>
          <Link href="/investment-growth-calculator" className="inline-flex items-center justify-center rounded-xl border border-slate-500 px-4 py-2 font-medium text-white transition hover:bg-slate-800">
            Explore tools
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </article>
  );
}
