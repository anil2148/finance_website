type HumanJudgmentCalloutProps = {
  children: string;
  className?: string;
};

/**
 * HumanJudgmentCallout — renders a memorable human judgment line as an
 * editorial insight callout. Use one per page, naturally integrated into
 * the copy. Keep the text calm, experienced, and practical.
 */
export function HumanJudgmentCallout({ children, className = '' }: HumanJudgmentCalloutProps) {
  return (
    <aside
      className={`rounded-xl border-l-4 border-blue-400 bg-blue-50/60 px-5 py-3 dark:border-blue-400/60 dark:bg-blue-500/10 ${className}`}
      aria-label="Editorial insight"
    >
      <p className="text-sm font-medium italic leading-relaxed text-slate-800 dark:text-slate-200">
        {children}
      </p>
    </aside>
  );
}
