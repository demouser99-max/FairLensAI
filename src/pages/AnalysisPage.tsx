import { useState, useCallback } from "react";
import { AppShell } from "@/components/AppShell";
import { BiasComparisonChart } from "@/components/BiasComparisonChart";
import { ShapWaterfall } from "@/components/ShapWaterfall";
import { FairnessGauge } from "@/components/FairnessGauge";
import { CandidateTable } from "@/components/CandidateTable";
import { BeforeAfterPanel } from "@/components/BeforeAfterPanel";
import { sampleAnalysis, sampleDatasetPreview, geminiExplanation } from "@/lib/mock-data";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AnalysisPage() {
  const d = sampleAnalysis;
  const [mitigated, setMitigated] = useState(false);
  const [fixing, setFixing] = useState(false);

  const handleFixBias = useCallback(() => {
    setFixing(true);
    setTimeout(() => {
      setMitigated(true);
      setFixing(false);
    }, 1800);
  }, []);

  const biasScore = mitigated ? 0.05 : 0.32;
  const riskLevel = biasScore <= 0.08 ? "Low Risk" : biasScore <= 0.2 ? "Medium Risk" : "High Risk";
  const riskColor = biasScore <= 0.08 ? "text-success" : biasScore <= 0.2 ? "text-warning" : "text-destructive";

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="animate-fade-up flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bias Analysis Results</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {d.totalCandidates.toLocaleString()} candidates · {mitigated ? "Mitigated model active" : "Biased model detected"}
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
                  <Zap className="h-4 w-4" /> Applying Fairness...
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
              <ShieldCheck className="h-4 w-4" /> Bias Mitigated
            </div>
          )}
        </div>

        {/* Quantitative scores */}
        <div className="grid gap-4 sm:grid-cols-3 animate-fade-up stagger-1">
          <ScoreCard
            label="Bias Score"
            value={biasScore.toFixed(2)}
            subtitle={riskLevel}
            subtitleColor={riskColor}
            mitigated={mitigated}
          />
          <ScoreCard
            label="Demographic Parity Gap"
            value={`${((mitigated ? d.demographicParity.after : d.demographicParity.before) * 100).toFixed(1)}%`}
            subtitle={mitigated ? "Within fair threshold" : "Exceeds acceptable range"}
            subtitleColor={mitigated ? "text-success" : "text-destructive"}
            mitigated={mitigated}
          />
          <ScoreCard
            label="Equal Opportunity Gap"
            value={`${((mitigated ? d.equalOpportunity.after : d.equalOpportunity.before) * 100).toFixed(1)}%`}
            subtitle={mitigated ? "Within fair threshold" : "Exceeds acceptable range"}
            subtitleColor={mitigated ? "text-success" : "text-destructive"}
            mitigated={mitigated}
          />
        </div>

        {mitigated && (
          <div className="animate-scale-in">
            <BeforeAfterPanel analysis={d} />
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2 animate-fade-up stagger-2">
          <FairnessGauge
            label="Demographic Parity"
            before={d.demographicParity.before}
            after={mitigated ? d.demographicParity.after : undefined}
          />
          <FairnessGauge
            label="Equal Opportunity"
            before={d.equalOpportunity.before}
            after={mitigated ? d.equalOpportunity.after : undefined}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2 animate-fade-up stagger-3">
          <BiasComparisonChart
            before={d.biasMetrics.before}
            after={mitigated ? d.biasMetrics.after : undefined}
            metric="selectionRate"
            title="Selection Rate by Group"
          />
          <BiasComparisonChart
            before={d.biasMetrics.before}
            after={mitigated ? d.biasMetrics.after : undefined}
            metric="truePositiveRate"
            title="True Positive Rate by Group"
          />
        </div>

        <div className="animate-fade-up stagger-4">
          <ShapWaterfall features={d.shapValues} />
        </div>

        <div className="animate-fade-up stagger-5">
          <CandidateTable candidates={sampleDatasetPreview} showFair={mitigated} />
        </div>

        {mitigated && (
          <div className="animate-fade-up rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-card-foreground mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              AI-Generated Insight (Gemini)
            </h3>
            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
              {geminiExplanation}
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
      <p className="text-3xl font-bold tracking-tight text-card-foreground tabular-nums">{value}</p>
      <p className={cn("text-xs font-medium mt-1", subtitleColor)}>{subtitle}</p>
    </div>
  );
}
