// Playwright CLI run-code：移动端模式往返、原文定位、责任锚点与搜索。
async (page) => {
    const results = [], errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = 'http://127.0.0.1:8000/entities/product-detail-v2.html?entry=';
    const slugs = ['product-register', 'product-description', 'project-brief', 'project-product-description', 'risk-register', 'issue-register', 'lessons-log', 'quality-register', 'quality-management-approach', 'work-package-description'];
    const check = (condition, message) => { if (!condition) throw new Error(message); };
    await page.setViewportSize({ width: 390, height: 900 });
    for (const slug of slugs) {
        await page.goto(base + slug + '&mode=case&v=management-1');
        await page.locator('#product-management-tab-1').click();
        await page.evaluate(() => window.scrollBy(0, document.getElementById('product-management-panel').getBoundingClientRect().top - 160));
        const origin = await page.evaluate(() => performance.timeOrigin);
        const before = await page.locator('#product-management-panel').evaluate(e => e.getBoundingClientRect().top);
        await page.getByRole('button', { name: '产品目录', exact: true }).click();
        await page.getByRole('link', { name: '产品知识', exact: true }).click();
        await page.waitForTimeout(120);
        const theory = await page.locator('#product-management-panel').evaluate(e => e.getBoundingClientRect().top);
        await page.getByRole('button', { name: '产品目录', exact: true }).click();
        await page.getByRole('link', { name: '装修案例', exact: true }).click();
        await page.waitForTimeout(120);
        const after = await page.locator('#product-management-panel').evaluate(e => e.getBoundingClientRect().top);
        check(origin === await page.evaluate(() => performance.timeOrigin), 'mobile reload');
        check(Math.abs(before - theory) < 3 && Math.abs(before - after) < 3, JSON.stringify({ slug, before, theory, after }));
        check(await page.locator('#product-management-tab-1').getAttribute('aria-selected') === 'true', 'mobile scene');
        results.push({ slug, mobile: { before, theory, after } });
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const slug of slugs) {
        await page.goto(base + slug + '&mode=theory&v=management-1');
        const role = await page.locator('#product-duty-matrix tbody tr').first().getAttribute('id');
        await page.goto(base + slug + '&mode=case&v=management-1#' + encodeURIComponent(role));
        const anchor = await page.locator('[id="' + role + '"]').evaluate(e => ({ top: e.getBoundingClientRect().top, height: e.getBoundingClientRect().height }));
        check(anchor.height > 0 && anchor.top >= 0 && anchor.top < 1000, 'role deep link ' + slug + JSON.stringify(anchor));
        for (const name of ['definition', 'purpose']) {
            await page.goto(base + slug + '&mode=theory&v=management-1');
            await page.locator('#' + name + '-link').click();
            await page.waitForFunction(() => {
                const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
                if (!target) return false;
                const rect = target.getBoundingClientRect();
                // 页尾受最大滚动位置限制，以完整可见而非强制顶对齐作为定位条件。
                return rect.top >= -2 && rect.bottom <= innerHeight + 2;
            }, null, { timeout: 5000 });
            results.push({ slug, source: name, url: page.url() });
        }
    }
    await page.goto(base + 'product-register&mode=case&v=management-1');
    await page.locator('#register-product-search').fill('不存在的产品');
    check(await page.locator('.lesson-summary-row:visible').count() === 0, 'register empty search');
    await page.locator('#register-product-search').fill('');
    check(await page.locator('.lesson-summary-row:visible').count() === 14, 'restore 14 products');
    await page.getByRole('searchbox', { name: '查找管理产品' }).fill('经验教训');
    await page.locator('#workspace-navigation a.workspace-row[href*="entry=lessons-log"]').click();
    check(new URL(page.url()).searchParams.get('entry') === 'lessons-log', 'navigation product');
    check(!errors.length, JSON.stringify(errors));
    return { results, errors, sourceCount: 20, mobileCount: 10, search: true };
}
