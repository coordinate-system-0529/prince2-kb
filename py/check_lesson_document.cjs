const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {}, sessionStorage: { getItem: () => null } };
vm.runInNewContext(read('assets/lesson-register.js'), context);
const records = context.window.PRINCE2LessonRegister.records;
assert.equal(records.length, 3);
assert.equal(JSON.stringify(records.map(row => row.id)), JSON.stringify(['LES-001', 'LES-002', 'LES-003']));
for (const record of records) {
    for (const key of ['title', 'type', 'priority', 'severity', 'owner', 'status', 'responsibility', 'history', 'missing']) {
        assert.ok(typeof record[key] === 'string' && record[key].length, record.id + key);
    }
    assert.equal(record.description.length, 5);
    assert.equal(record.dates.length, 4);
    assert.ok(record.status.includes('待核验'));
    assert.ok(record.sources.length);
    assert.ok(record.journey.length >= 5, record.id + ': journey');
    assert.ok(record.interpretation.length >= 2, record.id + ': interpretation');
    for (const step of record.journey) {
        assert.equal(step.length, 6);
        for (const value of step.slice(0, 5)) assert.ok(typeof value === 'string' && value.length);
        if (step[5]) {
            const [route, anchor] = step[5][1].split('#');
            const file = path.resolve(root, 'entities', route);
            assert.ok(file.startsWith(root + path.sep));
            assert.ok(fs.readFileSync(file, 'utf8').includes('id="' + anchor + '"'), step[5][1]);
        }
    }
    assert.ok(record.journey.at(-1)[4].includes('待记录'));
    for (const [, href] of record.sources) {
        const file = path.resolve(root, 'entities', href.split('#')[0]);
        assert.ok(file.startsWith(root + path.sep));
        assert.ok(fs.existsSync(file), href);
    }
}
const source = read('doc/prince2-7/pages/page-331.md');
for (const field of ['经验教训标识符', '经验教训描述', '经验教训类型', '经验教训负责人', '分级', '状态', '经验教训相关日期', '记录']) {
    assert.ok(source.includes(field));
    assert.ok(read('assets/lesson-register.js').includes('field(list, "' + field + '"'));
}
for (const file of ['assets/lesson-register.js', 'assets/lesson-register.css', 'assets/product-detail-v2.js', 'assets/product-details-v2.js', 'entities/product-detail-v2.html']) {
    const content = new TextDecoder('utf-8', { fatal: true }).decode(fs.readFileSync(path.join(root, file)));
    assert.ok(!content.includes('\uFFFD'), file);
}
console.log('PASS: 3 records, 8 standard fields, individual journeys and interpretations, local sources and UTF-8');
