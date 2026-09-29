import {test,expect} from '@playwright/test';
test('照片堆在手机外壳内居中放大，详情支持边缘返回',async({page},info)=>{
 await page.goto('/');await page.getByRole('button',{name:'预览大阪散步日记'}).click();await page.getByRole('button',{name:'打开相册',exact:true}).click();await expect(page.locator('[data-scene="workspace"]')).toHaveCSS('opacity','1');
 const shell=await page.getByTestId('mobile-app-shell').boundingBox();
 await page.getByRole('button',{name:/大阪的红色，8张/}).click();
 if(info.project.name!=='reduced-motion'){
  const moving=page.locator('[class*="openingPile"]');await expect(moving).toBeVisible();
  const parent=await moving.evaluate(el=>({position:getComputedStyle(el).position,parent:el.parentElement?.getAttribute('data-testid')}));
  expect(parent).toEqual({position:'absolute',parent:'mobile-app-shell'});
  const rect=await moving.boundingBox();expect(rect!.x).toBeGreaterThanOrEqual(shell!.x-5);expect(rect!.x+rect!.width).toBeLessThanOrEqual(shell!.x+shell!.width+5);
 }
 await expect(page.locator('[data-scene="groupDetail"]')).toHaveCSS('opacity','1');
 if(info.project.use.hasTouch){
  const cdp=await page.context().newCDPSession(page);const x=shell!.x+10,y=shell!.y+160;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+110,y:y+2}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
 }else await page.getByRole('button',{name:'← 返回照片工作桌'}).click();
 await expect(page.locator('[data-scene="workspace"]')).toHaveCSS('opacity','1');
});

