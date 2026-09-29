import {test,expect,type Page} from '@playwright/test';
const scene=async(p:Page,name:string)=>expect(p.locator(`[data-scene="${name}"]`)).toHaveCSS('opacity','1',{timeout:10000});
test('成品预览直接进入分享，调整可选且返回保留',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 await expect(page.locator('[data-trip-box]')).toHaveCount(3);
 await page.locator('[data-trip-box="osaka-2026"]').click();await page.getByRole('button',{name:'打开相册',exact:true}).click();await scene(page,'workspace');
 await expect(page.locator('[data-group-id]')).toHaveCount(1);
 await expect(page.locator('[data-composition=sticker-cover]')).toHaveAttribute('data-elements','10');
 await page.screenshot({path:info.outputPath('japan-dense-cover.png')});
 await page.locator('[data-group-id="osaka-spring"]').click();await scene(page,'groupDetail');
 await expect(page.getByRole('button',{name:'印这一组',exact:true})).toHaveCount(0);
 const preview=page.locator('[data-testid=current-photo] [data-publish-photo]');await expect(preview).toHaveAttribute('data-publish-photo','editorial-31239492');
 await expect(preview.locator('[data-sticker-id]')).toHaveCount(3);
 await page.screenshot({path:info.outputPath('share-preview.png')});
 const action=page.getByRole('button',{name:'分享这一组',exact:true}),box=await action.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(52);expect(box!.y+box!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
 await page.getByRole('button',{name:'下一张照片',exact:true}).click();await expect(preview).toHaveAttribute('data-publish-photo','editorial-4058521');
 await page.getByRole('button',{name:'调整本组',exact:false}).click();await page.getByRole('button',{name:'移出本组',exact:true}).click();await page.getByRole('button',{name:'撤销上一步',exact:true}).click();await page.getByRole('button',{name:'关闭调整本组'}).click();
 await action.click();await scene(page,'gallery');await expect(page.locator('[data-scene=printing]')).toHaveCount(0);await expect(page.locator('[data-composition=photo-and-sticker]')).toHaveCount(9);
 await page.screenshot({path:info.outputPath('share-actions.png')});
 await page.getByRole('group',{name:'快捷配文语气'}).getByRole('button',{name:'有梗'}).click();
 await page.getByRole('button',{name:'保存发布图片',exact:true}).click();await expect(page.getByText('已模拟保存封面和 9 张发布图片，未写入相册。',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'去分享',exact:true}).click();await page.getByRole('button',{name:'分享至小红书 模拟',exact:true}).click();await expect(page.getByText('已模拟准备分享至小红书：9 张手账与配文。未发送或发布任何内容。',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'返回照片组',exact:true}).click();await scene(page,'groupDetail');await expect(page.locator('[data-thumb-id]')).toHaveCount(9);
 await page.getByRole('button',{name:'← 返回照片工作桌',exact:true}).click();await scene(page,'workspace');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
});
test('旧素材与贴纸重新进入旅程，分组都能组成四张以上',async({page},info)=>{
 await page.goto('/');await page.locator('[data-trip-box="italy-2026"]').click();await page.getByRole('button',{name:'打开相册',exact:true}).click();await scene(page,'workspace');
 await page.screenshot({path:info.outputPath('mountain-sea-cover.png')});await expect(page.locator('[data-group-id]')).toHaveCount(1);
 await page.locator('[data-group-id="alpine-lake"]').click();await scene(page,'groupDetail');
 for(const id of ['18546565','19137460','4321815','16660722']){
  await page.locator(`[data-thumb-id="editorial-${id}"]`).click();await expect(page.locator('[data-testid=current-photo] [data-publish-photo]')).toHaveAttribute('data-publish-photo',`editorial-${id}`);await expect(page.locator('[data-testid=current-photo] [data-sticker-id]').first()).toBeVisible();
 }
 await page.screenshot({path:info.outputPath('old-photo-new-page.png')});
 await page.getByRole('button',{name:'← 返回照片工作桌',exact:true}).click();await scene(page,'workspace');
 for(const mode of ['我们','一路发现','同一种感觉']){await page.getByRole('radio',{name:mode,exact:true}).click();await expect(page.locator('[data-group-id]').first()).toHaveAttribute('aria-label',/，(?:[4-9]|\d{2})张/);await expect(page.locator('[data-pile-phase]')).toHaveAttribute('data-pile-phase','settled');}
 await page.getByRole('button',{name:'返回旅行盒子'}).click();await scene(page,'tripShelf');
 await page.getByRole('button',{name:'打开全部旅行贴纸册'}).click();await scene(page,'stickerCollection');await page.getByRole('button',{name:'查看贴纸：两把纸伞',exact:true}).click();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'导出这枚透明贴纸 PNG'}).click();await (await download).saveAs(info.outputPath('parasols.png'));
});

