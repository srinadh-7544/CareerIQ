import pandas as pd
import numpy as np
import os

SKILLS_PATH        = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'skills.csv')
LEARNING_PATH_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'learning_paths.csv')

def generate_skill_gap_report(matched_skills: list, missing_skills: list, extra_skills: list) -> dict:
    learning_df = pd.read_csv(LEARNING_PATH_FILE)

    # Filter to only missing skills
    missing_df = learning_df[learning_df['skill'].isin(missing_skills)].copy()

    # Sort missing skills by demand score descending — highest priority first
    missing_df = missing_df.sort_values('demand_score', ascending=False).reset_index(drop=True)

    # Assign priority rank using numpy
    missing_df['priority_rank'] = np.arange(1, len(missing_df) + 1)

    # Estimate total learning hours for all missing skills
    total_hours = int(missing_df['hours_to_learn'].sum())

    # Group missing skills by category
    grouped = missing_df.groupby('category')['skill'].apply(list).to_dict()

    # Build learning path list
    learning_path = missing_df[[
        'skill', 'category', 'demand_score',
        'hours_to_learn', 'free_resource',
        'resource_url', 'priority_rank'
    ]].to_dict(orient='records')

    # Score breakdown
    total_skills    = len(matched_skills) + len(missing_skills)
    readiness_score = round((len(matched_skills) / total_skills * 100), 1) if total_skills > 0 else 0

    return {
        "readiness_score":  readiness_score,
        "matched_skills":   matched_skills,
        "missing_skills":   missing_skills,
        "extra_skills":     extra_skills,
        "total_gap_hours":  total_hours,
        "skills_by_category": grouped,
        "learning_path":    learning_path,
        "summary": {
            "total_required":  total_skills,
            "skills_you_have": len(matched_skills),
            "skills_to_learn": len(missing_skills),
            "top_priority":    learning_path[0]['skill'] if learning_path else None
        }
    }