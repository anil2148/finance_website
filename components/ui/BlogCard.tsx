import Link from 'next/link';
import Image from 'next/image';
import { getBlogVisual } from '@/lib/blogVisuals';

export function BlogCard({ title, excerpt, slug, category = 'general' }: { title: string; excerpt: string; slug: string; category?: string }) {
  const visual = getBlogVisual(category);

  return (
    <article className="card flex h-full flex-col overflow-hidden p-0 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[16/10] w-full border-b border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/60 p-4">
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-4"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug text-slate-900">{title}</h3>
        <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">{excerpt}</p>
        <Link className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-brand hover:text-blue-700" href={`/blog/${slug}`}>
          Read article
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
