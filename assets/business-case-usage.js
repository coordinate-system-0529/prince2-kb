(function () {
    "use strict";

    var activeMode = "theory", activeSlug = "", selected = "prepare", readingScene = false;
    var roles = [
        { role: "业务层", person: "授权主体待确认", identity: "项目外部" },
        { role: "项目总监", person: "周诚", identity: "业主" },
        { role: "高级用户", person: "林悦", identity: "业主" },
        { role: "高级供应商", person: "陆明远", identity: "装修公司负责人" },
        { role: "项目经理", person: "陈默", identity: "受托项目经理" },
        { role: "小组经理", person: "宋妍／赵建国", identity: "设计师／施工包工头" },
        { role: "项目保证", person: "王志衡", identity: "第三方监理" },
        { role: "项目支持", person: "许静", identity: "资料协调专员" }
    ];
    // 八个角色列按教材排列，概要与完整编制行已对照原始PDF表13.2、表15.2。
    var activities = {
        "outline-business-case": [
            { id: "prepare", scene: "prepare", flow: "SU", label: "准备概要商业论证", raci: ["C", "A/R", "C³", "C³", "R", "", "", ""], source: ["表13.2", "../chapters/ch13.html#s13-4-3"] },
            { id: "authorize", scene: "authorize", flow: "DP", label: "授权启动", raci: ["I", "A/R", "", "", "", "", "", ""], source: ["表14.2", "../chapters/ch14.html#pn-12"] }
        ],
        "full-business-case": [
            { id: "prepare", scene: "prepare", flow: "IP", label: "准备完整的商业论证", raci: ["", "A", "C", "C", "R", "C", "C", "I"], source: ["表15.2", "../chapters/ch15.html#pn-10"] },
            { id: "authorize", scene: "authorize", flow: "DP", label: "授权项目", raci: ["I", "A/R", "C", "C", "I", "I", "C", "I"], source: ["表14.2", "../chapters/ch14.html#pn-12"] },
            { id: "control", scene: "control", flow: "CS", label: "评价阶段状态", raci: ["", "A", "C", "C", "R", "C", "C", "C"], source: ["表16.2", "../chapters/ch16.html#pn-17"] },
            { id: "update", scene: "boundary", flow: "SB", label: "更新商业论证", raci: ["", "A", "C", "C", "R", "C", "C", "C"], source: ["表18.2", "../chapters/ch18.html#pn-15"] },
            { id: "stage-authorize", scene: "boundary", flow: "DP", label: "授权阶段或例外计划", raci: ["I", "A/R", "C", "C", "I", "I", "C", "I"], source: ["表14.2", "../chapters/ch14.html#pn-12"] },
            { id: "close", scene: "close", flow: "CP", label: "评估项目", raci: ["", "A", "C", "C", "R", "C", "C", "C"], source: ["表19.2", "../chapters/ch19.html#pn-13"] },
            { id: "close-authorize", scene: "close", flow: "DP", label: "授权项目收尾", raci: ["I", "A/R", "C", "C", "I", "I", "C", "I"], source: ["表14.2", "../chapters/ch14.html#pn-12"] }
        ]
    };
    function field(number, label) { return { field: number, label: label }; }
    function product(slug, label) { return { slug: slug, label: label }; }
    function step(actor, materials, theory, example, result, recipient) {
        return { actor: actor, materials: materials, theory: theory, example: example, result: result, recipient: recipient };
    }
    var scenes = {
        "outline-business-case": [
            {
                id: "prepare", name: "形成概要", flow: "SU", trigger: "项目任务书已提供", caseTrigger: "第1周，比较住宅装修选项", state: "教学案例 · 概要v1.0",
                output: "概要商业论证 → 纳入项目概述文件", source: ["13.4.3 准备概要商业论证", "../chapters/ch13.html#s13-4-3"],
                steps: [
                    step([1, 2], [field(2, "02 理由"), field(4, "04 预期收益和负收益")], "依据项目任务书形成初始业务理由，咨询已任命的高级用户。", "周诚确认住宅安全与空间改善的投资理由；林悦提出安全、收纳和日常使用要求。", "业务理由与预期价值", "交陈默汇总"),
                    step([4, 2, 3], [product("project-product-description", "项目产品描述"), field(3, "03 业务选项"), field(6, "06 时间"), field(7, "07 成本")], "协商交付范围与可行选项，形成初步成本和时间估计。", "陈默比较不采取行动、局部维修、全屋受控装修；林悦确认需求，陆明远提供交付可行性输入。", "推荐选项与42万元、16周边界", "交周诚审查"),
                    step([4, 1], [product("daily-log", "日志"), field(9, "09 主要风险"), product("project-brief", "项目概述文件")], "汇总影响可行性的主要风险，将概要商业论证纳入项目概述文件。", "陈默汇总防水、主材排产和变更风险，形成项目概述文件v1.0；周诚核对业务理由。", "概要v1.0与启动请求", "提交项目管理委员会")
                ]
            },
            {
                id: "authorize", name: "启动决策", flow: "DP", trigger: "收到启动请求", caseTrigger: "第1周，审查是否投入启动阶段", state: "案例记录 · 第1周批准启动",
                output: "启动授权 → 开始详细论证，不等于授权整个项目", source: ["14.4.1 授权启动", "../chapters/ch14.html#pn-6"],
                steps: [
                    step([1], [product("project-brief", "项目概述文件"), field(1, "01 内容概要"), field(3, "03 业务选项"), field(9, "09 主要风险")], "检查业务理由、范围与主要风险，决定是否值得投入启动工作。", "周诚审查全屋受控装修建议及42万元成本边界；案例第1周记录为批准启动。", "启动决定", "通知陈默"),
                    step([4], [product("full-business-case", "完整商业论证"), product("project-plan", "项目计划")], "按启动授权补充详细计划、成本、风险与收益信息。", "陈默组织第2至3周的预算、计划和完整论证编制；资源承诺与签认资料待补。", "详细编制任务，承诺待补", "协调用户、供应方及保证")
                ]
            },
            {
                id: "develop", name: "细化完整版本", flow: "IP", trigger: "启动阶段补充详细信息", caseTrigger: "第2至3周，概要演进为完整论证", state: "教学情境 · 详细资料待确认",
                output: "完整商业论证 → 随项目启动文件请求项目授权", source: ["15.4.5 准备完整的商业论证", "../chapters/ch15.html#pn-10"],
                steps: [
                    step([4, 1], [product("project-plan", "项目计划"), product("risk-register", "风险登记单"), product("full-business-case", "完整商业论证")], "用计划估计的时间、成本和总体风险更新概要，形成完整商业论证。", "陈默据16周计划、42万元预算及风险余量5万元细化完整v1.0；周诚参与业务理由复查。", "完整v1.0拟稿，签认待补", "交项目保证审查"),
                    step([2, 3, 6], [product("full-business-case", "完整商业论证")], "确认收益、成本和交付可行性，独立检查论证是否满足业务及委员会要求。", "林悦核对使用价值；陆明远核对资源与成本；王志衡拟核查质量和风险依据。", "审查意见，待补", "陈默提交项目管理委员会")
                ]
            }
        ],
        "full-business-case": [
            {
                id: "prepare", name: "详细编制", flow: "IP", trigger: "启动阶段已有计划估计", caseTrigger: "第2至3周，编制完整商业论证v1.0", state: "教学情境 · 签认资料待补",
                output: "完整商业论证拟稿 → 纳入项目启动文件，提交授权", source: ["15.4.5 准备完整的商业论证", "../chapters/ch15.html#pn-10"],
                steps: [
                    step([4, 1], [product("outline-business-case", "概要商业论证"), product("project-plan", "项目计划"), field(6, "06 时间"), field(7, "07 成本")], "在项目总监参与下，用项目计划的时间、成本估计细化商业论证。", "陈默整合16周目标与42万元预算，其中风险余量5万元；周诚核对资金边界与业务理由。", "完整v1.0拟稿", "交用户、供应方核对"),
                    step([2, 3], [field(4, "04 预期收益和负收益"), field(5, "05 可持续性目标"), field(8, "08 投资评估")], "确认预期成果、收益及交付可行性，检查成本和价值的平衡。", "林悦确认安全、收纳及适用性价值；陆明远核对16周交付与成本可行性。维护成本和部分指标待确认。", "收益与可行性输入，部分数据待确认", "交陈默完善"),
                    step([6, 4, 7], [field(9, "09 主要风险"), product("risk-register", "风险登记单"), field(10, "10 参考资料")], "独立检查论证与业务要求的一致性，整理版本及依据并请求批准。", "王志衡拟核查质量与风险依据；陈默汇总审查意见；许静整理版本、引用和签认资料。", "完整论证与授权材料，签认待补", "提交项目管理委员会")
                ]
            },
            {
                id: "authorize", name: "项目授权", flow: "DP", trigger: "收到项目授权请求", caseTrigger: "审查42万元、16周及预期使用价值", state: "教学情境 · 批准凭据待补",
                output: "项目授权决定 → 批准基准或退回完善", source: ["14.4.2 授权项目", "../chapters/ch14.html#pn-7"],
                steps: [
                    step([2, 3, 6], [field(4, "04 预期收益和负收益"), field(7, "07 成本"), field(9, "09 主要风险"), product("project-plan", "项目计划")], "从用户、供应方和保证视角审查项目是否可取、可行且可实现。", "林悦核对收益指标；陆明远核对资源与成本；王志衡拟检查风险和质量依据。", "审查意见，待补", "供周诚作出决定"),
                    step([1], [field(1, "01 内容概要"), field(8, "08 投资评估"), product("project-plan", "项目计划")], "审查完整商业论证与项目启动文件，决定是否授权整个项目。", "周诚拟结合用户、供应方及保证意见检查42万元与16周目标；批准凭据待补。", "批准、退回或不授权，凭据待补", "通知陈默与相关角色"),
                    step([7, 4], [field(10, "10 参考资料")], "记录授权决定，批准后维护商业论证基准和有效版本。", "许静拟登记签认资料及批准版本；陈默据授权边界安排交付。", "批准基准与分发记录，待补", "后续阶段控制使用")
                ]
            },
            {
                id: "control", name: "执行中检查", flow: "CS", trigger: "定期评价，或风险与问题发生变化", caseTrigger: "防水返工，检查对业务理由的影响", state: "教学情境 · 影响待评估",
                output: "可行性评价 → 纠正行动，预测超差时上报", source: ["5.3.1.2 检查、16.4.4 评价阶段状态", "../chapters/ch16.html#pn-9"],
                steps: [
                    step([4, 6], [product("issue-register", "问题登记单"), product("quality-register", "质量登记单"), field(9, "09 主要风险")], "检查问题和风险对成本、时间、成果与收益的影响。", "陈默拟评估防水返工对后续饰面、16周工期和42万元上限的影响；王志衡核查复验依据。", "影响评估，待完成", "咨询用户、供应方"),
                    step([4, 2, 3], [product("project-plan", "项目计划"), field(4, "04 预期收益和负收益"), field(6, "06 时间"), field(7, "07 成本")], "核对当前预测和容许偏差，判断业务理由是否仍成立。", "陈默拟重估剩余工期与成本；林悦核对使用价值；陆明远核对资源和排产。", "当前可行性与剩余预测，待评估", "重大偏差交项目管理委员会"),
                    step([1, 7], [field(1, "01 内容概要"), field(10, "10 参考资料")], "按授权层级处理重大变化，记录决定及版本影响。", "周诚拟审查重大影响；许静登记决定与引用。是否需要例外处置取决于容许偏差评估。", "处置决定与变更记录，待补", "陈默落实获准安排")
                ]
            },
            {
                id: "boundary", name: "阶段复查", flow: "SB → DP", trigger: "接近阶段结束", caseTrigger: "计划第8周，复查下一阶段投资合理性", state: "教学情境 · 阶段复查待安排",
                output: "更新商业论证 → 下一阶段授权或退回完善", source: ["18.4.4 更新商业论证", "../chapters/ch18.html#pn-9"],
                steps: [
                    step([4, 7], [product("project-plan", "项目计划"), product("risk-register", "风险登记单"), field(6, "06 时间"), field(7, "07 成本")], "核对实际绩效与剩余预测，重新评估总体风险和成本时间变化。", "陈默拟汇总第4至8周实际数据，重估防水复验、木门排产及剩余成本；许静整理依据。", "实际与剩余预测，待汇总", "交周诚及用户、供应方复查"),
                    step([4, 1, 2, 3], [field(4, "04 预期收益和负收益"), field(5, "05 可持续性目标"), field(9, "09 主要风险")], "更新商业论证，咨询项目总监并复核收益、风险及外部变化。", "周诚核对持续业务理由；林悦复核预期使用价值；陆明远核对下一阶段交付能力，陈默汇编更新版。", "更新商业论证，版本待编制", "连同阶段材料提交审查"),
                    step([1, 2, 3, 6], [field(1, "01 内容概要"), product("project-plan", "项目计划")], "检查持续合理性，决定是否授权下一阶段及其容许偏差。", "周诚拟结合用户、供应方与王志衡意见作出下一阶段决定；当前批准凭据待补。", "下一阶段决定，待确认", "陈默推进，许静维护版本")
                ]
            },
            {
                id: "close", name: "收尾对照", flow: "CP → DP", trigger: "项目拟收尾", caseTrigger: "计划第16周，对照实际交付与投资", state: "教学情境 · 实际与收尾资料待补",
                output: "最终商业论证与绩效评价 → 收尾决定及后续收益安排", source: ["19.4.4 评估项目", "../chapters/ch19.html#pn-8"],
                steps: [
                    step([4, 7], [field(6, "06 时间"), field(7, "07 成本"), field(8, "08 投资评估"), product("project-plan", "项目计划")], "比较批准基准与实际绩效，更新实际成本及尚未实现的收益预测。", "陈默拟对照16周、42万元与实际交付；许静汇总变更和结算依据。实际成本、完工时间待补。", "最终绩效与商业论证，待补", "提交项目管理委员会"),
                    step([2, 6], [field(4, "04 预期收益和负收益"), field(5, "05 可持续性目标"), product("quality-register", "质量登记单")], "区分已实现的成果与待确认收益，明确项目后评审责任。", "林悦拟核对家庭验收和使用要求；王志衡核查检查依据。入住后1个月、6个月复查仍待安排。", "验收依据与收益复查安排，待补", "移交后续使用与维护责任人"),
                    step([1], [field(1, "01 内容概要"), field(10, "10 参考资料")], "审查收尾材料和后续行动，决定是否授权项目收尾。", "周诚拟结合用户、供应方与保证意见审查；收尾授权尚未形成。", "收尾决定，待确认", "业务层及后续责任人")
                ]
            },
            {
                id: "benefits", name: "收益确认", flow: "项目期间／项目后", trigger: "到达收益评审时点", caseTrigger: "入住后1个月、6个月，复查使用价值", state: "教学情境 · 评审待安排",
                output: "实际收益与预测比较 → 收益评审记录及后续行动", source: ["5.3.1.4 确认、5.6 关键职责", "../chapters/ch05.html#pn-12"],
                steps: [
                    step([2], [field(4, "04 预期收益和负收益"), field(5, "05 可持续性目标")], "按收益管理安排收集实际指标，比较成果产生的收益与预测。", "林悦拟复查安全、收纳、日常适用性及运行维护情况；当前无入住后测量结果。", "实际使用与收益数据，待测量", "提交收益评审责任人"),
                    step([0, 2], [field(4, "04 预期收益和负收益"), field(8, "08 投资评估")], "业务层对项目后收益管理问责，高级用户确认实际收益与未实现收益。", "林悦拟提供实际与预测对比；项目外部收益评审授权主体及后续行动待确认。", "收益评审与改进行动，待确认", "后续使用与维护责任人")
                ]
            }
        ]
    };
    function node(tag, text, className) {
        var element = document.createElement(tag);
        if (text != null) { element.textContent = text; }
        if (className) { element.className = className; }
        return element;
    }
    function link(label, href) { var a = node("a", label); a.href = href; return a; }
    function materialHref(material) {
        if (!material.field) {
            // 日志尚无已填实例，理论仅引用其定义，不把案例时间线当成日志。
            return material.slug === "daily-log" ? "product.html#entity-日志" : "product-detail-v2.html?entry=" + material.slug + "&mode=" + activeMode;
        }
        var label = window.PRINCE2_PRODUCT_DETAILS_V2.entries[activeSlug].composition.items[material.field - 1].label;
        return activeSlug === "full-business-case" && activeMode === "case" ? "#business-case-chapter-" + material.field : "#composition-" + label;
    }
    function evidence(id, items) {
        var details = document.getElementById(id), content = details.querySelector("div");
        details.hidden = false; content.replaceChildren();
        items.forEach(function (item) { content.append(link(item[0], item[1])); });
    }
    function renderScene() {
        var scene = scenes[activeSlug].find(function (item) { return item.id === selected; });
        var panel = document.getElementById("business-usage-panel");
        panel.replaceChildren(); panel.setAttribute("aria-labelledby", "business-usage-tab-" + scene.id);
        panel.dataset.viewAnchor = "business-usage-scenario";
        var header = node("div", null, "plan-usage-context"), intro = node("div");
        intro.append(node("strong", scene.flow + " · " + scene.name), node("p", activeMode === "case" ? scene.caseTrigger : scene.trigger));
        header.append(intro, node("span", activeMode === "case" ? scene.state : "流程应用 · 项目归纳", "plan-usage-state")); panel.append(header);
        var table = node("table", null, "plan-usage-steps"), head = node("thead"), row = node("tr"), body = node("tbody");
        var columns = [["步骤", "number"], ["责任人／角色", "actor"], ["使用材料", "material"], ["管理动作", "action"], ["产出与交接", "result"]];
        columns.forEach(function (column) { var th = node("th", column[0], "plan-usage-" + column[1] + "-cell"); th.scope = "col"; row.append(th); }); head.append(row);
        scene.steps.forEach(function (item, index) {
            var tr = node("tr"), number = node("th", String(index + 1).padStart(2, "0")), actor = node("td"), materials = node("td"), action = node("td"), result = node("td"); number.scope = "row";
            [number, actor, materials, action, result].forEach(function (cell, cellIndex) { cell.className = "plan-usage-" + columns[cellIndex][1] + "-cell"; if (cellIndex) { cell.dataset.label = columns[cellIndex][0]; } });
            var people = node("div", null, "plan-usage-actors");
            item.actor.forEach(function (index) {
                var role = roles[index], person = node("span", null, "plan-usage-person");
                person.append(node("strong", activeMode === "case" ? role.person : role.role));
                if (activeMode === "case") { person.append(node("small", role.identity), node("small", "· " + role.role)); }
                people.append(person);
            }); actor.append(people);
            var links = node("div", null, "plan-usage-materials"); item.materials.forEach(function (material) {
                if (material.slug === "daily-log" && activeMode === "case") { links.append(node("span", "日志 · 待补", "business-usage-pending")); }
                else { links.append(link(material.label, materialHref(material))); }
            }); materials.append(links);
            action.append(node("p", activeMode === "case" ? item.example : item.theory));
            var parts = item.result.split("，"); result.append(node("strong", parts[0]));
            if (parts.length > 1) { result.append(node("span", parts.slice(1).join("，"), "plan-usage-result-state")); }
            result.append(node("p", "→ " + item.recipient)); tr.append(number, actor, materials, action, result); body.append(tr);
        }); table.append(head, body); panel.append(table);
        var footer = node("div", null, "plan-usage-outcome"); footer.append(node("strong", "本环节产出"), node("span", scene.output), link("原文 · " + scene.source[0], scene.source[1])); panel.append(footer);
    }
    function stabilizePanel() {
        var panel = document.getElementById("business-usage-panel");
        if (!panel || !panel.getBoundingClientRect().height) { return; }
        panel.style.minHeight = "0";
        var mode = activeMode, height = panel.getBoundingClientRect().height;
        activeMode = mode === "case" ? "theory" : "case"; renderScene(); height = Math.max(height, panel.getBoundingClientRect().height);
        activeMode = mode; renderScene(); panel.style.minHeight = Math.ceil(height) + "px";
    }
    function selectScene(id, scroll, focus, readingIntent) {
        if (!scenes[activeSlug].some(function (item) { return item.id === id; })) { id = "prepare"; }
        selected = id; if (readingIntent) { readingScene = true; }
        try { sessionStorage.setItem("prince2-" + activeSlug + "-scenario-v1", selected); } catch (error) { /* 不阻断场景选择。 */ }
        document.querySelectorAll("#business-usage .plan-usage-tab").forEach(function (tab) { var active = tab.dataset.scene === selected; tab.setAttribute("aria-selected", String(active)); tab.tabIndex = active ? 0 : -1; if (active && focus) { tab.focus(); } });
        document.querySelectorAll("#business-usage-matrix tbody tr").forEach(function (row) { var active = row.dataset.scene === selected; row.classList.toggle("is-active", active); row.querySelector("button").setAttribute("aria-pressed", String(active)); });
        renderScene(); stabilizePanel();
        if (scroll) { document.getElementById("lifecycle-section").scrollIntoView({ behavior: "instant", block: "start" }); }
    }
    function renderMatrix(container) {
        container.replaceChildren();
        var legend = node("p", null, "plan-matrix-legend");
        [["R", "执行"], ["A", "问责"], ["C", "咨询"], ["I", "知情"]].forEach(function (item) { var span = node("span"); span.append(node("b", item[0]), document.createTextNode(" " + item[1])); legend.append(span); });
        legend.append(node("span", "A不等同批准，空白表示该活动未列明。", "plan-matrix-note")); container.append(legend);
        var scroll = node("div", null, "plan-matrix-scroll"); scroll.tabIndex = 0; scroll.setAttribute("role", "region"); scroll.setAttribute("aria-label", "商业论证活动责任矩阵，可横向滚动");
        var table = node("table", null, "plan-matrix"), head = node("thead"), row = node("tr"), body = node("tbody"), title = node("th", "活动／查看使用场景"); title.scope = "col"; row.append(title);
        roles.forEach(function (role) {
            var th = node("th"); th.scope = "col"; th.append(node("strong", role.role));
            if (activeMode === "case") {
                th.append(node("span", role.person)); var identities = node("small");
                role.identity.split("／").forEach(function (text) { identities.append(node("span", text, "plan-matrix-identity")); }); th.append(identities);
            } row.append(th);
        }); head.append(row);
        activities[activeSlug].forEach(function (item) {
            var tr = node("tr"), th = node("th"); th.scope = "row"; tr.dataset.scene = item.scene; tr.dataset.viewAnchor = "business-activity-" + item.id;
            var button = node("button", item.label); button.type = "button"; button.dataset.activity = item.id; button.addEventListener("click", function () { selectScene(item.scene, true, true, true); });
            var line = node("div", null, "plan-matrix-activity"), source = link("↗", item.source[1]); source.title = item.source[0] + " · 查看教材原文"; source.setAttribute("aria-label", "查看" + item.label + "原文，" + item.source[0]);
            line.append(node("small", item.flow), button, source); th.append(line); tr.append(th);
            item.raci.forEach(function (value, index) { var td = node("td", value); td.classList.toggle("is-responsible", value.includes("R")); td.setAttribute("aria-label", roles[index].role + "：" + (value || "未列明")); tr.append(td); }); body.append(tr);
        }); table.append(head, body); scroll.append(table); container.append(scroll);
        var note = node("p", null, "plan-matrix-footnote"); note.append(document.createTextNode("活动责任：教材RACI；材料使用：项目归纳。"));
        if (activeSlug === "outline-business-case") { note.append(document.createTextNode("C³：高级用户、高级供应商被任命时咨询。")); }
        else { note.append(link("项目后收益职责：5.6", "../chapters/ch05.html#pn-24")); }
        container.append(note);
    }
    function render(slug, mode) {
        if (!scenes[slug]) { return; }
        if (activeSlug !== slug) { readingScene = false; selected = "prepare"; try { selected = sessionStorage.getItem("prince2-" + slug + "-scenario-v1") || selected; } catch (error) { /* 无存储时使用编制场景。 */ } }
        activeSlug = slug; activeMode = mode;
        var rolesSection = document.getElementById("roles-section"), lifecycle = document.getElementById("lifecycle-section"); rolesSection.hidden = false; lifecycle.hidden = false;
        document.getElementById("roles-title").textContent = "责任分工"; document.getElementById("roles-kicker").textContent = mode === "case" ? "活动 × 项目角色 × 人物" : "活动 × 项目角色";
        document.getElementById("roles-note").hidden = true; rolesSection.querySelector(".role-table-wrap").hidden = true; document.getElementById("roles-boundary").hidden = true;
        document.getElementById("lifecycle-title").textContent = "流程中的使用"; document.getElementById("lifecycle-kicker").textContent = "材料 → 动作 → 产出 → 交接";
        document.getElementById("lifecycle-note").hidden = true; document.getElementById("lifecycle-rhythm").hidden = true; lifecycle.querySelector(".lifecycle-table").hidden = true;
        document.querySelector('#detail-view-toolbar a[href="#roles-section"]').textContent = "责任分工"; document.querySelector('#detail-view-toolbar a[href="#lifecycle-section"]').textContent = "流程使用";
        if (slug === "full-business-case") {
            var compositionLink = document.querySelector('#detail-view-toolbar a[data-business-composition-link], #detail-view-toolbar a[href="#composition-section"]'); compositionLink.dataset.businessCompositionLink = "true";
            compositionLink.textContent = mode === "case" ? "商业论证文件" : "组成内容"; compositionLink.href = mode === "case" ? "#lesson-register-section" : "#composition-section";
            var documentLink = document.querySelector("[data-lesson-document-link]"); if (documentLink) { documentLink.hidden = true; }
            var definitionLink = document.querySelector('#detail-view-toolbar a[href="#definition-section"]');
            if (!definitionLink.dataset.businessDefinitionLink) { definitionLink.dataset.businessDefinitionLink = "true"; definitionLink.addEventListener("click", function (event) { if (activeMode === "case") { event.preventDefault(); document.querySelector(".lesson-help-button").click(); } }); }
            var helpButton = document.querySelector(".lesson-help-button"); if (mode === "case" && helpButton) { helpButton.textContent = "字段说明"; }
            var helpTitle = document.getElementById("lesson-help-title"); if (helpTitle) { helpTitle.textContent = "字段说明"; document.querySelector(".lesson-help-close").setAttribute("aria-label", "关闭字段说明"); }
        }
        evidence("roles-evidence", [["6.3.2.2 RACI含义", "../chapters/ch06.html#pn-26"], ["5.6 商业论证职责", "../chapters/ch05.html#pn-24"]]); evidence("lifecycle-evidence", scenes[slug].map(function (scene) { return scene.source; }));
        var matrix = document.getElementById("business-usage-matrix"); if (!matrix) { matrix = node("div"); matrix.id = "business-usage-matrix"; matrix.dataset.viewAnchor = "business-usage-matrix"; rolesSection.append(matrix); } renderMatrix(matrix);
        var usage = document.getElementById("business-usage"); if (!usage) { usage = node("div"); usage.id = "business-usage"; lifecycle.append(usage); } usage.replaceChildren();
        var tabs = node("div", null, "plan-usage-tabs"); tabs.setAttribute("role", "tablist"); tabs.setAttribute("aria-label", "商业论证使用场景");
        scenes[slug].forEach(function (scene) {
            var button = node("button", scene.name, "plan-usage-tab"); button.type = "button"; button.id = "business-usage-tab-" + scene.id; button.dataset.scene = scene.id; button.setAttribute("role", "tab"); button.setAttribute("aria-controls", "business-usage-panel");
            button.addEventListener("click", function () { selectScene(scene.id, false, false, true); });
            button.addEventListener("keydown", function (event) { var index = scenes[slug].findIndex(function (item) { return item.id === selected; }); if (event.key === "ArrowRight") { index = (index + 1) % scenes[slug].length; } else if (event.key === "ArrowLeft") { index = (index + scenes[slug].length - 1) % scenes[slug].length; } else if (event.key === "Home") { index = 0; } else if (event.key === "End") { index = scenes[slug].length - 1; } else { return; } event.preventDefault(); selectScene(scenes[slug][index].id, false, true, true); }); tabs.append(button);
        });
        var panel = node("div"); panel.id = "business-usage-panel"; panel.setAttribute("role", "tabpanel"); panel.tabIndex = 0; usage.append(tabs, panel); selectScene(selected, false, false, false);
    }
    window.addEventListener("resize", stabilizePanel); window.addEventListener("hashchange", function () { readingScene = false; });
    window.PRINCE2BusinessCaseUsage = {
        resetReadingIntent: function () { readingScene = false; },
        roles: roles, activities: activities, scenes: scenes, render: render, stabilizePanel: stabilizePanel, materialHref: materialHref,
        captureReadingAnchor: function () { var panel = document.getElementById("business-usage-panel"), rect = panel && panel.getBoundingClientRect(); return readingScene && rect && rect.height && rect.top > 0 && rect.top < innerHeight ? { dataAnchor: "business-usage-scenario", sectionId: "lifecycle-section", top: rect.top } : null; }
    };
}());
