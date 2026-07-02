# -*- coding: utf-8 -*-
"""
生成 processes/sb.html（阶段边界管理）。
拓扑依据官方图 18.1，活动名与锚点依据 chapters/ch18.html（pn-6..11 ↔ 18.4.1..6）。
布局（四段式变体，自下而上）：
  触发源条（IP/CS）→ 阶段边界临近 → 下排[准备下一阶段计划 | 准备例外计划]
  → 中排[更新项目计划 → 更新商业论证] → 上排[评价阶段 → 请求下一阶段] → DP
  例外通道：DP 例外计划请求沿中右列间 x730 直落 → 准备例外计划。
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"D:\5月份cc项目\prince2-开发\prince2-kb-develop\py")
from page_tpl import render

SVG = '''<svg class="diagram" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1150 740">
      <defs>
        <marker id="ah" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,3 L0,6 Z" fill="#888"/></marker>
        <marker id="ahg" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,3 L0,6 Z" fill="#2E8B57"/></marker>
      </defs>
      <rect x="0" y="0" width="1150" height="740" fill="#fdfbf7"/>
      <rect x="6" y="6" width="1138" height="728" fill="none" stroke="#e6ddc8" stroke-width="1.5" rx="10"/>

      <text x="575" y="38" text-anchor="middle" font-size="20" font-weight="bold" fill="#2c3e50">放大 SB：6 个活动 · 阶段边界的承前启后</text>

      <!-- DP 贯穿条 -->
      <a href="../chapters/ch14.html">
        <rect x="80" y="58" width="940" height="36" rx="8" fill="#2E8B57"/>
        <text x="550" y="81" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">项目指导 DP · 项目管理委员会 · 批准阶段计划 / 例外计划</text>
      </a>

      <!-- DP ↔ SB 接口 -->
      <line x1="900" y1="146" x2="900" y2="94" stroke="#2E8B57" stroke-width="2.5" marker-end="url(#ahg)"/>
      <rect x="815" y="96" width="170" height="30" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="900" y="108" text-anchor="middle" font-size="9" fill="#9a5b06">下一阶段请求 /</text>
      <text x="900" y="120" text-anchor="middle" font-size="9" fill="#9a5b06">例外计划批准请求</text>
      <text x="808" y="115" text-anchor="end" font-size="9" fill="#999">SB 上报↑</text>
      <rect x="655" y="100" width="150" height="22" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="730" y="115" text-anchor="middle" font-size="10" fill="#9a5b06">例外计划请求 · 例外时</text>

      <!-- SB 容器 -->
      <rect x="80" y="150" width="940" height="416" rx="14" fill="#f6fbf8" stroke="#2E8B57" stroke-width="2" stroke-dasharray="7 4"/>
      <text x="100" y="176" text-anchor="start" font-size="13" font-weight="bold" fill="#2E8B57">阶段边界管理 SB · 流程内部</text>
      <text x="100" y="192" text-anchor="start" font-size="10" fill="#6a9c7f">下：准备 → 中：更新 → 上：评审与请求</text>

      <!-- 例外通道：DP → 准备例外计划（x730 直落，中右列间净空通道） -->
      <line x1="730" y1="122" x2="730" y2="456" stroke="#d97706" stroke-width="2"/>
      <polyline points="730,456 900,456" fill="none" stroke="#d97706" stroke-width="2"/>
      <line x1="900" y1="456" x2="900" y2="476" stroke="#d97706" stroke-width="2" marker-end="url(#ah)"/>

      <!-- ── 上排：评审与请求 ── -->
      <a href="../chapters/ch18.html#pn-10"><rect x="470" y="196" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="560" y="220" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">评价阶段</text><text x="560" y="237" text-anchor="middle" font-size="11" fill="#888">18.4.5</text></a>
      <a href="../chapters/ch18.html#pn-11"><rect x="810" y="196" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="900" y="220" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">请求下一阶段</text><text x="900" y="237" text-anchor="middle" font-size="11" fill="#888">18.4.6</text></a>
      <line x1="652" y1="222" x2="808" y2="222" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <line x1="900" y1="194" x2="900" y2="152" stroke="#888" stroke-width="1.5" marker-end="url(#ah)"/>
      <a href="../entities/product.html#entity-阶段竣工报告"><text x="548" y="264" text-anchor="end" font-size="10" class="src-link">产出：阶段竣工报告</text></a>

      <!-- ── 中排：更新 ── -->
      <a href="../chapters/ch18.html#pn-8"><rect x="130" y="330" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="220" y="354" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">更新项目计划</text><text x="220" y="371" text-anchor="middle" font-size="11" fill="#888">18.4.3</text></a>
      <a href="../chapters/ch18.html#pn-9"><rect x="470" y="330" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="560" y="354" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">更新商业论证</text><text x="560" y="371" text-anchor="middle" font-size="11" fill="#888">18.4.4</text></a>
      <line x1="312" y1="356" x2="468" y2="356" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <line x1="560" y1="328" x2="560" y2="250" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>

      <!-- ── 下排：准备 ── -->
      <a href="../chapters/ch18.html#pn-6"><rect x="130" y="480" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="220" y="502" text-anchor="middle" font-size="12" font-weight="bold" fill="#2E8B57">准备下一阶段计划</text><text x="220" y="521" text-anchor="middle" font-size="11" fill="#888">18.4.1</text></a>
      <a href="../chapters/ch18.html#pn-7"><rect x="810" y="480" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="900" y="502" text-anchor="middle" font-size="12" font-weight="bold" fill="#2E8B57">准备例外计划</text><text x="900" y="521" text-anchor="middle" font-size="11" fill="#888">18.4.2 · 例外时</text></a>
      <line x1="220" y1="478" x2="220" y2="384" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <!-- 18.4.2 → 18.4.3：走 18.4.1 框右侧净空通道（x330），从 18.4.3 右侧面进入，避免穿框 -->
      <polyline points="808,506 330,506 330,372" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="330" y1="372" x2="314" y2="372" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <a href="../entities/product.html#entity-阶段计划"><text x="230" y="550" text-anchor="start" font-size="10" class="src-link">产出：阶段计划</text></a>
      <a href="../entities/product.html#entity-例外计划"><text x="818" y="550" text-anchor="start" font-size="10" class="src-link">产出：例外计划</text></a>

      <!-- 触发入口：阶段边界临近（双源 IP / CS） -->
      <line x1="220" y1="648" x2="220" y2="536" stroke="#2E8B57" stroke-width="2.5" marker-end="url(#ahg)"/>
      <polyline points="790,648 790,620 292,620" fill="none" stroke="#2E8B57" stroke-width="1.5"/>
      <path d="M295,617 L287,620 L295,623 Z" fill="#2E8B57"/>
      <rect x="155" y="580" width="130" height="22" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="220" y="595" text-anchor="middle" font-size="10" fill="#9a5b06">阶段边界临近</text>
      <text x="292" y="599" text-anchor="start" font-size="9" fill="#999">事件：本阶段临近结束，且项目还没结束</text>

      <!-- 触发源条（左 IP / 右 CS） -->
      <a href="../chapters/ch15.html">
        <rect x="80" y="648" width="460" height="36" rx="8" fill="#2E8B57"/>
        <text x="310" y="671" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">项目启动 IP · 首个交付阶段开始前</text>
      </a>
      <a href="../chapters/ch16.html">
        <rect x="560" y="648" width="460" height="36" rx="8" fill="#2E8B57"/>
        <text x="790" y="671" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">阶段控制 CS · 各交付阶段临近结束</text>
      </a>

      <!-- 图例 -->
      <rect x="80" y="706" width="16" height="16" rx="3" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="102" y="718" font-size="11" fill="#444">橙 = 事件　绿框 = 活动　实绿条 = 上下游流程(DP/IP/CS)　橙线 = 例外路径　蓝字 = 出处(可点)</text>
    </svg>'''

CTX = dict(
    title='阶段边界管理 SB · 流程详情', abbr='阶段边界管理 SB',
    h1='阶段边界管理 SB <span style="font-size:15px;color:#8a7f6a;font-weight:normal">Managing a Stage Boundary · 第18章</span>',
    lead='承前启后的评审流程：阶段临近结束时，评审本阶段绩效、准备下一阶段计划、更新项目计划与商业论证，把「项目是否值得继续」的决策材料递交项目管理委员会；收到例外计划请求时，则转而准备例外计划。',
    svg=SVG,
    trig_in='<span class="tag-ev">阶段边界临近（IP · 首个交付阶段前）</span><span class="tag-ev">阶段边界临近（CS · 各阶段临近结束）</span><span class="tag-ev">例外计划请求（DP · 例外时）</span>',
    trig_out='<span class="tag-ev">下一阶段请求 → DP</span><span class="tag-ev">例外计划批准请求 → DP（例外时）</span>',
    products='<a class="tag-mp" href="../entities/product.html">阶段计划</a><a class="tag-mp" href="../entities/product.html">例外计划</a><a class="tag-mp" href="../entities/product.html">阶段竣工报告</a><a class="tag-mp" href="../entities/product.html">项目计划（更新）</a><a class="tag-mp" href="../entities/product.html">商业论证（更新）</a>',
    reading='流程原文：<a href="../chapters/ch18.html">第18章 阶段边界管理</a>　·　管理产品定义：<a href="../chapters/appendix_a.html">附录 A</a>　·　信息流全景：<a href="../graph-full.html">管理产品信息流</a>',
    nav_prev='<a href="mp.html">◁ MP 产品交付管理</a>',
    nav_next='<a href="cp.html">CP 项目收尾 ▷</a>',
)

if __name__ == '__main__':
    render('sb.html', CTX)
