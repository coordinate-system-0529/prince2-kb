# -*- coding: utf-8 -*-
"""
【存档，勿再运行】此脚本一次性生成了 graph-full-v2.html；v2 已于 2026-07-02 定稿
转正为正式的 graph-full.html，源文件 graph-full-v2.html 已不存在，重跑会因找不到
输入而报错。保留仅作 v2 生成逻辑的历史记录（记录扁平 original 上补 5 项的过程）。

在 graph-full-v2.html（original 扁平布局副本）上补齐对照官方图 12.2 的 5 项：
① CS→SB 触发线（阶段边界临近）    —— JS 绝对定位连线，走 SB 列右外通道
② CS→CP 跨列触发线（项目竣工临近）—— 同上，更外侧通道横跨到 CP
③ 新问题/风险 → CS               —— CS 右侧 spacer 内标签
④ 项目授权通知（DP→业务）        —— 业务信息流带
⑤ 建议请求/建议和决策（ad hoc）   —— 业务信息流带
含移动端回退（触发线隐藏→文字药丸）。共 7 处锚点替换，全部校验唯一。
默认 dry-run；--apply 落地。
"""
import sys, io
sys.stdout.reconfigure(encoding='utf-8')

HTML = r"D:\5月份cc项目\prince2-开发\prince2-kb-develop\graph-full-v2.html"

# (说明, 锚点旧文本, 新文本)
EDITS = []

# ── ④⑤ 业务↔指导信息流带 ──
EDITS.append(('④⑤ 业务信息流带', '''            <span class="band-item up">↑ 启动通知（DP→业务）</span>
            <span class="band-item up">↑ 收尾通知（DP→业务）</span>''',
'''            <span class="band-item up">↑ 启动通知（DP→业务）</span>
            <span class="band-item up">↑ 项目授权通知（DP→业务）</span>
            <span class="band-item up">↑ 收尾通知（DP→业务）</span>
            <span class="band-item bi">↕ 建议请求 / 建议和决策（业务↔DP，ad hoc）</span>'''))

# ── ③ 新问题/风险 → CS（CS 右侧 spacer 放标签；同时在 CS 前插移动端触发回退）──
EDITS.append(('③ 新问题/风险 + 移动端触发回退', '''                    <!-- CS -->
                    <div class="proc-node" id="node-cs" onclick="toggleDetail('cs')">''',
'''                    <!-- 触发回退（移动端）：CS 对上游流程的触发；桌面端见绝对定位触发线 -->
                    <div class="trigger-fb">
                        <span class="band-item up">↑ 阶段边界临近（CS 触发 → SB）</span>
                        <span class="band-item up">↑ 项目竣工临近（CS 触发 → CP）</span>
                    </div>

                    <!-- CS -->
                    <div class="proc-node" id="node-cs" onclick="toggleDetail('cs')">'''))

EDITS.append(('③ CS 右侧 spacer 换标签容器', '''                    <div class="arrow-spacer"></div>
                    <div class="flow-spacer"></div>
                </div><!-- /managing-row bottom -->''',
'''                    <div class="arrow-spacer"></div>
                    <div class="flow-spacer cs-issue-spacer"><span class="cs-input-tag">← 新问题 / 风险</span></div>
                </div><!-- /managing-row bottom -->'''))

# ── ①② 触发线 CSS（插在 dp-downflow 规则前）──
EDITS.append(('①② 触发线 CSS', '''        /* DP 下行授权列表：桌面端改用连接器，故隐藏；移动端作为回退显示 */
        .dp-downflow { display:none; }''',
'''        /* CS→SB / CS→CP 触发连线（绿色，JS 定位；语义：CS 运行中触发上游流程） */
        .trig-line { position:absolute; background:var(--green-light); z-index:2; opacity:0.8; }
        .trig-arrow { position:absolute; width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-bottom:7px solid var(--green-light); z-index:2; opacity:0.9; }
        .trig-label { position:absolute; background:rgba(46,139,87,0.15); border:1px solid rgba(46,139,87,0.55); color:var(--green-light); font-size:0.66em; font-weight:bold; letter-spacing:0.04em; padding:2px 9px; border-radius:8px; white-space:nowrap; z-index:3; }
        /* ③ 新问题/风险 → CS 输入标签（放 CS 右侧 flex:1 spacer 内，min-width:0 保持四列网格不被撑宽） */
        .cs-issue-spacer { display:flex; align-items:center; justify-content:flex-start; min-width:0; }
        .cs-input-tag { display:inline-flex; align-items:center; padding:5px 10px; border-radius:8px; font-size:0.72em; white-space:nowrap; background:rgba(65,105,225,0.14); border:1px solid rgba(65,105,225,0.45); color:#8aabf0; margin-left:10px; }
        /* 触发移动端回退（桌面隐藏） */
        .trigger-fb { display:none; }
        /* DP 下行授权列表：桌面端改用连接器，故隐藏；移动端作为回退显示 */
        .dp-downflow { display:none; }'''))

# ── ①②③ 移动端媒体查询（插在块尾 info-band::before 规则后）──
EDITS.append(('移动端规则', '''            .info-band { padding-left:16px; }
            .info-band::before { display:none; }
        }''',
'''            .info-band { padding-left:16px; }
            .info-band::before { display:none; }
            .trig-line, .trig-arrow, .trig-label { display:none; }
            .trigger-fb { display:flex; flex-direction:column; gap:5px; margin-bottom:6px; }
            .cs-issue-spacer { display:flex; justify-content:center; margin-top:6px; }
        }'''))

# ── ①② 触发线 HTML（插在 corridor 元素组后）──
EDITS.append(('①② 触发线 HTML', '''    <div class="corridor-arrow corridor-arrow-up" id="corr-up-arrow"></div>''',
'''    <div class="corridor-arrow corridor-arrow-up" id="corr-up-arrow"></div>
    <!-- CS→SB / CS→CP 触发连线（JS 定位；移动端回退见 .trigger-fb） -->
    <div class="trig-label" id="trig-sb-label">阶段边界临近 · CS 触发</div>
    <div class="trig-line" id="trig-sb-h1"></div>
    <div class="trig-line" id="trig-sb-v1"></div>
    <div class="trig-line" id="trig-sb-h2"></div>
    <div class="trig-line" id="trig-sb-v2"></div>
    <div class="trig-arrow" id="trig-sb-arrow"></div>
    <div class="trig-label" id="trig-cp-label">项目竣工临近 · CS 触发</div>
    <div class="trig-line" id="trig-cp-h1"></div>
    <div class="trig-line" id="trig-cp-v1"></div>
    <div class="trig-line" id="trig-cp-h2"></div>
    <div class="trig-line" id="trig-cp-v2"></div>
    <div class="trig-arrow" id="trig-cp-arrow"></div>'''))

# ── ①② 触发线 JS（插在 positionCorridor 监听后）──
EDITS.append(('①② 触发线 JS', '''window.addEventListener('load', positionCorridor);
window.addEventListener('resize', positionCorridor);''',
'''window.addEventListener('load', positionCorridor);
window.addEventListener('resize', positionCorridor);

/* CS→SB / CS→CP 触发连线：CS 右缘横出，沿 SB 列右外通道上行，分别进入 SB 底部与 CP 底部 */
function positionTriggers() {
    var container = document.querySelector('.container');
    var cs = document.getElementById('node-cs');
    var sb = document.getElementById('node-sb');
    var cp = document.getElementById('node-cp');
    if (!container || !cs || !sb || !cp) return;
    var c = container.getBoundingClientRect();
    function R(el) { var r = el.getBoundingClientRect(); return { l:r.left-c.left, r:r.right-c.left, t:r.top-c.top, b:r.bottom-c.top, cx:(r.left+r.right)/2-c.left }; }
    var csR = R(cs), sbR = R(sb), cpR = R(cp);
    function setH(id,x1,x2,y){ var e=document.getElementById(id); e.style.left=Math.min(x1,x2)+'px'; e.style.top=(y-1)+'px'; e.style.width=Math.abs(x2-x1)+'px'; e.style.height='2px'; }
    function setV(id,x,y1,y2){ var e=document.getElementById(id); e.style.left=(x-1)+'px'; e.style.top=Math.min(y1,y2)+'px'; e.style.width='2px'; e.style.height=Math.abs(y2-y1)+'px'; }
    function setA(id,x,yTip){ var e=document.getElementById(id); e.style.left=(x-5)+'px'; e.style.top=yTip+'px'; }
    function setL(id,x,y){ var e=document.getElementById(id); e.style.left=x+'px'; e.style.top=y+'px'; e.style.transform='translateY(-50%)'; }
    /* ① CS→SB：右缘 y+20 横出 → SB.r+12 通道上行 → SB 底下 12px 横到 SB 右段 → 上行进 SB 底 */
    var y1 = csR.t + 20, x1 = csR.r + 12, yT1 = sbR.b + 12, x2 = sbR.r - 30;
    setH('trig-sb-h1', csR.r, x1, y1);
    setV('trig-sb-v1', x1, y1, yT1);
    setH('trig-sb-h2', x1, x2, yT1);
    setV('trig-sb-v2', x2, yT1, sbR.b + 7);
    setA('trig-sb-arrow', x2, sbR.b);
    setL('trig-sb-label', x1 + 8, (y1 + yT1) / 2);
    /* ② CS→CP：右缘 y+44 横出 → SB.r+26 更外通道上行 → CP 底下 12px 横到 CP 中心 → 上行进 CP 底 */
    var y2 = csR.t + 44, xA = csR.r + 26, yT2 = cpR.b + 12;
    setH('trig-cp-h1', csR.r, xA, y2);
    setV('trig-cp-v1', xA, y2, yT2);
    setH('trig-cp-h2', xA, cpR.cx, yT2);
    setV('trig-cp-v2', cpR.cx, yT2, cpR.b + 7);
    setA('trig-cp-arrow', cpR.cx, cpR.b);
    setL('trig-cp-label', xA + 8, (y2 + yT2) / 2 + 34);
}
window.addEventListener('load', positionTriggers);
window.addEventListener('resize', positionTriggers);'''))

def main():
    apply = '--apply' in sys.argv
    with io.open(HTML, 'r', encoding='utf-8') as f:
        content = f.read()

    ok = True
    for name, old, new in EDITS:
        n = content.count(old)
        print(('✓' if n == 1 else '★') + ' [%s] 锚点命中 %d 处' % (name, n))
        if n != 1: ok = False
    if not ok:
        print('ERROR: 存在非唯一/未命中锚点，中止'); return

    for name, old, new in EDITS:
        content = content.replace(old, new)

    if '�' in content:
        print('ERROR: 检测到 U+FFFD 乱码'); return
    print('改后行数:', content.count(chr(10)) + 1)
    print('div 平衡: 开 %d / 闭 %d' % (content.count('<div'), content.count('</div>')))

    if apply:
        with io.open(HTML, 'w', encoding='utf-8') as f:
            f.write(content)
        print('=== 已写回 graph-full-v2.html ===')
    else:
        print('=== DRY-RUN（--apply 落地）===')

if __name__ == '__main__':
    main()
