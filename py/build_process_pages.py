# -*- coding: utf-8 -*-
"""
生成 processes/cs.html 与 processes/mp.html：
从 process-trigger.html 提取 CS/MP 放大图 SVG（唯一事实源迁移），
修正相对路径（chapters/ entities/ → ../），套入子页面模板
（顶栏 / H1+lead / 卡片①放大图 / 卡片②触发速览 / 卡片③深入阅读+流程导航）。
生成后校验：乱码 0、路径残留 0、锚点齐全。
"""
import sys, io, os
sys.stdout.reconfigure(encoding='utf-8')

SRC = r"D:\5月份cc项目\prince2-开发\prince2-kb-develop\process-trigger.html"
OUT_DIR = r"D:\5月份cc项目\prince2-开发\prince2-kb-develop\processes"

def extract_svg(content, card_id):
    ci = content.find('<div class="card" id="%s"' % card_id)
    if ci == -1: raise SystemExit('ERROR: 未找到 ' + card_id)
    si = content.find('<svg', ci)
    ei = content.find('</svg>', si) + len('</svg>')
    return content[si:ei]

def fix_paths(svg):
    svg = svg.replace('href="chapters/', 'href="../chapters/')
    svg = svg.replace('href="entities/', 'href="../entities/')
    return svg

PAGE = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title} - PRINCE2 7 知识库</title>
<style>
* {{ box-sizing: border-box; }}
html {{ scrollbar-gutter: stable; }}
body {{ margin:0; font-family:'Microsoft YaHei','微软雅黑',sans-serif; background:#fdfbf7; color:#333; line-height:1.7; }}
.topbar {{ background:#2c1810; color:#f0e6d2; padding:12px 24px; display:flex; gap:20px; align-items:center; flex-wrap:wrap; }}
.topbar a {{ color:#d4af37; text-decoration:none; font-size:14px; }}
.topbar a:hover {{ text-decoration:underline; }}
.topbar .home {{ font-weight:bold; }}
.topbar .current {{ color:#8a7f6a; font-size:14px; }}
.container {{ max-width:1400px; margin:0 auto; padding:28px 24px 60px; }}
h1 {{ font-size:24px; color:#2c1810; margin:18px 0 8px; }}
.lead {{ color:#666; font-size:15px; margin:0 0 24px; }}
.card {{ background:#fff; border:1px solid #ece3d0; border-radius:12px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.04); }}
.card + .card {{ margin-top:20px; }}
.card h2 {{ font-size:16px; color:#2c1810; margin:0 0 14px; padding-bottom:8px; border-bottom:1px solid #ece3d0; }}
.diagram {{ display:block; width:100%; max-width:1320px; height:auto; margin:0 auto; }}
.diagram a {{ cursor:pointer; }}
.diagram a text.src-link {{ fill:#1a5fb4; text-decoration:underline; }}
.diagram a:hover text.src-link {{ fill:#0a3d8f; }}
.diagram a:hover rect {{ stroke-width:3; }}
.trig-table {{ width:100%; border-collapse:collapse; font-size:14px; }}
.trig-table th {{ text-align:left; padding:8px 10px; width:110px; color:#8a7f6a; font-weight:bold; vertical-align:top; border-bottom:1px dotted #ece3d0; }}
.trig-table td {{ padding:8px 10px; border-bottom:1px dotted #ece3d0; }}
.trig-table tr:last-child th, .trig-table tr:last-child td {{ border-bottom:none; }}
.tag-ev {{ display:inline-block; padding:2px 10px; border-radius:10px; font-size:12px; background:#fdebd5; border:1px solid #d97706; color:#9a5b06; margin:2px 3px; }}
.tag-mp {{ display:inline-block; padding:2px 10px; border-radius:10px; font-size:12px; background:#f6e4f6; border:1px solid #8B008B; color:#6b1a6b; margin:2px 3px; text-decoration:none; }}
a.tag-mp:hover {{ filter:brightness(0.92); }}
.read-links a {{ color:#1a5fb4; }}
.proc-nav {{ display:flex; justify-content:space-between; align-items:center; margin-top:16px; padding-top:14px; border-top:1px solid #ece3d0; font-size:14px; }}
.proc-nav a {{ color:#2E8B57; text-decoration:none; font-weight:bold; }}
.proc-nav a:hover {{ text-decoration:underline; }}
.proc-nav .disabled {{ color:#bbb; }}
@media (max-width:600px){{ h1{{font-size:20px;}} .container{{padding:18px 14px 40px;}} .card{{overflow-x:auto;}} .diagram{{min-width:880px;}} }}
</style>
</head>
<body>
<nav class="topbar">
  <a class="home" href="../index.html">← PRINCE2 7 知识库</a>
  <a href="../graph-full.html">管理产品信息流</a>
  <a href="../entities/process.html">流程索引</a>
  <span class="current">流程详情 · {abbr}</span>
</nav>
<div class="container">
  <h1>{h1}</h1>
  <p class="lead">{lead}</p>

  <div class="card">
    <h2>📐 活动放大图</h2>
    {svg}
  </div>

  <div class="card">
    <h2>⚡ 触发速览</h2>
    <table class="trig-table">
      <tr><th>谁触发我</th><td>{trig_in}</td></tr>
      <tr><th>我触发谁</th><td>{trig_out}</td></tr>
      <tr><th>产出管理产品</th><td>{products}</td></tr>
    </table>
  </div>

  <div class="card">
    <h2>📖 深入阅读</h2>
    <p class="read-links" style="margin:0">{reading}</p>
    <div class="proc-nav">
      <span>{nav_prev}</span>
      <a href="../entities/process.html">全部 7 个流程</a>
      <span>{nav_next}</span>
    </div>
  </div>
</div>
</body>
</html>
'''

def main():
    with io.open(SRC, 'r', encoding='utf-8') as f:
        src = f.read()

    os.makedirs(OUT_DIR, exist_ok=True)

    cs_svg = fix_paths(extract_svg(src, 'cs-detail'))
    mp_svg = fix_paths(extract_svg(src, 'mp-detail'))

    pages = {
        'cs.html': dict(
            title='阶段控制 CS · 流程详情', abbr='阶段控制 CS',
            h1='阶段控制 CS <span style="font-size:15px;color:#8a7f6a;font-weight:normal">Controlling a Stage · 第16章</span>',
            lead='项目经理的日常管理流程：把阶段计划拆成工作包派给交付小组，持续监控进展、处理问题与风险，向项目管理委员会汇报，并在阶段边界或项目终点临近时触发下一步。',
            svg=cs_svg,
            trig_in='<span class="tag-ev">已授权项目（DP · 首次）</span><span class="tag-ev">已授权阶段（DP · 每阶段）</span><span class="tag-ev">例外计划批准（DP · 例外时）</span><span class="tag-ev">新问题或风险（随时）</span>',
            trig_out='<span class="tag-ev">工作包已授权 → MP</span><span class="tag-ev">阶段边界临近 → SB</span><span class="tag-ev">项目竣工临近 → CP</span><span class="tag-ev">已提出例外 / 要点报告 → DP</span>',
            products='<a class="tag-mp" href="../entities/product.html">工作包描述</a><a class="tag-mp" href="../entities/product.html">要点报告</a><a class="tag-mp" href="../entities/product.html">例外报告</a><a class="tag-mp" href="../entities/product.html">问题报告</a><a class="tag-mp" href="../entities/product.html">产品登记单</a>',
            reading='流程原文：<a href="../chapters/ch16.html">第16章 阶段控制</a>　·　管理产品定义：<a href="../chapters/appendix_a.html">附录 A</a>　·　信息流全景：<a href="../graph-full.html">管理产品信息流</a>',
            nav_prev='<a href="ip.html">◁ IP 项目启动</a>',
            nav_next='<a href="mp.html">MP 产品交付管理 ▷</a>',
        ),
        'mp.html': dict(
            title='产品交付管理 MP · 流程详情', abbr='产品交付管理 MP',
            h1='产品交付管理 MP <span style="font-size:15px;color:#8a7f6a;font-weight:normal">Managing Product Delivery · 第17章</span>',
            lead='小组经理的交付流程：接受阶段控制派来的工作包，带领小组执行并做质量检查，定期交回检查点报告，完成后通知阶段控制验收。',
            svg=mp_svg,
            trig_in='<span class="tag-ev">工作包已授权（CS）＋ 工作包描述</span>',
            trig_out='<span class="tag-ev">检查点报告 → CS（定期）</span><span class="tag-ev">已完成工作包通知 → CS</span>',
            products='<a class="tag-mp" href="../entities/product.html">小组计划</a><a class="tag-mp" href="../entities/product.html">检查点报告</a><span class="tag-ev" style="background:#eee;border-color:#999;color:#555">专业产品（交付物）</span>',
            reading='流程原文：<a href="../chapters/ch17.html">第17章 产品交付管理</a>　·　管理产品定义：<a href="../chapters/appendix_a.html">附录 A</a>　·　信息流全景：<a href="../graph-full.html">管理产品信息流</a>',
            nav_prev='<a href="cs.html">◁ CS 阶段控制</a>',
            nav_next='<a href="sb.html">SB 阶段边界管理 ▷</a>',
        ),
    }

    for fname, ctx in pages.items():
        html = PAGE.format(**ctx)
        # 校验
        if '�' in html:
            print('ERROR: %s 含乱码' % fname); return
        if 'href="chapters/' in html or 'href="entities/' in html:
            print('ERROR: %s 残留未修正的相对路径' % fname); return
        path = os.path.join(OUT_DIR, fname)
        with io.open(path, 'w', encoding='utf-8') as f:
            f.write(html)
        print('✓ %s  %d 行  锚点数 pn=%d' % (fname, html.count(chr(10)) + 1, html.count('#pn-')))

    print('完成。')

if __name__ == '__main__':
    main()
