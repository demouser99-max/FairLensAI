import { AppShell } from "@/components/AppShell";
import { sampleAnalysis } from "@/lib/mock-data";
import { FileText, Download, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportPage() {
  const d = sampleAnalysis;
  const timestamp = new Date().toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <AppShell>
      <div className="max-w-3xl space-y-6">
        <div className="animate-fade-up flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Audit Report</h1>
            <p className="text-sm text-muted-foreground mt-1">Generated {timestamp}</p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export PDF
          </Button>
        </div>

        <div className="animate-fade-up stagger-1 rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-card-foreground">FairLens AI — Bias Audit Report</h2>
              <p className="text-xs text-muted-foreground">Hiring Decision Model · {d.totalCandidates} candidates</p>
            </div>
          </div>

          <section>
            <h3 className="text-sm font-semibold text-card-foreground mb-2">Executive Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The original model exhibits significant demographic bias with a parity gap of{" "}
              <strong className="text-destructive">{(d.demographicParity.before * 100).toFixed(0)}%</strong>. After applying
              Fairlearn's ExponentiatedGradient mitigation, the gap was reduced to{" "}
              <strong className="text-success">{(d.demographicParity.after * 100).toFixed(0)}%</strong>, with only a{" "}
              {((d.accuracy - d.fairAccuracy) * 100).toFixed(1)}% decrease in accuracy.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Findings</h3>
            <div className="space-y-2">
              <Finding type="issue" text={`${d.biasedDecisions} candidates were unfairly rejected by the biased model`} />
              <Finding type="issue" text="Gender feature has a SHAP importance of 0.19 — it materially influences decisions" />
              <Finding type="issue" text="Zip code acts as a proxy variable for socioeconomic background" />
              <Finding type="fix" text={`${d.correctedDecisions} of ${d.biasedDecisions} biased decisions were corrected`} />
              <Finding type="fix" text={`Equal opportunity gap reduced from ${(d.equalOpportunity.before * 100).toFixed(0)}% to ${(d.equalOpportunity.after * 100).toFixed(0)}%`} />
              <Finding type="fix" text="Fair model maintains 83.1% accuracy — a viable production replacement" />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-card-foreground mb-2">Recommendation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deploy the mitigated model. The marginal accuracy reduction is justified by eliminating systematic
              discrimination. Schedule quarterly re-audits to monitor for bias drift.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function Finding({ type, text }: { type: "issue" | "fix"; text: string }) {
  const Icon = type === "issue" ? AlertTriangle : CheckCircle2;
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${type === "issue" ? "text-destructive" : "text-success"}`} />
      <span className="text-muted-foreground">{text}</span>
    </div>
  );
}
