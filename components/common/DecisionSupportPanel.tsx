import { AppLink } from '@/components/ui/AppLink';

type LinkItem = {
  href: string;
  label: string;
};

type DecisionSupportPanelProps = {
  title: string;
  intro?: string;
  tone?: 'blue' | 'amber' | 'slate' | 'emerald';
  points?: Array<{ label: string; text: string }>;
  checklist?: string[];
  links?: LinkItem[];
};

const toneClasses: Record<NonNullable<DecisionSupportPanelProps['tone']>, string> = {
  blue: 'border-blue-200 bg-blue-50 dark:border-blue-500/40 dark:bg-blue-500/10',
  amber: 'border-amber-200 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10',
  slate: 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/70',
  emerald: 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10'
};

export function DecisionSupportPanel({ title, intro, tone = 'slate', points = [], checklist = [], links = [] }: DecisionSupportPanelProps) {
  return (
    <section className={`rounded-2xl border p-5 ${toneClasses[tone]}`}>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      {intro ? <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{intro}</p> : null}

      {points.length > 0 ? (
        <dl className="mt-3 space-y-2 text-sm">
          {points.map((item) => (
            <div key={item.label}>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">{item.label}</dt>
              <dd className="text-slate-700 dark:text-slate-300">{item.text}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {checklist.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {links.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {links.map((item) => (
            <AppLink key={item.href} href={item.href} variant="chip" className="border-slate-300 bg-white/85 text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200">
              {item.label}
            </AppLink>
          ))}
        </div>
      ) : null}
    </section>
  );
}
