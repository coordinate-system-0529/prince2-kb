const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {} };
vm.runInNewContext(read('assets/quality-register.js'), context);
const records = context.window.PRINCE2QualityRegister.records;
assert.equal(records.length, 2);
assert.equal(records[0].id, 'QA-WPF-01');
assert.equal(records[1].id, 'QA-WPF-02');
const labels = ['质量标识符', '产品标识符', '质量方法', '日期', '职责', '结果'];
for (const record of records) {
    assert.equal(JSON.stringify(record.fields.map(field => field[0])), JSON.stringify(labels));
    for (const label of labels.concat('记录')) {
        assert.ok(read('chapters/ch08.html').includes(label));
    }
    assert.ok(record.fields[0][1].includes('QL-017'));
    for (const [, href] of record.sources) {
        const [file, anchor] = href.split('#');
        const target = path.resolve(root, 'entities', file);
        assert.ok(target.startsWith(root + path.sep));
        assert.ok(fs.readFileSync(target, 'utf8').includes('id="' + anchor + '"'), href);
    }
}
assert.ok(records[0].status.startsWith('不通过'));
assert.ok(records[1].status.startsWith('待执行'));
assert.ok(records[0].product.endsWith('v1.0'));
assert.ok(records[1].product.endsWith('v1.1'));
for (const file of ['assets/quality-register.js', 'assets/lesson-register.js', 'entities/product-detail-v2.html']) {
    const content = new TextDecoder('utf-8', { fatal: true }).decode(fs.readFileSync(path.join(root, file)));
    assert.ok(!content.includes('\uFFFD'), file);
}
console.log('PASS: 2 quality records, 7 fields including source records, status/version boundaries, anchors and UTF-8');
