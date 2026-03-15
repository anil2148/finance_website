'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function InputSlider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = '',
  prefix = '',
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  prefix?: string;
  onChange: (value: number) => void;
}) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">
          {prefix}
          {value.toLocaleString()}
          {suffix}
        </span>
      </div>
      <div className="relative">
        <motion.div
          className="absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-brand to-cyan-500"
          animate={{ width: `${progress}%` }}
        />
        <input
          className={cn('relative h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200')}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
