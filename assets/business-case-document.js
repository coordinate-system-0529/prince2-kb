(function () {
    "use strict";

    // 仅呈现现有 A1 完整案例；理论原文仍由 product-details-v2.js 管理。
    var budget = [
        ["设计与项目管理", 4], ["拆除和基层", 6], ["水电与防水", 9],
        ["饰面", 8], ["定制与安装", 10], ["风险余量", 5]
    ];
    function node(tag, text, className) {
        var element = document.createElement(tag);
        if (text) { element.textContent = text; }
        if (className) { element.className = className; }
        return element;
    }
    function table(parent, caption, headers, rows) {
        var wrap = node("div", "", "business-table-wrap");
        wrap.tabIndex = 0;
        wrap.setAttribute("role", "region");
        wrap.setAttribute("aria-label", caption + "，可横向滚动");
        var grid = node("table", "", "business-table");
        grid.append(node("caption", caption));
        var head = node("thead"), headRow = node("tr"), body = node("tbody");
        headers.forEach(function (label) { var cell = node("th", label); cell.scope = "col"; headRow.append(cell); });
        head.append(headRow);
        rows.forEach(function (row) {
            var tr = node("tr");
            row.forEach(function (value, index) {
                var cell = node(index ? "td" : "th", String(value));
                if (!index) { cell.scope = "row"; }
                tr.append(cell);
            });
            body.append(tr);
        });
        grid.append(head, body); wrap.append(grid); parent.append(wrap);
    }
    function note(parent, label, text) {
        var p = node("p", "", "business-note");
        p.append(node("strong", label + "："), document.createTextNode(text)); parent.append(p);
    }
    function buildContent(root) {
        var entry = window.PRINCE2_PRODUCT_DETAILS_V2.entries["full-business-case"];
        var contents = node("nav", "", "business-contents");
        contents.setAttribute("aria-label", "商业论证文档章节");
        root.append(contents);
        entry.caseView.composition.items.forEach(function (item, index) {
            var section = node("section", "", "business-chapter");
            section.id = "business-case-chapter-" + (index + 1);
            section.dataset.businessAnchor = "composition-" + item.label;
            var title = node("h2", String(index + 1).padStart(2, "0") + "  " + item.label);
            title.id = section.id + "-title";
            section.setAttribute("aria-labelledby", title.id);
            section.append(title);
            var link = node("a", item.label); link.href = "#" + section.id; contents.append(link);
            // 保留既有案例叙述作为基础，复杂比较改用表格展开。
            if ([0, 1, 7].includes(index)) { section.append(node("p", item.text)); }
            if (index === 0) {
                note(section, "决策依据", "第 2 至 3 周形成的 v1.0 基线；第 8 周计划复查成本、工期与风险。后续实际值待复核。");
            }
            if (index === 2) {
                table(section, "业务选项比较", ["选项", "初始投入", "覆盖范围", "局限／建议"], [
                    ["不采取行动", "0 元", "维持现状", "现有隐患持续，非推荐"],
                    ["局部维修", "约 12 至 18 万元", "处理眼前问题", "整体功能改善有限，非推荐"],
                    ["全屋受控装修", "上限 42 万元", "安全、功能、耐久、资料完整性", "一次性投入较高，推荐"]
                ]);
            }
            if (index === 3) {
                table(section, "收益与核验安排", ["收益／指标", "目标", "核验时点与依据", "确认责任"], [
                    ["关键安全测试", "通过率 100%", "交付验收，质量检查记录", "林悦 · 高级用户，结合专业检查"],
                    ["居住适用性", "家庭联合验收完成", "交付验收，家庭验收记录", "林悦 · 高级用户"],
                    ["维护可追溯性", "关键材料、设备及隐蔽记录可追溯率 100%", "资料移交，产品台账与交付资料", "许静整理，林悦确认"],
                    ["长期使用与维护", "复查使用与维护情况", "入住后 1 个月、6 个月，复查记录", "林悦参与，具体安排待确认"]
                ]);
                note(section, "负收益", "装修期间暂住、一次性资金占用、家庭决策时间。费用和时间负担尚未量化。");
                note(section, "收益容许偏差", "安全指标不降级；其他指标容许偏差待明确。核验结果待记录。");
            }
            if (index === 4) {
                table(section, "可持续性要求", ["目标", "验收依据", "容许边界"], [
                    ["耐用、可维护", "方案及材料设备资料", "具体寿命目标待确认"],
                    ["关键维护可达", "检修口、阀门、配电标识、可更换部件可访问", "不接受降级"],
                    ["维护资料完整", "保修和维护资料移交清单", "完整移交"]
                ]);
            }
            if (index === 5) {
                table(section, "时间基准与复查", ["环节", "计划时点", "交付／检查"], [
                    ["项目启动", "第 2 至 3 周", "形成 v1.0 完整商业论证、计划和成本基准"],
                    ["阶段边界", "第 8 周", "复查实际成本、剩余风险和交付预测"],
                    ["验收与收尾", "第 16 周", "家庭验收及资料移交"],
                    ["项目后收益复查", "入住后 1 个月、6 个月", "检查使用价值和维护情况"]
                ]);
                note(section, "工期边界", "从现场交底到家庭验收和资料移交共 16 周，不含前期搬迁准备；项目层最多延后 1 周。");
            }
            if (index === 6) {
                table(section, "成本基准分配（万元）", ["费用项", "金额"], budget.concat([["合计", budget.reduce(function (sum, row) { return sum + row[1]; }, 0)]]));
                note(section, "预算控制", "风险余量 5 万元已包含在 42 万元内；任何预测突破上限均需升级决策。");
                note(section, "资金安排", "周诚负责确保资金；资金来源明细、付款节点及到位凭据待补充。");
            }
            if (index === 7) {
                table(section, "投资评估边界", ["维度", "当前判断／待补依据"], [
                    ["投入比较", "全屋方案上限 42 万元，局部维修约 12 至 18 万元；两者覆盖范围不同"],
                    ["使用价值", "优先满足安全、适用性与维护追溯，非现金收入型项目"],
                    ["运行维护成本", "尚未量化，需补充能源、设备保养和更新费用估算"],
                    ["量化财务回报", "收益未货币化，净现值、回收期和投资回报率未计算"]
                ]);
                note(section, "复查条件", "成本或工期预测突破边界、关键安全质量不能满足要求时，重新评估选项及继续投资的合理性。");
            }
            if (index === 8) {
                table(section, "主要威胁与应对", ["风险", "潜在影响", "应对安排", "核查依据"], [
                    ["未知基层问题", "消耗风险余量", "勘查、预留余量", "勘查结果及成本预测"],
                    ["定制木门排产", "影响安装接口及完工", "提前核实排产和交期", "供应商排产确认"],
                    ["家庭需求变化", "返工、追加投入", "需求确认及变更控制", "需求和变更记录"],
                    ["关键质量活动失败", "延迟验收", "失败后返工、复验", "质量检查与复验结果"]
                ]);
                note(section, "风险复查", "概率、影响及剩余风险以阶段复评为准；机会评估另见风险登记单，收益尚待核验。");
            }
            if (index === 9) {
                var refs = [
                    ["项目概述文件 v1.0", "../cases/project-brief.html#business-case"],
                    ["项目启动时间线", "../cases/renovation.html#full-business-case"],
                    ["项目产品描述", "../cases/project-product-description.html"],
                    ["产品登记单", "product-detail-v2.html?entry=product-register&mode=case"],
                    ["风险登记单", "product-detail-v2.html?entry=risk-register&mode=case"],
                    ["质量登记单", "product-detail-v2.html?entry=quality-register&mode=case"]
                ];
                var list = node("ul", "", "business-references");
                refs.forEach(function (ref) { var li = node("li"), a = node("a", ref[0]); a.href = ref[1]; li.append(a); list.append(li); });
                section.append(list);
                note(section, "待补文件", "项目计划独立文件、收益管理方法、可持续性管理方法，以及商业论证批准签认资料。");
            }
            root.append(section);
        });
    }
    window.PRINCE2BusinessCaseDocument = {
        title: "住宅全屋装修项目商业论证",
        titleParts: ["住宅全屋装修项目", "商业论证"],
        eyebrow: "REN-001 · A1 商业论证 · 完整版本",
        metadata: [
            ["版本／性质", "v1.0 · 教学虚构案例"],
            ["文件时点", "第 2 至 3 周 · 启动阶段基线"],
            ["编制／维护", "陈默 · 项目经理／许静 · 项目支持"],
            ["问责／授权", "周诚 · 项目总监／项目管理委员会"],
            ["投资／工期", "上限 42 万元／目标 16 周"],
            ["签认资料", "待补充"]
        ],
        printLabel: "打印商业论证",
        budget: budget,
        buildContent: buildContent
    };
}());
