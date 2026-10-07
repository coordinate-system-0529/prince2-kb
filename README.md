# PRINCE2® 7 知识库

基于 PRINCE2 第7版官方手册构建的结构化中文知识图谱，支持全文搜索、实体关联和可视化浏览。

## 项目协作入口

- [项目进度与交接](doc/项目进度与交接.md)：当前页面架构、完成情况、待办及本地与线上状态。
- [项目长期准则](AGENTS.md)：开发前与进度文档一同阅读；本地工作区还需遵守上层 `../AGENTS.md`。
- [全站排版检查](doc/site-presentation-audit.md)：专项验证范围、结果和已知问题。

## 🌐 在线访问

**https://coordinate-system-0529.github.io/prince2-kb/**

## ✨ 功能特性

### 📚 结构化知识体系
- **199 个索引条目** 涵盖原则、实践、流程、角色、术语，以及管理产品的正式分类与扩展内容
- **19 个章节** 完整覆盖 PRINCE2 方法论
- **6 种实体类型** 相互关联，形成知识网络

### 🔍 全文搜索
- 支持中英文关键词搜索
- 实时高亮匹配结果
- 快速定位相关章节

### 🌐 知识图谱可视化
- 7 大流程生命周期图
- 流程间数据流动关系
- 点击展开详细信息

### 🎨 多配色方案
- 6 套主题：古籍经典、深邃蓝黑、森林绿意、赤陶暖阳、薰衣草梦境、极简黑白
- 右下角 🎨 按钮实时切换
- 跨页面同步，localStorage 持久化

### 📖 实体详情
- 实践页面支持展开详情（从原文提取）
- 商业论证、组织、计划等 7 大实践的完整内容
- 关键职责、管理产品、生命周期等结构化信息

## 📁 项目结构

```
prince2-kb/
├── index.html              # 主页 - 章节导航与概念索引
├── graph.html              # 知识图谱 - 流程生命周期可视化
├── color-schemes.html      # 配色方案预览
├── chapters/               # 19 个章节页面
│   ├── ch01.html ~ ch19.html
│   ├── appendix_a.html     # 附录A - 管理产品
│   ├── appendix_b.html     # 附录B - 角色描述
│   └── glossary.html       # 术语表
├── entities/               # 6 种实体类型索引
│   ├── principle.html      # 原则 (7项)
│   ├── practice.html       # 实践 (7项)
│   ├── process.html        # 流程 (7项)
│   ├── role.html           # 角色 (10项)
│   ├── product.html        # 管理产品正式首页，新版总览
│   ├── product-detail-v2.html   # 管理产品新版通用详情页
│   ├── product-overview-v2.html # 旧V2地址兼容跳转入口
│   └── term.html           # 术语 (141项)
├── 旧版/
│   └── product.html        # 旧版管理产品单页备份
└── assets/                 # 静态资源
    └── prince2-products.js # 第七版管理产品统一分类数据源
```

## 🛠️ 技术栈

验证报告引用的截图在本地 `output/`，不纳入仓库。部分原文一致性检查需要本地 `doc/prince2-7/` 手册查询资料，克隆仓库后不能仅凭这些资料缺失判断页面失败；手册资料不上传。

- **纯静态 HTML/CSS/JS** - 无需构建工具，直接部署
- **CSS 变量** - 支持主题切换
- **响应式设计** - 适配桌面和移动端
- **GitHub Pages** - 免费托管

## 📝 内容来源

所有内容基于 **PRINCE2® 第7版官方手册** 提取和结构化处理：
- 章节内容 = PDF 原文
- 实体关联 = 自动识别概念词并建立链接
- 实践详情 = 从对应章节原文提取
- 管理产品 = 以 Appendix A 的 A1-A15 为一级分类（7个基准、7个报告、1个项目记录单）
- 计划类型、管理方法和六种动态记录 = 对应正式产品的组成项或扩展解读，不另计为正式管理产品
- 管理产品正式入口为 `entities/product.html`；`entities/product-overview-v2.html` 仅保留兼容跳转

## 🚀 快速开始

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/coordinate-system-0529/prince2-kb.git
cd prince2-kb

# 用浏览器直接打开
open index.html
# 或者启动本地服务器
python3 -m http.server 8000
# 访问 http://localhost:8000
```

### 部署到 GitHub Pages

1. Fork 或克隆本仓库
2. 在 GitHub 仓库设置中启用 Pages
3. 选择 `main` 分支部署
4. 访问 `https://<username>.github.io/prince2-kb/`

## 📜 版权声明

- PRINCE2® 是 PeopleCert International Ltd. 的注册商标
- 本知识库仅供学习参考，内容基于 PRINCE2 第7版官方手册
- 请勿用于商业用途

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

- GitHub: [@coordinate-system-0529](https://github.com/coordinate-system-0529)

---

*Built with ❤️ for project management learners*
