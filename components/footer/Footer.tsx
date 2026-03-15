export function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-2 px-4 py-6 text-sm text-slate-500 dark:text-slate-300">
        <p>© {new Date().getFullYear()} FinanceSphere. Educational content only.</p>
        <p>FinanceSphere may receive compensation from partners when users click or apply for financial products.</p>
      </div>
    </footer>
  );
}
