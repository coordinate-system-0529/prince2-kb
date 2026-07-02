# -*- coding: utf-8 -*-
"""
生成 processes/dp.html（项目指导）。
拓扑依据官方图 14.1，活动名与锚点依据 chapters/ch14.html：
  pn-6=14.4.1 授权启动 / pn-7=14.4.2 授权项目 / pn-9=14.4.3 给予持续指导
  pn-10=14.4.4 授权阶段或例外计划 / pn-11=14.4.5 授权项目收尾
布局（DP 变体，5 个授权决策点横排）：
  顶=业务层条（公司或项目群管理层）
  中=DP 虚线容器，内含 5 个决策点活动，按项目生命周期从左到右：
     授权启动 · 授权项目 · 授权阶段或例外计划 · 给予持续指导 · 授权项目收尾
  底=管理层五流程条（SU·IP·SB·CS·CP 各自独立，对齐各决策点列）
接口事件按决策点分列对齐；所有连线一律竖直，落在容器/条的净空带，绝不穿越活动框。
  · 容器上方：DP→业务的通知（启动/项目授权/收尾）+ 业务→DP 的建议决策
  · 容器下方：管理层→DP 的请求（上行）+ DP→管理层的授权/决定（下行）
    每列两条并行竖线：上行请求走 x=中心-40，下行授权走 x=中心+40，事件框错开高度。
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"D:\5月份cc项目\prince2-开发\prince2-kb-develop\py")
from page_tpl import render

SVG = '''<svg class="diagram" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1150 760">
      <defs>
        <marker id="ah" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,3 L0,6 Z" fill="#888"/></marker>
        <marker id="ahg" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,3 L0,6 Z" fill="#2E8B57"/></marker>
      </defs>
      <rect x="0" y="0" width="1150" height="760" fill="#fdfbf7"/>
      <rect x="6" y="6" width="1138" height="748" fill="none" stroke="#e6ddc8" stroke-width="1.5" rx="10"/>

      <text x="575" y="38" text-anchor="middle" font-size="20" font-weight="bold" fill="#2c3e50">放大 DP：5 个授权决策点 · 项目管理委员会为项目把关</text>

      <!-- ── 上游：业务层条（公司或项目群管理层） ── -->
      <rect x="76" y="58" width="998" height="36" rx="8" fill="#2E8B57"/>
      <text x="575" y="81" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">公司或项目群管理层（业务层）· 下达项目任务书 · 接收启动 / 授权 / 收尾通知</text>

      <!-- ── 容器上方接口：DP↔业务（竖线全在 y94..168 净空带，不入容器） ── -->
      <!-- 通知上行（DP → 业务）col1/2/5 -->
      <line x1="185" y1="168" x2="185" y2="94" stroke="#888" stroke-width="2" marker-end="url(#ah)"/>
      <line x1="380" y1="168" x2="380" y2="94" stroke="#888" stroke-width="2" marker-end="url(#ah)"/>
      <line x1="965" y1="168" x2="965" y2="94" stroke="#888" stroke-width="2" marker-end="url(#ah)"/>
      <!-- col4（给予持续指导 列）：建议下行（业务 → DP，x690）+ 征求建议上行（DP → 业务，x828），两线并列错开 -->
      <line x1="690" y1="94" x2="690" y2="168" stroke="#888" stroke-width="2" marker-end="url(#ah)"/>
      <line x1="828" y1="168" x2="828" y2="94" stroke="#888" stroke-width="2" marker-end="url(#ah)"/>
      <rect x="119" y="117" width="132" height="24" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="185" y="133" text-anchor="middle" font-size="10" fill="#9a5b06">启动通知 → 业务层</text>
      <rect x="314" y="117" width="132" height="24" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="380" y="133" text-anchor="middle" font-size="10" fill="#9a5b06">项目授权通知 → 业务层</text>
      <rect x="624" y="117" width="132" height="24" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="690" y="133" text-anchor="middle" font-size="10" fill="#9a5b06">来自业务的建议和决策</text>
      <rect x="762" y="117" width="132" height="24" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="828" y="133" text-anchor="middle" font-size="9" fill="#9a5b06">征求建议 → 业务层</text>
      <rect x="899" y="117" width="132" height="24" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="965" y="133" text-anchor="middle" font-size="10" fill="#9a5b06">收尾通知 → 业务层</text>

      <!-- ── DP 虚线容器（w>900，碰撞检测跳过；内部无连线，仅活动框+标题） ── -->
      <rect x="76" y="168" width="998" height="128" rx="14" fill="#f7fbf9" stroke="#2E8B57" stroke-width="2" stroke-dasharray="7 4"/>
      <text x="92" y="190" text-anchor="start" font-size="13" font-weight="bold" fill="#2E8B57">项目指导 DP · 流程内部</text>
      <text x="92" y="206" text-anchor="start" font-size="10" fill="#6a9c7f">5 个授权决策点 · 随项目生命周期逐段把关（管方向，不管日常）</text>

      <!-- ── 5 个决策点活动（自左向右按生命周期） ── -->
      <a href="../chapters/ch14.html#pn-6"><rect x="99" y="216" width="172" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="185" y="240" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">授权启动</text><text x="185" y="258" text-anchor="middle" font-size="11" fill="#888">14.4.1</text></a>
      <a href="../chapters/ch14.html#pn-7"><rect x="294" y="216" width="172" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="380" y="240" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">授权项目</text><text x="380" y="258" text-anchor="middle" font-size="11" fill="#888">14.4.2</text></a>
      <a href="../chapters/ch14.html#pn-10"><rect x="489" y="216" width="172" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="575" y="240" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">授权阶段或例外计划</text><text x="575" y="258" text-anchor="middle" font-size="11" fill="#888">14.4.4</text></a>
      <a href="../chapters/ch14.html#pn-9"><rect x="684" y="216" width="172" height="52" rx="10" fill="#e3f2e9" stroke="#2E8B57" stroke-width="3"/><text x="770" y="240" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">给予持续指导</text><text x="770" y="258" text-anchor="middle" font-size="11" fill="#888">14.4.3 · 项目全程</text></a>
      <a href="../chapters/ch14.html#pn-11"><rect x="879" y="216" width="172" height="52" rx="10" fill="#eef7f1" stroke="#2E8B57" stroke-width="2"/><text x="965" y="240" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E8B57">授权项目收尾</text><text x="965" y="258" text-anchor="middle" font-size="11" fill="#888">14.4.5</text></a>

      <!-- ── 容器下方接口：管理层↔DP（每列上行请求 x=中-40，下行授权 x=中+40，均落管理条净空） ── -->
      <!-- 上行请求（管理层 → DP），落到活动框底边 y268 -->
      <line x1="145" y1="650" x2="145" y2="268" stroke="#888" stroke-width="2" marker-end="url(#ah)"/>
      <line x1="340" y1="650" x2="340" y2="268" stroke="#888" stroke-width="2" marker-end="url(#ah)"/>
      <line x1="535" y1="650" x2="535" y2="268" stroke="#888" stroke-width="2" marker-end="url(#ah)"/>
      <line x1="730" y1="650" x2="730" y2="268" stroke="#888" stroke-width="2" marker-end="url(#ah)"/>
      <line x1="925" y1="650" x2="925" y2="268" stroke="#888" stroke-width="2" marker-end="url(#ah)"/>
      <!-- 下行授权/决定（DP → 管理层）。跨列目标（→IP、→CS）经 y620 净空带 L 形导入目标流程条 -->
      <line x1="225" y1="268" x2="225" y2="620" stroke="#888" stroke-width="2"/>
      <polyline points="225,620 300,620" fill="none" stroke="#888" stroke-width="2"/>
      <line x1="300" y1="620" x2="300" y2="650" stroke="#888" stroke-width="2" marker-end="url(#ah)"/>
      <line x1="615" y1="268" x2="615" y2="620" stroke="#888" stroke-width="2"/>
      <polyline points="615,620 700,620" fill="none" stroke="#888" stroke-width="2"/>
      <line x1="700" y1="620" x2="700" y2="650" stroke="#888" stroke-width="2" marker-end="url(#ah)"/>
      <line x1="810" y1="268" x2="810" y2="650" stroke="#888" stroke-width="2" marker-end="url(#ah)"/>

      <!-- 下行授权事件框（高位 y330..360） -->
      <rect x="157" y="330" width="136" height="30" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="225" y="343" text-anchor="middle" font-size="9" fill="#9a5b06">已授权项目启动</text>
      <text x="225" y="355" text-anchor="middle" font-size="9" fill="#9a5b06">→ 项目启动 IP</text>
      <rect x="547" y="330" width="136" height="30" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="615" y="343" text-anchor="middle" font-size="9" fill="#9a5b06">已授权阶段 / 例外计划</text>
      <text x="615" y="355" text-anchor="middle" font-size="9" fill="#9a5b06">→ 阶段控制 CS</text>
      <rect x="742" y="330" width="136" height="30" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="810" y="343" text-anchor="middle" font-size="9" fill="#9a5b06">项目管理委员会</text>
      <text x="810" y="355" text-anchor="middle" font-size="9" fill="#9a5b06">的建议和决策 → CS</text>

      <!-- 上行请求事件框（低位 y560..590） -->
      <rect x="79" y="560" width="132" height="30" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="145" y="573" text-anchor="middle" font-size="9" fill="#9a5b06">项目启动请求</text>
      <text x="145" y="585" text-anchor="middle" font-size="9" fill="#9a5b06">← 项目准备 SU</text>
      <rect x="274" y="560" width="132" height="30" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="340" y="573" text-anchor="middle" font-size="9" fill="#9a5b06">项目授权请求</text>
      <text x="340" y="585" text-anchor="middle" font-size="9" fill="#9a5b06">← 项目启动 IP</text>
      <rect x="469" y="560" width="132" height="30" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="535" y="573" text-anchor="middle" font-size="9" fill="#9a5b06">下一阶段 / 例外计划</text>
      <text x="535" y="585" text-anchor="middle" font-size="9" fill="#9a5b06">批准请求 ← SB</text>
      <rect x="664" y="560" width="132" height="30" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="730" y="573" text-anchor="middle" font-size="9" fill="#9a5b06">建议请求 / 已提出例外</text>
      <text x="730" y="585" text-anchor="middle" font-size="9" fill="#9a5b06">← 阶段控制 CS</text>
      <rect x="859" y="560" width="132" height="30" rx="11" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="925" y="573" text-anchor="middle" font-size="9" fill="#9a5b06">项目收尾请求</text>
      <text x="925" y="585" text-anchor="middle" font-size="9" fill="#9a5b06">← 项目收尾 CP</text>

      <!-- ── 下游：管理层五流程条（各自独立，对齐各决策点列） ── -->
      <a href="../chapters/ch13.html"><rect x="96" y="650" width="178" height="36" rx="8" fill="#2E8B57"/><text x="185" y="668" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">项目准备 SU</text><text x="185" y="681" text-anchor="middle" font-size="9" fill="#cfe8d9">第13章</text></a>
      <a href="../chapters/ch15.html"><rect x="291" y="650" width="178" height="36" rx="8" fill="#2E8B57"/><text x="380" y="668" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">项目启动 IP</text><text x="380" y="681" text-anchor="middle" font-size="9" fill="#cfe8d9">第15章</text></a>
      <a href="../chapters/ch18.html"><rect x="486" y="650" width="178" height="36" rx="8" fill="#2E8B57"/><text x="575" y="668" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">阶段边界管理 SB</text><text x="575" y="681" text-anchor="middle" font-size="9" fill="#cfe8d9">第18章</text></a>
      <a href="../chapters/ch16.html"><rect x="681" y="650" width="178" height="36" rx="8" fill="#2E8B57"/><text x="770" y="668" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">阶段控制 CS</text><text x="770" y="681" text-anchor="middle" font-size="9" fill="#cfe8d9">第16章</text></a>
      <a href="../chapters/ch19.html"><rect x="876" y="650" width="178" height="36" rx="8" fill="#2E8B57"/><text x="965" y="668" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">项目收尾 CP</text><text x="965" y="681" text-anchor="middle" font-size="9" fill="#cfe8d9">第19章</text></a>

      <!-- 图例 -->
      <rect x="76" y="712" width="16" height="16" rx="3" fill="#fdebd5" stroke="#d97706" stroke-width="1.2"/>
      <text x="100" y="724" font-size="11" fill="#444">橙 = 接口事件（请求 / 通知 / 授权）　绿框 = DP 5 个活动　实绿条 = 上游业务层 · 下游管理层流程　蓝字 = 出处（可点）</text>
      <text x="76" y="742" font-size="10" fill="#8a7f6a">注：例外路径（例外计划请求 → SB · 提前收尾通知 → CP，仅例外 / 提前收尾时）见下方触发速览</text>
    </svg>'''

CTX = dict(
    title='项目指导 DP · 流程详情', abbr='项目指导 DP',
    h1='项目指导 DP <span style="font-size:15px;color:#8a7f6a;font-weight:normal">Directing a Project · 第14章</span>',
    lead='项目管理委员会代表业务层的把关流程：在五个授权决策点上做出要不要继续的决定，管方向不管日常。',
    svg=SVG,
    trig_in='<span class="tag-ev">项目启动请求（SU · 项目准备）</span><span class="tag-ev">项目授权请求（IP · 项目启动）</span><span class="tag-ev">下一阶段 / 例外计划批准请求（SB）</span><span class="tag-ev">建议请求 / 已提出例外（CS · 阶段控制）</span><span class="tag-ev">项目收尾请求（CP · 项目收尾）</span><span class="tag-ev">来自业务的建议和决策（业务层）</span>',
    trig_out='<span class="tag-ev">已授权项目启动 → IP</span><span class="tag-ev">已授权项目 → CS（首次）</span><span class="tag-ev">已授权阶段 / 例外计划 → CS</span><span class="tag-ev">项目管理委员会的建议和决策 → CS</span><span class="tag-ev">例外计划请求 → SB（例外时）</span><span class="tag-ev">提前收尾通知 → CP（提前收尾时）</span><span class="tag-ev">征求建议 → 业务层（征询）</span><span class="tag-ev">启动 / 项目授权 / 收尾通知 → 业务层</span>',
    products='<span style="color:#8a7f6a;font-size:12px">DP 在决策点审查 / 批准（而非创建）：</span> <a class="tag-mp" href="../entities/product.html">项目概述文件</a><a class="tag-mp" href="../entities/product.html">项目启动文件</a><a class="tag-mp" href="../entities/product.html">阶段计划</a><a class="tag-mp" href="../entities/product.html">例外计划</a><a class="tag-mp" href="../entities/product.html">阶段竣工报告</a><a class="tag-mp" href="../entities/product.html">项目竣工报告</a>',
    reading='流程原文：<a href="../chapters/ch14.html">第14章 项目指导</a>　·　管理产品定义：<a href="../chapters/appendix_a.html">附录 A</a>　·　信息流全景：<a href="../graph-full.html">管理产品信息流</a>',
    nav_prev='<a href="su.html">◁ SU 项目准备</a>',
    nav_next='<a href="ip.html">IP 项目启动 ▷</a>',
)

if __name__ == '__main__':
    render('dp.html', CTX)
