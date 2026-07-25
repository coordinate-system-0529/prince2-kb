(function() {
    "use strict";

    function createCaseSidebar() {
        var currentProduct = document.body.getAttribute("data-case-product") || "";
        if (document.getElementById("product-sidebar")) {
            return;
        }

        var entries = [
            ["baseline", "基准", "定", [
                ["产品描述", "product-description-waterproofing.html", "案例"], ["例外计划"], ["可持续性管理方法"], ["工作包描述"],
                ["收益管理方法"], ["沟通管理方法"], ["质量管理方法"], ["问题管理方法"], ["阶段计划"],
                ["项目产品描述", "project-product-description.html", "案例"], ["项目启动文件"], ["项目概述文件", "project-brief.html", "案例"],
                ["项目计划"], ["风险管理方法"]
            ]],
            ["record", "记录", "记", [
                ["产品登记单", "product-register.html", "案例"], ["日志"], ["经验教训记录单", "../entities/product.html#entity-经验教训记录单", "通用定义"],
                ["质量登记单", "waterproof-quality-records.html", "证据包"], ["问题登记单"], ["风险登记单", "../entities/product.html#entity-风险登记单", "通用定义"]
            ]],
            ["report", "报告", "报", [
                ["例外报告"], ["检查点报告"], ["要点报告"], ["问题报告"], ["阶段竣工报告"], ["项目收尾建议"], ["项目竣工报告"]
            ]]
        ];

        function renderEntry(entry) {
            if (!entry[1]) {
                return "<li><span>" + entry[0] + "</span></li>";
            }
            var isCurrent = entry[0] === currentProduct;
            return "<li><a href=\"" + entry[1] + "\"" + (isCurrent ? " aria-current=\"page\"" : "") + ">" +
                entry[0] + (entry[2] ? " <em>" + entry[2] + "</em>" : "") + "</a></li>";
        }

        var groups = entries.map(function(group, index) {
            var items = group[3].map(renderEntry).join("");
            var containsCurrent = group[3].some(function(entry) { return entry[0] === currentProduct; });
            return "<details" + ((!currentProduct && index === 0) || containsCurrent ? " open" : "") + ">" +
                "<summary><span class=\"sidebar-type-mark is-" + group[0] + "\">" + group[2] + "</span>" + group[1] +
                " <small>" + group[3].length + "</small></summary><ul>" + items + "</ul></details>";
        }).join("");

        var toggle = document.createElement("button");
        toggle.className = "product-sidebar-toggle";
        toggle.type = "button";
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-controls", "product-sidebar");
        toggle.innerHTML = "<span aria-hidden=\"true\">27</span><span>产品导航</span>";

        var sidebar = document.createElement("aside");
        sidebar.className = "product-sidebar";
        sidebar.id = "product-sidebar";
        sidebar.setAttribute("aria-label", "管理产品导航");
        sidebar.innerHTML = "<header class=\"product-sidebar-heading\"><div><strong>PRINCE2<sup>®</sup> 7</strong>" +
            "<span>住宅装修案例 · 管理产品</span></div><button class=\"product-sidebar-close\" type=\"button\" aria-label=\"关闭产品导航\">×</button></header>" +
            "<a class=\"product-sidebar-all\" href=\"renovation.html\">回到案例首页 <span aria-hidden=\"true\">→</span></a>" +
            "<p class=\"product-sidebar-progress\"><b>案例库建设中</b><br>按信息类型浏览不同状态的入口。</p>" +
            "<div class=\"product-sidebar-groups\">" + groups + "</div>";
        document.body.append(toggle, sidebar);
    }

    createCaseSidebar();

    var sidebar = document.getElementById("product-sidebar");
    var sidebarToggle = document.querySelector(".product-sidebar-toggle");
    var sidebarClose = document.querySelector(".product-sidebar-close");

    function setSidebar(open) {
        if (!sidebar || !sidebarToggle) {
            return;
        }
        sidebar.classList.toggle("is-open", open);
        sidebarToggle.setAttribute("aria-expanded", String(open));
    }

    if (sidebar && sidebarToggle) {
        sidebarToggle.addEventListener("click", function() {
            setSidebar(!sidebar.classList.contains("is-open"));
        });
        sidebarClose.addEventListener("click", function() { setSidebar(false); });
        sidebar.querySelectorAll("a").forEach(function(link) {
            link.addEventListener("click", function() { setSidebar(false); });
        });

        var currentLink = sidebar.querySelector('[aria-current="page"]');
        if (currentLink) {
            window.requestAnimationFrame(function() {
                var sidebarRect = sidebar.getBoundingClientRect();
                var currentRect = currentLink.getBoundingClientRect();
                var isOutsideView = currentRect.top < sidebarRect.top + 16 ||
                    currentRect.bottom > sidebarRect.bottom - 16;
                if (isOutsideView) {
                    sidebar.scrollTop += currentRect.top - sidebarRect.top - 220;
                }
            });
        }
    }

    document.querySelectorAll(".register-event-trigger").forEach(function(trigger) {
        trigger.addEventListener("click", function() {
            var panelId = trigger.getAttribute("aria-controls");
            var panel = document.getElementById(panelId);
            if (!panel) {
                return;
            }

            var willOpen = trigger.getAttribute("aria-expanded") !== "true";
            trigger.setAttribute("aria-expanded", String(willOpen));
            panel.hidden = !willOpen;
        });
    });
}());
