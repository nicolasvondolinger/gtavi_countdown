import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = ['/', '/games', '/gta-5', '/gta-6/characters/lucia', '/gta-6/characters/lucia/history', '/search?q=lucia', '/gta-6/map', '/database/vehicles/compare', '/database/builds/new', '/news', '/forums', '/forums/gta-vi-speculation/map-leak-megathread', '/signin', '/signup', '/changes', '/forgot-password'];

for (const path of PAGES) {
  test(`${path} has no accessibility violations`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(violations.map(v => `${v.id}: ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | ')}`)).toEqual([]);
  });
}

test('the page can be used from the keyboard', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard flow is a desktop concern');
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
});
