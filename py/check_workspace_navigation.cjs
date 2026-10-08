// 产品详情导航行为回归。最小 DOM 只模拟事件、位置与历史，不替代真实浏览器验收。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = new TextDecoder('utf-8', { fatal: true }).decode(
    fs.readFileSync(path.resolve(__dirname, '../assets/product-detail-v2.js'))
);
const html = fs.readFileSync(path.resolve(__dirname, '../entities/product-detail-v2.html'), 'utf8');
assert.ok(!source.includes('\uFFFD'), '脚本编码正常');

function createHarness({ hash = '', state = null, width = 1440, mode = 'case' } = {}) {
    const listeners = { window: {}, document: {} };
    const frames = [];
    const scrollLog = [];
    const nodes = [];
    let renderCount = 0;
    let recordRenderCount = 0;
    let selectedRecord = 'RISK-004';
    let sceneReadingIntent = false;
    let pointElement = null;
    const resetIntentCounts = { plan: 0, business: 0, generic: 0 };
    let scrollY = 0;
    let currentUrl = new URL('http://127.0.0.1:8000/entities/product-detail-v2.html?entry=risk-register&mode=' + mode + hash);
    const entries = [{ url: currentUrl.href, state }];
    let historyIndex = 0;
    const positions = {
        'detail-hero': 0, 'lesson-register-section': 400,
        'definition-section': 500, 'composition-section': 1000,
        'roles-section': 2000, 'lifecycle-section': 3000, 'case-section': 4000
    };
    function on(surface, type, callback) {
        (listeners[surface][type] ||= []).push(callback);
    }
    function dispatch(surface, event) {
        for (const callback of listeners[surface][event.type] || []) callback(event);
    }
    function matches(node, selector) {
        if (selector.includes(', ')) return selector.split(', ').some(part => matches(node, part));
        if (selector === '.lesson-detail:not([hidden])') return (node.className || '').split(' ').includes('lesson-detail') && !node.hidden;
        if (selector === '.lesson-help-dialog:not([open])') return (node.className || '').split(' ').includes('lesson-help-dialog') && !node.open;
        if (selector === 'details:not([open])') return node.tagName === 'DETAILS' && !node.open;
        if (selector === '.workspace-skip' || selector === '.skip-link') return (node.className || '').split(' ').includes(selector.slice(1));
        if (selector === '[data-view-anchor]') return Boolean(node.dataset.viewAnchor);
        if (selector === 'section') return node.tagName === 'SECTION';
        if (selector === '[hidden]') return Boolean(node.hidden);
        if (selector === 'a[data-detail-mode]') return node.tagName === 'A' && Boolean(node.dataset.detailMode);
        if (selector === 'a[href]') return node.tagName === 'A' && Boolean(node.getAttribute('href'));
        if (selector === 'a') return node.tagName === 'A';
        if (selector.startsWith('[data-view-anchor="')) return node.dataset.viewAnchor === selector.slice(19, -2);
        if (selector.startsWith('#')) return node.id === selector.slice(1);
        return false;
    }
    class Element {
        constructor(tag = 'div') {
            this.tagName = tag.toUpperCase(); this.dataset = {}; this.style = {};
            this.attributes = {}; this.children = []; this.hidden = false;
            this.classList = { add() {}, remove() {}, contains() { return false; } };
            this.previousElementSibling = { hidden: false };
            nodes.push(this);
        }
        set id(value) { this.attributes.id = value; }
        get id() { return this.attributes.id || ''; }
        set href(value) { this.attributes.href = value; }
        get href() { return this.attributes.href || ''; }
        get hash() { return new URL(this.href, currentUrl).hash; }
        get target() { return this.getAttribute('target') || ''; }
        get childElementCount() { return this.children.length; }
        set innerHTML(value) { this.html = value; this.replaceChildren(); }
        get innerHTML() { return this.html || ''; }
        setAttribute(name, value) {
            this.attributes[name] = String(value);
            if (name.startsWith('data-')) this.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = String(value);
        }
        getAttribute(name) { return this.attributes[name] ?? null; }
        hasAttribute(name) { return Object.hasOwn(this.attributes, name); }
        removeAttribute(name) { delete this.attributes[name]; }
        append(...children) { children.forEach(child => { this.children.push(child); child.parentElement = this; }); }
        appendChild(child) { this.append(child); return child; }
        prepend(child) { this.children.unshift(child); child.parentElement = this; }
        replaceChildren(...children) { this.children.forEach(child => { child.parentElement = null; }); this.children = []; this.append(...children); }
        replaceWith(other) { other.parentElement = this.parentElement; }
        remove() { this.parentElement = null; }
        closest(selector) {
            for (let node = this; node; node = node.parentElement) if (matches(node, selector)) return node;
            return null;
        }
        querySelectorAll(selector) {
            const descendants = [];
            const visit = element => element.children.forEach(child => { if (matches(child, selector)) descendants.push(child); visit(child); });
            visit(this);
            if (selector === 'thead th') return [new Element('th'), new Element('th')];
            return descendants;
        }
        querySelector(selector) {
            if (selector === '.top-nav') return topNav;
            if (selector === 'div') return this.children[0] || null;
            return this.querySelectorAll(selector)[0] || null;
        }
        getBoundingClientRect() {
            let hidden = false;
            for (let node = this; node; node = node.parentElement) if (node.hidden) hidden = true;
            const section = this.closest('section');
            const absoluteTop = this.absoluteTop ?? positions[this.id] ?? (section ? positions[section.id] + 160 : 0);
            const height = hidden ? 0 : this.tagName === 'SECTION' ? 700 : 100;
            return { top: absoluteTop - scrollY, bottom: absoluteTop - scrollY + height, height, left: 0, right: width, width };
        }
    }
    const root = new Element('html'); root.clientWidth = width;
    const body = new Element('body');
    const detailContent = new Element(); detailContent.id = 'detail-content'; body.append(detailContent);
    const topNav = new Element('nav');
    function getById(id) {
        let element = nodes.find(node => node.id === id);
        if (element) return element;
        element = new Element(id.endsWith('-section') ? 'section' : 'div'); element.id = id;
        detailContent.append(element);
        if (id.endsWith('-evidence')) element.append(new Element());
        return element;
    }
    Object.keys(positions).forEach(getById);
    for (const match of html.matchAll(/\bid="([^"]+)"/g)) getById(match[1]);
    const recordIds = ['RISK-004', 'RISK-007', 'RISK-011'];
    const recordNodes = recordIds.map(id => {
        const record = new Element('article'); record.id = 'lesson-detail-' + id; record.className = 'lesson-detail';
        record.hidden = id !== selectedRecord; getById('lesson-register-section').append(record); return record;
    });
    function selectRecord(id, notify = true) {
        if (!recordIds.includes(id)) return false;
        selectedRecord = id;
        recordNodes.forEach(record => { record.hidden = record.id !== 'lesson-detail-' + id; });
        if (notify) dispatch('window', { type: 'product-record:changed', detail: { recordId: id } });
        return true;
    }
    const document = {
        body, documentElement: root, readyState: 'loading',
        getElementById: id => nodes.find(node => node.id === id) || null, createElement: tag => new Element(tag),
        createTextNode: text => { const node = new Element('text'); node.textContent = text; return node; },
        addEventListener: (type, callback) => on('document', type, callback),
        querySelector: selector => selector.startsWith('meta') ? null : nodes.find(node => matches(node, selector)) || null,
        querySelectorAll: selector => selector.includes('.sidebar') || selector === '.source-row[data-view-anchor]' ? [] : nodes.filter(node => matches(node, selector)),
        elementFromPoint: () => pointElement
    };
    const history = {
        scrollRestoration: 'auto',
        get state() { return entries[historyIndex].state; },
        replaceState(value, title, url) {
            if (url !== undefined) currentUrl = new URL(url, currentUrl);
            entries[historyIndex] = { state: value, url: currentUrl.href };
        },
        pushState(value, title, url) {
            currentUrl = new URL(url, currentUrl); entries.splice(historyIndex + 1);
            entries.push({ state: value, url: currentUrl.href }); historyIndex++;
        }
    };
    const baseEntry = {
        slug: 'risk-register', name: '风险登记单', summary: { text: '测试' },
        composition: { items: [{ label: '风险描述', text: '测试字段' }] },
        roles: { items: [{ name: '项目经理', relation: '管理', actions: [], description: '' }] },
        lifecycle: { items: [{ processCode: 'CS', action: '更新', description: '测试' }] },
        caseView: {
            roles: { items: [{ name: '陈默', relation: '项目经理', actions: [], description: '' }] }
        }
    };
    const window = {
        location: { get href() { return currentUrl.href; }, get search() { return currentUrl.search; }, get hash() { return currentUrl.hash; },
            get origin() { return currentUrl.origin; }, get pathname() { return currentUrl.pathname; } },
        history, innerWidth: width, innerHeight: 900,
        get scrollY() { return scrollY; },
        requestAnimationFrame: callback => { frames.push(callback); return frames.length; },
        addEventListener: (type, callback) => on('window', type, callback),
        dispatchEvent(event) { if (event.type === 'product-detail-v2:rendered') renderCount++; dispatch('window', event); },
        scrollTo(value, y) { scrollY = typeof value === 'number' ? y : value.top; scrollLog.push(scrollY); dispatch('window', { type: 'scroll' }); },
        scrollBy(value, y) { scrollY += typeof value === 'number' ? y : value.top; scrollLog.push(scrollY); dispatch('window', { type: 'scroll' }); },
        PRINCE2_PRODUCT_DETAILS_V2: { entries: { 'risk-register': baseEntry } },
        PRINCE2ProjectPlanUsage: { resetReadingIntent() { resetIntentCounts.plan++; } },
        PRINCE2BusinessCaseUsage: { render() {}, resetReadingIntent() { resetIntentCounts.business++; } },
        PRINCE2ProductManagementUsage: {
            supports() { return true; }, render() {}, stabilizePanel() {},
            resetReadingIntent() { resetIntentCounts.generic++; sceneReadingIntent = false; },
            captureReadingAnchor() { return sceneReadingIntent ? { id: 'lifecycle-section', top: 110 } : null; }
        },
        PRINCE2LessonRegister: { render(slug, recordMode) {
            recordRenderCount++;
            getById('lesson-register-section').dataset.documentSlug = slug;
            getById('lesson-register-section').hidden = recordMode !== 'case';
            const match = currentUrl.hash.match(/(?:lesson-detail-|record-field-)(RISK-\d+)/);
            if (match && recordMode === 'case') selectRecord(match[1]);
        }, restoreSelection: id => selectRecord(id) }
    };
    const errors = [];
    const context = { window, document, history, location: window.location, URL, URLSearchParams, console: { error: (...args) => errors.push(args) },
        requestAnimationFrame: window.requestAnimationFrame, CustomEvent: class { constructor(type, options) { this.type = type; Object.assign(this, options); } } };
    vm.runInNewContext(source, context, { filename: 'product-detail-v2.js' });
    function flush() {
        let rounds = 0;
        while (frames.length) { assert.ok(rounds++ < 50, '帧任务不得无限循环'); frames.splice(0).forEach(callback => callback()); }
        assert.equal(errors.length, 0, errors.map(String).join('\n'));
    }
    dispatch('document', { type: 'DOMContentLoaded' }); flush();
    function click(link, overrides = {}, flushNow = true) {
        const event = { type: 'click', target: link, button: 0, ctrlKey: false, metaKey: false, shiftKey: false, altKey: false, defaultPrevented: false,
            preventDefault() { this.defaultPrevented = true; }, ...overrides };
        dispatch('document', event); if (flushNow) flush(); return event;
    }
    return {
        window, history, entries, document, flush, click, scrollLog,
        get url() { return currentUrl.href; }, get renderCount() { return renderCount; },
        get recordRenderCount() { return recordRenderCount; }, get selectedRecord() { return selectedRecord; },
        resetIntentCounts,
        link(href, targetMode) { const link = new Element('a'); link.href = href; if (targetMode) link.dataset.detailMode = targetMode; return link; },
        scrollTo(top) { window.scrollTo({ top }); flush(); },
        selectRecord(id) { assert.ok(selectRecord(id), '测试记录必须存在'); flush(); },
        activateSceneReading() { sceneReadingIntent = true; },
        setPointElement(element) { pointElement = element; },
        fieldAlias(name, top, { id = false } = {}) { const element = new Element(); element.dataset.viewAnchor = name; element.absoluteTop = top; if (id) element.id = name; getById('composition-section').append(element); return element; },
        wrapHidden(element, { dialog = false } = {}) {
            const wrapper = new Element(dialog ? 'dialog' : 'div');
            if (dialog) { wrapper.className = 'lesson-help-dialog'; wrapper.open = false; }
            else wrapper.hidden = true;
            getById('composition-section').append(wrapper); wrapper.append(element); return wrapper;
        },
        wrapDetails(element, open = false) {
            const details = new Element('details'); details.open = open;
            getById('composition-section').append(details); details.append(element); return details;
        },
        emit(type) { dispatch('window', { type, state: history.state }); flush(); },
        nativeHash(hashValue, { emitPopstate = true } = {}) {
            const oldHash = currentUrl.hash;
            history.pushState(history.state, '', hashValue);
            // 浏览器对同文档目标先执行原生定位，随后交付历史与 hash 事件。
            scrollY = positions[decodeURIComponent(currentUrl.hash.slice(1))] || 0;
            if (emitPopstate) dispatch('window', { type: 'popstate', state: history.state });
            if (oldHash !== currentUrl.hash) dispatch('window', { type: 'hashchange' });
            flush();
        },
        traverse(delta) {
            historyIndex += delta; assert.ok(entries[historyIndex], '历史目标存在');
            const oldHash = currentUrl.hash; currentUrl = new URL(entries[historyIndex].url);
            dispatch('window', { type: 'popstate', state: history.state });
            if (oldHash !== currentUrl.hash) dispatch('window', { type: 'hashchange' });
            flush();
        },
        snapshot() { return { hash: currentUrl.hash, mode: new URL(currentUrl).searchParams.get('mode'), state: JSON.parse(JSON.stringify(history.state)), scrollY }; }
    };
}

const results = [];
function test(name, callback) {
    try { callback(); results.push({ name, ok: true }); }
    catch (error) { results.push({ name, ok: false, message: error.message }); }
}
for (const width of [1440, 390]) {
    const offset = width <= 960 ? 132 : 84;
    test(width + ': 深链接优先定位', () => {
        const app = createHarness({ width, hash: '#roles-section' });
        assert.equal(app.window.scrollY, 2000 - offset);
        assert.equal(app.history.scrollRestoration, 'manual');
    });
    test(width + ': 普通刷新恢复已保存阅读位置', () => {
        const app = createHarness({ width }); app.scrollTo(2100); app.emit('pagehide');
        const saved = app.snapshot();
        const reload = createHarness({ width, hash: saved.hash, state: saved.state });
        assert.equal(reload.window.scrollY, 2100);
    });
    test(width + ': 模式往返保持阅读位置且不换文档', () => {
        const app = createHarness({ width }); app.scrollTo(2100);
        app.click(app.link('?entry=risk-register&mode=theory', 'theory'));
        assert.equal(app.document.body.dataset.activeDetailMode, 'theory');
        assert.equal(app.window.scrollY, 2100);
        app.click(app.link('?entry=risk-register&mode=case', 'case'));
        assert.equal(app.document.body.dataset.activeDetailMode, 'case');
        assert.equal(app.window.scrollY, 2100);
    });
    test(width + ': 前后退恢复各自模式与阅读位置', () => {
        const app = createHarness({ width }); app.scrollTo(2100);
        app.click(app.link('?entry=risk-register&mode=theory', 'theory')); app.scrollTo(3100);
        app.traverse(-1);
        assert.equal(app.document.body.dataset.activeDetailMode, 'case');
        assert.equal(app.window.scrollY, 2100);
        app.traverse(1);
        assert.equal(app.document.body.dataset.activeDetailMode, 'theory');
        assert.equal(app.window.scrollY, 3100);
    });
    test(width + ': 原生章节跳转不应重建整页', () => {
        const app = createHarness({ width }); const rendered = app.renderCount;
        app.nativeHash('#roles-section');
        assert.equal(app.window.scrollY, 2000 - offset);
        assert.equal(app.renderCount, rendered, '同文档 hash 历史不应触发产品重绘');
    });
    test(width + ': 修饰键点击保留浏览器默认行为', () => {
        const app = createHarness({ width }); const rendered = app.renderCount;
        const result = app.click(app.link('?entry=risk-register&mode=theory', 'theory'), { ctrlKey: true });
        assert.equal(result.defaultPrevented, false); assert.equal(app.renderCount, rendered);
    });
    test(width + ': 同 hash 重复点击重新定位但不增历史', () => {
        const app = createHarness({ width, hash: '#roles-section' });
        app.scrollTo(0); const count = app.entries.length;
        const event = app.click(app.link('#roles-section'));
        assert.equal(event.defaultPrevented, true);
        assert.equal(app.window.scrollY, 2000 - offset);
        assert.equal(app.entries.length, count);
    });
    test(width + ': 新章节点击保存来处及目标历史', () => {
        const app = createHarness({ width }); app.scrollTo(1100);
        app.click(app.link('#roles-section'));
        assert.equal(new URL(app.url).hash, '#roles-section');
        assert.equal(app.window.scrollY, 2000 - offset);
        app.traverse(-1); assert.equal(app.window.scrollY, 1100);
        app.traverse(1); assert.equal(app.window.scrollY, 2000 - offset);
    });
    test(width + ': 错配的历史 mode/hash 不覆盖明确深链', () => {
        for (const state of [
            { entry: 'risk-register', mode: 'theory', hash: '#roles-section', viewportAnchor: { pageTop: true } },
            { entry: 'risk-register', mode: 'case', hash: '#composition-section', viewportAnchor: { pageTop: true } }
        ]) {
            const app = createHarness({ width, hash: '#roles-section', state });
            assert.equal(app.window.scrollY, 2000 - offset);
        }
    });
    test(width + ': data-view-anchor 别名不要求另有 id', () => {
        const app = createHarness({ width }); app.fieldAlias('字段别名', 1600);
        const event = app.click(app.link('#' + encodeURIComponent('字段别名')));
        assert.equal(event.defaultPrevented, true); assert.equal(app.window.scrollY, 1600 - offset);
    });
    test(width + ': 同帧连续定位只执行最后一次', () => {
        const app = createHarness({ width }); const before = app.scrollLog.length;
        app.click(app.link('#roles-section'), {}, false);
        app.click(app.link('#lifecycle-section'), {}, false); app.flush();
        assert.equal(app.window.scrollY, 3000 - offset);
        assert.ok(!app.scrollLog.slice(before).includes(2000 - offset), '过时的定位请求不能造成短暂跳动');
    });
    test(width + ': 新标签/下载/外页/无效目标不拦截', () => {
        const app = createHarness({ width });
        const links = [app.link('#missing-anchor'), app.link('product.html#roles-section'), app.link('https://example.com/#roles-section'), app.link('#%E0%A4%A')];
        const blank = app.link('#roles-section'); blank.setAttribute('target', '_blank'); links.push(blank);
        const download = app.link('#roles-section'); download.setAttribute('download', 'file'); links.push(download);
        for (const link of links) assert.equal(app.click(link).defaultPrevented, false, link.href);
        assert.equal(app.click(app.link('#roles-section'), { defaultPrevented: true }).defaultPrevented, true);
        assert.equal(app.entries.length, 1);
    });
    test(width + ': 记录字段定位先联动所选记录', () => {
        const app = createHarness({ width }); const field = 'record-field-RISK-007-owner';
        app.fieldAlias(field, 1700, { id: true }); const before = app.recordRenderCount;
        app.click(app.link('#' + field));
        assert.equal(app.selectedRecord, 'RISK-007'); assert.equal(app.recordRenderCount, before + 1);
        assert.equal(app.window.scrollY, 1700 - offset);
    });
    test(width + ': 字段A之后手动选B再切模式及后退仍保留B', () => {
        const app = createHarness({ width }); const field = 'record-field-RISK-004-owner';
        app.fieldAlias(field, 1700, { id: true }); app.click(app.link('#' + field));
        assert.equal(app.selectedRecord, 'RISK-004');
        app.selectRecord('RISK-007'); assert.equal(app.history.state.recordId, 'RISK-007');
        app.click(app.link('?entry=risk-register&mode=theory', 'theory'));
        app.traverse(-1);
        assert.equal(app.document.body.dataset.activeDetailMode, 'case');
        assert.equal(app.selectedRecord, 'RISK-007', '历史快照中的实际选中记录优先于旧字段 hash');
        assert.equal(app.history.state.recordId, 'RISK-007');
    });
    test(width + ': 普通刷新恢复记录快照而非旧字段hash', () => {
        const app = createHarness({ width }); const field = 'record-field-RISK-004-owner';
        app.fieldAlias(field, 1700, { id: true }); app.click(app.link('#' + field)); app.selectRecord('RISK-011');
        app.scrollTo(2100); app.emit('pagehide'); const snapshot = app.snapshot();
        const reload = createHarness({ width, hash: snapshot.hash, state: snapshot.state });
        assert.equal(reload.selectedRecord, 'RISK-011'); assert.equal(reload.window.scrollY, 2100);
    });
    test(width + ': 同路由历史分别恢复记录快照', () => {
        const app = createHarness({ width });
        app.click(app.link('#roles-section')); app.selectRecord('RISK-007'); app.scrollTo(2100);
        app.click(app.link('#lifecycle-section')); app.selectRecord('RISK-011'); app.scrollTo(3100);
        const rendered = app.renderCount;
        app.traverse(-1); assert.equal(app.selectedRecord, 'RISK-007'); assert.equal(app.window.scrollY, 2100);
        app.traverse(1); assert.equal(app.selectedRecord, 'RISK-011'); assert.equal(app.window.scrollY, 3100);
        assert.equal(app.renderCount, rendered, '记录历史恢复不重建整页');
    });
    test(width + ': 无效记录快照不能越过实际记录集合', () => {
        const state = { entry: 'risk-register', mode: 'case', hash: '#lesson-detail-RISK-007',
            recordId: 'RISK-999', viewportAnchor: { id: 'roles-section', top: offset } };
        const app = createHarness({ width, hash: state.hash, state });
        assert.equal(app.selectedRecord, 'RISK-007'); assert.equal(app.history.state.recordId, 'RISK-007');
    });
    test(width + ': 显式章节点击结束旧场景阅读意图', () => {
        const app = createHarness({ width }); app.scrollTo(2100); app.activateSceneReading();
        app.click(app.link('#roles-section'));
        assert.deepEqual(app.resetIntentCounts, { plan: 1, business: 1, generic: 1 });
        assert.equal(app.window.scrollY, 2000 - offset);
        assert.equal(app.history.state.viewportAnchor.id, 'roles-section', '不能在定位完成后重新存入旧生命周期场景');
        app.click(app.link('?entry=risk-register&mode=theory', 'theory'));
        assert.equal(app.window.scrollY, 2000 - offset);
    });
    test(width + ': 跳正文链接保留原生焦点行为', () => {
        const app = createHarness({ width });
        for (const className of ['workspace-skip', 'skip-link']) {
            const link = app.link('#main-content'); link.className = className;
            assert.equal(app.click(link).defaultPrevented, false, className);
        }
        assert.equal(app.entries.length, 1); assert.equal(app.resetIntentCounts.generic, 0);
    });
    test(width + ': 隐藏同名 id 不遮蔽可见阅读别名', () => {
        const app = createHarness({ width }); const key = 'collision-hidden-id';
        app.fieldAlias(key, 1600); const direct = app.fieldAlias(key, 1200, { id: true }); direct.hidden = true;
        app.click(app.link('#' + key)); assert.equal(app.window.scrollY, 1600 - offset);
    });
    test(width + ': 隐藏祖先内的 id 不遮蔽可见阅读别名', () => {
        const app = createHarness({ width }); const key = 'collision-hidden-parent';
        app.fieldAlias(key, 1600); const direct = app.fieldAlias(key, 1200, { id: true }); app.wrapHidden(direct);
        app.click(app.link('#' + key)); assert.equal(app.window.scrollY, 1600 - offset);
    });
    test(width + ': 已关闭说明框内 id 不遮蔽可见阅读别名', () => {
        const app = createHarness({ width }); const key = 'collision-closed-help';
        app.fieldAlias(key, 1600); const direct = app.fieldAlias(key, 1200, { id: true }); app.wrapHidden(direct, { dialog: true });
        app.click(app.link('#' + key)); assert.equal(app.window.scrollY, 1600 - offset);
    });
    test(width + ': 可见的直接 id 仍优先于同名别名', () => {
        const app = createHarness({ width }); const key = 'collision-visible-id';
        app.fieldAlias(key, 1600); app.fieldAlias(key, 1200, { id: true });
        app.click(app.link('#' + key)); assert.equal(app.window.scrollY, 1200 - offset);
    });
    test(width + ': 关闭 details 内缓存矩形不作为阅读锚点', () => {
        const app = createHarness({ width });
        const closed = app.fieldAlias('closed-details-row', 2200); app.wrapDetails(closed);
        app.fieldAlias('visible-reading-row', 2200); app.scrollTo(2100);
        assert.ok(closed.getBoundingClientRect().height > 0, '刻意保留缓存矩形模拟真实浏览器候选');
        assert.equal(app.history.state.viewportAnchor.dataAnchor, 'visible-reading-row');
    });
    test(width + ': 命中关闭 details 行时回退到可见阅读项', () => {
        const app = createHarness({ width });
        const closed = app.fieldAlias('point-closed-row', 2200); app.wrapDetails(closed);
        app.fieldAlias('point-visible-row', 2200); app.setPointElement(closed); app.scrollTo(2100);
        assert.equal(app.history.state.viewportAnchor.dataAnchor, 'point-visible-row');
    });
    test(width + ': 关闭 details 的同名 id 不遮蔽可见别名', () => {
        const app = createHarness({ width }); const key = 'collision-closed-details';
        app.fieldAlias(key, 1600); const direct = app.fieldAlias(key, 1200, { id: true }); app.wrapDetails(direct);
        app.click(app.link('#' + key)); assert.equal(app.window.scrollY, 1600 - offset);
    });
    test(width + ': 打开的 details 内阅读项仍可被选中', () => {
        const app = createHarness({ width });
        const opened = app.fieldAlias('open-details-row', 2200); app.wrapDetails(opened, true); app.scrollTo(2100);
        assert.equal(app.history.state.viewportAnchor.dataAnchor, 'open-details-row');
    });
}
for (const result of results) console.log((result.ok ? 'PASS' : 'FAIL') + ': ' + result.name + (result.message ? '\n  ' + result.message : ''));
console.log(results.filter(result => result.ok).length + '/' + results.length + ' 个导航行为检查通过。最小 DOM 检查不包含浏览器原生事件时序、视觉或打印验收。');
if (results.some(result => !result.ok)) process.exitCode = 1;
