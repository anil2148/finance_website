import { AppLink } from '@/components/ui/AppLink';

export function IndiaAuthorityNote() {
  return (
    <aside className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-sm text-slate-700 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-slate-200">
      <p className="font-semibold text-slate-900 dark:text-slate-100">Updated for FY 2025–26 India</p>
      <p className="mt-2">
        Written by Anil Chowdhary — Lead Software Engineer building data-driven finance tools.
      </p>
      <p className="mt-2 text-xs">
        References: <AppLink variant="editorial" href="https://www.rbi.org.in/" target="_blank" rel="noreferrer">Reserve Bank of India (RBI)</AppLink> and{' '}
        <AppLink variant="editorial" href="https://incometaxindia.gov.in/" target="_blank" rel="noreferrer">Income Tax Department India</AppLink>.
      </p>
    </aside>
  );
}
