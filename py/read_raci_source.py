# -*- coding: utf-8 -*-
"""只读提取 RACI 原始表页，坐标和截图用于列位置核验。"""
from pathlib import Path
import fitz

root = Path(__file__).resolve().parents[1]
source = next(root.glob("PRINCE2_7*.pdf"))
output = root / "output" / "raci-source"
output.mkdir(parents=True, exist_ok=True)
with fitz.open(source) as document:
    for number in [252, 262, 274, 285, 293, 302, 309]:
        page = document[number - 1]
        page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5)).save(output / f"page-{number}.png")
        print(f"\nPDF PAGE {number}")
        for block in page.get_text("blocks"):
            print(tuple(round(value, 1) for value in block[:4]), block[4].strip().replace("\n", " | "))
