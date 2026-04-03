'use client';

import { usePathname } from 'next/navigation';
import { AppLink } from '@/components/ui/AppLink';

type BreadcrumbsProps = {
  labelMap?: Record<string, string>;
};

const breadcrumbLabelMap: Record<string, string> = {
  in: 'India',
  us: 'US',
  blog: 'Blog',
  calculators: 'Calculators',
  comparison: 'Comparison',
  compare: 'Compare',
  investing: 'Investing',
  savings: 'Savings',
  tax: 'Tax',
  loans: 'Loans',
  credit: 'Credit',
  cards: 'Cards',
  tools: 'Tools',
  learn: 'Learn',
  help: 'Help',
  contact: 'Contact',
  sip: 'SIP',
  fd: 'FD',
  ppf: 'PPF',
  elss: 'ELSS',
  emi: 'EMI',
  apr: 'APR',
  hysa: 'HYSA',
  roth: 'Roth',
  ira: 'IRA',
  cd: 'CD',
  k: 'K',
  vs: 'vs',
  'sip-vs-fd': 'SIP vs FD',
  'ppf-vs-elss': 'PPF vs ELSS',
  'fixed-deposit-vs-sip-india': 'Fixed Deposit vs SIP',
  'old-vs-new-tax-regime': 'Old vs New Tax Regime',
  'tax-slabs-2026-india': 'Tax Slabs 2026',
  'best-savings-accounts-india': 'Best Savings Accounts',
  'best-fixed-deposits-india': 'Best Fixed Deposits',
  'home-loan-interest-rates-india': 'Home Loan Interest Rates',
  'personal-loan-comparison-india': 'Personal Loan Comparison'
};

const toTitleCaseWord = (word: string, labelMap: Record<string, string>) => {
  const normalizedWord = word.toLowerCase();
  if (labelMap[normalizedWord]) return labelMap[normalizedWord];
  if (!word) return '';
  return `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`;
};

const formatSegmentLabel = (segment: string, labelMap: Record<string, string>) => {
  const cleanSegment = decodeURIComponent(segment.replace(/^\/|\/$/g, '').trim());
  const normalized = cleanSegment.toLowerCase();

  if (labelMap[normalized]) return labelMap[normalized];

  return cleanSegment
    .split(/[-_]+/)
    .map((word) => toTitleCaseWord(word, labelMap))
    .join(' ');
};

export function Breadcrumbs({ labelMap = breadcrumbLabelMap }: BreadcrumbsProps) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
      <ol className="breadcrumb-shell">
        <li className="breadcrumb-item">
          <AppLink href="/" variant="breadcrumb">Home</AppLink>
        </li>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;
          const label = formatSegmentLabel(segment, labelMap);

          return (
            <li key={href} className="breadcrumb-item">
              <span aria-hidden="true" className="breadcrumb-separator">&gt;</span>
              {isLast ? (
                <span aria-current="page" className="breadcrumb-current">{label}</span>
              ) : (
                <AppLink href={href} variant="breadcrumb">{label}</AppLink>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
