(function () {
    "use strict";
    var data = window.PRINCE2RemainingProducts, entries = data.entries, papers = data.papers;
    ["outline-business-case", "full-business-case"].forEach(function (slug) {
        entries[slug].composition.items = data.source["business-case"].fields.map(function (field) {
            return { label: field[0], text: field[1], provenance: "manual-verbatim" };
        });
        entries[slug].composition.provenance = "manual-verbatim";
    });
    function sourceFile(page, chapter) {
        return page >= 346 ? "glossary" : page === 127 || page === 128 ? "ch07" : page === 329 || page === 330 ? "appendix_a" : chapter;
    }
    function evidence(spec, type) {
        return { label: "第七版 · " + (type === "definition" ? "定义依据" : "内容与使用"),
            href: "../chapters/" + (type === "definition" ? sourceFile(spec.definitionPage, spec.chapter) : spec.chapter) + ".html#source-remaining-" + spec.slug + "-" + type };
    }
    function role(key, actions, description, caseDescription) {
        return { key: key, actions: actions.split("、"), description: description, caseDescription: caseDescription || description };
    }
    function rolesFor(spec) {
        if (spec.slug === "team-plan") { return [
            role("team", "编制、审查、更新", "组织和控制工作包小组工作，发现工作包超差预测时通知项目经理。", "赵建国安排返工、自检与复验配合，工作包条件待协定。"),
            role("pm", "批准、检查", "在阶段控制中批准和检查小组计划，协调阶段接口。", "陈默核对防水小组安排及后续施工接口；小组计划批准待确认。"),
            role("support", "协助、留存", "协助计划和记录维护，批准由项目经理负责。")
        ]; }
        if (spec.code === "A2") { return [
            role("team", "创建、报告", "按工作包协定频率报告工作包实际进展、质量、问题风险和预测。", "赵建国编制防水检查点报告，报送和频率待确认。"),
            role("pm", "审查、控制", "审查检查点报告，核对工作包与阶段状态，决定权限内纠正或上报。", "陈默核对返工、复验及后续交接；防水接受状态为待确认。"),
            role("support", "协助、关联", "协助编制、保存报告并关联记录。")
        ]; }
        if (/^A[2-8]$/.test(spec.code)) { return [
            role("pm", "编制、评估、报告", "核对事实、预测和基线，编制报告并按职权提交建议。", "陈默汇编现有记录，缺少的实际金额、完成或签认数据分别待补。"),
            role("board", "审查、响应", spec.code === "A5" || spec.code === "A7" ? "按授权处理上报事项，必要时上报业务。" : "审查报告中的状态、预测、建议和继续开展条件。", "周诚、林悦、陆明远分别审查业务、用户及供应影响；新报告审查决定待确认。"),
            role("assurance", "建议、核查", "按产品使用要求提供建议或确认依据，独立核查不代替管理决定。", "王志衡核查质量及报告依据；拟稿核查意见待补。"),
            role("support", "协助、留存", "协助报告编制与分发，维护关联及版本。")
        ]; }
        if (spec.code === "A12" && spec.slug.endsWith("management-approach")) { return [
            role("pm", "制定、落实、更新", "咨询相关人员，编制方法、安排实施并在阶段边界复查。", "陈默协调" + spec.name + "，将拟定安排落实到计划和工作包；实施情况分别核验。"),
            role("executive", "批准、监督", "批准方法并确保其适合项目目标及业务要求。", "周诚审查并拟批准方法；批准凭据待补。"),
            role("user", "协定、反馈", "协定用户相关安排，提供需求及执行反馈。", "林悦协调三代家庭需求及接受、使用反馈；协定记录待补。"),
            role("supplier", "协定、落实", "协定供应方安排，落实技术、资源和工作接口。", "陆明远确认供应方资源、数据及交付条件；承诺待确认。"),
            role("assurance", "建议、核查", "核查方法与业务要求及实施情况，提出独立建议。"),
            role("support", "协助、维护", "维护有效版本与实施记录，按授权分发。"),
            role("team", "实施、反馈", "在工作包范围实施协定的管理安排并报告情况。")
        ]; }
        if (spec.code === "A13") { return [
            role("pm", "建立、审查、更新", "建立和维护记录，判断正式管理及升级条件。", "陈默核对待办、正式记录及相互关联，保持实际、计划和历史分开。"),
            role("support", "协助、关联", "协助项目经理维护记录、版本和资料链接。", "许静维护六类记录索引；日志的拟定条目和日期分别待确认。"),
            role("team", "记录、反馈", "维护工作包相关信息，并向项目管理反馈事件和行动。", "赵建国反馈交付、检查、问题和预测；非正式事项需要正式管理时建立对应记录。")
        ]; }
        return [role("pm", "编制、审查、更新", "汇编管理基础，检查实际与剩余预测，按职权请求授权。"),
            role("board", "批准、审查", "在业务授权范围内批准项目、阶段或例外计划及其重要变更。", "周诚、林悦、陆明远审查目标、需求与供应能力；当前拟稿授权待确认。"),
            role("assurance", "建议、核查", "提供独立保证意见，核查计划及管理基础是否可行。"),
            role("support", "协助、留存", "维护受控文件、版本及引用，保留历史基线。")];
    }
    // 使用环节保存流程、材料和具体动作，同一场景在理论与案例之间对应。
    function phase(name, code, actor, theory, example, result, recipient, products, fields) {
        return { name: name, code: code, actor: actor, theory: theory, example: example,
            result: result, recipient: recipient, products: products || [], fields: fields || [1] };
    }
    function phasesFor(spec) {
        var paper = papers[spec.slug];
        if (spec.slug === "business-case") { return [
            phase("准备概要论证", "SU", 0, "根据项目任务书和可得信息准备概要商业论证，判断项目是否值得启动。", "陈默汇集三代家庭需求和装修选项，周诚审查概要论证；正式签认凭据待补。", "概要商业论证", "项目总监／委员会", ["outline-business-case", "project-brief"], [1, 2, 3]),
            phase("完善完整论证", "IP", 0, "细化选项、收益、负收益、成本、投资评价及风险，支持项目授权。", "陈默对照42万元预算、16周目标及风险记录完善完整论证；实际费用和收益基线待测量。", "完整商业论证及收益安排", "项目总监／委员会", ["full-business-case", "benefits-management-approach"], [4, 7, 8, 9]),
            phase("核查持续业务理由", "SB", 1, "对照当前实际与剩余预测复查商业论证，支持下一阶段授权。", "第8周拟复查成本、工期、复验及排产影响；持续可行性与下一阶段授权待确认。", "更新论证及继续开展决定", "项目经理", ["stage-plan", "end-stage-report"], [6, 7, 8, 9]),
            phase("核对收益与后续责任", "CP", 0, "核对项目绩效和收益预测，确认项目后测量及责任安排。", "第16周拟核对住宅接受和资料移交；入住后收益由林悦协调家庭复查，指标、日期及接收确认待协定。", "绩效核对及项目后收益安排", "业务／收益责任人员", ["end-project-report", "benefits-management-approach"], [4, 8])
        ]; }
        if (spec.code === "A8") { return [
            phase("整理与分析经验", "SB", 0, "结合经验记录、项目绩效与团队反馈，分析影响和原因，提出改进建议。", "陈默汇集LES-001检查留照、LES-002点位样板、LES-003排产预警；原因、采用及效果待核验。", "经验教训报告及推荐", "经验使用者／行动负责人", ["lessons-log", "quality-register", "risk-register"], [1, 2, 3]),
            phase("沟通与后续采用", "CP", 0, "在阶段或项目结束时分享适用经验，明确采用行动和后续核验。", "陈默拟向施工、设计及供应团队分享建议；赵建国、宋妍、陆明远分别落实，采用记录及效果待核验。", "分享记录及后续行动", "相关团队／业务", ["work-package-description", "end-project-report"], [2, 3])
        ]; }
        if (spec.code === "A7") { return [
            phase("评估问题及选项", "CS", 0, "记录问题，评估对基线和目标的影响，分析选项并提出推荐。", "陈默核对ISS-WPF-001及首次闭水失败，评估工期、费用与质量；局部返工方案已获接受，复验及关闭待确认。", "问题报告及推荐", "项目经理／相应职权", ["issue-register", "quality-register"], [6, 7, 8, 9]),
            phase("决定与反馈", "CS", 0, "权限内决定处置，超权事项交相应职权；记录决定并核查实施与关闭条件。", "陈默维持停止交接；赵建国返工完成，王志衡复验待执行，接受及问题关闭待决定。", "处置决定及实施记录", "交付小组／问题登记单", ["issue-register", "product-description"], [10])
        ]; }
        if (spec.code === "A2") { return [
            phase("报告工作包", "MP", 0, "按协定周期收集实际交付、质量和预测，报告未完成行动及问题风险。", "赵建国报告第7周WPF-011返工完成、v1.1待复验和停止交接；本报告报送待确认。", "工作包状态与预测", "项目经理", ["work-package-description", "quality-register"], [2, 4, 6, 7]),
            phase("审查与控制", "CS", 1, "对照阶段及工作包计划评估状态，安排纠正或升级。", "陈默核对QA-WPF-02及ISS-WPF-001，补齐工期、费用与容许偏差评估后决定。", "纠正安排或上报输入", "交付小组／委员会", ["team-plan", "issue-register"], [3, 5, 6])
        ]; }
        if (/^A[3-8]$/.test(spec.code)) {
            var code = spec.code === "A3" ? "CP" : spec.code === "A4" || spec.code === "A8" ? "SB" : "CS";
            return [phase("编制与核查", code, 0, "汇集本报告的记录与基线，区分实际、预测和待确认项，形成建议。", "陈默按“" + paper.period + "”汇集资料；" + paper.status + "。", "报告及核查依据", "项目保证／委员会", paper.links.slice(0, 3), [1, Math.min(2, spec.fields.length)]),
                phase("审查与交接", "DP", 1, "按授权审查结论和选项，记录继续开展、纠正、重新规划或收尾决定。", "周诚、林悦、陆明远拟审查报告和相应请求；审查决定待确认。", "审查意见及后续安排", "项目经理／相关接收方", paper.links.slice(-2), [spec.fields.length])];
        }
        if (spec.slug === "team-plan") { return [
            phase("编制与协定", "MP", 0, "按获授权工作包编制可选小组计划，协定资源、顺序与报告。", "赵建国安排防水返工、自检和复验；陈默核对工作包约束，费用、时限和批准待确认。", "小组计划及协定条件", "项目经理", ["work-package-description"], [1, 5, 6, 9]),
            phase("检查与更新", "CS", 1, "检查小组进度，工作包超差预测交项目经理处理。", "陈默核对返工后v1.1及待复验资料；赵建国提供实际与剩余预测。", "进展、纠正安排及最新计划", "小组经理", ["checkpoint-report", "quality-register"], [8, 10])]; }
        if (spec.slug === "exception-plan") { return [
            phase("指导后重新规划", "SB", 0, "收到委员会指导后准备例外计划，明确替代范围和目标。", "超差及编制指示未确认；陈默先评估复验、排产及关键路径，替代安排为预案。", "例外计划及影响评估", "委员会", ["exception-report", "project-plan"], [1, 7, 8, 9]),
            phase("授权替代基线", "DP", 1, "批准后以例外计划取代受影响计划，保留被替代基线。", "委员会批准待确认；现有项目边界仍为42万元、16周。", "批准版本及替代范围", "项目经理／交付小组", ["stage-plan"], [9, 10])]; }
        if (spec.slug === "stage-plan" || spec.slug === "plan") { return [
            phase("编制下一阶段", "SB", 0, "利用当前实际与剩余预测，细化下一阶段产品、工作、资源及容许偏差。", "陈默于第7周编制MGT-004 v0.1，第9至16周安排待资源及排产确认。", "阶段拟稿及更新项目预测", "委员会", ["project-plan", "end-stage-report"], [5, 7, 8]),
            phase("审查授权", "DP", 1, "根据阶段报告、持续业务理由和下一阶段计划决定继续开展。", "第8周拟审查；防水接受、成本预测及资源承诺待补，第二阶段未授权。", "授权决定及阶段基线", "项目经理", ["full-business-case"], [9, 10]),
            phase("阶段内控制", "CS", 0, "以获批阶段计划管理工作包和预测，在权限内纠正，预测超差上报。", "第二阶段待授权；获批后由陈默核对检查点、质量和产品记录，更新实际与剩余预测。", "工作包安排、状态及预测", "交付小组／委员会", ["checkpoint-report", "highlight-report"], [6, 8, 10])]; }
        if (spec.code === "A13") { return [
            phase("记录与关联", "SU", 0, "记录非正式事项，正式管理时转入对应登记单并保留关联。", "陈默整理作业、资料及审查待办；日期待确认，正式防水问题仍在ISS-WPF-001。", "初始记录及关联", "项目支持／相应负责人", ["daily-log", "issue-register"], [1]),
            phase("持续审查", "CS", 0, "核对状态、行动及历史，更新记录而不覆盖已发生的结果。", "陈默、许静核对首次质量失败、待复验和风险复评；新拟稿批准状态分别待确认。", "当前记录及未完成行动", "阶段报告／相关负责人", ["quality-register", "risk-register"], [Math.min(2, spec.fields.length)]),
            phase("收尾与移交", "CP", 0, "核对开放事项及接收责任，汇集报告输入并按条件归档关闭。", "项目当前第7周；最终接受、剩余事项接收、归档及关闭均待开展。", "最终记录及后续责任", "业务／资料接收方", ["end-project-report", "lessons-report"], [1])]; }
        if (spec.code === "A12" && spec.slug.endsWith("management-approach")) { return [
            phase("制定与协定", "IP", 0, "咨询业务、用户、供应方和保证，制定程序、标准、资源及职责。", "陈默依据住宅项目形成" + spec.name + "拟稿，林悦及陆明远协定需求与资源，周诚批准待确认。", "协定方法及批准请求", "项目总监", paper.links.slice(0, 2), [1, Math.min(2, spec.fields.length)]),
            phase("落实与反馈", "CS", 0, "将有效方法落实到计划和工作包，检查程序实施与相关证据。", "陈默拟核对“" + paper.period + "”中的安排；小组反馈实际记录，资源和实施效果待核验。", "实施记录及控制信息", "项目支持／相关负责人", paper.links.slice(0, 2), [Math.min(3, spec.fields.length)]),
            phase("审查与移交", "SB", 0, "阶段边界复查适用性，受控更新；收尾明确仍需执行的项目后责任。", "第8周拟复查方法和未完成条件；项目后收益、保修及资料责任在第16周拟移交，接收确认待补。", "受控更新及后续安排", "相关批准／接收人员", ["project-initiation-documentation", "end-project-report"], [spec.fields.length])]; }
        return [phase("汇编管理基础", "IP", 0, "汇编逻辑相关的文件，核对版本、职责和各组件授权状态。", "陈默整理住宅管理文件；台账MGT-002历史v1.0授权与当前新组件拟稿分别列示。", "受控文件集合及授权请求", "委员会", paper.links.slice(0, 3), [1, 2]),
            phase("审查与使用", "DP", 1, "审查业务理由、可行计划及管理安排，在职权内批准并保留授权版本。", "委员会核对新组件；当前整理稿不代替5月20日历史授权凭据，组件批准分别待确认。", "授权版本与管理基准", "项目经理及交付小组", ["project-plan", "full-business-case"], [Math.min(3, spec.fields.length)]),
            phase("复查与移交", "SB", 0, "审查组件时效性，变更受控，收尾对照授权版本核验实际绩效。", "陈默拟在阶段边界复查，在收尾核对实际与基线并移交后续责任；记录待补。", "有效版本及后续责任", "委员会／接收方", ["end-stage-report", "end-project-report"], [spec.fields.length])];
    }
    function caseOutput(spec, phase, index) {
        if (spec.slug === "business-case") return ["概要商业论证，签认待补", "完整商业论证拟稿", "更新论证及下一阶段决定，待确认", "项目绩效及后续收益安排，待核验"][index];
        if (spec.code === "A7") return index === 0 ? "ISS-WPF-001处置报告整理稿" : "局部返工完成，复验及关闭待决定";
        if (/^A[2-8]$/.test(spec.code)) return index === 0 ? spec.name + "，" + papers[spec.slug].status : spec.code === "A8" ? "分享及采用记录，待核验" : "审查意见及后续决定，待确认";
        if (spec.slug === "team-plan") return index === 0 ? "防水小组计划拟稿，条件待协定" : "WPF-011 v1.1待复验，剩余预测待补";
        if (spec.slug === "exception-plan") return index === 0 ? "影响评估及替代计划预案" : "批准版本及替代范围，待决定";
        if (spec.slug === "stage-plan" || spec.slug === "plan") return ["MGT-004 v0.1及更新预测，编制中", "下一阶段授权，待决定", "工作包及实际预测，阶段获批后执行"][index];
        if (spec.code === "A13") return ["管理待办及正式记录关联", "质量、问题及风险的当前记录", "最终记录与后续责任，待收尾核对"][index];
        if (spec.code === "A12" && spec.slug.endsWith("management-approach")) return [spec.name + "拟稿，批准待确认", "实施记录及效果，待核验", "受控更新及接收确认，待补"][index];
        return ["受控文件集合整理稿", "组件授权版本，批准分别待确认", "有效版本及后续责任，待核对"][index];
    }
    Object.values(data.source).forEach(function (spec) {
        var paper = papers[spec.slug], roleData = rolesFor(spec), phases = phasesFor(spec), contentSource = evidence(spec, "purpose"), definitionSource = evidence(spec, "definition");
        function roleItems(mode) { return roleData.map(function (item) {
            var person = data.people[item.key];
            return { name: mode === "case" ? person[1] : person[0], relation: person[0], actions: item.actions,
                description: mode === "case" ? item.caseDescription : item.description };
        }); }
        var composition = { title: "组成内容", kicker: spec.code + " · 手册原文", note: "", provenance: "manual-verbatim", evidence: [contentSource],
            items: spec.fields.map(function (field) { return { label: field[0], text: field[1], provenance: "manual-verbatim" }; }) };
        var lifecycle = { title: "流程中的使用", kicker: "流程与材料", note: "", provenance: "project-synthesis", evidence: [contentSource],
            items: phases.map(function (phase, index) { return { processCode: phase.code, anchor: phase.code + "-" + index, action: phase.name, description: phase.theory, evidence: [contentSource] }; }) };
        var formal = ["business-case", "plan", "project-initiation-documentation", "project-log"].includes(spec.slug) || /^A[2-8]$/.test(spec.code);
        var parentNames = { A9: "计划", A12: "项目启动文件", A13: "项目记录单" };
        entries[spec.slug] = { slug: spec.slug, name: spec.name, englishName: "", code: spec.code,
            kind: formal ? (spec.code === "A13" ? "record" : /^A[2-8]$/.test(spec.code) ? "report" : "baseline") : "component",
            identity: { type: formal ? "formal-management-product" : "component", label: formal ? "正式管理产品" : "组成项／计划类型", isFormalManagementProduct: formal, provenance: "manual-verbatim" },
            parent: formal ? null : { code: spec.code, name: parentNames[spec.code], href: "product-detail-v2.html?entry=" + (spec.code === "A9" ? "plan" : spec.code === "A12" ? "project-initiation-documentation" : "project-log") + "&mode=theory" },
            summary: { text: "", provenance: "project-synthesis" }, legacyHref: "product.html#entity-" + spec.name,
            definition: { label: "定义", text: spec.definition, sourceHref: definitionSource.href, provenance: "manual-verbatim" },
            purpose: { label: "用途", text: spec.purpose, sourceHref: contentSource.href, provenance: "manual-verbatim" },
            sourceNote: spec.slug === "lessons-report" ? "定义栏引用目的首句；用途与组成：第七版原文。职责与流程应用：项目归纳。" : "定义栏引用术语或产品说明；用途与组成：第七版原文。职责与流程应用：项目归纳。",
            composition: composition,
            roles: { title: "责任分工", kicker: "角色 × 职责", note: "", provenance: "project-synthesis", evidence: [contentSource, { label: "角色职责", href: "../chapters/appendix_b.html" }], items: roleItems("theory") },
            lifecycle: lifecycle,
            caseEntry: { href: "product-detail-v2.html?entry=" + paper.links[0] + "&mode=case", relatedLabel: entries[paper.links[0]] && entries[paper.links[0]].name || data.source[paper.links[0]].name, relatedKind: "关联产品：" },
            caseView: { identity: { label: "住宅装修教学案例", provenance: "fictional-case" }, summary: { text: "", provenance: "fictional-case" },
                definition: { label: "文件范围", text: paper.period, provenance: "fictional-case" }, purpose: { label: "当前状态", text: paper.status, provenance: "fictional-case" }, sourceNote: "教学虚构案例",
                composition: Object.assign({}, composition, { kicker: "产品文件", provenance: "fictional-case", items: spec.fields.map(function (field, index) {
                    var chapter = paper.chapters[index]; return { label: field[0], text: chapter.text || chapter.rows.map(function (row) { return row.join(" · "); }).join("；"), provenance: "fictional-case" };
                }) }),
                roles: { title: "责任分工", kicker: "人物 × 职责", note: "", provenance: "fictional-case", evidence: [{ label: "人物与组织", href: "../cases/renovation.html#people-title" }], items: roleItems("case") },
                lifecycle: Object.assign({}, lifecycle, { provenance: "fictional-case", items: phases.map(function (phase, index) { return { processCode: phase.code, anchor: phase.code + "-" + index, action: phase.name, description: phase.example }; }) }) }
        };
        // 复用已确认的五列模板，不把归纳分工冒充教材RACI。
        window.PRINCE2ProductManagementUsage.configurations[spec.slug] = phases.map(function (phase, index) {
            return { name: phase.name, state: paper.status, steps: [{ actors: [phase.actor], fields: phase.fields, products: phase.products,
                theory: phase.theory, example: phase.example, result: phase.result, caseResult: caseOutput(spec, phase, index), recipient: phase.recipient }] };
        });
        window.PRINCE2ProductManagementUsage.caseRoleOrder[spec.slug] = roleData.map(function (_, index) { return index; });
    });
    window.PRINCE2_PRODUCT_DETAILS_V2 = Object.freeze({ version: "remaining-products-1", provenanceLabels: window.PRINCE2_PRODUCT_DETAILS_V2.provenanceLabels, entries: Object.freeze(entries) });

    function node(tag, text, className) { var element = document.createElement(tag); if (text != null) { element.textContent = text; } if (className) { element.className = className; } return element; }
    function buildPaper(root, slug) {
        var entry = entries[slug], paper = papers[slug], contents = node("nav", null, "business-contents remaining-contents");
        contents.setAttribute("aria-label", entry.name + "文档章节"); root.append(contents);
        if (paper.records) {
            var register = node("table", null, "business-table"), body = node("tbody");
            register.append(node("caption", "日志总表 · 3项待办"));
            paper.records.forEach(function (record) { var row = node("tr"), label = node("th", record.id); label.scope = "row";
                var detail = node("td"), link = node("a", record.title); link.href = "#daily-log-" + record.id; detail.append(link); row.append(label, detail, node("td", record.status)); body.append(row); });
            var registerWrap = node("div", null, "business-table-wrap");
            registerWrap.tabIndex = 0; registerWrap.setAttribute("role", "region"); registerWrap.setAttribute("aria-label", "日志总表，可横向滚动");
            register.append(body); registerWrap.append(register); root.append(registerWrap);
            paper.records.forEach(function (record) { var article = node("section", null, "business-chapter"); article.id = "daily-log-" + record.id;
                article.append(node("h2", record.id + " · " + record.title)); var fields = node("dl", null, "remaining-record-fields");
                [["记录单条目", record.description], ["日期", record.date]].forEach(function (field, index) { var pair = node("div"); if (record.id === "DL-001") { pair.id = "remaining-daily-log-chapter-" + (index + 1); pair.dataset.businessAnchor = "composition-" + field[0]; } pair.append(node("dt", field[0]), node("dd", field[1])); fields.append(pair); }); article.append(fields); root.append(article); });
        } else {
            paper.chapters.forEach(function (item, index) {
                var section = node("section", null, "business-chapter remaining-chapter"); section.id = "remaining-" + slug + "-chapter-" + (index + 1);
                section.dataset.businessAnchor = "composition-" + entry.composition.items[index].label;
                var title = node("h2", String(index + 1).padStart(2, "0") + " " + entry.composition.items[index].label);
                title.id = section.id + "-title"; section.setAttribute("aria-labelledby", title.id); section.append(title);
                var a = node("a", entry.composition.items[index].label); a.href = "#" + section.id; contents.append(a);
                if (item.text) { section.append(node("p", item.text)); }
                if (item.rows) {
                    var wrap = node("div", null, "business-table-wrap"), table = node("table", null, "business-table"), head = node("thead"), body = node("tbody"), heading = node("tr");
                    wrap.tabIndex = 0; wrap.setAttribute("role", "region"); wrap.setAttribute("aria-label", entry.composition.items[index].label + "，可横向滚动");
                    item.headings.forEach(function (label) { var cell = node("th", label); cell.scope = "col"; heading.append(cell); }); head.append(heading);
                    item.rows.forEach(function (values) { var row = node("tr"); values.forEach(function (value, position) { var cell = node(position === 0 ? "th" : "td", value); if (!position) { cell.scope = "row"; } row.append(cell); }); body.append(row); });
                    table.append(head, body); wrap.append(table); section.append(wrap);
                }
                root.append(section);
            });
        }
        var related = node("nav", null, "business-references remaining-references"); related.setAttribute("aria-label", "相关产品文件");
        paper.links.forEach(function (slug) { var a = node("a", entries[slug].name); a.href = "product-detail-v2.html?entry=" + slug + "&mode=case"; related.append(a); }); root.append(related);
    }
    Object.keys(papers).forEach(function (slug) {
        var entry = entries[slug], paper = papers[slug];
        window.PRINCE2RegisterDocuments[slug] = { title: "住宅装修 · " + entry.name, titleParts: ["住宅装修", " · " + entry.name], eyebrow: "REN-001 · " + entry.code,
            metadata: [["文件时点", paper.period], ["版本／状态", paper.status], ["编制／维护", slug === "checkpoint-report" || slug === "team-plan" ? "赵建国 · 小组经理，许静协助" : "陈默 · 项目经理，许静协助"], ["性质", "教学虚构案例"]],
            printLabel: "打印" + entry.name, documentLinkLabel: "产品文件", buildContent: function (root) { buildPaper(root, slug); } };
    });
}());
