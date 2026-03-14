const affiliateRows = [
  {
    product: 'Credit card',
    feature: 'cashback',
    applyUrl: 'https://example.com/affiliate/best-investment-apps'
  }
];

export const revalidate = 3600;

export default function BestInvestmentAppsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Best Investment Apps</h1>
      <p className="text-slate-600">Feature-driven comparisons designed to earn through affiliate apply clicks.</p>
      <div className="table-shell">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Feature</th>
              <th className="p-3">Apply</th>
            </tr>
          </thead>
          <tbody>
            {affiliateRows.map((row) => (
              <tr key={row.applyUrl} className="border-t border-slate-200">
                <td className="p-3">{row.product}</td>
                <td className="p-3">{row.feature}</td>
                <td className="p-3">
                  <a className="btn-primary" href={row.applyUrl} target="_blank" rel="noreferrer sponsored">
                    Affiliate Link
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
