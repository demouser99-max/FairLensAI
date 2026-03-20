import { AppShell } from "@/components/AppShell";
import { MetricCard } from "@/components/MetricCard";
import { sampleAnalysis } from "@/lib/mock-data";
import { Users, AlertTriangle, CheckCircle2, TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FairnessGauge } from "@/components/FairnessGauge";

export default function Dashboard() {
  const navigate = useNavigate();
  const d = sampleAnalysis;

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="animate-fade-up">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your latest bias audit</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up stagger-1">
          <MetricCard
            label="Candidates Analyzed"
            value={d.totalCandidates.toLocaleString()}
            icon={Users}
            subtitle="From uploaded dataset"
          />
          <MetricCard
            label="Biased Decisions"
            value={d.biasedDecisions}
            icon={AlertTriangle}
            trend="down"
            trendLabel={`${d.correctedDecisions} corrected`}
          />
          <MetricCard
            label="Model Accuracy"
            value={`${(d.accuracy * 100).toFixed(1)}%`}
            icon={TrendingUp}
            subtitle={`Fair model: ${(d.fairAccuracy * 100).toFixed(1)}%`}
          />
          <MetricCard
            label="Fairness Score"
            value="A-"
            icon={CheckCircle2}
            trend="up"
            trendLabel="After mitigation"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2 animate-fade-up stagger-2">
          <FairnessGauge
            label="Demographic Parity"
            before={d.demographicParity.before}
            after={d.demographicParity.after}
          />
          <FairnessGauge
            label="Equal Opportunity"
            before={d.equalOpportunity.before}
            after={d.equalOpportunity.after}
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
