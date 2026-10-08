const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {}, sessionStorage: { getItem: () => null } };
vm.runInNewContext(read('assets/prince2-products.js'), context);
vm.runInNewContext(read('assets/product-details-v2.js'), context);
vm.runInNewContext(read('assets/lesson-register.js'), context);
vm.runInNewContext(read('cases/renovation-register-data.js'), context);
vm.runInNewContext(read('assets/quality-register.js'), context);
vm.runInNewContext(read('assets/register-documents.js'), context);
vm.runInNewContext(read('assets/business-case-document.js'), context);
vm.runInNewContext(read('assets/project-plan-document.js'), context);
context.window.addEventListener = () => {};
for (const file of ['assets/project-plan-usage.js', 'assets/business-case-usage.js', 'assets/product-management-usage.js']) vm.runInNewContext(read(file), context);
for (const file of ['assets/product-remaining-v2.js', 'assets/product-remaining-cases.js', 'assets/product-remaining-methods.js', 'assets/product-remaining-runtime.js']) vm.runInNewContext(read(file), context);
// 只拦截已确认的制作旁白，不按“本页”“以下”“待确认”等词机械删除。
const forbidden = /不编造|不补造|不虚构|不伪造|不写成|不能写成|本次教学|本次归纳|未改动旧版|迁移稿|教学映射|先阅读三条|仅清理原文/;
function check(value, location) {
    if (typeof value === 'string') assert.ok(!forbidden.test(value), location + ': ' + value);
    else if (value && typeof value === 'object') {
        for (const [key, item] of Object.entries(value)) check(item, location + '.' + key);
    }
}
const entries = context.window.PRINCE2_PRODUCT_DETAILS_V2.entries;
check(entries, 'entries');
check(context.window.PRINCE2LessonRegister.records, 'lessonRecords');
check(context.window.PRINCE2QualityRegister, 'qualityRecords');
check(context.window.PRINCE2RegisterDocuments, 'registerDocuments');
check(context.window.PRINCE2ProjectPlanDocument, 'projectPlanDocument');
check(context.window.PRINCE2ProjectPlanUsage.scenes, 'projectPlanUsage');
check(context.window.PRINCE2BusinessCaseUsage.scenes, 'businessCaseUsage');
check(context.window.PRINCE2ProductManagementUsage.configurations, 'productManagementUsage');
check(context.window.PRINCE2RemainingProducts.papers, 'remainingProductDocuments');
for (const entry of Object.values(entries)) {
    assert.ok(entry.definition.sourceHref && entry.purpose.sourceHref, entry.slug);
    assert.ok(entry.caseView, entry.slug);
}
for (const file of ['assets/product-details-v2.js', 'assets/lesson-register.js', 'assets/product-detail-v2.js', 'entities/product-detail-v2.html', 'cases/risk-lessons-records.html', 'cases/waterproof-quality-records.html']) {
    const content = new TextDecoder('utf-8', { fatal: true }).decode(fs.readFileSync(path.join(root, file)));
    assert.ok(!content.includes('\uFFFD'), file);
    if (file.startsWith('cases/')) check(content, file);
}
console.log('PASS: ' + Object.keys(entries).length + ' product entries, lesson records, source links, copy guard and UTF-8');
