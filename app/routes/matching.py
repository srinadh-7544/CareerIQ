import os
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.job import Job, Candidate
from app.services.resume_extractor import extract_text_from_pdf, extract_skills
from app.services.matcher import match_resume_to_jobs, match_job_to_candidates
from app.utils.text_cleaner import clean_text

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class JobPost(BaseModel):
    title:       str
    company:     str
    location:    str
    description: str
    skills:      str
    experience:  int
    salary_min:  int
    salary_max:  int
    posted_by:   str


# ── Recruiter: post a job ────────────────────────────────────────────
@router.post("/jobs/post")
def post_job(job: JobPost, db: Session = Depends(get_db)):
    record = Job(**job.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"message": "Job posted successfully", "job_id": record.id, "title": record.title}


# ── Recruiter: get all jobs ─────────────────────────────────────────
@router.get("/jobs")
def get_all_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).order_by(Job.created_at.desc()).all()
    return [
        {
            "id":          j.id,
            "title":       j.title,
            "company":     j.company,
            "location":    j.location,
            "description": j.description,
            "skills":      j.skills,
            "experience":  j.experience,
            "salary_min":  j.salary_min,
            "salary_max":  j.salary_max,
            "posted_by":   j.posted_by,
            "created_at":  str(j.created_at)
        }
        for j in jobs
    ]


# ── Recruiter: rank candidates for a job ───────────────────────────
@router.get("/jobs/{job_id}/candidates")
def rank_candidates_for_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    candidates = db.query(Candidate).all()
    if not candidates:
        return {"job": job.title, "candidates": [], "message": "No candidates yet"}

    candidates_data = [
        {"id": c.id, "name": c.name, "email": c.email,
         "skills": c.skills, "experience": c.experience}
        for c in candidates
    ]
    job_text = f"{job.title} {job.description} {job.skills}"
    ranked   = match_job_to_candidates(job_text, candidates_data)

    return {"job_id": job_id, "job_title": job.title, "ranked_candidates": ranked}


# ── Candidate: register + upload resume ────────────────────────────
@router.post("/candidates/register")
async def register_candidate(
    name:            str        = Form(...),
    email:           str        = Form(...),
    experience:      int        = Form(...),
    resume_file:     UploadFile = File(...),
    db:              Session    = Depends(get_db)
):
    if not resume_file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files supported")

    tmp_path = os.path.join(UPLOAD_DIR, resume_file.filename)
    with open(tmp_path, "wb") as f:
        f.write(await resume_file.read())

    try:
        raw_text     = extract_text_from_pdf(tmp_path)
        cleaned      = clean_text(raw_text)
        skills_df    = extract_skills(cleaned)
        skills_str   = ", ".join(skills_df['skill'].tolist())
    finally:
        os.remove(tmp_path)

    candidate = Candidate(
        name       = name,
        email      = email,
        experience = experience,
        skills     = skills_str,
        raw_text   = raw_text
    )
    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    return {
        "candidate_id": candidate.id,
        "name":         candidate.name,
        "skills_found": skills_df.to_dict(orient="records"),
        "skill_count":  len(skills_df)
    }


# ── Candidate: rank jobs for a candidate ──────────────────────────
@router.get("/candidates/{candidate_id}/jobs")
def rank_jobs_for_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    jobs = db.query(Job).all()
    if not jobs:
        return {"candidate": candidate.name, "jobs": [], "message": "No jobs posted yet"}

    jobs_data = [
        {"id": j.id, "title": j.title, "company": j.company,
         "location": j.location, "description": j.description,
         "skills": j.skills, "experience": j.experience,
         "salary_min": j.salary_min, "salary_max": j.salary_max}
        for j in jobs
    ]
    ranked = match_resume_to_jobs(candidate.raw_text or candidate.skills, jobs_data)

    return {
        "candidate_id":   candidate_id,
        "candidate_name": candidate.name,
        "ranked_jobs":    ranked
    }