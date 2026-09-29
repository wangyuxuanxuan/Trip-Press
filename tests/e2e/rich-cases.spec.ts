import {test,expect,type Page} from '@playwright/test';
const ready=async(page:Page,name:string)=>{await expect(page.locator(`[data-scene="${name}"]`)).toHaveCSS('opacity','1',{timeout:10000});};
const settled=async(page:Page)=>{await expect(page.locator('[data-pile-phase]')).toHaveAttribute('data-pile-phase','settled');};
test('完整旅程的四种视角、密集封面与发布后返回',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('[data-trip-box]')).toHaveCount(4);
 await page.locator('[data-trip-box="italy-2026"]').click();await page.getByRole('button',{name:'打开相册',exact:true}).click();await ready(page,'workspace');
 await expect(page.getByText('2026.06.08—06.15 · 17张',{exact:true})).toBeVisible();
 await expect(page.locator('[data-group-id]')).toHaveCount(3);await settled(page);
 await expect(page.locator('[data-group-id="alpine-lake"] [data-composition=sticker-cover]')).toHaveAttribute('data-elements','7');
 await page.screenshot({path:info.outputPath('italy-moments.png')});
 for(const [label,ids] of [['我们',['italy-together','italy-glances']],['一路发现',['italy-boats','italy-facades']],['同一种感觉',['italy-water','italy-light']]] as const){
  await page.getByRole('radio',{name:label,exact:true}).click();await settled(page);
  await expect(page.locator('[data-group-id]')).toHaveCount(2);
  for(const id of ids)await expect(page.locator(`[data-group-id="${id}"]`)).toBeVisible();
  await settled(page);
  await expect(page.locator('[data-photo-layer]').first()).toHaveCSS('opacity','1');
  if(label==='一路发现')await expect(page.locator('[data-group-id="italy-boats"] [data-sticker-id]').first()).toHaveAttribute('data-sticker-id','oar-boat');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:info.outputPath(`${ids[0]}.png`)});
 }
 await page.getByRole('radio',{name:'我们',exact:true}).click();await settled(page);
 await page.locator('[data-group-id="italy-together"]').click();await ready(page,'groupDetail');
 await page.getByRole('button',{name:'印这一组',exact:true}).click();await ready(page,'gallery');
 await expect(page.locator('[data-composition=photo-and-sticker]')).toHaveCount(4);
 await page.screenshot({path:info.outputPath('people-package.png')});
 await page.getByRole('button',{name:'返回工作桌',exact:true}).click();await ready(page,'workspace');
 await expect(page.getByRole('radio',{name:'我们',exact:true})).toHaveAttribute('aria-checked','true');
 await expect(page.locator('[data-group-id="italy-together"]')).toBeVisible();expect(errors).toEqual([]);
});
test('不同风景仍有独立素材，摄影纸片可导出',async({page},info)=>{
 await page.goto('/');await page.locator('[data-trip-box="desert"]').click();await page.getByRole('button',{name:'打开相册',exact:true}).click();await ready(page,'workspace');
 await expect(page.locator('[data-group-id]')).toHaveCount(2);await page.getByRole('radio',{name:'我们',exact:true}).click();await settled(page);await expect(page.locator('[data-group-id="desert-company"]')).toBeVisible();
 await page.goto('/');await page.getByRole('button',{name:'打开全部旅行贴纸册'}).click();await ready(page,'stickerCollection');
 await page.getByRole('button',{name:'查看贴纸：牵手走过水边',exact:true}).click();
 const downloaded=page.waitForEvent('download');await page.getByRole('button',{name:'导出这枚透明贴纸 PNG'}).click();await (await downloaded).saveAs(info.outputPath('photo-sticker.png'));
 await expect(page.getByText('透明 PNG 已生成，下载已开始。',{exact:true})).toBeVisible();
});
