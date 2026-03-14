export function CalculatorInput({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm text-slate-700">{label}</span>
      <input className="input" type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}
