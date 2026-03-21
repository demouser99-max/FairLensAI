import io
import pandas as pd
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from model import train_biased_model
from fairness import compute_fairness_metrics, compute_group_metrics, mitigate_bias
from explainability import compute_shap_importance
from utils import load_and_encode

app = FastAPI(title="FairLens API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

_cache = {}


@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    target: str = Form("hired"),
    sensitive: str = Form("gender"),
):
    raw = await file.read()
    df = pd.read_csv(io.BytesIO(raw))
    X, y, sens, feature_names, encoders = load_and_encode(df, target, sensitive)

    result = train_biased_model(X, y, sens)
    metrics = compute_fairness_metrics(result["y_test"], result["y_pred"], result["s_test"])
    groups = compute_group_metrics(result["y_test"], result["y_pred"], result["s_test"])
    shap_vals = compute_shap_importance(result["model"], result["X_train"], result["X_test"], feature_names)

    _cache["last"] = {**result, "feature_names": feature_names}

    return {
        "accuracy": result["accuracy"],
        "biasScore": round(metrics["biasScore"], 4),
        "demographicParityDiff": round(metrics["demographicParityDiff"], 4),
        "equalOpportunityDiff": round(metrics["equalOpportunityDiff"], 4),
        "groupMetrics": groups,
        "shapImportance": shap_vals,
        "totalCandidates": len(df),
        "testSize": len(result["y_test"]),
    }


@app.post("/mitigate")
async def mitigate():
    if "last" not in _cache:
        return {"error": "Run /analyze first"}

    c = _cache["last"]
    fair = mitigate_bias(c["X_train"], c["y_train"], c["s_train"], c["X_test"], c["y_test"], c["s_test"])
    fair_metrics = compute_fairness_metrics(c["y_test"], fair["y_pred"], c["s_test"])
    fair_groups = compute_group_metrics(c["y_test"], fair["y_pred"], c["s_test"])

    return {
        "accuracy": fair["accuracy"],
        "biasScore": round(fair_metrics["biasScore"], 4),
        "demographicParityDiff": round(fair_metrics["demographicParityDiff"], 4),
        "equalOpportunityDiff": round(fair_metrics["equalOpportunityDiff"], 4),
        "groupMetrics": fair_groups,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
