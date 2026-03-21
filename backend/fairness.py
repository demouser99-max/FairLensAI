from fairlearn.metrics import demographic_parity_difference, equalized_odds_difference
from fairlearn.reductions import ExponentiatedGradient, DemographicParity
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix
import numpy as np


def compute_fairness_metrics(y_true, y_pred, sensitive):
    dpd = abs(demographic_parity_difference(y_true, y_pred, sensitive_features=sensitive))
    eod = abs(equalized_odds_difference(y_true, y_pred, sensitive_features=sensitive))
    bias_score = dpd * 0.6 + eod * 0.4
    return {"demographicParityDiff": dpd, "equalOpportunityDiff": eod, "biasScore": bias_score}


def compute_group_metrics(y_true, y_pred, sensitive):
    groups = sorted(set(sensitive))
    result = []
    for g in groups:
        mask = sensitive == g
        sel_rate = float(y_pred[mask].mean())
        cm = confusion_matrix(y_true[mask], y_pred[mask], labels=[0, 1])
        tpr = float(cm[1, 1] / max(cm[1].sum(), 1))
        result.append({"group": str(g), "selectionRate": round(sel_rate, 4), "truePositiveRate": round(tpr, 4)})
    return result


def mitigate_bias(X_train, y_train, s_train, X_test, y_test, s_test):
    constraint = DemographicParity()
    mitigator = ExponentiatedGradient(
        LogisticRegression(max_iter=1000, random_state=42),
        constraints=constraint,
    )
    mitigator.fit(X_train, y_train, sensitive_features=s_train)
    y_pred_fair = mitigator.predict(X_test)

    return {
        "model": mitigator,
        "y_pred": y_pred_fair,
        "accuracy": float(accuracy_score(y_test, y_pred_fair)),
    }
