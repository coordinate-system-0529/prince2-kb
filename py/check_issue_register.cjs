// 问题登记单：原文字段、案例边界、来源入口与 UTF-8。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {} };
for (const file of ['assets/product-details-v2.js', 'assets/register-documents.js']) vm.runInNewContext(read(file), context);
const entry = context.window.PRINCE2_PRODUCT_DETAILS_V2.entries['issue-register'];
const document = context.window.PRINCE2RegisterDocuments['issue-register'];
const labels = ['问题标识符', '问题描述', '问题类型', '分级', '问题负责人', '状态', '问题相关日期', '记录'];
assert.equal(JSON.stringify(entry.composition.items.map(i => i.label)), JSON.stringify(labels));
assert.equal(JSON.stringify(entry.caseView.composition.items.map(i => i.label)), JSON.stringify(labels));
assert.equal(document.records, entry.caseRecords);
assert.equal(document.records.length, 1);
const record = document.records[0];
assert.equal(record.fields.length + 1, 8);
const manual = read('doc/prince2-7/pages/page-331.md').replace(/\s/g, '');
for (const field of entry.composition.items) assert.ok(manual.includes((field.label + '：' + field.text).replace(/\s/g, '')), field.label);
assert.ok(read('doc/prince2-7/pages/page-353.md').replace(/\s/g, '').includes(entry.definition.text));
assert.ok(read('doc/prince2-7/pages/page-206.md').replace(/\s/g, '').includes(entry.purpose.text));
const content = JSON.stringify(record);
for (const word of ['不合格项', '复验待执行', '未关闭', '待评定', '未注明年份', '决策', 'QA-WPF-02']) assert.ok(content.includes(word), word);
assert.ok(!content.includes('延期已经发生'));
const hrefs = [];
function collect(value) {
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
        if (['href', 'sourceHref'].includes(key)) hrefs.push(child);
        else collect(child);
    }
}
collect(entry);
hrefs.push(...record.sources.map(source => source[1]));
for (const href of hrefs) {
    const url = new URL(href, 'http://local/entities/product-detail-v2.html');
    const target = url.pathname.slice(1), html = read(target);
    const slug = url.searchParams.get('entry');
    if (slug) assert.ok(context.window.PRINCE2_PRODUCT_DETAILS_V2.entries[slug], href);
    const id = decodeURIComponent(url.hash.slice(1));
    if (id.startsWith('lesson-detail-')) {
        assert.ok(context.window.PRINCE2RegisterDocuments[slug].records.some(r => 'lesson-detail-' + r.id === id), href);
    } else if (id === 'entity-项目记录单' && target === 'entities/product.html') {
        assert.ok(read('assets/prince2-products.js').includes("detailId: 'entity-项目记录单'"));
        assert.ok(html.includes('product-workspace.js'));
    } else if (id) assert.ok(html.includes('id="' + id + '"'), href);
}
for (const mode of ['theory', 'case']) assert.ok(read('py/audit_site_presentation_browser.cjs').includes('entry=issue-register&mode=' + mode));
for (const file of ['assets/product-details-v2.js', 'assets/register-documents.js', 'assets/product-workspace.js', 'assets/product-detail-v2.js', 'assets/lesson-register.js', 'chapters/glossary.html', 'chapters/ch10.html', 'chapters/appendix_a.html']) {
    assert.ok(!new TextDecoder('utf-8', { fatal: true }).decode(fs.readFileSync(path.join(root, file))).includes('\uFFFD'), file);
}
console.log('PASS: issue register, 8 source-matched fields, 1 linked record, decisions, status boundaries and UTF-8');
