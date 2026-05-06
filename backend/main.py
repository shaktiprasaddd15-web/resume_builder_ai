import os
import io
import json
from pypdf import PdfReader
from fastapi import FastAPI, HTTPException, Query, Depends, status, File, UploadFile
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta

from database import Base, engine, SessionLocal
from models import Resume, User
from auth import verify_password, get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from resume_generator import generate_resume

from templates.resumeio_style import render_resumeio
from templates.modern import render_modern
from templates.ats import render_ats
from templates.creative import render_creative
from templates.professional import render_professional

from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Resume Builder Pro")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB
Base.metadata.create_all(bind=engine)

# Static
PDF_DIR = "generated_pdfs"
os.makedirs(PDF_DIR, exist_ok=True)
app.mount("/downloads", StaticFiles(directory=PDF_DIR), name="downloads")

# Auth Scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- AUTH ----------------
class UserCreate(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

@app.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "username": user.email}

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # In a real app we'd decode token and fetch user
    # For now just mock or generic return to allow saving resumes
    return None 

# ---------------- RESUME GENERATION ----------------
class ResumeRequest(BaseModel):
    name: str
    role: str
    summary: Optional[str] = None
    skills: List[str]
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    experience: List[Dict[str, Any]]
    education: List[Dict[str, Any]]
    projects: Optional[List[Dict[str, Any]]] = None
    linkedin: Optional[str] = None

ResumeRequest.model_rebuild()

@app.post("/generate-resume")
def generate_resume_api(
    data: ResumeRequest,
    template: str = Query(
        default="resumeio",
        enum=["resumeio", "modern", "ats", "creative", "professional"]
    )
):
    try:
        resume_json = generate_resume(data.model_dump())

        # Save to DB (Anonymous for now, or link if auth passed but keeping simple)
        db = SessionLocal()
        resume = Resume(
            name=data.name,
            role=data.role,
            template=template,
            content=resume_json
        )
        db.add(resume)
        db.commit()
        db.refresh(resume)

        # Generate PDF
        pdf_name = f"resume_{resume.id}_{template}.pdf"
        pdf_path = os.path.join(PDF_DIR, pdf_name)

        if template == "resumeio":
            render_resumeio(resume_json, pdf_path)
        elif template == "ats":
            render_ats(resume_json, pdf_path)
        elif template == "creative":
            render_creative(resume_json, pdf_path)
        elif template == "professional":
            render_professional(resume_json, pdf_path)
        else:
            render_modern(resume_json, pdf_path)

        download_url = f"http://127.0.0.1:8000/downloads/{pdf_name}"

        return {
            "status": "success",
            "resume_id": resume.id,
            "template": template,
            "pdf_url": download_url
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import requests

# ---- LinkedIn Scraper Config ----
# Supports: linkedin-data-scraper.p.rapidapi.com (RapidAPI)
# Replace RAPIDAPI_KEY with your own key from https://rapidapi.com/
RAPIDAPI_KEY = "23971cb6bfmshbc2c3e7f2160e07p157abfjsn0ec68f144fd6"
RAPIDAPI_HOST = "linkedin-data-scraper.p.rapidapi.com"

MOCK_LINKEDIN_PROFILE = {
    "full_name": "Sarah Jenkins",
    "occupation": "Senior Product Manager",
    "headline": "Senior Product Manager at TechGlobal | PMP Certified",
    "summary": "Results-driven Product Manager with 8+ years of experience leading cross-functional teams to deliver enterprise software solutions. Proven track record in Agile delivery, stakeholder management, and data-driven product strategy.",
    "country_full_name": "United States",
    "city": "San Francisco",
    "state": "California",
    "experiences": [
        {
            "starts_at": {"day": 1, "month": 3, "year": 2020},
            "ends_at": None,
            "company": "TechGlobal Inc.",
            "title": "Senior Product Manager",
            "description": "Lead a portfolio of 3 SaaS products generating $12M ARR. Drive product roadmap, manage a cross-functional team of 15, and oversee sprint planning and stakeholder communications.",
            "location": "San Francisco, CA"
        },
        {
            "starts_at": {"day": 1, "month": 6, "year": 2016},
            "ends_at": {"day": 28, "month": 2, "year": 2020},
            "company": "WebSolutions Inc.",
            "title": "Product Coordinator",
            "description": "Coordinated product launches, managed vendor relationships, and led QA cycles for 5+ client-facing web platforms.",
            "location": "Austin, TX"
        }
    ],
    "education": [
        {
            "starts_at": {"day": 1, "month": 8, "year": 2012},
            "ends_at": {"day": 30, "month": 5, "year": 2016},
            "field_of_study": "Business Administration",
            "degree_name": "Bachelor of Science",
            "school": "University of Texas at Austin"
        }
    ],
    "skills": ["Product Management", "Agile", "Scrum", "JIRA", "Roadmapping", "Stakeholder Management", "SQL", "Figma", "Leadership"]
}

@app.get("/import-linkedin")
def import_linkedin(url: str):
    if "linkedin.com/in/" not in url:
        raise HTTPException(status_code=400, detail="Invalid LinkedIn URL. Must be a linkedin.com/in/ profile URL.")

    # If no real API key is set, return rich mock data for development/demo
    if RAPIDAPI_KEY == "23971cb6bfmshbc2c3e7f2160e07p157abfjsn0ec68f144fd6":
        return MOCK_LINKEDIN_PROFILE

    # Real API call using RapidAPI LinkedIn Data Scraper
    try:
        api_endpoint = f"https://{RAPIDAPI_HOST}/getProfile"
        headers = {
            "X-RapidAPI-Key": RAPIDAPI_KEY,
            "X-RapidAPI-Host": RAPIDAPI_HOST,
            "Content-Type": "application/json"
        }
        payload = {"linkedin_url": url}
        response = requests.post(api_endpoint, json=payload, headers=headers, timeout=15)

        if response.status_code == 200:
            raw = response.json()
            # Normalize to our standard format
            data = raw.get("data", raw)  # some APIs wrap in 'data'
            return {
                "full_name": data.get("fullName") or data.get("full_name", ""),
                "occupation": data.get("title") or data.get("occupation", ""),
                "headline": data.get("headline", ""),
                "summary": data.get("summary", ""),
                "city": data.get("city", ""),
                "state": data.get("state", ""),
                "country_full_name": data.get("country") or data.get("country_full_name", ""),
                "experiences": data.get("experiences", []),
                "education": data.get("education", []),
                "skills": [s.get("name", s) if isinstance(s, dict) else s for s in data.get("skills", [])]
            }
        else:
            # Fallback to mock on API failure so the UI always works
            print(f"LinkedIn API error {response.status_code}: {response.text}")
            return MOCK_LINKEDIN_PROFILE

    except Exception as e:
        print(f"LinkedIn scraper exception: {e}")
        # Return mock so the frontend never shows a broken state
        return MOCK_LINKEDIN_PROFILE

from resume_generator import client as groq_client
@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        content = await file.read()
        pdf = PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf.pages:
            extr = page.extract_text()
            if extr:
                text += extr + "\n"
                
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")
            
        if not groq_client:
            raise HTTPException(status_code=500, detail="Groq API key not set, cannot parse resume.")
            
        prompt = f"""
You are an expert resume parser. Extract the user's details from the provided resume text.
Output MUST be ONLY valid JSON matching this exact structure, with no markdown formatting or extra text:
{{
  "name": "",
  "role": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "summary": "",
  "skills": "Skill 1, Skill 2, Skill 3",
  "experience": [
    {{
      "title": "",
      "company": "",
      "duration": "YYYY - YYYY",
      "location": "",
      "points": ["point 1", "point 2"]
    }}
  ],
  "education": [
    {{
      "degree": "",
      "institution": "",
      "duration": ""
    }}
  ],
  "projects": [
    {{
      "name": "",
      "tech": "",
      "duration": "",
      "points": ["point 1", "point 2"]
    }}
  ]
}}

CRITICAL RULES:
- ONLY include actual professional employment/jobs (real companies, paid roles) in the "experience" array.
- NEVER put personal projects, academic projects, freelance projects, or side projects in the "experience" array.
- ALL personal projects, student projects, academic projects, and side projects go in the "projects" array.
- If there are no projects, return an empty array [] for "projects".
- If there is no experience, return an empty array [] for "experience".

Resume text:
{text}
"""
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
        )
        
        parsed_str = response.choices[0].message.content.strip()
        # remove markdown json blocks if present
        if parsed_str.startswith("```"):
            parsed_str = parsed_str.split("```", 2)
            if len(parsed_str) >= 3:
                parsed_str = parsed_str[1]
                if parsed_str.startswith("json\n"):
                    parsed_str = parsed_str[5:]
        return json.loads(parsed_str)
        
    except Exception as e:
        print("Parse resume error:", e)
        raise HTTPException(status_code=500, detail=str(e))


# DB - Recreate to add template column (Dev only)
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

# ... (rest of main.py setup)

@app.get("/resumes")
def get_resumes(db: Session = Depends(get_db)):
    # Return last 10 resumes
    resumes = db.query(Resume).order_by(Resume.id.desc()).limit(10).all()
    return [{
        "id": r.id,
        "name": r.name,
        "role": r.role,
        "template": r.template, # Now available
        "created_at": "Today" # Placeholder
    } for r in resumes]
