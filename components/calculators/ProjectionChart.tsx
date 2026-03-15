'use client';

import { useMemo } from 'react';
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
import { usePreferences } from '@/components/providers/PreferenceProvider';
import { ChartKind, ProjectionPoint } from '@/lib/calculators/types';

const COLORS = ['#06b6d4', '#6366f1', '#f59e0b', '#ef4444'];

type ChartConfig = {
  title: string;
  helperText: string;
  seriesLabel: string;
  accentClass: string;
};

const CHART_CONFIG: Record<ChartKind, ChartConfig> = {
  growth: {
    title: 'Projected portfolio value',
    helperText: 'See how your money could grow each year.',
    seriesLabel: 'Balance',
    accentClass: 'bg-cyan-500'
  },
  amortization: {
    title: 'Remaining balance over time',
    helperText: 'Watch your balance reduce over the years.',
    seriesLabel: 'Remaining balance',
    accentClass: 'bg-indigo-500'
  },
  pie: {
    title: 'Final balance breakdown',
    helperText: 'Compare your contributions vs growth.',
    seriesLabel: 'Breakdown',
    accentClass: 'bg-amber-500'
  },
  bar: {
    title: 'Milestone balance checkpoints',
    helperText: 'Quick snapshot of your progress timeline.',
    seriesLabel: 'Balance',
    accentClass: 'bg-teal-500'
  }
};

export function ProjectionChart({ chartKind, projection }: { chartKind: ChartKind; projection: ProjectionPoint[] }) {
  const { formatCurrency } = usePreferences();

  const stepSize = useMemo(() => {
    if (projection.length <= 10) return 1;
    return Math.ceil(projection.length / 10);
  }, [projection.length]);

  const chartData = useMemo(
    () => projection.filter((_, index) => index % stepSize === 0 || index === projection.length - 1),
    [projection, stepSize]
  );

  const latest = projection.at(-1);
  const pieData = [
    { name: 'Contributions', value: Math.max(0, latest?.contributed ?? 0) },
    { name: 'Growth', value: Math.max(0, latest ? latest.balance - latest.contributed : 0) }
  ];

  const formatCurrencyValue = (value: number) => formatCurrency(Math.round(value));

  const formatAxisCurrency = (value: number) => {
    if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
    return `${Math.round(value)}`;
  };

  if (!projection.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">No projection data available yet.</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Adjust your inputs to generate a chart.</p>
      </div>
    );
  }

  const config = CHART_CONFIG[chartKind];

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-900/80">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{config.title}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">{config.helperText}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800/80">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Latest value</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrencyValue(latest?.balance ?? 0)}</p>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${config.accentClass}`} />
        <span>{config.seriesLabel}</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartKind === 'growth' ? (
            <AreaChart data={chartData} margin={{ top: 8, right: 10, left: 2, bottom: 0 }}>
              <defs>
                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="#cbd5e1" opacity={0.6} vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} tickMargin={8} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatAxisCurrency} tick={{ fontSize: 12 }} width={50} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value: number) => formatCurrencyValue(value)}
                labelFormatter={(label) => `Year ${label}`}
                contentStyle={{ borderRadius: 12, borderColor: '#cbd5e1', boxShadow: '0 10px 25px -15px rgba(15,23,42,0.6)' }}
              />
              <Area dataKey="balance" stroke="#0891b2" fill="url(#growthGradient)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </AreaChart>
          ) : chartKind === 'amortization' ? (
            <AreaChart data={chartData} margin={{ top: 8, right: 10, left: 2, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#cbd5e1" opacity={0.6} vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} tickMargin={8} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatAxisCurrency} tick={{ fontSize: 12 }} width={50} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value: number) => formatCurrencyValue(value)}
                labelFormatter={(label) => `Year ${label}`}
                contentStyle={{ borderRadius: 12, borderColor: '#cbd5e1', boxShadow: '0 10px 25px -15px rgba(15,23,42,0.6)' }}
              />
              <Area dataKey="balance" stroke="#4f46e5" fill="#818cf8" fillOpacity={0.2} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </AreaChart>
          ) : chartKind === 'pie' ? (
            <PieChart>
              <Tooltip
                formatter={(value: number) => formatCurrencyValue(value)}
                contentStyle={{ borderRadius: 12, borderColor: '#cbd5e1', boxShadow: '0 10px 25px -15px rgba(15,23,42,0.6)' }}
              />
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="45%" innerRadius={50} outerRadius={84} paddingAngle={3}>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 8, right: 10, left: 2, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#cbd5e1" opacity={0.6} vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} tickMargin={8} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatAxisCurrency} tick={{ fontSize: 12 }} width={50} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value: number) => formatCurrencyValue(value)}
                labelFormatter={(label) => `Year ${label}`}
                contentStyle={{ borderRadius: 12, borderColor: '#cbd5e1', boxShadow: '0 10px 25px -15px rgba(15,23,42,0.6)' }}
              />
              <Bar dataKey="balance" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {chartKind === 'pie' ? (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {pieData.map((slice, index) => (
            <div key={slice.name} className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800/80">
              <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                {slice.name}
              </p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">{formatCurrencyValue(slice.value)}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
