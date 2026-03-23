from fastapi import APIRouter
from pydantic import BaseModel
from app.services.salary_predictor import predict_salary

router = APIRouter()

class SalaryRequest(BaseModel):
    role:       str
    experience: int
    location:   str
    skills:     list[str]

@router.post("/predict")
def predict(req: SalaryRequest):
    return predict_salary(
        role       = req.role,
        experience = req.experience,
        location   = req.location,
        skills     = req.skills
    )