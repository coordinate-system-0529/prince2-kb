# -*- coding: utf-8 -*-
"""
重写 process-trigger.html 的 CS 放大图（#cs-detail）为「三层职责分区」布局：
  汇报排（面向DP）：上报问题和风险 16.4.7 / 报告要点 16.4.8
  评估排（枢纽）  ：采取纠正行动 16.4.6 ← 评价阶段状态 16.4.4 ← 捕获问题和风险 16.4.5 ←(新问题/风险)
                    枢纽右下出口 → SB / CP；纠正↓回路到授权
  执行排（面向MP）：授权工作包 16.4.1 / 评价工作包状态 16.4.2 / 接收已完成的工作包 16.4.3
接口：DP 上下行（保留）、MP 三条（派活↓ / 检查点↑ / 完成通知↑）。
活动名与 pn 锚点已对照 ch16 校验（pn-6..13 ↔ 16.4.1..8）。
默认 dry-run；--apply 落地。
"""
import sys, io
sys.stdout.reconfigure(encoding='utf-8')

HTML = r"D:\5月份cc项目\prince2-开发\prince2-kb-develop\process-trigger.html"
START = '  <div class="card" id="cs-detail" style="display:none">'

NEW = '''  <div class="card" id="cs-detail" style="display:none">
    <div class="detail-bar"><button class="close-detail" onclick="closeDetail('cs-detail')">关闭 ✕</button></div>
    <svg class="diagram" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1150 780">
      <defs>
        <marker id="ah3" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,3 L0,6 Z" fill="#888"/></marker>
        <marker id="ah3g" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,3 L0,6 Z" fill="#2E8B57"/></marker>
      </defs>
      <rect x="0" y="0" width="1150" height="780" fill="#fdfbf7"/>
      <rect x="6" y="6" width="1138" height="768" fill="none" stroke="#e6ddc8" stroke-width="1.5" rx="10"/>

      <text x="575" y="38" text-anchor="middle" font-size="20" font-weight="bold" fill="#2c3e50">放大 CS：8 个活动 · 执行 / 评估 / 汇报 三层</text>

      <!-- DP 贯穿条（上游：项目指导） -->
      <a href="chapters/ch14.html">
        <rect x="80" y="58" width="940" height="36" rx="8" fill="#2E8B57"/>
        <text x="550" y="81" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">项目指导 DP · 项目管理委员会 · 授权 / 决策 / 监督</text>
      </a>

      <!-- DP ↔ CS 接口 -->
      <line x1="245" y1="94" x2="245" y2="146" stroke="#2E8B57" stroke-width="2.5" marker-end="url(#ah3g)"/>
      <rect x="150" y="100" width="190" height="22" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="245" y="115" text-anchor="middle" font-size="10" fill="#9a5b06">阶段授权 / 例外计划授权</text>
      <text x="245" y="139" text-anchor="middle" font-size="9" fill="#999">DP 授权↓ · 含委员会建议与决策</text>
      <line x1="860" y1="146" x2="860" y2="94" stroke="#2E8B57" stroke-width="2.5" marker-end="url(#ah3g)"/>
      <rect x="745" y="100" width="230" height="22" rx="11" fill="#f6e4f6" stroke="#8B008B" stroke-width="1.2"/>
      <text x="860" y="115" text-anchor="middle" font-size="10" fill="#6b1a6b">要点报告 / 例外报告 / 征求建议</text>
      <text x="740" y="115" text-anchor="end" font-size="9" fill="#999">CS 上报↑</text>

      <!-- CS 容器 -->
      <rect x="80" y="150" width="940" height="460" rx="14" fill="#f6fbf8" stroke="#2E8B57" stroke-width="2" stroke-dasharray="7 4"/>
      <text x="550" y="172" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">阶段控制 CS · 流程内部（下：执行 → 中：评估 → 上：汇报）</text>

      <!-- ── 汇报排（面向 DP）── -->
      <a href="chapters/ch16.html#pn-12"><rect x="470" y="196" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="560" y="220" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">上报问题和风险</text><text x="560" y="237" text-anchor="middle" font-size="11" fill="#888">16.4.7</text></a>
      <a href="chapters/ch16.html#pn-13"><rect x="810" y="196" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="900" y="220" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">报告要点</text><text x="900" y="237" text-anchor="middle" font-size="11" fill="#888">16.4.8</text></a>
      <!-- 汇报排 → 容器顶（呼应右上 CS 上报接口） -->
      <line x1="560" y1="194" x2="560" y2="158" stroke="#888" stroke-width="1.5" marker-end="url(#ah3)"/>
      <line x1="900" y1="194" x2="900" y2="158" stroke="#888" stroke-width="1.5" marker-end="url(#ah3)"/>
      <text x="568" y="180" text-anchor="start" font-size="9" fill="#6b1a6b">例外报告 / 已提出例外</text>
      <text x="908" y="180" text-anchor="start" font-size="9" fill="#6b1a6b">要点报告</text>

      <!-- ── 评估排（枢纽）── -->
      <a href="chapters/ch16.html#pn-11"><rect x="130" y="330" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="220" y="354" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">采取纠正行动</text><text x="220" y="371" text-anchor="middle" font-size="11" fill="#888">16.4.6</text></a>
      <a href="chapters/ch16.html#pn-9"><rect x="470" y="330" width="180" height="52" rx="10" fill="#e3f2e9" stroke="#2E8B57" stroke-width="3"/><text x="560" y="354" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">评价阶段状态</text><text x="560" y="371" text-anchor="middle" font-size="11" fill="#888">16.4.4 · 决策枢纽</text></a>
      <a href="chapters/ch16.html#pn-10"><rect x="810" y="330" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="900" y="354" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">捕获问题和风险</text><text x="900" y="371" text-anchor="middle" font-size="11" fill="#888">16.4.5</text></a>

      <!-- 枢纽的分发与汇聚 -->
      <line x1="468" y1="356" x2="314" y2="356" stroke="#555" stroke-width="2" marker-end="url(#ah3)"/>
      <line x1="808" y1="356" x2="654" y2="356" stroke="#555" stroke-width="2" marker-end="url(#ah3)"/>
      <line x1="560" y1="328" x2="560" y2="252" stroke="#555" stroke-width="2" marker-end="url(#ah3)"/>
      <polyline points="630,328 630,288 900,288" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="900" y1="288" x2="900" y2="252" stroke="#555" stroke-width="2" marker-end="url(#ah3)"/>
      <!-- 新问题/风险（外部输入） -->
      <rect x="1032" y="345" width="110" height="22" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="1087" y="360" text-anchor="middle" font-size="10" fill="#9a5b06">新问题或风险</text>
      <line x1="1030" y1="356" x2="994" y2="356" stroke="#d97706" stroke-width="2" marker-end="url(#ah3)"/>
      <!-- 纠正 ↓ 回路（回到授权工作包） -->
      <line x1="220" y1="384" x2="220" y2="476" stroke="#2E8B57" stroke-width="2" marker-end="url(#ah3g)"/>
      <text x="228" y="434" text-anchor="start" font-size="9" fill="#2E8B57">↺ 重新授权工作包</text>
      <!-- 枢纽 → SB / CP 触发出口 -->
      <polyline points="600,384 600,418 1024,418" fill="none" stroke="#2E8B57" stroke-width="2"/>
      <path d="M1024,415 L1032,418 L1024,421 Z" fill="#2E8B57"/>
      <text x="1036" y="414" text-anchor="start" font-size="10" fill="#2E8B57">阶段边界临近</text>
      <text x="1036" y="427" text-anchor="start" font-size="10" font-weight="bold" fill="#2E8B57">→ SB</text>
      <polyline points="625,384 625,446 1024,446" fill="none" stroke="#2E8B57" stroke-width="2"/>
      <path d="M1024,443 L1032,446 L1024,449 Z" fill="#2E8B57"/>
      <text x="1036" y="443" text-anchor="start" font-size="10" fill="#2E8B57">项目竣工临近</text>
      <text x="1036" y="456" text-anchor="start" font-size="10" font-weight="bold" fill="#2E8B57">→ CP</text>

      <!-- ── 执行排（面向 MP）── -->
      <a href="chapters/ch16.html#pn-6"><rect x="130" y="480" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="220" y="504" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">授权工作包</text><text x="220" y="521" text-anchor="middle" font-size="11" fill="#888">16.4.1</text></a>
      <a href="chapters/ch16.html#pn-7"><rect x="470" y="480" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="560" y="504" text-anchor="middle" font-size="12" font-weight="bold" fill="#2E8B57">评价工作包状态</text><text x="560" y="521" text-anchor="middle" font-size="11" fill="#888">16.4.2</text></a>
      <a href="chapters/ch16.html#pn-8"><rect x="810" y="480" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="900" y="502" text-anchor="middle" font-size="12" font-weight="bold" fill="#2E8B57">接收已完成的工作包</text><text x="900" y="521" text-anchor="middle" font-size="11" fill="#888">16.4.3</text></a>
      <!-- 执行排内与排间关系 -->
      <line x1="808" y1="506" x2="654" y2="506" stroke="#555" stroke-width="2" marker-end="url(#ah3)"/>
      <line x1="560" y1="478" x2="560" y2="384" stroke="#555" stroke-width="2" marker-end="url(#ah3)"/>

      <!-- CS ↔ MP 接口（三条：派活↓ / 检查点↑ / 完成通知↑） -->
      <line x1="220" y1="534" x2="220" y2="686" stroke="#2E8B57" stroke-width="2.5" marker-end="url(#ah3g)"/>
      <rect x="150" y="614" width="124" height="22" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="212" y="629" text-anchor="middle" font-size="10" fill="#9a5b06">工作包已授权</text>
      <text x="282" y="629" text-anchor="start" font-size="9" fill="#999">派活↓ + 工作包描述</text>
      <line x1="560" y1="686" x2="560" y2="534" stroke="#2E8B57" stroke-width="2.5" marker-end="url(#ah3g)"/>
      <rect x="505" y="614" width="110" height="22" rx="11" fill="#f6e4f6" stroke="#8B008B" stroke-width="1.2"/>
      <text x="560" y="629" text-anchor="middle" font-size="10" fill="#6b1a6b">检查点报告</text>
      <text x="622" y="629" text-anchor="start" font-size="9" fill="#999">MP 定期↑</text>
      <line x1="900" y1="686" x2="900" y2="534" stroke="#2E8B57" stroke-width="2.5" marker-end="url(#ah3g)"/>
      <rect x="828" y="614" width="144" height="22" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="900" y="629" text-anchor="middle" font-size="10" fill="#9a5b06">已完成工作包通知</text>
      <text x="822" y="629" text-anchor="end" font-size="9" fill="#999">收活↑</text>

      <!-- MP 贯穿条（下游：产品交付管理） -->
      <a href="chapters/ch17.html">
        <rect x="80" y="690" width="940" height="36" rx="8" fill="#2E8B57"/>
        <text x="550" y="713" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">产品交付管理 MP · 小组经理 · 接受并执行工作包</text>
      </a>

      <!-- 图例 -->
      <rect x="80" y="746" width="16" height="16" rx="3" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="102" y="758" font-size="11" fill="#444">橙 = 事件　紫 = 管理产品　绿框 = 活动（加粗 = 决策枢纽）　实绿条 = 上下游流程(DP/MP)　蓝字 = 出处(可点)</text>
    </svg>'''

def main():
    apply = '--apply' in sys.argv
    with io.open(HTML, 'r', encoding='utf-8') as f:
        content = f.read()

    if content.count(START) != 1:
        print('ERROR: START 锚点命中 %d 处' % content.count(START)); return
    si = content.find(START)
    ei = content.find('</svg>', si)
    if ei == -1:
        print('ERROR: 未找到 cs-detail 的 </svg>'); return
    ei_end = ei + len('</svg>')

    old_seg = content[si:ei_end]
    print('旧 cs-detail 段:', old_seg.count(chr(10)) + 1, '行')
    print('新 cs-detail 段:', NEW.count(chr(10)) + 1, '行')
    # 校验旧段确实是 cs-detail（含 8 个活动锚点）
    for pn in ['pn-6', 'pn-7', 'pn-8', 'pn-9', 'pn-10', 'pn-11', 'pn-12', 'pn-13']:
        if ('#' + pn) not in old_seg:
            print('WARN: 旧段缺 %s（确认截取范围）' % pn)
    new_content = content[:si] + NEW + content[ei_end:]

    if '�' in new_content:
        print('ERROR: U+FFFD 乱码'); return
    # 新段锚点齐全性
    for pn in ['pn-6', 'pn-7', 'pn-8', 'pn-9', 'pn-10', 'pn-11', 'pn-12', 'pn-13']:
        seg = new_content[new_content.find(START):new_content.find('</svg>', new_content.find(START))]
        if ('#' + pn) not in seg:
            print('ERROR: 新段缺锚点', pn); return
    print('8 个活动锚点齐全 ✓')

    if apply:
        with io.open(HTML, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print('=== 已写回 ===')
    else:
        print('=== DRY-RUN（--apply 落地）===')

if __name__ == '__main__':
    main()
