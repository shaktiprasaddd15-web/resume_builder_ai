import json
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import cm

def ensure_list(value):
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        return [v.strip() for v in value.split(",") if v.strip()]
    return []

def render_professional(resume_json, filename):
    data = json.loads(resume_json)
    
    # Classic Serif Fonts or clean sans
    FONT_NORMAL = "Helvetica"
    FONT_BOLD = "Helvetica-Bold"
    
    doc = SimpleDocTemplate(filename, pagesize=A4,
                            rightMargin=2*cm, leftMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)
    styles = getSampleStyleSheet()
    
    # Custom Styles
    style_name = ParagraphStyle(
        "Name",
        parent=styles["Heading1"],
        fontName=FONT_BOLD,
        fontSize=18,
        spaceAfter=6,
        alignment=1 # Center
    )
    
    style_contact = ParagraphStyle(
        "Contact",
        parent=styles["Normal"],
        fontName=FONT_NORMAL,
        fontSize=10,
        alignment=1, # Center
        spaceAfter=12
    )

    style_section = ParagraphStyle(
        "Section",
        parent=styles["Heading2"],
        fontName=FONT_BOLD,
        fontSize=12,
        spaceBefore=12,
        spaceAfter=4,
        borderWidth=0,
        borderBottomWidth=1,
        borderColor=colors.black,
        textTransform="uppercase"
    )
    
    style_job_header = ParagraphStyle(
        "JobHeader",
        parent=styles["Normal"],
        fontName=FONT_BOLD,
        fontSize=10,
        spaceAfter=2
    )
    
    style_job_sub = ParagraphStyle(
        "JobSub",
        parent=styles["Normal"],
        fontName=FONT_NORMAL,
        fontSize=10,
        spaceAfter=2,
        textColor=colors.black
    )
    
    style_bullet = ParagraphStyle(
        "Bullet",
        parent=styles["Normal"],
        fontName=FONT_NORMAL,
        fontSize=10,
        leftIndent=15,
        firstLineIndent=0,
        spaceAfter=2,
        bulletIndent=5
    )
    
    content = []
    
    # Header
    content.append(Paragraph(data.get("name", "").upper(), style_name))
    
    # Contact
    contact_parts = []
    if data.get("email"): contact_parts.append(data.get("email"))
    if data.get("phone"): contact_parts.append(data.get("phone"))
    if data.get("location"): contact_parts.append(data.get("location"))
    if data.get("linkedin"): contact_parts.append(data.get("linkedin")) # Optional if user adds it later
    content.append(Paragraph(" | ".join(contact_parts), style_contact))
    
    content.append(Spacer(1, 10))
    
    # Summary
    if data.get("summary"):
        content.append(Paragraph("PROFESSIONAL SUMMARY", style_section))
        content.append(Paragraph(data.get("summary", ""), styles["Normal"]))
    
    # Experience
    if data.get("experience"):
        content.append(Paragraph("EXPERIENCE", style_section))
        for exp in data.get("experience", []):
            # Title + Company + Date on one line if possible, or two
            # We'll use a table for alignment: left=Role/Company, right=Date
            
            # Row 1: Company (Bold) ... Date (Right)
            company = exp.get('company', '')
            date = exp.get('duration', '')
            role = exp.get('title', '')
            loc = exp.get('location', '')
            
            # Using a table for perfect alignment
            # Row 1: Company ........ Date
            t1_data = [[Paragraph(f"<b>{company}</b>", styles["Normal"]), 
                        Paragraph(f"{date}", ParagraphStyle("Right", parent=styles["Normal"], alignment=2))]]
            t1 = Table(t1_data, colWidths=[12*cm, 5*cm])
            t1.setStyle(TableStyle([
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('LEFTPADDING', (0,0), (-1,-1), 0),
                ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ]))
            content.append(t1)
            
            # Row 2: Role ........ Location
            t2_data = [[Paragraph(f"<i>{role}</i>", styles["Normal"]), 
                        Paragraph(f"<i>{loc}</i>", ParagraphStyle("RightItalic", parent=styles["Normal"], alignment=2, fontName="Helvetica-Oblique"))]]
            t2 = Table(t2_data, colWidths=[12*cm, 5*cm])
            t2.setStyle(TableStyle([
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('LEFTPADDING', (0,0), (-1,-1), 0),
                ('RIGHTPADDING', (0,0), (-1,-1), 0),
                ('BOTTOMPADDING', (0,0), (-1,-1), 2)
            ]))
            content.append(t2)

            # Bullets
            points = ensure_list(exp.get("points", []))
            for p in points:
                content.append(Paragraph(f"• {p}", style_bullet))
            
            content.append(Spacer(1, 8))

    # Education
    if data.get("education"):
        content.append(Paragraph("EDUCATION", style_section))
        for edu in data.get("education", []):
            # Similar table structure
            t_data = [[Paragraph(f"<b>{edu.get('institution', '')}</b>", styles["Normal"]),
                       Paragraph(f"{edu.get('duration', '')}", ParagraphStyle("Right", parent=styles["Normal"], alignment=2))]]
            t = Table(t_data, colWidths=[12*cm, 5*cm])
            t.setStyle(TableStyle([
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('LEFTPADDING', (0,0), (-1,-1), 0),
                ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ]))
            content.append(t)
            
            content.append(Paragraph(f"{edu.get('degree', '')}", styles["Normal"]))
            content.append(Spacer(1, 6))

    # Skills
    skills = ensure_list(data.get("skills", []))
    if skills:
        content.append(Paragraph("SKILLS", style_section))
        # Dense list
        content.append(Paragraph(", ".join(skills), styles["Normal"]))

    # Projects
    if data.get("projects"):
        content.append(Paragraph("PROJECTS", style_section))
        for proj in data.get("projects", []):
            name = proj.get("name", "")
            tech = proj.get("tech", "")
            duration = proj.get("duration", "")

            t1_data = [[Paragraph(f"<b>{name}</b>" + (f" | <i>{tech}</i>" if tech else ""), styles["Normal"]),
                        Paragraph(f"{duration}", ParagraphStyle("Right", parent=styles["Normal"], alignment=2))]]
            t1 = Table(t1_data, colWidths=[12*cm, 5*cm])
            t1.setStyle(TableStyle([
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('LEFTPADDING', (0,0), (-1,-1), 0),
                ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ]))
            content.append(t1)

            points = ensure_list(proj.get("points", []))
            for p in points:
                content.append(Paragraph(f"• {p}", style_bullet))

            content.append(Spacer(1, 8))

    doc.build(content)
