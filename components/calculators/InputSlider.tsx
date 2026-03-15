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
        <span
          className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300"
          title={tooltip}
          id={tooltipId}
          role="note"
          aria-label={`${label} help: ${tooltip}`}
        >
          ?
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
