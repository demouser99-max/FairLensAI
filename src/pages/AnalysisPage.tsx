import { useState, useCallback } from "react";
import { AppShell } from "@/components/AppShell";
import { BiasComparisonChart } from "@/components/BiasComparisonChart";
import { ShapWaterfall } from "@/components/ShapWaterfall";
import { FairnessGauge } from "@/components/FairnessGauge";
import { CandidateTable } from "@/components/CandidateTable";
import { BeforeAfterPanel } from "@/components/BeforeAfterPanel";
import { analysisData } from "@/lib/mock-data";
import { Sparkles, ShieldCheck, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AnalysisPage() {
  const d = analysisData;
  const [mitigated, setMitigated] = useState(false);
  const [fixing, setFixing] = useState(false);

  const handleFixBias = useCallback(() => {
    setFixing(true);
    setTimeout(() => {
      setMitigated(true);
      setFixing(false);
    }, 2000);
  }, []);

  const model = mitigated ? d.fairModel : d.biasedModel;
  const riskLevel = model.biasScore <= 0.1 ? "Low Risk" : model.biasScore <= 0.3 ? "Medium Risk" : "High Risk";
  const riskColor = model.biasScore <= 0.1 ? "text-success" : model.biasScore <= 0.3 ? "text-warning" : "text-destructive";

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="animate-fade-up flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bias Analysis Results</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {d.totalCandidates} candidates · {d.testSize} test samples ·{" "}
              {mitigated ? "Fair model active" : "Biased model detected"}
            </p>
          </div>
          {!mitigated && (
            <Button
              size="lg"
              onClick={handleFixBias}
              disabled={fixing}
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transition-all active:scale-[0.97]"
            >
              {fixing ? (
                <span className="animate-pulse-slow flex items-center gap-2">
                  <Zap className="h-4 w-4" /> Applying Fairlearn Mitigation...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Fix Bias
                </span>
              )}
            </Button>
          )}
          {mitigated && (
            <div className="flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-medium text-success animate-scale-in">
              <ShieldCheck className="h-4 w-4" /> ExponentiatedGradient Applied
            </div>
          )}
        </div>

        {/* Quantitative scores — real ML values */}
        <div className="grid gap-4 sm:grid-cols-3 animate-fade-up stagger-1">
          <ScoreCard
            label="Bias Score"
            value={model.biasScore.toFixed(4)}
            subtitle={riskLevel}
            subtitleColor={riskColor}
            mitigated={mitigated}
          />
          <ScoreCard
            label="Demographic Parity Diff"
            value={`${(model.demographicParityDiff * 100).toFixed(1)}%`}
            subtitle={mitigated ? "Within fair threshold" : "Severe disparity"}
            subtitleColor={mitigated ? "text-success" : "text-destructive"}
            mitigated={mitigated}
          />
          <ScoreCard
            label="Equal Opportunity Diff"
            value={`${(model.equalOpportunityDiff * 100).toFixed(1)}%`}
            subtitle={mitigated ? "Improved" : "Exceeds acceptable range"}
            subtitleColor={mitigated ? "text-success" : "text-destructive"}
            mitigated={mitigated}
          />
        </div>

        {/* Accuracy tradeoff alert */}
        {mitigated && (
          <div className="animate-scale-in rounded-xl border border-warning/30 bg-warning/5 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-card-foreground">Accuracy Tradeoff</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Model accuracy changed from <span className="font-mono font-medium">{(d.biasedModel.accuracy * 100).toFixed(1)}%</span> →{" "}
                <span className="font-mono font-medium">{(d.fairModel.accuracy * 100).toFixed(1)}%</span> ({((d.biasedModel.accuracy - d.fairModel.accuracy) * 100).toFixed(1)}% decrease). 
                This tradeoff eliminates systematic discrimination against female candidates.
              </p>
            </div>
          </div>
        )}

        {mitigated && (
          <div className="animate-scale-in">
            <BeforeAfterPanel
              biasedAccuracy={d.biasedModel.accuracy}
              fairAccuracy={d.fairModel.accuracy}
              biasedScore={d.biasedModel.biasScore}
              fairScore={d.fairModel.biasScore}
              biasedDPD={d.biasedModel.demographicParityDiff}
              fairDPD={d.fairModel.demographicParityDiff}
            />
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2 animate-fade-up stagger-2">
          <FairnessGauge
            label="Demographic Parity"
            before={d.biasedModel.demographicParityDiff}
            after={mitigated ? d.fairModel.demographicParityDiff : undefined}
          />
          <FairnessGauge
            label="Equal Opportunity"
            before={d.biasedModel.equalOpportunityDiff}
            after={mitigated ? d.fairModel.equalOpportunityDiff : undefined}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2 animate-fade-up stagger-3">
          <BiasComparisonChart
            before={d.groupMetricsBefore}
            after={mitigated ? d.groupMetricsAfter : undefined}
            metric="selectionRate"
            title="Selection Rate by Group"
          />
          <BiasComparisonChart
            before={d.groupMetricsBefore}
            after={mitigated ? d.groupMetricsAfter : undefined}
            metric="truePositiveRate"
            title="True Positive Rate by Group"
          />
        </div>

        <div className="animate-fade-up stagger-4">
          <ShapWaterfall features={d.shapImportance} />
        </div>

        <div className="animate-fade-up stagger-5">
          <CandidateTable candidates={d.candidates} showFair={mitigated} />
        </div>

        {mitigated && (
          <div className="animate-fade-up rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-card-foreground mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              AI-Generated Insight (Gemini)
            </h3>
            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed text-sm space-y-3">
              <p>
                The hiring model exhibits <strong className="text-destructive">severe gender-based bias</strong>. Male candidates
                have a 92% selection rate vs. only 22% for female candidates — a 70.2% demographic parity gap.
              </p>
              <p>
                <strong>Root cause:</strong> The "Gender" feature has the highest SHAP importance (2.37), meaning the
                model treats gender as the strongest predictor — far exceeding legitimate features like Experience (1.58)
                or Tech Score (0.81).
              </p>
              <p>
                <strong>After applying Fairlearn's ExponentiatedGradient with DemographicParity constraint:</strong>
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Demographic parity gap: <span className="text-destructive font-mono">70.2%</span> → <span className="text-success font-mono">7.7%</span></li>
                <li>Selection rates converged: Male 74.3%, Female 66.7%</li>
                <li>Female TPR improved from 70% to 100%</li>
                <li>Accuracy tradeoff: 89.0% → 71.5% (17.5% decrease)</li>
              </ul>
              <p>
                <strong>Recommendation:</strong> Deploy the mitigated model. While accuracy decreases, the biased model's
                high accuracy was achieved by systematically rejecting qualified female candidates. The fair model
                produces equitable outcomes aligned with anti-discrimination standards.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function ScoreCard({
  label,
  value,
  subtitle,
  subtitleColor,
  mitigated,
}: {
  label: string;
  value: string;
  subtitle: string;
  subtitleColor: string;
  mitigated: boolean;
}) {
  return (
    <div className={cn(
      "rounded-xl border bg-card p-5 shadow-sm transition-all",
      mitigated ? "border-success/30" : "border-border"
    )}>
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-bold tracking-tight text-card-foreground font-mono">{value}</p>
      <p className={cn("text-xs font-medium mt-1", subtitleColor)}>{subtitle}</p>
    </div>
  );
}
