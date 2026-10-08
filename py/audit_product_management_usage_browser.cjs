// Playwright CLI run-code：十个已有产品的责任分工、流程使用及实际记录回归。
async (page) => {
    const errors = [], layouts = [], scenes = [], switches = [], records = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400 && response.url().startsWith('http://127.0.0.1:8000/') && !response.url().endsWith('/favicon.ico')) errors.push(response.status() + ' ' + response.url()); });
    const base = 'http://127.0.0.1:8000/entities/product-detail-v2.html?entry=';
    const check = (condition, message) => { if (!condition) throw new Error(message); };
    const slugs = ['product-register', 'product-description', 'project-brief', 'project-product-description', 'risk-register', 'issue-register', 'lessons-log', 'quality-register', 'quality-management-approach', 'work-package-description'];
    const counts = { 'product-register': 14, 'risk-register': 3, 'issue-register': 1, 'lessons-log': 3, 'quality-register': 2 };
    let nav;
    for (const width of [1920, 1440, 1280, 1200, 1024, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const slug of slugs) {
            for (const mode of ['theory', 'case']) {
                await page.goto(base + slug + '&mode=' + mode + '&v=management-1');
                await page.locator('#product-management-panel').waitFor({ state: 'attached' });
                const layout = await page.evaluate(() => ({
                    width: innerWidth, slug: document.body.dataset.workspaceEntry,
                    overflow: document.documentElement.scrollWidth - innerWidth,
                    inline: ['roles-section', 'lifecycle-section', 'case-section'].every(id => document.getElementById(id).parentElement.id === 'detail-content'),
                    roleCount: document.querySelectorAll('#product-duty-matrix tbody tr').length,
                    expectedRoles: window.PRINCE2_PRODUCT_DETAILS_V2.entries[document.body.dataset.workspaceEntry].roles.items.length,
                    navigation: [...document.querySelectorAll('.workspace-sidebar .workspace-leaf')].map(e => e.dataset.name),
                    tabCount: document.querySelectorAll('#product-management-usage [role="tab"]').length,
                    fields: [...document.querySelectorAll('.lesson-detail:not([hidden]) .lesson-record-fields dt')].map(e => e.textContent),
                    expectedFields: window.PRINCE2_PRODUCT_DETAILS_V2.entries[document.body.dataset.workspaceEntry].composition.items.map(e => e.label)
                }));
                check(layout.inline && layout.overflow <= 1 && layout.roleCount === layout.expectedRoles, JSON.stringify(layout));
                if (!nav) nav = layout.navigation;
                check(JSON.stringify(nav) === JSON.stringify(layout.navigation) && nav.length > 20, 'shared navigation');
                if (counts[slug] && mode === 'case') check(JSON.stringify(layout.fields) === JSON.stringify(layout.expectedFields), 'record field order ' + slug + ' ' + JSON.stringify(layout.fields));
                layouts.push({ width, slug, mode, rows: layout.roleCount, tabs: layout.tabCount, overflow: layout.overflow });
                for (let index = 0; index < layout.tabCount; index++) {
                    await page.locator('#product-management-tab-' + index).click();
                    const result = await page.evaluate(({ slug, mode, index }) => {
                        const config = window.PRINCE2ProductManagementUsage.configurations[slug][index], entry = window.PRINCE2_PRODUCT_DETAILS_V2.entries[slug];
                        const order = window.PRINCE2ProductManagementUsage.caseRoleOrder[slug] || entry.roles.items.map((_, index) => index);
                        const panel = document.getElementById('product-management-panel'), table = panel.querySelector('table');
                        const rows = [...table.tBodies[0].rows];
                        return {
                            width: innerWidth, slug, mode, index,
                            valid: rows.length === config.steps.length && rows.every((row, position) => {
                                const step = config.steps[position];
                                return row.cells.length === 5 && row.cells[3].textContent === (mode === 'case' ? step.example : step.theory) && step.actors.every(actor => row.cells[1].textContent.includes((mode === 'case' ? entry.caseView.roles.items[order[actor]] : entry.roles.items[actor]).name.split(' · ')[0]));
                            }),
                            columns: table.tHead.rows[0].cells.length,
                            stacked: getComputedStyle(table.tHead).display === 'none',
                            badAnchors: [...panel.querySelectorAll('a[data-material-field]')].filter(a => {
                                const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
                                return !target || !target.getBoundingClientRect().height;
                            }).map(a => a.href),
                            overflow: document.documentElement.scrollWidth - innerWidth,
                            clipped: [...document.querySelectorAll('#product-duty-matrix .plan-usage-person strong, #product-duty-matrix .plan-usage-person small, #product-management-panel .plan-usage-person strong, #product-management-panel .plan-usage-person small')].filter(e => e.scrollWidth > e.getBoundingClientRect().width + 1).map(e => e.textContent)
                        };
                    }, { slug, mode, index });
                    check(result.valid && result.columns === 5 && !result.badAnchors.length && !result.clipped.length && result.overflow <= 1, JSON.stringify(result));
                    check(result.stacked === (width <= 1200), 'column mode'); scenes.push(result);
                    if (mode === 'case' && [1440, 390].includes(width) && ['product-description', 'issue-register', 'lessons-log'].includes(slug) && index === 1) {
                        await page.locator('#product-management-usage').scrollIntoViewIfNeeded();
                        await page.screenshot({ path: 'output/playwright/' + slug + '-management-' + width + '.png' });
                    }
                }
                await page.locator('#product-management-usage [aria-selected="true"]').focus();
                await page.keyboard.press('Home'); check(await page.locator('#product-management-tab-0').getAttribute('aria-selected') === 'true', 'Home');
                await page.keyboard.press('ArrowRight'); check(await page.locator('#product-management-tab-1').getAttribute('aria-selected') === 'true', 'ArrowRight');
            }
        }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const slug of slugs) {
        await page.goto(base + slug + '&mode=case&v=management-1');
        await page.locator('#product-management-tab-1').click();
        await page.evaluate(() => window.scrollBy(0, document.getElementById('lifecycle-section').getBoundingClientRect().top - 110));
        const before = await page.locator('#product-management-panel').evaluate(e => e.getBoundingClientRect().top);
        const origin = await page.evaluate(() => performance.timeOrigin);
        await page.locator('[data-workspace-mode="theory"]').click();
        await page.waitForFunction(() => document.body.dataset.activeDetailMode === 'theory');
        await page.waitForTimeout(100);
        const theory = await page.locator('#product-management-panel').evaluate(e => e.getBoundingClientRect().top);
        await page.locator('[data-workspace-mode="case"]').click();
        await page.waitForFunction(() => document.body.dataset.activeDetailMode === 'case');
        await page.waitForTimeout(100);
        const after = await page.locator('#product-management-panel').evaluate(e => e.getBoundingClientRect().top);
        const selected = await page.locator('#product-management-tab-1').getAttribute('aria-selected');
        check(selected === 'true' && Math.abs(theory - before) <= 2 && Math.abs(after - before) <= 2, 'mode position ' + JSON.stringify({ slug, before, theory, after }));
        check(origin === await page.evaluate(() => performance.timeOrigin), 'mode reload');
        switches.push({ slug, before, theory, after });
        await page.reload(); check(await page.locator('#product-management-tab-1').getAttribute('aria-selected') === 'true', 'refresh scene');
        const material = page.locator('#product-management-panel a[data-material-field]').first();
        const hash = await material.getAttribute('href'); await material.click();
        const target = page.locator('[id="' + decodeURIComponent(hash.slice(1)) + '"]');
        const top = await target.evaluate(e => e.getBoundingClientRect().top);
        check(top >= 0 && top < 1000, 'material scroll ' + slug + ':' + top);
    }
    for (const slug of Object.keys(counts)) {
        await page.goto(base + slug + '&mode=case&v=management-1');
        check(await page.locator('.lesson-summary-row').count() === counts[slug], 'record count ' + slug);
        const ids = await page.locator('.lesson-summary-row').evaluateAll(rows => rows.map(row => row.dataset.recordId));
        if (ids.length > 1) await page.locator('.lesson-summary-row[data-record-id="' + ids[1] + '"] button').click();
        const href = await page.locator('#product-management-panel a[data-material-field]').first().getAttribute('href');
        check(href.includes(ids[ids.length > 1 ? 1 : 0]), 'selected record material ' + slug);
        await page.goto(base + slug + '&mode=case&v=management-1' + href);
        check(await page.locator('.lesson-summary-row.is-selected').getAttribute('data-record-id') === ids[ids.length > 1 ? 1 : 0], 'deep linked record');
        await page.locator('.lesson-help-button').click();
        check(await page.locator('#lesson-help-title').innerText() === (slug === 'lessons-log' ? '案例解读' : '字段说明'), 'help title');
        check(await page.locator('#lesson-help-dialog #roles-section').count() === 0 && await page.locator('#lesson-help-dialog #lifecycle-section').count() === 0, 'inline management outside help');
        await page.locator('.lesson-help-close').click();
        if (slug === 'lessons-log') {
            check(await page.locator('.lesson-detail .lesson-journey').count() === 3, 'three individual histories');
            await page.locator('#detail-view-toolbar a[href="#definition-section"]').click();
            check(await page.locator('#lesson-help-title').innerText() === '字段说明', 'lesson theory help');
            await page.locator('.lesson-help-close').click();
            await page.locator('.lesson-help-button').click(); check(await page.locator('#lesson-help-title').innerText() === '案例解读', 'restore interpretation'); await page.locator('.lesson-help-close').click();
        }
        await page.emulateMedia({ media: 'print' });
        check(await page.locator('#product-management-usage').evaluate(e => e.getBoundingClientRect().height === 0), 'print management hidden');
        const visible = await page.locator('.lesson-detail').evaluateAll(rows => rows.filter(e => e.getBoundingClientRect().height > 0).length);
        check(visible === counts[slug], 'print all records ' + slug); records.push({ slug, count: visible });
        await page.emulateMedia({ media: 'screen' });
    }
    check(!errors.length, JSON.stringify(errors));
    return { layouts: layouts.length, scenes: scenes.length, switches, records, errors };
}
