async (page) => {
    await page.emulateMedia({media:'screen', reducedMotion:'no-preference'});
    await page.setViewportSize({width:1440,height:1000});
    const results = [];
    for (const route of ['ch03.html#source-remaining-communication-management-approach-purpose',
        'ch07.html#source-remaining-stage-plan-definition',
        'appendix_a.html#source-remaining-lessons-report-purpose']) {
        await page.goto('http://127.0.0.1:8000/chapters/' + route);
        await page.evaluate(() => document.fonts.ready);
        const before = await page.evaluate(() => {
            const target = document.querySelector('.source-reference-target:target');
            return {targets:document.querySelectorAll('.source-reference-target:target').length,
                top:target.getBoundingClientRect().top, animation:getComputedStyle(target).animationName};
        });
        await page.waitForTimeout(2200);
        const after = await page.evaluate(() => getComputedStyle(document.querySelector('.source-reference-target:target')).backgroundColor);
        const transparent = after === 'transparent' || /(?:\/|,)\s*0(?:\.0+)?\)$/.test(after);
        if (before.targets !== 1 || before.animation !== 'source-reference-flash' || Math.abs(before.top-88)>1 || !transparent) throw new Error(JSON.stringify({route,before,after}));
        results.push({route,before,after});
    }
    await page.emulateMedia({reducedMotion:'reduce'});
    const reduced = await page.evaluate(() => getComputedStyle(document.querySelector('.source-reference-target:target')).animationName);
    if (reduced !== 'none') throw new Error('Reduced-motion setting not respected');
    await page.emulateMedia({reducedMotion:'no-preference'});
    return {pass:true, results, reducedMotion:reduced};
}
