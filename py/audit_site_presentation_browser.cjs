async (page) => {
await page.route('**/*', route => route.continue());
const routes = ["entities/product-detail-v2.html?entry=issue-register&mode=theory","entities/product-detail-v2.html?entry=issue-register&mode=case","cases/product-description-waterproofing.html","cases/product-register.html","cases/project-brief.html","cases/project-product-description.html","cases/renovation.html","cases/risk-lessons-records.html","cases/waterproof-quality-records.html","chapters/appendix_a.html","chapters/appendix_b.html","chapters/ch01.html","chapters/ch02.html","chapters/ch03.html","chapters/ch04.html","chapters/ch05.html","chapters/ch06.html","chapters/ch07.html","chapters/ch08.html","chapters/ch09.html","chapters/ch10.html","chapters/ch11.html","chapters/ch12.html","chapters/ch13.html","chapters/ch14.html","chapters/ch15.html","chapters/ch16.html","chapters/ch17.html","chapters/ch18.html","chapters/ch19.html","chapters/glossary.html","color-schemes.html","entities/practice.html","entities/principle.html","entities/process.html","entities/product-detail-v2.html","entities/product-overview-v2.html","entities/product-register-v2.html","entities/product.html","entities/role.html","entities/term.html","graph-full.html","graph.html","index.html","process-trigger.html","processes/cp.html","processes/cs.html","processes/dp.html","processes/ip.html","processes/mp.html","processes/sb.html","processes/su.html","entities/product-detail-v2.html?entry=outline-business-case&mode=theory","entities/product-detail-v2.html?entry=outline-business-case&mode=case","entities/product-detail-v2.html?entry=full-business-case&mode=theory","entities/product-detail-v2.html?entry=full-business-case&mode=case","entities/product-detail-v2.html?entry=product-register&mode=theory","entities/product-detail-v2.html?entry=product-register&mode=case","entities/product-detail-v2.html?entry=product-description&mode=theory","entities/product-detail-v2.html?entry=product-description&mode=case","entities/product-detail-v2.html?entry=project-brief&mode=theory","entities/product-detail-v2.html?entry=project-brief&mode=case","entities/product-detail-v2.html?entry=project-product-description&mode=theory","entities/product-detail-v2.html?entry=project-product-description&mode=case","entities/product-detail-v2.html?entry=risk-register&mode=theory","entities/product-detail-v2.html?entry=risk-register&mode=case","entities/product-detail-v2.html?entry=lessons-log&mode=theory","entities/product-detail-v2.html?entry=lessons-log&mode=case","entities/product-detail-v2.html?entry=quality-register&mode=theory","entities/product-detail-v2.html?entry=quality-register&mode=case","entities/product-detail-v2.html?entry=quality-management-approach&mode=theory","entities/product-detail-v2.html?entry=quality-management-approach&mode=case","entities/product-detail-v2.html?entry=work-package-description&mode=theory","entities/product-detail-v2.html?entry=work-package-description&mode=case"];
const results = [];
for (const width of [1440, 390]) {
 await page.setViewportSize({width, height:1000});
 for (const route of routes) {
  const errors = []; const listener = e => errors.push(e.message); page.on('pageerror', listener);
  try {
   const response = await page.goto('http://127.0.0.1:8000/'+route, {waitUntil:'load'});
   await page.evaluate(() => document.fonts.ready);
   const data = await page.evaluate(() => {
    const candidates = [], ellipsis = [];
     for (const el of document.querySelectorAll('h1,h2,h3,h4,dt,th,button,label,.org-cluster-label,.org-person b,.org-person small,.org-identity')) {
     if (!el.getClientRects().length || getComputedStyle(el).visibility === 'hidden' || el.closest('.detail-panel:not(.open)')) continue;
     const value = el.textContent.trim().replace(/\\s+/g,' ');
     if (!value || value.length > 36) continue;
     const lines = new Map(); const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
     while(walker.nextNode()) { const n=walker.currentNode; for(let i=0;i<n.length;i++) {if(!n.textContent[i].trim() || n.textContent[i]==='＋')continue;const r=document.createRange();r.setStart(n,i);r.setEnd(n,i+1);const b=r.getBoundingClientRect();if(!b.width)continue;const y=[...lines.keys()].find(k=>Math.abs(k-b.y)<9) ?? Math.round(b.y);lines.set(y,(lines.get(y)||'')+n.textContent[i]);} }
     const a=[...lines.values()]; if(a.length>1 && a[a.length-1].length<=2)candidates.push({tag:el.tagName,cls:el.className,text:value,lines:a});
    }
    for(const el of document.querySelectorAll('body *')) {const s=getComputedStyle(el);if(el.getClientRects().length && s.textOverflow==='ellipsis' && el.scrollWidth>el.clientWidth+1)ellipsis.push({cls:el.className,text:el.textContent.trim().slice(0,70)});}
    return {overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),orphans:candidates,ellipsis};
   });
   results.push({route,width,status:response.status(),final:page.url().replace('http://127.0.0.1:8000/',''),...data,errors});
  } catch(e) {results.push({route,width,error:e.message});}
  page.off('pageerror',listener);
 }
}
await page.unroute('**/*');
return results;
}
