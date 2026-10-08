(function () {
    "use strict";

    var budget = window.PRINCE2BusinessCaseDocument.budget;
    var schedule = [
        { name: "启动与设计确认", start: 2, end: 3, products: "DEC-001；项目层计划", dependency: "家庭需求、现场勘查", owner: "陈默、宋妍" },
        { name: "拆除与基层交接", start: 4, end: 5, products: "DEM-003", dependency: "设计确认、进场条件", owner: "赵建国" },
        { name: "水电隐蔽工程", start: 5, end: 7, products: "MEP-006", dependency: "基层交接、点位确认", owner: "赵建国" },
        { name: "防水与闭水检查", start: 6, end: 8, products: "WPF-011", dependency: "基层及相关隐蔽接口检查", owner: "赵建国、王志衡" },
        { name: "墙地面饰面", start: 9, end: 11, products: "FIN-014", dependency: "相关隐蔽工程与防水检查通过", owner: "赵建国" },
        { name: "定制柜体与木门安装", start: 12, end: 15, products: "CAB-016、DOOR-018", dependency: "尺寸确认、排产交期、饰面条件", owner: "陆明远、赵建国" },
        { name: "设备安装与调试", start: 14, end: 15, products: "ELE-021", dependency: "饰面及安装接口就绪", owner: "赵建国" },
        { name: "家庭验收与资料移交", start: 16, end: 16, products: "HOME-025、HAN-024", dependency: "系统验收、问题处置、资料汇总", owner: "陈默、林悦、许静" }
    ];
    function node(tag, text, className) {
        var element = document.createElement(tag);
        if (text != null) { element.textContent = String(text); }
        if (className) { element.className = className; }
        return element;
    }
    function reference(text, href) { return { text: text, href: href }; }
    function flowNode(terms, separator) {
        var element = node("div", null, "plan-flow-node");
        terms.forEach(function (term, index) {
            if (index) { element.append(document.createTextNode(Array.isArray(separator) ? separator[index - 1] : separator)); }
            element.append(node("span", term, "plan-flow-term"));
        });
        return element;
    }
    function table(parent, caption, headers, rows) {
        var wrap = node("div", null, "business-table-wrap");
        wrap.tabIndex = 0;
        wrap.setAttribute("role", "region");
        wrap.setAttribute("aria-label", caption + "，可横向滚动");
        var grid = node("table", null, "business-table");
        grid.append(node("caption", caption));
        var head = node("thead"), header = node("tr"), body = node("tbody");
        headers.forEach(function (label) { var cell = node("th", label); cell.scope = "col"; header.append(cell); });
        head.append(header);
        rows.forEach(function (row) {
            var tr = node("tr");
            row.forEach(function (value, index) {
                var cell = node(index ? "td" : "th");
                if (!index) { cell.scope = "row"; }
                if (value && value.href) { var link = node("a", value.text); link.href = value.href; cell.append(link); }
                else if (!index && / [·→] /.test(String(value))) {
                    String(value).split(/ (?=[·→] )/).forEach(function (part, partIndex) {
                        if (partIndex) { cell.append(document.createTextNode(" ")); }
                        cell.append(node("span", part, "business-label-part"));
                    });
                }
                else { cell.textContent = String(value); }
                tr.append(cell);
            });
            body.append(tr);
        });
        grid.append(head, body); wrap.append(grid); parent.append(wrap);
    }
    function note(parent, label, text) {
        var p = node("p", null, "business-note");
        p.append(node("strong", label + "："), document.createTextNode(text)); parent.append(p);
    }
    function buildProducts(section) {
        var pbs = node("div", null, "plan-product-breakdown");
        pbs.append(node("h3", "产品分解结构"));
        var roots = node("ul");
        var home = node("li", "HOME-025 · 可入住住宅"), systems = node("ul");
        ["DEC-001 · 全屋设计方案", "DEM-003 · 拆除与基层交接成果", "MEP-006 · 水电隐蔽工程", "WPF-011 · 卫生间防水系统", "FIN-014 · 墙地面饰面系统", "CAB-016 · 定制柜体系统", "DOOR-018 · 定制木门系统", "ELE-021 · 灯具及电气设备"].forEach(function (text) { systems.append(node("li", text)); });
        home.append(systems); roots.append(home, node("li", "HAN-024 · 竣工资料包")); pbs.append(roots); section.append(pbs);
        var figure = node("figure", null, "plan-product-flow");
        figure.append(node("figcaption", "产品流程图"));
        figure.append(node("div", "DEC-001 设计方案确认", "plan-flow-node"));
        figure.append(node("p", "↓ 并行准备", "plan-flow-connector"));
        var branches = node("div", null, "plan-flow-branches");
        branches.append(flowNode(["DEM-003 基层", "MEP-006 水电", "WPF-011 防水", "FIN-014 饰面"], " → "), flowNode(["CAB-016 柜体、DOOR-018 木门", "测量", "排产", "到货"], " → "));
        figure.append(branches, node("p", "↓ 现场与供应条件汇合", "plan-flow-connector"), flowNode(["柜体与木门安装", "ELE-021 安装调试"], " · "), node("p", "↓ 各系统检查及资料汇总", "plan-flow-connector"), flowNode(["HOME-025 可入住住宅", "HAN-024 竣工资料包", "家庭验收与移交"], [" ＋ ", " → "]));
        section.append(figure);
        table(section, "关键交付条件", ["产品／接口", "放行条件", "描述与证据"], [
            ["MEP-006、WPF-011 → FIN-014", "隐蔽检查与闭水检查通过后，放行相应封闭和饰面工作", reference("防水产品描述与验收条件", "product-detail-v2.html?entry=product-description&mode=case")],
            ["CAB-016、DOOR-018 → 安装", "设计尺寸、排产及到货与现场条件一致", "独立产品描述待补；交期确认待补"],
            ["HOME-025、HAN-024 → 移交", "安全与功能满足验收准则，资料和遗留事项可追溯", reference("项目产品描述", "product-detail-v2.html?entry=project-product-description&mode=case")]
        ]);
    }
    function buildSchedule(section) {
        table(section, "管理阶段与授权边界", ["管理阶段", "案例周序", "交付／授权条件"], [
            ["启动阶段", "2至3周", "项目层计划、商业论证及组织安排；计划签认资料待补"],
            ["1 · 隐蔽工程", "4至8周", "基层、水电、防水；第8周核对产品、剩余风险与成本预测"],
            ["2 · 饰面与安装", "9至16周", "下一阶段授权后开展；最终完成家庭验收及资料移交"]
        ]);
        var wrap = node("div", null, "plan-schedule-scroll");
        wrap.tabIndex = 0; wrap.setAttribute("role", "region"); wrap.setAttribute("aria-label", "16周计划甘特图，可横向滚动");
        var chart = node("figure", null, "plan-gantt");
        chart.append(node("figcaption", "计划进度 · 案例周序，日历起算日期待确认"));
        var header = node("div", null, "plan-gantt-row");
        header.append(node("span", "工作／周"));
        var weeks = node("div", null, "plan-gantt-track");
        for (var week = 1; week <= 16; week += 1) { weeks.append(node("span", week)); }
        header.append(weeks); chart.append(header);
        schedule.forEach(function (item) {
            var row = node("div", null, "plan-gantt-row");
            row.append(node("span", item.name));
            var track = node("div", null, "plan-gantt-track");
            var bar = node("span", null, "plan-gantt-bar");
            bar.style.gridColumn = item.start + " / " + (item.end + 1);
            bar.setAttribute("aria-label", item.name + "，第" + item.start + "至" + item.end + "周");
            bar.title = bar.getAttribute("aria-label"); track.append(bar); row.append(track); chart.append(row);
        });
        wrap.append(chart); section.append(wrap);
        table(section, "进度与前置条件", ["计划时段", "交付产品", "前置条件", "负责人"], schedule.map(function (item) { return ["第" + item.start + (item.start === item.end ? "" : "至" + item.end) + "周", item.products, item.dependency, item.owner]; }));
        note(section, "供应接口", "柜体、木门采购与现场工作并行；提前期和排产日期待供应方确认。甘特条表示计划，不表示实际完成。");
    }
    function buildContent(root) {
        var entry = window.PRINCE2_PRODUCT_DETAILS_V2.entries["project-plan"];
        var contents = node("nav", null, "business-contents plan-contents");
        contents.setAttribute("aria-label", "项目计划文档章节"); root.append(contents);
        entry.composition.items.forEach(function (item, index) {
            var section = node("section", null, "business-chapter plan-chapter");
            section.id = "project-plan-chapter-" + (index + 1);
            section.dataset.businessAnchor = "composition-" + item.label;
            var heading = node("h2", String(index + 1).padStart(2, "0") + "  " + item.label);
            heading.id = section.id + "-title"; section.setAttribute("aria-labelledby", heading.id); section.append(heading);
            var anchor = node("a", item.label); anchor.href = "#" + section.id; contents.append(anchor);
            if (index === 0) {
                table(section, "范围与交付边界", ["范围", "项目层约定"], [
                    ["最终交付", "128㎡住宅的设计、施工、安装、家庭验收和资料移交；HOME-025与HAN-024"],
                    ["不包含", "前期搬迁准备、入住后日常维护；项目后收益复查另行安排"],
                    ["地点与用户", "现有住宅；三代家庭，具体施工地址待补"],
                    ["交付方式", "设计、施工和供应接口受控交接；阶段细节在阶段计划内展开"]
                ]);
            }
            if (index === 1) {
                table(section, "外部依赖", ["依赖事项", "确认人", "凭据状态"], [
                    ["物业作业时段、进场与垃圾清运条件", "陈默协调物业", "作业许可及约束确认待补"],
                    ["家庭需求及关键点位确认", "林悦协调家庭用户", "确认记录待补"],
                    ["定制主材供货及排产", "陆明远协调供应方", "排产、到货确认待补"],
                    ["资金与付款条件", "周诚协调资金", "付款节点和到位凭据待补"]
                ]);
            }
            if (index === 2) {
                table(section, "假设与先决条件", ["条件", "验证／维持", "当前状态"], [
                    ["住宅可按约定移交施工", "开工前确认施工面与作业条件", "确认待补"],
                    ["设计和质量要求可供工作包执行", "核对产品描述、图纸和验收方法", "防水描述已有；其他专业描述待补"],
                    ["长期主材提前期满足安装接口", "按阶段核实采购与排产", "供应确认待补"],
                    ["关键基层条件满足方案假设", "勘查、开拆后核查，更新风险和成本预测", "核查记录待补"]
                ]);
            }
            if (index === 3) {
                table(section, "经验与计划动作", ["经验记录", "拟纳入的计划动作", "审查与核验"], [
                    [reference("LES-001 · 封闭前检查留照", "product-detail-v2.html?entry=lessons-log&mode=case#lesson-detail-LES-001"), "安排隐蔽检查点与照片交接", "陈默审查；实施及效果待核验"],
                    [reference("LES-002 · 点位样板", "product-detail-v2.html?entry=lessons-log&mode=case#lesson-detail-LES-002"), "设计确认前安排定位样板", "来源与适用性审查待确认"],
                    [reference("LES-003 · 主材预警", "product-detail-v2.html?entry=lessons-log&mode=case#lesson-detail-LES-003"), "设置排产确认与供应预警检查点", "应用和供应核验待确认"]
                ]);
                note(section, "审查状态", "历史经验已录入；审查通过、正式纳入及效果核验记录待补。");
            }
            if (index === 4) { buildProducts(section); }
            if (index === 5) {
                table(section, "工作分解与工作包接口", ["顶层工作", "产品／成果", "交付负责人", "工作包接口"], [
                    ["设计确认", "DEC-001", "宋妍 · 设计小组经理", "图纸、点位及验收规格，待补详细工作包"],
                    ["拆除与基层", "DEM-003", "赵建国 · 施工小组经理", "施工面及基层交接条件"],
                    ["水电与防水", "MEP-006、WPF-011", "赵建国 · 施工小组经理", reference("防水工作包描述", "product-detail-v2.html?entry=work-package-description&mode=case")],
                    ["饰面与定制安装", "FIN-014、CAB-016、DOOR-018", "陆明远协调供应，赵建国组织施工", "测量、生产、到货与安装接口"],
                    ["设备与交接", "ELE-021、HOME-025、HAN-024", "赵建国交付，陈默协调，许静整理", "系统检查、家庭验收与资料清单"]
                ]);
                note(section, "资源安排", "专业班组人数、设备占用和供应商资源承诺待确认；各工作包约定质量方法、报告节奏与容许偏差。");
            }
            if (index === 6) {
                table(section, "成本分配（万元）", ["费用项", "金额"], budget.concat([["合计", budget.reduce(function (sum, row) { return sum + row[1]; }, 0)]]));
                table(section, "预算控制", ["项目", "约定／待确认"], [
                    ["总投入", "42万元上限，5万元风险余量包含在内"],
                    ["变更预算", "独立划分与使用权限待确认；不得额外叠加至42万元之外"],
                    ["资金与付款", "周诚协调资金；合同付款节点、资金明细和凭据待补"],
                    ["阶段预测", "陈默核对已支出、承诺成本、剩余估算和完工预测；金额记录待补"]
                ]);
            }
            if (index === 7) { buildSchedule(section); }
            if (index === 8) {
                table(section, "项目绩效边界", ["维度", "目标／容许边界", "核验依据"], [
                    ["时间", "目标16周，项目层最多延后1周", "完工预测与阶段审查记录"],
                    ["成本", "总投入不突破42万元", "实际、承诺、剩余成本预测"],
                    ["范围", "住宅与资料包完整移交；范围变化经影响评估和授权", "产品登记单及变更决定"],
                    ["质量", "防水和用电安全不接受降级", "产品描述、检查与复验记录"],
                    ["收益", "安全、收纳、适用性改善；其他收益阈值待明确", "家庭验收及项目后收益复查"],
                    ["可持续性", "关键维护可达、维护资料完整；寿命指标待确认", "检修接口与维护资料"],
                    ["风险", "跟踪基层、排产及关键质量风险；量化阈值待确认", "风险登记单及应对核验"]
                ]);
            }
            if (index === 9) {
                table(section, "监视、控制与报告", ["环节／频率", "负责人", "检查与记录", "交接／决定"], [
                    ["工作包检查 · 拟每周", "赵建国、宋妍向陈默反馈", "进展、检查结果、问题及交付预测", "检查点信息，报告文件待补"],
                    ["项目复查 · 拟每周", "陈默，许静协助", "产品、风险、问题、实际及剩余成本", "要点信息及需升级事项"],
                    ["阶段边界 · 第8周", "陈默提交，项目管理委员会审查", "本阶段完成情况、更新计划、下一阶段资源", "授权决定及凭据待补"],
                    ["例外预测 · 随时", "陈默向项目管理委员会报告", "预测超出容许偏差的影响及选项", "按权限决定是否重新规划，例外文件待补"],
                    ["收尾 · 第16周计划", "陈默协调，林悦参与验收，许静整理", "住宅验收、资料、遗留事项和交接", "验收及关闭资料待补"]
                ]);
                table(section, "版本与授权记录", ["版本／时点", "内容", "责任／核验状态"], [
                    ["v1.0拟稿 · 启动阶段整理", "16周目标、42万元边界、产品与管理阶段安排", "陈默编制；独立计划授权状态待确认"],
                    ["阶段边界复查 · 计划第8周", "实际与剩余预测、下一阶段资源", "更新版本、审查及批准记录待补"],
                    ["收尾审查 · 计划第16周", "交付差异、遗留问题和移交", "实际审查结果待补"]
                ]);
                var refs = node("ul", null, "business-references");
                [["完整商业论证", "full-business-case"], ["项目产品描述", "project-product-description"], ["产品登记单", "product-register"], ["风险登记单", "risk-register"], ["问题登记单", "issue-register"], ["质量登记单", "quality-register"]].forEach(function (ref) { var li = node("li"), link = node("a", ref[0]); link.href = "product-detail-v2.html?entry=" + ref[1] + "&mode=case"; li.append(link); refs.append(li); });
                section.append(refs);
            }
            root.append(section);
        });
    }
    window.PRINCE2ProjectPlanDocument = {
        title: "住宅全屋装修项目计划", titleParts: ["住宅全屋装修项目", "计划"],
        eyebrow: "REN-001 · A9 计划 · 项目计划",
        metadata: [
            ["版本／性质", "v1.0拟稿 · 教学虚构案例"], ["文件时点", "启动阶段整理版"],
            ["编制／维护", "陈默 · 项目经理／许静 · 项目支持"], ["审查／授权", "项目管理委员会 · 状态待确认"],
            ["投资／工期", "42万元上限 · 16周目标"], ["周序／凭据", "案例周序；起算与签认待补"]
        ],
        printLabel: "打印项目计划", documentLinkLabel: "项目计划文件", budget: budget, schedule: schedule, buildContent: buildContent
    };
}());
