from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.auth import register_user, login_user

router = APIRouter()

class RegisterRequest(BaseModel):
    name:     str
    email:    str
    password: str
    role:     str = "candidate"

class LoginRequest(BaseModel):
    identifier: str   # accepts username or email
    password:   str

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    user, error = register_user(db, req.name, req.email, req.password, req.role)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return {
        "message": "Account created successfully",
        "user": {
            "id":    user.id,
            "name":  user.name,
            "email": user.email,
            "role":  user.role
        }
    }

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    token, error = login_user(db, req.identifier, req.password)
    if error:
        raise HTTPException(status_code=401, detail=error)
    return {"access_token": token, "token_type": "bearer"}