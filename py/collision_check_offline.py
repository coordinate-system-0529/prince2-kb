# -*- coding: utf-8 -*-
"""
离线 SVG 线框碰撞检测（不依赖浏览器）：解析页面中 <svg class="diagram"> 的
rect/line/polyline，检查连接线是否穿越活动框/事件框。
规则与 py/collision_check.js（浏览器版）一致：
  - 跳过背景/容器（fill=none、宽>900、虚线 stroke-dasharray）
  - 事件框（高<40）允许线从正中穿过（挂线，容差6）
  - 端点深入框内部（inCore）= 违规；端点在框边缘环带（±8）= 合法连接
用法：python -X utf8 py/collision_check_offline.py processes/xx.html [...]
      python -X utf8 py/collision_check_offline.py --selftest
退出码：0=全部零遮挡；1=发现遮挡或错误。
"""
import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

def parse_attrs(tag):
    return dict(re.findall(r'([\w-]+)="([^"]*)"', tag))

def extract_svg(html):
    m = re.search(r'<svg class="diagram".*?</svg>', html, re.S)
    return m.group(0) if m else None

def check_svg(svg):
    rects, segs = [], []
    for tag in re.findall(r'<rect [^>]*/?>', svg):
        a = parse_attrs(tag)
        w, h = float(a.get('width', 0)), float(a.get('height', 0))
        fill = a.get('fill', '')
        if fill == 'none' or w > 900 or 'stroke-dasharray' in a:
            continue
        x, y = float(a.get('x', 0)), float(a.get('y', 0))
        rects.append(dict(x=x + 4, y=y + 4, X=x + w - 4, Y=y + h - 4,
                          cx=x + w / 2, cy=y + h / 2, small=h < 40,
                          label='rect@%g,%g(%gx%g)' % (x, y, w, h)))
    for tag in re.findall(r'<line [^>]*/?>', svg):
        a = parse_attrs(tag)
        segs.append((float(a['x1']), float(a['y1']), float(a['x2']), float(a['y2'])))
    for tag in re.findall(r'<polyline [^>]*/?>', svg):
        a = parse_attrs(tag)
        pts = [float(v) for v in re.split(r'[\s,]+', a['points'].strip())]
        for i in range(0, len(pts) - 3, 2):
            segs.append((pts[i], pts[i + 1], pts[i + 2], pts[i + 3]))

    def near(px, py, b, tol=8):
        return b['x'] - tol <= px <= b['X'] + tol and b['y'] - tol <= py <= b['Y'] + tol
    def in_core(px, py, b):
        return b['x'] + 4 < px < b['X'] - 4 and b['y'] + 4 < py < b['Y'] - 4
    def on_edge(px, py, b):
        return near(px, py, b) and not in_core(px, py, b)

    hits = []
    for (x1, y1, x2, y2) in segs:
        for b in rects:
            if y1 == y2:  # 水平
                y, lo, hi = y1, min(x1, x2), max(x1, x2)
                if b['y'] < y < b['Y'] and hi > b['x'] and lo < b['X']:
                    if b['small'] and abs(y - b['cy']) <= 6:
                        continue
                    if in_core(x1, y1, b) or in_core(x2, y2, b):
                        hits.append('横线 y=%g 端点陷入 [%s]' % (y, b['label']))
                    elif not on_edge(x1, y1, b) and not on_edge(x2, y2, b):
                        hits.append('横线 y=%g (x %g..%g) 穿 [%s]' % (y, lo, hi, b['label']))
            elif x1 == x2:  # 垂直
                x, lo, hi = x1, min(y1, y2), max(y1, y2)
                if b['x'] < x < b['X'] and hi > b['y'] and lo < b['Y']:
                    if b['small'] and abs(x - b['cx']) <= 6:
                        continue
                    if in_core(x1, y1, b) or in_core(x2, y2, b):
                        hits.append('竖线 x=%g 端点陷入 [%s]' % (x, b['label']))
                    elif not on_edge(x1, y1, b) and not on_edge(x2, y2, b):
                        hits.append('竖线 x=%g (y %g..%g) 穿 [%s]' % (x, lo, hi, b['label']))
    return hits, len(segs), len(rects)

def run_file(path):
    with io.open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    svg = extract_svg(html)
    if not svg:
        print('%s: ERROR 未找到 svg.diagram' % path); return False
    hits, ns, nr = check_svg(svg)
    if hits:
        print('%s: 发现 %d 处遮挡' % (path, len(hits)))
        for h in hits: print('  ' + h)
        return False
    print('%s: OK %d 段线 × %d 框, 零遮挡' % (path, ns, nr))
    return True

def selftest():
    """在 sb.html 上注入历史穿框错误，检测器必须报警。"""
    path = r'D:\5月份cc项目\prince2-开发\prince2-kb-develop\processes\sb.html'
    with io.open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    bad = html.replace('808,506 330,506 330,372', '808,506 246,506 246,384')
    if bad == html:
        print('SELFTEST: 注入点未找到（sb.html 结构变了？）'); return False
    hits, _, _ = check_svg(extract_svg(bad))
    if hits:
        print('SELFTEST OK: 注入错误被捕获 %d 处' % len(hits)); return True
    print('SELFTEST FAIL: 注入错误未被捕获！'); return False

if __name__ == '__main__':
    args = sys.argv[1:]
    if not args:
        print(__doc__); sys.exit(1)
    if args == ['--selftest']:
        sys.exit(0 if selftest() else 1)
    ok = all([run_file(p) for p in args])
    sys.exit(0 if ok else 1)
