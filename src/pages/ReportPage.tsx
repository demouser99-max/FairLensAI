import { AppShell } from "@/components/AppShell";
import { analysisData } from "@/lib/mock-data";
import { FileText, Download, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function generatePDF(d: typeof analysisData) {
  import("jspdf").then(({ jsPDF }) => {
    const doc = new jsPDF();
    const w = doc.internal.pageSize.getWidth();
    let y = 20;

    const addLine = (text: string, size = 10, bold = false) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, w - 40);
      if (y + lines.length * (size * 0.5) > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(lines, 20, y);
      y += lines.length * (size * 0.5) + 4;
    };

    const addGap = (n = 4) => { y += n; };

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, w, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("FairLens AI — Bias Audit Report", 20, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`, 20, 28);
    doc.text(`${d.totalCandidates} candidates · LogisticRegression`, 20, 35);
    doc.setTextColor(0, 0, 0);
    y = 50;

    // Executive Summary
    addLine("Executive Summary", 14, true);
    addGap(2);
    addLine(`The biased model achieves ${(d.biasedModel.accuracy * 100).toFixed(1)}% accuracy but exhibits a demographic parity gap of ${(d.biasedModel.demographicParityDiff * 100).toFixed(1)}%. After applying Fairlearn's ExponentiatedGradient with DemographicParity constraint, the gap was reduced to ${(d.fairModel.demographicParityDiff * 100).toFixed(1)}% with accuracy at ${(d.fairModel.accuracy * 100).toFixed(1)}%.`);
    addGap(6);

    // Metrics Table
    addLine("Key Metrics Comparison", 14, true);
    addGap(4);
    const metrics = [
      ["Metric", "Before (Biased)", "After (Fair)"],
      ["Accuracy", `${(d.biasedModel.accuracy * 100).toFixed(1)}%`, `${(d.fairModel.accuracy * 100).toFixed(1)}%`],
      ["Bias Score", d.biasedModel.biasScore.toFixed(4), d.fairModel.biasScore.toFixed(4)],
      ["Demographic Parity Diff", `${(d.biasedModel.demographicParityDiff * 100).toFixed(1)}%`, `${(d.fairModel.demographicParityDiff * 100).toFixed(1)}%`],
      ["Equal Opportunity Diff", `${(d.biasedModel.equalOpportunityDiff * 100).toFixed(1)}%`, `${(d.fairModel.equalOpportunityDiff * 100).toFixed(1)}%`],
    ];

    const colWidths = [65, 45, 45];
    const startX = 20;
    metrics.forEach((row, ri) => {
      let x = startX;
      row.forEach((cell, ci) => {
        doc.setFont("helvetica", ri === 0 ? "bold" : "normal");
        doc.setFontSize(9);
        if (ri === 0) {
          doc.setFillColor(241, 245, 249);
          doc.rect(x, y - 4, colWidths[ci], 7, "F");
        }
        doc.text(cell, x + 2, y);
        x += colWidths[ci];
      });
      y += 7;
    });
    addGap(6);

    // Group Metrics
    addLine("Group Metrics (Before)", 14, true);
    addGap(2);
    d.groupMetricsBefore.forEach(g => {
      addLine(`${g.group}: Selection Rate ${(g.selectionRate * 100).toFixed(1)}%, TPR ${(g.truePositiveRate * 100).toFixed(1)}%`);
    });
    addGap(4);
    addLine("Group Metrics (After)", 14, true);
    addGap(2);
    d.groupMetricsAfter.forEach(g => {
      addLine(`${g.group}: Selection Rate ${(g.selectionRate * 100).toFixed(1)}%, TPR ${(g.truePositiveRate * 100).toFixed(1)}%`);
    });
    addGap(6);

    // SHAP
    addLine("Feature Importance (SHAP)", 14, true);
    addGap(2);
    d.shapImportance.forEach(f => {
      const flag = ["Gender", "Race", "Age", "Zip"].some(s => f.feature.toLowerCase().includes(s.toLowerCase())) ? " ⚠ SENSITIVE" : "";
      addLine(`• ${f.feature}: ${f.importance.toFixed(4)}${flag}`);
    });
    addGap(6);

    // Findings
    addLine("Key Findings", 14, true);
    addGap(2);
    const biasedDecs = d.candidates.filter(c => c.biasedPrediction !== c.fairPrediction).length;
    const corrected = d.candidates.filter(c => c.biasedPrediction === 0 && c.fairPrediction === 1).length;
    addLine(`• Gender has the highest SHAP importance (${d.shapImportance[0]?.importance.toFixed(2)}) — far exceeding legitimate features`);
    addLine(`• ${biasedDecs} candidates have different outcomes between biased and fair models`);
    addLine(`• ${corrected} previously rejected candidates are now correctly selected`);
    addLine(`• DPD reduced from ${(d.biasedModel.demographicParityDiff * 100).toFixed(1)}% to ${(d.fairModel.demographicParityDiff * 100).toFixed(1)}%`);
    addGap(6);

    // Recommendation
    addLine("Recommendation", 14, true);
    addGap(2);
    addLine(`Deploy the mitigated model. The accuracy reduction (${((d.biasedModel.accuracy - d.fairModel.accuracy) * 100).toFixed(1)}%) is justified because the biased model's high accuracy was achieved through systematic discrimination against underrepresented groups. Schedule quarterly re-audits.`);
    addGap(6);

    // Technical Details
    addLine("Technical Details", 14, true);
    addGap(2);
    addLine("• Model: LogisticRegression (scikit-learn, max_iter=1000)");
    addLine("• Mitigation: ExponentiatedGradient with DemographicParity constraint (Fairlearn)");
    addLine("• Explainability: SHAP LinearExplainer on test set");
    addLine(`• Dataset: ${d.totalCandidates} candidates, 75/25 train/test split, stratified`);
    addGap(10);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Powered by scikit-learn · Fairlearn · SHAP · Google Gemini", w / 2, 285, { align: "center" });
    doc.text("FairLens AI — Ethical AI Auditing Platform", w / 2, 290, { align: "center" });

    doc.save("FairLens-Audit-Report.pdf");
  });
}

export default function ReportPage() {
  const d = analysisData;
  const [exporting, setExporting] = useState(false);
  const timestamp = new Date().toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });

  const biasedDecisions = d.candidates.filter(c => c.biasedPrediction !== c.fairPrediction).length;
  const corrected = d.candidates.filter(c => c.biasedPrediction === 0 && c.fairPrediction === 1).length;

  const handleExport = () => {
    setExporting(true);
    generatePDF(d);
    setTimeout(() => setExporting(false), 1000);
  };

  return (
    <AppShell>
      <div className="max-w-3xl space-y-6">
        <div className="animate-fade-up flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Audit Report</h1>
            <p className="text-sm text-muted-foreground mt-1">Generated {timestamp}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
            {exporting ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Download className="mr-1.5 h-3.5 w-3.5" />}
            Export PDF
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
              After mitigation, the gap reduced to{" "}
              <strong className="text-success">{(d.fairModel.demographicParityDiff * 100).toFixed(1)}%</strong> with
              accuracy at {(d.fairModel.accuracy * 100).toFixed(1)}%.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Findings</h3>
            <div className="space-y-2">
              <Finding type="issue" text={`Gender has the highest SHAP importance (${d.shapImportance[0]?.importance.toFixed(2)}) — far exceeding legitimate features`} />
              <Finding type="issue" text={`${biasedDecisions} candidates have different outcomes between biased and fair models`} />
              <Finding type="fix" text={`${corrected} previously rejected candidates are now correctly selected`} />
              <Finding type="fix" text={`DPD reduced from ${(d.biasedModel.demographicParityDiff * 100).toFixed(1)}% to ${(d.fairModel.demographicParityDiff * 100).toFixed(1)}%`} />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-card-foreground mb-2">Technical Details</h3>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
              <p>• <strong>Model:</strong> LogisticRegression (scikit-learn, max_iter=1000)</p>
              <p>• <strong>Mitigation:</strong> ExponentiatedGradient with DemographicParity (Fairlearn)</p>
              <p>• <strong>Explainability:</strong> SHAP LinearExplainer on test set</p>
              <p>• <strong>Dataset:</strong> {d.totalCandidates} candidates, 75/25 train/test split</p>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-card-foreground mb-2">Recommendation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deploy the mitigated model. The {((d.biasedModel.accuracy - d.fairModel.accuracy) * 100).toFixed(1)}% accuracy
              reduction is justified — the biased model achieves high accuracy through systematic discrimination. Schedule quarterly re-audits.
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
