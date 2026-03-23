from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(255))
    email      = Column(String(255), unique=True, index=True)
    password   = Column(String(255))
    role       = Column(String(50), default="candidate")  # candidate | recruiter
    is_active  = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Resume(Base):
    __tablename__ = "resumes"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer)
    filename   = Column(String(255))
    raw_text   = Column(String)
    skills     = Column(String)
    score      = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())