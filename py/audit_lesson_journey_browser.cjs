// 通过 Playwright CLI run-code 执行；检验记录、历程与解读同步。
async (page) => {
    const errors = [], results = [];
    page.on('pageerror', e => errors.push(e.message));
    const base = 'http://127.0.0.1:8000/entities/product-detail-v2.html?entry=';
    for (const width of [1440, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(base + 'lessons-log&mode=case&v=lesson-journey-1');
        for (const id of ['LES-001', 'LES-002', 'LES-003']) {
            await page.getByRole('button', { name: '查看 ' + id + ' 完整记录', exact: true }).click();
            const record = page.locator('#lesson-detail-' + id);
            if (!await record.isVisible()) throw new Error(id + ': hidden record');
            if (await record.locator('.lesson-record-fields > div').count() !== 8) throw new Error(id + ': fields');
            const rows = await record.locator('.lesson-journey tbody tr').count();
            if (rows !== (id === 'LES-002' ? 5 : 6)) throw new Error(id + ': journey rows');
            await page.getByRole('button', { name: '案例解读', exact: true }).click();
            if (!(await page.locator('.lesson-interpretation h3').innerText()).startsWith(id)) throw new Error(id + ': interpretation mismatch');
            if (await page.locator('.lesson-legacy-explanation').isVisible()) throw new Error('duplicated explanations');
            const interpretation = await page.locator('.lesson-interpretation').innerText();
            if (interpretation.includes('组成内容') || interpretation.includes('生命周期')) throw new Error('old sections visible');
            if (width === 390 && id === 'LES-002') await page.screenshot({ path: 'output/playwright/lesson-interpretation-390.png' });
            await page.getByRole('button', { name: '关闭案例解读', exact: true }).click();
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
            if (overflow) throw new Error(width + ': page overflow');
            results.push({ width, id, fields: 8, journeyRows: rows, interpretation: true, overflow });
        }
        await page.getByRole('button', { name: '案例解读', exact: true }).click();
        await page.locator('.lesson-interpretation-tabs button').first().click();
        if (!(await page.locator('.lesson-interpretation h3').innerText()).startsWith('LES-001')) throw new Error('dialog selection');
        await page.keyboard.press('Escape');
        if (!await page.locator('#lesson-detail-LES-001').isVisible()) throw new Error('record selection out of sync');
        await page.locator('#lesson-journey-title-LES-001').scrollIntoViewIfNeeded();
        if (width !== 320) await page.screenshot({ path: 'output/playwright/lesson-journey-' + width + '.png' });
        if (width <= 960) await page.getByRole('button', { name: '产品目录', exact: true }).click();
        await page.getByRole('link', { name: '产品知识', exact: true }).click();
        if (await page.locator('#composition-list > *').count() !== 8 || !await page.locator('#definition-section').isVisible()) throw new Error('theory restoration');
        if (width <= 960) await page.getByRole('button', { name: '产品目录', exact: true }).click();
        await page.getByRole('link', { name: '装修案例', exact: true }).click();
        await page.getByRole('button', { name: '案例解读', exact: true }).click();
        if (await page.locator('.lesson-legacy-explanation').isVisible()) throw new Error('duplicate after roundtrip');
        await page.keyboard.press('Escape');
        await page.reload();
        if (!await page.locator('#lesson-detail-LES-001').isVisible()) throw new Error('refresh selection');
    }
    await page.emulateMedia({ media: 'print' });
    const printed = await page.locator('.lesson-journey').evaluateAll(es => es.filter(e => e.getBoundingClientRect().height > 0).length);
    if (printed !== 3 || await page.locator('.lesson-help-button').isVisible()) throw new Error('print');
    await page.emulateMedia({ media: 'screen' });
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const slug of ['issue-register', 'quality-register', 'risk-register', 'product-register', 'full-business-case']) {
        await page.goto(base + slug + '&mode=case');
        await page.getByRole('button', { name: '字段与职责说明', exact: true }).click();
        if (!await page.locator('.lesson-legacy-explanation').isVisible() || await page.locator('.lesson-interpretation').isVisible()) throw new Error(slug + ': help changed');
        await page.keyboard.press('Escape');
        results.push({ slug, unchangedHelp: true, journeys: await page.locator('.lesson-journey').count() });
    }
    if (errors.length) throw new Error(errors.join('; '));
    return { results, printJourneys: printed, errors };
}
