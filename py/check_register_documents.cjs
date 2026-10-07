const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {} };
for (const file of ['cases/renovation-register-data.js', 'assets/register-documents.js']) {
    vm.runInNewContext(read(file), context);
}
const documents = context.window.PRINCE2RegisterDocuments;
const source = context.window.RENOVATION_PRODUCT_REGISTER.products;
const risks = documents['risk-register'].records;
const products = documents['product-register'].records;
const riskLabels = ['风险标识符', '风险描述', '概率', '影响', '临近度', '速度', '风险应对', '计划的剩余概率和影响', '风险负责人', '风险行动负责人', '风险相关日期'];
assert.equal(risks.length, 3);
assert.equal(products.length, source.length);
for (const risk of risks) {
    assert.equal(JSON.stringify(risk.fields.map(item => item[0])), JSON.stringify(riskLabels));
    const manualText = read('doc/prince2-7/pages/page-332.md').replace(/\s/g, '');
    for (const label of riskLabels.concat('记录')) assert.ok(manualText.includes(label), label);
}
products.forEach((product, i) => {
    assert.equal(product.id, source[i].id);
    assert.equal(product.summary[0], source[i].version);
    assert.equal(product.summary[2], source[i].status);
    assert.equal(product.fields.length + 1, 4);
    assert.equal(product.fields[1][1][0][1], source[i].descriptionApproved);
    assert.equal(product.fields[1][1][1][1], source[i].plannedAcceptance);
    assert.equal(product.fields[1][1][2][1], source[i].actualAcceptance === '空白' ? '未记录' : source[i].actualAcceptance);
    assert.equal(product.fields[2][1][2][1], source[i].result);
});
assert.ok(risks[1].summary[2].includes('复验待执行'));
assert.ok(risks[2].summary[2].includes('待核验'));
for (const record of risks.concat(products)) {
    for (const [, href] of record.sources) {
        const [route, anchor] = href.split('#');
        const target = path.resolve(root, 'entities', route.split('?')[0]);
        assert.ok(target.startsWith(root + path.sep));
        const content = fs.readFileSync(target, 'utf8');
        if (anchor && anchor.startsWith('product-title-')) {
            assert.ok(source.some(item => 'product-title-' + item.id === anchor));
            assert.ok(read('cases/product-register-case.js').includes('product-title-'));
        } else if (anchor) {
            assert.ok(content.includes('id="' + anchor + '"'), href);
        }
    }
}
for (const file of ['assets/register-documents.js', 'assets/lesson-register.js', 'assets/lesson-register.css', 'entities/product-detail-v2.html']) {
    const text = new TextDecoder('utf-8', {fatal:true}).decode(fs.readFileSync(path.join(root, file)));
    assert.ok(!text.includes('\uFFFD'), file);
}
console.log('PASS: 3 risk records with 12 fields; ' + products.length + ' products with 4 fields; source parity, links, boundaries and UTF-8');
