import {test,expect} from '@playwright/test';

test('travel previews use lightweight sticker images that load',async({page},info)=>{
 const failed:string[]=[];
 page.on('response',r=>{if(r.url().includes('/assets/')&&r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});
 await page.goto('/');
 await page.screenshot({path:info.outputPath('home-brand.png')});
 for(const trip of ['osaka-2026','italy-2026','desert']){
  await page.locator(`[data-trip-box="${trip}"]`).click();
  const cover=page.getByRole('dialog').locator('[data-composition="sticker-cover"]');
  await expect(cover).toBeVisible();
  const images=await cover.locator('image').evaluateAll(els=>els.map(el=>({href:el.getAttribute('href'),width:Number(el.getAttribute('width')),height:Number(el.getAttribute('height'))})));
  expect(images.length).toBeGreaterThanOrEqual(8);
  expect(images.filter(image=>image.href?.includes('/sticker-cells/')).reduce((area,image)=>area+image.width*image.height,0)).toBeLessThan(3_000_000);
  expect(images.some(image=>image.href?.includes('/stickers/'))).toBe(false);
  await cover.screenshot({path:info.outputPath(`${trip}-preview.png`)});
  await page.getByRole('dialog').getByRole('button',{name:/关闭/}).click();
 }
 expect(failed).toEqual([]);
});
