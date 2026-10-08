// 核验指引中的本地链接、锚点、参数路由和编码，不修改站点。
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = file => new TextDecoder('utf-8', { fatal: true }).decode(fs.readFileSync(path.join(root, file)));
const guide = read('doc/PRINCE2教材与案例对照学习指引.md');
assert.ok(!guide.includes('\uFFFD'));
assert.ok(!guide.includes('undefined'));
const links = [...guide.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map(match => match[1]);
const ids = new Set([...guide.matchAll(/<a id="([^"]+)">/g)].map(match => match[1]));
const requests = new Map();
const detailRoutes = new Set();
for (const href of links) {
    if (href.startsWith('#')) { assert.ok(ids.has(href.slice(1)), '指引内部锚点缺失：' + href); continue; }
    if (!href.startsWith('http')) { assert.ok(fs.existsSync(path.resolve(root, 'doc', href)), href); continue; }
    const url = new URL(href);
    assert.equal(url.origin, 'http://127.0.0.1:8000');
    const file = decodeURIComponent(url.pathname.slice(1));
    assert.ok(fs.existsSync(path.join(root, file)), '文件缺失：' + file);
    if (file.endsWith('.html') && url.hash) {
        const id = decodeURIComponent(url.hash.slice(1));
        const html = read(file);
        assert.ok(html.includes('id="' + id + '"') || html.includes("id='" + id + "'"), file + '#' + id);
    }
    if (file === 'entities/product-detail-v2.html') detailRoutes.add(url.searchParams.get('entry') + ':' + url.searchParams.get('mode'));
    url.hash = '';
    requests.set(url.href, file.endsWith('.pdf') ? 'HEAD' : 'GET');
}
assert.equal(detailRoutes.size, 72);
(async () => {
    const queue = [...requests];
    const failures = [];
    async function worker() {
        while (queue.length) {
            const [url, method] = queue.shift();
            try {
                const response = await fetch(url, { method, signal: AbortSignal.timeout(8000) });
                assert.equal(response.status, 200, url);
                if (method === 'GET') {
                    const body = new TextDecoder('utf-8', { fatal: true }).decode(await response.arrayBuffer());
                    assert.ok(!body.includes('\uFFFD'), url + ': 编码异常');
                }
            } catch (error) { failures.push(url + ': ' + error.message); }
        }
    }
    await Promise.all(Array.from({ length: 4 }, worker));
    assert.equal(failures.length, 0, failures.join('\n'));
    console.log(JSON.stringify({ markdownLinks: links.length, internalAnchors: ids.size, dualModeRoutes: detailRoutes.size,
        httpResources: requests.size, status: 'PASS', boundary: 'HTTP和锚点存在性检查，不等于浏览器PDF自动跳页或人工学习验收' }));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
