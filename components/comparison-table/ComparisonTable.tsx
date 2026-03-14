'use client';

import { useMemo, useState } from 'react';

type Product = {
  name: string;
  interest_rate: number;
  annual_fee: number;
  cashback: number;
  minimum_credit_score: number;
  rating: number;
  affiliate_link: string;
};

export function ComparisonTable({ data }: { data: Product[] }) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<keyof Product>('rating');

  const rows = useMemo(() => {
    return [...data]
      .filter((x) => x.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => Number(b[sortKey]) - Number(a[sortKey]));
  }, [data, query, sortKey]);

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-2 md:flex-row">
        <input className="input" placeholder="Filter by name" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="input md:max-w-xs" value={sortKey} onChange={(e) => setSortKey(e.target.value as keyof Product)}>
          <option value="rating">Sort by rating</option>
          <option value="cashback">Sort by cashback</option>
          <option value="interest_rate">Sort by interest rate</option>
        </select>
      </div>
      <div className="table-shell">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Name</th><th className="p-3">Rate</th><th className="p-3">Annual Fee</th><th className="p-3">Cashback</th><th className="p-3">Rating</th><th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-slate-200">
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.interest_rate}%</td>
                <td className="p-3">${r.annual_fee}</td>
                <td className="p-3">{r.cashback}%</td>
                <td className="p-3">⭐ {r.rating}</td>
                <td className="p-3"><a className="btn-primary" href={r.affiliate_link} target="_blank">Apply Now</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
