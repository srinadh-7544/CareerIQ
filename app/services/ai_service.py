import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL  = "llama-3.3-70b-versatile"

CAREER_SYSTEM_PROMPT = """You are CareerIQ Assistant — an expert career coach and resume specialist for the Indian IT job market.
You help job seekers with:
- Career advice and guidance
- Resume improvement and optimization
- Interview preparation tips
- Skill development recommendations
- Job search strategies in India
- Salary negotiation advice

Keep responses concise, practical, and actionable.
When giving advice, be specific and direct.
Format responses clearly using short paragraphs.
Never use excessive bullet points — prefer natural conversational text."""

RESUME_SYSTEM_PROMPT = """You are an expert resume writer and ATS optimization specialist for Indian IT companies.
Your job is to:
- Add missing keywords naturally into resume content
- Improve weak bullet points with stronger action verbs
- Quantify achievements where possible
- Make the resume ATS-friendly for Indian IT companies
- Ensure skills match the job description

When rewriting, maintain the candidate's authentic voice.
Return improved content that is professional and compelling."""

def chat_with_ai(messages: list) -> str:
    response = client.chat.completions.create(
        model    = MODEL,
        messages = [{"role": "system", "content": CAREER_SYSTEM_PROMPT}] + messages,
        max_tokens  = 1024,
        temperature = 0.7
    )
    return response.choices[0].message.content

def improve_resume(resume_text: str, job_description: str, missing_skills: list) -> str:
    missing_str = ", ".join(missing_skills) if missing_skills else "none identified"

    prompt = f"""Here is a candidate's resume:

{resume_text}

Here is the job description they are applying for:

{job_description}

Missing skills identified: {missing_str}

Please:
1. Rewrite the resume summary/objective to better match the job
2. Add the missing keywords naturally where relevant
3. Strengthen 3-5 weak bullet points with better action verbs and metrics
4. Suggest a skills section that includes the missing keywords
5. Give an overall assessment of what changed and why

Format your response with clear sections:
IMPROVED SUMMARY:
STRENGTHENED BULLETS:
RECOMMENDED SKILLS SECTION:
WHAT CHANGED AND WHY:"""

    response = client.chat.completions.create(
        model    = MODEL,
        messages = [
            {"role": "system", "content": RESUME_SYSTEM_PROMPT},
            {"role": "user",   "content": prompt}
        ],
        max_tokens  = 2048,
        temperature = 0.7
    )
    return response.choices[0].message.content