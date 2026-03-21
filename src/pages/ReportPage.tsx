import { AppShell } from "@/components/AppShell";
import { analysisData } from "@/lib/mock-data";
import { FileText, Download, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportPage() {
  const d = analysisData;
  const timestamp = new Date().toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });

  const biasedDecisions = d.candidates.filter(c => c.biasedPrediction !== c.fairPrediction).length;
  const corrected = d.candidates.filter(c => c.biasedPrediction === 0 && c.fairPrediction === 1).length;

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
              <h2 className="font-semibold text-card-foreground">FairLens — Bias Audit Report</h2>
              <p className="text-xs text-muted-foreground">Hiring Decision Model · {d.totalCandidates} candidates · LogisticRegression</p>
            </div>
          </div>

          <section>
            <h3 className="text-sm font-semibold text-card-foreground mb-2">Executive Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The biased model achieves {(d.biasedModel.accuracy * 100).toFixed(1)}% accuracy but has a demographic parity
              gap of <strong className="text-destructive">{(d.biasedModel.demographicParityDiff * 100).toFixed(1)}%</strong>.
              Male candidates are selected at 92% vs. 22% for female candidates. After applying Fairlearn's
              ExponentiatedGradient with DemographicParity constraint, the gap reduced to{" "}
              <strong className="text-success">{(d.fairModel.demographicParityDiff * 100).toFixed(1)}%</strong> with
              accuracy at {(d.fairModel.accuracy * 100).toFixed(1)}%.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Findings</h3>
            <div className="space-y-2">
              <Finding type="issue" text={`Gender has the highest SHAP importance (2.37) — far exceeding legitimate features`} />
              <Finding type="issue" text={`${biasedDecisions} candidates have different outcomes between biased and fair models`} />
              <Finding type="issue" text="Female selection rate is 21.8% vs 92.0% for males under the biased model" />
              <Finding type="fix" text={`${corrected} previously rejected candidates are now correctly selected`} />
              <Finding type="fix" text={`DPD reduced from ${(d.biasedModel.demographicParityDiff * 100).toFixed(1)}% to ${(d.fairModel.demographicParityDiff * 100).toFixed(1)}%`} />
              <Finding type="fix" text={`Female TPR improved from 70% to 100% after mitigation`} />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-card-foreground mb-2">Technical Details</h3>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
              <p>• <strong>Model:</strong> LogisticRegression (scikit-learn, max_iter=1000)</p>
              <p>• <strong>Mitigation:</strong> ExponentiatedGradient with DemographicParity constraint (Fairlearn)</p>
              <p>• <strong>Explainability:</strong> SHAP LinearExplainer on test set</p>
              <p>• <strong>Dataset:</strong> {d.totalCandidates} candidates, 75/25 train/test split, stratified</p>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-card-foreground mb-2">Recommendation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deploy the mitigated model. The accuracy reduction ({((d.biasedModel.accuracy - d.fairModel.accuracy) * 100).toFixed(1)}%)
              is justified because the biased model's high accuracy is achieved through systematic discrimination.
              Schedule quarterly re-audits.
            </p>
          </section>
        </div>

        <div className="animate-fade-up stagger-2 rounded-xl border border-border bg-card/50 p-4">
          <p className="text-xs text-muted-foreground text-center">
            Powered by scikit-learn · Fairlearn · SHAP · Google Gemini
          </p>
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
