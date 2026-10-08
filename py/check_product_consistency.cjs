// 跨产品事实与状态复核，不把台账历史授权等同于独立拟稿签认。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: { addEventListener() {} } };
for (const file of ['assets/prince2-products.js', 'assets/product-details-v2.js', 'cases/renovation-register-data.js',
    'assets/register-documents.js', 'assets/business-case-document.js',
    'assets/project-plan-document.js', 'assets/product-management-usage.js',
    'assets/product-remaining-v2.js', 'assets/product-remaining-cases.js',
    'assets/product-remaining-methods.js', 'assets/product-remaining-runtime.js']) {
    vm.runInNewContext(read(file), context, { filename: file });
}
const { PRINCE2_PRODUCT_DETAILS_V2: catalog, RENOVATION_PRODUCT_REGISTER: register,
    PRINCE2RegisterDocuments: documents, PRINCE2BusinessCaseDocument: business,
    PRINCE2ProjectPlanDocument: plan, PRINCE2ProductManagementUsage: usage } = context.window;
assert.equal(Object.keys(catalog.entries).length, 36);
assert.strictEqual(plan.budget, business.budget, 'A1与A9共用预算，不能另建漂移的金额');
assert.equal(business.budget.reduce((sum, row) => sum + row[1], 0), 42);
assert.equal(business.budget.find(row => row[0] === '风险余量')[1], 5);
assert.equal(Math.max(...plan.schedule.map(row => row.end)), 16);
assert.ok(plan.metadata.find(row => row[0] === '审查／授权')[1].includes('待确认'));
assert.ok(business.metadata.find(row => row[0] === '批准／签认')[1].includes('批准待确认'));
assert.ok(business.metadata.find(row => row[0] === '版本／性质')[1].includes('拟稿'));
const renovation = read('cases/renovation.html');
assert.ok(renovation.includes('DOOR-018 等待排产'));
assert.ok(!renovation.includes('原厂家锁定排产并保留备选供应商'));
assert.ok(catalog.entries['full-business-case'].caseView.definition.text.includes('批准状态待确认'));
for (const entry of Object.values(catalog.entries)) {
    assert.equal(JSON.stringify(entry.composition.items.map(item => item.label)),
        JSON.stringify(entry.caseView.composition.items.map(item => item.label)), entry.slug + ': 字段映射');
}
const byId = Object.fromEntries(register.products.map(product => [product.id, product]));
assert.equal(register.products.length, 14);
const initial = usage.configurations['product-register'][0].steps[1];
assert.ok(!initial.caseResult.includes('14'), '当前总数不能冒充首批建单总数');
assert.ok(initial.caseResult.includes('首批') && initial.caseResult.includes('待确认'));
const nextStage = byId['MGT-004'];
assert.equal(nextStage.version, 'v0.1');
assert.equal(nextStage.status, '编制中');
assert.ok(nextStage.detail.history[0][0].includes('7'));
const supplementary = JSON.stringify(usage.configurations['product-register'][1]);
assert.ok(supplementary.includes(nextStage.id) && supplementary.includes(nextStage.version));
assert.ok(!supplementary.includes('尚无实际增补记录'));
const pid = byId['MGT-002'];
const transfer = usage.configurations['project-brief'][2].steps[0];
assert.ok(transfer.example.includes(pid.id) && transfer.example.includes(pid.version));
assert.ok(transfer.example.includes(pid.actualAcceptance) && transfer.example.includes(pid.result));
assert.ok(transfer.caseResult.includes(pid.status));
const waterproof = byId['WPF-011'];
assert.equal(waterproof.version, 'v1.1');
assert.equal(waterproof.status, '待复验');
assert.equal(waterproof.actualAcceptance, '空白');
assert.equal(waterproof.descriptionRef, 'PD-WPF-11');
assert.ok(catalog.entries['product-description'].caseView.definition.text.includes('文件 v1.0'));
assert.ok(JSON.stringify(documents['risk-register'].records.find(row => row.id === 'RISK-007')).includes('待复验'));
assert.ok(JSON.stringify(documents['issue-register'].records).includes('v1.1'));
for (const row of plan.schedule) {
    for (const id of row.products.match(/[A-Z]+-\d+/g) || []) assert.ok(byId[id], id + ': 进度表产品关联');
}
console.log('PASS: 36 field mappings; shared 42/5 budget and 16-week target; current/initial register counts; MGT-004 draft; MGT-002 historical authorization; waterproof baseline/product versions and pending acceptance');
