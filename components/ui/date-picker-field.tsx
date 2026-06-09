'use client';

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
  const inputId = id ?? label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <label htmlFor={inputId} className="block rounded-2xl border border-white/10 bg-black/20 p-4">
      <span className="block text-sm font-semibold text-slate-300">
        {label}{required ? <span className="text-red-300"> *</span> : null}
      </span>
      <input
        id={inputId}
        type="date"
        value={value}
        min={min}
        max={max}
        required={required}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
      />
      {helperText && !error ? <p className="mt-2 text-xs leading-5 text-slate-400">{helperText}</p> : null}
      {error ? <p className="mt-2 text-xs font-semibold leading-5 text-red-200">{error}</p> : null}
    </label>
  );
}
