import json
import os
from groq import Groq
from typing import Dict, Any

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


def generate_resume(data: Dict[str, Any]) -> str:
    """
    Converts structured resume input into clean JSON.
    Uses Groq if available, otherwise falls back safely.
    ALWAYS returns valid JSON string.
    """

    # ---------------- SAFE FALLBACK ----------------
    if not client:
        return json.dumps(data, ensure_ascii=False)

    prompt = f"""
You are a professional resume writer.

STRICT RULES:
- Output ONLY valid JSON
- Do NOT include explanations
- Do NOT include markdown
- Do NOT include text outside JSON
- Preserve ALL fields from input including "projects"
- Keep "experience" and "projects" completely separate — do NOT mix them

Required keys:
name, role, email, phone, location, summary, skills, experience, education, projects

Input:
{json.dumps(data, indent=2)}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )

        content = response.choices[0].message.content.strip()

        # ---------------- VALIDATE JSON ----------------
        parsed = json.loads(content)

        # Ensure minimum required keys exist
        for key in ["name", "role", "skills", "experience", "education"]:
            if key not in parsed:
                raise ValueError(f"Missing key: {key}")

        # Ensure projects key exists (optional but we want it present)
        if "projects" not in parsed:
            parsed["projects"] = data.get("projects", [])

        return json.dumps(parsed, ensure_ascii=False)

    except Exception as e:
        # ---------------- FAIL SAFE ----------------
        print("Groq resume generation failed:", str(e))
        return json.dumps(data, ensure_ascii=False)
