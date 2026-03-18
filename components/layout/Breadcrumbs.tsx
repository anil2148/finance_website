'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const toLabel = (segment: string) =>
  segment
    
    .split('-')
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(' ');

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-xs text-slate-500 dark:text-slate-300">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-brand">Home</Link>
        </li>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;

          return (
            <li key={href} className="flex items-center gap-2">
              <span>/</span>
              {isLast ? <span className="font-medium text-slate-700 dark:text-white">{toLabel(segment)}</span> : <Link href={href} className="hover:text-brand">{toLabel(segment)}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
