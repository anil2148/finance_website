'use client';

import { useMemo } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { usePreferences } from '@/components/providers/PreferenceProvider';
import { ChartKind, ProjectionPoint } from '@/lib/calculators/types';

const COLORS = ['#06b6d4', '#6366f1', '#f59e0b', '#ef4444'];

export function ProjectionChart({ chartKind, projection }: { chartKind: ChartKind; projection: ProjectionPoint[] }) {
  const { formatCurrency } = usePreferences();

  const chartData = useMemo(() => projection.filter((_, index) => index % 6 === 0 || index === projection.length - 1), [projection]);
  const latest = projection.at(-1);
  const pieData = [
    { name: 'Contributions', value: Math.max(0, latest?.contributed ?? 0) },
    { name: 'Growth', value: Math.max(0, latest ? latest.balance - latest.contributed : 0) }
  ];

  const formatTooltip = (value: number) => formatCurrency(Math.round(value));

  return (
    <div className="h-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <ResponsiveContainer width="100%" height="100%">
        {chartKind === 'growth' ? (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={formatTooltip} />
            <Area dataKey="balance" stroke="#0891b2" fill="url(#growthGradient)" />
          </AreaChart>
        ) : chartKind === 'amortization' ? (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={formatTooltip} />
            <Area dataKey="balance" stroke="#4f46e5" fill="#818cf8" fillOpacity={0.2} />
          </AreaChart>
        ) : chartKind === 'pie' ? (
          <PieChart>
            <Tooltip formatter={formatTooltip} />
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
              {pieData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : (
          <BarChart data={chartData.filter((_, index) => index % 2 === 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={formatTooltip} />
            <Bar dataKey="balance" fill="#14b8a6" radius={[6, 6, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
