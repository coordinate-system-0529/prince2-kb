// 浏览器复跑清单，与本批 CUA 检查范围对应；不替代用户验收或实际打印。
async (page) => {
    const failures = [], errors = [];
    const onError = error => errors.push(error.message);
    page.on('pageerror', onError);
    await page.goto('http://127.0.0.1:8000/entities/product-detail-v2.html?entry=lessons-log&mode=case');
    const slugs = await page.evaluate(() => Object.keys(window.PRINCE2_PRODUCT_DETAILS_V2.entries));
    let views = 0, clicks = 0;
    for (const width of [1440, 1024, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const slug of slugs) {
            const signatures = [];
            for (const mode of ['theory', 'case']) {
                await page.goto('http://127.0.0.1:8000/entities/product-detail-v2.html?entry=' + slug + '&mode=' + mode + '#roles-section');
                const state = await page.evaluate(() => {
                    const tables = [...document.querySelectorAll('#product-raci table')];
                    return {
                        generic: !!document.querySelector('#product-management-usage'), matrices: tables.length,
                        marked: document.querySelector('#product-raci-operation-title')?.textContent.includes('非教材内容'),
                        overflow: document.documentElement.scrollWidth - innerWidth,
                        aligned: tables.every(table => [...table.querySelectorAll('tbody tr')].every(row => row.children.length === table.querySelectorAll('thead th').length)),
                        labels: tables.every(table => [...table.querySelectorAll('tbody th')].every(cell => cell.textContent.trim())),
                        signature: tables.flatMap(table => [...table.querySelectorAll('tbody tr')].map(row => [...row.querySelectorAll('td')].map(cell => cell.textContent).join('|'))).join(';'),
                        operations: [...document.querySelectorAll('#product-raci button[data-raci-scene]')].map(button => button.dataset.raciScene)
                    };
                });
                views++;
                signatures.push(state.signature);
                if (state.overflow > 1 || !state.aligned || !state.labels || (state.generic && (state.matrices !== 2 || !state.marked))) failures.push(slug + '/' + mode + '/' + width);
                if (width === 1440 && mode === 'case') {
                    for (let index = 0; index < state.operations.length; index++) {
                        await page.locator('#product-raci button[data-raci-scene]').nth(index).click();
                        const selected = await page.locator('#product-management-usage [aria-selected="true"]').getAttribute('data-scene');
                        if (selected !== state.operations[index]) failures.push(slug + ': scene ' + index);
                        clicks++;
                    }
                }
            }
            if (signatures[0] !== signatures[1]) failures.push(slug + '/' + width + ': mode codes differ');
        }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('http://127.0.0.1:8000/entities/product-detail-v2.html?entry=lessons-log&mode=case');
    for (const [id, name] of [['LES-001', '赵建国'], ['LES-002', '宋妍'], ['LES-003', '陆明远']]) {
        await page.locator('button[aria-label="查看 ' + id + ' 完整记录"]').click();
        const owner = await page.evaluate(() => [...document.querySelectorAll('#product-raci [data-provenance="project-synthesis"] thead th')].find(cell => cell.firstElementChild?.textContent === '行动负责人')?.textContent);
        if (!owner?.includes(name)) failures.push(id + ': action owner');
    }
    // 风险角色必须随选中记录更新，不能沿用主记录或推断质量处置人员的风险职责。
    await page.goto('http://127.0.0.1:8000/entities/product-detail-v2.html?entry=risk-register&mode=case');
    for (const width of [1440, 1024, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const id of ['RISK-004', 'RISK-007', 'RISK-011']) {
            await page.locator('button[aria-label="查看 ' + id + ' 完整记录"]').click();
            const state = await page.evaluate(() => ({
                record: document.querySelector('.lesson-detail:not([hidden])')?.id,
                owners: [...document.querySelectorAll('#product-raci [data-provenance="project-synthesis"] th[data-role-key="owner"], #product-raci [data-provenance="project-synthesis"] th[data-role-key="action"]')].map(cell => cell.textContent),
                links: [...document.querySelectorAll('#product-management-usage [data-material-field]')].map(link => link.getAttribute('href')),
                overflow: document.documentElement.scrollWidth - innerWidth
            }));
            if (state.record !== 'lesson-detail-' + id || state.owners.length !== 2 || state.overflow > 1 || !state.links.every(href => href.includes('record-field-' + id + '-'))) failures.push(id + '/' + width + ': record context');
            if (id === 'RISK-004') {
                if (!state.owners[0]?.includes('陈默（拟任）') || !state.owners[1]?.includes('陆明远（拟任）') || !state.owners.every(text => text.includes('签认待确认'))) failures.push(id + ': proposed owners');
            } else if (!state.owners.every(text => text.includes('待确认') && text.includes(id) && !/陈默|陆明远|赵建国/.test(text))) failures.push(id + ': unknown owners');
        }
    }
    page.off('pageerror', onError);
    return { views, clicks, failures, errors };
};
