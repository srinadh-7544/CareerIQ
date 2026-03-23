from fastapi import FastAPI
from app.database import engine, Base
from app.routes import resume, jobs, skill_gap, salary, analytics, matching, auth, ai
from app.models.job import Job, Candidate

Base.metadata.create_all(bind=engine)  # creates tables automatically on startup

app = FastAPI(title="CareerIQ API", version="1.0.0")
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(skill_gap.router, prefix="/api/skillgap", tags=["Skill Gap"])  # add this
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(jobs.router,   prefix="/api/jobs",   tags=["Jobs"])
app.include_router(salary.router, prefix="/api/salary", tags=["Salary"])
app.include_router(matching.router, prefix="/api/matching", tags=["Matching"])

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
@app.get("/")
def root():
    return {"message": "CareerIQ API is running"}