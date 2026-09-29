import {test,expect} from '@playwright/test';
const ready=async(page:import('@playwright/test').Page,scene:string)=>{await expect(page.locator(`[data-scene="${scene}"]`)).toHaveCSS('opacity','1',{timeout:10000});};
test('一趟旅行、选择性分组、人物页与返回保留',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 await expect(page.locator('[data-trip-box]')).toHaveCount(4);
 await page.getByRole('button',{name:'预览2026.04 日本春游'}).click();await page.getByRole('button',{name:'打开相册',exact:true}).click();await ready(page,'workspace');
 await expect(page.locator('[data-group-id]')).toHaveCount(3);
 await expect(page.locator('[data-group-id="osaka-red"]')).toHaveCount(0);
 await page.getByRole('radio',{name:'我们',exact:true}).click();await expect(page.locator('[data-group-id="japan-company"]')).toBeVisible();await expect(page.locator('[data-group-id]')).toHaveCount(2);
 await expect(page.locator('[data-pile-phase]')).toHaveAttribute('data-pile-phase','settled');await page.screenshot({path:info.outputPath('people-view.png')});
 await page.getByRole('radio',{name:'一路发现',exact:true}).click();await expect(page.locator('[data-group-id]')).toHaveCount(3);
 await expect(page.locator('[data-composition=sticker-cover]')).toHaveCount(3);
 await page.getByRole('radio',{name:'同一种感觉',exact:true}).click();await expect(page.locator('[data-group-id]')).toHaveCount(3);
 await page.locator('[data-group-id="japan-pink"]').click();await ready(page,'groupDetail');
 await page.getByRole('button',{name:'← 返回照片工作桌',exact:true}).click();await ready(page,'workspace');await expect(page.getByRole('radio',{name:'同一种感觉',exact:true})).toHaveAttribute('aria-checked','true');
 await page.screenshot({path:info.outputPath('color-view.png')});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
});
test('沙漠与草原保留各自照片与可用的成品',async({page},info)=>{
 test.setTimeout(90000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [id,group,sticker] of [['desert','desert-ridges','dune-landscape'],['grassland','grass-valley','green-valley']]){
  await page.goto('/');await page.locator(`[data-trip-box="${id}"]`).click();await expect(page.getByRole('dialog').locator(`[data-sticker-id="${sticker}"]`)).toBeVisible();await page.screenshot({path:info.outputPath(`${id}-preview.png`)});
  await page.getByRole('button',{name:'打开相册',exact:true}).click();await ready(page,'workspace');await page.locator(`[data-group-id="${group}"]`).click();await ready(page,'groupDetail');
  await page.getByRole('button',{name:'印这一组',exact:true}).click();await ready(page,'gallery');
  await expect(page.locator(`[data-composition="sticker-cover"] [data-sticker-id="${sticker}"]`).first()).toBeVisible();await expect(page.locator('[data-composition="photo-and-sticker"]')).toHaveCount(id==='desert'?2:1);
  await page.screenshot({path:info.outputPath(`${id}-package.png`)});
  await page.getByRole('button',{name:/旅行贴纸册 小物件/}).click();await ready(page,'stickerCollection');await expect(page.locator(`[data-sticker-id="${sticker}"]`).first()).toBeVisible();
 }
 expect(errors).toEqual([]);
});
