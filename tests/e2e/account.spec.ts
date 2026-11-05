import { expect, test } from '@playwright/test';

test('sign up, onboard, and arrive back where you started', async ({ page }, info) => {
  const id = `e2e${info.project.name.slice(0, 1)}${Date.now().toString(36)}`;
  await page.goto('/signup?next=/gta-5');
  await page.getByLabel('Email', { exact: true }).fill(`${id}@example.invalid`);
  await page.getByLabel('Username').fill(id);
  await page.getByLabel('Password').fill('correct-horse-battery');
  await page.getByLabel(/I agree/).check();
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByRole('heading', { name: 'Pick how people see you' })).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page).toHaveURL(/\/gta-5$/);
  await page.goto(`/u/${id}`);
  await expect(page.getByRole('heading', { level: 1, name: id })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
});

test('a wrong password shows an error', async ({ page }) => {
  await page.goto('/signin');
  await page.getByLabel('Email').fill('nobody@example.invalid');
  await page.getByLabel('Password').fill('wrong-password-here');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('That email and password don’t match.')).toBeVisible();
});
