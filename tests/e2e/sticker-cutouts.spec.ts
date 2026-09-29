import {test,expect} from '@playwright/test';
test('人物封面使用原片轮廓贴纸，保留成品页照片',async({page},info)=>{
 await page.goto('/');
 await page.locator('[data-trip-box="italy-2026"]').click();
 await page.getByRole('button',{name:'打开相册',exact:true}).click();
 await page.getByRole('radio',{name:'我们',exact:true}).click();
 const card=page.locator('[data-group-id="italy-together"]');
 await expect(card).toBeEnabled();
 await expect(card.locator('img')).toHaveCount(0);
 await expect(card.locator('[data-photo-cutout="subject"]')).toHaveCount(4);
 for(const id of ['29735737','29735738','29735740','29735739']){
  await expect(card.locator(`[data-source-photo="editorial-${id}"] [data-photo-cutout] image`)).toHaveAttribute('href',new RegExp(`${id}\\.jpg`));
 }
 await expect(page.locator('[data-pile-phase]')).toHaveAttribute('data-pile-phase','settled');
 await expect(card.locator('[data-photo-layer]').last()).toHaveCSS('opacity','1');
 await page.screenshot({path:info.outputPath('people-sticker-cover.png')});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await card.click();
 await expect(page.locator('[data-testid=current-photo] [data-publish-photo]')).toHaveAttribute('data-publish-photo','editorial-29735737');
});

