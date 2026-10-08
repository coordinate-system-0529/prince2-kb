// 管理展示数据、责任对应及引用检查，不替代浏览器和用户验收。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: { addEventListener() {} } };
for (const file of ['assets/product-details-v2.js', 'assets/product-management-usage.js']) vm.runInNewContext(read(file), context);
const usage = context.window.PRINCE2ProductManagementUsage;
const entries = context.window.PRINCE2_PRODUCT_DETAILS_V2.entries;
assert.equal(Object.keys(usage.configurations).length, 10);
let scenes = 0, steps = 0;
function checkSource(source) {
    const url = new URL(source.href, 'http://local/entities/product-detail-v2.html');
    const file = decodeURIComponent(url.pathname.slice(1));
    assert.ok(fs.existsSync(path.join(root, file)), source.href);
    if (url.hash) assert.ok(read(file).includes('id="' + decodeURIComponent(url.hash.slice(1)) + '"'), source.href);
}
for (const [slug, items] of Object.entries(usage.configurations)) {
    const entry = entries[slug];
    assert.ok(usage.supports(slug));
    assert.equal(items.length, entry.lifecycle.items.length, slug);
    assert.equal(entry.roles.items.length, entry.caseView.roles.items.length, slug);
    const order = usage.caseRoleOrder[slug] || entry.roles.items.map((_, index) => index);
    assert.equal(new Set(order).size, order.length, slug);
    assert.deepEqual(Array.from(entry.composition.items, field => field.label), Array.from(entry.caseView.composition.items, field => field.label), slug);
    for (const section of [entry.roles, entry.lifecycle]) (section.evidence || []).forEach(checkSource);
    for (const phase of entry.lifecycle.items) (phase.evidence || []).forEach(checkSource);
    items.forEach(item => {
        scenes++;
        assert.ok(item.name && item.state && item.steps.length);
        item.steps.forEach(step => {
            steps++;
            for (const field of ['theory', 'example', 'result', 'caseResult', 'recipient']) assert.ok(step[field], slug + ':' + field);
            step.actors.forEach(index => {
                assert.ok(entry.roles.items[index]);
                assert.ok(entry.caseView.roles.items[order[index]]);
            });
            step.fields.forEach(index => assert.ok(entry.composition.items[index - 1], slug + ':' + index));
            step.products.forEach(product => assert.ok(entries[product], product));
        });
    });
}
assert.deepEqual(Array.from(usage.caseRoleOrder['issue-register']), [0, 1, 3, 2]);
assert.ok(usage.configurations['issue-register'][3].steps[0].example.includes('尚无阶段边界审查记录'));
assert.ok(usage.configurations['issue-register'][4].steps[0].example.includes('当前无项目收尾或移交记录'));
assert.ok(!usage.supports('daily-log'));
assert.ok(!usage.supports('full-business-case'));
assert.equal(entries['quality-management-approach'].caseView.roles.items[1].description, '拟负责本方法批准。批准状态：待确认。');
for (const file of ['assets/product-management-usage.js', 'assets/product-management-usage.css', 'assets/product-details-v2.js', 'assets/product-detail-v2.js', 'assets/lesson-register.js', 'entities/product-detail-v2.html']) assert.ok(!read(file).includes('\uFFFD'), file);
console.log('PASS: 10 existing entries, ' + scenes + ' scenes, ' + steps + ' steps; field numbers, role/person mapping, source anchors and pending states');
