import { useState, useCallback } from "react";
import { AppShell } from "@/components/AppShell";
import { Upload, FileSpreadsheet, ArrowRight, CheckCircle2, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import Papa from "papaparse";

interface CsvPreview {
  columns: string[];
  rows: Record<string, string>[];
  totalRows: number;
}

export default function UploadPage() {
  const navigate = useNavigate();
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<CsvPreview | null>(null);
  const [target, setTarget] = useState("");
  const [sensitive, setSensitive] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const parseFile = (f: File) => {
    setFile(f);
    Papa.parse(f, {
      header: true,
      preview: 5,
      skipEmptyLines: true,
      complete: (result) => {
        const columns = result.meta.fields || [];
        setPreview({
          columns,
          rows: result.data as Record<string, string>[],
          totalRows: 0,
        });
        // auto-detect common columns
        const lower = columns.map(c => c.toLowerCase());
        const targetGuess = columns[lower.findIndex(c => ["hired", "selected", "outcome", "label", "target"].includes(c))];
        const sensitiveGuess = columns[lower.findIndex(c => ["gender", "sex", "race", "ethnicity", "age_group"].includes(c))];
        if (targetGuess) setTarget(targetGuess);
        if (sensitiveGuess) setSensitive(sensitiveGuess);
      },
    });
    // get total row count
    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setPreview(prev => prev ? { ...prev, totalRows: result.data.length } : null);
      },
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.name.endsWith(".csv")) parseFile(dropped);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) parseFile(selected);
  };

  const loadSample = async () => {
    const resp = await fetch("/sample-hiring-data.csv");
    const blob = await resp.blob();
    const sampleFile = new File([blob], "sample-hiring-data.csv", { type: "text/csv" });
    parseFile(sampleFile);
  };

  const runAnalysis = () => {
    setAnalyzing(true);
    // Store selections for analysis page
    sessionStorage.setItem("fairlens_target", target);
    sessionStorage.setItem("fairlens_sensitive", sensitive);
    setTimeout(() => navigate("/analysis"), 1500);
  };

  const canAnalyze = file && target && sensitive && target !== sensitive;

  return (
    <AppShell>
      <div className="max-w-3xl space-y-6">
        <div className="animate-fade-up">
          <h1 className="text-2xl font-bold tracking-tight">Upload Dataset</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload a CSV with candidate data, then select your target and sensitive columns.
          </p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "animate-fade-up stagger-1 flex flex-col items-center gap-4 rounded-xl border-2 border-dashed p-10 transition-colors cursor-pointer",
            dragOver ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40",
            file && "border-success bg-success/5"
          )}
          onClick={() => !file && document.getElementById("csv-input")?.click()}
        >
          {file ? (
            <>
              <CheckCircle2 className="h-10 w-10 text-success" />
              <div className="text-center">
                <p className="font-medium text-card-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(file.size / 1024).toFixed(1)} KB · {preview?.totalRows || "..."} rows · {preview?.columns.length || 0} columns
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setTarget(""); setSensitive(""); }}>
                Change file
              </Button>
            </>
          ) : (
            <>
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-card-foreground">Drop your CSV here</p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
              </div>
              <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); loadSample(); }}>
                <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> Use Sample Dataset
              </Button>
            </>
          )}
          <input id="csv-input" type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
        </div>

        {preview && (
          <>
            {/* Column Selection */}
            <div className="animate-fade-up stagger-2 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Target Column (what to predict)</label>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">Select column...</option>
                  {preview.columns.map(col => (
                    <option key={col} value={col} disabled={col === sensitive}>{col}</option>
                  ))}
                </select>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Sensitive Attribute (bias axis)</label>
                <select
                  value={sensitive}
                  onChange={(e) => setSensitive(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">Select column...</option>
                  {preview.columns.map(col => (
                    <option key={col} value={col} disabled={col === target}>{col}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Data Preview Table */}
            <div className="animate-fade-up stagger-3 rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
                <Table2 className="h-4 w-4 text-primary" /> Data Preview (first 5 rows)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="border-b border-border">
                      {preview.columns.map(col => (
                        <th key={col} className={cn(
                          "py-1.5 pr-3 text-left whitespace-nowrap",
                          col === target && "text-primary font-bold",
                          col === sensitive && "text-destructive font-bold"
                        )}>
                          {col}
                          {col === target && " 🎯"}
                          {col === sensitive && " ⚠️"}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-card-foreground">
                    {preview.rows.map((row, i) => (
                      <tr key={i} className="border-b border-border/50">
                        {preview.columns.map(col => (
                          <td key={col} className={cn(
                            "py-1 pr-3 whitespace-nowrap",
                            col === sensitive && "text-destructive"
                          )}>
                            {row[col] ?? ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {preview && (
          <div className="animate-scale-in">
            <Button size="lg" onClick={runAnalysis} disabled={analyzing || !canAnalyze}>
              {analyzing ? (
                <span className="animate-pulse-slow">Training models & computing fairness...</span>
              ) : !canAnalyze ? (
                "Select target and sensitive columns"
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
