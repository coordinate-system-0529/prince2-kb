(function () {
    "use strict";

    var selected = "prepare";
    var activeMode = "theory";
    var readingScene = false;
    var storageKey = "prince2-project-plan-scenario-v1";
    try { selected = sessionStorage.getItem(storageKey) || selected; } catch (error) { /* 无存储时使用首次编制。 */ }
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
    // 顺序与教材八个角色列一致。A 为问责，不等同于批准动作。
    var activities = [
        { id: "prepare", scene: "prepare", flow: "IP", label: "准备项目计划", raci: ["", "A", "C", "C", "R", "C", "C", "C"], source: ["表15.2", "../chapters/ch15.html#pn-16"] },
        { id: "authorize", scene: "authorize", flow: "DP", label: "授权项目", raci: ["I", "A/R", "C", "C", "I", "I", "C", "I"], source: ["表14.2", "../chapters/ch14.html#pn-12"] },
        { id: "control", scene: "control", flow: "CS", label: "评价阶段状态", raci: ["", "A", "C", "C", "R", "C", "C", "C"], source: ["表16.2", "../chapters/ch16.html#pn-17"] },
        { id: "update", scene: "boundary", flow: "SB", label: "更新项目计划", raci: ["", "A", "C", "C", "R", "C", "C", "C"], source: ["表18.2", "../chapters/ch18.html#pn-15"] },
        { id: "stage-authorize", scene: "boundary", flow: "DP", label: "授权阶段或例外计划", raci: ["I", "A/R", "C", "C", "I", "I", "C", "I"], source: ["表14.2", "../chapters/ch14.html#pn-12"] },
        { id: "exception", scene: "exception", flow: "SB", label: "准备例外计划（如果需要）", raci: ["", "A", "C", "C", "R", "C", "C", "C"], source: ["表18.2", "../chapters/ch18.html#pn-15"] },
        { id: "close", scene: "close", flow: "CP", label: "评估项目", raci: ["", "A", "C", "C", "R", "C", "C", "C"], source: ["表19.2", "../chapters/ch19.html#pn-13"] }
    ];
    function chapter(number, label) { return { chapter: number, label: label }; }
    function product(slug, label, hash) { return { slug: slug, label: label, hash: hash || "" }; }
    function step(actor, materials, theory, example, result, recipient) {
        return { actor: actor, materials: materials, theory: theory, example: example, result: result, recipient: recipient };
    }
    var scenes = [
        {
            id: "prepare", name: "首次编制", flow: "IP", trigger: "项目启动已授权", caseTrigger: "启动阶段，汇编16周项目层计划", state: "拟稿 · 编制情境",
            output: "项目计划拟稿 → 纳入项目启动文件，提交授权", source: ["15.4.4 准备项目计划", "../chapters/ch15.html#pn-9"],
            steps: [
                step([4], [product("project-brief", "项目概述文件"), product("project-product-description", "项目产品描述"), chapter(1, "01 计划描述")], "核对项目目标、范围和交付边界。", "陈默核对128㎡住宅、HOME-025住宅与HAN-024资料包的交付边界。", "范围与主要交付物", "用户、供应方共同细化"),
                step([2, 3, 5], [chapter(2, "02 外部依赖"), chapter(5, "05 产品描述"), chapter(6, "06 交付方式")], "确认用户要求、专业产品、资源与交付接口。", "林悦确认使用要求；陆明远协调供货；宋妍、赵建国细化设计与施工接口。", "产品、接口与资源输入，承诺待补", "交陈默整合"),
                step([4], [chapter(7, "07 预算"), chapter(8, "08 进度表"), chapter(9, "09 绩效目标"), chapter(10, "10 监视、控制与报告")], "形成预算、进度、绩效边界和控制安排，核对商业论证。", "以42万元上限、16周目标汇编计划；风险余量5万元，起算日期与资源承诺待确认。", "v1.0拟稿与未决事项", "交项目保证审查"),
                step([6, 7, 4], [product("full-business-case", "完整商业论证"), chapter(10, "10 版本与授权记录")], "独立审查可行性，整理受控版本，提出项目授权请求。", "王志衡拟审查接口与检查安排；许静整理版本；陈默提交计划和商业论证。", "审查意见与授权材料，凭据待补", "提交项目管理委员会")
            ]
        },
        {
            id: "authorize", name: "审查授权", flow: "DP", trigger: "收到项目授权请求", caseTrigger: "审查住宅项目计划v1.0拟稿", state: "教学情境 · 授权待确认",
            output: "授权决定 → 批准基准或退回完善", source: ["14.4.2 授权项目", "../chapters/ch14.html#pn-7"],
            steps: [
                step([2, 3, 6], [chapter(5, "05 产品描述"), chapter(7, "07 预算"), chapter(8, "08 进度表"), product("full-business-case", "完整商业论证")], "从用户、供应方及保证视角审查计划和持续业务理由。", "林悦核对住宅适用性；陆明远核对排产与施工资源；王志衡独立审查质量接口和可行性。", "审查意见，资源确认待补", "供周诚作出授权决定"),
                step([1], [chapter(9, "09 绩效目标"), chapter(10, "10 授权记录")], "根据审查意见决定是否授权项目，批准项目计划及项目层边界。", "周诚拟审查42万元与16周目标及风险暴露；当前计划仍为拟稿。", "批准、退回完善或不授权，决定待确认", "通知陈默及相关角色"),
                step([7, 4], [chapter(10, "10 版本与授权记录")], "记录决定；批准后保存基准，分发当前有效版本。", "许静拟登记授权凭据与批准版本；陈默据授权范围安排后续工作。", "批准基准及分发记录，均待补", "交后续阶段控制使用")
            ]
        },
        {
            id: "control", name: "执行中检查", flow: "CS", trigger: "定期复查或发生偏差", caseTrigger: "防水检查不合格，评价对全项目的影响", state: "教学情境 · 工期与成本影响待评估",
            output: "实际与预测对照 → 纠正行动或例外报告", source: ["16.4.4／16.4.7 阶段评价与上报", "../chapters/ch16.html#pn-9"],
            steps: [
                step([{ index: 5, person: "赵建国", identity: "施工包工头" }, 7], [product("quality-register", "质量登记单"), product("issue-register", "ISS-WPF-001", "#lesson-detail-ISS-WPF-001"), product("product-register", "产品登记单")], "提供工作包进展、检查结果及问题，汇总实际状态。", "质量记录已记载首次闭水不合格与局部返工；复验仍待补。赵建国拟反馈剩余工作，许静汇总记录。", "实际状态与剩余工作输入", "交陈默评价"),
                step([4], [chapter(7, "07 预算"), chapter(8, "08 进度表"), chapter(9, "09 绩效目标")], "对照阶段计划与项目计划，更新预测并检查容许偏差。", "陈默拟核对返工对FIN-014饰面前置条件、16周工期和42万元上限的影响。", "完工时间、剩余成本与风险预测，待评估", "咨询用户、供应方与保证"),
                step([4, 6], [chapter(10, "10 监视、控制与报告"), product("risk-register", "风险登记单")], "在授权范围内采取纠正行动；预测超出阶段容许偏差时上报。", "陈默拟协调复验与后续排程；王志衡独立核查放行条件。是否需例外报告取决于影响评估。", "纠正安排或例外报告，决定待补", "重大预测偏差交项目管理委员会")
            ]
        },
        {
            id: "boundary", name: "阶段复查", flow: "SB → DP", trigger: "接近阶段结束", caseTrigger: "计划第8周，复查隐蔽工程并准备下一阶段", state: "教学情境 · 阶段审查拟安排",
            output: "更新项目预测与下一阶段计划 → 下一阶段授权", source: ["18.4.3 更新项目计划", "../chapters/ch18.html#pn-8"],
            steps: [
                step([4, 5, 7], [product("product-register", "产品登记单"), product("quality-register", "质量登记单"), chapter(8, "08 进度表")], "核对本阶段交付、检查结果、实际时间与成本。", "拟核对DEM-003、MEP-006、WPF-011交付及复验状态，汇总第4至8周实际数据。", "阶段实际与未完成事项，待汇总", "交陈默更新预测"),
                step([4, 2, 3], [chapter(7, "07 预算"), chapter(8, "08 进度表"), product("full-business-case", "完整商业论证"), product("risk-register", "风险登记单")], "更新项目计划的实际与剩余预测，协商下一阶段资源，并同步商业论证。", "拟重估第9至16周饰面、柜体木门、设备与移交安排，核对剩余成本及排产承诺。", "更新项目计划与下一阶段计划，待编制", "连同阶段竣工报告提交审查"),
                step([1, 2, 3, 6], [chapter(9, "09 绩效目标"), chapter(10, "10 授权记录")], "审查持续可行性，决定是否授权下一阶段及其容许偏差。", "周诚拟结合林悦、陆明远和王志衡意见作出下一阶段决定；当前授权凭据待补。", "下一阶段授权或退回，决定待确认", "陈默按决定推进，许静更新版本")
            ]
        },
        {
            id: "exception", name: "预测超差", flow: "CS → DP，必要时SB", trigger: "预测超出授权容许偏差", caseTrigger: "教学设问：返工或主材延误可能突破已授权边界", state: "教学情境 · 例外尚未确认",
            output: "例外报告 → 决策 → 按要求重规划与授权", source: ["16.4.7 上报问题和风险", "../chapters/ch16.html#pn-12"],
            steps: [
                step([4], [chapter(7, "07 预算"), chapter(8, "08 进度表"), chapter(9, "09 绩效目标"), product("issue-register", "问题登记单")], "评估对项目目标的总影响，提出可行选项和建议，提交例外报告。", "陈默拟比较复验返工、调整交付顺序或供应方案；阶段容许偏差尚待授权明确。", "预测、选项和建议，影响数据待补", "交项目管理委员会决定"),
                step([1, 2, 3, 6], [product("full-business-case", "完整商业论证"), chapter(9, "09 绩效目标")], "在授权范围内决定处置；需要时要求例外计划。超出项目容许偏差时向业务层上报。", "周诚拟结合用户、供应方及保证意见决策；若突破项目层边界，另报项目外部授权主体。", "继续、调整或要求重规划，决定待确认", "通知陈默；超权限交业务层"),
                step([4, 7], [chapter(7, "07 预算"), chapter(8, "08 进度表"), chapter(10, "10 版本与授权记录")], "仅在被要求时准备例外计划；经相应授权后替代受影响的计划基准。", "陈默按决定拟编制例外计划，许静登记批准与版本；例外文件和授权记录均待补。", "例外计划及授权后的新基准，待补", "授权后返回阶段控制")
            ],
            branches: [
                ["工作包预测超差", "小组经理 → 项目经理", "项目经理在阶段权限内处理"],
                ["阶段预测超差", "项目经理 → 项目管理委员会", "委员会决定是否要求例外计划"],
                ["项目预测超差", "项目管理委员会 → 业务层", "由项目外部权限主体决定"]
            ]
        },
        {
            id: "close", name: "收尾对照", flow: "CP → DP", trigger: "临近计划结束或提前收尾", caseTrigger: "计划第16周，评价住宅交付与资料移交", state: "教学情境 · 收尾审查拟安排",
            output: "基准与实际对照 → 项目竣工报告及收尾请求", source: ["19.4.4 评估项目", "../chapters/ch19.html#pn-8"],
            steps: [
                step([4, 7], [chapter(1, "01 交付范围"), chapter(7, "07 预算"), chapter(8, "08 进度表"), chapter(9, "09 绩效目标")], "依据原始批准基准及批准变更，对照实际成本、工期和交付绩效。", "陈默拟对照HOME-025、HAN-024、42万元和16周目标；许静汇总版本与批准变更凭据。", "计划与实际差异，实际数据待补", "汇入项目竣工报告"),
                step([2, 6, 4], [product("project-product-description", "项目产品描述"), product("quality-register", "质量登记单"), product("issue-register", "问题登记单"), product("lessons-log", "经验教训记录单")], "确认验收、遗留事项与移交安排，总结经验和改进建议。", "林悦拟参与家庭验收；王志衡核查检查依据；陈默协调遗留问题、维护资料及后续收益复查。", "验收与移交记录、经验教训报告，待补", "提交收尾请求"),
                step([1, 2, 3, 6], [chapter(10, "10 监视、控制与报告")], "审查收尾材料，决定是否授权项目收尾。", "周诚拟结合用户、供应方与保证意见审查；当前未形成收尾授权。", "收尾决定及档案，待确认", "业务层及后续运营／维护责任人")
            ]
        }
    ];
    function node(tag, text, className) {
        var element = document.createElement(tag);
        if (text != null) { element.textContent = text; }
        if (className) { element.className = className; }
        return element;
    }
    function link(label, href) { var a = node("a", label); a.href = href; return a; }
    function identity(parent, indexes) {
        indexes.forEach(function (index) {
            var role = typeof index === "number" ? roles[index] : Object.assign({}, roles[index.index], index);
            var line = node("span", null, "plan-usage-person");
            line.append(node("strong", activeMode === "case" ? role.person : role.role));
            if (activeMode === "case") { line.append(node("small", role.identity), node("small", "· " + role.role)); }
            parent.append(line);
        });
    }
    function materialLink(material) {
        var href;
        if (material.chapter) {
            var label = window.PRINCE2_PRODUCT_DETAILS_V2.entries["project-plan"].composition.items[material.chapter - 1].label;
            href = activeMode === "case" ? "#project-plan-chapter-" + material.chapter : "#composition-" + label;
        } else { href = "product-detail-v2.html?entry=" + material.slug + "&mode=" + activeMode + (activeMode === "case" ? material.hash : ""); }
        return link(material.label, href);
    }
    function evidence(id, items) {
        var details = document.getElementById(id), content = details.querySelector("div");
        details.hidden = false; content.replaceChildren();
        items.forEach(function (item) { content.append(link(item[0], item[1])); });
    }
    function selectScene(id, scroll, focus, readingIntent) {
        if (!scenes.some(function (scene) { return scene.id === id; })) { id = "prepare"; }
        selected = id;
        if (readingIntent) { readingScene = true; }
        try { sessionStorage.setItem(storageKey, selected); } catch (error) { /* 不阻断场景选择。 */ }
        document.querySelectorAll(".plan-usage-tab").forEach(function (tab) {
            var active = tab.dataset.scene === id;
            tab.setAttribute("aria-selected", String(active)); tab.tabIndex = active ? 0 : -1;
            if (active && focus) { tab.focus(); }
        });
        document.querySelectorAll(".plan-matrix tbody tr").forEach(function (row) {
            var active = row.dataset.scene === id;
            row.classList.toggle("is-active", active);
            row.querySelector("button").setAttribute("aria-pressed", String(active));
        });
        renderScene();
        stabilizePanel();
        if (scroll) { document.getElementById("lifecycle-section").scrollIntoView({ behavior: "instant", block: "start" }); }
    }
    function stabilizePanel() {
        var panel = document.getElementById("plan-usage-panel");
        if (!panel || !panel.getBoundingClientRect().height) { return; }
        // 两种内容共用当前场景的自然高度，避免页尾切换被浏览器最大滚动位置拉回。
        panel.style.minHeight = "0";
        var originalMode = activeMode;
        var height = panel.getBoundingClientRect().height;
        activeMode = originalMode === "case" ? "theory" : "case";
        renderScene(); height = Math.max(height, panel.getBoundingClientRect().height);
        activeMode = originalMode; renderScene();
        panel.style.minHeight = Math.ceil(height) + "px";
    }
    function renderScene() {
        var scene = scenes.find(function (item) { return item.id === selected; });
        var panel = document.getElementById("plan-usage-panel");
        panel.replaceChildren(); panel.setAttribute("aria-labelledby", "plan-usage-tab-" + scene.id);
        panel.dataset.viewAnchor = "plan-usage-scenario";
        var header = node("div", null, "plan-usage-context");
        var intro = node("div"); intro.append(node("strong", scene.flow + " · " + scene.name), node("p", activeMode === "case" ? scene.caseTrigger : scene.trigger));
        header.append(intro, node("span", activeMode === "case" ? scene.state : "流程应用 · 项目归纳", "plan-usage-state"));
        panel.append(header);
        var table = node("table", null, "plan-usage-steps"), thead = node("thead"), head = node("tr"), tbody = node("tbody");
        var columns = [
            ["步骤", "number"], ["责任人／角色", "actor"], ["使用材料", "material"],
            ["管理动作", "action"], ["产出与交接", "result"]
        ];
        columns.forEach(function (column) { var th = node("th", column[0], "plan-usage-" + column[1] + "-cell"); th.scope = "col"; head.append(th); });
        thead.append(head);
        scene.steps.forEach(function (item, index) {
            var tr = node("tr"), number = node("th", String(index + 1).padStart(2, "0")), actor = node("td"), materialCell = node("td"), action = node("td"), result = node("td"); number.scope = "row";
            [number, actor, materialCell, action, result].forEach(function (cell, cellIndex) {
                cell.className = "plan-usage-" + columns[cellIndex][1] + "-cell";
                if (cellIndex) { cell.dataset.label = columns[cellIndex][0]; }
            });
            var actors = node("div", null, "plan-usage-actors"); identity(actors, item.actor);
            var materials = node("div", null, "plan-usage-materials"); item.materials.forEach(function (material) { materials.append(materialLink(material)); });
            actor.append(actors);
            materialCell.append(materials);
            action.append(node("p", activeMode === "case" ? item.example : item.theory));
            var parts = item.result.split("，");
            result.append(node("strong", parts[0]));
            if (parts.length > 1) { result.append(node("span", parts.slice(1).join("，"), "plan-usage-result-state")); }
            result.append(node("p", "→ " + item.recipient));
            tr.append(number, actor, materialCell, action, result); tbody.append(tr);
        });
        table.append(thead, tbody); panel.append(table);
        if (scene.branches) {
            var boundary = node("div", null, "plan-usage-boundaries"); boundary.append(node("h3", "升级权限"));
            var list = node("dl");
            scene.branches.forEach(function (branch) { var row = node("div"); row.append(node("dt", branch[0]), node("dd", branch[1]), node("dd", branch[2])); list.append(row); });
            boundary.append(list); panel.append(boundary);
        }
        var footer = node("div", null, "plan-usage-outcome"); footer.append(node("strong", "本环节产出"), node("span", scene.output), link("原文 · " + scene.source[0], scene.source[1])); panel.append(footer);
    }
    function renderMatrix(container) {
        container.replaceChildren();
        var legend = node("p", null, "plan-matrix-legend");
        [["R", "执行"], ["A", "问责"], ["C", "咨询"], ["I", "知情"]].forEach(function (item) { var span = node("span"); span.append(node("b", item[0]), document.createTextNode(" " + item[1])); legend.append(span); });
        legend.append(node("span", "A不等同批准，空白表示该活动未列明。", "plan-matrix-note")); container.append(legend);
        var scroll = node("div", null, "plan-matrix-scroll"); scroll.tabIndex = 0; scroll.setAttribute("role", "region"); scroll.setAttribute("aria-label", "项目计划活动责任矩阵，可横向滚动");
        var table = node("table", null, "plan-matrix"), head = node("thead"), header = node("tr"), body = node("tbody");
        var activity = node("th", "活动／查看使用场景"); activity.scope = "col"; header.append(activity);
        roles.forEach(function (role) {
            var th = node("th"); th.scope = "col"; th.append(node("strong", role.role));
            if (activeMode === "case") {
                th.append(node("span", role.person));
                var identities = node("small");
                role.identity.split("／").forEach(function (text) { identities.append(node("span", text, "plan-matrix-identity")); });
                th.append(identities);
            }
            header.append(th);
        });
        head.append(header);
        activities.forEach(function (item) {
            var row = node("tr"); row.dataset.scene = item.scene;
            row.dataset.viewAnchor = "plan-activity-" + item.id;
            var th = node("th"); th.scope = "row";
            var button = node("button"); button.type = "button"; button.dataset.activity = item.id;
            item.label.split(/(?=（)/).forEach(function (text) { button.append(node("span", text, "plan-matrix-activity-label")); });
            button.addEventListener("click", function () { selectScene(item.scene, true, true, true); });
            var activityLine = node("div", null, "plan-matrix-activity");
            var source = link("↗", item.source[1]);
            source.title = item.source[0] + " · 查看教材原文";
            source.setAttribute("aria-label", "查看" + item.label + "原文，" + item.source[0]);
            activityLine.append(node("small", item.flow), button, source);
            th.append(activityLine); row.append(th);
            item.raci.forEach(function (value, index) {
                var td = node("td", value); td.classList.toggle("is-responsible", value.includes("R"));
                td.setAttribute("aria-label", roles[index].role + "：" + (value ? value.split("/").map(function (code) { return { R: "执行", A: "问责", C: "咨询", I: "知情" }[code]; }).join("、") : "未列明")); row.append(td);
            }); body.append(row);
        });
        table.append(head, body); scroll.append(table); container.append(scroll);
        var note = node("p", null, "plan-matrix-footnote");
        note.append(document.createTextNode("活动责任：教材RACI。材料分工："), link("计划实践7.6", "../chapters/ch07.html#pn-42"), document.createTextNode("，项目支持协助编制、保存基准与分发；项目保证独立审查。")); container.append(note);
    }
    function render(mode) {
        activeMode = mode;
        var rolesSection = document.getElementById("roles-section"), lifecycle = document.getElementById("lifecycle-section");
        rolesSection.hidden = false; lifecycle.hidden = false;
        document.getElementById("roles-title").textContent = "责任分工";
        document.getElementById("roles-kicker").textContent = activeMode === "case" ? "活动 × 项目角色 × 人物" : "活动 × 项目角色";
        document.getElementById("roles-note").hidden = true;
        rolesSection.querySelector(".role-table-wrap").hidden = true;
        document.getElementById("roles-boundary").hidden = true;
        document.getElementById("lifecycle-title").textContent = "流程中的使用";
        document.getElementById("lifecycle-kicker").textContent = "材料 → 动作 → 产出 → 交接";
        document.getElementById("lifecycle-note").hidden = true;
        document.getElementById("lifecycle-rhythm").hidden = true;
        lifecycle.querySelector(".lifecycle-table").hidden = true;
        document.querySelector('#detail-view-toolbar a[href="#roles-section"]').textContent = "责任分工";
        document.querySelector('#detail-view-toolbar a[href="#lifecycle-section"]').textContent = "流程使用";
        var compositionLink = document.querySelector('#detail-view-toolbar a[data-plan-composition-link], #detail-view-toolbar a[href="#composition-section"]');
        compositionLink.dataset.planCompositionLink = "true";
        compositionLink.textContent = mode === "case" ? "项目计划文件" : "组成内容";
        compositionLink.href = mode === "case" ? "#lesson-register-section" : "#composition-section";
        var documentLink = document.querySelector("[data-lesson-document-link]");
        if (documentLink) { documentLink.hidden = true; }
        var definitionLink = document.querySelector('#detail-view-toolbar a[href="#definition-section"]');
        if (!definitionLink.dataset.planDefinitionLink) {
            definitionLink.dataset.planDefinitionLink = "true";
            definitionLink.addEventListener("click", function (event) {
                if (activeMode === "case") { event.preventDefault(); document.querySelector(".lesson-help-button").click(); }
            });
        }
        evidence("roles-evidence", [["6.3.2.2 RACI含义", "../chapters/ch06.html#pn-26"], ["7.6 计划角色职责", "../chapters/ch07.html#pn-42"]]);
        evidence("lifecycle-evidence", scenes.map(function (scene) { return scene.source; }));
        var matrix = document.getElementById("plan-usage-matrix");
        if (!matrix) { matrix = node("div"); matrix.id = "plan-usage-matrix"; matrix.dataset.viewAnchor = "plan-usage-matrix"; rolesSection.append(matrix); }
        renderMatrix(matrix);
        var usage = document.getElementById("plan-usage");
        if (!usage) { usage = node("div"); usage.id = "plan-usage"; lifecycle.append(usage); }
        usage.replaceChildren();
        var tabs = node("div", null, "plan-usage-tabs"); tabs.setAttribute("role", "tablist"); tabs.setAttribute("aria-label", "项目计划使用场景");
        scenes.forEach(function (scene) {
            var button = node("button", scene.name, "plan-usage-tab"); button.type = "button"; button.id = "plan-usage-tab-" + scene.id; button.dataset.scene = scene.id;
            button.setAttribute("role", "tab"); button.setAttribute("aria-controls", "plan-usage-panel");
            button.addEventListener("click", function () { selectScene(scene.id, false, false, true); });
            button.addEventListener("keydown", function (event) {
                var index = scenes.findIndex(function (item) { return item.id === selected; });
                if (event.key === "ArrowRight") { index = (index + 1) % scenes.length; }
                else if (event.key === "ArrowLeft") { index = (index + scenes.length - 1) % scenes.length; }
                else if (event.key === "Home") { index = 0; }
                else if (event.key === "End") { index = scenes.length - 1; }
                else { return; }
                event.preventDefault(); selectScene(scenes[index].id, false, true, true);
            }); tabs.append(button);
        });
        var panel = node("div"); panel.id = "plan-usage-panel"; panel.setAttribute("role", "tabpanel"); panel.tabIndex = 0;
        usage.append(tabs, panel); selectScene(selected, false, false);
        var helpButton = document.querySelector(".lesson-help-button");
        if (activeMode === "case" && helpButton) { helpButton.textContent = "字段说明"; }
        var helpTitle = document.getElementById("lesson-help-title");
        if (helpTitle) { helpTitle.textContent = "字段说明"; document.querySelector(".lesson-help-close").setAttribute("aria-label", "关闭字段说明"); }
    }
    window.addEventListener("resize", stabilizePanel);
    window.addEventListener("hashchange", function () { readingScene = false; });
    window.PRINCE2ProjectPlanUsage = {
        resetReadingIntent: function () { readingScene = false; },
        roles: roles, activities: activities, scenes: scenes, render: render, stabilizePanel: stabilizePanel,
        captureReadingAnchor: function () {
            var panel = document.getElementById("plan-usage-panel");
            var rect = panel && panel.getBoundingClientRect();
            // 显式选择场景后，以场景保留位置，避免短页面页尾的矩阵表头抢占阅读锚点。
            return readingScene && rect && rect.height && rect.top > 0 && rect.top < innerHeight
                ? { dataAnchor: "plan-usage-scenario", sectionId: "lifecycle-section", top: rect.top } : null;
        }
    };
}());
