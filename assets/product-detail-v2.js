(function () {
    "use strict";

    var catalog = window.PRINCE2_PRODUCT_DETAILS_V2;
    var currentSlug = "";
    var currentMode = "theory";
    var anchorIds = ["detail-hero", "lesson-register-section", "definition-section", "composition-section", "roles-section", "lifecycle-section", "case-section"];
    var workspaceSlug = new URLSearchParams(window.location.search).get("entry");
    var workspaceDetail = Boolean(catalog && catalog.entries[workspaceSlug] && catalog.entries[workspaceSlug].caseView);
    var restoringWorkspace = false;
    var restoreRequest = 0;
    var historyHashUrl = null;

    // 已完成对应案例映射的产品共用紧凑框架。
    if (workspaceDetail) {
        window.PRINCE2_PRODUCT_NAVIGATION_AUTO_INIT = false;
        document.body.dataset.productShell = routeFromUrl().mode;
        document.body.dataset.workspaceEntry = workspaceSlug;
        var mount = document.createElement("div");
        mount.id = "workspace-navigation";
        byId("product-sidebar").replaceWith(mount);
        document.querySelectorAll(".sidebar-toggle, .sidebar-overlay, .skip-link").forEach(function (element) { element.remove(); });
        var main = byId("main-content");
        main.classList.add("workspace-frame");
        main.querySelector(".top-nav").className = "workspace-breadcrumb";
        var topbar = document.createElement("div");
        topbar.id = "workspace-topbar";
        topbar.className = "workspace-topbar";
        main.prepend(topbar);
        byId("detail-view-toolbar").className = "workspace-reading-bar";
        byId("detail-view-toolbar").innerHTML = '<nav aria-label="本页章节">' +
            '<a href="#definition-section">定义与用途</a><a href="#composition-section">组成内容</a>' +
            '<a href="#roles-section">角色和动作</a><a href="#lifecycle-section">生命周期</a></nav>' +
            '<span class="visually-hidden" id="detail-mode-status" aria-live="polite"></span>';
        byId("detail-actions").hidden = true;
        main.querySelectorAll(".source-row[data-view-anchor]").forEach(function (row) {
            row.id = row.dataset.viewAnchor;
        });
    }

    function byId(id) {
        return document.getElementById(id);
    }

    function asArray(value) {
        return Array.isArray(value) ? value : [];
    }

    function routeFromUrl() {
        var parameters = new URLSearchParams(window.location.search);
        return {
            slug: parameters.get("entry") || "",
            mode: parameters.get("mode") === "case" ? "case" : "theory"
        };
    }

    function modeUrl(slug, mode, anchor) {
        var url = new URL(window.location.href);
        url.searchParams.set("entry", slug);
        url.searchParams.set("mode", mode);
        url.hash = workspaceDetail && !(anchor && anchor.pageTop) ? (anchor && (anchor.dataAnchor || anchor.id) || window.location.hash) : "";
        return url.pathname + url.search + url.hash;
    }

    function setText(id, value) {
        var element = byId(id);
        if (element) {
            element.textContent = value == null ? "" : String(value);
        }
        return element;
    }

    function setLink(element, href, label) {
        if (!element) {
            return;
        }
        if (label) {
            element.textContent = label;
        }
        if (href) {
            element.setAttribute("href", href);
            element.removeAttribute("aria-disabled");
        } else {
            element.removeAttribute("href");
            element.setAttribute("aria-disabled", "true");
        }
    }

    function clear(element) {
        if (element) {
            element.replaceChildren();
        }
    }

    function provenanceLabel(key) {
        var labels = catalog && catalog.provenanceLabels;
        if (labels && labels[key]) {
            return labels[key];
        }
        return key || "证据待核验";
    }

    function evidenceText(section) {
        var label = provenanceLabel(section && section.provenance);
        var note = section && section.note;
        return note ? label + "：" + note : "证据等级：" + label;
    }

    function renderSectionNote(id, section) {
        var note = section && section.note || "";
        setText(id, workspaceDetail ? note : evidenceText(section));
        byId(id).hidden = !note;
    }

    function renderEvidence(detailsId, evidence) {
        var details = byId(detailsId);
        var container = details && details.querySelector("div");
        var items = asArray(evidence);
        if (!details || !container) {
            return;
        }
        clear(container);
        if (!workspaceDetail) { details.open = false; }
        details.hidden = items.length === 0;
        items.forEach(function (item) {
            var link = document.createElement("a");
            link.textContent = item.label || "查看依据";
            if (item.href) {
                link.href = item.href;
            } else {
                link.removeAttribute("href");
                link.setAttribute("aria-disabled", "true");
            }
            container.appendChild(link);
        });
    }

    function makeAction(href, label, className, mode) {
        var link = document.createElement("a");
        link.className = "button " + className;
        link.href = href;
        link.textContent = label;
        if (mode) {
            link.dataset.detailMode = mode;
        }
        return link;
    }

    function resolveView(entry, mode) {
        var view = mode === "case" ? entry.caseView : null;
        if (!view) {
            return entry;
        }
        return Object.assign({}, entry, view, {
            identity: Object.assign({}, entry.identity || {}, view.identity || {}),
            parent: entry.parent || null
        });
    }

    function renderModeControls(entry, mode) {
        var hasMappedCase = Boolean(entry.caseView);
        var externalCaseHref = entry.caseEntry && entry.caseEntry.href || "";
        var hasCase = hasMappedCase || Boolean(externalCaseHref);
        var toolbar = byId("detail-view-toolbar");
        var caption = mode === "case"
            ? "当前展示住宅装修项目中的对应案例值"
            : "当前展示 PRINCE2 理论结构和依据";
        document.querySelectorAll("a[data-detail-mode]").forEach(function (link) {
            var targetMode = link.dataset.detailMode;
            link.href = targetMode === "case" && !hasMappedCase
                ? externalCaseHref
                : modeUrl(entry.slug, targetMode);
            if (targetMode === mode) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
            if (targetMode === "case" && !hasCase) {
                link.setAttribute("aria-disabled", "true");
                link.tabIndex = -1;
            } else {
                link.removeAttribute("aria-disabled");
                link.removeAttribute("tabindex");
            }
        });
        if (toolbar) {
            toolbar.hidden = !hasCase;
        }
        setText("detail-mode-caption", caption);
        setText("detail-mode-status", mode === "case" ? "已切换到案例" : "已切换到理论知识");
        document.body.dataset.activeDetailMode = mode;
    }

    function renderHeader(entry, baseEntry, mode) {
        var parent = entry.parent || {};
        var parentLabel = [parent.code, parent.name].filter(Boolean).join(" · ");
        var identityLabel = entry.identity && entry.identity.label || entry.kind;
        var modeSuffix = mode === "case" ? " / 案例" : " / 理论知识";
        setText("detail-eyebrow", [entry.code || parent.code, identityLabel].filter(Boolean).join(" · "));
        setText("detail-title", entry.name);
        setText("detail-summary", entry.summary && entry.summary.text);
        setText("detail-provenance", "证据等级 · " + provenanceLabel(entry.summary && entry.summary.provenance));
        setText("breadcrumb-current", entry.name);
        setText("sidebar-current-path", "当前：" + (parentLabel ? parentLabel + " / " : "") + entry.name + modeSuffix);
        setLink(byId("breadcrumb-parent"), parent.href || "product.html", parentLabel || "管理产品");
        byId("breadcrumb-parent").hidden = !entry.parent;
        byId("breadcrumb-parent").previousElementSibling.hidden = !entry.parent;

        document.title = entry.name + (mode === "case" ? "案例" : "") + " - PRINCE2 7 管理产品";
        var description = document.querySelector('meta[name="description"]');
        if (description && entry.summary && entry.summary.text) {
            description.setAttribute("content", entry.summary.text);
        }

        var actions = byId("detail-actions");
        clear(actions);
        if (workspaceDetail) { return; }
        if (baseEntry.caseView) {
            var targetMode = mode === "case" ? "theory" : "case";
            var targetLabel = mode === "case" ? "返回理论知识" : "查看案例";
            actions.appendChild(makeAction(modeUrl(baseEntry.slug, targetMode), targetLabel, "button-primary", targetMode));
        } else if (mode === "theory" && baseEntry.caseEntry && baseEntry.caseEntry.href) {
            actions.appendChild(makeAction(baseEntry.caseEntry.href, "打开案例原文件", "button-primary"));
        }
        if (mode === "theory" && entry.legacyHref) {
            actions.appendChild(makeAction(entry.legacyHref, "返回管理产品总览", "button-secondary"));
        }
    }

    function renderDefinition(entry) {
        var definition = entry.definition || {};
        var purpose = entry.purpose || {};
        setLink(byId("definition-link"), definition.sourceHref, definition.label || "定义");
        setLink(byId("purpose-link"), purpose.sourceHref, purpose.label || "用途");
        setText("definition-text", definition.text);
        setText("purpose-text", purpose.text);
        setText("source-note", entry.sourceNote || ("定义：" + provenanceLabel(definition.provenance) + "。用途：" +
            provenanceLabel(purpose.provenance) + "。点击“定义”或“用途”可定位到对应原文。"));
    }

    function renderComposition(section, mode, hasCaseView) {
        var container = byId("composition-list");
        var items = asArray(section && section.items);
        setText("composition-title", workspaceDetail ? "组成内容" : section && section.title || "组成内容");
        setText("composition-kicker", section && section.kicker || provenanceLabel(section && section.provenance));
        renderSectionNote("composition-note", section);
        renderEvidence("composition-evidence", section && section.evidence);
        clear(container);
        items.forEach(function (item, index) {
            var wrapper = document.createElement("div");
            var term = document.createElement("dt");
            var number = document.createElement("span");
            var description = document.createElement("dd");
            wrapper.dataset.viewAnchor = "composition-" + (workspaceDetail ? item.label : index);
            if (workspaceDetail) { wrapper.id = wrapper.dataset.viewAnchor; }
            number.textContent = String(index + 1).padStart(2, "0");
            term.append(number, document.createTextNode(item.label || "组成项"));
            description.textContent = item.text || "";
            if (item.caseExample && !(mode === "theory" && hasCaseView)) {
                var example = document.createElement("small");
                var exampleText = typeof item.caseExample === "string" ? item.caseExample : item.caseExample.text;
                example.textContent = provenanceLabel(item.caseExample.provenance || "fictional-case") + "：" + exampleText;
                description.appendChild(example);
            }
            wrapper.append(term, description);
            container.appendChild(wrapper);
        });
        byId("composition-section").hidden = items.length === 0;
    }

    function renderRoles(section) {
        var container = byId("roles-list");
        var boundary = section && section.boundary;
        var boundaryElement = byId("roles-boundary");
        var items = asArray(section && section.items);
        if (workspaceDetail && currentMode === "case") {
            var order = catalog.entries[currentSlug].roles.items.map(function (item) { return item.name; });
            items = items.slice().sort(function (a, b) { return order.indexOf(a.relation) - order.indexOf(b.relation); });
        }
        setText("roles-title", workspaceDetail ? "角色和动作" : section && section.title || "角色和动作");
        setText("roles-kicker", section && section.kicker || provenanceLabel(section && section.provenance));
        renderSectionNote("roles-note", section);
        renderEvidence("roles-evidence", section && section.evidence);
        clear(container);
        items.forEach(function (item, index) {
            var row = document.createElement("tr");
            var role = document.createElement("th");
            var relationCell = document.createElement("td");
            var relation = document.createElement("span");
            var actions = document.createElement("td");
            var description = document.createElement("td");
            row.dataset.viewAnchor = "role-" + (workspaceDetail ? (currentMode === "case" ? item.relation : item.name) : index);
            if (workspaceDetail) { row.id = row.dataset.viewAnchor; }
            role.scope = "row";
            role.textContent = item.name || "未注明角色";
            relation.className = "relation-tag";
            relation.textContent = item.relation || "关系待说明";
            relationCell.appendChild(relation);
            actions.textContent = asArray(item.actions).join("、");
            description.textContent = item.description || "";
            row.append(role, relationCell, actions, description);
            container.appendChild(row);
        });
        if (boundary && boundary.text) {
            setText("roles-boundary-title", (boundary.title || "边界说明") + (workspaceDetail ? "" : " · " + provenanceLabel(boundary.provenance)));
            setText("roles-boundary-text", boundary.text);
            boundaryElement.hidden = false;
        } else {
            boundaryElement.hidden = true;
        }
        byId("roles-section").hidden = items.length === 0;
        if (workspaceDetail) {
            var headings = byId("roles-section").querySelectorAll("thead th");
            var roleLabel = ["product-register", "risk-register"].includes(currentSlug) ? "项目角色／职权关系" : "项目角色";
            headings[0].textContent = currentMode === "case" ? "现实身份" : roleLabel;
            headings[1].textContent = currentMode === "case" ? roleLabel : "与产品的关系";
        }
    }

    function renderLifecycle(section) {
        var rhythm = byId("lifecycle-rhythm");
        var list = byId("lifecycle-list");
        var items = asArray(section && section.items);
        setText("lifecycle-title", workspaceDetail ? "生命周期" : section && section.title || "生命周期");
        setText("lifecycle-kicker", section && section.kicker || provenanceLabel(section && section.provenance));
        renderSectionNote("lifecycle-note", section);
        renderEvidence("lifecycle-evidence", section && section.evidence);
        clear(rhythm);
        clear(list);
        asArray(section && section.rhythm).forEach(function (item) {
            var cell = document.createElement("span");
            if (typeof item === "string") {
                cell.textContent = item;
            } else {
                var strong = document.createElement("b");
                strong.textContent = item.label || item.stage || "";
                cell.append(strong, document.createTextNode(item.text || item.action || ""));
            }
            rhythm.appendChild(cell);
        });
        rhythm.hidden = !rhythm.childElementCount;
        items.forEach(function (item, index) {
            var row = document.createElement("tr");
            var process = document.createElement("th");
            var code = document.createElement("span");
            var action = document.createElement("td");
            var description = document.createElement("td");
            row.dataset.viewAnchor = "lifecycle-" + (workspaceDetail ? (item.anchor || item.processCode) : index);
            if (workspaceDetail) { row.id = row.dataset.viewAnchor; }
            code.className = "process-code";
            code.textContent = item.processCode || "";
            process.scope = "row";
            process.append(code);
            var processNames = { SU: "项目准备", IP: "项目启动", DP: "项目指导", CS: "阶段控制", MP: "产品交付管理", SB: "阶段边界管理", CP: "项目收尾" };
            if (processNames[item.processCode]) {
                var name = document.createElement("small");
                name.textContent = processNames[item.processCode];
                process.append(name);
            }
            action.className = "lifecycle-action";
            description.className = "lifecycle-record";
            action.textContent = item.action || "";
            description.textContent = item.description || "";
            row.append(process, action, description);
            list.appendChild(row);
        });
        byId("lifecycle-section").hidden = items.length === 0;
    }

    function renderCase(caseEntry, mode) {
        var section = byId("case-section");
        // 概要版两种模式共用同一关联文件入口，避免页尾切换因入口高度变化而跳动。
        var sharedRelatedEntry = workspaceSlug === "outline-business-case" || (window.PRINCE2ProductManagementUsage && window.PRINCE2ProductManagementUsage.supports(workspaceSlug));
        if (!caseEntry || !caseEntry.href || (workspaceDetail && mode !== "case" && !sharedRelatedEntry)) {
            section.hidden = true;
            return;
        }
        section.hidden = false;
        if (workspaceDetail) {
            // 关联资料仅作补充入口，理论和案例仍通过左侧模式切换。
            section.setAttribute("aria-labelledby", "case-kicker");
            setText("case-kicker", caseEntry.relatedKind || (workspaceSlug === "outline-business-case" ? "关联文件：" : "关联记录："));
            byId("case-title").hidden = true;
            byId("case-description").hidden = true;
            byId("case-link").className = "workspace-related-link";
            byId("case-link").removeAttribute("data-detail-mode");
            setText("case-link-label", caseEntry.relatedLabel || (workspaceSlug === "outline-business-case" ? "项目概述文件" : "项目启动时间线"));
            setLink(byId("case-link"), caseEntry.href);
            return;
        }
        setText("case-kicker", workspaceDetail || mode === "case" ? "查看案例原文件" : "放回项目情境");
        setText("case-title", caseEntry.title || "查看项目案例");
        setText("case-description", caseEntry.description || "在项目情境中理解该管理产品。");
        setText("case-link-label", workspaceSlug === "outline-business-case" ? "打开完整项目概述文件" : caseEntry.label || "打开案例");
        setLink(byId("case-link"), caseEntry.href);
        byId("case-link").removeAttribute("data-detail-mode");
    }

    function captureViewportAnchor() {
        if (workspaceDetail && window.scrollY < 30) { return { pageTop: true }; }
        var sceneAnchor = currentSlug === "project-plan" && window.PRINCE2ProjectPlanUsage && window.PRINCE2ProjectPlanUsage.captureReadingAnchor();
        if (!sceneAnchor && ["outline-business-case", "full-business-case"].includes(currentSlug) && window.PRINCE2BusinessCaseUsage) { sceneAnchor = window.PRINCE2BusinessCaseUsage.captureReadingAnchor(); }
        if (!sceneAnchor && window.PRINCE2ProductManagementUsage && window.PRINCE2ProductManagementUsage.supports(currentSlug)) { sceneAnchor = window.PRINCE2ProductManagementUsage.captureReadingAnchor(); }
        if (sceneAnchor) { return sceneAnchor; }
        var paperDocument = ["full-business-case", "project-plan"].includes(currentSlug);
        var referenceTop = paperDocument
            ? (window.innerWidth <= 960 ? 134 : 86)
            : Math.min(150, window.innerHeight * 0.25);
        var referenceLeft = Math.min(window.innerWidth * 0.62, document.documentElement.clientWidth - 1);
        // 双列理论字段可能同处一行，优先保留仍在阅读线上的已选章节。
        var previousAnchor = paperDocument && history.state && history.state.viewportAnchor;
        if (previousAnchor && previousAnchor.dataAnchor) {
            var previousElement = Array.from(byId("detail-content").querySelectorAll("[data-view-anchor]")).find(function (element) {
                return element.dataset.viewAnchor === previousAnchor.dataAnchor;
            });
            var previousRect = previousElement && previousElement.getBoundingClientRect();
            if (isVisibleAnchor(previousElement) && previousRect && previousRect.height > 0 && previousRect.top <= referenceTop && previousRect.bottom > referenceTop) {
                return { dataAnchor: previousAnchor.dataAnchor, sectionId: previousElement.closest("section").id, top: previousRect.top };
            }
        }
        var pointElement = document.elementFromPoint(referenceLeft, referenceTop);
        var mappedElement = pointElement && pointElement.closest("[data-view-anchor]");
        if (!isVisibleAnchor(mappedElement)) { mappedElement = null; }
        if (!mappedElement && workspaceDetail) {
            // 移动端抽屉会覆盖正文，仍按正文实际矩形找到被遮住的阅读项。
            var mappedElements = Array.from(byId("detail-content").querySelectorAll("[data-view-anchor]")).filter(isVisibleAnchor);
            mappedElement = mappedElements.find(function (element) {
                var rect = element.getBoundingClientRect();
                return rect.top <= referenceTop && rect.bottom > referenceTop && rect.left <= referenceLeft && rect.right > referenceLeft;
            }) || mappedElements.find(function (element) {
                // 参考点落在双列间隙时，仍以同一阅读行的字段作为切换锚点。
                var rect = element.getBoundingClientRect();
                return rect.top <= referenceTop && rect.bottom > referenceTop;
            });
        }
        if (mappedElement) {
            return {
                dataAnchor: mappedElement.dataset.viewAnchor,
                sectionId: mappedElement.closest("section") && mappedElement.closest("section").id,
                top: mappedElement.getBoundingClientRect().top
            };
        }
        var selected = null;
        var selectedDistance = Number.POSITIVE_INFINITY;
        anchorIds.forEach(function (id) {
            var element = byId(id);
            var rect = isVisibleAnchor(element) ? element.getBoundingClientRect() : null;
            if (rect && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight) {
                var distance = Math.abs(rect.top - referenceTop);
                if (distance < selectedDistance) {
                    selected = { id: id, top: rect.top };
                    selectedDistance = distance;
                }
            }
        });
        return selected;
    }

    function isVisibleAnchor(element) {
        return element && !element.closest("[hidden], .lesson-help-dialog:not([open]), details:not([open])");
    }

    function findAnchorElement(anchor) {
        var key = anchor.dataAnchor || anchor.id;
        var direct = byId(key);
        if (isVisibleAnchor(direct)) { return direct; }
        return Array.from(document.querySelectorAll("[data-view-anchor]")).find(function (element) {
            return element.dataset.viewAnchor === key && isVisibleAnchor(element);
        }) || direct;
    }

    function finishRestore(request) {
        if (request !== restoreRequest) { return; }
        restoringWorkspace = false;
        saveReadingPosition();
    }

    function restoreViewportAnchor(anchor) {
        var request = ++restoreRequest;
        if (!anchor) {
            restoringWorkspace = false;
            return;
        }
        restoringWorkspace = true;
        window.requestAnimationFrame(function () {
            if (request !== restoreRequest) { return; }
            if (anchor.pageTop) {
                window.scrollTo({ top: 0, behavior: "instant" });
                requestAnimationFrame(function () { finishRestore(request); });
                return;
            }
            var element = findAnchorElement(anchor);
            if (!element && anchor.sectionId) { element = byId(anchor.sectionId); }
            if (element && element.closest(".lesson-help-dialog:not([open])")) {
                window.scrollBy({ top: byId("lesson-register-section").getBoundingClientRect().top - (window.innerWidth <= 960 ? 84 : 24), behavior: "instant" });
                requestAnimationFrame(function () { finishRestore(request); });
                return;
            }
            if (element && element.hidden && element.id === "lesson-register-section") {
                // 实际单据没有一一对应的理论行，切回理论时落到定义，不沿用长单据的负偏移。
                window.scrollBy({ top: byId("definition-section").getBoundingClientRect().top - (window.innerWidth <= 960 ? 132 : 84), behavior: "instant" });
                requestAnimationFrame(function () { finishRestore(request); });
                return;
            }
            if (element) {
                var root = document.documentElement;
                var previousScrollBehavior = root.style.scrollBehavior;
                root.style.scrollBehavior = "auto";
                window.scrollBy(0, element.getBoundingClientRect().top - anchor.top);
                root.style.scrollBehavior = previousScrollBehavior;
            }
            requestAnimationFrame(function () { finishRestore(request); });
        });
    }

    function showState(kind, title, detail) {
        var status = byId("detail-status");
        var content = byId("detail-content");
        var toolbar = byId("detail-view-toolbar");
        clear(status);
        var heading = document.createElement("h1");
        var message = document.createElement("p");
        var link = document.createElement("a");
        heading.textContent = title;
        message.textContent = detail;
        link.className = "button button-secondary";
        link.href = "product.html";
        link.textContent = "返回管理产品总览";
        status.dataset.state = kind;
        status.setAttribute("aria-busy", "false");
        status.append(heading, message, link);
        status.hidden = false;
        content.hidden = true;
        if (toolbar) {
            toolbar.hidden = true;
        }
    }

    function render(baseEntry, mode, anchor) {
        if (workspaceDetail) { restoringWorkspace = Boolean(anchor); }
        var resolvedMode = mode === "case" && baseEntry.caseView ? "case" : "theory";
        var entry = resolveView(baseEntry, resolvedMode);
        currentSlug = baseEntry.slug;
        currentMode = resolvedMode;
        document.body.setAttribute("data-current-item", baseEntry.name || "");
        renderModeControls(baseEntry, resolvedMode);
        renderHeader(entry, baseEntry, resolvedMode);
        renderDefinition(entry);
        renderComposition(entry.composition, resolvedMode, Boolean(baseEntry.caseView));
        renderRoles(entry.roles);
        renderLifecycle(entry.lifecycle);
        renderCase(entry.caseEntry, resolvedMode);
        if (window.PRINCE2LessonRegister) { window.PRINCE2LessonRegister.render(baseEntry.slug, resolvedMode); }
        if (baseEntry.slug === "project-plan" && window.PRINCE2ProjectPlanUsage) { window.PRINCE2ProjectPlanUsage.render(resolvedMode); }
        if (window.PRINCE2BusinessCaseUsage) { window.PRINCE2BusinessCaseUsage.render(baseEntry.slug, resolvedMode); }
        if (window.PRINCE2ProductManagementUsage) { window.PRINCE2ProductManagementUsage.render(baseEntry.slug, resolvedMode); }
        setText("detail-footer-note", "新版管理产品详情页 · " + entry.name + " · " + (resolvedMode === "case" ? "案例" : "理论知识"));
        byId("detail-status").hidden = true;
        byId("detail-status").setAttribute("aria-busy", "false");
        byId("detail-content").hidden = false;
        if (baseEntry.slug === "project-plan" && window.PRINCE2ProjectPlanUsage) { window.PRINCE2ProjectPlanUsage.stabilizePanel(); }
        if (["outline-business-case", "full-business-case"].includes(baseEntry.slug) && window.PRINCE2BusinessCaseUsage) { window.PRINCE2BusinessCaseUsage.stabilizePanel(); }
        if (window.PRINCE2ProductManagementUsage && window.PRINCE2ProductManagementUsage.supports(baseEntry.slug)) { window.PRINCE2ProductManagementUsage.stabilizePanel(); }
        var navigation = window.PRINCE2ProductNavigation && window.PRINCE2ProductNavigation.instance;
        if (navigation && typeof navigation.markCurrentItem === "function") {
            navigation.markCurrentItem(baseEntry.name);
        }
        if (workspaceDetail && window.PRINCE2Workspace) {
            window.PRINCE2Workspace.setDetailContext({ slug: baseEntry.slug, name: baseEntry.name, mode: resolvedMode });
        }
        restoreRecordFromHistory();
        restoreViewportAnchor(anchor);
        window.dispatchEvent(new CustomEvent("product-detail-v2:rendered", {
            detail: { slug: baseEntry.slug, name: baseEntry.name, mode: resolvedMode, parent: baseEntry.parent || null }
        }));
    }

    function renderRoute(anchor) {
        catalog = window.PRINCE2_PRODUCT_DETAILS_V2;
        var route = routeFromUrl();
        if (!catalog || !catalog.entries) {
            showState("error", "产品详情暂时无法载入", "详情数据文件未正确加载，请刷新页面后重试。");
            return;
        }
        if (!Object.keys(catalog.entries).length) {
            showState("empty", "暂无可展示的产品详情", "暂无产品详情，请返回总览查看其他条目。");
            return;
        }
        if (!route.slug) {
            showState("empty", "请选择一个产品条目", "请从管理产品总览或左侧目录进入具体产品。");
            return;
        }
        var entry = catalog.entries[route.slug];
        if (!entry) {
            showState("empty", "未找到这个产品条目", "链接中的 entry 参数无效，或该条目仍在建设中。");
            return;
        }
        if (route.mode === "case" && !entry.caseView) {
            window.history.replaceState({}, "", modeUrl(route.slug, "theory"));
            route.mode = "theory";
        }
        try {
            render(entry, route.mode, anchor);
        } catch (error) {
            console.error("产品详情渲染失败", error);
            showState("error", "产品详情渲染失败", "页面数据存在异常，请返回总览选择其他条目。");
        }
    }

    function handleModeClick(event) {
        var link = event.target.closest("a[data-detail-mode]");
        if (!link) {
            return;
        }
        if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) { return; }
        event.preventDefault();
        if (link.getAttribute("aria-disabled") === "true") {
            return;
        }
        var targetMode = link.dataset.detailMode === "case" ? "case" : "theory";
        if (targetMode === currentMode) {
            return;
        }
        var entry = catalog && catalog.entries && catalog.entries[currentSlug];
        if (!entry) {
            return;
        }
        if (targetMode === "case" && !entry.caseView) {
            if (entry.caseEntry && entry.caseEntry.href) {
                window.location.href = entry.caseEntry.href;
            }
            return;
        }
        var anchor = captureViewportAnchor();
        historyHashUrl = null;
        if (workspaceDetail) {
            window.history.replaceState(readingState(anchor), "");
            if (window.PRINCE2Workspace) { window.PRINCE2Workspace.setDrawer(false); }
        }
        var targetUrl = modeUrl(currentSlug, targetMode, anchor);
        window.history.pushState({ entry: currentSlug, mode: targetMode, viewportAnchor: anchor,
            hash: new URL(targetUrl, location.href).hash, recordId: selectedRecordId() }, "", targetUrl);
        render(entry, targetMode, anchor);
    }

    function readingState(anchor) {
        return Object.assign({}, history.state, { entry: currentSlug, mode: currentMode,
            hash: location.hash, viewportAnchor: anchor, recordId: selectedRecordId() });
    }

    function selectedRecordId() {
        var section = byId("lesson-register-section");
        var record = section && section.dataset.documentSlug === currentSlug && section.querySelector(".lesson-detail:not([hidden])");
        return record ? record.id.slice("lesson-detail-".length) : null;
    }

    function currentReadingState() {
        var route = routeFromUrl();
        var state = history.state;
        return state && state.entry === route.slug && state.mode === route.mode &&
            (state.hash === undefined || state.hash === location.hash) ? state : null;
    }

    function restoreRecordFromHistory() {
        var state = currentReadingState();
        return Boolean(currentMode === "case" && state && state.recordId && window.PRINCE2LessonRegister &&
            window.PRINCE2LessonRegister.restoreSelection && window.PRINCE2LessonRegister.restoreSelection(state.recordId));
    }

    function explicitHashAnchor() {
        var id;
        try { id = decodeURIComponent(location.hash.slice(1)); } catch (error) { return null; }
        return id ? { id: id, top: window.innerWidth <= 960 ? 132 : 84 } : { pageTop: true };
    }

    function anchorFromHistory() {
        var state = currentReadingState();
        if (state && state.viewportAnchor) {
            return state.viewportAnchor;
        }
        return explicitHashAnchor();
    }

    function syncLinkedRecord(preferHistory) {
        if (preferHistory && restoreRecordFromHistory()) { return; }
        var anchor = explicitHashAnchor();
        if (currentMode === "case" && anchor && /^(lesson-detail-|record-field-)/.test(anchor.id || "") && window.PRINCE2LessonRegister) {
            window.PRINCE2LessonRegister.render(currentSlug, currentMode);
        }
    }

    function handleAnchorClick(event) {
        if (!workspaceDetail || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) { return; }
        var link = event.target.closest("a[href]");
        if (!link || link.hasAttribute("data-detail-mode") || link.hasAttribute("download") ||
            (link.getAttribute("target") && link.getAttribute("target") !== "_self") ||
            link.closest(".workspace-skip, .skip-link, dialog[open]")) { return; }
        var url = new URL(link.href, location.href);
        if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) { return; }
        var id;
        try { id = decodeURIComponent(url.hash.slice(1)); } catch (error) { return; }
        if (!findAnchorElement({ id: id })) { return; }
        event.preventDefault();
        historyHashUrl = null;
        var previousAnchor = captureViewportAnchor();
        history.replaceState(readingState(previousAnchor), "");
        var anchor = { id: id, top: window.innerWidth <= 960 ? 132 : 84 };
        if (location.hash !== url.hash) {
            history.pushState({ entry: currentSlug, mode: currentMode, hash: url.hash, viewportAnchor: anchor }, "", url.href);
        } else {
            history.replaceState(readingState(anchor), "");
        }
        // pushState 不产生 hashchange，仍需结束之前的流程场景阅读意图。
        [window.PRINCE2ProjectPlanUsage, window.PRINCE2BusinessCaseUsage, window.PRINCE2ProductManagementUsage].forEach(function (usage) {
            if (usage && usage.resetReadingIntent) { usage.resetReadingIntent(); }
        });
        syncLinkedRecord(false);
        restoreViewportAnchor(anchor);
    }

    function saveReadingPosition() {
        if (!workspaceDetail || restoringWorkspace || byId("detail-content").hidden) { return; }
        history.replaceState(readingState(captureViewportAnchor()), "");
    }

    function init() {
        document.addEventListener("click", handleModeClick);
        document.addEventListener("click", handleAnchorClick);
        window.addEventListener("popstate", function () {
            var route = routeFromUrl();
            var anchor = workspaceDetail ? anchorFromHistory() : captureViewportAnchor();
            historyHashUrl = location.href;
            if (workspaceDetail && route.slug === currentSlug && route.mode === currentMode) {
                restoringWorkspace = true;
                syncLinkedRecord(true);
                restoreViewportAnchor(anchor);
            } else {
                renderRoute(anchor);
            }
        });
        renderRoute(workspaceDetail ? anchorFromHistory() : null);
        if (workspaceDetail) {
            history.scrollRestoration = "manual";
            var readingFrame = null;
            window.addEventListener("scroll", function () {
                if (readingFrame) { return; }
                readingFrame = requestAnimationFrame(function () { readingFrame = null; saveReadingPosition(); });
            }, { passive: true });
            window.addEventListener("pagehide", saveReadingPosition);
            window.addEventListener("product-record:changed", saveReadingPosition);
            window.addEventListener("hashchange", function () {
                // 浏览器历史跳转紧接着触发 hashchange，不覆盖已恢复的精确阅读位置。
                if (historyHashUrl === location.href) { historyHashUrl = null; return; }
                historyHashUrl = null;
                syncLinkedRecord(false);
                restoreViewportAnchor(explicitHashAnchor());
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
}());
