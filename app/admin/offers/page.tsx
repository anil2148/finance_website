import { getFinancialProducts, CATEGORY_LABELS } from '@/lib/financialProducts';
import { readOfferClicks } from '@/lib/offerTracking';

export const metadata = {
  title: 'Offer Analytics',
  description: 'Internal offer click analytics dashboard for affiliate performance.',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminOffersPage() {
  const products = getFinancialProducts();
  const clicks = readOfferClicks();

  const clicksPerProduct = products.map((product) => ({
    ...product,
    clicks: clicks.filter((click) => click.product_id === product.id).length
  }));

  const topOffers = [...clicksPerProduct].sort((a, b) => b.clicks - a.clicks).slice(0, 5);

  const clicksByCategory = products.reduce<Record<string, number>>((acc, product) => {
    const count = clicks.filter((click) => click.product_id === product.id).length;
    acc[product.category] = (acc[product.category] ?? 0) + count;
    return acc;
  }, {});

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Offer Analytics</h1>

      <div className="table-shell">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr><th className="p-3">Product</th><th className="p-3">Bank</th><th className="p-3">Category</th><th className="p-3">Clicks</th></tr>
          </thead>
          <tbody>
            {clicksPerProduct.map((entry) => (
              <tr key={entry.id} className="border-t border-slate-200">
                <td className="p-3">{entry.name}</td>
                <td className="p-3">{entry.bank}</td>
                <td className="p-3">{CATEGORY_LABELS[entry.category]}</td>
                <td className="p-3 font-semibold">{entry.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Top Performing Offers</h2>
          <ul className="space-y-2 text-sm">
            {topOffers.map((entry) => <li key={entry.id}>{entry.name} — <strong>{entry.clicks}</strong> clicks</li>)}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Clicks by Category</h2>
          <ul className="space-y-2 text-sm">
            {Object.entries(clicksByCategory).map(([category, count]) => (
              <li key={category}>{CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]} — <strong>{count}</strong></li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
