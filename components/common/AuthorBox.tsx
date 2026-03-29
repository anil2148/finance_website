import Link from 'next/link';

export default function AuthorBox({ className = 'mt-8' }: { className?: string }) {
  return (
    <section className={`${className} rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900`}>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Written by Anil Chowdhary</h2>

      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
        Lead Software Engineer with 13+ years of experience building data-driven decision systems and practical finance tools.
      </p>

      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
        FinanceSphere exists to help people make money decisions using real numbers, scenario testing, and transparent frameworks you can verify before you act.
      </p>

      <div className="mt-3 flex gap-3 text-xs">
        <Link href="/about" className="text-blue-600 hover:underline">About</Link>
        <Link href="/editorial-policy" className="text-blue-600 hover:underline">Editorial Policy</Link>
        <Link href="/contact" className="text-blue-600 hover:underline">Contact</Link>
      </div>
    </section>
  );
}
