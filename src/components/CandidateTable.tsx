import { cn } from "@/lib/utils";
import type { sampleDatasetPreview } from "@/lib/mock-data";

type Candidate = (typeof sampleDatasetPreview)[number];

export function CandidateTable({ candidates }: { candidates: Candidate[] }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-card-foreground">Sample Candidates — Before vs After</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Exp (yrs)</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Education</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Tech Score</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Gender</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Biased Model</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Fair Model</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => {
              const flipped = c.prediction !== c.fairPrediction;
              return (
                <tr key={c.id} className={cn("border-b border-border last:border-0", flipped && "bg-success/5")}>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{c.experience}</td>
                  <td className="px-4 py-3">{c.education}</td>
                  <td className="px-4 py-3 font-mono text-xs">{c.techScore}</td>
                  <td className="px-4 py-3">{c.gender}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                      c.prediction === "Selected" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    )}>
                      {c.prediction}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                      c.fairPrediction === "Selected" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    )}>
                      {c.fairPrediction}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
