# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

PRINCE2® 7 中文知识库，基于 PRINCE2 第7版官方手册构建的纯静态 HTML 网站。在线访问：https://yunhongfeng-tracy.github.io/prince2-kb/

## 本地开发

无需安装任何依赖，直接在浏览器打开 `index.html` 即可，或用本地服务器：

```bash
python -m http.server 8000
# 访问 http://localhost:8000
```

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

`graph-full.html` 用 `.layer-section` 块（非 `.layer-row`）实现四层布局，层间用 `.info-band` 显示上行/下行信息流标签。

**管理产品标签体系**（3种 CSS 类）：

| 类名 | 含义 | 背景/边框颜色 |
|------|------|-------------|
| `.mp-plan` | 报告 / 计划 / 文件（15个） | 深绿底 #2E8B57 边框 |
| `.mp-approach` | 管理方法（6个） | 深蓝底 #2E6B9B 边框 |
| `.mp-register` | 登记单 / 日志（6个） | 深棕底 #8B6B00 边框 |

管理产品标签用 `.mgmt-product` + 类型类组合，可作 `<a>` 链接或 `<span>` 展示。

**CS/MP 列对齐**：`graph-full.html` 中 CS 行和 MP 行用 `.flow-spacer`（`flex:1`）+ `.arrow-spacer`（`width:28px`）做透明占位与管理行的 SB 列对齐，数学上：管理行固定宽 = 层标签(48) + 内边距(32) + 边框(2) + 3箭头(84) = **166px**，spacer 行固定宽 = 标签空间(65) + 3间距(84) + 右侧(17) = **166px**，两边 flex:1 单位相同，对齐成立。

**层间授权事件连接器**（`positionAuthEvents`）：当需要在两个层之间放置"授权事件中间节点"（如 DP→已授权项目启动→IP）时，**不要用 flex spacer 跨容器对齐**（不可靠）。正确做法：

```html
<div class="auth-connector-row" id="auth-connector-dp-ip">
    <div class="auth-event-col" id="auth-event-ip">...</div>
</div>
```
```css
.auth-connector-row { position:relative; height:68px; }
.auth-event-col { position:absolute; top:0; }
```
```javascript
function positionAuthEvents() {
    var target = document.getElementById('node-ip');
    var eventEl = document.getElementById('auth-event-ip');
    var tRect = target.getBoundingClientRect();
    var pRect = eventEl.parentElement.getBoundingClientRect();
    eventEl.style.left  = (tRect.left - pRect.left) + 'px';
    eventEl.style.width = tRect.width + 'px';
}
window.addEventListener('load', positionAuthEvents);
window.addEventListener('resize', positionAuthEvents);
```

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

配色方案通过 CSS `[data-theme="xxx"]` 属性切换，用户选择存入 `localStorage`。6套主题：`default`（古籍经典）、`blue`、`green`、`terra`、`lavender`、`mono`。新增页面须在 `<html>` 标签上读取 localStorage 并应用 `data-theme`，参考现有章节页面的 script 实现。

### 章节页面结构约定

每个章节 HTML 须包含：
1. 顶部导航栏（前/后章节链接）
2. 分类标签（`.chapter-tag`）
3. `<h2 class="section-heading">` 和 `<h3 class="section-heading">` 供 `floating-toc.js` 收集
4. 实体引用使用对应色码的 `<a>` 链接，指向 `entities/` 目录

### `floating-toc.js` 工作原理

脚本在 DOM 加载后自动扫描 `h2.section-heading` 和 `h3.section-heading`，在页面右侧（1200px 以上）生成浮动导航面板，滚动时高亮当前节。需要此功能的页面在底部引入该脚本即可，无需额外配置。

## 内容编辑规范

- `term.html` 是最大文件（282 KB，141条术语），编辑时分段操作避免截断
- 新增实体时同步更新 `index.html` 中对应的计数和索引列表
- 章节内容来源于 PRINCE2 第7版官方手册，保持原文准确性优先
