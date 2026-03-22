import { useState, useCallback } from "react";

type StreamState = {
  text: string;
  loading: boolean;
  error: string | null;
};

export function useAIExplain() {
  const [state, setState] = useState<StreamState>({ text: "", loading: false, error: null });

  const explain = useCallback(async (data: {
    biasedModel: any;
    fairModel: any;
    shapImportance: any[];
    groupMetricsBefore: any[];
    groupMetricsAfter: any[];
  }) => {
    setState({ text: "", loading: true, error: null });

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-explain`;

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(data),
      });

      if (!resp.ok || !resp.body) {
        const errBody = await resp.json().catch(() => ({ error: "Request failed" }));
        setState(prev => ({ ...prev, loading: false, error: errBody.error || "Request failed" }));
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;

          const json = line.slice(6).trim();
          if (json === "[DONE]") break;

          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              accumulated += content;
              setState({ text: accumulated, loading: true, error: null });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      setState(prev => ({ ...prev, loading: false }));
    } catch (e) {
      setState({ text: "", loading: false, error: e instanceof Error ? e.message : "Network error" });
    }
  }, []);

  return { ...state, explain };
}
