// 最终复核的管理数据与矩阵渲染检查，不代表浏览器视觉、打印或用户验收。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(fs.readFileSync(path.join(root, file)));
    assert.ok(!text.includes('\uFFFD'), file + ': U+FFFD');
    return text;
};
const handlers = {};
let selectedId = 'RISK-004', matrixRoot = null, loadingFile = '';
function descend(node) { return node.children.flatMap(child => [child, ...descend(child)]); }
class Element {
    constructor(tag) { this.tagName = tag.toUpperCase(); this.children = []; this.dataset = {}; this.attributes = {}; this.listeners = {}; this.value = ''; }
    append(...nodes) { nodes.forEach(node => { this.children.push(node); node.parentElement = this; }); }
    prepend(node) { this.children.unshift(node); node.parentElement = this; }
    set textContent(value) { this.value = String(value); this.children = []; }
    get textContent() { return this.value + this.children.map(child => child.textContent).join(''); }
    setAttribute(name, value) {
        this.attributes[name] = String(value);
        if (name.startsWith('data-')) this.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = String(value);
    }
    getAttribute(name) { return this.attributes[name] || null; }
    get firstElementChild() { return this.children[0] || null; }
    addEventListener(type, callback) { (this.listeners[type] ||= []).push(callback); }
    click() { (this.listeners.click || []).forEach(callback => callback({ target: this })); }
    querySelectorAll(selector) {
        const all = descend(this);
        if (selector === '[data-provenance="project-synthesis"] thead th') {
            const block = all.find(node => node.dataset.provenance === 'project-synthesis');
            const head = block && descend(block).find(node => node.tagName === 'THEAD');
            return head ? descend(head).filter(node => node.tagName === 'TH') : [];
        }
        const role = selector.match(/th\[data-role-key="([^"]+)"\]/);
        if (role) return this.querySelectorAll('[data-provenance="project-synthesis"] thead th').filter(node => node.dataset.roleKey === role[1]);
        return all.filter(node => node.tagName === selector.toUpperCase());
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
}
const document = {
    createElement: tag => new Element(tag),
    getElementById: id => matrixRoot && [matrixRoot, ...descend(matrixRoot)].find(node => node.id === id),
    querySelector: selector => selector.includes('.lesson-detail:not([hidden])') && selectedId ? { id: 'lesson-detail-' + selectedId } : null
};
const context = { document, window: { addEventListener(type, callback) { (handlers[type] ||= []).push({ callback, file: loadingFile }); } } };
const files = [
    'assets/prince2-products.js', 'assets/product-details-v2.js', 'cases/renovation-register-data.js',
    'assets/register-documents.js', 'assets/lesson-register.js', 'assets/quality-register.js',
    'assets/product-management-usage.js', 'assets/product-remaining-v2.js',
    'assets/product-remaining-cases.js', 'assets/product-remaining-methods.js',
    'assets/product-remaining-runtime.js', 'assets/product-raci.js',
    'assets/business-case-usage.js', 'assets/project-plan-usage.js'
];
for (const file of files) { loadingFile = file; vm.runInNewContext(read(file), context, { filename: file }); }
const w = context.window, entries = w.PRINCE2_PRODUCT_DETAILS_V2.entries;
const usage = w.PRINCE2ProductManagementUsage, raci = w.PRINCE2ProductRaci;
const slugs = Object.keys(usage.configurations);
assert.equal(Object.keys(entries).length, 36);
assert.equal(slugs.length, 33);
assert.deepEqual([...slugs].sort(), Object.keys(raci.mappings).sort());
let scenes = 0, steps = 0, actorLinks = 0, fieldLinks = 0, productLinks = 0;
for (const slug of slugs) {
    const entry = entries[slug], order = usage.caseRoleOrder[slug] || entry.roles.items.map((_, index) => index);
    assert.equal(entry.roles.items.length, entry.caseView.roles.items.length, slug + ': role counts');
    assert.equal(new Set(order).size, entry.roles.items.length, slug + ': role mapping is a permutation');
    assert.equal(usage.configurations[slug].length, entry.lifecycle.items.length, slug + ': lifecycle scenes');
    assert.deepEqual(Array.from(entry.composition.items, item => item.label), Array.from(entry.caseView.composition.items, item => item.label), slug + ': theory/case fields');
    for (const [index, scene] of usage.configurations[slug].entries()) {
        scenes++;
        assert.ok(scene.name && scene.state && scene.steps.length, slug + ':' + index);
        for (const step of scene.steps) {
            steps++;
            for (const field of ['theory', 'example', 'result', 'caseResult', 'recipient']) assert.ok(step[field], slug + ':' + field);
            for (const actor of step.actors) {
                actorLinks++;
                assert.ok(entry.roles.items[actor] && entry.caseView.roles.items[order[actor]], slug + ': actor index');
            }
            for (const field of step.fields) { fieldLinks++; assert.ok(entry.composition.items[field - 1], slug + ': field ' + field); }
            for (const target of step.products) { productLinks++; assert.ok(entries[target] && entries[target].caseView, slug + ': product target ' + target); }
        }
    }
}
function renderMatrix(slug, mode) {
    if (slug === 'risk-register' && !selectedId.startsWith('RISK-')) selectedId = 'RISK-004';
    if (slug === 'lessons-log' && !selectedId.startsWith('LES-')) selectedId = 'LES-001';
    const container = new Element('div'), selectedScenes = [];
    raci.render(container, slug, mode, scene => selectedScenes.push(scene));
    matrixRoot = container.children[0];
    return { container, selectedScenes, tables: descend(container).filter(node => node.tagName === 'TABLE') };
}
function matrixCodes(table) {
    const body = table.children.find(node => node.tagName === 'TBODY');
    return body.children.map(row => row.children.slice(1).map(cell => cell.textContent));
}
let renderedViews = 0, operationClicks = 0;
for (const slug of slugs) {
    let theoryCodes;
    for (const mode of ['theory', 'case']) {
        const result = renderMatrix(slug, mode); renderedViews++;
        assert.equal(result.tables.length, 2, slug + ': two provenance tables');
        const [manual, operation] = result.tables;
        assert.equal(manual.children[0].children[0].children.length, 9, slug + ': 8 textbook roles');
        assert.ok(operation.parentElement.parentElement.textContent.includes('非教材内容'), slug + ': non-manual label');
        const codes = result.tables.map(matrixCodes);
        if (mode === 'theory') theoryCodes = codes;
        else assert.deepEqual(codes, theoryCodes, slug + ': theory/case RACI letters');
        const body = operation.children.find(node => node.tagName === 'TBODY');
        const profile = raci.profile(slug);
        assert.equal(body.children.length, profile.length, slug + ': operation row count');
        body.children.forEach((row, index) => {
            const assigned = Object.values(profile[index].assignments).filter(Boolean).sort();
            assert.deepEqual(row.children.slice(1).map(cell => cell.textContent).filter(Boolean).sort(), Array.from(assigned), slug + ': every assigned role has visible column');
            const button = descend(row.children[0]).find(node => node.tagName === 'BUTTON');
            button.click(); operationClicks++;
            assert.equal(result.selectedScenes.at(-1), profile[index].scene, slug + ': operation callback selects correct scene');
        });
        const heads = operation.children[0].children[0].children.slice(1);
        for (const head of heads) assert.equal(head.children.length, mode === 'case' ? 3 : 1, slug + ': role/person/identity structure');
    }
}
let recordChanges = 0;
for (const slug of ['lessons-log', 'risk-register']) {
    renderMatrix(slug, 'case');
    const recordIds = slug === 'lessons-log' ? ['LES-001', 'LES-002', 'LES-003'] : ['RISK-004', 'RISK-007', 'RISK-011'];
    for (const id of recordIds) {
        selectedId = id;
        for (const handler of handlers['product-record:changed'] || []) {
            // 此项只触发矩阵自己的监听；管理链接监听依赖完整页面 DOM，由浏览器另验。
            if (handler.file === 'assets/product-raci.js') handler.callback({ detail: { recordId: id } });
        }
        const heads = matrixRoot.querySelectorAll('[data-provenance="project-synthesis"] thead th');
        if (slug === 'lessons-log') {
            const expected = { 'LES-001': '赵建国', 'LES-002': '宋妍', 'LES-003': '陆明远' }[id];
            const owner = heads.find(head => head.firstElementChild && head.firstElementChild.textContent === '行动负责人');
            assert.equal(owner.children[1].textContent, expected, id + ': lesson owner');
        } else {
            for (const key of ['owner', 'action']) {
                const head = heads.find(head => head.dataset.roleKey === key);
                const role = raci.riskRecordRole(id, key, key === 'owner' ? '风险负责人' : '风险行动负责人', 'case');
                assert.equal(head.children[1].textContent, role.person, id + ': risk role ' + key);
                assert.equal(head.children[2].textContent, role.identity, id + ': risk identity ' + key);
            }
        }
        recordChanges++;
    }
}
let registerRecords = 0;
for (const [slug, configuration] of Object.entries({
    'risk-register': w.PRINCE2RegisterDocuments['risk-register'],
    'issue-register': w.PRINCE2RegisterDocuments['issue-register'],
    'product-register': w.PRINCE2RegisterDocuments['product-register'],
    'quality-register': w.PRINCE2QualityRegister
})) {
    const ids = configuration.records.map(record => record.id);
    assert.equal(new Set(ids).size, ids.length, slug + ': unique record IDs');
    const expected = Array.from(entries[slug].composition.items, field => field.label);
    for (const record of configuration.records) {
        registerRecords++;
        assert.deepEqual(Array.from(record.fields, field => field[0]).concat(configuration.referenceLabel || '记录'), expected, slug + ':' + record.id + ': fields and source record');
        assert.ok(record.sources && record.sources.length, record.id + ': source records');
        for (const [, href] of record.sources) {
            const url = new URL(href, 'http://local/entities/product-detail-v2.html');
            const localFile = decodeURIComponent(url.pathname.slice(1));
            assert.ok(fs.existsSync(path.join(root, localFile)), record.id + ': source file ' + href);
        }
    }
}
let riskScenes = 0;
const riskConfigurations = usage.configurations['risk-register'];
const riskSnapshot = JSON.stringify(riskConfigurations);
for (const recordId of ['RISK-004', 'RISK-007', 'RISK-011']) {
    for (const index of [3, 4]) {
        const actor = usage.riskActor(index, recordId);
        const text = JSON.stringify(actor);
        if (recordId === 'RISK-004') assert.match(text, /拟任/);
        else assert.match(text, /待确认/);
        if (recordId !== 'RISK-004') assert.ok(!actor.name.includes('陈默') && !actor.name.includes('陆明远'), recordId + ': no borrowed wooden-door appointment');
        const sourceField = w.PRINCE2RegisterDocuments['risk-register'].records.find(record => record.id === recordId).fields.find(field => field[0] === actor.relation);
        assert.equal(actor.description, sourceField[1], recordId + ': appointment boundary remains source field');
    }
    for (const [index, configuration] of riskConfigurations.entries()) {
        const scene = usage.riskScene(configuration, index, recordId); riskScenes++;
        assert.equal(scene.steps.length, configuration.steps.length, recordId + ': scene step count');
        assert.ok(scene.state.includes(recordId), recordId + ': scene label');
        scene.steps.forEach((step, position) => {
            assert.equal(step.theory, configuration.steps[position].theory, recordId + ': theory unchanged');
            const narrative = [step.example, step.caseResult, step.recipient].join(' ');
            if (recordId === 'RISK-007') assert.ok(!/木门|排产/.test(narrative), recordId + ': no wooden-door narrative');
            if (recordId === 'RISK-011') assert.ok(!/防水|复验|赵建国/.test(narrative), recordId + ': no waterproofing or borrowed action owner');
        });
    }
}
assert.equal(JSON.stringify(riskConfigurations), riskSnapshot, 'risk case adaptation cannot mutate shared theory configuration');
function printRules(file) {
    const css = read(file), blocks = [];
    const pattern = /@media\s+print\s*\{/g;
    for (let match; (match = pattern.exec(css));) {
        let depth = 1, position = pattern.lastIndex;
        const start = position;
        for (; position < css.length && depth; position++) {
            if (css[position] === '{') depth++;
            if (css[position] === '}') depth--;
        }
        assert.equal(depth, 0, file + ': balanced print block');
        blocks.push(css.slice(start, position - 1)); pattern.lastIndex = position;
    }
    assert.ok(blocks.length, file + ': print rules exist');
    return blocks.join('\n');
}
const workspacePrint = printRules('assets/product-workspace.css');
assert.match(workspacePrint, /\.workspace-frame\s*\{[^}]*width:\s*100%\s*!important[^}]*margin:\s*0\s*!important/s);
assert.match(workspacePrint, /workspace-sidebar[^}]*display:\s*none\s*!important/s);
const planPrint = printRules('assets/project-plan-usage.css');
assert.match(planPrint, /\.plan-matrix\s*\{[^}]*min-width:\s*0[^}]*width:\s*100%/s);
assert.match(planPrint, /\.plan-matrix th:first-child\s*\{[^}]*position:\s*static/s);
assert.match(planPrint, /\.plan-matrix thead\s*\{[^}]*display:\s*table-header-group/s);
const raciPrint = printRules('assets/product-raci.css');
assert.match(raciPrint, /\.product-raci-table\s*\{[^}]*min-width:\s*0[^}]*width:\s*100%/s);
assert.match(raciPrint, /\.product-raci-table thead\s*\{[^}]*display:\s*table-header-group/s);
const sourcePrint = printRules('cases/source-workspace.css');
assert.match(sourcePrint, /data-case-product="产品登记单"[^}]*page:\s*product-register-sheet/s);
assert.match(sourcePrint, /\.full-register-table\s*\{[^}]*min-width:\s*0[^}]*width:\s*100%/s);
assert.match(read('cases/source-workspace.css'), /@page product-register-sheet\s*\{[^}]*size:\s*A4 landscape/s);
const registerPrint = printRules('assets/lesson-register.css');
assert.match(registerPrint, /\.lesson-detail\[hidden\]\s*\{[^}]*display:\s*block\s*!important/s);
assert.match(registerPrint, /\.lesson-record-fields\s*>\s*div\s*\{[^}]*break-inside:\s*avoid/s);
// 打印 CSS 契约只确认规则存在，不证明浏览器分页、表头重复或实际输出尺寸。
const excluded = new Set(['旧版', 'doc', 'tmp', 'output', '.playwright-cli', '.git', 'node_modules']);
function activeHtml(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap(item => {
        if (excluded.has(item.name)) return [];
        const file = path.join(directory, item.name);
        return item.isDirectory() ? activeHtml(file) : /\.html$/i.test(item.name) ? [file] : [];
    });
}
const htmlFiles = activeHtml(root), missingLinks = [];
let localLinks = 0;
function decodeAttribute(value) {
    return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#(?:x([\da-f]+)|(\d+));/gi, (_, hex, decimal) => String.fromCodePoint(parseInt(hex || decimal, hex ? 16 : 10)));
}
for (const file of htmlFiles) {
    const relative = path.relative(root, file).replaceAll('\\', '/');
    const markup = read(relative).replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
    for (const tag of markup.matchAll(/<[a-z][^>]*>/gi)) {
        for (const attribute of tag[0].matchAll(/\b(href|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
            const href = decodeAttribute(attribute[2] ?? attribute[3] ?? attribute[4]);
            if (!href || /^(?:data:|javascript:|mailto:|tel:|blob:|file:)/i.test(href)) continue;
            const url = new URL(href, 'http://local/' + relative);
            if (url.origin !== 'http://local' && !/^http:\/\/(?:127\.0\.0\.1|localhost):8000$/.test(url.origin)) continue;
            localLinks++;
            const target = path.resolve(root, decodeURIComponent(url.pathname.slice(1)));
            if (!target.startsWith(root + path.sep) && target !== root) missingLinks.push({ page: relative, href, reason: 'outside root' });
            else if (!fs.existsSync(target)) missingLinks.push({ page: relative, href, reason: 'missing local target' });
        }
    }
}
if (missingLinks.length) console.error(JSON.stringify({ missingLocalLinks: missingLinks }, null, 2));
assert.equal(missingLinks.length, 0, 'active HTML href/src local file targets exist');
for (const slug of ['project-plan', 'outline-business-case', 'full-business-case']) {
    const component = slug === 'project-plan' ? w.PRINCE2ProjectPlanUsage : w.PRINCE2BusinessCaseUsage;
    const activities = slug === 'project-plan' ? component.activities : component.activities[slug];
    assert.ok(component.roles.length === 8 && activities.length, slug + ': specialized matrix');
}
console.log('PASS: 36 entries; ' + scenes + ' generic scenes, ' + steps + ' steps, ' + actorLinks + ' actor bindings, ' + fieldLinks + ' field links, ' + productLinks + ' product links');
console.log('PASS: ' + renderedViews + ' RACI VM renders, ' + operationClicks + ' operation callbacks, ' + recordChanges + ' record owner updates, ' + registerRecords + ' complete register records, ' + riskScenes + ' record-specific risk scenes; specialized matrix data present');
console.log('PASS: 5 print CSS contracts; ' + htmlFiles.length + ' active HTML pages, ' + localLinks + ' local href/src targets exist. These are not pagination or network HTTP evidence.');
console.log('Boundary: data and isolated RACI DOM only; browser layout, management link clicks, keyboard/focus, source navigation and print pagination are not validated by this script.');
