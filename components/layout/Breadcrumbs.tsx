'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const breadcrumbLabelMap: Record<string, string> = {
  in: 'India',
  us: 'US',
  blog: 'Blog',
  calculators: 'Calculators',
  comparison: 'Comparisons',
  investing: 'Investing',
  savings: 'Savings',
  tax: 'Tax',
  loans: 'Loans',
  sip: 'SIP',
  fd: 'FD',
  ppf: 'PPF',
  elss: 'ELSS',
  emi: 'EMI',
  vs: 'vs',
  'sip-vs-fd': 'SIP vs FD',
  'ppf-vs-elss': 'PPF vs ELSS'
};

const toLabel = (segment: string) => {
  const normalized = segment.toLowerCase();
  if (breadcrumbLabelMap[normalized]) return breadcrumbLabelMap[normalized];

  return segment
    .split('-')
    .map((word) => breadcrumbLabelMap[word.toLowerCase()] ?? `${word[0]?.toUpperCase() ?? ''}${word.slice(1)}`)
    .join(' ')
    .replace(/^In$/, 'India');
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const isIndiaPath = segments[0] === 'in';
  const visibleSegments = isIndiaPath ? segments.slice(1) : segments;

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="breadcrumb-shell">
        <li>
          <Link href="/" className="breadcrumb-link">Home</Link>
        </li>
        {isIndiaPath && (
          <li className="breadcrumb-item">
            <span aria-hidden="true" className="breadcrumb-separator">/</span>
            {visibleSegments.length === 0 ? (
              <span aria-current="page" className="breadcrumb-current">India</span>
            ) : (
              <Link href="/in" className="breadcrumb-link">India</Link>
            )}
          </li>
        )}
        {visibleSegments.map((segment, index) => {
          const prefix = isIndiaPath ? '/in' : '';
          const href = `${prefix}/${visibleSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === visibleSegments.length - 1;
          const label = toLabel(segment);

          return (
            <li key={href} className="breadcrumb-item">
              <span aria-hidden="true" className="breadcrumb-separator">&gt;</span>
              {isLast ? (
                <span aria-current="page" className="breadcrumb-current">
                  {label}
                </span>
              ) : (
                <Link href={href} className="breadcrumb-link">{label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
