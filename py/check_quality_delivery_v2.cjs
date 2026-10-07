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
// 定义、用途和字段对照手册，案例保持相同的语义定位键。
for (const [slug, page, glossary, count, formal] of [
    ['quality-register', 168, 356, 7, false],
    ['quality-management-approach', 167, 356, 7, false],
    ['work-package-description', 335, 348, 11, true]
]) {
    const item = entries[slug];
    const source = norm(read(`doc/prince2-7/pages/page-${page}.md`));
    assert.ok(norm(read(`doc/prince2-7/pages/page-${glossary}.md`)).includes(norm(item.definition.text)), slug + ' definition');
    assert.ok(source.includes(norm(item.purpose.text)), slug + ' purpose');
    assert.equal(item.composition.items.length, count);
    assert.equal(item.identity.isFormalManagementProduct, formal);
    for (const field of item.composition.items) assert.ok(source.includes(norm(field.label + '：' + field.text)), field.label);
    for (const [section, theoryKey, caseKey] of [['composition', 'label', 'label'], ['roles', 'name', 'relation'], ['lifecycle', 'processCode', 'processCode']]) {
        const theory = item[section].items.map(row => row[theoryKey]);
        const cases = item.caseView[section].items.map(row => row[caseKey]);
        assert.equal(JSON.stringify(theory), JSON.stringify(cases), slug + section);
        assert.equal(new Set(theory).size, theory.length);
    }
    console.log(`${slug}: ${count} fields; source fidelity and mapping PASS`);
}
for (const slug of ['quality-management-approach', 'work-package-description']) assert.ok(JSON.stringify(entries[slug].caseView).includes('拟稿'));
assert.ok(JSON.stringify(entries['quality-register'].caseView).includes('待复验'));
for (const file of ['assets/product-details-v2.js', 'assets/product-detail-v2.js', 'assets/product-workspace.js', 'chapters/appendix_a.html', 'chapters/ch08.html', 'chapters/glossary.html', 'entities/product-detail-v2.html', 'entities/product.html', 'cases/renovation.html', 'cases/risk-lessons-records.html']) {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(fs.readFileSync(path.join(root, file)));
    assert.ok(!text.includes('\uFFFD'), file);
}
console.log('PASS: draft boundaries and UTF-8');
