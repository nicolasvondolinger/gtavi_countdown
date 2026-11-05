import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { setRole, signUp } from './helpers';

test('forgot password: the emailed link sets a new password', async ({ page, baseURL }, info) => {
  const id = await signUp(page, info);
  await page.context().clearCookies();
  await page.goto('/signin');
  await page.getByRole('link', { name: 'Forgot password?' }).click();
  await expect(page.getByRole('heading', { name: 'Reset your password' })).toBeVisible();
  await page.getByLabel('Email').fill(`${id}@example.invalid`);
  await page.getByRole('button', { name: 'Send reset link' }).click();
  await expect(page.getByRole('status')).toContainText('reset link');

  const mail = readFileSync('.outbox/emails.jsonl', 'utf8').trim().split('\n').map(l => JSON.parse(l) as { to: string; text: string }).findLast(m => m.to === `${id}@example.invalid` && m.text.includes('reset-password'));
  const link = new URL(mail!.text.match(/https?:\S+/)![0]);
  // The link redirects through BETTER_AUTH_URL, which is another port here, so go straight to where it lands.
  await page.goto(`${baseURL}/reset-password?token=${link.pathname.split('/').pop()}`);
  await page.getByLabel('New password').fill('a-brand-new-password');
  await page.getByRole('button', { name: 'Set new password' }).click();
  await expect(page).toHaveURL(/\/signin/);
  await page.getByLabel('Email').fill(`${id}@example.invalid`);
  await page.getByLabel('Password').fill('a-brand-new-password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL(url => url.pathname !== '/signin');
});

test('a moderator handles a report, publishes news and sets a role', async ({ browser, page }, info) => {
  const moderator = await signUp(page, info);
  await setRole(moderator, 'moderator');

  const context = await browser.newContext({ viewport: page.viewportSize() });
  const member = await context.newPage();
  await signUp(member, info, '/gta-5/lore/merryweather');
  const text = `Please remove this ${Date.now()}`;
  await member.getByLabel('Add to the talk page').fill(text);
  await member.getByRole('button', { name: 'Post' }).click();
  await expect(member.getByText(text)).toBeVisible();
  await member.getByRole('button', { name: 'Report' }).last().click();
  await expect(member.getByText('Reported')).toBeVisible();
  await context.close();

  await page.goto('/moderation');
  const row = page.getByRole('article').filter({ hasText: text });
  await row.getByRole('button', { name: 'Remove' }).click();
  await expect(page.getByText(text)).toHaveCount(0);

  await page.goto('/news');
  await page.getByRole('link', { name: 'New story' }).click();
  const title = `A published story ${Date.now()}`;
  await page.getByLabel('Title', { exact: true }).fill(title);
  await page.getByLabel('Summary', { exact: true }).fill('A short summary of it');
  await page.getByLabel('Story', { exact: true }).fill('The full text of the story.');
  await page.getByLabel('Verification').selectOption('official');
  await page.getByLabel('Source').fill('Rockstar Games');
  await page.getByRole('button', { name: 'Publish story' }).click();
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
});

test('members cannot open the moderation page', async ({ page }, info) => {
  await signUp(page, info);
  await page.goto('/moderation');
  await expect(page).toHaveURL(/\/$/);
});

test('reviewers find pending edits from recent changes', async ({ page }) => {
  await page.goto('/changes?filter=pending');
  await expect(page.getByRole('heading', { level: 1, name: 'Waiting for review' })).toBeVisible();
  await expect(page.getByText('Lucia Caminos').first()).toBeVisible();
});

test('a game hub links to its forum talk', async ({ page }) => {
  await page.goto('/gta-6');
  await expect(page.getByRole('heading', { name: 'GTA VI in the forums' })).toBeVisible();
});

test('the bell shows for signed-in members', async ({ page }, info) => {
  await signUp(page, info);
  await page.goto('/notifications');
  await expect(page.getByRole('heading', { level: 1, name: 'Notifications' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Notifications' }).first()).toBeVisible();
});
