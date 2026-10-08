async (page) => {
    await page.emulateMedia({media:'screen'});
    await page.route('**/*', route => route.continue());
    const problems = [], errors = [], responses = [], details = [];
    const onError = error => errors.push(error.message);
    const onResponse = response => { if (response.status() >= 400) responses.push(response.url() + ': ' + response.status()); };
    page.on('pageerror', onError); page.on('response', onResponse);
    const check = (condition, message) => { if (!condition) problems.push(message); };
    await page.goto('http://127.0.0.1:8000/entities/product-detail-v2.html?entry=highlight-report&mode=theory');
    const slugs = await page.evaluate(() => Object.keys(window.PRINCE2RemainingProducts.papers));
    let scenes = 0, links = 0, printChecks = 0;
    for (const width of [1440, 1024, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const slug of slugs) {
            await page.goto('http://127.0.0.1:8000/entities/product-detail-v2.html?entry=' + slug + '&mode=case&v=remaining-audit');
            await page.evaluate(() => document.fonts.ready);
            const state = await page.evaluate(() => {
                const frame = document.querySelector('.workspace-frame').getBoundingClientRect();
                const chapterLinks = [...document.querySelectorAll('#lesson-register-section a[href^="#"]')];
                return { overflow: document.documentElement.scrollWidth - innerWidth, title: document.title,
                    paper: !document.getElementById('lesson-register-section').hidden, roles: !document.getElementById('roles-section').hidden,
                    invalidLocal: chapterLinks.filter(a => !document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a => a.hash),
                    frame: [frame.left, frame.width], sceneCount: document.querySelectorAll('#product-management-usage [role="tab"]').length,
                    duplicateIds: [...document.querySelectorAll('[id]')].map(el => el.id).filter((id, index, ids) => ids.indexOf(id) !== index),
                    routes: [...document.querySelectorAll('.workspace-tree a[href*="entry="]')].map(a => new URL(a.href).searchParams.get('entry')) };
            });
            details.push({slug, width, frame:state.frame, scenes:state.sceneCount});
            check(state.overflow <= 1, slug + '/' + width + ': page overflow ' + state.overflow);
            check(state.paper && state.roles, slug + ': missing document or inline management');
            check(!state.invalidLocal.length, slug + ': document anchors ' + state.invalidLocal);
            check(!state.duplicateIds.length, slug + ': duplicate IDs ' + state.duplicateIds);
            check(new Set(state.routes).size === 36, slug + ': navigation must contain 36 entries');
            for (let index = 0; index < state.sceneCount; index++) {
                await page.locator('#product-management-usage [role="tab"]').nth(index).click();
                const result = await page.evaluate(() => {
                    const table = document.querySelector('#product-management-panel table');
                    const anchors = [...table.querySelectorAll('a[href^="#"]')];
                    return { columns: table.querySelectorAll('thead th').length, broken: anchors.filter(a => {
                        const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
                        return !target || !target.getClientRects().length;
                    }).map(a => a.hash), count: anchors.length };
                });
                check(result.columns === 5 && !result.broken.length, slug + ': scene ' + index + ' invalid ' + result.broken);
                scenes++; links += result.count;
            }
            const navBefore = await page.locator('.workspace-tree').innerHTML();
            if (!await page.locator('[data-workspace-mode="theory"]').isVisible()) await page.locator('.workspace-menu').click();
            await page.locator('[data-workspace-mode="theory"]').click();
            check(await page.locator('#lesson-register-section').isHidden(), slug + ': theory still shows paper');
            check(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth <= 1), slug + '/' + width + ': theory overflow');
            const fields = await page.evaluate(() => [...document.querySelectorAll('#composition-list dt')].map(el => el.textContent.trim()));
            check(fields.length > 0, slug + ': theory fields missing');
            if (!await page.locator('[data-workspace-mode="case"]').isVisible()) await page.locator('.workspace-menu').click();
            await page.locator('[data-workspace-mode="case"]').click();
            check(await page.locator('#lesson-register-section').isVisible(), slug + ': case restore failed');
            const navAfter = await page.locator('.workspace-tree').innerHTML();
            check(navBefore === navAfter, slug + ': tree changed after mode round trip');
            await page.locator('.lesson-help-button').click();
            check(await page.locator('#lesson-help-dialog').isVisible(), slug + ': help unavailable');
            await page.locator('.lesson-help-close').click();
            if (width === 1440) {
                await page.emulateMedia({media:'print'});
                const print = await page.evaluate(() => ({paper:!!document.getElementById('lesson-register-section').getClientRects().length,
                    nav:!!document.querySelector('.workspace-sidebar').getClientRects().length,
                    hiddenTables:[...document.querySelectorAll('#lesson-register-section table')].filter(table=>getComputedStyle(table).display==='none').length}));
                check(print.paper && !print.nav && !print.hiddenTables, slug + ': print content missing');
                printChecks++; await page.emulateMedia({media:'screen'});
            }
        }
    }
    await page.setViewportSize({width:1440,height:1000});
    await page.goto('http://127.0.0.1:8000/entities/product-detail-v2.html?entry=highlight-report&mode=theory');
    const sources = await page.evaluate(() => Object.values(window.PRINCE2RemainingProducts.source).flatMap(spec => {
        const entry = window.PRINCE2_PRODUCT_DETAILS_V2.entries[spec.slug]; return [entry.definition.sourceHref,entry.purpose.sourceHref];
    }));
    for (const source of sources) {
        await page.goto(new URL(source, 'http://127.0.0.1:8000/entities/product-detail-v2.html').href);
        const target = await page.evaluate(() => { const el=document.getElementById(decodeURIComponent(location.hash.slice(1)));return el && {text:el.textContent,rect:el.getBoundingClientRect().toJSON(),toc:!!el.closest('.toc-list')}; });
        check(target && target.text.trim() && target.rect.width && target.rect.height && !target.toc && target.rect.top >= 0 && target.rect.top < 1000, 'source target missing or outside viewport: ' + source);
        links++;
    }
    await page.goto('http://127.0.0.1:8000/entities/product-detail-v2.html?entry=highlight-report&mode=case');
    await page.screenshot({path:'.playwright-cli/remaining-report-desktop.png',fullPage:true});
    await page.setViewportSize({width:390,height:1000});
    await page.goto('http://127.0.0.1:8000/entities/product-detail-v2.html?entry=stage-plan&mode=case');
    await page.screenshot({path:'.playwright-cli/remaining-plan-mobile.png',fullPage:true});
    page.off('pageerror', onError); page.off('response', onResponse); await page.unroute('**/*');
    if (errors.length || responses.length || problems.length) throw new Error(JSON.stringify({errors, responses, problems}));
    return {documents:slugs.length, layouts:details.length, scenes, links, printChecks, errors, responses, problems, frameSamples:details.slice(0,2)};
}
