// 新增条目的原文、案例正文、导航及场景完整性，只读校验。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
require('./check_navigation_assets.cjs');
require('./check_product_raci.cjs');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: { addEventListener() {} } };
const scripts = ['assets/prince2-products.js', 'assets/product-details-v2.js', 'cases/renovation-register-data.js',
    'assets/register-documents.js', 'assets/product-management-usage.js', 'assets/product-remaining-v2.js',
    'assets/product-remaining-cases.js', 'assets/product-remaining-methods.js', 'assets/product-remaining-runtime.js'];
for (const file of scripts) vm.runInNewContext(read(file), context, { filename: file });
const w = context.window, data = w.PRINCE2RemainingProducts, entries = w.PRINCE2_PRODUCT_DETAILS_V2.entries;
const normalize = value => value.replace(/\s|[●•]/g, '');
function page(number) { return normalize(read('doc/prince2-7/pages/page-' + String(number).padStart(3, '0') + '.md')); }
const failures = [];
const ids = value => JSON.stringify(value).match(/\b(?:[A-Z]{2,6}-){1,2}\d{1,3}\b/g) || [];
const knownIds = new Set(ids(context.window.RENOVATION_PRODUCT_REGISTER).concat(ids(context.window.PRINCE2RegisterDocuments['risk-register']),
    ids(context.window.PRINCE2RegisterDocuments['issue-register']), ['REN-001','PD-WPF-11','QA-WPF-01','QA-WPF-02','LES-001','LES-002','LES-003','DL-001','DL-002','DL-003']));
assert.equal(Object.keys(entries).length, 36);
assert.equal(Object.keys(w.PRINCE2_PRODUCT_ROUTES).length, 36);
for (const [name, slug] of Object.entries(w.PRINCE2_PRODUCT_ROUTES)) assert.equal(entries[slug].name, name);
for (const spec of Object.values(data.source)) {
    const definition = page(spec.definitionPage), content = page(spec.page) + page(spec.page + 1);
    if (!definition.includes(normalize(spec.definition))) failures.push(spec.slug + ': definition not exact');
    if (!content.includes(normalize(spec.purpose))) failures.push(spec.slug + ': purpose not exact');
    for (const field of spec.fields) {
        if (!content.includes(normalize(field.join('：')))) failures.push(spec.slug + ': field ' + field[0]);
    }
    const entry = entries[spec.slug], paper = data.papers[spec.slug];
    for (const id of ids(paper)) assert.ok(knownIds.has(id), spec.slug + ': unknown case identifier ' + id);
    assert.equal(paper.chapters.length, spec.fields.length, spec.slug);
    assert.equal(JSON.stringify(entry.composition.items.map(field => field.label)), JSON.stringify(entry.caseView.composition.items.map(field => field.label)), spec.slug);
    assert.ok(w.PRINCE2RegisterDocuments[spec.slug].buildContent, spec.slug);
    const scenes = w.PRINCE2ProductManagementUsage.configurations[spec.slug];
    assert.equal(scenes.length, entry.lifecycle.items.length, spec.slug);
    assert.equal(new Set(entry.lifecycle.items.map(item => item.anchor)).size, scenes.length, spec.slug + ': duplicate phase anchor');
    for (const scene of scenes) for (const step of scene.steps) {
        for (const index of step.actors) assert.ok(entry.roles.items[index] && entry.caseView.roles.items[index], spec.slug);
        for (const index of step.fields) assert.ok(spec.fields[index - 1], spec.slug + ': field index');
        for (const product of step.products) assert.ok(entries[product], product);
    }
    for (const product of paper.links) assert.ok(entries[product], product);
    for (const field of [entry.definition, entry.purpose]) {
        const url = new URL(field.sourceHref, 'http://local/entities/product-detail-v2.html');
        assert.ok(read(decodeURIComponent(url.pathname.slice(1))).includes('id="' + decodeURIComponent(url.hash.slice(1)) + '"'), field.sourceHref);
    }
}
for (const file of scripts) {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(fs.readFileSync(path.join(root, file)));
    assert.ok(!text.includes('\uFFFD'), file);
}
assert.equal(data.papers['daily-log'].records.length, 3);
assert.ok(data.papers['stage-plan'].status.includes('v0.1'));
assert.ok(data.papers['exception-plan'].status.includes('未获'));
assert.ok(data.papers['end-project-report'].status.includes('未竣工'));
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log('PASS: 36 routes, 23 new dual modes, 25 documents, exact source fields, linked roles and scenes, UTF-8');
