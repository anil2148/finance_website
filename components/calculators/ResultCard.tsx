'use client';

import { motion } from 'framer-motion';

export function ResultCard({ label, value, helpText }: { label: string; value: string; helpText: string }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <p className="text-xs uppercase tracking-wider text-slate-500" title={helpText}>
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{helpText}</p>
    </motion.article>
  );
}
