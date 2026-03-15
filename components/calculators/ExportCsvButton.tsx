'use client';

type CsvRow = {
  label: string;
  value: string;
};

type ExportCsvButtonProps = {
  rows: CsvRow[];
  calculatorTitle: string;
};

const toCsvSafe = (value: string) => `"${value.replace(/"/g, '""')}"`;

const createFileName = (base: string) => {
  const safeBase = base
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${safeBase || 'calculator-results'}-${new Date().toISOString().slice(0, 10)}.csv`;
};

export function ExportCsvButton({ rows, calculatorTitle }: ExportCsvButtonProps) {
  const handleExport = () => {
    const header = ['Metric', 'Value'];
    const csvLines = [header, ...rows.map((row) => [row.label, row.value])]
      .map((columns) => columns.map(toCsvSafe).join(','))
      .join('\n');

    const blob = new Blob([csvLines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = createFileName(calculatorTitle);
    anchor.rel = 'noopener';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-md border border-brand/30 bg-white px-4 py-2 text-sm font-semibold text-brand shadow-sm transition hover:border-brand hover:bg-brand/5 dark:bg-slate-900"
      aria-label="Export calculator results to CSV"
    >
      Export CSV
    </button>
  );
}
