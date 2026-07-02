# -*- coding: utf-8 -*-
"""
给 graph-full.html 所有 DP 事件框（.ev）补上上下方向箭头：
上行(ev-up →DP)包成 ↑ ev ↑，下行(ev-down DP→)包成 ↓ ev ↓，
与 CS↔MP 信息流带一致，标明每条流的起点与终点方向。
默认 dry-run；加 --apply 落地。
"""
import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

HTML = r"D:\5月份cc项目\prince2-开发\prince2-kb-develop\graph-full.html"

# 匹配未包裹的事件框：<span class="ev ev-up|down"><span class="ev-route">R</span><span>N</span></span>
PAT = re.compile(
    r'<span class="ev ev-(up|down)"><span class="ev-route">(.*?)</span><span>(.*?)</span></span>'
)

def repl(m):
    d, route, name = m.group(1), m.group(2), m.group(3)
    arrow = '↑' if d == 'up' else '↓'
    return ('<span class="ev-wrap {d}"><span class="ev-arrow">{a}</span>'
            '<span class="ev ev-{d}"><span class="ev-route">{r}</span><span>{n}</span></span>'
            '<span class="ev-arrow">{a}</span></span>').format(d=d, a=arrow, r=route, n=name)

def main():
    apply = '--apply' in sys.argv
    with io.open(HTML, 'r', encoding='utf-8') as f:
        content = f.read()

    matches = PAT.findall(content)
    print('匹配到未包裹的 .ev 数:', len(matches))
    if content.count('ev-wrap"') or '"ev-wrap ' in content:
        # 若已存在 ev-wrap，说明已处理过，避免二次包裹
        print('警告: 文件已含 ev-wrap，检查是否重复运行')

    new_content, n = PAT.subn(repl, content)
    print('替换数:', n, '(预期 12)')
    print('替换后 ev-wrap 出现:', new_content.count('class="ev-wrap'))
    print('替换后 ev-arrow 出现:', new_content.count('class="ev-arrow"'), '(预期 24)')

    if '�' in new_content:
        print('ERROR: 检测到 U+FFFD 乱码，中止'); return
    # 防重复包裹：不应出现 ev-wrap 套 ev-wrap
    if 'ev-wrap"><span class="ev-arrow">↑</span><span class="ev-wrap' in new_content:
        print('ERROR: 检测到嵌套 ev-wrap'); return

    if apply:
        with io.open(HTML, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print('=== 已写回 ===')
    else:
        print('=== DRY-RUN（加 --apply 落地）===')

if __name__ == '__main__':
    main()
