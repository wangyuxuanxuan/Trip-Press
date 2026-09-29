import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const natural='回来整理照片才发现，大阪好像一直在用红色提醒我看它。';
const fun='去了五天大阪，景点没记住几个，红色倒是收集了一整套。';
const mood='红色的招牌、雨伞和晚霞，把散落的几天重新串在了一起。';
async function openGallery(page:Page){
 await page.goto('/');await page.getByRole('button',{name:'预览大阪散步日记'}).click();await page.getByRole('button',{name:'打开相册',exact:true}).click();
 await page.getByRole('button',{name:/大阪的红色，8张/}).click();await page.getByRole('button',{name:'印这一组'}).click();
 await expect(page.locator('[data-scene="gallery"]')).toBeVisible({timeout:10000});
 await expect(page.locator('[data-scene="gallery"]')).toHaveCSS('opacity','1');
}
test('十件纸张作品、放大还原、排版与整套导航',async({page})=>{
 test.setTimeout(60000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await openGallery(page);
 await expect(page.locator('[data-wall-piece]')).toHaveCount(10);
 await expect(page.locator('[data-wall-piece^="slide-"]')).toHaveCount(6);
 const cover=page.locator('[data-artwork-id="cover"]');await expect(cover).toContainText('APRIL 12—16, 2026');await expect(cover).toContainText('OSAKA WALKING NOTES');
 const photo=await cover.locator('img').getAttribute('src');await expect(cover.locator('[data-source-photo]')).toHaveAttribute('data-source-photo',photo!);
 for(const layout of ['海报留白','明信片','旅行手账'])await page.getByRole('group',{name:'整套排版'}).getByRole('button',{name:layout}).click();
 const ids=await page.locator('[data-artwork-id]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-artwork-id')!));
 for(const id of ids){
  const source=page.locator(`[data-artwork-id="${id}"]`);await source.scrollIntoViewIfNeeded();
  const before=await page.locator('main').evaluate(el=>el.scrollTop);await source.click();
  const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();await expect(dialog.getByTestId(`art-content-${id}`)).toBeVisible();
  await expect(dialog.getByRole('button',{name:'保存单张'})).toBeInViewport();
  await expect(dialog.getByRole('button',{name:'旅行手账'})).toHaveCSS('color','rgb(150, 63, 51)');
  await expect(dialog.getByRole('button',{name:'明信片'})).toHaveCSS('color','rgb(23, 57, 76)');
  if(id==='collage'){await dialog.getByRole('button',{name:'保存单张'}).click();await expect(dialog.getByRole('status')).toContainText('已模拟保存');await dialog.getByRole('button',{name:'分享此作品'}).click();await expect(dialog.getByRole('status')).toContainText('已模拟分享');}
  await dialog.getByRole('button',{name:'关闭作品预览'}).click();await expect(dialog).toHaveCount(0);await expect(source).toBeFocused();
  expect(Math.abs(await page.locator('main').evaluate(el=>el.scrollTop)-before)).toBeLessThan(2);
 }
 await page.getByRole('button',{name:'保存整套 · 10 件'}).click();await expect(page.getByRole('status')).toContainText('整套 10 件');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'返回照片组',exact:true}).click();await expect(page.locator('[data-scene="groupDetail"]')).toBeVisible();await expect(page.locator('[data-thumb-id]')).toHaveCount(8);
 await page.getByRole('button',{name:'← 返回照片工作桌'}).click();await page.getByRole('button',{name:'查看当前旅行贴纸册'}).click();await page.getByRole('button',{name:/第 1 版/}).click();await expect(page.locator('[data-wall-piece]')).toHaveCount(10);
 await page.getByRole('button',{name:'返回工作桌',exact:true}).click();await expect(page.locator('[data-scene="workspace"]')).toBeVisible();expect(errors).toEqual([]);
});
test('标题和三种配文独立编辑保留、键盘避让、复制分享',async({page})=>{
 await openGallery(page);await page.getByRole('button',{name:'修改标题'}).click();await expect(page.getByRole('textbox')).toBeFocused();
 await page.getByRole('textbox').fill('取消标题');await page.getByRole('button',{name:'取消',exact:true}).click();await expect(page.getByRole('heading',{level:1})).toHaveText('大阪的红色');
 await page.getByRole('button',{name:'修改标题'}).click();await page.getByRole('textbox').fill('大阪 · 红色收藏');await page.getByRole('button',{name:'完成',exact:true}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('大阪 · 红色收藏');
 const caption=page.locator('[data-artwork-id="caption"]');await expect(caption).toContainText(natural);
 const tones=page.getByRole('group',{name:'配文语气'});await tones.getByRole('button',{name:'有梗'}).click();await expect(caption).toContainText(fun);
 await tones.getByRole('button',{name:'氛围'}).click();await expect(caption).toContainText(mood);await tones.getByRole('button',{name:'自然'}).click();
 await page.getByRole('button',{name:'修改文字'}).click();await expect(page.getByRole('textbox')).toBeFocused();
 await page.evaluate(()=>{Object.defineProperty(window.visualViewport,'height',{configurable:true,value:480});window.visualViewport!.dispatchEvent(new Event('resize'));});
 await expect(page.getByRole('button',{name:'完成',exact:true})).toBeInViewport();const rect=await page.getByRole('dialog').boundingBox();expect(rect!.y+rect!.height).toBeLessThanOrEqual(481);
 await page.getByRole('textbox').fill('带回来一整墙的红色。');await page.getByRole('button',{name:'完成',exact:true}).click();
 await page.evaluate(()=>{delete(window.visualViewport as unknown as {height?:number}).height;window.visualViewport!.dispatchEvent(new Event('resize'));});
 await tones.getByRole('button',{name:'有梗'}).click();await expect(caption).toContainText(fun);await tones.getByRole('button',{name:'自然'}).click();await expect(caption).toContainText('带回来一整墙的红色。');
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text:string)=>{document.documentElement.dataset.copied=text;}}}));
 await page.getByRole('button',{name:'复制配文'}).click();await expect(page.locator('html')).toHaveAttribute('data-copied','带回来一整墙的红色。');await expect(page.getByRole('status')).toContainText('配文已复制');
 await page.getByRole('button',{name:'模拟分享',exact:true}).click();await expect(page.getByRole('status')).toContainText('已模拟分享配文');
 await page.getByRole('group',{name:'整套排版'}).getByRole('button',{name:'明信片'}).click();
 await page.getByRole('button',{name:'返回工作桌',exact:true}).click();await page.getByRole('button',{name:'查看当前旅行贴纸册'}).click();await page.getByRole('button',{name:/第 1 版/}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('大阪 · 红色收藏');await expect(caption).toContainText('带回来一整墙的红色。');await expect(page.getByRole('button',{name:'明信片',exact:true})).toHaveAttribute('aria-pressed','true');
});
test('下载透明 PNG，八枚贴纸与真实人物均有像素',async({page},info)=>{
 await openGallery(page);await page.getByRole('button',{name:'导出透明贴纸 PNG',exact:true}).scrollIntoViewIfNeeded();
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'导出透明贴纸 PNG',exact:true}).click();const download=await downloadPromise;
 expect(download.suggestedFilename()).toBe('trip-press-osaka-stickers.png');const file=info.outputPath('stickers.png');await download.saveAs(file);
 const data=(await readFile(file)).toString('base64');
 const pixels=await page.evaluate(async(base64)=>{
  const img=new Image();img.src='data:image/png;base64,'+base64;await img.decode();const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;const c=canvas.getContext('2d')!;c.drawImage(img,0,0);
  const corner=c.getImageData(0,0,1,1).data[3];const occupied:number[]=[];
  for(let i=0;i<8;i++){const d=c.getImageData((13+(i%3)*126)*3,(5+Math.floor(i/3)*146)*3,280,380).data;let count=0;for(let p=3;p<d.length;p+=4)if(d[p]>200)count++;occupied.push(count);}
  const face=c.getImageData(115,940,85,85).data;const colors=new Set<string>();for(let p=0;p<face.length;p+=4)if(face[p+3]>200)colors.add(`${face[p]},${face[p+1]},${face[p+2]}`);
  return {width:img.width,height:img.height,corner,occupied,faceColors:colors.size};
 },data);
 expect(pixels.width).toBe(1140);expect(pixels.height).toBe(1320);expect(pixels.corner).toBe(0);for(const count of pixels.occupied)expect(count).toBeGreaterThan(5000);expect(pixels.faceColors).toBeGreaterThan(150);
 await expect(page.getByRole('status')).toContainText('下载已开始');
});


