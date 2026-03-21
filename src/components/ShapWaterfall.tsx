import type { ShapFeature } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

const sensitiveKeywords = ["gender", "age", "race", "zip"];

function isSensitive(feature: string) {
  return sensitiveKeywords.some(k => feature.toLowerCase().includes(k));
}

export function ShapWaterfall({ features }: { features: ShapFeature[] }) {
  const maxVal = Math.max(...features.map(f => f.importance));

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-1">Feature Importance (SHAP)</h3>
      <p className="text-xs text-muted-foreground mb-4">Mean |SHAP| values from LinearExplainer on test set</p>

      <div className="space-y-2.5">
        {features.map(({ feature, importance }) => {
          const sensitive = isSensitive(feature);
          const pct = (importance / maxVal) * 100;

          return (
            <div key={feature} className="flex items-center gap-3">
              <span className={cn(
                "w-32 text-xs font-medium shrink-0 flex items-center gap-1.5",
                sensitive ? "text-destructive" : "text-card-foreground"
              )}>
                {feature}
                {sensitive && <AlertTriangle className="h-3 w-3" />}
              </span>
              <div className="flex-1 h-6 bg-muted rounded-md overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-md transition-all duration-700",
                    sensitive ? "bg-destructive/80" : "bg-primary/70"
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground w-12 text-right">
                {importance.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
