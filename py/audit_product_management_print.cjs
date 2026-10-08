// Playwright CLI run-code：理论保留管理内容，登记单打印仅呈现实际记录。
async (page) => {
    const results = [];
    const slugs = ['product-register', 'product-description', 'project-brief', 'project-product-description', 'risk-register', 'issue-register', 'lessons-log', 'quality-register', 'quality-management-approach', 'work-package-description'];
    const counts = { 'product-register': 14, 'risk-register': 3, 'issue-register': 1, 'lessons-log': 3, 'quality-register': 2 };
    for (const slug of slugs) {
        for (const mode of ['theory', 'case']) {
            await page.goto('http://127.0.0.1:8000/entities/product-detail-v2.html?entry=' + slug + '&mode=' + mode + '&v=management-1');
            await page.emulateMedia({ media: 'print' });
            const result = await page.evaluate(() => ({
                matrix: document.getElementById('product-duty-matrix').getBoundingClientRect().height > 0,
                flow: document.getElementById('product-management-usage').getBoundingClientRect().height > 0,
                records: [...document.querySelectorAll('.lesson-detail')].filter(e => e.getBoundingClientRect().height > 0).length,
                document: !!window.PRINCE2RegisterDocuments[document.body.dataset.workspaceEntry]
            }));
            const paper = mode === 'case' && (result.document || Boolean(counts[slug]));
            if (result.matrix === paper || result.flow === paper || (paper && counts[slug] && result.records !== counts[slug])) throw new Error(JSON.stringify({ slug, mode, result }));
            results.push({ slug, mode, ...result });
            await page.emulateMedia({ media: 'screen' });
        }
    }
    return { pass: true, combinations: results.length, results };
}
