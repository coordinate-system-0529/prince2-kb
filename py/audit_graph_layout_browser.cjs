// 通过 Playwright CLI run-code 执行此函数；仅检查两张图谱，不修改站点数据。
async (page) => {
    const results = [];
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.continue());
    for (const file of ['graph-full.html', 'graph.html']) {
        await page.goto('http://127.0.0.1:8000/' + file);
        for (const width of [1920, 1440, 1280, 1024, 961, 960, 768, 390, 320]) {
            await page.setViewportSize({ width, height: 1000 });
            const layout = await page.evaluate(() => {
                const rect = element => element.getBoundingClientRect();
                const overlaps = (a, b) => a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
                const nodes = [...document.querySelectorAll('.proc-node')];
                const triggers = [...document.querySelectorAll('.trigger-box')].map(element => {
                    const box = rect(element);
                    const node = element.parentElement.querySelector('.proc-node');
                    const target = rect(node);
                    return {
                        target: node.id,
                        route: element.querySelector('.tg-route').textContent,
                        centered: Math.abs((box.left + box.right - target.left - target.right) / 2) < 1,
                        below: box.top >= target.bottom,
                        collisions: nodes.filter(other => overlaps(box, rect(other))).map(other => other.id)
                    };
                });
                const scroller = document.querySelector('.flow-table-scroll');
                let table = null;
                if (scroller) {
                    scroller.scrollLeft = scroller.scrollWidth;
                    table = { localScroll: scroller.scrollWidth > scroller.clientWidth, moved: scroller.scrollLeft > 0,
                        headersSingleLine: [...scroller.querySelectorAll('th')].every(th => getComputedStyle(th).whiteSpace === 'nowrap') };
                    scroller.scrollLeft = 0;
                }
                return { overflow: document.documentElement.scrollWidth - innerWidth, triggers, table };
            });
            results.push({ file, width, ...layout });
            if ([1440, 390].includes(width)) {
                await page.screenshot({ path: 'output/playwright/' + file.replace('.html', '') + '-' + width + '-verified.png', fullPage: true });
                const ids = file === 'graph-full.html' ? ['dp', 'su', 'ip', 'sb', 'cp', 'cs', 'mp'] : ['directing', 'su', 'ip', 'sb', 'cp', 'cs', 'mp'];
                for (const id of ids) {
                    await page.locator('#node-' + id).click({ position: { x: 10, y: 10 }, timeout: 3000 });
                    await page.waitForTimeout(450);
                    const panel = page.locator('#detail-' + id);
                    const opened = await panel.evaluate(element => ({ open: element.classList.contains('open'), clipped: element.scrollHeight > element.clientHeight + 1,
                        overflow: document.documentElement.scrollWidth - innerWidth }));
                    await panel.locator('.close-btn').click({ timeout: 3000 });
                    results.push({ file, width, id, ...opened, closed: !await panel.evaluate(element => element.classList.contains('open')) });
                }
            }
        }
    }
    await page.unroute('**/*');
    return { errors, results, passed: errors.length === 0 && results.every(result =>
        result.overflow === 0 && !result.clipped && result.open !== false && result.closed !== false &&
        (!result.triggers || result.triggers.every(trigger => trigger.centered && trigger.below && trigger.collisions.length === 0)) &&
        (!result.table || result.table.headersSingleLine && (!result.table.localScroll || result.table.moved))) };
}
