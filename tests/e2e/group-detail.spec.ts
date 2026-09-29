import {test,expect,type Page} from '@playwright/test';
const open=async(page:Page)=>{await page.goto('/');await page.getByRole('button',{name:'预览大阪散步日记'}).click();await page.getByRole('button',{name:'打开相册',exact:true}).click();await page.getByRole('button',{name:/大阪的红色，8张/}).click();await expect(page.locator('[data-scene="groupDetail"]')).toHaveCSS('opacity','1');};
test('整组浏览、调整、撤销恢复、改名和直接印制',async({page},info)=>{
 test.setTimeout(60000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await open(page);
 const hero=page.getByTestId('current-photo');const thumbs=page.locator('[data-thumb-id]');
 await expect(thumbs).toHaveCount(8);await expect(page.getByText('招牌、食物、衣服和街道里的红色。')).toBeVisible();
 const footer=page.locator('footer');const box=await footer.boundingBox();const shell=await page.getByTestId('mobile-app-shell').boundingBox();
 expect(Math.abs(box!.y+box!.height-shell!.y-shell!.height)).toBeLessThanOrEqual(1);
 expect((await page.getByTestId('current-photo').boundingBox())!.height).toBeGreaterThan(220);
 const print=page.getByRole('button',{name:'印这一组'});expect((await print.boundingBox())!.height).toBeGreaterThanOrEqual(52);await expect(print).toBeEnabled();
 await expect.poll(()=>page.locator('[data-scene="groupDetail"] img').evaluateAll(imgs=>imgs.every(img=>(img as HTMLImageElement).complete&&(img as HTMLImageElement).naturalWidth>0))).toBe(true);
 await page.screenshot({path:`test-results/${info.project.name}-detail-new.png`});
 await page.getByRole('button',{name:'下一张照片'}).click();await page.getByRole('button',{name:'下一张照片'}).click();
 await expect(thumbs.nth(2)).toHaveAttribute('aria-current','true');
 await page.getByRole('button',{name:'拍摄信息',exact:true}).click();await expect(page.getByRole('dialog')).toContainText('演示拍摄信息');await page.getByRole('button',{name:'关闭拍摄信息'}).click();
 await hero.click();await page.getByRole('button',{name:'放大照片细节'}).click();await expect(page.getByTestId('zoom-canvas')).toHaveAttribute('data-scale','1.50');
 await page.getByRole('button',{name:'重置'}).click();await expect(page.getByTestId('zoom-canvas')).toHaveAttribute('data-scale','1.00');await page.getByRole('button',{name:'关闭照片细节'}).click();
 await page.getByRole('button',{name:/调整本组/}).click();const dialog=page.getByRole('dialog');
 await page.getByRole('button',{name:'移出本组',exact:true}).click();await expect(thumbs).toHaveCount(7);await expect(dialog.getByRole('button',{name:/恢复照片/})).toHaveCount(1);
 await dialog.getByRole('button',{name:/恢复照片/}).click();await expect(thumbs).toHaveCount(8);await expect(thumbs.nth(2)).toHaveAttribute('aria-current','true');
 await page.getByRole('button',{name:'向前移一张'}).click();await expect(thumbs.nth(1)).toHaveAttribute('aria-current','true');
 await dialog.getByRole('button',{name:/替换为/}).first().click();await expect(thumbs).toHaveCount(8);
 await page.getByRole('button',{name:'撤销上一步'}).click();await expect(thumbs.nth(1)).toHaveAttribute('data-thumb-id','osaka-photo-3');
 await page.getByRole('button',{name:'修改组名',exact:true}).click();const input=page.getByRole('textbox');await expect(input).toBeFocused();
 await input.fill('取消的名字');await page.getByRole('button',{name:'取消',exact:true}).click();await expect(page.getByRole('heading',{level:1})).toHaveText('大阪的红色');
 await page.getByRole('button',{name:'更多操作'}).click();await page.getByRole('button',{name:'修改组名',exact:true}).click();await input.fill('大阪街角的红色');await page.getByRole('button',{name:'完成',exact:true}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('大阪街角的红色');
 await page.getByRole('button',{name:'← 返回照片工作桌'}).click();await page.getByRole('button',{name:/大阪街角的红色，8张/}).click();await expect(print).toBeEnabled();
 await print.click();await expect(page.locator('[data-scene="printing"]')).toBeVisible();await expect(page.getByText('「大阪街角的红色」· 完整照片组')).toBeVisible();
 expect(errors).toEqual([]);
});
test('触摸滑动、长按、双指缩放与缩略图拖动',async({page},info)=>{
 await open(page);const hero=page.getByTestId('current-photo');const thumbs=page.locator('[data-thumb-id]');await expect(hero).toHaveCSS('opacity','1');let rect=await hero.boundingBox();
 const cdp=await page.context().newCDPSession(page);
 const touch=Boolean(info.project.use.hasTouch);
 const drag=async(x:number,y:number,dx:number,dy:number,hold=false)=>{
  if(touch){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});if(hold)await page.waitForTimeout(420);for(let step=1;step<=6;step++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*step/6,y:y+dy*step/6}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
  else{await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+dx,y+dy,{steps:6});await page.mouse.up();}
 };
 await drag(rect!.x+rect!.width*.7,rect!.y+rect!.height/2,-100,0);
 await expect(thumbs.nth(1)).toHaveAttribute('aria-current','true');await expect(page.getByRole('dialog')).toHaveCount(0);
 await expect(hero).toHaveCSS('opacity','1');rect=await hero.boundingBox();const x=rect!.x+rect!.width/2,y=rect!.y+rect!.height/2;
 if(touch)await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});else{await page.mouse.move(x,y);await page.mouse.down();}
 await expect(page.getByRole('dialog',{name:'拍摄信息'})).toBeVisible();
 if(touch)await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});else await page.mouse.up();
 await page.getByRole('button',{name:'关闭拍摄信息'}).click();await hero.click();
 const zoom=page.getByTestId('zoom-canvas');const z=await zoom.boundingBox();const zx=z!.x+z!.width/2,zy=z!.y+z!.height/2;
 if(touch){
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:zx-30,y:zy,id:1},{x:zx+30,y:zy,id:2}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:zx-65,y:zy,id:1},{x:zx+65,y:zy,id:2}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect.poll(async()=>Number(await zoom.getAttribute('data-scale'))).toBeGreaterThan(1.8);
 }else await page.getByRole('button',{name:'放大照片细节'}).click();
 await page.getByRole('button',{name:'关闭照片细节'}).click();
 const first=await thumbs.nth(0).boundingBox(),third=await thumbs.nth(2).boundingBox();
 await drag(first!.x+22,first!.y+20,third!.x-first!.x,0,true);
 await expect(thumbs.nth(2)).toHaveAttribute('data-thumb-id','osaka-photo-1');
 await page.getByRole('button',{name:'撤销',exact:true}).click();await expect(thumbs.nth(0)).toHaveAttribute('data-thumb-id','osaka-photo-1');
 await cdp.detach();
});
test('安全区与标题编辑键盘避让，取消后回到照片',async({page},info)=>{
 await open(page);
 await page.evaluate(()=>{document.documentElement.style.setProperty('--safe-top','47px');document.documentElement.style.setProperty('--safe-bottom','34px');});
 await expect(page.locator('footer')).toHaveCSS('padding-bottom','34px');
 await page.getByRole('button',{name:'更多操作'}).click();await page.getByRole('button',{name:'修改组名',exact:true}).click();
 const original=await page.getByTestId('current-photo').getAttribute('aria-label');
 await page.evaluate(()=>{Object.defineProperty(window.visualViewport,'height',{configurable:true,value:480});window.visualViewport!.dispatchEvent(new Event('resize'));});
 const rect=await page.getByRole('dialog').boundingBox();expect(rect!.y+rect!.height).toBeLessThanOrEqual(481);
 await page.getByRole('textbox').fill('键盘测试');await expect(page.getByRole('button',{name:'完成',exact:true})).toBeInViewport();
 await page.getByRole('button',{name:'取消',exact:true}).click();
 await page.evaluate(()=>{delete (window.visualViewport as unknown as {height?:number}).height;window.visualViewport!.dispatchEvent(new Event('resize'));});
 await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.getByTestId('current-photo')).toHaveAttribute('aria-label',original!);
 await expect(page.getByRole('button',{name:'印这一组'})).toBeInViewport();
 await page.screenshot({path:`test-results/${info.project.name}-detail-safe.png`});
});

