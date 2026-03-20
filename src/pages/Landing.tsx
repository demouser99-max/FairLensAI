import { useNavigate } from "react-router-dom";
import { BarChart3, Shield, Eye, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const pillars = [
  { icon: Eye, title: "Detect", desc: "Surface hidden bias in hiring models using Fairlearn metrics" },
  { icon: Sparkles, title: "Explain", desc: "Understand why decisions are made with SHAP explainability" },
  { icon: Shield, title: "Fix", desc: "Apply algorithmic fairness to correct biased outcomes" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BarChart3 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">FairLens AI</span>
          </div>
          <Button size="sm" onClick={() => navigate("/dashboard")}>
            Launch App <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16">
        <div className="animate-fade-up max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Shield className="h-3 w-3 text-primary" />
            Google Solution Challenge 2026
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground leading-[1.1] sm:text-5xl">
            Audit AI hiring decisions for fairness
          </h1>
          <p className="mt-4 max-w-lg text-lg text-muted-foreground leading-relaxed">
            Upload your dataset. Detect demographic bias. Understand why it happens. Fix it with one click — powered by Fairlearn and SHAP.
          </p>
          <div className="mt-8 flex gap-3">
            <Button size="lg" onClick={() => navigate("/dashboard")}>
              Get Started <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/analysis")}>
              View Demo Analysis
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-3">
          {pillars.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={`animate-fade-up stagger-${i + 1} group rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow`}
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

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Built with Google Cloud · Fairlearn · SHAP · Gemini
      </footer>
    </div>
  );
}
