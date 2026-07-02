# -*- coding: utf-8 -*-
"""
生成 processes/su.html（项目准备 Starting up a Project）。
拓扑依据官方图 13.1 / 流程图/项目准备.png，活动名与锚点依据 chapters/ch13.html
（注意 ch13 用 s13-4-N 锚点，非 pn-N；8 个活动 13.4.1..13.4.8 ↔ #s13-4-1..#s13-4-8）。

布局（自上而下，三列 x=220/560/900）：
  上游=业务层绿条（下达项目任务书）→ 项目任务书事件
  → 分两路：右入 A1(任命项目总监和项目经理)；沿左列直落 A3(准备概要商业论证)
  A1 → A2(评估之前的经验教训) → A4(任命项目管理团队) 且 A2 下行汇入 A3↔A5 双向线中点
  A4 → A5(选择项目方法)；A3 ↔ A5 双向；A5 → A6(汇编项目概述文件)；A3 → A6(底部长横线)
  A6 → A7(计划启动阶段) → A8(请求项目启动)
  A8 → 项目启动请求事件 → 下游=项目指导 DP 绿条
走线：仅直角线；每条线段坐标已逐框心算，端点均落框边缘，事件框走线过正中心。
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"D:\5月份cc项目\prince2-开发\prince2-kb-develop\py")
from page_tpl import render

SVG = '''<svg class="diagram" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1150 762">
      <defs>
        <marker id="ah" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,3 L0,6 Z" fill="#888"/></marker>
        <marker id="ahg" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,3 L0,6 Z" fill="#2E8B57"/></marker>
        <marker id="ahs" markerWidth="10" markerHeight="8" refX="2" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M8,0 L0,3 L8,6 Z" fill="#888"/></marker>
      </defs>
      <rect x="0" y="0" width="1150" height="762" fill="#fdfbf7"/>
      <rect x="6" y="6" width="1138" height="750" fill="none" stroke="#e6ddc8" stroke-width="1.5" rx="10"/>

      <text x="575" y="38" text-anchor="middle" font-size="20" font-weight="bold" fill="#2c3e50">放大 SU：8 个活动 · 从项目任务书到请求项目启动</text>

      <!-- SU 容器（虚线，标题放左上角，避开内部竖线 x220） -->
      <rect x="80" y="152" width="990" height="478" rx="14" fill="#f6fbf8" stroke="#2E8B57" stroke-width="2" stroke-dasharray="7 4"/>
      <text x="100" y="172" text-anchor="start" font-size="13" font-weight="bold" fill="#2E8B57">项目准备 SU</text>
      <text x="100" y="188" text-anchor="start" font-size="10" fill="#6a9c7f">流程内部</text>
      <text x="1050" y="172" text-anchor="end" font-size="10" fill="#6a9c7f">读法：自上而下，末端上交 DP</text>

      <!-- 上游：业务层绿条 -->
      <a href="../entities/term.html#entity-业务层">
        <rect x="80" y="58" width="990" height="34" rx="8" fill="#2E8B57"/>
        <text x="575" y="80" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">业务层 · 公司或项目群管理层（下达项目任务书，触发 SU）</text>
      </a>

      <!-- 下游：项目指导 DP 绿条 -->
      <a href="../chapters/ch14.html">
        <rect x="80" y="690" width="990" height="34" rx="8" fill="#2E8B57"/>
        <text x="575" y="712" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">项目指导 DP · 项目管理委员会 · 授权项目启动</text>
      </a>

      <!-- 接口事件：项目任务书（挂在 x220 主线上，线过正中心） -->
      <rect x="150" y="104" width="140" height="28" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="220" y="122" text-anchor="middle" font-size="10" fill="#9a5b06">项目任务书</text>
      <text x="298" y="121" text-anchor="start" font-size="9" fill="#999">触发：业务发出的项目委托</text>

      <!-- 接口事件：项目启动请求（挂在 x900 主线上，线过正中心） -->
      <rect x="825" y="648" width="150" height="28" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="900" y="666" text-anchor="middle" font-size="10" fill="#9a5b06">项目启动请求</text>
      <text x="818" y="665" text-anchor="end" font-size="9" fill="#999">上交项目管理委员会</text>

      <!-- ── 活动框（8 个）── -->
      <a href="../chapters/ch13.html#s13-4-1"><rect x="470" y="198" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="560" y="222" text-anchor="middle" font-size="12" font-weight="bold" fill="#2E8B57">任命项目总监和项目经理</text><text x="560" y="239" text-anchor="middle" font-size="11" fill="#888">13.4.1</text></a>
      <a href="../chapters/ch13.html#s13-4-2"><rect x="470" y="288" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="560" y="312" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">评估之前的经验教训</text><text x="560" y="329" text-anchor="middle" font-size="11" fill="#888">13.4.2</text></a>
      <a href="../chapters/ch13.html#s13-4-4"><rect x="810" y="288" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="900" y="312" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">任命项目管理团队</text><text x="900" y="329" text-anchor="middle" font-size="11" fill="#888">13.4.4</text></a>
      <a href="../chapters/ch13.html#s13-4-3"><rect x="130" y="378" width="180" height="52" rx="10" fill="#e3f2e9" stroke="#2E8B57" stroke-width="2"/><text x="220" y="402" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">准备概要商业论证</text><text x="220" y="419" text-anchor="middle" font-size="11" fill="#888">13.4.3</text></a>
      <a href="../chapters/ch13.html#s13-4-5"><rect x="810" y="378" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="900" y="402" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">选择项目方法</text><text x="900" y="419" text-anchor="middle" font-size="11" fill="#888">13.4.5</text></a>
      <a href="../chapters/ch13.html#s13-4-6"><rect x="810" y="468" width="180" height="52" rx="10" fill="#e3f2e9" stroke="#2E8B57" stroke-width="2"/><text x="900" y="492" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">汇编项目概述文件</text><text x="900" y="509" text-anchor="middle" font-size="11" fill="#888">13.4.6</text></a>
      <a href="../chapters/ch13.html#s13-4-7"><rect x="470" y="558" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="560" y="582" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">计划启动阶段</text><text x="560" y="599" text-anchor="middle" font-size="11" fill="#888">13.4.7</text></a>
      <a href="../chapters/ch13.html#s13-4-8"><rect x="810" y="558" width="180" height="52" rx="10" fill="#e3f2e9" stroke="#2E8B57" stroke-width="3"/><text x="900" y="582" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">请求项目启动</text><text x="900" y="599" text-anchor="middle" font-size="11" fill="#888">13.4.8</text></a>

      <!-- ── 走线（全部后画，箭头压在框上可见）── -->
      <!-- 上游项目任务书 → 两路（绿） -->
      <line x1="220" y1="92" x2="220" y2="104" stroke="#2E8B57" stroke-width="2"/>
      <line x1="220" y1="132" x2="220" y2="378" stroke="#2E8B57" stroke-width="2" marker-end="url(#ahg)"/>
      <line x1="220" y1="224" x2="470" y2="224" stroke="#2E8B57" stroke-width="2" marker-end="url(#ahg)"/>

      <!-- A1 → A2（下） -->
      <line x1="560" y1="250" x2="560" y2="288" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <!-- A2 → A4（右，同排） -->
      <line x1="650" y1="314" x2="810" y2="314" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <!-- A2 → 双向线中点（下，喂入） -->
      <line x1="560" y1="340" x2="560" y2="404" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <!-- A4 → A5（下） -->
      <line x1="900" y1="340" x2="900" y2="378" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <!-- A3 ↔ A5（双向横线，过 x560 与 A2 汇入线相接成 T） -->
      <line x1="310" y1="404" x2="810" y2="404" stroke="#555" stroke-width="2" marker-start="url(#ahs)" marker-end="url(#ah)"/>
      <!-- A5 → A6（下） -->
      <line x1="900" y1="430" x2="900" y2="468" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <!-- A3 → A6（底部长横线：先下后右，从 A6 左侧面进） -->
      <line x1="220" y1="430" x2="220" y2="494" stroke="#555" stroke-width="2"/>
      <line x1="220" y1="494" x2="810" y2="494" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <!-- A6 → A7（下后左，走 row4/row5 净空 y540） -->
      <line x1="900" y1="520" x2="900" y2="540" stroke="#555" stroke-width="2"/>
      <line x1="900" y1="540" x2="560" y2="540" stroke="#555" stroke-width="2"/>
      <line x1="560" y1="540" x2="560" y2="558" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <!-- A7 → A8（右，同排） -->
      <line x1="650" y1="584" x2="810" y2="584" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <!-- A8 → 项目启动请求 → DP（绿，过事件正中心 x900） -->
      <line x1="900" y1="610" x2="900" y2="648" stroke="#2E8B57" stroke-width="2.5"/>
      <line x1="900" y1="676" x2="900" y2="690" stroke="#2E8B57" stroke-width="2.5" marker-end="url(#ahg)"/>

      <!-- ── 产出标注（蓝字小链，均避开线）── -->
      <a href="../entities/product.html#entity-日志"><text x="658" y="226" text-anchor="start" font-size="10" class="src-link">产出：日志</text></a>
      <a href="../entities/product.html#entity-经验教训记录单"><text x="462" y="316" text-anchor="end" font-size="10" class="src-link">产出：经验教训记录单</text></a>
      <a href="../entities/product.html#entity-项目产品描述"><text x="204" y="450" text-anchor="end" font-size="10" class="src-link">产出：项目产品描述</text></a>
      <a href="../entities/product.html#entity-项目概述文件"><text x="894" y="460" text-anchor="end" font-size="10" class="src-link">产出：项目概述文件</text></a>
      <a href="../entities/product.html#entity-阶段计划"><text x="462" y="588" text-anchor="end" font-size="10" class="src-link">产出：阶段计划（启动阶段）</text></a>

      <!-- 图例 -->
      <rect x="80" y="738" width="16" height="16" rx="3" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="102" y="750" font-size="11" fill="#444">橙 = 事件　绿框 = 活动（深底 = 里程碑活动）　实绿条 = 上下游（业务层 / 项目指导 DP）　蓝字 = 出处（可点）</text>
    </svg>'''

CTX = dict(
    title='项目准备 SU · 流程详情', abbr='项目准备 SU',
    h1='项目准备 SU <span style="font-size:15px;color:#8a7f6a;font-weight:normal">Starting up a Project · 第13章</span>',
    lead='项目的第一个流程：收到业务层下达的项目任务书后，任命项目总监与项目经理、评估以往经验教训、准备概要商业论证、任命项目管理团队、选择项目方法并汇编项目概述文件，再为启动阶段编制计划，最终请求项目管理委员会授权启动项目。',
    svg=SVG,
    trig_in='<span class="tag-ev">项目任务书（业务层 · 公司或项目群管理层下达）</span>',
    trig_out='<span class="tag-ev">项目启动请求 → DP（项目指导 · 请求授权启动项目）</span>',
    products='<a class="tag-mp" href="../entities/product.html#entity-日志">日志（创建）</a>'
             '<a class="tag-mp" href="../entities/product.html#entity-经验教训记录单">经验教训记录单（创建）</a>'
             '<a class="tag-mp" href="../entities/product.html#entity-项目产品描述">项目产品描述（创建）</a>'
             '<a class="tag-mp" href="../entities/product.html">概要商业论证（创建）</a>'
             '<a class="tag-mp" href="../entities/product.html#entity-项目概述文件">项目概述文件（创建）</a>'
             '<a class="tag-mp" href="../entities/product.html#entity-阶段计划">阶段计划（启动阶段 · 创建）</a>',
    reading='流程原文：<a href="../chapters/ch13.html">第13章 项目准备</a>　·　管理产品定义：<a href="../chapters/appendix_a.html">附录 A</a>　·　信息流全景：<a href="../graph-full.html">管理产品信息流</a>',
    nav_prev='<span class="disabled">◁ SU 是第一个流程</span>',
    nav_next='<a href="dp.html">DP 项目指导 ▷</a>',
)

if __name__ == '__main__':
    render('su.html', CTX)
