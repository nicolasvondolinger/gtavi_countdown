import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const desktopOnly = (name: string) => test.skip(name !== 'desktop', 'The desktop header holds these controls.');

test.describe('language', () => {
  test.use({ locale: 'pt-BR' });

  test('follows the browser preference', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/pt$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.getByRole('heading', { name: 'Explore por jogo' })).toBeVisible();
  });

  test('translates database content', async ({ page }) => {
    await page.goto('/pt/gta-6/characters/lucia');
    await expect(page.getByRole('heading', { name: 'Biografia' })).toBeVisible();
    await expect(page.getByText('uma das duas protagonistas').first()).toBeVisible();
    await page.goto('/pt/gta-6/guides/ultimate-edition');
    await expect(page.getByRole('heading', { name: 'Edição Ultimate', level: 1 })).toBeVisible();
  });

  test('shows relative dates in Portuguese', async ({ page }) => {
    await page.goto('/pt/news');
    await expect(page.getByRole('heading', { name: 'Notícias e rumores' })).toBeVisible();
    await expect(page.getByText(/\bde novembro de 2026\b/).first()).toBeVisible();
  });
});

test('the header switches language, keeps the page and remembers the choice', async ({ page }, info) => {
  desktopOnly(info.project.name);
  await page.goto('/search?q=vice');
  await page.getByRole('group', { name: 'Language' }).getByRole('link', { name: 'Português' }).click();
  await expect(page).toHaveURL(/\/pt\/search\?q=vice$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');

  await page.goto('/games');
  await expect(page).toHaveURL(/\/pt\/games$/);

  await page.getByRole('group', { name: 'Idioma' }).getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/games$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('the mobile menu has language, theme and Discord', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'Only the mobile layout has this menu.');
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.locator('#mobile-menu');
  await expect(menu.getByRole('link', { name: 'Join our Discord' })).toHaveAttribute('href', 'https://discord.gg/AwB78ThTTd');
  await expect(menu.getByRole('button', { name: /Switch to (light|dark) theme/ })).toBeVisible();
  await menu.getByRole('link', { name: 'Português' }).click();
  await expect(page).toHaveURL(/\/pt$/);
});

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`${scheme} system preference`, () => {
    test.use({ colorScheme: scheme });

    test('sets the first theme, and the toggle overrides it for good', async ({ page }, info) => {
      desktopOnly(info.project.name);
      const other = scheme === 'dark' ? 'light' : 'dark';
      await page.goto('/about');
      await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);
      await page.getByRole('button', { name: `Switch to ${other} theme` }).click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', other);
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('data-theme', other);
    });

    for (const path of ['/', '/gta-6/characters/lucia', '/videos', '/policies', '/forums']) {
      test(`${path} passes the accessibility check`, async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
        expect(violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).slice(0, 4).join(', ')}`)).toEqual([]);
      });
    }
  });
}

test('longer Portuguese labels still fit at 1024px', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  for (const path of ['/pt', '/pt/games', '/pt/gta-6', '/pt/videos', '/pt/policies']) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), path).toBeLessThanOrEqual(0);
  }
});

test('the Discord invite is one click away', async ({ page }, info) => {
  desktopOnly(info.project.name);
  await page.goto('/');
  await expect(page.getByRole('banner').getByRole('link', { name: 'Join our Discord' })).toHaveAttribute('href', 'https://discord.gg/AwB78ThTTd');
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Join our Discord' })).toHaveAttribute('href', 'https://discord.gg/AwB78ThTTd');
});

test('the about page names the creator and links the policies', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByRole('link', { name: 'Nicolas Von Dolinger' })).toHaveAttribute('href', 'https://nicolasvondolinger.com/en');
  await page.getByRole('main').getByRole('link', { name: 'wiki policies' }).click();
  await expect(page.getByRole('heading', { name: 'Wiki policies', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Spoilers and leaks' })).toBeVisible();
});

test('videos filter by game and load the player only on click', async ({ page }) => {
  await page.goto('/videos');
  await page.getByRole('main').getByRole('link', { name: /GTA VI \(\d+\)/ }).click();
  await expect(page).toHaveURL(/game=gta-6/);
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.getByRole('button', { name: 'Play Grand Theft Auto VI Trailer 2' }).click();
  await expect(page.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\/VQRLujxTm3c/);
});

test('the gallery opens large and steps with the keyboard', async ({ page }) => {
  await page.goto('/gta-6/locations/vice-city');
  await page.getByRole('button', { name: 'Open image 1 of 12' }).click();
  const viewer = page.getByRole('dialog');
  await expect(viewer.getByText('1 / 12')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(viewer.getByText('2 / 12')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(viewer).toBeHidden();
});

test('the page history reads in Portuguese', async ({ page }) => {
  await page.goto('/pt/gta-6/characters/lucia/history');
  await expect(page.getByText('Página criada').first()).toBeVisible();
});
