import { cn } from "@/lib/utils";

interface Props {
  label: string;
  before: number;
  after?: number;
}

function getLevel(gap: number) {
  if (gap <= 0.08) return { label: "Fair", color: "text-success", bg: "bg-success" };
  if (gap <= 0.2) return { label: "Moderate Bias", color: "text-warning", bg: "bg-warning" };
  return { label: "High Bias", color: "text-destructive", bg: "bg-destructive" };
}

export function FairnessGauge({ label, before, after }: Props) {
  const beforeLevel = getLevel(before);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">{label}</h3>
      <div className="space-y-4">
        <GaugeRow label="Before Mitigation" value={before} level={beforeLevel} />
        {after !== undefined && (
          <GaugeRow label="After Mitigation" value={after} level={getLevel(after)} />
        )}
      </div>
    </div>
  );
}

function GaugeRow({ label: rowLabel, value, level }: {
  label: string;
  value: number;
  level: { label: string; color: string; bg: string };
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-muted-foreground">{rowLabel}</span>
        <span className={cn("text-xs font-semibold", level.color)}>{level.label}</span>
      </div>
      <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", level.bg)}
          style={{ width: `${Math.min(value * 100, 100)}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs font-mono text-muted-foreground">
        Gap: {(value * 100).toFixed(1)}%
      </p>
    </div>
  );
}
