export default function AuthorBox() {
  return (
    <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">About the author</h3>

      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
        Written by <strong>Anil Chowdhary</strong>, a Lead Software Engineer with 13+ years of experience building scalable systems and data-driven platforms.
      </p>

      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
        FinanceSphere is built to simplify complex financial decisions using real numbers, scenario analysis, and practical frameworks — not generic advice.
      </p>

      <div className="mt-3 flex gap-3 text-xs">
        <a href="/about" className="text-blue-600 hover:underline">About</a>
        <a href="/editorial-policy" className="text-blue-600 hover:underline">Editorial Policy</a>
        <a href="/contact" className="text-blue-600 hover:underline">Contact</a>
      </div>
    </div>
  );
}
