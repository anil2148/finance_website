import { Card } from '@/components/ui/card';

export function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <Card className="space-y-2">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-slate-500">{helper}</p>
    </Card>
  );
}
