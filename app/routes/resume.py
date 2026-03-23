import os
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import Resume
from app.services.resume_extractor import extract_text_from_pdf, extract_skills, compute_match_score
from app.utils.text_cleaner import clean_text

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_resume(
    resume_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not resume_file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    tmp_path = os.path.join(UPLOAD_DIR, resume_file.filename)
    with open(tmp_path, "wb") as f:
        f.write(await resume_file.read())

    try:
        raw_text     = extract_text_from_pdf(tmp_path)
        cleaned      = clean_text(raw_text)
        skills_found = extract_skills(cleaned)
        skills_list  = ", ".join(skills_found['skill'].tolist())

        record = Resume(
            filename = resume_file.filename,
            raw_text = raw_text,
            skills   = skills_list
        )
        db.add(record)
        db.commit()
        db.refresh(record)

    finally:
        os.remove(tmp_path)

    return {
        "resume_id":    record.id,
        "filename":     record.filename,
        "skills_found": skills_found.to_dict(orient="records"),
        "skill_count":  len(skills_found),
        "preview":      raw_text[:300] + "..."
    }


@router.post("/match")
async def match_resume_to_job(
    resume_file:     UploadFile = File(...),
    job_description: str        = Form(...)
):
    if not resume_file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    tmp_path = os.path.join(UPLOAD_DIR, resume_file.filename)
    with open(tmp_path, "wb") as f:
        f.write(await resume_file.read())

    try:
        raw_text = extract_text_from_pdf(tmp_path)
        result   = compute_match_score(raw_text, job_description)
    finally:
        os.remove(tmp_path)

    return {
        "match_score":    result["score"],
        "matched_skills": result["matched_skills"],
        "missing_skills": result["missing_skills"],
        "extra_skills":   result["extra_skills"],
        "verdict":        "Strong match" if result["score"] >= 70
                          else "Moderate match" if result["score"] >= 40
                          else "Weak match"
    }


@router.get("/{resume_id}")
def get_resume(resume_id: int, db: Session = Depends(get_db)):
    record = db.query(Resume).filter(Resume.id == resume_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {
        "id":       record.id,
        "filename": record.filename,
        "skills":   record.skills,
        "score":    record.score
    }