(function() {
    "use strict";

    var registerData = window.RENOVATION_PRODUCT_REGISTER;
    var peopleAvatars = {
        "陈默": "chen-mo.webp",
        "许静": "xu-jing.webp",
        "周诚": "zhou-cheng.webp",
        "林悦": "lin-yue.webp",
        "宋妍": "song-yan.webp",
        "赵建国": "zhao-jianguo.webp",
        "王志衡": "wang-zhiheng.webp",
        "陆明远": "lu-mingyuan.webp"
    };

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderList(items) {
        return items.map(function(item) {
            return "<li>" + escapeHtml(item) + "</li>";
        }).join("");
    }

    function renderPeople(people) {
        return people.map(function(person) {
            var avatar = peopleAvatars[person[0]];
            var image = avatar
                ? "<img src=\"assets/renovation/people/" + avatar + "\" alt=\"\" width=\"36\" height=\"36\">"
                : "<span class=\"detail-person-fallback\" aria-hidden=\"true\">人</span>";
            return "<li>" + image + "<p><b>" + escapeHtml(person[0]) +
                "</b><span>" + escapeHtml(person[1]) + "</span><small>" +
                escapeHtml(person[2]) + "</small></p></li>";
        }).join("");
    }

    function renderHistory(history, productId) {
        var rows = history.map(function(item) {
            return "<tr><td>" + escapeHtml(item[0]) + "</td><td>" +
                escapeHtml(item[1]) + "</td><td>" + escapeHtml(item[2]) +
                "</td><td>" + escapeHtml(item[3]) + "</td><td>" +
                escapeHtml(item[4]) + "</td></tr>";
        }).join("");

        return "<div class=\"product-history-wrap\"><table class=\"product-history-table\" " +
            "aria-label=\"" + escapeHtml(productId) + " 产品变化历史\"><thead><tr>" +
            "<th scope=\"col\">时间</th><th scope=\"col\">触发事件</th>" +
            "<th scope=\"col\">状态变化</th><th scope=\"col\">版本变化</th>" +
            "<th scope=\"col\">记录说明</th></tr></thead><tbody>" + rows +
            "</tbody></table></div>";
    }

    function renderDetail(product) {
        var detail = product.detail;
        var caseAction = product.caseHref
            ? "<a class=\"product-detail-action\" href=\"" + escapeHtml(product.caseHref) +
                "\">查看完整虚拟文件 <span aria-hidden=\"true\">→</span></a>"
            : "";
        var evidenceAction = product.evidenceHref
            ? "<a class=\"product-evidence-action\" href=\"" + escapeHtml(product.evidenceHref) +
                "\">查看质量记录包 <span aria-hidden=\"true\">→</span></a>"
            : "";
        var detailActions = caseAction || evidenceAction
            ? "<div class=\"product-detail-actions\">" + caseAction + evidenceAction + "</div>"
            : "";
        return "<tr class=\"product-detail-row\" id=\"product-detail-" + escapeHtml(product.id) +
            "\" hidden><td colspan=\"11\"><section class=\"product-detail-sheet\" " +
            "aria-labelledby=\"product-title-" + escapeHtml(product.id) + "\">" +
            "<header><div><span>产品定义</span><h4>" + escapeHtml(product.name) +
            "</h4></div><p>" + escapeHtml(detail.purpose) + "</p>" +
            "<dl><div><dt>上层产品</dt><dd>" + escapeHtml(detail.parent) +
            "</dd></div><div><dt>产品描述</dt><dd>" + escapeHtml(product.descriptionRef) +
            "</dd></div><div><dt>来源</dt><dd>" + escapeHtml(product.source) +
            "</dd></div></dl>" + detailActions + "</header>" +
            "<div class=\"product-detail-columns\">" +
            "<section><h5>具体组成</h5><ul class=\"detail-check-list\">" +
            renderList(detail.components) + "</ul></section>" +
            "<section><h5>人员与责任</h5><ul class=\"detail-people-list\">" +
            renderPeople(detail.people) + "</ul></section>" +
            "<section><h5>验收标准</h5><ol class=\"detail-criteria-list\">" +
            renderList(detail.criteria) + "</ol></section></div>" +
            "<section class=\"product-history\"><div><span>产品变化</span>" +
            "<h5>状态和版本如何随事件变化</h5></div>" +
            renderHistory(detail.history, product.id) + "</section>" +
            "</section></td></tr>";
    }

    function renderProduct(product) {
        var productId = escapeHtml(product.id);
        return "<tr class=\"product-register-row\" data-product-id=\"" + productId + "\">" +
            "<td><button class=\"product-detail-trigger\" type=\"button\" data-product-id=\"" + productId +
            "\" aria-expanded=\"false\" " +
            "aria-controls=\"product-detail-" + productId + "\"><span><b>" + productId +
            "</b><strong id=\"product-title-" + productId + "\">" + escapeHtml(product.name) +
            "</strong><small>" + escapeHtml(product.descriptionRef) +
            "</small></span><i class=\"detail-toggle-mark\" aria-hidden=\"true\">＋</i></button></td>" +
            "<td>" + escapeHtml(product.type) + "</td>" +
            "<td><b>" + escapeHtml(product.source) + "</b><small>" + escapeHtml(product.stage) + "</small></td>" +
            "<td>" + escapeHtml(product.owner) + "</td>" +
            "<td><em class=\"register-product-state " + escapeHtml(product.statusClass) + "\">" +
            escapeHtml(product.status) + "</em></td>" +
            "<td>" + escapeHtml(product.version) + "</td>" +
            "<td>" + escapeHtml(product.descriptionApproved) + "</td>" +
            "<td>" + escapeHtml(product.plannedAcceptance) + "</td>" +
            "<td>" + escapeHtml(product.actualAcceptance) + "</td>" +
            "<td>" + escapeHtml(product.result) + "</td>" +
            "<td><b class=\"register-last-update\">" + escapeHtml(product.lastUpdate) +
            "</b></td></tr>" + renderDetail(product);
    }

    function setText(id, value) {
        var element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    function renderRegister() {
        var body = document.getElementById("fullRegisterBody");
        var auditItems = document.getElementById("registerAuditItems");

        if (!registerData || !body || !auditItems) {
            return;
        }

        setText("registerDocumentId", registerData.register.id);
        setText("registerDocumentStatus", registerData.register.status);
        setText("registerMaintainer", registerData.register.maintainer);
        setText("registerManager", registerData.register.manager);
        setText("registerCurrentStage", registerData.register.currentStage);
        setText("registerCurrentUpdate", registerData.register.currentUpdate);
        setText("registerTrigger", registerData.register.trigger);
        setText("registerProductCount", registerData.products.length);

        auditItems.innerHTML = registerData.updates.map(function(update) {
            var stateClass = update.state === "planned" ? " is-planned" : "";
            return "<span class=\"register-audit-item" + stateClass + "\"><b>" +
                escapeHtml(update.label) + "</b><small>" + update.affected.length +
                " 项</small></span>";
        }).join("");

        body.innerHTML = registerData.products.map(renderProduct).join("");

        body.querySelectorAll(".product-detail-trigger").forEach(function(trigger) {
            trigger.addEventListener("click", function() {
                var detailId = trigger.getAttribute("aria-controls");
                var detailRow = document.getElementById(detailId);
                var productRow = trigger.closest(".product-register-row");
                var willOpen = trigger.getAttribute("aria-expanded") !== "true";

                trigger.setAttribute("aria-expanded", String(willOpen));
                detailRow.hidden = !willOpen;
                productRow.classList.toggle("is-detail-open", willOpen);
                trigger.querySelector(".detail-toggle-mark").textContent = willOpen ? "－" : "＋";
            });
        });
    }

    function highlightProducts(updateId) {
        if (!registerData) {
            return;
        }

        var update = registerData.updates.find(function(item) {
            return item.id === updateId;
        });
        var note = document.getElementById("registerImpactNote");

        document.querySelectorAll(".product-register-row").forEach(function(row) {
            row.classList.remove("is-update-affected");
        });

        if (!update) {
            return;
        }

        update.affected.forEach(function(productId) {
            var row = document.querySelector(".product-register-row[data-product-id='" + productId + "']");
            if (row) {
                row.classList.add("is-update-affected");
            }
        });

        if (note) {
            var verb = update.state === "planned" ? "预计影响" : "影响";
            note.textContent = "当前选择" + update.label + "，" + verb + " " +
                update.affected.length + " 项产品，已在下表标记。";
        }
    }

    renderRegister();

    var tabs = Array.from(document.querySelectorAll(".update-node[role='tab']"));
    var panels = Array.from(document.querySelectorAll(".update-panel[role='tabpanel']"));

    function selectTab(tab, shouldFocus) {
        var panelId = tab.getAttribute("aria-controls");

        tabs.forEach(function(item) {
            var isSelected = item === tab;
            item.setAttribute("aria-selected", String(isSelected));
            item.tabIndex = isSelected ? 0 : -1;
        });

        panels.forEach(function(panel) {
            panel.hidden = panel.id !== panelId;
        });

        highlightProducts(tab.id);

        if (shouldFocus) {
            tab.focus({ preventScroll: true });
        }
    }

    tabs.forEach(function(tab, index) {
        tab.addEventListener("click", function() {
            selectTab(tab, false);
        });

        tab.addEventListener("keydown", function(event) {
            var nextIndex;

            if (event.key === "ArrowRight") {
                nextIndex = (index + 1) % tabs.length;
            } else if (event.key === "ArrowLeft") {
                nextIndex = (index - 1 + tabs.length) % tabs.length;
            } else if (event.key === "Home") {
                nextIndex = 0;
            } else if (event.key === "End") {
                nextIndex = tabs.length - 1;
            } else {
                return;
            }

            event.preventDefault();
            selectTab(tabs[nextIndex], true);
        });
    });

    function selectHashTab() {
        var hashId = window.location.hash.slice(1);
        var hashTab = hashId ? document.getElementById(hashId) : null;

        if (hashTab && hashTab.classList.contains("update-node")) {
            selectTab(hashTab, false);
        }
    }

    window.addEventListener("hashchange", selectHashTab);
    selectHashTab();

    var selectedTab = document.querySelector(".update-node[aria-selected='true']");
    if (selectedTab) {
        highlightProducts(selectedTab.id);
    }
}());
