const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const norm = text => text.replace(/\s/g, '');
const context = { window: {} };
vm.runInNewContext(read('assets/product-details-v2.js'), context);
const entries = context.window.PRINCE2_PRODUCT_DETAILS_V2.entries;
// 核验手册原文与双模式一一对应，避免迁移时把历史标签当成当前事实。
for (const [slug, appendix, glossary, count] of [['risk-register', 332, 347, 12], ['lessons-log', 331, 350, 8]]) {
    const item = entries[slug];
    const source = norm(read(`doc/prince2-7/pages/page-${appendix}.md`));
    assert.ok(norm(read(`doc/prince2-7/pages/page-${glossary}.md`)).includes(norm(item.definition.text)));
    assert.ok(source.includes(norm(item.purpose.text)));
    assert.equal(item.composition.items.length, count);
    assert.equal(item.identity.isFormalManagementProduct, false);
    assert.equal(item.parent.code, 'A13');
    for (const field of item.composition.items) assert.ok(source.includes(norm(field.label + '：' + field.text)), field.label);
    for (const [section, theoryKey, caseKey] of [['composition', 'label', 'label'], ['roles', 'name', 'relation'], ['lifecycle', 'processCode', 'processCode']]) {
        const theory = item[section].items.map(row => row[theoryKey]);
        const cases = item.caseView[section].items.map(row => row[caseKey]);
        assert.equal(JSON.stringify(theory), JSON.stringify(cases));
        assert.equal(new Set(theory).size, theory.length);
    }
    assert.ok(item.roles.items.every(row => row.relation));
    assert.ok(item.caseView.sourceNote.includes('教学'));
    // 历史与当前状态在对应字段核验，不要求在页头重复免责声明。
    const caseFields = JSON.stringify(item.caseView.composition.items);
    assert.match(caseFields, /旧|历史/);
    assert.match(caseFields, /待确认|待核验|待复评/);
    console.log(`${slug}: ${count} fields; source fidelity and mapping PASS`);
}
assert.ok(entries['risk-register'].caseView.roles.boundary.text.includes('待复验'));
assert.ok(entries['lessons-log'].caseView.composition.items[5].text.includes('待核验'));
const recordText = read('cases/risk-lessons-records.html');
for (const id of ['RISK-004', 'RISK-007', 'RISK-011', 'LES-001', 'LES-002', 'LES-003']) assert.ok(recordText.includes(id));
for (const file of ['assets/product-details-v2.js', 'assets/product-detail-v2.js', 'assets/product-workspace.js', 'chapters/appendix_a.html', 'chapters/glossary.html', 'entities/product-detail-v2.html', 'entities/product.html', 'cases/renovation.html', 'cases/risk-lessons-records.html']) {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(fs.readFileSync(path.join(root, file)));
    assert.ok(!text.includes('\uFFFD'), file);
}
console.log('PASS: current-state boundaries, 6 retained examples and UTF-8');
