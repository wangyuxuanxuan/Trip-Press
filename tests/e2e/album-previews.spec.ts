import {test,expect} from '@playwright/test';
test('all albums have matching themed previews and the bookshelf scrolls',async({page},info)=>{
 await page.goto('/');const shelf=page.getByRole('region',{name:'旅行相册书架'});
 await expect(shelf.locator('[data-trip-box]')).toHaveCount(8);
 const themeFor=async(id:string)=>shelf.locator(`[data-trip-box="${id}"]`).evaluate(el=>getComputedStyle(el).getPropertyValue('--album-primary').trim());
 for(const id of ['osaka-2026','italy-2026','japan-coast','rail-notes','seaside','desert','grassland','alpine']){
  const book=shelf.locator(`[data-trip-box="${id}"]`);await book.click();
  const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
  expect(await dialog.evaluate(el=>getComputedStyle(el).getPropertyValue('--album-primary').trim())).toBe(await themeFor(id));
  const action=dialog.locator('[data-album-action]');const color=await action.evaluate(el=>getComputedStyle(el).backgroundColor);
  if(id==='alpine')expect(color).toBe('rgb(242, 201, 75)');
  await expect(dialog.locator('[data-composition=sticker-cover]')).toBeVisible();
  if(id==='desert')await page.screenshot({path:info.outputPath('desert-preview.png')});
  if(id==='alpine')await page.screenshot({path:info.outputPath('yellow-preview.png')});
  await dialog.getByRole('button',{name:/关闭/}).click();await expect(book).toBeFocused();
 }
 await shelf.evaluate(el=>el.scrollTo({left:0,behavior:'instant'}));
 await page.getByRole('button',{name:'向右浏览相册'}).click();
 await expect.poll(()=>shelf.evaluate(el=>el.scrollLeft)).toBeGreaterThan(100);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const position=await shelf.evaluate(el=>el.scrollLeft);await shelf.locator('[data-trip-box="alpine"]').click();
 await page.getByRole('dialog').getByRole('button',{name:/关闭/}).click();
 expect(await shelf.evaluate(el=>el.scrollLeft)).toBeGreaterThanOrEqual(position-2);
 await shelf.locator('[data-trip-box="osaka-2026"]').click();
 await expect(page.locator('[data-scene="workspace"]')).toHaveCount(0);
 await page.getByRole('button',{name:'打开相册',exact:true}).click();
 await expect(page.locator('[data-scene="workspace"]')).toHaveCSS('opacity','1');
 await page.getByRole('button',{name:'← 返回旅行盒子'}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('touch scroll does not open a book and themed actions clear the safe area',async({page},info)=>{
 test.skip(!info.project.use.hasTouch,'Touch input belongs to phone previews');
 await page.goto('/');const shelf=page.getByRole('region',{name:'旅行相册书架'});
 await shelf.scrollIntoViewIfNeeded();const box=(await shelf.boundingBox())!;
 const cdp=await page.context().newCDPSession(page);const x=box.x+box.width*.85,y=box.y+60;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
 for(let step=1;step<=8;step++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-step*23,y}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await expect.poll(()=>shelf.evaluate(el=>el.scrollLeft)).toBeGreaterThan(60);
 await expect(page.getByRole('dialog')).toHaveCount(0);await cdp.detach();
 await page.evaluate(()=>{document.documentElement.style.setProperty('--safe-top','47px');document.documentElement.style.setProperty('--safe-bottom','34px');});
 await shelf.locator('[data-trip-box="alpine"]').click();
 const dialog=page.getByRole('dialog');const button=dialog.locator('[data-album-action]');await button.scrollIntoViewIfNeeded();
 const action=(await button.boundingBox())!;expect(action.height).toBeGreaterThanOrEqual(52);expect(action.y+action.height).toBeLessThanOrEqual(page.viewportSize()!.height-34);
 await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(shelf.locator('[data-trip-box="alpine"]')).toBeFocused();
 await page.screenshot({path:info.outputPath('scrolling-bookshelf.png')});
});
