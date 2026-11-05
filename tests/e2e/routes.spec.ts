import { expect, test } from '@playwright/test';

// A page that errors can still look fine to layout checks, so every route is opened and asserted on.
const ROUTES: [string, string][] = [
  ['/', 'Grand Theft Auto VI'],
  ['/games', 'All Grand Theft Auto games'],
  ['/gta-5', 'Grand Theft Auto V'],
  ['/gta-6/characters', 'GTA VI characters'],
  ['/gta-6/characters/lucia', 'Lucia Caminos'],
  ['/gta-6/characters/lucia/history', 'Revision history'],
  ['/search?q=lucia', 'results for'],
  ['/gta-6/map', 'Leonida map'],
  ['/gta-5/map', 'GTA V map'],
  ['/database/vehicles/compare', 'Compare vehicles'],
  ['/news', 'News and rumors'],
  ['/forums', 'GTA VI speculation'],
  ['/forums/modding', 'Modding'],
  ['/signin', 'Sign in'],
  ['/signup', 'Create account'],
  ['/changes', 'Recent changes'],
  ['/forgot-password', 'Reset your password'],
  ['/about', 'About GTA Wiki'],
];

for (const [path, heading] of ROUTES) {
  test(`${path} renders`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 }).first()).toContainText(heading);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('the map canvas has room and markers can be opened', async ({ page }) => {
  await page.goto('/gta-6/map');
  const box = await page.getByTestId('map-canvas').boundingBox();
  expect(box?.height).toBeGreaterThan(300);
  await page.getByRole('button', { name: 'Vice City' }).click();
  await expect(page.getByRole('link', { name: 'Open page' }).first()).toBeVisible();
});

for (const width of [768, 1024, 1280]) {
  test(`nothing overflows at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const [path] of ROUTES) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
}
