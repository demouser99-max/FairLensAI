import type { Candidate } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface Props {
  candidates: Candidate[];
  showFair: boolean;
}

export function CandidateTable({ candidates, showFair }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="p-5 pb-0">
        <h3 className="text-sm font-semibold text-card-foreground">Sample Predictions</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {showFair ? "Comparing biased vs fair model outputs" : "Biased model predictions"}
        </p>
      </div>
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-2 px-5 text-left font-medium">ID</th>
              <th className="py-2 px-3 text-left font-medium">Gender</th>
              <th className="py-2 px-3 text-left font-medium">Exp</th>
              <th className="py-2 px-3 text-left font-medium">Education</th>
              <th className="py-2 px-3 text-left font-medium">Tech</th>
              <th className="py-2 px-3 text-left font-medium">Interview</th>
              <th className="py-2 px-3 text-left font-medium">Biased</th>
              {showFair && <th className="py-2 px-3 text-left font-medium">Fair</th>}
            </tr>
          </thead>
          <tbody className="text-card-foreground">
            {candidates.map((c) => {
              const changed = showFair && c.biasedPrediction !== c.fairPrediction;
              return (
                <tr key={c.id} className={cn("border-b border-border/50 transition-colors", changed && "bg-success/5")}>
                  <td className="py-2 px-5 font-mono">{c.id}</td>
                  <td className="py-2 px-3">{c.gender}</td>
                  <td className="py-2 px-3 font-mono">{c.experience}y</td>
                  <td className="py-2 px-3">{c.education}</td>
                  <td className="py-2 px-3 font-mono">{c.techScore}</td>
                  <td className="py-2 px-3 font-mono">{c.interviewScore}</td>
                  <td className="py-2 px-3"><PredBadge value={c.biasedPrediction} /></td>
                  {showFair && <td className="py-2 px-3"><PredBadge value={c.fairPrediction} changed={changed} /></td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PredBadge({ value, changed }: { value: number; changed?: boolean }) {
  const hired = value === 1;
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
      hired ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
      changed && "ring-1 ring-success/40"
    )}>
      {hired ? "Hired" : "Rejected"}
    </span>
  );
}
