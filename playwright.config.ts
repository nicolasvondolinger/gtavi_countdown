import { defineConfig, devices } from '@playwright/test';

const port = 3100;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  // The dev server compiles each route on first visit, which can take tens of seconds.
  timeout: 90_000,
  expect: { timeout: 20_000 },
  use: { baseURL: `http://localhost:${port}`, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } },
  ],
  webServer: { command: `npm run dev -- -p ${port}`, port, reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
