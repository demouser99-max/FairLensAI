import { AppShell } from "@/components/AppShell";
import { BiasComparisonChart } from "@/components/BiasComparisonChart";
import { ShapWaterfall } from "@/components/ShapWaterfall";
import { FairnessGauge } from "@/components/FairnessGauge";
import { CandidateTable } from "@/components/CandidateTable";
import { sampleAnalysis, sampleDatasetPreview, geminiExplanation } from "@/lib/mock-data";
import { Sparkles } from "lucide-react";

export default function AnalysisPage() {
  const d = sampleAnalysis;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="animate-fade-up">
          <h1 className="text-2xl font-bold tracking-tight">Bias Analysis Results</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comparing biased vs. mitigated model · {d.totalCandidates.toLocaleString()} candidates
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 animate-fade-up stagger-1">
          <FairnessGauge label="Demographic Parity" before={d.demographicParity.before} after={d.demographicParity.after} />
          <FairnessGauge label="Equal Opportunity" before={d.equalOpportunity.before} after={d.equalOpportunity.after} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2 animate-fade-up stagger-2">
          <BiasComparisonChart
            before={d.biasMetrics.before}
            after={d.biasMetrics.after}
            metric="selectionRate"
            title="Selection Rate by Group — Before vs After"
          />
          <BiasComparisonChart
            before={d.biasMetrics.before}
            after={d.biasMetrics.after}
            metric="truePositiveRate"
            title="True Positive Rate by Group — Before vs After"
          />
        </div>

        <div className="animate-fade-up stagger-3">
          <ShapWaterfall features={d.shapValues} />
        </div>

        <div className="animate-fade-up stagger-4">
          <CandidateTable candidates={sampleDatasetPreview} />
        </div>

        <div className="animate-fade-up rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-card-foreground mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            AI-Generated Explanation (Gemini)
          </h3>
          <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
            {geminiExplanation}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
