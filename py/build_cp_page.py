# -*- coding: utf-8 -*-
"""
生成 processes/cp.html（项目收尾 CP）。
拓扑依据官方图 19.1，活动名与锚点依据 chapters/ch19.html（pn-7..11 ↔ 19.4.1..5）。
布局（自上而下，双入口收敛）：
  上游条[阶段控制 CS | 项目指导 DP]
    → 事件[项目竣工临近 | 提前收尾请求]
    → 上排[准备按计划收尾 19.4.1 | 准备提前收尾 19.4.2]
    → 中排[确认项目验收 19.4.3 · 枢纽]
    → 下排[请求项目收尾 19.4.5 ← 评估项目 19.4.4]
    → 事件[项目收尾请求] → 回到 DP（请求授权关闭项目）
  提前收尾支线用虚线（部分交付时确认验收）。
坐标全部经离线碰撞检测：无线穿框，进框贴边缘，事件框挂线正中心。
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"D:\5月份cc项目\prince2-开发\prince2-kb-develop\py")
from page_tpl import render

SVG = '''<svg class="diagram" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1150 700">
      <defs>
        <marker id="ah" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,3 L0,6 Z" fill="#888"/></marker>
        <marker id="ahg" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,3 L0,6 Z" fill="#2E8B57"/></marker>
      </defs>
      <rect x="0" y="0" width="1150" height="700" fill="#fdfbf7"/>
      <rect x="6" y="6" width="1138" height="688" fill="none" stroke="#e6ddc8" stroke-width="1.5" rx="10"/>

      <text x="575" y="38" text-anchor="middle" font-size="20" font-weight="bold" fill="#2c3e50">放大 CP：5 个活动 · 双入口收敛，请求项目收尾</text>

      <!-- 上游条：左 CS / 右 DP（DP 既是入口也是收尾请求的去向） -->
      <a href="../chapters/ch16.html">
        <rect x="80" y="58" width="460" height="36" rx="8" fill="#2E8B57"/>
        <text x="310" y="81" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">阶段控制 CS · 最后阶段临近结束</text>
      </a>
      <a href="../chapters/ch14.html">
        <rect x="560" y="58" width="460" height="36" rx="8" fill="#2E8B57"/>
        <text x="790" y="81" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">项目指导 DP · 项目管理委员会 · 命令提前收尾 / 授权关闭</text>
      </a>

      <!-- 入口事件（挂在竖直接口线正中心 cy=122） -->
      <line x1="220" y1="94" x2="220" y2="196" stroke="#2E8B57" stroke-width="2.5" marker-end="url(#ahg)"/>
      <line x1="900" y1="94" x2="900" y2="196" stroke="#2E8B57" stroke-width="2.5" marker-end="url(#ahg)"/>
      <rect x="145" y="108" width="150" height="28" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="220" y="126" text-anchor="middle" font-size="10" fill="#9a5b06">项目竣工临近</text>
      <rect x="825" y="108" width="150" height="28" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="900" y="126" text-anchor="middle" font-size="10" fill="#9a5b06">提前收尾请求 · 例外时</text>

      <!-- CP 容器 -->
      <rect x="80" y="150" width="940" height="396" rx="14" fill="#f6fbf8" stroke="#2E8B57" stroke-width="2" stroke-dasharray="7 4"/>
      <text x="100" y="176" text-anchor="start" font-size="13" font-weight="bold" fill="#2E8B57">项目收尾 CP</text>
      <text x="100" y="192" text-anchor="start" font-size="10" fill="#6a9c7f">验收 → 评估 → 收尾</text>

      <!-- ── 上排：准备（双入口） ── -->
      <a href="../chapters/ch19.html#pn-7"><rect x="130" y="196" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="220" y="220" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">准备按计划收尾</text><text x="220" y="237" text-anchor="middle" font-size="11" fill="#888">19.4.1</text></a>
      <a href="../chapters/ch19.html#pn-8"><rect x="810" y="196" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="900" y="220" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">准备提前收尾</text><text x="900" y="237" text-anchor="middle" font-size="11" fill="#888">19.4.2 · 例外时</text></a>
      <a href="../entities/product.html#entity-项目收尾建议"><text x="120" y="266" text-anchor="start" font-size="10" class="src-link">产出：项目收尾建议</text></a>

      <!-- ── 中排：确认验收（枢纽，两路汇入） ── -->
      <a href="../chapters/ch19.html#pn-9"><rect x="470" y="330" width="180" height="52" rx="10" fill="#e3f2e9" stroke="#2E8B57" stroke-width="3"/><text x="560" y="354" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">确认项目验收</text><text x="560" y="371" text-anchor="middle" font-size="11" fill="#888">19.4.3</text></a>
      <!-- C1 准备按计划收尾 → 确认项目验收（左侧进入） -->
      <polyline points="220,248 220,356 458,356" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="458" y1="356" x2="470" y2="356" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <!-- C2 准备提前收尾 → 确认项目验收（虚线，部分交付时，顶部进入） -->
      <polyline points="900,248 900,300 560,300 560,320" fill="none" stroke="#777" stroke-width="1.8" stroke-dasharray="6 4"/>
      <line x1="560" y1="320" x2="560" y2="330" stroke="#777" stroke-width="1.8" stroke-dasharray="6 4" marker-end="url(#ah)"/>

      <!-- ── 下排：评估 → 请求 ── -->
      <a href="../chapters/ch19.html#pn-11"><rect x="130" y="464" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="220" y="488" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">请求项目收尾</text><text x="220" y="505" text-anchor="middle" font-size="11" fill="#888">19.4.5</text></a>
      <a href="../chapters/ch19.html#pn-10"><rect x="470" y="464" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="560" y="488" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">评估项目</text><text x="560" y="505" text-anchor="middle" font-size="11" fill="#888">19.4.4</text></a>
      <a href="../entities/product.html#entity-项目竣工报告"><text x="120" y="536" text-anchor="start" font-size="10" class="src-link">产出：项目竣工报告</text></a>
      <!-- C4 确认项目验收 → 评估项目（中列主脊） -->
      <line x1="560" y1="382" x2="560" y2="464" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <!-- C3 准备提前收尾 → 评估项目（走右侧净空通道 x1005，右侧进入） -->
      <polyline points="990,222 1005,222 1005,490 662,490" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="662" y1="490" x2="650" y2="490" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <!-- C5 评估项目 → 请求项目收尾（同排左向） -->
      <line x1="470" y1="490" x2="310" y2="490" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>

      <!-- C6 请求项目收尾 → 项目收尾请求 → DP（走底部+右侧净空通道 x1080 回到 DP） -->
      <polyline points="220,516 220,605 1080,605 1080,76 1020,76" fill="none" stroke="#2E8B57" stroke-width="2.5" marker-end="url(#ahg)"/>
      <rect x="900" y="590" width="160" height="30" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="980" y="609" text-anchor="middle" font-size="10" fill="#9a5b06">项目收尾请求</text>
      <text x="892" y="622" text-anchor="end" font-size="9" fill="#999">→ DP 请求授权关闭项目</text>

      <!-- 图例 -->
      <rect x="80" y="662" width="16" height="16" rx="3" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="102" y="674" font-size="11" fill="#444">橙 = 事件　绿框 = 活动　实绿条 = 上下游流程(CS/DP)　虚线 = 提前收尾时验收可能部分完成　蓝字 = 出处(可点)</text>
    </svg>'''

CTX = dict(
    title='项目收尾 CP · 流程详情', abbr='项目收尾 CP',
    h1='项目收尾 CP <span style="font-size:15px;color:#8a7f6a;font-weight:normal">Closing a Project · 第19章</span>',
    lead='项目的最后一道流程：无论是按计划竣工，还是被项目管理委员会命令提前收尾，都要确认产品验收与移交、评估项目整体绩效、编制项目竣工报告，最后向项目管理委员会请求授权关闭项目。',
    svg=SVG,
    trig_in='<span class="tag-ev">项目竣工临近（CS · 最后阶段临近结束）</span><span class="tag-ev">提前收尾请求（DP · 例外时）</span>',
    trig_out='<span class="tag-ev">项目收尾请求 → DP（请求授权关闭项目）</span>',
    products='<a class="tag-mp" href="../entities/product.html">项目收尾建议</a><a class="tag-mp" href="../entities/product.html">项目竣工报告</a><a class="tag-mp" href="../entities/product.html">经验教训记录单（关闭）</a><a class="tag-mp" href="../entities/product.html">后续行动建议</a><a class="tag-mp" href="../entities/product.html">收益管理方法（更新）</a><a class="tag-mp" href="../entities/product.html">项目计划（更新）</a>',
    reading='流程原文：<a href="../chapters/ch19.html">第19章 项目收尾</a>　·　管理产品定义：<a href="../chapters/appendix_a.html">附录 A</a>　·　信息流全景：<a href="../graph-full.html">管理产品信息流</a>',
    nav_prev='<a href="sb.html">◁ SB 阶段边界管理</a>',
    nav_next='<span class="disabled">CP 是最后一个流程 ▷</span>',
)

if __name__ == '__main__':
    render('cp.html', CTX)
