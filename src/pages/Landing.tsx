import { useNavigate } from "react-router-dom";
import { BarChart3, Shield, Eye, ArrowRight, Sparkles, Lock, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analysisData } from "@/lib/mock-data";

const pillars = [
  { icon: Eye, title: "Detect", desc: "Surface hidden bias using Fairlearn's demographic parity and equal opportunity metrics on real ML models" },
  { icon: Sparkles, title: "Explain", desc: "See exactly which features drive unfair outcomes through SHAP-based explainability analysis" },
  { icon: Shield, title: "Fix", desc: "One-click mitigation using ExponentiatedGradient — see quantified before vs after results" },
];

const trustPoints = [
  { icon: Lock, text: "Data processed locally, never stored" },
  { icon: Shield, text: "Privacy-first ethical AI auditing" },
  { icon: Globe, text: "Open-source: Fairlearn + SHAP + scikit-learn" },
];

export default function Landing() {
  const navigate = useNavigate();
  const d = analysisData;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BarChart3 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">FairLens</span>
          </div>
          <Button size="sm" onClick={() => navigate("/dashboard")}>
            Launch App <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 pt-24 pb-20">
        <div className="animate-fade-up max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Zap className="h-3 w-3 text-primary" />
            AI Bias Detection & Correction Platform
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl" style={{ lineHeight: 1.08 }}>
            Detect and Fix Bias in AI Decisions
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground leading-relaxed">
            Upload your hiring dataset. Quantify bias with real ML metrics. Fix it with one click — powered by
            scikit-learn, Fairlearn, SHAP, and Gemini.
          </p>
          <div className="mt-10 flex gap-3">
            <Button size="lg" onClick={() => navigate("/upload")}>
              Start Analysis <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/analysis")}>
              View Demo Results
            </Button>
          </div>
        </div>
      </section>

      {/* Live stats strip */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="animate-fade-up stagger-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Candidates", value: d.totalCandidates.toString() },
            { label: "Bias Score (Before)", value: d.biasedModel.biasScore.toFixed(2) },
            { label: "Bias Score (After)", value: d.fairModel.biasScore.toFixed(2) },
            { label: "DPD Reduction", value: `${((1 - d.fairModel.demographicParityDiff / d.biasedModel.demographicParityDiff) * 100).toFixed(0)}%` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-2xl font-bold font-mono text-card-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {pillars.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={`animate-fade-up stagger-${i + 2} rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2.5">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="animate-fade-up stagger-4 rounded-xl border border-border bg-card p-8 shadow-sm">
          <h2 className="text-sm font-semibold text-card-foreground mb-1">How It Works</h2>
          <p className="text-xs text-muted-foreground mb-6">Three steps to a fair hiring model</p>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: "01", label: "Upload CSV", detail: "Drop your hiring dataset with demographic columns" },
              { step: "02", label: "Run Analysis", detail: "We train biased + fair models, compute SHAP values" },
              { step: "03", label: "Fix & Export", detail: "One-click mitigation with downloadable audit report" },
            ].map(({ step, label, detail }) => (
              <div key={step} className="flex gap-3">
                <span className="text-2xl font-bold text-primary/20 leading-none">{step}</span>
                <div>
                  <p className="text-sm font-medium text-card-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="animate-fade-up stagger-5 flex flex-wrap items-center justify-center gap-6 rounded-xl border border-border bg-card/50 px-6 py-4">
          {trustPoints.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon className="h-3.5 w-3.5 text-success" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Built with scikit-learn · Fairlearn · SHAP · Google Gemini · Google Cloud
      </footer>
    </div>
  );
}
