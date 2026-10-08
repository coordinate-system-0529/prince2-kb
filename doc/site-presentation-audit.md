# 全站排版与文案检查

日期：2026年09月14日

## 范围与结论

仅修改开发副本，不同步生产副本，不提交或推送。旧版备份、临时输出不纳入现行页面检查。

覆盖 50 个现行 HTML 文件，以及 11 个产品的理论／案例参数页面。按 1440 px 和 390 px 各检查一次，共 144 个页面与视口组合。无参数详情页检查其缺少条目的提示状态，两个兼容入口检查最终跳转地址。

这是全站静态筛查、浏览器布局检查和重点截图复核，不等于每段文字已人工校对，或所有交互组合均已穷举。官方手册正文不改写。

## 已处理

- 项目准则：工作区根目录 `../AGENTS.md` 的“全站信息密度、折行与结构化展示”章节，适用于所有现行及新增页面和生成模板，不是全局设置。
- 案例原文件：统一接入 `cases/case-responsive.css`。窄屏取消固定多列挤压，正文、元信息、流程节点和组织关系按顺序重排；多列表格保持局部滚动，不以省略号隐藏字段。
- 案例文案：精简项目概述、项目产品描述、产品登记单、防水证据包、组织关系和历史摘录的重复引导或制作旁白。保留教学性质、来源、实际状态和待确认信息。
- 手册排版：章节表格添加可键盘访问的横向滚动容器，短表头完整显示；浮动目录取消省略号。附录 A 表头单独适配。没有改写手册原文。
- 新版双模式：保留组成内容的长字段名布局及生命周期三列表，补充职责表长名称的均衡折行。
- 配色展示页：修正窄屏网格最小宽度造成的横向溢出。
- 旧知识图谱：关闭按钮不再被横向压缩，图谱本体的问题单列如下。

## 验证

- 50 个 HTML 的 UTF-8、明确制作旁白和案例共享样式接入检查通过。检查脚本还验证项目准则存在，以及新页面已加入浏览器清单。
- 最终 144 个无缓存组合均成功打开，无脚本运行错误；检测范围内的残余排版候选仅来自下方列出的两张旧知识图谱。
- 第 8 章抽查蓝色主题变量切换、宽表横向滚动及产品登记单原文锚点均正常，主题状态测试后恢复。
- 11 项产品数据、原文定义／用途／字段、理论案例映射、记录状态边界检查通过。
- 4 类正式登记单的记录选择、说明弹窗打开／关闭、390 px 弹窗宽度、返回理论模式通过。
- 打印媒体下，经验 3 条、风险 3 条、质量 2 条、产品 14 条均显示。产品无搜索结果时，打印仍包含全部记录。未启动系统打印窗口或逐页验证纸张分页。
- 重点截图复核覆盖案例原文件移动端、组织关系、章节宽表、完整产品台账；截图位于 `output/playwright/site-*.png`。
- 浏览器第一次复查遇到旧缓存，已用禁用缓存的重新检查替代；服务端文件内容已核对。
- 交互检查最初将关闭按钮的可访问名称误写为“关闭”而超时，重新取得页面状态后使用“关闭字段与职责说明”检查通过，不是页面关闭功能失效。
- 碰撞检测自测通过；`collision_check_offline.py graph.html` 报“未找到 svg.diagram”，此检查器不适用于该 HTML/CSS 图谱，不能据此声称连线无碰撞。

## 仍需单独处理

最终状态补充：用户随后明确以 GitHub Pages 页面为原版，`graph-full.html` 已恢复为线上文件内容。因此下表针对旧本地重排版本的发现不直接代表当前版本；本批重排方案停止使用，详见图谱回滚记录。

后续处理记录：2026年09月14日，两项图谱问题曾完成本地修复与专项自检；随后用户要求回滚 `graph-full.html`，已恢复批次前状态，该页问题仍待处理。`graph.html` 表格修复保留。详见[图谱第一批验证及回滚记录](graph-layout-batch1-review.md)。下表保留初次全站检查时的发现。

| 页面 | 当前问题 | 处理边界 |
|---|---|---|
| graph-full.html | 1440 px 下两条 CS 触发标签超出右边界，整页约溢出 144 px | 已定位到 trig-label 的坐标布局，需按图谱连线规则调整并做碰撞验证，本轮不改动连线结构 |
| graph.html | 390 px 下核心管理产品流转表的短表头仍被挤压 | 需单独调整旧图谱表格与详情面板的窄屏布局 |

`graph-full.html` 的“项目指导 / DP”分两行属于名称与流程缩写的语义分行，不把它当作单字尾行。表格的局部横向滚动是保留完整列与对照关系的设计，不属于整页溢出。

未穷举：所有字号与系统缩放组合、每个原文锚点、每种主题及全部折叠组合、浏览器打印分页、图谱所有连接器碰撞。以上均不标为全部通过。

## 复查命令

在开发副本运行：

```powershell
node py/check_site_presentation.cjs
node py/check_product_copy.cjs
node py/check_register_pair_v2.cjs
node py/check_quality_delivery_v2.cjs
node py/check_project_pair_v2.cjs
node py/check_register_documents.cjs
node py/check_lesson_document.cjs
node py/check_quality_document.cjs
```

浏览器批量检查代码：`py/audit_site_presentation_browser.cjs`，供 Playwright CLI 的 `run-code` 使用，本地服务端口为 8000。自动折行结果只是候选问题，必须结合截图判断；不同字号的编号、图标和语义分行不能机械计为缺陷。

## 现行 HTML 清单

- `cases/product-description-waterproofing.html`
- `cases/product-register.html`
- `cases/project-brief.html`
- `cases/project-product-description.html`
- `cases/renovation.html`
- `cases/risk-lessons-records.html`
- `cases/waterproof-quality-records.html`
- `chapters/appendix_a.html`
- `chapters/appendix_b.html`
- `chapters/ch01.html`
- `chapters/ch02.html`
- `chapters/ch03.html`
- `chapters/ch04.html`
- `chapters/ch05.html`
- `chapters/ch06.html`
- `chapters/ch07.html`
- `chapters/ch08.html`
- `chapters/ch09.html`
- `chapters/ch10.html`
- `chapters/ch11.html`
- `chapters/ch12.html`
- `chapters/ch13.html`
- `chapters/ch14.html`
- `chapters/ch15.html`
- `chapters/ch16.html`
- `chapters/ch17.html`
- `chapters/ch18.html`
- `chapters/ch19.html`
- `chapters/glossary.html`
- `color-schemes.html`
- `entities/practice.html`
- `entities/principle.html`
- `entities/process.html`
- `entities/product-detail-v2.html`
- `entities/product-overview-v2.html`
- `entities/product-register-v2.html`
- `entities/product.html`
- `entities/role.html`
- `entities/term.html`
- `graph-full.html`
- `graph.html`
- `index.html`
- `process-trigger.html`
- `processes/cp.html`
- `processes/cs.html`
- `processes/dp.html`
- `processes/ip.html`
- `processes/mp.html`
- `processes/sb.html`
- `processes/su.html`

## 补充参数路由

- `entities/product-detail-v2.html?entry=outline-business-case&mode=theory`
- `entities/product-detail-v2.html?entry=outline-business-case&mode=case`
- `entities/product-detail-v2.html?entry=full-business-case&mode=theory`
- `entities/product-detail-v2.html?entry=full-business-case&mode=case`
- `entities/product-detail-v2.html?entry=product-register&mode=theory`
- `entities/product-detail-v2.html?entry=product-register&mode=case`
- `entities/product-detail-v2.html?entry=product-description&mode=theory`
- `entities/product-detail-v2.html?entry=product-description&mode=case`
- `entities/product-detail-v2.html?entry=project-brief&mode=theory`
- `entities/product-detail-v2.html?entry=project-brief&mode=case`
- `entities/product-detail-v2.html?entry=project-product-description&mode=theory`
- `entities/product-detail-v2.html?entry=project-product-description&mode=case`
- `entities/product-detail-v2.html?entry=risk-register&mode=theory`
- `entities/product-detail-v2.html?entry=risk-register&mode=case`
- `entities/product-detail-v2.html?entry=lessons-log&mode=theory`
- `entities/product-detail-v2.html?entry=lessons-log&mode=case`
- `entities/product-detail-v2.html?entry=quality-register&mode=theory`
- `entities/product-detail-v2.html?entry=quality-register&mode=case`
- `entities/product-detail-v2.html?entry=quality-management-approach&mode=theory`
- `entities/product-detail-v2.html?entry=quality-management-approach&mode=case`
- `entities/product-detail-v2.html?entry=work-package-description&mode=theory`
- `entities/product-detail-v2.html?entry=work-package-description&mode=case`
