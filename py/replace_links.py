# -*- coding: utf-8 -*-
"""
替换 graph-full.html 的 computeLinks 函数：按流程分配走线通道，
让贯穿线绕开流程框（SB 走左外、CP 走右外、CS 走中央通道、SU/IP 直接上）。
默认 dry-run；加 --apply 落地。
"""
import sys, io
sys.stdout.reconfigure(encoding='utf-8')

HTML = r"D:\5月份cc项目\prince2-开发\prince2-kb-develop\graph-full.html"
START = 'function computeLinks() {'
END = "window.addEventListener('resize', computeLinks);"

NEW = r'''function computeLinks() {
    var svg = document.getElementById('flow-links');
    var container = document.querySelector('.container');
    var dp = document.getElementById('node-dp');
    if (!svg || !container || !dp) return;
    var NS = 'http://www.w3.org/2000/svg';
    var c = container.getBoundingClientRect();
    svg.setAttribute('viewBox', '0 0 ' + c.width + ' ' + c.height);
    svg.setAttribute('width', c.width);
    svg.setAttribute('height', c.height);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var dpBottom = dp.getBoundingClientRect().bottom - c.top;

    function rectOf(el) {
        var r = el.getBoundingClientRect();
        return { left: r.left - c.left, right: r.right - c.left, top: r.top - c.top, bottom: r.bottom - c.top, cx: (r.left + r.right) / 2 - c.left };
    }
    function nodeById(id) { var e = document.getElementById(id); return e ? rectOf(e) : null; }
    var su = nodeById('node-su'), ip = nodeById('node-ip');
    var midCh = (su && ip) ? (su.right + ip.left) / 2 : c.width / 2;

    function seg(d, color) {
        var p = document.createElementNS(NS, 'path');
        p.setAttribute('d', d); p.setAttribute('fill', 'none');
        p.setAttribute('stroke', color); p.setAttribute('stroke-width', '1.5');
        svg.appendChild(p);
    }
    function tri(x, y, dir, color) {
        var s = 4;
        var pts = dir === 'up'
            ? (x - s) + ',' + (y + s) + ' ' + (x + s) + ',' + (y + s) + ' ' + x + ',' + (y - s)
            : (x - s) + ',' + (y - s) + ' ' + (x + s) + ',' + (y - s) + ' ' + x + ',' + (y + s);
        var t = document.createElementNS(NS, 'polygon');
        t.setAttribute('points', pts); t.setAttribute('fill', color);
        svg.appendChild(t);
    }

    container.querySelectorAll('.layer--managing .proc-col').forEach(function (col) {
        var node = col.querySelector('.proc-node');
        if (!node) return;
        var type = (node.id || '').replace('node-', '');
        var nr = rectOf(node);
        col.querySelectorAll('.ev-wrap').forEach(function (w, idx) {
            var box = w.querySelector('.ev'); if (!box) return;
            var b = rectOf(box);
            var up = w.classList.contains('up');
            var color = up ? '#90c8a0' : '#d4af37';
            // 上段通道 x：按流程绕开流程框
            var lane;
            if (type === 'su' || type === 'ip') lane = b.cx;          // 顶排上方即 DP，直接上
            else if (type === 'sb') lane = nr.left - 16 - idx * 9;     // SB 走左外侧
            else if (type === 'cp') lane = nr.right + 16 + idx * 9;    // CP 走右外侧
            else lane = midCh + (idx - 2) * 20;                        // CS 走中央通道，错开加大
            var rise = 10 + idx * 8;                                   // 横移段按序号错开高度
            // 上段：框顶 →(升一小段)→ 横移到通道 →(沿通道上到 DP)
            if (Math.abs(lane - b.cx) < 1) {
                seg('M ' + b.cx + ' ' + b.top + ' L ' + b.cx + ' ' + dpBottom, color);
            } else {
                seg('M ' + b.cx + ' ' + b.top + ' L ' + b.cx + ' ' + (b.top - rise) +
                    ' L ' + lane + ' ' + (b.top - rise) + ' L ' + lane + ' ' + dpBottom, color);
            }
            // 下段：框底 → 流程框顶（折线汇聚；空间足够时水平段按序号错开高度，避免多框重叠）
            var gap = nr.top - b.bottom;
            var midY = gap > 30 ? (nr.top - 8 - idx * 8) : (b.bottom + nr.top) / 2;
            seg('M ' + b.cx + ' ' + b.bottom + ' L ' + b.cx + ' ' + midY +
                ' L ' + nr.cx + ' ' + midY + ' L ' + nr.cx + ' ' + nr.top, color);
            // 箭头（数据流向：up 两段朝上，down 两段朝下）
            if (up) { tri(b.cx, b.bottom, 'up', color); tri(lane, dpBottom, 'up', color); }
            else { tri(b.cx, b.top, 'down', color); tri(nr.cx, nr.top, 'down', color); }
        });
    });
}
window.addEventListener('load', computeLinks);
window.addEventListener('resize', computeLinks);'''

def main():
    apply = '--apply' in sys.argv
    with io.open(HTML, 'r', encoding='utf-8') as f:
        content = f.read()
    si = content.find(START)
    ei = content.find(END)
    if si == -1 or ei == -1:
        print('ERROR: 锚点未找到 si=%d ei=%d' % (si, ei)); return
    if content.count(START) != 1 or content.count(END) != 1:
        print('ERROR: 锚点不唯一 START=%d END=%d' % (content.count(START), content.count(END))); return
    ei_end = ei + len(END)
    old = content[si:ei_end]
    print('旧函数段:', old.count(chr(10)) + 1, '行')
    print('新函数段:', NEW.count(chr(10)) + 1, '行')
    new_content = content[:si] + NEW + content[ei_end:]
    if '�' in new_content:
        print('ERROR: 乱码'); return
    # 校验关键片段存在
    for must in ["type === 'sb'", "type === 'cp'", 'midCh', "window.addEventListener('load', computeLinks)"]:
        if must not in new_content:
            print('ERROR: 缺失', must); return
    if apply:
        with io.open(HTML, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print('=== 已写回 ===')
    else:
        print('=== DRY-RUN（加 --apply 落地）===')

if __name__ == '__main__':
    main()
