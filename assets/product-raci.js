(function () {
    "use strict";

    var roles = [
        { key: "business", name: "业务层", person: "授权主体待确认", identity: "项目外部" },
        { key: "executive", name: "项目总监", person: "周诚", identity: "业主" },
        { key: "user", name: "高级用户", person: "林悦", identity: "业主" },
        { key: "supplier", name: "高级供应商", person: "陆明远", identity: "装修公司负责人" },
        { key: "pm", name: "项目经理", person: "陈默", identity: "受托项目经理" },
        { key: "team", name: "小组经理", person: "宋妍／赵建国", identity: "设计师／施工包工头" },
        { key: "assurance", name: "项目保证", person: "王志衡", identity: "第三方监理" },
        { key: "support", name: "项目支持", person: "许静", identity: "资料协调专员" }
    ];
    // 以下字母逐列核对原始第七版 PDF，空白与脚注均保留。
    // 产品与流程活动的关联另列为项目归纳，不将活动 RACI 称为产品全生命周期 RACI。
    var processSources = {
        SU: { chapter: "ch13", anchor: "s13-6", table: "13.2", pdfPage: 252 },
        DP: { chapter: "ch14", anchor: "pn-12", table: "14.2", pdfPage: 262 },
        IP: { chapter: "ch15", anchor: "pn-16", table: "15.2", pdfPage: 274 },
        CS: { chapter: "ch16", anchor: "pn-17", table: "16.2", pdfPage: 285 },
        MP: { chapter: "ch17", anchor: "pn-17.6", table: "17.2", pdfPage: 293 },
        SB: { chapter: "ch18", anchor: "pn-15", table: "18.2", pdfPage: 302 },
        CP: { chapter: "ch19", anchor: "pn-13", table: "19.2", pdfPage: 309 }
    };
    function activity(flow, label, values, footnote) {
        return { flow: flow, label: label, raci: values.split("|"), source: processSources[flow], footnote: footnote || "", provenance: "manual-verbatim" };
    }
    var activities = {
        "su-appoint": activity("SU", "任命项目总监和项目经理", "A/R¹|R||||||", "A/R¹：业务对项目总监和项目经理的任命问责，并负责任命项目总监。"),
        "su-lessons": activity("SU", "评估之前的经验教训", "C|A|||R|||"),
        "su-outline": activity("SU", "准备概要商业论证", "C|A/R|C³|C³|R|||", "C³：如果被任命／被任命时。"),
        "su-team": activity("SU", "任命项目管理团队", "A|R||||||"),
        "su-approach": activity("SU", "选择项目方法", "|A|C|C|R|C²|C|", "C²：小组经理如已被确定，应就项目方法向其咨询。"),
        "su-brief": activity("SU", "汇编项目概述文件", "|A|C|C|R||C|C"),
        "su-plan": activity("SU", "计划启动阶段", "|A|C|C|R|I²|C|C", "I²：已确定并参与启动阶段的小组经理应获知计划中的关键细节。"),
        "su-request": activity("SU", "请求项目启动", "|A|C|C|R|I²|C|I", "I²：已确定并参与启动阶段的小组经理应获知计划中的关键细节。"),
        "dp-init": activity("DP", "授权启动", "I|A/R||||||"),
        "dp-project": activity("DP", "授权项目", "I|A/R|C|C|I|I|C|I"),
        "dp-guidance": activity("DP", "给予持续指导", "C|A/R¹|R²|R³|C/I|I|C|I", "R¹：业务相关。R²：用户相关。R³：供应商相关。"),
        "dp-stage": activity("DP", "授权阶段或例外计划", "I|A/R|C|C|I|I|C|I"),
        "dp-close": activity("DP", "授权项目收尾", "I|A/R|C|C|I|I|C|I"),
        "ip-tailor": activity("IP", "协定剪裁要求", "|A|C|C|R|C|C|I"),
        "ip-methods": activity("IP", "协定管理方法", "|A|C|C|R|C|C|I"),
        "ip-controls": activity("IP", "建立项目控制", "|A|C|C|R|C|C|I"),
        "ip-plan": activity("IP", "准备项目计划", "|A|C|C|R|C|C|C"),
        "ip-case": activity("IP", "准备完整的商业论证", "|A|C|C|R|C|C|I"),
        "ip-pid": activity("IP", "汇编项目启动文件", "|C|C|C|A|C|C|R"),
        "ip-request": activity("IP", "请求项目授权", "I|A|C|C|R|I|C|I"),
        "cs-authorize": activity("CS", "授权工作包", "|A|||R|C|C|C"),
        "cs-work": activity("CS", "评价工作包状态", "|A|||R|C|C|C"),
        "cs-receive": activity("CS", "接收已完成的工作包", "||||A|R|C|I"),
        "cs-stage": activity("CS", "评价阶段状态", "|A|C|C|R|C|C|C"),
        "cs-capture": activity("CS", "捕获问题和风险", "|A|||R¹|R²|C|C", "R¹：阶段层面捕获。R²：团队层面捕获。"),
        "cs-correct": activity("CS", "采取纠正行动", "|A|C|C|A¹/R³|R⁴||I", "A¹：对小组经理的纠正行动问责。R³：项目经理自己的纠正行动。R⁴：团队层面的纠正行动。"),
        "cs-escalate": activity("CS", "上报问题和风险", "|A|C|C|R|I||I"),
        "cs-highlight": activity("CS", "报告要点", "|A|C|C|R|C|C|C"),
        "mp-accept": activity("MP", "接受工作包", "||||A|R||I"),
        "mp-execute": activity("MP", "执行工作包", "||||A|R|C|C"),
        "mp-evaluate": activity("MP", "评价工作包", "||||A|R|C|C"),
        "mp-notify": activity("MP", "通知工作包已完成", "||||A|R|C|I"),
        "sb-plan": activity("SB", "准备下一阶段计划", "|A|C|C|R|C|C|C"),
        "sb-exception": activity("SB", "准备例外计划（如果需要）", "|A|C|C|R|C|C|C"),
        "sb-project": activity("SB", "更新项目计划", "|A|C|C|R|C|C|C"),
        "sb-case": activity("SB", "更新商业论证", "|A|C|C|R|C|C|C"),
        "sb-evaluate": activity("SB", "评价阶段", "|A|C|C|R|C|C|C"),
        "sb-request": activity("SB", "请求下一阶段", "|A|C|C|R|I|C|I"),
        "cp-prepare": activity("CP", "准备按计划收尾", "|A|C|C|R|C|C|C"),
        "cp-early": activity("CP", "准备提前收尾", "|A|C|C|R|C|C|C"),
        "cp-accept": activity("CP", "确认项目验收", "|A|C|C|R|I|I|I"),
        "cp-evaluate": activity("CP", "评估项目", "|A|C|C|R|C|C|C"),
        "cp-request": activity("CP", "请求项目收尾", "I|A|C|C|R|I|C|I")
    };
    // 关联清单为项目归纳。每项仅引用有关活动，不改变教材的活动名称及职责字母。
    var mappings = {
        "product-register": ["ip-controls", "cs-work", "sb-evaluate", "cp-accept"],
        "product-description": ["ip-plan", "cs-authorize", "mp-evaluate"],
        "project-brief": ["su-brief", "dp-init"],
        "project-product-description": ["su-brief", "ip-plan", "cp-accept"],
        "risk-register": ["cs-capture", "cs-escalate", "sb-evaluate"],
        "issue-register": ["cs-capture", "cs-correct", "cs-escalate"],
        "lessons-log": ["su-lessons", "sb-evaluate", "cp-evaluate"],
        "quality-register": ["mp-evaluate", "cs-receive", "sb-evaluate"],
        "quality-management-approach": ["ip-methods", "mp-evaluate", "sb-evaluate"],
        "work-package-description": ["cs-authorize", "mp-accept", "mp-execute", "mp-notify", "cs-receive"],
        "checkpoint-report": ["mp-evaluate", "cs-work"],
        "end-project-report": ["cp-evaluate", "dp-close"],
        "end-stage-report": ["sb-evaluate", "dp-stage"],
        "exception-report": ["cs-escalate", "dp-stage"],
        "highlight-report": ["cs-highlight"],
        "issue-report": ["cs-capture", "cs-correct", "cs-escalate"],
        "lessons-report": ["sb-evaluate", "cp-evaluate"],
        "plan": ["ip-plan", "sb-plan", "sb-exception", "mp-accept"],
        "stage-plan": ["su-plan", "sb-plan", "dp-stage", "cs-stage"],
        "team-plan": ["mp-accept", "mp-execute", "mp-evaluate", "cs-work"],
        "exception-plan": ["sb-exception", "dp-stage"],
        "project-initiation-documentation": ["ip-pid", "dp-project"],
        "project-log": ["ip-controls", "cs-capture", "sb-evaluate", "cp-evaluate"],
        "daily-log": ["cs-capture", "cs-stage"],
        "business-case": ["ip-case", "sb-case", "cp-evaluate"]
    };
    var methods = ["benefits", "change", "commercial", "communication", "digital-and-data", "issue", "risk", "sustainability"];
    methods.forEach(function (prefix) { mappings[prefix + "-management-approach"] = ["ip-methods", "sb-evaluate"]; });

    function operation(label, assignments, scene) {
        return { label: label, assignments: assignments, scene: scene, provenance: "project-synthesis" };
    }
    // 产品细分操作是教学分工拟案，不是对官方活动职责表的转录。
    var profiles = {
        record: [
            operation("建立条目与资料关联", { pm: "A", support: "R", team: "C" }, 0),
            operation("审查记录与行动安排", { pm: "A/R", team: "C", assurance: "C", support: "I" }, 1),
            operation("维护状态与版本", { pm: "A", support: "R", team: "C" }, 2)
        ],
        lessons: [
            operation("记录经验与来源", { pm: "A", support: "R", team: "C", action: "C" }, 0),
            operation("安排建议与行动责任", { pm: "A/R", action: "C", support: "I" }, 1),
            operation("实施改进并反馈", { pm: "A", action: "R", support: "I" }, 2),
            operation("核对效果与更新记录", { pm: "A", support: "R", action: "C", assurance: "C" }, 3)
        ],
        risk: [
            operation("记录与维护风险信息", { pm: "A", support: "R", owner: "C", action: "C" }, 0),
            operation("统筹风险与应对安排", { owner: "A/R", pm: "C", action: "C", support: "I" }, 1),
            operation("执行应对并反馈", { owner: "A", action: "R", pm: "I", support: "I" }, 2),
            operation("复评并更新状态", { owner: "A", support: "R", pm: "C", action: "C" }, 3)
        ],
        quality: [
            operation("汇集检查与复验记录", { pm: "A", support: "R", team: "C", assurance: "C" }, 0),
            operation("独立核查检查依据", { assurance: "A/R", pm: "C", team: "C", support: "I" }, 1),
            operation("维护结果与状态关联", { pm: "A", support: "R", assurance: "C", team: "I" }, 2)
        ],
        description: [
            operation("编制专业内容与检查要求", { pm: "A", team: "R", user: "C", assurance: "C" }, 0),
            operation("核查规格与接受接口", { pm: "A/R", user: "C", team: "C", assurance: "C" }, 1),
            operation("维护描述版本与关联", { pm: "A", support: "R", team: "C" }, 2)
        ],
        document: [
            operation("汇编内容与相关依据", { executive: "A", pm: "R", user: "C", supplier: "C", assurance: "C" }, 0),
            operation("核对未决事项与提交审查", { pm: "A/R", assurance: "C", user: "C", supplier: "C" }, 1),
            operation("维护版本与审查记录", { pm: "A", support: "R", executive: "I" }, 2)
        ],
        pid: [
            operation("汇编受控文件与索引", { pm: "A", support: "R", user: "C", supplier: "C", assurance: "C" }, 0),
            operation("核查文件一致性", { pm: "A/R", assurance: "C", team: "C", support: "C" }, 1),
            operation("维护授权版本与分发", { pm: "A", support: "R", executive: "I", team: "I" }, 2)
        ],
        report: [
            operation("汇集事实与编制报告", { pm: "A/R", team: "C", assurance: "C", support: "C" }, 0),
            operation("核查报告依据", { assurance: "A/R", pm: "C", support: "C" }, 0),
            operation("报送与保存响应记录", { pm: "A", support: "R", executive: "I", user: "I", supplier: "I" }, 1)
        ],
        checkpoint: [
            operation("编制工作包进展报告", { team: "A/R", support: "C" }, 0),
            operation("评价报告与安排纠正", { pm: "A/R", team: "C", assurance: "C" }, 1),
            operation("关联报告与后续记录", { pm: "A", support: "R", team: "I" }, 1)
        ],
        team: [
            operation("细化工作包的小组安排", { team: "A/R", pm: "C", support: "C" }, 0),
            operation("核对阶段与工作包接口", { pm: "A/R", team: "C", assurance: "C" }, 0),
            operation("维护实际与剩余预测", { team: "A/R", pm: "I", support: "C" }, 1)
        ],
        method: [
            operation("编制程序与责任安排", { executive: "A", pm: "R", user: "C", supplier: "C", team: "C", assurance: "C", support: "C" }, 0),
            operation("落实工作包中的方法", { pm: "A", team: "R", user: "C", supplier: "C", assurance: "C", support: "I" }, 1),
            operation("审查实施并维护版本", { pm: "A", support: "R", user: "C", supplier: "C", assurance: "C", executive: "I" }, 2)
        ],
        benefits: [
            operation("拟定收益测量与评审安排", { executive: "A", pm: "R", user: "C", supplier: "C", support: "C" }, 0),
            operation("协调项目后收益测量", { user: "A/R", executive: "I", pm: "C", support: "C" }, 3),
            operation("维护测量结果与责任记录", { user: "A", support: "R", pm: "C" }, 3)
        ],
        change: [
            operation("拟定入住与使用准备", { executive: "A", pm: "R", user: "C", supplier: "C" }, 0),
            operation("协调家庭采用与反馈", { user: "A/R", pm: "C", team: "C", support: "I" }, 1),
            operation("维护变革行动记录", { pm: "A", support: "R", user: "C" }, 2)
        ],
        commercial: [
            operation("协调采购与合同接口", { pm: "A/R", supplier: "C", user: "C", assurance: "C" }, 0),
            operation("落实供货与排产安排", { supplier: "A/R", team: "C", pm: "C", support: "I" }, 1),
            operation("保存合同与履约关联", { pm: "A", support: "R", supplier: "C" }, 2)
        ],
        communication: [
            operation("拟定沟通与报送安排", { executive: "A", pm: "R", user: "C", supplier: "C", team: "C" }, 0),
            operation("组织报告与沟通", { pm: "A/R", support: "R", team: "C", user: "C", supplier: "C" }, 1),
            operation("维护沟通与响应记录", { pm: "A", support: "R", team: "C" }, 2)
        ],
        digital: [
            operation("拟定数据与资料规则", { executive: "A", pm: "R", team: "C", assurance: "C", support: "C" }, 0),
            operation("管理资料版本与访问", { pm: "A", support: "R", team: "C", assurance: "C" }, 1),
            operation("核查并移交资料索引", { pm: "A", support: "R", assurance: "C", user: "C" }, 3)
        ],
        sustainability: [
            operation("拟定目标与测量安排", { executive: "A", pm: "R", user: "C", supplier: "C", assurance: "C" }, 0),
            operation("落实材料与施工要求", { pm: "A", team: "R", supplier: "C", user: "C", assurance: "C" }, 1),
            operation("协调入住后测量", { user: "A/R", pm: "C", support: "C" }, 3),
            operation("维护测量与实施记录", { pm: "A", support: "R", user: "C", team: "C" }, 2)
        ],
        work: [
            operation("定义交付内容与接口", { pm: "A/R", team: "C", user: "C", assurance: "C" }, 0),
            operation("协定工作条件与报告", { pm: "A", team: "R", supplier: "C", support: "I" }, 1),
            operation("维护变更与交接记录", { pm: "A", support: "R", team: "C", assurance: "C" }, 2)
        ]
    };
    var profileBySlug = {
        "product-register": "record", "risk-register": "risk", "issue-register": "record", "lessons-log": "lessons", "quality-register": "quality",
        "product-description": "description", "project-product-description": "document", "project-brief": "document", "work-package-description": "work",
        "checkpoint-report": "checkpoint", "team-plan": "team", "project-initiation-documentation": "pid", "project-log": "record", "daily-log": "record",
        "benefits-management-approach": "benefits", "change-management-approach": "change", "commercial-management-approach": "commercial",
        "communication-management-approach": "communication", "digital-and-data-management-approach": "digital", "sustainability-management-approach": "sustainability"
    };
    function profile(slug) {
        var items = profiles[profileBySlug[slug] || (slug.endsWith("management-approach") ? "method" : slug.endsWith("report") ? "report" : "document")];
        var configuration = window.PRINCE2ProductManagementUsage.configurations[slug];
        return items.map(function (item) { return Object.assign({}, item, { scene: Math.min(item.scene, configuration.length - 1) }); });
    }
    function node(tag, text, className) {
        var element = document.createElement(tag);
        if (text != null) { element.textContent = text; }
        if (className) { element.className = className; }
        return element;
    }
    function selectedLessonPerson() {
        var record = document.querySelector("#lesson-register-section .lesson-detail:not([hidden])");
        var id = record && record.id;
        if (id && id.includes("LES-001")) { return ["赵建国", "施工包工头"]; }
        if (id && id.includes("LES-002")) { return ["宋妍", "设计师"]; }
        if (id && id.includes("LES-003")) { return ["陆明远", "装修公司负责人"]; }
        return ["按所选记录", "见行动负责人字段"];
    }
    function selectedRiskRecord() {
        var record = document.querySelector("#lesson-register-section:not([hidden]) .lesson-detail:not([hidden])");
        return record ? record.id.replace(/^lesson-detail-/, "") : "";
    }
    function riskRecordRole(recordId, key, name, mode) {
        var role = { key: key, name: name };
        if (mode !== "case") { return role; }
        var configuration = window.PRINCE2RegisterDocuments && window.PRINCE2RegisterDocuments["risk-register"];
        var record = configuration && configuration.records.find(function (item) { return item.id === recordId; });
        var field = record && record.fields.find(function (item) { return item[0] === name; });
        var text = field && typeof field[1] === "string" ? field[1] : "";
        var parts = text.split(" · ");
        // 仅读取该条风险明确列出的任命，不从质量处置人员推断风险职责。
        if (parts.length < 2 || text.startsWith("待确认") || text.startsWith("风险应对职责待确认")) {
            role.person = "待确认"; role.identity = recordId || "按所选风险";
        } else {
            role.person = parts[0] + (text.includes("拟任") || text.includes("拟负责") ? "（拟任）" : "");
            role.identity = parts.slice(1).join(" · ").split(/[，；。]/)[0] + (text.includes("签认待确认") ? " · 签认待确认" : "");
        }
        return role;
    }
    function operationRoles(slug, mode) {
        var result = roles.slice();
        if (slug === "risk-register") {
            var recordId = mode === "case" ? selectedRiskRecord() : "";
            result.push(riskRecordRole(recordId, "owner", "风险负责人", mode));
            result.push(riskRecordRole(recordId, "action", "风险行动负责人", mode));
        }
        if (slug === "lessons-log") {
            var person = mode === "case" ? selectedLessonPerson() : [];
            result.push({ key: "action", name: "行动负责人", person: person[0], identity: person[1] });
        }
        return result.filter(function (role) { return profile(slug).some(function (row) { return row.assignments[role.key]; }); });
    }
    function header(role, mode) {
        var cell = node("th"); cell.scope = "col";
        cell.dataset.roleKey = role.key;
        cell.append(node("span", role.name));
        if (mode === "case") { cell.append(node("small", role.person), node("small", role.identity)); }
        return cell;
    }
    function tableBlock(title, columns, rows, mode, kind, select, slug) {
        var section = node("section", null, "product-raci-block"), heading = node("h3", title);
        heading.id = "product-raci-" + kind + "-title"; section.setAttribute("aria-labelledby", heading.id);
        section.dataset.provenance = kind === "manual" ? "manual-verbatim" : "project-synthesis";
        section.append(heading);
        var note = node("p", kind === "manual" ? "RACI：教材原文。产品关联：项目归纳（非教材内容）。" : "分工建议 · 非教材内容 · 教学案例拟案", "product-raci-origin"); section.append(note);
        var wrap = node("div", null, "product-raci-scroll"), table = node("table", null, "product-raci-table");
        wrap.tabIndex = 0; wrap.setAttribute("role", "region"); wrap.setAttribute("aria-label", title + "，可横向滚动");
        var head = node("thead"), body = node("tbody"), tr = node("tr"), first = node("th", kind === "manual" ? "流程活动／教材依据" : "产品操作／查看使用场景"); first.scope = "col"; tr.append(first);
        columns.forEach(function (role) { tr.append(header(role, mode)); }); head.append(tr);
        rows.forEach(function (item, index) {
            var row = node("tr"), label = node("th"); label.scope = "row";
            row.dataset.raciRow = kind + "-" + index;
            if (kind === "manual") {
                label.append(node("span", item.flow, "product-raci-flow"), node("strong", item.label));
                var link = node("a", "表" + item.source.table); link.href = "../chapters/" + item.source.chapter + ".html#" + item.source.anchor;
                link.title = "原始PDF第" + item.source.pdfPage + "页核对"; label.append(link);
            } else {
                var button = node("button", item.label); button.type = "button";
                button.dataset.raciScene = String(item.scene);
                button.title = "查看：" + window.PRINCE2ProductManagementUsage.configurations[slug][item.scene].name;
                button.addEventListener("click", function () { select(item.scene, false, true); }); label.append(button);
            }
            row.append(label);
            columns.forEach(function (role, column) {
                var value = kind === "manual" ? item.raci[column] : item.assignments[role.key] || "";
                var cell = node("td", value || "");
                cell.setAttribute("aria-label", role.name + "：" + (value || (kind === "manual" ? "教材未列明" : "拟案未分配")));
                if (/[RA]/.test(value)) { cell.className = "is-responsible"; }
                row.append(cell);
            }); body.append(row);
        }); table.append(head, body); wrap.append(table); section.append(wrap);
        if (kind === "manual") {
            var notes = Array.from(new Set(rows.map(function (row) { return row.footnote; }).filter(Boolean)));
            notes.forEach(function (text) { section.append(node("p", text, "product-raci-footnote")); });
        }
        return section;
    }
    function render(container, slug, mode, select) {
        if (!mappings[slug]) { return; }
        var root = node("div"); root.id = "product-raci"; root.dataset.slug = slug; root.dataset.mode = mode;
        var legend = node("p", "R 执行 · A 问责 · C 咨询 · I 知情；A 不等同于批准。空白表示未列明。", "product-raci-legend"); root.append(legend);
        root.append(tableBlock("教材流程活动 RACI", roles, mappings[slug].map(function (id) { return activities[id]; }), mode, "manual", select, slug));
        root.append(tableBlock("产品操作 RACI · 非教材内容", operationRoles(slug, mode), profile(slug), mode, "operation", select, slug));
        container.prepend(root);
    }
    window.addEventListener("product-record:changed", function () {
        var root = document.getElementById("product-raci");
        if (!root || root.dataset.mode !== "case") { return; }
        if (root.dataset.slug === "risk-register") {
            var recordId = selectedRiskRecord();
            operationRoles("risk-register", "case").forEach(function (role) {
                if (role.key !== "owner" && role.key !== "action") { return; }
                var cell = root.querySelector('[data-provenance="project-synthesis"] th[data-role-key="' + role.key + '"]');
                if (cell && cell.children.length > 1) {
                    cell.children[1].textContent = role.person; cell.children[2].textContent = role.identity;
                }
            });
            root.dataset.recordId = recordId;
            return;
        }
        if (root.dataset.slug !== "lessons-log") { return; }
        var person = selectedLessonPerson();
        root.querySelectorAll('[data-provenance="project-synthesis"] thead th').forEach(function (cell) {
            if (cell.firstElementChild && cell.firstElementChild.textContent === "行动负责人" && cell.children.length > 1) {
                cell.children[1].textContent = person[0]; cell.children[2].textContent = person[1];
            }
        });
    });
    window.PRINCE2ProductRaci = { roles: roles, activities: activities, mappings: mappings, profiles: profiles, profile: profile, riskRecordRole: riskRecordRole, render: render };
}());
