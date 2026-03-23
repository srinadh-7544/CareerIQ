import pandas as pd
import numpy as np
import os

SALARY_DATA_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'salary_data.csv')

LOCATION_TIERS = {
    "bangalore":  1,
    "mumbai":     1,
    "delhi":      1,
    "hyderabad":  1,
    "pune":       2,
    "chennai":    2,
    "kolkata":    2,
    "other":      3
}

ML_SKILLS    = {'machine learning', 'tensorflow', 'scikit-learn', 'numpy', 'pandas'}
CLOUD_SKILLS = {'aws', 'azure', 'cloud'}
DOCKER_SKILLS = {'docker'}

def extract_features(role: str, experience: int, location: str, skills: list) -> np.ndarray:
    skills_lower  = [s.lower() for s in skills]
    location_tier = LOCATION_TIERS.get(location.lower(), 3)
    has_ml        = 1 if any(s in ML_SKILLS    for s in skills_lower) else 0
    has_cloud     = 1 if any(s in CLOUD_SKILLS  for s in skills_lower) else 0
    has_docker    = 1 if any(s in DOCKER_SKILLS for s in skills_lower) else 0
    skill_count   = len(skills)

    return np.array([experience, location_tier, skill_count, has_ml, has_cloud, has_docker])

def train_model(role: str) -> tuple:
    df = pd.read_csv(SALARY_DATA_PATH)

    # Filter by role — if no exact match, use all data
    role_df = df[df['role'].str.lower() == role.lower()]
    if len(role_df) < 3:
        role_df = df

    X = role_df[['experience_years', 'location_tier', 'skill_count', 'has_ml', 'has_cloud', 'has_docker']].values
    y = role_df['salary'].values

    # Add bias column (column of 1s) for intercept
    X_b = np.c_[np.ones(X.shape[0]), X]

    # Normal equation: theta = (X^T X)^-1 X^T y
    # This is pure numpy linear regression — no sklearn needed
    theta = np.linalg.pinv(X_b.T @ X_b) @ X_b.T @ y

    return theta, role_df

def predict_salary(role: str, experience: int, location: str, skills: list) -> dict:
    theta, role_df = train_model(role)

    features = extract_features(role, experience, location, skills)
    X_input  = np.r_[1, features]  # add bias

    predicted = float(X_input @ theta)
    predicted = max(predicted, 200000)  # floor at 2 LPA

    # Calculate range — ±12%
    lower = round(predicted * 0.88 / 100000) * 100000
    upper = round(predicted * 1.12 / 100000) * 100000
    mid   = round(predicted / 100000) * 100000

    # Calculate R² score on training data
    X_b   = np.c_[np.ones(len(role_df)), role_df[['experience_years','location_tier','skill_count','has_ml','has_cloud','has_docker']].values]
    y     = role_df['salary'].values
    y_hat = X_b @ theta
    ss_res = np.sum((y - y_hat) ** 2)
    ss_tot = np.sum((y - np.mean(y)) ** 2)
    r2    = round(1 - ss_res / ss_tot, 2)

    # Insight flags
    insights = []
    features_arr = extract_features(role, experience, location, skills)
    if features_arr[3] == 0:
        insights.append("Adding ML skills (pandas, numpy, scikit-learn) could increase salary by 15–25%")
    if features_arr[4] == 0:
        insights.append("Cloud skills (AWS, Azure) add 10–20% salary premium")
    if features_arr[5] == 0:
        insights.append("Docker/DevOps knowledge adds 8–15% to compensation")
    if experience < 3:
        insights.append("Salary grows fastest in years 2–5 — focus on building a strong portfolio")

    return {
        "predicted_salary": int(mid),
        "salary_range": {
            "min": int(lower),
            "max": int(upper)
        },
        "role":       role,
        "experience": experience,
        "location":   location,
        "model_r2":   r2,
        "insights":   insights,
        "formatted": {
            "mid":   f"₹{mid/100000:.1f} LPA",
            "lower": f"₹{lower/100000:.1f} LPA",
            "upper": f"₹{upper/100000:.1f} LPA"
        }
    }