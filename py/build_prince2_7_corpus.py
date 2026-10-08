# -*- coding: utf-8 -*-
"""从项目目录内的 PRINCE2 第七版 PDF 构建独立查询语料库。

输出仅写入 doc/prince2-7，不修改现有网站 HTML、CSS 或 JavaScript。
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from dataclasses import asdict, dataclass
from pathlib import Path

from pypdf import PdfReader

from build_prince2_2017_corpus import find_headings, find_printed_page, normalize_text, sha256, write_text


OUTPUT = Path("doc/prince2-7")
EDITION_LABEL = "PRINCE2 7 中文版"


@dataclass
class PageRecord:
    pdf_page: int
    printed_page: int | None
    file: str
    char_count: int
    headings: list[str]
    extraction_status: str
    replacement_char_count: int


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--force",
        action="store_true",
        help="仅在确认需要整体重建既有第七版语料库时使用",
    )
    return parser.parse_args()


def source_pdf() -> Path:
    matches = [path for path in Path.cwd().glob("*.pdf") if path.name.startswith("PRINCE2_7")]
    if len(matches) != 1:
        raise ValueError(f"第七版 PDF 匹配数异常: {len(matches)}")
    return matches[0]


def outline_entries(reader: PdfReader) -> list[dict[str, object]]:
    entries: list[dict[str, object]] = []

    def walk(items: list[object], depth: int = 0) -> None:
        for item in items:
            if isinstance(item, list):
                walk(item, depth + 1)
                continue
            title = str(getattr(item, "title", "")).strip()
            if not title:
                continue
            try:
                page = reader.get_destination_page_number(item) + 1
            except Exception:
                page = None
            entries.append({"title": title, "pdf_page": page, "depth": depth})

    walk(reader.outline)
    return entries


def build_readme(source: Path, source_hash: str, page_count: int) -> str:
    return f"""# PRINCE2 7 中文版查询语料库

本目录由 `{source.name}` 提取而成，用于本地查询和与 PRINCE2 2017 版的版本对照。

## 使用边界

- 版本：{EDITION_LABEL}，与 `doc/prince2-2017/` 独立保存和引用。
- 原始文件：`../../{source.name}`
- 原始 PDF 页数：{page_count}
- SHA-256：`{source_hash}`
- 文本处理：仅做断行、空白与项目符号的机械清理，不改写内容。
- 无法解码的项目符号会统一为 `-`，每页数量记录在 `index.json`。
- 引用：标注 `PDF 页`，可识别时同时标注书中印刷页码。
- 无文本页：保留占位说明，可能是图像、章节过渡页或纯图表，需回查源 PDF。

## 文件说明

- `pages/`：逐页 Markdown 文件，是精确定位的主语料。
- `toc.md`：从 PDF 原有书签生成的分层目录。
- `chapters.md`：章节、附录和术语表的起点。
- `index.json`：供程序查询的页码、书签、标题和提取状态索引。

## 查询示例

```powershell
rg -n -C 3 "商业论证" doc/prince2-7/pages
rg -n "产品登记单" doc/prince2-7/toc.md
```

检索结果必须标明“PRINCE2 7 中文版”，不可与 2017 版原文、分类或定义混用。
"""


def main() -> int:
    args = parse_args()
    source = source_pdf().resolve()
    output = OUTPUT.resolve()
    if output.exists():
        if not args.force:
            raise FileExistsError(f"输出目录已存在，拒绝覆盖: {output}。如需重建请显式传入 --force")
        shutil.rmtree(output)

    reader = PdfReader(source)
    if reader.is_encrypted:
        raise ValueError("PDF 已加密，无法安全提取")

    raw_texts = [page.extract_text() or "" for page in reader.pages]
    if not any(len(text.strip()) > 100 for text in raw_texts):
        raise ValueError("未提取到可用正文文本，需要改用 OCR")

    output.mkdir(parents=True)
    records: list[PageRecord] = []
    for number, raw_text in enumerate(raw_texts, start=1):
        replacement_char_count = raw_text.count("\ufffd")
        # 该 PDF 的 U+FFFD 均出现在项目符号位置，明确规范化为 Markdown 项目符号。
        text = normalize_text(raw_text.replace("\ufffd", "-")) if raw_text.strip() else ""
        status = "text" if text else "no_text"
        printed_page = find_printed_page(text) if text else None
        headings = find_headings(text) if text else []
        relative_file = f"pages/page-{number:03d}.md"
        header = [f"<!-- 来源：{EDITION_LABEL} | PDF 页：{number} -->"]
        if printed_page is not None:
            header.append(f"<!-- 印刷页：{printed_page} -->")
        body = text or "[本页未提取到可检索正文，可能为图片、章节过渡页或纯图表。请查阅源 PDF。]\n"
        write_text(output / relative_file, "\n".join(header) + "\n\n" + body)
        records.append(PageRecord(number, printed_page, relative_file, len(text.strip()), headings, status, replacement_char_count))

    toc_entries = outline_entries(reader)
    toc_lines = ["# 目录索引", "", "以下为 PDF 原有书签，页码为 PDF 实际页码。", ""]
    for entry in toc_entries:
        toc_lines.append(f"{'  ' * int(entry['depth'])}- {entry['title']}，PDF 页 {entry['pdf_page']}")
    write_text(output / "toc.md", "\n".join(toc_lines) + "\n")

    chapters = [
        entry for entry in toc_entries
        if int(entry["depth"]) == 0
        and (str(entry["title"]).startswith("第 ") or str(entry["title"]).startswith("附录") or str(entry["title"]).startswith("术语表"))
    ]
    chapter_lines = ["# 章节起点索引", "", "以下起点来自 PDF 原有书签，页码为 PDF 实际页码。", ""]
    for entry in chapters:
        chapter_lines.append(f"- {entry['title']}，PDF 页 {entry['pdf_page']}")
    write_text(output / "chapters.md", "\n".join(chapter_lines) + "\n")

    metadata = reader.metadata or {}
    index = {
        "schema_version": 1,
        "version_scope": EDITION_LABEL,
        "source": {
            "file": source.name,
            "sha256": sha256(source),
            "pdf_pages": len(reader.pages),
            "encrypted": bool(reader.is_encrypted),
            "metadata": {str(key): str(value) for key, value in metadata.items()},
        },
        "toc_entries": toc_entries,
        "chapters": chapters,
        "pages": [asdict(record) for record in records],
    }
    write_text(output / "index.json", json.dumps(index, ensure_ascii=False, indent=2) + "\n")
    write_text(output / "README.md", build_readme(source, index["source"]["sha256"], len(reader.pages)))

    empty_pages = [record.pdf_page for record in records if record.extraction_status == "no_text"]
    print(f"语料库已生成: {output}")
    print(f"PDF 页数: {len(records)}; 书签条目: {len(toc_entries)}; 章节条目: {len(chapters)}")
    print(f"无正文提取页: {empty_pages or '无'}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1)
