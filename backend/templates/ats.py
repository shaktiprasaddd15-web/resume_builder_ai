import json
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def ensure_list(value):
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        return [v.strip() for v in value.split(",") if v.strip()]
    return []

def render_ats(resume_json, filename):
    data = json.loads(resume_json)
    styles = getSampleStyleSheet()

    # Plain styles for ATS
    title_style = ParagraphStyle(
        "Title",
        parent=styles["Heading1"],
        fontSize=18,
        spaceAfter=4,
        alignment=1, # Center
        textColor=colors.black
    )

    contact_style = ParagraphStyle(
        "Contact",
        parent=styles["Normal"],
        fontSize=10,
        alignment=1, # Center
        spaceAfter=12
    )

    section_header = ParagraphStyle(
        "Section",
        parent=styles["Heading2"],
        fontSize=12,
        spaceBefore=10,
        spaceAfter=6,
        textColor=colors.black,
        borderPadding=0,
        borderWidth=0,
        borderBottomWidth=1,
        borderColor=colors.black
    )

    doc = SimpleDocTemplate(filename)
    content = []

    # Name
    content.append(Paragraph(data.get("name", "").upper(), title_style))
    
    # Contact
    contact_parts = []
    if data.get("email"): contact_parts.append(data.get("email"))
    if data.get("phone"): contact_parts.append(data.get("phone"))
    if data.get("location"): contact_parts.append(data.get("location"))
    content.append(Paragraph(" | ".join(contact_parts), contact_style))

    # Summary
    if data.get("summary"):
        content.append(Paragraph("PROFESSIONAL SUMMARY", section_header))
        content.append(Paragraph(data.get("summary", ""), styles["Normal"]))

    # Skills
    skills = ensure_list(data.get("skills", []))
    if skills:
        content.append(Paragraph("SKILLS", section_header))
        content.append(Paragraph(", ".join(skills), styles["Normal"]))

    # Experience
    if data.get("experience"):
        content.append(Paragraph("EXPERIENCE", section_header))
        for exp in data.get("experience", []):
            company = exp.get('company', '')
            loc = exp.get('location', '')
            line = f"<b>{company}</b> – {loc}" if loc else f"<b>{company}</b>"
            content.append(Paragraph(line, styles["Normal"]))
            
            subline = f"<i>{exp.get('title', '')}</i> ({exp.get('duration', '')})"
            content.append(Paragraph(subline, styles["Normal"]))
            
            points = ensure_list(exp.get("points", []))
            for p in points:
                content.append(Paragraph(f"• {p}", styles["Bullet"], bulletText="•"))
            content.append(Spacer(1, 6))

    # Education
    if data.get("education"):
        content.append(Paragraph("EDUCATION", section_header))
        for edu in data.get("education", []):
            line = f"<b>{edu.get('institution', '')}</b>"
            content.append(Paragraph(line, styles["Normal"]))
            content.append(Paragraph(f"{edu.get('degree', '')}, {edu.get('duration', '')}", styles["Normal"]))
            content.append(Spacer(1, 6))

    # Projects
    if data.get("projects"):
        content.append(Paragraph("PROJECTS", section_header))
        for proj in data.get("projects", []):
            name = proj.get("name", "")
            tech = proj.get("tech", "")
            duration = proj.get("duration", "")
            header = f"<b>{name}</b>"
            if tech:
                header += f" | {tech}"
            if duration:
                header += f" ({duration})"
            content.append(Paragraph(header, styles["Normal"]))
            points = ensure_list(proj.get("points", []))
            for p in points:
                content.append(Paragraph(f"• {p}", styles["Bullet"], bulletText="•"))
            content.append(Spacer(1, 6))

    doc.build(content)
