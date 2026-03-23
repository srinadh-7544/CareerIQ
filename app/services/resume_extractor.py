import pdfplumber
import pandas as pd
import numpy as np
import re
import os
from app.utils.text_cleaner import clean_text

SKILLS_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'skills.csv')

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()

def extract_skills(cleaned_text: str) -> pd.DataFrame:
    skills_df = pd.read_csv(SKILLS_PATH)
    skills_df['found'] = skills_df['skill'].apply(
        lambda skill: bool(re.search(r'\b' + re.escape(skill) + r'\b', cleaned_text))
    )
    return skills_df[skills_df['found'] == True][['skill', 'category']].reset_index(drop=True)

def compute_match_score(resume_text: str, job_description: str) -> dict:
    skills_df = pd.read_csv(SKILLS_PATH)
    all_skills = skills_df['skill'].tolist()

    def build_vector(text: str) -> np.ndarray:
        cleaned = clean_text(text)
        return np.array([
            1 if re.search(r'\b' + re.escape(skill) + r'\b', cleaned) else 0
            for skill in all_skills
        ], dtype=float)

    resume_vec = build_vector(resume_text)
    job_vec    = build_vector(job_description)

    dot        = np.dot(resume_vec, job_vec)
    resume_norm = np.linalg.norm(resume_vec)
    job_norm    = np.linalg.norm(job_vec)

    similarity = float(dot / (resume_norm * job_norm)) if resume_norm and job_norm else 0.0

    matched = [all_skills[i] for i in range(len(all_skills)) if resume_vec[i] == 1 and job_vec[i] == 1]
    missing = [all_skills[i] for i in range(len(all_skills)) if resume_vec[i] == 0 and job_vec[i] == 1]
    extra   = [all_skills[i] for i in range(len(all_skills)) if resume_vec[i] == 1 and job_vec[i] == 0]

    return {
        "score":          round(similarity * 100, 1),
        "matched_skills": matched,
        "missing_skills": missing,
        "extra_skills":   extra
    }