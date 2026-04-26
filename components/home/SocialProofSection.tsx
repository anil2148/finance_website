const testimonials = [
  {
    quote: 'I finally saw the true monthly housing cost, not just the mortgage payment.',
    author: 'Avery P., Austin'
  },
  {
    quote: 'The downside simulation stopped me from overcommitting on a premium card.',
    author: 'Monica R., Seattle'
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

export function SocialProofSection() {
  return (
    <section className="grid gap-4 lg:grid-cols-3" aria-label="Trust building content">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 lg:col-span-2">
        <h2 className="text-xl font-semibold">Testimonials</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {testimonials.map((item) => (
            <blockquote key={item.author} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800">
              <p>“{item.quote}”</p>
              <footer className="mt-2 text-xs font-semibold text-slate-500">{item.author}</footer>
            </blockquote>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Platform trust</p>
        <p className="mt-2 text-3xl font-bold">128,400+</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">decisions analyzed</p>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 lg:col-span-3">
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
