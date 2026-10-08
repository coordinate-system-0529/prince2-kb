// 校验矩阵覆盖、来源行、拟案标识与责任字母；视觉和交互另用浏览器检查。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: { addEventListener() {}, PRINCE2RegisterDocuments: {} } };
for (const name of ['product-details-v2', 'register-documents', 'product-management-usage', 'product-remaining-v2', 'product-remaining-cases', 'product-remaining-methods', 'product-remaining-runtime', 'product-raci']) {
    vm.runInNewContext(read('assets/' + name + '.js'), context, { filename: name });
}
const w = context.window, raci = w.PRINCE2ProductRaci;
const generic = Object.keys(w.PRINCE2ProductManagementUsage.configurations);
assert.equal(generic.length, 33);
assert.deepEqual(Object.keys(raci.mappings).sort(), generic.sort());
const normalize = html => html.replace(/<[^>]*>/g, '').replace(/\s/g, '');
let manualRows = 0, operationRows = 0;
for (const slug of generic) {
    assert.ok(w.PRINCE2_PRODUCT_DETAILS_V2.entries[slug].caseView);
    for (const id of raci.mappings[slug]) {
        assert.ok(raci.activities[id], slug + ':' + id);
        manualRows++;
    }
    for (const row of raci.profile(slug)) {
        assert.equal(row.provenance, 'project-synthesis');
        assert.ok(row.label && Number.isInteger(row.scene));
        assert.ok(row.scene < w.PRINCE2ProductManagementUsage.configurations[slug].length, slug + ': scene bounds');
        const codes = Object.values(row.assignments);
        assert.equal(codes.filter(code => code.includes('A')).length, 1, slug + ':' + row.label + ': single accountable role');
        assert.ok(codes.some(code => code.includes('R')), slug + ':' + row.label + ': responsible role');
        for (const code of codes) assert.match(code, /^(R|A|C|I|A\/R)$/);
        operationRows++;
    }
}
for (const [id, item] of Object.entries(raci.activities)) {
    assert.equal(item.raci.length, 8, id);
    assert.equal(item.provenance, 'manual-verbatim');
    const html = read('chapters/' + item.source.chapter + '.html');
    const start = html.indexOf('id="' + item.source.anchor + '"');
    assert.ok(start >= 0, id);
    const table = html.slice(start, html.indexOf('</table>', start) + 8);
    const rows = table.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) || [];
    const row = rows.find(row => normalize((row.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/) || [])[1] || '') === normalize(item.label));
    assert.ok(row, id + ': source activity');
    const values = [...row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].slice(1).map(match => normalize(match[1]));
    assert.deepEqual(values, Array.from(item.raci), id + ': source columns');
}
assert.deepEqual(Array.from(raci.activities['ip-pid'].raci), ['', 'C', 'C', 'C', 'A', 'C', 'C', 'R']);
assert.deepEqual(Array.from(raci.activities['cs-capture'].raci), ['', 'A', '', '', 'R¹', 'R²', 'C', 'C']);
assert.deepEqual(Array.from(raci.activities['cs-correct'].raci), ['', 'A', 'C', 'C', 'A¹/R³', 'R⁴', '', 'I']);
const html = read('entities/product-detail-v2.html');
assert.ok(html.includes('product-raci.css?v=raci-1'));
assert.ok(html.includes('product-raci.js?v=raci-records-2'));
assert.ok(html.includes('product-management-usage.js?v=acceptance-1'));
assert.ok(html.indexOf('product-raci.js') < html.indexOf('product-detail-v2.js'));
const script = read('assets/product-raci.js');
assert.ok(script.includes('产品操作 RACI · 非教材内容'));
assert.ok(script.includes('分工建议 · 非教材内容 · 教学案例拟案'));
assert.ok(script.includes('product-record:changed'));
assert.ok(script.includes('row.append(label)'));
for (const id of ['RISK-004', 'RISK-007', 'RISK-011']) {
    const owner = raci.riskRecordRole(id, 'owner', '风险负责人', 'case');
    const action = raci.riskRecordRole(id, 'action', '风险行动负责人', 'case');
    if (id === 'RISK-004') {
        assert.equal(owner.person, '陈默（拟任）');
        assert.equal(action.person, '陆明远（拟任）');
        assert.ok(owner.identity.includes('签认待确认'));
        assert.ok(action.identity.includes('签认待确认'));
    } else {
        assert.equal(owner.person, '待确认', id);
        assert.equal(action.person, '待确认', id);
        assert.equal(owner.identity, id);
        assert.equal(action.identity, id);
    }
    assert.equal(raci.riskRecordRole(id, 'owner', '风险负责人', 'theory').person, undefined);
}
assert.equal(raci.riskRecordRole('RISK-UNKNOWN', 'owner', '风险负责人', 'case').person, '待确认');
for (const file of ['assets/product-raci.js', 'assets/product-raci.css', 'assets/product-management-usage.js', 'entities/product-detail-v2.html', 'AGENTS.md']) assert.ok(!read(file).includes('\uFFFD'), file);
assert.equal(Object.keys(raci.activities).length, 43);
console.log('PASS: 33 new RACI entries, ' + manualRows + ' manual references, ' + operationRows + ' operation rows; 43 source activities, footnotes, single A, labels and UTF-8');
