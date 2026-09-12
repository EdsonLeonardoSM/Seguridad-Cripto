"""
Genera el PDF académico del proyecto de Cifrado César y Atbash.
Lee el archivo Markdown y lo convierte a PDF con tipografía profesional.
"""

import os
import re
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    HRFlowable, Image, KeepTogether
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── Fuentes ──
FONT_DIR = r"C:\Windows\Fonts"
HAS_DEJAVU = os.path.exists(os.path.join(FONT_DIR, "DejaVuSans.ttf"))

if HAS_DEJAVU:
    try:
        pdfmetrics.registerFont(TTFont("DejaVu", os.path.join(FONT_DIR, "DejaVuSans.ttf")))
        pdfmetrics.registerFont(TTFont("DejaVuMono", os.path.join(FONT_DIR, "DejaVuSansMono.ttf")))
    except Exception as e:
        print(f"No se pudo cargar DejaVu: {e}")
        HAS_DEJAVU = False

pdfmetrics.registerFontFamily(
    "Body",
    normal="DejaVu" if HAS_DEJAVU else "Helvetica",
    bold="Helvetica-Bold",
    italic="Helvetica-Oblique",
    boldItalic="Helvetica-BoldOblique",
)
pdfmetrics.registerFontFamily(
    "Mono",
    normal="DejaVuMono" if HAS_DEJAVU else "Courier",
    bold="Courier-Bold",
    italic="Courier-Oblique",
    boldItalic="Courier-BoldOblique",
)

# ── Paleta sobria y formal (sin aspecto "tecnológico/IA") ──
COLOR_NAVY        = HexColor("#1e293b")   # texto principal sobrio
COLOR_DARK        = HexColor("#334155")
COLOR_GOLD        = HexColor("#8a6a3b")   # dorado UAA
COLOR_BG_SOFT     = HexColor("#f5f1e8")   # crema muy suave
COLOR_RULE        = HexColor("#d4c4a0")
COLOR_LIGHT_BG    = HexColor("#f8f5ed")
COLOR_TABLE_HDR   = HexColor("#1e293b")

# ── Estilos ──
styles = getSampleStyleSheet()

def make_style(name, **kwargs):
    return ParagraphStyle(name, parent=styles["Normal"], **kwargs)

S_TITLE_MAIN = make_style("TitleMain",
    fontName="Helvetica-Bold", fontSize=20, leading=26,
    textColor=COLOR_NAVY, alignment=TA_CENTER, spaceAfter=6, spaceBefore=0)

S_TITLE_SUB = make_style("TitleSub",
    fontName="Helvetica-Oblique", fontSize=12, leading=16,
    textColor=COLOR_DARK, alignment=TA_CENTER, spaceAfter=4)

S_H1 = make_style("H1",
    fontName="Helvetica-Bold", fontSize=15, leading=20,
    textColor=COLOR_NAVY, spaceBefore=16, spaceAfter=8,
    borderWidth=0, borderPadding=0)

S_H2 = make_style("H2",
    fontName="Helvetica-Bold", fontSize=12, leading=16,
    textColor=COLOR_NAVY, spaceBefore=10, spaceAfter=4)

S_H3 = make_style("H3",
    fontName="Helvetica-Bold", fontSize=10.5, leading=14,
    textColor=COLOR_DARK, spaceBefore=6, spaceAfter=3)

S_BODY = make_style("Body",
    fontName="Helvetica", fontSize=10, leading=13.5,
    textColor=black, alignment=TA_JUSTIFY, spaceAfter=5)

S_BULLET = make_style("Bullet",
    fontName="Helvetica", fontSize=10, leading=13.5,
    textColor=black, leftIndent=18, bulletIndent=4, spaceAfter=2)

S_CODE = make_style("Code",
    fontName="Courier", fontSize=8.5, leading=11,
    textColor=HexColor("#0f172a"),
    backColor=COLOR_LIGHT_BG,
    leftIndent=8, rightIndent=8,
    spaceBefore=4, spaceAfter=6, borderPadding=5,
    borderWidth=0.5, borderColor=COLOR_RULE)

S_TABLE_CELL = make_style("TableCell",
    fontName="Helvetica", fontSize=8.5, leading=11,
    textColor=black, alignment=TA_LEFT, spaceAfter=0, spaceBefore=0)

S_TABLE_HDR = make_style("TableHdr",
    fontName="Helvetica-Bold", fontSize=9, leading=11,
    textColor=white, alignment=TA_CENTER, spaceAfter=0, spaceBefore=0)

S_CENTER = make_style("Center",
    fontName="Helvetica", fontSize=10, leading=14,
    textColor=COLOR_DARK, alignment=TA_CENTER, spaceAfter=3)

S_PORTADA_FIELD = make_style("PortField",
    fontName="Helvetica-Bold", fontSize=10, textColor=COLOR_GOLD,
    alignment=TA_LEFT, spaceAfter=0)

S_PORTADA_VAL = make_style("PortVal",
    fontName="Helvetica", fontSize=11, textColor=black,
    alignment=TA_LEFT, spaceAfter=0)

S_INSTITUTION = make_style("Inst",
    fontName="Helvetica-Bold", fontSize=11, leading=15,
    textColor=COLOR_NAVY, alignment=TA_CENTER, spaceAfter=2)

S_SUBTITLE_ITAL = make_style("SubItal",
    fontName="Helvetica-Oblique", fontSize=11,
    textColor=COLOR_DARK, alignment=TA_CENTER)

# ── Encabezado y pie de página ──
def header_footer(canvas, doc):
    canvas.saveState()
    width, height = LETTER
    # Encabezado
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(COLOR_DARK)
    canvas.drawString(2*cm, height - 1.0*cm,
        "Seguridad en Sistemas de Cómputo I · Proyecto 1")
    canvas.drawRightString(width - 2*cm, height - 1.0*cm,
        "Sistema de Cifrado César y Atbash")
    canvas.setStrokeColor(COLOR_RULE)
    canvas.setLineWidth(0.5)
    canvas.line(2*cm, height - 1.15*cm, width - 2*cm, height - 1.15*cm)
    # Pie: solo el nombre de la materia y número de página
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(COLOR_DARK)
    canvas.drawCentredString(width / 2, 1.0*cm, f"— {doc.page} —")
    canvas.setStrokeColor(COLOR_RULE)
    canvas.line(2*cm, 1.2*cm, width - 2*cm, 1.2*cm)
    canvas.restoreState()

# ── Parser del Markdown ──
def parse_inline(text):
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"\*\*(.+?)\*\*", r'<font name="Helvetica-Bold">\1</font>', text)
    text = re.sub(r"(?<!\*)\*([^*\n]+?)\*(?!\*)", r'<font name="Helvetica-Oblique">\1</font>', text)
    text = re.sub(r"`([^`]+)`", r'<font name="Courier">\1</font>', text)
    return text

def parse_table(lines, idx):
    rows = []
    while idx < len(lines) and lines[idx].lstrip().startswith("|"):
        row = [c.strip() for c in lines[idx].strip().strip("|").split("|")]
        rows.append(row)
        idx += 1
    if not rows:
        return None, [], idx
    if len(rows) >= 2 and all(set(c.replace(":", "").strip()) <= set("-") for c in rows[1] if c):
        header = rows[0]
        data = rows[2:]
    else:
        header = None
        data = rows
    return header, data, idx

def make_table_flow(header, data, col_widths):
    if not col_widths:
        n_cols = len(header) if header else (len(data[0]) if data else 1)
        col_widths = [None] * n_cols
    if header:
        header_cells = [Paragraph(c if c else " ", S_TABLE_HDR) for c in header]
        body_rows = []
        for row in data:
            body_rows.append([Paragraph(c if c else " ", S_TABLE_CELL) for c in row])
        rows = [header_cells] + body_rows
    else:
        rows = [[Paragraph(c if c else " ", S_TABLE_CELL) for c in row] for row in data]
    n = len(rows[0])
    if not col_widths or all(w is None for w in col_widths):
        avail = LETTER[0] - 4*cm
        col_widths = [avail / n] * n
    t = Table(rows, colWidths=col_widths, repeatRows=1 if header else 0)
    style = [
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("LEFTPADDING", (0,0), (-1,-1), 5),
        ("RIGHTPADDING", (0,0), (-1,-1), 5),
        ("TOPPADDING", (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ("GRID", (0,0), (-1,-1), 0.5, COLOR_RULE),
    ]
    if header:
        style.extend([
            ("BACKGROUND", (0,0), (-1,0), COLOR_TABLE_HDR),
            ("ROWBACKGROUNDS", (0,1), (-1,-1), [white, COLOR_LIGHT_BG]),
        ])
    t.setStyle(TableStyle(style))
    return t

S_CAPTION = make_style("Caption",
    fontName="Helvetica-Oblique", fontSize=8.5, leading=11,
    textColor=HexColor("#555555"), alignment=TA_CENTER,
    spaceBefore=2, spaceAfter=10)

def parse_image(line, md_dir):
    """Convierte '![caption](archivo.png)' en Image + leyenda."""
    m = re.match(r"^!\[(.*?)\]\((.+?)\)\s*$", line.strip())
    if not m:
        return None
    caption, path = m.group(1), m.group(2)
    if not os.path.isabs(path):
        path = os.path.join(md_dir, path)
    if not os.path.exists(path):
        print(f"Aviso: imagen no encontrada: {path}")
        return None
    try:
        img = Image(path, width=16.2*cm, height=16.2*cm, kind='proportional')
        img.hAlign = "CENTER"
        flow = [Spacer(1, 6), img]
        if caption:
            flow.append(Paragraph(parse_inline(caption), S_CAPTION))
        return flow
    except Exception as e:
        print(f"No se pudo insertar la imagen {path}: {e}")
        return None

def build_pdf(md_path, pdf_path, logo_path=None):
    with open(md_path, "r", encoding="utf-8") as f:
        md = f.read()

    lines = md.split("\n")
    i = 0
    flow = []

    # ── PORTADA ──
    if logo_path and os.path.exists(logo_path):
        try:
            logo = Image(logo_path, width=4.5*cm, height=4.5*cm, kind='proportional')
            logo.hAlign = "CENTER"
            flow.append(logo)
            flow.append(Spacer(1, 0.6*cm))
        except Exception as e:
            print(f"No se pudo cargar el logo: {e}")
            flow.append(Spacer(1, 1.5*cm))
    else:
        flow.append(Spacer(1, 1.5*cm))

    flow.append(Paragraph("UNIVERSIDAD AUTÓNOMA DE AGUASCALIENTES", S_INSTITUTION))
    flow.append(Paragraph("Centro de Ciencias Básicas", S_TITLE_SUB))
    flow.append(Spacer(1, 1.2*cm))
    flow.append(HRFlowable(width="55%", thickness=1.2, color=COLOR_GOLD,
                            hAlign="CENTER", spaceBefore=0, spaceAfter=10))
    flow.append(Paragraph("Seguridad en Sistemas de Cómputo I", S_TITLE_SUB))
    flow.append(Spacer(1, 0.3*cm))
    flow.append(Paragraph("Sistema de Cifrado César y Atbash", S_TITLE_MAIN))
    flow.append(Paragraph("con descifrado automático basado en el análisis de Al-Kindi",
                          S_SUBTITLE_ITAL))
    flow.append(Spacer(1, 0.4*cm))
    flow.append(HRFlowable(width="55%", thickness=1.2, color=COLOR_GOLD,
                            hAlign="CENTER", spaceBefore=0, spaceAfter=18))

    portada_data = [
        ["Alumno:",         "Edson Leonardo Sánchez Montalvo"],
        ["Grado y grupo:",  "7 A"],
        ["Profesor:",       "Arturo Ocampo Silva"],
        ["Materia:",        "Seguridad en Sistemas de Cómputo I"],
        ["Proyecto:",       "Sistema de Cifrado César y Atbash"],
        ["Entrega:",        "Septiembre de 2026"],
    ]
    t = Table(portada_data, colWidths=[3.8*cm, 11.5*cm])
    t.setStyle(TableStyle([
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("FONTNAME", (0,0), (0,-1), "Helvetica-Bold"),
        ("FONTNAME", (1,0), (1,-1), "Helvetica"),
        ("FONTSIZE", (0,0), (0,-1), 10.5),
        ("FONTSIZE", (1,0), (1,-1), 11),
        ("TEXTCOLOR", (0,0), (0,-1), COLOR_GOLD),
        ("TEXTCOLOR", (1,0), (1,-1), black),
        ("LEFTPADDING", (0,0), (-1,-1), 4),
        ("RIGHTPADDING", (0,0), (-1,-1), 4),
        ("TOPPADDING", (0,0), (-1,-1), 7),
        ("BOTTOMPADDING", (0,0), (-1,-1), 7),
        ("LINEBELOW", (0,0), (-1,-1), 0.3, COLOR_RULE),
    ]))
    flow.append(t)
    flow.append(Spacer(1, 1.5*cm))
    flow.append(HRFlowable(width="80%", thickness=0.6, color=COLOR_RULE,
                            hAlign="CENTER", spaceBefore=6, spaceAfter=8))
    flow.append(Paragraph("Repositorio · github.com/EdsonLeonardoSM/Seguridad-Cripto", S_CENTER))
    flow.append(Paragraph("Aplicación · edsonleonardosm.github.io/Seguridad-Cripto", S_CENTER))
    flow.append(PageBreak())

    # Saltar hasta después del segundo "---" del MD
    i = 0
    while i < len(lines) and lines[i].strip() != "---":
        i += 1
    while i < len(lines) and lines[i].strip() == "---":
        i += 1

    # ── Resto del documento ──
    while i < len(lines):
        ln = lines[i]
        s = ln.strip()

        if not s:
            i += 1
            continue
        if re.match(r"^---+$", s):
            i += 1
            continue

        m = re.match(r"^(#{1,6})\s+(.+)$", s)
        if m:
            level = len(m.group(1))
            text = parse_inline(m.group(2))
            if level == 1:
                flow.append(Paragraph(text, S_H1))
            elif level == 2:
                flow.append(Paragraph(text, S_H2))
            else:
                flow.append(Paragraph(text, S_H3))
            i += 1
            continue

        if s.startswith("```"):
            i += 1
            code_lines = []
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            i += 1
            code_text = "\n".join(code_lines)
            flow.append(Paragraph(
                code_text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br/>"),
                S_CODE))
            continue

        if s.startswith("|"):
            header, data, ni = parse_table(lines, i)
            i = ni
            flow.append(make_table_flow(header, data, col_widths=None))
            flow.append(Spacer(1, 6))
            continue

        if s.startswith("- "):
            items = []
            while i < len(lines) and lines[i].strip().startswith("- "):
                items.append(lines[i].strip()[2:])
                i += 1
            for it in items:
                flow.append(Paragraph("• " + parse_inline(it), S_BULLET))
            continue

        if re.match(r"^\d+\.\s+", s):
            counter = 1
            while i < len(lines) and re.match(r"^\d+\.\s+", lines[i].strip()):
                item_text = re.sub(r"^\d+\.\s+", "", lines[i].strip())
                flow.append(Paragraph(f"<b>{counter}.</b> " + parse_inline(item_text), S_BULLET))
                counter += 1
                i += 1
            continue

        # Párrafo normal
        para_lines = [s]
        i += 1
        while i < len(lines):
            nxt = lines[i].strip()
            if not nxt or nxt.startswith("#") or nxt.startswith("```") or \
               nxt.startswith("|") or nxt.startswith("- ") or \
               re.match(r"^\d+\.\s+", nxt) or re.match(r"^---+$", nxt):
                break
            para_lines.append(nxt)
            i += 1
        text = " ".join(para_lines)
        flow.append(Paragraph(parse_inline(text), S_BODY))

    # ── Construir el PDF ──
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=LETTER,
        leftMargin=2.2*cm, rightMargin=2.2*cm,
        topMargin=1.8*cm, bottomMargin=1.8*cm,
        title="Sistema de Cifrado César y Atbash",
        author="Edson Leonardo Sánchez Montalvo",
        subject="Seguridad en Sistemas de Cómputo I - Proyecto 1",
    )
    doc.build(flow, onFirstPage=header_footer, onLaterPages=header_footer)
    print(f"PDF generado: {pdf_path}")
    print(f"Tamaño: {os.path.getsize(pdf_path) / 1024:.1f} KB")

if __name__ == "__main__":
    base = r"C:\Users\Edson Leonardo\source\repos\Seguridad-Cripto\DOCUMENTACION"
    md = os.path.join(base, "PROYECTO_CIFRADO.md")
    pdf = os.path.join(base, "PROYECTO_CIFRADO.pdf")
    logo = os.path.join(base, "UAA-LOGO.png")
    build_pdf(md, pdf, logo)
