// 原文件正文、共用导航接入及保护文件检查。此脚本只读，不生成或覆盖页面。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const files = ['product-register', 'project-brief', 'project-product-description', 'product-description-waterproofing', 'waterproof-quality-records'];
const normalize = text => text.replace(/\r\n/g, '\n');
const decoder = new TextDecoder('utf-8', { fatal: true });
for (const name of files) {
    const relative = 'cases/' + name + '.html';
    const current = normalize(decoder.decode(fs.readFileSync(path.join(root, relative))));
    const original = normalize(cp.execFileSync('git', ['show', 'HEAD:' + relative], { cwd: root, encoding: 'utf8' }));
    // 标题只增加按语义换行的包裹，正文文字仍逐字对比。
    const body = text => text.slice(text.indexOf('        <section'), text.indexOf('    </main>'))
        .replace('<h3><span class="source-title-part">保留防水失败结果</span><span class="source-title-part">并安排复验</span></h3>',
            '<h3>保留防水失败结果并安排复验</h3>');
    const oldBody = body(original).replace('<a href="../entities/product.html#entity-项目概述文件">定位理论条目</a>',
        '<a href="../entities/product-detail-v2.html?entry=project-brief&amp;mode=theory">项目概述文件理论</a>')
        .replace('<a href="../entities/product-detail-v2.html?entry=product-register">查看理论知识</a>',
            '<a href="../entities/product-detail-v2.html?entry=product-register&amp;mode=theory">产品登记单理论</a>');
    assert.equal(body(current), oldBody, relative + ': document body changed');
    assert.ok(current.includes('data-workspace-source='), relative);
    assert.ok(current.includes('source-workspace.css'), relative);
    assert.ok(current.indexOf('prince2-products.js') < current.indexOf('product-workspace.js'), relative + ': taxonomy order');
    assert.ok(current.indexOf('product-workspace.js') < current.indexOf('case-library.js'), relative + ': context order');
    assert.equal((current.match(/id="main-content"/g) || []).length, 1, relative);
    assert.ok(!current.includes('\uFFFD'), relative);
}
const risk = normalize(fs.readFileSync(path.join(root, 'cases/risk-lessons-records.html'), 'utf8'));
const oldRisk = normalize(cp.execFileSync('git', ['show', 'HEAD:cases/risk-lessons-records.html'], { cwd: root, encoding: 'utf8' }));
assert.equal(risk.slice(risk.indexOf('        <section'), risk.indexOf('        <footer')),
    oldRisk.slice(oldRisk.indexOf('        <section'), oldRisk.indexOf('        <footer')), 'risk and lesson source records changed');
const protectedFiles = {
    'graph-full.html': 'CCA2AA6E0086BA25D7635E71CC152128534C13BA6731A8025B8CEEB2A9F09496',
    'cases/renovation-register-data.js': '057C1FADE4B3D24510387BDDCB223C5E469FB07C5EE4F9E6405D01CD62EF0A25',
    'assets/register-documents.js': 'E4F5507CC69D1FC286B4DA0FAAF7C7EF5A4E4C2FF108D3D650FDE3E7EE342C93',
    'assets/project-plan-usage.js': '6848340D6310D141909CAB4AB325D4AC0F33801628E8471EDFBF42A73316045B',
    'assets/business-case-usage.js': '3BCD879A2ADBA57DAB90C9A02EB933BF632FEDDDB218AEE5A4DEB9E3A88C7E52'
};
for (const [relative, hash] of Object.entries(protectedFiles)) {
    let content = fs.readFileSync(path.join(root, relative));
    if (['assets/project-plan-usage.js', 'assets/business-case-usage.js'].includes(relative)) {
        // 导航修复只新增阅读意图重置接口，除此之外保留原脚本快照。
        content = Buffer.from(content.toString('utf8').replace(/^        resetReadingIntent: function \(\) \{ readingScene = false; \},\r?\n/m, ''), 'utf8');
    }
    assert.equal(crypto.createHash('sha256').update(content).digest('hex').toUpperCase(), hash, relative);
}
for (const relative of ['cases/case-library.js', 'cases/source-workspace.css', 'assets/product-workspace.js', 'cases/risk-lessons-records.html']) {
    assert.ok(!decoder.decode(fs.readFileSync(path.join(root, relative))).includes('\uFFFD'), relative);
}
console.log('PASS: six source document bodies preserved; shared navigation order, UTF-8 and five protected files');
