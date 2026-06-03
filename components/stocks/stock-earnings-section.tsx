type EarningsItem = {
  date?: string;
  epsActual?: number;
  epsEstimate?: number;
  revenueActual?: number;
  revenueEstimate?: number;
  quarter?: number;
  year?: number;
};

type Props = {
  earnings: EarningsItem[];
  source?: string | null;
};

function compactNumber(value?: number) {
  if (!value || !Number.isFinite(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value);
}

function InfoMini({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-amber-300/20 bg-black/20 p-3">
      <h5 className="font-bold">{title}</h5>
      <p className="mt-1 text-xs leading-5 opacity-90">{text}</p>
    </div>
  );
}

export function StockEarningsSection({ earnings, source }: Props) {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-bold">Detailed Earnings History</h3>
          <p className="mt-2 text-sm text-slate-400">Raw provider rows used by the Earnings Intelligence section.</p>
        </div>
        {source && <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">Source: {source}</span>}
      </div>

      {earnings.length ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="pb-3">Date</th>
                <th className="pb-3">Quarter</th>
                <th className="pb-3">EPS Actual</th>
                <th className="pb-3">EPS Estimate</th>
                <th className="pb-3">Revenue Actual</th>
                <th className="pb-3">Revenue Estimate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-200">
              {earnings.slice(0, 8).map((item, index) => (
                <tr key={`${item.date}-${index}`}>
                  <td className="py-3">{item.date || 'N/A'}</td>
                  <td className="py-3">Q{item.quarter || '?'} {item.year || ''}</td>
                  <td className="py-3">{typeof item.epsActual === 'number' ? item.epsActual.toFixed(2) : 'N/A'}</td>
                  <td className="py-3">{typeof item.epsEstimate === 'number' ? item.epsEstimate.toFixed(2) : 'N/A'}</td>
                  <td className="py-3">{compactNumber(item.revenueActual)}</td>
                  <td className="py-3">{compactNumber(item.revenueEstimate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-6 text-amber-50">
          <h4 className="font-bold">Earnings data is not available from the provider right now.</h4>
          <p className="mt-2">This can happen when Finnhub does not return historical earnings for a symbol, the company has limited reporting history, or the data is restricted by API tier.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <InfoMini title="What to check" text="Search the company investor relations page for quarterly results." />
            <InfoMini title="Why it matters" text="Earnings beats and misses can move the stock sharply." />
            <InfoMini title="Next step" text="Ask AI: What should I verify before buying this stock?" />
          </div>
        </div>
      )}
    </div>
  );
}
