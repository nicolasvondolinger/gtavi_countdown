import { config } from 'dotenv';
import type { Page, TestInfo } from '@playwright/test';
import postgres from 'postgres';

config();

export async function signUp(page: Page, info: TestInfo, next = '/') {
  const id = `e2e${info.project.name[0]}${Date.now().toString(36)}${Math.floor(Math.random() * 99)}`;
  await page.goto(`/signup?next=${encodeURIComponent(next)}`);
  await page.getByLabel('Email', { exact: true }).fill(`${id}@example.invalid`);
  await page.getByLabel('Username').fill(id);
  await page.getByLabel('Password').fill('correct-horse-battery');
  await page.getByLabel(/I agree/).check();
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForURL(url => !url.pathname.startsWith('/onboarding'));
  return id;
}

export async function makeReviewer(username: string) {
  const sql = postgres(process.env.DATABASE_URL!, { max: 1 });
  await sql`update profiles set rep = 1000 where username = ${username}`;
  await sql.end();
}
