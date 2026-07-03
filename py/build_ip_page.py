# -*- coding: utf-8 -*-
"""
生成 processes/ip.html（项目启动 IP）。
拓扑依据官方图 15.1，活动名与锚点依据 chapters/ch15.html（pn-6..12 ↔ 15.4.1..7）。
布局（线性纵向链，自上而下，中央脊柱在 x=560）：
  DP 贯穿条 → 授权项目启动(事件) → 容器[项目启动]
    R1 协定剪裁要求(15.4.1) → R2 协定管理方法(15.4.2)
    → 分流 → R3 建立项目控制(15.4.3,左) ↔ 准备项目计划(15.4.4,中)
    → 汇合 → R4 准备完整的商业论证(15.4.5) → R5 汇编项目启动文件(15.4.6,中·枢纽) → 请求项目授权(15.4.7,右)
  请求项目授权 → 项目授权请求(事件) 沿最右净空通道 x=900 直上 → DP
  汇编项目启动文件 → 阶段边界临近(事件) → 阶段边界管理 SB(下游条)
走线：中央脊柱 x=560；上行请求走右侧空列 x=900（R1..R4 右列全空，零穿框零交叉）；
      分流/汇合的左支横线在 R2-R3、R3-R4 净空带（y=424 / y=556）。
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"D:\5月份cc项目\prince2-开发\prince2-kb-develop\py")
from page_tpl import render

SVG = '''<svg class="diagram" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1150 950">
      <defs>
        <marker id="ah" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto-start-reverse" markerUnits="strokeWidth"><path d="M0,0 L8,3 L0,6 Z" fill="#888"/></marker>
        <marker id="ahg" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,3 L0,6 Z" fill="#2E8B57"/></marker>
      </defs>
      <rect x="0" y="0" width="1150" height="950" fill="#fdfbf7"/>
      <rect x="6" y="6" width="1138" height="938" fill="none" stroke="#e6ddc8" stroke-width="1.5" rx="10"/>

      <text x="575" y="36" text-anchor="middle" font-size="20" font-weight="bold" fill="#2c3e50">放大 IP：7 个活动 · 项目启动的一次性奠基</text>

      <!-- DP 贯穿条（上游） -->
      <a href="../chapters/ch14.html">
        <rect x="80" y="54" width="940" height="36" rx="8" fill="#2E8B57"/>
        <text x="550" y="77" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">项目指导 DP · 项目管理委员会 · 授权项目启动、批准项目授权</text>
      </a>

      <!-- 接口事件：授权项目启动（下行入 IP） / 项目授权请求（上行回 DP） -->
      <line x1="560" y1="90" x2="560" y2="200" stroke="#2E8B57" stroke-width="2.5" marker-end="url(#ahg)"/>
      <rect x="490" y="98" width="140" height="28" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="560" y="116" text-anchor="middle" font-size="11" fill="#9a5b06">授权项目启动</text>
      <text x="484" y="115" text-anchor="end" font-size="9" fill="#999">来自 DP↓</text>

      <line x1="900" y1="728" x2="900" y2="90" stroke="#2E8B57" stroke-width="2.5" marker-end="url(#ahg)"/>
      <rect x="830" y="98" width="140" height="28" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="900" y="116" text-anchor="middle" font-size="11" fill="#9a5b06">项目授权请求</text>
      <text x="976" y="115" text-anchor="start" font-size="9" fill="#999">上报 DP↑</text>

      <!-- IP 容器 -->
      <rect x="80" y="148" width="940" height="660" rx="14" fill="#f6fbf8" stroke="#2E8B57" stroke-width="2" stroke-dasharray="7 4"/>
      <text x="100" y="172" text-anchor="start" font-size="13" font-weight="bold" fill="#2E8B57">项目启动 IP · 流程内部</text>
      <text x="100" y="188" text-anchor="start" font-size="10" fill="#6a9c7f">自上而下：剪裁 → 方法 → 控制·计划 → 商业论证 → PID → 授权</text>

      <!-- ── R1 协定剪裁要求 ── -->
      <a href="../chapters/ch15.html#pn-6"><rect x="470" y="200" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="560" y="224" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">协定剪裁要求</text><text x="560" y="241" text-anchor="middle" font-size="11" fill="#888">15.4.1</text></a>
      <line x1="560" y1="252" x2="560" y2="332" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>

      <!-- ── R2 协定管理方法 ── -->
      <a href="../chapters/ch15.html#pn-7"><rect x="470" y="332" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="560" y="356" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">协定管理方法</text><text x="560" y="373" text-anchor="middle" font-size="11" fill="#888">15.4.2 · 九种方法</text></a>

      <!-- 分流：15.4.2 → 建立项目控制(左) / 准备项目计划(中) -->
      <line x1="560" y1="384" x2="560" y2="464" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <polyline points="560,424 220,424 220,464" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="220" y1="450" x2="220" y2="464" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>

      <!-- ── R3 建立项目控制(左) ↔ 准备项目计划(中) ── -->
      <a href="../chapters/ch15.html#pn-8"><rect x="130" y="464" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="220" y="488" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">建立项目控制</text><text x="220" y="505" text-anchor="middle" font-size="11" fill="#888">15.4.3</text></a>
      <a href="../chapters/ch15.html#pn-9"><rect x="470" y="464" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="560" y="488" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">准备项目计划</text><text x="560" y="505" text-anchor="middle" font-size="11" fill="#888">15.4.4</text></a>
      <line x1="310" y1="490" x2="470" y2="490" stroke="#555" stroke-width="2" marker-start="url(#ah)" marker-end="url(#ah)"/>
      <text x="390" y="480" text-anchor="middle" font-size="9" fill="#999">相互迭代</text>
      <a href="../entities/product.html#entity-项目计划"><text x="666" y="493" text-anchor="start" font-size="10" class="src-link">产出：项目计划</text></a>

      <!-- 汇合：建立项目控制 + 准备项目计划 → 准备完整的商业论证 -->
      <line x1="560" y1="516" x2="560" y2="596" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <polyline points="220,516 220,556 560,556" fill="none" stroke="#555" stroke-width="2"/>

      <!-- ── R4 准备完整的商业论证 ── -->
      <a href="../chapters/ch15.html#pn-10"><rect x="470" y="596" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="560" y="620" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">准备完整的商业论证</text><text x="560" y="637" text-anchor="middle" font-size="11" fill="#888">15.4.5</text></a>
      <line x1="560" y1="648" x2="560" y2="728" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <a href="../entities/product.html"><text x="666" y="625" text-anchor="start" font-size="10" class="src-link">产出：完整商业论证</text></a>

      <!-- ── R5 汇编项目启动文件(枢纽) → 请求项目授权 ── -->
      <a href="../chapters/ch15.html#pn-11"><rect x="470" y="728" width="180" height="52" rx="10" fill="#e3f2e9" stroke="#2E8B57" stroke-width="3"/><text x="560" y="752" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">汇编项目启动文件</text><text x="560" y="769" text-anchor="middle" font-size="11" fill="#888">15.4.6 · PID</text></a>
      <a href="../chapters/ch15.html#pn-12"><rect x="810" y="728" width="180" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="900" y="752" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">请求项目授权</text><text x="900" y="769" text-anchor="middle" font-size="11" fill="#888">15.4.7</text></a>
      <line x1="650" y1="754" x2="810" y2="754" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>
      <a href="../entities/product.html#entity-项目启动文件"><text x="460" y="756" text-anchor="end" font-size="10" class="src-link">产出：项目启动文件</text></a>

      <!-- 触发下游：阶段边界临近 → 阶段边界管理 SB（源自 15.4.6 准备下一阶段） -->
      <line x1="560" y1="780" x2="560" y2="866" stroke="#2E8B57" stroke-width="2.5" marker-end="url(#ahg)"/>
      <rect x="485" y="822" width="150" height="28" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="560" y="840" text-anchor="middle" font-size="11" fill="#9a5b06">阶段边界临近</text>
      <text x="642" y="840" text-anchor="start" font-size="9" fill="#999">触发 SB · 首个交付阶段前</text>

      <!-- 下游流程条 SB -->
      <a href="../chapters/ch18.html">
        <rect x="80" y="866" width="940" height="36" rx="8" fill="#2E8B57"/>
        <text x="550" y="889" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">阶段边界管理 SB · 首个交付阶段的边界（准备下一阶段计划）</text>
      </a>

      <!-- 图例 -->
      <rect x="80" y="920" width="16" height="16" rx="3" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="102" y="932" font-size="11" fill="#444">橙 = 事件　绿框 = 活动（粗框 = 枢纽）　实绿条 = 上下游流程(DP/SB)　蓝字 = 出处(可点)</text>
    </svg>'''

CTX = dict(
    title='项目启动 IP · 流程详情', abbr='项目启动 IP',
    h1='项目启动 IP <span style="font-size:15px;color:#8a7f6a;font-weight:normal">Initiating a Project · 第15章</span>',
    lead='项目获授权启动后的一次性奠基流程：协定剪裁要求与九种管理方法、建立项目控制、准备项目计划与完整商业论证，把全部管理产品汇编成项目启动文件（PID），提交项目管理委员会请求项目授权。',
    svg=SVG,
    trig_in='<span class="tag-ev">授权项目启动（DP · 批准项目启动后）</span>',
    trig_out='<span class="tag-ev">请求项目授权 → DP（PID 完成后）</span><span class="tag-ev">阶段边界临近 → SB（准备下一阶段 · 首个交付阶段前）</span>',
    products='<a class="tag-mp" href="../entities/product.html">项目启动文件（PID）</a><a class="tag-mp" href="../entities/product.html">项目计划</a><a class="tag-mp" href="../entities/product.html">完整商业论证</a><a class="tag-mp" href="../entities/product.html">风险管理方法</a><a class="tag-mp" href="../entities/product.html">质量管理方法</a><a class="tag-mp" href="../entities/product.html">沟通管理方法</a><a class="tag-mp" href="../entities/product.html">项目控制</a><a class="tag-mp" href="../entities/product.html">项目产品描述（更新）</a><a class="tag-mp" href="../entities/product.html">项目记录单（更新）</a>',
    reading='流程原文：<a href="../chapters/ch15.html">第15章 项目启动</a>　·　管理产品定义：<a href="../chapters/appendix_a.html">附录 A</a>　·　信息流全景：<a href="../graph-full.html">管理产品信息流</a>',
    nav_prev='<a href="dp.html">◁ DP 项目指导</a>',
    nav_next='<a href="cs.html">CS 阶段控制 ▷</a>',
)

if __name__ == '__main__':
    render('ip.html', CTX)
