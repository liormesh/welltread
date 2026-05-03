#!/usr/bin/env python3
"""Assemble the 16 turnaround stills into a 4x4 review grid with labels."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BASE = Path("/Users/liorme/Projects/welltread/public/cast/turnarounds")
OUT = Path("/Users/liorme/Projects/welltread/public/cast/turnarounds/_grid_review.png")

CHARS = ["eleanor", "james", "maria", "david"]
ANGLES = ["front", "three_quarter", "profile", "back"]

CELL_W = 600
PAD = 24
LABEL_H = 40
TOP_LABEL_H = 50
LEFT_LABEL_W = 120

def fit_cell(img: Image.Image, target_w: int) -> Image.Image:
    ratio = target_w / img.width
    return img.resize((target_w, int(img.height * ratio)), Image.LANCZOS)

# Compute uniform cell height based on the tallest aspect after fitting width.
sample_imgs = []
for c in CHARS:
    for a in ANGLES:
        sample_imgs.append(Image.open(BASE / c / f"{a}.png"))
fitted = [fit_cell(im, CELL_W) for im in sample_imgs]
cell_h = max(im.height for im in fitted)

# Pad each fitted image vertically (centered) to uniform cell height.
def pad_to(im: Image.Image, h: int) -> Image.Image:
    if im.height == h:
        return im
    bg = Image.new("RGB", (im.width, h), (250, 247, 242))  # paper cream
    bg.paste(im, (0, (h - im.height) // 2))
    return bg

cells = [[pad_to(fit_cell(Image.open(BASE / c / f"{a}.png"), CELL_W), cell_h) for a in ANGLES] for c in CHARS]

W = LEFT_LABEL_W + 4 * (CELL_W + PAD) + PAD
H = TOP_LABEL_H + 4 * (cell_h + LABEL_H + PAD) + PAD

canvas = Image.new("RGB", (W, H), (250, 247, 242))
draw = ImageDraw.Draw(canvas)

try:
    font_lg = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 24)
    font_md = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 20)
except Exception:
    font_lg = ImageFont.load_default()
    font_md = ImageFont.load_default()

ANGLE_LABELS = {"front": "FRONT", "three_quarter": "3/4", "profile": "PROFILE", "back": "BACK"}

# Top column labels
for j, a in enumerate(ANGLES):
    x = LEFT_LABEL_W + j * (CELL_W + PAD) + CELL_W // 2
    draw.text((x, TOP_LABEL_H // 2), ANGLE_LABELS[a], fill=(26, 26, 26), font=font_lg, anchor="mm")

# Rows
for i, c in enumerate(CHARS):
    y_top = TOP_LABEL_H + i * (cell_h + LABEL_H + PAD) + PAD
    # Left character label
    draw.text((LEFT_LABEL_W // 2, y_top + cell_h // 2), c.upper(), fill=(45, 79, 74), font=font_lg, anchor="mm")
    for j, a in enumerate(ANGLES):
        x = LEFT_LABEL_W + j * (CELL_W + PAD)
        canvas.paste(cells[i][j], (x, y_top))

canvas.save(OUT, "PNG", optimize=True)
print(f"Grid saved: {OUT}")
print(f"Dimensions: {W}x{H}")
print(f"File size: {OUT.stat().st_size // 1024}KB")
