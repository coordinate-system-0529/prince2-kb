# -*- coding: utf-8 -*-
"""只读核对学习指引引用的第七版 PDF 页码、页脚与文件身份。"""
from pathlib import Path
import hashlib
import json
import re
import fitz

root = Path(__file__).resolve().parents[1]
index = json.loads((root / "doc/prince2-7/index.json").read_text(encoding="utf-8"))
source = root / index["source"]["file"]
assert hashlib.sha256(source.read_bytes()).hexdigest() == index["source"]["sha256"], "教材与索引不是同一文件"
pages = [40, 52, 54, 62, 72, 78, 80, 91, 92, 93, 94, 98, 117, 119,
         124, 127, 128, 133, 146, 148, 152, 160, 161, 167, 168, 169,
         172, 187, 189, 192, 205, 206, 207, 212, 214, 230, 235, 240,
         246, 249, 252, 256, 262, 266, 271, 274, 278, 285, 288, 293,
         296, 302, 304, 309, 312, 314, 315, 316, 317, 318, 319, 320,
         321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332,
         333, 334, 335, 336, 338, 339, 340, 341, 342, 343, 344, 346]
guide = root / "doc/PRINCE2教材与案例对照学习指引.md"
if guide.exists():
    pages = sorted({number for first, last in re.findall(r"PDF (\d+)(?:至(\d+))?页", guide.read_text(encoding="utf-8"))
                    for number in range(int(first), int(last or first) + 1)})
with fitz.open(source) as document:
    assert len(document) == index["source"]["pdf_pages"]
    for number in pages:
        page = document[number - 1]
        text = page.get_text()
        # 本文件正文页序与印刷页相差 21，逐页检查实际页脚，不仅凭偏移推算。
        footer = " ".join(block[4] for block in page.get_text("blocks")
                          if block[1] > page.rect.height - 70)
        expected = number - 21
        assert re.search(rf"(?<!\d){expected}(?!\d)", footer), f"PDF {number} 页脚未匹配印刷页 {expected}: {footer}"
        assert text.strip(), f"PDF {number} 无文本，需人工查图"
    print(json.dumps({"source_hash_match": True, "pdf_pages": len(document),
                      "referenced_pages_checked": len(pages), "printed_page_offset_verified": 21,
                      "boundary": "核验文件身份和引用页脚，不等于教材全文审校"}, ensure_ascii=False))
