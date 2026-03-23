import pandas as pd
import numpy as np
import re
import os

SKILLS_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'skills.csv')

def get_all_skills() -> list:
    df = pd.read_csv(SKILLS_PATH)
    return df['skill'].tolist()

def build_vector(text: str, all_skills: list) -> np.ndarray:
    text = text.lower()
    return np.array([
        1 if re.search(r'\b' + re.escape(skill) + r'\b', text) else 0
        for skill in all_skills
    ], dtype=float)

def cosine_score(vec_a: np.ndarray, vec_b: np.ndarray) -> float:
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(vec_a, vec_b) / (norm_a * norm_b))

def match_resume_to_jobs(resume_text: str, jobs: list) -> list:
    all_skills   = get_all_skills()
    resume_vec   = build_vector(resume_text, all_skills)
    results      = []

    for job in jobs:
        job_text = f"{job['title']} {job['description']} {job['skills']}"
        job_vec  = build_vector(job_text, all_skills)
        score    = cosine_score(resume_vec, job_vec)

        resume_skills = set(s for s, v in zip(all_skills, resume_vec) if v == 1)
        job_skills    = set(s for s, v in zip(all_skills, job_vec)    if v == 1)

        results.append({
            "job_id":         job["id"],
            "title":          job["title"],
            "company":        job["company"],
            "location":       job["location"],
            "salary_min":     job["salary_min"],
            "salary_max":     job["salary_max"],
            "experience":     job["experience"],
            "match_score":    round(score * 100, 1),
            "matched_skills": sorted(resume_skills & job_skills),
            "missing_skills": sorted(job_skills - resume_skills),
            "verdict":        "Strong match"   if score >= 0.7
                              else "Good match"    if score >= 0.5
                              else "Moderate match" if score >= 0.3
                              else "Weak match"
        })

    return sorted(results, key=lambda x: x["match_score"], reverse=True)


def match_job_to_candidates(job_text: str, candidates: list) -> list:
    all_skills = get_all_skills()
    job_vec    = build_vector(job_text, all_skills)
    results    = []

    for candidate in candidates:
        candidate_vec = build_vector(candidate["skills"] or "", all_skills)
        score         = cosine_score(job_vec, candidate_vec)

        job_skills       = set(s for s, v in zip(all_skills, job_vec)       if v == 1)
        candidate_skills = set(s for s, v in zip(all_skills, candidate_vec) if v == 1)

        results.append({
            "candidate_id":   candidate["id"],
            "name":           candidate["name"],
            "email":          candidate["email"],
            "experience":     candidate["experience"],
            "match_score":    round(score * 100, 1),
            "matched_skills": sorted(job_skills & candidate_skills),
            "missing_skills": sorted(job_skills - candidate_skills),
            "verdict":        "Strong match"    if score >= 0.7
                              else "Good match"     if score >= 0.5
                              else "Moderate match" if score >= 0.3
                              else "Weak match"
        })

    return sorted(results, key=lambda x: x["match_score"], reverse=True)