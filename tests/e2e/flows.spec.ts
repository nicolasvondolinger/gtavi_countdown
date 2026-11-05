import { expect, test } from '@playwright/test';
import { makeReviewer, signUp } from './helpers';

test('search from the header reaches an article in another game', async ({ page, isMobile }) => {
  await page.goto(isMobile ? '/search' : '/');
  await page.getByRole('combobox', { name: 'Search the wiki' }).first().fill('micheal');
  await page.getByRole('option', { name: /Michael De Santa/ }).click();
  await expect(page).toHaveURL(/\/gta-5\/characters\/michael-de-santa$/);
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('GTA V');
});

test('an edit waits for review and a reviewer can vote on it', async ({ browser, page }, info) => {
  await signUp(page, info, '/gta-5/guides/cheat-codes/edit');
  await page.getByLabel('Page text (Markdown)').fill(`Cheat codes for Grand Theft Auto V. ${Date.now()}`);
  await page.getByLabel('What did you change?').fill('Rewrite the intro');
  await page.getByRole('radio', { name: /Community source/ }).check();
  await page.getByLabel('Source', { exact: true }).fill('A forum thread');
  await page.getByRole('button', { name: 'Send for review' }).click();
  await expect(page.getByRole('heading', { name: 'Revision history' })).toBeVisible();
  await expect(page.getByText('You can’t review your own edit.')).toBeVisible();
  await page.goto('/gta-5/guides/cheat-codes');
  await expect(page.getByText('Rewrite the intro')).toHaveCount(0);

  const context = await browser.newContext({ viewport: page.viewportSize() });
  const reviewerPage = await context.newPage();
  const reviewer = await signUp(reviewerPage, info);
  await makeReviewer(reviewer);
  await reviewerPage.goto('/gta-5/guides/cheat-codes/history?filter=pending');
  await reviewerPage.getByRole('button', { name: 'Keep' }).click();
  await expect(reviewerPage.getByText(/of 5/)).toBeVisible();
  await context.close();
});

test('a signed-out vote goes to sign in and comes back', async ({ page }) => {
  await page.goto('/gta-6/characters/lucia');
  await page.getByRole('button', { name: 'Vote up' }).first().click();
  await expect(page).toHaveURL(/\/signin\?next=/);
});

test('post a thread, reply and hide a spoiler', async ({ page }, info) => {
  await signUp(page, info, '/forums/general/new');
  const title = `An end to end thread ${Date.now()}`;
  await page.getByLabel('Title').fill(title);
  await page.getByLabel('Post').fill('Some detail about this thread.');
  await page.getByRole('button', { name: 'Post thread' }).click();
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
  await page.getByLabel('Your reply').fill('A hidden reply');
  await page.getByLabel('Spoiler').check();
  await page.getByRole('button', { name: 'Reply' }).click();
  await expect(page.getByText('Spoiler: show this reply')).toBeVisible();
});

test('spoiler images stay hidden until revealed', async ({ page }) => {
  await page.goto('/forums');
  await expect(page.getByRole('button', { name: /Spoiler/ }).first()).toBeVisible();
  await page.getByRole('button', { name: /Spoiler/ }).first().click();
  await expect(page.getByRole('button', { name: /Spoiler/ })).toHaveCount(0);
});

test('compare vehicles across games and share the link', async ({ page }) => {
  await page.goto('/database/vehicles/compare');
  await page.getByLabel('Add a vehicle').selectOption({ label: 'Pegassi Zentorno (GTA V)' });
  await expect(page).toHaveURL(/gta-5\.zentorno/);
  await expect(page.getByText('Pegassi Zentorno', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Remove Pegassi Zentorno' }).click();
  await expect(page).not.toHaveURL(/zentorno/);
});

test('save a build and open its share link', async ({ page }, info) => {
  await signUp(page, info, '/database/builds/new');
  await page.getByRole('radio', { name: /EMS upgrade, level 3/ }).check();
  await expect(page.getByText('GTA$ 18,000')).toBeVisible();
  await page.getByRole('button', { name: 'Save build' }).click();
  await expect(page).toHaveURL(/\/b\/[0-9a-f]{8}$/);
  await expect(page.getByText('EMS upgrade, level 3')).toBeVisible();
});

test('the mobile menu shows only the main links', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.getByRole('navigation', { name: 'Menu' });
  for (const name of ['Explore Wiki', 'Database', 'Forums', 'News', 'Map']) await expect(menu.getByRole('link', { name })).toBeVisible();
});

test('there is no game switcher anywhere', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /switch game/i })).toHaveCount(0);
  await expect(page.getByRole('combobox', { name: /game/i })).toHaveCount(0);
});
