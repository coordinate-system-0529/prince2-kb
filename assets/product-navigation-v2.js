(function (global) {
    "use strict";

    var NAV_BUILD = "20260814-2";
    var SIDEBAR_SCROLL_KEY = "prince2-product-sidebar-scroll";

    if ("scrollRestoration" in global.history) {
        global.history.scrollRestoration = "manual";
    }

    function withBuildVersion(href) {
        if (!href || href.charAt(0) === "#") {
            return href;
        }
        var parts = href.split("#");
        var separator = parts[0].indexOf("?") === -1 ? "?" : "&";
        return parts[0] + separator + "v=" + NAV_BUILD + (parts[1] ? "#" + parts[1] : "");
    }

    function setupSidebarScrollPersistence(sidebar) {
        if (!sidebar) {
            return;
        }
        try {
            var savedScroll = Number(global.sessionStorage.getItem(SIDEBAR_SCROLL_KEY));
            if (Number.isFinite(savedScroll) && savedScroll > 0) {
                sidebar.scrollTop = savedScroll;
            }
        } catch (error) {
            // 浏览器禁用会话存储时保持默认滚动行为。
        }
        function saveScroll() {
            try {
                global.sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(sidebar.scrollTop));
            } catch (error) {
                // 浏览器禁用会话存储时无需处理。
            }
        }
        sidebar.addEventListener("scroll", saveScroll, { passive: true });
        global.addEventListener("pagehide", saveScroll);
    }

    var CATEGORY_META = {
        baseline: { label: "基准", mark: "定" },
        report: { label: "报告", mark: "报" },
        record: { label: "项目记录单", mark: "记" }
    };
    var CATEGORY_ORDER = ["baseline", "report", "record"];
    var COUNTS = {
        products: 15,
        knowledge: Object.keys(global.PRINCE2_PRODUCT_ROUTES || {}).length || 27,
        planned: global.PRINCE2_PRODUCT_ROUTES ? 0 : 4,
        building: 0
    };
    var PLANNED_COMPONENTS = {
        "小组计划": "待完善",
        "变更管理方法": "待完善",
        "商务管理方法": "待完善",
        "数字化和数据管理方法": "待完善"
    };
    var COMPONENT_TARGETS = {
        "概要商业论证": "product-detail-v2.html?entry=outline-business-case",
        "完整商业论证": "product-detail-v2.html?entry=full-business-case",
        "项目计划": "product-detail-v2.html?entry=project-plan",
        "阶段计划": "product.html#entity-阶段计划",
        "例外计划": "product.html#entity-例外计划",
        "收益管理方法": "product.html#entity-收益管理方法",
        "沟通管理方法": "product.html#entity-沟通管理方法",
        "问题管理方法": "product.html#entity-问题管理方法",
        "质量管理方法": "product.html#entity-质量管理方法",
        "风险管理方法": "product.html#entity-风险管理方法",
        "可持续性管理方法": "product.html#entity-可持续性管理方法",
        "日志": "product.html#entity-日志",
        "问题登记单": "product.html#entity-问题登记单",
        "经验教训记录单": "product.html#entity-经验教训记录单",
        "产品登记单": "product-detail-v2.html?entry=product-register",
        "质量登记单": "product.html#entity-质量登记单",
        "风险登记单": "product.html#entity-风险登记单"
    };
    var COMPONENT_IDS = {
        "概要商业论证": "outline-business-case",
        "完整商业论证": "full-business-case",
        "项目计划": "project-plan",
        "阶段计划": "stage-plan",
        "例外计划": "exception-plan",
        "小组计划": "team-plan",
        "收益管理方法": "benefits-management-approach",
        "变更管理方法": "change-management-approach",
        "商务管理方法": "commercial-management-approach",
        "沟通管理方法": "communication-management-approach",
        "数字化和数据管理方法": "digital-and-data-management-approach",
        "问题管理方法": "issue-management-approach",
        "质量管理方法": "quality-management-approach",
        "风险管理方法": "risk-management-approach",
        "可持续性管理方法": "sustainability-management-approach",
        "日志": "daily-log",
        "问题登记单": "issue-register",
        "经验教训记录单": "lessons-log",
        "产品登记单": "product-register",
        "质量登记单": "quality-register",
        "风险登记单": "risk-register"
    };
    var CASE_DECORATIONS = {
        A9: { components: { "项目计划": { href: "product-detail-v2.html?entry=project-plan&mode=case", badge: "案例" } } },
        A1: {
            href: "../cases/project-brief.html#business-case",
            badge: "关联案例",
            components: {
                "概要商业论证": {
                    href: "product-detail-v2.html?entry=outline-business-case&mode=case",
                    badge: "案例"
                },
                "完整商业论证": {
                    href: "product-detail-v2.html?entry=full-business-case&mode=case",
                    badge: "案例"
                }
            }
        },
        A10: { href: "../cases/product-description-waterproofing.html", badge: "案例" },
        A11: { href: "../cases/project-brief.html", badge: "案例" },
        A13: {
            components: {
                "产品登记单": { href: "../cases/product-register.html", badge: "案例" },
                "质量登记单": { href: "../cases/waterproof-quality-records.html", badge: "证据包" }
            }
        },
        A14: { href: "../cases/project-product-description.html", badge: "案例" }
    };
    var PROCESS_OUTPUT = {
        id: "project-close-recommendation",
        code: "CP",
        name: "项目收尾建议",
        href: "product.html#entity-项目收尾建议"
    };

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function resolveElement(value, fallbackSelector) {
        if (value && value.nodeType === 1) {
            return value;
        }
        if (typeof value === "string") {
            return document.querySelector(value);
        }
        return fallbackSelector ? document.querySelector(fallbackSelector) : null;
    }

    function taxonomyProducts() {
        var taxonomy = global.PRINCE2_PRODUCT_TAXONOMY;
        var products = Array.isArray(taxonomy) ? taxonomy : taxonomy && taxonomy.products;
        return Array.isArray(products) ? products : [];
    }

    function productCode(product) {
        return String(product.code || product.appendix || "").toUpperCase();
    }

    function productName(product) {
        return product.nameZh || product.zhName || product.name || product.title || "";
    }

    function componentName(component) {
        return typeof component === "string" ? component : productName(component || {});
    }

    function componentId(name) {
        return COMPONENT_IDS[name] || "";
    }

    function productTarget(product) {
        var route = (global.PRINCE2_PRODUCT_ROUTES || {})[productName(product)];
        if (route) { return "product-detail-v2.html?entry=" + route + "&mode=theory"; }
        var detailId = product.detailId || ("entity-" + productName(product));
        return "product.html#" + encodeURIComponent(detailId);
    }

    function componentTarget(name) {
        var route = (global.PRINCE2_PRODUCT_ROUTES || {})[name];
        if (route) { return "product-detail-v2.html?entry=" + route + "&mode=theory"; }
        return COMPONENT_TARGETS[name] || "";
    }

    function relationLabel(code) {
        var labels = {
            A1: "演进状态",
            A9: "计划类型",
            A12: "内嵌管理方法",
            A13: "组成项"
        };
        return labels[code] || "组成项";
    }

    function renderCaseBadge(decoration, itemName) {
        if (decoration && decoration.href) {
            return "<a class=\"tree-badge is-case\" href=\"" + escapeHtml(decoration.href) +
                "\" aria-label=\"查看" + escapeHtml(itemName) + escapeHtml(decoration.badge || "案例") + "\">" +
                escapeHtml(decoration.badge || "案例") + "</a>";
        }
        return "<span class=\"tree-badge is-disabled\" aria-disabled=\"true\" title=\"" +
            escapeHtml(itemName) + "对应的装修案例正在建设中\">建设中</span>";
    }

    function renderComponent(product, component, decoration) {
        var name = componentName(component);
        var route = (global.PRINCE2_PRODUCT_ROUTES || {})[name];
        if (route) { decoration = { href: "product-detail-v2.html?entry=" + route + "&mode=case", badge: "案例" }; }
        var plannedLabel = route ? "" : PLANNED_COMPONENTS[name] || "";
        var planned = Boolean(plannedLabel);
        var href = planned ? "" : componentTarget(name);
        var id = componentId(name);
        var target = planned ?
            "<span class=\"tree-component-link is-disabled\" aria-disabled=\"true\" title=\"该条目" +
                escapeHtml(plannedLabel) + "\">" +
                escapeHtml(name) + "</span>" :
            "<a class=\"tree-component-link\" href=\"" + escapeHtml(href) + "\">" +
                escapeHtml(name) + "</a>";
        var statusBadge = planned ?
            "<span class=\"tree-badge is-disabled is-planned\" aria-disabled=\"true\">" +
                escapeHtml(plannedLabel) + "</span>" :
            renderCaseBadge(decoration, name);

        return "<li id=\"" + escapeHtml("entity-" + name) + "\" class=\"tree-component-item" +
            (planned ? " is-planned" : "") + "\" data-item-name=\"" + escapeHtml(name) +
            "\" data-entry-id=\"" + escapeHtml(id) +
            "\" data-search-text=\"" +
            escapeHtml((productCode(product) + " " + productName(product) + " " + name + " " + id).toLocaleLowerCase("zh-CN")) +
            "\"><span class=\"tree-branch\" aria-hidden=\"true\"></span>" + target + statusBadge + "</li>";
    }

    function renderProduct(product) {
        var code = productCode(product);
        var name = productName(product);
        var id = product.id || "";
        var decoration = CASE_DECORATIONS[code] || {};
        var route = (global.PRINCE2_PRODUCT_ROUTES || {})[name];
        if (route) { decoration = Object.assign({}, decoration, { href: "product-detail-v2.html?entry=" + route + "&mode=case", badge: "案例" }); }
        var componentDecorations = decoration.components || {};
        var components = (product.components || []).map(function (component) {
            var nameValue = componentName(component);
            return renderComponent(product, component, componentDecorations[nameValue] || {});
        }).join("");

        return "<li id=\"" + escapeHtml(product.detailId || ("entity-" + name)) +
            "\" class=\"tree-product-item\" data-item-name=\"" + escapeHtml(name) +
            "\" data-entry-id=\"" + escapeHtml(id) + "\" data-product-code=\"" + escapeHtml(code) +
            "\" data-search-text=\"" + escapeHtml((code + " " + name + " " + id).toLocaleLowerCase("zh-CN")) +
            "\"><div class=\"tree-product-row\"><a class=\"tree-product-link\" href=\"" +
            escapeHtml(productTarget(product)) + "\"><b>" + escapeHtml(code) + "</b><span>" +
            escapeHtml(name) + "</span></a>" + renderCaseBadge(decoration, name) + "</div>" +
            (components ? "<ul class=\"tree-component-list\" aria-label=\"" + escapeHtml(name) + "的" +
                relationLabel(code) + "\">" + components + "</ul>" : "") + "</li>";
    }

    function renderGroup(type, products) {
        var meta = CATEGORY_META[type];
        var grouped = products.filter(function (product) {
            return product.type === type;
        });
        return "<details class=\"product-tree-group\" data-category=\"" + type + "\"" +
            (type === "baseline" ? " open" : "") + "><summary><span class=\"tree-group-mark is-" +
            type + "\">" + meta.mark + "</span><span class=\"tree-group-label\">" + meta.label +
            "</span><small class=\"tree-group-count\">" + grouped.length + "</small></summary>" +
            "<ul class=\"tree-product-list\">" + grouped.map(renderProduct).join("") + "</ul></details>";
    }

    function renderProcessOutput() {
        return "<details class=\"product-tree-group tree-process-output\" data-category=\"process-output\">" +
            "<summary><span class=\"tree-group-mark is-output\">出</span>" +
            "<span class=\"tree-group-label\">流程输出</span><small class=\"tree-group-count\">1</small></summary>" +
            "<ul class=\"tree-product-list\"><li id=\"entity-项目收尾建议\" class=\"tree-product-item\" data-item-name=\"" +
            PROCESS_OUTPUT.name + "\" data-entry-id=\"" + PROCESS_OUTPUT.id + "\" data-search-text=\"" +
            (PROCESS_OUTPUT.code + " " + PROCESS_OUTPUT.name + " 流程输出 非正式产品").toLocaleLowerCase("zh-CN") +
            "\"><div class=\"tree-product-row\"><a class=\"tree-product-link\" href=\"" +
            PROCESS_OUTPUT.href + "\"><b>" + PROCESS_OUTPUT.code + "</b><span>" + PROCESS_OUTPUT.name +
            "</span></a><span class=\"tree-badge is-output\" title=\"流程动作或输出，不是 Appendix A 正式管理产品\">" +
            "非正式产品</span></div></li></ul></details>";
    }

    function renderTree(tree, products) {
        tree.innerHTML = "<div class=\"product-tree-groups\">" + CATEGORY_ORDER.map(function (type) {
            return renderGroup(type, products);
        }).join("") + renderProcessOutput() + "</div>";
    }

    function setDefaultStatus(status) {
        if (status) {
            var parts = [
                COUNTS.products + " 项正式产品",
                COUNTS.knowledge + " 个阅读入口"
            ];
            if (COUNTS.planned) parts.push(COUNTS.planned + " 条待完善");
            if (COUNTS.building) {
                parts.push(COUNTS.building + " 条建设中");
            }
            status.textContent = parts.join(" · ");
        }
    }

    function setupSearch(tree, input, status) {
        function refreshSearch() {
            var query = input ? input.value.trim().toLocaleLowerCase("zh-CN") : "";
            var visibleEntries = 0;

            tree.querySelectorAll(".tree-product-item").forEach(function (productItem) {
                var productText = productItem.getAttribute("data-search-text") || "";
                var productMatch = !query || productText.indexOf(query) !== -1;
                var components = productItem.querySelectorAll(".tree-component-item");
                var componentMatches = 0;

                components.forEach(function (componentItem) {
                    var componentText = componentItem.getAttribute("data-search-text") || "";
                    var componentMatch = !query || componentText.indexOf(query) !== -1;
                    componentItem.hidden = Boolean(query) && !productMatch && !componentMatch;
                    if (!componentItem.hidden) {
                        componentMatches += 1;
                    }
                });

                productItem.hidden = Boolean(query) && !productMatch && componentMatches === 0;
                if (!productItem.hidden) {
                    visibleEntries += 1 + componentMatches;
                }
            });

            tree.querySelectorAll(".product-tree-group").forEach(function (group) {
                var hasResult = Array.prototype.some.call(group.querySelectorAll(".tree-product-item"), function (item) {
                    return !item.hidden;
                });
                group.hidden = !hasResult;
                if (query && hasResult) {
                    group.open = true;
                }
            });

            if (query && status) {
                status.textContent = visibleEntries ? "找到 " + visibleEntries + " 个匹配节点" : "没有匹配的管理产品";
            } else {
                setDefaultStatus(status);
            }
            return visibleEntries;
        }

        if (input) {
            input.addEventListener("input", refreshSearch);
        }
        refreshSearch();
        return refreshSearch;
    }

    function setupDrawer(elements) {
        var sidebar = elements.sidebar;
        var toggle = elements.toggle;
        var close = elements.close;
        var overlay = elements.overlay;
        var main = elements.main;
        var mobileQuery = global.matchMedia("(max-width: 900px)");
        var previousFocus = null;
        var previousOverflow = "";
        var previousPaddingRight = "";

        function isOpen() {
            return Boolean(sidebar && sidebar.classList.contains("is-open"));
        }

        function syncAccessibility(open) {
            if (!sidebar) {
                return;
            }
            if (mobileQuery.matches && !open) {
                sidebar.setAttribute("aria-hidden", "true");
                sidebar.setAttribute("inert", "");
            } else {
                sidebar.removeAttribute("aria-hidden");
                sidebar.removeAttribute("inert");
            }
            if (main) {
                if (mobileQuery.matches && open) {
                    main.setAttribute("inert", "");
                } else {
                    main.removeAttribute("inert");
                }
            }
        }

        function setDrawer(open, restoreFocus) {
            var nextOpen = Boolean(open) && mobileQuery.matches;
            if (!sidebar || !toggle) {
                return false;
            }
            if (nextOpen && !isOpen()) {
                previousFocus = document.activeElement;
                previousOverflow = document.documentElement.style.overflow;
                previousPaddingRight = document.documentElement.style.paddingRight;
            }
            sidebar.classList.toggle("is-open", nextOpen);
            document.body.classList.toggle("sidebar-open", nextOpen);
            toggle.setAttribute("aria-expanded", String(nextOpen));
            syncAccessibility(nextOpen);
            if (overlay) {
                overlay.hidden = !nextOpen;
            }

            if (nextOpen) {
                var scrollbarGap = global.innerWidth - document.documentElement.clientWidth;
                document.documentElement.style.overflow = "hidden";
                document.documentElement.style.paddingRight = scrollbarGap > 0 ? scrollbarGap + "px" : previousPaddingRight;
                global.requestAnimationFrame(function () {
                    var focusTarget = close || sidebar.querySelector("input, a[href], button:not([disabled])");
                    if (focusTarget) {
                        focusTarget.focus({ preventScroll: true });
                    }
                });
            } else {
                document.documentElement.style.overflow = previousOverflow;
                document.documentElement.style.paddingRight = previousPaddingRight;
                if (restoreFocus !== false && previousFocus && document.contains(previousFocus)) {
                    previousFocus.focus({ preventScroll: true });
                }
            }
            return nextOpen;
        }

        if (!sidebar || !toggle) {
            return function () { return false; };
        }

        toggle.setAttribute("aria-controls", sidebar.id || "product-sidebar");
        toggle.setAttribute("aria-expanded", "false");
        if (overlay) {
            overlay.hidden = true;
        }
        syncAccessibility(false);

        toggle.addEventListener("click", function () {
            setDrawer(!isOpen());
        });
        if (close) {
            close.addEventListener("click", function () {
                setDrawer(false);
            });
        }
        if (overlay) {
            overlay.addEventListener("click", function () {
                setDrawer(false);
            });
        }
        sidebar.addEventListener("click", function (event) {
            if (mobileQuery.matches && event.target.closest("a[href]")) {
                setDrawer(false, false);
            }
        });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && isOpen()) {
                setDrawer(false);
                return;
            }
            if (event.key !== "Tab" || !mobileQuery.matches || !isOpen()) {
                return;
            }
            var focusable = Array.prototype.filter.call(sidebar.querySelectorAll(
                "a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex=\"-1\"])"
            ), function (element) {
                return !element.hidden && element.getClientRects().length > 0;
            });
            if (!focusable.length) {
                return;
            }
            var first = focusable[0];
            var last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });

        function handleViewportChange() {
            if (!mobileQuery.matches && isOpen()) {
                setDrawer(false, false);
            }
            syncAccessibility(isOpen());
        }
        if (typeof mobileQuery.addEventListener === "function") {
            mobileQuery.addEventListener("change", handleViewportChange);
        } else {
            mobileQuery.addListener(handleViewportChange);
        }
        return setDrawer;
    }

    function setupModes() {
        document.querySelectorAll("[data-mode]").forEach(function (link) {
            var mode = link.getAttribute("data-mode");
            if (mode === "knowledge") {
                link.href = "product.html";
                link.setAttribute("aria-current", "page");
            } else if (mode === "case") {
                link.href = withBuildVersion("../cases/renovation.html");
                link.removeAttribute("aria-current");
            }
        });
    }

    function init(options) {
        var settings = options || {};
        var elements = {
            tree: resolveElement(settings.tree, "#product-tree"),
            searchInput: resolveElement(settings.searchInput, "#product-tree-search"),
            status: resolveElement(settings.status, "#product-tree-status"),
            sidebar: resolveElement(settings.sidebar, "#product-sidebar, .product-sidebar-v2"),
            toggle: resolveElement(settings.toggle, "#sidebar-toggle"),
            close: resolveElement(settings.close, "#sidebar-close"),
            overlay: resolveElement(settings.overlay, "#sidebar-overlay"),
            main: resolveElement(settings.main, "#main-content")
        };
        var products = taxonomyProducts();
        var tree = elements.tree;

        if (tree && tree.__prince2ProductNavigationController && !settings.force) {
            if (settings.currentItem) {
                tree.__prince2ProductNavigationController.markCurrentItem(settings.currentItem);
            }
            return tree.__prince2ProductNavigationController;
        }

        setupModes();
        setupSidebarScrollPersistence(elements.sidebar);
        var setDrawer = setupDrawer(elements);

        function emptyAction() {
            return false;
        }

        if (!tree) {
            return {
                setDrawer: setDrawer,
                focusCategory: emptyAction,
                refreshSearch: emptyAction,
                markCurrentItem: emptyAction
            };
        }
        if (!products.length) {
            tree.innerHTML = "<p class=\"tree-empty\">产品目录暂时无法加载，请刷新页面后重试。</p>";
            if (elements.status) {
                elements.status.textContent = "产品目录加载失败";
            }
            return {
                setDrawer: setDrawer,
                focusCategory: emptyAction,
                refreshSearch: emptyAction,
                markCurrentItem: emptyAction
            };
        }

        renderTree(tree, products);
        var refreshSearch = setupSearch(tree, elements.searchInput, elements.status);

        function markCurrentItem(value) {
            var currentItem = value || settings.currentItem || document.body.getAttribute("data-current-item") || "";
            tree.querySelectorAll(".is-current").forEach(function (link) {
                link.classList.remove("is-current");
                link.removeAttribute("aria-current");
            });
            if (!currentItem) {
                return false;
            }
            var target = Array.prototype.find.call(tree.querySelectorAll("[data-item-name], [data-entry-id]"), function (item) {
                return item.getAttribute("data-item-name") === currentItem || item.getAttribute("data-entry-id") === currentItem;
            });
            if (!target) {
                return false;
            }
            var link = target.querySelector(":scope > .tree-product-row .tree-product-link, :scope > .tree-component-link");
            if (link) {
                link.classList.add("is-current");
                link.setAttribute("aria-current", "page");
            }
            var group = target.closest("details");
            if (group) {
                group.open = true;
            }
            return true;
        }

        function focusHashTarget() {
            var hashId = "";
            try {
                hashId = decodeURIComponent(global.location.hash.slice(1));
            } catch (error) {
                hashId = global.location.hash.slice(1);
            }
            if (!hashId) {
                return false;
            }
            var target = document.getElementById(hashId);
            if (!target || !tree.contains(target)) {
                return false;
            }
            var group = target.closest("details");
            if (group) {
                group.hidden = false;
                group.open = true;
            }
            var link = target.querySelector(":scope > .tree-product-row .tree-product-link, :scope > .tree-component-link");
            if (link) {
                tree.querySelectorAll(".is-current").forEach(function (item) {
                    item.classList.remove("is-current");
                    item.removeAttribute("aria-current");
                });
                link.classList.add("is-current");
                link.setAttribute("aria-current", "page");
            }
            global.requestAnimationFrame(function () {
                if (!elements.sidebar) {
                    return;
                }
                var sidebarRect = elements.sidebar.getBoundingClientRect();
                var targetRect = target.getBoundingClientRect();
                elements.sidebar.scrollTop += targetRect.top - sidebarRect.top - 220;
            });
            return true;
        }

        function focusCategory(type) {
            var group = tree.querySelector('[data-category="' + String(type || "").replace(/"/g, "") + '"]');
            if (!group) {
                return false;
            }
            var mainScrollY = global.scrollY;
            if (elements.searchInput && elements.searchInput.value) {
                elements.searchInput.value = "";
                refreshSearch();
            }
            tree.querySelectorAll(".product-tree-group").forEach(function (item) {
                item.open = item === group;
            });
            group.hidden = false;
            if (global.matchMedia("(max-width: 900px)").matches) {
                setDrawer(true);
            }
            global.requestAnimationFrame(function () {
                if (elements.sidebar) {
                    elements.sidebar.scrollTop = Math.max(0, group.offsetTop - 260);
                }
                var summary = group.querySelector("summary");
                if (summary && global.matchMedia("(max-width: 900px)").matches) {
                    summary.focus({ preventScroll: true });
                }
                global.scrollTo({ top: mainScrollY, behavior: "auto" });
            });
            return true;
        }

        document.querySelectorAll("[data-tree-filter]").forEach(function (button) {
            button.addEventListener("click", function () {
                focusCategory(button.getAttribute("data-tree-filter"));
            });
        });

        markCurrentItem(settings.currentItem);
        focusHashTarget();
        global.addEventListener("hashchange", focusHashTarget);
        var controller = {
            setDrawer: setDrawer,
            focusCategory: focusCategory,
            refreshSearch: refreshSearch,
            markCurrentItem: markCurrentItem,
            focusHashTarget: focusHashTarget
        };
        tree.__prince2ProductNavigationController = controller;
        return controller;
    }

    global.PRINCE2ProductNavigation = {
        init: init,
        instance: null
    };

    function autoInit() {
        if (global.PRINCE2_PRODUCT_NAVIGATION_AUTO_INIT === false) {
            return;
        }
        global.PRINCE2ProductNavigation.instance = init();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", autoInit, { once: true });
    } else {
        autoInit();
    }
}(window));
