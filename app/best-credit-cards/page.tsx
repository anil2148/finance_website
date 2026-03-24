const affiliateRows = [
  {
    product: 'Best Credit Cards 2026',
    feature: 'cashback + travel',
    applyUrl: '/best-credit-cards-2026',
    cta: 'View comparison'
  }
];

export const revalidate = 3600;

export default function BestCreditCardsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Best Credit Cards</h1>
      <p className="text-slate-600">Explore top cashback-focused cards and apply through our affiliate partner links.</p>
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
                  <a className="btn-primary" href={row.applyUrl}>
                    {row.cta}
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
