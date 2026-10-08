(function() {
    "use strict";

    function setupRecordInteractions() {
        document.querySelectorAll(".register-event-trigger").forEach(function (trigger) {
            trigger.addEventListener("click", function () {
                var panel = document.getElementById(trigger.getAttribute("aria-controls"));
                if (!panel) { return; }
                var open = trigger.getAttribute("aria-expanded") !== "true";
                trigger.setAttribute("aria-expanded", String(open));
                panel.hidden = !open;
            });
        });
    }

    // 现行案例共用工作区目录，旧目录仅保留为兼容入口。
    if (document.body.hasAttribute("data-product-shell")) {
        setupRecordInteractions();
        if (document.body.hasAttribute("data-workspace-source")) {
            function syncSourceContext() {
                if (!window.PRINCE2Workspace) { return; }
                var name = document.body.dataset.caseProduct;
                if (name === "项目概述文件" && location.hash === "#business-case") { name = "概要商业论证"; }
                if (document.body.dataset.caseProduct === "风险登记单" && location.hash === "#lessons-log") {
                    name = "经验教训记录单";
                }
                window.PRINCE2Workspace.setSourceContext({ name: name, kind: document.body.dataset.workspaceSource });
            }
            syncSourceContext();
            // 底部脚本接入的摘录页，要在工作区页头完成后再同步一次身份。
            if (document.readyState !== "complete") {
                document.addEventListener("DOMContentLoaded", syncSourceContext, { once: true });
            }
            window.addEventListener("hashchange", syncSourceContext);
            if ("scrollRestoration" in history) { history.scrollRestoration = "auto"; }
        }
        return;
    }

    var NAV_BUILD = "20260814-2";
    var SIDEBAR_SCROLL_KEY = "prince2-product-sidebar-scroll";
    var isKnowledgeIndex = document.body.hasAttribute("data-product-index");

    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    function withBuildVersion(href) {
        if (!href || href.charAt(0) === "#") {
            return href;
        }
        var parts = href.split("#");
        var separator = parts[0].indexOf("?") === -1 ? "?" : "&";
        return parts[0] + separator + "v=" + NAV_BUILD + (parts[1] ? "#" + parts[1] : "");
    }

    function addPrefetch(href) {
        var link = document.createElement("link");
        link.rel = "prefetch";
        link.href = href;
        document.head.appendChild(link);
    }

    addPrefetch(withBuildVersion("../entities/product.html"));

    // 分类、名称和组成项只读取共享数据源；这里仅保存案例库专属的链接和状态。
    var caseDecorations = {
        A1: {
            href: "project-brief.html#business-case",
            badge: "关联案例",
            components: {
                "概要商业论证": { href: "project-brief.html#business-case", badge: "关联案例" },
                "完整商业论证": {
                    href: "../entities/product-detail-v2.html?entry=full-business-case&mode=case",
                    badge: "案例"
                }
            }
        },
        A10: { href: "product-description-waterproofing.html", badge: "案例" },
        A11: { href: "project-brief.html", badge: "案例" },
        A13: {
            components: {
                "产品登记单": { href: "product-register.html", badge: "案例" },
                "质量登记单": { href: "waterproof-quality-records.html", badge: "证据包" }
            }
        },
        A14: { href: "project-product-description.html", badge: "案例" }
    };

    var categoryMeta = {
        baseline: { label: "基准", mark: "定", expected: 7 },
        report: { label: "报告", mark: "报", expected: 7 },
        record: { label: "记录", mark: "记", expected: 1 }
    };

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;");
    }

    function sharedProducts() {
        var source = window.PRINCE2_PRODUCT_TAXONOMY;
        var products = Array.isArray(source) ? source : source && source.products;
        return Array.isArray(products) ? products : [];
    }

    function productCode(product) {
        return String(product.code || product.id || product.appendix || "").toUpperCase();
    }

    function productName(product) {
        return product.nameZh || product.zhName || product.name || product.title || "";
    }

    function isCaseDecoration(decoration) {
        return decoration && ["案例", "关联案例", "证据包"].indexOf(decoration.badge) !== -1;
    }

    function caseHref(decoration) {
        if (!isCaseDecoration(decoration) || !decoration.href) {
            return "";
        }
        if (/^(?:\.\.\/|\/|https?:)/.test(decoration.href)) {
            return decoration.href;
        }
        return isKnowledgeIndex ? "../cases/" + decoration.href : decoration.href;
    }

    function knowledgeHref(name) {
        var detailTargets = {
            "概要商业论证": "product-detail-v2.html?entry=outline-business-case&mode=theory",
            "完整商业论证": "product-detail-v2.html?entry=full-business-case&mode=theory",
            "产品登记单": "product-detail-v2.html?entry=product-register"
        };
        if (detailTargets[name]) {
            return (isKnowledgeIndex ? "" : "../entities/") + detailTargets[name];
        }
        var targetName = name;
        var hash = "#entity-" + encodeURIComponent(targetName || "");
        return isKnowledgeIndex ? hash : "../entities/product.html" + hash;
    }

    function findProductContext(name) {
        var result = null;
        sharedProducts().some(function(product) {
            var code = productCode(product);
            var decoration = caseDecorations[code] || {};
            if (productName(product) === name) {
                result = { product: product, decoration: decoration };
                return true;
            }
            return (product.components || []).some(function(component) {
                var componentName = typeof component === "string" ? component : productName(component);
                if (componentName !== name) {
                    return false;
                }
                result = {
                    product: product,
                    componentName: componentName,
                    decoration: (decoration.components || {})[componentName] || {}
                };
                return true;
            });
        });
        return result;
    }

    function currentSelection() {
        if (isKnowledgeIndex) {
            if (window.location.hash.indexOf("#entity-") !== 0) {
                return "";
            }
            try {
                return decodeURIComponent(window.location.hash.slice("#entity-".length));
            } catch (error) {
                return "";
            }
        }

        // 项目概述文件同时承载 A1 的概要商业论证案例，只有该锚点属于 A1。
        if (document.body.getAttribute("data-case-product") === "项目概述文件" &&
                window.location.hash === "#business-case") {
            return "概要商业论证";
        }
        if (!document.body.hasAttribute("data-case-product") &&
                /\/renovation\.html$/.test(window.location.pathname) &&
                window.location.hash === "#full-business-case") {
            return "完整商业论证";
        }
        return document.body.getAttribute("data-case-product") || "";
    }

    function productsForSidebar() {
        return sharedProducts().map(function(product) {
            var code = productCode(product);
            var decoration = caseDecorations[code] || {};
            var componentDecorations = decoration.components || {};
            var components = (product.components || []).map(function(component) {
                var name = typeof component === "string" ? component : productName(component);
                var componentDecoration = componentDecorations[name] || {};
                return {
                    name: name,
                    href: isKnowledgeIndex ? knowledgeHref(name) : caseHref(componentDecoration),
                    badge: isKnowledgeIndex ? "产品知识" : (componentDecoration.badge || "建设中")
                };
            });
            return {
                code: code,
                name: productName(product),
                category: product.type,
                detailId: product.detailId,
                href: isKnowledgeIndex ? "#" + product.detailId : caseHref(decoration),
                badge: isKnowledgeIndex ? "产品知识" : (decoration.badge || "建设中"),
                components: components
            };
        });
    }

    function renderLink(item, className, code, currentProduct) {
        var name = item.name;
        var href = item.href;
        var isCurrent = name === currentProduct;
        var content = (code ? "<b>" + escapeHtml(code) + "</b> " : "") + escapeHtml(name) +
            (item.badge ? " <em>" + escapeHtml(item.badge) + "</em>" : "");
        if (!href) {
            return "<span class=\"" + className + " is-disabled\" aria-disabled=\"true\"" +
                " data-product-name=\"" + escapeHtml(name) + "\">" + content + "</span>";
        }
        return "<a class=\"" + className + "\" data-product-name=\"" + escapeHtml(name) +
            "\" href=\"" + escapeHtml(href) + "\"" +
            (isCurrent ? " aria-current=\"page\"" : "") + ">" + content + "</a>";
    }

    function renderProduct(product, currentProduct) {
        var components = product.components || [];
        var containsCurrent = product.name === currentProduct || components.some(function(component) {
            return component.name === currentProduct;
        });
        var children = components.length ? "<ul class=\"product-sidebar-components\" aria-label=\"" +
            escapeHtml(product.name) + "的组成项\">" + components.map(function(component) {
                return "<li class=\"product-sidebar-component\">" +
                    renderLink(component, "sidebar-component-link", "", currentProduct) + "</li>";
            }).join("") + "</ul>" : "";
        return "<li class=\"product-sidebar-product" + (containsCurrent ? " contains-current" : "") +
            "\" data-product-code=\"" + escapeHtml(product.code) + "\">" +
            renderLink(product, "sidebar-product-link", product.code, currentProduct) +
            children + "</li>";
    }

    function renderGroups(products, currentProduct) {
        var categoryOrder = ["baseline", "report", "record"];
        return categoryOrder.map(function(category, index) {
            var meta = categoryMeta[category];
            var categoryProducts = products.filter(function(product) { return product.category === category; });
            var containsCurrent = categoryProducts.some(function(product) {
                return product.name === currentProduct || (product.components || []).some(function(component) {
                    return component.name === currentProduct;
                });
            });
            return "<details" + ((!currentProduct && index === 0) || containsCurrent ? " open" : "") + ">" +
                "<summary><span class=\"sidebar-type-mark is-" + category + "\">" + meta.mark + "</span>" +
                meta.label + " <small>" + categoryProducts.length + "</small></summary><ul class=\"product-sidebar-list\">" +
                categoryProducts.map(function(product) { return renderProduct(product, currentProduct); }).join("") +
                "</ul></details>";
        }).join("");
    }

    function createCaseSidebar() {
        if (document.body.hasAttribute("data-product-shell")) { return; }
        var currentProduct = currentSelection();
        if (document.getElementById("product-sidebar")) {
            return;
        }

        var products = productsForSidebar();
        var groups = renderGroups(products, currentProduct);

        var toggle = document.createElement("button");
        toggle.className = "product-sidebar-toggle";
        toggle.type = "button";
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-controls", "product-sidebar");
        toggle.innerHTML = "<span aria-hidden=\"true\">15</span><span>产品导航</span>";

        var sidebar = document.createElement("aside");
        sidebar.className = "product-sidebar";
        sidebar.id = "product-sidebar";
        sidebar.setAttribute("aria-label", isKnowledgeIndex ? "管理产品知识导航" : "15 项正式管理产品导航");
        sidebar.innerHTML = "<header class=\"product-sidebar-heading\"><div><strong>PRINCE2<sup>®</sup> 7</strong>" +
            "<span>" + (isKnowledgeIndex ? "管理产品知识 · 15 项正式产品" : "住宅装修案例 · 15 项正式产品") + "</span></div><button class=\"product-sidebar-close\" type=\"button\" aria-label=\"关闭产品导航\">×</button></header>" +
            "<nav class=\"product-mode-switch\" aria-label=\"产品阅读模式\"><a data-product-mode=\"knowledge\">产品知识</a><a data-product-mode=\"case\">装修案例</a></nav>" +
            (!isKnowledgeIndex ? "<a class=\"product-sidebar-all\" href=\"renovation.html\">回到案例首页 <span aria-hidden=\"true\">→</span></a>" : "") +
            "<p class=\"product-sidebar-progress\"><b>7 基准 · 7 报告 · 1 记录</b><br><span data-product-mode-status></span></p>" +
            "<div class=\"product-sidebar-groups\">" + groups + "</div>";
        document.body.append(toggle, sidebar);
    }

    function updateSidebarContext() {
        if (document.body.hasAttribute("data-product-shell")) { return; }
        var sidebar = document.getElementById("product-sidebar");
        if (!sidebar) {
            return;
        }

        var selection = currentSelection();
        var context = findProductContext(selection);
        var modeKnowledge = sidebar.querySelector('[data-product-mode="knowledge"]');
        var modeCase = sidebar.querySelector('[data-product-mode="case"]');
        var status = sidebar.querySelector("[data-product-mode-status]");
        var currentCaseHref = window.location.pathname.split("/").pop() + window.location.hash;
        var targetCaseHref = isKnowledgeIndex
            ? (context ? caseHref(context.decoration) : "../cases/renovation.html")
            : currentCaseHref;
        var targetKnowledgeHref = selection ? knowledgeHref(selection) : (isKnowledgeIndex ? "#" : "../entities/product.html");

        modeKnowledge.href = withBuildVersion(targetKnowledgeHref);
        if (isKnowledgeIndex) {
            modeKnowledge.setAttribute("aria-current", "page");
            modeCase.removeAttribute("aria-current");
        } else {
            modeKnowledge.removeAttribute("aria-current");
            modeCase.setAttribute("aria-current", "page");
        }
        modeCase.classList.toggle("is-disabled", !targetCaseHref);
        modeCase.setAttribute("aria-disabled", String(!targetCaseHref));
        if (targetCaseHref) {
            modeCase.href = withBuildVersion(targetCaseHref);
            modeCase.removeAttribute("title");
        } else {
            modeCase.removeAttribute("href");
            modeCase.title = "当前产品的装修案例正在建设中";
        }

        if (status) {
            if (!selection) {
                status.textContent = isKnowledgeIndex ? "选择产品后，可切换到其对应案例。" : "选择已有案例的产品，右侧将直接打开对应案例。";
            } else if (targetCaseHref) {
                status.textContent = "当前：" + selection + "。可在理论与案例之间直接切换。";
            } else {
                status.textContent = "当前：" + selection + "。对应装修案例建设中。";
            }
        }

        sidebar.querySelectorAll(".product-sidebar-product.contains-current").forEach(function(productItem) {
            productItem.classList.remove("contains-current");
        });
        var matchedCurrentItem = null;
        sidebar.querySelectorAll("[data-product-name]").forEach(function(item) {
            if (item.getAttribute("data-product-name") === selection) {
                // 产品名和组成项名在正式目录中唯一，只保留一个当前项。
                if (!matchedCurrentItem) {
                    matchedCurrentItem = item;
                    item.setAttribute("aria-current", "page");
                    var productItem = item.closest(".product-sidebar-product");
                    var details = item.closest("details");
                    if (productItem) {
                        productItem.classList.add("contains-current");
                    }
                    if (details) {
                        details.open = true;
                    }
                } else {
                    item.removeAttribute("aria-current");
                }
            } else {
                item.removeAttribute("aria-current");
            }
        });
    }

    createCaseSidebar();
    updateSidebarContext();

    var sidebar = document.getElementById("product-sidebar");
    var sidebarToggle = document.querySelector(".product-sidebar-toggle");
    var sidebarClose = document.querySelector(".product-sidebar-close");

    function setSidebar(open) {
        if (!sidebar || !sidebarToggle) {
            return;
        }
        sidebar.classList.toggle("is-open", open);
        document.body.classList.toggle("sidebar-open", open);
        sidebarToggle.setAttribute("aria-expanded", String(open));
    }

    if (sidebar && sidebarToggle) {
        var restoredSidebarScroll = false;
        try {
            var savedSidebarScroll = Number(sessionStorage.getItem(SIDEBAR_SCROLL_KEY));
            if (Number.isFinite(savedSidebarScroll) && savedSidebarScroll > 0) {
                sidebar.scrollTop = savedSidebarScroll;
                restoredSidebarScroll = true;
            }
        } catch (error) {
            // 浏览器禁用会话存储时保持默认滚动行为。
        }

        function saveSidebarScroll() {
            try {
                sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(sidebar.scrollTop));
            } catch (error) {
                // 浏览器禁用会话存储时无需处理。
            }
        }

        sidebar.addEventListener("scroll", saveSidebarScroll, { passive: true });
        window.addEventListener("pagehide", saveSidebarScroll);
        sidebarToggle.addEventListener("click", function() {
            setSidebar(!sidebar.classList.contains("is-open"));
        });
        sidebarClose.addEventListener("click", function() { setSidebar(false); });
        sidebar.querySelectorAll("a").forEach(function(link) {
            link.addEventListener("click", function() { setSidebar(false); });
        });

        var currentLink = sidebar.querySelector('[aria-current="page"]');
        if (currentLink && !restoredSidebarScroll) {
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

    window.addEventListener("hashchange", updateSidebarContext);

    setupRecordInteractions();
}());
