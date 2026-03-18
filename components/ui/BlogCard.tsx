import Link from 'next/link';
import Image from 'next/image';
import { getBlogVisual } from '@/lib/blogVisuals';

export function BlogCard({ title, excerpt, slug, category = 'general' }: { title: string; excerpt: string; slug: string; category?: string }) {
  const visual = getBlogVisual(category);

  return (
    <article className="card overflow-hidden p-0">
      <div className="relative h-40 w-full">
        <Image src={visual.src} alt={visual.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" loading="lazy" />
      </div>
      <div className="p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-slate-600">{excerpt}</p>
      <Link className="mt-4 inline-block text-brand" href={`/blog/${slug}`}>Read article →</Link>
      </div>
    </article>
  );
}
