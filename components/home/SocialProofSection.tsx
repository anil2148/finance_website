'use client';

import { useRegion } from '@/components/providers/RegionProvider';
import { getTerm } from '@/lib/finance-terminology';

const testimonials = [
  {
    quote: 'I finally saw the true monthly housing cost, not just the mortgage payment.',
    author: 'Avery P., Austin',
    initials: 'AP'
  },
  {
    quote: 'The downside simulation stopped me from overcommitting on a premium card.',
    author: 'Monica R., Seattle',
    initials: 'MR'
  }
];

const caseStudies = [
  {
    title: 'Home purchase timing',
    outcome: 'Client delayed purchase 7 months, lowered debt ratio, and reduced payment-to-income by 11 points.'
  },
  {
    title: 'Debt acceleration plan',
    outcome: 'Scenario testing surfaced a higher-impact payoff order and cut projected interest by $9,400.'
  }
];

function getHueFromName(name: string) {
  let hash = 0;
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 31 + name.charCodeAt(index)) % 360;
  }
  return hash;
}

export function SocialProofSection() {
  const { region } = useRegion();
  const mortgageTerm = getTerm('mortgage', region);

  return (
    <section className="grid gap-4" aria-label="Trust building content">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Testimonials</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {testimonials.map((item) => (
            <blockquote key={item.author} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs tracking-wide text-amber-500" aria-label="5 star rating">★★★★★</p>
              <p>“{item.quote.replace('mortgage', mortgageTerm.toLowerCase())}”</p>
              <footer className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ backgroundColor: `hsl(${getHueFromName(item.author)}, 62%, 46%)` }}
                  aria-hidden="true"
                >
                  {item.initials}
                </span>
                <span>{item.author}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:border-emerald-800/50 dark:text-emerald-300">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 1.25l2.219 1.802 2.84.152 1.043 2.646 2.252 1.735-.776 2.736.776 2.736-2.252 1.735-1.043 2.646-2.84.152L10 18.75l-2.219-1.802-2.84-.152-1.043-2.646L1.646 12.415l.776-2.736-.776-2.736L3.898 5.21l1.043-2.646 2.84-.152L10 1.25zm3.03 7.28a.75.75 0 10-1.06-1.06L8.75 10.69 7.53 9.47a.75.75 0 00-1.06 1.06l1.75 1.75a.75.75 0 001.06 0l3.75-3.75z" clipRule="evenodd" />
                  </svg>
                  Verified user
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Case studies</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {caseStudies.map((study) => (
            <div key={study.title} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="text-sm font-semibold">{study.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{study.outcome}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
