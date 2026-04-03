import { AppLink } from '@/components/ui/AppLink';
import { AUTHOR_PROFILES, EDITORIAL_REVIEWER_ID, PRIMARY_AUTHOR_ID } from '@/lib/authors';

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
  const author = AUTHOR_PROFILES[authorId] ?? AUTHOR_PROFILES[PRIMARY_AUTHOR_ID];
  const reviewer = AUTHOR_PROFILES[reviewedById] ?? AUTHOR_PROFILES[EDITORIAL_REVIEWER_ID];
  const safeUpdatedAt = getSafeUpdatedAt(updatedAt);

  return (
    <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
      <p className="font-semibold text-slate-900">Editorial trust & transparency</p>
      <div className="mt-3 space-y-3">
        <div>
          <p>
            <span className="font-semibold">Written by:</span> {author?.name} — {author?.role}
          </p>
          {author?.description ? <p className="text-xs text-slate-600">{author.description}</p> : null}
          {author?.experience ? <p className="text-xs text-slate-600">{author.experience}</p> : null}
          {author?.philosophy ? <p className="text-xs text-slate-600">Decision philosophy: {author.philosophy}</p> : null}
          <p className="text-xs text-slate-600">{author?.bio}</p>
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

        <div className="space-y-1 text-xs text-slate-600">
          <p><span className="font-semibold text-slate-800">How we evaluate products:</span> cost-to-value math, downside resilience, and usability under stress.</p>
          <p><span className="font-semibold text-slate-800">Data sources used:</span> provider disclosures, fee schedules, public rate sheets, and FinanceSphere scenario modeling assumptions.</p>
          <p><span className="font-semibold text-slate-800">Last reviewed logic:</span> content is re-reviewed after material fee, eligibility, or policy changes and during scheduled editorial refreshes.</p>
        </div>

        <p className="text-xs text-slate-600">
          FinanceSphere content is educational and does not constitute personalized financial advice.
          <AppLink href="/financial-disclaimer" className="ml-1">Read disclaimer</AppLink>
        </p>

        <div className="flex flex-wrap gap-2 text-xs">
          <AppLink href="/editorial-policy" variant="chip" className="bg-white px-2 py-1">Editorial policy</AppLink>
          <AppLink href="/how-we-make-money" variant="chip" className="bg-white px-2 py-1">How we make money</AppLink>
        </div>
      </div>
    </aside>
  );
}
