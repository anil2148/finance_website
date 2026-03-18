'use client';

import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, StarIcon } from '@heroicons/react/24/solid';
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

const sortOptions = [
  { label: 'Highest rating', key: 'rating' },
  { label: 'Highest cashback', key: 'cashback' },
  { label: 'Lowest annual fee', key: 'annual_fee' },
  { label: 'Lowest rate', key: 'interest_rate' }
] as const;

export function ComparisonTable({ data }: { data: Product[] }) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]>(sortOptions[0]);
  const [minRating, setMinRating] = useState(0);

  const rows = useMemo(() => {
    return [...data]
      .filter((x) => x.name.toLowerCase().includes(query.toLowerCase()))
      .filter((x) => x.rating >= minRating)
      .sort((a, b) => {
        if (sortBy.key === 'annual_fee' || sortBy.key === 'interest_rate') return Number(a[sortBy.key]) - Number(b[sortBy.key]);
        return Number(b[sortBy.key]) - Number(a[sortBy.key]);
      });
  }, [data, minRating, query, sortBy]);

  return (
    <section className="space-y-4">
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <input className="input" placeholder="Filter products..." value={query} onChange={(e) => setQuery(e.target.value)} />

        <Listbox value={sortBy} onChange={setSortBy}>
          <div className="relative">
            <Listbox.Button className="input flex items-center justify-between">
              <span>{sortBy.label}</span>
              <ChevronUpDownIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 mt-2 w-full rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-600 dark:bg-slate-900">
              {sortOptions.map((option) => (
                <Listbox.Option key={option.key} value={option} className="cursor-pointer rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800">
                  {({ selected }) => (
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {selected && <CheckIcon className="h-4 w-4 text-brand" />}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>

        <select className="input" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
          <option value={0}>All ratings</option>
          <option value={3}>3★ and above</option>
          <option value={4}>4★ and above</option>
          <option value={4.5}>4.5★ and above</option>
        </select>
      </div>

      <div className="table-shell max-h-[32rem]">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-slate-100 text-left dark:bg-slate-800 dark:text-slate-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Rate</th>
              <th className="p-3">Annual Fee</th>
              <th className="p-3">Cashback</th>
              <th className="p-3">Min Score</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-slate-200 transition hover:bg-blue-50/50 dark:border-slate-700 dark:hover:bg-blue-500/10">
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3">{r.interest_rate}%</td>
                <td className="p-3">${r.annual_fee}</td>
                <td className="p-3">{r.cashback}%</td>
                <td className="p-3">{r.minimum_credit_score}</td>
                <td className="p-3">
                  <span className="inline-flex items-center gap-1">
                    <StarIcon className="h-4 w-4 text-amber-400" />
                    {r.rating}
                  </span>
                </td>
                <td className="p-3">
                  <a className="btn-primary rounded-lg" href={r.affiliate_link} target="_blank" rel="noreferrer">
                    Apply Now
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
