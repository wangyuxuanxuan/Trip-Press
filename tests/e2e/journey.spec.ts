import { test, expect } from '@playwright/test';
test('完整路径、返回、取消、整组确认及响应式布局', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const scene = async (name: string) => {
    await expect(page.locator(`[data-scene="${name}"]`)).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator(`[data-scene="${name}"]`)).toHaveCSS('opacity', '1');
    expect(await page.locator('main').evaluate(el=>el.scrollTop)).toBeGreaterThanOrEqual(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  };
  await page.goto('/');
  await scene('tripShelf');
  await page.screenshot({ path: `test-results/${testInfo.project.name}-tripShelf.png`, fullPage: true });
  await page.getByRole('button', { name: '预览大阪散步日记' }).click();await page.getByRole('button',{name:'打开相册',exact:true}).click();
  await scene('workspace');
  await expect(page.getByRole('button', { name: /查看完整照片组/ })).toHaveCount(5);
  await page.screenshot({ path: `test-results/${testInfo.project.name}-workspace.png`, fullPage: true });
  // 所有示例组都是可用入口。
  for (let index = 0; index < 5; index++) {
    await page.getByRole('button', { name: /查看完整照片组/ }).nth(index).click();
    await scene('groupDetail');
    await page.getByRole('button', { name: '← 返回照片工作桌' }).click();
    await scene('workspace');
  }
  await page.getByRole('button', { name: /查看完整照片组/ }).first().click();
  await scene('groupDetail');
  await expect(page.locator('[data-thumb-id]')).toHaveCount(8);
  
  await expect(page.getByRole('button', { name: '印这一组' })).toBeEnabled();
  
  await page.screenshot({ path: `test-results/${testInfo.project.name}-groupDetail.png`, fullPage: true });
  await page.getByRole('button', { name: '印这一组' }).click();
  await scene('printing');
  await page.getByRole('button', { name: '← 返回照片组详情' }).click();
  await scene('groupDetail');
  await page.waitForTimeout(3600);
  await scene('groupDetail');
  await page.getByRole('button', { name: '印这一组' }).click();
  await scene('printing');
  await page.screenshot({ path: `test-results/${testInfo.project.name}-printing.png`, fullPage: true });
  await scene('gallery');
  await expect(page.getByRole('article')).toHaveCount(10);
  await page.screenshot({ path: `test-results/${testInfo.project.name}-gallery.png`, fullPage: true });
  await page.getByRole('button', { name: '← 返回作品生成过程' }).click();
  await scene('printing');
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '4');
  await page.getByRole('button', { name: '查看发布包' }).click();
  await scene('gallery');
  await page.getByRole('button', { name: '返回工作桌', exact: false }).click();
  await scene('workspace');
  await page.getByRole('button', { name: '查看当前旅行贴纸册' }).click();await scene('stickerCollection');await page.getByRole('button',{name:/第 1 版/}).click();
  await scene('gallery');
  await page.getByRole('button', { name: '← 返回旅行贴纸册' }).click();await scene('stickerCollection');await page.getByRole('button',{name:'返回上一页'}).click();
  await scene('workspace');
  await page.getByRole('button', { name: '← 返回旅行盒子' }).click();
  await scene('tripShelf');
  if (testInfo.project.name === 'reduced-motion') {
    await expect(page.locator('main')).toHaveAttribute('data-reduced-motion', 'true');
    expect(await page.locator('[data-scene]').evaluate(el => getComputedStyle(el).transform)).toBe('none');
  }
  expect(errors).toEqual([]);
});

