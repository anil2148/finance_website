import { AppLink } from '@/components/ui/AppLink';

export function LegalPageLayout({
  title,
  description,
  lastUpdated,
  children
}: {
  title: string;
  description: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10 dark:border-slate-700 dark:bg-slate-900">
      <header className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-700">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">FinanceSphere Legal</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
        <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">Last Updated: {lastUpdated}</p>
      </header>

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 dark:prose-invert">{children}</div>

      <footer className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
        Questions about this page? Contact us at{' '}
        <a className="utility-link font-semibold" href="mailto:support@financesphere.io">
          support@financesphere.io
        </a>{' '}
        or visit our <AppLink className="font-semibold" href="/contact">Contact page</AppLink>.
      </footer>
    </article>
  );
}
