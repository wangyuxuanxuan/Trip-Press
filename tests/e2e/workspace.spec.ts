import {test,expect} from '@playwright/test';
test('顶部视角、整组入口、键盘和快速连续切换',async({page},info)=>{
 test.setTimeout(60000);const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/');await page.getByRole('button',{name:'预览大阪散步日记'}).click();await page.getByRole('button',{name:'打开相册',exact:true}).click();
 const workspace=page.locator('[data-workspace-mode]');
 const settled=async(mode:string,count:number)=>{
  await expect(page.locator('[data-scene="workspace"]')).toHaveCSS('opacity','1');
  await expect(workspace).toHaveAttribute('data-workspace-mode',mode);await expect(workspace).toHaveAttribute('data-pile-phase','settled');
  await expect(page.getByRole('button',{name:/查看完整照片组/})).toHaveCount(count);
  expect(await page.locator('main').evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(1);
 };
 await settled('recommended',6);await expect(page.getByRole('radio',{name:'这一刻',exact:true})).toBeChecked();
 const views=(await page.getByRole('radiogroup').boundingBox())!;
 for(const button of await page.getByRole('button',{name:/查看完整照片组/}).all()){
  const rect=(await button.boundingBox())!;expect(rect.height).toBeGreaterThanOrEqual(64);expect(rect.y).toBeGreaterThanOrEqual(views.y+views.height);
  await expect(button.locator('[data-photo-layer]')).toHaveCount(4);
 }
 await page.screenshot({path:info.outputPath('workspace.png')});
 if(info.project.name==='reduced-motion'){
  await page.getByRole('radio',{name:'同一种感觉',exact:true}).click();
  const translations=await page.locator('[data-photo-layer]').evaluateAll(elements=>elements.map(el=>{const matrix=new DOMMatrixReadOnly(getComputedStyle(el).transform);return [matrix.m41,matrix.m42];}));
  expect(translations.every(([x,y])=>x===0&&y===0)).toBe(true);await settled('color',4);
 }
 for(const [label,mode,count] of [['同一种感觉','color',4],['我们','people',4],['一路发现','theme',5]] as const){
  await page.getByRole('radio',{name:label,exact:true}).click();await settled(mode,count);
  for(const button of await page.getByRole('button',{name:/查看完整照片组/}).all()){
   const name=await button.getAttribute('aria-label');await button.click();
   await expect(page.locator('[data-scene="groupDetail"]')).toHaveCSS('opacity','1');
   await expect(page.getByRole('heading',{level:1})).toHaveText(name!.split('：')[1].replace(/，\d+张$/,''));
   await page.getByRole('button',{name:'← 返回照片工作桌'}).click();await settled(mode,count);
  }
 }
 await page.getByRole('radio',{name:'一路发现',exact:true}).focus();await page.keyboard.press('Home');await settled('recommended',6);
 await page.keyboard.press('ArrowRight');await settled('people',4);
 await page.keyboard.press('End');await settled('color',4);
 await page.getByRole('radio',{name:'同一种感觉',exact:true}).click();await page.getByRole('radio',{name:'一路发现',exact:true}).click();await page.getByRole('radio',{name:'这一刻',exact:true}).click();await settled('recommended',6);
 await page.getByRole('button',{name:/大阪的红色，8张/}).click();await expect(page.locator('[data-thumb-id]')).toHaveCount(8);await expect(page.getByRole('button',{name:'印这一组'})).toBeEnabled();
 await page.getByRole('button',{name:'← 返回照片工作桌'}).click();await page.getByRole('button',{name:'查看当前旅行贴纸册'}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('旅行贴纸册');await page.getByRole('button',{name:'返回上一页',exact:true}).click();await settled('recommended',6);
 expect(errors).toEqual([]);
});

