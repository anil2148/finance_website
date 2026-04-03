'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const segmentLabelMap: Record<string, string> = {
  in: 'India',
  blog: 'Blog',
  calculators: 'Calculators',
  comparison: 'Comparisons',
  sip: 'SIP',
  fd: 'FD',
  ppf: 'PPF',
  elss: 'ELSS',
  emi: 'EMI',
  vs: 'vs',
  'sip-vs-fd': 'SIP vs FD',
  'ppf-vs-elss': 'PPF vs ELSS'
};

const toLabel = (segment: string) =>
  segment
    .split('-')
    .map((word) => segmentLabelMap[word.toLowerCase()] ?? (word[0]?.toUpperCase() + word.slice(1)))
    .join(' ')
    .replace(/^In$/, 'India');

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
        <li>
          <Link href="/" className="utility-link text-xs">Home</Link>
        </li>
        {isIndiaPath && (
          <li className="breadcrumb-item">
            <span aria-hidden="true" className="breadcrumb-separator">/</span>
            {segments.length === 1 ? (
              <span aria-current="page" className="breadcrumb-current">India</span>
            ) : (
              <Link href="/in" className="breadcrumb-link">India</Link>
            )}
          </li>
        )}
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;
          const label = toLabel(segment);

          return (
            <li key={href} className="flex items-center gap-2">
              <span aria-hidden="true" className="text-slate-400 dark:text-slate-500">›</span>
              {isLast ? (
                <span aria-current="page" className="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 font-semibold text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                  {label}
                </span>
              ) : (
                <Link href={href} className="utility-link text-xs">{label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
