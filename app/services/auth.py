import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.models.user import User

SECRET_KEY         = "careeriq_secret_key_change_in_production"
ALGORITHM          = "HS256"
TOKEN_EXPIRE_HOURS = 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_HOURS)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, name: str):
    return db.query(User).filter(User.name == name).first()

def register_user(db: Session, name: str, email: str, password: str, role: str):
    existing = get_user_by_email(db, email)
    if existing:
        return None, "Email already registered"
    user = User(
        name     = name,
        email    = email,
        password = hash_password(password),
        role     = role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user, None

def login_user(db: Session, identifier: str, password: str):
    # Try email first, then username
    user = get_user_by_email(db, identifier)
    if not user:
        user = get_user_by_username(db, identifier)
    if not user or not verify_password(password, user.password):
        return None, "Invalid username/email or password"
    token = create_token({
        "sub":   str(user.id),
        "email": user.email,
        "role":  user.role,
        "name":  user.name
    })
    return token, None