'use client';

type InputSliderProps = {
  label: string;
  tooltip: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  locale?: string;
};

export function InputSlider({ label, tooltip, value, min, max, step = 1, onChange, prefix, suffix, locale }: InputSliderProps) {
  const tooltipId = `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-tooltip`;

  return (
    <label className="block rounded-2xl bg-slate-900/70 p-4 text-slate-100 shadow-lg">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-medium">{label}</span>
        <span className="group relative inline-flex" tabIndex={0}>
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 text-xs text-slate-300"
            aria-describedby={tooltipId}
            aria-label={`${label} help`}
            role="img"
          >
            ?
          </span>
          <span
            id={tooltipId}
            role="tooltip"
            className="pointer-events-none absolute right-0 top-full z-20 mt-2 hidden w-64 rounded-lg border border-slate-600 bg-slate-950 p-2 text-left text-xs leading-relaxed text-slate-100 shadow-xl group-hover:block group-focus-within:block"
          >
            <span className="font-semibold text-cyan-300">Why it matters:</span> {tooltip}
          </span>
        </span>
      </div>
      <div className="mb-2 text-lg font-semibold text-white">{prefix}{value.toLocaleString(locale)}{suffix}</div>
      <input
        className="mb-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-600 accent-cyan-400"
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        aria-describedby={tooltipId}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <input
        className="w-full rounded-lg border border-slate-500 bg-slate-800 px-2 py-1 text-sm text-white"
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={`${label} numeric input`}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
