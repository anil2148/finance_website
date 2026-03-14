export function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-slate-500">
        © {new Date().getFullYear()} FinanceSite. Educational content only.
      </div>
    </footer>
  );
}
