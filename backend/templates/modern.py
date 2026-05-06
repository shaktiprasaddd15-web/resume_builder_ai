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

def render_modern(resume_json, filename):
    data = json.loads(resume_json)
    styles = getSampleStyleSheet()

    # Custom Styles
    name_style = ParagraphStyle(
        "Name",
        parent=styles["Heading1"],
        fontSize=24,
        spaceAfter=4,
        textColor=colors.darkblue
    )

    role_style = ParagraphStyle(
        "Role",
        parent=styles["Heading2"],
        fontSize=14,
        textColor=colors.grey,
        spaceAfter=12
    )

    contact_style = ParagraphStyle(
        "Contact",
        parent=styles["Normal"],
        fontSize=10,
        textColor=colors.darkgrey,
        spaceAfter=24
    )

    section_header = ParagraphStyle(
        "SectionHeader",
        parent=styles["Heading3"],
        fontSize=14,
        textColor=colors.darkblue,
        spaceBefore=12,
        spaceAfter=6,
        borderPadding=2,
        borderColor=colors.darkblue,
        borderWidth=0,
        borderBottomWidth=1
    )

    doc = SimpleDocTemplate(filename)
    content = []

    # Header
    content.append(Paragraph(data.get("name", ""), name_style))
    content.append(Paragraph(data.get("role", ""), role_style))
    
    # Contact
    contact_parts = []
    if data.get("email"): contact_parts.append(data.get("email"))
    if data.get("phone"): contact_parts.append(data.get("phone"))
    if data.get("location"): contact_parts.append(data.get("location"))
    content.append(Paragraph(" | ".join(contact_parts), contact_style))

    # Summary
    if data.get("summary"):
        content.append(Paragraph("SUMMARY", section_header))
        content.append(Paragraph(data.get("summary", ""), styles["Normal"]))
        content.append(Spacer(1, 12))

    # Skills
    skills = ensure_list(data.get("skills", []))
    if skills:
        content.append(Paragraph("SKILLS", section_header))
        content.append(Paragraph(", ".join(skills), styles["Normal"]))
        content.append(Spacer(1, 12))

    # Experience
    if data.get("experience"):
        content.append(Paragraph("PROFESSIONAL EXPERIENCE", section_header))
        for exp in data.get("experience", []):
            title_line = f"<b>{exp.get('title', '')}</b> at {exp.get('company', '')}"
            content.append(Paragraph(title_line, styles["Normal"]))
            content.append(Paragraph(f"<i>{exp.get('duration', '')}</i>", styles["Normal"]))
            
            points = ensure_list(exp.get("points", []))
            for p in points:
                content.append(Paragraph(f"• {p}", styles["Bullet"], bulletText="•"))
            content.append(Spacer(1, 10))

    # Education
    if data.get("education"):
        content.append(Paragraph("EDUCATION", section_header))
        for edu in data.get("education", []):
            line = f"<b>{edu.get('degree', '')}</b>, {edu.get('institution', '')}"
            content.append(Paragraph(line, styles["Normal"]))
            content.append(Paragraph(f"<i>{edu.get('duration', '')}</i>", styles["Normal"]))
            content.append(Spacer(1, 8))

    # Projects
    if data.get("projects"):
        content.append(Paragraph("PROJECTS", section_header))
        for proj in data.get("projects", []):
            name = proj.get("name", "")
            tech = proj.get("tech", "")
            duration = proj.get("duration", "")
            title_line = f"<b>{name}</b>"
            if tech:
                title_line += f" — <i>{tech}</i>"
            content.append(Paragraph(title_line, styles["Normal"]))
            if duration:
                content.append(Paragraph(f"<i>{duration}</i>", styles["Normal"]))
            points = ensure_list(proj.get("points", []))
            for p in points:
                content.append(Paragraph(f"• {p}", styles["Bullet"], bulletText="•"))
            content.append(Spacer(1, 10))

    doc.build(content)
