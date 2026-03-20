import { cn } from "@/lib/utils";

interface Props {
  label: string;
  before: number;
  after: number;
}

function getLevel(gap: number) {
  if (gap <= 0.08) return { label: "Fair", color: "text-success", bg: "bg-success" };
  if (gap <= 0.2) return { label: "Moderate Bias", color: "text-warning", bg: "bg-warning" };
  return { label: "High Bias", color: "text-destructive", bg: "bg-destructive" };
}

export function FairnessGauge({ label, before, after }: Props) {
  const beforeLevel = getLevel(before);
  const afterLevel = getLevel(after);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">{label}</h3>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">Before Mitigation</span>
            <span className={cn("text-xs font-semibold", beforeLevel.color)}>{beforeLevel.label}</span>
          </div>
          <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", beforeLevel.bg)}
              style={{ width: `${Math.min(before * 100, 100)}%` }}
            />
          </div>
          <p className="mt-1 text-right text-xs font-mono text-muted-foreground">
            Gap: {(before * 100).toFixed(1)}%
          </p>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">After Mitigation</span>
            <span className={cn("text-xs font-semibold", afterLevel.color)}>{afterLevel.label}</span>
          </div>
          <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", afterLevel.bg)}
              style={{ width: `${Math.min(after * 100, 100)}%` }}
            />
          </div>
          <p className="mt-1 text-right text-xs font-mono text-muted-foreground">
            Gap: {(after * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
