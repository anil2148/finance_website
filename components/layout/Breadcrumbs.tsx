'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const breadcrumbLabelMap: Record<string, string> = {
  in: 'India',
  blog: 'Blog',
  ppf: 'PPF',
  elss: 'ELSS',
  sip: 'SIP',
  fd: 'FD',
  emi: 'EMI',
  faq: 'FAQ',
  usa: 'USA',
  us: 'US'
};

const toLabel = (segment: string) =>
  segment
    .split('-')
    .map((word) => {
      const normalized = word.trim().toLowerCase();
      if (!normalized) return '';
      if (breadcrumbLabelMap[normalized]) return breadcrumbLabelMap[normalized];
      return normalized[0].toUpperCase() + normalized.slice(1);
    })
    .join(' ');

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const isIndiaPath = pathname.startsWith('/in');
  const homeHref = '/';
  const homeLabel = 'Home';

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="breadcrumb-shell">
        <li>
          {segments.length === 0 ? (
            <span aria-current="page" className="breadcrumb-current">{homeLabel}</span>
          ) : (
            <Link href={homeHref} className="breadcrumb-link">{homeLabel}</Link>
          )}
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
          const shouldSkip = isIndiaPath && segment === 'in';
          if (shouldSkip) return null;

          return (
            <li key={href} className="breadcrumb-item">
              <span aria-hidden="true" className="breadcrumb-separator">/</span>
              {isLast ? <span aria-current="page" className="breadcrumb-current">{toLabel(segment)}</span> : <Link href={href} className="breadcrumb-link">{toLabel(segment)}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
