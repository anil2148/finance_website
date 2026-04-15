import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { AUTHOR_PROFILES, PRIMARY_AUTHOR_ID } from '@/lib/authors';

export const metadata: Metadata = {
  title: 'About FinanceSphere | Decision-First Personal Finance Tools',
  description:
    'Learn who runs FinanceSphere, how our methodology works, and how our editorial policy supports transparent financial education.',
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
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">About FinanceSphere</h1>
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

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Who runs FinanceSphere</h2>
        <p className="text-slate-700">
          <strong>{author.name}</strong> manages the research, drafting, and review process across calculators, comparisons, and guides.
        </p>
        <p className="text-slate-700">{author.bio}</p>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Methodology</h2>
        <p className="text-slate-700">
          {author.methodology}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Calculators</h3>
            <p className="mt-2 text-sm text-slate-700">We prioritize transparent assumptions and editable inputs so readers can test decisions before committing.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Comparisons & guides</h3>
            <p className="mt-2 text-sm text-slate-700">We evaluate trade-offs, downside risk, and fit rather than publishing marketing-led rankings.</p>
          </article>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Trust + editorial policy</h2>
        <p className="text-slate-700">
          FinanceSphere is educational and does not provide personalized financial, legal, or tax advice. We disclose affiliate relationships and keep editorial criteria independent of partner compensation.
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700" href="/editorial-policy">Editorial policy</Link>
          <Link className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700" href="/affiliate-disclosure">Affiliate disclosure</Link>
          <Link className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700" href="/how-we-make-money">How we make money</Link>
          <Link className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700" href="/financial-disclaimer">Financial disclaimer</Link>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Contact</h2>
        <p className="text-slate-700">
          For feedback, corrections, or partnership questions:
          <br />
          📧 <a className="font-semibold text-blue-700 hover:underline" href="mailto:support@financesphere.io">support@financesphere.io</a>
        </p>
      </section>
    </article>
  );
}
