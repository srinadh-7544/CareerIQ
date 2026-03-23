import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.resume_extractor import extract_text_from_pdf, compute_match_score
from app.services.skill_gap import generate_skill_gap_report

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/analyze")
async def analyze_skill_gap(
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
        match    = compute_match_score(raw_text, job_description)
        report   = generate_skill_gap_report(
            matched_skills = match["matched_skills"],
            missing_skills = match["missing_skills"],
            extra_skills   = match["extra_skills"]
        )
    finally:
        os.remove(tmp_path)

    return {
        "match_score": match["score"],
        "verdict":     match["score"] >= 70 and "Strong match" or match["score"] >= 40 and "Moderate match" or "Weak match",
        **report
    }