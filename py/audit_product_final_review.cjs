// 统一复核：外框、颜色和自动候选的截图，只读页面。
async (page) => {
    await page.route('**/*', route => route.continue());
    const frames = [], details = [];
    const check = (condition, message) => { if (!condition) throw new Error(message); };
    const routes = ['entities/product.html', 'cases/renovation.html',
        'entities/product-detail-v2.html?entry=project-plan&mode=case',
        'entities/product-detail-v2.html?entry=project-plan&mode=theory',
        'cases/product-register.html', 'cases/project-brief.html',
        'cases/project-product-description.html', 'cases/product-description-waterproofing.html',
        'cases/waterproof-quality-records.html', 'cases/risk-lessons-records.html'];
    for (const width of [1440, 390]) {
        await page.setViewportSize({width, height:1000});
        let referenceFrame;
        for (const route of routes) {
            await page.goto('http://127.0.0.1:8000/' + route);
            await page.evaluate(() => document.fonts.ready);
            frames.push(await page.evaluate(route => {
                const frame = document.querySelector('main.workspace-frame');
                const rect = frame.getBoundingClientRect();
                const quality = document.querySelector('.quality-hero-links a');
                return {route, viewport:innerWidth, left:rect.left, width:rect.width,
                    gutter:getComputedStyle(document.documentElement).scrollbarGutter,
                    accent:getComputedStyle(document.body).getPropertyValue('--workspace-accent').trim(),
                    accentColor:document.querySelector('.source-file-nav a') && getComputedStyle(document.querySelector('.source-file-nav a')).color,
                    qualityColor:quality && getComputedStyle(quality).color};
            }, route));
            const frame = frames[frames.length - 1];
            if (!referenceFrame) referenceFrame = frame;
            check(frame.gutter === 'stable' && Math.abs(frame.left - referenceFrame.left) < 1 && Math.abs(frame.width - referenceFrame.width) < 1,
                'workspace frame differs ' + JSON.stringify(frame));
            if (frame.qualityColor) check(frame.qualityColor === frame.accentColor, 'legacy evidence accent');
        }
    }
    const captures = [
        ['cases/product-register.html', 390, '#update-panel-04', 'register-title'],
        ['entities/product-detail-v2.html?entry=lessons-log&mode=case', 1440, '.lesson-detail:not([hidden]) .lesson-journey', 'lesson-journey'],
        ['entities/product-detail-v2.html?entry=project-brief&mode=theory', 1440, '#product-duty-matrix', 'brief-duty'],
        ['cases/waterproof-quality-records.html', 1440, '.quality-record-hero', 'quality-source']
    ];
    for (const [route, width, selector, name] of captures) {
        await page.setViewportSize({width, height:1000});
        await page.goto('http://127.0.0.1:8000/' + route);
        await page.evaluate(() => document.fonts.ready);
        if (name === 'lesson-journey') await page.locator('.lesson-summary-row[data-record-id="LES-001"] button').click();
        const target = page.locator(selector).first();
        await target.evaluate(element => element.scrollIntoView({block:'start', behavior:'instant'}));
        details.push({route, width, text:(await target.textContent()).slice(0,800)});
        await page.screenshot({path:'output/playwright/final-review-after-' + name + '-' + width + '.png'});
    }
    const paperCaptures = [
        ['project-plan', '#project-plan-chapter-10', 'plan-paper'],
        ['full-business-case', '#business-case-chapter-4', 'business-paper']
    ];
    await page.setViewportSize({width:390, height:1000});
    for (const [entry, selector, name] of paperCaptures) {
        await page.goto('http://127.0.0.1:8000/entities/product-detail-v2.html?entry=' + entry + '&mode=case');
        await page.locator(selector).evaluate(element => element.scrollIntoView({block:'start', behavior:'instant'}));
        await page.screenshot({path:'output/playwright/final-review-after-' + name + '-390.png'});
    }
    await page.unroute('**/*');
    return {frames, details};
}
