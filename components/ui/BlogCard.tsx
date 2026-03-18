import Link from 'next/link';
import Image from 'next/image';
import { getBlogVisual } from '@/lib/blogVisuals';

function hashNumber(value: string) {
  return [...value].reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
}

const imagePositions = ['center', 'left center', 'right center'] as const;

const categoryKickers: Record<string, string> = {
  investing: 'Portfolio decisions',
  loans: 'Borrowing decisions',
  mortgages: 'Home-financing decisions',
  'credit-cards': 'Credit strategy',
  'savings-accounts': 'Cash-management decisions',
  budgeting: 'Spending system design',
  tax: 'Tax-impact planning'
};

const readCtas = ['Read article', 'Open guide', 'See full breakdown'] as const;

export function BlogCard({ title, excerpt, slug, category = 'general' }: { title: string; excerpt: string; slug: string; category?: string }) {
  const visual = getBlogVisual(category, slug);
  const visualPosition = imagePositions[Math.abs(hashNumber(slug)) % imagePositions.length];
  const readCta = readCtas[Math.abs(hashNumber(`${slug}-cta`)) % readCtas.length];
  const kicker = categoryKickers[category] ?? 'Money decisions';

  return (
    <article className="card flex h-full flex-col overflow-hidden p-0 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className={`relative aspect-[16/10] w-full border-b border-slate-100 bg-gradient-to-br ${visual.cardClassName} p-3`}>
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover p-3 sm:p-4"
          style={{ objectPosition: visualPosition }}
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{category.replace(/-/g, ' ')}</p>
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{kicker}</p>
        <h3 className="mt-1 text-lg font-semibold leading-snug text-slate-900 line-clamp-3">{title}</h3>
        <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">{excerpt}</p>
        <Link className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-brand hover:text-blue-700" href={`/blog/${slug}`}>
          {readCta}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
