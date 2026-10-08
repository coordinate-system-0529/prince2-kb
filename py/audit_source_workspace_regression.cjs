// 共用导航回归：36个V2条目、两个总览、原台账交互与原文件截图。
async (page) => {
    await page.emulateMedia({media:'screen'});
    await page.route('**/*', route => route.continue());
    const base = 'http://127.0.0.1:8000/';
    await page.goto(base + 'entities/product-detail-v2.html?entry=project-plan&mode=case');
    const slugs = await page.evaluate(() => Object.keys(window.PRINCE2_PRODUCT_DETAILS_V2.entries));
    const errors = [], results = [];
    page.on('pageerror', error => errors.push(error.message));
    const check = (condition, message) => { if (!condition) throw new Error(message); };
    for (const width of [1440, 1024, 390]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const slug of slugs) {
            await page.goto(base + 'entities/product-detail-v2.html?entry=' + slug + '&mode=case&v=source-nav-1');
            const origin = await page.evaluate(() => performance.timeOrigin);
            for (const mode of ['theory', 'case']) {
                if (width <= 960) await page.getByRole('button', { name: '产品目录', exact: true }).click();
                await page.locator('[data-workspace-mode="' + mode + '"]').click();
                check(origin === await page.evaluate(() => performance.timeOrigin), 'V2 reloaded ' + slug);
                check(new URL(page.url()).searchParams.get('mode') === mode, 'V2 mode ' + slug);
                const data = await page.evaluate(() => ({
                    nodes: document.querySelectorAll('.workspace-tree li[data-name]').length,
                    current: document.querySelectorAll('.workspace-tree .workspace-row[aria-current="page"]').length,
                    overflow: document.documentElement.scrollWidth - innerWidth
                }));
                check(data.nodes === 36 && data.current === 1 && data.overflow <= 2, JSON.stringify({ slug, mode, width, data }));
                results.push({ slug, mode, width });
            }
        }
        for (const route of ['entities/product.html', 'cases/renovation.html']) {
            await page.goto(base + route + '?v=source-nav-1');
            check(await page.locator('.workspace-tree li[data-name]').count() === 36, 'overview tree');
            check(await page.locator('.workspace-sidebar').count() === 1, 'duplicate sidebar');
        }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base + 'cases/product-register.html?v=source-nav-1#full-register');
    const count = await page.locator('#fullRegisterBody .product-register-row').count();
    check(count === 14, 'original register count');
    const trigger = page.locator('.product-detail-trigger').first();
    const panelId = await trigger.getAttribute('aria-controls');
    await trigger.click();
    check(await page.locator('[id="' + panelId + '"]').isVisible(), 'original register expand');
    await trigger.click();
    check(!await page.locator('[id="' + panelId + '"]').isVisible(), 'original register collapse');
    for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const name of ['project-brief', 'waterproof-quality-records']) {
            await page.goto(base + 'cases/' + name + '.html?v=source-nav-1');
            await page.screenshot({ path: 'output/playwright/source-' + name + '-' + width + '.png' });
            if (width === 390) {
                await page.getByRole('button', { name: '产品目录', exact: true }).click();
                await page.screenshot({ path: 'output/playwright/source-' + name + '-390-drawer.png' });
                await page.keyboard.press('Escape');
            }
        }
    }
    await page.unroute('**/*');
    check(!errors.length, JSON.stringify(errors));
    return { layouts: results.length, overviewChecks: 6, originalRegisterRecords: count, toggle: true, screenshots: 'output/playwright/source-*.png', errors };
}
