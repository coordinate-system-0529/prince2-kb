# -*- coding: utf-8 -*-
"""
processes/ 流程详情子页面的共享模板与渲染函数。
页面结构：顶栏 / H1+lead / 卡片①活动放大图 / 卡片②触发速览 / 卡片③深入阅读+流程导航。
被 build_process_pages.py（cs/mp）与各流程生成脚本（sb/cp/su/dp/ip）复用。
"""
import io, os

OUT_DIR = r"D:\5月份cc项目\prince2-开发\prince2-kb-develop\processes"

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

def render(fname, ctx):
    """渲染并写出子页面；返回 True 表示通过校验并写入。"""
    html = PAGE.format(**ctx)
    if '�' in html:
        print('ERROR: %s 含乱码' % fname); return False
    if 'href="chapters/' in html or 'href="entities/' in html:
        print('ERROR: %s 残留未修正相对路径' % fname); return False
    os.makedirs(OUT_DIR, exist_ok=True)
    path = os.path.join(OUT_DIR, fname)
    with io.open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('✓ %s  %d 行  pn 锚点 %d' % (fname, html.count(chr(10)) + 1, html.count('#pn-')))
    return True
