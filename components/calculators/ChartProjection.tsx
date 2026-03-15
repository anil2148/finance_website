'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { ChartKind, ProjectionPoint } from '@/lib/calculators/types';

const COLORS = ['#06b6d4', '#6366f1', '#f59e0b', '#ef4444'];

export function ChartProjection({ chartKind, projection }: { chartKind: ChartKind; projection: ProjectionPoint[] }) {
  const latest = projection.at(-1);
  const pieData = [
    { name: 'Contributions', value: Math.max(0, latest?.contributed ?? 0) },
    { name: 'Growth', value: Math.max(0, latest ? latest.balance - latest.contributed : 0) }
  ];

  return (
    <div className="h-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        {chartKind === 'growth' ? (
          <AreaChart data={projection.filter((_, index) => index % 6 === 0)}>
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${Math.round(value).toLocaleString()}`} />
            <Area dataKey="balance" stroke="#0891b2" fill="url(#growthGradient)" />
          </AreaChart>
        ) : chartKind === 'amortization' ? (
          <AreaChart data={projection.filter((_, index) => index % 6 === 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${Math.round(value).toLocaleString()}`} />
            <Area dataKey="balance" stroke="#4f46e5" fill="#818cf8" fillOpacity={0.2} />
          </AreaChart>
        ) : chartKind === 'pie' ? (
          <PieChart>
            <Tooltip formatter={(value: number) => `$${Math.round(value).toLocaleString()}`} />
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
              {pieData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : (
          <BarChart data={projection.filter((_, index) => index % 12 === 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${Math.round(value).toLocaleString()}`} />
            <Bar dataKey="balance" fill="#14b8a6" radius={[6, 6, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
