import {test,expect} from '@playwright/test';
test('详情选样式，分享只选平台并保留预览',async({page},info)=>{
 await page.goto('/');await page.locator('[data-trip-box="osaka-2026"]').click();await page.getByRole('button',{name:'打开相册',exact:true}).click();await page.locator('[data-group-id="osaka-spring"]').click();
 const options=page.getByRole('group',{name:'作品样式'});
 for(const [label,value] of [['原图','original'],['贴纸集','stickers'],['手账','journal'],['明信片','postcard']]){
  await options.getByRole('button',{name:label,exact:true}).click();await expect(page.locator('[data-selected-effect]')).toHaveAttribute('data-selected-effect',value);
  if(value!=='stickers')await expect(page.locator('[data-testid=current-photo]')).toHaveCSS('opacity','1');
  await page.screenshot({path:info.outputPath(value+'-detail.png')});
  await page.getByRole('button',{name:'分享这一组',exact:true}).click();const dialog=page.getByRole('dialog',{name:'分享这一组'});await expect(dialog).toBeVisible();await expect(dialog.getByRole('group',{name:'分享样式'})).toHaveCount(0);
  for(const platform of ['微信','微博','小红书','抖音']){await dialog.getByRole('button',{name:platform,exact:true}).click();await expect(dialog.locator('[data-effect]')).toHaveAttribute('data-effect',value);}
  await page.getByRole('button',{name:'关闭分享这一组'}).click();await expect(options.getByRole('button',{name:label,exact:true})).toHaveAttribute('aria-pressed','true');
 }
 await page.screenshot({path:info.outputPath('detail-effects.png')});
 await page.getByRole('button',{name:'分享这一组',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'小红书',exact:true}).click();await page.getByRole('button',{name:'分享至小红书 模拟',exact:true}).click();await expect(page.getByText(/已模拟准备分享至小红书：.*明信片/)).toBeVisible();
 await page.getByRole('button',{name:'← 返回照片工作桌',exact:true}).click();await page.locator('[data-group-id="osaka-spring"]').click();await expect(page.getByRole('button',{name:'明信片',exact:true})).toHaveAttribute('aria-pressed','true');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});


