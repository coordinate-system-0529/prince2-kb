(function () {
    "use strict";

    var selectionKey = "prince2-lessons-log-selected-v1";
    var selectedId = "LES-001";
    var helpDialog;
    var placements = [];
    var activeRecords;
    try { selectedId = sessionStorage.getItem(selectionKey) || selectedId; } catch (error) { /* 存储不可用时使用首条。 */ }

    // 沿用既有教学记录编号。新增行动安排为拟定分工，不冒充历史签认。
    var records = [
        {
            id: "LES-001", title: "封闭前增加检查清单和照片记录", type: "项目经验教训",
            priority: "高", severity: "中等，沿用旧字段示例，未重新评级",
            owner: "赵建国 · 施工包工头", status: "建议已记录，实施与效果待核验",
            description: [
                ["事件与影响", "防水首次闭水失败，局部节点返工后 WPF-011 v1.1 待复验。存在返工及后续贴砖受阻的影响，额外费用和工期影响尚未量化。"],
                ["原因与预警", "历史原因分析：基层检查不足。待核查线索：封闭前检查签认及照片缺失。实际根因待调查。"],
                ["关联风险", "RISK-007，防水渗漏与返工威胁。风险评估需结合质量检查结果复核。"],
                ["建议行动", "赵建国拟在下次封闭前执行基层、节点检查清单并留照，陈默组织核对，许静关联质量记录；复验仍按产品验收要求单独执行。"],
                ["验证方式", "核对新增检查清单、现场照片和签认，并检查后续复验记录。清单执行与复验通过分别记录，不能互相代替。"]
            ],
            responsibility: "赵建国负责检查行动；陈默组织审查；许静维护本单。行动安排：待确认。",
            dates: [["提出日期（历史）", "7 月 2 日，旧示例未注明年份"], ["上次审查日期", "待确认"], ["行动截止日期", "待确认；建议在下次封闭前完成"], ["解决／验证日期", "未记录，实施及效果待核验"]],
            history: "旧示例写“已应用”，并列 7 月 5 日应用；该标签未取得独立执行证据，不作为当前结论。",
            sources: [["历史记录及状态边界", "../cases/risk-lessons-records.html#lessons-log"], ["首次检查记录", "../cases/waterproof-quality-records.html#first-inspection"], ["返工与处置", "../cases/waterproof-quality-records.html#failure-rework"], ["待执行复验", "../cases/waterproof-quality-records.html#reinspection"]],
            missing: "新增检查清单、执行照片、签认和效果验证记录待补充。"
        },
        {
            id: "LES-002", title: "先做开关定位样板，再确认安装位置", type: "团队经验教训",
            priority: "中", severity: "旧资料未给出，待评定",
            owner: "宋妍 · 主案设计师", status: "历史经验已录入，应用与效果待核验",
            description: [
                ["事件与影响", "旧经验提出用开关定位样板帮助业主尽早发现使用习惯差异，以减少位置调整和返工；当前未提供具体冲突位置或已减少的返工量。"],
                ["原因与预警", "可能原因：图纸理解与现场使用习惯存在差异。原因核实状态：待调查。"],
                ["关联风险", "关联风险编号：待核对。"],
                ["建议行动", "宋妍拟组织定位样板说明，林悦代表用户确认日常使用需求；形成位置确认记录后，再交施工方落实。"],
                ["验证方式", "核对样板确认单、业主反馈和后续位置调整记录，比较返工情况。改善效果：待核验。"]
            ],
            responsibility: "宋妍负责推动设计样板行动；林悦参与用户确认；陈默组织审查；许静维护本单。签认状态：待确认。",
            dates: [["提出日期", "待确认"], ["上次审查日期", "待确认"], ["行动截止日期", "待确认；建议在位置确认及施工前完成"], ["解决／验证日期", "未记录，缺少验证材料"]],
            history: "旧记录日期为 6 月 18 日，未明确日期性质和年份；旧状态“已应用”仅保留为历史摘录。",
            sources: [["历史经验 LES-002", "../cases/risk-lessons-records.html#lessons-log"]],
            missing: "定位样板确认单、用户反馈、执行记录及返工比较数据待补充。"
        },
        {
            id: "LES-003", title: "长周期主材提前预警并核实排产", type: "项目经验教训",
            priority: "高", severity: "旧资料未给出，待评定",
            owner: "陆明远 · 装修公司负责人", status: "建议已记录，排产与行动落实待核验",
            description: [
                ["事件与影响", "定制木门 DOOR-018 当前等待排产，可能影响安装和项目完工。最终交期与延期幅度尚未确认，实际延期天数待确认。"],
                ["原因与预警", "旧风险示例以厂家产能紧张为原因。缺少书面排产确认可用作预警线索；当前厂家实际产能原因仍需核实。"],
                ["关联风险", "RISK-004，定制木门交付延迟威胁。风险应对与经验行动相互关联，但不重复认定已完成。"],
                ["建议行动", "陆明远拟核对供应商产能和交期，陈默审查采购计划中的下单预警，并比较备选供应商。排产状态：待确认。"],
                ["验证方式", "检查采购计划、排产确认和预警触发记录，跟踪实际到货及安装影响，确认措施是否改善后续交付。"]
            ],
            responsibility: "陆明远负责供应协调行动；陈默审查计划与应对；许静维护记录。截止日期及资源承诺：待确认。",
            dates: [["提出日期", "待确认"], ["上次审查日期（历史）", "旧示例列 7 月 8 日复查，未注明年份，当前复查待确认"], ["行动截止日期", "待确认，需根据供应商回复和安装计划协定"], ["解决／验证日期", "未记录，尚未确认改善效果"]],
            history: "旧状态为“行动中”。当前等待排产的事实不能证明采购预警已执行，也不能证明产能已经锁定。",
            sources: [["历史经验 LES-003", "../cases/risk-lessons-records.html#lessons-log"], ["关联风险 RISK-004", "../cases/risk-lessons-records.html#risk-register"], ["项目产品台账", "../cases/product-register.html"]],
            missing: "采购计划、供应商排产确认、预警执行和实际到货记录待补充。"
        }
    ];
    var lessonContext = {
        "LES-001": {
            interpretation: [
                ["整改与改进", "局部返工解决这一次防水缺陷；封闭前检查用于减少同类问题再次发生。返工完成，不等于改进措施已经有效。"],
                ["行动与验证", "赵建国拟落实检查清单，陈默组织核对。清单和照片用于确认措施是否执行，后续检查结果用于评价效果。"]
            ],
            journey: [
                ["来源事件 · 首次失败", "6 月 15 日，年份未注明", "王志衡 · 项目保证；赵建国 · 施工小组经理", "闭水检查发现湿痕，提前终止检查。", "已记录：QA-WPF-01 不通过。", ["首次检查", "../cases/waterproof-quality-records.html#first-inspection"]],
                ["来源事件 · 缺陷处置", "处置日期待补充", "陈默 · 项目经理；赵建国 · 施工小组经理", "陈默接受局部返工方案，赵建国组织返工。", "返工完成：WPF-011 v1.1，复验待执行。", ["返工处置", "../cases/waterproof-quality-records.html#failure-rework"]],
                ["经验管理 · 提炼", "历史提出日期：7 月 2 日，年份未注明", "提出人待确认；许静 · 项目支持（拟维护）", "形成封闭前检查并留照的建议。", "建议已记录；原因分析待核实。", ["经验来源", "../cases/risk-lessons-records.html#lessons-log"]],
                ["经验管理 · 应用", "拟在下次封闭前，日期待确认", "陈默 · 项目经理；赵建国 · 施工小组经理", "拟审查建议并安排检查清单、现场照片留存。", "行动安排待确认；执行证据待补充。", null],
                ["经验管理 · 验证", "待安排", "核验责任待确认", "待核对清单执行、照片与后续检查结果。", "实施与效果待核验。", ["关联复验计划", "../cases/waterproof-quality-records.html#reinspection"]],
                ["经验管理 · 复用", "待安排", "接收人待确认", "待决定是否纳入后续工作包或其他项目。", "复用安排待记录。", null]
            ]
        },
        "LES-002": {
            interpretation: [
                ["经验的重点", "定位样板让业主在施工前确认实际使用位置，减少图纸理解与生活习惯之间的偏差。"],
                ["职责的区别", "宋妍拟组织样板说明，林悦确认使用需求，施工方按确认结果落实。设计说明、用户确认和施工执行是三个不同动作。"],
                ["效果依据", "位置确认记录能证明需求经过确认；是否减少返工，还需要后续施工记录支持。"]
            ],
            journey: [
                ["经验管理 · 收集", "历史日期：6 月 18 日，性质及年份未注明", "提出人待确认", "录入先做开关定位样板、再确认位置的经验。", "历史经验已录入；具体冲突位置待补充。", ["经验来源", "../cases/risk-lessons-records.html#lessons-log"]],
                ["经验管理 · 审查", "日期待确认", "陈默 · 项目经理；宋妍 · 设计小组经理", "拟审查样板方法对本项目的适用性。", "审查结论与分工签认待确认。", null],
                ["经验管理 · 应用", "拟在位置确认及施工前", "宋妍 · 设计师；林悦 · 高级用户；施工责任人待确认", "拟组织样板说明、用户确认，再交施工方落实。", "样板确认单、用户反馈和执行记录待补充。", null],
                ["经验管理 · 验证", "待安排", "核验责任待确认；许静 · 项目支持（拟维护）", "待关联后续位置调整记录，比较返工情况。", "应用与效果待核验。", null],
                ["经验管理 · 复用", "待安排", "接收人待确认", "待决定是否将有效做法纳入后续设计交底。", "复用安排待记录。", null]
            ]
        },
        "LES-003": {
            interpretation: [
                ["风险与经验", "木门可能延期，是持续跟踪的风险；提前识别长周期材料并核实排产，是可用于后续采购的经验。"],
                ["行动的重点", "陆明远拟协调供应商排产与交付安排。下单、排产确认和实际到货应分别记录，不能用已下单代替交付已有保障。"]
            ],
            journey: [
                ["来源事项 · 排产风险", "以产品台账快照为准", "陈默 · 项目经理；陆明远 · 装修公司负责人", "关注木门排产对安装及完工的潜在影响。", "DOOR-018 等待排产，交期及延期幅度待确认。", ["产品台账", "../cases/product-register.html#update-03"]],
                ["经验管理 · 提炼", "提出日期待确认", "提出人待确认；许静 · 项目支持（拟维护）", "录入长周期主材提前预警、核实排产的建议。", "建议已记录。", ["经验来源", "../cases/risk-lessons-records.html#lessons-log"]],
                ["经验管理 · 审查", "历史拟复查日期：7 月 8 日，年份未注明", "陈默 · 项目经理", "拟审查采购预警与供应应对安排。", "复查是否开展待确认。", ["关联风险", "../cases/risk-lessons-records.html#risk-register"]],
                ["经验管理 · 应用", "截止日期待协定", "陆明远 · 装修公司负责人；陈默 · 项目经理", "拟核实供应商产能和交期，比较备选供应资源。", "排产确认、预警执行及资源承诺待补充。", null],
                ["经验管理 · 验证", "待安排", "核验责任待确认", "待跟踪实际到货、安装影响及后续交付改善。", "排产与行动落实待核验，改善效果未确认。", null],
                ["经验管理 · 复用", "待安排", "接收人待确认", "待决定是否将有效预警规则纳入后续采购计划。", "复用安排待记录。", null]
            ]
        }
    };
    records.forEach(function (record) {
        record.journey = lessonContext[record.id].journey;
        record.interpretation = lessonContext[record.id].interpretation;
    });
    function buildJourney(detail, record) {
        var section = node("section", "", "lesson-journey");
        var title = node("h3", "处理历程");
        title.id = "lesson-journey-title-" + record.id;
        section.setAttribute("aria-labelledby", title.id);
        section.append(title);
        var wrap = node("div", "", "lesson-journey-scroll");
        wrap.tabIndex = 0;
        wrap.setAttribute("role", "region");
        wrap.setAttribute("aria-label", record.id + " 处理历程，可横向滚动");
        var table = node("table", "", "lesson-journey-table");
        var head = node("thead"), headings = node("tr");
        ["环节／时点", "人物／角色", "管理动作", "结果／依据"].forEach(function (label) {
            var th = node("th", label); th.scope = "col"; headings.append(th);
        });
        head.append(headings); table.append(head);
        var body = node("tbody");
        record.journey.forEach(function (item) {
            var row = node("tr"), stage = node("th"); stage.scope = "row";
            stage.append(node("strong", item[0]), node("small", item[1]));
            var people = node("td"), result = node("td");
            item[2].split("；").forEach(function (person) { people.append(node("span", person, "lesson-journey-line")); });
            item[4].split(/[，；]/).forEach(function (state) { result.append(node("span", state, "lesson-journey-line")); });
            if (item[5]) { var link = node("a", item[5][0]); link.href = item[5][1]; result.append(link); }
            row.append(stage, people, node("td", item[3]), result); body.append(row);
        });
        table.append(body); wrap.append(table); section.append(wrap); detail.append(section);
    }
    function updateLessonInterpretation() {
        if (!helpDialog || helpDialog.dataset.lessonInterpretation !== "true") { return; }
        var container = helpDialog.querySelector(".lesson-interpretation");
        container.replaceChildren();
        var tabs = node("nav", "", "lesson-interpretation-tabs");
        tabs.setAttribute("aria-label", "选择经验解读");
        records.forEach(function (record) {
            var button = node("button", record.id);
            button.type = "button"; button.setAttribute("aria-pressed", String(record.id === selectedId));
            button.setAttribute("aria-label", record.id + " " + record.title);
            button.addEventListener("click", function () { selectRecord(record.id); container.querySelector('[aria-pressed="true"]').focus(); });
            tabs.append(button);
        });
        var record = records.find(function (item) { return item.id === selectedId; }) || records[0];
        container.append(tabs, node("h3", record.id + " · " + record.title));
        record.interpretation.forEach(function (item) {
            var section = node("section", "", "lesson-interpretation-point");
            section.append(node("h4", item[0]), node("p", item[1])); container.append(section);
        });
        var common = node("aside", "", "lesson-interpretation-common");
        common.append(node("h4", "记录维护与行动责任"), node("p", "许静维护登记单和证据链接；各条经验的行动负责人推动具体改进。完成登记，不等于完成行动。以上分工为拟定安排。"));
        container.append(common);
    }
    function node(tag, text, className) {
        var element = document.createElement(tag);
        if (text) { element.textContent = text; }
        if (className) { element.className = className; }
        return element;
    }
    function field(list, label, content) {
        var row = node("div");
        row.append(node("dt", label));
        var value = node("dd");
        if (typeof content === "string") { value.textContent = content; } else { value.append(content); }
        row.append(value);
        list.append(row);
    }
    function paragraphs(items) {
        var group = node("div");
        items.forEach(function (item) {
            var p = node("p");
            p.append(node("strong", item[0] + "："), document.createTextNode(item[1]));
            group.append(p);
        });
        return group;
    }
    function build(section, configuration) {
        activeRecords = configuration ? configuration.records : records;
        var header = node("header", "", "lesson-document-heading");
        var title = node("div");
        title.append(node("p", configuration ? configuration.eyebrow : "REN-001 · 项目记录单 / 经验教训", "lesson-document-eyebrow"));
        var heading = node("h1", configuration ? configuration.title : "经验教训记录单");
        heading.id = "lesson-document-title";
        if (configuration && configuration.titleParts) {
            heading.replaceChildren();
            configuration.titleParts.forEach(function (part) { heading.append(node("span", part, "business-title-part")); });
        }
        title.append(heading);
        var print = node("button", configuration && configuration.printLabel || "打印完整记录单", "lesson-print");
        print.type = "button";
        print.addEventListener("click", function () { window.print(); });
        var actions = node("div", "", "lesson-document-actions");
        var help = node("button", configuration ? "字段与职责说明" : "案例解读", "lesson-help-button");
        help.type = "button";
        help.setAttribute("aria-haspopup", "dialog");
        help.setAttribute("aria-controls", "lesson-help-dialog");
        help.addEventListener("click", function () {
            helpDialog.showModal();
            document.body.classList.add("lesson-help-open");
        });
        actions.append(help);
        header.append(title, actions);
        section.append(header);
        var metadata = node("dl", "", "lesson-document-meta");
        if (configuration) {
            configuration.metadata.forEach(function (item) { field(metadata, item[0], item[1]); });
        } else {
            field(metadata, "所属项目", "住宅全屋装修项目");
            field(metadata, "版本／性质", "v1.0 · 教学实例");
            field(metadata, "维护／审查", "许静 / 陈默（拟定）");
            field(metadata, "当前记录", "3 条 · 均有行动或效果待核验");
        }
        section.append(metadata);
        if (configuration && configuration.buildContent) {
            configuration.buildContent(section);
            var documentFooter = node("footer", "", "lesson-document-footer");
            documentFooter.append(print);
            section.append(documentFooter);
            return;
        }
        var wrap = node("div", "", "lesson-table-wrap");
        wrap.tabIndex = 0;
        wrap.setAttribute("role", "region");
        wrap.setAttribute("aria-label", (configuration ? configuration.title : "经验教训登记总表") + "，可滚动");
        if (configuration && configuration.searchable) { wrap.classList.add("lesson-scroll-list"); }
        var table = node("table", "", "lesson-table");
        table.append(node("caption", configuration ? configuration.caption : "经验教训登记总表 · 3 条"));
        var thead = node("thead"), tr = node("tr");
        (configuration ? configuration.columns : ["编号 / 经验摘要", "类型 / 优先级", "行动负责人", "当前状态", "完整记录"]).forEach(function (text) {
            var th = node("th", text); th.scope = "col"; tr.append(th);
        });
        thead.append(tr); table.append(thead);
        var tbody = node("tbody");
        var details = node("div", "", "lesson-details");
        activeRecords.forEach(function (record) {
            var summary = node("tr", "", "lesson-summary-row");
            summary.dataset.recordId = record.id;
            var name = node("th"); name.scope = "row";
            name.append(node("strong", record.id), node("span", record.title));
            var cells = record.summary || [configuration ? record.product : record.type + " · " + record.priority, record.owner, record.status];
            summary.append(name);
            cells.forEach(function (text) { summary.append(node("td", text)); });
            var control = node("td"), button = node("button", "查看", "lesson-select");
            button.type = "button";
            button.setAttribute("aria-label", "查看 " + record.id + " 完整记录");
            button.setAttribute("aria-pressed", "false");
            button.setAttribute("aria-controls", "lesson-detail-" + record.id);
            control.append(button); summary.append(control); tbody.append(summary);
            var detail = node("article", "", "lesson-detail");
            detail.id = "lesson-detail-" + record.id;
            detail.hidden = true;
            detail.setAttribute("aria-labelledby", "lesson-title-" + record.id);
            var detailHeading = node("header", "", "lesson-record-heading");
            var recordHeading = node("h2", record.id + " · " + record.title);
            recordHeading.id = "lesson-title-" + record.id;
            detailHeading.append(node("span", "完整记录", "lesson-document-eyebrow"), recordHeading);
            detail.append(detailHeading);
            var list = node("dl", "", "lesson-record-fields");
            if (configuration) {
                record.fields.forEach(function (item) {
                    field(list, item[0], Array.isArray(item[1]) ? paragraphs(item[1]) : item[1]);
                });
            } else {
                field(list, "经验教训标识符", record.id);
                field(list, "经验教训描述", paragraphs(record.description));
                field(list, "经验教训类型", record.type);
                field(list, "经验教训负责人", record.responsibility);
                field(list, "分级", "优先级：" + record.priority + "；严重性：" + record.severity + "。");
                field(list, "状态", record.status + "。" + record.history);
                field(list, "经验教训相关日期", paragraphs(record.dates));
            }
            var references = node("div");
            if (record.referenceText) { references.append(node("p", record.referenceText)); }
            record.sources.forEach(function (source) {
                var p = node("p"), a = node("a", source[0]); a.href = source[1]; p.append(a); references.append(p);
            });
            if (record.missing) { references.append(node("p", record.missing)); }
            if (configuration && configuration.referenceLabel) {
                field(list, configuration.referenceLabel, references);
            } else {
                field(list, "记录", references);
            }
            detail.append(list);
            if (!configuration) { buildJourney(detail, record); }
            details.append(detail);
            summary.addEventListener("click", function () {
                selectRecord(record.id);
            });
        });
        table.append(tbody); wrap.append(table);
        if (configuration && configuration.searchable) {
            var searchBar = node("div", "", "lesson-document-search");
            var label = node("label", "查找产品");
            var input = node("input");
            input.type = "search";
            input.id = "register-product-search";
            input.placeholder = "名称、编号、负责人或状态";
            label.htmlFor = input.id;
            var count = node("span", "共 " + activeRecords.length + " 项");
            count.setAttribute("role", "status");
            searchBar.append(label, input, count);
            section.append(searchBar);
            input.addEventListener("input", function () {
                var query = input.value.trim().toLowerCase();
                var visibleIds = [];
                tbody.querySelectorAll(".lesson-summary-row").forEach(function (row) {
                    row.hidden = !row.textContent.toLowerCase().includes(query);
                    if (!row.hidden) { visibleIds.push(row.dataset.recordId); }
                });
                count.textContent = visibleIds.length ? "显示 " + visibleIds.length + " / " + activeRecords.length + " 项" : "无匹配产品";
                details.hidden = !visibleIds.length;
                if (visibleIds.length) { selectRecord(visibleIds.includes(selectedId) ? selectedId : visibleIds[0]); }
            });
        }
        section.append(wrap);
        section.append(details);
        var footer = node("footer", "", "lesson-document-footer");
        footer.append(print);
        section.append(footer);
        selectRecord(selectedId);
    }
    function selectRecord(id) {
        selectedId = activeRecords.some(function (record) { return record.id === id; }) ? id : activeRecords[0].id;
        var section = document.getElementById("lesson-register-section");
        section.querySelectorAll(".lesson-summary-row").forEach(function (row) {
            var active = row.dataset.recordId === selectedId;
            row.classList.toggle("is-selected", active);
            var button = row.querySelector("button");
            button.setAttribute("aria-pressed", String(active));
            button.textContent = active ? "当前" : "查看";
        });
        section.querySelectorAll(".lesson-detail").forEach(function (detail) {
            detail.hidden = detail.id !== "lesson-detail-" + selectedId;
        });
        var scrollList = section.querySelector(".lesson-scroll-list");
        var selectedRow = section.querySelector(".lesson-summary-row.is-selected");
        if (scrollList && selectedRow && scrollList.clientHeight) {
            var bounds = scrollList.getBoundingClientRect();
            var rowBounds = selectedRow.getBoundingClientRect();
            var headerHeight = scrollList.querySelector("thead").getBoundingClientRect().height;
            if (rowBounds.top < bounds.top + headerHeight) { scrollList.scrollTop += rowBounds.top - bounds.top - headerHeight; }
            else if (rowBounds.bottom > bounds.bottom) { scrollList.scrollTop += rowBounds.bottom - bounds.bottom; }
        }
        try { sessionStorage.setItem(selectionKey, selectedId); } catch (error) { /* 不阻断阅读。 */ }
        updateLessonInterpretation();
    }
    function arrangeExplanations(active, lessons) {
        if (active && !helpDialog) {
            helpDialog = node("dialog", "", "lesson-help-dialog");
            helpDialog.id = "lesson-help-dialog";
            helpDialog.setAttribute("aria-labelledby", "lesson-help-title");
            var heading = node("header", "", "lesson-help-heading");
            var title = node("h2", "字段与职责说明");
            title.id = "lesson-help-title";
            var close = node("button", "关闭", "lesson-help-close");
            close.type = "button";
            close.setAttribute("aria-label", "关闭字段与职责说明");
            close.addEventListener("click", function () { helpDialog.close(); });
            heading.append(title, close);
            var helpContent = node("div", "", "lesson-help-content");
            helpContent.append(node("div", "", "lesson-legacy-explanation"), node("div", "", "lesson-interpretation"));
            helpDialog.append(heading, helpContent);
            helpDialog.addEventListener("close", function () { document.body.classList.remove("lesson-help-open"); });
            helpDialog.addEventListener("click", function (event) {
                var rect = helpDialog.getBoundingClientRect();
                if (event.target === helpDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) { helpDialog.close(); }
            });
            document.body.append(helpDialog);
            ["definition-section", "composition-section", "roles-section", "lifecycle-section", "case-section"].forEach(function (id) {
                var element = document.getElementById(id);
                var marker = document.createComment("lesson-explanation-" + id);
                element.before(marker);
                placements.push({ element: element, marker: marker });
            });
        }
        if (!helpDialog) { return; }
        helpDialog.dataset.lessonInterpretation = String(Boolean(lessons));
        helpDialog.querySelector("#lesson-help-title").textContent = lessons ? "案例解读" : "字段与职责说明";
        helpDialog.querySelector(".lesson-help-close").setAttribute("aria-label", lessons ? "关闭案例解读" : "关闭字段与职责说明");
        helpDialog.querySelector(".lesson-legacy-explanation").hidden = Boolean(lessons);
        helpDialog.querySelector(".lesson-interpretation").hidden = !lessons;
        if (!active && helpDialog.open) { helpDialog.close(); }
        placements.forEach(function (placement) {
            if (active) { helpDialog.querySelector(".lesson-legacy-explanation").append(placement.element); }
            else { placement.marker.after(placement.element); }
        });
        if (lessons) { updateLessonInterpretation(); }
    }
    window.PRINCE2LessonRegister = {
        records: records,
        render: function (slug, mode) {
            var section = document.getElementById("lesson-register-section");
            var configuration = slug === "full-business-case" ? window.PRINCE2BusinessCaseDocument :
                (slug === "quality-register" ? window.PRINCE2QualityRegister : (window.PRINCE2RegisterDocuments || {})[slug]);
            var supported = slug === "lessons-log" || Boolean(configuration);
            var active = supported && mode === "case";
            arrangeExplanations(active, active && slug === "lessons-log");
            if (active && (!section.children.length || section.dataset.documentSlug !== slug)) {
                selectionKey = "prince2-" + slug + "-selected-v1";
                selectedId = "";
                try { selectedId = sessionStorage.getItem(selectionKey) || ""; } catch (error) { /* 存储不可用时使用首条。 */ }
                section.replaceChildren();
                section.dataset.documentSlug = slug;
                build(section, configuration);
            }
            section.hidden = !active;
            // 关联记录链接优先选中指定条目，避免打开登记单后仍停留在首条。
            if (active && !(configuration && configuration.buildContent)) {
                var recordHash = location.hash.slice(1);
                try { recordHash = decodeURIComponent(recordHash); } catch (error) { /* 无效编码不影响默认记录。 */ }
                if (recordHash.indexOf("lesson-detail-") === 0) {
                    var linkedId = recordHash.slice("lesson-detail-".length);
                    if (activeRecords.some(function (record) { return record.id === linkedId; })) { selectRecord(linkedId); }
                }
            }
            section.querySelectorAll("[data-business-anchor]").forEach(function (chapter) {
                if (active) { chapter.dataset.viewAnchor = chapter.dataset.businessAnchor; }
                else { delete chapter.dataset.viewAnchor; }
            });
            document.body.classList.toggle("has-lesson-document", active);
            var nav = document.querySelector('#detail-view-toolbar nav');
            if (!nav) { return; }
            var link = nav.querySelector("[data-lesson-document-link]");
            if (!link && supported) {
                link = node("a", slug === "full-business-case" ? "商业论证文件" : "记录单实例");
                link.href = "#lesson-register-section";
                link.dataset.lessonDocumentLink = "true";
                nav.prepend(link);
            }
            if (link) { link.hidden = !active; }
        }
    };
}());
