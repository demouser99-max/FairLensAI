import { ArrowRight } from "lucide-react";

interface Props {
  biasedAccuracy: number;
  fairAccuracy: number;
  biasedScore: number;
  fairScore: number;
  biasedDPD: number;
  fairDPD: number;
}

export function BeforeAfterPanel({ biasedAccuracy, fairAccuracy, biasedScore, fairScore, biasedDPD, fairDPD }: Props) {
  const rows = [
    { label: "Accuracy", before: `${(biasedAccuracy * 100).toFixed(1)}%`, after: `${(fairAccuracy * 100).toFixed(1)}%` },
    { label: "Bias Score", before: biasedScore.toFixed(4), after: fairScore.toFixed(4) },
    { label: "Demographic Parity Gap", before: `${(biasedDPD * 100).toFixed(1)}%`, after: `${(fairDPD * 100).toFixed(1)}%` },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">Before vs After Mitigation</h3>
      <div className="grid gap-3">
        {rows.map(({ label, before, after }) => (
          <div key={label} className="flex items-center gap-3 text-sm">
            <span className="w-44 text-muted-foreground text-xs font-medium">{label}</span>
            <span className="font-mono font-semibold text-destructive bg-destructive/10 rounded px-2 py-0.5 text-xs">{before}</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="font-mono font-semibold text-success bg-success/10 rounded px-2 py-0.5 text-xs">{after}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
