// Playwright CLI run-code：两种商业论证、双模式、全部管理场景与共享回归。
async (page) => {
    const errors = [], results = [], sceneChecks = [], switches = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400 && response.url().startsWith('http://127.0.0.1:8000/')) errors.push(response.status() + ' ' + response.url()); });
    const base = 'http://127.0.0.1:8000/entities/product-detail-v2.html?entry=';
    const check = (condition, message) => { if (!condition) throw new Error(message); };
    let navNames;
    for (const width of [1920, 1440, 1280, 1200, 1024, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const slug of ['outline-business-case', 'full-business-case']) {
            for (const mode of ['theory', 'case']) {
                await page.goto(base + slug + '&mode=' + mode + '&v=business-usage-1');
                await page.locator('#business-usage-panel').waitFor({ state: 'attached' });
                const layout = await page.evaluate(() => ({
                    width: innerWidth, mode: new URLSearchParams(location.search).get('mode'), slug: document.body.dataset.workspaceEntry,
                    overflow: document.documentElement.scrollWidth - innerWidth,
                    matrixRows: document.querySelectorAll('#business-usage-matrix tbody tr').length,
                    matrixColumns: document.querySelectorAll('#business-usage-matrix thead th').length,
                    roleInline: document.getElementById('roles-section').parentElement.id === 'detail-content',
                    flowInline: document.getElementById('lifecycle-section').parentElement.id === 'detail-content',
                    nav: [...document.querySelectorAll('.workspace-sidebar .workspace-leaf')].map(e => e.dataset.name),
                    originalRoleHidden: document.querySelector('#roles-section .role-table-wrap').hidden,
                    paperChapters: [...document.querySelectorAll('.business-chapter')].filter(e => e.getBoundingClientRect().height).length
                }));
                check(layout.overflow <= 1 && layout.roleInline && layout.flowInline && layout.originalRoleHidden, JSON.stringify(layout));
                check(layout.matrixColumns === 9 && layout.matrixRows === (slug === 'outline-business-case' ? 2 : 7), 'matrix structure');
                if (slug === 'full-business-case' && mode === 'case') check(layout.paperChapters === 10, 'ten actual document chapters');
                check(layout.nav.length > 20, 'navigation coverage');
                if (!navNames) navNames = layout.nav;
                check(JSON.stringify(layout.nav) === JSON.stringify(navNames), 'navigation changed across entries/modes');
                results.push(layout);
                const sceneIds = await page.locator('#business-usage .plan-usage-tab').evaluateAll(elements => elements.map(e => e.dataset.scene));
                check(sceneIds.length === (slug === 'outline-business-case' ? 3 : 6), 'scene count');
                for (const scene of sceneIds) {
                    await page.locator('#business-usage .plan-usage-tab[data-scene="' + scene + '"]').click();
                    const state = await page.evaluate(({ slug, scene, mode }) => {
                        const panel = document.getElementById('business-usage-panel'), table = panel.querySelector('table');
                        const data = window.PRINCE2BusinessCaseUsage;
                        const items = data.scenes[slug].find(item => item.id === scene).steps;
                        const rows = [...table.tBodies[0].rows];
                        const equal = rows.every((row, index) => {
                            const item = items[index], cells = [...row.cells];
                            return cells.length === 5 && cells[3].textContent === (mode === 'case' ? item.example : item.theory) &&
                                item.actor.every(actor => cells[1].textContent.includes(mode === 'case' ? data.roles[actor].person : data.roles[actor].role));
                        });
                        const links = [...panel.querySelectorAll('.plan-usage-materials a')];
                        return { width: innerWidth, slug, mode, scene, rows: rows.length, equal,
                            headingCount: table.tHead.rows[0].cells.length,
                            columnMode: getComputedStyle(table.tHead).display,
                            missingAnchors: links.filter(a => a.getAttribute('href').startsWith('#') && !document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a => a.href),
                            overflow: document.documentElement.scrollWidth - innerWidth,
                            clippedLabels: [...panel.querySelectorAll('.plan-usage-person strong, .plan-usage-person small')].filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.textContent)
                        };
                    }, { slug, scene, mode });
                    check(state.equal && state.headingCount === 5 && !state.missingAnchors.length && !state.clippedLabels.length && state.overflow <= 1, JSON.stringify(state));
                    check(width > 1200 ? state.columnMode !== 'none' : state.columnMode === 'none', 'responsive column mode');
                    sceneChecks.push(state);
                    if ([1440, 390].includes(width) && mode === 'case' && scene === 'prepare') {
                        await page.locator('#business-usage').scrollIntoViewIfNeeded();
                        await page.screenshot({ path: 'output/playwright/' + slug + '-usage-' + width + '.png' });
                        await page.locator('#roles-section').scrollIntoViewIfNeeded();
                        await page.screenshot({ path: 'output/playwright/' + slug + '-matrix-' + width + '.png' });
                    }
                }
                await page.locator('#business-usage .plan-usage-tab[aria-selected="true"]').focus();
                await page.keyboard.press('Home');
                check(await page.locator('#business-usage-tab-prepare').getAttribute('aria-selected') === 'true', 'Home tab');
                await page.keyboard.press('ArrowRight');
                check(await page.locator('#business-usage-tab-authorize').getAttribute('aria-selected') === 'true', 'ArrowRight tab');
                const activities = await page.locator('#business-usage-matrix tbody tr').evaluateAll(rows => rows.map(row => ({ activity: row.querySelector('button').dataset.activity, scene: row.dataset.scene })));
                for (const activity of activities) {
                    await page.locator('#business-usage-matrix button[data-activity="' + activity.activity + '"]').click();
                    check(await page.locator('#business-usage-tab-' + activity.scene).getAttribute('aria-selected') === 'true', 'matrix scene link ' + activity.activity);
                }
            }
        }
    }
    for (const slug of ['outline-business-case', 'full-business-case']) {
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.goto(base + slug + '&mode=case&v=business-usage-1');
        const target = slug === 'full-business-case' ? 'boundary' : 'authorize';
        await page.locator('#business-usage-tab-' + target).click();
        await page.locator('#lifecycle-section').evaluate(e => e.scrollIntoView({ block: 'start', behavior: 'instant' }));
        const before = await page.evaluate(() => ({ origin: performance.timeOrigin, top: document.getElementById('business-usage-panel').getBoundingClientRect().top }));
        await page.getByRole('link', { name: '产品知识', exact: true }).click();
        await page.waitForTimeout(160);
        const theory = await page.evaluate(() => ({ origin: performance.timeOrigin, top: document.getElementById('business-usage-panel').getBoundingClientRect().top, scene: document.querySelector('#business-usage .plan-usage-tab[aria-selected="true"]').dataset.scene }));
        await page.getByRole('link', { name: '装修案例', exact: true }).click();
        await page.waitForTimeout(160);
        const after = await page.evaluate(() => ({ origin: performance.timeOrigin, top: document.getElementById('business-usage-panel').getBoundingClientRect().top, scene: document.querySelector('#business-usage .plan-usage-tab[aria-selected="true"]').dataset.scene }));
        check(before.origin === theory.origin && theory.origin === after.origin && theory.scene === target && after.scene === target, 'same document/scene');
        check(Math.abs(before.top - theory.top) <= 3 && Math.abs(before.top - after.top) <= 3, JSON.stringify({ before, theory, after }));
        await page.reload(); check(await page.locator('#business-usage-tab-' + target).getAttribute('aria-selected') === 'true', 'scene refresh persistence');
        switches.push({ slug, before, theory, after });
        await page.locator('#business-usage-tab-prepare').click();
        await page.locator('#business-usage-panel .plan-usage-materials a[href^="#"]').first().click();
        const hashTarget = await page.evaluate(() => { const e = document.getElementById(decodeURIComponent(location.hash.slice(1))); return { exists: Boolean(e), visible: Boolean(e && e.getBoundingClientRect().height), top: e && e.getBoundingClientRect().top }; });
        check(hashTarget.exists && hashTarget.visible && hashTarget.top >= 0 && hashTarget.top < 300, 'material navigation ' + JSON.stringify(hashTarget));
        if (slug === 'full-business-case') {
            await page.locator('.lesson-help-button').click();
            check(await page.locator('#lesson-help-dialog').evaluate(e => e.open), 'field help open');
            check(await page.locator('#lesson-help-dialog #roles-section').count() === 0, 'management not in field help');
            await page.keyboard.press('Escape');
            await page.emulateMedia({ media: 'print' });
            const print = await page.evaluate(() => ({ chapters: [...document.querySelectorAll('.business-chapter')].filter(e => e.getBoundingClientRect().height).length, matrixHidden: !document.getElementById('roles-section').getBoundingClientRect().height, flowHidden: !document.getElementById('lifecycle-section').getBoundingClientRect().height }));
            check(print.chapters === 10 && print.matrixHidden && print.flowHidden, JSON.stringify(print));
            results.push({ print }); await page.emulateMedia({ media: 'screen' });
        }
    }
    const sourceLinks = [];
    for (const slug of ['outline-business-case', 'full-business-case']) {
        for (const label of ['definition', 'purpose']) {
            await page.goto(base + slug + '&mode=theory');
            await page.locator('#' + label + '-link').click();
            await page.waitForFunction(() => { const target = document.getElementById(decodeURIComponent(location.hash.slice(1))); return target && Math.abs(target.getBoundingClientRect().top) < 200; });
            sourceLinks.push({ slug, label, href: page.url() });
        }
    }
    const regression = [];
    for (const slug of ['project-plan', 'lessons-log', 'risk-register', 'issue-register', 'quality-register', 'product-register']) {
        await page.goto(base + slug + '&mode=case');
        check(await page.locator('#lesson-register-section').isVisible(), slug + ' document');
        await page.locator('.lesson-help-button').click(); check(await page.locator('#lesson-help-dialog').evaluate(e => e.open), slug + ' help'); await page.keyboard.press('Escape');
        const businessSections = await page.locator('#business-usage').count(); check(!businessSections, slug + ' business contamination');
        const chapters = await page.locator('.plan-chapter').count();
        if (slug === 'project-plan') check(chapters === 10, 'project plan chapters');
        regression.push({ slug, rows: await page.locator('.lesson-summary-row').count(), chapters });
    }
    check(!errors.length, errors.join('\n'));
    return { pass: true, layoutCount: results.length, sceneCount: sceneChecks.length, switches, sourceLinks, regression, errors, screenshots: 'output/playwright/*-business-case-{usage,matrix}-{1440,390}.png' };
}
