import { test, expect } from '@playwright/test';
test('刘海与Home Indicator安全区、触摸弹层和按压反馈', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--safe-top', '47px');
    document.documentElement.style.setProperty('--safe-bottom', '34px');
  });
  const shell = page.getByTestId('mobile-app-shell');
  await expect(shell).toHaveCSS('padding-top', '47px');
  await expect(page.locator('[data-safe-area-scene]')).toHaveCSS('padding-bottom', '34px');
  const trigger = page.getByRole('button', { name: '预览大阪散步日记', exact: true });
  if (testInfo.project.use.hasTouch) await trigger.tap(); else await trigger.click();
  const dialog = page.getByRole('dialog', { name: '大阪散步日记' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS('padding-bottom', '34px');
  await page.screenshot({ path: `test-results/${testInfo.project.name}-safe-area-sheet.png` });
  const close = page.getByRole('button', { name: '关闭大阪散步日记' });
  if (testInfo.project.use.hasTouch) await close.tap(); else await close.click();
  await expect(dialog).not.toBeVisible();
  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  const target = await trigger.boundingBox();
  const point = { x: target!.x + target!.width / 2, y: target!.y + target!.height / 2 };
  const session = await page.context().newCDPSession(page);
  if (testInfo.project.use.hasTouch) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
  } else { await page.mouse.move(point.x, point.y); await page.mouse.down(); }
  await expect(trigger).toHaveCSS('filter', testInfo.project.name === 'reduced-motion' ? 'brightness(0.88)' : 'brightness(0.94)');
  if (testInfo.project.use.hasTouch) await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  else await page.mouse.up();
  await expect(dialog).toBeVisible();
  await close.click();
  await session.detach();
  // 系统未提供振动或拒绝调用时，按钮仍可使用。
  await page.evaluate(() => { Object.defineProperty(navigator, 'vibrate', { configurable: true, value: () => { throw new Error('Unsupported vibration'); } }); });
  await page.getByRole('button', { name: '预览大阪散步日记' }).click();await page.getByRole('button',{name:'打开相册',exact:true}).click();
  await expect(page.locator('[data-scene="workspace"]')).toHaveCSS('opacity', '1');
});

