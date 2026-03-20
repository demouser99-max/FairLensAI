import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { BiasMetric } from "@/lib/mock-data";

interface Props {
  before: BiasMetric[];
  after?: BiasMetric[];
  metric: "selectionRate" | "truePositiveRate";
  title: string;
}

export function BiasComparisonChart({ before, after, metric, title }: Props) {
  const data = before.map((b, i) => {
    const row: Record<string, string | number> = {
      group: b.group,
      "Biased Model": +(b[metric] * 100).toFixed(1),
    };
    if (after) row["Fair Model"] = +(after[i][metric] * 100).toFixed(1);
    return row;
  });

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-card-foreground">{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barGap={4} barSize={after ? 24 : 32}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="group" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} unit="%" />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid hsl(var(--border))",
              fontSize: "13px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Bar dataKey="Biased Model" fill="hsl(var(--chart-before))" radius={[4, 4, 0, 0]} />
          {after && <Bar dataKey="Fair Model" fill="hsl(var(--chart-after))" radius={[4, 4, 0, 0]} />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
