'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LazyVisible } from '@/components/common/LazyVisible';
import { CalculatorHeader } from '@/components/calculators/CalculatorHeader';
import { InputSlider } from '@/components/calculators/InputSlider';
import { ResultCard } from '@/components/calculators/ResultCard';
import { usePreferences } from '@/components/providers/PreferenceProvider';
import { DownloadPdfButton } from '@/components/pdf/DownloadPdfButton';
import { ExportCsvButton } from '@/components/calculators/ExportCsvButton';
import { calculatorDefinitions, calculatorMap } from '@/lib/calculators/registry';
import { SocialShareButtons } from '@/components/ui/SocialShareButtons';
import { BaseCalculatorInputs } from '@/lib/calculators/types';
import { getCurrencySymbol, getLocaleForCurrency, resolveCurrencyPrefix } from '@/lib/utils';

const ProjectionChart = dynamic(() => import('@/components/calculators/ProjectionChart').then((module) => module.ProjectionChart), {
  ssr: false,
  loading: () => <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
});

const fieldMeta: Array<{ key: keyof BaseCalculatorInputs; label: string; tooltip: string; min: number; max: number; step?: number; prefix?: string; suffix?: string }> = [
  { key: 'loanAmount', label: 'Loan Amount / Starting Balance', tooltip: 'Starting principal, debt, or investment amount.', min: 1000, max: 2000000, step: 500, prefix: '$' },
  { key: 'interestRate', label: 'Interest Rate', tooltip: 'APR for loans or liabilities.', min: 0, max: 35, step: 0.1, suffix: '%' },
  { key: 'monthlyContribution', label: 'Monthly Contribution', tooltip: 'Extra monthly payment or investment contribution.', min: 0, max: 25000, step: 25, prefix: '$' },
  { key: 'years', label: 'Years', tooltip: 'Projection horizon in years.', min: 1, max: 50, step: 1, suffix: 'y' },
  { key: 'inflationRate', label: 'Inflation Rate', tooltip: 'Expected annual inflation for purchasing power adjustment.', min: 0, max: 10, step: 0.1, suffix: '%' },
  { key: 'expectedReturn', label: 'Expected Return', tooltip: 'Projected annual investment return.', min: 0, max: 20, step: 0.1, suffix: '%' }
];

export function CalculatorLayout({ slug }: { slug: string }) {
  const definition = calculatorMap[slug];
  const [inputs, setInputs] = useState(definition.defaultInputs);
  const { currency, formatCurrency, isRatesLoading } = usePreferences();

  const [showGuide, setShowGuide] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const exportRef = useRef<HTMLElement>(null);
  const currencyLocale = getLocaleForCurrency(currency);
  const currencySymbol = getCurrencySymbol(currency, currencyLocale);

  useEffect(() => {
    setInputs(definition.defaultInputs);
  }, [definition]);

  const result = useMemo(() => definition.compute(inputs), [definition, inputs]);
  const relatedCalculators = calculatorDefinitions.filter((item) => item.slug !== slug).slice(0, 3);


  useEffect(() => {
    const hasSeenGuide = window.localStorage.getItem(`calculator-guide-${slug}`);
    if (!hasSeenGuide) {
      setShowGuide(true);
    }
  }, [slug]);

  const dismissGuide = () => {
    window.localStorage.setItem(`calculator-guide-${slug}`, 'true');
    setShowGuide(false);
  };

  const handleSaveResult = () => {
    const storageKey = `calculator-result-${slug}`;
    const payload = {
      savedAt: new Date().toISOString(),
      summary: result.summary,
      breakdown: result.breakdown
    };

    window.localStorage.setItem(storageKey, JSON.stringify(payload));
    setSavedMessage('Results saved to this browser.');
    window.setTimeout(() => setSavedMessage(''), 2500);
  };

  const csvRows = result.summary.map((item) => ({
    label: item.label,
    value: item.currency ? formatCurrency(item.value) : `${item.value.toFixed(2)}${item.suffix ?? ''}`
  }));

  return (
    <section className="space-y-8 pb-16" ref={exportRef}>
      <CalculatorHeader title={definition.title} description={definition.description} />
      {/* Sharing: encourage backlinks and distribution for calculator/tool pages. */}
      <SocialShareButtons title={definition.title} url={`https://financesphere.io/calculators/${slug}`} />

      {showGuide && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900" role="status">
          <p className="font-semibold">First-time walkthrough</p>
          <p>Adjust sliders on the left, review summary cards, and then save or export your result below.</p>
          <button type="button" onClick={dismissGuide} className="mt-2 rounded-lg bg-indigo-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-800">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Calculator Directory</h2>
          <div className="grid gap-1 text-sm">
            {calculatorDefinitions.map((item) => (
              <Link key={item.slug} href={`/calculators/${item.slug}`} className={`rounded-lg px-2 py-1 transition hover:bg-slate-100 dark:hover:bg-slate-800 ${item.slug === slug ? 'bg-slate-100 font-semibold text-brand dark:bg-slate-800' : ''}`}>
                {item.title}
              </Link>
            ))}
          </div>
        </aside>

        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <div className="space-y-4 rounded-3xl bg-slate-950 p-4 sm:p-6">
              {fieldMeta.map((field) => (
                <InputSlider key={field.key} label={field.label} tooltip={field.tooltip} value={inputs[field.key]} min={field.min} max={field.max} step={field.step} prefix={resolveCurrencyPrefix(field.prefix, currencySymbol)} suffix={field.suffix} locale={currencyLocale} onChange={(value) => setInputs((prev) => ({ ...prev, [field.key]: value }))} />
              ))}
            </div>

            <div className="space-y-6">
              {isRatesLoading && <p className="text-xs text-slate-500">Loading live exchange rates…</p>}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {result.summary.map((item) => (
                  <ResultCard key={item.label} label={item.label} helpText={item.helpText} value={item.currency ? formatCurrency(item.value) : `${item.value.toFixed(2)}${item.suffix ?? ''}`} />
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveResult}
                  className="btn-primary text-sm"
                  aria-label="Save calculator result"
                >
                  Save Result
                </button>
                <DownloadPdfButton targetRef={exportRef} calculatorTitle={definition.title} />
                <ExportCsvButton rows={csvRows} calculatorTitle={definition.title} />
                {savedMessage && <p className="text-xs text-emerald-700" role="status">{savedMessage}</p>}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {result.chartKinds.map((chartKind, index) => (
                  <LazyVisible key={`${chartKind}-${index}`}>
                    <ProjectionChart chartKind={chartKind} projection={result.projection} />
                  </LazyVisible>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-3 text-lg font-semibold">Breakdown Table</h2>
            <table className="w-full text-sm">
              <tbody>
                {result.breakdown.map((row) => (
                  <tr key={row.label} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="py-2 font-medium text-slate-700 dark:text-slate-200">{row.label}</td>
                    <td className="py-2 text-right text-slate-900 dark:text-white">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 dark:border-slate-700 dark:bg-slate-900">
        <div>
          <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-300">
            {definition.faq.map((item) => (
              <li key={item.question}>
                <p className="font-medium text-slate-900 dark:text-white">{item.question}</p>
                <p>{item.answer}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Learn More</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {definition.blogLinks.map((link) => (
              <li key={link.href}>
                <Link className="text-indigo-600 hover:text-indigo-800" href={link.href}>{link.title}</Link>
              </li>
            ))}
            <li>
              {/* Internal linking: guide users from calculator results to comparison intent pages. */}
              <Link className="text-indigo-600 hover:text-indigo-800" href="/comparison">Compare financial products</Link>
            </li>
          </ul>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Related calculators</h2>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          {relatedCalculators.map((item) => (
            <li key={item.slug}>
              <Link className="text-indigo-600 hover:text-indigo-800" href={`/calculators/${item.slug}`}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

    </section>
  );
}

