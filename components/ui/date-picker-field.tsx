'use client';

import { useId } from 'react';

type DatePickerFieldProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
};

export function DatePickerField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  helperText,
  error,
  required = false,
  disabled = false,
}: DatePickerFieldProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <label htmlFor={inputId} className="block text-sm font-semibold text-slate-300">
        {label}{required ? <span className="text-red-300"> *</span> : null}
      </label>
      <input
        id={inputId}
        type="date"
        value={value}
        min={min}
        max={max}
        required={required}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20 disabled:cursor-not-allowed disabled:opacity-60"
      />
      {helperText && <p className="mt-2 text-xs leading-5 text-slate-400">{helperText}</p>}
      {error && <p className="mt-2 text-xs font-semibold leading-5 text-red-200">{error}</p>}
    </div>
  );
}
