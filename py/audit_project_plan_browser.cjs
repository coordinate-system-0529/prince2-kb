// 作为 Playwright CLI run-code 函数执行；只检查项目计划及受影响共享单据。
async (page) => {
    const errors = [], results = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
    const base = 'http://127.0.0.1:8000/entities/product-detail-v2.html?entry=project-plan&v=plan-columns-3&mode=';
    for (const width of [1920, 1440, 1280, 1200, 1024, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        let theoryTree;
        for (const mode of ['theory', 'case']) {
            await page.goto(base + mode);
            await page.evaluate(() => document.fonts.ready);
            const result = await page.evaluate(() => ({
                width: innerWidth, mode: new URLSearchParams(location.search).get('mode'),
                overflow: document.documentElement.scrollWidth - innerWidth,
                fields: document.getElementById('composition-list').children.length,
                chapters: document.querySelectorAll('.plan-chapter').length,
                paper: !document.getElementById('lesson-register-section').hidden,
                tree: [...document.querySelectorAll('#workspace-navigation [data-name]')].map(e => e.dataset.name),
                ganttOverflow: document.querySelector('.plan-schedule-scroll') ? document.querySelector('.plan-schedule-scroll').scrollWidth > document.querySelector('.plan-schedule-scroll').clientWidth : false
            }));
            result.treeCount = result.tree.length;
            if (mode === 'theory') theoryTree = result.tree;
            else {
                result.sameTree = JSON.stringify(theoryTree) === JSON.stringify(result.tree);
                await page.locator('.lesson-help-button').click();
                result.helpOpen = await page.locator('#lesson-help-dialog').evaluate(e => e.open);
                await page.keyboard.press('Escape');
                result.helpClosed = await page.locator('#lesson-help-dialog').evaluate(e => !e.open);
            }
            delete result.tree; results.push(result);
            if ([1440, 390].includes(width)) await page.screenshot({ path: 'output/playwright/project-plan-' + width + '-' + mode + '.png' });
            if (result.treeCount < 15 || result.overflow > 1 || result.fields !== 10 || result.paper !== (mode === 'case') || (mode === 'case' && (!result.sameTree || result.chapters !== 10))) throw new Error(JSON.stringify(result));
        }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const width of [1920, 1440, 1280, 1200, 1024, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const mode of ['case', 'theory']) {
            await page.goto(base + mode + '#roles-section');
            if (!await page.locator('#roles-section').isVisible() || !await page.locator('#lifecycle-section').isVisible()) throw new Error('管理说明不可见');
            if (await page.locator('#lesson-help-dialog #roles-section').count()) throw new Error('责任矩阵仍在弹窗内');
            if (!await page.locator('#detail-view-toolbar').isVisible()) throw new Error('阅读导航不可见');
            await page.locator('.plan-matrix button[data-activity="update"]').click();
            if (await page.locator('.plan-usage-tab[aria-selected="true"]').getAttribute('data-scene') !== 'boundary') throw new Error('矩阵联动失败');
            if (await page.locator('.plan-matrix tr.is-active').count() !== 2) throw new Error('阶段更新与授权未联动');
            for (const scene of ['prepare', 'authorize', 'control', 'boundary', 'exception', 'close']) {
                await page.locator('.plan-usage-tab[data-scene="' + scene + '"]').click();
                if (await page.locator('.plan-usage-tab[aria-selected="true"]').getAttribute('data-scene') !== scene) throw new Error('场景选择失败');
                if (await page.locator('.plan-usage-steps tbody tr').count() < 3) throw new Error('材料使用步骤缺失');
                const columns = await page.locator('.plan-usage-steps').evaluate((table, mode) => {
                    const labels = ['步骤', '责任人／角色', '使用材料', '管理动作', '产出与交接'];
                    const source = window.PRINCE2ProjectPlanUsage;
                    const sceneId = document.querySelector('.plan-usage-tab[aria-selected="true"]').dataset.scene;
                    const scene = source.scenes.find(item => item.id === sceneId);
                    const rows = [...table.querySelectorAll('tbody tr')];
                    return {
                        fiveColumns: JSON.stringify([...table.querySelectorAll('thead th')].map(th => th.textContent)) === JSON.stringify(labels) && rows.every(row => row.children.length === 5),
                        contentRetained: rows.every((row, index) => {
                            const step = scene.steps[index];
                            const people = [...row.children[1].querySelectorAll('.plan-usage-person')];
                            const actors = step.actor.map(actor => typeof actor === 'number' ? source.roles[actor] : { ...source.roles[actor.index], ...actor });
                            return people.length === actors.length && people.every((person, personIndex) => {
                                const actor = actors[personIndex];
                                return person.querySelector('strong').textContent === (mode === 'case' ? actor.person : actor.role) && (mode !== 'case' || (person.textContent.includes(actor.identity) && person.textContent.includes(actor.role)));
                            }) && JSON.stringify([...row.children[2].querySelectorAll('a')].map(link => link.textContent)) === JSON.stringify(step.materials.map(material => material.label)) && row.children[3].textContent === (mode === 'case' ? step.example : step.theory) && row.children[4].querySelector('p').textContent === '→ ' + step.recipient;
                        }),
                        separated: rows.every(row => row.children[1].querySelector('.plan-usage-actors') && row.children[2].querySelector('.plan-usage-materials') && !row.children[3].querySelector('.plan-usage-actors, .plan-usage-materials')),
                        alignment: rows.every(row => {
                            const cells = [...row.children], rects = cells.map(cell => cell.getBoundingClientRect());
                            return innerWidth > 1200 ? rects.every(rect => Math.abs(rect.top - rects[0].top) < 1) : cells.slice(1).every((cell, index) => cell.dataset.label === labels[index + 1] && getComputedStyle(cell, '::before').content.includes(labels[index + 1]));
                        }),
                        overflow: rows.some(row => [...row.children].some(cell => cell.scrollWidth > cell.clientWidth + 1))
                    };
                }, mode);
                if (!columns.fiveColumns || !columns.contentRetained || !columns.separated || !columns.alignment || columns.overflow) throw new Error(JSON.stringify({ width, mode, scene, columns }));
                const numberLayout = await page.locator('.plan-usage-steps tbody th').evaluateAll(cells => cells.every(cell => {
                    const range = document.createRange();
                    range.selectNodeContents(cell);
                    const rects = [...range.getClientRects()];
                    return rects.length === 1 && range.getBoundingClientRect().width <= cell.clientWidth + 1;
                }));
                if (!numberLayout) throw new Error('步骤编号折行或溢出');
                if (scene === 'exception' && await page.locator('.plan-usage-boundaries dl > div').count() !== 3) throw new Error('升级权限缺失');
                const invalidLink = await page.locator('.plan-usage-materials a').evaluateAll((links, mode) => links.some(link => {
                    const target = new URL(link.href);
                    if (target.pathname === location.pathname && !target.search) return !document.getElementById(decodeURIComponent(target.hash.slice(1)));
                    return target.searchParams.get('mode') !== mode || (mode === 'theory' && target.hash.startsWith('#lesson-detail-'));
                }), mode);
                if (invalidLink) throw new Error('材料链接模式或锚点无效');
            }
            if (width < 1200) {
                const matrixScroll = page.locator('.plan-matrix-scroll');
                await matrixScroll.focus();
                await matrixScroll.evaluate(e => { e.scrollLeft = 0; });
                await page.keyboard.press('ArrowRight');
                await page.waitForTimeout(150);
                if (await matrixScroll.evaluate(e => e.scrollLeft) <= 0) throw new Error('矩阵键盘滚动失效');
            }
            await page.locator('.plan-usage-tab[data-scene="control"]').click();
            const result = await page.evaluate(() => ({ width: innerWidth, mode: document.body.dataset.activeDetailMode, usageOverflow: document.documentElement.scrollWidth - innerWidth, matrixRows: document.querySelectorAll('.plan-matrix tbody tr').length, headerIdentityOverflow: [...document.querySelectorAll('.plan-matrix-identity')].some(e => e.scrollWidth > e.clientWidth + 1) }));
            if (result.usageOverflow > 1 || result.matrixRows !== 7 || result.headerIdentityOverflow) throw new Error(JSON.stringify(result));
            results.push(result);
            if ([1440, 390].includes(width)) {
                await page.locator('#lifecycle-section').evaluate(e => e.scrollIntoView({ block: 'start' }));
                await page.screenshot({ path: 'output/playwright/plan-columns-control-' + width + '-' + mode + '.png' });
                await page.locator('#roles-section').scrollIntoViewIfNeeded();
                await page.screenshot({ path: 'output/playwright/plan-matrix-' + width + '-' + mode + '.png' });
                await page.locator('.plan-usage-tab[data-scene="close"]').click();
                await page.locator('#lifecycle-section').scrollIntoViewIfNeeded();
                await page.screenshot({ path: 'output/playwright/plan-columns-close-' + width + '-' + mode + '.png' });
                const density = await page.evaluate(() => ({ width: innerWidth, mode: document.body.dataset.activeDetailMode, closeTableHeight: document.querySelector('.plan-usage-steps').getBoundingClientRect().height, activityRowHeight: document.querySelector('.plan-matrix tbody tr').getBoundingClientRect().height, sourceIconCount: document.querySelectorAll('.plan-matrix-activity a[aria-label][title]').length }));
                if (density.sourceIconCount !== 7 || (width === 1440 && density.activityRowHeight > 44)) throw new Error(JSON.stringify(density));
                results.push(density);
            }
        }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base + 'case#lifecycle-section');
    await page.locator('.plan-usage-tab[data-scene="control"]').click();
    const sceneBefore = await page.locator('#plan-usage-panel').evaluate(e => e.getBoundingClientRect().top);
    await page.getByRole('link', { name: '产品知识', exact: true }).click();
    const sceneAfter = await page.locator('#plan-usage-panel').evaluate(e => e.getBoundingClientRect().top);
    if (await page.locator('.plan-usage-tab[aria-selected="true"]').getAttribute('data-scene') !== 'control' || Math.abs(sceneAfter - sceneBefore) > 2) throw new Error(JSON.stringify({ error: '流程场景切换定位不一致', sceneBefore, sceneAfter, state: await page.evaluate(() => history.state) }));
    await page.getByRole('link', { name: '装修案例', exact: true }).click();
    await page.reload();
    if (await page.locator('.plan-usage-tab[aria-selected="true"]').getAttribute('data-scene') !== 'control') throw new Error('刷新丢失场景');
    await page.locator('.plan-usage-tab[data-scene="control"]').focus();
    await page.keyboard.press('ArrowRight');
    if (await page.locator('.plan-usage-tab[aria-selected="true"]').getAttribute('data-scene') !== 'boundary') throw new Error('方向键切换失败');
    await page.keyboard.press('Home');
    await page.locator('#plan-usage-panel').getByRole('link', { name: '07 预算', exact: true }).click();
    const budgetTop = await page.locator('#project-plan-chapter-7').evaluate(e => e.getBoundingClientRect().top);
    if (budgetTop < 0 || budgetTop > 160) throw new Error('使用材料未定位到预算正文');
    await page.goBack();
    await page.locator('#detail-view-toolbar a[href="#definition-section"]').click();
    if (!await page.locator('#lesson-help-dialog').evaluate(e => e.open)) throw new Error('案例定义说明入口失败');
    await page.keyboard.press('Escape');
    await page.emulateMedia({ media: 'print' });
    if (await page.locator('#roles-section').isVisible() || await page.locator('#lifecycle-section').isVisible()) throw new Error('辅助说明混入正式文件打印');
    await page.emulateMedia({ media: 'screen' });
    results.push({ scenarioModePosition: true, scenarioRefresh: true, scenarioKeyboard: true, materialChapter: true, helpDefinition: true, printContextHidden: true });
    await page.goto(base + 'case');
    await page.locator('.plan-contents').getByRole('link', { name: '预算', exact: true }).click();
    const before = await page.evaluate(() => ({ origin: performance.timeOrigin, top: document.getElementById('project-plan-chapter-7').getBoundingClientRect().top }));
    await page.getByRole('link', { name: '产品知识', exact: true }).click();
    const theory = await page.locator('#composition-list [data-view-anchor="composition-预算"]').evaluate(e => e.getBoundingClientRect().top);
    await page.getByRole('link', { name: '装修案例', exact: true }).click();
    await page.waitForTimeout(250);
    const position = await page.evaluate(({ before, theory }) => ({ switch: true, sameDocument: performance.timeOrigin === before.origin, theoryTop: theory, caseTop: document.getElementById('project-plan-chapter-7').getBoundingClientRect().top, before: before.top }), { before, theory });
    results.push(position);
    if (!position.sameDocument || Math.abs(position.caseTop - position.before) > 2) throw new Error(JSON.stringify(position));
    await page.reload();
    results.push({ refreshCase: await page.locator('.plan-chapter').count() === 10 });
    await page.emulateMedia({ media: 'print' });
    results.push(await page.evaluate(() => ({ printChapters: [...document.querySelectorAll('.plan-chapter')].filter(e => e.getBoundingClientRect().height > 0).length, printButtonHidden: getComputedStyle(document.querySelector('.lesson-print')).display === 'none' })));
    await page.emulateMedia({ media: 'screen' });
    for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(base + 'case');
        for (const chapter of [5, 8]) {
            await page.locator('#project-plan-chapter-' + chapter).scrollIntoViewIfNeeded();
            await page.screenshot({ path: 'output/playwright/project-plan-' + width + '-chapter-' + chapter + '.png' });
        }
        const scroll = page.locator('.plan-schedule-scroll');
        await scroll.focus();
        const start = await scroll.evaluate(e => e.scrollLeft);
        await page.keyboard.press('ArrowRight'); await page.waitForTimeout(150);
        results.push({ width, keyboardScroll: width > 960 || await scroll.evaluate(e => e.scrollLeft) > start });
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base + 'theory');
    for (const label of ['definition', 'purpose']) {
        await page.locator('#' + label + '-link').click();
        await page.waitForFunction(() => {
            const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
            return target && Math.abs(target.getBoundingClientRect().top) < 200;
        });
        const found = await page.evaluate(() => {
            const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
            return { hash: location.hash, found: !!target, top: target && target.getBoundingClientRect().top };
        });
        results.push({ source: label, ...found });
        if (!found.found || Math.abs(found.top) > 200) throw new Error(JSON.stringify(found));
        await page.goBack();
    }
    await page.goto('http://127.0.0.1:8000/entities/product.html?v=project-plan-1');
    await page.getByRole('searchbox', { name: '查找管理产品' }).fill('项目计划');
    await page.locator('#workspace-navigation a.workspace-row[href*="entry=project-plan"]').click();
    results.push({ overviewEntry: new URL(page.url()).searchParams.get('entry') === 'project-plan' });
    await page.getByRole('searchbox', { name: '查找管理产品' }).fill('不存在的条目');
    results.push({ emptySearch: await page.locator('#workspace-navigation a.workspace-row[href*="entry=project-plan"]').isHidden() });
    await page.getByRole('searchbox', { name: '查找管理产品' }).fill('');
    for (const slug of ['full-business-case', 'lessons-log', 'issue-register', 'quality-register']) {
        await page.goto('http://127.0.0.1:8000/entities/product-detail-v2.html?entry=' + slug + '&mode=case');
        await page.locator('.lesson-help-button').click();
        await page.keyboard.press('Escape');
        results.push({ regression: slug, paper: await page.locator('#lesson-register-section').isVisible() });
    }
    const failed = results.filter(result => ['helpOpen', 'helpClosed', 'refreshCase', 'printButtonHidden', 'keyboardScroll', 'overviewEntry', 'emptySearch', 'paper'].some(key => Object.hasOwn(result, key) && result[key] === false && !(key === 'paper' && result.mode === 'theory')) || (Object.hasOwn(result, 'printChapters') && result.printChapters !== 10));
    if (errors.length || failed.length) throw new Error(JSON.stringify({ errors, failed }));
    return { errors, results };
}
