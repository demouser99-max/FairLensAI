import shap
import numpy as np


def compute_shap_importance(model, X_train, X_test, feature_names):
    explainer = shap.LinearExplainer(model, X_train)
    shap_values = explainer.shap_values(X_test)
    mean_abs = np.abs(shap_values).mean(axis=0)

    ranked = sorted(zip(feature_names, mean_abs.tolist()), key=lambda x: -x[1])
    return [{"feature": f, "importance": round(v, 4)} for f, v in ranked]
