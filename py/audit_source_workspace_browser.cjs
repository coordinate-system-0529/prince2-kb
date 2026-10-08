// Playwright CLI run-code：共用目录、原文件入口、证据身份和阅读位置。
async (page) => {
    await page.emulateMedia({media:'screen'});
    // 禁用 HTTP 缓存，避免已打开的原地址沿用修改前的文档。
    await page.route('**/*', route => route.continue());
    const base = 'http://127.0.0.1:8000/';
    const errors = [], resources = [], results = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) resources.push(response.url()); });
    page.on('requestfailed', request => { if (!request.url().endsWith('/favicon.ico')) resources.push(request.url() + ': ' + request.failure()?.errorText); });
    const check = (condition, message) => { if (!condition) throw new Error(message); };
    async function settleAnchor(id) {
        await page.waitForFunction(({ id, token }) => {
            const target = document.getElementById(id);
            if (!target) return false;
            const top = target.getBoundingClientRect().top;
            const previous = window.__sourceScrollAudit;
            const now = performance.now();
            if (!previous || previous.token !== token || Math.abs(previous.top - top) > 0.2) {
                window.__sourceScrollAudit = { token, top, since: now };
                return false;
            }
            return now - previous.since > 150;
        }, { id, token: Date.now() }, { polling: 'raf', timeout: 4000 });
    }
    const cases = [
        ['cases/product-register.html', 'product-register', '产品登记单', '案例原文件', 'update-04'],
        ['cases/project-brief.html', 'project-brief', '项目概述文件', '案例原文件', 'definition'],
        ['cases/project-brief.html#business-case', 'outline-business-case', '概要商业论证', '案例原文件', 'business-case'],
        ['cases/project-product-description.html', 'project-product-description', '项目产品描述', '案例原文件', 'composition'],
        ['cases/product-description-waterproofing.html', 'product-description', '产品描述', '案例原文件', 'current-event'],
        ['cases/waterproof-quality-records.html', 'quality-register', '质量登记单', '证据包', 'reinspection'],
        ['cases/risk-lessons-records.html#risk-register', 'risk-register', '风险登记单', '记录摘录', 'risk-register'],
        ['cases/risk-lessons-records.html#lessons-log', 'lessons-log', '经验教训记录单', '记录摘录', 'lessons-log']
    ];
    const treeState = () => page.locator('.workspace-tree').evaluate(tree => Array.from(tree.querySelectorAll('li')).map(li => ({ name: li.dataset.name, code: li.dataset.code, parent: li.parentElement.closest('li')?.dataset.name || li.closest('.workspace-group')?.dataset.expand, href: li.querySelector(':scope > a')?.href || '', status: li.querySelector(':scope > a .workspace-status, :scope > span .workspace-status')?.textContent || '' })));
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base + 'entities/product-detail-v2.html?entry=project-plan&mode=case&v=source-nav-1');
    await page.locator('#workspace-search-input').fill('');
    const canonical = await treeState();
    check(canonical.filter(item => item.href).length === 36, 'canonical case route count');
    for (const width of [1920, 1440, 1280, 1200, 1024, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        let referenceFrame;
        for (const [route, entry, name, kind] of cases) {
            await page.goto(base + route);
            if (width > 960) { await page.locator('#workspace-search-input').fill(''); }
            check(JSON.stringify(await treeState()) === JSON.stringify(canonical), 'tree differs ' + route);
            check(await page.locator('.workspace-mode-label').textContent() === kind, 'source identity ' + route);
            check(await page.locator('.workspace-tree [aria-current="page"]').count() === 1, 'current count ' + route);
            check(await page.locator('.workspace-tree [aria-current="page"] .workspace-name').textContent() === name, 'selection ' + route);
            for (const mode of ['theory', 'case']) {
                const link = new URL(await page.locator('[data-workspace-mode="' + mode + '"]').getAttribute('href'));
                check(link.pathname === '/entities/product-detail-v2.html' && link.searchParams.get('entry') === entry && link.searchParams.get('mode') === mode && !link.hash, 'mode target ' + route);
            }
            const metrics = await page.evaluate(() => {
                const main = document.getElementById('main-content').getBoundingClientRect();
                const ids = Array.from(document.querySelectorAll('[id]')).map(e => e.id);
                return { overflow: document.documentElement.scrollWidth - innerWidth, main: { left: main.left, width: main.width }, duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index) };
            });
            check(metrics.overflow <= 2, JSON.stringify({ route, width, metrics }));
            check(!metrics.duplicateIds.length, 'duplicate ids ' + route + JSON.stringify(metrics.duplicateIds));
            check(metrics.main.left >= 0 && metrics.main.left + metrics.main.width <= width + 2, 'main bounds ' + route);
            if (!referenceFrame) referenceFrame = metrics.main;
            check(Math.abs(metrics.main.left - referenceFrame.left) < 1 && Math.abs(metrics.main.width - referenceFrame.width) < 1,
                'source frame differs ' + JSON.stringify({route, width, referenceFrame, main: metrics.main}));
            if (width <= 960) {
                check(await page.locator('.workspace-sidebar').getAttribute('aria-hidden') === 'true', 'closed drawer');
                await page.getByRole('button', { name: '产品目录', exact: true }).click();
                check(await page.locator('#main-content').evaluate(e => e.inert), 'main inert');
            }
            await page.locator('#workspace-search-input').fill('无匹配项目');
            check(await page.locator('.workspace-empty').isVisible(), 'empty state');
            await page.locator('.workspace-clear').click();
            check(!await page.locator('.workspace-empty').isVisible(), 'clear search');
            if (width <= 960) {
                await page.keyboard.press('Escape');
                check(!await page.locator('#main-content').evaluate(e => e.inert), 'drawer close');
                check(await page.locator('.workspace-menu').evaluate(e => e === document.activeElement), 'restore focus');
            }
            results.push({ route, width, kind, entry, metrics });
        }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    const navigation = [];
    for (const [route, entry, , , anchor] of cases) {
        await page.goto(base + route.split('#')[0] + '#' + anchor);
        // 比较动画结束后的真实阅读位置，不使用固定延时猜测滚动是否结束。
        await settleAnchor(anchor);
        const target = page.locator('[id="' + anchor + '"]');
        const before = await target.evaluate(e => e.getBoundingClientRect().top);
        for (const mode of ['theory', 'case']) {
            await page.locator('[data-workspace-mode="' + mode + '"]').click();
            check(new URL(page.url()).searchParams.get('entry') === entry, 'entry click ' + route);
            check(new URL(page.url()).searchParams.get('mode') === mode, 'mode click ' + route);
            await page.goBack();
            await settleAnchor(anchor);
            const after = await target.evaluate(e => e.getBoundingClientRect().top);
            check(Math.abs(after - before) <= 3, 'reading position ' + JSON.stringify({ route, before, after }));
        }
        await page.locator('[data-source-return]').click();
        check(new URL(page.url()).searchParams.get('entry') === entry && new URL(page.url()).searchParams.get('mode') === 'case', 'back to product ' + route);
        navigation.push({ route, entry, anchor, before });
    }
    await page.goto(base + 'cases/project-brief.html#definition');
    await page.locator('a[href="#business-case"]').click();
    check(await page.locator('.workspace-tree [aria-current="page"] .workspace-name').textContent() === '概要商业论证', 'same document hash context');
    await page.goto(base + 'cases/risk-lessons-records.html#risk-register');
    await page.evaluate(() => { location.hash = 'lessons-log'; });
    await page.waitForFunction(() => document.body.dataset.workspaceCurrent === '经验教训记录单');
    const print = [];
    await page.emulateMedia({ media: 'print' });
    for (const [route, , , kind] of cases) {
        await page.goto(base + route);
        check(await page.locator('.workspace-tree li[data-name]').count() === 36, 'print route resources ' + route);
        check(!await page.locator('#workspace-navigation').isVisible(), 'printed navigation ' + route);
        check(await page.locator('#main-content').isVisible(), 'printed body ' + route);
        const left = await page.locator('#main-content').evaluate(e => e.getBoundingClientRect().left);
        check(Math.abs(left) < 2, 'printed sidebar gap ' + route);
        print.push({ route, kind, left });
    }
    await page.emulateMedia({ media: 'screen' });
    check(!errors.length, JSON.stringify(errors));
    check(!resources.length, JSON.stringify(resources));
    await page.unroute('**/*');
    return { layoutCount: results.length, navigationCount: navigation.length, printCount: print.length, results, navigation, print, errors, resources };
}
