// 作为 Playwright CLI run-code 函数执行。
async (page) => {
    const errors = [], results = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = 'http://127.0.0.1:8000/entities/product-detail-v2.html?entry=';
    for (const width of [1440, 1024, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const mode of ['theory', 'case']) {
            await page.goto(base + 'issue-register&mode=' + mode + '&v=issue-paper-1');
            await page.evaluate(() => document.fonts.ready);
            results.push(await page.evaluate(() => ({ width: innerWidth, mode: new URLSearchParams(location.search).get('mode'),
                overflow: document.documentElement.scrollWidth > innerWidth,
                fields: document.querySelectorAll('#composition-list > *').length,
                caseVisible: !document.getElementById('lesson-register-section').hidden,
                recordFields: document.querySelectorAll('.lesson-record-fields > div').length })));
            if (mode === 'case') {
                await page.getByRole('button', { name: '字段与职责说明', exact: true }).click();
                results.push({ width, help: await page.locator('#lesson-help-dialog').evaluate(e => e.open) });
                await page.locator('.lesson-help-close').click();
                if ([1440, 390].includes(width)) await page.screenshot({ path: 'output/playwright/issue-register-' + width + '.png', fullPage: true });
                if (width <= 960) await page.getByRole('button', { name: '产品目录', exact: true }).click();
                const origin = await page.evaluate(() => performance.timeOrigin);
                const treeBefore = await page.locator('.workspace-tree [data-name]').evaluateAll(es => JSON.stringify(es.map(e => [e.dataset.name, e.dataset.code, e.parentElement.className])));
                await page.getByRole('link', { name: '产品知识', exact: true }).click();
                if (width <= 960) await page.getByRole('button', { name: '产品目录', exact: true }).click();
                await page.getByRole('link', { name: '装修案例', exact: true }).click();
                results.push({ width, modeRoundTrip: await page.evaluate(() => new URLSearchParams(location.search).get('mode') === 'case'), sameDocument: origin === await page.evaluate(() => performance.timeOrigin),
                    treeStructure: treeBefore === await page.locator('.workspace-tree [data-name]').evaluateAll(es => JSON.stringify(es.map(e => [e.dataset.name, e.dataset.code, e.parentElement.className]))) });
            }
        }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base + 'issue-register&mode=case');
    await page.getByRole('link', { name: '关联风险 RISK-007', exact: true }).click();
    await page.waitForURL('**/product-detail-v2.html?entry=risk-register&mode=case#lesson-detail-RISK-007');
    await page.locator('#lesson-detail-RISK-007').waitFor({ state: 'visible' });
    results.push({ riskLink: await page.locator('#lesson-detail-RISK-007').isVisible() });
    await page.reload();
    results.push({ riskRefresh: await page.locator('#lesson-detail-RISK-007').isVisible() });
    await page.goto(base + 'issue-register&mode=theory');
    const sources = await page.locator('#definition-section a[href*="source-issue-register-"]').evaluateAll(es => es.map(e => e.href));
    for (const href of sources) {
        await page.goto(href);
        results.push(await page.evaluate(() => ({ source: location.hash, found: !!document.getElementById(location.hash.slice(1)), text: document.getElementById(location.hash.slice(1))?.textContent })));
    }
    await page.goto(base + 'issue-register&mode=case');
    await page.emulateMedia({ media: 'print' });
    results.push({ printRecord: await page.locator('#lesson-detail-ISS-WPF-001').isVisible(), printButtonHidden: !await page.locator('.lesson-print').isVisible() });
    await page.emulateMedia({ media: 'screen' });
    for (const slug of ['lessons-log', 'quality-register', 'risk-register', 'product-register', 'full-business-case']) {
        await page.goto(base + slug + '&mode=case');
        results.push({ slug, paperVisible: await page.locator('#lesson-register-section').isVisible(), rows: await page.locator('.lesson-summary-row').count(), chapters: await page.locator('.business-chapter').count() });
    }
    return { errors, results };
}
