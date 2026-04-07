import Link from 'next/link';
import { AUTHOR_PROFILES, PRIMARY_AUTHOR_ID } from '@/lib/authors';

export default function AuthorBox({ className = 'mt-8' }: { className?: string }) {
  const author = AUTHOR_PROFILES[PRIMARY_AUTHOR_ID];

  return (
    <section className={`${className} rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900`}>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{author.name} — {author.role}</h2>

      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
        {author.description}
      </p>

      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
        {author.bio}
      </p>

      <div className="mt-3 flex gap-3 text-xs">
        <Link href="/about" className="text-blue-600 hover:underline">About</Link>
        <Link href="/editorial-policy" className="text-blue-600 hover:underline">Editorial Policy</Link>
        <Link href="/contact" className="text-blue-600 hover:underline">Contact</Link>
      </div>
    </section>
  );
}
