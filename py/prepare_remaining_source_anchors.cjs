// 输出仅增加定位包裹的补丁。正文逐字保留，写入由apply_patch完成。
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {} };
for (const file of ['assets/product-details-v2.js', 'assets/product-remaining-v2.js']) vm.runInNewContext(read(file), context);
const changed = new Map();
const plain = text => text.replace(/<[^>]+>/g, '').replace(/\s+/g, '');
if (process.argv.includes('--repair')) {
    const files = new Set(Object.values(context.window.PRINCE2RemainingProducts.source).flatMap(spec => [spec.chapter,
        spec.definitionPage >= 346 ? 'glossary' : [127,128].includes(spec.definitionPage) ? 'ch07' : [329,330].includes(spec.definitionPage) ? 'appendix_a' : spec.chapter]));
    for (const chapter of files) {
        const file = 'chapters/' + chapter + '.html';
        let html = read(file), previous;
        do { previous = html; html = html.replace(/<span id="source-remaining-[^"]+" class="source-reference-target">([^<>]*)<\/span>/g, '$1'); } while (html !== previous);
        changed.set(file, html.replace(/<span id="source-remaining-[^"]+" class="def-term source-reference-target">/g, '<span class="def-term">'));
    }
}
function blocks(html) {
    const stack = [], matches = [];
    for (const token of html.matchAll(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi)) {
        const tag = token[1].toLowerCase();
        if (token[0].startsWith('</')) {
            const position = stack.findLastIndex(item => item.tag === tag);
            if (position < 0) continue;
            const start = stack[position].start; stack.length = position;
            if (['p','li','div'].includes(tag)) matches.push({index:start, html:html.slice(start, token.index + token[0].length)});
        } else if (!['img','br','hr','input','meta','link','wbr'].includes(tag) && !token[0].endsWith('/>')) stack.push({tag,start:token.index});
    }
    return matches.sort((a,b) => a.html.length-b.html.length);
}
for (const spec of Object.values(context.window.PRINCE2RemainingProducts.source)) {
    for (const type of ['definition', 'purpose']) {
        const chapter = type === 'purpose' ? spec.chapter : spec.definitionPage >= 346 ? 'glossary' :
            [127, 128].includes(spec.definitionPage) ? 'ch07' : [329, 330].includes(spec.definitionPage) ? 'appendix_a' : spec.chapter;
        const file = 'chapters/' + chapter + '.html', id = 'source-remaining-' + spec.slug + '-' + type;
        const old = changed.get(file) || read(file);
        if (old.includes('id="' + id + '"')) continue;
        const paragraphs = blocks(old);
        let prefix = plain(spec[type]).slice(0, 15);
        let target = paragraphs.find(match => plain(match.html).includes(prefix));
        if (!target) { prefix = plain(spec[type]).slice(0, 8); target = paragraphs.find(match => plain(match.html).includes(prefix)); }
        const namedFallback = !target && type === 'definition';
        if (namedFallback) target = paragraphs.findLast(match => plain(match.html).includes(spec.name));
        if (!target) throw new Error(file + ': cannot locate ' + spec.name);
        const tokens = Array.from(target.html.matchAll(/>([^<>]+)</g));
        let textToken = namedFallback ? tokens.findLast(match => match[1].includes(spec.name)) : tokens.find(match => plain(match[1]).includes(prefix)) || tokens.find(match => match[1].includes(spec.name));
        if (!textToken) textToken = tokens.find(match => match[1].trim());
        if (!textToken) throw new Error(file + ': no text ' + id);
        const text = textToken[1], keyword = text.includes(spec.name) ? spec.name : text.trim().slice(0, 20);
        const start = target.index + textToken.index + 1 + text.indexOf(keyword);
        const replacement = '<span id="' + id + '" class="source-reference-target">' + keyword + '</span>';
        const next = old.slice(0, start) + replacement + old.slice(start + keyword.length);
        if (plain(old) !== plain(next)) throw new Error(id + ': source text changed');
        changed.set(file, next);
    }
}
let patch = '*** Begin Patch\n';
let selected = false;
for (const [file, content] of changed) {
    const before = read(file).split(/\r?\n/), after = content.split(/\r?\n/);
    if (before.length !== after.length) throw new Error('source line count changed');
    if (before.every((line, index) => line === after[index])) continue;
    if (selected && process.argv.includes('--first')) break;
    patch += '*** Update File: ' + path.join(root, file).replaceAll('\\', '/') + '\n';
    for (let index = 0; index < before.length; index++) {
        if (before[index] !== after[index]) {
            patch += '@@\n-' + before[index] + '\n+' + after[index] + '\n';
            selected = true;
            if (process.argv.includes('--first')) break;
        }
    }
}
console.log(selected ? patch + '*** End Patch' : 'NO_CHANGES');
