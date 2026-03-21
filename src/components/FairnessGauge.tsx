import { cn } from "@/lib/utils";

interface Props {
  label: string;
  before: number;
  after?: number;
}

function getLevel(val: number) {
  if (val <= 0.08) return { label: "Fair", color: "bg-success", textColor: "text-success" };
  if (val <= 0.2) return { label: "Moderate", color: "bg-warning", textColor: "text-warning" };
  return { label: "High Bias", color: "bg-destructive", textColor: "text-destructive" };
}

export function FairnessGauge({ label, before, after }: Props) {
  const beforeLevel = getLevel(before);
  const afterLevel = after !== undefined ? getLevel(after) : null;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">{label}</h3>
      <div className="space-y-3">
        <GaugeRow label="Before" value={before} level={beforeLevel} />
        {after !== undefined && afterLevel && (
          <GaugeRow label="After" value={after} level={afterLevel} />
        )}
      </div>
    </div>
  );
}

function GaugeRow({ label, value, level }: { label: string; value: number; level: ReturnType<typeof getLevel> }) {
  const pct = Math.min(value * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn("font-medium font-mono", level.textColor)}>
          {(value * 100).toFixed(1)}% · {level.label}
        </span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", level.color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
