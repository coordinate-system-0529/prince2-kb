// 核对项目计划原文字段、预算、产品编号及入口，不替代浏览器验收。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: { addEventListener() {} } };
for (const file of ['assets/product-details-v2.js', 'assets/business-case-document.js', 'assets/project-plan-document.js', 'assets/project-plan-usage.js', 'cases/renovation-register-data.js']) vm.runInNewContext(read(file), context);
const entry = context.window.PRINCE2_PRODUCT_DETAILS_V2.entries['project-plan'];
const document = context.window.PRINCE2ProjectPlanDocument;
const compact = text => text.replace(/\s+/g, '');
const source = compact(read('doc/prince2-7/pages/page-324.md'));
const chapter = compact(read('doc/prince2-7/pages/page-127.md'));
assert.equal(entry.code, 'A9');
assert.equal(entry.identity.isFormalManagementProduct, false);
assert.equal(entry.composition.items.length, 10);
assert.deepEqual(Array.from(entry.caseView.composition.items, item => item.label), Array.from(entry.composition.items, item => item.label));
for (const item of entry.composition.items) assert.ok(source.includes(compact(item.label + '：' + item.text)), item.label);
for (const part of [entry.definition, entry.purpose]) assert.ok(chapter.includes(compact(part.text)), part.label);
for (const anchor of ['source-plan-a9', 'source-plan-purpose', 'source-plan-composition', 'source-plan-usage']) assert.ok(read('chapters/appendix_a.html').includes('id="' + anchor + '"'), anchor);
for (const part of [entry.definition, entry.purpose]) {
    const url = new URL(part.sourceHref, 'http://local/entities/product-detail-v2.html');
    assert.ok(read(url.pathname.slice(1)).includes('id="' + url.hash.slice(1) + '"'));
}
assert.strictEqual(document.budget, context.window.PRINCE2BusinessCaseDocument.budget);
assert.equal(document.budget.reduce((sum, row) => sum + row[1], 0), 42);
assert.equal(document.budget.find(row => row[0] === '风险余量')[1], 5);
assert.ok(document.metadata.some(row => row[1].includes('拟稿') && row[1].includes('教学虚构')));
assert.ok(document.metadata.some(row => row[1].includes('待确认')));
const productIds = new Set(context.window.RENOVATION_PRODUCT_REGISTER.products.map(item => item.id));
for (const item of document.schedule) {
    assert.ok(item.start >= 1 && item.end <= 16 && item.end >= item.start);
    for (const id of item.products.match(/(?:DEC|DEM|MEP|WPF|FIN|CAB|DOOR|ELE|HOME|HAN)-\d+/g) || []) assert.ok(productIds.has(id), id);
}
assert.ok(document.schedule.some(item => item.products.includes('HOME-025') && item.end === 16));
for (const file of ['assets/product-workspace.js', 'assets/product-navigation-v2.js', 'assets/product-detail-v2.js', 'assets/lesson-register.js', 'entities/product-detail-v2.html', 'py/audit_site_presentation_browser.cjs']) assert.ok(read(file).includes('project-plan'), file);
const usage = context.window.PRINCE2ProjectPlanUsage;
assert.equal(usage.roles.length, 8);
assert.equal(usage.scenes.length, 6);
assert.equal(usage.activities.length, 7);
assert.deepEqual(Array.from(usage.activities.find(item => item.id === 'authorize').raci), ['I', 'A/R', 'C', 'C', 'I', 'I', 'C', 'I']);
assert.deepEqual(Array.from(usage.activities.find(item => item.id === 'prepare').raci), ['', 'A', 'C', 'C', 'R', 'C', 'C', 'C']);
assert.equal(usage.scenes.find(item => item.id === 'exception').branches.length, 3);
for (const item of usage.activities) {
    assert.equal(item.raci.length, usage.roles.length);
    assert.equal(item.raci.filter(value => value.includes('A')).length, 1);
    assert.ok(usage.scenes.some(scene => scene.id === item.scene));
    const sourceUrl = new URL(item.source[1], 'http://local/entities/product-detail-v2.html');
    const html = read(sourceUrl.pathname.slice(1));
    const sourceRows = Array.from(html.matchAll(/<tr>([\s\S]*?)<\/tr>/g), match => Array.from(match[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g), cell => cell[1].replace(/<[^>]*>/g, '').trim()));
    const sourceRow = sourceRows.find(row => row[0] === item.label);
    assert.ok(sourceRow, item.label);
    assert.deepEqual(sourceRow.slice(1), Array.from(item.raci), item.label + ' 原文网页角色列');
}
for (const scene of usage.scenes) {
    assert.ok(scene.state.includes('情境') || scene.state.includes('待确认'));
    for (const item of scene.steps) for (const material of item.materials) {
        if (material.chapter) assert.ok(material.chapter >= 1 && material.chapter <= 10);
        else assert.ok(context.window.PRINCE2_PRODUCT_DETAILS_V2.entries[material.slug], material.slug);
    }
}
for (const reference of [...usage.activities.map(item => item.source), ...usage.scenes.map(item => item.source)]) {
    const url = new URL(reference[1], 'http://local/entities/product-detail-v2.html');
    assert.ok(read(url.pathname.slice(1)).includes('id="' + url.hash.slice(1) + '"'), reference[1]);
}
for (const file of ['assets/project-plan-document.js', 'assets/project-plan-document.css', 'assets/project-plan-usage.js', 'assets/project-plan-usage.css', 'assets/product-details-v2.js', 'assets/product-detail-v2.js', 'assets/lesson-register.js', 'entities/product-detail-v2.html', 'chapters/ch07.html', 'chapters/appendix_a.html', 'chapters/ch15.html', 'chapters/ch16.html', 'chapters/ch19.html']) {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(fs.readFileSync(path.join(root, file)));
    assert.ok(!text.includes('\uFFFD'), file);
}
console.log('PASS: A9 source fields, shared budget, schedule, 8 roles, 7 activity rows, 6 scenarios, permission branches, references and UTF-8');
