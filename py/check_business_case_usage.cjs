// 核对商业论证管理展示的数据、引用及边界，不替代浏览器排版验收。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: { addEventListener() {} } };
for (const file of ['assets/product-details-v2.js', 'assets/business-case-usage.js']) vm.runInNewContext(read(file), context);
const usage = context.window.PRINCE2BusinessCaseUsage;
const entries = context.window.PRINCE2_PRODUCT_DETAILS_V2.entries;
assert.equal(usage.roles.length, 8);
assert.deepEqual(Array.from(usage.roles, row => row.person), ['授权主体待确认', '周诚', '林悦', '陆明远', '陈默', '宋妍／赵建国', '王志衡', '许静']);
assert.deepEqual(Array.from(usage.activities['outline-business-case'][0].raci), ['C', 'A/R', 'C³', 'C³', 'R', '', '', '']);
assert.deepEqual(Array.from(usage.activities['full-business-case'][0].raci), ['', 'A', 'C', 'C', 'R', 'C', 'C', 'I']);
function checkHref(href) {
    const url = new URL(href, 'http://local/entities/product-detail-v2.html');
    const file = decodeURIComponent(url.pathname.slice(1));
    assert.ok(fs.existsSync(path.join(root, file)), href);
    if (url.hash) {
        const hash = decodeURIComponent(url.hash.slice(1));
        const dynamicLog = file === 'entities/product.html' && hash === 'entity-日志' && read('assets/prince2-products.js').includes("components: ['日志'") && read('assets/product-workspace.js').includes("'<li id=\"entity-'");
        assert.ok(dynamicLog || read(file).includes('id="' + hash + '"'), href);
    }
    if (url.searchParams.has('entry')) assert.ok(entries[url.searchParams.get('entry')], href);
}
for (const slug of ['outline-business-case', 'full-business-case']) {
    assert.equal(usage.scenes[slug].length, slug === 'outline-business-case' ? 3 : 6);
    assert.equal(usage.activities[slug].length, slug === 'outline-business-case' ? 2 : 7);
    assert.equal(entries[slug].composition.items.length, 10);
    assert.deepEqual(Array.from(entries[slug].caseView.composition.items, item => item.label), Array.from(entries[slug].composition.items, item => item.label));
    for (const activity of usage.activities[slug]) {
        assert.equal(activity.raci.length, 8);
        assert.equal(activity.raci.filter(value => value.includes('A')).length, 1, activity.label);
        assert.ok(usage.scenes[slug].some(scene => scene.id === activity.scene), activity.label);
        checkHref(activity.source[1]);
    }
    for (const scene of usage.scenes[slug]) {
        checkHref(scene.source[1]);
        assert.ok(scene.steps.length >= 2 && scene.steps.length <= 3);
        assert.ok(scene.trigger && scene.caseTrigger && scene.state && scene.output);
        for (const item of scene.steps) {
            assert.ok(item.theory && item.example && item.result && item.recipient);
            item.actor.forEach(index => assert.ok(usage.roles[index]));
            item.materials.forEach(material => {
                assert.ok(material.label);
                if (material.field) assert.ok(entries[slug].composition.items[material.field - 1]);
                else if (material.slug === 'daily-log') checkHref('product.html#entity-日志');
                else assert.ok(entries[material.slug], material.slug);
            });
        }
    }
}
const source = read('assets/business-case-usage.js');
for (const label of ['签认资料待补', '批准凭据待补', '资源承诺', '项目后', '日志 · 待补', 'C³']) assert.ok(source.includes(label), label);
for (const file of ['assets/business-case-usage.js', 'assets/project-plan-usage.css', 'assets/lesson-register.js', 'assets/product-detail-v2.js', 'entities/product-detail-v2.html']) assert.ok(!read(file).includes('\uFFFD'), file);
assert.ok(read('entities/product-detail-v2.html').includes('business-case-usage.js?v=navigation-1'));
console.log('PASS: two business-case entries; eight bound roles; nine activities; nine scenarios; materials, source anchors, pending states and UTF-8');
