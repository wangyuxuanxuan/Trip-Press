import {test,expect} from '@playwright/test';
test('较高软键盘下配文面板关闭按钮仍完整可触摸',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'预览大阪散步日记'}).click();await page.getByRole('button',{name:'打开相册',exact:true}).click();await page.getByRole('button',{name:/大阪的红色，8张/}).click();await page.getByRole('button',{name:'印这一组'}).click();await expect(page.locator('[data-scene="gallery"]')).toBeVisible({timeout:10000});await page.getByRole('button',{name:'修改文字'}).click();
 await page.evaluate(()=>{Object.defineProperty(window.visualViewport,'height',{configurable:true,value:350});window.visualViewport!.dispatchEvent(new Event('resize'));});
 const dialog=await page.getByRole('dialog').boundingBox();const close=await page.getByRole('button',{name:'关闭修改社交配文'}).boundingBox();const done=await page.getByRole('button',{name:'完成',exact:true}).boundingBox();
 expect(close!.y).toBeGreaterThanOrEqual(dialog!.y+4);expect(close!.height).toBeGreaterThanOrEqual(44);expect(done!.y+done!.height).toBeLessThanOrEqual(351);
 await page.getByRole('button',{name:'关闭修改社交配文'}).click();await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('长按信息打开后继续移动手指不改变当前照片',async({page},info)=>{
 test.skip(!info.project.use.hasTouch,'触摸专项');await page.goto('/');await page.getByRole('button',{name:'预览大阪散步日记'}).click();await page.getByRole('button',{name:'打开相册',exact:true}).click();await page.getByRole('button',{name:/大阪的红色，8张/}).click();await expect(page.locator('[data-scene="groupDetail"]')).toHaveCSS('opacity','1');
 const hero=page.getByTestId('current-photo');const r=await hero.boundingBox();const x=r!.x+r!.width*.7,y=r!.y+r!.height*.5;
 const cdp=await page.context().newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await expect(page.getByRole('dialog',{name:'拍摄信息'})).toBeVisible();
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-110,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await expect(page.locator('[data-thumb-id]').first()).toHaveAttribute('aria-current','true');await cdp.detach();
});

