import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder


def load_and_encode(df: pd.DataFrame, target: str, sensitive: str):
    encoders = {}
    X = df.drop(columns=[target])
    y = df[target].values

    for col in X.select_dtypes(include=["object", "category"]).columns:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
        encoders[col] = le

    sensitive_values = df[sensitive].values
    feature_names = X.columns.tolist()

    return X.values, y, sensitive_values, feature_names, encoders
