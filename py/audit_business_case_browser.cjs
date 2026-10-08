// 作为 Playwright CLI run-code 函数执行，检查完整商业论证与共享单据回归。
async (page) => {
    const errors = [], results = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = 'http://127.0.0.1:8000/entities/product-detail-v2.html?entry=';
    for (const width of [1440, 1024, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const mode of ['theory', 'case']) {
            await page.goto(base + 'full-business-case&mode=' + mode + '&v=business-paper-1');
            results.push(await page.evaluate(() => ({ width: innerWidth, mode: new URLSearchParams(location.search).get('mode'),
                overflow: document.documentElement.scrollWidth - innerWidth,
                paperVisible: !document.getElementById('lesson-register-section').hidden,
                chapters: document.querySelectorAll('.business-chapter').length,
                theoryFields: document.getElementById('composition-list').children.length })));
            if (mode === 'case') {
                await page.locator('.lesson-help-button').click();
                results.push({ width, helpOpen: await page.locator('#lesson-help-dialog').evaluate(e => e.open) });
                await page.locator('.lesson-help-close').click();
                if ([1440, 390].includes(width)) await page.screenshot({ path: 'output/playwright/business-case-' + width + '.png' });
            }
        }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base + 'full-business-case&mode=case&v=business-paper-1');
    await page.locator('.business-contents').getByRole('link', { name: '成本', exact: true }).click();
    const before = await page.evaluate(() => ({ origin: performance.timeOrigin, top: document.getElementById('business-case-chapter-7').getBoundingClientRect().top }));
    await page.getByRole('link', { name: '产品知识', exact: true }).click();
    const theory = await page.locator('#composition-list [data-view-anchor="composition-成本"]').evaluate(e => e.getBoundingClientRect().top);
    await page.getByRole('link', { name: '装修案例', exact: true }).click();
    await page.waitForTimeout(200);
    results.push(await page.evaluate(({ before, theory }) => ({ switch: true, sameDocument: before.origin === performance.timeOrigin,
        theoryTop: theory, caseTop: document.getElementById('business-case-chapter-7').getBoundingClientRect().top }), { before, theory }));
    await page.emulateMedia({ media: 'print' });
    results.push(await page.evaluate(() => ({ printChapters: [...document.querySelectorAll('.business-chapter')].filter(e => e.getBoundingClientRect().height > 0).length,
        printButtonHidden: getComputedStyle(document.querySelector('.lesson-print')).display === 'none' })));
    await page.emulateMedia({ media: 'screen' });
    for (const slug of ['lessons-log', 'risk-register', 'quality-register', 'product-register']) {
        await page.goto(base + slug + '&mode=case');
        results.push({ slug, rows: await page.locator('.lesson-summary-row').count(), paperVisible: await page.locator('#lesson-register-section').isVisible() });
    }
    return { errors, results };
}
