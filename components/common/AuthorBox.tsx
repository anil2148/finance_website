import Link from 'next/link';
import { AUTHOR_PROFILES, PRIMARY_AUTHOR_ID } from '@/lib/authors';

export default function AuthorBox({ className = 'mt-8' }: { className?: string }) {
  const author = AUTHOR_PROFILES[PRIMARY_AUTHOR_ID];

  return (
    <section className={`${className} rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900`} aria-label="About the author">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {author.profileUrl ? (
              <Link href={author.profileUrl} className="text-lg font-semibold text-slate-900 hover:text-blue-700 hover:underline dark:text-white dark:hover:text-blue-400">
                {author.name}
              </Link>
            ) : (
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{author.name}</h2>
            )}
            <span className="text-sm text-slate-500 dark:text-slate-400">— {author.role}</span>
          </div>

          {author.yearsOfExperience ? (
            <p className="mt-1 text-xs font-medium text-blue-700 dark:text-blue-300">
              {author.yearsOfExperience}+ years in consumer finance systems & research
            </p>
          ) : null}

          {author.credentials && author.credentials.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {author.credentials.map((cred) => (
                <span key={cred} className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200">
                  {cred}
                </span>
              ))}
            </div>
          ) : null}

          {author.expertise && author.expertise.length > 0 ? (
            <div className="mt-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Covers</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {author.expertise.map((area) => (
                  <span key={area} className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{author.bio}</p>

          {author.philosophy ? (
            <p className="mt-2 text-xs italic text-slate-500 dark:text-slate-400">&ldquo;{author.philosophy}&rdquo;</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-200 pt-3 text-xs dark:border-slate-700">
        <Link href={author.profileUrl ?? '/about'} className="font-medium text-blue-600 hover:underline dark:text-blue-400">About {author.name?.split(' ')[0] ?? 'Author'} &amp; FinanceSphere</Link>
        <Link href="/editorial-policy" className="font-medium text-blue-600 hover:underline dark:text-blue-400">Editorial Policy</Link>
        <Link href="/how-we-make-money" className="font-medium text-blue-600 hover:underline dark:text-blue-400">How we make money</Link>
        <Link href="/contact" className="font-medium text-blue-600 hover:underline dark:text-blue-400">Contact</Link>
      </div>
    </section>
  );
}
