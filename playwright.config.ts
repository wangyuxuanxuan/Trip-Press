import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e', timeout: 40000, workers: 2,
  use: { baseURL: 'http://127.0.0.1:5173', channel: 'msedge', headless: true, trace: 'retain-on-failure' },
  projects: [
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } },
    { name: 'mobile-small', use: { viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true } },
    { name: 'mobile-393', use: { viewport: { width: 393, height: 852 }, hasTouch: true, isMobile: true } },
    { name: 'mobile-large', use: { viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: true } },
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'reduced-motion', use: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' } },
  ],
  webServer: { command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173 --strictPort', url: 'http://127.0.0.1:5173', reuseExistingServer: true },
});
