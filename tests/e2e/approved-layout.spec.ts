import {test,expect} from '@playwright/test';
test('approved layouts preserve touch, fixed views and whole-group state',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await page.goto('/');
 await expect(page.getByTestId('mobile-app-shell')).toHaveCSS('background-color','rgb(255, 255, 255)');
 await expect(page.getByRole('heading',{name:'把旅行，印成回忆'})).toBeVisible();
 const printer=page.getByRole('button',{name:'导入旅行照片，开启照片导入'});
 const books=page.locator('[data-trip-box]');await expect(books).toHaveCount(8);
 const printerBox=(await printer.boundingBox())!;
 for(const book of await books.all()){
  const rect=(await book.boundingBox())!;expect(rect.y).toBeGreaterThan(printerBox.y+printerBox.height);
  expect(rect.width).toBeGreaterThanOrEqual(44);expect(rect.height).toBeGreaterThanOrEqual(44);
 }
 await page.screenshot({path:info.outputPath('approved-home.png')});
 const chooser=page.waitForEvent('filechooser');await printer.click();await (await chooser).setFiles([]);await expect(page.locator('[data-shelf-view="collection"]')).toBeVisible();
 await page.getByRole('button',{name:'预览大阪散步日记'}).click();await page.getByRole('button',{name:'打开相册',exact:true}).click();
 const views=page.getByRole('radiogroup',{name:'旅行浏览视角'});
 await expect(views.getByRole('radio')).toHaveText(['这一刻','我们','一路发现','同一种感觉']);
 await expect(views.getByRole('radio',{name:'这一刻',exact:true})).toBeChecked();
 for(const radio of await views.getByRole('radio').all()){
  const box=(await radio.boundingBox())!;expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);
 }
 const piles=page.getByRole('button',{name:/查看完整照片组/});await expect(piles).toHaveCount(5);
 const lead=(await piles.first().boundingBox())!,next=(await piles.nth(1).boundingBox())!;
 expect(lead.width).toBeGreaterThan(next.width*1.8);
 await page.screenshot({path:info.outputPath('approved-workspace.png')});
 const top=(await views.boundingBox())!.y;await page.locator('main').evaluate(el=>el.scrollTop=250);
 expect((await views.boundingBox())!.y).toBe(top);
 await views.getByRole('radio',{name:'同一种感觉',exact:true}).click();
 await expect(page.locator('[data-pile-phase]')).toHaveAttribute('data-pile-phase','settled');
 await page.getByRole('button',{name:/大阪的红色，8张/}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('大阪的红色');
 await page.getByRole('button',{name:'← 返回照片工作桌'}).click();
 await expect(views.getByRole('radio',{name:'同一种感觉',exact:true})).toBeChecked();
 await views.getByRole('radio',{name:'同一种感觉',exact:true}).focus();
 await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');
 await expect(views.getByRole('radio',{name:'我们',exact:true})).toBeChecked();
 await page.evaluate(()=>{document.documentElement.style.setProperty('--safe-top','47px');document.documentElement.style.setProperty('--safe-bottom','34px');});
 expect((await views.boundingBox())!.y).toBeGreaterThan(47);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'← 返回旅行盒子'}).click();await expect(printer).toBeVisible();
 expect(errors).toEqual([]);
});

test('switching view during a cover opening cancels the old opening',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'预览大阪散步日记'}).click();await page.getByRole('button',{name:'打开相册',exact:true}).click();
 await expect(page.locator('[data-scene="workspace"]')).toHaveCSS('opacity','1');
 await page.getByRole('button',{name:/大阪的红色，8张/}).click();
 await page.getByRole('radio',{name:'我们',exact:true}).click();
 await expect(page.locator('[data-workspace-mode]')).toHaveAttribute('data-opening','false');
 await expect(page.locator('[data-pile-phase]')).toHaveAttribute('data-pile-phase','settled');
 await page.getByRole('button',{name:/三个人，没有一张正常合照/}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('三个人，没有一张正常合照');
});


