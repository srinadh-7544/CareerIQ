import pandas as pd
import numpy as np
import os

SALARY_PATH   = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'salary_data.csv')
LEARNING_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'learning_paths.csv')

def get_market_analytics() -> dict:
    salary_df   = pd.read_csv(SALARY_PATH)
    learning_df = pd.read_csv(LEARNING_PATH)

    # Average salary by role
    avg_salary_by_role = (
        salary_df.groupby('role')['salary']
        .mean()
        .round(-3)
        .sort_values(ascending=False)
        .reset_index()
        .rename(columns={'salary': 'avg_salary'})
    )
    avg_salary_by_role['avg_salary_lpa'] = (avg_salary_by_role['avg_salary'] / 100000).round(1)

    # Salary growth by experience
    avg_salary_by_exp = (
        salary_df.groupby('experience_years')['salary']
        .mean()
        .round(-3)
        .reset_index()
        .rename(columns={'salary': 'avg_salary'})
    )
    avg_salary_by_exp['avg_salary_lpa'] = (avg_salary_by_exp['avg_salary'] / 100000).round(1)

    # Top skills by demand score
    top_skills = (
        learning_df.sort_values('demand_score', ascending=False)
        .head(10)[['skill', 'demand_score', 'category']]
        .reset_index(drop=True)
    )

    # Skills by category count
    skills_by_category = (
        learning_df.groupby('category')['skill']
        .count()
        .reset_index()
        .rename(columns={'skill': 'count'})
        .sort_values('count', ascending=False)
    )

    # Average hours to learn by category
    avg_hours = (
        learning_df.groupby('category')['hours_to_learn']
        .mean()
        .round(1)
        .reset_index()
        .rename(columns={'hours_to_learn': 'avg_hours'})
        .sort_values('avg_hours', ascending=False)
    )

    # Premium skills (ML, cloud, docker) salary impact
    ml_avg    = salary_df[salary_df['has_ml']     == 1]['salary'].mean()
    no_ml_avg = salary_df[salary_df['has_ml']     == 0]['salary'].mean()
    cl_avg    = salary_df[salary_df['has_cloud']   == 1]['salary'].mean()
    no_cl_avg = salary_df[salary_df['has_cloud']   == 0]['salary'].mean()
    dk_avg    = salary_df[salary_df['has_docker']  == 1]['salary'].mean()
    no_dk_avg = salary_df[salary_df['has_docker']  == 0]['salary'].mean()

    skill_premium = [
        {
            "skill":      "Machine Learning",
            "with_skill": round(ml_avg / 100000, 1),
            "without":    round(no_ml_avg / 100000, 1),
            "premium_pct": round((ml_avg - no_ml_avg) / no_ml_avg * 100, 1)
        },
        {
            "skill":      "Cloud (AWS/Azure)",
            "with_skill": round(cl_avg / 100000, 1),
            "without":    round(no_cl_avg / 100000, 1),
            "premium_pct": round((cl_avg - no_cl_avg) / no_cl_avg * 100, 1)
        },
        {
            "skill":      "Docker",
            "with_skill": round(dk_avg / 100000, 1),
            "without":    round(no_dk_avg / 100000, 1),
            "premium_pct": round((dk_avg - no_dk_avg) / no_dk_avg * 100, 1)
        }
    ]

    return {
        "avg_salary_by_role":    avg_salary_by_role.to_dict(orient='records'),
        "salary_by_experience":  avg_salary_by_exp.to_dict(orient='records'),
        "top_skills_by_demand":  top_skills.to_dict(orient='records'),
        "skills_by_category":    skills_by_category.to_dict(orient='records'),
        "avg_hours_by_category": avg_hours.to_dict(orient='records'),
        "skill_premium":         skill_premium,
        "summary": {
            "total_roles":        int(salary_df['role'].nunique()),
            "total_skills":       int(len(learning_df)),
            "highest_paying_role": avg_salary_by_role.iloc[0]['role'],
            "most_demanded_skill": top_skills.iloc[0]['skill'],
            "avg_market_salary":  round(salary_df['salary'].mean() / 100000, 1)
        }
    }