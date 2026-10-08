const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: { addEventListener() {} } };
for (const file of ['assets/prince2-products.js', 'assets/product-details-v2.js',
    'cases/renovation-register-data.js', 'assets/register-documents.js', 'assets/product-management-usage.js',
    'assets/product-remaining-v2.js', 'assets/product-remaining-cases.js',
    'assets/product-remaining-methods.js', 'assets/product-remaining-runtime.js']) {
    vm.runInNewContext(read(file), context, { filename: file });
}
vm.runInNewContext(read('assets/business-case-document.js'), context);
const data = context.window.PRINCE2BusinessCaseDocument;
const entry = context.window.PRINCE2_PRODUCT_DETAILS_V2.entries['full-business-case'];
assert.equal(entry.composition.items.length, 10);
assert.deepEqual(Array.from(entry.caseView.composition.items, item => item.label), Array.from(entry.composition.items, item => item.label));
assert.equal(data.budget.reduce((sum, row) => sum + row[1], 0), 42);
assert.equal(data.budget.find(row => row[0] === '风险余量')[1], 5);
assert.ok(data.metadata.some(row => row[1].includes('教学虚构')));
const source = read('assets/business-case-document.js');
for (const label of ['资金安排', '收益容许偏差', '运行维护成本', '签认资料', '净现值、回收期和投资回报率未计算']) assert.ok(source.includes(label), label);
assert.ok(data.metadata.some(row => row[1].includes('v1.0 拟稿')));
assert.ok(data.metadata.some(row => row[1].includes('批准待确认')));
assert.ok(source.includes('entry=benefits-management-approach&mode=case'));
assert.ok(source.includes('entry=sustainability-management-approach&mode=case'));
for (const file of ['assets/business-case-document.js', 'assets/business-case-document.css', 'assets/lesson-register.js', 'entities/product-detail-v2.html']) {
    assert.ok(!read(file).includes('\uFFFD'), file);
}
for (const match of source.matchAll(/"((?:\.\.\/cases\/|product-detail-v2\.html)[^"]+)"/g)) {
    const url = new URL(match[1], 'http://local/entities/product-detail-v2.html');
    const target = path.join(root, decodeURIComponent(url.pathname));
    assert.ok(fs.existsSync(target), match[1]);
    if (url.hash) assert.ok(fs.readFileSync(target, 'utf8').includes('id="' + decodeURIComponent(url.hash.slice(1)) + '"'), match[1]);
    if (url.searchParams.has('entry')) assert.ok(context.window.PRINCE2_PRODUCT_DETAILS_V2.entries[url.searchParams.get('entry')], match[1]);
}
console.log('PASS: 10 matching chapters; budget 42 including reserve 5; missing-data boundaries; links and UTF-8');
