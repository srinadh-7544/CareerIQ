from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from sqlalchemy.sql import func
from app.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id           = Column(Integer, primary_key=True, index=True)
    title        = Column(String(255))
    company      = Column(String(255))
    location     = Column(String(255))
    description  = Column(Text)
    skills       = Column(Text)        # comma-separated required skills
    experience   = Column(Integer)     # min years required
    salary_min   = Column(Integer)
    salary_max   = Column(Integer)
    posted_by    = Column(String(255)) # recruiter name/email
    created_at   = Column(DateTime(timezone=True), server_default=func.now())


class Candidate(Base):
    __tablename__ = "candidates"

    id           = Column(Integer, primary_key=True, index=True)
    name         = Column(String(255))
    email        = Column(String(255))
    skills       = Column(Text)        # comma-separated extracted skills
    experience   = Column(Integer)
    raw_text     = Column(Text)
    match_score  = Column(Float, default=0.0)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())