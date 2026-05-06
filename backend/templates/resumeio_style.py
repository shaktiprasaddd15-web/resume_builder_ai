import json
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, black
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm

# ---------------- CONFIG ----------------
LEFT_BG = HexColor("#f3e7df")
TEXT_GRAY = HexColor("#6b6b6b")

LEFT_COL_RATIO = 0.43
LEFT_PAD = 1 * cm
RIGHT_PAD = 2 * cm

TITLE_SIZE = 10
BODY_SIZE = 9
SECTION_SIZE = 11

LINE_GAP = 4
LINE_HEIGHT = BODY_SIZE * 1.5  # font-aware spacing


# ---------------- HELPERS ----------------
def ensure_list(v):
    if isinstance(v, list):
        return v
    if isinstance(v, str):
        return [x.strip() for x in v.split(",") if x.strip()]
    return []


def draw_justified_paragraph(c, text, x, y, max_width, font="Helvetica", size=9):
    """
    Draws width-based wrapped & justified text.
    Returns updated y.
    """
    if not text:
        return y

    c.setFont(font, size)
    words = text.split()
    space_w = c.stringWidth(" ", font, size)
    line = []

    while words:
        line.append(words.pop(0))
        line_w = sum(c.stringWidth(w, font, size) for w in line) + space_w * (len(line) - 1)

        if line_w > max_width:
            last = line.pop()
            words.insert(0, last)

            gaps = len(line) - 1
            if gaps > 0:
                words_width = sum(c.stringWidth(w, font, size) for w in line)
                extra = (max_width - words_width) / gaps
                cx = x
                for w in line[:-1]:
                    c.drawString(cx, y, w)
                    cx += c.stringWidth(w, font, size) + extra
                c.drawString(cx, y, line[-1])
            else:
                c.drawString(x, y, line[0])

            y -= LINE_HEIGHT
            line = []

    if line:
        c.drawString(x, y, " ".join(line))
        y -= LINE_HEIGHT

    return y


# ---------------- MAIN RENDER ----------------
def render_resumeio(resume_json, filename):
    data = json.loads(resume_json)

    summary = data.get("summary") or (
        "Experienced professional with strong leadership, strategic planning skills, "
        "and a proven record of delivering high-impact results."
    )

    skills = ensure_list(data.get("skills", []))

    c = canvas.Canvas(filename, pagesize=A4)
    w, h = A4

    left_w = w * LEFT_COL_RATIO
    right_x = left_w + RIGHT_PAD
    right_width = w - right_x - RIGHT_PAD
    right_edge = w - RIGHT_PAD

    # ---------------- LEFT BACKGROUND ----------------
    c.setFillColor(LEFT_BG)
    c.rect(0, 2, left_w, h, stroke=0, fill=1)

    # ================= LEFT COLUMN =================
    y = h - 2.2 * cm

    c.setFillColor(black)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(LEFT_PAD, y, data.get("name", ""))
    y -= 22

    c.setFont("Helvetica", 11)
    c.drawString(LEFT_PAD, y, data.get("role", ""))
    y -= 26

    c.setFont("Helvetica", 9)
    c.setFillColor(TEXT_GRAY)
    c.drawString(LEFT_PAD, y, data.get("email") or "")
    y -= 14
    c.drawString(LEFT_PAD, y, data.get("phone") or "")
    y -= 14
    c.drawString(LEFT_PAD, y, data.get("location") or "")
    y -= 26

    # PROFILE
    c.setFillColor(black)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(LEFT_PAD, y, "PROFILE")
    y -= 14

    c.setFillColor(TEXT_GRAY)
    y = draw_justified_paragraph(
        c, summary, LEFT_PAD, y, left_w - LEFT_PAD * 1.4
    )

    y -= 18

    # SKILLS
    c.setFillColor(black)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(LEFT_PAD, y, "SKILLS")
    y -= 14

    c.setFillColor(TEXT_GRAY)
    for s in skills:
        c.drawString(LEFT_PAD + 2, y, f"• {s}")
        y -= 13

    # ================= RIGHT COLUMN =================
    y = h - 2.6 * cm

    # EXPERIENCE HEADER
    c.setFillColor(black)
    c.setFont("Helvetica-Bold", SECTION_SIZE)
    c.drawString(right_x, y, "EXPERIENCE")
    c.line(right_x, y - 4, right_edge, y - 4)
    y -= 26

    for exp in data.get("experience", []):
        # TITLE (wrapped, constrained)
        c.setFont("Helvetica-Bold", TITLE_SIZE)
        y = draw_justified_paragraph(
            c, exp.get("title", ""), right_x, y, right_width
        )

        y -= LINE_GAP

        # COMPANY + DATE (safe baseline)
        c.setFont("Helvetica", BODY_SIZE)
        c.setFillColor(TEXT_GRAY)
        c.drawString(right_x, y, exp.get("company", ""))
        c.drawRightString(right_edge, y, exp.get("duration", ""))
        y -= LINE_HEIGHT

        # BULLETS
        for p in exp.get("points", []):
            y = draw_justified_paragraph(
                c, f"– {p}", right_x + 10, y, right_width - 10
            )
            y -= LINE_GAP

        y -= 12
        c.setFillColor(black)

    # ================= EDUCATION =================
    c.setFont("Helvetica-Bold", SECTION_SIZE)
    c.drawString(right_x, y, "EDUCATION")
    c.line(right_x, y - 4, right_edge, y - 4)
    y -= 26

    for edu in data.get("education", []):
        c.setFont("Helvetica-Bold", TITLE_SIZE)
        y = draw_justified_paragraph(
            c, edu.get("degree", ""), right_x, y, right_width
        )

        y -= LINE_GAP

        c.setFont("Helvetica", BODY_SIZE)
        c.drawRightString(right_edge, y + LINE_HEIGHT, edu.get("duration", ""))

        c.setFillColor(TEXT_GRAY)
        c.drawString(right_x, y, edu.get("institution", ""))
        y -= 22
        c.setFillColor(black)

    # ================= PROJECTS =================
    projects = data.get("projects", [])
    if projects:
        y -= 10
        c.setFont("Helvetica-Bold", SECTION_SIZE)
        c.setFillColor(black)
        c.drawString(right_x, y, "PROJECTS")
        c.line(right_x, y - 4, right_edge, y - 4)
        y -= 26

        for proj in projects:
            name = proj.get("name", "")
            tech = proj.get("tech", "")
            duration = proj.get("duration", "")

            c.setFont("Helvetica-Bold", TITLE_SIZE)
            c.setFillColor(black)
            label = name + (f"  |  {tech}" if tech else "")
            y = draw_justified_paragraph(c, label, right_x, y, right_width)
            y -= LINE_GAP

            c.setFont("Helvetica", BODY_SIZE)
            c.setFillColor(TEXT_GRAY)
            if duration:
                c.drawString(right_x, y, duration)
                y -= LINE_HEIGHT

            for p in proj.get("points", []):
                y = draw_justified_paragraph(
                    c, f"– {p}", right_x + 10, y, right_width - 10
                )
                y -= LINE_GAP

            y -= 12
            c.setFillColor(black)

    c.save()
