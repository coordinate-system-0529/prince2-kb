(function () {
    "use strict";

    var documents = {};
    var issue = window.PRINCE2_PRODUCT_DETAILS_V2 && window.PRINCE2_PRODUCT_DETAILS_V2.entries["issue-register"];
    if (issue) {
        documents["issue-register"] = {
            title: "问题登记单", eyebrow: "REN-001 · A13 项目记录单 / 问题",
            caption: "问题登记总表 · 1 项不合格项",
            columns: ["编号 / 问题", "类型", "问题负责人", "当前状态", "完整记录"],
            metadata: [
                ["所属项目", "住宅全屋装修项目"], ["版本／性质", "v1.0 · 教学虚构案例"],
                ["维护／审查", "许静 · 项目支持 / 陈默 · 项目经理"],
                ["记录范围", "防水首次失败至返工后待复验"]
            ],
            records: issue.caseRecords
        };
    }
    var riskSource = ["风险历史记录", "../cases/risk-lessons-records.html#risk-register"];
    documents["risk-register"] = {
        title: "风险登记单",
        eyebrow: "REN-001 · 项目记录单 / 风险",
        caption: "风险登记总表 · 2 项威胁 / 1 项机会",
        columns: ["编号 / 风险", "类型", "风险负责人", "跟踪状态", "完整记录"],
        metadata: [
            ["所属项目", "住宅全屋装修项目"],
            ["案例性质", "教学虚构案例"],
            ["维护／审查", "许静 · 项目支持 / 陈默 · 项目经理"],
            ["评估口径", "历史评级 1 至 5 标度 · 当前待复评"]
        ],
        records: [
            {
                id: "RISK-004", title: "定制木门交付延迟", summary: ["威胁", "陈默 · 项目经理（拟定）", "等待排产 · 待复评"],
                fields: [
                    ["风险标识符", "RISK-004 · 威胁 · 关联 DOOR-018 定制木门。"],
                    ["风险描述", [["原因", "旧评估为厂家产能紧张，当前产能情况待核实"], ["事件", "木门可能延迟交货，当前等待排产"], ["影响", "安装及完工日期可能延后，最终延期幅度待确认"]]],
                    ["概率", "历史估计 4/5；当前待复评。"],
                    ["影响", "历史估计 4/5；实际损失与延期量待确认。"],
                    ["临近度", "历史估计 3 周；最新排产信息待确认。"],
                    ["速度", "历史估计 1 天，指事件发生后影响目标的速度。"],
                    ["风险应对", "确认排产，准备备选供应商。排产确认及执行记录待补充。"],
                    ["计划的剩余概率和影响", "历史假设：应对有效后，概率 2/5、影响 2/5。实际应对效果待核验。"],
                    ["风险负责人", "陈默 · 独立装修项目经理，拟任；签认待确认。"],
                    ["风险行动负责人", "陆明远 · 装修公司负责人，拟负责排产及备选供应资源协调；签认待确认。"],
                    ["风险相关日期", [["历史记录日期", "7 月 3 日，年份未注明"], ["旧示例复查日期", "7 月 8 日，复查完成情况待核验"], ["当前审查／行动截止日期", "待确认"]]]
                ],
                sources: [riskSource, ["拟定分工", "../cases/risk-lessons-records.html#mapping"], ["木门排产台账更新", "../cases/product-register.html#update-03"]],
                missing: "采购计划、供应商排产确认及当前复评记录待补充。"
            },
            {
                id: "RISK-007", title: "防水渗漏与返工影响", summary: ["威胁", "待确认", "返工完成 · 复验待执行"],
                fields: [
                    ["风险标识符", "RISK-007 · 威胁 · 关联 WPF-011 卫生间防水系统。"],
                    ["风险描述", [["原因", "历史评估为基层检查不足；现场已确认门口节点附加层局部不连续"], ["事件", "首次闭水已失败，返工后的 WPF-011 v1.1 待复验"], ["影响", "继续跟踪渗漏、返工及贴砖延迟的影响，实际进度影响待确认"]]],
                    ["概率", "首次失败前历史估计 3/5；复验及后续风险待重新评估。"],
                    ["影响", "历史估计 3/5；实际成本及工期影响待确认。"],
                    ["临近度", "历史估计 1 周；当前以复验及后续交付安排重新评估。"],
                    ["速度", "历史估计为立即。"],
                    ["风险应对", "增加封闭前检查及影像记录。首次失败后已局部返工，当前待复验；新增检查行动的执行证据待补充。"],
                    ["计划的剩余概率和影响", "历史假设：应对有效后，概率 1/5、影响 2/5。返工后剩余风险待复评。"],
                    ["风险负责人", "待确认。"],
                    ["风险行动负责人", "风险应对职责待确认。质量处置：赵建国组织返工，陈默安排复验，王志衡核查。"],
                    ["风险相关日期", [["旧示例检查日期", "7 月 5 日，年份及执行情况待确认"], ["关联质量记录", "首次检查 6 月 15 日；复验计划 6 月 18 日至 19 日，年份未注明"], ["当前审查／行动截止日期", "待确认"]]]
                ],
                sources: [riskSource, ["QA-WPF-01 · 首次失败", "../cases/waterproof-quality-records.html#first-inspection"], ["返工处置", "../cases/waterproof-quality-records.html#failure-rework"], ["QA-WPF-02 · 待执行复验", "../cases/waterproof-quality-records.html#reinspection"]],
                missing: "当前风险复评、进度影响和检查行动验证记录待补充。"
            },
            {
                id: "RISK-011", title: "联合采购折扣机会", summary: ["机会", "待确认", "折扣及收益待核验"],
                fields: [
                    ["风险标识符", "RISK-011 · 机会 · 瓷砖、洁具联合采购。"],
                    ["风险描述", [["原因", "供应商季度促销"], ["事件", "瓷砖、洁具联合采购可能获得组合折扣"], ["影响", "可能降低采购成本；报价和实际收益待确认"]]],
                    ["概率", "历史估计 3/5；当前待复评。"],
                    ["影响", "历史估计 2/5；实际节省金额待确认。"],
                    ["临近度", "历史估计 2 周；促销有效期待确认。"],
                    ["速度", "历史估计 3 天。"],
                    ["风险应对", "确认规格并争取组合折扣。行动安排及商业条件待确认。"],
                    ["计划的剩余概率和影响", "旧示例预计机会概率提高至 4/5；应对后的影响估计待确认，实际收益待核验。"],
                    ["风险负责人", "待确认。"],
                    ["风险行动负责人", "待确认。"],
                    ["风险相关日期", [["旧示例决策日期", "7 月 10 日，年份及决策结果待确认"], ["当前审查／行动截止日期", "待确认"]]]
                ],
                sources: [riskSource],
                missing: "促销报价、规格确认、行动分工及采购收益记录待补充。"
            }
        ]
    };

    // 与原产品台账共用一份数据，日期、版本和结果不另建副本。
    var source = window.RENOVATION_PRODUCT_REGISTER;
    if (source) {
        var identities = { "陈默": "项目经理", "许静": "项目支持", "宋妍": "设计师", "赵建国": "施工包工头", "陆明远": "装修公司负责人" };
        var detailLinks = {
            "WPF-011": ["PD-WPF-11 · 防水产品描述", "product-detail-v2.html?entry=product-description&mode=case"],
            "HOME-025": ["PPD-HOME-25 · 项目产品描述", "product-detail-v2.html?entry=project-product-description&mode=case"]
        };
        documents["product-register"] = {
            title: "产品登记单", eyebrow: source.register.id + " · 项目记录单 / 产品",
            caption: "产品登记总表 · " + source.products.length + " 项",
            columns: ["编号 / 产品", "版本", "负责人", "产品状态", "完整记录"],
            referenceLabel: "参考资料", searchable: true,
            metadata: [
                ["所属项目", source.register.project], ["案例性质", "教学虚构案例"],
                ["维护／审查", source.register.maintainer + " / " + source.register.manager],
                ["快照", source.register.currentUpdate + " · " + source.register.updatedAt]
            ],
            records: source.products.map(function (product) {
                var references = [];
                if (detailLinks[product.id]) { references.push(detailLinks[product.id]); }
                references.push(["产品台账 · " + product.id, "../cases/product-register.html#product-title-" + product.id]);
                if (product.evidenceHref) { references.push(["防水质量证据包", "../cases/" + product.evidenceHref]); }
                return {
                    id: product.id, title: product.name,
                    summary: [product.version, product.owner + (identities[product.owner] ? " · " + identities[product.owner] : ""), product.status],
                    fields: [
                        ["产品标识符", [["产品", product.id + " · " + product.name], ["类别", product.type], ["来源", product.source]]],
                        ["日期", [["产品描述批准", product.descriptionApproved], ["计划验收", product.plannedAcceptance], ["实际验收", product.actualAcceptance === "空白" ? "未记录" : product.actualAcceptance], ["年份", "原记录未注明"]]],
                        ["状态", [["产品状态", product.status], ["当前版本", product.version], ["验收结果", product.result], ["最近更新", product.lastUpdate]]]
                    ],
                    sources: references,
                    referenceText: "关联产品描述：" + product.descriptionRef + "。",
                    missing: detailLinks[product.id] ? "" : "独立产品描述文件：待补充。"
                };
            })
        };
    }
    window.PRINCE2RegisterDocuments = documents;
}());
