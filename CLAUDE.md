# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

PRINCE2® 7 中文知识库，基于 PRINCE2 第7版官方手册构建的纯静态 HTML 网站。在线访问：https://coordinate-system-0529.github.io/prince2-kb/

## 本地开发

无需安装任何依赖，直接在浏览器打开 `index.html` 即可，或用本地服务器：

```bash
python -m http.server 8000
# 访问 http://localhost:8000
```

## Git 工作流与部署

- **分支策略**：`develop` 为开发分支，`main` 为生产分支
- **提交规范**：使用 Conventional Commits 格式（`feat:` `fix:` `style:` `content:` `docs:` `revert:`）
- **部署方式**：GitHub Pages 自动部署，推送 `main` 分支后自动生效
- **在线地址**：https://coordinate-system-0529.github.io/prince2-kb/

## 项目架构

### 文件结构

```
/
├── index.html          # 主页：章节导航、搜索、概念索引
├── graph.html          # 流程图：4层分层布局 + 点击展开详情面板
├── graph-full.html     # 管理产品信息流：27个管理产品 + 层间授权事件连接器
├── color-schemes.html  # 6套配色方案预览
├── chapters/           # 19个章节 + appendix_a.html、appendix_b.html、glossary.html
├── entities/           # 6种实体类型索引（每种一个文件）
└── assets/
    └── floating-toc.js # 章节页浮动目录导航
```

### graph.html 分层布局架构

`graph.html` 采用 `.layers-wrapper` 容器，内含多个 `.layer-row`，实现 PRINCE2 官方的三层架构（业务外部 / 指导 / 管理 / 交付）：

```
.layers-wrapper
  .layer-row.layer--directing   → DP 贯穿条
  .layer-connector-row          → 层间垂直箭头（↓ / ↕），含 .v-connector 和文字说明
  .layer-row.layer--managing    → SU / IP / SB / CP 横向排列，CS 在 SB 下方
  .layer-connector-row          → CS ↔ MP 工作包箭头
  .layer-row.layer--delivery    → MP
```

**对齐机制**：控制层/交付层用 `.flow-spacer`（`flex:1`）和 `.arrow-spacer`（`width:30px`）做透明占位，确保 CS、MP 与管理层的 SB 列垂直对齐。

**交互逻辑**：点击流程节点调用 `toggleDetail(id)`，在 `.layers-wrapper` 末尾展开对应 `.detail-panel`；`.layer-row:has(.process-node.active)` 让同层其他节点变暗，`.layers-wrapper:has(.directing-bar.active)` 让 DP 激活时全部节点变暗。`toggleDetail` 是两个流程图页面共用的模式：同时管理节点的 `.active` 类和面板的 `.open` 类，并维护 `currentOpen` 全局变量保证同时只有一个面板展开。

### graph-full.html 管理产品信息流架构

`graph-full.html` 用 `.layer-section` 块实现四层布局（业务 / 指导 / 管理 / 交付），每个 `.layer-section` = `.layer-label`（48px 竖排标签）+ `.layer-body`。层间用 `.info-band` 显示上行/下行信息流标签（`.band-item.up` / `.down` / `.bi`）。这是全站最复杂的页面，改动前务必用浏览器实测对齐，不能只靠读代码。

**管理产品标签体系**（3种 CSS 类，`.mgmt-product` + 类型类组合，可作 `<a>` 或 `<span>`）：

| 类名 | 含义 | 背景/边框颜色 |
|------|------|-------------|
| `.mp-plan` | 报告 / 计划 / 文件 | 深绿底 #2E8B57 边框 |
| `.mp-approach` | 管理方法 | 深蓝底 #2E6B9B 边框 |
| `.mp-register` | 登记单 / 日志 | 深棕底 #8B6B00 边框 |

> 注：此三分类是本项目的展示口径，**与官方 Appendix A 的"基线/报告/记录单"分类不同**；产品清单也收录了"项目收尾建议"而缺"商业论证/经验教训报告"，与 `entities/product.html` 一致但与官方手册有出入。改分类是牵动全站的内容决策，勿擅自改。

**列对齐网格（整个页面对齐的骨架）**：所有需要纵向对齐的行都用**同一套四列网格**——4 个 `flex:1` 列，列间 3 个间隔。`gap1`(SU↔IP) 与 `gap3`(SB↔CP) = 28px（`.arrow-spacer` 或 `.flow-arrow`）；**`gap2`(IP↔SB) = 90px（`.gap-wide`）**，这条加宽间隙就是 DP→CS 连线穿过的"通道"。因为每一行结构完全相同，列才会跨行对齐。列顺序：SU / IP / SB / CP，**CS 与 MP 都对齐在第 3 列（SB 列）下方**。使用此网格的行：`.up-flow-row`、顶部 `.managing-row`、`.sb-cs-row`、底部 `.managing-row`(CS)、`.delivery-row`。改任一行的间隔，必须同步改其余所有行，否则列错位。

**连接器系统（层间授权/请求事件）**：跨容器对齐**不要用 flex spacer**（不可靠），用绝对定位 + JS 按目标节点 `getBoundingClientRect` 定位：

- `.auth-connector-row`（DP 与管理层顶排之间）：放下行连接器 `#auth-event-ip`、`#auth-event-cp`（↓ 落到 IP/CP），以及上行连接器 `#auth-up-sb`（↑ 连入 DP）。`.auth-event-col` 用 `position:absolute; top:0; bottom:0; justify-content:space-between` 撑满行高、箭头贴两端；`positionAuthEvents()` 里的 `pairs` 数组把每个 `eventId` 对齐到 `targetId` 节点列（现含 ip→node-ip、cp→node-cp、auth-up-sb→node-sb）。
- `.sb-cs-row` 内 `.cs-auth-col` > `.cs-auth-boxes`：3 个 DP→CS 下行授权框，横向并排，靠 spacer 对齐到 CS 列（窄于内容时居中溢出到两侧空白）。
- 连接器框 `.auth-event-box` = `.auth-event-src`（"起点 → 终点"路由，如 `DP 授权 → IP`）+ `.auth-event-name`（事件名）。
- 上行请求同时以 `.up-col` 药丸出现在 `.up-flow-row`（按来源列对齐），这些药丸也**兼作移动端回退**。

**DP→CS 通道连线**（`positionCorridor()`）：`.container` 设 `position:relative` 作定位上下文；连线由 5 个绝对定位元素组成（`#corr-label` 起点标签"DP 授权"、`#corr-v`/`#corr-h`/`#corr-v2` 三段线、`#corr-arrow` 箭头）。JS 计算：通道 x = `IP.right` 与 `SB.left` 中点，从 DP 底部竖直下行，拐入 CS 连接器中心，箭头靠 `gap`(12px) 悬在 CS 框上方避免遮挡。语义：DP→CS 的授权起点是 **DP 不是 SB**，通道绕开 SB 节点正是为消除误读。

**统一框高**：`.proc-node { min-height:200px }` 把 6 个流程框（SU/IP/SB/CP/CS/MP）钉成等高，200 取自内容最多的 IP（10 个产品）的实际高度。

**移动端回退模式（`@media max-width:960px`）**：连接器、通道连线、`.gap-wide`、`.sb-cs-row`、`.auth-connector-row` 全部 `display:none`；同时 `.dp-downflow`（蓝色 ▼"DP 发出"列表，含 CS 下行授权）和 `.up-sb-fallback`（SB 上行）改为显示，作为纯文字回退。**通用约定：桌面端用连接器，移动端用药丸列表，两端信息不丢**。新增任何桌面连接器时，必须同步留一个移动端文字回退。

### 实体类型与颜色编码

全站所有链接按实体类型色码统一：

| 实体 | 文件 | 数量 | 颜色含义 |
|------|------|------|---------|
| 原则 (Principle) | `entities/principle.html` | 7 | 金色 |
| 实践 (Practice) | `entities/practice.html` | 7 | 褐色 |
| 流程 (Process) | `entities/process.html` | 7 | 绿色 |
| 角色 (Role) | `entities/role.html` | 10 | 蓝色 |
| 管理产品 (Product) | `entities/product.html` | 27 | 紫色 |
| 术语 (Term) | `entities/term.html` | 141 | 棕色 |

### 主题系统

配色方案通过 CSS `[data-theme="xxx"]` 属性切换，用户选择存入 `localStorage`。6套主题：`default`（古籍经典）、`blue`、`green`、`terra`、`lavender`、`mono`。

**主题支持范围**：仅 `index.html`、`graph.html`、`graph-full.html` 支持主题切换。章节页面（`chapters/*.html`）和实体索引页面（`entities/*.html`）使用固定浅色主题，不响应主题切换。

新增支持主题的页面时，须在 `<html>` 标签的 `<script>` 中读取 `localStorage.getItem('prince2-theme')` 并调用 `document.documentElement.setAttribute('data-theme', ...)`。

### 章节页面结构约定

每个章节 HTML 须包含：
1. 顶部导航栏（前/后章节链接）
2. 分类标签（`.chapter-tag`）
3. `<h2 class="section-heading">` 和 `<h3 class="section-heading">` 供 `floating-toc.js` 收集
4. 实体引用使用对应色码的 `<a>` 链接，指向 `entities/` 目录

### entity 页面模板约定

6个实体索引页面（`entities/principle.html`、`practice.html`、`process.html`、`role.html`、`product.html`、`term.html`）共享统一模板：

1. **导航栏**：返回主页链接 + 6种实体类型的快捷入口（每种用对应色码）
2. **`page-title`**：实体类型名称（如"原则索引"）
3. **`page-stats`**：统计信息（如"共7个原则，在文本中共出现N次"）
4. **`quick-nav`**：快速跳转区域（按首字母或分类），使用对应主题色的 `.quick-nav a` 链接
5. **`entity-list`**：`.entity-entry` 卡片列表，每个卡片包含：
   - `.entity-icon`：统一为"◇"符号
   - `.entity-name`：实体名称
   - `.occ-count`：出现次数（如"(175次)"）
   - `.entity-desc`：简短描述/定义
   - `.entity-sources`（仅 term.html）：出处链接，Purple Numbers 格式

每种实体类型有独特的主题色（通过 CSS 变量 `--entity-color` 或直接样式控制），见上文颜色编码表。

### practice.html 详情展开模式

实践页面中每个 `.entity-entry` 包含内联的展开/收起交互：

```html
<div class="entity-detail-toggle" onclick="this.nextElementSibling.classList.toggle('open')">▸ 查看详情</div>
<div class="entity-detail">
    <!-- 详情内容：目的、产出成果与收益、生命周期、相关章节链接 -->
</div>
```

CSS 控制：`.entity-detail { display: none; }` → `.entity-detail.open { display: block; }`

7个实践（商业论证、组织、计划、质量、风险、问题、进展）使用相同的结构与模式，详情内容从对应章节原文提取。

### index.html 搜索机制

侧边栏搜索框（`#searchInput`）通过 `oninput` 事件触发实时过滤：

- 搜索关键词与章节/实体项的 `data-keywords` 属性进行匹配
- 匹配结果用 `<mark>` 标签高亮显示关键词
- 过滤逻辑同时作用于章节导航树（`#navTree`）和主内容区的卡片列表
- 清空搜索框时恢复全部显示

### 跨页面实体链接约定

全站实体引用使用对应色码的 `<a>` 链接，指向 `entities/` 目录：
- 原则 → 金色链接 → `entities/principle.html`
- 实践 → 褐色链接 → `entities/practice.html`
- 流程 → 绿色链接 → `entities/process.html`
- 角色 → 蓝色链接 → `entities/role.html`
- 管理产品 → 紫色链接 → `entities/product.html`
- 术语 → 棕色链接 → `entities/term.html`

章节页面和实体页面中的术语引用均遵循此约定，形成互联的知识网络。

### Purple Numbers 段落引用系统

章节页面中每个标题使用 Purple Numbers 段落编号作为唯一锚点：

```html
<h2 id="pn-2" class="section-heading"><a href="#pn-2" class="pn-link">[2]</a> 5.1 目的</h2>
```

- 格式：`id="pn-N"`，N 为该段落在整个手册中的全局编号
- `.pn-link` 为自引用链接，点击可复制该段落的直接访问 URL
- `term.html` 中的术语出处通过 `#pn-N` 锚点链接到章节的精确段落位置
- 新增或编辑章节内容时，段落编号必须与 PRINCE2 官方手册保持一致，不可随意编造

### term.html 结构与注意事项

`term.html` 是项目中最大的文件（282 KB，141条术语），结构特点：

- **扁平列表**：按术语拼音/Unicode顺序排列，无字母分组索引或分页
- **每条术语包含**：唯一ID（`id="entity-名称"`）、图标、名称、出现频次（如"(175次)"）、简短定义、出处来源
- **出处格式**：`第X章 名称 [N]`，使用 Purple Numbers 段落编号，每个出处为 `<a class="pn-ref">` 链接到章节页面的 `#pn-N` 锚点
- **已知问题**：部分术语的名称和描述文本存在截断现象（如ID中出现"业产品为目的而建立的临时组织"这类不完整文本），可能源于自动提取过程的缺陷

编辑此文件时务必分段操作，避免文本截断加剧。

### `floating-toc.js` 工作原理

脚本在 DOM 加载后自动扫描 `h2.section-heading` 和 `h3.section-heading`，在页面右侧（1200px 以上）生成浮动导航面板，滚动时高亮当前节。需要此功能的页面在底部引入该脚本即可，无需额外配置。

## 内容编辑规范

- `term.html` 是最大文件（282 KB，141条术语），编辑时分段操作避免截断
- 新增实体时同步更新 `index.html` 中对应的计数和索引列表
- 章节内容来源于 PRINCE2 第7版官方手册，保持原文准确性优先
