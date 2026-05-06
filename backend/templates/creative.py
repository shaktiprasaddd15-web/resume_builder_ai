import json
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Flowable
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

def render_creative(resume_json, filename):
    data = json.loads(resume_json)
    
    # Define colors
    PRIMARY = colors.HexColor("#2C3E50")
    ACCENT = colors.HexColor("#E74C3C")
    TEXT = colors.HexColor("#34495E")
    BG_SIDEBAR = colors.HexColor("#ECF0F1")
    
    # Create the document
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        rightMargin=0, leftMargin=0, topMargin=0, bottomMargin=0
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Styles
    style_name = ParagraphStyle(
        "Name",
        parent=styles["Heading1"],
        fontSize=24,
        textColor=PRIMARY,
        alignment=0, # Left
        spaceAfter=10
    )
    
    style_role = ParagraphStyle(
        "Role",
        parent=styles["Heading2"],
        fontSize=14,
        textColor=ACCENT,
        spaceAfter=20
    )
    
    style_section = ParagraphStyle(
        "Section",
        parent=styles["Heading3"],
        fontSize=14,
        textColor=PRIMARY,
        spaceBefore=15,
        spaceAfter=10,
        borderWidth=0,
        borderBottomWidth=2,
        borderColor=ACCENT,
        borderPadding=5
    )
    
    style_normal = ParagraphStyle(
        "NormalCustom",
        parent=styles["Normal"],
        fontSize=10,
        textColor=TEXT,
        leading=14
    )
    
    # Layout content
    # We will use a Table for the 2-column layout
    # Left column (Sidebar): 35%, Right column: 65%
    
    # --- SIDEBAR CONTENT ---
    sidebar_content = []
    
    # Contact
    sidebar_content.append(Paragraph("<b>CONTACT</b>", style_section))
    if data.get("email"): sidebar_content.append(Paragraph(data.get("email"), style_normal))
    if data.get("phone"): sidebar_content.append(Paragraph(data.get("phone"), style_normal))
    if data.get("location"): sidebar_content.append(Paragraph(data.get("location"), style_normal))
    sidebar_content.append(Spacer(1, 20))
    
    # Skills
    sidebar_content.append(Paragraph("<b>SKILLS</b>", style_section))
    for s in ensure_list(data.get("skills", [])):
        sidebar_content.append(Paragraph(f"• {s}", style_normal))
    sidebar_content.append(Spacer(1, 20))
    
    # Education (moved to sidebar for creative layout)
    if data.get("education"):
        sidebar_content.append(Paragraph("<b>EDUCATION</b>", style_section))
        for edu in data.get("education", []):
            sidebar_content.append(Paragraph(f"<b>{edu.get('degree', '')}</b>", style_normal))
            sidebar_content.append(Paragraph(edu.get('institution', ''), style_normal))
            sidebar_content.append(Paragraph(f"<i>{edu.get('duration', '')}</i>", style_normal))
            sidebar_content.append(Spacer(1, 10))

    # --- MAIN CONTENT ---
    main_content = []
    
    # Header
    main_content.append(Paragraph(data.get("name", "").upper(), style_name))
    main_content.append(Paragraph(data.get("role", ""), style_role))
    
    # Summary
    if data.get("summary"):
        main_content.append(Paragraph("PROFILE", style_section))
        main_content.append(Paragraph(data.get("summary", ""), style_normal))
        main_content.append(Spacer(1, 10))
        
    # Experience
    if data.get("experience"):
        main_content.append(Paragraph("EXPERIENCE", style_section))
        for exp in data.get("experience", []):
            main_content.append(Paragraph(f"<b>{exp.get('title', '')}</b>", style_normal))
            main_content.append(Paragraph(f"{exp.get('company', '')} | {exp.get('duration', '')}", style_normal))
            
            points = ensure_list(exp.get("points", []))
            for p in points:
                main_content.append(Paragraph(f"• {p}", style_normal))
            main_content.append(Spacer(1, 15))

    # Projects
    if data.get("projects"):
        main_content.append(Paragraph("PROJECTS", style_section))
        for proj in data.get("projects", []):
            name = proj.get("name", "")
            tech = proj.get("tech", "")
            duration = proj.get("duration", "")
            main_content.append(Paragraph(f"<b>{name}</b>" + (f" | <i>{tech}</i>" if tech else ""), style_normal))
            if duration:
                main_content.append(Paragraph(f"<i>{duration}</i>", style_normal))
            points = ensure_list(proj.get("points", []))
            for p in points:
                main_content.append(Paragraph(f"• {p}", style_normal))
            main_content.append(Spacer(1, 15))

    # Build the table
    # Since we can't easily put Flowables directly into a single cell and expect auto-height without some work,
    # we'll wrap them in a list.
    
    table_data = [
        [sidebar_content, main_content]
    ]
    
    t = Table(table_data, colWidths=[6*cm, 13*cm])
    
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), BG_SIDEBAR),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 20),
        ('LEFTPADDING', (0, 0), (0, -1), 15),
        ('RIGHTPADDING', (0, 0), (0, -1), 15),
        ('LEFTPADDING', (1, 0), (1, -1), 20),
        ('RIGHTPADDING', (1, 0), (1, -1), 20),
    ]))
    
    doc.build([t])
