// 校验现行工作区入口使用同一版目录资源，避免正文已更新而目录仍读旧缓存。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const pages = [
    'entities/product.html', 'entities/product-detail-v2.html',
    'cases/renovation.html', 'cases/product-register.html',
    'cases/product-description-waterproofing.html', 'cases/project-brief.html',
    'cases/project-product-description.html', 'cases/risk-lessons-records.html',
    'cases/waterproof-quality-records.html'
];
const read = file => {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(fs.readFileSync(path.join(root, file)));
    assert.ok(!text.includes('\uFFFD'), file + ': invalid text');
    return text;
};
const versions = new Set();
const styleVersions = new Set(), libraryVersions = new Set(), sourceStyleVersions = new Set();
for (const file of pages) {
    const html = read(file);
    const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1]);
    const urls = scripts.map(src => new URL(src, 'http://local/' + file));
    const styles = [...html.matchAll(/<link\b[^>]*\bhref="([^"]+)"/g)].map(match => new URL(match[1], 'http://local/' + file));
    for (const url of styles.filter(url => url.pathname.endsWith('/product-workspace.css'))) styleVersions.add(url.searchParams.get('v'));
    for (const url of styles.filter(url => url.pathname.endsWith('/source-workspace.css'))) sourceStyleVersions.add(url.searchParams.get('v'));
    for (const url of urls.filter(url => url.pathname.endsWith('/case-library.js'))) libraryVersions.add(url.searchParams.get('v'));
    for (const asset of ['prince2-products.js', 'product-workspace.js']) {
        const matches = urls.filter(url => url.pathname.endsWith('/' + asset));
        assert.equal(matches.length, 1, file + ': missing or duplicate ' + asset);
        const version = matches[0].searchParams.get('v');
        assert.ok(version, file + ': unversioned ' + asset);
        versions.add(version);
    }
    assert.ok(urls.findIndex(url => url.pathname.endsWith('/prince2-products.js')) <
        urls.findIndex(url => url.pathname.endsWith('/product-workspace.js')), file + ': dependency order');
    for (const url of urls.filter(url => url.pathname.endsWith('/product-navigation-v2.js'))) {
        assert.ok(url.searchParams.get('v'), file + ': unversioned fallback navigation');
        versions.add(url.searchParams.get('v'));
    }
}
assert.equal(versions.size, 1, 'navigation dependency versions must match');
for (const [name, set] of [['workspace styles', styleVersions], ['case library', libraryVersions], ['source styles', sourceStyleVersions]]) {
    assert.equal(set.size, 1, name + ': inconsistent versions');
    assert.ok(!set.has(null), name + ': unversioned asset');
}
const context = { window: {} };
vm.runInNewContext(read('assets/prince2-products.js'), context);
const routes = context.window.PRINCE2_PRODUCT_ROUTES;
assert.equal(Object.keys(routes).length, 36);
const taxonomy = context.window.PRINCE2_PRODUCT_TAXONOMY;
for (const product of taxonomy.products) {
    assert.equal(routes[product.name], product.id);
    for (const name of product.components) assert.ok(routes[name], name + ': missing route');
}
assert.equal(taxonomy.products.filter(product => product.type === 'report').length, 7);
console.log('PASS: 9 entry pages, versioned navigation dependencies, 36 routes including all 7 reports and 4 plans');
