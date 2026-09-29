import {test,expect,type Page} from '@playwright/test';
async function detail(page:Page){await page.goto('/');await page.getByRole('button',{name:'预览大阪散步日记'}).click();await page.getByRole('button',{name:'打开相册',exact:true}).click();await page.getByRole('button',{name:/大阪的红色，8张/}).click();await expect(page.locator('[data-scene="groupDetail"]')).toHaveCSS('opacity','1');}
test('四阶段插画印刷，3到5秒自动入墙，返回完成页不再次跳转',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await detail(page);
 await page.getByRole('button',{name:'印这一组'}).evaluate(button=>{
  button.addEventListener('click',()=>{document.documentElement.dataset.printStarted=String(performance.now());},{once:true});
  const observer=new MutationObserver(()=>{if(document.querySelector('[data-scene="gallery"]')){document.documentElement.dataset.printArrived=String(performance.now());observer.disconnect();}});
  observer.observe(document.body,{childList:true,subtree:true});
 });
 await page.getByRole('button',{name:'印这一组'}).click();const theatre=page.getByTestId('print-theatre');
 await expect(theatre).toHaveAttribute('data-stage','0');await expect(page.getByRole('status')).toContainText('整理照片顺序');
 await expect(page.getByTestId('print-input')).toHaveAttribute('aria-label','整组 8 张照片送入印刷机');
 await expect(theatre).toHaveAttribute('data-stage','1');await expect(page.getByRole('status')).toContainText('提取旅行元素');
 await expect(page.locator('[data-kind]')).toHaveCount(8);
 await expect(page.locator('[data-kind="person"] image')).toHaveAttribute('href','/assets/photos/companion.jpg');
 await page.waitForTimeout(550);
 if(info.project.name==='reduced-motion'){
  const transforms=await page.locator('[data-kind], [data-testid="print-input"]').evaluateAll(els=>els.map(el=>getComputedStyle(el).transform));expect(transforms.every(t=>t==='none')).toBe(true);
 }
 await page.screenshot({path:`test-results/${info.project.name}-printing-elements.png`});
 await expect(theatre).toHaveAttribute('data-stage','2');await expect(page.getByRole('status')).toContainText('制作贴纸与拼贴');
 await expect(theatre).toHaveAttribute('data-stage','3');await expect(page.getByRole('status')).toContainText('生成社交配文');
 await expect(page.locator('[data-output-paper]')).toHaveCount(3);
 if(info.project.name==='reduced-motion'){
  const positions=await page.locator('[data-output-paper]').evaluateAll(els=>els.map(el=>({top:el.getBoundingClientRect().top,left:el.getBoundingClientRect().left,transform:getComputedStyle(el).transform})));
  expect(new Set(positions.map(p=>p.top)).size).toBe(3);expect(new Set(positions.map(p=>p.left)).size).toBe(3);expect(positions.every(p=>p.transform==='none')).toBe(true);
 }
 await page.screenshot({path:`test-results/${info.project.name}-printing-output.png`});
 await expect(page.locator('[data-scene="gallery"]')).toBeVisible();
 const elapsed=await page.evaluate(()=>Number(document.documentElement.dataset.printArrived)-Number(document.documentElement.dataset.printStarted));expect(elapsed).toBeGreaterThan(3000);expect(elapsed).toBeLessThan(5000);
 await expect(page.getByRole('article')).toHaveCount(10);
 await page.getByRole('button',{name:'← 返回作品生成过程'}).click();await expect(theatre).toHaveAttribute('data-status','complete');await page.waitForTimeout(600);
 await expect(page.locator('[data-scene="printing"]')).toBeVisible();await expect(page.getByRole('button',{name:'查看发布包'})).toBeEnabled();
 await page.getByRole('button',{name:'← 返回照片组详情'}).click();await expect(page.getByRole('heading',{level:1})).toHaveText('大阪的红色');
 expect(errors).toEqual([]);
});
test('失败皱纸、重新印刷、取消及安全区',async({page},info)=>{
 test.setTimeout(30000);await detail(page);
 await page.evaluate(()=>{document.documentElement.style.setProperty('--safe-top','47px');document.documentElement.style.setProperty('--safe-bottom','34px');});
 await page.getByRole('button',{name:'印这一组'}).click();await page.getByRole('button',{name:'演示一次印刷失败'}).click();
 const theatre=page.getByTestId('print-theatre');await expect(theatre).toHaveAttribute('data-status','failed');
 await expect(page.getByRole('heading',{level:1})).toHaveText('这一版没有印好，再试一次。');
 await expect(page.getByTestId('failed-paper')).toBeVisible();await expect(page.locator('[data-output-paper]')).toHaveCount(0);
 const retry=page.getByRole('button',{name:'重新印刷'});await expect(retry).toBeInViewport();expect((await retry.boundingBox())!.height).toBeGreaterThanOrEqual(52);
 await expect(page.locator('footer')).toHaveCSS('padding-bottom','34px');
 await page.waitForTimeout(600);await page.screenshot({path:`test-results/${info.project.name}-printing-failed.png`});
 await page.waitForTimeout(3600);await expect(theatre).toHaveAttribute('data-status','failed');
 await retry.click();await expect(theatre).toHaveAttribute('data-status','running');await expect(theatre).toHaveAttribute('data-stage','0');await expect(page.getByTestId('failed-paper')).toHaveCount(0);
 await expect(page.locator('[data-scene="gallery"]')).toBeVisible({timeout:6000});
 await page.getByRole('button',{name:'← 返回作品生成过程'}).click();await page.getByRole('button',{name:'← 返回照片组详情'}).click();
 await page.getByRole('button',{name:'印这一组'}).click();await page.getByRole('button',{name:'← 返回照片组详情'}).click();await expect(page.locator('[data-scene="groupDetail"]')).toBeVisible();
 await page.waitForTimeout(4500);await expect(page.locator('[data-scene="groupDetail"]')).toBeVisible();
});

