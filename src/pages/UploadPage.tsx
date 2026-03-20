import { useState, useCallback } from "react";
import { AppShell } from "@/components/AppShell";
import { Upload, FileSpreadsheet, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function UploadPage() {
  const navigate = useNavigate();
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.name.endsWith(".csv")) setFile(dropped);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => navigate("/analysis"), 2200);
  };

  return (
    <AppShell>
      <div className="max-w-2xl space-y-6">
        <div className="animate-fade-up">
          <h1 className="text-2xl font-bold tracking-tight">Upload Dataset</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload a CSV with candidate data. Include a sensitive attribute column (e.g., gender, age_group).
          </p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "animate-fade-up stagger-1 flex flex-col items-center gap-4 rounded-xl border-2 border-dashed p-12 transition-colors cursor-pointer",
            dragOver ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40",
            file && "border-success bg-success/5"
          )}
          onClick={() => document.getElementById("csv-input")?.click()}
        >
          {file ? (
            <>
              <CheckCircle2 className="h-10 w-10 text-success" />
              <div className="text-center">
                <p className="font-medium text-card-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(file.size / 1024).toFixed(1)} KB · Ready for analysis
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-card-foreground">Drop your CSV here</p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse · Max 20MB</p>
              </div>
            </>
          )}
          <input id="csv-input" type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
        </div>

        <div className="animate-fade-up stagger-2 rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-2 flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-primary" /> Expected Format
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-1.5 pr-4 text-left">experience</th>
                  <th className="py-1.5 pr-4 text-left">education</th>
                  <th className="py-1.5 pr-4 text-left">tech_score</th>
                  <th className="py-1.5 pr-4 text-left">gender</th>
                  <th className="py-1.5 text-left">hired</th>
                </tr>
              </thead>
              <tbody className="text-card-foreground">
                <tr><td className="py-1 pr-4">5</td><td className="pr-4">Masters</td><td className="pr-4">82</td><td className="pr-4">Female</td><td>0</td></tr>
                <tr><td className="py-1 pr-4">3</td><td className="pr-4">Bachelors</td><td className="pr-4">71</td><td className="pr-4">Male</td><td>1</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {file && (
          <div className="animate-scale-in">
            <Button size="lg" onClick={runAnalysis} disabled={analyzing}>
              {analyzing ? (
                <>
                  <span className="animate-pulse-slow">Analyzing bias patterns...</span>
                </>
              ) : (
                <>
                  Run Bias Analysis <ArrowRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
