// 全站静态检查：现行页面、明确的制作旁白、共享样式接入及 UTF-8。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const excluded = new Set(['旧版', 'doc', 'tmp', 'output', '.playwright-cli', '.git', 'node_modules']);
function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => {
        if (excluded.has(item.name)) return [];
        const file = path.join(dir, item.name);
        return item.isDirectory() ? walk(file) : /\.html$/.test(file) ? [file] : [];
    });
}
const files = walk(root);
const browserAudit = fs.readFileSync(path.join(root, 'py/audit_site_presentation_browser.cjs'), 'utf8');
const forbidden = /不在这里假装|这一层保留家庭能够理解的语言|页面不提前替项目|这里只展示正式项目角色|先阅读三条记录|未改动旧版备份/;
const decoder = new TextDecoder('utf-8', { fatal: true });
for (const file of files) {
    const relative = path.relative(root, file).replaceAll('\\', '/');
    assert.ok(browserAudit.includes(JSON.stringify(relative)), relative + ': add to browser audit routes');
    const text = decoder.decode(fs.readFileSync(file));
    assert.ok(!text.includes('\uFFFD'), relative + ': invalid replacement character');
    if (!relative.startsWith('chapters/')) {
        const visible = text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ');
        assert.ok(!forbidden.test(visible), relative + ': production commentary');
    }
    if (relative.startsWith('cases/')) assert.ok(text.includes('case-responsive.css'), relative + ': missing shared layout');
}
for (const file of ['cases/case-responsive.css', 'assets/chapter-common.js', 'assets/chapter.css', 'assets/floating-toc.js']) {
    assert.ok(!decoder.decode(fs.readFileSync(path.join(root, file))).includes('\uFFFD'), file);
}
const localRules = path.resolve(root, 'AGENTS.md');
const rules = fs.existsSync(localRules) ? localRules : path.resolve(root, '..', 'AGENTS.md');
assert.ok(fs.existsSync(rules));
const ruleText = decoder.decode(fs.readFileSync(rules));
assert.ok(ruleText.includes('全站信息密度、折行与结构化展示'));
assert.ok(!ruleText.includes('\uFFFD'));
console.log('PASS: ' + files.length + ' active HTML files; copy guard, shared layout, project rules and UTF-8');
