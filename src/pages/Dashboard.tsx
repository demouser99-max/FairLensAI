import { AppShell } from "@/components/AppShell";
import { MetricCard } from "@/components/MetricCard";
import { analysisData } from "@/lib/mock-data";
import { Users, AlertTriangle, CheckCircle2, TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FairnessGauge } from "@/components/FairnessGauge";

export default function Dashboard() {
  const navigate = useNavigate();
  const d = analysisData;

  const biasedDecisions = d.candidates.filter(c => c.biasedPrediction !== c.fairPrediction).length;
  const corrected = d.candidates.filter(c => c.biasedPrediction === 0 && c.fairPrediction === 1).length;

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="animate-fade-up">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real metrics from scikit-learn + Fairlearn on {d.totalCandidates}-candidate hiring dataset
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up stagger-1">
          <MetricCard
            label="Candidates Analyzed"
            value={d.totalCandidates.toLocaleString()}
            icon={Users}
            subtitle={`${d.testSize} in test set`}
          />
          <MetricCard
            label="Biased Decisions"
            value={biasedDecisions}
            icon={AlertTriangle}
            trend="down"
            trendLabel={`${corrected} correctable`}
          />
          <MetricCard
            label="Biased Accuracy"
            value={`${(d.biasedModel.accuracy * 100).toFixed(1)}%`}
            icon={TrendingUp}
            subtitle={`Fair: ${(d.fairModel.accuracy * 100).toFixed(1)}%`}
          />
          <MetricCard
            label="Bias Score"
            value={d.biasedModel.biasScore.toFixed(2)}
            icon={CheckCircle2}
            trend="down"
            trendLabel={`After: ${d.fairModel.biasScore.toFixed(2)}`}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2 animate-fade-up stagger-2">
          <FairnessGauge
            label="Demographic Parity"
            before={d.biasedModel.demographicParityDiff}
            after={d.fairModel.demographicParityDiff}
          />
          <FairnessGauge
            label="Equal Opportunity"
            before={d.biasedModel.equalOpportunityDiff}
            after={d.fairModel.equalOpportunityDiff}
          />
        </div>

        <div className="animate-fade-up stagger-3 flex gap-3">
          <Button onClick={() => navigate("/upload")}>
            Upload New Dataset <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => navigate("/analysis")}>
            View Full Analysis
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
