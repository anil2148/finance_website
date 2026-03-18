import Link from 'next/link';
import { AUTHOR_PROFILES } from '@/lib/authors';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function getSafeUpdatedAt(updatedAt: string) {
  const parsedDate = new Date(updatedAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (parsedDate > today) {
    return null;
  }

  return parsedDate.toISOString();
}

export function ArticleTrustPanel({ authorId, reviewedById, updatedAt }: { authorId: string; reviewedById: string; updatedAt: string }) {
  const author = AUTHOR_PROFILES[authorId];
  const reviewer = AUTHOR_PROFILES[reviewedById];
  const safeUpdatedAt = getSafeUpdatedAt(updatedAt);

  return (
    <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
      <p className="font-semibold text-slate-900">Editorial trust & transparency</p>
      <div className="mt-3 space-y-3">
        <div>
          <p>
            <span className="font-semibold">Written by:</span> {author?.name} — {author?.role}
          </p>
          <p className="text-xs text-slate-600">Credentials: {author?.credentials.join(' • ')}</p>
        </div>

        <div>
          <p>
            <span className="font-semibold">Reviewed by:</span> {reviewer?.name}
          </p>
          <p className="text-xs text-slate-600">Fact-check and compliance review completed before publication updates.</p>
        </div>

        {safeUpdatedAt ? (
          <p>
            <span className="font-semibold">Last updated:</span> {formatDate(safeUpdatedAt)}
          </p>
        ) : null}

        <p className="text-xs text-slate-600">
          FinanceSphere content is educational and does not constitute personalized financial advice.
          <Link href="/financial-disclaimer" className="ml-1 text-brand underline">Read disclaimer</Link>
        </p>

        <div className="flex flex-wrap gap-2 text-xs">
          <Link href="/editorial-policy" className="rounded-full border bg-white px-2 py-1">Editorial policy</Link>
          <Link href="/how-we-make-money" className="rounded-full border bg-white px-2 py-1">How we make money</Link>
        </div>
      </div>
    </aside>
  );
}
