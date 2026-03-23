from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from app.services.ai_service import chat_with_ai, improve_resume
from app.services.resume_extractor import extract_text_from_pdf, compute_match_score
import os

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class Message(BaseModel):
    role:    str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]


@router.post("/chat")
def chat(req: ChatRequest):
    try:
        messages = [{"role": m.role, "content": m.content} for m in req.messages]
        reply    = chat_with_ai(messages)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


@router.post("/improve-resume")
async def improve_resume_endpoint(
    resume_file:     UploadFile = File(...),
    job_description: str        = Form(...)
):
    if not resume_file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files supported")

    tmp_path = os.path.join(UPLOAD_DIR, resume_file.filename)
    with open(tmp_path, "wb") as f:
        f.write(await resume_file.read())

    try:
        raw_text = extract_text_from_pdf(tmp_path)
        match    = compute_match_score(raw_text, job_description)
        improved = improve_resume(raw_text, job_description, match["missing_skills"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")
    finally:
        os.remove(tmp_path)

    return {
        "original_score":  match["score"],
        "missing_skills":  match["missing_skills"],
        "matched_skills":  match["matched_skills"],
        "improved_resume": improved
    }