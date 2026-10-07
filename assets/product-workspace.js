(function () {
    "use strict";

    // 总览与已验收范围内的详情共用外框，未接入的详情保留旧模板。
    var mode = document.body.getAttribute("data-product-shell");
    if (!mode) { return; }
    var isCase = mode === "case";
    var detailSlug = document.body.dataset.workspaceEntry || "";
    var stateKey = "prince2-workspace-navigation-v1";
    var root = new URL("../", document.currentScript.src);
    var taxonomy = window.PRINCE2_PRODUCT_TAXONOMY;
    var products = taxonomy && taxonomy.products || [];
    var media = window.matchMedia("(max-width: 960px)");
    var state = { query: "", scroll: 0, expanded: { baseline: true, report: false, record: false, A1: true } };
    try {
        var saved = JSON.parse(sessionStorage.getItem(stateKey) || "null");
        if (saved && typeof saved === "object") {
            state.query = typeof saved.query === "string" ? saved.query : "";
            state.scroll = Number(saved.scroll) || 0;
            state.expanded = Object.assign(state.expanded, saved.expanded || {});
        }
    } catch (error) { /* 存储不可用时仍可正常浏览。 */ }

    var theoryRoutes = {
        "问题登记单": "issue-register",
        "概要商业论证": "outline-business-case",
        "完整商业论证": "full-business-case",
        "产品登记单": "product-register",
        "产品描述": "product-description",
        "项目概述文件": "project-brief",
        "项目产品描述": "project-product-description",
        "风险登记单": "risk-register",
        "经验教训记录单": "lessons-log",
        "质量登记单": "quality-register",
        "质量管理方法": "quality-management-approach",
        "工作包描述": "work-package-description"
    };
    var caseRoutes = {
        "问题登记单": "entities/product-detail-v2.html?entry=issue-register&mode=case",
        "概要商业论证": "entities/product-detail-v2.html?entry=outline-business-case&mode=case",
        "完整商业论证": "entities/product-detail-v2.html?entry=full-business-case&mode=case",
        "产品描述": "entities/product-detail-v2.html?entry=product-description&mode=case",
        "项目概述文件": "entities/product-detail-v2.html?entry=project-brief&mode=case",
        "产品登记单": "entities/product-detail-v2.html?entry=product-register&mode=case",
        "质量登记单": "entities/product-detail-v2.html?entry=quality-register&mode=case",
        "项目产品描述": "entities/product-detail-v2.html?entry=project-product-description&mode=case",
        "风险登记单": "entities/product-detail-v2.html?entry=risk-register&mode=case",
        "经验教训记录单": "entities/product-detail-v2.html?entry=lessons-log&mode=case",
        "质量管理方法": "entities/product-detail-v2.html?entry=quality-management-approach&mode=case",
        "工作包描述": "entities/product-detail-v2.html?entry=work-package-description&mode=case"
    };

    function escape(value) {
        return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;")
            .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    function url(path) {
        var target = new URL(path, root);
        if (path === "entities/product.html" || path === "cases/renovation.html") {
            target.searchParams.set("frame", "20260914");
        }
        if (target.searchParams.get("entry") === "outline-business-case") {
            target.searchParams.set("frame", "20260914-2");
        }
        if (target.searchParams.get("entry") === "full-business-case") {
            target.searchParams.set("frame", "full-1");
        }
        return target.href;
    }
    function save() {
        try { sessionStorage.setItem(stateKey, JSON.stringify(state)); } catch (error) { /* 忽略存储限制。 */ }
    }
    function expanded(key) { return state.expanded[key] ? " open" : ""; }
    function route(name) {
        if (isCase) { return caseRoutes[name] ? url(caseRoutes[name]) : ""; }
        return theoryRoutes[name] ? url("entities/product-detail-v2.html?entry=" + theoryRoutes[name] + "&mode=theory") : "";
    }
    function leaf(name, code) {
        var href = route(name);
        var label = href ? (isCase ? "案例" : "理论") : "待完善";
        var content = (code ? '<b class="workspace-code">' + code + '</b>' : '<span class="workspace-branch" aria-hidden="true"></span>') +
            '<span class="workspace-name">' + escape(name) + '</span><small class="workspace-status">' + label + '</small>';
        return '<li id="entity-' + escape(name) + '" class="workspace-leaf" data-name="' + escape(name) + '" data-code="' + (code || "") + '">' +
            (href ? '<a class="workspace-row" href="' + escape(href) + '">' + content + '</a>' :
                '<span class="workspace-row is-unavailable" aria-disabled="true" title="' + (isCase ? "对应案例" : "新版理论详情") + '待完善">' + content + '</span>') + '</li>';
    }
    function product(productItem) {
        if (!productItem.components.length) { return leaf(productItem.name, productItem.code); }
        return '<li id="' + escape(productItem.detailId) + '" class="workspace-product" data-name="' + escape(productItem.name) + '" data-code="' + productItem.code + '">' +
            '<details data-expand="' + productItem.code + '"' + expanded(productItem.code) + '><summary class="workspace-row">' +
            '<b class="workspace-code">' + productItem.code + '</b><span class="workspace-name">' + escape(productItem.name) + '</span>' +
            '<small class="workspace-child-count">' + productItem.components.length + '</small><span class="workspace-chevron" aria-hidden="true"></span></summary>' +
            '<ul class="workspace-children">' + productItem.components.map(function (name) { return leaf(name, ""); }).join("") + '</ul></details></li>';
    }
    function group(category) {
        var items = products.filter(function (item) { return item.type === category; });
        return '<details class="workspace-group" data-expand="' + category + '"' + expanded(category) + '>' +
            '<summary><span class="workspace-chevron" aria-hidden="true"></span><span>' + escape(taxonomy.typeLabels[category]) + '</span>' +
            '<small>' + items.length + '</small></summary><ul>' + items.map(product).join("") + '</ul></details>';
    }

    var mount = document.getElementById("workspace-navigation");
    mount.innerHTML = '<a class="workspace-skip" href="#main-content">跳到正文</a>' +
        '<button class="workspace-menu" type="button" aria-controls="product-sidebar" aria-expanded="false">产品目录</button>' +
        '<div class="workspace-overlay" hidden></div>' +
        '<aside id="product-sidebar" class="workspace-sidebar" aria-label="管理产品导航">' +
        '<header class="workspace-brand"><a href="' + url("index.html") + '">PRINCE2<sup>®</sup><span>7</span></a>' +
        '<button class="workspace-close" type="button" aria-label="关闭产品目录">×</button><p>管理产品 · 理论与实践</p></header>' +
        '<nav class="workspace-modes" aria-label="阅读模式"><a href="' + url("entities/product.html") + '" data-workspace-mode="theory"' + (!isCase ? ' aria-current="page"' : '') + '>产品知识</a>' +
        '<a href="' + url("cases/renovation.html") + '" data-workspace-mode="case"' + (isCase ? ' aria-current="page"' : '') + '>装修案例</a></nav>' +
        '<a class="workspace-overview" href="' + url(isCase ? "cases/renovation.html" : "entities/product.html") + '" aria-current="page">' +
        '<span class="workspace-overview-mark" aria-hidden="true"></span><span>' + (isCase ? "回到案例首页" : "管理产品总览") + '</span><small>总览</small></a>' +
        '<div class="workspace-search"><label for="workspace-search-input">查找管理产品</label><div class="workspace-search-field">' +
        '<input id="workspace-search-input" type="search" placeholder="搜索名称或编号，如 A13" autocomplete="off" value="' + escape(state.query) + '">' +
        '<button type="button" class="workspace-clear" aria-label="清除搜索" hidden>×</button></div>' +
        '<p id="workspace-search-status" aria-live="polite">15 项正式产品 · 7 基准 / 7 报告 / 1 记录</p></div>' +
        '<nav class="workspace-tree" aria-label="15 项正式管理产品">' + (products.length ? ["baseline", "report", "record"].map(group).join("") : '<p role="status">目录暂时无法加载，请刷新页面。</p>') + '</nav>' +
        '<p class="workspace-empty" hidden>没有匹配项，请尝试其他名称或编号。</p>' +
        '<div class="workspace-sidebar-note">同一目录，两种阅读方式。<br>灰色条目尚未完成当前模式的内容。</div></aside>';

    var sidebar = mount.querySelector(".workspace-sidebar");
    var tree = mount.querySelector(".workspace-tree");
    var input = mount.querySelector("input");
    var status = mount.querySelector("#workspace-search-status");
    var clear = mount.querySelector(".workspace-clear");
    var details = Array.from(tree.querySelectorAll("details"));
    var treeReady = false;
    function filter() {
        var query = input.value.trim().toLocaleLowerCase();
        var count = 0;
        tree.querySelectorAll(".workspace-product, .workspace-group > ul > .workspace-leaf").forEach(function (item) {
            var parentMatch = (item.dataset.name + " " + item.dataset.code).toLocaleLowerCase().includes(query);
            var childMatch = false;
            item.querySelectorAll(".workspace-leaf").forEach(function (child) {
                var match = parentMatch || child.dataset.name.toLocaleLowerCase().includes(query);
                child.hidden = !match;
                childMatch = childMatch || match;
                if (match) { count += 1; }
            });
            item.hidden = !parentMatch && !childMatch;
            if (!item.hidden) { count += 1; }
        });
        tree.querySelectorAll(".workspace-group").forEach(function (item) {
            item.hidden = !Array.from(item.querySelector("ul").children).some(function (child) { return !child.hidden; });
        });
        details.forEach(function (item) {
            var next = query ? true : Boolean(state.expanded[item.dataset.expand]);
            if (item.open !== next) { item.dataset.filterToggle = String(next); item.open = next; }
        });
        clear.hidden = !query;
        mount.querySelector(".workspace-empty").hidden = count > 0;
        status.textContent = query ? "找到 " + count + " 个匹配节点" : "15 项正式产品 · 7 基准 / 7 报告 / 1 记录";
    }
    filter();
    details.forEach(function (item) {
        item.addEventListener("toggle", function () {
            if (item.dataset.filterToggle === String(item.open)) { delete item.dataset.filterToggle; return; }
            if (!treeReady || input.value.trim()) { return; }
            state.expanded[item.dataset.expand] = item.open;
            save();
        });
    });
    input.addEventListener("input", function () { state.query = input.value; filter(); save(); });
    clear.addEventListener("click", function () { input.value = ""; state.query = ""; filter(); save(); input.focus(); });
    tree.addEventListener("scroll", function () { state.scroll = tree.scrollTop; save(); }, { passive: true });
    window.addEventListener("pagehide", function () { state.scroll = tree.scrollTop; save(); });
    requestAnimationFrame(function () { tree.scrollTop = state.scroll; treeReady = true; });

    // 目录单独滚动，切换模式不会把页面正文的位置带到另一页。
    var menu = mount.querySelector(".workspace-menu");
    var close = mount.querySelector(".workspace-close");
    var overlay = mount.querySelector(".workspace-overlay");
    var previousFocus;
    function drawer(open) {
        var opened = open && media.matches;
        if (opened) { previousFocus = document.activeElement; }
        sidebar.classList.toggle("is-open", opened);
        overlay.hidden = !opened;
        menu.setAttribute("aria-expanded", String(opened));
        var main = document.getElementById("main-content");
        if (main) { main.inert = opened; }
        // 先移出焦点再隐藏目录，兼容窗口缩窄和关闭抽屉。
        if (!opened) {
            if (media.matches && sidebar.contains(document.activeElement)) { menu.focus({ preventScroll: true }); }
            else if (previousFocus && previousFocus.isConnected && !sidebar.contains(previousFocus)) { previousFocus.focus({ preventScroll: true }); }
            previousFocus = null;
        }
        sidebar.inert = media.matches && !opened;
        sidebar.setAttribute("aria-hidden", String(media.matches && !opened));
        document.body.classList.toggle("workspace-drawer-open", opened);
        if (opened) { close.focus({ preventScroll: true }); }
    }
    menu.addEventListener("click", function () { drawer(menu.getAttribute("aria-expanded") !== "true"); });
    close.addEventListener("click", function () { drawer(false); });
    overlay.addEventListener("click", function () { drawer(false); });
    media.addEventListener("change", function () { drawer(false); });
    document.addEventListener("keydown", function (event) {
        if (menu.getAttribute("aria-expanded") !== "true") { return; }
        if (event.key === "Escape") { drawer(false); }
        if (event.key !== "Tab") { return; }
        var focusable = Array.from(sidebar.querySelectorAll("a, button, input, summary")).filter(function (item) { return item.getClientRects().length; });
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    drawer(false);

    function setDetailContext(context) {
        var firstSelection = !document.body.dataset.workspaceCurrent;
        mode = context.mode;
        isCase = mode === "case";
        document.body.dataset.productShell = mode;
        document.body.dataset.workspaceCurrent = context.name;
        mount.querySelectorAll("[data-workspace-mode]").forEach(function (link) {
            var target = new URL(location.href);
            target.searchParams.set("mode", link.dataset.workspaceMode);
            link.href = target.href;
            link.dataset.detailMode = link.dataset.workspaceMode;
            if (link.dataset.workspaceMode === mode) { link.setAttribute("aria-current", "page"); }
            else { link.removeAttribute("aria-current"); }
        });
        var overview = mount.querySelector(".workspace-overview");
        overview.href = url(isCase ? "cases/renovation.html" : "entities/product.html");
        overview.removeAttribute("aria-current");
        overview.querySelector("span:nth-child(2)").textContent = isCase ? "回到案例首页" : "管理产品总览";
        tree.querySelectorAll(".workspace-leaf").forEach(function (item) {
            var name = item.dataset.name;
            var href = route(name);
            var row = item.firstElementChild;
            if ((href && row.tagName !== "A") || (!href && row.tagName !== "SPAN")) {
                var replacement = document.createElement(href ? "a" : "span");
                replacement.className = "workspace-row";
                replacement.innerHTML = row.innerHTML;
                row.replaceWith(replacement);
                row = replacement;
            }
            row.classList.toggle("is-unavailable", !href);
            if (href) { row.href = href; row.removeAttribute("aria-disabled"); row.removeAttribute("title"); }
            else { row.setAttribute("aria-disabled", "true"); row.title = (isCase ? "对应案例" : "新版理论详情") + "待完善"; }
            row.querySelector(".workspace-status").textContent = href ? (isCase ? "案例" : "理论") : "待完善";
            if (name === context.name) { row.setAttribute("aria-current", "page"); }
            else { row.removeAttribute("aria-current"); }
        });
        if (firstSelection) {
            var selected = tree.querySelector('.workspace-row[aria-current="page"]');
            var ancestor = selected && selected.parentElement;
            while (ancestor && ancestor !== tree) {
                if (ancestor.matches("details[data-expand]")) { state.expanded[ancestor.dataset.expand] = true; }
                ancestor = ancestor.parentElement;
            }
            filter(); save();
            requestAnimationFrame(function () {
                if (!selected || !selected.getClientRects().length) { return; }
                var bounds = tree.getBoundingClientRect();
                var current = selected.getBoundingClientRect();
                if (current.top < bounds.top || current.bottom > bounds.bottom) {
                    tree.scrollTop += current.top - bounds.top - 12;
                    state.scroll = tree.scrollTop;
                    save();
                }
            });
        }
        var label = document.querySelector(".workspace-mode-label");
        if (label) { label.textContent = isCase ? "案例模式" : "理论模式"; }
    }
    window.PRINCE2Workspace = { setDetailContext: setDetailContext, setDrawer: drawer };

    function finish() {
        var top = document.getElementById("workspace-topbar");
        top.innerHTML = '<nav aria-label="全站导航">' + [["index.html", "返回主页"], ["entities/principle.html", "原则"], ["entities/practice.html", "实践"], ["entities/process.html", "流程"], ["entities/role.html", "角色"], ["entities/product.html", "管理产品"], ["entities/term.html", "术语"]].map(function (item) {
            return '<a href="' + url(item[0]) + '"' + (item[1] === "管理产品" ? ' aria-current="page"' : '') + '>' + item[1] + '</a>';
        }).join("") + '</nav><span class="workspace-mode-label">' + (isCase ? "案例模式" : "理论模式") + '</span>';
        document.querySelectorAll("[data-tree-filter]").forEach(function (button) {
            button.addEventListener("click", function () {
                input.value = ""; state.query = "";
                var category = button.dataset.treeFilter;
                state.expanded[category] = true;
                filter(); save();
                if (media.matches) { drawer(true); }
                var target = tree.querySelector('[data-expand="' + category + '"]');
                if (target) { tree.scrollTop += target.getBoundingClientRect().top - tree.getBoundingClientRect().top; }
            });
        });
        // 总览互切保持侧栏状态，沿用普通链接以兼容刷新和前进后退。
        mount.querySelectorAll("[data-workspace-mode]").forEach(function (link) {
            link.addEventListener("click", function () { state.scroll = tree.scrollTop; save(); });
            if (detailSlug) { link.dataset.detailMode = link.dataset.workspaceMode; }
        });
        function focusLegacyHash() {
            var id;
            try { id = decodeURIComponent(location.hash.slice(1)); } catch (error) { return; }
            var item = document.getElementById(id);
            if (!item || !tree.contains(item)) { return; }
            input.value = ""; state.query = "";
            var ancestor = item.parentElement;
            while (ancestor && ancestor !== tree) {
                if (ancestor.matches("details[data-expand]")) { state.expanded[ancestor.dataset.expand] = true; }
                ancestor = ancestor.parentElement;
            }
            if (item.classList.contains("workspace-product")) { state.expanded[item.dataset.code] = true; }
            filter(); save();
            tree.querySelectorAll(".is-targeted").forEach(function (target) { target.classList.remove("is-targeted"); });
            item.classList.add("is-targeted");
            tree.scrollTop += item.getBoundingClientRect().top - tree.getBoundingClientRect().top - 12;
        }
        window.addEventListener("hashchange", focusLegacyHash);
        focusLegacyHash();
    }
    if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", finish, { once: true }); }
    else { finish(); }
}());
