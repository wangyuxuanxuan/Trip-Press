import {test,expect} from '@playwright/test';
const scene=(page:import('@playwright/test').Page,name:string)=>expect(page.locator(`[data-scene="${name}"]`)).toHaveCSS('opacity','1',{timeout:10000});
const osaka=async(page:import('@playwright/test').Page)=>{await page.getByRole('button',{name:'预览2026.04 日本春游'}).click();await page.getByRole('button',{name:'打开相册',exact:true}).click();await scene(page,'workspace');};
test('首页直接选择照片，在原位整理；新旅行照片贯穿发布与返回',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/');
 await page.screenshot({path:info.outputPath('home.png')});
 const chooser=page.waitForEvent('filechooser');await page.getByRole('button',{name:'导入旅行照片，开启照片导入'}).click();
 await (await chooser).setFiles(['public/assets/photos/shrine.jpg','public/assets/photos/red.jpg','public/assets/photos/ramen.jpg']);
 await expect(page.getByTestId('home-import-animation')).toBeVisible();await scene(page,'tripShelf');
 await expect(page.getByRole('heading',{name:'把旅行，印成回忆'})).toBeVisible();
 await page.screenshot({path:info.outputPath('import.png')});
 await scene(page,'workspace');await expect(page.getByText('地点待填写',{exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:/查看完整照片组/})).toHaveCount(1);
 await page.getByRole('button',{name:/查看完整照片组/}).click();await scene(page,'groupDetail');
 await expect(page.locator('[data-thumb-id]')).toHaveCount(3);
 await expect(page.locator('[data-scene="groupDetail"] img').first()).toHaveAttribute('src',/^blob:/);
 await page.getByRole('button',{name:'印这一组',exact:true}).click();await scene(page,'printing');await scene(page,'gallery');
 await expect(page.getByRole('article')).toHaveCount(6);await expect(page.locator('[data-scene="gallery"]')).not.toContainText('大阪');
 await page.getByRole('button',{name:/旅行贴纸册 小物件/}).click();await scene(page,'stickerCollection');
 await expect(page.getByText('这趟旅行，留待收集。')).toBeVisible();
 await page.getByRole('button',{name:/第 1 版 旅行片段/}).click();await scene(page,'gallery');
 await page.getByRole('button',{name:'返回工作桌',exact:true}).click();await scene(page,'workspace');
 await page.getByRole('button',{name:'← 返回旅行盒子'}).click();await scene(page,'tripShelf');
 await page.getByRole('button',{name:/预览.*地点待填写/}).click();await page.getByRole('button',{name:'打开相册',exact:true}).click();await scene(page,'workspace');
 expect(errors).toEqual([]);
});
test('贴纸收藏和发布包分开，示例全流程可往返',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await page.goto('/');
 await page.getByRole('button',{name:'打开全部旅行贴纸册'}).click();await scene(page,'stickerCollection');
 await page.screenshot({path:info.outputPath('collection.png')});
 await expect(page.getByRole('button',{name:'全部旅行',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'查看贴纸：花下灯笼'}).click();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'导出这枚透明贴纸 PNG'}).click();expect((await download).suggestedFilename()).toContain('lantern');
 await page.getByRole('dialog').getByRole('button',{name:/关闭/}).click();
 await page.getByRole('button',{name:'返回上一页'}).click();await scene(page,'tripShelf');
 await osaka(page);await page.getByRole('radio',{name:'同一种感觉'}).click();await expect(page.locator('[data-pile-phase]')).toHaveAttribute('data-pile-phase','settled');
 await page.getByRole('button',{name:/查看完整照片组：花枝里的浅粉/}).click();await scene(page,'groupDetail');await page.screenshot({path:info.outputPath('detail.png')});
 await page.getByRole('button',{name:'印这一组',exact:true}).click();await scene(page,'printing');await page.screenshot({path:info.outputPath('printing.png')});await scene(page,'gallery');
 await expect(page.getByRole('article')).toHaveCount(6);await page.screenshot({path:info.outputPath('package.png')});
 await page.getByRole('button',{name:'有梗',exact:true}).click();await expect(page.getByTestId('art-content-caption')).toContainText('照片拍了，喜欢的小细节也一起收好了。');
 await page.getByRole('button',{name:'保存整套 · 6 件'}).click();await expect(page.getByRole('status')).toContainText('已模拟保存整套');
 await page.getByRole('button',{name:'模拟分享',exact:true}).click();await expect(page.getByRole('status')).toContainText('已模拟分享配文');
 await page.getByRole('button',{name:'返回工作桌',exact:true}).click();await scene(page,'workspace');
 await page.getByRole('button',{name:'查看当前旅行贴纸册'}).click();await scene(page,'stickerCollection');
 await expect(page.getByRole('button',{name:'2026.04 日本春游',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:/第 1 版 花枝里的浅粉/}).click();await scene(page,'gallery');
 await page.getByRole('button',{name:'← 返回旅行贴纸册'}).click();await scene(page,'stickerCollection');
 await page.getByRole('button',{name:'返回上一页'}).click();await scene(page,'workspace');await page.getByRole('button',{name:'← 返回旅行盒子'}).click();await scene(page,'tripShelf');
 expect(errors).toEqual([]);
});
test('取消与坏图都停在首页，允许重试',async({page})=>{
 await page.goto('/');
 await page.getByLabel('选择旅行照片').setInputFiles({name:'broken.jpg',mimeType:'image/jpeg',buffer:Buffer.from('not-an-image')});
 await expect(page.getByRole('alert')).toContainText('无法读取');await scene(page,'tripShelf');
 await page.getByLabel('选择旅行照片').setInputFiles(['public/assets/photos/red.jpg']);
 await expect(page.getByTestId('home-import-animation')).toBeVisible();await page.getByRole('button',{name:'取消整理'}).click();
 await expect(page.getByTestId('home-import-animation')).toHaveCount(0);await page.waitForTimeout(4500);await scene(page,'tripShelf');
 await expect(page.getByRole('button',{name:/预览.*地点待填写/})).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});



