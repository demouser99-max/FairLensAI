import type { AnalysisResult } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";

interface Props {
  analysis: AnalysisResult;
}

export function BeforeAfterPanel({ analysis: d }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">Before vs After Mitigation</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Side
          title="Biased Model"
          variant="before"
          accuracy={d.accuracy}
          parityGap={d.demographicParity.before}
          eqGap={d.equalOpportunity.before}
          biased={d.biasedDecisions}
        />
        <Side
          title="Fair Model"
          variant="after"
          accuracy={d.fairAccuracy}
          parityGap={d.demographicParity.after}
          eqGap={d.equalOpportunity.after}
          corrected={d.correctedDecisions}
        />
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>Accuracy tradeoff:</span>
        <span className="font-mono font-medium text-card-foreground">
          {(d.accuracy * 100).toFixed(1)}%
        </span>
        <ArrowRight className="h-3 w-3" />
        <span className="font-mono font-medium text-success">
          {(d.fairAccuracy * 100).toFixed(1)}%
        </span>
        <span className="text-muted-foreground">
          (−{((d.accuracy - d.fairAccuracy) * 100).toFixed(1)}%)
        </span>
      </div>
    </div>
  );
}

function Side({
  title,
  variant,
  accuracy,
  parityGap,
  eqGap,
  biased,
  corrected,
}: {
  title: string;
  variant: "before" | "after";
  accuracy: number;
  parityGap: number;
  eqGap: number;
  biased?: number;
  corrected?: number;
}) {
  const isBefore = variant === "before";
  const borderColor = isBefore ? "border-destructive/20" : "border-success/20";
  const accentText = isBefore ? "text-destructive" : "text-success";

  return (
    <div className={`rounded-lg border ${borderColor} p-4 space-y-2`}>
      <p className={`text-xs font-semibold ${accentText} uppercase tracking-wide`}>{title}</p>
      <Row label="Accuracy" value={`${(accuracy * 100).toFixed(1)}%`} />
      <Row label="Parity Gap" value={`${(parityGap * 100).toFixed(1)}%`} highlight={isBefore} />
      <Row label="EO Gap" value={`${(eqGap * 100).toFixed(1)}%`} highlight={isBefore} />
      {biased !== undefined && <Row label="Biased Decisions" value={String(biased)} highlight />}
      {corrected !== undefined && <Row label="Corrected" value={String(corrected)} />}
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-mono font-medium ${highlight ? "text-destructive" : "text-card-foreground"}`}>
        {value}
      </span>
    </div>
  );
}
