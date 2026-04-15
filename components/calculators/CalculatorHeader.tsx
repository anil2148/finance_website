import Link from 'next/link';

export function CalculatorHeader({
  title,
  description,
  eyebrow = 'FinanceSphere Decision System',
  ctaLabel = 'See all calculators',
  ctaHref = '/calculators',
}: {
  title: string;
  description: string;
  eyebrow?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <header className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-8 text-white shadow-xl">
      <p className="mb-2 text-xs uppercase tracking-[0.24em] text-cyan-100">{eyebrow}</p>
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm text-blue-50 sm:text-base">{description}</p>
      {ctaLabel ? (
        <Link className="mt-5 inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-medium hover:bg-white/30" href={ctaHref}>
          {ctaLabel}
        </Link>
      ) : null}
    </header>
  );
}
