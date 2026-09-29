import {test,expect,type Page} from '@playwright/test';
async function workspace(page:Page){await page.goto('/');await page.getByRole('button',{name:'预览大阪散步日记'}).click();await page.getByRole('button',{name:'打开相册',exact:true}).click();await expect(page.locator('[data-scene="workspace"]')).toHaveCSS('opacity','1');}
async function detail(page:Page){await workspace(page);await page.getByRole('button',{name:/大阪的红色，8张/}).click();await expect(page.locator('[data-scene="groupDetail"]')).toHaveCSS('opacity','1');}
test('照片方向键能连续翻页且焦点保持',async({page})=>{
 await detail(page);const hero=page.getByTestId('current-photo');await hero.focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');
 await expect(page.locator('[data-thumb-id]').nth(2)).toHaveAttribute('aria-current','true');await expect(hero).toBeFocused();
});
test('普通横滑缩略图只浏览，不意外改顺序',async({page},info)=>{
 test.skip(!info.project.use.hasTouch,'桌面保留鼠标拖动排序');await detail(page);
 const thumbs=page.locator('[data-thumb-id]');const before=await thumbs.evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-thumb-id')));const rect=await thumbs.nth(3).boundingBox();const cdp=await page.context().newCDPSession(page);const x=rect!.x+22,y=rect!.y+20;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let n=1;n<=6;n++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-n*14,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 expect(await thumbs.evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-thumb-id')))).toEqual(before);await cdp.detach();
});
test('重返工作桌保留滚动位置，重返照片组保留当前照片',async({page})=>{
 await workspace(page);await page.locator('main').evaluate(el=>el.scrollTop=140);
 await page.getByRole('button',{name:/大阪的红色，8张/}).evaluate(el=>el.addEventListener('pointerdown',()=>{document.documentElement.dataset.departureScroll=String(document.querySelector('main')!.scrollTop);},{once:true}));
 await page.getByRole('button',{name:/大阪的红色，8张/}).click();await page.getByRole('button',{name:'下一张照片'}).click();await page.getByRole('button',{name:'下一张照片'}).click();
 await page.getByRole('button',{name:'← 返回照片工作桌'}).click();await expect(page.locator('[data-scene="workspace"]')).toHaveCSS('opacity','1');
 await expect.poll(()=>page.locator('main').evaluate(el=>el.scrollTop)).toBe(Number(await page.locator('html').getAttribute('data-departure-scroll')));
 await page.getByRole('button',{name:/大阪的红色，8张/}).click();await expect(page.locator('[data-thumb-id]').nth(2)).toHaveAttribute('aria-current','true');
 await page.getByRole('button',{name:'印这一组'}).click();await expect(page.locator('[data-scene="gallery"]')).toBeVisible({timeout:10000});await page.getByRole('button',{name:'返回照片组',exact:true}).click();
 await expect(page.locator('[data-thumb-id]').nth(2)).toHaveAttribute('aria-current','true');
});
test('照片请求失败保留纸框、可读提示与完整主流程',async({page})=>{
 await page.route('**/assets/photos/*.jpg',route=>route.abort());await detail(page);
 const img=page.getByTestId('current-photo').locator('img');await expect(img).toHaveAttribute('data-image-failed','true');await expect(img).toHaveAttribute('alt',/暂时无法加载/);
 expect(await img.evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 await page.getByRole('button',{name:'印这一组'}).click();await expect(page.locator('[data-scene="gallery"]')).toBeVisible({timeout:10000});
 await expect(page.locator('[data-artwork-id="cover"] img')).toHaveAttribute('data-image-failed','true');
 await page.getByRole('button',{name:'导出透明贴纸 PNG',exact:true}).click();await expect(page.getByRole('status')).toContainText('未成功');
 await page.getByRole('button',{name:'返回工作桌',exact:true}).click();await expect(page.locator('[data-scene="workspace"]')).toBeVisible();
});
test('旋转保持竖屏提示和原照片，软键盘不会触发旋转提示',async({page},info)=>{
 test.skip(!info.project.use.hasTouch,'桌面仅预览手机画幅');await detail(page);await page.getByRole('button',{name:'下一张照片'}).click();
 const size=page.viewportSize()!;await page.setViewportSize({width:size.height,height:size.width});
 await expect(page.getByRole('dialog',{name:'竖屏提示'})).toBeVisible();
 await page.setViewportSize(size);await expect(page.getByRole('dialog',{name:'竖屏提示'})).not.toBeVisible();await expect(page.locator('[data-thumb-id]').nth(1)).toHaveAttribute('aria-current','true');
 await page.getByRole('button',{name:'更多操作'}).click();await page.getByRole('button',{name:'修改组名',exact:true}).click();
 await page.evaluate(()=>{Object.defineProperty(window.visualViewport,'height',{configurable:true,value:350});window.visualViewport!.dispatchEvent(new Event('resize'));});
 await expect(page.getByRole('dialog',{name:'竖屏提示'})).not.toBeVisible();await expect(page.getByRole('textbox')).toBeInViewport();await expect(page.getByRole('button',{name:'完成',exact:true})).toBeInViewport();
});
test('深色系统、安全区、实际触控尺寸与模拟系统反馈',async({page},info)=>{
 await page.emulateMedia({colorScheme:'dark'});await detail(page);
 await page.evaluate(()=>{document.documentElement.style.setProperty('--safe-top','47px');document.documentElement.style.setProperty('--safe-bottom','34px');});
 await expect(page.locator('html')).toHaveCSS('color-scheme','light');const shell=await page.getByTestId('mobile-app-shell').boundingBox();
 const check=async()=>{for(const button of await page.getByRole('button').all()){if(!await button.isVisible())continue;const r=await button.boundingBox();expect(r!.width).toBeGreaterThanOrEqual(43.9);expect(r!.height).toBeGreaterThanOrEqual(43.9);}expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);};
 await check();const title=await page.getByRole('heading',{level:1}).boundingBox();expect(title!.y).toBeGreaterThanOrEqual(shell!.y+47);
 const print=await page.getByRole('button',{name:'印这一组'}).boundingBox();expect(print!.y+print!.height).toBeLessThanOrEqual(shell!.y+shell!.height-34);
 await page.getByRole('button',{name:'印这一组'}).click();await expect(page.locator('[data-scene="gallery"]')).toBeVisible({timeout:10000});await expect(page.locator('[data-scene="gallery"]')).toHaveCSS('opacity','1');await check();
 await page.locator('[data-artwork-id="cover"]').click();await check();await page.getByRole('button',{name:'分享此作品'}).click();await expect(page.getByRole('dialog').getByRole('status')).toContainText('模拟分享');
 await page.getByRole('button',{name:'保存单张'}).click();await expect(page.getByRole('dialog').getByRole('status')).toContainText('模拟保存');await page.screenshot({path:info.outputPath('safe-dark-preview.png')});
});

