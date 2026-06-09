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

function getBeatRate(earnings: EarningsItem[], field: 'eps' | 'revenue') {
  const actualKey = field === 'eps' ? 'epsActual' : 'revenueActual';
  const estimateKey = field === 'eps' ? 'epsEstimate' : 'revenueEstimate';
  const rows = earnings.slice(0, 8).filter((item) => typeof item[actualKey] === 'number' && typeof item[estimateKey] === 'number');
  if (!rows.length) return null;
  const beats = rows.filter((item) => Number(item[actualKey]) >= Number(item[estimateKey])).length;
  return Math.round((beats / rows.length) * 100);
}

export function StockEarningsSection({ earnings, source }: Props) {
  const epsBeatRate = getBeatRate(earnings, 'eps');
  const revenueBeatRate = getBeatRate(earnings, 'revenue');
  const earningsRiskSummary = earnings.length
    ? `Recent provider rows show ${epsBeatRate === null ? 'limited EPS comparability' : `${epsBeatRate}% EPS beat rate`} and ${revenueBeatRate === null ? 'limited revenue comparability' : `${revenueBeatRate}% revenue beat rate`}.`
    : 'Provider earnings rows are unavailable, so treat earnings risk as unverified until you check company filings or investor relations.';

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-bold">Detailed Earnings History</h3>
          <p className="mt-2 text-sm text-slate-400">Raw provider rows used by the Earnings Intelligence section.</p>
        </div>
        {source && <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">Source: {source}</span>}
      </div>

      <section className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5 text-amber-50">
        <h4 className="text-lg font-bold">Earnings decision guide</h4>
        <p className="mt-2 text-sm leading-6">{earningsRiskSummary}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <InfoMini title="What would be bullish" text="EPS beat, revenue growth acceleration, margin improvement, and raised guidance." />
          <InfoMini title="What would be bearish" text="Guidance cut, slowing revenue growth, margin compression, or repeated EPS misses." />
          <InfoMini title="Hold through earnings?" text="Use caution if the position is large, valuation is stretched, or you cannot tolerate a sharp gap move." />
          <InfoMini title="Add before earnings?" text="Avoid adding aggressively before earnings when confidence is low or data coverage is limited." />
        </div>
      </section>

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
