# -*- coding: utf-8 -*-
"""从本地 PRINCE2 2017 中文 PDF 构建独立、可追溯的查询语料库。

输出仅写入 doc/prince2-2017，不触碰当前 PRINCE2 7 网站页面。
每个页面保留 PDF 页码和可识别的印刷页码，方便后续回答时回溯来源。
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import sys
from dataclasses import asdict, dataclass
from pathlib import Path

from pypdf import PdfReader


SOURCE_NAME = "PRINCE2.2017.CN.ver1.0.pdf"
DEFAULT_OUTPUT = Path("doc/prince2-2017")
TOC_PDF_PAGES = range(4, 9)  # PDF 第 4 至 8 页为目录页，页码从 1 开始。


@dataclass
class PageRecord:
    pdf_page: int
    printed_page: int | None
    file: str
    char_count: int
    headings: list[str]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=Path(SOURCE_NAME))
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument(
        "--force",
        action="store_true",
        help="仅在确认需要整体重建既有语料库时使用",
    )
    return parser.parse_args()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def normalize_text(text: str) -> str:
    """只做机械清理，不改写原文语义。"""
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    # Word 内嵌字体的项目符号会以私有区字形提取，统一为普通 Markdown 项目符号。
    text = re.sub(r"[\ue000-\uf8ff]", "-", text)
    text = text.replace("\u00a0", " ")
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip() + "\n"


def find_printed_page(text: str) -> int | None:
    """提取页眉或页脚中独立出现的印刷页码，歧义时保留为空。"""
    candidates = [
        int(match.group(1))
        for match in re.finditer(r"(?m)^\s*(\d{1,3})\s*$", text)
    ]
    candidates = [number for number in candidates if number <= 500]
    if not candidates:
        return None
    # 正文页通常仅有一个独立页码。目录页的多个条目会造成歧义，因此不误标。
    return candidates[-1] if len(set(candidates)) == 1 else None


def find_headings(text: str) -> list[str]:
    patterns = (
        r"^(?:\d{1,2}|[A-G])(?:\.\d+){0,3}\s+[^\n]{2,80}$",
        r"^(?:附录\s*[A-G]|词汇表|内容概要)\s*[^\n]{0,80}$",
    )
    headings: list[str] = []
    for line in text.splitlines():
        candidate = re.sub(r"\s+", " ", line).strip()
        if any(re.match(pattern, candidate) for pattern in patterns):
            if candidate not in headings:
                headings.append(candidate)
    return headings


def extract_toc_entries(toc_text: str) -> list[dict[str, object]]:
    """从目录页抓取带印刷页码的条目，供人工和程序共同查询。"""
    entries: list[dict[str, object]] = []
    # Word 导出的引导点在文本层常被拆成“. . .”或多段省略号，不能只匹配连续三个点。
    pattern = re.compile(
        r"(?m)^\s*(?P<title>[^\n]{2,100}?)\s*(?:\.\s*){3,}(?P<page>\d{1,3})\s*$"
    )
    for match in pattern.finditer(toc_text):
        title = re.sub(r"\s+", " ", match.group("title")).strip()
        if title and not title.isdigit():
            entries.append({"title": title, "printed_page": int(match.group("page"))})
    return entries


def write_text(path: Path, text: str) -> None:
    if "�" in text:
        raise ValueError(f"拒绝写入包含 U+FFFD 的文件: {path}")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="\n")


def build_readme(source: Path, source_hash: str, page_count: int) -> str:
    return f"""# PRINCE2 2017 中文版查询语料库

本目录由 `{source.name}` 提取而成，用于后续本地检索与版本对照。

## 使用边界

- 版本：PRINCE2 2017 中文参照版，不与当前网站的 PRINCE2 7 内容混用。
- 原始文件：`../../{source.name}`
- 原始 PDF 页数：{page_count}
- SHA-256：`{source_hash}`
- 文本处理：仅做断行、空白与项目符号的机械清理，不改写内容。
- 引用：同时标注 `PDF 页` 和可识别时的 `印刷页`；两者可能不相同。

## 文件说明

- `pages/`：414 个逐页 Markdown 文件，是精确定位的主语料。
- `toc.md`：从 PDF 目录页提取的目录条目。
- `index.json`：供程序查询的页码、标题和章节索引。
- `chapters.md`：按目录印刷页码映射得到的章节起点，便于浏览。

## 查询示例

```powershell
rg -n -C 3 "商业论证" doc/prince2-2017/pages
rg -n "风险登记单" doc/prince2-2017/toc.md
```

检索结果必须说明其为“PRINCE2 2017 版”，不可作为 PRINCE2 7 原文或官方第 7 版分类的依据。
"""


def main() -> int:
    args = parse_args()
    source = args.source.resolve()
    output = args.output.resolve()
    if not source.is_file():
        raise FileNotFoundError(f"未找到源 PDF: {source}")
    if output.exists():
        if not args.force:
            raise FileExistsError(f"输出目录已存在，拒绝覆盖: {output}。如需重建请显式传入 --force")
        shutil.rmtree(output)

    reader = PdfReader(source)
    if reader.is_encrypted:
        raise ValueError("PDF 已加密，无法安全提取")

    page_texts = [normalize_text(page.extract_text() or "") for page in reader.pages]
    if not any(len(text.strip()) > 100 for text in page_texts):
        raise ValueError("未提取到可用正文文本，需要改用 OCR")

    output.mkdir(parents=True)
    pages_dir = output / "pages"
    records: list[PageRecord] = []
    for number, text in enumerate(page_texts, start=1):
        printed_page = find_printed_page(text)
        headings = find_headings(text)
        relative_file = f"pages/page-{number:03d}.md"
        header = [f"<!-- 来源：PRINCE2 2017 中文版 | PDF 页：{number} -->"]
        if printed_page is not None:
            header.append(f"<!-- 印刷页：{printed_page} -->")
        write_text(pages_dir / f"page-{number:03d}.md", "\n".join(header) + "\n\n" + text)
        records.append(
            PageRecord(number, printed_page, relative_file, len(text.strip()), headings)
        )

    toc_text = "\n\n".join(page_texts[number - 1] for number in TOC_PDF_PAGES)
    toc_entries = extract_toc_entries(toc_text)
    toc_lines = ["# 目录索引", "", "以下为 PDF 目录页的提取结果，页码为书中印刷页码。", ""]
    for entry in toc_entries:
        toc_lines.append(f"- {entry['title']}，印刷页 {entry['printed_page']}")
    write_text(output / "toc.md", "\n".join(toc_lines) + "\n")

    printed_to_pdf = {
        record.printed_page: record.pdf_page
        for record in records
        if record.printed_page is not None
    }
    chapter_entries = [
        entry
        for entry in toc_entries
        if re.match(r"^(?:\d{1,2}\s+|附录\s*[A-G]|词汇表$)", str(entry["title"]))
    ]
    chapters_lines = ["# 章节起点索引", "", "目录印刷页码映射到 PDF 实际页码。映射为空时，后续查询请从相邻页检索。", ""]
    chapter_index: list[dict[str, object]] = []
    for entry in chapter_entries:
        printed_page = int(entry["printed_page"])
        pdf_page = printed_to_pdf.get(printed_page)
        chapter = {**entry, "pdf_page": pdf_page}
        chapter_index.append(chapter)
        pdf_note = f"PDF 页 {pdf_page}" if pdf_page else "PDF 页待定位"
        chapters_lines.append(f"- {entry['title']}，印刷页 {printed_page}，{pdf_note}")
    write_text(output / "chapters.md", "\n".join(chapters_lines) + "\n")

    metadata = reader.metadata or {}
    index = {
        "schema_version": 1,
        "source": {
            "file": source.name,
            "sha256": sha256(source),
            "pdf_pages": len(reader.pages),
            "encrypted": bool(reader.is_encrypted),
            "metadata": {str(key): str(value) for key, value in metadata.items()},
        },
        "version_scope": "PRINCE2 2017 中文参照版，独立于 PRINCE2 7 网站内容",
        "toc_entries": toc_entries,
        "chapters": chapter_index,
        "pages": [asdict(record) for record in records],
    }
    write_text(output / "index.json", json.dumps(index, ensure_ascii=False, indent=2) + "\n")
    write_text(output / "README.md", build_readme(source, index["source"]["sha256"], len(reader.pages)))

    empty_pages = [record.pdf_page for record in records if record.char_count == 0]
    print(f"语料库已生成: {output}")
    print(f"PDF 页数: {len(records)}; 目录条目: {len(toc_entries)}; 章节条目: {len(chapter_index)}")
    print(f"空白文本页: {empty_pages or '无'}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1)
