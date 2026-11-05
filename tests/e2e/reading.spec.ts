import { expect, test } from '@playwright/test';

test('home shows the franchise with GTA VI featured', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Grand Theft Auto VI' })).toBeVisible();
  await expect(page.getByRole('timer')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Explore by game' })).toBeVisible();
  await expect(page.getByRole('link', { name: /San Andreas/ }).first()).toBeVisible();
});

test('all games lists every universe', async ({ page }) => {
  await page.goto('/games');
  for (const name of ['HD universe', '3D universe', '2D universe']) await expect(page.getByRole('heading', { name })).toBeVisible();
});

test('a game hub renders, and an unknown game is a 404', async ({ page }) => {
  await page.goto('/gta-5');
  await expect(page.getByRole('heading', { level: 1, name: 'Grand Theft Auto V' })).toBeVisible();
  const missing = await page.goto('/gta-99');
  expect(missing?.status()).toBe(404);
});

test('an article shows its breadcrumb and game', async ({ page }) => {
  await page.goto('/gta-6/characters/lucia');
  await expect(page.getByRole('heading', { level: 1, name: 'Lucia Caminos' })).toBeVisible();
  const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(crumbs).toContainText('Home');
  await expect(crumbs).toContainText('GTA VI');
  await expect(crumbs).toContainText('Characters');
});
