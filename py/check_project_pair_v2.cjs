const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// 核验双模式字段映射、原文一致性及本轮文件编码。
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const normalize = text => text.replace(/\s/g, '');
const context = { window: {} };
vm.runInNewContext(read('assets/product-details-v2.js'), context);
const entries = context.window.PRINCE2_PRODUCT_DETAILS_V2.entries;
const results = [];
for (const [slug, page, glossaryPage, count] of [
    ['project-brief', 328, 354, 6],
    ['project-product-description', 334, 353, 7]
]) {
    const entry = entries[slug];
    const source = normalize(read(`doc/prince2-7/pages/page-${page}.md`));
    const glossary = normalize(read(`doc/prince2-7/pages/page-${glossaryPage}.md`));
    assert.ok(glossary.includes(normalize(entry.definition.text)), `${slug}: definition`);
    assert.ok(source.includes(normalize(entry.purpose.text)), `${slug}: purpose`);
    assert.equal(entry.composition.items.length, count);
    for (const item of entry.composition.items) {
        assert.ok(source.includes(normalize(item.label + '：' + item.text)), `${slug}: ${item.label}`);
    }
    for (const [section, theoryKey, caseKey] of [
        ['composition', 'label', 'label'], ['roles', 'name', 'relation'], ['lifecycle', 'processCode', 'processCode']
    ]) {
        const theory = entry[section].items.map(item => item[theoryKey]);
        const caseItems = entry.caseView[section].items.map(item => item[caseKey]);
        assert.equal(JSON.stringify(theory), JSON.stringify(caseItems), `${slug}: ${section} mapping`);
        assert.equal(new Set(theory).size, theory.length);
    }
    assert.ok(entry.roles.items.every(item => item.relation));
    assert.ok(entry.caseView.sourceNote.includes('虚构案例'));
    const pending = entry.caseView.lifecycle.items.find(item => item.processCode === (slug === 'project-brief' ? 'IP' : 'CP'));
    assert.ok(pending.description.includes(slug === 'project-brief' ? '将在启动阶段细化' : '不标记为已验收或已收尾'));
    results.push(`${slug}: ${count} fields, 3 roles, ${entry.lifecycle.items.length} lifecycle items`);
}
for (const file of ['assets/product-details-v2.js', 'assets/product-detail-v2.js', 'assets/product-workspace.js', 'chapters/appendix_a.html', 'chapters/glossary.html', 'entities/product-detail-v2.html', 'entities/product.html', 'cases/renovation.html']) {
    const bytes = fs.readFileSync(path.join(root, file));
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    assert.ok(!text.includes('\uFFFD'), `${file}: replacement character`);
}
console.log('PASS: source fidelity, mode mapping, lifecycle boundary and UTF-8\n' + results.join('\n'));
