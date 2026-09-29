import { test, expect } from '@playwright/test';
test('手机画幅、触控目标、底部面板与返回手势', async ({ page }, testInfo) => {
  await page.goto('/');
  const shell = page.getByTestId('mobile-app-shell');
  await expect(shell).toBeVisible();
  const box = await shell.boundingBox();
  const viewport = page.viewportSize()!;
  expect(box!.width).toBe(viewport.width > 600 ? 390 : viewport.width);
  expect(box!.height).toBe(viewport.width > 600 ? Math.min(844, viewport.height) : viewport.height);
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(true);
  for (const button of await page.getByRole('button').all()) {
    const bounds = await button.boundingBox();
    if (bounds) { expect(bounds.width).toBeGreaterThanOrEqual(44); expect(bounds.height).toBeGreaterThanOrEqual(44); }
  }
  await page.getByRole('button', { name: '预览大阪散步日记', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '大阪散步日记' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('83 张照片');
  await page.getByRole('button', { name: '关闭大阪散步日记' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', { name: '预览大阪散步日记', exact: true })).toBeFocused();
  await page.getByRole('button', { name: '预览大阪散步日记' }).click();await page.getByRole('button',{name:'打开相册',exact:true}).click();
  await expect(page.locator('[data-scene="workspace"]')).toHaveCSS('opacity', '1');
  // 纵向手势应保留当前场景，左侧水平手势才返回。
  const x = box!.x + 10, y = box!.y + 200;
  await shell.dispatchEvent('pointerdown', { pointerId: 1, pointerType: 'touch', isPrimary: true, clientX: x, clientY: y });
  await shell.dispatchEvent('pointerup', { pointerId: 1, pointerType: 'touch', isPrimary: true, clientX: x + 5, clientY: y + 110 });
  await expect(page.locator('[data-scene="workspace"]')).toBeVisible();
  if (testInfo.project.use.hasTouch) {
    const session = await page.context().newCDPSession(page);
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + 45, y: y + 3 }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + 110, y: y + 6 }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await session.detach();
  } else {
    await shell.dispatchEvent('pointerdown', { pointerId: 2, pointerType: 'touch', isPrimary: true, clientX: x, clientY: y });
    await shell.dispatchEvent('pointerup', { pointerId: 2, pointerType: 'touch', isPrimary: true, clientX: x + 110, clientY: y + 6 });
  }
  await expect(page.locator('[data-scene="tripShelf"]')).toBeVisible();
});

