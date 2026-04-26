import Link from 'next/link';

type PersonalizedDashboardPageProps = {
  searchParams?: {
    source?: string;
    goal?: string;
    income?: string;
    challenge?: string;
  };
};

export default function PersonalizedDashboardPage({ searchParams }: PersonalizedDashboardPageProps) {
  const goal = searchParams?.goal ?? 'your goal';
  const income = searchParams?.income ?? 'your income range';
  const challenge = searchParams?.challenge ?? 'your biggest challenge';
  const source = searchParams?.source ?? 'calculator';

  return (
    <main className="mx-auto max-w-3xl space-y-4 px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">FinanceSphere dashboard</p>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Your personalized dashboard is being prepared</h1>
      <p className="text-sm text-slate-700 dark:text-slate-300">
        We saved your funnel inputs and will use them to tailor weekly plans to your goals, income range, and biggest challenge.
      </p>
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
        <p className="font-semibold text-slate-900 dark:text-slate-100">Your captured context</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Source: {source}</li>
          <li>Goal: {goal}</li>
          <li>Monthly income range: {income}</li>
          <li>Biggest challenge: {challenge}</li>
        </ul>
      </div>
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-950/30 dark:text-indigo-200">
        <p className="font-semibold">What to expect each week</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>1 action to execute now</li>
          <li>1 scenario to pressure-test with your numbers</li>
          <li>1 mistake to avoid this week</li>
        </ul>
      </div>
      <Link href="/calculators" className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-600 dark:text-slate-100 dark:hover:border-indigo-400 dark:hover:text-indigo-300">
        Back to calculators
      </Link>
    </main>
  );
}
