import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { biasedModel, fairModel, shapImportance, groupMetricsBefore, groupMetricsAfter } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `You are an AI fairness expert analyzing a hiring model's bias audit results. Generate a concise, data-driven explanation.

BIASED MODEL:
- Accuracy: ${(biasedModel.accuracy * 100).toFixed(1)}%
- Demographic Parity Diff: ${(biasedModel.demographicParityDiff * 100).toFixed(1)}%
- Equal Opportunity Diff: ${(biasedModel.equalOpportunityDiff * 100).toFixed(1)}%
- Bias Score: ${biasedModel.biasScore.toFixed(4)}

FAIR MODEL (after mitigation):
- Accuracy: ${(fairModel.accuracy * 100).toFixed(1)}%
- Demographic Parity Diff: ${(fairModel.demographicParityDiff * 100).toFixed(1)}%
- Equal Opportunity Diff: ${(fairModel.equalOpportunityDiff * 100).toFixed(1)}%
- Bias Score: ${fairModel.biasScore.toFixed(4)}

SHAP Feature Importance (top features):
${shapImportance.map((f: any) => `- ${f.feature}: ${f.importance.toFixed(4)}`).join("\n")}

GROUP METRICS BEFORE:
${groupMetricsBefore.map((g: any) => `- ${g.group}: Selection Rate ${(g.selectionRate * 100).toFixed(1)}%, TPR ${(g.truePositiveRate * 100).toFixed(1)}%`).join("\n")}

GROUP METRICS AFTER:
${groupMetricsAfter.map((g: any) => `- ${g.group}: Selection Rate ${(g.selectionRate * 100).toFixed(1)}%, TPR ${(g.truePositiveRate * 100).toFixed(1)}%`).join("\n")}

Write a 4-paragraph analysis covering:
1. The bias problem detected (with specific numbers)
2. Root cause from SHAP (which features drive bias)
3. What mitigation achieved (before vs after numbers)
4. Recommendation with accuracy tradeoff justification

Use bold for key metrics. Be specific, not generic. Write as a professional AI auditor.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an expert AI fairness auditor. Provide clear, data-driven analysis with specific numbers. Use markdown formatting." },
          { role: "user", content: prompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Settings → Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("Gateway error:", status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-explain error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
