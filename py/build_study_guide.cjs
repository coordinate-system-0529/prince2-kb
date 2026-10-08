// 只读读取站点与教材索引，输出 Markdown 补丁；不直接写入文件。
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = file => new TextDecoder('utf-8', { fatal: true }).decode(fs.readFileSync(path.join(root, file)));
const context = { window: { addEventListener() {} }, document: {} };
for (const file of ['assets/prince2-products.js', 'assets/product-details-v2.js', 'cases/renovation-register-data.js',
    'assets/register-documents.js', 'assets/lesson-register.js', 'assets/quality-register.js',
    'assets/product-management-usage.js', 'assets/product-remaining-v2.js', 'assets/product-remaining-cases.js',
    'assets/product-remaining-methods.js', 'assets/product-remaining-runtime.js', 'assets/product-raci.js',
    'assets/business-case-usage.js', 'assets/project-plan-usage.js']) {
    vm.runInNewContext(read(file), context, { filename: file });
}
const entries = context.window.PRINCE2_PRODUCT_DETAILS_V2.entries;
const processSources = Object.fromEntries(Object.values(context.window.PRINCE2ProductRaci.activities).map(activity => [activity.flow, activity.source]));
const index = JSON.parse(read('doc/prince2-7/index.json'));
const base = 'http://127.0.0.1:8000/';
const pdfPath = encodeURIComponent(index.source.file);
const link = (label, target) => `[${label}](${target})`;
const pdf = (first, last) => link(`PDF ${first}${last ? '至' + last : ''}页，书中${first - 21}${last ? '至' + (last - 21) : ''}页`, base + pdfPath + '#page=' + first);
const pageLink = (slug, mode, hash = '') => base + 'entities/product-detail-v2.html?entry=' + slug + '&mode=' + mode + hash;
const normalize = text => text.replace(/[^\p{L}\p{N}]/gu, '');
const corpus = index.pages.map(p => ({ page: p.pdf_page, text: normalize(read('doc/prince2-7/' + p.file)) }));
const metadata = {
    'business-case': [91, null, '第5章 §5.5；附录A1，PDF314至315页', '先辨别概要与完整两种状态，再核对持续业务理由。'],
    'outline-business-case': [91, null, '第5章 §5.2.1、§5.5；第13章 §13.4.3', '比较三种装修选项，检查是否只支持投入启动阶段。'],
    'full-business-case': [91, null, '第5章 §5.5、§5.6；第15章 §15.4.5；附录A1', '核对十章与42万元预算，区分拟稿、历史授权和项目后收益。'],
    'plan': [324, 325, '附录A9；第7章 §7.2.2、§7.3', '从计划父入口区分项目、阶段、小组和例外计划。'],
    'project-plan': [324, 325, '附录A9；第7章 §7.2.2.1、§7.3、§7.6', '十项组成对应十章，检查产品分解、依赖、预算与进度是否一致。'],
    'stage-plan': [324, 325, '附录A9；第7章 §7.2.2.2；第18章', '核对阶段范围及详细程度；MGT-004 v0.1仍为编制中。'],
    'exception-plan': [324, 325, '附录A9；第7章 §7.2.2.4；第18章', '先判断预测超差和重规划要求，再看替代范围及批准条件。'],
    'team-plan': [324, 325, '附录A9；第7章 §7.2.2.3；第17章', '区分可选小组计划、工作包约定与阶段计划；核对返工和复验接口。'],
    'product-description': [326, 327, '附录A10；第8章 §8.3、§8.5、§8.6', '对照WPF-011的质量规格、质量方法、职责和检查证据。'],
    'project-brief': [328, null, '附录A11；第13章', '检查概要商业论证、项目方法与项目产品描述是否能支持启动决策。'],
    'project-initiation-documentation': [329, 330, '附录A12；第15章；第14章', '这是逻辑相关文件集合，逐组件核对版本和批准，不把历史授权扩展到新拟稿。'],
    'project-product-description': [334, null, '附录A14；第7、8章；第13、19章', '看整套可入住住宅的质量期望和最终验收，不混同单项防水产品描述。'],
    'work-package-description': [335, 336, '附录A15；第16、17章', '看防水工作包的授权、接口、容许偏差、报告、质量及完成接受条件。'],
    'project-log': [331, 333, '附录A13；第11章', '六类动态记录的集合，不能误认为六项新增正式管理产品。'],
    'daily-log': [332, 333, '附录A13；第13、16章', '三项管理待办；核对何时由非正式日志转入正式登记单。'],
    'issue-register': [331, null, '附录A13；第10章 §10.5、§10.6', '看ISS-WPF-001的类型、决策、状态与关闭条件；返工不等于已关闭。'],
    'lessons-log': [331, null, '附录A13；第2章 §2.2；第11章；第13、18、19章', '按LES-001至003逐条核对八字段、处理历程、行动负责人和效果证据。'],
    'product-register': [331, 332, '附录A13；第8章 §8.5；第15至19章', '四字段与14条产品状态；台账记录不等于14份完整产品描述。'],
    'quality-register': [168, null, '第8章 §8.5、§8.6；附录A13，PDF332页', '对照QA-WPF-01首次未通过、QA-WPF-02复验待补；登记单不是检查证据本身。'],
    'risk-register': [332, null, '附录A13；第9章 §9.2、§9.3、§9.5、§9.6', '分别选RISK-004、007、011，检查威胁／机会、两类负责人及剩余风险。'],
    'quality-management-approach': [167, null, '第8章 §8.5、§8.6；附录A12', '质量方法规定程序与标准，质量登记单记录活动，证据包保存检查结果。']
};
const reportFocus = {
    'checkpoint-report': '小组经理向项目经理报告工作包，检查质量、剩余工作及工作包容许偏差。',
    'end-project-report': '对照原始批准PID评价项目；当前是拟稿，不能读成住宅已经完成接受。',
    'end-stage-report': '阶段实际、剩余预测与下一阶段决策材料，不等于下一阶段已授权。',
    'exception-report': '预测超差、影响、选项与建议；报告不等于已获准改变基准。',
    'highlight-report': '项目经理定期向委员会报告阶段状态，区分实际和预测。',
    'issue-report': '围绕一个正式问题展开影响、选项、建议和决策，区别于问题总表。',
    'lessons-report': '将记录中的经验分析、共享并触发组织行动，不是把记录总表换个标题。'
};
const methodFocus = {
    'benefits-management-approach': '收益基线、测量时间、测量人和项目后责任。',
    'change-management-approach': '人员、组织接受变更与能力转变，不等同于问题实践中的基线变更控制。',
    'commercial-management-approach': '采购方式、供应商接口、合同与付款；排产承诺仍须单独验证。',
    'communication-management-approach': '沟通对象、需求、渠道、频率与反馈，不只是会议列表。',
    'digital-and-data-management-approach': '图纸和记录的数据质量、权限、版本、存储及移交。',
    'issue-management-approach': '问题捕获、评价、决策、权限和变更控制程序。',
    'risk-management-approach': '风险程序、评级、容许偏差和职责，区分风险负责人和行动负责人。',
    'sustainability-management-approach': '可持续性目标、测量基线、责任、资源与验收依据。'
};
for (const [slug, spec] of Object.entries(context.window.PRINCE2RemainingProducts.source)) {
    if (metadata[slug]) continue;
    metadata[slug] = [spec.page, null, spec.chapter === 'appendix_a' ? `附录${spec.code}` : `第${Number(spec.chapter.slice(2))}章；附录A12`, reportFocus[slug] || methodFocus[slug]];
}
const groups = [
    ['商业论证与计划', ['business-case', 'outline-business-case', 'full-business-case', 'plan', 'project-plan', 'stage-plan', 'team-plan', 'exception-plan']],
    ['产品、项目文件与工作包', ['product-description', 'project-brief', 'project-initiation-documentation', 'project-product-description', 'work-package-description']],
    ['项目启动文件内的九种管理方法', ['benefits-management-approach', 'change-management-approach', 'commercial-management-approach', 'communication-management-approach', 'digital-and-data-management-approach', 'issue-management-approach', 'quality-management-approach', 'risk-management-approach', 'sustainability-management-approach']],
    ['七种报告', ['checkpoint-report', 'end-project-report', 'end-stage-report', 'exception-report', 'highlight-report', 'issue-report', 'lessons-report']],
    ['项目记录单与六类记录', ['project-log', 'daily-log', 'issue-register', 'lessons-log', 'product-register', 'quality-register', 'risk-register']]
];
const slugs = groups.flatMap(group => group[1]);
assert.equal(slugs.length, 36);
assert.deepEqual([...slugs].sort(), Object.keys(entries).sort());
const checkedLinks = new Set();
function sourceLink(source) {
    const url = new URL(source.href, base + 'entities/product-detail-v2.html');
    const relative = decodeURIComponent(url.pathname.slice(1));
    const html = read(relative);
    let label = source.label;
    if (url.hash) {
        const id = decodeURIComponent(url.hash.slice(1));
        assert.ok(html.includes('id="' + id + '"') || html.includes("id='" + id + "'"), relative + '#' + id);
        if (/§\s*\d+(?:\s|$)/.test(label)) {
            const location = html.indexOf('id="' + id + '"');
            const headings = [...html.slice(0, location + 400).matchAll(/<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/g)];
            const nearest = headings.filter(match => match.index <= location).at(-1);
            if (nearest) label = nearest[0].replace(/<[^>]+>/g, '').replace(/\[\d+(?:\.\d+)*\]/g, '').trim();
        }
    }
    checkedLinks.add(url.href);
    return link(label, url.href);
}
function sources(items) {
    const unique = [...new Map((items || []).map(item => [item.href, item])).values()];
    return unique.map(sourceLink).join('；');
}
function findDefinitionPage(entry) {
    const prefix = normalize(entry.definition.text).slice(0, 36);
    const matches = corpus.filter(page => page.text.includes(prefix));
    const spec = context.window.PRINCE2RemainingProducts.source[entry.slug];
    if (spec) return spec.definitionPage;
    const chapter = entry.definition.sourceHref.match(/chapters\/(ch\d+|appendix_a|glossary)\.html/)[1];
    const chapterIndex = chapter === 'appendix_a' ? 19 : chapter === 'glossary' ? 21 : Number(chapter.slice(2)) - 1;
    const start = index.chapters[chapterIndex].pdf_page;
    const end = index.chapters[chapterIndex + 1]?.pdf_page || 360;
    const selected = matches.find(page => page.page >= start && page.page < end);
    assert.ok(selected, entry.slug + ': 定义未在指定教材范围找到');
    return selected.page;
}
const lines = [];
const add = (...text) => lines.push(...text);
const target = 'doc/PRINCE2教材与案例对照学习指引.md';
let currentDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' }).format(new Date());
if (process.argv.includes('--check')) {
    const storedDate = read(target).match(/整理日期：(\d{4})年(\d{2})月(\d{2})日/);
    assert.ok(storedDate, '整理日期缺失');
    currentDate = storedDate.slice(1).join('-');
}
const [year, month, day] = currentDate.split('-');
add('# PRINCE2 7 教材、理论与装修案例对照学习指引', '',
    `整理日期：${year}年${month}月${day}日。范围：本地开发版的36个阅读入口。`, '',
    '本指引用于人工复习和验收，不是教材全文审校结论。教材基准为项目内第七版中文PDF，共370页，不混用2017版。网页中的章节是定位副本，遇到文字、表格或脚注差异，以原PDF核对。', '',
    `${link('管理产品总览', base + 'entities/product.html')} · ${link('住宅装修案例首页', base + 'cases/renovation.html')} · ${link('本地第七版PDF', base + pdfPath + '#page=1')}`, '',
    '网页与PDF链接需要本地8000端口服务运行。PDF链接中的`#page=`指文件页序，不是书上印刷页码；下文同时列出两者。少数内置预览器会忽略页码参数，此时手动输入PDF页序。', '',
    '## 1. 每次如何对照', '',
    '| 要核对什么 | 先去哪里 | 再看案例什么 |',
    '|---|---|---|',
    '| 定义 | 各条目的“定义原文”，有的在术语表，有的在实践章 | 产品身份是否用对 |',
    '| 用途、组成 | 各条目的“用途”“字段来源”；附录A或实践章的管理产品框 | 案例字段、章节是否落实，是否缺项 |',
    '| 角色责任 | 附录B、实践章职责表、流程活动RACI | 姓名与角色的对应、责任边界 |',
    '| 生命周期与操作 | 附录A的“使用”表，流程章的活动、输入和输出 | 何时创建、审查、更新、批准、报告和移交 |',
    '| 案例解读 | 对照以上依据进行判断 | 解释是否与所选记录、材料和处理历程一致 |', '',
    '建议同一条目按“理论组成 → 案例产品本身 → 责任矩阵 → 流程使用 → 教材核对”阅读，再切换下一条。', '',
    '## 2. 先分清教材与案例', '',
    '- 教材原文：定义、用途、标为原文的组成，以及有明确表号的流程活动RACI。',
    '- 项目归纳：将产品关联到流程、整理五列操作步骤、归纳生命周期。可以核对依据，但教材中不一定有同样排版的一张表。',
    '- 非教材内容：产品操作RACI拟案、具体人物分工、装修金额工期、记录编号、单条处理历程和案例解读。它们用于练习教材，不是教材原有装修案例。',
    '- 待确认：批准、签认、排产、测量和复验等未决状态，不能按“网页已有内容”认定为工程事实已经完成。', '',
    '分类依据：第4章§4.3，' + pdf(72) + '；附录A导言，' + pdf(312) + '。正式产品为A1至A15，7项基准、7项报告、1项项目记录单。36入口包含父级、演进状态、计划类型及组成项，不是36项正式产品。', '',
    '### 三个容易对错位置的地方', '',
    '1. 商业论证：当前十项组成取自第5章§5.5，' + pdf(91) + '。附录A1从' + pdf(314, 315) + '阅读，其概括性内容未单列“参考资料”，还存在“投资评估／投资评价”的用词差异。核对当前十项时以第5章的对应来源为准。',
    '2. 问题登记单：附录A13的八项字段在' + pdf(331) + '；第10章管理产品框在' + pdf(206) + '另列“决策”。当前案例采用八字段，并在状态等相关内容中保留处置决定，不能仅因没有独立“决策”列就判定未记录决策。',
    '3. RACI：教材的表13.2至19.2描述流程活动职责；网页关联该产品的活动是项目归纳。标为“非教材内容”的细分操作矩阵，需要判断拟案是否合理，不能拿教材中不存在的同名产品操作表逐格对照。', '',
    '## 3. 建议复习与验收顺序', '',
    '| 顺序 | 学习组 | 对照问题 |', '|---|---|---|',
    '| 1 | 人员、组织、角色 | 业主、设计师等现实身份与PRINCE2角色有何区别，谁有权批准 |',
    '| 2 | 概要商业论证、项目概述文件、项目产品描述 | 为什么做、交付什么、是否值得投入启动阶段 |',
    '| 3 | 完整商业论证、项目计划、PID与管理方法 | 可行性、控制规则、授权和基准是否成立 |',
    '| 4 | 产品描述、工作包描述、小组计划 | 如何把住宅拆成交付产品，并形成可执行工作约定 |',
    '| 5 | 质量、问题、风险、产品登记单 | 防水未通过后，记录、返工、复验和风险如何关联 |',
    '| 6 | 检查点、要点、阶段与例外报告、阶段及例外计划 | 谁向谁报告，何时升级，何时重规划和授权 |',
    '| 7 | 经验记录、经验报告、项目竣工报告、收益管理方法 | 行动是否落实，哪些责任在项目结束后仍保留 |', '',
    '<a id="product-index"></a>', '', '## 4. 36个入口速查', '', '点击名称进入本指引的详细对照，点击理论／案例打开站点。');
for (const [heading, group] of groups) {
    add('', '### ' + heading, '', '| 编号与条目 | 理论／案例 | 主要字段位置 |', '|---|---|---|');
    for (const slug of group) {
        const entry = entries[slug], [first, last] = metadata[slug];
        add(`| ${entry.code} ${link(entry.name, '#entry-' + slug)} | ${link('理论', pageLink(slug, 'theory'))} · ${link('案例', pageLink(slug, 'case'))} | ${pdf(first, last)} |`);
    }
}
add('', '## 5. 每个条目的详细对照', '', '“字段数”是当前页面的一级组成数量，不等于产品总数、记录条数或教材规定的不可剪裁章节数。父级条目主要用于导航。');
for (const slug of slugs) {
    const entry = entries[slug], [first, last, location, focus] = metadata[slug];
    const definitionPage = findDefinitionPage(entry);
    const general = context.window.PRINCE2ProductRaci;
    let activities = (general.mappings[slug] || []).map(id => general.activities[id]);
    if (slug === 'project-plan') activities = context.window.PRINCE2ProjectPlanUsage.activities;
    if (['outline-business-case', 'full-business-case'].includes(slug)) activities = context.window.PRINCE2BusinessCaseUsage.activities[slug];
    assert.ok(activities && activities.length, slug + ': 教材活动映射缺失');
    const flows = [...new Set(activities.map(activity => activity.flow))];
    const references = flows.map(flow => `${flow}：表${processSources[flow].table}`);
    add('', `<a id="entry-${slug}"></a>`, '', `### ${entry.code} ${entry.name}`, '',
        `${link('理论页面', pageLink(slug, 'theory'))} · ${link('案例页面', pageLink(slug, 'case'))} · 当前${entry.composition.items.length}项一级组成`, '',
        `- 定义：${sourceLink({ label: '定义原文', href: entry.definition.sourceHref })}；${pdf(definitionPage)}。`,
        `- 用途与字段：${sourceLink({ label: '用途原文', href: entry.purpose.sourceHref })}；${sources(entry.composition.evidence)}。主要位置：${location}；${pdf(first, last)}。`,
        `- 职责依据：${sources(entry.roles.evidence)}；另对照下文附录B人物表。关联活动RACI：${references.join('；')}，可在第6节按表号打开。`,
        `- 对照的流程活动：${activities.map(activity => activity.flow + ' ' + activity.label).join('；')}。这些是所选关联活动，不是产品全部操作的官方清单。`,
        `- 生命周期依据：${sources(entry.lifecycle.evidence)}。案例的处理时点和五列使用步骤属于项目化呈现。`,
        `- 人工重点：${focus}`, '', link('返回36入口速查', '#product-index'));
}
add('', '## 6. 七个流程与教材RACI在哪里', '',
    '每个流程先看目的和情境，再看活动及输入输出图，最后核对职责表。图中的位置、箭头及上下级关系也是含义的一部分，不能只按平铺节点阅读。', '',
    '| 流程 | 教材章节起点 | 活动RACI原表 | 案例核对重点 |', '|---|---|---|---|');
const processNames = { SU: '项目准备', DP: '项目指导', IP: '项目启动', CS: '阶段控制', MP: '产品交付管理', SB: '阶段边界管理', CP: '项目收尾' };
const processStart = { SU: 246, DP: 256, IP: 266, CS: 278, MP: 288, SB: 296, CP: 304 };
const processFocus = { SU: '概要论证、项目概述、项目产品描述、启动阶段计划', DP: '启动、项目、阶段／例外及收尾的授权，不混同授权层级', IP: '完整论证、项目计划、管理方法、PID及项目授权请求', CS: '工作包状态、问题风险、纠正、要点与例外上报', MP: '工作包接受、执行、评价、完成通知及质量记录', SB: '更新项目计划和商业论证、下一阶段或例外计划、阶段评价', CP: '接受、实际绩效、经验教训、后续行动和收尾请求' };
for (const [flow, source] of Object.entries(processSources)) {
    add(`| ${flow} ${processNames[flow]} | ${sourceLink({ label: '第' + Number(source.chapter.slice(2)) + '章', href: '../chapters/' + source.chapter + '.html' })}；${pdf(processStart[flow])} | ${sourceLink({ label: '表' + source.table, href: '../chapters/' + source.chapter + '.html#' + source.anchor })}；${pdf(source.pdfPage)} | ${processFocus[flow]} |`);
}
add('', 'R=执行，A=问责，C=咨询，I=知情。保留教材的组合字母、空白及脚注；A不自动等于该产品每次细分操作的批准人。', '',
    '### 实践章节与职责表的复习入口', '', '| 章节 | 对照范围 | 章节起点／职责表所在页 |', '|---|---|---|');
for (const [number, name, start, responsibilities] of [[3, '人员', 52, null], [5, '商业论证', 78, 94], [6, '组织', 98, 119], [7, '计划', 124, 148], [8, '质量', 152, 169], [9, '风险', 172, 189], [10, '问题', 192, 207], [11, '进展', 212, 235]]) {
    add(`| ${sourceLink({ label: '第' + number + '章 ' + name, href: '../chapters/ch' + String(number).padStart(2, '0') + '.html' })} | ${number === 3 ? '领导变更、团队与沟通，含变更和沟通管理方法' : '目的、技术、支持管理产品和关键职责'} | ${pdf(start)}${responsibilities ? '；职责：' + pdf(responsibilities) : ''} |`);
}
add('', '## 7. 人物与附录B角色描述', '',
    `${sourceLink({ label: '附录B角色描述网页', href: '../chapters/appendix_b.html' })}；${pdf(338, 344)}。人物是本项目教学映射，不是教材人物。`, '',
    '| 案例人物／现实身份 | PRINCE2角色 | 教材定位 | 核对边界 |', '|---|---|---|---|');
for (const [person, role, number, focus] of [
    ['周诚／业主', '项目总监', 339, '对项目成功和持续业务理由问责，不等于项目经理'],
    ['林悦／业主', '高级用户', 343, '用户需求、适用性及收益，可能有项目后的承诺'],
    ['陆明远／装修公司负责人', '高级供应商', 342, '供应资源、产品质量和技术完整性'],
    ['陈默／受托项目经理', '项目经理', 340, '日常管理与容许偏差内权限，不取代委员会'],
    ['宋妍／设计师；赵建国／施工包工头', '小组经理', 344, '各自工作包，不把两个专业小组当作同一岗位'],
    ['王志衡／第三方监理', '项目保证', 338, '独立核查和建议，不代替管理决策或直接施工'],
    ['许静／资料协调员', '项目支持', 341, '维护记录和版本，不因保管文件而自动拥有批准权']
]) add(`| ${person} | ${role} | ${pdf(number)} | ${focus} |`);
add('', '项目管理委员会由本案例的项目总监、高级用户和高级供应商组成，对照第6章。业务层授权主体仍待确认。风险负责人和风险行动负责人属于风险条目职责，另看第9章，不因为某人负责防水返工就自动认定他已受任为该条风险负责人。', '',
    '## 8. 三条可直接照着走的练习路径', '',
    '### 练习A：经验教训记录如何变成实际管理', '',
    '1. 打开' + link('经验教训案例', pageLink('lessons-log', 'case')) + '，依次选择LES-001、002、003。',
    '2. 对照附录A13八字段，' + pdf(331) + '。确认负责人是采取行动的人，状态和日期是否支持所写的进展。',
    '3. 看该条处理历程及案例解读，再对照A13使用表，' + pdf(333) + '，以及表13.2、18.2、19.2。',
    '4. 打开' + link('经验教训报告案例', pageLink('lessons-report', 'case')) + '，对照A8，' + pdf(323) + '。判断是否有分析、推荐、分享和行动，而不只是记录复制。',
    '5. 教材说明一般职责和使用要求；三条具体历史和效果待核验状态属于本案例。', '',
    '### 练习B：防水未通过后的四类产品', '',
    '1. ' + link('防水产品描述', pageLink('product-description', 'case')) + '：标准、方法和验收条件是什么，A10，' + pdf(326, 327) + '。',
    '2. ' + link('质量登记单', pageLink('quality-register', 'case')) + '：QA-WPF-01结果及QA-WPF-02安排，第8章，' + pdf(168) + '；' + link('质量证据包', base + 'cases/waterproof-quality-records.html') + '用于核对证据，不是新增正式管理产品。',
    '3. ' + link('问题登记单', pageLink('issue-register', 'case')) + '与' + link('问题报告', pageLink('issue-report', 'case')) + '：记录状态、影响分析、决定和关闭条件，附录A13与A7，' + pdf(331) + '、' + pdf(322) + '。',
    '4. ' + link('风险登记单', pageLink('risk-register', 'case')) + '选RISK-007：检查未来不确定性、风险复评及负责人，而不把已发生的质量失败继续仅作为风险。第9章与A13，' + pdf(172) + '、' + pdf(332) + '。',
    '5. 核对当前链条：首次未通过、局部返工、复验待补、问题未关闭。不得从某份历史记录推定整套住宅已接受。', '',
    '### 练习C：计划、报告与例外授权', '',
    '1. 打开' + link('项目计划案例', pageLink('project-plan', 'case')) + '，对照A9十项，' + pdf(324, 325) + '；计划类型定义在' + pdf(127, 128) + '。',
    '2. 用' + link('检查点报告', pageLink('checkpoint-report', 'case')) + '看工作包，用' + link('要点报告', pageLink('highlight-report', 'case')) + '看项目经理向委员会提供的阶段状态。',
    '3. 对照图11.2，' + pdf(214) + '，辨别工作包、阶段、项目三层容许偏差和不同上报对象。',
    '4. 再看' + link('例外报告', pageLink('exception-report', 'case')) + '、' + link('例外计划', pageLink('exception-plan', 'case')) + '及表14.2、18.2：预测超差、决策、要求重规划和授权后的新基准不能混为一步。',
    '5. 最后用' + link('阶段竣工报告', pageLink('end-stage-report', 'case')) + '及' + link('阶段计划', pageLink('stage-plan', 'case')) + '核对“完成本阶段”和“允许开展下一阶段”是否区分。', '',
    '## 9. 人工核对记录', '',
    '以下表格可直接复制填写，原文问题和案例问题分开记。', '',
    '| 条目／记录 | 教材章节、PDF页／印刷页 | 核对对象 | 结论 | 具体差异或下一步 |',
    '|---|---|---|---|---|',
    '| 例如：经验教训／LES-001 | 附录A13，PDF331／印刷310 | 八字段、负责人、状态、历程 | 待核对 | |',
    '| | | | | |',
    '| | | | | |', '',
    '- [ ] 定义和用途与所指来源一致，未把项目归纳写成原文。',
    '- [ ] 案例产品本身可阅读，组成项不是只有字段解释。',
    '- [ ] 人物、现实身份、项目角色与记录责任一致。',
    '- [ ] 教材活动RACI保留表号与脚注；非教材操作拟案明确标注。',
    '- [ ] 创建、审查、更新、批准、上报和交接符合流程与权限。',
    '- [ ] 历史、当前状态、后续计划及待确认事项区分清楚。',
    '- [ ] 切换模式、选择记录、材料定位、原文返回、窄屏和实际打印分别检查。', '',
    '结论建议使用“通过／待确认／需修正／暂不适用”。内容正确与界面好用分开判断，已制作不等于已批准、已验收或已上线。', '',
    '## 10. 定位核验范围', '',
    '本指引读取现行36条目数据、原文锚点及本地第七版逐页语料，核对教材文件身份和所引用页码。页面来源链接已核验本地文件与锚点存在；这不代替对全书全部文字和案例拟案的人工判断。七个流程的活动RACI此前已有专项逐列核验，其记录见' + link('RACI专项复核', 'workspace-raci-review.md') + '。', '',
    '网页定位失败时，可在教材PDF中搜索产品名称、章节号或表号。不要用`pn-9`等网页锚点当作教材的第9节；这些是站点内部定位编号。', '');
const content = lines.join('\n');
assert.ok(!content.includes('\uFFFD'));
assert.ok(!content.includes('\u2014'));
if (process.argv.includes('--check')) {
    assert.equal(read(target).trimEnd(), content.trimEnd(), '学习指引与当前站点映射不一致');
    console.log(JSON.stringify({ entries: slugs.length, modes: slugs.length * 2, sourceAnchors: checkedLinks.size, lines: lines.length, status: 'PASS' }));
} else {
    const exists = fs.existsSync(path.join(root, target));
    const patch = exists ? '*** Update File: ' + path.join(root, target) + '\n@@\n' + read(target).trimEnd().split('\n').map(line => '-' + line).join('\n') + '\n' + content.trimEnd().split('\n').map(line => '+' + line).join('\n')
        : '*** Add File: ' + path.join(root, target) + '\n' + content.split('\n').map(line => '+' + line).join('\n');
    console.log(JSON.stringify({ patch: '*** Begin Patch\n' + patch + '\n*** End Patch', entries: slugs.length, sourceAnchors: checkedLinks.size }));
}
