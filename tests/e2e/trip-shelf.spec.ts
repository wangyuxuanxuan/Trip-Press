import {test,expect} from '@playwright/test';
test('静态样册与真实相册入口保持独立',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 await expect(page.locator('[data-trip-box]')).toHaveCount(8);
 for(const name of ['青岛周末','京都下雨天','云南夏天']){
  const trigger=page.getByRole('button',{name:`预览${name}`});await trigger.click();
  const dialog=page.getByRole('dialog',{name});await expect(dialog).toContainText('静态旅行样盒');
  await page.getByRole('button',{name:'收好这只盒子'}).click();await expect(dialog).toHaveCount(0);await expect(trigger).toBeFocused();
 }
 await page.evaluate(()=>{document.documentElement.style.setProperty('--safe-top','47px');document.documentElement.style.setProperty('--safe-bottom','34px');});
 const printer=page.getByRole('button',{name:'导入旅行照片，开启照片导入'});await printer.scrollIntoViewIfNeeded();
 const box=await printer.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(52);expect(box!.y).toBeGreaterThan(47);
 const chooser=page.waitForEvent('filechooser');await printer.click();await (await chooser).setFiles([]);
 await expect(page.getByRole('heading',{level:1})).toHaveText('把旅行，印成回忆');await expect(page.getByTestId('home-import-animation')).toHaveCount(0);
 await page.screenshot({path:info.outputPath('home-safe.png')});
 await page.getByRole('button',{name:'预览大阪散步日记'}).click();await page.getByRole('button',{name:'打开相册',exact:true}).click();await expect(page.locator('[data-scene="workspace"]')).toBeVisible();expect(errors).toEqual([]);
});
