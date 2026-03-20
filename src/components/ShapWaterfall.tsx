import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import type { ShapFeature } from "@/lib/mock-data";

interface Props {
  features: ShapFeature[];
}

export function ShapWaterfall({ features }: Props) {
  const sorted = [...features].sort((a, b) => Math.abs(b.importance) - Math.abs(a.importance));
  const data = sorted.map((f) => ({
    feature: f.feature.replace(/_/g, " "),
    value: f.direction === "negative" ? -f.importance : f.importance,
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-1 text-sm font-semibold text-card-foreground">SHAP Feature Importance</h3>
      <p className="mb-4 text-xs text-muted-foreground">Red bars indicate features that should not influence hiring decisions</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="feature" tick={{ fontSize: 11 }} width={110} />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid hsl(var(--border))",
              fontSize: "13px",
            }}
            formatter={(val: number) => [Math.abs(val).toFixed(3), "SHAP value"]}
          />
          <ReferenceLine x={0} stroke="hsl(var(--border))" />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, idx) => (
              <Cell
                key={idx}
                fill={entry.value < 0 ? "hsl(var(--chart-bias-high))" : "hsl(var(--chart-after))"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
